using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;
using TEngine;

// TEngine 也有个 Ease 枚举,同时 using 两个命名空间时裸写 Ease 报 CS0104。
using Ease = DG.Tweening.Ease;

/// <summary>
/// 一格方块(盘上的格、托盘里的格、落点虚影共用这一个模板)。本图是占位色块:prefab 上的 ExImage 不带图、开着 m_DrawOnNull,
/// 颜色由调用方按骨牌种类给(<see cref="BlockLayout.ColorOf"/>)。正式美术来了再按名换图。
/// </summary>
public sealed class BlockPart : MonoBehaviour
{
    [SerializeField] private ExImage m_eximg_Skin = null!;

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    /// <summary>格色(含 alpha)。置灰、虚影都经它或 <see cref="SetAlpha"/> 改。</summary>
    public void SetColor(Color color)
    {
        m_eximg_Skin.color = color;
    }

    /// <summary>当前格色。只给战斗窗的调试核对读。</summary>
    public Color Color => m_eximg_Skin.color;

    /// <summary>整格半透明(落点虚影用)。<see cref="SetColor"/> 会连 alpha 一起覆盖,须在它之后调。</summary>
    public void SetAlpha(float alpha)
    {
        var c = m_eximg_Skin.color;
        c.a = alpha;
        m_eximg_Skin.color = c;
    }

    /// <summary>对格底块做一次轻微放大反馈（落子命中该格时调用）。已在播则本次忽略,见 <see cref="ScalePunch.Play"/>。</summary>
    public void Punch()
    {
        ScalePunch.Play(gameObject);
    }

    /// <summary>
    /// 消行预览的提亮上浮:换上提亮材质并放大到 <paramref name="scale"/>;<paramref name="brighten"/> 传 null、scale 传 1 即复原。
    /// 提亮材质取不到(shader 未预载)时只上浮。
    /// </summary>
    public void SetHighlight(Material brighten, float scale)
    {
        StopEnter();   // 入场途中被拖到预告里:以预告的缩放为准,不再被入场补间改回去
        m_eximg_Skin.material = brighten;
        transform.localScale = Vector3.one * scale;
    }

    /// <summary>入场弹入的时长(秒,实际值):OutBack 带一点过冲,读成「落定」。</summary>
    private const float EnterDur = 0.18f;

    private Tween _enter;

    /// <summary>入场:先藏成 0,等 <paramref name="delay"/> 秒再弹到原大(整盘重铺时逐格错峰调用)。</summary>
    public void PlayEnter(float delay)
    {
        StopEnter();
        transform.localScale = Vector3.zero;
        _enter = transform.DOScale(1f, EnterDur)
            .SetEase(Ease.OutBack)
            .SetDelay(delay)
            .SetUpdate(true)
            .SetLink(gameObject)
            .OnKill(() => _enter = null);
    }

    /// <summary>停掉在途的入场并复位到原大。</summary>
    private void StopEnter()
    {
        if (_enter == null) return;
        _enter.Kill();
        transform.localScale = Vector3.one;
    }

    /// <summary>
    /// 退场:等 <paramref name="delay"/> 秒后缩到 <paramref name="endScale"/> 并淡出,播完(或被杀)销毁自身节点。
    /// 调用方须先把本格从格表里摘掉,退场中的节点不再参与任何格同步。
    /// </summary>
    public void PlayExit(float duration, float endScale, float delay = 0f)
    {
        // 补满行的那一手当帧刚挂上撞击反馈:它是绝对赋值 localScale,不当场停掉会与退场缩放互相覆盖。
        var punch = GetComponent<ScalePunch>();
        if (punch != null) DestroyImmediate(punch);
        // 入场还没弹完就被消掉(重铺后极快的一手):从原大起退,不留在半途的缩放上。
        StopEnter();

        DOTween.Sequence()
            .Join(transform.DOScale(endScale, duration).SetEase(Ease.InQuad))
            .Join(m_eximg_Skin.DOFade(0f, duration).SetEase(Ease.InQuad))
            .SetDelay(delay)
            .SetUpdate(true)
            .SetLink(gameObject)
            .OnKill(() => { if (this != null) Destroy(gameObject); });
    }
}
