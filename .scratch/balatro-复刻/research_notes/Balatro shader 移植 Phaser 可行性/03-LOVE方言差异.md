# LÖVE 2D (11.x) shader 方言 vs 原生 GLSL / WebGL GLSL ES 1.00

> 口径：LÖVE 11.5（Balatro 1.0.1o 所用大版本），目标 Phaser 3.80 的 WebGL1（默认）与 WebGL2。
>
> **方法说明**：`love2d.org/wiki` 全站被 Cloudflare 拦截（WebFetch / curl 均返回 HTTP 403，含 `r.jina.ai` 代理），所以本笔记**不引用 wiki**，改为直接引用 LÖVE 11.5 的源码。这实际上是更强的一手来源：LÖVE 的 GLSL 包装层完全写在一个 Lua 文件里，可以逐字核对。
>
> 核心事实来源：[love/11.5/src/modules/graphics/wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua) —— 这是 LÖVE 11.x 拼接 GLSL 的全部逻辑，494 行，没有其它隐藏注入。

---

## Q1. LÖVE shader 的语法糖清单（逐条 → 原生 GLSL 等价写法）

### Takeaway

LÖVE 11.x 的"方言"**不是编译器魔法，而是一段纯文本的 `#define` 前缀 + 一个固定的 `main()` 包装**，全部可在 `wrap_GraphicsShader.lua` 里逐字读到。把 `.fs` 改写成 WebGL fragment shader 基本等于「把这段前缀里用到的 define 手动展开、把 `effect()` 换成 `main()`」，属于机械操作而非语义推导。

### Cited Findings

LÖVE 用 `createShaderStageCode()` 把用户代码拼在下面这些块之后，顺序为：`VERSION` → `#define PIXEL PIXEL`（或 `VERTEX`）→ 可选的 `LOVE_GLSL1_ON_GLSL3` / `LOVE_GAMMA_CORRECT` / `LOVE_MULTI_CANVAS` → `SYNTAX` → `<STAGE>.HEADER` → `UNIFORMS` → `FUNCTIONS` → `<STAGE>.FUNCTIONS` → `<STAGE>.MAIN` → `#line` → 用户代码 — [wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**类型别名（`GLSL.SYNTAX`，逐字）** — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

```glsl
#define number float
#define Image sampler2D
#define ArrayImage sampler2DArray
#define CubeImage samplerCube
#define VolumeImage sampler3D
#define extern uniform
// __VERSION__ >= 300 且非 glsl1-on-glsl3 时额外有：
#define DepthImage sampler2DShadow
#define DepthArrayImage sampler2DArrayShadow
#define DepthCubeImage samplerCubeShadow
```

同块还定义了 `LOVE_HIGHP_OR_MEDIUMP`：

```glsl
#if defined(VERTEX) || __VERSION__ > 100 || defined(GL_FRAGMENT_PRECISION_HIGH)
	#define LOVE_HIGHP_OR_MEDIUMP highp
#else
	#define LOVE_HIGHP_OR_MEDIUMP mediump
#endif
```

**pixel stage 的 `main()` 包装（`GLSL.PIXEL.MAIN`，逐字）**：

```glsl
uniform sampler2D MainTex;
varying LOVE_HIGHP_OR_MEDIUMP vec4 VaryingTexCoord;
varying mediump vec4 VaryingColor;

vec4 effect(vec4 vcolor, Image tex, vec2 texcoord, vec2 pixcoord);

void main() {
	love_PixelColor = effect(VaryingColor, MainTex, VaryingTexCoord.st, love_PixelCoord);
}
```

**vertex stage 的 `main()` 包装（`GLSL.VERTEX.MAIN`，逐字）**：

```glsl
attribute vec4 VertexPosition;
attribute vec4 VertexTexCoord;
attribute vec4 VertexColor;
attribute vec4 ConstantColor;

varying vec4 VaryingTexCoord;
varying vec4 VaryingColor;

vec4 position(mat4 clipSpaceFromLocal, vec4 localPosition);

void main() {
	VaryingTexCoord = VertexTexCoord;
	VaryingColor = gammaCorrectColor(VertexColor) * ConstantColor;
	setPointSize();
	love_Position = position(ClipSpaceFromLocal, VertexPosition);
}
```

**`Texel` 的真身（`GLSL.FUNCTIONS`，逐字节选）**：

```glsl
#if __VERSION__ >= 130 && !defined(LOVE_GLSL1_ON_GLSL3)
	#define Texel texture
#else
	#if __VERSION__ >= 130
		#define texture2D Texel
		#define love_texture2D texture
		...
	#else
		#define love_texture2D texture2D
		...
	#endif
	vec4 Texel(sampler2D s, vec2 c) { return love_texture2D(s, c); }
	vec4 Texel(samplerCube s, vec3 c) { return love_textureCube(s, c); }
	#ifdef PIXEL
		vec4 Texel(sampler2D s, vec2 c, float b) { return love_texture2D(s, c, b); }
	#endif
	#define texture love_texture
#endif
```

→ **`Texel(tex, uv)` 就是 `texture2D(tex, uv)`，没有任何 sRGB / gamma 处理**（gamma 相关函数是另外一组 `gammaToLinear*` / `linearToGamma*`，`Texel` 不调用它们）— [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**输出变量（`GLSL.PIXEL.HEADER`，逐字）**：

```glsl
#define love_MaxCanvases gl_MaxDrawBuffers
#if __VERSION__ >= 130
	#ifdef LOVE_MULTI_CANVAS
		layout(location = 0) out vec4 love_Canvases[love_MaxCanvases];
		#define love_PixelColor love_Canvases[0]
	#else
		layout(location = 0) out vec4 love_PixelColor;
	#endif
#else
	#ifdef LOVE_MULTI_CANVAS
		#define love_Canvases gl_FragData
	#endif
	#define love_PixelColor gl_FragColor
#endif

// See Shader::updateScreenParams in Shader.cpp.
#define love_PixelCoord (vec2(gl_FragCoord.x, (gl_FragCoord.y * love_ScreenSize.z) + love_ScreenSize.w))
```

**vertex HEADER（逐字）**：`#define love_Position gl_Position`；`__VERSION__ >= 130` 时 `#define attribute in` / `#define varying out`，并给出 `love_VertexID = gl_VertexID`、`love_InstanceID = gl_InstanceID`；GL_ES 下有 `uniform mediump float love_PointSize;` 与 `void setPointSize(){ gl_PointSize = love_PointSize; }` — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**矩阵别名（`GLSL.UNIFORMS`，逐字）**：

```glsl
uniform LOVE_HIGHP_OR_MEDIUMP mat4 ViewSpaceFromLocal;
uniform LOVE_HIGHP_OR_MEDIUMP mat4 ClipSpaceFromView;
uniform LOVE_HIGHP_OR_MEDIUMP mat4 ClipSpaceFromLocal;
uniform LOVE_HIGHP_OR_MEDIUMP mat3 ViewNormalFromLocal;
uniform LOVE_HIGHP_OR_MEDIUMP vec4 love_ScreenSize;

// Compatibility
#define TransformMatrix ViewSpaceFromLocal
#define ProjectionMatrix ClipSpaceFromView
#define TransformProjectionMatrix ClipSpaceFromLocal
#define NormalMatrix ViewNormalFromLocal
```

注意：**11.x 里没有 `ModelViewMatrix`**。`ModelViewMatrix` 是 LÖVE 0.9/0.10 时代的名字；11.x 的对应物是 `TransformMatrix` / `ViewSpaceFromLocal` — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**预处理宏**：
- `#define PIXEL PIXEL` / `#define VERTEX VERTEX` 由 `createShaderStageCode` 按 stage 注入（`"#define " ..stage .. " " .. stage`）。所以 `#ifdef PIXEL` / `#ifdef VERTEX` 是 LÖVE 自造的，原生 GLSL 没有。
- `__VERSION__` 是 GLSL 标准宏（不是 LÖVE 的）。**没有名为 `GLSL_VERSION` 的宏** —— 源码里不存在该标识符；LÖVE 里能用的是 `__VERSION__`、`GL_ES`、`GL_FRAGMENT_PRECISION_HIGH`，以及 LÖVE 自己的 `LOVE_GLSL1_ON_GLSL3` / `LOVE_GAMMA_CORRECT` / `LOVE_MULTI_CANVAS` / `LOVE_EXT_TEXTURE_ARRAY_ENABLED` — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**`MainTex` 是 builtin 名字**，在 C++ 侧有枚举绑定：`{ "MainTex", BUILTIN_TEXTURE_MAIN }`，同表还有 `love_VideoYChannel/Cb/Cr`、`ViewSpaceFromLocal`、`ClipSpaceFromView` 等 — [Shader.cpp `builtinNameEntries`](https://github.com/love2d/love/blob/11.5/src/modules/graphics/Shader.cpp)

**stage 判定靠正则**：`isVertexCode` 匹配 `vec4%s+position%s*%(`，`isPixelCode` 匹配 `vec4%s+effect%s*%(`（返回 pixel）或 `void%s+effect%s*%(`（返回 "custom pixel"，改用 `MAIN_CUSTOM` 包装，此时用户自己写 `love_PixelColor = ...`；若代码里出现 `love_Canvases` 则同时开 multicanvas） — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

### Inferences

- 一个 `.fs` 文件里可以**同时**含 `vec4 effect(...)` 和 `vec4 position(...)`，LÖVE 会把同一份文本编译两遍（一遍定义 `PIXEL`、一遍定义 `VERTEX`）。移植时必须把这份文件**拆成两个文件**：一个 `.vert`、一个 `.frag`，并各自只保留该 stage 用到的函数。这是 19 个文件里最大的一条"非逐行"改动。
- 因为 `#define extern uniform` 是纯文本替换，`extern MY_HIGHP_OR_MEDIUMP vec4 foo;` → `uniform highp vec4 foo;`，改写可以用 sed 完成。
- 用户代码里的 `#ifdef PIXEL` / `#ifdef VERTEX` 在拆分后应直接展开为"保留 / 删除"，而不是在 WebGL 里补 define（虽然补 define 也可行且更省事）。

### Gaps

- LÖVE wiki 的 `Shader_Variables` 页被 Cloudflare 403，无法引用官方的一句话语义描述；本节全部依据源码。源码与 wiki 若有出入，以源码为准（wiki 历史上确实落后过，例如仍在列 `ModelViewMatrix`）。

---

## Q2. LÖVE 自动注入的 uniform / attribute / varying 全表

### Takeaway

免声明可用的东西总共只有 **5 个 uniform（+4 个 video 采样器 + MainTex + love_PointSize）、4 个 attribute、2 个 varying**。Phaser 3 **一个都不直接对应**，但每一个都能用 Phaser 的 Pipeline 机制一两行补上；真正需要自己算的只有 `love_ScreenSize`。

### Cited Findings

来源均为 [wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua) + [opengl/Shader.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Shader.cpp)。

| LÖVE 名 | 类型 | stage | 语义（源码依据） | Phaser 3 对应物 |
|---|---|---|---|---|
| `MainTex` | `uniform sampler2D` | PIXEL | 当前绘制的主纹理；C++ 里绑定 `BUILTIN_TEXTURE_MAIN` | `uniform sampler2D uMainSampler`（MultiPipeline 是 `uMainSampler[N]` 数组，PostFX 是单个）。**名字不同，需改** |
| `love_ScreenSize` | `uniform vec4` | 两者 | `(viewport.w, viewport.h, flipZ, flipW)`。见下方 Q3 | **无现成对应**，需自己 `setFloat4`（`gameSize`/`renderer.width,height`） |
| `ClipSpaceFromLocal` / `TransformProjectionMatrix` | `uniform mat4` | 两者 | 完整 MVP | `uProjectionMatrix`（Phaser 的顶点是**已变换过的世界坐标**，只剩正交投影，见 Q3） |
| `ViewSpaceFromLocal` / `TransformMatrix` | `uniform mat4` | 两者 | `gfx->getTransform()`，上传于 `updateBuiltinUniforms()` | 无；Phaser 在 CPU 端把 transform 烘进顶点，此矩阵在 Phaser 语境下≈单位阵 |
| `ClipSpaceFromView` / `ProjectionMatrix` | `uniform mat4` | 两者 | `gfx->getProjection()` | `uProjectionMatrix` |
| `ViewNormalFromLocal` / `NormalMatrix` | `uniform mat3` | 两者 | transform 左上 3×3 的 `transposedInverse()` | 无；需自算（Balatro 未用） |
| `love_PointSize` | `uniform mediump float` | VERTEX，仅 GL_ES | 由 `updatePointSize()` 上传 | 无；Balatro 未用 |
| `love_VideoYChannel` / `Cb` / `Cr` | `uniform sampler2D` | PIXEL | `VideoTexel()` 用的 YCbCr 三平面 | 无；Balatro 未用 |
| `VertexPosition` | `attribute vec4` | VERTEX | 顶点**局部**坐标 | `attribute vec2 inPosition`（Phaser 传的是**世界**坐标） |
| `VertexTexCoord` | `attribute vec4` | VERTEX | UV（xy 有效，zw 供 array/volume 用） | `attribute vec2 inTexCoord` |
| `VertexColor` | `attribute vec4` | VERTEX | 逐顶点颜色（Mesh） | `attribute vec4 inTint` |
| `ConstantColor` | `attribute vec4` | VERTEX | `love.graphics.setColor()` 的值，以 attribute 形式传 | 无直接对应；Phaser 把 tint 与 alpha 合并进 `inTint` |
| `VaryingTexCoord` | `varying LOVE_HIGHP_OR_MEDIUMP vec4` | 两者 | `= VertexTexCoord` | `varying vec2 outTexCoord`（**只有 2 分量**） |
| `VaryingColor` | `varying mediump vec4` | 两者 | `= gammaCorrectColor(VertexColor) * ConstantColor` | `varying vec4 outTint`（注意 Phaser 是 **BGR** 序，见 Q6） |
| `love_PixelColor` | 输出 | PIXEL | `gl_FragColor`（GLSL<130）或 `layout(location=0) out vec4` | `gl_FragColor`（WebGL1）/ 自定义 `out`（WebGL2） |
| `love_Canvases[]` | 输出数组 | PIXEL | `gl_FragData`（GLSL<130）或 `out vec4[gl_MaxDrawBuffers]` | WebGL1 需 `WEBGL_draw_buffers` 扩展；WebGL2 原生。Balatro 未用 |
| `love_PixelCoord` | 宏 | PIXEL | `vec2(gl_FragCoord.x, gl_FragCoord.y*love_ScreenSize.z + love_ScreenSize.w)` | 见 Q3 |
| `love_Position` | 宏 | VERTEX | `gl_Position` | `gl_Position` |
| `love_VertexID` / `love_InstanceID` | 宏 | VERTEX，仅 ≥130 | `gl_VertexID` / `gl_InstanceID` | WebGL1 无；WebGL2 有 `gl_VertexID` |

**Balatro 实测用量**（`E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\shaders\` 下 19 个 `.fs`，本地 grep）：

- `love_ScreenSize` 出现 **28 次**，分布在 `CRT / background / booster / debuff / dissolve / flash / foil / polychrome / holo / hologram / negative / negative_shine / played / splash / voucher` 等
- `love_PixelColor`、`love_Canvases`、`VaryingTexCoord`、`VaryingColor`、`MainTex`、`love_PointSize` 出现 **0 次**
- `Image` 出现 17 次，全部是 `effect()` 的形参类型；**没有一个 `extern Image`** —— 即 19 个 shader 都只采样 `MainTex` 这一张图，不需要额外纹理槽
- `extern` 共 160 处，类型分布：`vec4` 42、`number` 38、`vec2` 37、`float` 31、`bool` 11 —— **全是标量/向量/布尔，没有矩阵、没有采样器、没有数组**

### Inferences

- "自动注入的 uniform 全表"对 Balatro 移植而言实际只有 **`MainTex` + `love_ScreenSize` + `ClipSpaceFromLocal`** 三项需要处理，其余都用不到。这大幅降低了移植的接口面。
- `extern` 全是标量/向量/布尔 → Phaser 端一律用 `pipeline.set1f/set2f/set4f/setBoolean`（或 `setFloat1` 等旧名），没有需要自建 UBO 或纹理数组的情形。
- `ConstantColor`（`setColor` 的值）在 Balatro 里未被 shader 直接读取，但它通过 `VaryingColor` 进入默认 pixel main；由于 Balatro 全部重写了 `effect()` 且忽略第一个 `color` 参数或直接乘上去，Phaser 端用 `outTint` 替代是等价的 —— **但要注意 Phaser 的 tint 是 BGR 序且已预乘 alpha**（Q6）。

### Gaps

- 未逐个确认 19 个 shader 里 `effect()` 的第一个参数 `color/colour` 是否真的被使用（只统计了签名）。这需要读具体文件，属于下一步实现期的核对项，不影响可行性判断。

---

## Q3. 坐标系差异（UV 原点、Y 轴朝向、是否要翻 Y）

### Takeaway

**`texture_coords` 两边完全一致（左上原点、Y 向下），不需要翻。** `screen_coords` 需要翻 Y —— 但这件事 LÖVE 自己已经在 `love_PixelCoord` 宏里做了，Phaser 侧要么复制这个公式，要么改用 `outTexCoord` 重算。

### Cited Findings

**LÖVE 的 `screen_coords`**：由宏 `love_PixelCoord = vec2(gl_FragCoord.x, gl_FragCoord.y * love_ScreenSize.z + love_ScreenSize.w)` 给出 — [wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

`love_ScreenSize` 的 zw 由 `Shader::updateScreenParams()` 填，源码注释逐字：

```cpp
// In the shader, we do pixcoord.y = gl_FragCoord.y * params.z + params.w.
// This lets us flip pixcoord.y when needed, to be consistent (drawing with
// no Canvas active makes the y-values for pixel coordinates flipped.)
GLfloat params[] = { (GLfloat) view.w, (GLfloat) view.h, 0.0f, 0.0f };

if (canvasActive)
{
    // No flipping: pixcoord.y = gl_FragCoord.y * 1.0 + 0.0.
    params[2] = 1.0f;
    params[3] = 0.0f;
}
else
{
    // gl_FragCoord.y is flipped when drawing to the screen, so we un-flip:
    // pixcoord.y = gl_FragCoord.y * -1.0 + height.
    params[2] = -1.0f;
    params[3] = (GLfloat) view.h;
}
```
— [opengl/Shader.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Shader.cpp)

结论：**`screen_coords` 的原点在左上、Y 向下、单位是像素**（与 LÖVE 的 2D 世界坐标系一致）；`love_ScreenSize.xy = (viewport.w, viewport.h)`。

**LÖVE 的 `texture_coords`** = `VaryingTexCoord.st` = `VertexTexCoord.xy`，即顶点 UV 属性原样透传，LÖVE 没有做任何翻转 — [wrap_GraphicsShader.lua `GLSL.VERTEX.MAIN` / `GLSL.PIXEL.MAIN`](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**Phaser 3 的投影**：`this.projectionMatrix.ortho(0, width, height, 0, -1000, 1000);` — [WebGLRenderer.js](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/WebGLRenderer.js)。`bottom=height, top=0` 即 **Y 向下、原点左上**，与 LÖVE 相同。

**Phaser 3 的纹理上传默认不翻 Y**：`createTexture2D(..., flipY)` 的 JSDoc 写 `@param {boolean} [flipY=false] - Sets the UNPACK_FLIP_Y_WEBGL flag`，且 `canvasToTexture` 里 `if (flipY === undefined) { flipY = false; }` — [WebGLRenderer.js](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/WebGLRenderer.js)

**Phaser 的 UV 原样透传**：`outTexCoord = inTexCoord;` — [Multi.vert](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/Multi.vert)

### Inferences

- **UV：不用翻。** LÖVE 和 Phaser 都是"左上 (0,0)、右下 (1,1)"，且都不对纹理做 `UNPACK_FLIP_Y`。`Texel(tex, texture_coords)` → `texture2D(uMainSampler, outTexCoord)` 直接可换。
- **screen_coords：要翻。** WebGL 的 `gl_FragCoord.y` 永远是从**左下**算起（渲染到默认帧缓冲时与屏幕 Y 向下相反）。Phaser 渲染到默认 framebuffer 的情形对应 LÖVE 的 "no Canvas active" 分支，所以移植公式是：
  ```glsl
  vec2 screen_coords = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  ```
  渲染到 Phaser 的 RenderTexture / PostFX framebuffer 时对应 LÖVE 的 "canvasActive" 分支，此时 **不翻**（`gl_FragCoord.y` 直接用）。这两种情形在 Phaser 里都会遇到（背景 shader 走全屏，卡牌 shader 走 Sprite pipeline），必须按渲染目标分别决定。
- **`love_ScreenSize.zw` 在 Phaser 侧建议直接做成 uniform**：传 `(w, h, flipZ, flipW)` 四分量，这样 `.fs` 里所有 `love_ScreenSize.xy` 的用法一行不改就能工作，`love_PixelCoord` 宏也能原样保留。这是把"要翻 Y"这件事从 19 个文件收敛到 1 个 define 的做法，强烈推荐。
- **`position()` 里的 `vertex_position` 是个语义陷阱。** LÖVE 传给 `position()` 的是 `VertexPosition`，即**变换前的局部坐标**（Balatro 通过 `prep_draw` 用 `love.graphics.translate/rotate/scale` 推栈，所以顶点本身是 quad 的 0..w 像素范围）。而 Balatro 的 `foil.fs` / `polychrome.fs` 等写：
  ```glsl
  float mid_dist = length(vertex_position.xy - 0.5*love_ScreenSize.xy)/length(love_ScreenSize.xy);
  vec2 mouse_offset = (vertex_position.xy - mouse_screen_pos.xy)/screen_scale;
  ```
  把**局部坐标**和**屏幕坐标**（`mouse_screen_pos` 是 `G.CONTROLLER.cursor_position * G.CANV_SCALE`，见 [sprite.lua:93-97](file:///E:/block-rougelike/参考/产物/Balatro_1.0.1o/源码/engine/sprite.lua)）混在一起相减。也就是说**原作这段数学本身就是"坐标空间不严谨"的经验式效果**。Phaser 的顶点属性 `inPosition` 是**世界坐标**（transform 已在 CPU 端烘进去），语义与 LÖVE 的 `VertexPosition` 不同。要复现原作手感，不能照搬公式，必须**在 Phaser 端人为构造出同样的"局部 quad 像素坐标"**喂给这段数学，否则倾斜效果的幅度和方向都会不对。这是 19 个 shader 里**唯一需要"重新推导"的部分**。

### Gaps

- 未逐个验证 Balatro 的每个 `position()` 里 `vertex_position` 的实际数值范围（需要运行期抓取或更细读 `prep_draw`）。上面的判断基于 `sprite.lua` 的 `draw_self` 调用链（`prep_draw` 推 transform → `love.graphics.scale` → `love.graphics.draw(atlas, quad, ...)`），属于强推断而非实测。

---

## Q4. 颜色空间 / gamma

### Takeaway

**LÖVE 默认不做 gamma correction**，`t.gammacorrect = false` 时 LÖVE 注入的全部 gamma 宏都展开成**空**（真正的 no-op）。`Texel` 任何时候都不做 sRGB→linear。Balatro 若未开 `gammacorrect`（需核实其 `conf.lua`），则移植到 WebGL 时**颜色管线完全 1:1，无需任何 gamma 处理** —— 但要小心不要在 Phaser 里误开 sRGB framebuffer 或用会做 PMA 的纹理上传路径。

### Cited Findings

gamma 宏的定义（逐字）：

```glsl
#ifdef LOVE_GAMMA_CORRECT
	#define gammaCorrectColor gammaToLinear
	#define unGammaCorrectColor linearToGamma
	#define gammaCorrectColorPrecise gammaToLinearPrecise
	#define unGammaCorrectColorPrecise linearToGammaPrecise
	#define gammaCorrectColorFast gammaToLinearFast
	#define unGammaCorrectColorFast linearToGammaFast
#else
	#define gammaCorrectColor
	#define unGammaCorrectColor
	#define gammaCorrectColorPrecise
	#define unGammaCorrectColorPrecise
	#define gammaCorrectColorFast
	#define unGammaCorrectColorFast
#endif
```
— [wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

`LOVE_GAMMA_CORRECT` 只在 `love.graphics.isGammaCorrect()` 为真时注入：`gammacorrect and "#define LOVE_GAMMA_CORRECT 1" or ""`，其中 `local gammacorrect = love.graphics.isGammaCorrect()` — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

gamma 函数的具体实现（默认用的是 fast 近似，非精确 sRGB 曲线）：
```glsl
#define gammaToLinear gammaToLinearFast
#define linearToGamma linearToGammaFast
// gammaToLinearFast(c) = c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878)
// 出处注释：http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html
```
— [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

唯一自动应用 gamma 的地方是 vertex main 里的 `VaryingColor = gammaCorrectColor(VertexColor) * ConstantColor;` 以及 `VideoTexel()` 的 `return gammaCorrectColor(color);` — [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**`Texel` 不含任何 gamma 代码**（见 Q1 引用的 `GLSL.FUNCTIONS` 全文）。开启 gammacorrect 时的 sRGB→linear 是靠**纹理格式**（sRGB internal format，由 GPU 采样器硬件转换）完成的，不是 shader 代码。

Balatro 的 19 个 `.fs` 中 `gammaCorrectColor` / `unGammaCorrectColor` 出现 0 次（本地 grep）。

### Inferences

- 因为 `#define gammaCorrectColor`（空替换）在不开 gammacorrect 时使 `gammaCorrectColor(x)` 直接变成 `(x)`，**LÖVE 的默认管线是纯 "everything in sRGB space, no conversion"**，与 WebGL 默认（`gl.RGBA` 非 sRGB 纹理 + 非 sRGB framebuffer）**完全一致**。
- 移植注意事项（假设 Balatro 未开 gammacorrect）：
  1. Phaser 端**不要**给纹理用 `SRGB8_ALPHA8`（WebGL2 才有），保持 `gl.RGBA`。
  2. Phaser 端**不要**在 canvas context 属性里设置任何 color space（WebGL 默认 `drawingBufferColorSpace = 'srgb'`，即不转换，正确）。
  3. 所有颜色常量（`burn_colour_1/2`、`G.C.*`）按原样以 0..1 sRGB 值传，不做转换。
- **真正要小心的不是 gamma 而是 premultiplied alpha**（见 Q6）—— 那才是两边默认值不同的地方。

### Gaps

- **未核实 Balatro 的 `conf.lua` 是否设置了 `t.gammacorrect`**。这是一个 5 秒就能查的本地事实（`E:\block-rougelike\参考\产物\Balatro_1.0.1o\源码\conf.lua`），但本次调研聚焦在 LÖVE 语义上，未展开。若 Balatro **开了** gammacorrect，则移植时所有 `effect()` 的返回值需要额外套 `linearToGamma`，且纹理需按 sRGB 采样 —— 结论会从"1:1"变成"需要补两处转换"。**建议作为必做核实项。**

---

## Q5. GLSL 版本与 WebGL 1 兼容性

### Takeaway

LÖVE 的默认方言是 **GLSL 1.20 / GLSL ES 1.00 级别语法**（`glsl1`），这**正好就是 WebGL 1 的语法级别**。Balatro 的 19 个 shader 无一使用 `#pragma language glsl3`，因此**语法层面天然 WebGL 1 兼容**。实测只找到**一处**真实的 ES 1.00 违规（`hologram.fs` 的非常量循环边界），且是一行 `const` 就能修的。

### Cited Findings

版本映射表（逐字）：
```lua
GLSL.VERSION = { -- index using [target][gles]
	glsl1 = {[false]="#version 120",      [true]="#version 100"},
	glsl3 = {[false]="#version 330 core", [true]="#version 300 es"},
}
```
— [wrap_GraphicsShader.lua](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

方言选择逻辑（逐字）：
```lua
local targetlang = getLanguageTarget(pixelcode or vertexcode)   -- 匹配 "^%s*#pragma language (%w+)"，无则 "glsl1"
local lang = targetlang or "glsl1"
local glsl1on3 = false
if lang == "glsl1" and supportsGLSL3 then
	lang = "glsl3"
	glsl1on3 = true
end
```
— [同上](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua)

**关键含义**：桌面端只要驱动支持 GLSL 3，LÖVE 实际会把 `glsl1` 源码用 `#version 330 core` **编译**，同时定义 `LOVE_GLSL1_ON_GLSL3`，靠 `#define attribute in` / `#define varying out|in` / `#define texture2D Texel` 等把 1.20 语法垫到 330 上。**但用户写的仍然必须是 1.20 语法** —— 因为 `LOVE_GLSL1_ON_GLSL3` 分支刻意不开放 `texture()`、`gl_VertexID`、`DepthImage` 等 330 特性。

可用语言常量：`{ "glsl1", LANGUAGE_GLSL1 }, { "essl1", LANGUAGE_ESSL1 }, { "glsl3", LANGUAGE_GLSL3 }, { "essl3", LANGUAGE_ESSL3 }` — [Shader.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/Shader.cpp)

**Balatro 19 个 `.fs` 的实测扫描**（本地 grep，目录 `E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\shaders\`，共 1782 行）：

| 检查项 | 出现次数 | 判定 |
|---|---|---|
| `#pragma` | **0** | 全部走默认 `glsl1` = GLSL 1.20 / ESSL 1.00 语法 |
| `#version` / `precision` | 0 / 0 | 无手写版本或精度限定，交给 LÖVE 注入 |
| `texture2D` | 0 | 全部用 `Texel` |
| `dFdx` / `dFdy` / `fwidth` | **0** | 无导数函数，不需要 `OES_standard_derivatives` |
| `%`（整数取模） | **0** | 无 ES 1.00 不支持的整数取模 |
| `in` / `out` 限定符 | 0 | 无 GLSL 3 语法 |
| `textureLod` / 数组构造器 | 0 | 无 |
| `for (` | 7 处 | 见下 |

7 个循环的边界（本地 grep）：
- `background.fs:36` `for(int i=0; i < 5; i++)` — 常量，OK
- `flame.fs:39` `for(int i=0; i < 5; i++)` — 常量，OK
- `splash.fs:36` `for(int i=0; i < 5; i++)` — 常量，OK
- `CRT.fs:119-120` `for (int i = -BLOOM_AMT; i <= BLOOM_AMT; ++i)`，其中 `CRT.fs:18` `#define BLOOM_AMT 3` — **预处理器常量，展开后是字面量，OK**
- `hologram.fs:63-64` `for (int i = -glow_samples; i <= glow_samples; ++i)`，其中 `hologram.fs:58` `MY_HIGHP_OR_MEDIUMP int glow_samples = 4;` — **非 const 局部变量做循环边界 → 违反 GLSL ES 1.00 Appendix A 的 loop 限制**

另注：`effect()` 的形参名在多数文件里是 `texture`（`vec4 effect( vec4 color, Image texture, vec2 texture_coords, vec2 screen_coords )`）。

### Inferences

- **`hologram.fs` 是唯一的硬语法阻塞点**，修法：`const int glow_samples = 4;`（`actual_glow_samples` 是累加器，不做边界，无需改）。WebGL 1 的 GLSL ES 1.00 要求 for 循环的索引初值与比较值都是常量表达式；WebGL 2（ESSL 3.00）则无此限制，所以**如果目标是 WebGL2 这个问题自动消失**。
- **`Image texture` 形参名**：在 ESSL 1.00 里 `texture` 不是保留字也不是内建函数，合法；在 ESSL 3.00（WebGL2）里 `texture()` 是内建函数，但 GLSL 允许局部变量遮蔽内建函数，仍然合法。不过 LÖVE 自己为此加了 `#define texture love_texture` 的规避。**建议移植时统一重命名为 `tex`**，零风险且避免 WebGL2 下的实现差异。
- **WebGL 1 vs WebGL 2 的取舍**：这批 shader 没有任何需要 WebGL2 的特性。Phaser 3 默认走 WebGL1（`Phaser.WEBGL` 在 3.80 仍请求 `webgl` context），所以**留在 WebGL1 即可**，只需修 `hologram.fs` 一行。若将来切 WebGL2，需要把 `varying`→`in/out`、`texture2D`→`texture`、加 `out vec4 fragColor` —— 这正是 LÖVE 的 `LOVE_GLSL1_ON_GLSL3` 垫片干的事，可以直接抄它的 define 块。
- `MY_HIGHP_OR_MEDIUMP` 是 Balatro **自己**在每个 `.fs` 开头复制的宏（`foil.fs:1-5` 与 LÖVE 的 `LOVE_HIGHP_OR_MEDIUMP` 定义逐字相同），说明作者刻意保证移动端 ESSL 1.00 兼容。**这对我们是好消息：这批 shader 早就被作者按 ESSL 1.00 约束写过一遍了。**

### Gaps

- 未在真实 WebGL1 上下文里编译验证这 19 个文件。上面是静态扫描结论；建议实现期用 `glslangValidator`（或浏览器直接编译）跑一遍作为 gate。

---

## Q6. 预乘 alpha / blend mode

### Takeaway

**这是两边默认值真正不同的地方，也是最容易出"边缘发黑/发亮"bug 的地方。** LÖVE 默认 `alpha` + `alphamultiply`（shader 输出**非**预乘 alpha，由 blend func 的 `SRC_ALPHA` 代劳）；Phaser 3 默认 `premultipliedAlpha: true` + `NORMAL` blend = `(ONE, ONE_MINUS_SRC_ALPHA)`（shader 输出**必须是**预乘 alpha）。移植时每个 shader 的 `return` 语句都要补一次预乘，或者改 Phaser 的 blend func。

### Cited Findings

**LÖVE 侧**，`Graphics::setBlendMode` 逐字：
```cpp
case BLEND_ALPHA:
    srcRGB = srcA = GL_ONE;
    dstRGB = dstA = GL_ONE_MINUS_SRC_ALPHA;
    break;
...
// We can only do alpha-multiplication when srcRGB would have been unmodified.
if (srcRGB == GL_ONE && alphamode == BLENDALPHA_MULTIPLY && mode != BLEND_NONE)
    srcRGB = GL_SRC_ALPHA;

glBlendEquation(func);
glBlendFuncSeparate(srcRGB, dstRGB, srcA, dstA);
```
— [opengl/Graphics.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Graphics.cpp)

blend alpha 模式常量：`{ "alphamultiply", BLENDALPHA_MULTIPLY }, { "premultiplied", BLENDALPHA_PREMULTIPLIED }` — [Graphics.cpp](https://github.com/love2d/love/blob/11.5/src/modules/graphics/Graphics.cpp)

→ LÖVE 默认（`alpha` + `alphamultiply`）的实际 GL 状态是：
**`glBlendFuncSeparate(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA)`**（注意 RGB 用 `SRC_ALPHA` 而 A 用 `ONE`，是 separate 的）。

**Phaser 侧**，`premultipliedAlpha` 默认值：
```js
this.premultipliedAlpha = GetValue(renderConfig, 'premultipliedAlpha', true, config);
```
— [Config.js](https://github.com/phaserjs/phaser/blob/v3.80.1/src/core/Config.js)

blend modes 初始化（逐字）：
```js
for (var i = 0; i <= 27; i++)
{
    this.blendModes.push({ func: [ gl.ONE, gl.ONE_MINUS_SRC_ALPHA ], equation: gl.FUNC_ADD });
}
//  ADD
this.blendModes[1].func = [ gl.ONE, gl.DST_ALPHA ];
//  MULTIPLY
this.blendModes[2].func = [ gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA ];
//  SCREEN
this.blendModes[3].func = [ gl.ONE, gl.ONE_MINUS_SRC_COLOR ];
```
— [WebGLRenderer.js](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/WebGLRenderer.js)

→ Phaser `BlendModes.NORMAL`（index 0）= `glBlendFunc(ONE, ONE_MINUS_SRC_ALPHA)` = **标准预乘 alpha 混合**。且 Phaser 用的是 `blendFunc` 不是 `blendFuncSeparate`。

**Phaser 的默认 fragment shader 自己就在做预乘**（逐字）：
```glsl
vec4 texel = vec4(outTint.bgr * outTint.a, outTint.a);
vec4 color = texture * texel;
...
gl_FragColor = color;
```
— [Multi.frag](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/Multi.frag)

注意两点：(1) `outTint.bgr` —— Phaser 的 tint 是 **BGR 序**（因为 tint 从 `0xRRGGBB` 整数打包而来）；(2) `outTint.bgr * outTint.a` 即在 shader 里做预乘。

Phaser 的 PostFX 默认 shader 则是裸的：`gl_FragColor = texture2D(uMainSampler, outTexCoord);` — [PostFX.frag](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/PostFX.frag)

### Inferences

移植时有两条路，**必须二选一并全局一致**：

**方案 A（推荐）：在 shader 末尾补预乘。** 把每个 `.fs` 的 `effect()` 返回值 `c` 改成 `gl_FragColor = vec4(c.rgb * c.a, c.a);`。好处是可以完全沿用 Phaser 的默认 blend、默认 pipeline、默认 RenderTexture 行为，不打破 Phaser 生态（Container、Camera fade、Mask 都依赖 PMA）。代价是 19 个文件各改一行。

**方案 B：把 Phaser 切成非预乘。** 游戏配置 `render: { premultipliedAlpha: false }` + 每个用到 shader 的对象 `setBlendMode` 到自定义 mode（`renderer.addBlendMode([SRC_ALPHA, ONE_MINUS_SRC_ALPHA], FUNC_ADD)`）。代价是 Phaser 内建的 tint/fade/mask 路径会与之冲突，且 Phaser 只有 `blendFunc` 没有 separate，无法 100% 复刻 LÖVE 的 `(SRC_ALPHA, OMSA, ONE, OMSA)`。**不推荐。**

- **LÖVE 的 alpha 通道用 `srcA = GL_ONE` 而 Phaser 用 `ONE`** —— 这一项其实两边一致（都是 `ONE`）。真正差的只有 RGB 项（LÖVE `SRC_ALPHA` vs Phaser `ONE`），所以方案 A 的"shader 里乘一次 alpha"在数学上与 LÖVE 完全等价。这是一个**可证明等价**的改写，不是近似。
- **`Texel()` 采样到的是不是预乘值？** LÖVE 不对纹理做 `UNPACK_PREMULTIPLY_ALPHA`；Phaser 的 `createTexture2D` 有 `pma` 参数，`canvasToTexture` 里传的是 `true`（`createTexture2D(0, ..., gl.RGBA, srcCanvas, width, height, true, false, flipY)`）。**这意味着 Phaser 从 Canvas 创建的纹理是预乘的，而从 `<img>` 加载的纹理取决于 TextureManager 传的 pma 值** —— 若源纹理已预乘，则 `Texel(tex, uv).rgb` 的含义与 LÖVE 不同，所有在 shader 里对 `.rgb` 做的 HSL 旋转、对比度调整都会在半透明边缘出偏差。**必须核实 Balatro atlas 在 Phaser 里的上传路径并强制 `pma = false`**（或在采样后除以 alpha 还原）。这是 Q6 里最容易被忽略却最坑的一条。

### Gaps

- 未确认 Phaser 3.80 的 `TextureManager` / `Texture.add` 默认给 `createTexture2D` 传的 `pma` 值（`canvasToTexture` 明确是 `true`，但 `<img>` 路径未追到）。建议实现期用 `gl.getTexParameter` 或直接做一张半透明测试图验证。
- Balatro 的 `conf.lua` 是否改过默认 blend mode 未核实（LÖVE 默认就是 `alpha`/`alphamultiply`，且 `sprite.lua` 里没看到 `setBlendMode` 调用，推断为默认）。

---

## Q7. 现成的 LÖVE→WebGL / Balatro shader 移植先例

### Takeaway

**有大量"Balatro 背景 shader"的 web/其它引擎复刻，但几乎全是 `background.fs` 这一个文件**；**没有找到公开的、完整的 19 个 shader 的 WebGL/JS 移植**。卡牌特效（foil / holo / polychrome）有 Shadertoy 与 Godot 的单点复刻，完成度与还原度不一。这意味着我们的移植**没有现成代码可抄，但有可参考的单点样本**。

### Cited Findings

**背景 shader（`background.fs`）—— 复刻最多**：
- `balatroShader.js`：纯 WebGL、零依赖、约 6KB minified，自带 vertex + fragment shader，可配置颜色/旋转/像素块大小/缩放/偏移 — [CSS Script: Recreate Balatro's Animated Shader Effect with WebGL](https://www.cssscript.com/balatro-shader-webgl/)
- Shadertoy「Balatro website effect」 — [shadertoy.com/view/XXjGDt](https://www.shadertoy.com/view/XXjGDt)
- Shadertoy「Balatro Background Shaders」 — [shadertoy.com/view/XXtBRr](https://www.shadertoy.com/view/XXtBRr)
- Shadertoy「blue balatro bg for wallpaper」 — [shadertoy.com/view/wfVcDm](https://www.shadertoy.com/view/wfVcDm)
- Godot 版 — [godotshaders.com/shader/balatro-background-shader/](https://godotshaders.com/shader/balatro-background-shader/)
- HLSL 版（Windows Terminal） — [Hammster/windows-terminal-shaders/balatro.hlsl](https://github.com/Hammster/windows-terminal-shaders/blob/main/balatro.hlsl)

**卡牌特效**：
- Godot 4.4 的 Balatro Foil card effect（用法：给卡牌加一个 Sprite2D/ColorRect 子节点挂 shader） — [godotshaders.com/shader/balatro-foil-card-effect/](https://godotshaders.com/shader/balatro-foil-card-effect/)
- Shadertoy「Foil Balatro」（2024-12） — [shadertoy.com/view/XcVfDc](https://www.shadertoy.com/view/XcVfDc)
- Shadertoy「balatro foil effect」 — [shadertoy.com/view/w3VGzm](https://www.shadertoy.com/view/w3VGzm)
- Shadertoy「Holographic Balatro」 — [shadertoy.com/view/XfKfDc](https://www.shadertoy.com/view/XfKfDc)
- Godot 的 balatro tag 聚合页 — [godotshaders.com/shader-tag/balatro/](https://godotshaders.com/shader-tag/balatro/)

**整游戏级复刻**：
- Unity 版：开发者 André 复刻了 Balatro 的卡牌运动与 shader，并写了 working-process breakdown — [80.lv: Balatro's Card Movements & Shaders Recreated in Unity](https://80.lv/articles/balatro-s-card-movements-shaders-recreated-in-unity)
- Weblatro：JS 的离线 HTML 版 Balatro 复刻 — [github.com/TyconXon/Weblatro](https://github.com/TyconXon/Weblatro)。**GitHub tree API 查询该仓库，没有任何路径包含 `shader` / `glsl` / `frag` / `.fs`** —— 即 Weblatro 没有移植 shader。
- Rust 版 LÖVE2D 重实现（在终端里跑 Balatro）：作者称 shader 是"逐像素模拟"的，共 **11 个 shader 全部从原始 GLSL 移植**，其中 holographic 结合 HSL 彩虹位移 + 六边形网格 + 噪声场，polychrome 用动画噪声在 HSL 空间旋转色相并提升饱和度 — [DEV: How I Reimplemented LÖVE2D in Rust to Play Balatro in a Terminal](https://dev.to/4rh1t3ct0r/how-i-reimplemented-love2d-in-rust-to-play-balatro-in-a-terminal-2ag2)

### Inferences

- 大量独立复刻的存在本身就是**强可行性证据**：这些 shader 的数学在其它 GLSL 方言（Godot 的 `canvas_item`、Shadertoy 的 `mainImage`、HLSL）里都能一比一跑通，说明**瓶颈从来不在算法，只在宿主接口**。
- 但**没有一个先例覆盖我们的需求**（19 个 shader + Phaser pipeline 集成 + 与 Balatro 的 uniform 送值时序对齐），所以**不能指望"找个库装上"**。可参考价值最高的是 Rust 终端版（它列出了 11 个 shader 的移植思路）和 Godot 的 foil 版（它展示了"用一个覆盖层 quad 而非改 Sprite 材质"的集成模式，这个模式在 Phaser 里同样适用且比自定义 Pipeline 简单）。
- Shadertoy 版本要特别小心：Shadertoy 的 `mainImage(out vec4 fragColor, in vec2 fragCoord)` 里 `fragCoord` 是 **Y 向上**的，与 LÖVE 的 `screen_coords` 相反。从 Shadertoy 抄回来会引入一次 Y 翻转错误。直接从原始 `.fs` 改写比从 Shadertoy 抄更安全。

### Gaps

- 没有找到任何公开的、通用的 **"LÖVE shader → WebGL 自动转换工具"**。搜索只命中单点手工移植。（这本身是有价值的信号：说明没人认为需要工具化，因为转换足够简单。）
- 未核实 `balatroShader.js` 的还原度（是否像素级对齐原作 `background.fs`）—— 仅有其自述的功能列表。

---

## 对照表：LÖVE 写法 → WebGL 1 (GLSL ES 1.00) 写法

| # | LÖVE 11.x 写法 | WebGL 1 等价写法 | 机械度 |
|---|---|---|---|
| 1 | `vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) { ... return c; }` | `void main() { vec4 color = outTint; vec2 texture_coords = outTexCoord; vec2 screen_coords = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y); ... gl_FragColor = vec4(c.rgb*c.a, c.a); }` | 机械（模板） |
| 2 | `vec4 position(mat4 transform_projection, vec4 vertex_position) { ... }` | `void main() { ... gl_Position = uProjectionMatrix * vec4(inPosition, 0.0, 1.0); }`，且需拆到独立 `.vert` 文件 | **半机械**：`vertex_position` 语义不同，见 Q3 |
| 3 | `Texel(tex, uv)` | `texture2D(tex, uv)` | 纯替换 |
| 4 | `Texel(tex, uv, bias)` | `texture2D(tex, uv, bias)`（仅 fragment stage 合法） | 纯替换 |
| 5 | `extern` | `uniform` | 纯替换 |
| 6 | `number` | `float` | 纯替换 |
| 7 | `Image` | `sampler2D` | 纯替换 |
| 8 | `ArrayImage` / `CubeImage` / `VolumeImage` | `sampler2DArray` / `samplerCube` / `sampler3D`（WebGL1 无 array/3D，需 WebGL2） | Balatro 未用 |
| 9 | `MainTex` | `uMainSampler`（Phaser PostFX）/ `uMainSampler[0]`（MultiPipeline） | 纯替换（名字） |
| 10 | `love_PixelColor = c;` | `gl_FragColor = c;` | 纯替换 |
| 11 | `love_Canvases[i] = c;` | `gl_FragData[i] = c;` + `WEBGL_draw_buffers` 扩展 | Balatro 未用 |
| 12 | `love_ScreenSize` | 自建 `uniform vec4 love_ScreenSize;`，传 `(w, h, ±1, 0 或 h)` | 机械（但要自己送值） |
| 13 | `love_PixelCoord` | 保留原宏 `#define love_PixelCoord (vec2(gl_FragCoord.x, gl_FragCoord.y*love_ScreenSize.z + love_ScreenSize.w))` | 直接抄，零改动 |
| 14 | `love_PointSize` | 自建 `uniform float`；`gl_PointSize` | Balatro 未用 |
| 15 | `VaryingTexCoord` | `varying vec2 outTexCoord`（注意 LÖVE 是 vec4，取 `.st`） | 机械 |
| 16 | `VaryingColor` | `varying vec4 outTint`（**BGR 序 + 已预乘**，需 `.bgr` 并按需除 alpha） | **需注意** |
| 17 | `VertexPosition` | `attribute vec2 inPosition`（**世界坐标 vs LÖVE 的局部坐标**） | **语义不同** |
| 18 | `VertexTexCoord` | `attribute vec2 inTexCoord` | 机械 |
| 19 | `VertexColor` | `attribute vec4 inTint` | 机械 |
| 20 | `ConstantColor` | 无；并入 `inTint` | 机械 |
| 21 | `TransformProjectionMatrix` / `ClipSpaceFromLocal` | `uProjectionMatrix`（Phaser 已烘 transform） | 机械 |
| 22 | `TransformMatrix` / `ViewSpaceFromLocal` | 无对应（Phaser 侧≈单位阵） | Balatro 未用 |
| 23 | `ProjectionMatrix` / `ClipSpaceFromView` | `uProjectionMatrix` | Balatro 未用 |
| 24 | `NormalMatrix` / `ViewNormalFromLocal` | 需自算 `mat3` | Balatro 未用 |
| 25 | `ModelViewMatrix` | **LÖVE 11.x 已无此名**，用 `TransformMatrix` | — |
| 26 | `#ifdef PIXEL` / `#ifdef VERTEX` | 拆文件后直接删/展开，或在两个文件顶部各补 `#define PIXEL` / `#define VERTEX` | 机械 |
| 27 | `__VERSION__` | GLSL 标准宏，WebGL1 下值为 `100`，可直接保留 | 零改动 |
| 28 | `GL_FRAGMENT_PRECISION_HIGH` | WebGL1 标准宏，可直接保留 | 零改动 |
| 29 | `LOVE_HIGHP_OR_MEDIUMP` / Balatro 的 `MY_HIGHP_OR_MEDIUMP` | 原样保留（Balatro 自己定义了，不依赖 LÖVE） | 零改动 |
| 30 | gamma：`gammaCorrectColor(x)` | 未开 gammacorrect 时 = `(x)`，直接删 | Balatro 未用 |
| 31 | blend：`alpha`+`alphamultiply` | 输出改预乘 `vec4(c.rgb*c.a, c.a)`，Phaser 用默认 NORMAL | **可证等价的改写** |
| 32 | `int n = 4; for(i=-n; i<=n; ++i)` | `const int n = 4;`（仅 `hologram.fs`） | 一行修 |

---

## 总判断：「逐行改写」还是「重新推导」？

**结论：约 90% 是逐行改写（可脚本化），10% 需要重新推导，且这 10% 全部集中在 `position()` 顶点着色器。**

分层给判断：

### 可以逐行（甚至 sed 脚本）改写的部分 —— 19 个文件的全部 `effect()` 主体

依据：
- 无 `#pragma language glsl3` → 源码本身就是 GLSL ES 1.00 级别（Q5）
- 无 `texture2D` / 导数 / 整数取模 / 数组构造器 / `in`/`out`（Q5 实测）
- 无 `extern Image` → 不需要额外纹理槽，接口面只有标量/向量/布尔 uniform（Q2 实测）
- 无 `gammaCorrectColor` 调用，且 LÖVE 默认 gamma 宏是空替换（Q4）
- UV 语义两边完全一致，不需翻 Y（Q3）
- 语法糖全是 `#define`，可逐字展开（Q1）

真正的改动只有：`extern`→`uniform`、`number`→`float`、`Image`→`sampler2D`、`Texel`→`texture2D`、`effect()`→`main()` 模板、末尾补一次预乘 alpha、加一个 `love_ScreenSize` uniform。**这七条可以写成一个 200 行的转换脚本一次处理完 19 个文件。**

### 需要重新推导的部分 —— `position()`（14 个文件里有）

依据（Q3 Inferences）：Balatro 的顶点倾斜数学把 `vertex_position`（LÖVE 的**局部** quad 像素坐标）与 `mouse_screen_pos`（**屏幕**像素坐标）直接相减，这在 LÖVE 下是一个坐标空间不严谨但视觉上被调好的经验公式。Phaser 的 `inPosition` 是**世界坐标**，语义不同，照抄公式会得到错误的倾斜幅度与方向。必须：
1. 在 Phaser 端构造出与 LÖVE 相同的"局部 quad 像素空间"喂给这段数学（推荐：自定义 pipeline 额外传一个 `inLocalPosition` 属性），或
2. 放弃 shader 顶点倾斜，改用 Phaser 的 2D 变换（`setScale`/`skew` via Mesh）近似 —— 但这会丢失原作卡牌的"透视感"。

### 需要核实而非推导的两个风险点（不影响可行性，但必须在动手前查清）

1. **Balatro 的 `conf.lua` 是否开了 `t.gammacorrect`**（Q4 Gap）。若开了，所有 `effect()` 返回值要补 `linearToGamma`，纹理要按 sRGB 采样。
2. **Phaser 加载 atlas 时是否做了 premultiply alpha**（Q6 Gap）。若做了，`texture2D(uMainSampler, uv).rgb` 是预乘值，所有 HSL/对比度运算会在半透明边缘偏色，必须强制 `pma = false` 或在采样后还原。

### 工作量估计（推论，非引用）

- 19 个 `effect()`：脚本转换 + 人工校对，**约 1 人日**
- 14 个 `position()`：需要设计 Phaser pipeline 的局部坐标传递 + 逐个调参对齐手感，**约 3-5 人日**
- Phaser pipeline 脚手架（uniform 送值时序、按 `sprite.lua:73-110` 的 `draw_shader` 逐帧 send 对齐）：**约 2 人日**
- `hologram.fs` 的 `const` 修复：**1 分钟**

---

## 关键源码文件索引（供后续实现查阅）

| 内容 | 路径 |
|---|---|
| LÖVE GLSL 包装层全文 | [love/11.5 `src/modules/graphics/wrap_GraphicsShader.lua`](https://github.com/love2d/love/blob/11.5/src/modules/graphics/wrap_GraphicsShader.lua) |
| `love_ScreenSize` 的 zw 翻转值 | [love/11.5 `src/modules/graphics/opengl/Shader.cpp` → `Shader::updateScreenParams()`](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Shader.cpp) |
| builtin uniform 名字表 | [love/11.5 `src/modules/graphics/Shader.cpp` → `builtinNameEntries`](https://github.com/love2d/love/blob/11.5/src/modules/graphics/Shader.cpp) |
| LÖVE blend func | [love/11.5 `src/modules/graphics/opengl/Graphics.cpp` → `Graphics::setBlendMode()`](https://github.com/love2d/love/blob/11.5/src/modules/graphics/opengl/Graphics.cpp) |
| Phaser 投影矩阵 / blendModes / 纹理上传 | [phaser v3.80.1 `src/renderer/webgl/WebGLRenderer.js`](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/WebGLRenderer.js) |
| Phaser `premultipliedAlpha` 默认值 | [phaser v3.80.1 `src/core/Config.js`](https://github.com/phaserjs/phaser/blob/v3.80.1/src/core/Config.js) |
| Phaser 默认 sprite shader | [Multi.frag](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/Multi.frag) / [Multi.vert](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/Multi.vert) / [PostFX.frag](https://github.com/phaserjs/phaser/blob/v3.80.1/src/renderer/webgl/shaders/src/PostFX.frag) |
| Balatro 的 shader 送值时序 | 本地 `E:\block-rougelike\参考\产物\Balatro_1.0.1o\源码\engine\sprite.lua` 第 73-110 行 `Sprite:draw_shader` |
| Balatro 的 CRT shader 送值 | 本地 `E:\block-rougelike\参考\产物\Balatro_1.0.1o\源码\game.lua` 第 3302-3303 行 |
| 19 个 `.fs` 源文件 | 本地 `E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\shaders\` |

---

## 全局 Gaps（需要后续补齐的事实）

- **love2d.org/wiki 全站在本次调研中不可访问（Cloudflare HTTP 403）**，包括 `Shader`、`love.graphics.newShader`、`Shader_Variables` 三个页面，以及 `r.jina.ai` 代理。所有 wiki 级别的"官方措辞"缺失，本笔记全部以 LÖVE 11.5 源码替代。若报告需要引用 wiki 原文，需换一个能过 Cloudflare 的通道重取。
- Balatro `conf.lua` 的 `t.gammacorrect` 与 `t.window` 设置未核实（本地可查）。
- Phaser `TextureManager` 从 `<img>` 创建纹理时 `pma` 的实际取值未追到源码行。
- 19 个 `.fs` 中 `effect()` 第一个参数 `color/colour` 的实际使用情况未逐个核对。
- 未在真实 WebGL1 上下文编译验证这 19 个文件（静态扫描结论）。
