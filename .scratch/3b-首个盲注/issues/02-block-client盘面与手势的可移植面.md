# 02 · block-client 盘面与手势的可移植面

Type: wayfinder:research
Status: resolved

## Question

工程计划裁了「移植 block-client 的盘面核心（位棋盘、形状、消行判定，已是纯 C#）和拖拽落子、消除表现；计分按 3B 重写」。
落到文件上，**哪些能原样拷、哪些要裁、哪些得重写**，每一刀切在哪？

要盘清三层（block-client = `E:\TEngine_block\UnityProject`，下列路径相对 `Assets/GameScripts/HotFix/GameLogic/`）：

1. **纯核心** `Module/BlockBlast/Core/`（BinaryBoard、BlockShape、BlockShapeMap、ClearResult、Vec2Int）与 `Module/BlockBlast/PortableRng.cs`：
   有没有隐性依赖；71 个形状里七种四格骨牌（I O T S Z J L）各是哪个 id，四档旋转是否覆盖全部朝向。
2. **玩法层** `Module/BlockBlast/`（BoardLayers、PendingPiece、BoardHandDealer、BoardClearer、BoardPlayFlow、BlockGameState、MoveScoring 等）：
   哪些概念能直接借（格层、候选块的元素编号、一步推进的结果对象），哪些绑死了订单、服务端发牌、合成玩法。
3. **表现层** `UI/GameUI/`（BoardGestureFlow、BlockPieceDragger、TrayAreaPart、BoardAreaPart，及 BoardGeometry、BoardCellRenderer、BoardFxDirector、BoardPreviewLayer）：
   每个类的上游依赖，用到的 prefab、图集、特效资源，触屏专属的假设（拇指 offset、多点触控互斥），搬进 `Demo/` 要先断哪些线。

产出：一张移植清单（文件 → 拷 / 裁 / 重写 / 不要，附理由与行数），外加资源清单。只读，不改 block-client。

## Answer

- **纯核心原样拷。** `Core/` 五个文件加 `PortableRng.cs` 单独链进 net8.0、按 C# 9 编译，0 警告 0 错误，没有隐性依赖。要改的只有一处：死格。`BinaryBoard` 只有一张掩码，`ShapeMask` 又是 private，得补一个「额外挡格」的落子判定入口。
- **骨牌 id**：I 17/7，O 9，T 10/20/26/25，S 14/16，Z 18/19，J 8/31/30/29，L 33/42/34/32（按顺时针转的 rot0→rot3 列出）。
  - 四档旋转覆盖全部朝向，四格形状正好这 19 个。
  - `BlockShapeMap` 建议裁到这 19 条、id 不变。裁完后每块的线数上界从 10 变成 5，与规则 §3.3 一致。
- **玩法层没有能原样拷的文件。** 能借四个做法：
  - 平行格层，所有清格只走一个口子（`BoardLayers.ClearCellAt`）；
  - 按原始朝向给格编号，正本在 `BoardHandDealer.PlaceShape`；
  - `PlaceOutcome` 式的一步推进结果；
  - 卡死判定 `IsBoardJammed`，对应规则里「怎么转都放不下」的失败条件。
  - 其余代码绑死了体力、订单、服务端发牌、特殊方块和奖励方块。
- **更正地图**：`PendingPiece.Elements` 已在 b4a37eb0e 删掉，现在只剩 `AnchorCellIdx`。编号口径没变，三处注释是过期的。
- **表现层**：
  - `BoardGeometry`、`BlockPieceDragger`、`BlockPart` 拷；
  - `BoardAreaPart`、`BoardCellRenderer`、`BoardFxDirector`、`BoardPreviewLayer`、`TrayAreaPart` 各裁掉三到五成，`TrayAreaPart` 的槽数要从写死的 3 改成 3–5；
  - `BlockLayout` 是竖屏常量，重写；
  - `BoardGestureFlow` 1108 行里只有约 310 行和 3B 有关，按段摘抄重写，不在原类上删。
- **只适合触屏的假设**：块悬在手指上方 180、点一下转向、位移倍率、多点互斥。PC 上的**必改项**：拖拽器不分鼠标按键，右键也能把块拖起来。
- **Demo 缺件**：`ExImage`、`UICanvasSpace`、`ScalePunch`、`RotateFx`、`GlowPulse`、`FxPace`。`UIPreloader` 建议不搬，把 6 个按名取模板的调用点改成序列化引用。`UIPartFactory` 与 Part 模式可以直接接上。
- **资源**：搬 `BlockPart`、`TraySlot`、`ClearFill`、`ClearGlow` 四个 prefab，`UI_GlowCell` 和 `UI_Brighten` 两个 shader，粒子 `ClearBurstFx` 可选。DragonBones、序列帧和 Spine 特效**一律不搬**：block-client 自己记的是「复刻自参考源码」，属于竞品素材，3B 又是商业产品。

详细记录见 [02-可移植面](../research/02-可移植面.md)。

> **后续（2026-10-28，[31](31-动物乐园的表现特效与音效.md)）**：「DragonBones、序列帧和 Spine 特效一律不搬」被推翻。用户声明团队对 Block 1.3.28 与 Cocos 参考工程两处的美术有使用权、持有 Spine Editor 许可，外来骨骼与 Spine 当占位搬，落子轮廓序列帧仍不带。两个 shader 已查清是团队自写。
