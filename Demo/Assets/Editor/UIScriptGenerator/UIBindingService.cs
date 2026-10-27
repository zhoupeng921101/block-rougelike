#if UNITY_EDITOR

using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEditor;
using UnityEngine;

/// <summary>
/// UI 引用绑定的共享实现:按节点名把 prefab 子节点绑回 <c>[SerializeField]</c> 字段,以及反查仍为空的字段。
///
/// 两个消费方共用本类,不各持一份口径:窗组件 Inspector 上的单个操作(<see cref="UIPanelMonoEditor"/>)、
/// 全量 prefab 的批量操作(<see cref="UIPrefabBindingTool"/>)。Part 是宿主自持的裸 MonoBehaviour、
/// 不共享基类,故本类按「组件实例 + 其 transform 子树」工作,不依赖任何 UI 基类。
///
/// 字段名与节点名在 MPrefix 风格下恒等,绑定按此约定逐字段精确匹配。
/// </summary>
public static class UIBindingService
{
    /// <summary>类名后缀:以此结尾的 MonoBehaviour 被认作 Part,进入批量绑定与校验的目标集。</summary>
    public const string PartClassSuffix = "Part";

    /// <summary>一个字段的绑定结果(供调用方汇总报告)。</summary>
    public readonly struct FieldIssue
    {
        public readonly string FieldName;
        public readonly string Reason;

        public FieldIssue(string fieldName, string reason)
        {
            FieldName = fieldName;
            Reason = reason;
        }
    }

    /// <summary>
    /// 按节点名把 <paramref name="component"/> 子树内的同名节点绑回其 <c>[SerializeField]</c> 字段。
    /// 返回成功绑定的字段数;绑不上的逐项填进 <paramref name="issues"/>(节点缺失 / 节点上缺该组件)。
    ///
    /// 只写值不落盘:调用方负责 <c>SetDirty</c> 与(批量场景下的)prefab 保存,以便一次 prefab 打开内绑多个组件。
    ///
    /// <para><b>前置</b>:只扫<b>名字命中绑定前缀</b>的 <c>[SerializeField]</c> 私有字段,前缀取自
    /// ScriptGeneratorSetting.asset 里各规则的 <c>uiElementRegex</c>(见 <see cref="CollectBindPrefixes"/>)。
    /// 命名不合规则的字段既不绑也不报进 <paramref name="issues"/>,是<b>静默跳过</b>——"字段没绑上却无报错"多半是这里,
    /// 不是节点找不到。前缀表为空时直接返回 0。</para>
    ///
    /// <para><b>配套入口</b>:本方法只绑引用,<b>不产代码</b>。字段声明由
    /// <see cref="ScriptGenerator.GenerateCSharpScript"/> 生成,且须等其触发的编译完成后再调本方法,
    /// 否则反射不到新字段。</para>
    /// </summary>
    public static int BindByNodeName(MonoBehaviour component, List<FieldIssue> issues = null)
    {
        if (component == null)
        {
            return 0;
        }

        var prefixes = CollectBindPrefixes();
        if (prefixes.Count == 0)
        {
            Debug.LogError("[UIBindingService] 未取到绑定前缀规则(ScriptGeneratorSetting 缺失?),绑定中止。");
            return 0;
        }

        Transform root = component.transform;
        var so = new SerializedObject(component);
        int boundCount = 0;

        foreach (var field in CollectSerializeFields(component.GetType(), prefixes))
        {
            Transform node = ScriptGenerator.FindNodeByNameWithWidgetBoundary(root, field.Name);
            if (node == null)
            {
                issues?.Add(new FieldIssue(field.Name, "找不到同名节点"));
                continue;
            }

            UnityEngine.Object value = ResolveReference(node, field.FieldType);
            if (value == null)
            {
                issues?.Add(new FieldIssue(field.Name, $"节点 [{node.name}] 上缺少组件 {field.FieldType.Name}"));
                continue;
            }

            var prop = so.FindProperty(field.Name);
            if (prop == null)
            {
                issues?.Add(new FieldIssue(field.Name, "无对应序列化属性"));
                continue;
            }

            prop.objectReferenceValue = value;
            boundCount++;
        }

        so.ApplyModifiedPropertiesWithoutUndo();
        return boundCount;
    }

    /// <summary>
    /// 反查 <paramref name="component"/> 上仍为空的对象引用型 <c>[SerializeField]</c> 字段。
    ///
    /// 范围比绑定宽:凡对象引用型的序列化字段都查,不限命中绑定前缀的那些。漏拖的重灾区恰是
    /// 前缀外的字段——prefab 模板引用(<c>_blockPrefab</c> 一类)指向的是资产而非子节点,
    /// 按节点名绑不了、只能手拖,正因如此更需要被查出来。
    ///
    /// 只看对象引用,不看值类型与集合:那些为默认值是正常态,报出来会把真正的漏拖淹掉。
    /// </summary>
    public static List<string> CollectEmptyReferences(MonoBehaviour component)
    {
        var empty = new List<string>();
        if (component == null)
        {
            return empty;
        }

        var so = new SerializedObject(component);
        foreach (var field in CollectAllSerializeFields(component.GetType()))
        {
            var prop = so.FindProperty(field.Name);
            if (prop == null || prop.propertyType != SerializedPropertyType.ObjectReference)
            {
                continue;
            }

            if (prop.objectReferenceValue == null)
            {
                empty.Add(field.Name);
            }
        }

        return empty;
    }

    /// <summary>该组件是否为本工具的目标(窗,或类名以 Part 结尾的裸 MonoBehaviour)。</summary>
    public static bool IsBindTarget(MonoBehaviour component)
    {
        if (component == null)
        {
            return false;
        }

        return component is UIPanelMono
            || component.GetType().Name.EndsWith(PartClassSuffix, StringComparison.Ordinal);
    }

    /// <summary>
    /// 收集绑定前缀集(各规则的 <c>uiElementRegex</c>,如 m_btn / m_img / m_part)。
    /// </summary>
    public static List<string> CollectBindPrefixes()
    {
        var result = new List<string>();
        var rules = ScriptGeneratorSetting.GetScriptGenerateRule();
        if (rules == null)
        {
            return result;
        }

        foreach (var rule in rules)
        {
            if (!string.IsNullOrEmpty(rule.uiElementRegex))
            {
                result.Add(rule.uiElementRegex);
            }
        }
        return result;
    }

    /// <summary>
    /// 反射类型上所有带 <c>[SerializeField]</c> 且名字命中绑定前缀的私有实例字段,含基类继承的私有字段
    /// (逐层上溯,BindingFlags 不传递到基类私有成员,故手动遍历类型链)。
    /// </summary>
    public static IEnumerable<FieldInfo> CollectSerializeFields(Type type, List<string> prefixes)
    {
        foreach (var field in CollectAllSerializeFields(type))
        {
            if (MatchesAnyPrefix(field.Name, prefixes))
            {
                yield return field;
            }
        }
    }

    /// <summary>
    /// 反射类型上全部带 <c>[SerializeField]</c> 的私有实例字段，含基类继承的私有字段
    /// （逐层上溯，BindingFlags 不传递到基类私有成员，故手动遍历类型链）。
    /// </summary>
    public static IEnumerable<FieldInfo> CollectAllSerializeFields(Type type)
    {
        var seen = new HashSet<string>(StringComparer.Ordinal);
        const BindingFlags flags = BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.DeclaredOnly;

        for (Type t = type; t != null && t != typeof(MonoBehaviour); t = t.BaseType)
        {
            foreach (var field in t.GetFields(flags))
            {
                if (!seen.Add(field.Name))
                {
                    continue;
                }

                if (field.GetCustomAttribute<SerializeField>() == null)
                {
                    continue;
                }

                yield return field;
            }
        }
    }

    private static bool MatchesAnyPrefix(string fieldName, List<string> prefixes)
    {
        foreach (var prefix in prefixes)
        {
            if (fieldName.StartsWith(prefix, StringComparison.Ordinal))
            {
                return true;
            }
        }
        return false;
    }

    /// <summary>
    /// 按字段声明类型从节点解析引用对象:
    /// GameObject → 节点物体;Transform / RectTransform → 节点 transform;其余(含 Part 组件) → GetComponent。
    /// </summary>
    public static UnityEngine.Object ResolveReference(Transform node, Type fieldType)
    {
        if (fieldType == typeof(GameObject))
        {
            return node.gameObject;
        }

        if (fieldType == typeof(Transform) || fieldType == typeof(RectTransform))
        {
            return node.transform;
        }

        return node.GetComponent(fieldType);
    }
}

#endif
