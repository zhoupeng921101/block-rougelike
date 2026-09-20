# goal 状态

工作目录 `E:\block-rougelike`，复刻件在 `复刻/Balatro/`。分支 `main`。

## 目标条件

Balatro 复刻件接上**补充包系统**，按 [17 号票](../.scratch/balatro-复刻/issues/17-补充包与幽灵牌的切片边界.md)
的落地顺序推进。**首要目标是破 Ante 3 的墙**——16 号票实测证明商店供不起星球，
天体补充包才是星球的主要来源。

每一步收尾时 `npm test` 与 `npm run build` 必须全绿；每轮有实质进展就更新本文件。

## 验证方式

```bash
cd 复刻/Balatro && npm test && npm run build
```

破墙的验收：贪心策略的深度实测（16 号票那次是八个 seed 2.875 → 3.0）。
天体包接上之后再测一次，**深度没涨就是没破**。

## 落地顺序（17 号票裁定）

- [x] 1. 生成器抽 32 个补充包 center（commit 6f6a41d0）
- [x] 2. 商店第三/四格 + `shop_pack<ante>` 的账 + 开包状态机（commit fa4d6f93）
- [x] 3. 天体包 + 奥秘包（同上）——**墙松动了没破，见下**
- [x] 4. 小丑包（同上）
- [x] 5. 版本 4 种 + `The Wheel of Fortune`（commit f9081a45）
- [ ] 6. 蜡封 4 种 + 标准包
- [ ] 7. 幽灵牌 18 张 + 幽灵包 → 回填 5 张小丑

## 关键事实（压缩后最先丢，优先保留）

- **补充包是商店的第三、四格**：`G.shop_booster` 的 `card_limit = 2`，两格。
  生成在小丑那两格**之后**（`game.lua:3473` 小丑 → `:3487` 优惠券 → `:3507` 补充包）。
- **每格消费一次 `shop_pack<ante>`**（`get_pack` 里 `pseudoseed('shop_pack'..ante)`），
  **但第一个商店只消费一次**：`get_pack` 开头有
  `if not G.GAME.first_shop_buffoon then ... return p_buffoon_normal_N end`，
  那条路**提前 return、不掷点**，且用的是 `math.random(1,2)`（全局流，不是 pseudoseed）。
  所以**第一个商店的第一格恒是小丑包**。
- **补充包不参与重掷**：`reroll_shop` 只清 `G.shop_jokers`。
  包的 key 存在 `G.GAME.current_round.used_packs`，买掉就置 `'USED'`。
- **权重总和 22.42**，池子按 `order` 排（奥秘 1-8 / 天体 9-16 / 标准 17-24 /
  小丑 25-28 / 幽灵 29-32），选中判据是 `it >= poll and it - weight <= poll`。
- **包里造牌 `soulable = true`**（16 号票查明商店路径传的是 nil，这里不一样）：
  - 奥秘包传 `_type = 'Tarot'` → 一次 `soul_Tarot<ante>`
  - 天体包传 `'Planet'` → 一次 `soul_Planet<ante>`（只有 Black Hole 那一支）
  - 幽灵包传 `'Spectral'` → **两次** `soul_Spectral<ante>`（两支都跑）
- **`Card:open` 里的顺序**：先把造牌事件入队（delay 1.3），
  再**同步**跑 `open_booster` 的小丑遍历（`card.lua:1799`）。
  队列后 drain，所以 **`Hallucination` 的塔罗先造出来、包里的牌后造**。
  这个顺序有观测后果：Hallucination 造的那张会标 `used_jokers`，改包里那几张的池子内容。
- **delay 仍可压成 0**，只要守住上面那个顺序：包里 `_size` 张牌在**同一个**
  事件的 for 循环里造，键互不相同（`ar1` / `pl1` / `spe` / `sta` / `buf`）。
- **`Red Card` 是第三张「有 handler 但长不了」的小丑**：它的 MAIN 半边
  （读 `ability.mult`）在，但 `skipping_booster` 那半边没有调用方，
  所以 mult 永远是 0、`flatMult` 恒返回 null。补充包接上就顺带修好。

## 进度

- 2026-09-20：16 号票已交付。17 号票第 1–5 步落地，**653 个测试绿**，
  `npm run build` 通。三个提交：6f6a41d0 / fa4d6f93 / f9081a45。
  小丑覆盖面 **120 / 150**，消耗品 **34 / 34**（The Wheel of Fortune 补上了）。

**第 3 步的实测（17 号票钉进计划里的那一次）**：
八个 seed 的贪心深度 **2.875 → 3.25**，整局用掉的星球 **2 → 3.5** 张。
**方向对了但墙没破**——一个天体包一次给 3 张（Jumbo 5 张），
而商店整局才 1–5 张，供给确实上来了；但贪心仍停在 Ante 3–4。
剩下的差距里有多少是内容（标准包／幽灵包／强化牌那 9 张小丑）、
有多少是策略（贪心不挑手牌所以塔罗基本用不出来、买小丑不挑好坏），现在说不清。

**这一轮新逮到的**：`Red Card` 是第三张「有 handler 但长不了」的小丑——
它读 `ability.mult` 的那半边一直在，但 `skipping_booster` 那半边没有调用方。
接上开包流程就顺带修好了。

## 上一票（16 号票，已交付）

消耗品槽位 + 12 张星球 + 21/22 塔罗 + 8 种强化牌，570 个测试绿。
提交范围 `b2357617..bc7a6bdb`。细节见
[16 号票](../.scratch/balatro-复刻/issues/16-消耗品的切片边界.md) 的「交付结果」。

**那一轮最贵的一条**：`/code-review high` 逮到**两整张 handler 表没有调用方**
（`context.after` 与 `using_consumeable`），而覆盖面机制照样把它们报成已实现。
→ **加新 context 表时，把「谁来调它」和 handler 一起写。**

## 阻塞

（无）
