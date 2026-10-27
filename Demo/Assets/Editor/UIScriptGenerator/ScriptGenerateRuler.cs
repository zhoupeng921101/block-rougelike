using System;
using UnityEditor;
using UnityEngine;

public enum UIFieldCodeStyle
{
    /// <summary>
    /// Field names start with underscore (e.g., _variable)
    /// </summary>
    [InspectorName("Field names start with underscore (e.g., _variable)")]
    UnderscorePrefix,

    /// <summary>
    /// Field names start with m_ prefix (e.g., m_variable)
    /// </summary>
    [InspectorName("Field names start with m_ prefix (e.g., m_variable)")]
    MPrefix,

    [InspectorName("占位符(选择无效)")]
    Max,
}

[Serializable]
public class ScriptGenerateRuler
{
    [SerializeField] public string uiElementRegex;
    [SerializeField] public UIComponentName componentName;
    [SerializeField] public bool isUIWidget = false;

    public ScriptGenerateRuler(string uiElementRegex, UIComponentName componentName, bool isUIWidget = false)
    {
        this.uiElementRegex = uiElementRegex;
        this.componentName = componentName;
        this.isUIWidget = isUIWidget;
    }
}

[Serializable]
public class UIGenType
{
    public UIGenType(string uiTypeName, bool isGeneric)
    {
        this.uiTypeName = uiTypeName;
        this.isGeneric = isGeneric;
    }

    public string uiTypeName;
    public bool isGeneric;
}

[CustomPropertyDrawer(typeof(ScriptGenerateRuler))]
public class ScriptGenerateRulerDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        EditorGUI.BeginProperty(position, label, property);
        position = EditorGUI.PrefixLabel(position, GUIUtility.GetControlID(FocusType.Passive), label);
        var indent = EditorGUI.indentLevel;
        EditorGUI.indentLevel = 0;
        var uiElementRegexRect = new Rect(position.x, position.y, 120, position.height);
        var componentNameRect = new Rect(position.x + 125, position.y, 150, position.height);
        var isUIWidgetRect = new Rect(position.x + 325, position.y, 150, position.height);
        EditorGUI.PropertyField(uiElementRegexRect, property.FindPropertyRelative("uiElementRegex"), GUIContent.none);
        EditorGUI.PropertyField(componentNameRect, property.FindPropertyRelative("componentName"), GUIContent.none);
        EditorGUI.PropertyField(isUIWidgetRect, property.FindPropertyRelative("isUIWidget"), GUIContent.none);
        EditorGUI.indentLevel = indent;
        EditorGUI.EndProperty();
    }
}

public enum UIComponentName
{
    GameObject,
    Transform,
    RectTransform,
    Text,
    RichTextItem,
    Button,
    Image,
    RawImage,
    ScrollRect,
    Scrollbar,
    InputField,
    GridLayoutGroup,
    HorizontalLayoutGroup,
    VerticalLayoutGroup,
    Slider,
    Toggle,
    ToggleGroup,
    AnimationCurve,
    CanvasGroup,
    TextMeshProUGUI,
    Canvas,
    Dropdown,
    TMP_InputField,
    TMP_Dropdown,
    ExImage,
    ExText,
    ExRawImage,
    // 新增枚举值只能追加在末尾:ScriptGeneratorSetting.asset 按数值索引序列化 componentName,
    // 插在中间会让 asset 里全部既有规则错位绑到别的组件类型。
    // 枚举名同时被 ScriptAutoGenerator 直接 ToString 当作生成字段的类型名,故须与类名逐字相同。
    ItemContainer,

    /// <summary>
    /// Part 引用占位:字段类型不由本枚举给出,而由节点上实际挂载的 Part 组件反射推导
    /// (见 <c>ScriptGenerator.ResolvePartTypeName</c>),故本值是唯一不作类型名 ToString 的枚举成员。
    /// 用它的规则须同时勾 <see cref="ScriptGenerateRuler.isUIWidget"/>——Part 内部节点归 Part 自己绑,
    /// 宿主遍历到此即止。
    /// </summary>
    UIPart,

    /// <summary>
    /// SuperScrollView 虚拟网格(`m_loopGrid` 前缀)。
    /// 排在 <see cref="UIPart"/> 之后而非按语义归到 <c>ScrollRect</c> 旁边:本枚举按数值索引序列化,
    /// 任何插入都会让 asset 里既有规则整体错位(见上方注释),故只能追加。
    /// </summary>
    LoopGridView,
}