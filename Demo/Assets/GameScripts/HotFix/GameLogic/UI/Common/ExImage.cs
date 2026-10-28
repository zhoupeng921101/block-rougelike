using System.Threading;
using UnityEngine;
using UnityEngine.U2D;
using UnityEngine.UI;
using TEngine;

/// <summary>
/// SpriteAtlas v2 驱动的 Image 子类：按 sprite 名从图集取图渲染。
/// GetSprite 返回的是图集内部新建的 sprite clone，必须在切名/销毁时 Destroy，否则泄漏 Sprite 对象。
///
/// 按名取图分两级：先查本节点绑的 <see cref="Atlas"/>，没有再查 <see cref="SharedAtlas"/>。
/// 两级存在的理由见 <see cref="SharedAtlas"/>。
/// </summary>
[AddComponentMenu("UI/ExImage", 30)]
public class ExImage : Image
{
    /// <summary>sprite 为空时是否仍按 Image 默认网格绘制（false 则清空网格不绘制）。</summary>
    public bool m_DrawOnNull;

    /// <summary>切图后是否把 RectTransform 尺寸调整为 sprite 像素尺寸。</summary>
    public bool m_AdaptiveSize;

    [SerializeField]
    public SpriteAtlas spriteAtlas;

    /// <summary>GetSprite 返回的运行期 clone，生命周期由本组件负责销毁。</summary>
    private Sprite mSpriteClone;

    // 当前图是按哪个名从图集取来的，仅供 SpriteName setter 运行时去重（同名早返，避免重复克隆图集 sprite）。
    // null = 当前图不是按名取的（prefab 的 Source Image，或 SetSpriteDirect 直给），此时任何赋值都不去重。
    // 初值不能是空串：否则新实例首次设空名被当成同名吞掉，prefab 上的占位图就留在画面上。
    // 不序列化：无加载期应用钩子，序列化值对渲染无效；且非空序列化值会令 setter 早返、吞掉运行时首次赋值。
    // 静态图走 Source Image 直接拖；运行时动态图走 SpriteName 按名从图集换。
    private string nowSpriteName;

    // 本节点在途异步换图的取消源(见 BeginAsyncLoad)。框架加载完成时直接写 Image.sprite、不经本类,
    // 不持有它,同步换图就拦不住晚到的那张图。
    private CancellationTokenSource mAsyncLoadCts;

    public SpriteAtlas Atlas
    {
        get => spriteAtlas;
        set => spriteAtlas = value;
    }

    /// <summary>
    /// 全局备用图集：按名在本节点图集里取不到图时回退到这里取。由 <c>UIPreloader</c> 预载完成后装入。
    ///
    /// 解决的是「同一个节点要显示分属两个图集的图」——奖励格 / 背包格 / 订单卡的图标节点既画道具
    /// （<c>Atlas_ItemIcon</c>，绑在节点上）又画货币（正源图在 <c>NewAtlas_item</c>），而格子是复用的，
    /// 按内容改写节点的 <see cref="Atlas"/> 会把原图集丢掉、下一次画道具就取不到图。故本级不改节点绑定，只作回退。
    ///
    /// 静态而非序列化字段：回退面覆盖散布在多个 prefab 的十几个图标节点，逐个绑漏一个就是那一处空图。
    /// 未装入（null）时行为与只有一级完全相同。
    /// </summary>
    public static SpriteAtlas SharedAtlas { get; set; }

    /// <summary>
    /// 按名从图集换图。空名（含 null）= 无图：不论当前图来自按名、Source Image 还是 <see cref="SetSpriteDirect"/>，一律清掉。
    /// 读取返回最近一次按名换图的名字；当前图不是按名取来的时返回空串。
    /// </summary>
    public string SpriteName
    {
        get => nowSpriteName ?? string.Empty;
        set
        {
            // null 是记名的「非按名」哨兵，不能让调用方写进去。
            if (value == null) value = string.Empty;
            // 先于同名早返:记名相同不代表没有在途加载(清图后又发起过一次异步换图时记名仍是空串)。
            CancelAsyncLoad();
            if (nowSpriteName == value)
            {
                return;
            }

            // 清图用不到图集，空名不受下面的图集检查拦：图集漏配的节点设空名同样得是无图。
            // 两级图集都没有才算漏配：只挂全局备用图集的节点（不绑 Atlas）照样能按名取图。
            if (value.Length > 0 && Atlas == null && SharedAtlas == null)
            {
                // 没配图集却按名换图 = prefab 漏项。静默早返时画面停在 Source Image 的静态占位，
                // 表现与「代码压根没写换图」无从区分，只能靠肉眼比对发现（订单卡收集项图标即因此长期不随类型变化）。
                ReportOnce($"[ExImage] 节点 {NodePath(transform)} 未配 Sprite Atlas，按名换图（{value}）不生效，图停在 Source Image。请在该组件的 Inspector 上补 Sprite Atlas。");
                return;
            }

            nowSpriteName = value;

            if (mSpriteClone != null)
            {
                DestroyClone(mSpriteClone);
                mSpriteClone = null;
                sprite = null;
            }

            mSpriteClone = string.IsNullOrEmpty(nowSpriteName) ? null : GetSprite(nowSpriteName);
            if (mSpriteClone == null && !string.IsNullOrEmpty(nowSpriteName))
            {
                // 图集配了但不含这个名:同样只表现为「图没换」,不报就查不出是名字错还是图没进图集。
                // 两级图集都点名:漏在哪一级要能从日志直接读出来,否则只知道"没这个名"、不知道该往哪个图集补图。
                ReportOnce($"[ExImage] 节点 {NodePath(transform)} 按名取图失败:图集 {AtlasNameOf(Atlas)}"
                    + $" 与全局备用图集 {AtlasNameOf(SharedAtlas)} 里都没有名为「{nowSpriteName}」的 sprite。");
            }

            sprite = mSpriteClone;
            AdaptiveImageSize(m_AdaptiveSize);
        }
    }

    /// <summary>本组件是否已报过换图失败：每个组件只报一次，避免逐帧重绘把同一条配置错误刷满控制台。</summary>
    private bool mMissReported;

    /// <summary>报一次换图失败（同一组件后续失败不再报，配置错误改完重进即复位）。</summary>
    private void ReportOnce(string message)
    {
        if (mMissReported) return;
        mMissReported = true;
        Log.Error(message);
    }

    /// <summary>节点的层级路径（同名节点遍布各卡，只给节点名定位不到是哪一个）。只在报错时拼，常态零开销。</summary>
    private static string NodePath(Transform node)
    {
        var path = new System.Text.StringBuilder(node.name);
        for (var p = node.parent; p != null; p = p.parent)
        {
            path.Insert(0, "/").Insert(0, p.name);
        }
        return path.ToString();
    }

    /// <summary>
    /// 直接指定 sprite，不经图集按名寻址：供「图不在本组件图集里、由调用方持有引用」的固定图使用
    /// （同一组件此后仍可改用 <see cref="SpriteName"/> 换图）。
    /// 先释放按名取得的 clone 并把记名置为「非按名」，否则 clone 泄漏、且下一次赋值（同名或空名）会被去重早退、图换不过来。
    /// </summary>
    public void SetSpriteDirect(Sprite value)
    {
        CancelAsyncLoad();
        if (mSpriteClone != null)
        {
            DestroyClone(mSpriteClone);
            mSpriteClone = null;
        }

        nowSpriteName = null;
        sprite = value;
        AdaptiveImageSize(m_AdaptiveSize);
    }

    /// <summary>
    /// 按名试取图集图：取到则换图返回 true；取不到返回 false，不报错，当前图与记名都不动。
    /// 供名字未必是图集子图的调用方先试、失败再走别的来源（<see cref="SpriteBind"/>）；确定是图集名的仍用 <see cref="SpriteName"/>，取不到要报错。
    /// </summary>
    public bool TrySetSpriteName(string spriteName)
    {
        if (string.IsNullOrEmpty(spriteName))
        {
            return false;
        }

        if (mSpriteClone != null && nowSpriteName == spriteName)
        {
            CancelAsyncLoad();
            return true;
        }

        var clone = GetSprite(spriteName);
        if (clone == null)
        {
            return false;
        }

        CancelAsyncLoad();

        if (mSpriteClone != null)
        {
            DestroyClone(mSpriteClone);
        }

        mSpriteClone = clone;
        nowSpriteName = spriteName;
        sprite = clone;
        AdaptiveImageSize(m_AdaptiveSize);
        return true;
    }

    /// <summary>
    /// 登记一次即将发起的异步换图(框架 <c>SetSprite</c>),返回这次加载该用的取消令牌。此后本节点任何一次换图——
    /// <see cref="SpriteName"/>、<see cref="TrySetSpriteName"/> 取到图、<see cref="SetSpriteDirect"/> 或下一次登记——
    /// 以及节点销毁都会取消它,晚到的图不会盖掉后换上的图。<paramref name="outer"/> 取消时同样取消。
    /// 对本节点直接调框架 <c>SetSprite</c> 而不经这里登记的加载不受保护。
    /// </summary>
    public CancellationToken BeginAsyncLoad(CancellationToken outer = default)
    {
        CancelAsyncLoad();
        mAsyncLoadCts = outer.CanBeCanceled ? CancellationTokenSource.CreateLinkedTokenSource(outer) : new CancellationTokenSource();
        return mAsyncLoadCts.Token;
    }

    private void CancelAsyncLoad()
    {
        if (mAsyncLoadCts == null)
        {
            return;
        }

        // 先摘再取消:Cancel 会同步跑完加载方的收尾,其间若再进到本类,不能看到一个已取消的源。
        var cts = mAsyncLoadCts;
        mAsyncLoadCts = null;
        cts.Cancel();
        cts.Dispose();
    }

    /// <summary>两级图集名（本节点 / 全局备用），供按名取图失败时报错点名。</summary>
    public string AtlasNames => $"{AtlasNameOf(Atlas)} 与全局备用图集 {AtlasNameOf(SharedAtlas)}";

    public int width
    {
        get => (int)rectTransform.sizeDelta.x;
        set => rectTransform.sizeDelta = new Vector2(value, rectTransform.sizeDelta.y);
    }

    public int height
    {
        get => (int)rectTransform.sizeDelta.y;
        set => rectTransform.sizeDelta = new Vector2(rectTransform.sizeDelta.x, value);
    }

    public float alpha
    {
        get => color.a;
        set
        {
            if (!value.Equals(color.a))
            {
                Color c = color;
                c.a = value;
                color = c;
            }
        }
    }

    /// <summary>
    /// 按名取图集 sprite clone:先本节点图集,取不到再回退 <see cref="SharedAtlas"/>。
    /// 两图集都有同名 sprite 时本节点图集优先——节点绑的那个是它本职要画的那套图。
    /// </summary>
    private Sprite GetSprite(string spriteName)
    {
        if (spriteName == string.Empty)
        {
            return null;
        }

        var sprite = Atlas != null ? Atlas.GetSprite(spriteName) : null;
        if (sprite == null && SharedAtlas != null && SharedAtlas != Atlas)
        {
            sprite = SharedAtlas.GetSprite(spriteName);
        }

        return sprite;
    }

    /// <summary>取图集名用于报错;未配图集时给出可读占位,不让报错本身抛 NRE。</summary>
    private static string AtlasNameOf(SpriteAtlas atlas) => atlas != null ? atlas.name : "(未配)";

    protected override void OnPopulateMesh(VertexHelper toFill)
    {
        if (sprite == null || overrideSprite == null)
        {
            if (m_DrawOnNull)
            {
                base.OnPopulateMesh(toFill);
            }
            else
            {
                toFill.Clear();
            }
        }
        else
        {
            base.OnPopulateMesh(toFill);
        }
    }

    public void AdaptiveImageSize(bool outsize = false)
    {
        m_AdaptiveSize = outsize;
        if (sprite != null && m_AdaptiveSize)
        {
            Rect rect = sprite.rect;
            width = (int)rect.width;
            height = (int)rect.height;
        }
    }

    protected override void OnDestroy()
    {
        base.OnDestroy();
        CancelAsyncLoad();
        if (mSpriteClone != null)
        {
            DestroyClone(mSpriteClone);
        }
    }

    /// <summary>
    /// 销毁 GetSprite 返回的 sprite clone。运行时(播放态)走 <see cref="Object.Destroy(Object)"/>,行为不变;
    /// 编辑模式(非播放,如编辑器工具 / 预览下实例化本组件)走 <see cref="Object.DestroyImmediate(Object)"/>——
    /// 编辑模式不能调 Destroy,否则报「Destroy may not be called from edit mode」且 clone 泄漏。clone 非磁盘资产,DestroyImmediate 可直接销毁。
    /// </summary>
    private static void DestroyClone(Object clone)
    {
        if (Application.isPlaying)
        {
            Destroy(clone);
        }
        else
        {
            DestroyImmediate(clone);
        }
    }
}
