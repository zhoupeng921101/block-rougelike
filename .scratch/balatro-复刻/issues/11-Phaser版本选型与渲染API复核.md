# Phaser 版本选型与渲染 API 复核

Type: wayfinder:research
Status: resolved

## Question

复刻件 pin 哪个 Phaser 版本，以及在那个版本上「每张卡独立的 shader uniform」成不成立。

### 背景

[shader 能否移植到 Phaser](05-shader能否移植到Phaser.md) 判定 per-instance uniform 可行，
但用的是 **Phaser 3** 的 `onBind(gameObject)` / `PipelineManager.getPostPipeline()` / `pipelineData`。

本 session 核实的事实：

- 模版 `phaserjs/template-vite-ts` 的 `package.json` **已 pin `phaser: 4.0.0`**
- npm `phaser` 的 `latest` 是 **4.2.1**

即目标工程默认就在 v4 上，而那份可行性证据是 v3 的。

### 要查清

1. **Phaser 4 是否移除了 WebGLPipeline / PostFXPipeline / PipelineManager**，
   是否改为 RenderNode + `setupUniforms`。（这是上一张票的断言，未经证实；
   官方文档与 changelog 的几个 URL 本 session 访问均 404，换别的入口查。）
2. **判定性问题在 v4 上重做**：能不能对单个 sprite 挂自定义 fragment shader
   并传 per-instance uniform。Balatro 每张卡的全息参数独立，做不到这条外观轴就不成立。
3. v4 是 WebGL1 还是 WebGL2。报告称 Phaser 3.90 源码里只有 `getContext('webgl')`，
   纯 WebGL1 无法强制 WebGL2——v4 是否仍然如此。
   这条影响 `hologram.fs:58` 那个非常量循环边界要不要改。
4. v4 有没有等价于 v3 post-pipeline 的全屏后处理，用来做 CRT。
5. 如果 v4 做不到而 v3 做得到：**降级到 Phaser 3.90 的代价是什么**
   （v3 已停止演进，3.90.0 是最后一版）。模版要改哪些地方。

### 产出

一个明确的版本裁定 + 在该版本上 per-instance uniform 的**源码级**证据
（不是文档措辞，要能指到实现）。若结论是 v4 可行，顺便重估
[shader 票](05-shader能否移植到Phaser.md) 那个 9–16 人日的量级。

**这张票阻塞 [工程骨架落地](01-工程骨架落地.md)**：骨架 pin 哪个版本由它决定。

## Answer

**留在 Phaser 4（pin `4.2.1`）。判定性问题是 YES，但对象模型与 v3 不同。**

证据来自 `npm pack phaser@4.2.1` 解包后的真源码，不是文档措辞。

### 1. Pipeline 体系确已移除

`src/` 下 `WebGLPipeline` / `PostFXPipeline` / `PipelineManager` **零命中**。
取而代之的是 `src/renderer/webgl/renderNodes/`，目录里没有 `pipelines/`。
上一张票的这条断言属实。

**推论**：[shader 能否移植到 Phaser](05-shader能否移植到Phaser.md) 里
基于 `onBind` / `pipelineData` 的那套方案在 v4 上不存在，确实要换路子。

### 2. 判定性问题：per-instance uniform —— **成立**

不走 Filter 体系，走 **`Shader` GameObject**（`src/gameobjects/shader/Shader.js`，610 行）。
三条源码级证据：

| 事实 | 位置 |
|---|---|
| **每个 Shader 实例 `new` 一个自己的 renderNode** —— `this.renderNode = new ShaderQuad(renderer.renderNodes, config)` | `Shader.js:151` |
| `setUniform(name, value)` 写进该实例自己的 `programManager` | `Shader.js:291-293` |
| **`setupUniforms(setUniform, drawingContext)` 每帧渲染时自动调用**，用于逐帧变化的 uniform——这就是 v3 `onBind` 的等价物 | `Shader.js:447-475` |

注释原文：*"The function which sets uniforms for the shader. This is called automatically
during rendering."* 且 *"`uProjectionMatrix` is set for you automatically."*

**「像素级外观」这条轴在 v4 上成立。**

### 3. 但对象模型要换：卡牌是 `Shader` 而不是 `Sprite`

这是 v4 路线与 v3 方案最大的实质差别，落地前必须知道。
`Shader` 只混入 8 个组件：

`BlendMode` / `ComputedSize` / `Depth` / `GetBounds` / `Origin` / `ScrollFactor` / `Transform` / `Visible`

**没有** Animation、Tint、Flip、TextureCrop，而且 **`setAlpha` 是显式 NOOP**
（`Shader.js:486`，注释说 *"It should be handled via uniforms in the shader code itself"*）。

对 Balatro 而言这**不构成阻碍**，反而对味：

- 卡牌本来就不用 sprite 动画，靠 shader + transform 补间
- alpha 本来就在 `dissolve.fs` 里处理，原作就是这么干的
- 图集支持完整：`setTextureCoordinatesFromFrame(frame, texture)`（`Shader.js:559`）
  可直接取 atlas 的某一帧；`setTextures()` 支持多纹理单元

**代价**：交互要自己挂 hit area（`Shader` 不带 Input 组件的默认尺寸推断），
深度排序靠 `Depth` 组件手工管。

### 4. WebGL 版本：仍是 WebGL 1

`WebGLRenderer.js:709`：`canvas.getContext('webgl', ...) || canvas.getContext('experimental-webgl', ...)`
——**没有任何 webgl2 上下文创建路径**，与 v3 相同。

但 `WebGLRenderer.js:896-905` 有一层补偿：把 WebGL2 的部分核心特性
（instanced arrays、VAO）通过扩展挂到 WebGL1 的 `gl` 对象上，
注释写 *"Make WebGL2 core features which were extensions available on the WebGL1 context."*

**结论**：`hologram.fs:58` 那个非常量循环边界**仍然要改成 `const`**。
GLSL 版本没变，补偿的是 API 不是着色器语言。

### 5. CRT 全屏后处理：可行，但也不走 Filter

Filter 清单 24 个全是内置的（Barrel / Blur / Bokeh / ColorMatrix / …），
**没有「自定义 fragment shader」这个入口**。所以 19 个 Balatro shader 一个都进不了 Filter 体系。

CRT 的路子是 `CaptureFrame`：

```js
this.cameras.main.setForceComposite(true);
// ...场景内容...
this.add.captureFrame('scene');           // 捕获到具名纹理
// 再挂一个全屏 Shader GameObject，采样 'scene' 纹理跑 CRT
```

### 6. 降级到 Phaser 3.90 的代价 —— 不适用

第 5 问的前提（v4 做不到而 v3 做得到）不成立，无需降级。
v3 已停止演进，留在 v4 是正确的默认。

### 裁定

- **pin `phaser@4.2.1`**（模版默认是 `4.0.0`，`Shader` 的相关 API 标的都是 `@since 4.0.0`，
  两者都能用；取 latest 拿 bug 修复）
- [工程骨架落地](01-工程骨架落地.md) 的阻塞**解除**

### 对 shader 票工作量估计的影响

[shader 票](05-shader能否移植到Phaser.md) 那个「9–16 人日」是按 v3 的 pipeline + Sprite 估的。
v4 路线下卡牌改成 `Shader` GameObject，**至少三块要重估**：
对象模型改造、交互 hit area、深度排序。
估算重做放进 [Phaser 4 渲染路线 spike](13-Phaser4渲染路线spike.md)。
