using System.Collections.Generic;
using System.Globalization;
using GameRules;
using TEngine;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.U2D;
using UnityEngine.EventSystems;

/// <summary>
/// 商店屏(局外循环设计稿 §4):上排是玩家的基因槽与道具栏,中间货架 4 格,下面一张券与一个补给包,
/// 底部「刷新」与「离开商店」。买了补给包就在货架里换成包里的候选,可以跳过。
/// 左栏消除类型表与右栏背包摘要走 <see cref="RunChromeView"/>;卡片的图标按物品种类取图集里的图。
/// 卡片全部运行时按容器尺寸现搭,窗里只留空容器。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIShopPanel : UIPanelMono
{
    private const float CardWidth = 210f;
    private const float CardHeight = 330f;
    private const float CardGap = 20f;

    private static readonly Color32 TextMain = new Color32(0xe8, 0xee, 0xf2, 0xFF);
    private static readonly Color32 TextMuted = new Color32(0x8f, 0xa3, 0xb0, 0xFF);
    private static readonly Color32 TextDim = new Color32(0x5c, 0x6f, 0x7a, 0xFF);
    private static readonly Color32 GoldColor = new Color32(0xff, 0xc8, 0x3d, 0xFF);

    /// <summary>基因图标:第一批四张武器(激光炮 / 陨石 / 黑洞 / 导弹)加第二批四张(水晶 / 星 / 盾 / 时钟),按 id 稳定地取一张。</summary>
    private static readonly string[] GeneIcons =
    {
        "run_icon_gene_cannon", "run_icon_gene_meteor", "run_icon_gene_blackhole", "run_icon_gene_missile",
        "run_icon_gene_crystal", "run_icon_item_star", "run_icon_item_shield", "run_icon_item_clock",
    };

    private static readonly string[] TechIcons =
    {
        "run_icon_tech_axis", "run_icon_tech_dual", "run_icon_tech_rail",
    };

    [Tooltip("局外三屏共用件的图集(Atlas_Run):商品图标、面板、按钮都从这里按名取。")]
    [SerializeField] private SpriteAtlas _runAtlas = null!;

    private RunState _run;

    private readonly List<GameObject> _cards = new List<GameObject>();
    private GameObject _detail;

    protected override void OnCreate() => AddServiceEvent(
        () => TextTable.Instance.LanguageChanged += Rebuild,
        () => { if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= Rebuild; });

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

    protected override void OnDestroyWindow() => ClearCards();

    private void Rebuild()
    {
        if (_run == null || _run.Shop == null) return;
        HideDetail();
        ShopState shop = _run.Shop;
        TextTable table = TextTable.Instance;

        m_tmp_Money.text = table.Format(TextKeys.Common.Money, _run.Money.ToString(CultureInfo.InvariantCulture));
        m_tmp_HeaderTitle.text = table.Get(TextKeys.Shop.Title);
        m_tmp_HeaderInfo.text = table.Format(TextKeys.Map.HeaderInfo,
            (_run.Progress.CurrentNodeId == 0 ? 1 : _run.Map.Get(_run.Progress.CurrentNodeId).Segment),
            _run.Map.SegmentCount, table.Get(TextKeys.Of(_run.Difficulty)));
        m_tmp_LibraryCount.text = _run.Library.Count.ToString(CultureInfo.InvariantCulture);
        m_tmp_RerollLabel.text = table.Format(TextKeys.Shop.Reroll, shop.RerollCostFor(_run));
        m_tmp_LeaveLabel.text = table.Get(TextKeys.Shop.Leave);

        RunChromeView.BuildTypeTable(m_rect_TypeTable, MainFont, _run);
        RunChromeView.BuildInventory(m_rect_Inventory, MainFont, _run);
        BuildSlots(table);
        BuildShelf(table, shop);
        BuildSideOffers(table, shop);
    }

    /// <summary>上排:玩家的基因槽与道具栏,只报状态不提供买卖(买卖走右栏)。</summary>
    private void BuildSlots(TextTable table)
    {
        RuntimeUI.Clear(m_rect_Genes);
        RuntimeUI.Clear(m_rect_Items);
        Label(m_rect_Genes, table.Format(TextKeys.Inventory.Genes, _run.GeneSlotsUsed, _run.GeneSlots), 0f, 0f, TextMuted);
        Label(m_rect_Items, table.Format(TextKeys.Inventory.Items, _run.Consumables.Count, _run.ConsumableSlots), 0f, 0f, TextMuted);

        for (int i = 0; i < _run.GeneSlots; i++)
        {
            bool filled = i < _run.Genes.Count;
            Slot(m_rect_Genes, 4f + i * 92f, filled ? GeneIcons[Mathf.Abs(_run.Genes[i].GeneId) % GeneIcons.Length] : string.Empty);
        }
        for (int i = 0; i < _run.ConsumableSlots; i++)
        {
            bool filled = i < _run.Consumables.Count;
            Slot(m_rect_Items, 4f + i * 92f, filled ? IconOf(_run.Consumables[i].Kind, _run.Consumables[i].Id) : string.Empty);
        }
    }

    /// <summary>货架:4 张货卡;开着补给包时换成包里的候选 + 跳过。</summary>
    private void BuildShelf(TextTable table, ShopState shop)
    {
        RuntimeUI.Clear(m_rect_Goods);
        _cards.Clear();

        BoosterPack pack = shop.Pack;
        if (pack != null)
        {
            Label(m_rect_Goods, table.Get(TextKeys.Shop.PackTitle), 0f, 30f, GoldColor, 22f);
            for (int i = 0; i < pack.Options.Count; i++)
            {
                int index = i;
                ShopOffer option = pack.Options[i];
                Card(m_rect_Goods, i, table, option, true, () => ChooseBooster(index));
            }
            var skip = Button(m_rect_Goods, table.Get(TextKeys.Inventory.SkipPack),
                new Vector2(CardWidth * pack.Options.Count + CardGap * pack.Options.Count + 8f, 0f), new Vector2(120f, 44f), "run_btn_secondary");
            skip.onClick.AddListener(SkipBooster);
            return;
        }

        for (int i = 0; i < shop.Goods.Count; i++)
        {
            int index = i;
            ShopOffer offer = shop.Goods[i];
            Card(m_rect_Goods, i, table, offer, !offer.Sold && _run.Money >= offer.Price, () => Buy(index));
        }
    }

    /// <summary>券与补给包:两张横卡。</summary>
    private void BuildSideOffers(TextTable table, ShopState shop)
    {
        RuntimeUI.Clear(m_rect_Voucher);
        RuntimeUI.Clear(m_rect_Booster);
        if (shop.Voucher.HasValue) WideCard(m_rect_Voucher, table, shop.Voucher.Value, () => BuyVoucher(), TextKeys.Shop.VoucherLabel);
        if (shop.Booster.HasValue) WideCard(m_rect_Booster, table, shop.Booster.Value, () => BuyBooster(), TextKeys.Shop.BoosterLabel);
    }

    private void Card(RectTransform host, int index, TextTable table, ShopOffer offer, bool canBuy, System.Action onClick)
    {
        var card = new GameObject("货卡", typeof(RectTransform), typeof(ExImage), typeof(Button));
        card.layer = gameObject.layer;
        card.transform.SetParent(host, false);
        var rt = card.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = new Vector2(8f + index * (CardWidth + CardGap), -4f);
        rt.sizeDelta = new Vector2(CardWidth, CardHeight);
        var frame = card.GetComponent<ExImage>();
        frame.spriteAtlas = _runAtlas;
        frame.SpriteName = "run_panel";
        frame.type = Image.Type.Sliced;
        frame.color = offer.Sold ? new Color(1f, 1f, 1f, 0.55f) : Color.white;
        var button = card.GetComponent<Button>();
        button.targetGraphic = frame;
        button.interactable = canBuy;
        if (canBuy) button.onClick.AddListener(() => onClick());
        _cards.Add(card);
        BindDetail(card, offer);

        // 价签
        PriceTag(card.transform, table.Format(TextKeys.Common.Money, offer.Price.ToString(CultureInfo.InvariantCulture)), 4f);
        // 图标
        IconImage(card.transform, IconOf(offer.Kind, offer.Id), new Vector2(24f, -60f), new Vector2(80f, 80f));
        // 名字
        Label(card.transform, ItemNames.Offer(_run.Config.Catalog, offer), 16f, 146f, TextMain, 20f, CardWidth - 32f, 48f, true);
        // 种类 · 稀有度
        Label(card.transform, table.Get(TextKeys.Of(offer.Kind)), 16f, 198f, TextMuted, 16f, CardWidth - 32f, 22f);
        Label(card.transform, DescriptionOf(offer), 16f, 224f, TextMain, 15f,
            CardWidth - 32f, 48f, true);
        // 买
        if (offer.Sold)
        {
            Label(card.transform, table.Get(TextKeys.Shop.Sold), 0f, CardHeight - 56f, TextDim, 22f, CardWidth, 36f);
        }
        else
        {
            var buy = Button(card.transform, table.Get(TextKeys.Shop.Buy), new Vector2((CardWidth - 170f) * 0.5f, -(CardHeight - 60f)),
                new Vector2(170f, 44f), canBuy ? "run_btn_primary" : "run_btn_secondary");
            buy.interactable = canBuy;
            if (canBuy) buy.onClick.AddListener(() => onClick());
        }
    }

    private void WideCard(RectTransform host, TextTable table, ShopOffer offer, System.Action onClick, string labelKey)
    {
        var card = new GameObject("横卡", typeof(RectTransform), typeof(ExImage), typeof(Button));
        card.layer = gameObject.layer;
        card.transform.SetParent(host, false);
        var rt = card.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = new Vector2(4f, -4f);
        rt.sizeDelta = new Vector2(host.rect.width - 8f, 160f);
        var frame = card.GetComponent<ExImage>();
        frame.spriteAtlas = _runAtlas;
        frame.SpriteName = "run_panel";
        frame.type = Image.Type.Sliced;
        frame.color = Color.white;
        var button = card.GetComponent<Button>();
        button.targetGraphic = frame;
        button.interactable = _run.Money >= offer.Price;
        if (button.interactable) button.onClick.AddListener(() => onClick());
        _cards.Add(card);
        BindDetail(card, offer);

        Label(card.transform, table.Get(labelKey), 12f, 8f, TextMuted, 18f, 300f, 26f);
        IconImage(card.transform, IconOf(offer.Kind, offer.Id), new Vector2(16f, -44f), new Vector2(72f, 72f));
        Label(card.transform, ItemNames.Offer(_run.Config.Catalog, offer), 100f, 40f, TextMain, 22f, rt.sizeDelta.x - 240f, 60f, true);
        Label(card.transform, DescriptionOf(offer), 100f, 96f, TextMuted, 16f,
            rt.sizeDelta.x - 116f, 56f, true);
        Label(card.transform, table.Format(TextKeys.Common.Money, offer.Price.ToString(CultureInfo.InvariantCulture)),
            rt.sizeDelta.x - 130f, 44f, GoldColor, 30f, 110f, 36f);

    }

    private void PriceTag(Transform parent, string price, float x)
    {
        var tag = new GameObject("价签", typeof(RectTransform), typeof(ExImage));
        tag.layer = gameObject.layer;
        tag.transform.SetParent(parent, false);
        var rt = tag.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = new Vector2(x, -10f);
        rt.sizeDelta = new Vector2(72f, 32f);
        var ex = tag.GetComponent<ExImage>();
        ex.spriteAtlas = _runAtlas;
        ex.SpriteName = "run_cell";
        ex.type = Image.Type.Sliced;
        Label(tag.transform, price, 0f, 0f, GoldColor, 20f, 72f, 32f);
    }

    private void IconImage(Transform parent, string spriteName, Vector2 topLeft, Vector2 size)
    {
        var go = new GameObject("图标", typeof(RectTransform), typeof(ExImage));
        go.layer = gameObject.layer;
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = topLeft;
        rt.sizeDelta = size;
        var ex = go.GetComponent<ExImage>();
        ex.spriteAtlas = _runAtlas;
        ex.SpriteName = spriteName;
        ex.raycastTarget = false;
    }

    private void Slot(RectTransform host, float x, string spriteName)
    {
        var go = new GameObject("槽", typeof(RectTransform), typeof(ExImage));
        go.layer = gameObject.layer;
        go.transform.SetParent(host, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = new Vector2(x, -30f);
        rt.sizeDelta = new Vector2(84f, 64f);
        var ex = go.GetComponent<ExImage>();
        ex.spriteAtlas = _runAtlas;
        ex.SpriteName = string.IsNullOrEmpty(spriteName) ? "run_cell_dashed" : "run_cell";
        ex.type = Image.Type.Sliced;
        ex.raycastTarget = false;
        if (!string.IsNullOrEmpty(spriteName))
        {
            IconImage(go.transform, spriteName, new Vector2(12f, -4f), new Vector2(60f, 60f));
        }
    }

    /// <summary>左上角锚定的一行字(可换行)。</summary>
    private void Label(Transform parent, string text, float x, float y, Color color, float size = 20f, float width = 300f,
        float height = 28f, bool wrap = false)
    {
        var go = new GameObject("文字", typeof(RectTransform), typeof(TextMeshProUGUI));
        go.layer = gameObject.layer;
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = new Vector2(x, -y);
        rt.sizeDelta = new Vector2(width, height);
        var tmp = go.GetComponent<TextMeshProUGUI>();
        tmp.font = MainFont;
        tmp.text = text;
        tmp.fontSize = size;
        tmp.color = color;
        tmp.alignment = TextAlignmentOptions.TopLeft;
        tmp.enableWordWrapping = wrap;
        tmp.raycastTarget = false;
    }

    /// <summary>一张用图集切图当底的按钮(文字居中)。</summary>
    private Button Button(Transform parent, string text, Vector2 topLeft, Vector2 size, string spriteName)
    {
        var go = new GameObject("按钮", typeof(RectTransform), typeof(ExImage), typeof(Button));
        go.layer = gameObject.layer;
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = topLeft;
        rt.sizeDelta = size;
        var ex = go.GetComponent<ExImage>();
        ex.spriteAtlas = _runAtlas;
        ex.SpriteName = spriteName;
        ex.type = Image.Type.Sliced;
        var button = go.GetComponent<Button>();
        button.targetGraphic = ex;

        var label = new GameObject("文字", typeof(RectTransform), typeof(TextMeshProUGUI));
        label.layer = gameObject.layer;
        label.transform.SetParent(go.transform, false);
        var lrt = label.GetComponent<RectTransform>();
        lrt.anchorMin = Vector2.zero;
        lrt.anchorMax = Vector2.one;
        lrt.offsetMin = lrt.offsetMax = Vector2.zero;
        var tmp = label.GetComponent<TextMeshProUGUI>();
        tmp.font = MainFont;
        tmp.text = text;
        tmp.fontSize = 22f;
        tmp.color = TextMain;
        tmp.alignment = TextAlignmentOptions.Center;
        tmp.raycastTarget = false;
        return button;
    }

    /// <summary>物品种类 → 图集里的图标名。基因按 id 取,其余按种类;补给包再按包的种类细分。</summary>
    private string IconOf(ItemKind kind, int id)
    {
        switch (kind)
        {
            case ItemKind.Gene: return GeneIcons[Mathf.Abs(id) % GeneIcons.Length];
            case ItemKind.Tech: return TechIcons[Mathf.Abs(id) % TechIcons.Length];
            case ItemKind.Mod: return "run_icon_mod_ironcore";
            case ItemKind.Block: return BlockIcon(id);
            case ItemKind.Voucher: return "run_icon_coupon";
            case ItemKind.Booster:
                switch (id)
                {
                    case 2: return "run_icon_pack_tech";
                    case 3: return "run_icon_mod_ironcore";
                    case 4: return "run_icon_pack_block";
                    case 5: return "run_icon_item_star";
                    default: return "run_icon_pack_gene";
                }
            default: return "run_icon_pack_gene";
        }
    }

    /// <summary>方块类的货:按方块种类取那张迷你骨牌(和右栏方块库同一个图标)。</summary>
    private string BlockIcon(int blockId)
    {
        foreach (BlockEntry block in _run.Config.Catalog.Blocks)
        {
            if (block.Id == blockId) return "run_libblock_" + block.Kind.ToString().ToLowerInvariant();
        }
        return "run_icon_pack_block";
    }

    private void Buy(int index) => AfterBuy(_run.Shop.TryBuy(index, _run), "买货");

    private void BuyVoucher() => AfterBuy(_run.Shop.TryBuyVoucher(_run), "买券");

    private void BuyBooster() => AfterBuy(_run.Shop.TryBuyBooster(_run.ShopRng(), _run), "买补给包");

    private void ChooseBooster(int index) => AfterBuy(_run.Shop.ChooseBooster(index, _run), "开包");

    private void SkipBooster()
    {
        if (_run.Shop.SkipBooster()) RunSaveService.Instance.CommitRun(_run, "跳过补给包");
        Rebuild();
    }

    private void AfterBuy(ShopBuyResult result, string what)
    {
        if (result == ShopBuyResult.Ok) RunSaveService.Instance.CommitRun(_run, what);
        else Log.Info("[UIShopPanel] " + what + "没成功:" + result);
        Rebuild();
    }

    private void ClearCards()
    {
        HideDetail();
        foreach (GameObject go in _cards) Destroy(go);
        _cards.Clear();
    }

    private void BindDetail(GameObject card, ShopOffer offer)
    {
        var trigger = card.AddComponent<EventTrigger>();
        var enter = new EventTrigger.Entry { eventID = EventTriggerType.PointerEnter };
        enter.callback.AddListener(_ => ShowDetail(card, offer));
        trigger.triggers.Add(enter);
        var exit = new EventTrigger.Entry { eventID = EventTriggerType.PointerExit };
        exit.callback.AddListener(_ => HideDetail());
        trigger.triggers.Add(exit);
    }

    private void ShowDetail(GameObject card, ShopOffer offer)
    {
        HideDetail();
        string description = DescriptionOf(offer);
        if (string.IsNullOrEmpty(description)) return;

        var root = (RectTransform)transform;
        var cardRect = (RectTransform)card.transform;
        Vector3[] corners = new Vector3[4];
        cardRect.GetWorldCorners(corners);
        Vector2 topRight = root.InverseTransformPoint(corners[2]);
        Vector2 topLeft = root.InverseTransformPoint(corners[1]);
        const float width = 400f;
        const float height = 220f;
        float x = topRight.x + 12f;
        if (x + width > root.rect.xMax - 12f) x = topLeft.x - width - 12f;
        float y = Mathf.Min(topLeft.y, root.rect.yMax - 12f);
        y = Mathf.Max(y, root.rect.yMin + height + 12f);

        _detail = new GameObject("商品说明", typeof(RectTransform), typeof(ExImage));
        _detail.layer = gameObject.layer;
        _detail.transform.SetParent(root, false);
        var rt = (RectTransform)_detail.transform;
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 0f);
        rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = new Vector2(x - root.rect.xMin, y - root.rect.yMin);
        rt.sizeDelta = new Vector2(width, height);
        var frame = _detail.GetComponent<ExImage>();
        frame.spriteAtlas = _runAtlas;
        frame.SpriteName = "run_panel";
        frame.type = Image.Type.Sliced;
        frame.raycastTarget = false;
        Label(rt, ItemNames.Offer(_run.Config.Catalog, offer), 20f, 16f, TextMain, 23f, width - 40f, 54f, true);
        Label(rt, description, 20f, 74f, TextMain, 19f, width - 40f, height - 90f, true);
    }

    private void HideDetail()
    {
        if (_detail != null) Destroy(_detail);
        _detail = null;
    }

    private string DescriptionOf(ShopOffer offer)
    {
        if (offer.Kind != ItemKind.Tech) return ItemNames.OfferDesc(_run.Config.Catalog, offer);
        ClearType type = _run.Config.Catalog.TechTypeOf(offer.Id);
        int level = _run.LevelOf(type);
        string name = TextTable.Instance.Get(TextKeys.Of(type));
        if (level >= _run.Config.ClearTypes.MaxLevel(type))
            return TextTable.Instance.Format(TextKeys.Shop.TechMax, name, level);
        ClearTypeBase current = _run.Config.ClearTypes.Get(type, level);
        ClearTypeBase next = _run.Config.ClearTypes.Get(type, level + 1);
        return TextTable.Instance.Format(TextKeys.Shop.TechUpgrade, name, level, level + 1,
            current.Chips, next.Chips, current.Mult, next.Mult);
    }

    /// <summary>TMP 主字体:静态字挂着主字体资产,运行期现搭的卡片借它。</summary>
    private TMP_FontAsset MainFont => m_tmp_HeaderTitle.font;

    #region 事件

    private partial void OnClick_RerollBtn()
    {
        if (_run.Shop.TryReroll(_run.ShopRng(), _run)) RunSaveService.Instance.CommitRun(_run, "刷新商店");
        Rebuild();
    }

    private partial void OnClick_LeaveBtn() => RunFlow.LeaveShop(_run);

    #endregion
}
