# shader能否移植到Phaser

Type: wayfinder:research
Status: resolved

## Question

Balatro 的视觉核心是 GLSL shader（卡牌全息、箔面、背景流动）。
Phaser 3 的自定义 pipeline 接得住吗？

要查清：

1. 产物里 shader 源码在哪、有几个、分别做什么。
   先从 `参考/产物/Balatro_1.0.1o/源码/engine/` 与 `资源/` 找 `.glsl` / `.fs` / `.vs`。
2. LÖVE 的 shader 方言（`effect()` 入口、`Texel()`、自动注入的 uniform）
   与 Phaser 3 的 pipeline（原生 WebGL fragment shader）差在哪，
   是逐行改写还是要重新推导。
3. Phaser 3 能不能对**单个 sprite** 挂 shader 并传 per-instance uniform——
   Balatro 每张卡的全息参数是独立的，做不到这点外观轴就不成立。
4. 卡牌的 3D 倾斜是 shader 做的还是 CPU 侧算顶点的。

产出：可行性结论 + 移植的工作量量级 + 哪些效果注定做不到 1:1。
「像素级外观」这条轴的成败主要压在这张票上。

## Answer

**Balatro 这一侧：可行。Phaser 那一侧：报告的结论作废，要重做。**

完整报告：[research/05-shader移植.md](../research/05-shader移植.md)（833 行）。

### 成立的部分（关于 Balatro，已复核）

- **19 个 `.fs`**，无 `.vs`——LÖVE 用 `#ifdef VERTEX` 同文件分段。
  12 个卡牌特效共享逐字相同的 `dissolve_mask()` 与 HSL 模板，独特代码其实很少。
- 1782 行里只有**一处**真实的 WebGL1 违规：`hologram.fs:58` 非常量循环边界，加 `const` 即可。
- `skew.fs` 是死文件（Lua 侧零引用），真正在用的是内联进那 12 个 shader 的同一段。
- **3D 倾斜的真相**：既不是 CPU 算顶点也不是 fragment 偏移，而是 vertex 阶段改 `w` 分量
  （`transform_projection * vertex_position + vec4(0,0,0,scale)`），靠透视除法把 quad 掰成梯形。
  GPU 上几乎免费，不需要 3D 库。
- **改写量级约 90% 机械替换**，10% 要重新推导，且全部集中在 `position()`：
  原作把局部 quad 坐标与屏幕坐标直接相减（`dissolve.fs:77-79`），坐标空间不自洽但手调好了。
- **Balatro 原作本身零合批**（`engine/sprite.lua:110-118`，全仓无 `newSpriteBatch`/`newMesh`），
  一张 foil 牌 5 个 draw call。所以复刻件打断 batch 是**对齐，不是倒退**。

### 作废的部分（关于 Phaser）

报告判定「per-instance uniform 可行」，证据是 Phaser 3 的 `onBind(gameObject)` /
`PipelineManager.getPostPipeline()` / `pipelineData`。它还断言模版指向 Phaser 3、
建议为此做选型复核。

**本 session 核实：模版 `phaserjs/template-vite-ts` 的 `package.json` 已经 pin `phaser: 4.0.0`，
npm 的 `latest` 是 4.2.1。** 报告的前提搞反了。

如果报告另一条断言（v4 移除了整个 Pipeline 体系、改为 RenderNode + `setupUniforms`）属实，
那么**判定性问题的那个 YES 是在一套目标工程不会用到的 API 上得出的**，必须在 v4 上重验。
该断言本 session 未能证实（Phaser 官方文档与 changelog 的几个 URL 均 404）。

→ 单开 [Phaser 版本选型与渲染 API 复核](11-Phaser版本选型与渲染API复核.md)，并让它阻塞
[工程骨架落地](01-工程骨架落地.md)——骨架要 pin 哪个 Phaser 版本，取决于这张票。

### 另一条重大发现（已复核，但数字要更正）

**这份产物是移动版构建。** `源码/version.jkr` 写着 `1.0.1o-FULL [M]` / `PROD_mobile`，
`源码/info.txt` 是 `Singular-v12.11.0`、构建于 2026-01-26。已核实。

两处后果，报告说对了方向但**有一个数字错了**：

| 项 | 报告说 | 实际（`globals.lua:231`） |
|---|---|---|
| CRT 强度 | 移动 **9** / 桌面 70 | 移动 **30** / 桌面 70 |

卡牌倾斜那条**成立但归因要修正**：`touch_collide_tilt` 全仓只在三处设置——
`UI_definitions.lua:4111`、`:5975`（盲注）与 `tag.lua:512`（标签），
**`Card` 上从不设置**。所以本产物里**卡牌恒不倾斜，但盲注与标签会倾斜**。
注意这个标志并没有被 `F_MOBILE` 门控，所以「因为是移动版所以关了」是报告的推断，不是源码写的；
桌面版是否不同，本产物答不了。

→ 「像素级外观」对齐哪个基准，单开 [外观基准是移动版还是桌面版](12-外观基准是移动版还是桌面版.md)。

### 注定做不到 1:1 的

预乘 alpha 语义差异（可用 `vec4(c.rgb*c.a, c.a)` 数学等价改写，非近似）、
`hologram.fs` 的 9×9 采样循环要改常量上界、
CRT 的 bloom/glitch 在原版就是死代码（`bloom_fac=0`）、
顶点倾斜幅度只能调参逼近而非公式等价。报告 §6 逐条给了「差在哪 / 肉眼看不看得出 / 有没有绕法」。

### 工作量

9–16 人日，最大不确定性是倾斜手感对齐（3–5 天）。**此数字基于 Phaser 3 的 API，需随
[选型复核](11-Phaser版本选型与渲染API复核.md) 重估。**
