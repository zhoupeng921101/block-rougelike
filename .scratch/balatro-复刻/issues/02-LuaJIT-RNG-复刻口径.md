# LuaJIT-RNG-复刻口径

Type: wayfinder:research
Status: resolved

## Question

在 JS 里精确复刻 Balatro 的随机数链路，需要做到什么程度？可行吗？

已知（本次 charting 实测）：

- `pseudohash` / `pseudoseed`（`源码/functions/misc_functions.lua:282`、`:301`）
  是**纯双精度浮点哈希**，用 `math.pi`、乘除取模、`string.format("%.13f")`。
  JS 的 Number 同为 IEEE754 double，这一段原则上可 1:1 重现。
- 但 `pseudorandom`（`:318`）与 `pseudorandom_element`（`:256`）最终落到
  `math.randomseed(seed)` + `math.random(...)`，**那是 LuaJIT 的发生器**，不是纯浮点。

要查清：

1. LuaJIT 的 `math.random` 用的是哪个算法（Tausworthe 还是别的），
   `math.randomseed(double)` 如何把一个 double 铺进内部状态。
2. LÖVE 2D 有没有覆盖全局 `math.random`。Balatro 跑在 LÖVE 上，
   如果 LÖVE 换掉了它，要复刻的是 LÖVE 的那一个而不是 LuaJIT 的。
3. `string.format("%.13f")` 的舍入与 JS `toFixed(13)` 是否逐位一致；不一致的话差在哪、怎么补。
4. `pairs()` 的遍历顺序：`pseudorandom_element` 先 `pairs` 再排序，
   排序键缺失时（`keys[1].v` 不是 table）落到 `a.k < b.k`——确认这条路径下顺序是确定的。

产出：一份可行性结论 + 如果可行，JS 侧的实现要点清单。
如果结论是**不可行或代价不可接受**，「同 seed 同局」这条轴要回到用户面前重新裁定。

## Answer

**可行，且已用外部真值对拍验证通过（16/16）。** 整条链路
（`pseudohash` → `pseudoseed` → `math.randomseed` → `math.random`）
在 JS/TS 里可做到**逐位一致**，无需近似。

完整报告：[research/02-LuaJIT-RNG.md](../research/02-LuaJIT-RNG.md)（733 行）。以下是要点。

### 四个问题的答案

1. **算法**：LuaJIT 的 TW223 Tausworthe，4×u64 LFSR。
   `randomseed(d)` 把 `d` 链式做 4 次 `d*π+e`、取 IEEE754 位模式铺进状态、预热 10 步。
2. **LÖVE 没有覆盖全局 `math.random`**，任何版本都没有。
   反证也成立：LÖVE 的 `setSeed` 会把 double **截断成整数**，
   而 Balatro 的种子是 (0,1) 小数——走 LÖVE 的话全游戏会退化成同一个序列。
3. **`%.13f`：票里的担心方向错了。** LuaJIT 2.1 不走 libc，自带 `lj_strfmt_num.c`，
   固定 round-half-to-even。所以**跨平台一致**，原先担心的「桌面版 vs 安卓版」风险不存在。
   但 JS 的 `toFixed` 是 half-**away**，语义不同，要用 BigInt 精确展开。
   分歧集可精确刻画为 `奇数/16384` 共 8192 个值。
4. **`pairs()` 顺序不影响 gameplay**：三处都被紧随的 `table.sort` 洗掉。

### 已复核的证据（本 session 亲自验，非转述）

报告声称那四个 TW223 状态常量原样出现在 Balatro 自带的 `liblove.so` 里。**已核对属实**：

| 常量 | 字节偏移 |
|---|--:|
| `a0d277570a345b8c` | 1159408 |
| `764a296c5d4aa64f` | 1159416 |
| `51220704070adeaa` | 1156768 |
| `2a2717b5a7b7b927` | 1156776 |

（报告写作「偏移 1156768 起」，实际是两处而非一块连续区；实质结论不受影响。）
这条是整份报告最硬的证据：复刻的算法与游戏实际链接的那份 LuaJIT 是同一份代码。

### 落地时的三个坑

- **别抄 Immolate 系的 `round(x*1e13)/1e13`**，实测 0.042% 偏差。用 BigInt 精确展开。
- **抄现成移植时复核 `if (u < m)`** 是否拿整个 u64 比——有移植写成高 32 位，是错的。
- **FMA 收缩**（报告 §5）：已有三条独立证据指向「不收缩」，但本地拿到的是 Android arm64 构建，
  理论上编译选项可能不同。**若将来整条链对不上，第一个要试的备选就是 FMA 版。**
  记在这里，免得到时候从头排查。

### 性能

BigInt 版「播种 + 抽一次」约 4.4 µs。一局几千次调用，可忽略。
真做种子搜索再换 `Uint32Array` 手写 64 位。

### 留下的资产

报告 §9 的 **16 条测试向量**不依赖实机、不依赖素材，是纯代码资产。
**建议在写第一行 gameplay 代码之前就进 CI**。
原型实现在临时 scratchpad 里会被清掉，落地时照报告 §8 的清单重写。
