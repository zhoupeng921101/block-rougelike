#if UNITY_EDITOR

using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

/// <summary>
/// 窗脚本首次生成入口：prefab 编辑模式下选中「尚未挂窗脚本」的带 Canvas 窗根时，在 Inspector 头部
/// 自动追加生成按钮，直接产出 _Gen.g.cs + impl 脚手架文件（类名按根名推导，基类恒为 UIPanelMono）。
/// 脚本挂上之后本按钮不再显示——重生成与按名绑定入口在其 Inspector 上（<see cref="UIPanelMonoEditor"/>）。
///
/// Part 不进生成器：Part 是手写的裸 MonoBehaviour 单文件，字段自己写；其 prefab 引用的批量绑定与
/// 校验仍走菜单（<see cref="UIPrefabBindingTool"/>），那条通路与本生成入口无关。
/// </summary>
[InitializeOnLoad]
public static class UIScriptGenHeaderButton
{
    private static bool s_useUniTask;

    static UIScriptGenHeaderButton()
    {
        UnityEditor.Editor.finishedDefaultHeaderGUI += OnFinishedHeaderGUI;
    }

    private static void OnFinishedHeaderGUI(UnityEditor.Editor editor)
    {
        if (editor.targets.Length != 1 || editor.target is not GameObject go)
        {
            return;
        }

        // 只在 prefab 编辑模式的根节点上显示，避免场景对象（如 UIRoot 的 canvas）误触
        var stage = PrefabStageUtility.GetCurrentPrefabStage();
        if (stage == null || stage.prefabContentsRoot != go)
        {
            return;
        }

        // 已挂窗脚本 → 用其 Inspector 的重生成按钮，本按钮不再显示。
        if (go.GetComponent<UIPanelMono>() != null)
        {
            return;
        }

        // 窗根靠 Canvas 识别。Part 根不带 Canvas，故一并被这道判定挡在生成入口之外。
        if (go.GetComponent<Canvas>() == null)
        {
            return;
        }

        ScriptGenerator.GetUIScriptDefaults(go.transform, out string className, out string uiGenTypeName);

        EditorGUILayout.BeginHorizontal();
        {
            if (GUILayout.Button($"生成UI脚本文件：{className} : {uiGenTypeName}", GUILayout.Height(22)))
            {
                // 本作没有底座层,窗一律写游戏层 GameLogic/UI(toBase 恒 false)。
                ScriptGenerator.GenerateUIScriptFiles(go.transform, className, uiGenTypeName, s_useUniTask, false);
                GUIUtility.ExitGUI();
            }

            s_useUniTask = GUILayout.Toggle(s_useUniTask, "UniTask", GUILayout.Width(70));
        }
        EditorGUILayout.EndHorizontal();
    }
}

#endif
