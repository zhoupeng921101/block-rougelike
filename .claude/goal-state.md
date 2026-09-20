# goal 状态

工作目录 `E:\block-rougelike`，复刻件在 `复刻/Balatro/`。分支 `main`。

## 目标条件

Balatro 复刻件接上**消耗品系统**（消耗品槽位 + 星球牌 12 张 + 塔罗牌 22 张 + 强化牌 8 种），
按 [16 号票](../.scratch/balatro-复刻/issues/16-消耗品的切片边界.md) 的七步落地顺序推进。
补充包与幽灵牌**不在范围**（17 号票）。

每一步收尾时 `npm test` 与 `npm run build` 必须全绿；每轮有实质进展就更新本文件。

## 验证方式

```bash
cd 复刻/Balatro && npm test && npm run build
```

`src/core/jokers/coverage.test.ts` 的名单快照会在实现一张小丑后变红，
那是「该去删对应行」的信号，不是回归。

## 七步落地顺序（16 号票裁定）

- [x] 1. `levelUpHand` 修正（commit 2eb2cebe）
- [x] 2. `tools/gen-consumable-centers.mjs` 抽 34 张 center（commit 3d11b915）
- [x] 3. 消耗品槽位 + `Run` 持有 + 商店真的卖消耗品（commit e88c85f5）
- [x] 4. 星球牌 12 张（同上）——**但墙没破，见下**
- [x] 4.5 表现层：消耗品区（commit 3ee982da）
- [x] 5. 强化牌 8 种（commit 6b69b615）
- [x] 6. 塔罗牌 21 / 22（commit e3db7989，差 The Wheel of Fortune）
- [x] 7. 回填 **8** 张小丑（commit 7051ba4e），不是 13 张——见下
- [x] 收尾：`/code-review high` + 修三个洞（commit 0d1b3b52）

## 关键决策（压缩后最先丢，优先保留）

- **切片边界**：槽位 + 星球 + 塔罗 + 强化牌。幽灵牌与补充包推到 17 号票
  （依据：`spectral_rate` 默认 0，商店永远不出幽灵牌，幽灵牌只能从补充包 / The Soul 来）。
- **The Soul / Black Hole 出不了商店**：`create_card_for_shop` 的
  `create_card(v.type, area, nil, nil, nil, nil, nil, 'sho')` 第 6 个实参 `soulable` 是 `nil`；
  且 `get_current_pool` 无条件把这两张剔出池子。**`soul_<Type><ante>` 那次掷点不消费。**
- **塔罗／星球格只多一次掷点**：`<Type>sho<ante>` + `_resample<n>`。
  `rarity` / `etperpoll` / `edi` / `front` 全在 `if _type == 'Joker'` 里面，不消费。
  现在那一版不消费任何 RNG **不构成分叉**（key 独立）。
- **`used_jokers` 对消耗品同样生效**（`card.lua:350` 按 name 匹配全体 center），
  但 `Card:remove()`（`card.lua:4829`）会对称清除，所以不是「一局只见一次」。
- **星球的 `softlock`**：Planet X / Ceres / Eris 要对应牌型 `played > 0` 才进池。
  新档星球池 12 个位置、9 张可用。
- **09 号票的「delay 压成 0」本切片仍成立**：5 处里只命中 `card.lua:1472`
  （The Wheel of Fortune），它的三次 RNG 共用 `wheel_of_fortune` 一个 key、
  在一次 `use_consumeable` 里严格 FIFO。**不要把这条带过 17 号票。**
- **`level_up_hand` 现在的实现是错的**：原作是重算（`s_mult + l_mult*(level-1)`）
  且有三个 clamp（level ≥ 0、mult ≥ 1、chips ≥ 0），复刻是增量且无 clamp。
  今天打不出来只因为 `The Arm` 自带 `handLevel > 1` 守卫。**没有上限。**

## 16 号票已交付（2026-09-20）

570 个测试绿，`npm run build` 通。九个提交，从 `b2357617` 到 `0d1b3b52`。
细节在 [16 号票](../.scratch/balatro-复刻/issues/16-消耗品的切片边界.md) 的「交付结果」一节。

**下一个大件是 17 号票（补充包 + 幽灵牌）**——实测把它从「放最后」抬成了关键路径。

## 进度

- 2026-09-20：开 16 号票裁定四件事；第 1–5 步落地，496 个测试绿，`npm run build` 通。
  五个提交：2eb2cebe（levelUpHand）、3d11b915（生成器）、e88c85f5（槽位 + 星球 + 商店）、
  3ee982da（表现层消耗品区）、6b69b615（8 种强化牌）。

**这一轮逮到的两个真 bug**（都不是新写的，是原先就错的）：

1. `levelUpHand` 是增量加减且无 clamp，原作是从 1 级值重算 + 三个 clamp。
2. **`used_jokers` 的语义一直是错的**：复刻件当「本局见过的，永久剔除」，
   原作 `card.lua:4829` 的 `Card:remove()` 有对称清除，重掷商店与离开商店都会走它。
   真实语义是「此刻被摆出来或被持有的 center」。池长度不变但内容窄了 →
   `_resample` 次数对不上 → 同 seed 从第二个商店起分叉。已修（`Shop.release()`）。

**另外两张「有 handler 但效果落空」的小丑**（已开后台任务，不在本票范围）：
`To Do List`（牌型从没被抽过）、`Mr. Bones`（`saved` 标志无人读取）。
两张都被 `isJokerImplemented` 报成已实现——这正是 coverage 那套想挡的漏网形态。

**实测结论（会改计划）**：星球牌**没有**把 Ante 3 的墙推倒。
八个 seed 的贪心深度 2.875 → 3.0。商店两格里只有 ~28.6% 是消耗品、
一半还是塔罗，整局买到 1–5 张，而且抽到哪个牌型不由人挑。
**原作里星球的主要来源是天体补充包**（一包 3 张、Jumbo 5 张）。
→ 17 号票（补充包）从「放最后」抬成关键路径。

## 阻塞

（无）
