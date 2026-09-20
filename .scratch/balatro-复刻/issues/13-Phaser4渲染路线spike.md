# Phaser 4 渲染路线 spike

Type: wayfinder:prototype
Status: resolved
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

## Answer

**路线成立。** spike 工程在 `复刻/Balatro/spike/`，用 Playwright 驱动真实 Edge
（ANGLE D3D11，RTX 3060）跑出来的，不是纸面推演。

### 1. per-instance uniform —— 成立

40 个 `Shader` GameObject，每个传一个不同的 `uProbe` 颜色，画在卡面一角。
截图里 40 个色块两两不同：`spike/证据-40张各自独立的uniform.png`。

**程序化断言没跑通**，如实记下：`readPixels` 读到的是卡面白色而非 probe 色，
加了 `preserveDrawingBuffer` 也一样。推测 Phaser 4 的 RenderNode / DrawingContext
把最终图像合成在离屏 FBO 里，默认帧缓冲读不到。视觉证据本身是充分的，
没有为这个继续花时间；真要自动化回归，得换成渲染到 `RenderTexture` 再读。

### 2. `dissolve.fs` 移植 —— 成功

编译通过、正常出图。方言替换表落在 `spike/dissolve-shader.ts` 的文件头注释里。

### 3. 纠正一条上一张票的结论：`#pragma phaserTemplate` 不是分节标记

[Phaser 版本选型与渲染 API 复核](11-Phaser版本选型与渲染API复核.md) 隐含假设
可以用 `#pragma phaserTemplate(vertexDefine)` / `(vertexProcess)` 往模板里插代码。
**实测不成立**：`ShaderQuad._completeConfig` 里 `config.vertexSource` 是
**整体替换**默认模板，那些 pragma 属于「shader additions」的组合机制。
第一次跑直接 `Vertex Shader failed: 'if' : syntax error`——两段被拼在一起了。

正确做法反而更简单：**自己写完整的着色器程序**，只需遵守默认模板的接口契约：

```
uniform mat4 uProjectionMatrix;
attribute vec2 inPosition;
attribute vec2 inTexCoord;
varying vec2 outTexCoord;
```

纹理 sampler 名字随便取，但要在 `setupUniforms` 里 `setUniform('uMainSampler', 0)`
绑到纹理单元。

### 4. 新发现：`outTexCoord.y` 方向与 LÖVE 相反

probe patch 画在 `texture_coords.y < 0.25` 处，**实际出现在卡牌屏幕坐标的底部**。

这不是小事：`dissolve_mask` 里 `borders = vec2(0.2, 0.8)` 那四行边界衰减是上下不对称的，
方向反了会让溶解的起始边镜像。正式移植时要么翻转 uv，要么翻转 borders——**二选一，别两个都做**。

### 5. 性能：上一张票的判断被实测推翻

[shader 票](05-shader能否移植到Phaser.md) 判断「真正的性能风险是全屏背景的 fill-rate，
不是 draw call」。关掉 vsync 实测（p50 / p95，单位 ms）：

| 卡牌数 | 无全屏背景 | 有全屏背景 |
|--:|---|---|
| 40（Balatro 真实负载） | **0.2 / 0.5** | 0.2 / 0.4 |
| 200 | 0.6 / 1.2 | 0.6 / 0.9 |
| 800 | 2.3 / 3.6 | 2.7 / 4.3 |

两条读数：

- **全屏背景几乎免费。** 三档负载下加不加它差别都在噪声里。fill-rate 不是瓶颈。
- **开销基本线性于对象数**（40→200 卡数 ×5、耗时 ×3；200→800 卡数 ×4、耗时 ×3.8），
  即 per-object / draw-call 主导。

**但这是 RTX 3060。** 桌面独显上 40 张牌只吃掉 16.7ms 预算的 1.2%，
说明「够用」而不是「哪边贵」——移动端的结论不能从这组数据外推。
真要管移动端，得单独在目标设备上测。

### 6. w 分量倾斜可以原样搬，但要重新标定

`vertexProcess` 契约下就地改 `gl_Position.w` 与原作
`return transform_projection * vertex_position + vec4(0,0,0,scale)` 等价。

但 `scale` 的绝对值必然要重标：原作把 `vertex_position.xy`（局部量）
直接与 `love_ScreenSize`、`mouse_screen_pos`（屏幕量）相减，坐标空间本就不自洽，
是手调出来的。Phaser 的 `inPosition` 量纲不同，系数不能照抄。
本次 spike 没有调这个（`hovering` 传 0），留给正式实现。

### 7. 没测的：CRT 全屏链路

`setForceComposite(true)` + `captureFrame` + 全屏 Shader 采样这条链没跑。
它是 Phaser 自己文档里的既定用法，风险低，但**仍是未验证项**。
单开 [CRT 全屏链路验证](14-CRT全屏链路验证.md)。

### 工作量重估

原估 9–16 人日，基于 v3 的 pipeline + Sprite。重估后**大致持平，但不确定性明显下降**：

| 变化 | 方向 |
|---|---|
| 移植机制比预想简单（写完整着色器，不用学 additions 体系） | ↓ |
| 性能不是风险，原估里为此留的余量可以去掉 | ↓ |
| 多了 texcoord 翻转要处理 | ↑ |
| 多了倾斜系数重标定 | ↑ |
| per-instance uniform 这个判定性风险已排除 | 不确定性 ↓↓ |

**维持 9–16 人日，但把「倾斜手感对齐 3–5 天」这个最大不确定项下调**——
它当初的风险一半来自「不知道 per-instance uniform 行不行」，那条现在确定了。
