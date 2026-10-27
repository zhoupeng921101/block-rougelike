---
name: dotween-effects
description: 用 DOTween 在热更代码里写补间动画:先判该用 DOTween 还是复用工程既有 VFX 件,再按热更域可用面选 API、按工程生命周期契约接播放与销毁。触发:要给某个节点加位移/缩放/旋转/淡入淡出/序列编排时。本卡只给判据与工序,产品代码改动一律走 devflow。
argument-hint: "<效果点描述> [目标脚本或 prefab 路径]"
---

# DOTween 效果接入

DOTween(Demigiant,`Assets/Plugins/Demigiant/DOTween/`,1.3.030)是代码式补间库:一句 `target.DOMove(...)` 建一条 tween,由全局驱动器每帧推进;`Sequence` 把多条串成时间轴。

## 接入状态

- **在库件**:`DOTween.dll` + `Editor/` + `Modules/` 源码(自成 `DOTween.Modules` 程序集,见下节「硬边界」);`Assets/Resources/DOTweenSettings.asset`;`ProjectSettings.asset` 除 Lumin / Stadia 外全部平台带 `DOTWEEN` 宏。
- **AOT 链路**:`Assets/TEngine/Settings/UpdateSetting.asset` 的 `AOTMetaAssemblies` 含 `DOTween.dll` 与 `DOTween.Modules.dll`(该文件是清单事实源,`ProjectSettings/HybridCLRSettings.asset` 是它的派生物,改清单只改前者)。**本作 HybridCLR 暂关、Windows 走 Mono**,热更程序集按普通程序集加载、不经解释器,这条链路眼下不起作用;清单照留,是为将来开热更(移植手机或 PC 改 IL2CPP)时不用补。
- **开热更后的约束**:届时 Vector3 / Quaternion / float / Vector2 / Color 之外的类型(`Rect` / `string` 等)的 tween 按补充元数据机制转解释执行,出包若报 `ExecutionEngineException` 或 `MissingMethodException`,按 `.claude/references/tengine/hotfix-workflow.md`§AOT 泛型补充处置。编辑器里跑通不代表 IL2CPP 包跑通。
- **既成用法**:`GameLogic/UI/VFX/` 的 `WindowPopIn`(两段缩放 `Sequence` + 独立的遮罩淡入 tween)与 `WindowPopOut`(缩放序列 + `Insert` 一段 `DOFade`)。新写效果按形态抄,共同三件套是 `SetEase` + `SetUpdate(true)` + `SetLink(gameObject)`。

## 硬边界:官方扩展在 `DOTween.Modules` 程序集,属主包

`Modules/` 下的 .cs 自成 `DOTween.Modules` 程序集(asmdef 由 DOTween 编辑器的 ASMDEF 管理生成,`DOTweenSettings.asset` 的 `createASMDEF: 1`),`GameLogic.asmdef` 引用它。官方扩展在热更域直接调:`cg.DOFade`、`image.DOColor`、`image.DOFillAmount`、`rt.DOAnchorPos`、`rt.DOPunchAnchorPos`、`text.DOText`、`layoutElement.DOPreferredSize` 等,逐项清单见 `references/dotween-api.md` 二节。

- **不在热更域再写同名同签名的扩展**:与官方的同时可见,调用点报 CS0121 二义性。
- **这个程序集在 AOT 侧**:改 `Modules/` 源码、改 `DOTweenSettings.asset` 的模块开关、删 asmdef 都是主包改动,须重新出 Player,热更推不下去。它与 `DOTween.dll` 都在 `Assets/Launcher/AotPreserve/link.xml` 整体保活(漏了,IL2CPP 出包后热更新增的调用会被裁掉且无法热更补回),并列入 `AOTMetaAssemblies`(漏了,AOT 指纹拦不住缺它的旧包);这两处与 asmdef 同增同删。
- **没开的模块没有扩展**:`uiToolkit` / `textMeshPro` / EPO 模块关着。TMP 的颜色与 alpha 走 `Graphic` 版 `DOColor` / `DOFade`,其余 TMP 文字动画走 `DOTween.To`。
- `Modules/` 之外的形态(数字滚动、逐字显示、自定义字段)按 `DOTween.To(getter, setter, end, duration)` 手写,配方见 `references/tween-recipes.md`。

**UniTask 桥接不可用**:`Packages/UniTask/Runtime/External/DOTween/` 的编译产物 `UniTask.DOTween.dll` 公开类型数 = 0——它的 `versionDefines` 认 UPM 包 `com.demigiant.dotween`,本工程是 Assets 目录导入,`UNITASK_DOTWEEN_SUPPORT` 不成立,整个文件被 `#if` 掉。`await tween` / `tween.ToUniTask()` 写不出来。要 `await` 见 recipes 篇「等一条 tween 播完」。`DOTweenModuleUnityVersion` 的 `AsyncWaitForCompletion` 系列能编译但返回 `Task`,工程异步一律 UniTask,不用它。

## 硬边界:`Ease` 与 TEngine 同名

`TEngine` 命名空间下也有个 `Ease` 枚举(`Assets/TEngine/Runtime/Extension/Tween/ITweenHelper.cs`)。热更域 UI 代码普遍 `using TEngine;`(要用 `Log`),再 `using DG.Tweening;` 后裸写 `Ease.OutCubic` 报 **CS0104 不明确的引用**。文件顶部加别名解决:

```csharp
using Ease = DG.Tweening.Ease;
```

只影响 `Ease` 一个标识符,`DOTween` / `Tween` / `Sequence` 都不冲突。现有的 `WindowPopIn` / `WindowPopOut` 没有 `using TEngine;`,所以不用别名。

## 先判:该用 DOTween 还是既有 VFX

工程现有两套并存,不互相替换:

- **既有 VFX**——`Assets/GameScripts/HotFix/GameLogic/UI/VFX/` 下的动画件与辅助件,逐件归属见下节「既有件分档」。眼下只有窗口开关一族;战斗盘面的拖拽落子与消除表现按工程计划从 block-client 移植,移植进来的件在下节补登档位。
- **新写 DOTween**——本卡。

| 情形 | 走 |
|---|---|
| 有对应既有件且够用(窗口弹入弹出) | 既有 VFX,**不重写** |
| 新写一次性 Transform 动画:位移 / 缩放 / 旋转 / 跳跃 / 路径 | DOTween(省掉 Update + 计时 + 收尾那套样板) |
| 多段有先后节拍、要精确编排的序列 | DOTween 的 `Sequence` |
| 要完成回调、中途取消、依赖运行时算出的坐标 | DOTween(`OnComplete` / `Kill` / getter-setter 都直给) |
| UI 图形属性(alpha / 颜色 / fillAmount / anchoredPosition / sizeDelta) | 官方扩展直接调,`Modules/` 没有的按 DOTween.To 配方;既有件够用时仍走既有件 |
| 每帧要算的自定义插值(自定义轨迹、多段变速) | `DOVirtual.Float` + `OnUpdate`(进度补间 + setter 写值,缓动施加在进度上——路径动画的正确语义),不合适才手写 Update |
| 震屏 / 相机抖动 | DOTween `DOShakePosition`(Transform 与 Camera 两份都在核心 dll,热更域直接可用) |
| 后处理、手柄震动 | 工程无现成件;要做先单独立项定方案,不在做效果的顺手里引第三方包 |
| 一帧内批量启动(整行消除逐格表现、一批奖励齐飞) | 既有 VFX 件或复用一条 Sequence——见下方「批量场景」 |

**批量场景**:`DOTweenSettings.asset` 里 `defaultRecyclable: 0`,每条 tween 都是新对象,一帧建几十条会有可观 GC;容量默认 200 tweener / 50 sequence,超出时自动扩容并打 warning。盘面级批量优先复用既有件,或一条 Sequence 用 `Insert` 排完所有格子而不是每格一条。

判为「既有 VFX」时本卡到此为止。

## 既有件分档

`UI/VFX/` 的动画件按驱动方式分两档:DOTween 档与手写档。新写效果一律 DOTween;移植进来的手写件,迁不迁按「换过去是否更简单、有没有属性补间可迁」逐件判,判过的结论记进本表,别每次改到它都重新评估。

| 档 | 件 | 判据 |
|---|---|---|
| DOTween | `WindowPopIn` `WindowPopOut` | 新写效果照这批抄形态(见「接入状态」) |
| 手写 | (暂无) | — |

其余文件不是动画件、不分档:`UIWindowOpenAnim`(入场动画抽象基类)、`WindowPopInAnim`(把 `WindowPopIn` 挂成显式声明的入场组件,自身不驱动)。

**DOTween 件里只能手写的部分**(别指望重构掉):`WindowPopIn` / `WindowPopOut` 每帧给遮罩写 `1/s` 的反向缩放补偿,落在整条序列的 `OnUpdate` 上。

**DOTween 实操结论**(均有编辑器采样为据,多数采自 block-client 的同类件):

- **常驻呼吸用 Yoyo,单程时长取半周期**。`SetLoops(-1, LoopType.Yoyo)` 的一个 loop 是单程,故往返合起来等于周期时单程须取 `_period * 0.5f`;配 `Ease.InOutSine` 后与手写的 `(1-cos(2πt/period))/2` 逐点相同。起相位偏移用 `tween.Goto(_phaseOffset * _period, true)`——`Goto` 的参数是**跨 loop 的总时间**,故乘整周期而非半周期;实测它对无限 Yoyo tween 可跨周期正确定位并继续播放。
- **`Sequence` 里某段的起点在该段 Startup 时捕获,不在建 Sequence 时**。所以「延迟期缩到 0、起跳时从 0.6 起」这种形态可以 `AppendInterval` + `AppendCallback` 设起点 + `Append(DOScale(...))`,下一段会读到 callback 写的值。注意用 `Goto` 采样验证时**跳过的 callback 不触发**,采样结果会偏——验曲线要用 `DOTween.ManualUpdate` 连续推进(把 tween 设成 `UpdateType.Manual`)。
- **`Join` 会推迟后续 `Append`,当它比所在段长的时候**。`Join` 把 tween 插到上一个 `Append` 的起点,但序列的插入位置被推进到 `max(已插入元素的结束时间)`——一条 0.2s 的 `Join` 挂在 0.12s 的段上,下一个 `Append` 就从 0.2s 而不是 0.12s 开始(`WindowPopIn` 实测 seqDur 0.25→0.33,scale 偏差 0.141;现行实现因此把遮罩淡入单独起一条 tween)。**两条并行但时长不同的补间,让短的那条独立成 tween,别 Join**。时长相同的 `Join` 没有这个问题。
- **`SetLink(gameObject)` 防不住「只销毁组件」**。它绑的是 GameObject;`Destroy(someComponent)` 时节点还在,tween 照跑,漏 Kill 的表现是残留补间继续写新一轮的属性(block-client 实发过:同格重新落冰时 `Destroy` 掉冰碎件)。**凡「播完 `Destroy(this)`」的组件,一律补 `OnDestroy` 里 Kill**——`OnDisable` 盖不住这一路(节点仍 active 时它不触发)。`WindowPopIn` / `WindowPopOut` 即照此写。
- **判某个 MonoBehaviour 有没有被挂载,必须搜它 `.meta` 里的 guid,不能只搜类名**。prefab / 场景 / ScriptableObject 记的是 guid;只搜类名会把「挂在 prefab 上但代码里没人 `GetComponent`」的件误判成死代码,删掉就是运行期 missing script。
- **手写版的 `Mathf.Lerp(a, b, ease(k))` 自带 `Clamp01`,超调被削平**。`OutBack` / `OutElastic` 这类会越界的曲线,手写版实际表现是「到峰值就停住一小段」,而 `DOScale` 走 unclamped 会真的越过终点再回落(实测差 0.0798)。迁这类曲线要照搬 clamp 才不改手感:写一个包了 clamp 的 `EaseFunction` 交给 `SetEase`(block-client 的现成件 `VFXEase.ClampedOutBack` 未搬入)。想要真回弹是改手感,单独立项。

## 工作流

1. **定效果点**:哪个脚本、哪个节点、什么时机触发、时长多少。
2. **查可用面**:两处按序查——①核心 dll 与官方扩展(Transform / Material / Camera 与 UI / Sprite 等,见 `references/dotween-api.md` 一、二节);②都没有 → 按 recipes 配方手写 `DOTween.To`。
3. **写 tween**:按下方编码范式,「五条静默失效」逐条过。
4. **接触发时机**:见「播放时机接入」。
5. **验证**:Play 触发一次目视形态与时长;`read_console` 确认无 DOTween warning(容量扩容、目标已销毁都会打 warning 而非报错)。

## 播放时机接入(工程契约,三条都是硬约束)

- **窗口入场动画不在 `OnCreate` 里播**。`UIPanelMono.InternalPlayOpenAnim` 是统一入口:窗根挂了 `UIWindowOpenAnim` 子类就播它,没挂才回落到弹窗层默认的 `WindowPopIn` 缩放弹入。要用 DOTween 做入场,写一个 `UIWindowOpenAnim` 子类、在 `Play()` 里起 tween,挂到窗根;基类还有一个抽象成员 `Finish()`(立即收尾到终态)必须一并实现,样板见 recipes 篇「窗口入场动画」。自己在 `OnCreate` 里播会与层默认叠成两层缩放。`Play()` 会因重复 `ShowUIAsync` 置顶而重入,实现必须先 `Kill` 旧 tween 并复位,而非叠加。
- **音效不用 DOTween 驱动**。工程音频走 `GameModule.Audio`(TEngine `IAudioModule`),不用 `AudioSource.DOFade` / `AudioMixer.DOSetFloat` 绕开它。
- **按钮反馈**接在生成器产出的 `OnClick_XxxBtn` partial 方法里;玩法事件接在既有事件回调里,事件系统规约见 `.claude/references/tengine/event-system.md`。

## 编码范式

```csharp
using DG.Tweening;
using UnityEngine;

// 一次性动画:起一条就不管了。SetLink 与 SetUpdate 两句都不可省,理由见下节。
transform.DOScale(1.15f, 0.2f)
    .SetEase(Ease.OutBack)
    .SetUpdate(true)                 // 不受 timeScale 影响,与工程既有 VFX 同口径
    .SetLink(gameObject);            // 宿主销毁时自动 Kill,默认 LinkBehaviour.KillOnDestroy
```

```csharp
// 可重入 / 可取消的动画:持字段,重播前 Kill。
private Tween _popTween;

private void PlayPop()
{
    _popTween?.Kill();                    // 不先 Kill 会两条 tween 同帧互相覆盖 localScale
    transform.localScale = Vector3.one;   // 复位起点:上一次可能停在中途值

    _popTween = DOTween.Sequence()
        .Append(transform.DOScale(1.28f, 0.12f).SetEase(Ease.OutCubic))
        .Append(transform.DOScale(1f, 0.18f).SetEase(Ease.OutCubic))
        .AppendCallback(() => _popTween = null)
        .SetUpdate(true)
        .SetLink(gameObject);
}
```

**参数写 `const` 还是 `[SerializeField]`**:按 `.claude/references/tengine/ui-patterns.md`§「Inspector 公开约定」判——组件只由 `AddComponent` 建、不挂 prefab 时没有序列化载体,参数一律 `const`;挂在 prefab 上的才公开。DOTween 不改这条判据。

## 生命周期:五条静默失效

都不报错、不中断,只表现为「动画不对」或「下次打开时是脏的」。

1. **目标被销毁而 tween 还活着**。`useSafeMode: 1` 会吞掉异常并 Kill 那条 tween,不崩;但 `OnComplete` 里的热更闭包在那之前一直持有窗引用。**解法恒为 `SetLink(gameObject)`**,一句话的事,不要靠 safeMode 兜。
2. **节点 `SetActive(false)` 不会停 tween**——DOTween 由全局驱动器推进,与宿主启用状态无关:节点隐藏期间 tween 继续写值,再启用时属性已到终点或停在中途。对象池件、列表项、按条件显隐的按钮是重灾区。**解法**:`SetLink(gameObject, LinkBehaviour.KillOnDisable)` 或 `PauseOnDisablePlayOnEnable`,按要不要接着播选;另在重绘入口无条件复位目标属性兜底。
3. **重复触发同一目标**。两条 tween 同时写同一个属性,表现是抖动或最终值错乱。持字段 `Kill` 是首选;拿不到字段时用 `target.DOKill()`(`Component` 上的扩展,核心 dll 里有)或给 tween `SetId` 后按 id kill。
4. **`timeScale` 依赖**。默认 `UpdateType.Normal` 受 `Time.timeScale` 影响。工程当前未使用 timeScale,但既有 VFX(`WindowPopIn` / `WindowPopOut`)已按「将来会加暂停」的口径写成 unscaled。**UI 动画一律 `SetUpdate(true)`**;玩法内、该跟着暂停停住的效果才用默认。
5. **`defaultAutoKill: 1`**——tween 播完即被 Kill,持有的引用变成死引用,再调 `Restart()` 不生效(safeMode 下打 warning)。要复用同一条 tween 得 `SetAutoKill(false)`,代价是必须自己负责 Kill,否则它一直挂在驱动器上。**默认不改**:新建一条比复用一条更不容易错。

## 查 API

**官方 XML 文档在工程里**,`Assets/Plugins/Demigiant/DOTween/DOTween.XML`(含全部公开成员的签名与逐参数说明):

```bash
grep -A12 "M:DG.Tweening.ShortcutExtensions.DOPunchScale" Assets/Plugins/Demigiant/DOTween/DOTween.XML
```

条目形如 `<member name="M:命名空间.类型.方法(参数类型,...)">`,`-A12` 覆盖多数条目;没看到 `</member>` 就加大 `-A` 重来。**方法名前必须带完整类型前缀**——`DOColor` 在 `ShortcutExtensions` 下有 Camera / Light / LineRenderer / Material 四类目标共 6 份重载,不带前缀会一次命中一片。

工程特有的可用面清单、枚举全值、settings 默认值在 `references/dotween-api.md`;常见效果的现成写法在 `references/tween-recipes.md`。**XML 是 API 事实源,两篇 reference 是工程边界与配方**——签名以 XML 为准。

## 自检

- 新增的每条 tween 都有 `SetLink`,或在宿主的 `OnDestroy` / `OnDestroyWindow` 里显式 `Kill`。
- UI 动画都带 `SetUpdate(true)`。
- 可重复触发的效果:连点两次不抖、不停在中途值。
- 目标节点会被 `SetActive(false)` 的:隐藏再显示一次,属性是干净的。
- Play 一次目视形态与时长;`read_console` 0 报错、0 DOTween warning。
- 客户端自检 `客户端自检.ps1` 全绿。

## 禁止事项

- **不用 `DOTween.KillAll()` / `DOTween.Clear()` / `DOTween.PauseAll()`**——它们作用于全局,会连别的系统正在播的 tween 一起处理。按目标 Kill,或按 id Kill。
- **不改 `DOTweenSettings.asset` 的全局默认值**(`defaultAutoKill` / `defaultRecyclable` / `defaultEaseType` / `useSafeMode`)。改一次波及全工程所有 tween,且没有编译期报错提示改过。单条 tween 的差异用 `SetAutoKill` / `SetRecyclable` / `SetEase` 就地覆盖。
- **不重写 `UI/VFX/` 的既有动画件**(名单见「既有件分档」)——`WindowPopIn` / `WindowPopOut` 是弹窗层的默认开关动画,每个弹窗都经过它们。
- **不在热更域手写官方已有的扩展**(同名同签名即 CS0121);官方没有的形态写成普通方法或 `DOTween.To` 配方。
- **不在做效果的顺手里改 `Modules/` 或 `DOTweenSettings.asset` 的模块开关**——那是主包改动,须重新出 Player,单独立项(通道判据正本 = CLAUDE.md「devflow 适用面」)。
- **不手写 `DOTween.Init(...)` 改全局参数**。首次用到时自动初始化,参数正本是 `DOTweenSettings.asset`。
