using DG.Tweening;
using UnityEngine;

/// <summary>
/// 入场缩放弹入:先隐藏 <see cref="DefaultDelay"/> 秒(可由 <see cref="Attach"/> 改),再 <see cref="StartScale"/> → <see cref="PeakScale"/> → 1,
/// 播完只销毁自己、不动 GameObject。一律经 <see cref="Attach"/> 创建。
/// </summary>
/// <remarks>
/// 前置延迟让「出现」与宿主的落位动作错开成两个节拍:盘面上是方块格先落定,半秒后图案才弹出来。
/// 延迟期缩放取 0 而非 <see cref="StartScale"/>——延迟是「还没出现」,不是「以小尺寸等着」;
/// 且起始态须在 <see cref="Awake"/> 同步就位,留到第一帧才设则本帧仍以调用方给的满尺寸绘一次,
/// 观感是「先整个出现、下一帧才消失」,恰好是延迟要消除的那一帧。
/// 与 <see cref="ScalePunch"/> 的分工在**起点**:那个从节点原有缩放起,本组件从小于 1 起——
/// 用 punch 做入场会让节点先以满尺寸闪现一帧再被撞。
/// 无 prefab 载体(创建点全是 AddComponent),故手感参数按 ui-patterns「Inspector 公开约定」一律 const;
/// 延迟是唯一按落点分档的量,故改走 <see cref="Attach"/> 入参而非 <c>[SerializeField]</c>。
/// </remarks>
public sealed class ScalePopIn : MonoBehaviour
{
    private const float HiddenScale = 0f;
    private const float StartScale  = 0.6f;
    private const float PeakScale   = 1.15f;
    private const float RiseDur     = 0.2f;
    private const float FallDur     = 0.3f;

    /// <summary>默认前置延迟(秒):宿主落位后隔一拍再弹。</summary>
    public const float DefaultDelay = 0.5f;

    private Sequence _seq;
    private bool _begun;

    /// <summary>
    /// 给 <paramref name="go"/> 挂一发入场弹入。<paramref name="delay"/> 缺省即 <see cref="DefaultDelay"/>;
    /// 落在嘈杂演出里的入场(如盘面消行后补出的新图案)传更大的值,让出现独占一个节拍。
    /// </summary>
    public static ScalePopIn Attach(GameObject go, float delay = DefaultDelay)
    {
        var popIn = go.AddComponent<ScalePopIn>();   // Awake 只把起始态置 0,不起播
        popIn.Begin(delay);
        return popIn;
    }

    private void Awake()
    {
        transform.localScale = Vector3.one * HiddenScale;
    }

    /// <summary>
    /// 起播。<see cref="Attach"/> 在 <c>AddComponent</c> 同帧即调;<see cref="Start"/> 兜底是防有人绕过
    /// <see cref="Attach"/> 直接挂——漏起播的节点缩放停在 0,是个看不见的元素而非报错。
    /// </summary>
    private void Begin(float delay)
    {
        if (_begun) return;
        _begun = true;

        _seq = DOTween.Sequence()
            .AppendInterval(delay)
            .AppendCallback(() => transform.localScale = Vector3.one * StartScale)
            .Append(transform.DOScale(PeakScale, RiseDur).SetEase(Ease.OutCubic))
            .Append(transform.DOScale(1f, FallDur).SetEase(Ease.OutCubic))
            .SetUpdate(true)
            .SetLink(gameObject)
            .OnComplete(() => { _seq = null; Settle(); });
    }

    private void Start() => Begin(DefaultDelay);

    /// <summary>
    /// 节点在演出中途被停用时就地收尾,口径与 <see cref="ScalePunch"/> 同。
    /// 加了前置延迟后这条更要紧:延迟期的节点缩放为 0,留在池里下次取回来是个看不见的元素。
    /// </summary>
    private void OnDisable()
    {
        if (gameObject.activeInHierarchy) return;
        Settle();
    }

    /// <summary>组件被单独 Destroy 时停掉序列(<c>SetLink</c> 只管 GameObject 那一路);只停不复位,口径与 <see cref="ScalePunch"/> 同。</summary>
    private void OnDestroy()
    {
        _seq?.Kill();
        _seq = null;
    }

    private void Settle()
    {
        _seq?.Kill();
        _seq = null;
        transform.localScale = Vector3.one;
        Destroy(this);   // 仅销毁组件，不销毁 GameObject
    }
}
