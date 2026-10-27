# tween-recipes.md — 热更域可编译的现成写法

> **先看有没有现成的**:UI 属性由 DOTween 官方扩展直接提供(`DOFade` / `DOColor` / `DOFillAmount` / `DOAnchorPos` / `DOSizeDelta` 等,清单见 `dotween-api.md` 二节),直接调即可——第一节里官方已覆盖的几条只是实现口径,**不是要你再抄一遍**(同名同签名再写一份即 CS0121);数字滚动、逐字显示与第二节起才是须自己写的形态。每条配方都在 `GameLogic` 程序集里可编译。
>
> 每条都省略了 `SetLink` / `SetUpdate`——**实际写的时候不能省**,理由见 SKILL.md「生命周期:五条静默失效」。

`using DG.Tweening;` + `using UnityEngine.UI;`(TMP 用 `using TMPro;`——TMP 随 ugui 2.x 内置、不是独立 UPM 包,UI 生成器在 `TextMeshPro` 宏下就给生成文件写 `using TMPro;`,热更域直接可用)。

## 一、UI 图形属性(大部分官方扩展已覆盖)

**官方已覆盖的几条不用再抄**(CanvasGroup 淡入淡出、Graphic 的 alpha 与整色、fillAmount、anchoredPosition、sizeDelta)——直接 `cg.DOFade(0f, 0.3f)`、`img.DOFillAmount(1f, 0.5f)`。留着是为了看清每个方法实际在写哪个属性(排查时用),以及给官方没有的属性写包装时有个对齐样板。数字滚动、逐字显示没有现成的,照本节写。

### CanvasGroup 淡入淡出

```csharp
Tween FadeCanvas(CanvasGroup cg, float endAlpha, float duration)
{
    return DOTween.To(() => cg.alpha, v => cg.alpha = v, endAlpha, duration)
        .SetTarget(cg)                   // 设了才能用 cg.DOKill() 批量杀
        .SetUpdate(true)
        .SetLink(cg.gameObject);
}
```

`SetTarget` 是手写 `DOTween.To` 与扩展方法的唯一差别——扩展方法内部帮你设了。不设的后果:`DOKill()` / `DOTween.Kill(cg)` 找不到这条 tween,只能靠字段引用杀。

### Image / Graphic 的 alpha 与颜色

```csharp
// 只改 alpha:走 Color 会连带覆盖 rgb,美术改色后会被动画写回旧色
Tween FadeGraphic(Graphic g, float endAlpha, float duration)
{
    return DOTween.To(() => g.color.a, v =>
    {
        Color c = g.color;
        c.a = v;
        g.color = c;
    }, endAlpha, duration).SetTarget(g);
}

// 整色补间
Tween TintGraphic(Graphic g, Color endColor, float duration)
{
    return DOTween.To(() => g.color, v => g.color = v, endColor, duration).SetTarget(g);
}
```

### Image.fillAmount(进度条)

```csharp
Tween FillTo(Image img, float endFill, float duration)
{
    return DOTween.To(() => img.fillAmount, v => img.fillAmount = v, endFill, duration)
        .SetEase(Ease.OutQuad)
        .SetTarget(img);
}
```

进度条会被连续刷新时,**每次刷新前先 `img.DOKill()`**,否则前一条还在往旧终点爬。

### RectTransform.anchoredPosition(位移)

```csharp
Tween MoveAnchored(RectTransform rt, Vector2 endPos, float duration)
{
    return DOTween.To(() => rt.anchoredPosition, v => rt.anchoredPosition = v, endPos, duration)
        .SetEase(Ease.OutCubic)
        .SetTarget(rt);
}
```

### RectTransform.sizeDelta(尺寸)

```csharp
Tween ResizeTo(RectTransform rt, Vector2 endSize, float duration)
{
    return DOTween.To(() => rt.sizeDelta, v => rt.sizeDelta = v, endSize, duration).SetTarget(rt);
}
```

节点在 `LayoutGroup` 下时不要动 `sizeDelta`,布局会每帧写回去;改用 `LayoutElement` 的尺寸(官方 `DOPreferredSize` / `DOMinSize` / `DOFlexibleSize`)。

### 数字滚动

```csharp
// 整数计数:用 int 版避免小数抖动
Tween CountTo(Text label, int from, int to, float duration)
{
    int shown = from;
    return DOTween.To(() => shown, v =>
    {
        shown = v;
        label.text = v.ToString();
    }, to, duration).SetEase(Ease.OutQuad).SetTarget(label);
}
```

`TMP_Text` 同理换类型即可——**TMP 没有专用的 DOTween 模块**(`textMeshProEnabled: 0`,`Modules/` 下无 TMP 文件),颜色与 alpha 之外的文字动画全靠这条路子。

### 逐字显示

```csharp
Tween RevealText(TMP_Text label, string full, float duration)
{
    label.text = full;
    label.maxVisibleCharacters = 0;
    return DOTween.To(() => label.maxVisibleCharacters, v => label.maxVisibleCharacters = v,
            full.Length, duration)
        .SetEase(Ease.Linear)
        .SetTarget(label);
}
```

走 `maxVisibleCharacters` 而非切字符串:不重排版、不产生 string 垃圾。

## 二、编排与等待

### 等一条 tween 播完(await)

工程没有 UniTask-DOTween 桥接(见 SKILL.md「硬边界」),按工程既有形态自己搭:

```csharp
private UniTask PlayAndWait(Tween tween, CancellationToken token)
{
    var tcs = new UniTaskCompletionSource();
    tween.OnComplete(() => tcs.TrySetResult())
         .OnKill(() => tcs.TrySetResult());     // 被 Kill 时也要放行,否则调用方永远挂着
    token.Register(() => tween.Kill());
    return tcs.Task;
}
```

窗里调用传 `LifetimeToken`(`UIPanelMono` 的基类属性,窗销毁时 Cancel)。`OnKill` 那一句不可省:`SetLink` 触发的 Kill、目标被销毁触发的 safeMode Kill 都走不到 `OnComplete`。

### 序列:多段有节拍

```csharp
Sequence seq = DOTween.Sequence()
    .Append(icon.DOScale(1.3f, 0.12f).SetEase(Ease.OutBack))
    .Join(FadeGraphic(glow, 1f, 0.12f))          // 与上一段同时开始
    .AppendInterval(0.05f)
    .Append(icon.DOScale(1f, 0.15f))
    .OnComplete(() => Destroy(glow.gameObject))
    .SetUpdate(true)
    .SetLink(gameObject);
```

`SetUpdate` / `SetLink` 加在 Sequence 上即可,**不必给每个子 tween 各加一遍**;但子 tween 自己的 `SetEase` 要各写各的。

### 批量错峰(一批格子依次弹)

```csharp
Sequence seq = DOTween.Sequence().SetUpdate(true).SetLink(gameObject);
for (int i = 0; i < cells.Count; i++)
{
    seq.Insert(i * 0.03f, cells[i].transform.DOPunchScale(Vector3.one * 0.2f, 0.25f));
}
```

`Insert` 按绝对时间点排,一条 Sequence 装完全部;比循环里各建一条独立 tween 少一批对象,也只需一次 `SetLink`。棋盘级规模(几十上百)仍优先复用既有 VFX 件,见 SKILL.md「批量场景」。

## 三、接进工程既定时机

### 窗口入场动画

```csharp
using System;
using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>窗根缩放弹入。挂在窗根 prefab 上,由 UIPanelMono.InternalPlayOpenAnim 调 Play。</summary>
internal sealed class WindowScaleInTween : UIWindowOpenAnim
{
    private const float StartScale = 0.6f;
    private const float Duration   = 0.25f;

    private Tween _tween;

    public override void Play()
    {
        // 重入:窗被重复 ShowUIAsync 置顶时本方法会再进一次,先杀旧的再从头起
        _tween?.Kill();

        transform.localScale = Vector3.one * StartScale;
        _tween = transform.DOScale(1f, Duration)
            .SetEase(Ease.OutBack)
            .SetUpdate(true)
            .SetLink(gameObject)
            .OnKill(() => _tween = null);
    }

    // 基类的另一个抽象成员:立即收尾到终态。没在播则什么都不做。
    public override void Finish()
    {
        if (_tween == null) return;
        _tween.Kill();
        transform.localScale = Vector3.one;
    }

    // 入场没播完就关窗:先停掉自己的入场,再交给基类的通用退场;不停的话两条 tween 同时写 localScale。
    public override float PlayExit(Graphic mask, Action onDone)
    {
        Finish();
        return base.PlayExit(mask, onDone);
    }

    private void OnDestroy()
    {
        _tween?.Kill();
    }
}
```

`UIWindowOpenAnim` 有两个抽象成员 `Play()` 与 `Finish()`,少实现一个编译不过;退场 `PlayExit` 有默认实现(通用弹窗退场),但默认实现不认识子类自己的入场 tween,所以要像上面那样先 `Finish()`。

挂了本组件的窗**不再播弹窗层默认的 `WindowPopIn`**(prefab 挂载优先于层默认),不会叠成两层缩放。层默认那套还负责遮罩淡入与反向缩放补偿,自己写入场时要不要补上遮罩处理,看窗有没有全屏遮罩——照抄 `WindowPopIn` 的遮罩段之前先读它的类注释,那里论证了为什么遮罩要反向补偿。

### 按钮点击反馈

```csharp
// 生成器产出的 partial 方法里
private void OnClick_ConfirmBtn()
{
    m_btn_Confirm.transform.DOKill();                       // 连点保护:杀掉上一次
    m_btn_Confirm.transform.localScale = Vector3.one;
    m_btn_Confirm.transform.DOPunchScale(Vector3.one * 0.12f, 0.2f, 8, 0.6f)
        .SetUpdate(true)
        .SetLink(m_btn_Confirm.gameObject);

    // 业务逻辑照常
}
```

本作还没有现成的 punch 件(block-client 的 `ScalePunch` 未搬入)。同一手感要在多处用时,把本例收成一个 `UI/VFX/` 件再各处调,别每个按钮各抄一份。

### 对象池 / 会被隐藏的节点

```csharp
// 列表项、池化件:节点隐藏时 tween 必须停,否则隐藏期间继续写值,复用时带脏值出场
tween.SetLink(gameObject, LinkBehaviour.KillOnDisable);

// 并在重绘入口无条件复位,不依赖上一次收没收干净
private void Redraw(ItemData data)
{
    transform.DOKill();
    transform.localScale = Vector3.one;
    canvasGroup.alpha = 1f;
    // ...填数据
}
```

## 四、循环与常驻

```csharp
// 呼吸:无限往复。持字段,不用时 Kill——SetLoops(-1) 的 tween 永不自杀
_breathTween = transform.DOScale(1.06f, 0.8f)
    .SetEase(Ease.InOutSine)
    .SetLoops(-1, LoopType.Yoyo)
    .SetUpdate(true)
    .SetLink(gameObject);
```

无限循环的 `OnComplete` 永不触发,每轮结束要做事用 `OnStepComplete`。本作还没有现成的呼吸件,同一手感要多处用时同上收成 `UI/VFX/` 件。

## 五、纯数值 / 延时

```csharp
// 不绑目标属性的插值(自定义每帧处理)
DOVirtual.Float(0f, 1f, 0.5f, t => material.SetFloat(DissolveId, t)).SetLink(gameObject);

// 延时回调:ignoreTimeScale 默认 true,不必再 SetUpdate
DOVirtual.DelayedCall(0.3f, () => ShowResult()).SetLink(gameObject);
```

`DelayedCall` 与工程既有的 `GameModule.Timer` / `UniTask.Delay` 是三条并行路子:**已在异步方法里就用 `UniTask.Delay(..., cancellationToken: LifetimeToken)`**,别为一个延时引入 tween;只有延时是某段 tween 编排的一环时才用 `DelayedCall`(或直接 `AppendInterval`)。
