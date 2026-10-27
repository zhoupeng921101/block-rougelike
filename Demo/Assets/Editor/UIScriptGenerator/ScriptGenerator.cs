using UnityEditor;

/// <summary>
/// 事件回调命名规则（供 ScriptAutoGenerator 的字段/impl 生成共用）与设置入口菜单。
/// 生成主逻辑见 ScriptAutoGenerator.cs。
/// </summary>
public partial class ScriptGenerator
{
    public static string GetBtnFuncName(string varName)
    {
        var codeStyle = ScriptGeneratorSetting.Instance.CodeStyle;
        if (codeStyle == UIFieldCodeStyle.MPrefix)
        {
            return "OnClick" + varName.Replace("m_btn", string.Empty) + "Btn";
        }
        else
        {
            return "OnClick" + varName.Replace("_btn", string.Empty) + "Btn";
        }
    }

    public static string GetToggleFuncName(string varName)
    {
        var codeStyle = ScriptGeneratorSetting.Instance.CodeStyle;
        if (codeStyle == UIFieldCodeStyle.MPrefix)
        {
            return "OnToggle" + varName.Replace("m_toggle", string.Empty) + "Change";
        }
        else
        {
            return "OnToggle" + varName.Replace("_toggle", string.Empty) + "Change";
        }
    }

    public static string GetTMPDropdownFuncName(string varName)
    {
        var codeStyle = ScriptGeneratorSetting.Instance.CodeStyle;
        if (codeStyle == UIFieldCodeStyle.MPrefix)
        {
            return "OnTMPDropdown" + varName.Replace("m_tmpDropdown", string.Empty) + "Change";
        }
        else
        {
            return "OnTMPDropdown" + varName.Replace("_tmpDropdown", string.Empty) + "Change";
        }
    }

    public static string GetSliderFuncName(string varName)
    {
        var codeStyle = ScriptGeneratorSetting.Instance.CodeStyle;
        if (codeStyle == UIFieldCodeStyle.MPrefix)
        {
            return "OnSlider" + varName.Replace("m_slider", string.Empty) + "Change";
        }
        else
        {
            return "OnSlider" + varName.Replace("_slider", string.Empty) + "Change";
        }
    }
}
