# CRT 全屏链路验证

Type: wayfinder:prototype
Status: resolved

## Question

Balatro 的 CRT 滤镜是全屏后处理。Phaser 4 里这条链能不能串起来？

[Phaser 4 渲染路线 spike](13-Phaser4渲染路线spike.md) 把其余三项都验了，
唯独这条没测——它是 Phaser 自己文档里的既定用法，风险低，但仍是未验证项。

要验的链路（出自 Phaser 4 自带的 `skills/filters-and-postfx/SKILL.md`）：

```js
this.cameras.main.setForceComposite(true);
// ...场景内容...
this.add.captureFrame('scene');
// 再挂一个全屏 Shader GameObject，采样 'scene' 纹理跑 CRT
```

具体要答：

1. 这条链能不能跑通，`captureFrame` 捕获到的纹理能不能被自定义 `Shader` 采样。
2. `资源/shaders/CRT.fs`（153 行，19 个 shader 里最大的一个）移植过去出图对不对。
3. 开销多少。[13 号票](13-Phaser4渲染路线spike.md) 实测全屏 shader 在 RTX 3060 上
   几乎免费，CRT 大概率也一样，但它比 dissolve 复杂，值得单独量一下。
4. **本产物的 CRT 强度是 30（移动版），桌面是 70**（`globals.lua:231`）。
   验的时候用哪个，取决于 [外观基准是移动版还是桌面版](12-外观基准是移动版还是桌面版.md)。
   那张票没裁定前，两个都出一张图备用。

顺带：报告称 CRT 的 bloom / glitch 在原版里就是死代码（`bloom_fac = 0`），
移植时确认一下，能省掉的就别搬。

spike 工程已在 `复刻/Balatro/spike/`，加一个 `?crt=1` 分支即可，不用另起。

## Answer

**链路跑通，CRT.fs 移植成功，开销约 0.5ms。**

真机实测（Playwright + Edge，ANGLE D3D11，RTX 3060），证据截图
`复刻/Balatro/spike/证据-CRT全屏链路.png`：扫描线、红青色散、桶形畸变、
边缘渐隐全部可见。spike 加了 `?crt=1&crtStrength=<n>` 分支。

### 1. 链路成立

```js
this.cameras.main.setForceComposite(true);
this.add.captureFrame('scene');
// 全屏 Shader GameObject，textures 传 ['scene']
```

`captureFrame` 产出的具名纹理能被自定义 `Shader` 直接当纹理采样，无需额外桥接。

### 2. 开销

| 场景 | p50 / p95 (ms) |
|---|---|
| 40 张牌，无 CRT | 0.4 / 0.7 |
| 40 张牌，CRT 强度 70 | 0.9 / 1.5 |
| 40 张牌，CRT 强度 30 | 0.9 / 1.4 |

**CRT 约 +0.5ms**，占 16.7ms 预算的 3%。强度 30 与 70 无差别——
它只改 uniform 的数值，不改采样次数。

与 [13 号票](13-Phaser4渲染路线spike.md) 一致：全屏 shader 在这台机器上不构成瓶颈。
**同样的保留：这是 RTX 3060，移动端不能外推。**

### 3. 剥掉了两段死码——原作就是死的，不是我们的简化

| 死码 | 证据 |
|---|---|
| `bloom_fac` | `game.lua:3296` 硬编码 `send('bloom_fac', 0)`，那个 7×7 = 49 次采样的 bloom 循环永不执行 |
| `glitch_intensity` | `game.lua:3300` 硬编码 0，**真值那行还被注释掉了**（`--0.1*G.SETTINGS.GRAPHICS.crt/100 + ...`） |

glitch 死掉之后 `offset_l` / `offset_r` 恒为 0，于是 `artifact_amplifier` 恒为 1。
移植时把 `artifact_amplifier` 处处代入 1、`bloom_fac` 处处代入 0，
**这是代数等价变换，不是近似**。

`noise_fac` 在原作里整段就是注释掉的，也没搬。

剥掉之后 CRT.fs 从 153 行降到约 60 行有效代码，且没有 `hologram.fs` 那种
非常量循环边界问题——**这个 shader 比预想好移植得多**。

### 4. 强度取值

按 [12 号票](12-外观基准是移动版还是桌面版.md) 的裁定取**桌面值 70**。
uniform 换算照 `game.lua:3293-3301` 原样搬，封装在 `crtUniforms()` 里：

- `distortion_fac = (1 + 0.07·crt/100, 1 + 0.1·crt/100)`
- `scale_fac = (1 - 0.008·crt/100, 同)`
- `crt_intensity = 0.16·crt/100`
- `scanlines = 画布像素高 × 0.75`

### 5. 一条观察，不是缺陷

截图里整体偏暗。CRT 的亮度校正是 `-0.55` 再 `+0.5`，
这套系数是按原作那张**明亮的动态背景**调的；spike 的背景近乎全黑，所以压得很暗。
正式实现接上 `background.fs` 之后应当正常。**做外观比对时别拿这张截图当基准。**
