#if UNITY_EDITOR

using TEngine;
using UnityEditor;
using UnityEngine;

/// <summary>
/// 窗组件(<see cref="UIPanelMono"/> 派生)的自定义 Inspector。
/// 在默认 Inspector 之上提供两项编辑期便利:一键重新生成绑定代码 <c>_Gen.g.cs</c>,
/// 以及按节点名把 prefab 子节点引用自动绑回 <c>[SerializeField]</c> 字段。
///
/// 只覆盖窗一档:Part 是宿主自持的裸 MonoBehaviour、不共享基类,无法用 <c>CustomEditor</c> 定向
/// (以 MonoBehaviour 为 target 会劫持工程内所有组件的 Inspector)。Part 的绑定与校验走
/// <see cref="UIPrefabBindingTool"/> 的菜单入口,实现与本类共用 <see cref="UIBindingService"/>。
/// </summary>
[CustomEditor(typeof(UIPanelMono), editorForChildClasses: true)]
public class UIPanelMonoEditor : UnityEditor.Editor
{
    private bool _useUniTask;

    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        EditorGUILayout.Space();
        EditorGUILayout.BeginVertical("HelpBox");
        {
            _useUniTask = EditorGUILayout.Toggle("生成 UniTask 版本", _useUniTask);

            // 多选时无法把引用绑定 / 代码生成对应到单一组件，按钮置灰。
            using (new EditorGUI.DisabledScope(targets.Length != 1))
            {
                if (GUILayout.Button("重新生成 _Gen.g.cs", GUILayout.Height(28)))
                {
                    RegenerateGenCode();
                }

                if (GUILayout.Button("按节点名自动绑定 [SerializeField]", GUILayout.Height(28)))
                {
                    BindSerializedFieldsByNodeName();
                }
            }
        }
        EditorGUILayout.EndVertical();
    }

    /// <summary>
    /// 以被检视组件的 transform 为遍历根重新生成 <c>_Gen.g.cs</c>。
    /// 仅重写绑定代码，不生成实现类（isGenImp=false），不覆盖用户逻辑。
    /// </summary>
    private void RegenerateGenCode()
    {
        var component = (UIPanelMono)target;
        string className = component.GetType().Name;
        string savePath = ScriptGeneratorSetting.GetGenCodePathFor(className);

        bool ok = ScriptGenerator.GenerateCSharpScript(
            root: component.transform,
            isUniTask: _useUniTask,
            savePath: savePath,
            className: className,
            uiGenTypeName: "UIPanelMono",
            isGenImp: false,
            impSavePath: null);

        if (ok)
        {
            Log.Info($"[UIPanelMonoEditor] 已重新生成 {className}_Gen.g.cs（{savePath}）。");
        }
        else
        {
            Log.Warning($"[UIPanelMonoEditor] 生成 {className}_Gen.g.cs 失败，请检查保存路径配置。");
        }

        AssetDatabase.Refresh();
    }

    /// <summary>按节点名把子节点引用绑回本组件的 <c>[SerializeField]</c> 字段（实现见 UIBindingService）。</summary>
    private void BindSerializedFieldsByNodeName()
    {
        var component = (UIPanelMono)target;
        var issues = new System.Collections.Generic.List<UIBindingService.FieldIssue>();
        int boundCount = UIBindingService.BindByNodeName(component, issues);

        foreach (var issue in issues)
        {
            Log.Warning($"[UIPanelMonoEditor] 字段 [{issue.FieldName}] 未绑定：{issue.Reason}。");
        }

        EditorUtility.SetDirty(component);
        Log.Info($"[UIPanelMonoEditor] 绑定完成：成功绑定 {boundCount} 个字段，未绑定 {issues.Count} 个。");
    }
}

#endif
