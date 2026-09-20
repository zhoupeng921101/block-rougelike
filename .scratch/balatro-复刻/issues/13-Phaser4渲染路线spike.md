# Phaser 4 渲染路线 spike

Type: wayfinder:prototype
Status: open
Blocked by: 01

## Question

把 [Phaser 版本选型与渲染 API 复核](11-Phaser版本选型与渲染API复核.md) 的纸面结论
在真机上验一遍，并重估工作量。

### 做什么

一个最小 Phaser 4 场景，只验四件事：

1. **per-instance uniform 真的独立**。放 40 个 `Shader` GameObject，
   每个传不同的 `time` / `hovering` uniform，确认互不串味。
   纸面证据是 `Shader.js:151` 每实例 `new ShaderQuad`，这里要眼见为实。
2. **移植一个真 shader**。挑 `dissolve.fs`（12 个卡牌特效共享它的 `dissolve_mask()` 与 HSL 模板，
   吃下它等于吃下大半）。重点是 `position()` 的坐标空间重新推导——
   [shader 票](05-shader能否移植到Phaser.md) 判定那是 10% 需要真正动脑的部分。
3. **CRT 全屏链路**。`setForceComposite(true)` + `captureFrame` + 全屏 Shader 采样，
   确认能串起来。
4. **性能**。测 GPU 帧时间。上一张票判断**真正的风险是全屏背景的 fill-rate，不是 draw call**
   （Balatro 原作零合批，一张 foil 牌 5 个 draw call，复刻件打断 batch 是对齐不是倒退）。
   这条判断要证实或推翻。

### 顺带要答的

- 卡牌作为 `Shader` GameObject，**交互 hit area 怎么挂**（`Shader` 不带 Input 组件）
- 深度排序用 `Depth` 组件手工管，40 张牌的开销可接受吗
- `setAlpha` 是 NOOP，淡入淡出全部走 shader uniform——改造量多大

### 产出

- 能跑的 spike 工程（留在 `复刻/` 下的一个子目录或分支，别污染主工程）
- **重估 [shader 票](05-shader能否移植到Phaser.md) 那个 9–16 人日**——
  原估算基于 v3 的 pipeline + Sprite，v4 改成 Shader GameObject 后至少三块要重算
- 上一张票提到 `hologram.fs:58` 要加 `const`（v4 仍是 WebGL1），顺便验掉

预估半天。被 [工程骨架落地](01-工程骨架落地.md) 阻塞——要有工程才能 spike。
