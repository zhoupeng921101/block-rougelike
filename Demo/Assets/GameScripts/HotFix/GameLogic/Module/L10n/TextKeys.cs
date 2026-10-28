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
    }

    /// <summary>战斗界面里由代码画的文案;静态标签走预制体上的 LocalizedText,不在这里。</summary>
    public static class Battle
    {
        public const string BlindNormal = "ui.battle.blind_normal";
        public const string CellGain = "ui.battle.cell_gain";
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
        public const string ResultLost = "ui.battle.result_lost";
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
