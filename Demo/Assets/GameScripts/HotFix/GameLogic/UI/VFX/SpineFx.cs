using Spine.Unity;
using TEngine;
using UnityEngine;

/// <summary>
/// Spine 骨骼特效的一次性播放器(摘自动物乐园 GameBase/UI/VFX/SpineFx,32 号票):实例化模板 → 播一遍指定动画 → 播完自毁。形态同 <see cref="DragonBoneFx"/>。
/// </summary>
/// <remarks>
/// 预制根是 UGUI 的 <see cref="SkeletonGraphic"/>,材质须是打开 <c>_StraightAlphaInput</c> 的 Spine/SkeletonGraphic
/// (素材图集是直通 alpha,按预乘混合会把图集透明边距画成亮块)。自毁按动画时长计时,不监听完成事件。
/// </remarks>
public sealed class SpineFx : MonoBehaviour
{
    // 动画时长之外的余量,盖住最后一帧的渲染延迟。
    private const float TailPadding = 0.15f;

    private float _life;
    private float _t;

    /// <summary>
    /// 播一发,缩放使素材的 <paramref name="contentWidth"/>(骨架像素)铺到 <paramref name="targetWidth"/>(parent 本地单位)。
    /// 模板为空、骨架未建出、动画名不存在时返回 null 并记一条 Warning。
    /// </summary>
    /// <param name="localPos">相对 parent 矩形中心的位置(anchor 居中的 anchoredPosition)。</param>
    /// <param name="contentWidth">素材里「该对齐的那一部分」的骨架像素宽,各素材不同。</param>
    /// <param name="speed">播放倍速,乘在预制自带的倍速上。</param>
    public static GameObject SpawnFitWidth(Transform parent, GameObject template, string animName,
                                           Vector2 localPos, float targetWidth, float contentWidth, float speed = 1f)
    {
        if (template == null)
        {
            Log.Warning("[SpineFx] 模板引用为空,特效未播放。检查战斗窗上的 BattleFxAssets。");
            return null;
        }
        var go = Object.Instantiate(template, parent);
        var graphic = go.GetComponent<SkeletonGraphic>();
        if (graphic == null || !graphic.IsValid)
        {
            Log.Warning($"[SpineFx] 预制 '{template.name}' 的骨架未建出,检查其 SkeletonGraphic 的 SkeletonDataAsset 引用。");
            Object.Destroy(go);
            return null;
        }

        var anim = graphic.Skeleton.Data.FindAnimation(animName);
        if (anim == null)
        {
            Log.Warning($"[SpineFx] 预制 '{template.name}' 没有动画 '{animName}'。");
            Object.Destroy(go);
            return null;
        }

        // 顶点按「骨架像素 × SkeletonDataAsset.scale × Canvas.referencePixelsPerUnit」生成,折回骨架像素才能按内容宽缩放。
        float unitPerPixel = graphic.skeletonDataAsset.scale
                             * (graphic.canvas != null ? graphic.canvas.referencePixelsPerUnit : 100f);
        float scale = contentWidth > 0.0001f && unitPerPixel > 0.0001f ? targetWidth / (contentWidth * unitPerPixel) : 1f;

        var t = graphic.rectTransform;
        t.localScale = Vector3.one * scale;
        t.localRotation = Quaternion.identity;
        t.anchorMin = t.anchorMax = new Vector2(0.5f, 0.5f);
        t.anchoredPosition3D = localPos;
        graphic.raycastTarget = false;

        if (speed > 0f) graphic.timeScale *= speed;
        graphic.AnimationState.SetAnimation(0, anim, false);

        var fx = go.AddComponent<SpineFx>();
        fx._life = anim.Duration / graphic.timeScale + TailPadding;
        return go;
    }

    private void Update()
    {
        _t += Time.deltaTime;
        if (_t >= _life) Object.Destroy(gameObject);
    }
}
