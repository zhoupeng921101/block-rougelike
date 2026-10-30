using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;
using TEngine;

// TEngine 也有个 Ease 枚举,同时 using 两个命名空间时裸写 Ease 报 CS0104。
using Ease = DG.Tweening.Ease;

/// <summary>
/// 一格方块(盘上的格、托盘里的格、落点虚影共用这一个模板)。皮节点 m_eximg_Skin 绑着战斗图集,按骨牌种类按名取皮图
/// (<see cref="BlockLayout.SkinNameOf"/>);死格不取图、开着 m_DrawOnNull 画成纯色。
/// </summary>
public sealed class BlockPart : MonoBehaviour
{
    [SerializeField] private ExImage m_eximg_Skin = null!;
    [SerializeField] private Image m_img_GhostMark = null!;

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    /// <summary>当前画的样子;死格为 null。只给战斗窗的调试核对与特效取色读。</summary>
    public BlockSkin? Skin { get; private set; }

    /// <summary>格的块色:特效按它染(格爆点、拖尾);死格取死格色。</summary>
    public Color FxColor => Skin.HasValue ? BlockLayout.ColorOf(Skin.Value.Kind) : BlockLayout.DeadCellColor;

    public void SetSkin(BlockSkin skin)
    {
        Skin = skin;
        m_eximg_Skin.SpriteName = BlockLayout.SkinNameOf(skin.Kind);
        m_eximg_Skin.color = skin.Tint;
        m_img_GhostMark.gameObject.SetActive(false);
    }

    /// <summary>死格:盘上的死格皮图(几乎全黑、中间一道裂),不再用纯色块顶。</summary>
    public void SetDead()
    {
        Skin = null;
        m_eximg_Skin.SpriteName = DeadSkinName;
        m_eximg_Skin.color = Color.white;
        m_img_GhostMark.gameObject.SetActive(false);
    }

    /// <summary>死格皮图在战斗图集里的名字(80×80,和方块皮图同一套预放大)。</summary>
    private const string DeadSkinName = "battle_block_dead";

    /// <summary>落点虚影:半透明方砖,四角括号按块色染(效果图 v3A)。</summary>
    public void SetGhost(BlockSkin skin)
    {
        SetSkin(skin);
        SetAlpha(BlockLayout.GhostAlpha);
        m_img_GhostMark.color = BlockLayout.ColorOf(skin.Kind);
        m_img_GhostMark.gameObject.SetActive(true);
    }

    /// <summary>整格半透明。<see cref="SetSkin"/> 会连 alpha 一起覆盖,须在它之后调。</summary>
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

    /// <summary>落子放大的峰值与升段占比,同 <see cref="ScalePunch"/>(峰 1.28,升 0.12、回 0.18)。</summary>
    private const float PunchPeak = 1.28f;
    private const float PunchRiseShare = 0.4f;

    /// <summary>
    /// 落子放大(30 号票,时长取 <see cref="ClearPacing.PlacePunch"/>):放大的是格皮、不是格根,所以和退场(缩格根)叠在一起时两者相乘、不互相覆盖。
    /// 只返回补间,不播、不挂 Link:由结算演出排进它的时间表,跳到终态时随时间表一起到位。
    /// </summary>
    public Sequence PunchTween(float duration)
    {
        Transform skin = m_eximg_Skin.transform;
        return DOTween.Sequence()
            .Append(skin.DOScale(PunchPeak, duration * PunchRiseShare).SetEase(Ease.OutCubic))
            .Append(skin.DOScale(1f, duration * (1f - PunchRiseShare)).SetEase(Ease.OutCubic));
    }

    /// <summary>
    /// 逐格退场(30 号票):格根缩到 <paramref name="endScale"/>、格皮淡出。只返回补间,由结算演出排到这一格那一拍;节点由演出在播完时销毁。
    /// 调用方须先把本格从格表里摘掉(<see cref="BoardCellRenderer.TakeForExit"/>)。
    /// </summary>
    public Sequence ExitTween(float duration, float endScale)
    {
        StopEnter();
        return DOTween.Sequence()
            .Join(transform.DOScale(endScale, duration).SetEase(Ease.InQuad))
            .Join(m_eximg_Skin.DOFade(0f, duration).SetEase(Ease.InQuad));
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
