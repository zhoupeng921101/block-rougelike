using System;
using UnityEngine;
using UnityEngine.EventSystems;

/// <summary>
/// 背包槽格上的指针件:点一下、拖起、拖动、松手各转给宿主一个回调,带上本槽的序号。
/// 只转事件、不改状态;战斗窗的基因换位、道具拖到目标上用它(<see cref="BattleInventory"/>)。
/// </summary>
public sealed class InventorySlotHandler : MonoBehaviour, IPointerClickHandler, IBeginDragHandler, IDragHandler, IEndDragHandler
{
    public int Index;

    public Action<int> Clicked;
    public Action<int, PointerEventData> DragBegan;
    public Action<int, PointerEventData> Dragged;
    public Action<int, PointerEventData> DragEnded;

    private bool _dragging;

    public void OnPointerClick(PointerEventData e)
    {
        if (_dragging || e.button != PointerEventData.InputButton.Left) return;
        Clicked?.Invoke(Index);
    }

    public void OnBeginDrag(PointerEventData e)
    {
        if (e.button != PointerEventData.InputButton.Left) return;
        _dragging = true;
        DragBegan?.Invoke(Index, e);
    }

    public void OnDrag(PointerEventData e)
    {
        if (_dragging) Dragged?.Invoke(Index, e);
    }

    public void OnEndDrag(PointerEventData e)
    {
        if (!_dragging) return;
        _dragging = false;
        DragEnded?.Invoke(Index, e);
    }
}
