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

- [ ] 1. `levelUpHand` 修正：`HandInfo` 补 `s_chips`/`s_mult`，改成重算 + 三个 clamp
- [ ] 2. `tools/gen-consumable-centers.mjs` 抽 `c_` 的 center
- [ ] 3. 消耗品槽位（`consumable_slots = 2`）+ `Run` 持有 + 商店真的卖消耗品（补 `Tarotsho`/`Planetsho` 掷点）
- [ ] 4. 星球牌 12 张 ← **中途要停就停在这之后**（Ante 3 的墙在这里破）
- [ ] 5. 强化牌 8 种（`m_glass` / `m_lucky` 带 RNG）
- [ ] 6. 塔罗牌 22 张
- [ ] 7. 回填 13 张小丑，删 `coverage.test.ts` 对应行

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

## 进度

- 2026-09-20：读完交接与 map，开了 16 号票并裁定四件事。尚未动代码。

## 阻塞

（无）
