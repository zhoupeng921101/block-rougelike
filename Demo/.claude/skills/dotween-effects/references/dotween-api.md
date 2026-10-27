# dotween-api.md — 热更域可用面与工程边界

> 本篇是**边界清单**,不是 API 字典。签名与逐参数说明的事实源是 `Assets/Plugins/Demigiant/DOTween/DOTween.XML`(见 SKILL.md「查 API」)。本篇只回答两件事:这个方法在热更域能不能用、当前工程的默认值是什么。

## 一、热更域可用(核心 `DOTween.dll`,89 个公开类型)

### Transform 快捷(`ShortcutExtensions`,34 个)

```
DOMove DOMoveX DOMoveY DOMoveZ
DOLocalMove DOLocalMoveX DOLocalMoveY DOLocalMoveZ
DOScale DOScaleX DOScaleY DOScaleZ
DORotate DORotateQuaternion DOLocalRotate DOLocalRotateQuaternion
DOLookAt DODynamicLookAt
DOJump DOLocalJump
DOPath DOLocalPath
DOPunchPosition DOPunchRotation DOPunchScale
DOShakePosition DOShakeRotation DOShakeScale
DOBlendableMoveBy DOBlendableLocalMoveBy DOBlendableRotateBy DOBlendableLocalRotateBy
DOBlendableScaleBy DOBlendablePunchRotation
```

常用签名(其余查 XML):

```csharp
Tweener DOMove(Vector3 endValue, float duration, bool snapping = false)
Tweener DOScale(Vector3 endValue, float duration)          // 另有 float 重载,等比缩放
Tweener DORotate(Vector3 endValue, float duration, RotateMode mode = RotateMode.Fast)
Tweener DOPunchScale(Vector3 punch, float duration, int vibrato = 10, float elasticity = 1f)
Tweener DOShakePosition(float duration, float strength = 1f, int vibrato = 10, float randomness = 90f, ...)
Sequence DOJump(Vector3 endValue, float jumpPower, int numJumps, float duration, bool snapping = false)   // 返回的是 Sequence,不是 Tweener
```

**`DORotate` 的 `RotateMode`**:默认 `Fast` 走最短路径且把角度规整到 0-360;要转超过一圈用 `FastBeyond360`,要按当前角度叠加用 `WorldAxisAdd` / `LocalAxisAdd`。转盘、连续旋转错用 `Fast` 的症状是「转一点点就停」。

### 其他可用目标

| 目标 | 方法 |
|---|---|
| `Material` | `DOColor` `DOFade` `DOFloat` `DOVector` `DOOffset` `DOTiling` `DOBlendableColor` + 控制类 |
| `Camera` | `DOColor` `DOFieldOfView` `DOOrthoSize` `DOAspect` `DONearClipPlane` `DOFarClipPlane` `DOPixelRect` `DORect` `DOShakePosition` `DOShakeRotation` |
| `Light` | `DOColor` `DOIntensity` `DOShadowStrength` `DOBlendableColor` |
| `LineRenderer` | `DOColor` |
| `TrailRenderer` | `DOResize` `DOTime` |
| `Tween`(另一条 tween 或 Sequence) | `DOTimeScale` —— 把那条 tween 自己的播放倍率补间到目标值,做渐快 / 渐慢;改的是单条的 `timeScale`,不是全局倍率 |
| 任意 `Component` | `DOKill` `DOPlay` `DOPause` `DOComplete` `DORestart` `DORewind` `DOFlip` `DOGoto` `DOTogglePause` `DOPlayForward` `DOPlayBackwards` `DOSmoothRewind` |

`Component` 那一组按「以该组件为 target 的全部 tween」批量操作,是拿不到 tween 字段时的兜底。

### 通用入口

```csharp
// 万能补间:UI 图形属性、自定义字段都走这个。配方见 tween-recipes.md
TweenerCore<T1,T2,TPlugOptions> DOTween.To(DOGetter<T1> getter, DOSetter<T1> setter, T2 endValue, float duration)

Sequence DOTween.Sequence()                       // 时间轴容器
int   DOTween.Kill(object targetOrId, bool complete = false)   // 按 target 或 id 杀,返回杀掉的条数
bool  DOTween.IsTweening(object targetOrId, bool alsoCheckIfIsPlaying = false)

// 无目标的纯数值补间 / 延时回调
Tweener DOVirtual.Float(float from, float to, float duration, TweenCallback<float> onVirtualUpdate)
Tweener DOVirtual.Int / Vector2 / Vector3 / Color(...)
Tween   DOVirtual.DelayedCall(float delay, TweenCallback callback, bool ignoreTimeScale = true)
float   DOVirtual.EasedValue(float from, float to, float lifetimePercentage, Ease easeType)   // 立即求值,不建 tween
```

`DOVirtual.DelayedCall` 的 `ignoreTimeScale` **默认 true**,与其他 API 的默认相反,不必再加 `SetUpdate(true)`。

### 设置项(`TweenSettingsExtensions`,链式)

```
SetEase SetLoops SetDelay SetUpdate SetAutoKill SetRecyclable SetRelative
SetSpeedBased SetInverted SetId SetTarget SetLink SetLookAt SetOptions SetAs From
```

```csharp
T SetEase(Ease ease)                                        // 另有 AnimationCurve 与 EaseFunction 重载
T SetLoops(int loops, LoopType loopType = LoopType.Restart)  // -1 = 无限
T SetUpdate(bool isIndependentUpdate)                        // true = 不受 timeScale 影响
T SetLink(GameObject target, LinkBehaviour behaviour = LinkBehaviour.KillOnDestroy)
T From(bool isRelative = false)                              // 把当前值当终点、把设的值当起点
```

### 回调

```
OnStart OnPlay OnPause OnRewind OnUpdate OnStepComplete OnComplete OnKill OnWaypointChange
```

`OnComplete` 在 `SetLoops(-1)` 下永不触发;每轮结束用 `OnStepComplete`。

### Sequence 编排

```csharp
Sequence Append(Tween t)            // 接在末尾
Sequence Join(Tween t)              // 与上一段同时开始
Sequence Insert(float atPosition, Tween t)    // 插到绝对时间点
Sequence Prepend(Tween t)           // 插到开头,整体后移
Sequence AppendInterval(float interval)       // 空档;另有 Prepend 版(没有 Insert 版)
Sequence AppendCallback(TweenCallback cb)     // 另有 Prepend/Insert/Join 版
```

批量场景用 `Insert(i * 0.03f, ...)` 排出错峰,比每个目标各建一条 tween 省对象。

### 控制与查询(`TweenExtensions`)

```
Kill Complete Pause Play PlayForward PlayBackwards Restart Rewind SmoothRewind Flip Goto GotoWithCallbacks TogglePause
IsActive IsPlaying IsComplete IsInitialized IsBackwards IsLoopingOrExecutingBackwards IsTimeScaleIndependent Done
Duration Delay Elapsed ElapsedDelay ElapsedPercentage ElapsedDirectionalPercentage CompletedLoops Loops
WaitForCompletion WaitForKill WaitForRewind WaitForStart WaitForPosition WaitForElapsedLoops
ForceInit ManualUpdate PathLength PathGetPoint PathGetDrawPoints GotoWaypoint
```

`WaitForCompletion()` 这一组的**无参版在核心 dll 里,返回 `YieldInstruction`,协程可用**;`DOTweenModuleUnityVersion` 里还有带 `bool returnCustomYieldInstruction` 参数的版本与 `AsyncWaitForCompletion` 系列 `Task` 版。工程用 UniTask 不用协程与 `Task`,实际路子是 `OnComplete` 回调或 recipes 篇的 `UniTaskCompletionSource` 包装。

## 二、热更域可用(官方扩展,`Modules/` → `DOTween.Modules` 程序集)

`GameLogic` 引用 `DOTween.Modules`,下表方法在热更域直接写;该程序集在主包,约束见 SKILL.md「硬边界」。逐文件列全,查「有没有」不必试编译。

| 文件 | 目标 : 方法 |
|---|---|
| `DOTweenModuleUI.cs` | `RectTransform`: DOAnchorPos DOAnchorPosX DOAnchorPosY DOAnchorPos3D DOAnchorPos3DX DOAnchorPos3DY DOAnchorPos3DZ DOAnchorMax DOAnchorMin DOPivot DOPivotX DOPivotY DOSizeDelta DOPunchAnchorPos DOShakeAnchorPos DOJumpAnchorPos<br>`CanvasGroup`: DOFade<br>`Image`: DOColor DOFade DOFillAmount DOBlendableColor DOGradientColor<br>`Graphic`: DOColor DOFade DOBlendableColor<br>`Text`: DOColor DOFade DOText DOBlendableColor<br>`Slider`: DOValue<br>`ScrollRect`: DONormalizedPos DOHorizontalNormalizedPos DOVerticalNormalizedPos<br>`LayoutElement`: DOFlexibleSize DOMinSize DOPreferredSize<br>`Outline`: DOColor DOFade DOScale |
| `DOTweenModuleSprite.cs` | `SpriteRenderer`: DOColor DOFade DOBlendableColor DOGradientColor |
| `DOTweenModuleAudio.cs` | `AudioSource`: DOFade DOPitch / `AudioMixer`: DOSetFloat + 控制类(工程音频归 `GameModule.Audio`,不用这组) |
| `DOTweenModulePhysics.cs` | `Rigidbody`: DOMove DOMoveX DOMoveY DOMoveZ DORotate DOLookAt DOJump |
| `DOTweenModulePhysics2D.cs` | `Rigidbody2D`: DOMove DOMoveX DOMoveY DORotate DOJump |
| `DOTweenModuleUnityVersion.cs` | `Material.DOGradientColor`、`Material.DOOffset/DOTiling(propertyID 重载)`、`WaitForXxx(bool)` 系列、`AsyncWaitForXxx` 系列 |
| `DOTweenModuleUIToolkit.cs` / `DOTweenModuleEPOOutline.cs` | 模块开关关着,文件整体被 `#if` 掉,**不可用** |

**TextMeshPro 专用扩展一份也没有**:`DOTweenSettings.asset` 的 `textMeshProEnabled: 0`,`Modules/` 下没有 TMP 文件。`TMP_Text` 派生自 `Graphic`,颜色与 alpha 用 `Graphic` 版 `DOColor` / `DOFade`;其余文字动画走 `DOTween.To` 手写(配方见 recipes 篇)。

## 三、枚举全值(实测自 dll)

```
Ease         = Unset Linear InSine OutSine InOutSine InQuad OutQuad InOutQuad
               InCubic OutCubic InOutCubic InQuart OutQuart InOutQuart
               InQuint OutQuint InOutQuint InExpo OutExpo InOutExpo
               InCirc OutCirc InOutCirc InElastic OutElastic InOutElastic
               InBack OutBack InOutBack InBounce OutBounce InOutBounce
               Flash InFlash OutFlash InOutFlash
               (另有 INTERNAL_Zero / INTERNAL_Custom 两个内部值,业务代码不写)
LoopType     = Restart Yoyo Incremental
UpdateType   = Normal Late Fixed Manual
LinkBehaviour= PauseOnDisable PauseOnDisablePlayOnEnable PauseOnDisableRestartOnEnable
               PlayOnEnable RestartOnEnable KillOnDisable KillOnDestroy
               CompleteOnDisable CompleteAndKillOnDisable RewindOnDisable RewindAndKillOnDisable
RotateMode   = Fast FastBeyond360 WorldAxisAdd LocalAxisAdd
AxisConstraint = None X Y Z W
ScrambleMode = None All Uppercase Lowercase Numerals Custom
PathType     = Linear CatmullRom CubicBezier
PathMode     = Ignore Full3D TopDown2D Sidescroller2D
AutoPlay     = None AutoPlaySequences AutoPlayTweeners All
```

**与手写缓动的对应**(移植 block-client 手写件时对齐手感,不是要求改写):常见手写式 `1-(1-t)^3` = `Ease.OutCubic`;标准 OutBack(`c1 = 1.70158`)= `Ease.OutBack`(DOTween 的 overshoot 默认值即 1.70158)。block-client 的手写缓动集 `VFXEase` 未搬入,移植进来时按此对齐。

## 四、当前工程的全局默认值

`Assets/Resources/DOTweenSettings.asset` 实际值。**改这些是全局改动,按 SKILL.md「禁止事项」不改**;这里列出是为了知道不写 `SetXxx` 时会得到什么。

| 项 | 值 | 影响 |
|---|---|---|
| `defaultEaseType` | `6` = `OutQuad` | 不写 `SetEase` 时的曲线 |
| `defaultAutoKill` | `1` | 播完即 Kill,tween 引用随之失效 |
| `defaultRecyclable` | `0` | 不回收,每条 tween 都新建(批量场景的 GC 来源) |
| `defaultTimeScaleIndependent` | `0` | 默认**受** `Time.timeScale` 影响 |
| `defaultAutoPlay` | `3` = `All` | 建出来就自动播,不必 `Play()` |
| `defaultUpdateType` | `0` = `Normal` | 在 `Update` 阶段推进 |
| `defaultLoopType` | `0` = `Restart` | — |
| `useSafeMode` | `1` | 目标失效时吞异常并 Kill 那条 tween,不崩 |
| `safeModeOptions.logBehaviour` | `2` | 安全模式捕获时打日志 |
| `timeScale` / `unscaledTimeScale` | `1` / `1` | DOTween 自己的全局倍率 |
| `modules` | ui / sprite / physics / physics2d / audio 开,**tmp 与 uiToolkit 关** | 决定 `Modules/` 里哪些文件参与编译,即热更域有哪些官方扩展;改它是主包改动 |
| `createASMDEF` | `1` | DOTween 编辑器的 ASMDEF 开关,对应 `Modules/` 自成 `DOTween.Modules` 程序集;关掉即热更域引用不到官方扩展 |

`useSafeMode` 的兜底**不复位属性**:被吞掉的那条 tween 停在哪个中间值,目标就留在哪个值。它防崩,不防脏。
