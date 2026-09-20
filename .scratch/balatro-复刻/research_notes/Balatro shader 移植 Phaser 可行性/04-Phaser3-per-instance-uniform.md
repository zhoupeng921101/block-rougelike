# Phaser 3 自定义 WebGL Pipeline 与 per-instance uniform 可行性

> 口径：Phaser **3.90.0**（2025-05-23 发布，v3 分支最后一个正式版）。源码引用均取自 tag `v3.90.0`。
> 重要背景：Phaser **v4.1.0**（2026-04-30）已是官方最新稳定版，而 v4 重写了渲染器、**移除了 Pipeline 体系**（改为 RenderNode / `setupUniforms(setUniform, drawingContext)` 风格的 Shader 对象）。本笔记只覆盖 Phaser 3，但选型时这条必须计入。

---

## 结论（判定性回答）

### **YES —— Phaser 3 能对单个 sprite 传独立 uniform，而且有两条互不相同、都被官方源码坐实的路。**

但代价明确：**per-instance uniform 必然打断 batch**，官方 Dev Log 自己用数据承认了这一点（同一场景，uniform 方案 128 个 draw call，attribute 方案 1 个 draw call + 7 次 gl 操作）。对 Balatro 这种「20–40 张卡」的量级，这个代价在预算内；对「上千个粒子」才不行。

### 四条路逐条评估

| 方案 | 机制 | 可行性 | 代价 | 推荐度 |
|---|---|---|---|---|
| **(a) `pipelineData` + `onBind(gameObject)` / `onBatch(gameObject)` 里 `set1f()` + `flush()`** | 一个共享 pipeline 实例，渲染每个 GO 时读它的 `pipelineData` 改 uniform，然后手动 flush | **确定可行**。`onBind` 的官方定义就是"每次有 Game Object 要求使用本 pipeline 时调用，**即使 pipeline 已经是 active 的**"，且明说用途是"per-object set-up, such as loading shader uniform data" | 每张卡 1 个 draw call（batch 被打断）；需要自己写 pipeline 类、自己管 flush 时机 | ★★★★☆ **首选**。这是 Phaser 官方为这个场景设计的 hook |
| **(b) 每 GO 一个 `PostFXPipeline` 实例（`setPostPipeline(MyFX)`）** | **已在源码确认：`PipelineManager.getPostPipeline()` 里 `var newPipeline = new instance(this.game, config)`，每次调用都 new 一个新实例并把 `gameObject` 挂上去** | **确定可行**，且 uniform 天然隔离（每个实例自己的 shader program 状态 + 自己的 `gameObject` 引用） | 每个对象先渲染到 render target 再做一次全屏 quad 合成 → 每张卡至少 2 个 draw call + 一次 FBO 切换；但 render target 是 **共享** 的（fullFrame1/2、halfFrame1/2 来自 UtilityPipeline），不是每对象一份，显存不爆 | ★★★★☆ 想快速出效果、不想碰 batch 逻辑时最省心 |
| **(c) per-instance 数据塞进 vertex attribute，扩展 batch 的 vertex layout** | 自定义 pipeline 的 `attributes` 配置里加 `inHoloAngle` 等，`batchQuad` 时每个顶点写入 | **可行且性能最好**。官方 Dev Log 246 的示范就是这个：*"all of those sprites are rendered, they're still fully batched"*，**1 个 draw call / 7 次 gl 操作** vs uniform 方案的 **128 个 draw call** | 要重写 `batchSprite`/顶点写入逻辑，工程量最大；attribute 数量受 GPU `MAX_VERTEX_ATTRIBS` 限制；每个 float 要写 4 次（4 个顶点），随机种子/角度等标量浪费带宽 | ★★☆☆☆ Balatro 只有几十张卡，用不上；若将来要画几百个带 shader 的小对象再回来 |
| **(d) `Phaser.GameObjects.Shader`（独立 shader quad）** | 每个实例自带完整 uniform 集合 + `setUniform` / `setSampler2D` / `setChannel0-3` | 可行，API 最直白 | **官方文档明写**："These Shaders work by halting the current pipeline during rendering... it will interrupt any batching that is currently going on, so you should use these Game Objects sparingly"；另外 **不能直接改 alpha / blendMode**（必须自己在 shader 里开 uniform 处理） | ★★☆☆☆ 适合做 1–2 个全屏背景/特效 quad（Balatro 的动态背景正合适），不适合当"每张卡一个" |

**给 Balatro 复刻的落地建议**：卡面全息/箔面走 **(a)**（或懒人版 **(b)**）；Balatro 那个流动的彩色背景走 **(d)**；CRT/暗角走 **camera.setPostPipeline()**。

---

## 1. Phaser 3 自定义 pipeline 的 API 形状

### Takeaway
Phaser 3.50 是分水岭：它把旧的 `TextureTintPipeline` 重构成 `WebGLPipeline` + 多 shader 体系，并引入 `pipelineData` 与 `PostFXPipeline`；3.60 在 PostFX 之上补了 `PreFXPipeline` 和 `preFX`/`postFX` 组件与 14+ 个内建 FX。3.60 → 3.90 之间这套 API 形状没有破坏性变化，3.90 是 v3 的终点。

### Cited Findings
- Phaser 3.90「Tsugumi」于 2025-05-23 发布，是 Phaser 3 的最后一个正式版；当前最新稳定版已是 v4.1.0（2026-04-30） — [Phaser v3.90 Released](https://phaser.io/news/2025/05/phaser-v390-released)
- 3.50 的 `WebGLPipeline` 升级为"单个 pipeline 可以挂任意多个 shader，它们共享同一个 vertex buffer"，通过配置对象里的 `shaders` 数组声明 — [Phaser Dev Log 246](https://phaser.io/devlogs/246)
- 3.50 起 Game Object 可以携带 "pipeline data"，即"设置 pipeline 时可以一起给一个对象，里面装 pipeline 能用的信息" — [Phaser Dev Log 246](https://phaser.io/devlogs/246)
- `pipelineData` 的官方定义："An object to store pipeline specific data in, to be read by the pipelines this Game Object uses"，且"**pipeline 与 post pipelines 共享同一个 pipeline data 对象**" — [Phaser.GameObjects.Components.Pipeline](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Pipeline.html)
- `PostFXPipeline` 是"专门处理后处理特效的一种特殊 pipeline"，3.50 引入；"标准 Pipeline 让你控制 Game Object **被绘制** 的过程（配置 shader 与 attribute），PostFX Pipeline 则是在 Game Object **已经绘制完** 之后再加工" — [PostFXPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.Pipelines.PostFXPipeline.html)
- `PreFXPipeline`"让你控制对象自身的渲染 —— 把它交给它自己的一张贴图，在那里做多缓冲合成"；**只支持 Sprite / Image / Text / TileSprite / RenderTexture / Video** — [PreFXPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/pipelines/PreFXPipeline.js)
- 注册方式两套且**不通用**：`pipelineManager.add(name, pipelineInstance)` 收的是**实例**；`pipelineManager.addPostPipeline(name, pipelineClass)` 收的是**类**，源码注释明写 "Make sure to pass a base class to this method, not an instance" — [PipelineManager.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/PipelineManager.js)
- 挂载：`sprite.setPipeline(name, pipelineData)`（设置 pipeline 时若给了参数，会同时设置 `pipelineData`）；`gameObject.setPostPipeline(pipelines, pipelineData, copyData)`，内部 `pipelineManager.getPostPipeline(pipelines[i], this, pipelineData)` 后 push 进 `this.postPipelines` — [PostPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/gameobjects/components/PostPipeline.js)
- 各 pipeline 分工（源码/文档）：`MultiPipeline` 是默认 sprite batch pipeline（多纹理单元批量绘制）；`SinglePipeline` 是单纹理单元版本，用于多纹理有兼容问题的设备；`MobilePipeline`（3.60+）为移动端；`UtilityPipeline` 提供 copy/blit/render target 工具给 FX 用 — [MultiPipeline](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.Pipelines.MultiPipeline.html)、[UtilityPipeline](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.Pipelines.UtilityPipeline.html)

### Inferences
- `setPipeline()`（pre/正常 pipeline 槽）与 `preFX` 竞争同一个槽位：`preFX` 的实现就是把对象的 pipeline 换成 `PreFXPipeline` 派生类。所以**自定义 MultiPipeline 和内建 `sprite.preFX.addGlow()` 大概率不能在同一个 sprite 上共存**（官方文档没有正面说明，见 Gaps）。而 `postFX` 走独立的 `postPipelines` 数组，与 `setPipeline` 不冲突 —— 这是 (b) 方案的一个隐性优点。
- 对 Balatro：「卡面材质 shader」应该占 pipeline 槽（方案 a），「卡牌整体的辉光/阴影」用 postFX，两者可叠。

### Gaps
- 官方文档未正面说明 `setPipeline(自定义)` 与 `preFX.addXxx()` 的互斥关系，需要实测验证。

---

## 2.【判定性】per-instance uniform

### Takeaway
能做。官方 hook `onBind(gameObject)` 和 `onBatch(gameObject)` 就是为"每个对象不同 uniform"设计的，社区与官方 Dev Log 都有明确用法；代价是每个对象一次 flush = 一个 draw call，Phaser 官方自己把这条路标注为"expensive"，并推荐 attribute 方案做高密度场景。

### Cited Findings

**(a) `pipelineData` + `onBind` / `onBatch`：是官方认可的做法**
- `onBind(gameObject)` 官方定义逐字："This method is called every time a **Game Object** asks the Pipeline Manager to use this pipeline, **even if the pipeline is already active**." 用途："per-object set-up, such as loading shader uniform data" — [WebGLPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.WebGLPipeline.html)
- `onBatch(gameObject)` 官方定义："This method is called every time the `batchQuad` or `batchTri` methods are called"，在 quad/tri **已经加入 batch 之后** 立即调用，并且"**你可以安全地在其中调用 flush**" — [WebGLPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.WebGLPipeline.html)
- 官方文档另一处措辞：`onBatch` hook"会为每一个请求使用该 pipeline 的 Game Object 调用，允许你做 per-object 的准备工作，比如加载 shader uniform 数据" — [MultiPipeline 文档](https://docs.phaser.io/api-documentation/class/renderer-webgl-pipelines-multipipeline)
- 社区经验证的最小写法（Phaser 论坛，TypeScript）：
  ```ts
  onBind(gameObject: GameObjects.GameObject) {
      super.onBind();
      const data = gameObject.pipelineData;
      this.set1f('uDyePaletteIndex', data.dyeIndex);
  }
  onBatch(gameObject: GameObjects.GameObject) {
      if (gameObject) { this.flush(); }
  }
  ```
  提问者总结："onBind is called on every game object that contains the pipeline and this is where you set your per object variables" — [[Custom Pipeline] Settings uniforms per object](https://phaser.discourse.group/t/custom-pipeline-settings-uniforms-per-object/13666)
- `MultiPipeline.batchSprite()` 在方法最开头调用 `this.manager.set(this, gameObject)`（这一步触发 `onBind(gameObject)`），并围绕批处理调用 `this.manager.preBatch(gameObject)` / `this.manager.postBatch(gameObject)`（后者负责跑该对象的 postPipelines） — [MultiPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/pipelines/MultiPipeline.js)

**batching 影响（判定性的代价数据）**
- Dev Log 246 原话："it becomes expensive for the GPU to keep setting uniforms... **WebGL is unable to batch together these sprites because it has to draw them between each call**" — [Phaser Dev Log 246](https://phaser.io/devlogs/246)
- 同一场景的实测对比：attribute 方案 = "Just **7 gl operations** for the whole Scene and **1 draw call**"；uniform 方案 = "**128 draw calls**" — [Phaser Dev Log 246](https://phaser.io/devlogs/246)
- `batchQuad` 官方描述："Adds the vertices data into the batch **and flushes if full**"，返回 true 表示本次调用触发了 flush — [WebGLPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.WebGLPipeline.html)
- `flush(isPostFlush)`："Uploads the vertex data and emits a draw call for the current batch of vertices" — 即手动 flush 完全合法，是公开 API — [WebGLPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.WebGLPipeline.html)

**(b) PostFXPipeline 每 GameObject 独立实例 —— 源码确认**
- `PipelineManager.getPostPipeline(pipeline, gameObject, config)` 关键行逐字：
  ```js
  var newPipeline = new instance(this.game, config);
  newPipeline.name = pipelineName;
  if (gameObject) { newPipeline.gameObject = gameObject; }
  this.postPipelineInstances.push(newPipeline);
  return newPipeline;
  ```
  → **每次 `setPostPipeline()` 都 `new` 一个全新实例，并把 gameObject 反向挂上去** — [PipelineManager.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/PipelineManager.js)
- `gameObject.getPostPipeline(pipeline)` 返回的是**实例**（在 `this.postPipelines` 里按 name 或 `instanceof` 匹配），单个命中返回实例本身，多个命中返回数组 — [PostPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/gameobjects/components/PostPipeline.js)
- rex 的笔记同样确认："`camera.setPostPipeline(MyPostFxClass);` Will **create an effect instance** then push it into postPipelines list" — [Post fx pipeline - Notes of Phaser 3](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/postfx-pipeline/)

**(c) vertex attribute 方案**
- 3.50 起"可以把 shader attribute 作为配置的一部分声明，新的 pipeline 与 shader 类会**自动算出所有尺寸** —— 你只需要说明有哪些 attribute、类型是什么、有几个" — [Phaser Dev Log 246](https://phaser.io/devlogs/246)
- 结果："all of those sprites are rendered, they're still **fully batched**" — [Phaser Dev Log 246](https://phaser.io/devlogs/246)

### Inferences
- **(a) 的正确写法**是把 `set1f/set2f/set4f` 放 `onBind`（或 `onBatch`），并在 `onBatch` 里 `flush()`。理由：`onBind` 在该 GO 的顶点写入**之前**触发，`onBatch` 在顶点写入**之后**触发；若只在 `onBind` 里设 uniform 而不 flush，后一个 GO 的 `onBind` 会在前一个 GO 的顶点还在 buffer 里时就覆盖掉 uniform，导致"所有对象拿到最后一个对象的值"——这正是论坛提问者最初遇到的现象。**先设值 → 写顶点 → 立刻 flush**，才能保证一一对应。
- 20–40 张卡 → 20–40 次额外 draw call。官方自己的 128 draw call 版本是能跑起来的（只是被标为"expensive"）；现代桌面/移动浏览器每帧几百个 draw call 属于常规量级。**Balatro 这个量级不构成性能风险**，瓶颈更可能在 fragment shader 本身的复杂度和卡面分辨率。（此条为推论，本轮未找到 20–40 sprite 规模的实测基准。）
- **(b) 比 (a) 更贵但更简单**：每个对象要走 FBO 绑定 + 全屏 quad 合成。但 render target 是全局共享的四张（fullFrame1/2、halfFrame1/2，来自 UtilityPipeline），所以**显存不随卡数增长**，只是 FBO 切换次数增长。
- 对 Balatro 的具体映射：每张卡需要的 uniform（旋转角、倾斜量、纹理区域 uv rect、随机种子）都是标量/vec2/vec4，总量很小，`pipelineData` 里放一个 plain object，`onBind` 里 4–6 次 `setXf` 即可。

### Gaps
- 未找到 Phaser 官方对 "N 个 sprite 各自 flush" 的正式 benchmark（只有 Dev Log 246 的 128 vs 1 对比，未给 FPS 数字）。
- 未验证 `onBatch` 里 `flush()` 与 camera 的 scissor/mask 状态是否有边界情况。

---

## 3. `Phaser.GameObjects.Shader` 对象

### Takeaway
每个 `Shader` 实例有完全独立的 uniform 集合和纹理绑定，能像普通 GO 一样缩放/旋转/进 Container/被遮罩，但**每个都强制打断 batch**，官方明说"sparingly"，且不能直接改 alpha 和 blendMode。适合做 1–2 个大 quad（背景、全屏特效），不适合"每张卡一个"。

### Cited Findings
- 类文档逐字："A Shader Game Object. This Game Object allows you to easily add a quad with its own shader into the display list, and manipulate it as you would any other Game Object, **including scaling, rotating, positioning and adding to Containers**." — [Shader.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/gameobjects/shader/Shader.js)
- 批处理警告逐字："These Shaders work by **halting the current pipeline during rendering**... it will **interrupt any batching** that is currently going on, so you should use these Game Objects **sparingly**. If you need a fully batched custom shader, then please look at using a **custom pipeline** instead." — [Phaser.GameObjects.Shader 文档](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Shader.html)
- alpha/blend 限制逐字："Due to the way in which they work, **you cannot directly change the alpha or blend mode of a Shader**. This should be handled via exposed uniforms in the shader code itself." — 同上
- 遮罩支持："can be masked with either Bitmap or Geometry masks and can also be used as a Bitmap Mask for a Camera or other Game Object" — [Shader.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/gameobjects/shader/Shader.js)
- 公开方法（v3.90.0 源码）：`setShader(key, textures, textureData)`、`setSampler2D(uniformKey, textureKey, textureIndex, textureData)`、`setSampler2DBuffer(uniformKey, texture, width, height, textureIndex, textureData)`、`setRenderToTexture(key, flipY)`、`setPointer(pointer)`、`projOrtho(left, right, bottom, top)`、`setUniform(key, value)`、`getUniform(key)`、`setChannel0/1/2/3(textureKey, textureData)` — [Shader.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/gameobjects/shader/Shader.js)
- 内建默认 uniform（ShaderToy 兼容风格）：`resolution`(2f)、`time`(1f)、`mouse`(2f)、`date`(4fv)、`sampleRate`(1f)、`iChannel0–3`(sampler2D) — [Shader.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/gameobjects/shader/Shader.js)
- WebGL only，Canvas renderer 不支持 — 同上
- （Phaser 4 的 Shader 已换成 `setupUniforms(setUniform, drawingContext)` 回调形态，且仍明确"Shaders are stand-alone renders: they finish any current render batch and run once by themselves. As this costs a draw call, you should use them sparingly." — [Phaser 4 Shader 文档](https://docs.phaser.io/api-documentation/class/gameobjects-shader)）

### Inferences
- "每张卡一个 Shader 对象"技术上跑得通（40 张 = 40 个强制 flush，和方案 (a) 的 draw call 数量级一样），但会**丢掉 Phaser 的正常纹理 batch**：卡片的底图、边框、数字文字都会被这些 flush 切碎，实际 draw call 会比方案 (a) 更多。
- 输入交互没有特殊问题：`Shader` 继承标准 GO 组件，`setInteractive()` + 显式 hitArea（因为它不是基于 texture frame 的，多半要手动给 `Phaser.Geom.Rectangle`）。此条未在文档中找到正面说明，属推论。
- **对 Balatro 最合适的用途**：那张全屏流动渐变背景 = 1 个 `Shader` 对象，1 个 draw call，完美匹配；卡面不要用它。

### Gaps
- 文档未说明 `Shader` 的默认 input hitArea 行为，需实测。

---

## 4. PostFXPipeline 细节

### Takeaway
每个 `setPostPipeline()` 调用都 `new` 一个独立实例（源码已确认），所以 uniform 天然 per-GameObject。工作方式是"对象先渲到 render target，再用 shader 画一个全屏 quad 合成回来"，但 **render target 是四张全局共享的**，不是每对象一张。

### Cited Findings
- 实例化：见第 2 节 `getPostPipeline` 源码引用，`new instance(this.game, config)` — [PipelineManager.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/PipelineManager.js)
- 工作原理逐字（PostFXPipeline 类注释）：通过"创建一个极小的 vertex buffer，里面只有一个硬编码的 quad"；对象走常规 pipeline 渲染但被**重定向到 PostFX 的 render target**，之后"可以施加它们自己的 shader 和特效" — [PostFXPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/pipelines/PostFXPipeline.js)
- 构造默认值：1 个 render target，fragment/vertex shader 默认 `PostFX-frag` / `Quad-vert`，两个 attribute `inPosition`(vec2) + `inTexCoord`(vec2)，顶点数据是两个三角形拼成的全屏 quad — 同上
- `onDraw()` 默认实现调用 `bindAndDraw(renderTarget)`；`bindAndDraw()` 绑 shader、设 sampler、可选绑定目标 framebuffer 并清屏、恢复 stencil mask、绑源纹理、`drawArrays` 6 个顶点 — 同上
- **render target 共享**逐字要点：四张 render target —— `fullFrame1`、`fullFrame2`（全分辨率）、`halfFrame1`、`halfFrame2`（半分辨率）—— 在 `bootFX()` 时从 UtilityPipeline 取得，**"shared between all post fx pipelines"** — 同上
- `copyFrame` / `drawFrame` 委托给 manager pipeline：`copyFrame` 用"更快的 copy shader，只能改 brightness"，`drawFrame` 通过 color matrix"完全控制 luminance" — 同上
- PreFX 的 `onDraw` 签名：`onDraw(target, swapTarget, altSwapTarget)`，文档注明："If you override this method, then it should make sure it calls either the `drawToGame` or `copyToGame` methods as the final thing it does." — [PreFXPipeline.js v3.90.0](https://github.com/phaserjs/phaser/blob/v3.90.0/src/renderer/webgl/pipelines/PreFXPipeline.js)
- PreFX 只作用于 Sprite / Image / Text / TileSprite / RenderTexture / Video — 同上；[FX 概念文档](https://docs.phaser.io/phaser/concepts/fx) 给出同一份清单
- 已知渲染顺序问题：在 camera 上同时用 PreFX(SpriteFX) 与 PostFX 时顺序会不符预期 — [phaser issue #6004](https://github.com/photonstorm/phaser/issues/6004)

### Inferences
- 因为 render target 共享，40 张卡各挂一个 PostFXPipeline 实例**不会**产生 40 张 FBO，显存安全；成本集中在 FBO 绑定/解绑与额外 draw call 上（每对象 ≥2）。
- PostFX 路线的隐性收益：它不占 `setPipeline` 槽，因此可以和内建 `preFX` 或自定义 pipeline 叠加使用。
- PostFX 路线的隐性成本：render target 尺寸通常按全屏来，小卡片也走全屏 quad 会有浪费；对 Balatro 的卡片建议优先 (a) 而非 (b)。（推论，未找到官方对 target 尺寸策略的正面说明。）

### Gaps
- PostFXPipeline 对**小尺寸对象**是否会裁剪 render target 区域（还是恒用全屏），源码摘要未覆盖，需实测。

---

## 5. 全屏后处理 / CRT 滤镜

### Takeaway
能做，两条路：自写 `PostFXPipeline` 挂到 camera（`this.cameras.main.setPostPipeline(CRTPostFX)`），或直接组合 3.60 内建的 `camera.postFX.addBarrel()` + `addVignette()`（扫描线仍需自写 shader）。

### Cited Findings
- Camera 支持 `setPostPipeline`：示例 `this.cameras.main.setPostPipeline(HueRotatePostFX);`；"Cameras support all PostFX effects and can create scene-wide effects like zoom blur or pixelation" — [Post fx pipeline - rex notes](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/postfx-pipeline/)、[FX 概念文档](https://docs.phaser.io/phaser/concepts/fx)
- 自定义 PostFX 的写法：继承 `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`，实现 `onPreRender()` 做准备、`onDraw(renderTarget)` 做绘制 — [PostFXPipeline 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Renderer.WebGL.Pipelines.PostFXPipeline.html)
- 3.60 内建 FX（pre 与 post 两套都有）：Barrel、Bloom、Blur、Bokeh、Tilt Shift、Circle、ColorMatrix、Displacement、Glow、Gradient、Pixelate、Shadow、Shine、Vignette、Wipe、Reveal；**仅 WebGL 模式可用** — [FX 概念文档](https://docs.phaser.io/phaser/concepts/fx)
- 具体 API：`GameObject.preFX.addBarrel` / `addDisplacement` / `addVignette` / `addShine` / `addBloom` / `addPixelate` / `addColorMatrix` / `addCircle` / `addBlur` / `addGradient` / `addShadow` 等 — [Phaser 3.60 FX 变更日志](https://github.com/phaserjs/phaser/blob/v3.60.0/changelog/3.60/FX.md)
- 质量/性能权衡：更高的 effect steps 更平滑，"at the cost of **exponentially more gl operations**" — [FX 概念文档](https://docs.phaser.io/phaser/concepts/fx)
- 现成社区/官方 PostFX 包：[phaserjs/warp-post-fx（Phaser 3 Warp Post FX Pack）](https://github.com/photonstorm/phaser3-warp-post-fx)；rex 的 [Horri-fi shader](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shader-horrifi/)（含扫描线/色差等 CRT 风格参数）

### Inferences
- CRT 的三要素拆解：桶形畸变 → 直接用内建 `addBarrel()`；暗角 → 内建 `addVignette()`；扫描线 + RGB 色差 + 微光 → 需要自写 `PostFXPipeline` 的 fragment shader（十几行 GLSL）。合起来一个自写 CRT PostFX 更省 draw call。
- rex 的 Horri-fi 是本轮找到的最接近"现成 CRT"的 Phaser 3 实现，可直接借鉴其 shader 源码。

### Gaps
- 本轮**没有找到**一个官方 examples 里标注为 "CRT" 的 Phaser 3 示例；CRT 需自行拼装或改 Horri-fi。

---

## 6. 实战例子

### Takeaway
最直接对口的"每个 sprite 不同 uniform"示例是 Phaser 论坛那个帖子（含可直接抄的 TS 代码）和官方 Dev Log 246（含 uniform vs attribute 的对照与数据）。官方 examples 站本轮没找到专门的 per-sprite-uniform 条目。

### Cited Findings
- **[[Custom Pipeline] Settings uniforms per object — Phaser Discourse #13666](https://phaser.discourse.group/t/custom-pipeline-settings-uniforms-per-object/13666)** — 完整问题→解法闭环，代码见第 2 节。要点：`onBind` 里读 `gameObject.pipelineData` 设 uniform，`onBatch` 里 `flush()`。
- **[Phaser Dev Log 246](https://phaser.io/devlogs/246)** — Phaser 作者本人写的 3.50 pipeline 重构说明，同时给出 uniform 方案与 attribute 方案的完整对照和 draw call 数据（128 vs 1）。
- **[Sprite Outline with Phaser 3 — Junhong Wang (Medium)](https://medium.com/@junhongwang/sprite-outline-with-phaser-3-9c17190b04bc)** — 系列文章，自定义 pipeline 做描边，含完整可运行代码。
- **[rex notes — Post fx pipeline](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/postfx-pipeline/)** — PostFX pipeline 的类模板、注册、`setPostPipeline`/`getPostPipeline`/`removePostPipeline` 用法（Phaser 3 社区事实标准参考）。
- **[phaserjs/warp-post-fx](https://github.com/photonstorm/phaser3-warp-post-fx)** — 官方作者的 PostFX 效果包，可作为自写 PostFXPipeline 的模板工程。
- **[rex notes — Horri-fi shader](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shader-horrifi/)** — CRT/恐怖片风格后处理（扫描线、色差、噪点、暗角）。

### Gaps
- `labs.phaser.io` / `phaser.io/examples` 本轮检索未返回明确的"每 sprite 不同 uniform"官方示例条目；官方示例站有 `pipelines/` 分类但具体条目未验证。

---

## 7. 替代方案一句话对比

### Takeaway
在"每个对象独立 shader 参数"这件事上，PixiJS v8 和 three.js 都比 Phaser 3 更顺，但顺的方式不同；Phaser 3 的差距是"要多写一个 pipeline 类"，不是"做不到"。

### Cited Findings
- 本节**未经本轮检索验证**（本轮工具预算全部投入 Phaser 3 的判定性问题），以下属既有知识，落定前需单独核实。

### Inferences（均为推论，需核实）
- **PixiJS v8**：`Mesh` + 自定义 `Shader`/`Filter`，每个 Mesh 自带 uniform group（UBO），per-object uniform 是一等公民、无需理解 batch 内部；代价同样是不参与 batch。整体比 Phaser 3 少一层概念。
- **three.js**：per-mesh `ShaderMaterial` 是最自然的形态（每个 mesh 一个 material 实例，uniform 天然隔离），还能用 `InstancedMesh` + instanced attribute 做到既独立又批量 —— 在这件事上是三者中最顺的；代价是 2D 的一切（display list、输入、文本、Tween）都要自己搭。
- **判断**：Balatro 复刻只有几十张卡，Phaser 3 方案 (a) 的额外工程量约"一个 100 行的 pipeline 类"，不构成换引擎的理由。真正值得权衡的是第 0 节那条：**Phaser 3 已停更（3.90 终结），Phaser 4 移除了 pipeline 体系**，本笔记里 (a)(b)(c) 三条路在 v4 上都要重写。

### Gaps
- PixiJS v8 / three.js 的具体 API 与性能数据本轮未检索，如果要作为选型依据必须补一轮调研。
