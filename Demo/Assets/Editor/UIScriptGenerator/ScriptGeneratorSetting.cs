using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

[System.Serializable]
[CreateAssetMenu(menuName = "TEngine/ScriptGeneratorSetting", fileName = "ScriptGeneratorSetting")]
public class ScriptGeneratorSetting : ScriptableObject
{
    private static ScriptGeneratorSetting _instance;

    public static ScriptGeneratorSetting Instance
    {
        get
        {
            if (_instance == null)
            {
                string[] guids = AssetDatabase.FindAssets("t:ScriptGeneratorSetting");
                if (guids.Length >= 1)
                {
                    string path = AssetDatabase.GUIDToAssetPath(guids[0]);
                    _instance = AssetDatabase.LoadAssetAtPath<ScriptGeneratorSetting>(path);
                }
            }
            return _instance;
        }
    }

    // 窗代码有两个根:游戏层 GameLogic(缺省)与底座层 GameBase。窗的 impl 与它的 _Gen 是同一个 partial 类,
    // 必须落在同一个程序集里,故 Gen 一律跟着 impl 所在的根走(见 ResolveGenCodePath)。
    [SerializeField] private string genCodePath = "Assets/GameScripts/HotFix/GameLogic/UI/Gen";
    [SerializeField] private string impCodePath = "Assets/GameScripts/HotFix/GameLogic/UI";
    [SerializeField] private string baseGenCodePath = "Assets/GameScripts/HotFix/GameBase/UI/Gen";
    [SerializeField] private string baseImpCodePath = "Assets/GameScripts/HotFix/GameBase/UI";

    // [LabelText("绑定代码命名空间")]
    [SerializeField]
    private string _namespace = "GameLogic";

    // [LabelText("子组件名称(不会往下继续遍历)")]
    [SerializeField]
    private string _widgetName = "item";

    public string GenCodePath => genCodePath;
    public string ImpCodePath => impCodePath;
    public string BaseGenCodePath => baseGenCodePath;
    public string BaseImpCodePath => baseImpCodePath;

    public string Namespace => _namespace;

    public string WidgetName => _widgetName;

    public UIFieldCodeStyle CodeStyle = UIFieldCodeStyle.UnderscorePrefix;

    [SerializeField]
    // 生成器只产窗一档：Part 是手写的裸 MonoBehaviour 单文件，不由生成器产出。
    private List<UIGenType> uiGenTypes = new List<UIGenType>()
    {
        new UIGenType("UIPanelMono", false),
    };
    public List<UIGenType> UIGenTypes => uiGenTypes;

    public bool NullableEnable;

    [SerializeField]
    private List<ScriptGenerateRuler> scriptGenerateRule = new List<ScriptGenerateRuler>()
    {
        new ScriptGenerateRuler("m_go", UIComponentName.GameObject),
        // m_part 须排在 m_item 之前:两者都作遍历边界,但 m_part 绑 Part 组件类型、m_item 绑 GameObject,
        // 规则按顺序取首个 StartsWith 命中项,顺序颠倒会让 m_part_X 落到 m_item 分支绑成 GameObject。
        new ScriptGenerateRuler("m_part", UIComponentName.UIPart, isUIWidget: true),
        new ScriptGenerateRuler("m_item", UIComponentName.GameObject, isUIWidget: true),
        new ScriptGenerateRuler("m_tf", UIComponentName.Transform),
        new ScriptGenerateRuler("m_rect", UIComponentName.RectTransform),
        new ScriptGenerateRuler("m_text", UIComponentName.Text),
        new ScriptGenerateRuler("m_richText", UIComponentName.RichTextItem),
        new ScriptGenerateRuler("m_btn", UIComponentName.Button),
        new ScriptGenerateRuler("m_img", UIComponentName.Image),
        new ScriptGenerateRuler("m_rimg", UIComponentName.RawImage),
        new ScriptGenerateRuler("m_scrollBar", UIComponentName.Scrollbar),
        new ScriptGenerateRuler("m_scroll", UIComponentName.ScrollRect),
        new ScriptGenerateRuler("m_input", UIComponentName.InputField),
        new ScriptGenerateRuler("m_grid", UIComponentName.GridLayoutGroup),
        new ScriptGenerateRuler("m_hlay", UIComponentName.HorizontalLayoutGroup),
        new ScriptGenerateRuler("m_vlay", UIComponentName.VerticalLayoutGroup),
        new ScriptGenerateRuler("m_slider", UIComponentName.Slider),
        new ScriptGenerateRuler("m_group", UIComponentName.ToggleGroup),
        new ScriptGenerateRuler("m_curve", UIComponentName.AnimationCurve),
        new ScriptGenerateRuler("m_canvasGroup", UIComponentName.CanvasGroup),
        new ScriptGenerateRuler("m_toggle",UIComponentName.Toggle),
#if TextMeshPro
        new ScriptGenerateRuler("m_tmpInput", UIComponentName.TMP_InputField),
        new ScriptGenerateRuler("m_tmpDropdown", UIComponentName.TMP_Dropdown),
        new ScriptGenerateRuler("m_tmp",UIComponentName.TextMeshProUGUI),
#endif
        new ScriptGenerateRuler("m_eximg", UIComponentName.ExImage),
        new ScriptGenerateRuler("m_container", UIComponentName.ItemContainer),
    };

    public List<ScriptGenerateRuler> ScriptGenerateRule => scriptGenerateRule;


    [MenuItem("TEngine/Create ScriptGeneratorSetting")]
    private static void CreateAutoBindGlobalSetting()
    {
        string[] paths = AssetDatabase.FindAssets("t:ScriptGeneratorSetting");
        if (paths.Length >= 1)
        {
            string path = AssetDatabase.GUIDToAssetPath(paths[0]);
            EditorUtility.DisplayDialog("警告", $"已存在ScriptGeneratorSetting，路径:{path}", "确认");
            return;
        }

        ScriptGeneratorSetting setting = CreateInstance<ScriptGeneratorSetting>();
        AssetDatabase.CreateAsset(setting, "Assets/Editor/ScriptGeneratorSetting.asset");
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
    }

    public static List<ScriptGenerateRuler> GetScriptGenerateRule()
    {
        if (Instance == null)
        {
            return null;
        }
        return Instance.ScriptGenerateRule;
    }

    public static string GetUINameSpace()
    {
        if (Instance == null)
        {
            return string.Empty;
        }

        return Instance.Namespace;
    }

    public static UIFieldCodeStyle GetCodeStyle()
    {
        if (Instance == null)
        {
            return UIFieldCodeStyle.UnderscorePrefix;
        }

        return Instance.CodeStyle;
    }

    /// <summary>新窗的 Gen 根:<paramref name="toBase"/> 为真取底座层,否则取游戏层(缺省)。已有窗重生成用 <see cref="GetGenCodePathFor"/>。</summary>
    public static string GetGenCodePath(bool toBase = false) => toBase ? Instance?.BaseGenCodePath : Instance?.GenCodePath;

    /// <summary>新窗的 impl 根:<paramref name="toBase"/> 为真取底座层,否则取游戏层(缺省)。</summary>
    public static string GetImpCodePath(bool toBase = false) => toBase ? Instance?.BaseImpCodePath : Instance?.ImpCodePath;

    /// <summary>已有窗 <paramref name="className"/> 的 Gen 该写到哪个根:按它的 impl 所在的根定;impl 两边都找不到时取游戏层。</summary>
    public static string GetGenCodePathFor(string className) => ResolveGenCodePath(className, GetGenCodePath());

    /// <summary>
    /// 把调用方给的 Gen 保存路径校正到 <paramref name="className"/> 的 impl 所在的根:impl 在底座层就写底座层 Gen,在游戏层就写游戏层 Gen;
    /// 两边都没有 impl(新窗)时按调用方给的。与调用方给的不一致时打一条日志。
    /// </summary>
    /// <remarks>
    /// impl 与 Gen 是同一个 partial 类,分到两个程序集里就成了两个同名类:一边缺字段编不过,或者两边各编各的、prefab 上挂的那个没有绑定字段。
    /// 故写 Gen 一律以 impl 为准,不信调用方传的路径(MCP 脚本与旧调用点常直接传游戏层的缺省根)。
    /// </remarks>
    public static string ResolveGenCodePath(string className, string requested)
    {
        var s = Instance;
        if (s == null || string.IsNullOrEmpty(className)) return requested;
        string want;
        if (HasImpl(s.BaseImpCodePath, className)) want = s.BaseGenCodePath;
        else if (HasImpl(s.ImpCodePath, className)) want = s.GenCodePath;
        else return requested;
        if (!string.Equals(NormPath(want), NormPath(requested), StringComparison.OrdinalIgnoreCase))
        {
            Debug.Log($"[UI 生成] {className} 的 impl 在 {Path.GetDirectoryName(want)?.Replace('\\', '/')} 下,Gen 改写到 {want}(调用方给的是 {requested})。");
        }
        return want;
    }

    /// <summary><paramref name="root"/> 下(含子目录)有没有 <c>&lt;className&gt;.cs</c>。Gen 文件名带 <c>_Gen.g</c> 后缀,不会误中。</summary>
    private static bool HasImpl(string root, string className)
    {
        if (string.IsNullOrEmpty(root) || !Directory.Exists(root)) return false;
        return Directory.GetFiles(root, className + ".cs", SearchOption.AllDirectories).Length > 0;
    }

    private static string NormPath(string p) => (p ?? string.Empty).Replace('\\', '/').TrimEnd('/');

    public static string GetWidgetName()
    {
        if (Instance == null)
        {
            return string.Empty;
        }

        return Instance.WidgetName;
    }

    public static string GetPrefixNameByCodeStyle(UIFieldCodeStyle style)
    {
        return style switch
        {
            UIFieldCodeStyle.UnderscorePrefix => "_",
            UIFieldCodeStyle.MPrefix => "m_",
            _ => "m_"
        };
    }

    public static string GetUIComponentWithoutPrefixName(UIComponentName uiComponentName)
    {
        if (Instance.ScriptGenerateRule == null)
        {
            return string.Empty;
        }

        for (int i = 0; i < Instance.ScriptGenerateRule.Count; i++)
        {
            var rule = Instance.ScriptGenerateRule[i];

            if (rule.componentName == uiComponentName)
            {
                return rule.uiElementRegex.Substring(rule.uiElementRegex.IndexOf("_", StringComparison.Ordinal) + 1);
            }
        }
        return string.Empty;
    }

    public static UIGenType GetUIGenType(string uiGenTypeName)
    {
        if (string.IsNullOrEmpty(uiGenTypeName))
        {
            return null;
        }
        var tempList = Instance.UIGenTypes;
        for (int i = 0; i < tempList.Count; i++)
        {
            var uiGenType = tempList[i];

            if (string.Equals(uiGenTypeName, uiGenType.uiTypeName, StringComparison.Ordinal))
            {
                return uiGenType;
            }
        }
        return null;
    }
}