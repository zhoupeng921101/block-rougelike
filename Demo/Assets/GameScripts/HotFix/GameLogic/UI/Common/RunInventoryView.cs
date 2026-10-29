using System;
using System.Collections.Generic;
using GameRules;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 背包栏(选关屏与商店屏的右侧一栏,规则 §8.3「右侧显示科技、宝箱、方块库」):
/// 基因栏(换位 ◀ ▶、出售)、道具栏(使用、出售)、已买的优惠券、方块库块数。
/// 不在盲注里用改造:改块的从方块库里挑一块,改基因的从基因栏里挑一格(规则 §4.3)。
/// 每次改动都经 <see cref="RunSaveService.CommitRun"/> 存档,再叫宿主刷新(钱、货价跟着变)。
/// 全部节点运行时现搭,窗里只要给一个空容器。
/// </summary>
public sealed class RunInventoryView
{
    private const float RowHeight = 44f;
    private const float ItemRowHeight = 58f;
    private const float Gap = 6f;
    private const float SmallButton = 40f;
    private const float WideButton = 84f;

    private readonly RectTransform _root;
    private readonly Font _font;
    private readonly Action _changed;
    private RunState _run;

    private enum Mode
    {
        List,
        PickBlock,
        PickGene,
    }

    private Mode _mode;

    /// <summary>挑目标时,等着用的是道具栏第几件。</summary>
    private int _pendingItem = -1;

    /// <summary>上一次操作被拒的提示;下一次操作清掉。</summary>
    private string _message;

    public RunInventoryView(RectTransform root, Font font, Action changed)
    {
        _root = root;
        _font = font;
        _changed = changed;
    }

    /// <summary>在窗根右上角建一个停靠栏,返回它的容器(背景已铺)。</summary>
    public static RectTransform CreateDock(RectTransform window, float width, float top, float height)
    {
        RectTransform dock = RuntimeUI.Node("背包栏", window, Vector2.zero, new Vector2(width, height), typeof(Image));
        dock.anchorMin = dock.anchorMax = dock.pivot = new Vector2(1f, 1f);
        dock.anchoredPosition = new Vector2(-24f, -top);
        dock.GetComponent<Image>().color = RuntimeUI.PanelColor;
        return dock;
    }

    public void Bind(RunState run)
    {
        _run = run;
        _mode = Mode.List;
        _pendingItem = -1;
        _message = null;
        Rebuild();
    }

    /// <summary>已经绑着这一局了吗(宿主整屏重画时不必重置挑目标的状态)。</summary>
    public bool IsBoundTo(RunState run) => _run == run && run != null;

    public void Rebuild()
    {
        RuntimeUI.Clear(_root);
        if (_run == null) return;
        switch (_mode)
        {
            case Mode.PickBlock: BuildBlockPicker(); break;
            case Mode.PickGene: BuildGenePicker(); break;
            default: BuildList(); break;
        }
    }

    private float Width => _root.rect.width > 0f ? _root.rect.width - 2f * Gap : 360f;

    private void BuildList()
    {
        TextTable table = TextTable.Instance;
        float y = -Gap;
        Header(table.Format(TextKeys.Inventory.Genes, _run.GeneSlotsUsed, _run.GeneSlots), ref y);
        for (int i = 0; i < _run.Genes.Count; i++)
        {
            int slot = i;
            GeneSlot gene = _run.Genes[i];
            float labelWidth = Width - 2f * SmallButton - WideButton - 3f * Gap;
            RuntimeUI.Label(_root, _font, ItemNames.Gene(gene), new Vector2(Gap, y), new Vector2(labelWidth, RowHeight), 20);
            float x = Gap + labelWidth + Gap;
            RuntimeUI.Button(_root, _font, table.Get(TextKeys.Inventory.MoveLeft), new Vector2(x, y), new Vector2(SmallButton, RowHeight),
                () => Act(_run.MoveGene(slot, slot - 1), "基因换位"), slot > 0, 20);
            x += SmallButton;
            RuntimeUI.Button(_root, _font, table.Get(TextKeys.Inventory.MoveRight), new Vector2(x, y), new Vector2(SmallButton, RowHeight),
                () => Act(_run.MoveGene(slot, slot + 1), "基因换位"), slot < _run.Genes.Count - 1, 20);
            x += SmallButton + Gap;
            int price = _run.SellPriceOf(ItemKind.Gene, gene.GeneId, gene.Edition);
            RuntimeUI.Button(_root, _font, table.Format(TextKeys.Inventory.Sell, price), new Vector2(x, y), new Vector2(WideButton, RowHeight),
                () => Act(_run.SellGene(slot) >= 0, "卖基因"), true, 20, RuntimeUI.ButtonAccent);
            y -= RowHeight + Gap;
        }

        y -= Gap;
        Header(table.Format(TextKeys.Inventory.Items, _run.Consumables.Count, _run.ConsumableSlots), ref y);
        for (int i = 0; i < _run.Consumables.Count; i++)
        {
            int index = i;
            ConsumableItem item = _run.Consumables[i];
            float labelWidth = Width - 2f * WideButton - 2f * Gap;
            string text = ItemNames.Consumable(_run.Config.Catalog, item) + "\n<size=16>" + ItemNames.ConsumableDesc(_run.Config.Catalog, item) + "</size>";
            RuntimeUI.Label(_root, _font, text, new Vector2(Gap, y), new Vector2(labelWidth, ItemRowHeight), 20);
            float x = Gap + labelWidth + Gap;
            RuntimeUI.Button(_root, _font, table.Get(TextKeys.Inventory.Use), new Vector2(x, y), new Vector2(WideButton, ItemRowHeight),
                () => Use(index), true, 20);
            x += WideButton;
            int price = _run.SellPriceOf(item.Kind, item.Id, Edition.None);
            RuntimeUI.Button(_root, _font, table.Format(TextKeys.Inventory.Sell, price), new Vector2(x, y), new Vector2(WideButton, ItemRowHeight),
                () => Act(_run.SellConsumable(index) >= 0, "卖道具"), true, 20, RuntimeUI.ButtonAccent);
            y -= ItemRowHeight + Gap;
        }

        y -= Gap;
        Header(table.Get(TextKeys.Inventory.Vouchers), ref y);
        var names = new List<string>(_run.Vouchers.Count);
        foreach (int v in _run.Vouchers) names.Add(table.Get(TextKeys.Voucher(v)));
        RuntimeUI.Label(_root, _font, names.Count == 0 ? "—" : string.Join("、", names), new Vector2(Gap, y), new Vector2(Width, RowHeight * 1.5f), 18,
            TextAnchor.UpperLeft, RuntimeUI.TextMuted);
        y -= RowHeight * 1.5f + Gap;
        Header(table.Format(TextKeys.Inventory.Library, _run.Library.Count), ref y);

        if (!string.IsNullOrEmpty(_message))
        {
            RuntimeUI.Label(_root, _font, _message, new Vector2(Gap, y), new Vector2(Width, RowHeight), 20, TextAnchor.MiddleLeft, RuntimeUI.Gold);
        }
    }

    private void BuildBlockPicker()
    {
        TextTable table = TextTable.Instance;
        float y = -Gap;
        PickerHeader(table.Get(TextKeys.Inventory.PickBlock), ref y);
        const int columns = 2;
        float cellWidth = (Width - (columns - 1) * Gap) / columns;
        for (int i = 0; i < _run.Library.Count; i++)
        {
            BlockInstance block = _run.Library[i];
            int id = block.Id;
            float x = Gap + i % columns * (cellWidth + Gap);
            float rowY = y - i / columns * (36f + Gap);
            RuntimeUI.Button(_root, _font, ItemNames.Block(block), new Vector2(x, rowY), new Vector2(cellWidth, 36f), () => UseOn(id), true, 16);
        }
    }

    private void BuildGenePicker()
    {
        float y = -Gap;
        PickerHeader(TextTable.Instance.Get(TextKeys.Inventory.PickGene), ref y);
        for (int i = 0; i < _run.Genes.Count; i++)
        {
            int slot = i;
            GeneSlot gene = _run.Genes[i];
            RuntimeUI.Button(_root, _font, ItemNames.Gene(gene), new Vector2(Gap, y), new Vector2(Width, RowHeight), () => UseOn(slot),
                gene.Edition == Edition.None, 20);
            y -= RowHeight + Gap;
        }
    }

    private void Header(string text, ref float y)
    {
        RuntimeUI.Label(_root, _font, text, new Vector2(Gap, y), new Vector2(Width, 32f), 22, TextAnchor.MiddleLeft, RuntimeUI.Gold);
        y -= 32f + Gap;
    }

    private void PickerHeader(string text, ref float y)
    {
        float labelWidth = Width - WideButton - Gap;
        RuntimeUI.Label(_root, _font, text, new Vector2(Gap, y), new Vector2(labelWidth, RowHeight), 22, TextAnchor.MiddleLeft, RuntimeUI.Gold);
        RuntimeUI.Button(_root, _font, TextTable.Instance.Get(TextKeys.Inventory.Cancel), new Vector2(Gap + labelWidth + Gap, y),
            new Vector2(WideButton, RowHeight), () =>
            {
                _mode = Mode.List;
                _pendingItem = -1;
                Rebuild();
            }, true, 20);
        y -= RowHeight + Gap;
    }

    /// <summary>「使用」:不用指定目标的当场用;要目标的先切到挑目标那一页。</summary>
    private void Use(int index)
    {
        ConsumableItem item = _run.Consumables[index];
        ModTarget target = item.Kind == ItemKind.Mod ? ModCatalog.TargetOf(item.Id) : ModTarget.None;
        if (target == ModTarget.None)
        {
            Apply(_run.UseConsumable(index));
            return;
        }
        _pendingItem = index;
        _mode = target == ModTarget.Block ? Mode.PickBlock : Mode.PickGene;
        Rebuild();
    }

    private void UseOn(int target)
    {
        int index = _pendingItem;
        _mode = Mode.List;
        _pendingItem = -1;
        Apply(_run.UseConsumable(index, target));
    }

    private void Apply(UseResult result)
    {
        if (result.Accepted)
        {
            Act(true, "用道具");
            return;
        }
        _message = ItemNames.Reject(result.Reject);
        Rebuild();
    }

    private void Act(bool changed, string what)
    {
        _message = null;
        if (changed)
        {
            RunSaveService.Instance.CommitRun(_run, what);
            _changed?.Invoke();
        }
        Rebuild();
    }
}
