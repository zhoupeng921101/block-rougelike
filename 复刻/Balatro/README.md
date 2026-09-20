# Balatro 1.0.1o web 复刻件

> **只跑 localhost。不部署、不分发。**
>
> 游戏的机制与数值不受版权保护，重新实现是合法的；但美术、音频、文案受保护，
> 而本工程直接引用 `参考/产物/Balatro_1.0.1o/` 里的原素材。
> 一旦做成可公开访问的站点即构成侵权。这条是整个工程成立的前提，不要绕过它。

设计地图与决策台账在 [`.scratch/balatro-复刻/`](../../.scratch/balatro-复刻/map.md)。
动手前先读那份地图的 `## 已知的坑`。

## 现在有什么

**第一个里程碑已交付**：红牌组打 Ante 1 的小盲注，8 张手牌 / 4 出牌 / 3 弃牌，
300 分过关，带出牌动画、悬停倾斜、背景 shader、CRT 与音效。

**第二个里程碑的逻辑层已交付**（[15 号票](../../.scratch/balatro-复刻/issues/15-第二个里程碑的切片边界.md)
「带小丑打过 Ante 1」）：小丑进结算管线、经济层、商店、盲注推进、Ante 1 的 8 个 Boss。
`src/core/ante1.test.ts` 会真的打完小盲注 → 商店 → 大盲注 → 商店 → Boss → Ante 2，
不 mock、不直接写 phase。表现层也接上了：小丑区、商店（买／卖／重掷）、回合收益明细。

> **表现层这一版没有人眼验收过。** 本机的无头 Edge 截不到图，
> 而「像素级外观」与「音效」这两条轴只能人工验（见 07 号票的验收表）。
> 逻辑层有 304 个测试兜底，渲染层只有 `core/atlas.test.ts` 那组图集坐标测试。

```
src/
├── main.ts
├── core/                    ← 逻辑层。没有一行 Phaser，可以单测
│   ├── card.ts                  扑克牌模型（set_base / is_face / get_nominal）
│   ├── poker-hands.ts           牌型判定（evaluate_poker_hand）
│   ├── scoring.ts               出牌结算管线（evaluate_play 的 3/4/6/9/10/11/14/15 步）
│   ├── round.ts                 一局盲注的状态机
│   ├── run.ts                   一整局：Ante 推进、盲注序、钱、小丑持有
│   ├── blinds.ts                盲注与 Boss（get_new_boss / debuff_card / press_play）
│   ├── blinds.generated.ts      30 条盲注定义（生成的，别手改）
│   ├── economy.ts               回合收益与利息（evaluate_round）
│   ├── shop.ts                  商店（get_current_pool / create_card_for_shop / 重掷）
│   ├── fixtures/                对拍 fixture（12 条 Ante 1 Boss 外部真值）
│   ├── atlas.ts                 图集网格推导（**不 import Phaser**，所以可单测）
│   ├── event-queue.ts           事件队列（G.E_MANAGER）
│   ├── jokers/                  ← 小丑系统
│   │   ├── centers.generated.ts     150 张的 center 定义（生成的，别手改）
│   │   ├── instance.ts              set_ability / set_cost
│   │   ├── calculate.ts             calculate_joker
│   │   ├── eval-card.ts             eval_card
│   │   └── game-view.ts             喂给小丑的 G.GAME 视图
│   └── rng/                     RNG 核心
│       ├── fmt13.ts                 Lua %.13f 的精确复刻（BigInt，round-half-to-even）
│       ├── luajit-random.ts         LuaJIT TW223 Tausworthe
│       ├── pseudorandom.ts          pseudohash / pseudoseed / pseudorandom
│       └── pseudoshuffle.ts         洗牌
├── game/                    ← 表现层。Phaser 4
│   ├── coords.ts                tile ↔ 像素的**唯一**换算边界（见 10 号票）
│   ├── shader-quad.ts           三种卡共用的 shader quad 工厂
│   ├── card-sprite.ts           扑克牌（底板 + 正面两层）
│   ├── joker-sprite.ts          小丑（单层，含四条尺寸特例）
│   ├── shaders/                 background / CRT / dissolve
│   └── scenes/RunScene.ts       整局：手牌 / 小丑区 / 商店 / 收益明细
└── tools/gen-joker-centers.mjs  从 game.lua 抽 150 张小丑的 center
```

## 命令

```bash
npm run dev         # localhost:8080
npm test            # 304 个测试，必须全绿
npm run typecheck   # tsc --noEmit
npm run build       # 先 typecheck 再 vite build
```

重新生成小丑 center（只在 `game.lua` 变了时候需要）：

```bash
node tools/gen-joker-centers.mjs
node tools/gen-blind-centers.mjs
```

**用 npm，不要用 pnpm。** pnpm 在本机装 `esbuild` 时稳定复现 `ERR_PNPM_EPERM`
（硬链接 rename 被拒），换 npm 即可。

## 已经定下来的口径

| 项 | 裁定 | 出处 |
|---|---|---|
| 翻译策略 | **直译，含事件队列**。不要中途重构成判别联合 | [03 号票](../../.scratch/balatro-复刻/issues/03-Lua到TS的翻译策略.md) |
| Phaser | **4.2.1**。Pipeline 体系已移除，自定义 shader 走 `Shader` GameObject | [11 号票](../../.scratch/balatro-复刻/issues/11-Phaser版本选型与渲染API复核.md) |
| 卡牌的渲染对象 | `Shader` 而非 `Sprite`。`setAlpha` 是 NOOP，alpha 走 shader uniform | 同上 |
| RNG | 逐位复刻可行，16/16 外部真值已通过 | [02 号票](../../.scratch/balatro-复刻/issues/02-LuaJIT-RNG-复刻口径.md) |

## 关于那 16 条测试向量

它们**不依赖实机、不依赖素材**，是目前唯一拿得到的外部 ground truth——
来自 balatrowiki、balatrohq、Blueprint fixture、balatro4j 四个互不相干的渠道。

改动 `src/core/rng/` 下任何一个文件之前，先确认这 24 个测试是绿的；
改完再跑一遍。它是后面每一步直译的底座。

**小丑那 66 个测试是另一回事**：它们的期望值全是**手算**的，算式写在用例名里
（洗牌与结算都没有外部真值，见 [04 号票](../../.scratch/balatro-复刻/issues/04-原版对拍基准能否导出.md)）。
手算错了测试照样绿，所以加新小丑时**必须把算式写进用例名**，让下一个人能不跑代码就复核。

其中 `randomseed(0.0)` 那条尤其硬：它比对的四个常量原样出现在
`参考/产物/Balatro_1.0.1o/原生库/arm64-v8a/liblove.so` 里
（字节偏移 1159408 / 1159416 / 1156768 / 1156776），
即这里复刻的算法与游戏实际链接的那份 LuaJIT 是同一份代码。

## 几条容易踩的

- **`%.13f` 不能用 `toFixed`**（half-away，LuaJIT 是 half-even），
  也不能用 Immolate 系的 `round(x*1e13)/1e13`（实测 0.05% 分叉率）。
- **`math.random` 不要加参数校验**。LuaJIT 对 `math.random(0)` 返回 1 而不报错，
  加了校验会在空池场景与原版分叉。
- **`a % 1` 在 Lua 里对负数返回非负**，JS 的 `%` 是截断取余。统一用 `a - Math.floor(a)`。
- **本产物是移动版构建**（`PROD_mobile`）。CRT 强度 30 而非桌面的 70，卡牌 3D 倾斜恒关。
  外观基准还没裁定，见 [12 号票](../../.scratch/balatro-复刻/issues/12-外观基准是移动版还是桌面版.md)。
- 模版自带的 `log.js` 会在每次 dev/build 时向 `gryzor.co` 上报项目名与 Phaser 版本，**已删除**。

## 小丑系统的三条口径

`calculate_joker` 在原作里是 1773 行（`card.lua:2294-4066`）。复刻时的形状裁定见
[15 号票](../../.scratch/balatro-复刻/issues/15-第二个里程碑的切片边界.md)，三条要记住：

1. **外层的 context 分支照抄，分支内按名字查表。** 外层分支
   （`individual` / `repetition` / `other_joker` / `before` / `after` / main）
   是真语义，互斥且有先后；分支内的名字判定命中即 `return`，查表与 if 链等价。
2. **main 分支的前四条判定不进查表。** `Loyalty Card` 会 fall through，
   后面三条是**泛化的**（读 `x_mult` / `t_mult` / `t_chips`，不看名字），
   一次覆盖 10 张没有专属代码的小丑，而且排在所有名字判定之前——顺序有观测后果。
3. **一次调用最多产出一个 effect。** 原文靠 `return` 保证，这里靠 handler
   返回 `JokerEffect | null` 保证。破了它会在一次结算里把同一张小丑算两遍。

还有一条容易写错的：**不要往 `dollar_buffer` 里加钱。** 那个字段在原作里存在的唯一理由
是 `ease_dollars` 入队延迟，而本复刻的加钱是同步立即的——往里加会让 `Bull` 把同一笔算两遍。

## 商店那几条最容易搞错的

商店是第二个 RNG 消费点，比洗牌复杂得多。生成**一个格子**要按顺序消费：

```
cdt<ante>                          这格是小丑还是消耗品（20 : 4 : 4）
rarity<ante>sho                    稀有度（>0.95 → 3，>0.7 → 2，否则 1）
Joker<rarity>sho<ante>             在该稀有度池里抽下标
Joker<rarity>sho<ante>_resample<n> 抽到 UNAVAILABLE 就重抽，编号从 2 起
etperpoll<ante>                    永恒／易腐掷点 —— **无条件消费**
edisho<ante>                       版本掷点
```

三条：

1. **`etperpoll` 要消费，租赁掷点不能消费。** 前者那行 `local ... = pseudorandom(...)`
   在 `if` 外面；后者在 `and` 右边、默认关、短路。这一对搞反，后面每一格都偏。
2. **剔除不改池子长度。** 被剔的位置换成 `'UNAVAILABLE'` 而不是删掉，
   所以 `math.random(#pool)` 的取值域不变。真删掉会让同 seed 立刻分叉。
   有三件事会剔除：45 张 `start_locked` 的小丑（新档不解锁）、
   本局见过的小丑（`used_jokers`，Showman 例外）、`pool_flag`（Gros Michel / Cavendish）。
3. **塔罗／星球的格子照样生成。** 权重 20:4:4 意味着约 28.6% 的格子是消耗品；
   把它们改成小丑就改了商店分布。本里程碑没实现它们的效果，
   所以生成一个 `kind: 'unimplemented'` 的格子，买不了。
