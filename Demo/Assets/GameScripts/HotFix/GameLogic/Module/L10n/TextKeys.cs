using System;
using GameRules;

/// <summary>
/// 代码里用到的文本 key 都从这里取;规则核心的枚举到 key 的映射也写在这里,每个要显示的枚举一个 <c>Of(…)</c>。
/// </summary>
/// <remarks>
/// 不得引用 UnityEngine:<c>DotNet/Tests</c> 把本文件链接编译,逐个核对这里的常量、以及每个 <c>Of</c> 对枚举每个值返回的 key 都在
/// <c>AssetRaw/Configs/l10n/texts.json</c> 里。<c>Of</c> 对任何定义过的枚举值都要返回表里有的 key,不返回 null。
/// key 分域:界面文案 <c>ui.&lt;界面&gt;.&lt;元素&gt;</c>,枚举显示文本 <c>&lt;概念&gt;.&lt;值的 snake_case&gt;.&lt;属性&gt;</c>(属性段必写)。
/// </remarks>
public static class TextKeys
{
    public static class MainMenu
    {
        public const string Start = "ui.main_menu.start";
        public const string Continue = "ui.main_menu.continue";
        public const string Language = "ui.main_menu.language";
        public const string LanguageName = "ui.main_menu.language_name";
        public const string Difficulty = "ui.main_menu.difficulty";
        public const string SoundOn = "ui.main_menu.sound_on";
        public const string SoundOff = "ui.main_menu.sound_off";
    }

    /// <summary>地图屏里由代码画的文案。</summary>
    public static class Map
    {
        public const string Title = "ui.map.title";
        public const string Info = "ui.map.info";
        public const string HeaderInfo = "ui.map.header_info";
        public const string Skip = "ui.map.skip";
        public const string NodeLabel = "ui.map.node_label";
        public const string Back = "ui.map.back";
        public const string Node = "ui.map.node";
        public const string NodeBoss = "ui.map.node_boss";
        public const string NodeSkip = "ui.map.node_skip";
        public const string Boss = "ui.map.boss";
        public const string BossPlaceholder = "ui.map.boss_placeholder";
        public const string LayerLight = "ui.map.layer_light";
        public const string LayerHeavy = "ui.map.layer_heavy";
        public const string LayerBoss = "ui.map.layer_boss";
    }

    /// <summary>商店屏里由代码画的文案。</summary>
    public static class Shop
    {
        public const string Title = "ui.shop.title";
        public const string Info = "ui.shop.info";
        public const string Goods = "ui.shop.goods";
        public const string Voucher = "ui.shop.voucher";
        public const string Booster = "ui.shop.booster";
        public const string Pack = "ui.shop.pack";
        public const string PackTitle = "ui.shop.pack_title";
        public const string Sold = "ui.shop.sold";
        public const string Buy = "ui.shop.buy";
        public const string VoucherLabel = "ui.shop.voucher_label";
        public const string BoosterLabel = "ui.shop.booster_label";
        public const string Reroll = "ui.shop.reroll";
        public const string Leave = "ui.shop.leave";
    }

    /// <summary>战斗界面里由代码画的文案;静态标签走预制体上的 LocalizedText,不在这里。</summary>
    public static class Battle
    {
        public const string BlindNormal = "ui.battle.blind_normal";
        public const string Discard = "ui.battle.discard";
        public const string DiscardDrop = "ui.battle.discard_drop";
        public const string DiscardLeft = "ui.battle.discard_left";
        public const string DiscardNone = "ui.battle.discard_none";
        public const string DiscardNoneHint = "ui.battle.discard_none_hint";
        public const string FailBudget = "ui.battle.fail_budget";
        public const string FailStuck = "ui.battle.fail_stuck";
        public const string Gain = "ui.battle.gain";
        public const string LibraryTotal = "ui.battle.library_total";
        public const string Level = "ui.battle.level";
        public const string Mult = "ui.battle.mult";
        public const string Points = "ui.battle.points";
        public const string ResultContinue = "ui.battle.result_continue";
        public const string ResultLost = "ui.battle.result_lost";
        public const string ResultReward = "ui.battle.result_reward";
        public const string ResultScore = "ui.battle.result_score";
        public const string ResultWon = "ui.battle.result_won";
        public const string ResultHeader = "ui.battle.result_header";
        public const string ResultEnterShop = "ui.battle.result_enter_shop";
        public const string ResultBlind = "ui.battle.result_blind";
        public const string ResultTarget = "ui.battle.result_target";
        public const string ResultCombo = "ui.battle.result_combo";
        public const string ResultDist = "ui.battle.result_dist";
        public const string ResultRewardLabel = "ui.battle.result_reward_label";
        public const string ResultInterestLabel = "ui.battle.result_interest_label";
        public const string ResultInterestNote = "ui.battle.result_interest_note";
        public const string ResultIncomeLabel = "ui.battle.result_income_label";
        public const string ResultHoldLabel = "ui.battle.result_hold_label";
        public const string ScoreOf = "ui.battle.score_of";
        public const string TypeHeader = "ui.battle.type_header";
        public const string TypeValueHeader = "ui.battle.type_value_header";
    }

    /// <summary>三个盲注层级的名字(结算屏副标题、奖励行)。层级传 1–3。</summary>
    public static string BlindNameOf(int layer)
    {
        switch (layer)
        {
            case 1: return "ui.blind.normal";
            case 2: return "ui.blind.heavy";
            case 3: return "ui.blind.boss";
            default: return "ui.blind.normal";
        }
    }

    /// <summary>各屏共用的零碎文案。</summary>
    public static class Common
    {
        public const string Money = "ui.common.money";
        public const string Library = "ui.common.library";
    }

    /// <summary>
    /// 盲注失败的原因(结果浮层);<see cref="FailReason.None"/> 没有文案,返回 null。
    /// 不叫 Of:Of 约定枚举的每个取值都有 key(TextTableTests 按此反射核),None 在这里是合法的「没有」。两条文案的 key 由上面的常量受核。
    /// </summary>
    public static string FailReasonKey(FailReason reason)
    {
        switch (reason)
        {
            case FailReason.None: return null;
            case FailReason.BudgetExhausted: return Battle.FailBudget;
            case FailReason.CannotPlace: return Battle.FailStuck;
            default: throw new ArgumentOutOfRangeException(nameof(reason), reason, "不是失败原因");
        }
    }

    /// <summary>主界面的选项、收藏、难度选择三个子页(规则 §8.1、§8.2)。</summary>
    public static class Menu
    {
        public const string Options = "ui.main_menu.options";
        public const string Collection = "ui.main_menu.collection";
        public const string Back = "ui.common.back";
        public const string OptionsTitle = "ui.options.title";
        public const string CollectionTitle = "ui.collection.title";
        public const string CollectionLooks = "ui.collection.looks";
        public const string DifficultyTitle = "ui.difficulty.title";
        public const string DifficultyStart = "ui.difficulty.start";
        public const string DifficultyLocked = "ui.difficulty.locked";
    }

    /// <summary>背包栏(基因、道具、券、方块库),战斗、选关、商店三屏共用。</summary>
    public static class Inventory
    {
        public const string Genes = "ui.inventory.genes";
        public const string Items = "ui.inventory.items";
        public const string Vouchers = "ui.inventory.vouchers";
        public const string Library = "ui.inventory.library";
        public const string Sell = "ui.inventory.sell";
        public const string Use = "ui.inventory.use";
        public const string DragHint = "ui.inventory.drag_hint";
        public const string PickBlock = "ui.inventory.pick_block";
        public const string PickBoardBlock = "ui.inventory.pick_board_block";
        public const string PickSecondBlock = "ui.inventory.pick_second_block";
        public const string PickGene = "ui.inventory.pick_gene";
        public const string Cancel = "ui.inventory.cancel";
        public const string Block = "ui.inventory.block";
        public const string MoveLeft = "ui.inventory.move_left";
        public const string MoveRight = "ui.inventory.move_right";
        public const string Rejected = "ui.inventory.rejected";
        public const string RejectTarget = "ui.inventory.reject_target";
        public const string RejectUsable = "ui.inventory.reject_usable";
        public const string TechDesc = "ui.inventory.tech_desc";
        public const string MapTypes = "ui.map.types";
        public const string MapTypeRow = "ui.map.type_row";
        public const string SkipPack = "ui.shop.skip_pack";
    }

    /// <summary>基因的显示名(最小内容集 1..13 号)。</summary>
    public static string Gene(int geneId) => "gene." + geneId + ".name";

    /// <summary>基因的补充说明(只有带代价的那几张有);表里没有就不显示。</summary>
    public static string GeneDesc(int geneId) => "gene." + geneId + ".desc";

    /// <summary>科技名:每种消除类型一张(最小内容集的科技号 = 类型 + 1)。</summary>
    public static string Tech(ClearType type) => Of(type).Replace("clear_type.", "tech.");

    public static string Mod(int modId) => "mod." + modId + ".name";

    public static string ModDesc(int modId) => "mod." + modId + ".desc";

    public static string Voucher(int voucherId) => "voucher." + voucherId + ".name";

    public static string VoucherDesc(int voucherId) => "voucher." + voucherId + ".desc";

    public static string Booster(int boosterId) => "booster." + boosterId + ".name";

    /// <summary>基因的稀有度名(<see cref="Rarity"/> 的四档)。</summary>
    public static string Rarity(int rarity)
    {
        switch (rarity)
        {
            case GameRules.Rarity.Common: return "rarity.common.name";
            case GameRules.Rarity.Uncommon: return "rarity.uncommon.name";
            case GameRules.Rarity.Rare: return "rarity.rare.name";
            case GameRules.Rarity.Legendary: return "rarity.legendary.name";
            default: throw new ArgumentOutOfRangeException(nameof(rarity), rarity, "不是稀有度");
        }
    }

    /// <summary>难度档的一句说明(难度选择页)。</summary>
    public static string Desc(RunDifficulty difficulty) => Of(difficulty).Replace(".name", ".desc");

    public static string Of(Enhancement enhancement)
    {
        switch (enhancement)
        {
            case Enhancement.None: return "enhancement.none.name";
            case Enhancement.Glass: return "enhancement.glass.name";
            case Enhancement.Steel: return "enhancement.steel.name";
            case Enhancement.Gold: return "enhancement.gold.name";
            case Enhancement.Wild: return "enhancement.wild.name";
            default: throw new ArgumentOutOfRangeException(nameof(enhancement), enhancement, "不是强化");
        }
    }

    public static string Of(Edition edition)
    {
        switch (edition)
        {
            case Edition.None: return "edition.none.name";
            case Edition.Foil: return "edition.foil.name";
            case Edition.Holo: return "edition.holo.name";
            case Edition.Polychrome: return "edition.polychrome.name";
            case Edition.Negative: return "edition.negative.name";
            default: throw new ArgumentOutOfRangeException(nameof(edition), edition, "不是版本");
        }
    }

    /// <summary>三个难度档的显示名。</summary>
    public static string Of(RunDifficulty difficulty)
    {
        switch (difficulty)
        {
            case RunDifficulty.Standard: return "run_difficulty.standard.name";
            case RunDifficulty.Advanced: return "run_difficulty.advanced.name";
            case RunDifficulty.Expert: return "run_difficulty.expert.name";
            default: throw new ArgumentOutOfRangeException(nameof(difficulty), difficulty, "不是难度档");
        }
    }

    /// <summary>节点的强度档(轻 / 中 / 重);首领不在这里,它有自己的文案。</summary>
    public static string Of(NodeStrength strength)
    {
        switch (strength)
        {
            case NodeStrength.Light: return "node_strength.light.name";
            case NodeStrength.Normal: return "node_strength.normal.name";
            case NodeStrength.Heavy: return "node_strength.heavy.name";
            case NodeStrength.Boss: return "node_strength.boss.name";
            default: throw new ArgumentOutOfRangeException(nameof(strength), strength, "不是节点强度");
        }
    }

    /// <summary>商品种类名(商店与补给包里显示)。</summary>
    public static string Of(ItemKind kind)
    {
        switch (kind)
        {
            case ItemKind.Gene: return "item_kind.gene.name";
            case ItemKind.Tech: return "item_kind.tech.name";
            case ItemKind.Mod: return "item_kind.mod.name";
            case ItemKind.Block: return "item_kind.block.name";
            case ItemKind.Booster: return "item_kind.booster.name";
            case ItemKind.Voucher: return "item_kind.voucher.name";
            default: throw new ArgumentOutOfRangeException(nameof(kind), kind, "不是商品种类");
        }
    }

    /// <summary>消除类型名。</summary>
    public static string Of(ClearType type)
    {
        switch (type)
        {
            case ClearType.AllClear: return "clear_type.all_clear.name";
            case ClearType.FiveLine: return "clear_type.five_line.name";
            case ClearType.SameShapeCross: return "clear_type.same_shape_cross.name";
            case ClearType.MultiLine: return "clear_type.multi_line.name";
            case ClearType.SameShape: return "clear_type.same_shape.name";
            case ClearType.TripleLine: return "clear_type.triple_line.name";
            case ClearType.Corner: return "clear_type.corner.name";
            case ClearType.Cross: return "clear_type.cross.name";
            case ClearType.Parallel: return "clear_type.parallel.name";
            case ClearType.DoubleLine: return "clear_type.double_line.name";
            case ClearType.SingleLine: return "clear_type.single_line.name";
            default: throw new ArgumentOutOfRangeException(nameof(type), type, "不是消除类型");
        }
    }
}
