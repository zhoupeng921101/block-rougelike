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
}
