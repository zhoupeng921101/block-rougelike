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

**第二个里程碑已交付**（[15 号票](../../.scratch/balatro-复刻/issues/15-第二个里程碑的切片边界.md)
「带小丑打过 Ante 1」）：小丑进结算管线、经济层、商店、盲注推进、28 个 Boss 全实现。
`src/core/ante1.test.ts` 会真的打完小盲注 → 商店 → 大盲注 → 商店 → Boss → Ante 2，
不 mock、不直接写 phase。表现层也接上了：小丑区、商店（买／卖／重掷）、回合收益明细。

**消耗品已交付**（[16 号票](../../.scratch/balatro-复刻/issues/16-消耗品的切片边界.md)）：
消耗品槽位（2 格）、12 张星球、22 张塔罗、8 种强化牌，商店真的卖消耗品。

**补充包已交付**（[17 号票](../../.scratch/balatro-复刻/issues/17-补充包与幽灵牌的切片边界.md)）：
五种补充包（商店第三、四格）、18 张幽灵牌、4 种版本、4 种蜡封。

> **Ante 3 的墙松了两格，还是没破。** 八个 seed 的贪心深度
> 2.875（消耗品之前）→ 3.0（消耗品）→ **3.375**（补充包），最深到 Ante 5。
>
> 剩下的差距里有多少是内容、有多少是策略**说不清**：
> 那个贪心**不挑手牌**，所以一半塔罗与全部「给选中的牌加蜡封」的幽灵牌
> 都用不出来；买小丑也不挑好坏。**下一步该先写一个会挑牌的策略**，
> 不然「还差多少内容」这个问题永远测不出来。

**强化牌那 9 张小丑已交付**：Marble / Steel / Stone Joker、Vampire、Midas Mask、
Lucky Cat、Golden Ticket、Glass Joker、Driver's License。**小丑覆盖面 124 → 133 / 150**，
剩下 17 张：增删牌 8 / 负债 4 / 标签 3 / 关掉 Boss 2。

> **这 9 张对「墙」的贡献是零，而且是结构性的零。** 墙现在有了一张钉住的快照
> （`src/core/depth.test.ts`，bot 在 `src/core/fixtures/greedy-bot.ts`）：
> 八个 seed 平均 **2.625**，这一刀前后逐 seed 完全相同。八局里一张都没买到；
> 就算买到也吃不上——它们要整副牌里有强化牌，而强化牌来自塔罗（要选手牌）
> 与标准包，bot 两样都用不出来。
>
> **2.625 与上面那个 3.375 不可比**：那是一次性脚本量的，seed 与阈值都没留下来。
> 从这里起以快照为准。

**会挑牌的策略已交付**（`src/core/fixtures/picky-bot.ts`）：对手牌用塔罗、
在沙盒里拿真的结算管线给小丑估值、挑包里的牌。60 个 seed 的墙
（`npm run test:slow`）从贪心的 **2.333** 推到 **3.867**，有一局打穿了 Ante 8。
贪心量到的墙主要是策略墙。强化牌那 9 张换成挑牌 bot 也还是零贡献——
3 张新档池子里根本没有，另外 6 张的价值在「以后」，估值只看眼前。

**存利息试过了，不划算**：15 种「存钱线 × 重掷」组合没有一种比不存好，
全程存 $25 反而从 3.867 掉到 2.900。参数留在 `picky-bot.ts` 的 `Economy` 里、默认关。
卡住 bot 的是出牌（每关一手同花之后只剩对子）与只看眼前的小丑估值。

**出牌改好了**：挑哪一手带着小丑精算、弃哪几张模拟换牌挑期望最好的、弃牌按手数分配额。
60 个 seed 3.867 → **4.133**（另一批没参与调参的 seed 上 3.967 → 4.350）。

**估值看成长了**：沙盒里连打 4 手、小丑状态带进下一手，Green Joker / Runner / Hiker 这类
越打越强的估值会涨。60 个 seed 4.133 → **4.333**（240 个 seed 上 3.967 → 4.158）。
强化牌那 9 张仍然零贡献：参考牌固定、新牌组没有强化牌，它们的成长条件在沙盒里碰不到。
存利息复测仍不划算。

**「增删牌」8 张小丑已交付**：Ceremonial Dagger / DNA / Madness / Riff-raff / Invisible Joker /
Caino / Yorick / Hologram。**小丑覆盖面 141 / 150**，剩 9：负债 4 / 标签 3 / 关掉 Boss 2。
顺带修了三个真 bug：本回合出牌数加早了（Sixth Sense 在真局里从没触发过）、
小丑的 `setting_blind` 跑在发牌之后、Marble 的石头牌这一关就该在牌堆里。
挑牌 bot 对这 8 张仍然零贡献——它们的作用全在「打一手」之外，估值看不见。

**「钱」那 3 张已交付**：Credit Card（可以欠到 -$20）/ Rocket / Gift Card。
**小丑覆盖面 144 / 150**，剩 6：标签 4 / 关掉 Boss 2。顺带补上了漏掉的**版本加价**
（带版本的小丑原先按基础价卖），墙因此从 4.267 纠偏到 4.083——原先复刻件比原作便宜。

**又做了 4 张：Trading Card / Certificate / Luchador / Chicot**，补上了关掉 Boss（`Blind:disable`）。
**小丑覆盖面 148 / 150**，剩下的 Throwback / Diet Cola 都要标签系统。顺带修了弃牌计数的时机，
以及 The Needle 与 Troubadour 同场时出牌次数变成 0 的 bug。

**标签与跳过盲注已交付**（[18 号票](../../.scratch/balatro-复刻/issues/18-标签与跳过盲注的切片边界.md)），
**小丑 150 / 150**。24 个标签全部进池；指定 seed 的对局里原作不会「发现」任何东西，
所以 Rare 与四个版本标签抽不到；Voucher Tag 拿得到但不生效（优惠券不在）。其余 18 个效果全做了。
界面加了盲注选择这一屏：能看到跳过这一格给什么标签，按「跳过盲注」拿走它。

**优惠券已交付**（[19 号票](../../.scratch/balatro-复刻/issues/19-优惠券的切片边界.md)）：
32 张全部进池，**二级那 16 张在指定 seed 下永远抽不到**（新档没解锁，而 `check_for_unlock`
对 seeded 直接 return），一级 16 张全部有效果。商店多了优惠券格，盲注选择界面在兑换
Director's Cut 后多一个「重掷 Boss」，Voucher Tag 也接上了——**24 个标签里抽得到的 19 个全部有效果**。
挑牌 bot 学会了买，但**默认不买**：只用余钱买与不买打平，先买明显更差（见票）。

**外观轴第一刀**（[20 号票](../../.scratch/balatro-复刻/issues/20-外观轴第一刀-版本与卡面叠层.md)）：
版本（Foil / Holo / Polychrome / Negative）、蜡封、优惠券扫光、补充包与幽灵牌的 `booster` 层都画出来了——
原作是同一张卡换 shader 再画几遍，复刻件是同一位置多叠几个 quad。7 个 `.fs` 由生成器转方言，
**全部 shader 都有 GLSL ES 1.00 的离线编译测试**（`src/game/shaders/shaders.test.ts`，用 Khronos 的 `glslangValidator`）。
文字标记（`✦多彩` / `▣红`）先留着，等人眼确认 shader 画对了再删。
顺带修了一个老 bug：石头牌与被 Boss 盖住的牌**点不到**（点击区挂在隐藏的正面层上，Phaser 不给隐藏对象派发输入）。

> **表现层这一版没有人眼验收过。** 本机的无头 Edge 截不到图，
> 而「像素级外观」与「音效」这两条轴只能人工验（见 07 号票的验收表）。
> 逻辑层有 830 个测试兜底，渲染层只有 `core/atlas.test.ts` 那组图集坐标测试。
> **版本与蜡封的贴图都没有移植**（原作每种版本一个 `.fs`、蜡封是四张叠图），
> 这一版只用文字标出来（`✦多彩` / `▣红`）。

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
│   ├── fixtures/                12 条 Ante 1 Boss 外部真值 + 贪心 / 挑牌两个 bot（depth*.test.ts 用它们量墙）
│   ├── enhancements.ts          8 种强化牌（照抄原作那七个 getter，不收成表）
│   ├── editions.ts              4 种版本（poll_edition / get_edition）
│   ├── seals.ts                 4 种蜡封（四个钩子，四个小函数）
│   ├── boosters.ts              补充包的 center 与 get_pack
│   ├── booster-open.ts          开包（Card:open），五种口味各一套 RNG 账
│   ├── tags.ts                  标签的池子与抽取（效果在 run.ts / shop.ts 的触发点上）
│   ├── tags.generated.ts        24 个标签（生成的，别手改）
│   ├── vouchers.ts              优惠券的池子、抽取、「兑换了哪些 → 整局参数」
│   ├── vouchers.generated.ts    32 张优惠券（生成的，别手改）
│   ├── consumables/             ← 消耗品。52 / 52 全有行为
│   │   ├── centers.generated.ts     塔罗 22 + 星球 12 + 幽灵 18（生成的）
│   │   ├── instance.ts              makeConsumable / planetKeyFor
│   │   ├── use.ts                   用掉一张 + 用量统计 + 覆盖面登记
│   │   ├── tarot.ts                 22 张塔罗的 spec
│   │   ├── spectral.ts              18 张幽灵牌的 spec
│   │   └── use-context.ts           喂给消耗品的那张宽接口
│   ├── atlas.ts                 图集网格推导（**不 import Phaser**，所以可单测）
│   ├── event-queue.ts           事件队列（G.E_MANAGER）
│   ├── jokers/                  ← 小丑系统。150 张全有行为
│   │   ├── centers.generated.ts     150 张的 center 定义（生成的，别手改）
│   │   ├── instance.ts              set_ability / set_cost
│   │   ├── calculate.ts             calculate_joker + 覆盖面登记
│   │   ├── eval-card.ts             eval_card
│   │   ├── modifiers.ts             一进小丑区就改局面参数的那些（手牌上限/概率/牌型松紧）
│   │   ├── derived.ts               从小丑区重算的 ability 字段（Joker Stencil / Swashbuckler）
│   │   └── game-view.ts             喂给小丑的 G.GAME 视图
│   └── rng/                     RNG 核心
│       ├── fmt13.ts                 Lua %.13f 的精确复刻（BigInt，round-half-to-even）
│       ├── luajit-random.ts         LuaJIT TW223 Tausworthe
│       ├── pseudorandom.ts          pseudohash / pseudoseed / pseudorandom
│       └── pseudoshuffle.ts         洗牌
├── game/                    ← 表现层。Phaser 4
│   ├── coords.ts                tile ↔ 像素的**唯一**换算边界（见 10 号票）
│   ├── shader-quad.ts           三种卡共用的 shader quad 工厂
│   ├── card-sprite.ts           扑克牌（底板 + 正面两层，底板换强化）
│   ├── joker-sprite.ts          小丑（单层，含四条尺寸特例）
│   ├── consumable-sprite.ts     消耗品（单层，没有尺寸特例）
│   ├── booster-sprite.ts        补充包（单层，画得比卡大 ×1.27）
│   ├── voucher-sprite.ts        优惠券（单层，`voucher` 扫光 shader 没移植）
│   ├── shaders/                 background / CRT / dissolve + 7 个叠加层（editions.generated.ts）
│   └── scenes/RunScene.ts       整局：手牌 / 小丑区 / 商店 / 收益明细
└── tools/                    八个生成器 + 共用的 Lua 表解析器
```

## 命令

```bash
npm run dev         # localhost:8080
npm test            # 884 个测试，必须全绿（含 13 条 shader 编译检查）
npm run test:slow   # 60 个 seed 量墙（约 30 秒，改了内容或 bot 之后跑）
npm run typecheck   # tsc --noEmit
npm run build       # 先 typecheck 再 vite build
```

重新生成小丑 center（只在 `game.lua` 变了时候需要）：

```bash
node tools/gen-joker-centers.mjs
node tools/gen-blind-centers.mjs
node tools/gen-consumable-centers.mjs
node tools/gen-enhancement-centers.mjs
node tools/gen-booster-centers.mjs
node tools/gen-tag-centers.mjs
node tools/gen-voucher-centers.mjs
node tools/gen-edition-shaders.mjs   # 这个读的是 资源/shaders/*.fs，不是 game.lua
```

七个生成器共用 `tools/lua-table.mjs` 的 Lua 表解析器。

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
3. **塔罗／星球的格子只多一次池子抽取。** 权重 20:4:4 意味着约 28.6% 的格子是消耗品，
   而它们的 RNG 账比小丑短得多：

   ```
   cdt<ante>                        同上，决定这格是什么
   <Type>sho<ante>                  在塔罗／星球池里抽下标
   <Type>sho<ante>_resample<n>      抽到 UNAVAILABLE 就重抽
   ```

   `rarity` / `etperpoll` / `edi` 全在 `if _type == 'Joker'` 里面，
   `front` 只有 Base/Enhanced 才掷；`soul_<Type><ante>` 要 `soulable`，
   而 `create_card_for_shop` 传的第 6 个实参是 **nil**——
   所以 **The Soul / Black Hole 出不了商店**。见
   [16 号票](../../.scratch/balatro-复刻/issues/16-消耗品的切片边界.md)。

4. **`used_jokers` 不是「整局见过的」，是「此刻被摆出来或被持有的」。**
   重掷商店与离开商店都会把没卖掉的那几格**还回池子**
   （`card.lua:4829` 的 `Card:remove()` 有一条对称的清除）。
   写成永久剔除会让池子内容一次比一次窄，`_resample` 的次数跟着偏。

## 覆盖面：小丑 124 / 150，消耗品 52 / 52，补充包 5 / 5

剩下 26 张小丑卡在还没做的系统上，分组见 `src/core/jokers/coverage.test.ts`：
**强化牌 9 张**（前置全落地了，只是还没做——**下一刀最划算的就是它**）、
增删牌 8 张、负债 4 张、标签 3 张、关掉 Boss 2 张。

**有两张小丑「有 handler 但效果落空」**，且被 `isJokerImplemented` 报成已实现：
`To Do List`（牌型从没被抽过）与 `Mr. Bones`（`saved` 标志无人读取）。
**「有 handler」不等于「有效果」**——这是那套覆盖面机制挡不住的漏网形态。

判断「实现了没有」的是 `isJokerImplemented`，它**从 handler 表算出来、不手写名单**。
手写会漂：加了 handler 忘更名单会误报未实现，删了 handler 名单还留着更糟——
那等于把一张什么也不做的小丑报成已实现。

商店与小丑区都会给未实现的小丑标 `⚠未实现`。**别把这个标记去掉**：
商店按设计从 150 张全池生成（池子大小影响 RNG，不能裁），
不标就是把「买了什么也不发生」伪装成正常行为。

## 三处「加减」换成了「重算」

`runModifiers`（局面参数）、`refreshDerivedAbilities`（派生 ability）、
`getCurrentJokerPool`（商店池）都是**每次从当前状态推导**，不做增量维护。

原作是加减的（`add_to_deck` 加、`remove_from_deck` 减），但那要求两者严格配对，
而小丑会被摧毁（Popcorn / Gros Michel / Madness）、被 debuff（Crimson Heart）、被卖掉。
任一路径漏了 remove，手牌上限就永久跑偏，而那种 bug 只在特定组合下出现、极难复现。
重算是 O(5)，代价可以忽略。
