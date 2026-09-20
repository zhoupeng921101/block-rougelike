# Balatro 1.0.1o GLSL Shader 源码清单

> 证据目录：`E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\shaders\`（只读，未修改）
> 交叉验证源：`E:\block-rougelike\参考\产物\Balatro_1.0.1o\源码\engine\sprite.lua`、`源码\card.lua`、`源码\game.lua`
> 全部 19 个 .fs 文件已逐行通读（合计 1782 行）。

---

## 问题 8：是否有遗漏的 shader 文件

### Takeaway
没有遗漏。整个 `资源/` 目录下只有 `shaders/` 一个目录含 shader，且只有 19 个 `.fs`，不存在 `.vs` / `.glsl` / `.vert` / `.frag` / `.shader`。

### Cited Findings
- `find` 扫描 `资源/`（含 fonts / sounds / textures / gamecontrollerdb.txt）结果只返回 `./shaders/*.fs` 共 19 条 — [本地文件](E:\block-rougelike\参考\产物\Balatro_1.0.1o\资源\)
- 顶层目录清单：`fonts`、`gamecontrollerdb.txt`、`shaders`、`sounds`、`textures` — 无独立 shader 目录。

### Inferences
- LÖVE 的 `love.graphics.newShader` 允许把 vertex 与 fragment 写在**同一个文件**里，用 `#ifdef VERTEX` / `#ifdef PIXEL` 分段。Balatro 全部采用这一形式，所以没有独立 `.vs` 文件是符合预期的，不是资源提取丢失。

---

## 问题 1 / 2 / 3 / 4 / 5：19 个 shader 总表

### Takeaway
19 个里**只有 2 个是纯 vertex shader**（skew.fs、vortex.fs，没有 `effect()`），**1 个是全屏后处理**（CRT.fs），**12 个是卡牌特效**（共享同一份 `dissolve_mask()` 模板 + 可选的 HSL/RGB 模板 + 同一份 hover 倾斜 vertex 段），**4 个是全屏/背景类**（background、splash、flash、flame）。真正的"独特代码"极少，复制粘贴率极高。

### 总表

| Shader | 效果 | 行数 | uniform（`extern`）原样列表 | per-card? | LÖVE 特有语法 | WebGL 兼容风险 |
|---|---|---|---|---|---|---|
| **CRT.fs** | 全屏后处理 CRT：桶形畸变、边缘羽化遮罩、水平 glitch 抖动、横向色差、扫描线网格、对比度校正、可选 7×7 bloom | 153 | `number time`; `vec2 distortion_fac`; `vec2 scale_fac`; `number feather_fac`; `number bloom_fac`; `number crt_intensity`; `number glitch_intensity`; `number scanlines`; （VERTEX 段内另有）`vec2 mouse_screen_pos`; `float hovering`; `float screen_scale` | 否，全局 | `number`、`Image`、`Texel()`、`love_ScreenSize`、`extern`、`#ifdef VERTEX`、`position()` | **49 次纹理采样的双层循环**（常量边界，可展开，但开销大）；第 1 行 `__VERSION__ > 1` 疑似笔误（其余文件都是 `> 100`） |
| **background.fs** | 主菜单/牌桌动态背景：像素化 → 极坐标漩涡 → 5 次迭代"油画/流体"域扭曲 → 3 色混合 | 51 | `number time`; `number spin_time`; `vec4 colour_1`; `vec4 colour_2`; `vec4 colour_3`; `number contrast`; `number spin_amount` | 否，全局 | `number`、`Image`、`love_ScreenSize`、`extern` | 无硬伤；5 次迭代 × 每像素三角函数，全屏 fill-rate 重 |
| **splash.fs** | 开场/过场烟雾漩涡（与 background 同一套算法，另加 mid_flash 白闪） | 55 | `number time`; `number vort_speed`; `vec4 colour_1`; `vec4 colour_2`; `number mid_flash`; `number vort_offset` | 否，全局 | 同上 | 同 background |
| **flash.fs** | 全屏白色闪光（径向、按 time 触发两段） | 22 | `number time`; `number mid_flash` | 否，全局 | `number`、`love_ScreenSize`、`extern` | 无。最简单的一个 |
| **flame.fs** | Joker 火焰（程序化火苗，5 次迭代域扭曲 + 双色渐变），不采样贴图 | 68 | `float time`; `float amount`; `vec4 texture_details`; `vec2 image_details`; `vec4 colour_1`; `vec4 colour_2`; `float id` | **是**（`id` 是每个火焰实例的随机种子；`texture_details`/`image_details` 是图集切片信息） | `Image`（参数类型）、`extern`；**不调用 `Texel`** | 无硬伤；`mod(4.*time, 10000.)` 在 mediump 下会精度崩塌 |
| **gold_seal.fs** | 金色蜡封的流动高光（单次采样 + 两条正弦条纹叠加） | 27 | `vec4 gold_seal` | **是**（`gold_seal.r` = 每卡相位/时间） | `number`、`Image`、`Texel()`、`extern` | 无。最适合首批移植 |
| **vortex.fs** | **纯 vertex shader**：把卡牌顶点按极坐标绕屏幕中心旋进"漩涡"（开局/结算动画） | 28 | `float vortex_amt`; `float DPI` | 否（`vortex_amt` 全局计时） | `love_ScreenSize`、`position()`、`#ifdef VERTEX`、`extern`；**无 `effect()`** | 无。但依赖"vertex_position 已是屏幕像素坐标"这一 LÖVE/Balatro 约定 |
| **skew.fs** | **纯 vertex shader**：鼠标悬停时的伪 3D 倾斜（详见下文专节）。**Lua 源码中从未被引用 → 死文件** | 23 | `vec2 mouse_screen_pos`; `float hovering`; `float screen_scale` | **是**（hovering/mouse 每次 draw 重设） | `love_ScreenSize`、`position()`、`#ifdef VERTEX`、`extern`；**无 `effect()`** | 无。见下文专节 |
| **dissolve.fs** | 卡牌**默认** shader：燃烧/溶解遮罩（域扭曲噪声场 + 阈值切边 + 两色烧灼边），兼做普通绘制与阴影 | 85 | `number dissolve`; `number time`; `vec4 texture_details`; `vec2 image_details`; `bool shadow`; `vec4 burn_colour_1`; `vec4 burn_colour_2`; `vec2 mouse_screen_pos`; `float hovering`; `float screen_scale` | **是**（除 hovering/mouse/screen_scale 外，`time`/`texture_details`/`image_details`/`dissolve` 全部逐卡不同） | `number`、`Image`、`Texel()`、`extern`、`position()`、`love_ScreenSize`、`#ifdef VERTEX` | 无硬伤 |
| **booster.fs** | 补充包卡面的蓝紫色流光（5 条正弦叠加）+ dissolve | 97 | `vec2 booster` + dissolve 全套（`dissolve`,`time`,`texture_details`,`image_details`,`shadow`,`burn_colour_1`,`burn_colour_2`)+ `mouse_screen_pos`,`hovering`,`screen_scale` | **是** | 同 dissolve.fs | 无硬伤 |
| **voucher.fs** | 券/贴纸的流光（与 booster 几乎逐字相同，仅系数不同）+ dissolve | 97 | `vec2 voucher` + dissolve 全套 + hover 三件套 | **是** | 同上 | 无硬伤 |
| **negative_shine.fs** | 负片卡的流光（同 booster/voucher 模板，系数不同）+ dissolve | 97 | `vec2 negative_shine` + dissolve 全套 + hover 三件套 | **是** | 同上 | 无硬伤 |
| **foil.fs** | Foil（蓝色锡箔）：同心环 + 方向性角度带 + 两条轴向条纹，四层叠加压向蓝色 | 142 | `vec2 foil` + dissolve 全套 + hover 三件套 | **是**（`foil.r` 含卡牌旋转角 `VT.r`） | `number`、`Image`、`Texel()`、`extern`、`position()`、`love_ScreenSize` | 无硬伤；`dot(rotater, uv)/(len*len)` 在 uv≈0 处 **除零 → NaN**（中心像素），移动端 GPU 行为可能与桌面不同 |
| **holo.fs** | Holographic：HSL 色相被噪声场 + 三向网格线同时推动（彩虹全息） | 151 | `vec2 holo` + dissolve 全套 + hover 三件套 | **是** | 同上 + HSL/RGB 手写转换 | 无硬伤；HSL 里 `delta == .0` 浮点等值比较 |
| **polychrome.fs** | Polychrome：整卡色相按噪声场整体偏移 + 饱和度拉高（彩虹流转） | 149 | `vec2 polychrome` + dissolve 全套 + hover 三件套 | **是** | 同上 | 无硬伤 |
| **negative.fs** | Negative：HSL 明度反相 + 色相镜像 + 加一层蓝灰底 | 132 | `vec2 negative` + dissolve 全套 + hover 三件套 | **是** | 同上 | 无硬伤 |
| **debuff.fs** | 被 debuff 的卡：去饱和压暗 + 画一个红色 X（两条对角带） | 148 | `vec2 debuff` + dissolve 全套 + hover 三件套 | **是** | 同上；**唯一一个 dissolve_mask 内部没加 MY_HIGHP 修饰的** | 无硬伤 |
| **played.fs** | 已打出的牌：降饱和降亮度 + alpha 减半 | 129 | `vec2 played` + dissolve 全套 + hover 三件套 | **是**（`played.r` 实际只做 `0.000001*played.r` 的占位乘法，几乎无用） | 同上 | 无硬伤 |
| **hologram.fs** | 稀有 Joker 的"灵魂/全息"浮层：9×9 邻域 alpha 辉光 + 水平 glitch 行偏移 + 青绿描边 | 128 | `vec2 hologram` + dissolve 全套 + hover 三件套 | **是** | 同上 | **WebGL1 硬伤**：循环边界是非常量变量（见下） + 81 次纹理采样 + 可能除零 |

### 三个共享代码块（移植时只需实现一次）

1. **`dissolve_mask(vec4 tex, vec2 texture_coords, vec2 uv)`** — 出现在 12 个卡牌 shader 里（dissolve / booster / voucher / negative_shine / foil / holo / polychrome / negative / debuff / played / hologram / flame 里的 texture_details 用法同源）。**逐字节相同**，只有 debuff.fs 里去掉了 `MY_HIGHP_OR_MEDIUMP` 修饰。核心是 3 组正弦/余弦域扭曲组成的噪声场：

```glsl
vec2 field_part1 = uv_scaled_centered + 50.*vec2(sin(-t / 143.6340), cos(-t / 99.4324));
vec2 field_part2 = uv_scaled_centered + 50.*vec2(cos( t / 53.1532),  cos( t / 61.4532));
vec2 field_part3 = uv_scaled_centered + 50.*vec2(sin(-t / 87.53218), sin(-t / 49.0000));
float field = (1.+ (
    cos(length(field_part1) / 19.483) + sin(length(field_part2) / 33.155) * cos(field_part2.y / 15.73) +
    cos(length(field_part3) / 27.193) * sin(field_part3.x / 21.92) ))/2.;
```

2. **`hue()` / `RGB()` / `HSL()`** — 手写的 HSL↔RGB 转换，出现在 foil / holo / polychrome / negative / debuff / played 共 6 个文件，逐字相同（debuff/played 的 `RGB()` 用 `c.y == 0.`，其余用 `c.y < 0.0001`）。**没有用任何内建色彩函数**。

3. **hover 倾斜 vertex 段** — 出现在 12 个卡牌 shader + CRT.fs 的文件尾部，与 skew.fs 内容等价（见下）。

### 所有 shader 的入口签名情况

- **fragment 入口**：17 个文件用标准 LÖVE 签名 `vec4 effect( vec4 colour, Image texture, vec2 texture_coords, vec2 screen_coords )`。CRT.fs 用简写参数名 `vec4 effect(vec4 color, Image tex, vec2 tc, vec2 pc)`——签名类型完全一致，只是形参改名。
- **无 fragment 入口**：`skew.fs`、`vortex.fs`。这两个文件全部内容都在 `#ifdef VERTEX` 内，fragment 阶段走 LÖVE 的默认 `effect()`（即 `Texel(tex,uv)*color`）。
- **vertex 入口**：14 个文件含 `vec4 position( mat4 transform_projection, vec4 vertex_position )`，全部包在 `#ifdef VERTEX ... #endif` 里 — CRT、skew、vortex、dissolve、booster、voucher、negative_shine、foil、holo、polychrome、negative、debuff、played、hologram。
- **无 vertex 段**：background、splash、flash、flame、gold_seal（纯 fragment）。

### LÖVE 特有内建/别名的使用统计

| 内建/别名 | 用到的 shader | 移植对应物 |
|---|---|---|
| `extern` | **全部 19 个** | `uniform` |
| `number` | 除 flame/vortex/skew 外全部 | `float` |
| `Image` | 17 个（所有含 `effect()` 的） | `sampler2D` |
| `Texel()` | CRT、gold_seal、dissolve、booster、voucher、negative_shine、foil、holo、polychrome、negative、debuff、played、hologram（13 个）。flame / background / splash / flash **不采样纹理** | `texture2D()` |
| `love_ScreenSize` | CRT、background、splash、flash、vortex、skew + 12 个卡牌 shader 的 vertex 段 | `uniform vec2 uResolution`（注意 LÖVE 的是 `vec4`，代码只用 `.xy`） |
| `position()` + `mat4 transform_projection` + `vec4 vertex_position` | 14 个 | Phaser/WebGL 里要改写成显式 `attribute` + `uniform mat4` + `gl_Position` |
| `love_PixelColor` | **0 个**（全部用 `return` 返回值，LÖVE 自动赋值） | — |
| `VaryingTexCoord` / `VertexTexCoord` / `VertexColor` / `TransformMatrix` / `ProjectionMatrix` | **0 个**（均未直接使用） | — |
| `bool shadow` 这种 bool uniform | 12 个卡牌 shader | WebGL1 支持 `uniform bool`，无问题 |

### WebGL 1 / WebGL 2 兼容性逐条结论

**未使用的危险特性（全部为 0 命中）**：
- `dFdx` / `dFdy` / `fwidth`（需 `OES_standard_derivatives`）— **0 处**
- `texture2DLod` / `textureLod` / `textureGrad` — **0 处**
- 多渲染目标（`gl_FragData[]`）— **0 处**
- 动态下标的数组索引 — **0 处**（只有 `tex[3]`，常量下标，合法）
- `while` / `do-while` 循环 — **0 处**

**真实风险点（按严重度）**：

1. **【WebGL1 编译失败】hologram.fs 的循环边界不是常量**
```glsl
MY_HIGHP_OR_MEDIUMP int glow_samples = 4;   // 局部变量，不是 const
for (int i = -glow_samples; i <= glow_samples; ++i){
    for (int j = -glow_samples; j <= glow_samples; ++j){
        _a = Texel( texture, texture_coords + (glow_dist)*vec2(float(i), float(j))).a;
```
GLSL ES 1.00 (WebGL1) Appendix A 要求 for 循环的判定表达式必须与**常量表达式**比较。`glow_samples` 是可写局部变量 → 严格实现下拒绝编译。移植时必须改成 `const int glow_samples = 4;` 或直接字面量。
另外它是 **9×9 = 81 次纹理采样/像素**，是全部 shader 里最贵的一个，移动端 WebGL 上很可能掉帧。

2. **【性能】CRT.fs 的 bloom 双层循环 = 49 次全屏纹理采样**
```glsl
#define BLOOM_AMT 3
for (int i = -BLOOM_AMT; i <= BLOOM_AMT; ++i)
  for (int j = -BLOOM_AMT; j <= BLOOM_AMT; ++j){
      samp = Texel( tex, tc + (bloom_dist/float(BLOOM_AMT))*vec2(float(i), float(j)));
```
边界是 `#define` 常量 → **WebGL1 合法**（可展开）。但注意：`game.lua:3296` 实际 `send('bloom_fac', 0)`，运行时 `if (bloom_fac > 0.00001 && ...)` 恒假，这段是**死代码**。移植时可以直接删掉整个 bloom 块，零视觉损失。

3. **【精度】highp 依赖**
所有文件开头都是这个 guard：
```glsl
#if defined(VERTEX) || __VERSION__ > 100 || defined(GL_FRAGMENT_PRECISION_HIGH)
	#define MY_HIGHP_OR_MEDIUMP highp
#else
	#define MY_HIGHP_OR_MEDIUMP mediump
#endif
```
- CRT.fs 第 1 行写的是 `__VERSION__ > 1` 而非 `> 100`，在 WebGL1（`__VERSION__` = 100）下恒为真 → **CRT.fs 在不支持 fragment highp 的设备上会直接编译失败**（其余文件会优雅降级）。移植时把它改回 `> 100`。
- 实质精度依赖：background/splash/flash 用 `screen_coords`（可达 2000+ px）做 `floor(x*(1./pixel_size))*pixel_size`；flame 用 `mod(4.*time, 10000.)`。这些在 mediump（约 10 bit 尾数）下会出现明显阶梯/跳变。现代移动 GPU 基本都支持 fragment highp，风险中等偏低，但需实机验证。

4. **【数值】除零 / NaN**
- foil.fs: `number angle = dot(rotater, adjusted_uv)/(length(rotater)*length(adjusted_uv));` — `adjusted_uv` 在卡面正中心为 0 → `0/0`。桌面 GPU 通常给 NaN 后被后续 `max/min` 夹住，WebGL 实现可能不同。
- hologram.fs: `glow /= 0.7*float(actual_glow_samples);` — 若 81 次采样全部 `_a >= 0.9`（完全不透明区域），`actual_glow_samples` 为 0 → 除零。

5. **【结构】vertex/fragment 同文件 + LÖVE 自动注入的样板**
WebGL 里必须拆成两段源码，并自己声明 `attribute vec4 VertexPosition; attribute vec2 VertexTexCoord;`、`varying`、`uniform mat4`、精度限定符。这是机械工作，不是语义障碍。

6. **【语义假设】`vertex_position.xy` 被当成屏幕像素坐标**
skew / vortex / 12 个卡牌 shader 的 vertex 段都写 `length(vertex_position.xy - 0.5*love_ScreenSize.xy)`——把**未经变换的**顶点坐标直接跟屏幕尺寸相减。这说明 Balatro 的 sprite 顶点在送入 shader 前就已经是（接近）屏幕像素空间。移植到 Phaser 时若沿用 Phaser 的 local-space 顶点，这些公式会**完全错位**，必须先确认坐标空间或改为传入屏幕空间位置。

---

## 问题 2 深入：哪些 uniform 是 per-card 的（Lua 端实证）

### Takeaway
卡牌 shader 的**每一个** uniform 都是逐卡重设的——包括 `time`。特别反直觉的是：`time` **不是全局时钟**，而是由卡牌 ID 推出的**每卡恒定随机种子**。这意味着这批 shader 天然是"一卡一次 draw call + 一次 uniform 上传"，无法简单合批。

### Cited Findings（`源码/engine/sprite.lua` 第 97–107 行，`Sprite:draw_shader`）

```lua
G.SHADERS[_shader or 'dissolve']:send('mouse_screen_pos', self.ARGS.prep_shader.cursor_pos)
G.SHADERS[_shader or 'dissolve']:send('screen_scale', G.TILESCALE*G.TILESIZE*(_draw_major.mouse_damping or 1)*G.CANV_SCALE)
G.SHADERS[_shader or 'dissolve']:send('hovering', ...)
G.SHADERS[_shader or 'dissolve']:send("dissolve", math.abs(_draw_major.dissolve or 0))
G.SHADERS[_shader or 'dissolve']:send("time", 123.33412*(_draw_major.ID/1.14212 or 12.5123152)%3000)
G.SHADERS[_shader or 'dissolve']:send("texture_details", self:get_pos_pixel())
G.SHADERS[_shader or 'dissolve']:send("image_details", self:get_image_dims())
G.SHADERS[_shader or 'dissolve']:send("burn_colour_1", ...)
G.SHADERS[_shader or 'dissolve']:send("burn_colour_2", ...)
G.SHADERS[_shader or 'dissolve']:send("shadow", (not not _shadow_height))
if _send then G.SHADERS[_shader or 'dissolve']:send(_shader, _send) end   -- 同名 vec2，如 foil/holo/polychrome
```

同名 vec2（`foil` / `holo` / `polychrome` / `negative` / `voucher` / `booster` / `debuff` / `played` / `negative_shine` / `hologram`）的取值（`源码/card.lua` 第 4356–4358 行）：

```lua
self.ARGS.send_to_shader[1] = math.min(self.VT.r*3, 1) + G.TIMERS.REAL/(28) + (self.juice and self.juice.r*20 or 0) + self.tilt_var.amt
self.ARGS.send_to_shader[2] = G.TIMERS.REAL
```

### 分类结论

| uniform | 性质 | 来源 |
|---|---|---|
| `time`（卡牌 shader） | **per-card 常量种子**，`123.33412*(card.ID/1.14212) % 3000`，不随帧变化 | sprite.lua:101 |
| `texture_details` (vec4) | **per-sprite**，图集切片的 `{x, y, w, h}`（像素） | `self:get_pos_pixel()` |
| `image_details` (vec2) | **per-atlas**，整张图集尺寸 | `self:get_image_dims()` |
| `dissolve` (float) | **per-card**，0–1 溶解进度 | `_draw_major.dissolve` |
| `shadow` (bool) | **per-draw**，同一张卡阴影与本体各画一遍 | `_shadow_height` |
| `burn_colour_1/2` (vec4) | **per-card** | `dissolve_colours` |
| `foil`/`holo`/... (vec2) | **per-card**：`.x` = 卡牌旋转角×3 + 全局时间/28 + juice + 倾斜量；`.y` = 全局实时 | card.lua:4357-4358 |
| `hovering` (float) | **per-draw**，0 或悬停倾斜强度 | sprite.lua:99 |
| `mouse_screen_pos` (vec2) | 每帧全局（但每次 draw 都重传；卡牌有自己的 `tilt_var.mx/my` 时用卡牌的 → **可能 per-card**） | sprite.lua:95-97 |
| `screen_scale` (float) | 近全局，但乘了 `_draw_major.mouse_damping` → **可能 per-card** | sprite.lua:98 |
| CRT 的全部 uniform | **全局**，每帧一次 | game.lua:3293-3304 |
| background / splash / flash 的 uniform | **全局**，每帧一次 | game.lua:1382 等（custom_shader 路径） |
| flame 的 `id` | **per-instance** 随机种子 | button_callbacks.lua:2109 的 custom_shader 路径 |
| vortex 的 `vortex_amt` / `DPI` | **全局** | sprite.lua:89-90 |

### Inferences
- `time` 是每卡常量这一点意味着：**dissolve 的噪声图案在每张卡上是静止的**，溶解动画完全由 `dissolve` 值的变化驱动，噪声场本身不动。移植时如果误把 `time` 接成全局时钟，溶解会变成"沸腾"，视觉完全不对。
- 12 个卡牌 shader 共用 10 个 uniform 且逐卡上传，说明 Balatro 的卡牌渲染本质是"**一卡一 draw call**"。Phaser 若想复刻，要么接受同样的 draw call 数（Balatro 场上卡牌数量本就是几十张量级，可接受），要么把 per-card 参数塞进顶点属性做合批——后者需要重写 shader 输入结构。

---

## 问题 6 专节：skew.fs 详解

### Takeaway
skew.fs **不是 fragment 着色器，完全不做采样偏移**——它是一个 23 行的纯 vertex shader，通过篡改 `gl_Position` 的 **w 分量**制造投影变形，从而得到"伪 3D 倾斜"。而且它在 Lua 源码里**从未被引用**（`grep -rn "skew" 源码/*.lua` 零结果），是个死文件；真正在用的是被逐字拷贝进 12 个卡牌 shader 与 CRT.fs 尾部的同一段代码。

### 全文（23 行，除精度宏外）

```glsl
extern MY_HIGHP_OR_MEDIUMP vec2 mouse_screen_pos;
extern MY_HIGHP_OR_MEDIUMP float hovering;
extern MY_HIGHP_OR_MEDIUMP float screen_scale;

#ifdef VERTEX
vec4 position( mat4 transform_projection, vec4 vertex_position )
{
    if (hovering <= 0.){
        return transform_projection * vertex_position;
    }
    MY_HIGHP_OR_MEDIUMP float mid_dist = length(vertex_position.xy - 0.5*love_ScreenSize.xy)/length(love_ScreenSize.xy);
    MY_HIGHP_OR_MEDIUMP vec2 mouse_offset = (vertex_position.xy - mouse_screen_pos.xy)/screen_scale;
    MY_HIGHP_OR_MEDIUMP float scale = 0.2*(-0.03 - 0.3*max(0., 0.3-mid_dist))
                *hovering*(length(mouse_offset)*length(mouse_offset))/(2. -mid_dist);

    return transform_projection * vertex_position + vec4(0,0,0,scale);
}
#endif
```

### 机制拆解

1. **没有 `effect()`**。fragment 阶段走 LÖVE 默认实现，所以这个文件对像素颜色零影响。
2. **`vec4(0,0,0,scale)` 只动 w**。在 LÖVE 的 2D 正交投影下 clip-space 的 `w` 恒为 1；这里把它改成 `1 + scale`。
3. **透视除法产生非仿射变形**。光栅化时 `(x/w, y/w)`，而 `scale` 是**逐顶点**计算的（依赖该顶点到鼠标的距离平方）。四个角 w 各不相同 → 整个 quad 变成一个**梯形**（投影变换），而不是平移/缩放。这正是"卡牌朝鼠标方向立体倾斜"的观感来源。
4. **纹理也跟着正确变形**。GL 的纹理插值是 perspective-correct（按 1/w 插值），所以卡面贴图自动按透视规律拉伸，看起来就像卡真的在 3D 里转了一下——用 0 次额外采样、0 个矩阵换来的。
5. **驱动量**：
   - `hovering`：0 时直接 early-return，无开销；>0 时作为强度总开关（由 `card.hover_tilt` 提供）。
   - `mouse_offset`：顶点到鼠标的屏幕距离（除以 `screen_scale` 归一化），取**平方**——离鼠标越远的角被推得越狠，所以卡牌会"朝鼠标方向低头"。
   - `mid_dist`：顶点到屏幕中心的归一化距离，用 `/(2. - mid_dist)` 做衰减，让靠近屏幕边缘的卡倾斜更强（模拟广角镜头）。
6. **系数差异**：skew.fs 与 12 个卡牌 shader 里的副本都用 `0.2*(...)`；**CRT.fs 尾部那份用的是 `0.002*(...)`**（小 100 倍），且 `mid_dist` 的算法也多乘/除了一次 `screen_scale`。因为 CRT 作用在整块全屏画布上，同样的系数会把整个屏幕扭爆。

### 移植含义
- 在 Phaser 里复刻这个效果，**不需要任何 3D 库**：只要能自定义 vertex shader 并写出带非常数 `w` 的 `gl_Position` 即可。Phaser 3 的自定义 pipeline 支持这一点。
- 若走 CSS/DOM 路线，等价物是 `transform: perspective(...) rotate3d(...)`——但那样就没法和 fragment 特效（foil/holo）在同一个渲染管线里叠加。
- 关键前提仍是**坐标空间**：公式要求 `vertex_position.xy` 已是屏幕像素。

---

## 问题 7 专节：CRT.fs 详解

### Takeaway
CRT.fs 是**唯一的全屏后处理滤镜**，在 `game.lua` 的 `Game:draw()` 里把已渲染好的 `G.CANVAS` 贴到 `G.AA_CANVAS` 时启用，共 8 个 fragment uniform + 3 个 vertex uniform。它同时在文件尾部**夹带了一份 skew 倾斜 vertex 段**（系数 0.002），所以整块屏幕也会随鼠标做微弱透视摆动。

### 应用点（`源码/game.lua` 第 3285–3310 行）

```lua
love.graphics.setCanvas(G.AA_CANVAS)
...
G.SETTINGS.GRAPHICS.crt = G.SETTINGS.GRAPHICS.crt*0.3    -- 实际强度只有设置值的 30%
G.SHADERS['CRT']:send('distortion_fac', {1.0 + 0.07*crt/100, 1.0 + 0.1*crt/100})
G.SHADERS['CRT']:send('scale_fac',      {1.0 - 0.008*crt/100, 1.0 - 0.008*crt/100})
G.SHADERS['CRT']:send('feather_fac', 0.01)
G.SHADERS['CRT']:send('bloom_fac', 0)                    -- ← 恒为 0，bloom 是死代码
G.SHADERS['CRT']:send('time', 400 + G.TIMERS.REAL)
G.SHADERS['CRT']:send('crt_intensity', 0.16*crt/100)
G.SHADERS['CRT']:send('glitch_intensity', 0)             -- ← 恒为 0，glitch 也是死代码
G.SHADERS['CRT']:send('scanlines', G.CANVAS:getPixelHeight()*0.75/G.CANV_SCALE)
G.SHADERS['CRT']:send('mouse_screen_pos', {eased_cursor.sx, eased_cursor.sy})
G.SHADERS['CRT']:send('screen_scale', G.TILESCALE*G.TILESIZE)
G.SHADERS['CRT']:send('hovering', 1)
love.graphics.setShader( G.SHADERS['CRT'])
love.graphics.scale(1/G.CANV_SCALE)
love.graphics.draw(self.CANVAS, 0, 0)
```

### 参数表

| uniform | 类型 | 含义 | 运行时实际值 |
|---|---|---|---|
| `time` | number | 全局时钟，驱动 glitch 与扫描线相位偏移 | `400 + 实时秒` |
| `distortion_fac` | vec2 | 桶形畸变强度（x/y 独立）。`tc += (tc.yx*tc.yx) * tc * (distortion_fac - 1.0)` | `{1+0.0021·S, 1+0.003·S}`（S = crt 设置 0–100） |
| `scale_fac` | vec2 | 畸变前的整体缩放（补偿畸变造成的画面放大） | `{1-0.000024·S, 同}` |
| `feather_fac` | number | 边缘黑色渐隐宽度（`smoothstep(1-feather, 1, ...)`） | 恒 `0.01` |
| `bloom_fac` | number | bloom 混合比 | **恒 0 → 49 次采样的 bloom 块永不执行** |
| `crt_intensity` | number | 总强度：同时控制色差、扫描线叠加量、整体压暗 | `0.048·S/100` |
| `glitch_intensity` | number | 水平撕裂强度 | **恒 0 → glitch 块永不执行** |
| `scanlines` | number | 扫描线频率，按画布像素高算 | `画布像素高 × 0.75 / CANV_SCALE` |
| `mouse_screen_pos` / `hovering` / `screen_scale` | vec2/float/float | 仅供尾部 vertex 倾斜段（`hovering` 恒 1） | — |
| `noise_fac` | — | **已注释掉**（shader 第 11 行与 game.lua:3298 都被注释） | — |

### 实际生效的处理链（按代码顺序）

1. 重心化 `tc = tc*2-1` → 乘 `scale_fac`
2. 桶形畸变：`tc += (tc.yx*tc.yx) * tc * (distortion_fac - 1.0)` — 一个便宜的二阶径向近似
3. 边缘遮罩 `mask`：两轴各一次 `smoothstep`，把屏幕四边渐隐成黑
4. 反重心化回 0–1
5. （glitch 块 — 死代码）
6. 主采样 `crt_tex = Texel(tex, tc)`
7. **横向色差**：R 向右、G 向左各偏移 `0.0005 * 1600/love_ScreenSize.x` → **额外 2 次纹理采样**
8. 整体压暗 `rgb * (1 - crt_intensity)`
9. （glitch 后处理的红绿增强 — 因 `offset_l/r` 恒 0 而不触发）
10. **扫描线网格**：RGB 三通道各用不同相位的 sin/cos，且 x 方向还叠了 4 倍频的条纹 → 模拟荫罩式 RGB 子像素
```glsl
vec3 rgb_scanline = vec3(
    clamp(-0.3+2.0*sin( tc.y * scanlines-3.14/4.0) - 0.8*clamp(sin( tc.x*scanlines*4.0), 0.4, 1.0), -1.0, 2.0),
    clamp(-0.3+2.0*cos( tc.y * scanlines)         - 0.8*clamp(cos( tc.x*scanlines*4.0), 0.0, 1.0), -1.0, 2.0),
    clamp(-0.3+2.0*cos( tc.y * scanlines -3.14/3.0)-0.8*clamp(cos( tc.x*scanlines*4.0-3.14/4.0), 0.0, 1.0), -1.0, 2.0));
rgb_result += crt_tex.rgb * rgb_scanline * crt_intensity * artifact_amplifier;
```
11. 对比度/亮度校正：`-0.55` → `×1.14` → `+0.5`
12. （bloom 块 — 死代码）
13. 返回 `final_col * mask`

### 移植成本评估
- 去掉两段死代码（glitch、bloom）后，CRT.fs 实际只有 **3 次纹理采样 + 十来个 sin/cos**，是一个非常轻的全屏 pass。Phaser 3 的 post-FX pipeline 可以一比一实现，无兼容性障碍。
- 唯一要改的是第 1 行 `__VERSION__ > 1` → `> 100`，否则在不支持 fragment highp 的设备上编译会炸。
- `scanlines` 依赖实际画布像素高，需要在 resize 时重传。

---

## Gaps

- **`skew.fs` 为什么存在但不被调用**：源码里零引用，无法从本地文件判断它是历史遗留、还是被 LÖVE 的 shader 目录枚举逻辑统一加载后闲置。不影响移植结论（其代码已被内联进其他 12 个 shader）。
- **顶点坐标空间的确切定义**：`vertex_position.xy` 与 `love_ScreenSize.xy` 直接相减这件事，说明 Balatro 在调用前做了某种坐标预处理，但具体在哪一层（`Sprite:draw_self` / `love.graphics.push` 链）未追到底。这是移植 vertex 段时**必须先确认**的一点。
- **移动端实机精度表现**：`mediump` 降级路径下 background/splash/flame 的表现只能推断，未做实机验证。
- **`splash` / `flash` / `background` 的 uniform 具体每帧赋值**：走的是 `custom_shader` 的 `_send` 表路径（`game.lua:1382/1475/1491/1613/1641` 等处的 `{shader='splash', send={...}}`），本次未逐条展开这些 send 表的内容，但从 shader 侧看这些 uniform 全部是全局性质（颜色主题 + 时间），不涉及 per-card。
