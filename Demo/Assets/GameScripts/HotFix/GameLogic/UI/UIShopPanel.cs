using System.Collections.Generic;
using System.Globalization;
using GameRules;
using TEngine;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 商店屏(局外循环设计稿 §4):4 个货格 + 一张券 + 一个补给包,刷新与离店两个按钮。
/// 货格按钮按状态运行时生成(窗里只留空容器 <c>m_rect_Goods</c>);买了补给包就在同一个容器里换成包里的候选。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIShopPanel : UIPanelMono
{
    private RunState _run;

    private readonly List<GameObject> _entries = new List<GameObject>();

    protected override void OnCreate()
    {
        AddServiceEvent(
            () => TextTable.Instance.LanguageChanged += Rebuild,
            () => { if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= Rebuild; });
    }

    protected override void OnRefresh()
    {
        _run = UserData as RunState;
        if (_run == null || _run.Shop == null)
        {
            Log.Error("[UIShopPanel] 打开时没有传入开着商店的 RunState,回地图");
            if (_run != null) RunFlow.BackToMenu();
            return;
        }
        Rebuild();
    }

    protected override void OnDestroyWindow() => ClearEntries();

    private void Rebuild()
    {
        if (_run == null || _run.Shop == null) return;
        ShopState shop = _run.Shop;
        TextTable table = TextTable.Instance;
        m_text_Title.text = table.Get(TextKeys.Shop.Title);
        m_text_Info.text = table.Format(TextKeys.Shop.Info,
            _run.Money.ToString(CultureInfo.InvariantCulture),
            shop.RerollCostFor(_run).ToString(CultureInfo.InvariantCulture));
        SetButtonLabel(m_btn_Reroll, table.Format(TextKeys.Shop.Reroll, shop.RerollCostFor(_run)));
        SetButtonLabel(m_btn_Leave, table.Get(TextKeys.Shop.Leave));
        ClearEntries();

        BoosterPack pack = shop.Pack;
        if (pack != null)
        {
            AddHeader(table.Get(TextKeys.Shop.PackTitle));
            for (int i = 0; i < pack.Options.Count; i++)
            {
                int index = i;
                ShopOffer option = pack.Options[i];
                AddEntry(Describe(table, option), true, () => ChooseBooster(index));
            }
            return;
        }

        for (int i = 0; i < shop.Goods.Count; i++)
        {
            int index = i;
            ShopOffer offer = shop.Goods[i];
            AddEntry(Describe(table, offer), !offer.Sold, () => Buy(index));
        }
        if (shop.Voucher.HasValue)
        {
            ShopOffer offer = shop.Voucher.Value;
            AddEntry(table.Format(TextKeys.Shop.Voucher, table.Get(TextKeys.Of(offer.Kind)), offer.Price), true, BuyVoucher);
        }
        if (shop.Booster.HasValue)
        {
            ShopOffer offer = shop.Booster.Value;
            AddEntry(table.Format(TextKeys.Shop.Booster, "#" + offer.Id.ToString(CultureInfo.InvariantCulture), offer.Price), true, BuyBooster);
        }
    }

    private static string Describe(TextTable table, ShopOffer offer)
    {
        if (offer.Sold) return table.Get(TextKeys.Shop.Sold);
        // 基因有名字(如「点 +30」)就显示名字,其余按「种类 #号」显示
        string name = table.Has(TextKeys.Gene(offer.Id))
            ? table.Get(TextKeys.Gene(offer.Id))
            : table.Get(TextKeys.Of(offer.Kind)) + " #" + offer.Id.ToString(CultureInfo.InvariantCulture);
        return table.Format(TextKeys.Shop.Goods, name, offer.Price.ToString(CultureInfo.InvariantCulture));
    }

    private void Buy(int index) => AfterBuy(_run.Shop.TryBuy(index, _run), "买货");

    private void BuyVoucher() => AfterBuy(_run.Shop.TryBuyVoucher(_run), "买券");

    private void BuyBooster() => AfterBuy(_run.Shop.TryBuyBooster(_run.ShopRng(), _run), "买补给包");

    private void ChooseBooster(int index) => AfterBuy(_run.Shop.ChooseBooster(index, _run), "开包");

    private void AfterBuy(ShopBuyResult result, string what)
    {
        if (result == ShopBuyResult.Ok) RunSaveService.Instance.CommitRun(_run, what);
        else Log.Info("[UIShopPanel] " + what + "没成功:" + result);
        Rebuild();
    }

    private void ClearEntries()
    {
        foreach (GameObject go in _entries) Destroy(go);
        _entries.Clear();
    }

    /// <summary>一行一行的买货按钮:纵向排在 <c>m_rect_Goods</c> 里。</summary>
    private void AddEntry(string label, bool enabled, System.Action onClick)
    {
        var go = new GameObject("Entry_" + _entries.Count, typeof(RectTransform), typeof(Image), typeof(Button));
        go.layer = gameObject.layer;
        go.transform.SetParent(m_rect_Goods, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = new Vector2(0.5f, 1f);
        rt.anchorMax = new Vector2(0.5f, 1f);
        rt.pivot = new Vector2(0.5f, 1f);
        rt.anchoredPosition = new Vector2(0f, -_entries.Count * 96f);
        rt.sizeDelta = new Vector2(900f, 84f);

        Image image = go.GetComponent<Image>();
        image.color = enabled ? new Color(0.2f, 0.23f, 0.34f, 1f) : new Color(0.14f, 0.15f, 0.2f, 1f);
        Button button = go.GetComponent<Button>();
        button.targetGraphic = image;
        button.interactable = enabled;
        if (enabled) button.onClick.AddListener(() => onClick());

        var labelGo = new GameObject("文字", typeof(RectTransform), typeof(Text));
        labelGo.layer = gameObject.layer;
        labelGo.transform.SetParent(go.transform, false);
        var labelRt = labelGo.GetComponent<RectTransform>();
        labelRt.anchorMin = Vector2.zero;
        labelRt.anchorMax = Vector2.one;
        labelRt.offsetMin = Vector2.zero;
        labelRt.offsetMax = Vector2.zero;
        Text text = labelGo.GetComponent<Text>();
        text.font = m_text_Title.font;
        text.fontSize = 28;
        text.alignment = TextAnchor.MiddleCenter;
        text.color = enabled ? new Color(0.95f, 0.95f, 1f, 1f) : new Color(0.5f, 0.52f, 0.6f, 1f);
        text.horizontalOverflow = HorizontalWrapMode.Wrap;
        text.verticalOverflow = VerticalWrapMode.Truncate;
        text.text = label;
        _entries.Add(go);
    }

    private void AddHeader(string label)
    {
        var go = new GameObject("Header", typeof(RectTransform), typeof(Text));
        go.layer = gameObject.layer;
        go.transform.SetParent(m_rect_Goods, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = new Vector2(0.5f, 1f);
        rt.anchorMax = new Vector2(0.5f, 1f);
        rt.pivot = new Vector2(0.5f, 1f);
        rt.anchoredPosition = new Vector2(0f, -_entries.Count * 96f);
        rt.sizeDelta = new Vector2(900f, 48f);
        Text text = go.GetComponent<Text>();
        text.font = m_text_Title.font;
        text.fontSize = 30;
        text.alignment = TextAnchor.MiddleCenter;
        text.color = new Color(1f, 0.839f, 0.361f, 1f);
        text.text = label;
        _entries.Add(go);
    }

    private static void SetButtonLabel(Button button, string text)
    {
        Text label = button.GetComponentInChildren<Text>(true);
        if (label != null) label.text = text;
    }

    #region 事件

    private partial void OnClick_RerollBtn()
    {
        if (_run.Shop.TryReroll(_run.ShopRng(), _run)) RunSaveService.Instance.CommitRun(_run, "刷新商店");
        Rebuild();
    }

    private partial void OnClick_LeaveBtn() => RunFlow.LeaveShop(_run);

    #endregion
}
