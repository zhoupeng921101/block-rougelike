using System.Globalization;
using GameRules;
using TMPro;
using UnityEngine;

/// <summary>
/// 局外三屏(选关 / 结算 / 商店)共用的一截外框:左栏消除类型表 + 右栏背包摘要。
/// 两栏都是「按当前局面现搭」的只读视图,由宿主窗给一个空容器,进屏时调一次;窗里不存状态。
/// 颜色与字号量自认可的效果图(结算 v2A / 选关 v2A / 商店 v2B),三屏共用一套,改这里三屏一起变。
/// </summary>
public static class RunChromeView
{
    /// <summary>左栏:11 种消除类型 · 本级底注 × 倍率。</summary>
    private const float TypeRowPitch = 56f;

    private static readonly Color32 TextMain = new Color32(0xe8, 0xee, 0xf2, 0xFF);
    private static readonly Color32 TextMuted = new Color32(0x8f, 0xa3, 0xb0, 0xFF);
    private static readonly Color32 ChipsColor = new Color32(0x4f, 0xb3, 0xff, 0xFF);
    private static readonly Color32 MultColor = new Color32(0xff, 0x4d, 0x6a, 0xFF);
    private static readonly Color32 GoldColor = new Color32(0xff, 0xc8, 0x3d, 0xFF);

    /// <summary>画左栏。容器清空后按优先级排 11 行。</summary>
    public static void BuildTypeTable(RectTransform host, TMP_FontAsset font, RunState run)
    {
        RuntimeUI.Clear(host);
        TextTable table = TextTable.Instance;
        RuntimeUI.TmpLabel(host, font, table.Get(TextKeys.Battle.TypeHeader), new Vector2(12f, -4f),
            new Vector2(240f, 30f), 18f, TextAlignmentOptions.Left, TextMuted);
        RuntimeUI.TmpLabel(host, font, table.Get(TextKeys.Battle.TypeValueHeader), new Vector2(44f, -4f),
            new Vector2(240f, 30f), 18f, TextAlignmentOptions.Right, TextMuted);
        if (run == null) return;

        float y = -44f;
        foreach (ClearType type in ClearRules.Priority)
        {
            ClearTypeBase basis = run.BaseOf(type);
            RuntimeUI.TmpLabel(host, font, table.Get(TextKeys.Of(type)), new Vector2(12f, y),
                new Vector2(240f, TypeRowPitch - 8f), 24f, TextAlignmentOptions.Left, TextMain);
            RuntimeUI.TmpLabel(host, font, table.Format(TextKeys.Battle.Level, run.LevelOf(type)),
                new Vector2(196f, y), new Vector2(48f, TypeRowPitch - 8f), 18f, TextAlignmentOptions.Center, TextMuted);
            RuntimeUI.TmpLabel(host, font, basis.Chips.ToString(CultureInfo.InvariantCulture),
                new Vector2(244f, y), new Vector2(64f, TypeRowPitch - 8f), 24f, TextAlignmentOptions.Center, ChipsColor);
            RuntimeUI.TmpLabel(host, font, table.Format(TextKeys.Battle.Mult, basis.Mult.ToString(CultureInfo.InvariantCulture)),
                new Vector2(300f, y), new Vector2(90f, TypeRowPitch - 8f), 24f, TextAlignmentOptions.Center, MultColor);
            y -= TypeRowPitch;
        }
    }

    /// <summary>画右栏:基因 / 道具 / 优惠券 / 方块库四项的只读摘要(买卖走各自的屏,不在这里)。</summary>
    public static void BuildInventory(RectTransform host, TMP_FontAsset font, RunState run)
    {
        RuntimeUI.Clear(host);
        if (run == null) return;
        TextTable table = TextTable.Instance;

        float y = -8f;
        y = Line(host, font, table.Format(TextKeys.Inventory.Genes, run.GeneSlotsUsed, run.GeneSlots), y);
        foreach (GeneSlot gene in run.Genes) y = Text(host, font, ItemNames.Gene(gene), y);
        y -= 10f;
        y = Line(host, font, table.Format(TextKeys.Inventory.Items, run.Consumables.Count, run.ConsumableSlots), y);
        foreach (ConsumableItem item in run.Consumables) y = Text(host, font, ItemNames.Consumable(run.Config.Catalog, item), y);
        y -= 10f;
        y = Line(host, font, table.Get(TextKeys.Inventory.Vouchers), y);
        foreach (int voucher in run.Vouchers) y = Text(host, font, table.Get(TextKeys.Voucher(voucher)), y);
        y -= 10f;
        Line(host, font, table.Format(TextKeys.Inventory.Library, run.Library.Count), y);
    }

    private static float Line(RectTransform host, TMP_FontAsset font, string text, float y)
    {
        RuntimeUI.TmpLabel(host, font, text, new Vector2(8f, y), new Vector2(340f, 30f), 20f,
            TextAlignmentOptions.Left, GoldColor);
        return y - 34f;
    }

    private static float Text(RectTransform host, TMP_FontAsset font, string text, float y)
    {
        RuntimeUI.TmpLabel(host, font, text, new Vector2(16f, y), new Vector2(332f, 26f), 18f,
            TextAlignmentOptions.Left, TextMain);
        return y - 28f;
    }
}
