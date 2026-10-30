using System;
using System.Collections.Generic;
using GameRules;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

/// <summary>
/// 战斗窗的基因栏与道具栏(规则 §4.1、§4.3、§8.5):槽格是预制体里的静态框,这里给每格挂指针件、写文字、摆操作按钮。
/// <list type="bullet">
/// <item>基因:拖到另一格上换位(位置决定 ×倍率放大哪些加成);点一下选中,出「卖」。</item>
/// <item>道具:拖到目标上使用——改块的拖到盘上或待放置区的块上,改基因的拖到基因格上,不用目标的拖到道具栏以外任何地方;
/// 点一下选中,出「使用」(不用目标的)与「卖」。</item>
/// </list>
/// 规则核心的命令在这里调,存档与整屏刷新交给宿主的两个回调。
/// </summary>
public sealed class BattleInventory
{
    private static readonly Color FilledColor = new Color(1f, 0.92f, 0.7f, 1f);
    private static readonly Color EmptyColor = new Color(0.45f, 0.47f, 0.55f, 1f);
    private const float ActionHeight = 28f;

    private readonly RectTransform _window;
    private readonly RectTransform _itemSlots;
    private readonly List<RectTransform> _geneFrames = new List<RectTransform>();
    private readonly List<RectTransform> _itemFrames = new List<RectTransform>();
    private readonly List<TextMeshProUGUI> _geneLabels;
    private readonly List<TextMeshProUGUI> _itemLabels;
    private readonly TMP_FontAsset _font;
    private readonly BoardAreaPart _board;
    private readonly TrayAreaPart _tray;
    private readonly Func<bool> _canAct;
    private readonly Action<UseResult> _used;
    private readonly Action<string> _changed;
    private readonly TextMeshProUGUI _hint;

    private RunState _run;
    private int _selectedGene = -1;
    private int _selectedItem = -1;
    private int _firstTarget;
    private RectTransform _actions;
    private TextMeshProUGUI _ghost;
    private RectTransform _detail;

    public BattleInventory(RectTransform window, RectTransform geneSlots, RectTransform itemSlots, List<TextMeshProUGUI> geneLabels,
        List<TextMeshProUGUI> itemLabels, TMP_FontAsset font, BoardAreaPart board, TrayAreaPart tray, Func<bool> canAct,
        Action<UseResult> used, Action<string> changed)
    {
        _window = window;
        _itemSlots = itemSlots;
        _geneLabels = geneLabels;
        _itemLabels = itemLabels;
        _font = font;
        _board = board;
        _tray = tray;
        _canAct = canAct;
        _used = used;
        _changed = changed;
        Hook(geneSlots, _geneFrames, OnGeneClicked, OnGeneDragEnded, true);
        Hook(itemSlots, _itemFrames, OnItemClicked, OnItemDragEnded, false);
        _hint = RuntimeUI.TmpLabel(itemSlots, font, string.Empty, new Vector2(0f, -itemSlots.rect.height - 4f), new Vector2(itemSlots.rect.width, 28f), 18f,
            TextAlignmentOptions.Left, RuntimeUI.Gold);
    }

    public void Bind(RunState run)
    {
        HideDetail();
        _run = run;
        _selectedGene = _selectedItem = -1;
        _firstTarget = 0;
        _hint.text = string.Empty;
        Refresh();
    }

    /// <summary>按局面重写槽里的文字,并把操作按钮摆到选中的那一格上。</summary>
    public void Refresh()
    {
        if (_run == null) return;
        HideDetail();
        if (_selectedGene >= _run.Genes.Count) _selectedGene = -1;
        if (_selectedItem >= _run.Consumables.Count) _selectedItem = -1;
        for (int i = 0; i < _geneLabels.Count; i++)
        {
            bool filled = i < _run.Genes.Count;
            string text = string.Empty;
            if (filled)
            {
                GeneSlot g = _run.Genes[i];
                text = ItemNames.Gene(g) + (g.Counter > 0 ? " ·" + g.Counter : string.Empty);
            }
            _geneLabels[i].text = text;
            _geneLabels[i].color = filled ? FilledColor : EmptyColor;
        }
        for (int i = 0; i < _itemLabels.Count; i++)
        {
            bool filled = i < _run.Consumables.Count;
            string text = string.Empty;
            if (filled)
            {
                ConsumableItem item = _run.Consumables[i];
                text = ItemNames.Consumable(_run.Config.Catalog, item) + "\n<size=14>" + ItemNames.ConsumableDesc(_run.Config.Catalog, item) + "</size>";
            }
            _itemLabels[i].text = text;
            _itemLabels[i].color = filled ? FilledColor : EmptyColor;
        }
        BuildActions();
    }

    private void Hook(RectTransform slots, List<RectTransform> frames, Action<int> clicked, Action<int, PointerEventData> ended, bool gene)
    {
        int index = 0;
        foreach (Transform child in slots)
        {
            var frame = (RectTransform)child;
            Graphic graphic = frame.GetComponent<Graphic>();
            if (graphic == null)
            {
                graphic = frame.gameObject.AddComponent<Image>();
                graphic.color = new Color(0f, 0f, 0f, 0f);
            }
            graphic.raycastTarget = true;
            var handler = frame.gameObject.AddComponent<InventorySlotHandler>();
            handler.Index = index++;
            handler.Clicked = clicked;
            handler.DragBegan = BeginGhost;
            handler.Dragged = MoveGhost;
            handler.DragEnded = (i, e) =>
            {
                EndGhost();
                ended(i, e);
            };
            handler.Hovered = (i, enter) => { if (enter) ShowDetail(gene, i); else HideDetail(); };
            frames.Add(frame);
        }
    }

    private void ShowDetail(bool gene, int index)
    {
        HideDetail();
        if (_run == null) return;
        string name;
        string description;
        RectTransform frame;
        if (gene)
        {
            if (index >= _run.Genes.Count) return;
            GeneSlot slot = _run.Genes[index];
            name = ItemNames.Gene(slot);
            description = TextTable.Instance.Get(TextKeys.GeneDesc(slot.GeneId));
            frame = _geneFrames[index];
        }
        else
        {
            if (index >= _run.Consumables.Count) return;
            ConsumableItem item = _run.Consumables[index];
            name = ItemNames.Consumable(_run.Config.Catalog, item);
            description = ItemNames.ConsumableDesc(_run.Config.Catalog, item);
            frame = _itemFrames[index];
        }
        if (string.IsNullOrEmpty(description)) return;

        const float width = 420f;
        const float height = 200f;
        Vector3[] corners = new Vector3[4];
        frame.GetWorldCorners(corners);
        Vector2 left = _window.InverseTransformPoint(corners[1]);
        float x = left.x - _window.rect.xMin - width - 12f;
        float y = Mathf.Clamp(left.y - _window.rect.yMax, -_window.rect.height + height + 12f, -12f);
        _detail = RuntimeUI.Node("物品说明", _window, new Vector2(Mathf.Max(12f, x), y),
            new Vector2(width, height), typeof(Image));
        Image background = _detail.GetComponent<Image>();
        background.color = RuntimeUI.PanelColor;
        background.raycastTarget = false;
        RuntimeUI.TmpLabel(_detail, _font, name, new Vector2(18f, -14f), new Vector2(width - 36f, 42f),
            23f, TextAlignmentOptions.TopLeft, RuntimeUI.Gold);
        RuntimeUI.TmpLabel(_detail, _font, description, new Vector2(18f, -62f), new Vector2(width - 36f, height - 76f),
            19f, TextAlignmentOptions.TopLeft, RuntimeUI.TextColor);
    }

    private void HideDetail()
    {
        if (_detail != null) UnityEngine.Object.Destroy(_detail.gameObject);
        _detail = null;
    }

    private void OnGeneClicked(int slot)
    {
        if (_run == null || slot >= _run.Genes.Count) return;
        _selectedItem = -1;
        _selectedGene = _selectedGene == slot ? -1 : slot;
        _hint.text = string.Empty;
        BuildActions();
    }

    private void OnItemClicked(int index)
    {
        if (_run == null || index >= _run.Consumables.Count) return;
        _selectedGene = -1;
        if (_selectedItem != index) _firstTarget = 0;
        _selectedItem = _selectedItem == index ? -1 : index;
        if (_selectedItem < 0) _firstTarget = 0;
        _hint.text = _selectedItem >= 0 && NeedsTarget(_run.Consumables[index]) ? TextTable.Instance.Get(TextKeys.Inventory.DragHint) : string.Empty;
        BuildActions();
    }

    /// <summary>基因拖到另一格上松手:换位。拖到栏外不动。</summary>
    private void OnGeneDragEnded(int from, PointerEventData e)
    {
        if (_run == null || from >= _run.Genes.Count || !_canAct()) return;
        int to = FrameUnder(_geneFrames, e);
        if (to < 0 || to >= _run.Genes.Count || to == from) return;
        _selectedGene = _selectedItem = -1;
        if (_run.MoveGene(from, to)) _changed("基因换位");
    }

    /// <summary>道具拖到目标上松手:按这件要的目标找落点下的块或基因,找到就用。</summary>
    private void OnItemDragEnded(int index, PointerEventData e)
    {
        if (_run == null || index >= _run.Consumables.Count || !_canAct()) return;
        ConsumableItem item = _run.Consumables[index];
        ModTarget kind = item.Kind == ItemKind.Mod ? ModCatalog.TargetOf(item.Id) : ModTarget.None;
        int target;
        switch (kind)
        {
            case ModTarget.Block:
                target = BlockUnder(e);
                break;
            case ModTarget.BoardBlock:
                target = BoardBlockUnder(e);
                break;
            case ModTarget.Gene:
                target = FrameUnder(_geneFrames, e);
                if (target >= _run.Genes.Count) target = -1;
                break;
            case ModTarget.TwoBlocks:
                target = BlockUnder(e);
                if (target < 0) return;
                if (_firstTarget == 0 || _firstTarget == target)
                {
                    _firstTarget = target;
                    _hint.text = TextTable.Instance.Get(TextKeys.Inventory.PickSecondBlock);
                    return;
                }
                Use(index, _firstTarget, target);
                _firstTarget = 0;
                return;
            default:
                // 不用目标的:拖出道具栏就算用
                if (FrameUnder(_itemFrames, e) >= 0) return;
                target = 0;
                break;
        }
        if (target < 0) return;
        Use(index, target);
    }

    private void Use(int index, int target) => Use(index, target, 0);

    private void Use(int index, int target, int secondTarget)
    {
        _selectedGene = _selectedItem = -1;
        UseResult result = _run.UseConsumable(index, target, secondTarget);
        _hint.text = result.Accepted ? string.Empty : ItemNames.Reject(result.Reject);
        _used(result);
    }

    private static bool NeedsTarget(ConsumableItem item) => item.Kind == ItemKind.Mod && ModCatalog.TargetOf(item.Id) != ModTarget.None;

    /// <summary>选中的那一格底部摆操作按钮:基因「卖」,道具「使用」(不用目标的)与「卖」。</summary>
    private void BuildActions()
    {
        if (_actions != null) UnityEngine.Object.Destroy(_actions.gameObject);
        _actions = null;
        if (_run == null) return;
        RectTransform frame;
        var buttons = new List<(string Text, Action Click)>();
        TextTable table = TextTable.Instance;
        if (_selectedGene >= 0 && _selectedGene < _geneFrames.Count)
        {
            frame = _geneFrames[_selectedGene];
            int slot = _selectedGene;
            GeneSlot g = _run.Genes[slot];
            buttons.Add((table.Format(TextKeys.Inventory.Sell, _run.SellPriceOf(g)), () => Sell(true, slot)));
        }
        else if (_selectedItem >= 0 && _selectedItem < _itemFrames.Count)
        {
            frame = _itemFrames[_selectedItem];
            int index = _selectedItem;
            ConsumableItem item = _run.Consumables[index];
            if (!NeedsTarget(item)) buttons.Add((table.Get(TextKeys.Inventory.Use), () => { if (_canAct()) Use(index, 0); }));
            buttons.Add((table.Format(TextKeys.Inventory.Sell, _run.SellPriceOf(item.Kind, item.Id, Edition.None)), () => Sell(false, index)));
        }
        else
        {
            return;
        }

        float width = frame.rect.width;
        _actions = RuntimeUI.Node("操作", frame, new Vector2(0f, -(frame.rect.height - ActionHeight)), new Vector2(width, ActionHeight));
        float buttonWidth = width / buttons.Count;
        for (int i = 0; i < buttons.Count; i++)
        {
            RuntimeUI.TmpButton(_actions, _font, buttons[i].Text, new Vector2(i * buttonWidth, 0f), new Vector2(buttonWidth - 2f, ActionHeight),
                buttons[i].Click, 16f, i == buttons.Count - 1 ? RuntimeUI.ButtonAccent : RuntimeUI.ButtonColor);
        }
    }

    private void Sell(bool gene, int index)
    {
        if (!_canAct()) return;
        _selectedGene = _selectedItem = -1;
        int price = gene ? _run.SellGene(index) : _run.SellConsumable(index);
        if (price >= 0) _changed(gene ? "卖基因" : "卖道具");
    }

    private int BlockUnder(PointerEventData e)
    {
        for (int i = 0; i < _tray.SlotCount; i++)
        {
            TrayAreaPart.SlotView v = _tray.GetSlot(i);
            if (v?.Slot == null || v.InstanceId == 0) continue;
            if (RectTransformUtility.RectangleContainsScreenPoint(v.Slot.rectTransform, e.position, e.pressEventCamera)) return v.InstanceId;
        }
        return BoardBlockUnder(e);
    }

    /// <summary>只认盘上的块(拆解)。</summary>
    private int BoardBlockUnder(PointerEventData e)
    {
        (int col, int row) = _board.ScreenToCell(e.position);
        if (col < 0 || row < 0 || col >= BoardCells.Cols || row >= BoardCells.Rows || _run.Blind == null) return -1;
        int owner = _run.Blind.Board.OwnerAt(BoardCells.Index(row, col));
        return owner == 0 ? -1 : owner;
    }

    private static int FrameUnder(List<RectTransform> frames, PointerEventData e)
    {
        for (int i = 0; i < frames.Count; i++)
        {
            if (RectTransformUtility.RectangleContainsScreenPoint(frames[i], e.position, e.pressEventCamera)) return i;
        }
        return -1;
    }

    // ── 拖起时跟手的名字条 ──

    private void BeginGhost(int index, PointerEventData e)
    {
        EndGhost();
        if (_run == null || !_canAct()) return;
        bool isGene = _geneFrames.Contains((RectTransform)e.pointerDrag.transform);
        string text;
        if (isGene) text = index < _run.Genes.Count ? ItemNames.Gene(_run.Genes[index]) : null;
        else text = index < _run.Consumables.Count ? ItemNames.Consumable(_run.Config.Catalog, _run.Consumables[index]) : null;
        if (text == null) return;
        _ghost = RuntimeUI.TmpLabel(_window, _font, text, Vector2.zero, new Vector2(240f, 40f), 22f, TextAlignmentOptions.Center, RuntimeUI.Gold);
        _ghost.rectTransform.pivot = new Vector2(0.5f, 0.5f);
        MoveGhost(index, e);
    }

    private void MoveGhost(int index, PointerEventData e)
    {
        if (_ghost == null) return;
        if (RectTransformUtility.ScreenPointToLocalPointInRectangle(_window, e.position, e.pressEventCamera, out Vector2 local))
        {
            _ghost.rectTransform.localPosition = local;
        }
    }

    private void EndGhost()
    {
        if (_ghost != null) UnityEngine.Object.Destroy(_ghost.gameObject);
        _ghost = null;
    }
}
