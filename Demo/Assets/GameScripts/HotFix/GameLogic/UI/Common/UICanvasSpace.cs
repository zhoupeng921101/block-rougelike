using UnityEngine;

/// <summary>
/// Canvas 坐标学的单点 helper:渲染相机解析 / 屏幕点转局部坐标 / 缩放因子。
/// 手势与飞行组件各写一份同义换算时,Overlay 的相机判定口径会分叉,
/// 症状只在 Screen Space - Camera 配置下显形。各组件仍自缓存 Canvas 引用,只把换算交这里。
/// </summary>
public static class UICanvasSpace
{
    /// <summary>Canvas 的事件/渲染相机:Overlay(或 canvas 缺失)返 null,其余返 worldCamera。</summary>
    public static Camera RenderCameraOf(Canvas canvas)
        => canvas != null && canvas.renderMode != RenderMode.ScreenSpaceOverlay ? canvas.worldCamera : null;

    /// <summary>屏幕点 → plane 的局部坐标(相机按 <see cref="RenderCameraOf"/> 解析)。plane 为 null 返 false。</summary>
    public static bool ScreenToLocal(RectTransform plane, Canvas canvas, Vector2 screen, out Vector2 local)
    {
        if (plane == null) { local = default; return false; }
        return RectTransformUtility.ScreenPointToLocalPointInRectangle(plane, screen, RenderCameraOf(canvas), out local);
    }

    /// <summary>画布缩放系数(设计空间 → 屏幕像素,取根 canvas 的 scaleFactor);缺失或非正兜底 1。</summary>
    public static float ScaleOf(Canvas canvas)
        => canvas != null && canvas.scaleFactor > 0f ? canvas.scaleFactor : 1f;
}
