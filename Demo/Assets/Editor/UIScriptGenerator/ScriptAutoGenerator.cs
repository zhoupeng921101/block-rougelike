using System;
using System.IO;
using System.Linq;
using System.Text;
using UnityEditor;
using UnityEngine;

public partial class ScriptGenerator
{
    private static string[] VARIABLE_NAME_REGEX;

    private static void CheckVariableNames()
    {
        var cnt = (int)UIFieldCodeStyle.Max;
        VARIABLE_NAME_REGEX = new string[cnt];

        for (int i = 0; i < cnt; i++)
        {
            VARIABLE_NAME_REGEX[i] = GetPrefixNameByCodeStyle((UIFieldCodeStyle)i);
        }
    }

    /// <summary>
    /// 按根名推导首次生成的默认类名与 UI 基类。生成器只产窗一档（<see cref="PanelBaseTypeName"/>）：
    /// Part 是手写的裸 MonoBehaviour，不进生成器，故此处不再按 widget 前缀分档。
    /// </summary>
    public static void GetUIScriptDefaults(Transform root, out string className, out string uiGenTypeName)
    {
        className = root == null ? string.Empty : root.name;
        uiGenTypeName = PanelBaseTypeName;
    }

    /// <summary>窗基类名（生成的类以它作基类时走框架生命周期，否则是宿主自持的 Part）。</summary>
    private const string PanelBaseTypeName = "UIPanelMono";

    /// <summary>
    /// 全屏遮罩的节点名。与 <c>UIPanelMono.MaskNodeName</c> 同值——Editor 程序集不引用热更程序集，
    /// 故此处各持一份（同文件内 <see cref="PanelBaseTypeName"/> 是同一处理）；改名要两边一起改。
    /// </summary>
    private const string MaskNodeName = "m_btn_Mask";

    /// <summary>是不是全屏遮罩节点。判原始节点名，不判字段名——字段名随 CodeStyle 变，节点名不变。</summary>
    private static bool IsMaskNode(string nodeName) =>
        string.Equals(nodeName, MaskNodeName, StringComparison.Ordinal);

    /// <summary>类名后缀：以此结尾的 MonoBehaviour 才被认作 Part（<c>m_part_</c> 字段的类型推导依据）。</summary>
    private const string PartClassSuffix = "Part";

    /// <summary>
    /// 新面板首次生成入口：按设置路径直接写 &lt;类名&gt;_Gen.g.cs 与 impl 脚手架文件（不走剪贴板）。
    /// impl 已存在时由 <see cref="GenerateImpCSharpScript"/> 内部跳过，不覆盖业务代码。
    /// <paramref name="toBase"/> 为真时写到底座层 GameBase 的 UI 根，否则写游戏层 GameLogic 的（缺省）。
    /// </summary>
    public static bool GenerateUIScriptFiles(Transform root, string className, string uiGenTypeName, bool isUniTask, bool toBase = false)
    {
        if (root == null || string.IsNullOrEmpty(className))
        {
            Debug.LogError("生成失败：遍历根或类名为空。");
            return false;
        }

        string genPath = ScriptGeneratorSetting.GetGenCodePath(toBase);
        string impPath = ScriptGeneratorSetting.GetImpCodePath(toBase);
        if (string.IsNullOrEmpty(genPath) || string.IsNullOrEmpty(impPath))
        {
            Debug.LogError("生成失败：TEngine UI 设置中的生成路径未配置（genCodePath / impCodePath）。");
            return false;
        }

        bool ok = GenerateCSharpScript(root, isUniTask: isUniTask,
            savePath: genPath,
            className: className,
            uiGenTypeName: uiGenTypeName,
            isGenImp: true,
            impSavePath: impPath);

        if (ok)
        {
            Debug.Log($"<color=#1E90FF>已生成 {className}_Gen.g.cs 与 impl 脚手架（impl 已存在则跳过）。后续：等编译完成 → prefab 根挂 {className} 组件 → Inspector 点「按节点名自动绑定 [SerializeField]」。</color>");
        }
        else
        {
            Debug.LogError("生成失败：请检查 TEngine UI 设置中的生成路径（genCodePath / impCodePath）。");
        }
        return ok;
    }

    private static string GetUITypeName(string uiGenTypeName, string fileName)
    {
        var uiGenType = ScriptGeneratorSetting.GetUIGenType(uiGenTypeName);

        if (uiGenType == null)
        {
            return "UIPanelMono";
        }
        return !uiGenType.isGeneric ? uiGenType.uiTypeName : $"{uiGenType.uiTypeName}<{fileName}>";
    }

    /// <summary>
    /// 显式传入遍历根的生成入口，不依赖全局 <see cref="Selection"/>。
    ///
    /// <para><b>典型调用</b>（重生成已有窗的绑定代码，不碰用户实现）：</para>
    /// <code>
    /// ScriptGenerator.GenerateCSharpScript(
    ///     root:          component.transform,       // 遍历根，通常是窗根
    ///     isUniTask:     false,
    ///     savePath:      ScriptGeneratorSetting.GetGenCodePathFor(component.GetType().Name),
    ///     className:     component.GetType().Name,  // 决定文件名 {className}_Gen.g.cs；传 null 则用 root.name
    ///     uiGenTypeName: "UIPanelMono",
    ///     isGenImp:      false,                     // 关键：true 才额外产 impl 脚手架
    ///     impSavePath:   null);                     // isGenImp=false 时不使用
    /// </code>
    ///
    /// <para><b>前置</b>：<paramref name="root"/> 与 <paramref name="savePath"/> 均须非空，
    /// 任一为空直接返回 false（不抛异常，也不留日志，注意别把静默失败当成功）。目标目录不存在会自动创建。
    /// 窗的 impl 已存在时，<paramref name="savePath"/> 按 impl 所在的根校正（底座层 / 游戏层，见 <see cref="ScriptGeneratorSetting.ResolveGenCodePath"/>）。</para>
    ///
    /// <para><b>副作用</b>——两个产物的覆盖策略<b>相反</b>，是本入口最易踩的一点：</para>
    /// <list type="bullet">
    /// <item><description><c>{className}_Gen.g.cs</c>：<b>无条件覆盖</b>。已存在则先摘掉只读属性、删除、再重写；
    /// 写完把文件<b>置为只读</b>。故此文件不可手改——只读属性会拦，且改动在下次生成时必丢。</description></item>
    /// <item><description><c>{className}.cs</c>（impl 脚手架，仅 <paramref name="isGenImp"/>=true 时产出）：
    /// <b>已存在则跳过</b>，只打一条 Warning，用户写的实现逻辑不会被覆盖。</description></item>
    /// </list>
    ///
    /// <para><b>调用后</b>：本方法末尾已无条件调用 <see cref="AssetDatabase.Refresh"/>，调用方无须再刷。
    /// 但新生成的字段要等域重载与编译完成后才能访问。</para>
    ///
    /// <para><b>配套入口</b>：本方法只产代码，<b>不绑引用</b>。把 prefab 子节点绑回 <c>[SerializeField]</c> 字段
    /// 走 <see cref="UIBindingService.BindByNodeName"/>。完整流程 = 改节点名 → 本方法重生成 → 等编译完成 → BindByNodeName。</para>
    /// </summary>
    /// <returns>Gen 文件是否成功落盘。impl 因已存在而跳过<b>不影响</b>本返回值，恒返回 true。</returns>
    public static bool GenerateCSharpScript(Transform root, bool isUniTask = false,
        string savePath = null, string className = null,
        string uiGenTypeName = null, bool isGenImp = false,
        string impSavePath = null)
    {
        if (root == null)
        {
            return false;
        }
        CheckVariableNames();
        StringBuilder strVar = new StringBuilder();
        StringBuilder strBind = new StringBuilder();
        StringBuilder strOnCreate = new StringBuilder();
        StringBuilder strCallback = new StringBuilder();

        string fileName = $"{root.name}.cs";
        if (!string.IsNullOrEmpty(className))
        {
            fileName = $"{className}.cs";
        }
        string uiTypeName = GetUITypeName(uiGenTypeName, className);

        // 生成器只产窗一档（UIPanelMono）：引用走 [SerializeField] 具名拖拽，字段生成
        // [SerializeField] private T m_x;，事件挂载只挂回调、不取 index。
        AutoErgodic(root, root, ref strVar, ref strBind, ref strOnCreate, ref strCallback, isUniTask);
        StringBuilder strFile = new StringBuilder();

        strFile.AppendLine("//----------------------------------------------------------");
        strFile.AppendLine("// <auto-generated>");
        strFile.AppendLine("// -This code was generated.");
        strFile.AppendLine("// -Changes to this file may cause incorrect behavior.");
        strFile.AppendLine("// -will be lost if the code is regenerated.");
        strFile.AppendLine("// <auto-generated/>");
        strFile.AppendLine("//----------------------------------------------------------");
#if TextMeshPro
        strFile.AppendLine("using TMPro;");
#endif
        if (isUniTask)
        {
            strFile.AppendLine("using Cysharp.Threading.Tasks;");
        }

        strFile.AppendLine("using UnityEngine;");
        strFile.AppendLine("using UnityEngine.UI;");
        strFile.AppendLine("using TEngine;");
        strFile.AppendLine();
        // 不生成 namespace：客户端业务代码落全局命名空间（conventions-dev.md「客户端命名空间」），
        // 隔离由 asmdef 承担。带 namespace 的生成物会被命名空间扫描判违规。
        strFile.AppendLine($"public partial class {fileName.Replace(".cs", "")} : {uiTypeName}");
        strFile.AppendLine("{");

        // 脚本工具生成的代码
        strFile.AppendLine("\t#region 脚本工具生成的代码");
        strFile.AppendLine();
        // 字段块包 CS0414(已赋值但从未使用)豁免：字段按 prefab 节点结构逐个生成、且带 " = null!" 初始化，
        // 而某个节点是否被业务代码读取由业务决定、不由生成器决定。不豁免的话每加一个未消费节点就多一条
        // 警告，噪音压过真实警告。改这两行须同步已有生成物（两处文本逐字相同，否则重新生成会产生 diff）。
        strFile.AppendLine("\t#pragma warning disable CS0414 // 绑定字段按 prefab 节点结构生成,是否被业务消费由业务定;生成物不为此报警");
        strFile.Append(strVar.ToString());
        strFile.AppendLine("\t#pragma warning restore CS0414");
        strFile.AppendLine();

        // 事件挂载点 = 框架驱动的 ScriptGenerator() 虚方法（窗档独有）。
        strFile.AppendLine("\tprotected override void ScriptGenerator()");
        strFile.AppendLine("\t{");
        {
            strFile.Append(strBind.ToString());
            strFile.Append(strOnCreate.ToString());
        }
        strFile.AppendLine("\t}");
        strFile.AppendLine();
        strFile.AppendLine("\t#endregion");

        strFile.AppendLine();
        strFile.AppendLine("\t#region 事件");
        strFile.AppendLine();
        strFile.Append(strCallback.ToString());
        strFile.AppendLine("\t#endregion");
        strFile.AppendLine("}");

        string path = ScriptGeneratorSetting.ResolveGenCodePath(fileName.Replace(".cs", ""), savePath)?.Replace("\\", "/");
        if (string.IsNullOrEmpty(path))
        {
            return false;
        }
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
        var saveFileName = fileName.Replace(".cs", "_Gen.g.cs");
        var filePath = Path.Combine(path, saveFileName).Replace("\\", "/");

        if (File.Exists(filePath))
        {
            FileAttributes attributes = File.GetAttributes(filePath);
            if ((attributes & FileAttributes.ReadOnly) == FileAttributes.ReadOnly)
            {
                File.SetAttributes(filePath, attributes & ~FileAttributes.ReadOnly);
            }
            File.Delete(filePath);
            AssetDatabase.Refresh();
        }

        File.WriteAllText(filePath, strFile.ToString(), Encoding.UTF8);
        File.SetAttributes(filePath, File.GetAttributes(filePath) | FileAttributes.ReadOnly);
        if (isGenImp)
        {
            GenerateImpCSharpScript(root, isUniTask, fileName, impSavePath, uiTypeName);
        }
        AssetDatabase.Refresh();

        return true;
    }

    public static void AutoErgodic(Transform root, Transform transform, ref StringBuilder strVar,
        ref StringBuilder strBind, ref StringBuilder strOnCreate, ref StringBuilder strCallback, bool isUniTask)
    {
        for (int i = 0; i < transform.childCount; i++)
        {
            Transform child = transform.GetChild(i);
            WriteAutoScript(root, child, ref strVar, ref strBind, ref strOnCreate, ref strCallback, isUniTask);
            // 边界节点（m_part_ / m_item_）的子树归它自己的脚本绑，宿主不下钻。
            if (IsErgodicBoundary(child.name))
            {
                continue;
            }

            AutoErgodic(root, child, ref strVar, ref strBind, ref strOnCreate, ref strCallback, isUniTask);
        }
    }

    private static void WriteAutoScript(Transform root, Transform child, ref StringBuilder strVar,
        ref StringBuilder strBind, ref StringBuilder strOnCreate, ref StringBuilder strCallback, bool isUniTask)
    {
        string varName = child.name;
        // 查找相关的规则定义
        var rule = ScriptGeneratorSetting.GetScriptGenerateRule()
            .Find(r => varName.StartsWith(r.uiElementRegex));

        if (rule == null)
        {
            return;
        }

        // Part 字段的类型不由规则枚举给出，按节点上实际挂的组件反射推导；推不出即不生成该字段。
        var componentName = rule.componentName == UIComponentName.UIPart
            ? ResolvePartTypeName(child)
            : rule.componentName.ToString();

        if (string.IsNullOrEmpty(componentName))
        {
            return;
        }

        varName = GetVariableName(varName);

        if (string.IsNullOrEmpty(varName))
        {
            return;
        }

        // 字段 [SerializeField] 暴露到 Inspector，引用靠具名拖拽就位。
        strVar.AppendLine($"\t[SerializeField] private {componentName} {varName}{(ScriptGeneratorSetting.Instance.NullableEnable ? " = null!;" : ";")}");

        switch (rule.componentName)
        {
            case UIComponentName.Button:
                // 遮罩节点整条链路归基类：绑定与点击关窗都在 UIPanelMono.BindMask，不产 partial 声明。
                // 业务代码因而写不出也改不掉这条回调——「点空地关弹窗」是弹窗层的机制而非各窗的自选动作。
                if (IsMaskNode(child.name))
                {
                    strOnCreate.AppendLine($"\t\tBindMask({varName});");
                    break;
                }

                var btnFuncName = GetBtnFuncName(varName);

                if (isUniTask)
                {
                    strOnCreate.AppendLine($"\t\t{varName}.onClick.RemoveAllListeners();");
                    strOnCreate.AppendLine($"\t\t{varName}.onClick.AddListener(UniTask.UnityAction({btnFuncName}));");
                    strCallback.AppendLine($"\tprivate partial UniTaskVoid {btnFuncName}();");
                }
                else
                {
                    strOnCreate.AppendLine($"\t\t{varName}.onClick.RemoveAllListeners();");
                    strOnCreate.AppendLine($"\t\t{varName}.onClick.AddListener({btnFuncName});");
                    strCallback.AppendLine($"\tprivate partial void {btnFuncName}();");
                }

                strCallback.AppendLine();
                break;

            case UIComponentName.Toggle:
                var toggleFuncName = GetToggleFuncName(varName);
                strOnCreate.AppendLine($"\t\t{varName}.onValueChanged.RemoveAllListeners();");
                strOnCreate.AppendLine($"\t\t{varName}.onValueChanged.AddListener({toggleFuncName});");
                strCallback.AppendLine($"\tprivate partial void {toggleFuncName}(bool isOn);");
                strCallback.AppendLine();
                break;

            case UIComponentName.TMP_Dropdown:
                var tmpDropdownFuncName = GetTMPDropdownFuncName(varName);
                strOnCreate.Append($"\t\t{varName}.onValueChanged.RemoveAllListeners();\n");
                strOnCreate.Append($"\t\t{varName}.onValueChanged.AddListener({tmpDropdownFuncName});\n");
                strCallback.Append($"\tprivate partial void {tmpDropdownFuncName}(int selectedIndex);\n");
                strCallback.AppendLine();
                break;

            case UIComponentName.Slider:
                var sliderFuncName = GetSliderFuncName(varName);
                strOnCreate.AppendLine($"\t\t{varName}.onValueChanged.RemoveAllListeners();");
                strOnCreate.AppendLine($"\t\t{varName}.onValueChanged.AddListener({sliderFuncName});");
                strCallback.AppendLine($"\tprivate partial void {sliderFuncName}(float value);");
                strCallback.AppendLine();
                break;
        }
    }

        #region GenerateImpCSharp

    private static bool GenerateImpCSharpScript(Transform root, bool isUniTask = false, string fileName = null, string impSavePath = null, string uiTypeName = null)
    {
        // 遍历根用调用方传入值，不读 Selection——Selection 指向别的面板时会把他人回调写进本 impl。
        if (root == null || string.IsNullOrEmpty(fileName))
        {
            return false;
        }
        CheckVariableNames();
        StringBuilder strCallback = new StringBuilder();

        AutoImpErgodic(root, root, ref strCallback, isUniTask);
        StringBuilder strFile = new StringBuilder();

#if TextMeshPro
        strFile.AppendLine("using TMPro;");
#endif
        if (isUniTask)
        {
            strFile.AppendLine("using Cysharp.Threading.Tasks;");
        }

        strFile.AppendLine("using UnityEngine;");
        strFile.AppendLine("using UnityEngine.UI;");
        strFile.AppendLine("using TEngine;");
        strFile.AppendLine();
        // 不生成 namespace，与 _Gen.g.cs 同口径（见 GenerateCSharpScript 内旁注）。
        if (string.Equals(uiTypeName, "UIWindow", StringComparison.Ordinal)
            || string.Equals(uiTypeName, PanelBaseTypeName, StringComparison.Ordinal))
        {
            // 默认落弹窗层：新建的窗多数是弹窗，默认取它漏改的概率最低，且漏改的后果轻
            // （功能页多一个点不到的遮罩节点）。真是功能页的改成 UILayer.UI。
            strFile.AppendLine($"[Window(UILayer.Window, location : \"{fileName.Replace(".cs", "")}\")]");
        }
        strFile.AppendLine($"public partial class {fileName.Replace(".cs", "")}");
        strFile.AppendLine("{");
        {
            strFile.AppendLine("\t#region 事件");
            strFile.AppendLine();
            strFile.Append(strCallback.ToString());
            strFile.AppendLine("\t#endregion");
        }
        strFile.AppendLine("}");

        string path = impSavePath?.Replace("\\", "/");
        if (string.IsNullOrEmpty(path))
        {
            return false;
        }
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
        var filePath = Path.Combine(path, fileName).Replace("\\", "/");

        if (File.Exists(filePath))
        {
            Debug.LogWarning("相关实现类脚本已生成，再次生成跳过");
            return false;
        }

        File.WriteAllText(filePath, strFile.ToString(), Encoding.UTF8);
        AssetDatabase.Refresh();
        return true;
    }

    public static void AutoImpErgodic(Transform root, Transform transform, ref StringBuilder strCallback, bool isUniTask)
    {
        for (int i = 0; i < transform.childCount; i++)
        {
            Transform child = transform.GetChild(i);
            WriteAutoImpScript(root, child, ref strCallback, isUniTask);
            // 边界节点（m_part_ / m_item_）的子树归它自己的脚本绑，宿主不下钻。
            if (IsErgodicBoundary(child.name))
            {
                continue;
            }

            AutoImpErgodic(root, child, ref strCallback, isUniTask);
        }
    }

    private static void WriteAutoImpScript(Transform root, Transform child, ref StringBuilder strCallback, bool isUniTask)
    {
        string varName = child.name;
        // 查找相关的规则定义
        var rule = ScriptGeneratorSetting.GetScriptGenerateRule()
            .Find(r => varName.StartsWith(r.uiElementRegex));

        if (rule == null)
        {
            return;
        }

        // impl 脚手架只写交互回调空壳，Part 字段（UIPart）无回调可写，与其余非交互类型一同落到 default 分支。
        var componentName = rule.componentName.ToString();

        if (string.IsNullOrEmpty(componentName))
        {
            return;
        }

        varName = GetVariableName(varName);

        if (string.IsNullOrEmpty(varName))
        {
            return;
        }

        switch (rule.componentName)
        {
            case UIComponentName.Button:
                // 遮罩节点无回调空壳可写：它的点击行为在基类里（见 WriteAutoScript 内同名旁注）。
                if (IsMaskNode(child.name))
                {
                    break;
                }

                var btnFuncName = GetBtnFuncName(varName);

                if (isUniTask)
                {
                    strCallback.AppendLine($"\tprivate async partial UniTaskVoid {btnFuncName}()");
                    strCallback.AppendLine("\t{");
                    strCallback.AppendLine("\t\tawait UniTask.Yield();");
                    strCallback.AppendLine("\t}");
                }
                else
                {
                    strCallback.AppendLine($"\tprivate partial void {btnFuncName}()");
                    strCallback.AppendLine("\t{");
                    strCallback.AppendLine("\t}");
                }

                strCallback.AppendLine();
                break;

            case UIComponentName.Toggle:
                var toggleFuncName = GetToggleFuncName(varName);
                strCallback.AppendLine($"\tprivate partial void {toggleFuncName}(bool isOn)");
                strCallback.AppendLine("\t{");
                strCallback.AppendLine("\t}");
                strCallback.AppendLine();
                break;

            case UIComponentName.TMP_Dropdown:
                var tmpDropdownFuncName = GetTMPDropdownFuncName(varName);
                strCallback.AppendLine($"\tprivate partial void {tmpDropdownFuncName}(int selectedIndex)");
                strCallback.AppendLine("\t{");
                strCallback.AppendLine("\t}");
                strCallback.AppendLine();
                break;

            case UIComponentName.Slider:
                var sliderFuncName = GetSliderFuncName(varName);
                strCallback.AppendLine($"\tprivate partial void {sliderFuncName}(float value)");
                strCallback.AppendLine("\t{");
                strCallback.AppendLine("\t}");
                strCallback.AppendLine();
                break;
        }
    }

        #endregion


    private static string GetPrefixNameByCodeStyle(UIFieldCodeStyle style)
    {
        return ScriptGeneratorSetting.GetPrefixNameByCodeStyle(style);
    }

    /// <summary>
    /// 取节点上 Part 组件的类型名（<c>m_part_</c> 字段的类型来源）：唯一一个类名以
    /// <see cref="PartClassSuffix"/> 结尾的 MonoBehaviour。
    ///
    /// 零个或多于一个都记 Error 返 null——宿主该绑哪个此时无从判定，静默挑一个会绑错、
    /// 静默跳过则字段凭空消失；两者都比当场报错难查。脚本丢失的组件为 null，跳过不计。
    /// </summary>
    private static string ResolvePartTypeName(Transform node)
    {
        var candidates = node.GetComponents<MonoBehaviour>()
            .Where(c => c != null && c.GetType().Name.EndsWith(PartClassSuffix, StringComparison.Ordinal))
            .Select(c => c.GetType().Name)
            .Distinct()
            .ToList();

        if (candidates.Count == 1)
        {
            return candidates[0];
        }

        if (candidates.Count == 0)
        {
            Debug.LogError($"[ScriptGenerator] 节点 [{node.name}] 用了 m_part_ 前缀，但其上没有类名以 " +
                $"{PartClassSuffix} 结尾的组件，该字段未生成。请挂上 Part 脚本，或把节点改用别的前缀。", node);
        }
        else
        {
            Debug.LogError($"[ScriptGenerator] 节点 [{node.name}] 上有多个 Part 组件（{string.Join(" / ", candidates)}），" +
                "无法判定该绑哪个，该字段未生成。请拆到不同节点，或把节点改用别的前缀。", node);
        }

        return null;
    }

    /// <summary>
    /// 在 <paramref name="root"/> 子树内按节点名精确匹配查找后代 Transform，遇遍历边界
    /// （<see cref="IsErgodicBoundary"/>）即停止下钻，与 <see cref="AutoErgodic"/> 同规则。
    /// 找不到返回 null。
    /// </summary>
    public static Transform FindNodeByNameWithWidgetBoundary(Transform root, string nodeName)
    {
        if (root == null || string.IsNullOrEmpty(nodeName))
        {
            return null;
        }

        for (int i = 0; i < root.childCount; i++)
        {
            Transform child = root.GetChild(i);
            if (string.Equals(child.name, nodeName, StringComparison.Ordinal))
            {
                return child;
            }

            // 命中边界则不再下钻该子树（与 AutoErgodic 一致）。
            if (IsErgodicBoundary(child.name))
            {
                continue;
            }

            var found = FindNodeByNameWithWidgetBoundary(child, nodeName);
            if (found != null)
            {
                return found;
            }
        }

        return null;
    }

    /// <summary>
    /// 节点名是否落在遍历边界上（其子树归该节点自己的脚本绑，宿主不再下钻）。
    /// 边界前缀是规则表里全部勾了 <c>isUIWidget</c> 的项——现为 <c>m_part</c>（Part 组件）与
    /// <c>m_item</c>（按 GameObject 绑的整块）两条，故须逐条比，不能只取首条。
    /// 一条都没勾时保底用 <see cref="GetUIWidgetName"/>。
    /// </summary>
    private static bool IsErgodicBoundary(string nodeName)
    {
        bool anyRule = false;
        foreach (var rule in ScriptGeneratorSetting.Instance.ScriptGenerateRule.Where(rule => rule.isUIWidget))
        {
            anyRule = true;
            if (nodeName.StartsWith(rule.uiElementRegex, StringComparison.Ordinal))
            {
                return true;
            }
        }

        return !anyRule && nodeName.StartsWith(GetUIWidgetName(), StringComparison.Ordinal);
    }

    private static string GetUIWidgetName()
    {
        return GetComponentName(ScriptGeneratorSetting.GetWidgetName());
    }

    private static string GetComponentName(string componentName)
    {
        return GetPrefixName() + componentName;
    }

    private static string GetPrefixName()
    {
        return ScriptGeneratorSetting.GetPrefixNameByCodeStyle(ScriptGeneratorSetting.Instance.CodeStyle);
    }

    private static string GetVariableName(string varName)
    {
        if (string.IsNullOrEmpty(varName))
        {
            return varName;
        }

        foreach (var prefix in VARIABLE_NAME_REGEX)
        {
            if (varName.StartsWith(prefix))
            {
                varName = varName[prefix.Length..];
                varName = GetComponentName(varName);
                break;
            }
        }
        return varName;
    }
}