using System.Collections.Generic;
using DragonBones;
using TEngine;
using UnityEngine;

// DragonBones 也有一个 Transform 类型,不消歧则本文件里的 Transform 参数全是二义引用。
using Transform = UnityEngine.Transform;

/// <summary>
/// DragonBones 骨骼特效的一次性播放器(摘自动物乐园 GameBase/UI/VFX/DragonBoneFx,32 号票):取一份实例 → 播一遍指定动画 → 播完收回池里。
/// 模板走宿主序列化引用(<see cref="BattleFxAssets"/>),不经按名预载;倍速由调用方给(<see cref="ClearPacing.Speed"/>)。
/// </summary>
/// <remarks>
/// 预制上的 <see cref="UnityArmatureComponent"/> 在 Awake 里自建骨架并注册进 DragonBones 时钟,推进由运行时承担,本类只负责定位与回收。
/// 播完按模板分池收回(隐藏、留在原父节点下)而不销毁:消行光束 db_xc 一份 337 个节点,每发新建在编辑器里约 25ms。
/// 池随父节点一起销毁,取用时跳过已销毁的。自毁按动画时长计时,不监听完成事件:该库的事件在骨架被销毁时不保证还能回调。
/// </remarks>
public sealed class DragonBoneFx : MonoBehaviour
{
    // 动画时长之外的余量,盖住最后一帧的渲染与合批延迟。
    private const float TailPadding = 0.15f;

    // 取不到动画时长时的兜底寿命,只为保证节点不会长驻。
    private const float FallbackLife = 1.5f;

    /// <summary>每种模板最多留几份空闲实例;同屏并发超过的那几份播完即销毁。</summary>
    private const int PoolCapPerPrefab = 8;

    /// <summary>模板 → 空闲实例。</summary>
    private static readonly Dictionary<GameObject, Stack<DragonBoneFx>> Pool = new Dictionary<GameObject, Stack<DragonBoneFx>>();

    private GameObject _template;
    private UnityArmatureComponent _comp;

    /// <summary>预制自带的倍速。每发按它乘本次倍速,复用时不在上一发的倍速上越乘越快。</summary>
    private float _baseTimeScale = 1f;

    private float _life;
    private float _t;

    /// <summary>本发特效的动画时长(秒,已折倍速),不含回收余量;取不到时长时是 <see cref="FallbackLife"/>。</summary>
    public float AnimLength { get; private set; }

    /// <summary>缩放后素材在 parent 本地单位下的高度(= 骨架 aabb 高 × 实际缩放)。位移编排要让素材完整进出某个区域时取它。</summary>
    public float FitHeight { get; private set; }

    /// <summary>
    /// 播一发,缩放按「素材该对齐的部分铺到 <paramref name="targetWidth"/> 宽」自适应:素材 aabb 普遍大于实际内容且每套比例不同,
    /// 差异由预制上的 <see cref="DragonBoneFxFit"/> 承担(没挂按 aabb 直接铺)。模板为空、动画名不存在、骨架未建出时返回 null(各记一条 Warning)。
    /// </summary>
    /// <param name="localPos">相对 parent 矩形中心的位置(anchor 居中的 anchoredPosition),不是相对 pivot。</param>
    /// <param name="targetWidth">目标宽度(parent 本地单位)。转 ±90 度时传的仍是转前的横向跨度。</param>
    /// <param name="angle">Z 轴角度,逆时针为正。</param>
    /// <param name="speed">播放倍速,乘在预制自带的倍速上。</param>
    public static DragonBoneFx SpawnFitWidth(Transform parent, GameObject template, string animName,
                                             Vector2 localPos, float targetWidth, float angle = 0f, float speed = 1f)
    {
        var fx = Acquire(parent, template);
        if (fx == null) return null;

        var anim = fx._comp.armature.animation;
        if (!anim.HasAnimation(animName))
        {
            Log.Warning($"[DragonBoneFx] 预制 '{template.name}' 没有动画 '{animName}'。");
            fx.Release();
            return null;
        }

        float scale = 1f;
        float span = fx._comp.armature.armatureData.aabb.width;
        if (span > 0.0001f && targetWidth > 0f)
        {
            var fit = fx.GetComponent<DragonBoneFxFit>();
            scale = targetWidth * (fit != null ? fit.WidthScaleFor(animName) : 1f) / span;
        }
        Place(fx.transform, parent, localPos, scale, angle);

        anim.timeScale = fx._baseTimeScale * (speed > 0f ? speed : 1f);
        anim.Play(animName, 1);
        // 复用的实例还停在上一发的末帧:当帧把姿态推到第 0 帧,不让旧画面露一帧。
        fx._comp.armature.AdvanceTime(0f);

        var state = anim.GetState(animName);
        float life = state != null && state.totalTime > 0f ? state.totalTime / anim.timeScale : FallbackLife;
        fx._t = 0f;
        fx._life = life + TailPadding;
        fx.AnimLength = life;
        fx.FitHeight = fx._comp.armature.armatureData.aabb.height * scale;
        return fx;
    }

    /// <summary>取一份可用实例:优先池里的空闲份(挪到 parent 下、置顶、显示),没有再新建。失败返回 null(已记 Warning)。</summary>
    private static DragonBoneFx Acquire(Transform parent, GameObject template)
    {
        if (template == null)
        {
            Log.Warning("[DragonBoneFx] 模板引用为空,骨骼特效未播放。检查战斗窗上的 BattleFxAssets。");
            return null;
        }
        var stack = StackOf(template);
        while (stack.Count > 0)
        {
            var fx = stack.Pop();
            if (fx == null) continue;   // 随原父节点一起销毁了
            if (fx.transform.parent != parent) fx.transform.SetParent(parent, false);
            fx.transform.SetAsLastSibling();
            fx.gameObject.SetActive(true);
            return fx;
        }
        return Create(parent, template);
    }

    private static DragonBoneFx Create(Transform parent, GameObject template)
    {
        var go = Object.Instantiate(template, parent);
        var comp = go.GetComponent<UnityArmatureComponent>();
        if (comp == null || comp.armature == null)
        {
            // 骨架没建出来多半是预制上的 unityData 或 textureAtlas 断了,别静默吃掉。
            Log.Warning($"[DragonBoneFx] 预制 '{template.name}' 的骨架未建出,检查其 UnityDragonBonesData 的 textureAtlas 引用是否完整。");
            Object.Destroy(go);
            return null;
        }

        // 骨架的 UGUI 显示层是 MaskableGraphic,默认吃射线;盘面级特效播一两秒,不关就是这段时间拖不到块。
        foreach (var g in go.GetComponentsInChildren<UnityEngine.UI.MaskableGraphic>(true)) g.raycastTarget = false;

        var fx = go.AddComponent<DragonBoneFx>();
        fx._template = template;
        fx._comp = comp;
        fx._baseTimeScale = comp.armature.animation.timeScale;
        return fx;
    }

    private static void Place(Transform t, Transform parent, Vector2 localPos, float scale, float angle)
    {
        t.localScale = Vector3.one * scale;
        t.localRotation = Quaternion.Euler(0f, 0f, angle);
        // 原点 = 父层矩形中心,与父层 pivot 无关
        if (t is RectTransform rt)
        {
            rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition3D = localPos;
        }
        else
        {
            // 过半 db_* 预制的根是普通 Transform,不能强转;按父层矩形中心换算成 pivot 原点,结果与上一支等价。
            Vector2 center = parent is RectTransform parentRect ? parentRect.rect.center : Vector2.zero;
            t.localPosition = center + localPos;
        }
    }

    private static Stack<DragonBoneFx> StackOf(GameObject template)
    {
        if (!Pool.TryGetValue(template, out var stack))
        {
            stack = new Stack<DragonBoneFx>();
            Pool[template] = stack;
        }
        return stack;
    }

    /// <summary>收回池里(隐藏、留在原父节点下);该模板空闲份已满则销毁。</summary>
    private void Release()
    {
        var stack = StackOf(_template);
        if (stack.Count >= PoolCapPerPrefab)
        {
            Object.Destroy(gameObject);
            return;
        }
        gameObject.SetActive(false);
        stack.Push(this);
    }

    private void Update()
    {
        _t += Time.deltaTime;   // 与 DragonBones 时钟同一个时间源
        if (_t >= _life) Release();
    }
}
