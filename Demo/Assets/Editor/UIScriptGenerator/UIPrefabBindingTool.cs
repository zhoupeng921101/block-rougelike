#if UNITY_EDITOR

using System.Collections.Generic;
using System.Text;
using UnityEditor;
using UnityEngine;

/// <summary>
/// UI prefab 引用的批量绑定与校验工具(菜单驱动)。
///
/// 覆盖两档 UI 组件:窗(<see cref="UIPanelMono"/> 派生)与 Part(类名以 Part 结尾的裸 MonoBehaviour)。
/// Part 不共享基类,无法用 <c>CustomEditor</c> 逐个定向,故批量入口在菜单而非 Inspector;
/// 绑定与校验的实现与窗 Inspector 共用 <see cref="UIBindingService"/>,不另立口径。
///
/// 校验是本工具的主用途:漏拖一根线在编译期无声无息,只在运行到那行时才炸。
/// 全量扫一遍把它变成随时可跑的检查。
/// </summary>
public static class UIPrefabBindingTool
{
    /// <summary>扫描根目录(工程内全部 UI prefab 的所在处)。</summary>
    private const string UIPrefabRoot = "Assets/AssetRaw/UI";

    [MenuItem("TEngine/UI 绑定/全量绑定并校验 UI prefab 引用", priority = 100)]
    private static void BindAndValidateAll()
    {
        Run(bind: true);
    }

    [MenuItem("TEngine/UI 绑定/只校验 UI prefab 引用(不改动)", priority = 101)]
    private static void ValidateAll()
    {
        Run(bind: false);
    }

    /// <summary>
    /// 遍历 <see cref="UIPrefabRoot"/> 下全部 prefab,对其中的窗与 Part 组件按需绑定,再报仍为空的引用。
    /// <paramref name="bind"/> 为 false 时只读不写(纯校验)。
    /// </summary>
    private static void Run(bool bind)
    {
        string[] guids = AssetDatabase.FindAssets("t:Prefab", new[] { UIPrefabRoot });
        var emptyReports = new List<string>();
        int prefabCount = 0;
        int componentCount = 0;
        int boundTotal = 0;
        int dirtyPrefabs = 0;

        try
        {
            for (int i = 0; i < guids.Length; i++)
            {
                string path = AssetDatabase.GUIDToAssetPath(guids[i]);
                if (EditorUtility.DisplayCancelableProgressBar(
                        bind ? "绑定并校验 UI prefab" : "校验 UI prefab",
                        path, (float)i / Mathf.Max(1, guids.Length)))
                {
                    break;
                }

                // 载入 prefab 内容做可写副本:直接改 AssetDatabase 载入的 prefab 资产在嵌套 prefab 下
                // 不会正确落盘,须走 LoadPrefabContents / SaveAsPrefabAsset 这对 API。
                GameObject contents = PrefabUtility.LoadPrefabContents(path);
                if (contents == null)
                {
                    continue;
                }

                try
                {
                    prefabCount++;
                    bool changed = false;

                    var components = contents.GetComponentsInChildren<MonoBehaviour>(includeInactive: true);
                    foreach (var component in components)
                    {
                        if (!UIBindingService.IsBindTarget(component))
                        {
                            continue;
                        }

                        componentCount++;

                        if (bind)
                        {
                            int bound = UIBindingService.BindByNodeName(component);
                            if (bound > 0)
                            {
                                boundTotal += bound;
                                changed = true;
                            }
                        }

                        foreach (string fieldName in UIBindingService.CollectEmptyReferences(component))
                        {
                            emptyReports.Add($"{path} | {component.GetType().Name} | {fieldName}");
                        }
                    }

                    if (changed)
                    {
                        PrefabUtility.SaveAsPrefabAsset(contents, path);
                        dirtyPrefabs++;
                    }
                }
                finally
                {
                    PrefabUtility.UnloadPrefabContents(contents);
                }
            }
        }
        finally
        {
            EditorUtility.ClearProgressBar();
        }

        AssetDatabase.SaveAssets();
        Report(bind, prefabCount, componentCount, boundTotal, dirtyPrefabs, emptyReports);
    }

    /// <summary>把结果打成一条 Console 记录:空引用清单是本工具的产出,逐行给出 prefab / 组件 / 字段。</summary>
    private static void Report(bool bind, int prefabCount, int componentCount, int boundTotal,
        int dirtyPrefabs, List<string> emptyReports)
    {
        var sb = new StringBuilder();
        sb.Append($"[UIPrefabBindingTool] 扫描 {UIPrefabRoot}：prefab {prefabCount} 个，UI 组件 {componentCount} 个");
        if (bind)
        {
            sb.Append($"，绑定字段 {boundTotal} 个，写回 prefab {dirtyPrefabs} 个");
        }
        sb.AppendLine("。");

        if (emptyReports.Count == 0)
        {
            sb.Append("空引用：无。");
            Debug.Log(sb.ToString());
            return;
        }

        sb.AppendLine($"空引用 {emptyReports.Count} 项（prefab | 组件 | 字段）：");
        foreach (string line in emptyReports)
        {
            sb.AppendLine("  " + line);
        }

        // 用 Error 而非 Warning：空引用是运行期必炸的缺陷，不该混在告警噪声里被划过去。
        Debug.LogError(sb.ToString());
    }
}

#endif
