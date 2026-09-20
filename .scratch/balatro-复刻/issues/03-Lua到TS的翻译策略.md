# Lua到TS的翻译策略

Type: wayfinder:grilling
Status: resolved

## Question

35,876 行 Lua 变成 TS，走哪条路？

- **直译**：保留 Lua 的结构——全局 `G`、事件队列、`card.lua` 的那套 ability 表。
  正确性与对拍最稳，因为结算顺序天然一致；代价是 TS 代码会长得不像 TS，
  且 Lua 的动态表在 TS 里要么到处 `any`，要么类型体操。
- **重写**：按 TS 惯例重新建模（判别联合表示小丑效果、纯函数表示结算管线）。
  可维护、可测试；代价是**结算顺序极易走样**，而顺序错了分数就错，
  对拍会变成一场持久战。Balatro 的结算顺序有大量隐式依赖，见
  `参考/结论/Balatro_1.0.1o/出牌结算管线.md`。
- **混合**：结算核心直译保证对拍，外围（UI、场景、存档）按 TS 惯例写。

这张票波及面最大：它决定后面每一张实现票的形状，也决定
[第一个可玩里程碑的切片边界](07-第一个可玩里程碑的切片边界.md) 怎么切。

带着推荐答案去问用户，不要自己拍板。

## Answer

**直译，含事件队列。**

直译的范围：`G.GAME` 状态树、`eval_card`、144 个分支的 `Card:calculate_joker`、
`evaluate_play` 的 15 步管线、**以及 `E_MANAGER` 的调度语义**（`trigger` / `delay` /
阻塞 / 嵌套入队的先后）。原样搬，不重新建模。

重写的范围只有最末端的渲染与输入：`card_eval_status_text`、`juice_up`、
sprite / tween / 场景 / UI。这些在直译层里降级成「向表现层发一个事件」，不参与调度。

### 为什么不是重写，也不是常规意义的混合

实测四条（本次 session 得出，非既有结论）：

1. **计分核心是同步的。** `eval_card`（`源码/functions/common_events.lua:583`）零个
   `add_event`，效果由 `return` 同步给出，`mult` / `hand_chips` 是普通局部变量。
   ——单看这条，混合方案很干净。
2. **但效果函数不纯。** `Card:calculate_joker`（`源码/card.lua:2294`）1,799 行、
   144 个 `self.ability.name ==` 分支，内含 58 处 `add_event`。
3. **那 58 处有一半在改游戏状态**，不是动画：`add_tag()`、`create_card()`、
   `G.GAME.blind:disable()`、`ease_hands_played()`、`start_dissolve()`。
4. **决定性的一条：队列回调里调用 `pseudoseed`。**
   Perkeo 的 `copy_card(pseudorandom_element(G.consumeables.cards, pseudoseed('perkeo')))`、
   Certificate 的 `pseudoseed('cert_fr')`，都写在 `add_event` 的 `func` 里。

第 4 条把事件队列从表现层拽进了逻辑层：**RNG 的消费顺序由队列的执行顺序决定**。
于是「同 seed 同局」这条轴不只要求复刻 RNG 算法，还要求复刻队列调度。
一旦队列必须直译，混合方案的边界就被推到只剩「存档、场景、UI 按 TS 惯例写」，
与直译方案实质重合——所以选项二不是第三条路，它是选项一的一个说法。

重写方案要另建一套能复现「坐标驱动排序 + 队列驱动 RNG 消费」的架构。
那不是重写，是重新设计，且把同 seed 对拍置于持久风险——与 destination 的第二条轴直接冲突。

### 代价，明着记下

- TS 会写得很不像 TS。`self.ability` 在 `calculate_joker` 里被引用 379 次，
  是异构的动态表，直译过来要么到处 `any`，要么写一层宽松的索引类型。**接受它**，
  不要中途「顺手重构成判别联合」——那等于偷偷切换到选项三。
- `G.GAME` 全仓被引用 1,351 次的全局可变状态会原样进 TS。同上，接受。
- 可维护性换正确性。这是本票的核心取舍：destination 的四条轴里有两条
  （机制数值一致、同 seed 可对拍）直接由它决定。

### 一条必须显式处理的耦合

`table.sort(scoring_hand, function(a,b) return a.T.x < b.T.x end)`
（`源码/functions/state_events.lua:621`，另见 `:413`、`:484`）——
**逻辑层读的是屏幕坐标**。直译时这条不能原样照搬，因为 Phaser 的坐标体系与 LÖVE 不同。
处理方案单开一票，见 [坐标驱动排序的解耦](10-坐标驱动排序的解耦.md)。
