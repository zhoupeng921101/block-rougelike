# CRT 全屏链路验证

Type: wayfinder:prototype
Status: open

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
