using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>商店与补给包里的东西分这几类;号段各自独立,不跨类复用。</summary>
    public enum ItemKind
    {
        Gene = 0,
        Tech = 1,
        Mod = 2,
        Block = 3,
        Booster = 4,
        Voucher = 5,
    }

    /// <summary>基因的稀有度(规则 §4.1):四档。传说不进商店,只在基因补给包里以极低概率出现(规则 §2.5)。</summary>
    public static class Rarity
    {
        public const int Common = 0;
        public const int Uncommon = 1;
        public const int Rare = 2;
        public const int Legendary = 3;
    }

    /// <summary>目录里的一件商品:种类、号、基础价、稀有度(<see cref="GameRules.Rarity"/>,只有基因用)。</summary>
    public readonly struct CatalogEntry
    {
        public readonly ItemKind Kind;
        public readonly int Id;
        public readonly int Price;
        public readonly int Rarity;

        public CatalogEntry(ItemKind kind, int id, int price, int rarity = 0)
        {
            Kind = kind;
            Id = id;
            Price = price;
            Rarity = rarity;
        }
    }

    /// <summary>可买方块:种类与点数决定它在方块库里的样子,价格按点数定。</summary>
    public readonly struct BlockEntry
    {
        public readonly int Id;
        public readonly TetrominoKind Kind;
        public readonly int Points;
        public readonly int Price;

        public BlockEntry(int id, TetrominoKind kind, int points, int price)
        {
            Id = id;
            Kind = kind;
            Points = points;
            Price = price;
        }
    }

    /// <summary>
    /// 本局可出现的商品目录(局外循环设计稿 §4):商店从这几张池子里抽,价格也在这里。
    /// 是开局配置的一部分,不进存档;阶段 5 先用手写的最小集,接 Luban 后改成表生成。
    /// </summary>
    public sealed class ContentCatalog
    {
        private readonly Dictionary<int, ClearType> _techTypes;

        public IReadOnlyList<CatalogEntry> Genes { get; }
        public IReadOnlyList<CatalogEntry> Techs { get; }
        public IReadOnlyList<CatalogEntry> Mods { get; }
        public IReadOnlyList<CatalogEntry> Boosters { get; }
        public IReadOnlyList<CatalogEntry> Vouchers { get; }
        public IReadOnlyList<BlockEntry> Blocks { get; }

        public ContentCatalog(IEnumerable<CatalogEntry> genes, IEnumerable<CatalogEntry> techs, IEnumerable<CatalogEntry> mods,
            IEnumerable<CatalogEntry> boosters, IEnumerable<CatalogEntry> vouchers, IEnumerable<BlockEntry> blocks,
            IDictionary<int, ClearType> techTypes)
        {
            Genes = Copy(genes);
            Techs = Copy(techs);
            Mods = Copy(mods);
            Boosters = Copy(boosters);
            Vouchers = Copy(vouchers);
            Blocks = blocks == null ? new List<BlockEntry>().AsReadOnly() : new List<BlockEntry>(blocks).AsReadOnly();
            _techTypes = techTypes == null ? new Dictionary<int, ClearType>() : new Dictionary<int, ClearType>(techTypes);
        }

        /// <summary>科技号 → 它升级的消除类型。号不在表里抛异常(目录与科技表必须一起给)。</summary>
        public ClearType TechTypeOf(int techId)
        {
            if (!_techTypes.TryGetValue(techId, out ClearType type))
            {
                throw new ArgumentOutOfRangeException(nameof(techId), techId, "目录里没有这张科技");
            }
            return type;
        }

        public bool HasTech(int techId) => _techTypes.ContainsKey(techId);

        /// <summary>按种类与号查目录里的一件(卖价按它的基础价算);方块与查不到的返回 null。</summary>
        public CatalogEntry? Find(ItemKind kind, int id)
        {
            IReadOnlyList<CatalogEntry> pool;
            switch (kind)
            {
                case ItemKind.Gene: pool = Genes; break;
                case ItemKind.Tech: pool = Techs; break;
                case ItemKind.Mod: pool = Mods; break;
                case ItemKind.Booster: pool = Boosters; break;
                case ItemKind.Voucher: pool = Vouchers; break;
                default: return null;
            }
            foreach (CatalogEntry e in pool)
            {
                if (e.Id == id) return e;
            }
            return null;
        }

        public static ContentCatalog Empty { get; } = new ContentCatalog(
            Array.Empty<CatalogEntry>(), Array.Empty<CatalogEntry>(), Array.Empty<CatalogEntry>(),
            Array.Empty<CatalogEntry>(), Array.Empty<CatalogEntry>(), Array.Empty<BlockEntry>(), null);

        private static IReadOnlyList<CatalogEntry> Copy(IEnumerable<CatalogEntry> entries) =>
            entries == null ? new List<CatalogEntry>().AsReadOnly() : new List<CatalogEntry>(entries).AsReadOnly();
    }
}
