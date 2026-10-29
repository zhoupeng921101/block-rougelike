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
        public const string Difficulty = "ui.main_menu.difficulty";
    }

    /// <summary>地图屏里由代码画的文案。</summary>
    public static class Map
    {
        public const string Title = "ui.map.title";
        public const string Info = "ui.map.info";
        public const string Back = "ui.map.back";
        public const string Node = "ui.map.node";
        public const string NodeBoss = "ui.map.node_boss";
        public const string NodeSkip = "ui.map.node_skip";
        public const string Boss = "ui.map.boss";
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
        public const string ScoreOf = "ui.battle.score_of";
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
