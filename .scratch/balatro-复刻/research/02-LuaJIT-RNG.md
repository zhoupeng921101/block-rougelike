# LuaJIT RNG 复刻口径（Balatro 1.0.1o → JS/TS）

Ticket: `issues/02-LuaJIT-RNG-复刻口径.md`
Map: `map.md`
日期: 2026-09-20

---

## 结论

**可行，且已用外部真值验证通过（16/16）。**
整条随机数链路（`pseudohash` → `pseudoseed` → `math.randomseed` → `math.random`）
在 JS/TS 里可以做到**逐位一致**，没有需要近似的环节。

本次不止做了文献调研，还在本地写了完整实现并对拍：

| 验证层 | 向量数 | 结果 | 出处 |
|---|---|---|---|
| TW223 状态（`randomseed(0.0)` 后的 4 个 64 位字） | 4 | 全对 | LuaJIT 官方 `lj_prng.h` 的 `lj_prng_seed_fixed` |
| TW223 输出（4 个种子的首个 `math.random()`） | 4 | 全对 | balatro4j `LuaRandom.test.js` |
| 完整链路 → Ante 1 Boss Blind | 12 | 全对 | balatrowiki + balatrohq + Blueprint fixture + balatro4j |

其中最硬的两条：

1. 本地实现算出的 `randomseed(0.0)` 状态
   `a0d277570a345b8c / 764a296c5d4aa64f / 51220704070adeaa / 2a2717b5a7b7b927`
   与 LuaJIT 官方预计算常量逐位一致，**且这四个常量原样出现在 Balatro 自带的
   `liblove.so` 里**（偏移 1156768 / 1156776 / 1159408 / 1159416）——
   即「我复刻的算法」与「这个游戏实际链接的那份 LuaJIT」是同一份代码。
2. 端到端 12 个种子的 Ante 1 Boss 全部命中，覆盖 6 种不同结果，
   真值来自 3 个互不相干的来源。详见 §9。

三个支撑点：

1. **发生器是 LuaJIT 的 TW223 Tausworthe，不是 LÖVE 的。**
   LÖVE 从未替换全局 `math.random`，本地 Balatro 自带的 `liblove.so` 里也查不到任何替换。
2. **每次 gameplay 抽随机数之前都会重新播种。**
   LuaJIT 的内部状态历史**不影响**结果——每次抽取是纯函数 `seed(double) → 值`。
3. **所有算术都是 IEEE754 double 上的基本运算**（`+ - * /`、`% 1`、`floor`、位模式重解释），
   JS 的 `Number` 与之同构。唯一需要小心实现的是 `string.format("%.13f")`——
   LuaJIT 2.1 自带实现、**不走 libc**、固定 round-half-to-even，因此跨平台一致，
   JS 侧用 BigInt 精确展开即可 1:1 对齐（见 §4）。

**代价**：需要 `BigInt` 做 64 位状态推进（JS 没有原生 u64）。
本地 BigInt 版实测「播种 + 抽一次」约 **4.4 µs**（20 万次 872 ms）。
一局 Balatro 的随机调用量是几千次量级，这个开销可以忽略；
真到了热路径（比如做种子搜索）再用 `Uint32Array` 手写 64 位替换掉。

**边界**：本结论只覆盖**算法的逐位一致性**，不覆盖**消费顺序**。见 §7。

---

## 1. 发生器是谁：LuaJIT，不是 LÖVE

### 1.1 本地源码

`源码/` 34 个 Lua 文件里：

- `grep -rn "love\.math"` → **0 处命中**。游戏从不调用 `love.math`。
- `grep -rn "math\.random"` → 只在 `functions/misc_functions.lua` 与 `main.lua:33` 命中，
  没有任何 `math.random = ...` 形式的覆写。
- `main.lua:1`：`if (jit.arch == 'arm64' or jit.arch == 'arm') then jit.off() end`
  —— 运行时确实是 LuaJIT。

### 1.2 本地二进制（最硬的一条）

`参考/产物/Balatro_1.0.1o/原生库/arm64-v8a/liblove.so`（8.5 MB，游戏实际链接的 LÖVE）
里提取字符串并全量搜索：

- `"Mysterious Mysteries"` → LÖVE 11.x 的代号。
- `"LuaJIT 2.1.1700008891"` → LuaJIT 2.1 rolling（2023-11 的构建）。
- 全部 6 处 `math.random` 字面量分别属于：nogame 演示脚本（3 处）、
  `wrap_Math.lua` 里的 `love_math.random` / `love_math.randomNormal` 定义、luasocket 的 smtp.lua。
  **没有一处是赋值。**
- `math.randomseed` 字面量 → **0 处**。`= love.math` / `love.math =` → **0 处**。
- 嵌入的 `wrap_Math.lua` 原文挂的全是 `love_math.*`：
  ```lua
  local rng = love_math._getRandomGenerator()
  function love_math.random(l, u) return rng:random(l, u) end
  function love_math.setRandomSeed(low, high) return rng:setSeed(low, high) end
  ```
- 常量搜索：`3.141592653589793` 的位模式 `182d4454fb210940` 出现 2 次，
  `2.718281828459045` 的位模式 `6957148b0abf0540` 出现 **1 次**。
  Lua/LuaJIT 标准库里除了 `random_seed()` 的 `d*π + e` 之外没有别处用 e，
  这条佐证 LuaJIT 的 `random_seed` 确实编进了这个二进制。

### 1.3 上游源码

LÖVE 11.5 全仓 grep 无 `math.random =` / `math.randomseed =`；
对全局 `math` 表唯一的改动是 `love.cpp` 里补一个 `fmod → mod` 的旧名别名。
0.9.2 / 0.10.2 的 `boot.lua` 里那两行只是给 `love.math` 自己的发生器播种，不是替换。

> 来源：[love 11.5 wrap_Math.lua](https://github.com/love2d/love/blob/11.5/src/modules/math/wrap_Math.lua)、
> [love 11.5 boot.lua](https://raw.githubusercontent.com/love2d/love/11.5/src/modules/love/boot.lua)、
> [love 0.9.2 boot.lua](https://raw.githubusercontent.com/love2d/love/0.9.2/src/scripts/boot.lua)

### 1.4 反证：如果走 LÖVE 的发生器，游戏会坏掉

`love/11.5/src/modules/math/wrap_RandomGenerator.cpp` 的种子转换：

```cpp
double num = luaL_checknumber(L, idx);
...
return (T) num;          // double → uint64 强转，向零截断
```

而 Balatro 的 `pseudoseed()` 返回的是 **(0,1) 区间的小数**
（`源码/functions/misc_functions.lua:315`：`return (G.GAME.pseudorandom[key] + hashed_seed)/2`）。
若走 LÖVE 的发生器，所有 key、所有牌局都会截断成 `seed = 0`，游戏里每次抽卡结果全一样。
显然不是这样。

反过来 LuaJIT 是把 double 的**位模式**铺进状态，小数种子完全有意义——
Balatro 的设计正是冲着 LuaJIT 这一点来的。

### 1.5 社区实证

Balatro 种子搜索的事实标准 [Immolate](https://github.com/MathIsFun0/Immolate)
（Ouija / Balatro4J / TheSoul 都基于它）的 `lib/util.cl` 是 LuaJIT `random_seed()` 的**逐字节移植**：
同样的魔数 `0x11090601`、同样的 `d*π+e`、同样的 union 取位、同样的预热 10 次，
结构体干脆叫 `LuaRandom`。**没有一行 xorshift64\*，没有 wangHash64。**

> 另见 [Randomness in Balatro — Rennsax](https://rennsax.com/posts/balatro-pseudorandom/)：
> "LuaJIT uses a Tausworthe PRNG with period 2^223 to implement `math.random()` and `math.randomseed()`"

---

## 2. 要复刻的算法：LuaJIT TW223

来源：[LuaJIT v2.1 `src/lib_math.c`](https://github.com/LuaJIT/LuaJIT/blob/v2.1/src/lib_math.c)，
交叉核对 [Immolate `lib/util.cl`](https://github.com/MathIsFun0/Immolate/blob/main/lib/util.cl)。

### 2.1 状态与步进

4 个 u64 分量，参数 `(k, q, s)`：

| i | k | q | s | k−s | 高位掩码 |
|---|---|---|---|-----|---------|
| 0 | 63 | 31 | 18 | 45 | 高 63 位 |
| 1 | 58 | 19 | 28 | 30 | 高 58 位 |
| 2 | 55 | 24 | 7  | 48 | 高 55 位 |
| 3 | 47 | 21 | 8  | 39 | 高 47 位 |

每步（所有运算在 u64 上，左移要截回 64 位）：

```
z  = state[i]
z' = ( ((z << q) ^ z) >> (k-s) ) ^ ( (z & topKmask) << s )
r ^= z' ; state[i] = z'
```

四个分量的 `z'` 异或起来就是本次的 64 位输出 `r`。

### 2.2 播种（`math.randomseed(double d)`）

```c
static void random_seed(PRNGState *rs, double d)
{
  uint32_t r = 0x11090601;  /* 64-k[i] as four 8 bit constants. */
  for (i = 0; i < 4; i++) {
    U64double u;
    uint32_t m = 1u << (r&255);
    r >>= 8;
    u.d = d = d * 3.14159265358979323846 + 2.7182818284590452354;
    if (u.u64 < m) u.u64 += m;   /* 保证高 k 位非零 */
    rs->u[i] = u.u64;
  }
  for (i = 0; i < 10; i++) (void)lj_prng_u64(rs);   /* 丢弃前 10 次 */
}
```

`0x11090601` 拆成 4 个字节是 `01 06 09 11` = 1, 6, 9, 17 = `64-63, 64-58, 64-55, 64-47`，
故 `m = 2, 64, 512, 131072`。

两个易错点：

- `d` 是**链式**更新的：第 i 轮用的是上一轮的结果，不是原始种子。
- `if (u.u64 < m)` 比较的是**整个 64 位**位模式，不是高 32 位。
  （网上有第三方移植写成 `u.u32.hi < m`，那是错的。LuaJIT 从 2009 年 beta1 起就是 `u.u64`。）

**版本差异：无。** 2020-06 的 commit `a44f53a` 把 PRNG 从 `lib_math.c` 搬到 `lj_prng.c`
（`random_init`→`random_seed`、`RandomState`→`PRNGState`、`lj_math_random_step`→`lj_prng_u64`），
但四组 `(k,q,s)`、`0x11090601`、`d*π+e` 递推、10 步预热、52 位提取、取整公式
**从 2.0.0-beta1 到今天一个字都没改过**。所以不用纠结 Balatro 具体链的哪个 2.1 快照。

**与 PUC-Rio Lua 5.1 完全不同**：后者是 `rand()/srand()`，平台相关
（MSVC `RAND_MAX=32767`，glibc `2^31-1`）。取整公式碰巧同为 `floor(r*u)+1`，底层流毫无关系。
LuaJIT 官方文档原话：
> "LuaJIT uses a Tausworthe PRNG with period 2^223 to implement math.random() and math.randomseed().
> … The PRNG generates the same sequences from the same seeds on all platforms and makes use of all
> bits in the seed argument. math.random() without arguments generates 52 pseudo-random bits for every call."
> —— [luajit.org/extensions.html](https://luajit.org/extensions.html)

（"on all platforms" 这句对我们很关键：它是 LuaJIT 对**跨平台一致性**的明确承诺，
所以 RNG 这一层没有任何平台风险。`%.13f` 那一层的平台问题也在 §4.1 查清并排除了。）

### 2.3 取值

```
u64 r = step()
double d = bits_to_double( (r & 0x000FFFFFFFFFFFFF) | 0x3FF0000000000000 ) - 1.0   // [0,1)
math.random()        -> d
math.random(m)       -> floor(d * m) + 1.0
math.random(m, n)    -> floor(d * (n - m + 1.0)) + m
```

即把输出的低 52 位当尾数、指数固定为 0 拼出 `[1.0, 2.0)` 的 double 再减 1 —— 恰好 52 位随机。

两个坑：

- `m` / `n` 是**按 double 参与运算**的，`n - m + 1.0` 是浮点加减，不是整数运算。
- LuaJIT **没有 argcheck**（PUC Lua 5.1 有 `interval is empty` 报错）。
  `math.random(0)` 在 LuaJIT 返回 1 而不报错。翻译时不要自作主张加校验，
  否则空池场景下行为会分叉。

### 2.4 逐位验证（已通过）

LuaJIT 在 [`src/lj_prng.h`](https://raw.githubusercontent.com/LuaJIT/LuaJIT/v2.1/src/lj_prng.h)
里留了一个现成的测试向量：

```c
/* This is just the precomputed result of lib_math.c:random_seed(rs, 0.0). */
static LJ_AINLINE void lj_prng_seed_fixed(PRNGState *rs)
{
  rs->u[0] = U64x(a0d27757,0a345b8c);
  rs->u[1] = U64x(764a296c,5d4aa64f);
  rs->u[2] = U64x(51220704,070adeaa);
  rs->u[3] = U64x(2a2717b5,a7b7b927);
}
```

本地 `luajit_rng.mjs`（BigInt 版，约 30 行）跑 `randomseed(0.0)`：

```
u[0] = 0xa0d277570a345b8c  expected 0xa0d277570a345b8c  OK
u[1] = 0x764a296c5d4aa64f  expected 0x764a296c5d4aa64f  OK
u[2] = 0x51220704070adeaa  expected 0x51220704070adeaa  OK
u[3] = 0x2a2717b5a7b7b927  expected 0x2a2717b5a7b7b927  OK
```

后续取值：`randomseed(0)` 后前 5 次 `math.random()` =
`0.794206292431241, 0.698852465637164, 0.5901037417281034, 0.7532286166836022, 0.08097125119985438`；
`math.random(1,100)` = `80, 70, 60, 76, 9`。
（另一个独立写的实现给出完全相同的数，两次独立实现互相印证。）

**并且这四个常量原样存在于本地的 `liblove.so`**：
`a0d277570a345b8c`@1159408、`764a296c5d4aa64f`@1159416、
`51220704070adeaa`@1156768、`2a2717b5a7b7b927`@1156776
（两对相邻，编译器拆成两条 `ldp`）。
这同时确认了游戏链接的是 **2020-06 之后的 LuaJIT 2.1 分支**（有 `lj_prng` 拆分），
与 `liblove.so` 里的版本串 `LuaJIT 2.1.1700008891` 吻合。

---

## 3. 浮点哈希层（`pseudohash` / `pseudoseed`）

`源码/functions/misc_functions.lua:282`、`:301`：

```lua
function pseudohash(str)
  local num = 1
  for i=#str, 1, -1 do
      num = ((1.1239285023/num)*string.byte(str, i)*math.pi + math.pi*i)%1
  end
  return num
end

function pseudoseed(key, predict_seed)
  if key == 'seed' then return math.random() end
  if predict_seed then
    local _pseed = pseudohash(key..(predict_seed or ''))
    _pseed = math.abs(tonumber(string.format("%.13f", (2.134453429141+_pseed*1.72431234)%1)))
    return (_pseed + (pseudohash(predict_seed) or 0))/2
  end
  if not G.GAME.pseudorandom[key] then
    G.GAME.pseudorandom[key] = pseudohash(key..(G.GAME.pseudorandom.seed or ''))
  end
  G.GAME.pseudorandom[key] = math.abs(tonumber(string.format("%.13f",
      (2.134453429141+G.GAME.pseudorandom[key]*1.72431234)%1)))
  return (G.GAME.pseudorandom[key] + (G.GAME.pseudorandom.hashed_seed or 0))/2
end
```

两个坑：

1. **`% 1` 不能直译成 JS 的 `%`。**
   Lua 的 `a % b` 定义为 `a - floor(a/b)*b`，结果与除数同号；
   JS 的 `%` 是截断取余，对负数结果不同。这里 `a` 恒正所以数值上巧合相同，
   但翻译时必须写成 `a - Math.floor(a)`，不能写 `a % 1`，否则以后改动会埋雷。
   （对 `b = 1`、`a < 2^52`，`a - floor(a)` 是**精确**的，无额外误差。）
2. **`string.format("%.13f")` 见 §4。**

`pseudohash` 的 `string.byte` 是**字节**不是字符。key 与 seed 全是 ASCII，
JS 用 `charCodeAt` 等价；但如果将来出现非 ASCII key，必须走 UTF-8 字节。

---

## 4. `string.format("%.13f")` vs JS `toFixed(13)`

### 4.1 关键事实：LuaJIT 2.1 的 `%f` 不走 libc

这条推翻了一个自然的预设（「Lua 的 `%f` 就是 C 的 `sprintf`，所以随 libc 变」）：

| 运行时 | `string.format("%.13f")` 走哪条路 | 平局规则 |
|---|---|---|
| PUC Lua 5.1–5.4 | C 的 `sprintf`，随 libc | 随平台 |
| LuaJIT **2.0** | C 的 `sprintf`，随 libc | 随平台 |
| **LuaJIT 2.1** | **自带 `lj_strfmt_num.c`，完全不碰 libc** | **固定 round-half-to-even** |

LuaJIT 2.1 用 base-10^9 大整数做精确十进制展开，`nd_round()` 的注释原文就是
*"Round to even with given precision."*，且 `%.13f` 这种带精度的定点格式**完全走这条路，没有回退到 libc 的分支**。

> 来源：[LuaJIT v2.1 `src/lj_strfmt_num.c`](https://github.com/LuaJIT/LuaJIT/blob/v2.1/src/lj_strfmt_num.c)

Balatro 链的是 LuaJIT 2.1（§2.4 已证），**所以：**

1. **平台风险消失。** Windows / Android / Linux 版的 Balatro 在这一步行为完全一致，
   不需要区分对拍基准来自哪个平台（这条曾是本报告的一个待办，现已关闭）。
2. **目标口径确定为 round-half-to-even。**
   JS 的 `toFixed` 是 **round-half-away-from-zero**（ECMA-262：
   「Let *n* be an integer for which *n* / 10^*f* - *x* is as close to zero as possible.
   **If there are two such *n*, pick the larger *n*.**」），语义上**不是**同一个。

### 4.2 实测：随机取值下两者没有差异

本地写了 BigInt 精确十进制展开（把 double 拆成 `m·2^e`，精确算到 13 位后按 half-even 舍入），
对 `x ∈ [0,1)` 做 200 万次随机对拍：

```
toFixed(13) != 精确 %.13f(half-even) : 0
half-away   != 精确 %.13f(half-even) : 0
```

### 4.2.1 分歧集可以精确刻画

设 `x = M / 2^K`（最简，M 奇）。13 位上出现精确平局 ⟺ `2·10^13·x` 是奇整数
⟺ `M · 5^13 · 2^(14-K)` 是奇整数 ⟺ **`K = 14`**。

所以 `[0,1)` 里的平局 double **恰好是 `m/16384`（m 为奇数，1..16383），共 8192 个**；
其中第 13 位为偶数的 **4096 个**会让 half-even 与 half-away 分叉。已构造验证：

```
0.00006103515625  half-even(Lua) 0.0000610351562   toFixed(JS) 0.0000610351563
0.00030517578125  half-even(Lua) 0.0003051757812   toFixed(JS) 0.0003051757813
```

这不是"概率极小的随机事件"，而是"要么一个都不出现，要么成批出现"——
凡是代码里有 `n/16384`、`n/2^14`、位移、定点数换算，就会成片命中。

**本用例的输入是什么？** `frac(2.134453429141 + state*1.72431234)`——
两个非二进位友好常数的乘加取小数部分，结构上不会落到 `2^-14` 网格上。
所以实践中安全，**但这是"输入恰好避开"，不是"两个算法等价"**。

### 4.3 口径建议（已更新）

**目标是 round-half-to-even。** 两条路：

- **正解**：BigInt 精确展开 + half-even（约 15 行，已在 scratch 跑通并与 Python `'%.13f'` 零分歧）。
  推荐直接用这个，它是**定义上正确**的，不依赖"输入恰好避开"的运气。
- **快路径**：`Number(x.toFixed(13))`。200 万次随机取值实测与精确解 **0 分歧**。
  想要性能可以用它，但要加一个 **O(1) 的精确判别**兜底：
  ```js
  const y = x * 16384;
  if (Number.isInteger(y) && (y % 2 === 1)) { /* 走 BigInt 慢路径 */ }
  ```

**两个明确的"不要"：**

- **不要用 `Math.round(x*1e13)/1e13`。** Immolate 的
  `roundDigits(f,d) = round(f*pow(10,d))/pow(10,d)` 就是这个写法，
  本地实测与精确 `%.13f` 的偏差率 **0.042%**（100 万样本 417 次不符），
  例如 `x = 0.63906384198805` → Immolate 得 `0.6390638419881`，正解 `0.639063841988`。
  这是 Immolate 自身的已知近似，别照抄。
- **不要用 decimal.js / big.js 的默认构造。** 它们从 JS number 构造时取的是
  `toString()` 的**最短往返串**而不是 double 的精确值，会产生双重舍入，
  给出既不等于 Lua 也不等于 JS 的第三种答案
  （反例：`x = 0.63588990769095`，`x.toFixed(13)` = `0.6358899076909` 正确，
  `new Decimal(x).toFixed(13, ROUND_HALF_EVEN)` = `0.6358899076910` 错）。

### 4.4 自检方法

在任何声称是 Balatro 1.0.1o 的 Lua 环境里跑一句就能确认口径：

```lua
print(string.format("%.13f", 1/16384))
```

- 输出 `0.0000610351562` → half-to-even（LuaJIT 2.1 / glibc / musl / macOS），**这是我们要对齐的**。
- 输出 `0.0000610351563` → half-away（UCRT / JS toFixed），说明跑的不是 LuaJIT 2.1，口径要重判。

---

## 5. 另一个未排除的风险：FMA 收缩

`random_seed()` 里的 `d = d * π + e` 是一条乘加。
如果编译器把它收缩成硬件 FMA（`fmadd`），结果的最低位会变。
GCC 默认 `-ffp-contract=fast`，Clang 14+ 在 C 模式下默认 `-ffp-contract=on`——ARM64 上都可能收缩。

本地量化：对随机 `d`，`d*π+e` 与精确 `fma(d,π,e)` 的位模式不同率 **18.47%**。
`random_seed` 里链式做 4 次，整体状态不同的概率约 55%。所以这是个真二元分叉，不是噪声。

**结论是「不收缩」，有三条独立证据**：

1. **LuaJIT 自己的测试向量。** `lj_prng_seed_fixed`（§2.4）是 `random_seed(rs, 0.0)` 的预计算值。
   第 1 轮 `0*π+e = e` 两种算法都精确相等，但第 2 轮 `e*π+e` 会分叉。
   本地按**不收缩**算出的四个字与官方常量完全一致 → 官方基准就是不收缩版。
2. **Immolate 的注释。** 作者把 `d = d*π + e` 拆成两条语句，注释写
   *"Doing these two operations separately fixes the code for some reason... Probably another roundoff issue..."*
   —— 他撞上过这个坑并绕开了，而 Immolate 的输出被社区大规模验证与实机一致。
3. **JS 天然没有 FMA**：`d * Math.PI + 2.718281828459045` 必定两次独立舍入，写对就是对的。

**残留风险**：以上证明的是「LuaJIT 官方基准 + Immolate 对标的桌面版」是不收缩的。
本地拿到的是 **Android arm64** 构建，理论上它的编译选项可能不同。
如果将来对拍发现整条链对不上，第一个要试的备选就是 FMA 版
（JS 可用 Dekker 二乘积或 BigInt 精确 FMA 模拟）。但这个概率很低。

---

## 6. `pairs()` 顺序问题（票里的第 4 问）

**结论：gameplay 结果不依赖 `pairs` 顺序。** 逐条：

### 6.1 `pseudorandom_element`（`misc_functions.lua:256`）

```lua
for k, v in pairs(_t) do keys[#keys+1] = {k = k, v = v} end
if keys[1] and keys[1].v and type(keys[1].v) == 'table' and keys[1].v.sort_id then
  table.sort(keys, function (a, b) return a.v.sort_id < b.v.sort_id end)
else
  table.sort(keys, function (a, b) return a.k < b.k end)
end
local key = keys[math.random(#keys)].k
```

`pairs` 顺序确实未定义，但紧接着的 `table.sort` 把它洗掉了：

- **`a.k < b.k` 分支**：table 的 key 天然互不相同 → 排序结果唯一，与输入顺序无关。
- **`sort_id` 分支**：`sort_id` 是 `card.lua:24` 的全局自增计数器，每张 Card 唯一 → 同理唯一。
- **分支选择本身**依赖 `keys[1]`（即 `pairs` 的第一项）。只有在 `_t` 内部**混装**
  「有 sort_id 的 table」和「没有的」时才会不稳定。实际调用点全是同质的
  （Card 数组、字符串数组、`G.P_CARDS` 这种 proto 表、`eligible_bosses` 这种 key→数字表），
  不构成风险。

补充：LuaJIT 的字符串比较是**逐字节无符号比较**（不是 PUC Lua 的 `strcoll`），
所有 key 都是 ASCII，JS 的 `<` 逐 UTF-16 码元比较与之等价。

### 6.2 初始牌组构建（`game.lua:2557`）

```lua
for k, v in pairs(self.P_CARDS) do ... card_protos[#card_protos+1] = {s=_s,r=_r,...} end
...
table.sort(card_protos, function (a, b) return
    ((a.s or '')..(a.r or '')..(a.e or '')..(a.d or '')..(a.g or '')) <
    ((b.s or '')..(b.r or '')..(b.e or '')..(b.d or '')..(b.g or '')) end)
for k, v in ipairs(card_protos) do card_from_control(v) end
```

`pairs` 顺序同样被 `table.sort` 洗掉。标准牌组 52 个 proto 的排序键互不相同 → 唯一。
Erratic Deck 会产生重复 proto，`table.sort` 不稳定 → 并列项的相对顺序不定，
但**并列项内容完全相同**，交换它们得到同一副牌，只影响 `sort_id` 的分配，对 gameplay 无影响。

**所以 `sort_id` 在 JS 侧只要按同一顺序（排序后的 `card_protos` 顺序）自增分配即可。**

### 6.3 `pseudoshuffle`（`misc_functions.lua:209`）

```lua
if list[1] and list[1].sort_id then
  table.sort(list, function (a, b) return (a.sort_id or 1) < (b.sort_id or 2) end)
end
for i = #list, 2, -1 do local j = math.random(i); list[i], list[j] = list[j], list[i] end
```

倒序 Fisher–Yates，每步一次 `math.random(i)`。种子在函数开头播一次，
**之后连抽 `#list-1` 次，中间不重播** —— 这是链路里唯一需要「多次连抽」的地方，
JS 侧必须保留 RNG 状态对象，不能每次重新播种。

注意那个比较函数：若两个元素都没有 `sort_id`，`a<b` 与 `b<a` 都返回 true（`1 < 2`），
这是个非法的序关系，Lua 可能报 "invalid order function for sorting"。
实际所有 Card 都有 `sort_id`，不触发；JS 侧直接按 `sort_id` 升序排即可。

---

## 7. 边界声明（重要）

**本票的结论只覆盖「RNG 算法的逐位一致性」，不覆盖「RNG 的消费顺序」。**

「同 seed 同局」 = 本票（算法对） **+** 09 号票《事件队列调度语义的复刻口径》（顺序对）。
两者都成立才算数。缺一条，即使 RNG 逐位正确，牌局也会分叉。

### 7.1 LuaJIT 的 RNG 状态是全局单例——但影响面比预想的小

是的，LuaJIT 的 `RandomState` 是**全局单例**，不是每个 key 一条独立流。
但本地实测下来，这件事对 gameplay **基本无害**，原因是每次消费前都会重新播种：

`grep -rn "math\.random" 源码/` 的完整结果：所有裸用都在 `misc_functions.lua` 内，
外部代码一律走这 4 个包装函数：

| 包装函数 | 行号 | 是否先播种 | 连抽次数 |
|---|---|---|---|
| `pseudoshuffle(list, seed)` | 209 | `if seed then` —— 2 个调用点**都传了** seed | `#list-1` |
| `pseudorandom_element(_t, seed)` | 256 | `if seed then` —— 见下 | 1 |
| `random_string(length, seed)` | 273 | `if seed then` —— 唯一调用点传了 seed | `~3×length` |
| `pseudorandom(seed, min, max)` | 318 | **无条件播种** | 1 |

所以：**每次 gameplay 抽取都是纯函数 `seed(double) → 结果`，
LuaJIT 内部状态的历史不进入结果。** 这确实大幅降低复刻难度——
JS 侧不需要维护长寿命的 RNG 状态，只在 `pseudoshuffle` / `random_string` 这类
「播一次连抽多次」的调用内部保留临时状态即可。

**唯一的例外**是 8 个不传 seed 的 `pseudorandom_element` 调用，它们读并推进全局状态：

```
engine/moveable.lua:260        牌抖动的旋转量
engine/particles.lua:92        粒子颜色
functions/button_callbacks.lua:3182   转场用的那张牌
functions/UI_definitions.lua:3991/4346/6153   牌组预览界面的展示牌
game.lua:1536                  标题界面的装饰牌
game.lua:1861                  标题界面的解锁展示
```

全部是**纯表现层**，不进 gameplay 结果。可以放心让 JS 侧用任意 RNG 驱动它们。

旁证：全局状态的初值本来就是不可复现的——`globals.lua:163` 是 `self.SEED = os.time()`，
`main.lua:33` 拿它 `math.randomseed(G.SEED)`。原版自己都不指望这条流可复现，
所以依赖它的一定不是 gameplay。

（另：`pseudoseed(key)` 里 `key == 'seed'` 那条分支返回 `math.random()`，
在 1.0.1o 里没有任何调用点命中，是死代码。）

### 7.2 那么顺序到底在哪里起作用

`pseudoseed(key)` 在 `G.GAME.pseudorandom[key]` 上维护**每个 key 自己的浮点状态**，
每调用一次就推进一步。所以：

- **跨 key 无关**：`pseudoseed('boss')` 的第 k 次调用产生什么值，
  与其间调用了多少次 `pseudoseed('shuffle')` 完全无关。事件队列把不同 key 的调用打乱，**不影响结果**。
- **同 key 内有关**：只要事件队列改变了某个 key 被调用的**次数**或**先后**，
  该 key 之后的所有取值全部错位。

这把 09 号票要保证的东西收窄成一句可检查的话：
**同一个 pseudoseed key 的调用序列必须与原版逐次对齐。**
（协调方提到的 Perkeo `pseudoseed('perkeo')`、Certificate `pseudoseed('cert_fr')`
就属于这一类——它们在事件回调里，回调执行与否/几次，决定了该 key 的推进步数。）

### 7.3 还有一条不归本票管的顺序依赖

`functions/state_events.lua:621`：`table.sort(scoring_hand, function (a, b) return a.T.x < b.T.x end)`
—— 按**屏幕坐标**排序来决定计分顺序。这归 10 号票《坐标驱动排序的解耦》。
它不影响 RNG 取值本身，但影响「第几张牌触发了带 RNG 的效果」。

---

## 8. JS 侧实现要点清单

### 8.0 可以直接参考的现成移植

不必从零写。按「离我们的目标最近」排序：

| 仓库 | 语言 | 价值 |
|---|---|---|
| [miaklwalker/Blueprint](https://github.com/miaklwalker/Blueprint) `src/modules/balatrots/utils/LuaRandom.ts` | **TypeScript** | 最直接可抄。同目录 `DoubleLong.ts` 用 `DataView` 做 double↔u64；另有 `pseudohash()` 与 `round13()` |
| [SpectralPack/TheSoul](https://github.com/SpectralPack/TheSoul) `include/util.hpp` | C++ | 写得最干净，可当对照 |
| [SpectralPack/Immolate](https://github.com/SpectralPack/Immolate) `lib/util.cl` | OpenCL C | 事实标准，社区验证最充分；但 `roundDigits` 是近似（见 §4.3） |
| [geunyoungi/Balatro-Seed-Searcher](https://github.com/geunyoungi/Balatro-Seed-Searcher) `engine/src/v3/lua_random.rs` | Rust | 同目录有 `pseudohash.rs` |
| [jie65535/awesome-balatro](https://github.com/jie65535/awesome-balatro) | — | 工具汇总清单 |

**抄的时候要复核两处**：`if (u < m)` 是不是拿整个 u64 比（有移植写成高 32 位，错的）；
`%.13f` 那一步是不是用 `round(x*1e13)/1e13`（Immolate 系是，有 0.042% 偏差）。

按「必须逐条复刻」列：

### 8.1 TW223 发生器

- [ ] 状态 = 4 个 u64。JS 用 `BigInt`（简单）或 `Uint32Array(8)` 手写 64 位（快）。
- [ ] 步进参数 `(k,q,s)` = `(63,31,18) (58,19,28) (55,24,7) (47,21,8)`，
      高位掩码 = `~0 << (64-k)`。**每次左移后必须截回 64 位**（BigInt 不会自动截）。
- [ ] `randomseed(d)`：
      - `r = 0x11090601`，循环 4 次，`m = 1n << BigInt(r & 255)`，`r >>>= 8`；
      - `d = d * Math.PI + 2.718281828459045`（**链式更新 d**，不要用 FMA）；
      - `u = doubleToBits(d)`；`if (u < m) u += m`（注意是**整个 u64** 比较，不是高 32 位）；
      - 4 个分量填完后，**空转 10 次** `step()`。
- [ ] `random()`：`bitsToDouble((step() & 0x000FFFFFFFFFFFFFn) | 0x3FF0000000000000n) - 1.0`
- [ ] `random(m)` = `Math.floor(d*m) + 1`；`random(m,n)` = `Math.floor(d*(n-m+1)) + m`
- [ ] **不要加参数校验**。LuaJIT 对 `math.random(0)` 不报错（返回 1），
      PUC Lua 才报 `interval is empty`。加了校验会在空池场景分叉。
- [ ] double ↔ u64 位重解释用同一个 `DataView`（`setFloat64` / `getBigUint64`），**大端小端要一致**。
- [ ] 自测：`randomseed(0.0)` 后状态必须等于
      `a0d277570a345b8c / 764a296c5d4aa64f / 51220704070adeaa / 2a2717b5a7b7b927`。
      **把这条写成单元测试**，它是整条链路唯一不依赖实机的硬基准。

### 8.2 浮点哈希层

- [ ] `pseudohash(str)`：从**末字节向前**循环，`num = frac((1.1239285023/num)*byte*Math.PI + Math.PI*i)`，
      `i` 是 1-based 下标，`num` 初值 1。
- [ ] `frac(a)` 写成 `a - Math.floor(a)`，**不要写 `a % 1`**。
- [ ] `pseudoseed(key)`：
      - 每个 key 的状态存在一张表里（对应 `G.GAME.pseudorandom`）；
      - 首次访问：`state[key] = pseudohash(key + seedString)`；
      - 每次调用：`state[key] = Math.abs(fmt13(frac(2.134453429141 + state[key]*1.72431234)))`；
      - 返回 `(state[key] + hashedSeed) / 2`，其中 `hashedSeed = pseudohash(seedString)`。
- [ ] `fmt13(x)` = **BigInt 精确展开 + round-half-to-even**（对齐 LuaJIT 2.1 的 `lj_strfmt_num.c`）。
      **不要用 `Math.round(x*1e13)/1e13`**（0.042% 偏差），
      **不要用 decimal.js 的默认构造**（双重舍入）。
      要性能可退到 `Number(x.toFixed(13))` + `Number.isInteger(x*16384) && (x*16384)%2===1` 兜底。
- [ ] `pseudoseed(key, predictSeed)` 的预测分支（`get_first_legendary` 用）是另一条公式，
      单独实现，别与主分支合并：
      ```
      p = pseudohash(key + predictSeed)
      p = abs(fmt13(frac(2.134453429141 + p*1.72431234)))
      return (p + pseudohash(predictSeed)) / 2
      ```
      它**不写回** `G.GAME.pseudorandom`，是个纯函数。
- [ ] `generate_starting_seed()`（`misc_functions.lua:222`）**不需要逐位复刻**：
      它的熵来自鼠标坐标与时间（`G.CONTROLLER.cursor_hover.T.x/.y/.time`），本来就不可复现。
      但 stake ≥ 8 时它会用 `get_first_legendary()` **筛掉**首个传奇小丑已带通关贴纸的种子——
      这段**筛选逻辑**要照搬，否则高 stake 下新开局的种子分布会偏。

### 8.3 四个包装函数

- [ ] `pseudorandom(key, min, max)`：`randomseed(pseudoseed(key))` → 一次 `random`。
- [ ] `pseudorandomElement(t, seed)`：收集 key、按 §6.1 的两分支排序、`random(1, n)` 取下标。
      注意 Lua 的 `#keys` 与下标 1-based，JS 要 `-1`。
- [ ] `pseudoshuffle(list, seed)`：先按 `sort_id` 升序，再倒序 Fisher–Yates，
      **共用一个 RNG 状态对象连抽**。
- [ ] `randomString(length, seed)`：播种一次后连抽，
      表达式是 `math.random() > 0.7 and math.random(49,57) or (math.random() > 0.45 and math.random(65,78) or math.random(80,90))`，
      注意 Lua 的 `and/or` 短路会**跳过**某些 `math.random()` 调用，抽取次数是可变的，必须逐字翻译。

### 8.4 状态与生命周期

- [ ] `G.GAME.pseudorandom` 这张表要能整体存档/回滚（对拍时需要 checkpoint）。
- [ ] 存档载入时 `hashed_seed` 要重算（`game.lua:2385`）而不是信存档里的值。
- [ ] `sort_id` 全局计数器要与原版同步自增（`card.lua:24`）。

---

## 9. 端到端验证：16/16 全部对上

分两层验证。**两层都用外部真值，不是自洽检查。**

### 9.1 第一层：TW223 本身（4/4）

LuaJIT 官方常量 `lj_prng_seed_fixed`（§2.4）—— 4 个 64 位字全对。

再加 balatro4j 的
[`LuaRandom.test.js`](https://raw.githubusercontent.com/alex-cova/balatro4j/HEAD/docs/js/immolate2/test/LuaRandom.test.js)
里的 `KNOWN_VALUES`（`randomseed(d)` 后第一个 `math.random()`）：

| seed | 期望 | 本地实现 | |
|---|---|---|---|
| 0.0 | 0.794206292431241 | 0.794206292431241 | OK |
| 1.0 | 0.3238105623786367 | 0.3238105623786367 | OK |
| 42.0 | 0.9560792879182105 | 0.9560792879182105 | OK |
| 12345.0 | 0.3579737466187569 | 0.3579737466187569 | OK |

这一层**与 `pseudohash` 解耦**，出问题时能直接定位是 RNG 还是哈希。建议原样进单测。

### 9.2 第二层：完整链路 → Ante 1 Boss Blind（12/12）

本地用上述实现 + `game.lua:266` 的 `P_BLINDS` + `common_events.lua:2387` 的 `get_new_boss`
算 Ante 1 的 Boss Blind。Ante 1 可选 boss（`boss.min <= 1` 且非 showdown），
按 key 字母序共 8 个：
`bl_club, bl_goad, bl_head, bl_hook, bl_manacle, bl_pillar, bl_psychic, bl_window`；
`boss = 该数组[math.random(8)]`，RNG 用 `pseudoseed('boss')` 播种。

| 种子 | 本地算出 | 外部真值 | 真值来源 |
|---|---|---|---|
| TUTORIAL | The Hook | The Hook | [balatrowiki The_Hook](https://balatrowiki.org/w/The_Hook) Trivia：「This is the Boss Blind on the "TUTORIAL" seed's Ante 1」 |
| ALEEB | The Window | The Window | [balatrohq seed-analyzer](https://balatrohq.com/tools/seed-analyzer/) 服务端预渲染的默认示例（Red Deck / White Stake） |
| 7LB2WVPK | The Club | The Club | [Blueprint fixture](https://raw.githubusercontent.com/miaklwalker/Blueprint/HEAD/___tests___/seedJson/7LB2WVPK.json)（gameVersion `10106` = 1.0.1o） |
| 3SZ71111 | The Head | The Head | Blueprint fixture（Red Deck） |
| 2K9H9HN | The Club | The Club | Blueprint fixture |
| 7ODNKXP | The Manacle | The Manacle | Blueprint fixture |
| 9ZXMM1M | The Hook | The Hook | Blueprint fixture |
| U8RJYV6M | The Club | The Club | Blueprint fixture |
| V3PUR5L4 | The Pillar | The Pillar | Blueprint fixture |
| VNOMH111 | The Hook | The Hook | Blueprint fixture |
| SF9SZOB1 | The Head | The Head | Blueprint fixture（见下方注） |
| JHZ7FPM | The Head | The Head | [balatro4j `BalatroTests.java`](https://github.com/alex-cova/balatro4j) |

> **SF9SZOB1 的注**：该 fixture 的 `seed` 字段实际是 `"SF9SZOB1 "`（**尾随一个空格**）。
> 按字面值算得 The Club，去掉空格算得 The Head（= 期望值）。
> 说明那个空格是 fixture 的数据瑕疵，分析结果本身是按 trim 后的种子算的。
> 顺带印证了实现对输入**逐字符敏感**——多一个空格结果就变，这本身也是正确性的旁证。

几点值得注意：

- 真值覆盖了 8 个可能结果里的 5 个（Hook / Window / Club / Manacle / Pillar / Head），不是撞运气。
- 真值来自 **3 个互不相干的来源**（游戏 wiki、seed 分析站、两个独立的开源工具仓库）。
- 其中既有 Red Deck 也有 Ghost Deck，说明牌组不影响这条链路（符合 `get_new_boss` 的代码）。

（`%.13f` 这一步用的是 §4.3 的 BigInt 精确 half-even 路径。）

### 9.3 补充的中间值与分布自检

中间值（未找到公开来源可对，仅供他人复算时对照）：
`pseudohash("ALEEB") = 0.22857354040434075`、
`pseudohash("Joker1ALEEB") = 0.8446389227813142`、
`pseudoseed("boss")` 在种子 ALEEB 下前三次 =
`0.1803697639015704, 0.29546120627267036, 0.4939148005815704`。

对 20000 个随机 8 位种子跑完整链路，8 个 boss 的分布为
`2534 2480 2594 2525 2514 2461 2418 2474`，卡方 8.05（df=7，p=0.05 临界 14.07）→ 均匀。

### 9.4 原型代码位置

`C:\Users\Administrator\AppData\Local\Temp\claude\E--block-rougelike\76e7a1e5-7c83-46b1-89a2-74bac7dc842a\scratchpad\`
（`luajit_rng.mjs` / `chain.mjs` / `boss.mjs` / `verify.mjs` / `fmt.js` / `fma.mjs` / `sanity.mjs`）。
**是临时文件，会被清理**，正式落地时按 §8 清单重写进 `复刻/`。

---

## 10. 待办 / 未闭合

1. **消费顺序**（→ 09 号票）。见 §7。这是「同 seed 同局」剩下的唯一一块。
2. **把 §9 的 16 条向量落成单测**（→ 01 号票工程骨架 / 04 号票对拍基准）。
   这些向量不依赖实机、不依赖素材，是纯代码资产，应该在写第一行 gameplay 代码之前就进 CI。

已关闭的待办：

- ~~外部真值核对~~ —— §9，16/16 全部对上，来自 3 个互不相干的来源。
- ~~对拍基准的平台口径~~ —— §4.1 查明 LuaJIT 2.1 的 `%f` 自带实现、不走 libc，
  Windows / Android / Linux 版行为一致，这一项不再是风险。
- ~~FMA 收缩~~ —— §5。三条证据指向「不收缩」，且 §9 的 16 条端到端向量全对，
  已经反证了收缩假设（若实机是 FMA 版，这 12 个 boss 不可能全中）。

### 回到地图

这张票的结论可以填回 `map.md` 的 Decisions：
**「同 seed 同局」这条轴的 RNG 部分不需要重新裁定——可行，且已验证。**
轴本身是否成立，取决于 09 号票。
