# Balatro shader 能搬进 Phaser，但倾斜要重推

Ticket: `issues/05-shader能否移植到Phaser.md`
Type: wayfinder:research
Map: `map.md`
日期: 2026-09-20

---

## 1. 可行性结论

### **可行，但有代价。**

Balatro 1.0.1o 的 19 个 GLSL shader 可以整体移植到 Phaser 3 的自定义 pipeline，
「像素级外观」这条轴**在 shader 层面成立**。代价集中在三处：
顶点倾斜的坐标空间要重新推导（不是逐行翻译）、
per-instance uniform 必然打断 batch（40 张卡 ≈ 40 次 draw call）、
以及**选型层面的 Phaser 3 已终结**（见 §7.2，这条风险比 shader 本身大）。

**三条最关键的支撑证据：**

1. **这批 shader 早就是 WebGL1 语法。** 19 个 `.fs` 全部没有 `#pragma language glsl3`，
   LÖVE 默认方言即 GLSL 1.20 / GLSL ES 1.00 —— 正好是 WebGL 1 的语法级别
   （[wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)）。
   静态扫描全部 1782 行，**只找到一处真实的 ES 1.00 违规**：
   `hologram.fs:58` 的 `MY_HIGHP_OR_MEDIUMP int glow_samples = 4;` 被当成循环边界
   （`hologram.fs:63-64`），加个 `const` 即可。
   而且 Balatro 作者自己在每个文件头复制了 `MY_HIGHP_OR_MEDIUMP` 宏
   （与 LÖVE 的 `LOVE_HIGHP_OR_MEDIUMP` 定义逐字相同），说明**这批 shader 被按 ESSL 1.00 约束写过一遍**。

2. **LÖVE 的「方言」不是编译器魔法，是一段纯文本 `#define` 前缀。**
   `#define extern uniform` / `#define number float` / `#define Image sampler2D`，
   而 `Texel` 就是 `texture2D`，全部可在 LÖVE 11.5 的 `wrap_GraphicsShader.lua` 里逐字读到。
   Balatro 的 19 个文件里 `love_PixelColor`、`VaryingTexCoord`、`VaryingColor`、`MainTex` 出现 **0 次**，
   `extern` 的 160 处声明**全是标量/向量/布尔，无矩阵、无采样器、无数组**。
   接口面小到可以写一个 200 行脚本一次转完。

3. **per-instance uniform 是 YES，且有官方 hook。**
   `onBind(gameObject)` 的官方定义逐字是
   "called every time a Game Object asks the Pipeline Manager to use this pipeline, **even if the pipeline is already active**"，
   用途明写 "per-object set-up, such as loading shader uniform data"
   （[WebGLPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.WebGLPipeline.html)）。
   Balatro 本身就是**零合批**（`sprite.lua:110-118` 每次 draw 都 `setShader` → 画 → 复位，
   全仓无 `newSpriteBatch` / `newMesh`），所以 Phaser 侧付出同样的 draw call 数**不是倒退，是对齐**。

**代价的具体形状**：`position()` 顶点段里 Balatro 把**局部 quad 像素坐标**与**屏幕像素坐标**直接相减
（`dissolve.fs:77-79`），这在 LÖVE 下是一个坐标空间不严谨但被手调好的经验公式。
Phaser 的 `inPosition` 是**世界坐标**，语义不同，照搬会得到错误的倾斜幅度与方向。
这是 19 个文件里**唯一需要重新推导**的部分（约占总工作量的三分之一，见 §8）。

---

## 2. shader 清单：19 个 `.fs`

证据目录：`E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\shaders\`（只读）。
`find` 扫描整个 `资源/` 只返回这 19 个 `.fs`，**不存在 `.vs`/`.vert`/`.glsl`** ——
LÖVE 允许 vertex 与 fragment 写在同一文件用 `#ifdef VERTEX`/`#ifdef PIXEL` 分段，
Balatro 全部如此，不是资源提取丢失。

难度分级依据三项：**代码复用率**（12 个卡牌 shader 共享同一份 `dissolve_mask()` 与 HSL 模板）、
**WebGL 兼容风险**、**是否有社区现成移植**。

| Shader | 做什么 | 类型 | 难度 | 备注 |
|---|---|---|---|---|
| **dissolve.fs** | 卡牌**默认** shader：域扭曲噪声场 + 阈值切边 + 两色烧灼边，兼做阴影 | 卡牌特效 + vertex | **中** | 85 行，是整套的**模板母版**。它的 `dissolve_mask()` 被另外 11 个逐字节复用；含 hover 倾斜 vertex 段。**先做这个，后面 11 个几乎白送** |
| **foil.fs** | 蓝色锡箔：同心环 + 方向性角度带 + 两条轴向条纹，四层叠加压向蓝色 | 卡牌特效 + vertex | **中** | 142 行。`dot(rotater,adjusted_uv)/(len*len)` 在卡面正中心 **0/0 → NaN**，需补 `max(len,1e-5)`。有 Godot 4.4 与 Shadertoy 现成参考（[godotshaders 版](https://godotshaders.com/shader/balatro-foil-card-effect/)） |
| **holo.fs** | Holographic：HSL 色相被噪声场 + 三向网格线同时推动 | 卡牌特效 + vertex | **中** | 151 行。HSL 里 `delta == .0` 浮点等值比较（`RGB()` 用 `c.y < 0.0001`）。有 Shadertoy 参考（[XfKfDc](https://www.shadertoy.com/view/XfKfDc)） |
| **polychrome.fs** | 整卡色相按噪声场整体偏移 + 饱和度拉高 | 卡牌特效 + vertex | **中** | 149 行，与 holo 共享 HSL 模板 |
| **negative.fs** | HSL 明度反相 + 色相镜像 + 加一层蓝灰底 | 卡牌特效 + vertex | **易** | 132 行；**替换底图**而非叠加（`card.lua:4419-4423`） |
| **negative_shine.fs** | 负片卡的流光 | 卡牌特效 + vertex | **易** | 97 行，与 booster/voucher 逐字同构，只系数不同 |
| **booster.fs** | 补充包卡面蓝紫流光（5 条正弦叠加） | 卡牌特效 + vertex | **易** | 97 行，模板复制 |
| **voucher.fs** | 券/贴纸流光 | 卡牌特效 + vertex | **易** | 97 行，模板复制。用得最多（seal、eternal/perishable/rental 贴纸、Invisible Joker 都走它） |
| **debuff.fs** | 去饱和压暗 + 画红色 X | 卡牌特效 + vertex | **易** | 148 行。**唯一一个 `dissolve_mask` 内部没加 `MY_HIGHP` 修饰的**，改写脚本要容忍这个差异 |
| **played.fs** | 已打出的牌：降饱和降亮度 + alpha 减半 | 卡牌特效 + vertex | **易** | 129 行。`played.r` 只做 `0.000001*played.r` 占位乘法，实际无用 |
| **gold_seal.fs** | 金色蜡封流动高光（单次采样 + 两条正弦条纹） | 卡牌特效 | **易** | 27 行，**最适合首批移植的验证样本**。无 vertex 段 |
| **hologram.fs** | 稀有 Joker 的灵魂浮层：9×9 邻域 alpha 辉光 + 水平 glitch 行偏移 + 青绿描边 | 卡牌特效 + vertex | **难** | 128 行。**唯一的 WebGL1 硬阻塞**（非常量循环边界，`hologram.fs:58/63/64`）+ **81 次纹理采样/像素**（全 19 个里最贵）+ `glow /= 0.7*float(actual_glow_samples)` 可能除零（`hologram.fs:72`） |
| **flame.fs** | Joker 火焰（程序化火苗，5 次迭代域扭曲 + 双色渐变），**不采样贴图** | 卡牌特效（程序化） | **中** | 68 行。`id` 是 per-instance 随机种子。`mod(4.*time, 10000.)` 在 mediump 下精度崩塌。**无公开 WebGL 移植先例** |
| **background.fs** | 主菜单/牌桌动态背景：像素化 → 极坐标漩涡 → 5 次迭代油画域扭曲 → 3 色混合 | 全屏背景 | **易** | 51 行，但 **fill-rate 最重**。已有至少 5 个独立移植：[Shadertoy XXtBRr](https://www.shadertoy.com/view/XXtBRr)、[WXGBWm（优化版）](https://www.shadertoy.com/view/WXGBWm)、[w3lGzH](https://www.shadertoy.com/view/w3lGzH)、[Godot 版](https://godotshaders.com/shader/balatro-background-shader/)、[HLSL 版](https://github.com/Hammster/windows-terminal-shaders/blob/main/balatro.hlsl) |
| **splash.fs** | 开场/过场烟雾漩涡 + mid_flash 白闪 | 全屏背景 | **易** | 55 行，与 background 同一套算法 |
| **flash.fs** | 全屏白色闪光（径向、两段触发） | 全屏背景 | **易** | 22 行，全 19 个里最简单 |
| **CRT.fs** | 全屏后处理：桶形畸变、边缘羽化、横向色差、扫描线网格、对比度校正（+ 死掉的 glitch 与 bloom） | 后处理 | **中** | 153 行，但**去掉两段死代码后只剩 3 次采样 + 十来个 sin/cos**。第 1 行 `__VERSION__ > 1` 是笔误（其余 18 个都是 `> 100`），需改回。无 Balatro 专用先例，[rex Horri-fi](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shader-horrifi/) 可做脚手架 |
| **vortex.fs** | **纯 vertex**：卡牌顶点按极坐标绕屏幕中心旋进漩涡（开局/结算） | vertex | **中** | 28 行，无 `effect()`。依赖「顶点已是屏幕像素坐标」这一约定 → 与倾斜同一个坑。无公开移植先例 |
| **skew.fs** | **纯 vertex**：hover 伪 3D 倾斜的独立母版 | vertex | **易（可跳过）** | 23 行。**Lua 源码零引用**（`grep -rn "skew" --include=*.lua` 无输出），是死文件；其内容已逐字内联进 12 个卡牌 shader + CRT.fs。移植时不需要单独实现它 |

### 三个共享代码块（只需实现一次）

- **`dissolve_mask(vec4 tex, vec2 texture_coords, vec2 uv)`** —— 出现在 12 个卡牌 shader，**逐字节相同**
  （debuff.fs 少一个精度修饰）。核心是 3 组正弦/余弦域扭曲组成的噪声场。
- **`hue()` / `RGB()` / `HSL()`** —— 手写的 HSL↔RGB 转换，出现在
  foil / holo / polychrome / negative / debuff / played 共 6 个文件，逐字相同。没有用任何内建色彩函数。
- **hover 倾斜 vertex 段** —— 出现在 12 个卡牌 shader + CRT.fs（CRT 的系数是 `0.002`，小 100 倍，
  因为它作用在整块屏幕上）。

**实际「独特代码」极少。** 19 个文件的真实工作量接近 **7 个独立 shader**
（dissolve、foil、holo/polychrome、hologram、flame、background、CRT）+ 一批参数变体。

### WebGL 兼容性逐条结论（全部为静态扫描实测）

零命中的危险特性：`dFdx`/`dFdy`/`fwidth`（0 处）、`texture2DLod`/`textureLod`（0）、
`gl_FragData[]` 多渲染目标（0）、动态下标数组索引（0，只有常量 `tex[3]`）、
`while`/`do-while`（0）、整数取模 `%`（0）、`in`/`out` 限定符（0）、`#pragma`（0）。

真实风险点只有四条，见 §6。

---

## 3. 【判定性】per-instance uniform 能不能成立

# **YES。**

Phaser 3 能对单个 sprite 传独立 uniform，有两条互不相同、都被官方源码坐实的路径。
**「像素级外观」这条轴在这一点上不会被卡死。**

### 3.1 源码级证据

**(a) 路的证据 —— `onBind` 就是为此设计的 hook**

官方对 `onBind(gameObject)` 的定义逐字：
> "This method is called every time a **Game Object** asks the Pipeline Manager to use this pipeline,
> **even if the pipeline is already active**." 用途："per-object set-up, such as loading shader uniform data"
> （[WebGLPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.WebGLPipeline.html)）

`onBatch(gameObject)` 在 quad **已加入 batch 之后**立即调用，官方明写「你可以安全地在其中调用 flush」。
`MultiPipeline.batchSprite()` 在方法最开头调用 `this.manager.set(this, gameObject)`（触发 `onBind`），
并围绕批处理调用 `preBatch` / `postBatch`
（[MultiPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/pipelines/MultiPipeline.js)）。

社区已验证的最小写法：

```ts
onBind(gameObject) { super.onBind(); this.set1f('uSeed', gameObject.pipelineData.seed); }
onBatch(gameObject) { if (gameObject) { this.flush(); } }
```

（[Phaser Discourse #13666](https://phaser.discourse.group/t/custom-pipeline-settings-uniforms-per-object/13666)）

**顺序是硬要求**（推论，但由论坛提问者的故障现象反证）：
必须 **先设 uniform → 写顶点 → 立刻 flush**。
只在 `onBind` 设值而不 flush，后一个对象的 `onBind` 会在前一个对象顶点还在 buffer 里时覆盖 uniform，
结果是「所有卡拿到最后一张卡的参数」。

**(b) 路的证据 —— 每个 PostFXPipeline 都是独立实例**

`PipelineManager.getPostPipeline()` 的关键行逐字：

```js
var newPipeline = new instance(this.game, config);
newPipeline.name = pipelineName;
if (gameObject) { newPipeline.gameObject = gameObject; }
this.postPipelineInstances.push(newPipeline);
```

（[PipelineManager.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/PipelineManager.js)）
→ 每次 `setPostPipeline()` 都 `new` 一个全新实例，uniform 天然隔离。
而 render target 是**四张全局共享的**（fullFrame1/2、halfFrame1/2，来自 UtilityPipeline），
所以 40 张卡各挂一个实例**不会产生 40 张 FBO**，显存安全。

### 3.2 代价：per-instance uniform 必然打断 batch

Phaser 作者自己在 Dev Log 里用数据承认：

> "it becomes expensive for the GPU to keep setting uniforms...
> **WebGL is unable to batch together these sprites because it has to draw them between each call**"

同一场景实测：attribute 方案 = "**7 gl operations** for the whole Scene and **1 draw call**"；
uniform 方案 = "**128 draw calls**"（[Phaser Dev Log 246](https://phaser.io/devlogs/246)）。

**但这个代价对本项目是可接受的**，因为 Balatro 原作本身就是零合批：
`Sprite:draw_shader`（`engine/sprite.lua:73-125`）的结构固定是
「送一批 uniform → `setShader` → 画一次 → `setShader()` 复位」，
`Sprite:draw_self`（`sprite.lua:148-156`）就是一次 `love.graphics.draw`，
全仓无 `newSpriteBatch` / `newMesh` 命中。
一张普通扑克牌最少 **3 个 draw call**（阴影 + center + front），
一张 foil 扑克牌 **5 个**，一张带 Gold seal + eternal 贴纸的 foil 小丑约 **7 个**。
牌局一帧推算 **62–110 次带 shader 的 draw call**（推论；依据 `cardarea.lua` / `card.lua` 的结构估算，
源码里没有 draw call 计数器）。
Phaser 侧复刻这个量级，**是对齐而非倒退**。

### 3.3 四条路线的评估与推荐

| 方案 | 机制 | 可行性 | 代价 | 推荐度 |
|---|---|---|---|---|
| **(a) `pipelineData` + `onBind`/`onBatch` 里 `setXf()` + `flush()`** | 一个共享 pipeline 实例，渲染每个 GO 时读它的 `pipelineData` 改 uniform 后手动 flush | **确定可行**，官方 hook 定义即为此场景 | 每卡 1 draw call；需自写 pipeline 类、自管 flush 时机 | ★★★★★ **首选**。与 Balatro 原作的 `send()` 语义一一对应，uniform 送值时序可直接照抄 `sprite.lua:97-107` |
| **(b) 每 GO 一个 `PostFXPipeline` 实例** | `setPostPipeline(MyFX)`，源码确认每次 `new` 新实例 | **确定可行**，uniform 天然隔离 | 每对象 ≥2 draw call + FBO 切换；render target 按全屏尺寸走，小卡片浪费 fill-rate | ★★★☆☆ 做 spike / 快速出效果时用；不占 `setPipeline` 槽是隐性优点 |
| **(c) per-instance 数据塞进 vertex attribute** | 扩展 batch 的 vertex layout，`batchQuad` 时逐顶点写入 | **可行且性能最好**（官方 128→1 draw call 的那条路） | 要重写 `batchSprite` / 顶点写入；每个标量写 4 次浪费带宽；受 `MAX_VERTEX_ATTRIBS` 限制 | ★★☆☆☆ **本项目用不上**（只有几十张卡）；但**这条路顺带解决倾斜的坐标空间问题**（见 §5），所以别完全排除 |
| **(d) `Phaser.GameObjects.Shader`** | 每实例自带完整 uniform 集合 | 可行，API 最直白 | 官方明写 "halting the current pipeline... **use these sparingly**"；**不能直接改 alpha / blendMode** | ★★☆☆☆ 只用于 **1 个全屏背景 quad**；卡面绝不要用（会把卡片底图/边框/文字的 batch 切碎，draw call 反而比 (a) 更多） |

### 3.4 落地建议

- **卡面全部走 (a)**：一个统一的卡牌 pipeline 基类，19 个 fragment 变体，
  `pipelineData` 里放一个 plain object，`onBind` 里做 10–11 次 `setXf`，`onBatch` 里 flush。
  这与 `sprite.lua:97-107` 的 10 + 1 个 uniform 是一一对应的。
- **全屏背景走 (d) 或「空 Image + 自定义 pipeline」**：背景是最底层唯一对象时，(d) 的强制 flush 实际只有 1 次。
- **CRT 走 `camera.setPostPipeline()`**：成本固定 1 次，与卡牌数量无关。

### 3.5 per-card uniform 清单（照抄用）

标准分支固定送 **10 个 uniform + 1 个与 shader 同名的 `vec2`**（`sprite.lua:97-107`）。
第 11 项的机制是 `if _send then G.SHADERS[_shader]:send(_shader, _send) end` ——
**uniform 名 == shader 文件名**，所以文件名不能随便改。

| uniform | 类型 | 性质 | 值来源 |
|---|---|---|---|
| `mouse_screen_pos` | vec2 | 可能 per-card | `tilt_var.mx/my * G.CANV_SCALE`，无 tilt_var 时退回全局光标（sprite.lua:94-97） |
| `screen_scale` | float | 近全局，乘了 `mouse_damping` → 可能 per-card | sprite.lua:98 |
| `hovering` | float | per-draw | sprite.lua:99（**本构建恒 0，见 §7.1**） |
| `dissolve` | float | per-card | `math.abs(_draw_major.dissolve or 0)`，sprite.lua:100 |
| `time` | float | **per-card 常量种子** | `123.33412*(card.ID/1.14212) % 3000`，sprite.lua:101 |
| `texture_details` | vec4 | per-sprite | `get_pos_pixel()` = 图集格子 `{x, y, px, py}`，sprite.lua:102 |
| `image_details` | vec2 | per-atlas | `get_image_dims()` = 图集总尺寸，sprite.lua:103 |
| `burn_colour_1/2` | vec4 ×2 | per-card | `dissolve_colours` 或 `G.C.CLEAR`，sprite.lua:104-105 |
| `shadow` | bool | per-draw | `(not not _shadow_height)`，sprite.lua:106 |
| `<shader 同名>` | vec2 | per-card | `.x` = `min(VT.r*3,1) + REAL/28 + juice.r*20 + tilt_var.amt`；`.y` = `G.TIMERS.REAL`（card.lua:4356-4358） |

**最反直觉的一条：`time` 不是全局时钟，是每卡恒定的随机种子。**
这意味着 dissolve 的噪声图案在每张卡上是**静止的**，溶解动画完全由 `dissolve` 值的变化驱动，噪声场本身不动。
**移植时若误接成全局时钟，溶解会变成「沸腾」，视觉完全不对。**
同理，这也是「每张 foil 卡流光不同步」的来源，不能省。

`texture_details` / `image_details` 必须传：shader 靠它把图集全局 UV 换算成单卡格子内的局部 UV
（LÖVE 的 quad 采样给的是图集全局 UV，Phaser 用 texture atlas 时同理）。

---

## 4. LÖVE 方言 → WebGL 的改写

**结论：约 90% 是逐行改写（可脚本化），10% 需要重新推导，且这 10% 全部集中在 `position()` 顶点着色器。**

### 4.1 机械替换对照表

LÖVE 的「方言」是一段纯文本 `#define` 前缀 + 一个固定的 `main()` 包装，
全部可在 [wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)
里逐字读到（494 行，没有其它隐藏注入）。

| # | LÖVE 11.x 写法 | WebGL 1 (GLSL ES 1.00) 等价写法 | 机械度 |
|---|---|---|---|
| 1 | `extern` | `uniform` | 纯替换（sed） |
| 2 | `number` | `float` | 纯替换 |
| 3 | `Image` | `sampler2D` | 纯替换 |
| 4 | `Texel(tex, uv)` | `texture2D(tex, uv)` —— **不含任何 gamma / sRGB 处理** | 纯替换 |
| 5 | `MainTex` | `uMainSampler`（PostFX）/ `uMainSampler[0]`（MultiPipeline） | 纯替换（改名） |
| 6 | `love_PixelColor = c;` | `gl_FragColor = c;` | 纯替换（Balatro 0 处命中） |
| 7 | `vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords){...return c;}` | `void main(){ vec4 color = outTint; vec2 texture_coords = outTexCoord; vec2 screen_coords = ...; ... gl_FragColor = vec4(c.rgb*c.a, c.a); }` | 机械（统一模板） |
| 8 | `VaryingTexCoord` | `varying vec2 outTexCoord`（LÖVE 是 vec4，取 `.st`） | 机械 |
| 9 | `VertexTexCoord` / `VertexColor` | `attribute vec2 inTexCoord` / `attribute vec4 inTint` | 机械 |
| 10 | `love_ScreenSize` | 自建 `uniform vec4 love_ScreenSize`，传 `(w, h, ±1, 0 或 h)` | 机械（自己送值） |
| 11 | `love_PixelCoord` | **原样保留宏** `#define love_PixelCoord (vec2(gl_FragCoord.x, gl_FragCoord.y*love_ScreenSize.z + love_ScreenSize.w))` | 零改动 |
| 12 | `#ifdef PIXEL` / `#ifdef VERTEX` | 拆文件后展开为「保留/删除」，或两个文件顶部各补一个 `#define` | 机械 |
| 13 | `__VERSION__` / `GL_FRAGMENT_PRECISION_HIGH` | 都是 WebGL1 标准宏，直接保留 | 零改动 |
| 14 | `MY_HIGHP_OR_MEDIUMP` | Balatro 自己定义的，不依赖 LÖVE，原样保留 | 零改动 |
| 15 | `gammaCorrectColor(x)` | 未开 gammacorrect 时 = `(x)`，直接删 | Balatro 0 处命中 |
| 16 | blend：`alpha` + `alphamultiply` | 输出改预乘 `vec4(c.rgb*c.a, c.a)`，Phaser 用默认 NORMAL | **可证等价的改写** |
| 17 | `int n = 4; for(i=-n;i<=n;++i)` | `const int n = 4;`（仅 `hologram.fs`） | 一行修 |
| 18 | `vec4 position(mat4 transform_projection, vec4 vertex_position)` | 拆到独立 `.vert`；写 `gl_Position` | **半机械，语义不同 → §4.3** |

**第 1–7 条 + 第 10、16 条可以写成一个 200 行的转换脚本，一次处理完 19 个文件。**
另一条必做的结构改动：LÖVE 会把同一份 `.fs` 编译两遍（一遍定义 `PIXEL`、一遍定义 `VERTEX`），
移植时**必须拆成 `.vert` + `.frag` 两个文件**，各自只保留该 stage 用到的函数。

### 4.2 三个不要搞错的细节

**UV 不用翻。** LÖVE 和 Phaser 都是「左上 (0,0)、右下 (1,1)」，且都不做 `UNPACK_FLIP_Y`：
Phaser 的 `createTexture2D` JSDoc 写 `[flipY=false]`，`Multi.vert` 里是 `outTexCoord = inTexCoord;`
（[Multi.vert](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/Multi.vert)）。
Phaser 的投影是 `ortho(0, width, height, 0, ...)`，Y 向下、原点左上，与 LÖVE 相同。

**`screen_coords` 要翻，但按渲染目标分别决定。**
WebGL 的 `gl_FragCoord.y` 永远从**左下**算起。LÖVE 自己用 `love_ScreenSize.zw` 处理了这件事，
`Shader::updateScreenParams()` 的注释逐字说明：无 canvas 时 `params[2] = -1.0, params[3] = height`（翻回来），
canvas active 时 `params[2] = 1.0, params[3] = 0.0`（不翻）
（[opengl/Shader.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Shader.cpp)）。
**强烈建议在 Phaser 侧直接做一个 `uniform vec4 love_ScreenSize` 传 `(w, h, flipZ, flipW)` 四分量**，
这样 19 个 `.fs` 里所有 `love_ScreenSize.xy` 的用法一行不改就能工作，`love_PixelCoord` 宏也能原样保留 ——
把「要不要翻 Y」从 19 个文件收敛到 1 个 define。
这件事必须做，因为两种情形在 Phaser 里都会遇到：卡牌 shader 走 Sprite pipeline（默认 framebuffer，要翻），
背景/后处理走 RenderTexture / PostFX framebuffer（不翻）。

**预乘 alpha 是两边默认值真正不同的地方**（详见 §6.2）。

### 4.3 需要重新推导的部分：`position()`（14 个文件里有）

这是**唯一一处不能机械翻译的**。LÖVE 的 `position()` 收到的 `vertex_position` 是 `VertexPosition`，
即**变换前的局部坐标**（`GLSL.VERTEX.MAIN` 逐字是 `love_Position = position(ClipSpaceFromLocal, VertexPosition)`；
Balatro 通过 `prep_draw` 用 `love.graphics.translate/rotate/scale` 推栈，顶点本身是 quad 的 0..w 像素范围）。
而 Balatro 写：

```glsl
float mid_dist = length(vertex_position.xy - 0.5*love_ScreenSize.xy)/length(love_ScreenSize.xy);
vec2 mouse_offset = (vertex_position.xy - mouse_screen_pos.xy)/screen_scale;
```

把**局部坐标**和**屏幕坐标**（`mouse_screen_pos` = `G.CONTROLLER.cursor_position * G.CANV_SCALE`，
`sprite.lua:93-97`）直接相减。

> **【笔记间冲突的裁决】**
> 笔记 01/02 从量纲推断「LÖVE 11 在 CPU 侧预变换 quad 顶点，所以 `vertex_position.xy` 已是屏幕像素坐标」；
> 笔记 03 从 `wrap_GraphicsShader.lua` 的 `GLSL.VERTEX.MAIN` 逐字读出传的是**局部**坐标。
> **按笔记 03 裁决**（它有源码逐字证据，笔记 01/02 是量纲推断）。
> 结论因此更尖锐：**原作这段数学本身就是「坐标空间不严谨」的经验式效果** ——
> 局部坐标减屏幕坐标在量纲上讲不通，但被作者手调到了好看。

这意味着移植时**不能靠「把坐标空间对齐」来复现**，
必须在 Phaser 端**人为构造出同样的「局部 quad 像素空间」**喂给这段数学，然后照着原作观感调参。

Phaser 的 `inPosition` 是**世界坐标**（transform 已在 CPU 端烘进顶点），语义与 LÖVE 不同。
两条出路：

1. **自定义 pipeline 额外传一个 `inLocalPosition` 属性**（推荐）——
   把每个 quad 的 0..w / 0..h 局部像素坐标作为额外 vertex attribute 写入，倾斜公式就能原样跑。
   这条路顺带把 §3.3 的 (c) 方案做了一半。
2. 放弃 shader 顶点倾斜，用 Phaser 的 2D 变换（`setScale` / Mesh skew）近似 ——
   **会丢失原作卡牌的透视感**，不推荐（见 §5）。

`vortex.fs` 有**完全相同的坑**（它也写 `vertex_position.xy - 0.5*love_ScreenSize.xy`），
同一套 `inLocalPosition` 机制能一并解决。

### 4.4 gamma：不需要处理（含一处冲突裁决）

> **【笔记间冲突的裁决】**
> 笔记 03 把「Balatro 的 `conf.lua` 是否开了 `t.gammacorrect`」列为**必做核实项**，
> 并指出若开了则所有 `effect()` 返回值要补 `linearToGamma`、纹理要按 sRGB 采样。
> 笔记 02 已直接读出 `conf.lua` 全文 —— **只有 10 行**，
> 无 `t.version`、无 `t.gammacorrect`、无 `t.window.vsync`、无 `t.window.msaa`、无 `t.window.highdpi`，
> 窗口宽高都设成 `0`；真正的图形配置在 `globals.lua` 的 `G.SETTINGS` 与运行时 `love.window.setMode`。
> **按笔记 02 裁决：Balatro 没有开 gammacorrect，这个风险点关闭。**

后果：`#define gammaCorrectColor`（空替换）使 `gammaCorrectColor(x)` 直接变成 `(x)`，
LÖVE 的默认管线是纯「everything in sRGB space, no conversion」，
与 WebGL 默认（`gl.RGBA` 非 sRGB 纹理 + 非 sRGB framebuffer）**完全一致**。
Balatro 的 19 个 `.fs` 里 `gammaCorrectColor` / `unGammaCorrectColor` 也是 **0 次命中**。

移植时只要做到三条：不给纹理用 `SRGB8_ALPHA8`（保持 `gl.RGBA`）、
不在 canvas context 属性里设 color space、所有颜色常量按原样以 0..1 sRGB 值传。
**颜色管线 1:1，无需任何 gamma 处理。**

顺带（同样来自 `conf.lua` 与 `main.lua`）：**整个游戏没有抗锯齿**，
`G.CANV_SCALE = 1` 无超采样，靠 `G.CANVAS:setFilter('linear','linear')` 的双线性过滤做平滑。
Phaser 侧照做即可。LÖVE 运行时版本从 `liblove.so` 判断为 **11.5「Mysterious Mysteries」**（推断，非直接读取）。

---

## 5. 3D 倾斜的真相

### **是 vertex 阶段改 `w` 分量做透视除法。不是 CPU 算顶点，也不是 fragment 偏移。**

这是票里第 4 问的直接答案，也是本次调研最有价值的单条发现。

`skew.fs` 与内联进 12 个卡牌 shader 的副本，全文核心只有一行：

```glsl
vec4 position( mat4 transform_projection, vec4 vertex_position ) {
    if (hovering <= 0.){ return transform_projection * vertex_position; }
    float mid_dist = length(vertex_position.xy - 0.5*love_ScreenSize.xy)/length(love_ScreenSize.xy);
    vec2 mouse_offset = (vertex_position.xy - mouse_screen_pos.xy)/screen_scale;
    float scale = 0.2*(-0.03 - 0.3*max(0., 0.3-mid_dist))
                *hovering*(length(mouse_offset)*length(mouse_offset))/(2. -mid_dist);
    return transform_projection * vertex_position + vec4(0,0,0,scale);   // ← 只动 w
}
```

（`资源/shaders/dissolve.fs:73-86`，`skew.fs` 逐字相同）

### 排除法的证据

- **不是 fragment 偏移**：`hovering` / `mouse_screen_pos` / `screen_scale` 三个 uniform
  **只在 VERTEX 段被引用**。`grep -n hovering dissolve.fs` 只命中 70（extern 声明）、76、82 三行，
  而 `#ifdef VERTEX` 在第 73 行；`foil.fs` 同理（127/133/139，VERTEX 在 130）。`effect()` 完全不用它们。
- **不是 CPU 算顶点、不是自建 mesh**：Lua 侧的绘制是最朴素的 quad 贴图
  （`sprite.lua:148-156` 就是 `love.graphics.draw(image, quad, 0, 0, 0, sx, sy)`），
  全仓无 `newMesh` / `newSpriteBatch` 命中。
  `Moveable` 的 `VT`（Visible Transform）只有 `{x, y, w, h, r, scale}` 六个数，
  是一个缓动到目标 `T` 的**纯 2D 仿射变换**（`engine/moveable.lua:6-8, 201-214`），与 3D 无关。
- **Lua 只算标量输入**：`card.lua:4378-4392` 算出 `tilt_var.mx/my/amt` 三个标量，分三档 ——
  **focus（手柄/键盘选中，带摇杆偏移）> hover（鼠标悬停）> ambient_tilt（无人碰时的自动慢摇）**。
  `ambient_tilt` 默认 `0.2`（card.lua:16），Blind 是 `0.3`（blind.lua:11），某些展示卡是 `0.8` 或 `1`。

### 机制拆解

在 LÖVE 的 2D 正交投影下 clip-space 的 `w` 恒为 1；这里把它改成 `1 + scale`。
光栅化时做 `(x/w, y/w)`，而 `scale` 是**逐顶点**算的（依赖该顶点到鼠标的距离**平方**）。
四个角 `w` 各不相同 → 整个 quad 变成**梯形**（一个真正的投影变换），而不是平移/缩放。
更妙的是 GL 的纹理插值是 perspective-correct（按 1/w 插值），
所以卡面贴图**自动按透视规律拉伸** —— 用 0 次额外采样、0 个矩阵，换来「卡真的在 3D 里转了一下」的观感。

两个衰减项：`mid_dist`（顶点到屏幕中心的归一化距离，`/(2.-mid_dist)` 让靠近屏幕边缘的卡倾斜更强，
模拟广角镜头）和 `length(mouse_offset)^2`（离鼠标越远的角被推得越狠，所以卡会「朝鼠标方向低头」）。
`screen_scale` 起归一化作用 —— 卡越大（或 `mouse_damping` 越大）倾斜越缓，
而 `mouse_damping = 1.5` 只在 Booster 包上设过（`card.lua:346`）。

### 这对移植意味着什么

1. **不需要任何 3D 库。** Phaser 3 的自定义 pipeline 支持写出带非常数 `w` 的 `gl_Position`，这就够了。
   倾斜本身是 14 行 vertex GLSL，**对 GPU 几乎免费** —— 真正的成本全在「零合批 + 多 pass overdraw」。
2. **倾斜必须做进每一个卡牌 pipeline 的顶点着色器，不是一个独立 pass。**
   原作就是把这段代码编译进了 12 个 shader，而不是单独再画一遍。
   Phaser 侧应做成所有卡牌 pipeline 共享的顶点着色器 include。
3. **CSS/DOM 路线（`transform: perspective() rotate3d()`）不可取。**
   等价物存在，但那样就没法和 fragment 特效（foil/holo）在同一个渲染管线里叠加 ——
   这正是现有几个 React/DOM 路线的 Balatro web 复刻「观感不像原作」的根因（见 §7.2）。
4. **唯一的难点是喂给它什么坐标**（§4.3）。公式本身是照抄，工作量全在构造局部坐标 + 调参对手感。
5. **CRT.fs 尾部那份副本系数是 `0.002`**（小 100 倍），且 `mid_dist` 的算法多乘/除了一次 `screen_scale` ——
   因为它作用在整块全屏画布上，同样的系数会把整个屏幕扭爆。移植时别复制错。
   顺带：`game.lua:3304` 给 CRT 送 `hovering = 1`，**所以原作整个屏幕也会随鼠标做极轻微的透视摆动**。
6. **阴影不是 3D 倾斜**：`sprite.lua:76-80` 直接平移 `VT` 后重画一遍，
   `shadow_parrallax.x` 按卡距屏幕中心的水平距离算（`moveable.lua:461`），默认 `{x = 0, y = -1.5}`。
   阴影颜色由 `dissolve.fs` 的 `shadow` bool 控制（`vec4(0,0,0, tex.a*0.3)`）。

---

## 6. 明确列出哪些效果注定做不到 1:1

这一节是诚实清单。**共同结论：没有一条会导致「外观轴不成立」，但每一条都会让「逐像素 diff」不可能。**

### 6.1 坐标空间 —— 倾斜幅度只能「调到像」，不能「算到准」

**差在哪**：原作 `position()` 把局部坐标与屏幕坐标直接相减（§4.3），
这在数学上是不自洽的，所以**不存在一个「正确的」Phaser 等价实现**。
只能构造出相同量纲的输入，然后对着原作观感调参。

**肉眼看不看得出**：调好之后看不出；调之前差别明显（幅度和方向都会错）。

**有没有绕法**：无。这是必须靠人眼对齐的一项。**这是「像素级外观」这条轴上最软的一块。**

### 6.2 预乘 alpha —— 半透明边缘必然有偏差

**差在哪**：LÖVE 默认 `alpha` + `alphamultiply`，实际 GL 状态是
`glBlendFuncSeparate(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA)`
（[opengl/Graphics.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Graphics.cpp)），
shader 输出**非**预乘。
Phaser 默认 `premultipliedAlpha: true`（[Config.js](https://github.com/phaserjs/phaser/blob/v3.80.1/src/core/Config.js)）
+ `NORMAL` blend = `blendFunc(ONE, ONE_MINUS_SRC_ALPHA)`，shader 输出**必须**预乘，
且 Phaser 只有 `blendFunc` 没有 `blendFuncSeparate`。

**两条路，必须二选一并全局一致：**

- **方案 A（推荐）**：每个 `.fs` 末尾补一次预乘 `gl_FragColor = vec4(c.rgb*c.a, c.a);`。
  **这在数学上与 LÖVE 完全等价，是可证明的改写，不是近似** ——
  两边 alpha 通道都是 `ONE`，只差 RGB 项（LÖVE `SRC_ALPHA` vs Phaser `ONE`），shader 里乘一次正好补上。
  好处是完全沿用 Phaser 的默认 blend / RenderTexture / Container / Camera fade / Mask 行为。
- **方案 B**：`render: { premultipliedAlpha: false }` + 自定义 blend mode。
  **不推荐** —— Phaser 内建 tint/fade/mask 路径会冲突，且无 separate 无法 100% 复刻 LÖVE。

**真正做不到 1:1 的残留是纹理上传路径的预乘。**
Phaser 的 `canvasToTexture` 明确传 `pma = true`；从 `<img>` 加载的路径取决于 TextureManager 的取值
（**本次未追到源码行**）。若源纹理被预乘，`texture2D(uMainSampler, uv).rgb` 的含义与 LÖVE 不同，
**所有在 shader 里对 `.rgb` 做的 HSL 旋转、对比度调整都会在半透明边缘偏色**。

**肉眼看不看得出**：卡面边缘、阴影（`tex.a*0.3`）、溶解烧灼边处会有**一圈几像素的色晕差异**。
静止时勉强能看出，动起来看不出。

**有没有绕法**：有。强制 atlas 上传时 `pma = false`，或在采样后除以 alpha 还原。
**这是实现期第一天必须验的事**（做一张半透明测试图即可）。

### 6.3 WebGL1 限制 —— hologram 的采样循环

**差在哪**：`hologram.fs:58` 用非 `const` 局部变量 `glow_samples` 做循环边界，
违反 GLSL ES 1.00 Appendix A（要求循环判定表达式与**常量表达式**比较），严格实现下**拒绝编译**。
而 Phaser 3.90 是**纯 WebGL 1，无法强制 WebGL 2** —— `WebGLRenderer.js:770` 唯一的上下文创建语句是
`canvas.getContext('webgl', ...) || canvas.getContext('experimental-webgl', ...)`，
**没有任何 `'webgl2'` 字样**（v3.90.0 源码验证）。

**肉眼看不看得出**：改成 `const int glow_samples = 4;` 后**完全等价，零视觉差异**。
严格说这条不算「做不到 1:1」，列在这里是因为它是**唯一的硬编译阻塞**。

**真正做不到的是它的性能**：9×9 = **81 次纹理采样/像素**，是全 19 个 shader 里最贵的一个。
在 WebGL1 上可能需要降到 5×5（25 次）或 7×7（49 次）。
**降采样数会让辉光半径变小，这是肉眼可见的。**
有一个折中绕法：保持采样数但增大 `glow_dist` 步长 —— 辉光半径不变，但会出现轻微的采样带状。
两害相权，建议先原样跑，实测掉帧再降。

另外 `glow /= 0.7*float(actual_glow_samples)`（hologram.fs:72）在 81 次采样全部 `_a >= 0.9`
（完全不透明区域）时 `actual_glow_samples` 为 0 → **除零**。
桌面 GPU 与 WebGL 实现对此行为可能不同，需补 `max(..., 1.0)`。

### 6.4 动态循环 —— 实际不是问题

**差在哪**：GLSL ES 1.00 不支持动态循环上界。
但全部 7 个循环里，`background.fs:36` / `flame.fs:39` / `splash.fs:36` 都是 `i < 5` 字面量常量，
`CRT.fs:119-120` 用 `#define BLOOM_AMT 3`（预处理器常量，展开后是字面量，**WebGL1 合法，可展开**），
**只有 hologram.fs 一处违规**（见 6.3）。

**肉眼看不看得出**：不适用。**这一条是虚警，写在这里是为了关掉它。**

### 6.5 CRT 的死代码 —— 移植后的「CRT」不是文件里写的那个 CRT

**差在哪**：`CRT.fs` 有 153 行，但 `game.lua:3293-3304` 的运行时送值让两大块永不执行：

- `send('bloom_fac', 0)` → `if (bloom_fac > 0.00001 && ...)` 恒假 → **49 次纹理采样的 7×7 bloom 块是死代码**
- `send('glitch_intensity', 0)` → **水平撕裂 glitch 块是死代码**（连带后面的红绿增强也不触发）
- `noise_fac` 那一行在 shader 第 11 行和 `game.lua:3298` 都被注释掉了

**肉眼看不看得出**：**删掉零视觉损失。** 删完 CRT 只剩
「桶形畸变 + 边缘遮罩 + 3 次纹理采样（主采样 + R/G 各偏移一次做色差）+ 扫描线网格 + 对比度校正」，
是一个非常轻的全屏 pass。

**但这里有个口径陷阱**：如果参考「CRT.fs 的完整代码」来对齐外观，会做出一个**比原作更花哨**的 CRT。
**必须按运行时实际送值来实现，不是按 shader 文件。**

还有一处**移动版特有的强度压制**：`game.lua:3292` 在送值前做 `G.SETTINGS.GRAPHICS.crt = crt*0.3`，
送完 `game.lua:3306` 再 `/0.3` 还原。移动端 `crt` 默认 30
（`globals.lua:229-234`：`crt = self.F_MOBILE and 30 or 70`），
所以**移动版实际 CRT 强度 = 30 × 0.3 = 9，桌面版默认是 70**。这是 §7.1 那条风险的一个具体后果。

（另注：`scanlines` uniform 依赖实际画布像素高 `G.CANVAS:getPixelHeight()*0.75/G.CANV_SCALE`，
Phaser 侧 resize 时必须重传。）

### 6.6 精度：mediump 降级路径

**差在哪**：`background` / `splash` / `flash` 用 `screen_coords`（可达 2000+ px）做
`floor(x*(1./pixel_size))*pixel_size`；`flame.fs` 用 `mod(4.*time, 10000.)`。
在 mediump（约 10 bit 尾数）下会出现明显阶梯/跳变。
另外 **`CRT.fs` 第 1 行是 `__VERSION__ > 1` 而非 `> 100`**（其余 18 个文件都是 `> 100`，已本地逐字核实），
在 WebGL1（`__VERSION__` = 100）下恒为真 →
**CRT.fs 在不支持 fragment highp 的设备上会直接编译失败**，其余文件会优雅降级。

**肉眼看不看得出**：现代桌面浏览器基本都支持 fragment highp，桌面 localhost 场景下看不出。

**有没有绕法**：`__VERSION__ > 1` → `> 100` 一行修。其余保持原样，实机验证即可。

### 6.7 `foil.fs` 的除零 NaN

**差在哪**：`number angle = dot(rotater, adjusted_uv)/(length(rotater)*length(adjusted_uv));`
在卡面正中心 `adjusted_uv` 为 0 → `0/0`。
桌面 GPU 通常给 NaN 后被后续 `max/min` 夹住，**WebGL 实现的处理可能不同**。

**肉眼看不看得出**：若 WebGL 实现不夹 NaN，卡面正中心会出现一个**闪烁的坏像素**。

**有没有绕法**：`max(length(adjusted_uv), 1e-5)`。这会与原作有微小数值差异，但肉眼不可分辨。

### 6.8 移动版构建导致的差异 —— 最严重的一条

**差在哪**：见 §7.1。**本构建里卡牌 3D 倾斜被整体禁用。**
这意味着**没有可直接对照的原作运行画面来校准卡牌倾斜手感** ——
用这份产物跑起来的 Balatro，卡牌是不倾斜的。

**肉眼看不看得出**：看得出，而且是最显眼的一项（倾斜是 Balatro 手感的招牌）。

**有没有绕法**：见 §7.1 的决策建议。

### 6.9 其余已知的细微不可对齐项

| 项 | 差在哪 | 肉眼 | 绕法 |
|---|---|---|---|
| 无抗锯齿 | 原作 `conf.lua` 无 MSAA，`G.CANV_SCALE = 1` 无超采样，靠 `setFilter('linear','linear')` 平滑 | 看不出（照做即可） | 照做：Phaser 侧同样不开 MSAA，RT 用 linear |
| `setShader(a, a)` 的冗余第二参 | LÖVE 11 只接受一个参数，多余的被忽略（移动版改造遗留） | 无影响 | 无需处理 |
| `G.AA_CANVAS` 分支 | 全仓从未被赋值（`grep -rn "AA_CANVAS *=" --include=*.lua` 零输出），`setCanvas(nil)` = 恢复默认 framebuffer | 无影响 | 渲染管线只有 2 层：CANVAS → 屏幕（CRT），照做 |
| `played.fs` 的 `0.000001*played.r` | 占位乘法，实际无用 | 无影响 | 照抄即可 |
| 牌堆降采样 | `cardarea.lua:330` 只画第 1、最后 1、每第 9 张，及偏离堆位置 >1 的张 | 看得出（牌堆厚度） | 照做这个条件 |
| shader 叠加 z 顺序 | 固定为 底图(dissolve/negative) → front → voucher/booster → holo → foil → polychrome → negative_shine → seal → 贴纸 → soul/floating → debuff → played（`card.lua:4410-4549`） | **顺序错了明显看得出** | 照抄顺序，这是硬约束 |
| negative 用两个 shader | `negative` 替代 `dissolve` 画底图做反色 + `negative_shine` 叠流光（`card.lua:4419-4423` / `4470-4472`） | 漏一个就不对 | 照抄 |

---

## 7. 重大发现与风险

### 7.1 【给地图作者决策】这份产物是移动版构建，卡牌倾斜在本构建里是**关闭**的

**事实（已本地逐条核实）：**

- `源码/info.txt`：`name: Singular-v12.11.0-03ae108.master` / `env: release` / `build_date: Mon, 26 Jan 2026`
- `源码/version.jkr`：`1.0.1o-FULL [M]` / `1.0.1o` / `PROD_mobile`
- `engine/sprite.lua:99` 的 `hovering` 表达式里有前置条件 `_draw_major.touch_collide_tilt`：

  ```lua
  send('hovering', ((_shadow_height and not tilt_shadow) or _no_tilt) and 0
      or (((_draw_major.touch_collide_tilt and _draw_major.states.collide.is)
           and _draw_major.hover_tilt or 0) or 0)*(tilt_shadow or 1))
  ```

- 全仓 `touch_collide_tilt` 仅 **4 处**：`engine/sprite.lua:99`（读取）、
  `functions/UI_definitions.lua:4111`、`functions/UI_definitions.lua:5975`、`tag.lua:512`（三处写入）。
  **`Card` 从不设置它**（`card.lua` 零命中）。

**后果**：本构建里卡牌传进 shader 的 `hovering` 恒为 **0**，
vertex shader 走 `if (hovering <= 0.) return transform_projection * vertex_position;` 提前返回 ——
**卡牌 3D 倾斜被整体禁用，只有 Blind 预览图和 Tag 还保留倾斜**。
这显然是触屏端没有 hover 的适配改动。
另有全局开关 `sprite.lua:74`：`if G.SETTINGS.reduced_motion then _no_tilt = true end`。

同源的其它移动版差异：CRT 强度被压到 `30 × 0.3 = 9`（桌面默认 70，
`globals.lua:229-234` + `game.lua:3292`）；bloom / glitch / noise 三块全部关闭（§6.5）。

**这对「像素级外观」的基准口径意味着什么：**

地图把「像素级外观」定为四条轴之一，但**没有定义对齐的是哪个基准**。现在必须选，三个选项：

| 选项 | 含义 | 代价 |
|---|---|---|
| **(1) 对齐本产物（移动版）** | 卡牌不倾斜、CRT 强度 9、bloom/glitch 关闭 | 最省事（`hovering` 直接不接），但**丢掉 Balatro 最有辨识度的手感**，做出来「像但不对」 |
| **(2) 对齐桌面版（推断实现）** | 去掉 `touch_collide_tilt` 前置，hover 命中即 `hovering = hover_tilt`（`card.lua:4351` 每帧重置为 1，Hologram 小丑 ×1.5 见 `card.lua:4525-4527`，Blind 为 2 见 `blind.lua:432`）；CRT 强度按 70 | **无法验证**。本仓库没有桌面版产物，倾斜手感只能对着外部录像调 |
| **(3) 另找桌面版产物核对** | 取一份 Steam 桌面版 1.0.1o 的 `engine/sprite.lua` 与 `globals.lua` 核对 | 需要额外获取产物；但**只需要核对三五行代码**，不需要全量素材 |

**建议：选 (3)，退而求其次选 (2)。**
理由：倾斜是本轴上最软的一块（§6.1 说了它只能靠人眼调），
如果连基准都是推断的，「像素级外观」的验收手段就不存在了。
而 (3) 的成本极低 —— 只要拿到桌面版的 `engine/sprite.lua` 第 99 行与 `globals.lua` 第 229-234 行，
就能把 §5 的倾斜参数钉死。**这条建议开一张独立的票**（见 §10.2 票 A）。

### 7.2 【比 shader 本身更大的选型风险】Phaser 3 已终结，Phaser 4 移除了整个 Pipeline 体系

**事实：**

- Phaser **3.90.0「Tsugumi」于 2025-05-23 发布，是 Phaser 3 分支的最后一个正式版**
  （[Phaser v3.90 Released](https://phaser.io/news/2025/05/phaser-v390-released)）。
- npm registry `dist-tags` 实测：`latest = 4.2.1`。3.x 线最高版本是 3.90.0。
- **Phaser 4 重写了渲染器，移除了 Pipeline 体系**，改为 RenderNode /
  `setupUniforms(setUniform, drawingContext)` 风格的 Shader 对象
  （[Phaser 4 Rendering Concepts](https://phaser.io/tutorials/phaser-4-rendering-concepts)、
  [Phaser 4 Shader 文档](https://docs.phaser.io/api-documentation/class/gameobjects-shader)）。

**后果**：§3.3 的 (a)(b)(c) **三条路在 v4 上都要重写**。
地图选的是 Phaser 3 + Vite + TS 模版，这意味着整个 shader 胶水层
（per-instance uniform 绑定、pipeline 注册、PostFX 挂载）
是**一次性投入到一个已停更分支上的**，升级到 v4 时基本要全部重写。

**这不是「以后再说」的问题，因为它反过来约束现在的架构**：
建议把 pipeline 相关代码**隔离在 1–2 个文件里**，
让 19 个 `.fs` 与 uniform 送值逻辑（这部分是引擎无关的）能原样搬到 v4。

**没有找到官方对 Phaser 3.90 的 EOL / 安全维护承诺声明**（Gap）。

留在 3.90 的反向理由也要摆上桌：它的 PostFX 生态（文档、rex 插件、官方 examples）最成熟，
而 v4 的 shader 胶水层要自己从 RenderNode 摸索、无社区先例。

补充一个数据点：本轮调研**没有找到任何 Phaser 版的 Balatro 复刻**（搜 "balatro phaser" 零命中），
而现有的 web 复刻 —— [Weblatro](https://github.com/TyconXon/Weblatro)（JS）、
[webatro](https://github.com/imisaacwu/webatro)（TS）、
[swen128/balatro](https://github.com/swen128/balatro)（TS + React）、
[Ryze05/balatro_project](https://github.com/Ryze05/balatro_project)（React + Vite）——
**全是 React/DOM 路线，本质上放弃了 shader**，用 CSS 动画/渐变近似 foil/holo。
（GitHub tree API 查询 Weblatro 仓库，**没有任何路径包含 `shader` / `glsl` / `frag` / `.fs`**。）
这既解释了它们为什么「观感不像原作」，也说明**带 shader 的 web Balatro 是一个尚未有人做成的空白**：
没有先例可抄，也没有已知的 Phaser 特定坑被别人踩过。
唯一 shader 完全还原的是 [W0W53R/web-balatro](https://github.com/W0W53R/web-balatro)（love.js 跑原版字节码），
但它对「做自己的复刻件」没有参考价值，**只能作为『原作观感基线』的对照工具**。

### 7.3 Phaser 3.90 是纯 WebGL 1，无法强制 WebGL 2

已在 §6.3 引用源码（`WebGLRenderer.js:770`）。对本项目**实际是好消息**：
LÖVE 的 GLSL 方言正好是 GLSL ES 1.00 级别，转 WebGL 1 是平移级改写，
不需要处理 `in/out`、`texture()`、`layout` 这些 ES 3.00 差异。
唯一代价是 `hologram.fs` 的一行 `const` 修复（若目标是 WebGL2，这个问题会自动消失）。

（实践上可以自己先 `canvas.getContext('webgl2')` 再把 canvas 传给 Phaser，
但 Phaser 3 内部的扩展检测逻辑全按 WebGL1 写，**不建议尝试**。
Phaser 4 在 `WebGLRenderer` 里做了 WebGL1/2 的特性归一化，但默认仍从 `'webgl'` 起步。）

### 7.4 版权：Godot Shaders 上的部分 Balatro shader 标注「直接取自源码」

[Godot Shaders 的 Balatro Background Shader](https://godotshaders.com/shader/balatro-background-shader/)
与 [Balatro Paint Mix](https://godotshaders.com/shader/balatro-paint-mix/)
作者均注明**直接取自 Balatro 源码**。逐行复制进对外分发的项目有版权风险。
Shadertoy 上的 "inspired by" 重写版风险较低，但**各自 license 未确认**
（Shadertoy 默认 CC BY-NC-SA 3.0，作者可自定义，页面是 JS 渲染的抓不到）。

**对本项目的实际影响：低。** 地图已裁定**只跑 localhost，不部署不分发**，
且我们本来就拥有原始 `.fs`（在 `参考/产物/` 里），
**直接从原始文件改写比从任何二手版本抄都更安全，也更准确**。

Shadertoy 版本还要特别小心一个技术陷阱：它的 `mainImage(out vec4 fragColor, in vec2 fragCoord)` 里
`fragCoord` 是 **Y 向上**的，与 LÖVE 的 `screen_coords` 相反，
**从 Shadertoy 抄回来会引入一次 Y 翻转错误**。
建议把社区版本只用作「验证这段数学在 WebGL 上能跑」的旁证，不作为代码来源。

---

## 8. 工作量量级估计

**合计 9–16 人日**，前提是执行者对 GLSL 不陌生。

| 阶段 | 人日 | 估算依据 | 不确定性来源 |
|---|---|---|---|
| **shader 批量改写**（19 个 fragment + 转换脚本 + `hologram.fs` / `CRT.fs` / `foil.fs` 三处修复） | **1.5–2.5** | 七条机械替换可脚本化（§4.1）；19 个里真实独特代码约 7 个；`gold_seal.fs` 27 行可做首个验证样本 | 低。唯一变数是校对 12 个共享 `dissolve_mask` 的细微差异（debuff.fs 少一个精度修饰） |
| **per-instance uniform 胶水层**（pipeline 基类 + 10+1 uniform 绑定 + flush 时序 + z 顺序 + `?raw` 加载） | **2–3** | §3.5 的 uniform 清单可直接照抄 `sprite.lua:97-107`；`onBind`/`onBatch`/`flush` 写法有社区闭环代码；Vite `?raw` 零配置 | 中。flush 时序与 camera scissor/mask 的边界情况**未验证**；`setPipeline` 与 `preFX` 是否互斥**官方未说明** |
| **倾斜手感对齐**（`inLocalPosition` attribute + vertex 段 + 三档逐一调参 + `vortex.fs`） | **3–5** | §4.3 / §5 的重新推导；三档倾斜（focus / hover / ambient）各要调；`vortex.fs` 复用同一机制 | **高。这是最大的不确定性**。若按 §7.1 选 (1)（对齐移动版不做倾斜）可直接砍到 0.5 人日；若选 (2) 无基准可对，可能超出上限 |
| **CRT 与背景**（CRT.fs 去死代码 + PostFXPipeline；background / splash / flash 三个全屏 shader） | **1.5–3** | CRT 去死代码后只剩 3 次采样，是轻 pass；background 有 5 个独立移植先例佐证数学能跑；两步注册流程（config 注册 + `setPostPipeline`）是唯一的坑 | 中。CRT 的观感调参无现成参考；`scanlines` 依赖画布像素高，resize 时要重传 |
| **性能调优**（profile + RenderTarget `scale` 降采样 + 合 pass） | **1–2** | `RenderTarget` 构造带 `scale` 参数（`RenderTarget.js:105, 283-284`），降采样原生支持；止损手段清单已备 | 中。取决于 spike 结果（§9） |

**估算依据**：主要来自两份独立笔记的交叉 ——
笔记 03 给「19 个 `effect()` 约 1 人日 + 14 个 `position()` 3–5 人日 + pipeline 脚手架 2 人日」，
笔记 05 给「全链路 7–12 人日」。取并集后按阶段重组。
两份估计在「vertex 是最大头」这一点上**独立吻合**，这条的可信度较高。

**不确定性的三个主要来源：**

1. **§7.1 的基准口径未定** —— 直接决定倾斜阶段是 0.5 人日还是 5 人日，**波动最大**。
2. **全屏背景的 fill-rate 未实测** —— 可能需要额外 1–2 人日做降采样 / 简化噪声。
   佐证：社区专门做过「Balatro Background (Optimized)」版本，说明原版确实重。§9 的 spike 正是为了关掉这个。
3. **Phaser 每次 pipeline flush 的 JS/CPU 开销无公开量化数据** ——
   40 次 flush 在桌面是毫秒级（推论），但未验证。

**性能止损手段（真到那一步时按性价比排序）：**

| 手段 | 收益 | 代价 |
|---|---|---|
| `RenderTarget.scale` 设 0.5~0.75 跑 CRT | fill-rate 降到 25%~56% | CRT 本来就糊，观感损失小 |
| CRT 的扭曲/扫描线/色差合并进**一个** fragment shader | 3 pass → 1 pass | 本来就该这么做（原作就是一个文件） |
| 背景降采样后上采样（背景是低频的） | fill-rate 大降 | 几乎无损 |
| `hologram.fs` 的 9×9 降到 7×7 / 5×5 | 采样数 81 → 49 / 25 | **辉光半径变小，肉眼可见**（§6.3） |
| `clearBeforeRender: false`（有全屏背景时） | 省一次全屏 clear | 必须保证背景真的铺满 |

**不包含**：卡牌物理 / 缓动 / 节奏的手感还原（那是地图 "Not yet specified" 里的另一条），
以及 Lua → TS 的逻辑层翻译。本估计**只覆盖 shader 与渲染管线**。

---

## 9. 建议的下一步：半天 spike 实测

**这件事比继续查资料有用得多。** 两份笔记独立给出了同一个建议。

### spike 的形状

新建一个空 Phaser 3.90 + Vite + TS 工程，**不接任何游戏逻辑**，只做四件事：

1. 铺一个全屏 `background.fs`（从原始 `.fs` 改写，用 [Shadertoy XXtBRr](https://www.shadertoy.com/view/XXtBRr) 交叉验证数学）
2. 挂一个自写的 CRT `PostFXPipeline`（去掉 bloom / glitch 死代码后的精简版）
3. 放 **40 个带 FX 的小 sprite**，每个走 §3.3 方案 (a)，各自 10+1 个 uniform
4. 开 Chrome DevTools Performance，看 **GPU 帧时间**

### 这个 spike 要验什么（按重要性排序）

| # | 验证项 | 能关掉的未知 |
|---|---|---|
| 1 | **全屏背景 shader 的 fill-rate** | 唯一可能导致「做完了但跑不动」的项。5 次迭代 × 每像素三角函数 × 1080p ≈ 200 万像素 × N |
| 2 | **40 次 flush 的实际 CPU 开销** | 官方只给了 "128 draw calls vs 1" 的对比，**没给 FPS 数字**；也没找到 20–40 sprite 规模的实测基准。这是目前纯推论的一条 |
| 3 | **19 个 `.fs` 在真实 WebGL1 上下文能不能编译** | 全部兼容性结论都基于静态扫描，**未在真实 WebGL1 里编译验证过**。顺带确认 `hologram.fs` 的 `const` 与 `CRT.fs` 的 `__VERSION__` 修复生效 |
| 4 | **纹理上传的预乘 alpha 取值**（做一张半透明测试图） | §6.2 那条「最容易被忽略却最坑」的项。`<img>` 路径的 `pma` 值**未追到源码行** |
| 5 | **`onBatch` 里 flush 的正确性**（40 个 sprite 是否各自拿到自己的 uniform） | 验证 §3.1 那条「先设值 → 写顶点 → 立刻 flush」的推论 |
| 6 | **PostFXPipeline 对小对象是否恒用全屏 render target** | 决定 §3.3 方案 (b) 能不能当备选 |

### 验完的收益

- 性能风险从「高」降到可量化，且有明确止损手段（`RenderTarget.scale = 0.5` 直接把 fill-rate 降到 25%）
- §8 表里「性能调优」一栏的 1–2 人日能定准
- 方案 (a) vs (b) 的选择可以拍板
- shader 改写脚本的正确性得到端到端验证

**成本：半天。** 这半天能把上面 6 条不确定性一次性消除，**建议排在任何其它 shader 工作之前。**

**注意**：spike **不要**验倾斜。倾斜依赖 §7.1 的基准决策，在那之前调参是白做。

### 工具选型（已有明确答案，不需要再调研）

Vite 下加载 `.fs` 用 **`?raw`**，零依赖、零配置、`vite/client` 类型已覆盖：

```ts
import crtFrag from './shaders/crt.frag?raw';   // string

class CRTPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) { super({ game, renderTarget: true, fragShader: crtFrag }); }
}
```

只有将来需要 `#include` 拆分共享噪声函数库（`dissolve_mask` / HSL 那三块）时才上 `vite-plugin-glsl`，
切换成本只是改 import 后缀。只跑 localhost，不在乎 GLSL 体积，minify 收益为零。

---

## 10. 未决问题 / 需要新票的

### 10.1 本次调研未能确定的事（Gap）

| Gap | 影响 | 能否自查 |
|---|---|---|
| **19 个 `.fs` 未在真实 WebGL1 上下文编译验证** | 全部兼容性结论是静态扫描。风险低但非零 | 能，spike 里顺带做（§9 验证项 3） |
| **Phaser `<img>` 路径纹理上传的 `pma` 实际取值未追到源码行** | 直接决定半透明边缘是否偏色（§6.2） | 能，spike 里做一张测试图（§9 验证项 4） |
| **`setPipeline(自定义)` 与 `preFX.addXxx()` 是否互斥** | 官方文档未正面说明。影响「卡面材质 + 卡牌辉光」能否叠加 | 能，实测 |
| **Phaser 每次 pipeline flush 的 JS/CPU 开销无公开量化数据** | §8 估算的不确定性来源之一 | 能，spike |
| **多个 camera post pipeline 是否复用同一组 RenderTarget** | 若不复用，显存 = N × 全屏 RGBA | 能，看 `renderer.renderTargets` |
| **`PostFXPipeline` 对小对象是否裁剪 RT 区域** | 决定方案 (b) 的真实成本 | 能，实测 |
| **桌面版 1.0.1o 的 `engine/sprite.lua:99` 实际写法** | **§7.1 的核心未知**，决定倾斜的基准口径 | **不能**，需要另找产物 |
| **`skew.fs` 为什么存在但零引用** | 不影响移植结论（其代码已内联进其余文件） | 不能，且不重要 |
| **Shadertoy / RetroZone / Horri-fi 的 license 与完整参数表** | 只影响「能不能抄社区代码」。我们有原始 `.fs`，不需要抄 | 能，但优先级低 |
| **`splash` / `flash` / `background` 的逐帧 send 表未逐条展开** | 这些 uniform 从 shader 侧看全是全局性质（颜色主题 + 时间），不涉及 per-card | 能，本地 `game.lua:1382/1475/1491/1613/1641`、`2499-2509` |
| **未逐个核对 19 个 `effect()` 第一参 `color` 是否被使用** | 实现期的核对项，不影响可行性判断 | 能，本地 |
| **移动端实机的 mediump 精度表现** | 本项目只跑桌面 localhost，暂不适用 | 不适用 |
| **love2d.org/wiki 全站不可访问（Cloudflare HTTP 403，含 `r.jina.ai` 代理）** | 已全部用 LÖVE 11.5 源码替代，实际是更强的一手来源 | 不需要解决 |

### 10.2 建议开的后续票

**票 A：`wayfinder:decision` —— 像素级外观的基准口径：移动版还是桌面版**
§7.1 的三选一。建议做法：先花半小时尝试获取桌面版 1.0.1o 的
`engine/sprite.lua`（第 99 行）与 `globals.lua`（第 229-234 行）两处核对；
拿不到则裁定按选项 (2)（去掉 `touch_collide_tilt` 前置）实现，并在票里写明这是推断实现。
**这张票堵在倾斜工作之前，应该优先开。**
附带影响：它同时决定 CRT 强度的基准（9 还是 70）。

**票 B：`wayfinder:decision` —— Phaser 3 vs Phaser 4 的选型复核**
§7.2。地图选的 Phaser 3 模版对应一个已终结的分支，且 v4 移除了整个 Pipeline 体系。
需要判断：接受一次性重写成本留在 3.90（换取最成熟的 PostFX 生态、文档、rex 插件），
还是现在就上 v4（换取长期性，但 shader 胶水层要自己从 RenderNode 摸索、无社区先例）。
建议票里同时评估：把 pipeline 代码隔离在 1–2 个文件里，能把迁移成本压到多低。

**票 C：`wayfinder:task` —— shader spike（半天）**
§9 的全部内容。这是一张真正动手写代码的票，产出是一个可跑的 Phaser 工程 + 一份帧时间数据。
**依赖票 B（决定用哪个 Phaser 版本），不依赖票 A。**

**票 D：`wayfinder:task` —— 19 个 `.fs` 的批量改写脚本**
§4.1 的七条机械替换 + 拆分 `.vert` / `.frag` + `hologram.fs` / `CRT.fs` / `foil.fs` 三处修复。
产出是一个转换脚本 + 19 个 WebGL 版 `.frag`（+ 14 个 `.vert`）。
**可与票 C 并行**，且票 C 的验证项 3 正好消费它的产物。

**票 E（低优先）：`wayfinder:research` —— 卡牌渲染的 draw call 与 z 顺序精确核对**
§6.9 表里的「shader 叠加 z 顺序」是硬约束（顺序错了明显看得出），
但本次只精读了 `card.lua:4348-4560`（`Card:draw`）与 `387-417`（`set_edition`）两段；
若 `G.FUNCS` 里的预览/图鉴渲染用了不同的挂载方式，本次未覆盖。
实现卡牌渲染时再开。

---

## 附：关键文件索引

| 内容 | 路径 |
|---|---|
| 19 个 `.fs` 源文件 | `E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\shaders\` |
| shader 加载（全仓唯一的 `newShader`） | `源码\game.lua:130-139` |
| per-card uniform 送值（10+1） | `源码\engine\sprite.lua:73-125`，核心 97-107 |
| 倾斜的 Lua 侧输入（三档） | `源码\card.lua:4378-4392` |
| 倾斜 vertex 段（母版） | `资源\shaders\dissolve.fs:73-86` = `skew.fs` 全文 |
| edition → shader 的硬编码分发与 z 顺序 | `源码\card.lua:4410-4549` |
| CRT 的运行时送值（含两处死代码） | `源码\game.lua:3284-3320` |
| canvas / render target（2 层管线） | `源码\main.lua:480-483` + `game.lua:3078-3089` |
| 图形设置默认值（crt 移动 30 / 桌面 70） | `源码\globals.lua:229-234` |
| `conf.lua` 全文（10 行，无 gammacorrect） | `源码\conf.lua` |
| 构建标识（移动版证据） | `源码\info.txt`、`源码\version.jkr` |
| LÖVE GLSL 包装层全文 | [love/11.5 wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua) |
| `love_ScreenSize.zw` 的翻转值 | [love/11.5 opengl/Shader.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Shader.cpp) |
| LÖVE blend func | [love/11.5 opengl/Graphics.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Graphics.cpp) |
| Phaser per-GO PostFX 实例化 | [PipelineManager.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/PipelineManager.js) |
| Phaser 只请求 `'webgl'` 上下文 | `src/renderer/webgl/WebGLRenderer.js:770`（v3.90.0） |
| Phaser `premultipliedAlpha` 默认 true | [Config.js v3.80.1](https://github.com/phaserjs/phaser/blob/v3.80.1/src/core/Config.js) |
| Phaser 默认 sprite shader（BGR tint + 预乘） | [Multi.frag](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/Multi.frag) |
| uniform vs attribute 的 draw call 对比 | [Phaser Dev Log 246](https://phaser.io/devlogs/246) |
