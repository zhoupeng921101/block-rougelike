using GameRules;

/// <summary>
/// 一局里各件东西的显示名:基因(带版本)、科技、改造、优惠券、补给包、方块(带点数、强化、版本)。
/// 商店、选关、战斗、收藏四处都按这里拼,改一处名字的写法不必四处追。
/// </summary>
public static class ItemNames
{
    public static string Gene(int geneId, Edition edition = Edition.None)
    {
        TextTable table = TextTable.Instance;
        string name = table.Get(TextKeys.Gene(geneId));
        return edition == Edition.None ? name : name + " [" + table.Get(TextKeys.Of(edition)) + "]";
    }

    public static string Gene(GeneSlot slot) => Gene(slot.GeneId, slot.Edition);

    public static string Tech(ContentCatalog catalog, int techId) =>
        catalog.HasTech(techId) ? TextTable.Instance.Get(TextKeys.Tech(catalog.TechTypeOf(techId))) : "#" + techId;

    public static string Consumable(ContentCatalog catalog, ConsumableItem item) =>
        item.Kind == ItemKind.Tech ? Tech(catalog, item.Id) : TextTable.Instance.Get(TextKeys.Mod(item.Id));

    /// <summary>消耗品的一句说明:科技说升哪一类,改造读说明表。</summary>
    public static string ConsumableDesc(ContentCatalog catalog, ConsumableItem item)
    {
        TextTable table = TextTable.Instance;
        if (item.Kind != ItemKind.Tech) return table.Get(TextKeys.ModDesc(item.Id));
        return catalog.HasTech(item.Id) ? table.Format(TextKeys.Inventory.TechDesc, table.Get(TextKeys.Of(catalog.TechTypeOf(item.Id)))) : string.Empty;
    }

    public static string Block(TetrominoKind kind, int points, Enhancement enhancement, Edition edition)
    {
        TextTable table = TextTable.Instance;
        string extra = string.Empty;
        if (enhancement != Enhancement.None) extra += table.Get(TextKeys.Of(enhancement));
        if (edition != Edition.None) extra += (extra.Length > 0 ? "·" : string.Empty) + table.Get(TextKeys.Of(edition));
        return table.Format(TextKeys.Inventory.Block, kind.ToString(), points, extra).TrimEnd();
    }

    public static string Block(BlockInstance b) => Block(b.Kind, b.Points, b.Enhancement, b.Edition);

    /// <summary>商店货格与补给包候选:基因带版本,方块带点数、强化与版本,其余按种类读名字表。</summary>
    public static string Offer(ContentCatalog catalog, ShopOffer offer)
    {
        TextTable table = TextTable.Instance;
        switch (offer.Kind)
        {
            case ItemKind.Gene:
                return Gene(offer.Id, offer.Edition);
            case ItemKind.Tech:
                return Tech(catalog, offer.Id);
            case ItemKind.Mod:
                return table.Get(TextKeys.Mod(offer.Id));
            case ItemKind.Voucher:
                return table.Get(TextKeys.Voucher(offer.Id));
            case ItemKind.Booster:
                return table.Get(TextKeys.Booster(offer.Id));
            case ItemKind.Block:
                foreach (BlockEntry b in catalog.Blocks)
                {
                    if (b.Id == offer.Id) return Block(b.Kind, b.Points, offer.Enhancement, offer.Edition);
                }
                return table.Get(TextKeys.Of(offer.Kind)) + " #" + offer.Id;
            default:
                return table.Get(TextKeys.Of(offer.Kind)) + " #" + offer.Id;
        }
    }

    public static string OfferDesc(ContentCatalog catalog, ShopOffer offer)
    {
        TextTable table = TextTable.Instance;
        switch (offer.Kind)
        {
            case ItemKind.Gene: return table.Get(TextKeys.GeneDesc(offer.Id));
            case ItemKind.Tech: return ConsumableDesc(catalog, ConsumableItem.Tech(offer.Id));
            case ItemKind.Mod: return table.Get(TextKeys.ModDesc(offer.Id));
            case ItemKind.Voucher: return table.Get(TextKeys.VoucherDesc(offer.Id));
            case ItemKind.Booster: return table.Get(TextKeys.BoosterDesc(offer.Id));
            case ItemKind.Block: return table.Get(TextKeys.Shop.BlockDesc);
            default: return string.Empty;
        }
    }

    /// <summary>被拒的原因,给提示条用。</summary>
    public static string Reject(UseReject reject)
    {
        TextTable table = TextTable.Instance;
        string why = table.Get(reject == UseReject.BadTarget ? TextKeys.Inventory.RejectTarget : TextKeys.Inventory.RejectUsable);
        return table.Format(TextKeys.Inventory.Rejected, why);
    }
}
