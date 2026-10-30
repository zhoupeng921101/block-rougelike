using System;
using System.Globalization;
using GameRules;
using TMPro;
using TEngine;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 盲注结算屏(局外循环设计稿 §3.2):整屏一页,星空白底 + 顶栏 + 左栏消除类型表 + 中间结算面板 + 右栏背包摘要。
/// 内容照效果图 v2A:头像里的目标星球、「盲注通过」、累计分 / 目标分、最大连击、11 种消除类型分布、
/// 通关奖励 / 利息 / 本场入账 / 当前持有;底部唯一出口「进入商店」,Esc 等同。
/// 失败时不出这一屏的设计还没落:同一张窗换成「盲注失败」+ 失败原因 + 「返回主界面」,隐藏奖励与出口。
/// 数据全由战斗窗在结局时组好传进来(<see cref="Data"/>),本窗不读规则核心的状态。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIBattleResultPanel
{
    /// <summary>打开时传的内容。战斗窗在结局步演完后组一份,连出口回调一起给。</summary>
    public sealed class Data
    {
        public readonly BlindOutcome Outcome;
        public readonly FailReason Reason;
        public readonly long Total;
        public readonly long Target;

        /// <summary>这一场是第几段第几层(结算面板副标题「第 2 段 · 重盲注」)。</summary>
        public readonly int Segment;
        public readonly int Layer;

        /// <summary>本场最大连击:战斗窗按每一步的 <see cref="StepEnded.Combo"/> 记的最大值。</summary>
        public readonly int MaxCombo;

        /// <summary>本场 11 种消除类型各打出几次,下标同 <see cref="ClearRules.Priority"/> 的顺序。</summary>
        public readonly int[] TypeCounts;

        /// <summary>这一场的结算(赢了才有):通关奖励与利息。</summary>
        public readonly Settlement? Settlement;

        /// <summary>整局的当前状态,只用来画左栏类型表与右栏背包摘要。</summary>
        public readonly RunState Run;

        public readonly Action Continue;

        public readonly Action Back;

        public Data(BlindOutcome outcome, FailReason reason, long total, long target, int segment, int layer, int maxCombo,
            int[] typeCounts, Settlement? settlement, RunState run, Action continueAction, Action back)
        {
            Outcome = outcome;
            Reason = reason;
            Total = total;
            Target = target;
            Segment = segment;
            Layer = layer;
            MaxCombo = maxCombo;
            TypeCounts = typeCounts;
            Settlement = settlement;
            Run = run;
            Continue = continueAction;
            Back = back;
        }
    }

    [Header("配色")]
    [Tooltip("胜利标题的颜色(金黄)。")]
    [SerializeField] private Color _wonColor = new Color32(0xf0, 0xc6, 0x3f, 0xFF);
    [Tooltip("失败标题的颜色(红粉)。")]
    [SerializeField] private Color _lostColor = new Color32(0xf0, 0x52, 0x52, 0xFF);

    [Header("素材")]
    [Tooltip("11 个消除类型分布格的底(run_cell,九宫格)。")]
    [SerializeField] private Sprite _distCellSprite = null!;

    private static readonly Color32 TextMain = new Color32(0xe8, 0xee, 0xf2, 0xFF);
    private static readonly Color32 TextMuted = new Color32(0x8f, 0xa3, 0xb0, 0xFF);
    private static readonly Color32 TextDark = new Color32(0x5c, 0x6f, 0x7a, 0xFF);
    private static readonly Color32 ChipsColor = new Color32(0x4f, 0xb3, 0xff, 0xFF);
    private static readonly Color32 MultColor = new Color32(0xff, 0x4d, 0x6a, 0xFF);
    private static readonly Color32 GoldColor = new Color32(0xff, 0xc8, 0x3d, 0xFF);

    /// <summary>分布格:4 列,格 214×42、横距 14、行距 10(量自效果图 v2A)。</summary>
    private const float DistCellWidth = 214f;
    private const float DistCellHeight = 42f;
    private const float DistColPitch = 228f;
    private const float DistRowPitch = 52f;
    private const int DistColumns = 4;

    /// <summary>左栏类型表:行高 56,表头下留 44。</summary>
    private const float TypeRowPitch = 56f;

    private Data _data;

    protected override void OnRefresh()
    {
        _data = UserData as Data;
        if (_data == null)
        {
            Log.Error("[UIBattleResultPanel] 打开时没有传入结果,直接关掉");
            GameModule.UI.CloseUI<UIBattleResultPanel>();
            return;
        }

        bool won = _data.Outcome == BlindOutcome.Won;
        TextTable table = TextTable.Instance;

        m_tmp_Title.text = table.Get(won ? TextKeys.Battle.ResultWon : TextKeys.Battle.ResultLost);
        m_tmp_Title.color = won ? _wonColor : _lostColor;
        m_tmp_Subtitle.text = table.Format(TextKeys.Battle.ResultBlind, _data.Segment.ToString(CultureInfo.InvariantCulture),
            table.Get(TextKeys.BlindNameOf(_data.Layer)));
        m_tmp_Score.text = _data.Total.ToString(CultureInfo.InvariantCulture);
        m_tmp_Target.text = table.Format(TextKeys.Battle.ResultTarget, _data.Target.ToString(CultureInfo.InvariantCulture));
        m_tmp_Combo.text = table.Format(TextKeys.Battle.Mult, _data.MaxCombo.ToString(CultureInfo.InvariantCulture));

        BuildDistribution(table);
        BuildTypeTable(table);
        BuildInventory(table);
        BuildMoney(table, won);
        BuildExit(table, won);
    }

    /// <summary>Esc 与「进入商店」等同(局外循环 §3.2「唯一出口;Esc 等同」);输的那一态等同「返回主界面」。</summary>
    protected override void OnUpdate()
    {
        if (_data == null) return;
        if (!Input.GetKeyDown(PieceKeymap.CancelOrBackKey)) return;
        if (_data.Outcome == BlindOutcome.Won) _data.Continue?.Invoke();
        else _data.Back?.Invoke();
    }

    /// <summary>11 种消除类型按「单线 → 清屏」排(优先级倒序,和效果图 v2A 一致),0 次的整格暗下去。</summary>
    private void BuildDistribution(TextTable table)
    {
        RuntimeUI.Clear(m_rect_Dist);
        for (int i = 0; i < ClearRules.Priority.Count; i++)
        {
            ClearType type = ClearRules.Priority[ClearRules.Priority.Count - 1 - i];
            int count = CountOf(type);
            float x = i % DistColumns * DistColPitch;
            float y = -(i / DistColumns) * DistRowPitch;

            RectTransform cell = RuntimeUI.Node("分布格", m_rect_Dist, new Vector2(x, y),
                new Vector2(DistCellWidth, DistCellHeight), typeof(Image));
            Image image = cell.GetComponent<Image>();
            image.sprite = _distCellSprite;
            image.type = Image.Type.Sliced;

            RuntimeUI.TmpLabel(cell, MainFont, table.Get(TextKeys.Of(type)), new Vector2(14f, 0f),
                new Vector2(DistCellWidth - 96f, DistCellHeight), 20f, TextAlignmentOptions.Left,
                count > 0 ? (Color)TextMain : TextDark);
            RuntimeUI.TmpLabel(cell, MainFont, table.Format(TextKeys.Battle.Mult, count.ToString(CultureInfo.InvariantCulture)),
                new Vector2(DistCellWidth - 72f, 0f), new Vector2(58f, DistCellHeight), 22f, TextAlignmentOptions.Right,
                count > 0 ? (Color)ChipsColor : TextDark);
        }
    }

    /// <summary>左栏:11 种消除类型 · 本级底注 × 倍率。</summary>
    private void BuildTypeTable(TextTable table)
    {
        RuntimeUI.Clear(m_rect_TypeTable);
        RuntimeUI.TmpLabel(m_rect_TypeTable, MainFont, table.Get(TextKeys.Battle.TypeHeader), new Vector2(12f, -4f),
            new Vector2(240f, 30f), 18f, TextAlignmentOptions.Left, TextMuted);
        RuntimeUI.TmpLabel(m_rect_TypeTable, MainFont, table.Get(TextKeys.Battle.TypeValueHeader), new Vector2(44f, -4f),
            new Vector2(240f, 30f), 18f, TextAlignmentOptions.Right, TextMuted);
        if (_data.Run == null) return;

        float y = -44f;
        foreach (ClearType type in ClearRules.Priority)
        {
            ClearTypeBase basis = _data.Run.BaseOf(type);
            RuntimeUI.TmpLabel(m_rect_TypeTable, MainFont, table.Get(TextKeys.Of(type)), new Vector2(12f, y),
                new Vector2(240f, TypeRowPitch - 8f), 24f, TextAlignmentOptions.Left, TextMain);
            RuntimeUI.TmpLabel(m_rect_TypeTable, MainFont, table.Format(TextKeys.Battle.Level, _data.Run.LevelOf(type)),
                new Vector2(196f, y), new Vector2(48f, TypeRowPitch - 8f), 18f, TextAlignmentOptions.Center, TextMuted);
            RuntimeUI.TmpLabel(m_rect_TypeTable, MainFont, basis.Chips.ToString(CultureInfo.InvariantCulture),
                new Vector2(244f, y), new Vector2(64f, TypeRowPitch - 8f), 24f, TextAlignmentOptions.Center, ChipsColor);
            RuntimeUI.TmpLabel(m_rect_TypeTable, MainFont,
                table.Format(TextKeys.Battle.Mult, basis.Mult.ToString(CultureInfo.InvariantCulture)),
                new Vector2(300f, y), new Vector2(90f, TypeRowPitch - 8f), 24f, TextAlignmentOptions.Center, MultColor);
            y -= TypeRowPitch;
        }
    }

    /// <summary>右栏:背包摘要(基因 / 道具 / 优惠券 / 方块库)。结算这一屏只报数,不提供买卖。</summary>
    private void BuildInventory(TextTable table)
    {
        RuntimeUI.Clear(m_rect_Inventory);
        if (_data.Run == null) return;

        float y = -8f;
        y = InventoryLine(table.Format(TextKeys.Inventory.Genes, _data.Run.GeneSlotsUsed, _data.Run.GeneSlots), y);
        foreach (GeneSlot gene in _data.Run.Genes) y = InventoryText(ItemNames.Gene(gene), y);
        y -= 10f;
        y = InventoryLine(table.Format(TextKeys.Inventory.Items, _data.Run.Consumables.Count, _data.Run.ConsumableSlots), y);
        foreach (ConsumableItem item in _data.Run.Consumables)
        {
            y = InventoryText(ItemNames.Consumable(_data.Run.Config.Catalog, item), y);
        }
        y -= 10f;
        y = InventoryLine(table.Get(TextKeys.Inventory.Vouchers), y);
        foreach (int voucher in _data.Run.Vouchers) y = InventoryText(table.Get(TextKeys.Voucher(voucher)), y);
        y -= 10f;
        InventoryLine(table.Format(TextKeys.Inventory.Library, _data.Run.Library.Count), y);
    }

    private float InventoryLine(string text, float y)
    {
        RuntimeUI.TmpLabel(m_rect_Inventory, MainFont, text, new Vector2(8f, y), new Vector2(340f, 30f), 20f,
            TextAlignmentOptions.Left, GoldColor);
        return y - 34f;
    }

    private float InventoryText(string text, float y)
    {
        RuntimeUI.TmpLabel(m_rect_Inventory, MainFont, text, new Vector2(16f, y), new Vector2(332f, 26f), 18f,
            TextAlignmentOptions.Left, TextMain);
        return y - 28f;
    }

    /// <summary>顶栏的钱与方块库、以及奖励 / 利息 / 入账 / 持有。输了只留「当前持有」与失败原因。</summary>
    private void BuildMoney(TextTable table, bool won)
    {
        bool show = won && _data.Settlement.HasValue;
        SetActive(m_tmp_RewardNote, show);
        SetActive(m_tmp_Reward, show);
        SetActive(m_tmp_InterestNote, show);
        SetActive(m_tmp_Interest, show);
        SetActive(m_tmp_Income, show);
        SetActive(m_tmp_IncomeLabel, show);
        SetActive(m_tmp_Reason, !won);

        if (!show)
        {
            long now = _data.Settlement?.MoneyAfter ?? 0L;
            m_tmp_Money.text = table.Format(TextKeys.Common.Money, now.ToString(CultureInfo.InvariantCulture));
            m_tmp_Hold.text = table.Format(TextKeys.Common.Money, now.ToString(CultureInfo.InvariantCulture));
            m_tmp_LibraryCount.text = (_data.Run != null ? _data.Run.Library.Count : 0).ToString(CultureInfo.InvariantCulture);
            if (!won) m_tmp_Reason.text = table.Get(TextKeys.FailReasonKey(_data.Reason) ?? TextKeys.Battle.ResultLost);
            return;
        }

        Settlement s = _data.Settlement.Value;
        m_tmp_Money.text = table.Format(TextKeys.Common.Money, s.MoneyAfter.ToString(CultureInfo.InvariantCulture));
        m_tmp_LibraryCount.text = (_data.Run != null ? _data.Run.Library.Count : 0).ToString(CultureInfo.InvariantCulture);
        m_tmp_RewardNote.text = table.Get(TextKeys.BlindNameOf(_data.Layer));
        m_tmp_Reward.text = Signed(s.Reward);
        int before = s.MoneyAfter - s.Total - s.GeneMoney;
        m_tmp_InterestNote.text = table.Format(TextKeys.Battle.ResultInterestNote,
            before.ToString(CultureInfo.InvariantCulture), InterestPer().ToString(CultureInfo.InvariantCulture), "1");
        m_tmp_Interest.text = Signed(s.Interest);
        m_tmp_Income.text = table.Format(TextKeys.Common.Money, s.Total.ToString(CultureInfo.InvariantCulture));
        m_tmp_Hold.text = table.Format(TextKeys.Common.Money, s.MoneyAfter.ToString(CultureInfo.InvariantCulture));
    }

    private void BuildExit(TextTable table, bool won)
    {
        m_btn_Continue.gameObject.SetActive(won);
        m_btn_Back.gameObject.SetActive(!won);
        m_tmp_ContinueLabel.text = table.Get(TextKeys.Battle.ResultEnterShop);
        m_tmp_BackLabel.text = table.Get(TextKeys.Map.Back);
    }

    private int CountOf(ClearType type)
    {
        int[] counts = _data.TypeCounts;
        if (counts == null) return 0;
        for (int i = 0; i < ClearRules.Priority.Count; i++)
        {
            if (ClearRules.Priority[i] == type) return i < counts.Length ? counts[i] : 0;
        }
        return 0;
    }

    /// <summary>利息的「每 $N 得 $1」里的 N,取调参表;读不到时按 10。</summary>
    private static int InterestPer()
    {
        try { return TuningTable.Instance.Config.InterestPer; }
        catch (Exception) { return 10; }
    }

    private static string Signed(int value) => (value >= 0 ? "+$" : "−$") + Math.Abs(value).ToString(CultureInfo.InvariantCulture);

    private static void SetActive(Component component, bool active)
    {
        if (component != null) component.gameObject.SetActive(active);
    }

    /// <summary>TMP 主字体:窗里的静态字都挂着主字体资产,运行期现搭的格子借第一个。</summary>
    private TMP_FontAsset MainFont => m_tmp_Title.font;

    #region 事件

    private partial void OnClick_ContinueBtn() => _data?.Continue?.Invoke();

    private partial void OnClick_BackBtn() => _data?.Back?.Invoke();

    #endregion
}
