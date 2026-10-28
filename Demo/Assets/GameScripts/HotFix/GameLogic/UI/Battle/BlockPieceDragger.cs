using System;
using UnityEngine;
using UnityEngine.EventSystems;

/// <summary>
/// 托盘块的拖拽器(由 <see cref="PieceGestureFlow"/> 挂到每个托盘槽的根上;槽根是整槽透明命中区)。
/// 交互:按下不拾起,指针移动越过 <see cref="BlockLayout.SlotTapMaxMove"/> 那一刻才拾起;拾起后块心贴着指针走(偏移 0、倍率 1.0,12 号票);
/// 抬手统一回调 <see cref="OnEnd"/> 并带上「这一下算不算原地点击」,由手势流分流到转朝向 / 落子 / 弃置 / 弹回。
/// 只认左键:旧输入系统的 StandaloneInputModule 对左、中、右三个键都发按下与拖动事件,不过滤的话右键也能把块拖起来。
/// 移动的是 <see cref="Target"/>(块的视觉根),不是槽根:槽留在原处画「块在手上」的空槽。
///
/// 同一条阈值同时是「点击上限」与「起拖门槛」,故不存在「已拾起但仍算点击」的中间态。
/// 移植自 block-client 的同名类(02 号票);悬停回调是 3B 加的,用来确定没在拖时的旋转对象。
/// </summary>
public sealed class BlockPieceDragger : MonoBehaviour,
    IPointerDownHandler, IDragHandler, IPointerUpHandler, IPointerEnterHandler, IPointerExitHandler
{
    public int SlotIndex;

    /// <summary>拾起后跟着指针走的节点:块的视觉根。手势流在 <see cref="OnBegin"/> 里把它挪到拖拽层,这里只管位置。</summary>
    public RectTransform Target;

    /// <summary>按下回调 (slotIndex)。按下即发,纯点击那一手也会发。</summary>
    public Action<int> OnPress;

    /// <summary>拾起回调 (slotIndex)。越过起拖阈值那一刻才发,纯点击不发。返回 false = 现在不许拾起(结算锁、盲注已结束),这一手作废。</summary>
    public Func<int, bool> OnBegin;

    /// <summary>拖动回调 (slotIndex)。宿主按 <see cref="Target"/> 的世界坐标算落点,不需要指针位置。</summary>
    public Action<int> OnDragMove;

    /// <summary>抬手回调 (slotIndex, isTap)。isTap = 这一手从未拾起,即位移没越过阈值,玩家只是原地点了一下。</summary>
    public Action<int, bool> OnEnd;

    /// <summary>悬停回调 (slotIndex, 进 / 出)。</summary>
    public Action<int, bool> OnHover;

    private Canvas _canvas;
    private Vector2 _pressScreen;   // 按下时指针的屏幕坐标(起拖阈值的比较基准)
    private bool _pressed;         // 左键在本槽按下、还没抬起也没被取消
    private bool _picked;          // 已越过起拖阈值、块已拾起

    /// <summary>左键按在本槽上、这一手还没结束。</summary>
    public bool IsPressed => _pressed;

    private void Awake()
    {
        // 窗自带一个嵌套画布;缩放系数和事件相机以根画布为准
        _canvas = GetComponentInParent<Canvas>().rootCanvas;
    }

    public void OnPointerDown(PointerEventData e)
    {
        if (e.button != PointerEventData.InputButton.Left) return;
        _pressScreen = e.position;
        _pressed = true;
        _picked = false;
        // 按下不动方块:不放大、不提层、不移位,等越过起拖阈值再做,
        // 使「只想点一下转朝向」的那一手全程看不到方块弹起来又落回去。
        OnPress?.Invoke(SlotIndex);
    }

    public void OnDrag(PointerEventData e)
    {
        if (e.button != PointerEventData.InputButton.Left || !_pressed) return;
        if (!_picked)
        {
            // 阈值在屏幕空间比:指针移没移动与画布缩放无关,换算到本地空间反而随分辨率漂移
            float threshold = BlockLayout.SlotTapMaxMove * UICanvasSpace.ScaleOf(_canvas);
            if ((e.position - _pressScreen).sqrMagnitude <= threshold * threshold) return;
            // 越过阈值这一刻才真正拾起。拾起后不再回落成点击——绕出去又绕回原点那一手是拖动、不是点击。
            if (OnBegin != null && !OnBegin(SlotIndex))
            {
                _pressed = false;
                return;
            }
            _picked = true;
        }

        if (Target != null && Target.parent is RectTransform plane
            && RectTransformUtility.ScreenPointToWorldPointInRectangle(plane, e.position, UICanvasSpace.RenderCameraOf(_canvas), out var world))
        {
            Target.position = world;
            OnDragMove?.Invoke(SlotIndex);
        }
    }

    public void OnPointerUp(PointerEventData e)
    {
        if (e.button != PointerEventData.InputButton.Left || !_pressed) return;
        bool picked = _picked;
        _pressed = false;
        _picked = false;
        OnEnd?.Invoke(SlotIndex, !picked);
    }

    public void OnPointerEnter(PointerEventData e) => OnHover?.Invoke(SlotIndex, true);

    public void OnPointerExit(PointerEventData e) => OnHover?.Invoke(SlotIndex, false);

    /// <summary>
    /// 取消这一手:之后的拖动与抬起事件一律不理,直到下一次按下。不回调、不动 <see cref="Target"/>,收尾由调用方做。
    /// 用于 Esc、窗口失焦、丢了抬起事件、结算锁上锁(12 号票)。
    /// </summary>
    public void Cancel()
    {
        _pressed = false;
        _picked = false;
    }
}
