#if ENABLE_HYBRIDCLR
using HybridCLR.Editor;
using HybridCLR.Editor.Commands;
#endif
using System.IO;
#if ENABLE_OBFUZ
using Obfuz.Settings;
using Obfuz4HybridCLR;
#endif
using System.Collections.Generic;
using HybridCLR.Editor.Installer;
using TEngine.Editor;
using UnityEditor;
using UnityEngine;

public static class BuildDLLCommand
{
    /// <summary>
    /// 开启热更 DLL 链路的宏名。公开供 <c>ReleasePreCheck</c> 核对目标平台 define 用,两处共用一份字面量。
    /// </summary>
    public const string EnableHybridClrScriptingDefineSymbol = "ENABLE_HYBRIDCLR";
    private const string EnableObfuzScriptingDefineSymbol = "ENABLE_OBFUZ";

    #region HybridCLR/Define Symbols
    /// <summary>
    /// 禁用HybridCLR宏定义。
    /// </summary>
    [MenuItem("HybridCLR/Define Symbols/Disable HybridCLR", false, 30)]
    public static void DisableHybridCLR()
    {
        ScriptingDefineSymbols.RemoveScriptingDefineSymbol(EnableHybridClrScriptingDefineSymbol);
        HybridCLR.Editor.SettingsUtil.Enable = false;
#if ENABLE_HYBRIDCLR
        UpdateSettingEditor.ForceUpdateAssemblies();
#endif
    }

    /// <summary>
    /// 开启HybridCLR宏定义。
    /// </summary>
    [MenuItem("HybridCLR/Define Symbols/Enable HybridCLR", false, 31)]
    public static void EnableHybridCLR()
    {
        // 先去判断安装了没
        var controller = new InstallerController();
        if (!controller.HasInstalledHybridCLR())
        {
            controller.InstallDefaultHybridCLR();
        }

        if (!HybridCLR.Editor.SettingsUtil.Enable)
        {
            HybridCLR.Editor.SettingsUtil.Enable = true;
#if ENABLE_HYBRIDCLR
            UpdateSettingEditor.ForceUpdateAssemblies();
#endif
        }
        ScriptingDefineSymbols.RemoveScriptingDefineSymbol(EnableHybridClrScriptingDefineSymbol);
        ScriptingDefineSymbols.AddScriptingDefineSymbol(EnableHybridClrScriptingDefineSymbol);
        UpdateSettingEditor.ForceUpdateAssemblies();
    }
    #endregion
    
#if ENABLE_OBFUZ
    #region Obfuz/Define Symbols
    /// <summary>
    /// 禁用Obfuz宏定义。
    /// </summary>
    [MenuItem("Obfuz/Define Symbols/Disable Obfuz", false, 30)]
    public static void DisableObfuz()
    {
        ScriptingDefineSymbols.RemoveScriptingDefineSymbol(EnableObfuzScriptingDefineSymbol);
        ObfuzSettings.Instance.buildPipelineSettings.enable = false;
    }

    /// <summary>
    /// 开启Obfuz宏定义。
    /// </summary>
    [MenuItem("Obfuz/Define Symbols/Enable Obfuz", false, 31)]
    public static void EnableObfuz()
    {
        ScriptingDefineSymbols.RemoveScriptingDefineSymbol(EnableObfuzScriptingDefineSymbol);
        ScriptingDefineSymbols.AddScriptingDefineSymbol(EnableObfuzScriptingDefineSymbol);
        ObfuzSettings.Instance.buildPipelineSettings.enable = true;
    }
    #endregion
#endif

    /// <summary>
    /// 确认 ENABLE_HYBRIDCLR 宏已定义,未定义即抛构建失败。所有热更 DLL 产出入口进门先调。
    /// </summary>
    /// <param name="entryName">调用方法名,写进失败信息定位是哪条链路被拦。</param>
    /// <remarks>
    /// 本类的产出方法体全部裹在 ENABLE_HYBRIDCLR 内,宏关时调用是空壳:构建照常跑完、退出码正常,
    /// 只是一个 .dll.bytes 都没产出,首包里没有热更程序集,要到真机启动时 ProcedureLoadAssembly
    /// 找不到主逻辑程序集才中断。做成硬失败使这个状态在构建期显形。
    /// 走面板的构建另有 <c>ReleasePreCheck</c> 的配置类检查提前拦下(不消耗资源版本号);
    /// 本方法兜的是 <c>ReleaseTools</c> 批处理这类不经面板的调用方。
    /// </remarks>
    private static void EnsureHybridCLRDefined(string entryName)
    {
#if !ENABLE_HYBRIDCLR
        throw new UnityEditor.Build.BuildFailedException(
            $"[BuildDLLCommand] {entryName} 被调用,但 ENABLE_HYBRIDCLR 宏未定义:热更 DLL 的编译与拷贝全部空转," +
            "构建会以成功退出却产不出任何 .dll.bytes,真机启动时加载主逻辑程序集失败。" +
            "走菜单 HybridCLR/Define Symbols/Enable HybridCLR 打开宏后重打;" +
            "本次确实不需要热更 DLL 时,在打包面板取消勾选『构建前编译热更DLL』。");
#endif
    }

    [MenuItem("HybridCLR/Build/BuildAssets And CopyTo AssemblyTextAssetPath")]
    public static void BuildAndCopyDlls()
    {
        EnsureHybridCLRDefined(nameof(BuildAndCopyDlls));
#if ENABLE_HYBRIDCLR
        BuildTarget target = EditorUserBuildSettings.activeBuildTarget;
        CompileDllCommand.CompileDll(target);
        CopyAOTHotUpdateDlls(target);
#endif
    }

    public static void BuildAndCopyDlls(BuildTarget target)
    {
        EnsureHybridCLRDefined(nameof(BuildAndCopyDlls));
#if ENABLE_HYBRIDCLR
        CompileDllCommand.CompileDll(target);
        CopyAOTHotUpdateDlls(target);
#endif
    }

    /// <summary>
    /// 跑 HybridCLR 完整生成链后编译并拷贝热更 DLL,供出 Player 的构建使用。
    /// </summary>
    /// <param name="target">目标平台;须与编辑器当前激活平台一致,生成链与拷贝动作都按激活平台取 dll。</param>
    /// <remarks>
    /// 出 Player 的构建必须走本方法而不是 <see cref="BuildAndCopyDlls()"/>:后者拷的是上一次构建遗留的裁剪
    /// AOT dll,与本次 Player 的 AOT 不同源,真机加载补充元数据时原生崩溃(libc memcpy SIGSEGV),托管侧拦不到。
    /// 生成链内部用 scripts-only 构建产出裁剪 AOT dll,不必额外打一次完整包;其中已含热更 DLL 编译,故此处不再单独编译。
    /// </remarks>
    public static void GenerateAllAndCopyDlls(BuildTarget target)
    {
        EnsureHybridCLRDefined(nameof(GenerateAllAndCopyDlls));
#if ENABLE_HYBRIDCLR
        PrebuildCommand.GenerateAll();
        CopyAOTHotUpdateDlls(target);
#endif
    }

    /// <summary>
    /// 开发期快速重生成 link.xml 与 AOTGenericReferences.cs:跳过 <c>Generate/All</c> 里最耗时的 AOTDlls 步,
    /// 复用上一次留在裁剪目录里的 AOT dll。仅供改完热更代码后就地验证,**不可用于出包**。
    /// </summary>
    /// <remarks>
    /// 跳得掉的依据:裁剪 AOT dll 只随主包 AOT 代码变化,改热更代码时它没变;而 AOTDlls 步每次都删掉整个临时
    /// 工程、带 <c>CleanBuildCache</c> 重跑一次 scripts-only 的 <c>BuildPipeline.BuildPlayer</c>,数分钟起。
    /// <para>
    /// 刻意不含 MethodBridgeAndReversePInvokeWrapper:它产出的 <c>MethodBridge.cpp</c> 只在 IL2CPP 出包时参与编译,
    /// 编辑器走 Mono 不经过,对开发期验证无贡献;且它末尾会删掉 <c>Library/Il2cppBuildCache</c>,使后续任何一次出包
    /// 退化成 il2cpp 全量编译,与本入口省时间的目的相反。热更侧新增 <c>[MonoPInvokeCallback]</c> 或新的 P/Invoke
    /// 签名时本入口覆盖不到,须走 <c>HybridCLR/Generate/All</c>。
    /// </para>
    /// <para>
    /// 出包一律走 <see cref="GenerateAllAndCopyDlls(BuildTarget)"/>,原因见该方法注释。
    /// 本入口写的是 git 内的正式产物,而分析基线是复用的旧 AOT dll——期间主包 AOT 代码改过则结果不准,故每次成功都留一条警告。
    /// </para>
    /// </remarks>
    [MenuItem("HybridCLR/Build/[开发期] 快速重生成 LinkXml 与 AOTGenericReference (跳过 AOTDlls)")]
    public static void DevRegenerateSkippingAOTDlls()
    {
        EnsureHybridCLRDefined(nameof(DevRegenerateSkippingAOTDlls));
#if ENABLE_HYBRIDCLR
        BuildTarget target = EditorUserBuildSettings.activeBuildTarget;
        string aotAssembliesSrcDir = SettingsUtil.GetAssembliesPostIl2CppStripDir(target);

        // 先拦空目录再动手:LinkXml 与 AOTGenericReference 都拿这个目录当 AOT 程序集解析源,而这两条路径
        // HybridCLR 自己不做非空检查(抛 no aot assembly found 的是 MethodBridge,不在本入口内)。目录空着跑
        // 下去不会失败,只会产出漏掉 AOT 类型的 link.xml 与泛型清单,污染 git 里的正式产物且无任何报错。
        bool hasStrippedAotDll = Directory.Exists(aotAssembliesSrcDir)
                                 && Directory.GetFiles(aotAssembliesSrcDir, "*.dll", SearchOption.TopDirectoryOnly).Length > 0;
        if (!hasStrippedAotDll)
        {
            throw new UnityEditor.Build.BuildFailedException(
                $"[BuildDLLCommand] 裁剪后的 AOT dll 目录为空:{aotAssembliesSrcDir}。" +
                "本入口复用上一次生成的裁剪 AOT dll,没有它就没有 AOT 程序集解析源。" +
                "先跑一次 HybridCLR/Generate/All 或完整打一次 Player 产出该目录,之后才能用本入口做快速重生成。" +
                "刚切过目标平台也会这样——该目录按平台分,新平台的目录是空的。");
        }

        CompileDllCommand.CompileDll(target);
        LinkGeneratorCommand.GenerateLinkXml(target);
        AOTReferenceGeneratorCommand.GenerateAOTGenericReference(target);

        Debug.LogWarning($"[BuildDLLCommand] 已跳过 AOTDlls 完成快速重生成(平台 {target})。" +
                         $"link.xml 与 AOTGenericReferences.cs 基于复用的旧裁剪 AOT dll({aotAssembliesSrcDir})算出," +
                         "主包 AOT 代码若在这期间改过则结果不准。出包前必须走 HybridCLR/Generate/All 重算。");
#endif
    }

    public static void CopyAOTHotUpdateDlls(BuildTarget target)
    {
        EnsureHybridCLRDefined(nameof(CopyAOTHotUpdateDlls));
        CopyAOTAssembliesToAssetPath();
        CopyHotUpdateAssembliesToAssetPath();
        
#if ENABLE_HYBRIDCLR && ENABLE_OBFUZ
        CompileDllCommand.CompileDll(target);

        string obfuscatedHotUpdateDllPath = PrebuildCommandExt.GetObfuscatedHotUpdateAssemblyOutputPath(target);
        ObfuscateUtil.ObfuscateHotUpdateAssemblies(target, obfuscatedHotUpdateDllPath);

        Directory.CreateDirectory(Application.streamingAssetsPath);

        string hotUpdateDllPath = $"{SettingsUtil.GetHotUpdateDllsOutputDirByTarget(target)}";
        List<string> obfuscationRelativeAssemblyNames = ObfuzSettings.Instance.assemblySettings.GetObfuscationRelativeAssemblyNames();

        foreach (string assName in SettingsUtil.HotUpdateAssemblyNamesIncludePreserved)
        {
            string srcDir = obfuscationRelativeAssemblyNames.Contains(assName) ? obfuscatedHotUpdateDllPath : hotUpdateDllPath;
            string srcFile = $"{srcDir}/{assName}.dll";
            string dstFile = Application.dataPath +"/"+ TEngine.Settings.UpdateSetting.AssemblyTextAssetPath  + $"/{assName}.dll.bytes";
            if (File.Exists(srcFile))
            {
                File.Copy(srcFile, dstFile, true);
                Debug.Log($"[CompileAndObfuscate] Copy {srcFile} to {dstFile}");
            }
        }
#endif

        AssetDatabase.Refresh();
    }

    /// <summary>
    /// 算本次裁剪 AOT 的指纹:按名排序后把 <c>AOTMetaAssemblies</c> 各裁剪 dll 的内容顺次喂进 SHA256。
    /// </summary>
    /// <param name="target">目标平台;裁剪产物目录按平台分。</param>
    /// <returns>小写 hex 指纹;任一 dll 缺失返回 <c>null</c>(由调用方决定告警强度)。</returns>
    /// <remarks>
    /// 取材范围与 <see cref="VerifyAOTMetadataMatchesPlayer"/> 同一批文件,依赖同一个前提:il2cpp 裁剪
    /// 对未变输入是确定性的。因此在 <c>GenerateAllAndCopyDlls</c> 之后算出的指纹,与正式 BuildPlayer
    /// 再次重写裁剪目录后的结果一致——这是指纹能在打 Player 之前就写进 AB 的依据。
    /// <para>
    /// 排序不能省:<c>Directory.GetFiles</c> 与清单顺序都不保证跨机稳定,不排序会让同一批 AOT 在不同
    /// 机器上算出不同指纹,把正常发布判成不匹配。
    /// </para>
    /// </remarks>
    public static string ComputeAotFingerprint(BuildTarget target)
    {
#if ENABLE_HYBRIDCLR
        var aotAssemblies = TEngine.Settings.UpdateSetting.AOTMetaAssemblies;
        if (aotAssemblies == null || aotAssemblies.Count == 0)
        {
            return null;
        }

        string projectRoot = Path.GetDirectoryName(Application.dataPath);
        string strippedDir = Path.GetFullPath(Path.Combine(projectRoot, SettingsUtil.GetAssembliesPostIl2CppStripDir(target)));

        var ordered = new List<string>(aotAssemblies);
        ordered.Sort(System.StringComparer.Ordinal);

        using (var sha = System.Security.Cryptography.SHA256.Create())
        {
            foreach (var dll in ordered)
            {
                string path = $"{strippedDir}/{dll}";
                if (!File.Exists(path))
                {
                    Debug.LogError($"[BuildDLLCommand] 算 AOT 指纹时缺文件:{path}。" +
                                   "裁剪 AOT dll 由 HybridCLR 生成链产出:先跑菜单 HybridCLR/Generate/All," +
                                   "再按「构建 AssetBundle → 构建 Player」的顺序出包;刚切过目标平台同样要先跑一次。");
                    return null;
                }

                // 名字也进摘要:只喂内容的话,清单增删一项而各项内容不变时指纹不动,漏掉「补充元数据清单变了」这一类变更。
                byte[] nameBytes = System.Text.Encoding.UTF8.GetBytes(dll + "\n");
                sha.TransformBlock(nameBytes, 0, nameBytes.Length, null, 0);
                byte[] content = File.ReadAllBytes(path);
                sha.TransformBlock(content, 0, content.Length, null, 0);
            }

            sha.TransformFinalBlock(System.Array.Empty<byte>(), 0, 0);
            var sb = new System.Text.StringBuilder(64);
            foreach (byte b in sha.Hash)
            {
                sb.Append(b.ToString("x2"));
            }

            return sb.ToString();
        }
#else
        return null;
#endif
    }

    /// <summary>
    /// 把本次 AOT 指纹写进热更资源侧载体 <c>AOTFingerprint.bytes</c>,供打 AB 时收进包。
    /// </summary>
    /// <param name="target">目标平台。</param>
    /// <returns>写成功为 true;指纹算不出为 false(详情已记 <c>Debug.LogError</c>)。</returns>
    /// <remarks>
    /// 挂载点约定见 <see cref="WriteAotFingerprintForPlayer"/> 的 remarks,两者同一套理由。
    /// <para>
    /// 调用方对失败的处置与 Player 侧刻意不对称:那边算不出即不出包,这边算不出只记 Error、照常打 AB。
    /// 因为算不出的唯一情形是裁剪目录还没有(工程从未出过 Player),那时 Player 侧也必然没有指纹,客户端
    /// 走「本包无指纹则跳过校验」分支,不会误伤;而没有指纹的 Player 是真的危险——它认不出错配,会闪退。
    /// </para>
    /// </remarks>
    public static bool WriteAotFingerprintForAssetBundle(BuildTarget target)
    {
#if ENABLE_HYBRIDCLR
        string fingerprint = ComputeAotFingerprint(target);
        if (string.IsNullOrEmpty(fingerprint))
        {
            Debug.LogError("[BuildDLLCommand] AOT 指纹算不出,热更资源侧载体未写入。" +
                           "这批 AB 发出去会让带指纹的客户端判「版本过旧」。裁剪 AOT dll 由 HybridCLR 生成链产出:" +
                           "先跑菜单 HybridCLR/Generate/All 再打 AB;" +
                           "刚切过目标平台同样要先跑一次(裁剪目录按平台分)。");
            return false;
        }

        var setting = TEngine.Settings.UpdateSetting;
        string bytesPath = Application.dataPath + "/" + setting.AssemblyTextAssetPath
                           + $"/{TEngine.UpdateSetting.AotFingerprintAssetName}.bytes";
        File.WriteAllText(bytesPath, fingerprint, new System.Text.UTF8Encoding(false));
        AssetDatabase.ImportAsset(
            "Assets/" + setting.AssemblyTextAssetPath + $"/{TEngine.UpdateSetting.AotFingerprintAssetName}.bytes");

        Debug.Log($"[BuildDLLCommand] AOT 指纹 {fingerprint} 已写入热更资源侧载体 {bytesPath}");
        return true;
#else
        return true;
#endif
    }

    /// <summary>Player 侧指纹载体的工程内路径,运行时按 <see cref="TEngine.UpdateSetting.PlayerAotFingerprintResourceName"/> 从 Resources 读。</summary>
    private static readonly string PlayerAotFingerprintAssetPath =
        $"Assets/TEngine/Settings/Resources/{TEngine.UpdateSetting.PlayerAotFingerprintResourceName}.txt";

    /// <summary>
    /// 生成本次 AOT 指纹的 Player 侧载体,供紧接着的 BuildPlayer 打进包;构建结束后须调 <see cref="DeleteAotFingerprintForPlayer"/>。
    /// </summary>
    /// <param name="target">目标平台。</param>
    /// <returns>写成功为 true;指纹算不出为 false(详情已记 <c>Debug.LogError</c>)。</returns>
    /// <remarks>
    /// 两个写入方法各自挂在「实际执行该构建动作的地方」,而不是挂在某条组合流程里:面板上产出 AB 或
    /// Player 的入口有多个(单独构建、一键构建+部署、菜单一键打包),挂在组合流程里必然漏掉另几条,漏掉的
    /// 后果不是闸失效那么简单——两侧指纹一新一旧时会把好包判成「客户端版本过旧」,玩家进不去。
    /// <para>
    /// 时序自洽的依据:指纹的取材恒为「当前裁剪目录里的那份 AOT」。只打 AB 时裁剪目录不被触碰,算出的
    /// 就是上一次出 Player 时的 AOT 指纹,而那正是包里存着的值,两侧自然相等;出 Player 时在
    /// <c>BuildPipeline.BuildPlayer</c> 之前算,写进包的是上次裁剪的指纹,若这次裁剪结果与之不同,
    /// <see cref="VerifyAOTMetadataMatchesPlayer"/> 会在出包之后判构建失败——故「构建成功」蕴含
    /// 「两次裁剪结果相同」,指纹因而正确。
    /// </para>
    /// <para>
    /// 载体只在构建窗口内存在、不入库:留在工作区会被下一次绕过出包管线打的包带进去,那个值可能属于别的
    /// 平台或上一次构建,会把配套的热更资源判成「客户端版本过旧」;包里没有载体时运行时按非管线出包跳过校验。
    /// </para>
    /// </remarks>
    public static bool WriteAotFingerprintForPlayer(BuildTarget target)
    {
#if ENABLE_HYBRIDCLR
        string fingerprint = ComputeAotFingerprint(target);
        if (string.IsNullOrEmpty(fingerprint))
        {
            Debug.LogError("[BuildDLLCommand] AOT 指纹算不出,Player 侧载体未生成。" +
                           "这个包认不出「热更资源与自己的 AOT 不同源」,那种组合会在真机上原生闪退。" +
                           "裁剪 AOT dll 由 HybridCLR 生成链产出,单独「构建 Player」会在这里被拦下、产不出它:" +
                           "先跑菜单 HybridCLR/Generate/All,再按「构建 AssetBundle → 构建 Player」的顺序出包;刚切过目标平台同样要先跑一次。");
            return false;
        }

        string fullPath = Path.Combine(Path.GetDirectoryName(Application.dataPath), PlayerAotFingerprintAssetPath);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath));
        File.WriteAllText(fullPath, fingerprint, new System.Text.UTF8Encoding(false));
        AssetDatabase.ImportAsset(PlayerAotFingerprintAssetPath, ImportAssetOptions.ForceSynchronousImport);

        Debug.Log($"[BuildDLLCommand] AOT 指纹 {fingerprint} 已写入 Player 侧载体 {PlayerAotFingerprintAssetPath}");
        return true;
#else
        return true;
#endif
    }

    /// <summary>删掉 Player 侧指纹载体;构建成功失败都要调,载体不存在时不做任何事。</summary>
    public static void DeleteAotFingerprintForPlayer()
    {
        if (AssetDatabase.DeleteAsset(PlayerAotFingerprintAssetPath))
        {
            Debug.Log($"[BuildDLLCommand] Player 侧指纹载体已删除:{PlayerAotFingerprintAssetPath}");
        }
    }

    /// <summary>
    /// 从 AOTGenericReferences.cs 文本解析 PatchedAOTAssemblyList 的 dll 名清单。
    /// 文本解析而非引用类型：该类编译进 Assembly-CSharp，asmdef（TEngine.Editor / 测试程序集）引用不到。
    /// 打包期核对与 EditMode 一致性测试共用此单一解析器，防两处独立漂移。解析不出条目返回空列表，由调用方决定告警强度。
    /// </summary>
    public static List<string> ParsePatchedAotAssemblyList(string aotGenericReferencesText)
    {
        var result = new List<string>();
        int listStart = aotGenericReferencesText.IndexOf("PatchedAOTAssemblyList", System.StringComparison.Ordinal);
        if (listStart < 0)
        {
            return result;
        }

        int listEnd = aotGenericReferencesText.IndexOf("};", listStart, System.StringComparison.Ordinal);
        string block = listEnd > listStart
            ? aotGenericReferencesText.Substring(listStart, listEnd - listStart)
            : aotGenericReferencesText.Substring(listStart);
        foreach (System.Text.RegularExpressions.Match match in
                 System.Text.RegularExpressions.Regex.Matches(block, "\"([^\"]+\\.dll)\""))
        {
            result.Add(match.Groups[1].Value);
        }

        return result;
    }

    /// <summary>
    /// 核对 UpdateSetting.AOTMetaAssemblies 覆盖 AOTGenericReferences.PatchedAOTAssemblyList。
    /// 后者是 HybridCLR Generate 分析出的「运行时必须补充元数据」需求清单，前者是实际打包并在
    /// ProcedureLoadAssembly 加载的清单；漏项在 Editor 无症状，真机 IL2CPP 上以 ExecutionEngineException 暴露。
    /// 缺失即抛异常中断，使菜单与批处理/CI 构建硬失败而非错误日志滚过；
    /// 生成文件缺失（尚未跑 Generate）仅告警放行，解析不出条目（生成格式与解析规则失配）报错放行。
    /// </summary>
    private static void ValidateAOTMetaAssembliesCoverage()
    {
        // 路径取 HybridCLR 设置里配置的生成路径,与生成器写文件的路径同源(AOTReferenceGeneratorCommand 用的就是
        // $"{Application.dataPath}/{gs.outputAOTGenericReferenceFile}")。此处曾写死设置类的默认值
        // "HybridCLRGenerate/AOTGenericReferences.cs",而本工程配的是 "Launcher/HybridCLRGenerate/…",
        // 于是恒走下面的「文件不存在」分支——这道核对从未真正执行过,漏项要等真机崩了才知道。
        string genFilePath = Application.dataPath + "/" + HybridCLR.Editor.Settings.HybridCLRSettings.Instance.outputAOTGenericReferenceFile;
        if (!File.Exists(genFilePath))
        {
            Debug.LogWarning($"[BuildDLLCommand] 未找到 {genFilePath}，跳过 AOT 补充元数据覆盖核对；先跑 HybridCLR/Generate/All 再打包。");
            return;
        }

        var required = ParsePatchedAotAssemblyList(File.ReadAllText(genFilePath));
        if (required.Count == 0)
        {
            Debug.LogError("[BuildDLLCommand] 从 AOTGenericReferences.cs 解析不到 PatchedAOTAssemblyList 条目，覆盖核对已失效：" +
                           "解析规则可能与 HybridCLR 生成格式失配，请修复 ParsePatchedAotAssemblyList 或人工核对清单。");
            return;
        }

        var missing = new List<string>();
        foreach (string dllName in required)
        {
            if (!TEngine.Settings.UpdateSetting.AOTMetaAssemblies.Contains(dllName))
            {
                missing.Add(dllName);
            }
        }

        if (missing.Count > 0)
        {
            throw new UnityEditor.Build.BuildFailedException(
                $"[BuildDLLCommand] AOT 补充元数据清单缺失：{string.Join(", ", missing)}。" +
                "AOTGenericReferences.PatchedAOTAssemblyList 要求补充这些程序集的元数据，但 UpdateSetting.AOTMetaAssemblies 未包含，" +
                "真机 IL2CPP 热更代码触发其 AOT 泛型时将抛 ExecutionEngineException。请在 UpdateSetting 中补齐后重打。");
        }
    }

    /// <summary>
    /// 核对已打进 AB 的 AOT 补充元数据 <c>.dll.bytes</c> 与本次 Player 构建的裁剪产物逐字节同源。
    /// </summary>
    /// <param name="target">目标平台;裁剪产物目录按平台分。</param>
    /// <returns>全部同源(或 HybridCLR 宏关、清单为空)为 true;有缺失或不同源为 false,失败详情已记 <c>Debug.LogError</c>。</returns>
    /// <remarks>
    /// 调用点在 <c>ReleaseTools.BuildImp</c> 出包成功之后,不能提前到打 AB 之前:整链出包(Generate/All 后接着打 AB 与 Player)里 bytes 是
    /// <see cref="GenerateAllAndCopyDlls"/> 刚从裁剪目录拷出的,AB 之前比对恒相等;而 HybridCLR 挂在构建管线上的
    /// CopyStrippedAOTAssemblies 每次 BuildPlayer 都重写裁剪目录,错配正是在那一刻产生的。出包成功后该目录里的
    /// 就是这个包的真实 AOT,此时比对才有判别力。
    /// <para>
    /// 逐字节而非按时间戳:il2cpp 裁剪对未变输入是确定性的(同一批 AOT 源跨两次构建裁出的 dll 字节相同),
    /// 而 bytes 每次 File.Copy 都刷新 mtime,时间戳比不出同源性。
    /// </para>
    /// <para>
    /// 不同源的后果不是托管异常:<c>ProcedureLoadAssembly</c> 把 bytes 交给 <c>RuntimeApi.LoadMetadataForAOTAssembly</c>,
    /// 原生侧按错位偏移读元数据表,表现为 libc memcpy 里的 SIGSEGV,进程直接死,托管 try/catch 拦不到,
    /// 日志上只留最后一条「LoadMetadataAssetSuccess」。因此必须在构建期拦住。
    /// </para>
    /// </remarks>
    public static bool VerifyAOTMetadataMatchesPlayer(BuildTarget target)
    {
#if ENABLE_HYBRIDCLR
        var aotAssemblies = TEngine.Settings.UpdateSetting.AOTMetaAssemblies;
        if (aotAssemblies == null || aotAssemblies.Count == 0)
        {
            return true;
        }

        // GetAssembliesPostIl2CppStripDir 返回相对工程根的路径,展开成绝对路径再进错误消息:
        // 这条消息的全部价值在于让人立刻去看那两个目录,相对路径在 Console 里指不明白锚点。
        string projectRoot = Path.GetDirectoryName(Application.dataPath);
        string strippedDir = Path.GetFullPath(Path.Combine(projectRoot, SettingsUtil.GetAssembliesPostIl2CppStripDir(target)));
        string bytesDir = Application.dataPath + "/" + TEngine.Settings.UpdateSetting.AssemblyTextAssetPath;

        var mismatched = new List<string>();
        foreach (var dll in aotAssemblies)
        {
            string strippedPath = $"{strippedDir}/{dll}";
            string bytesPath = $"{bytesDir}/{dll}.bytes";

            if (!File.Exists(strippedPath))
            {
                mismatched.Add($"{dll}(裁剪产物缺失:{strippedPath})");
                continue;
            }

            if (!File.Exists(bytesPath))
            {
                mismatched.Add($"{dll}(打包用 bytes 缺失:{bytesPath})");
                continue;
            }

            byte[] strippedBytes = File.ReadAllBytes(strippedPath);
            byte[] packedBytes = File.ReadAllBytes(bytesPath);
            if (strippedBytes.Length != packedBytes.Length)
            {
                mismatched.Add($"{dll}(长度不同:本次裁剪 {strippedBytes.Length} 字节,打包用 {packedBytes.Length} 字节)");
                continue;
            }

            for (int i = 0; i < strippedBytes.Length; i++)
            {
                if (strippedBytes[i] != packedBytes[i])
                {
                    mismatched.Add($"{dll}(长度相同但内容不同,首个差异在第 {i} 字节)");
                    break;
                }
            }
        }

        if (mismatched.Count == 0)
        {
            return true;
        }

        Debug.LogError(
            "[BuildDLLCommand] AOT 补充元数据与本次 Player 不同源,这个包不可用,装到真机会在启动加载元数据时原生崩溃(SIGSEGV):\n" +
            $"  {string.Join("\n  ", mismatched)}\n" +
            $"  本次裁剪产物目录:{strippedDir}\n" +
            $"  打包用 bytes 目录:{bytesDir}\n" +
            "成因是 bytes 拷自更早一次构建的裁剪产物,与这个包的 AOT 不是同一批。" +
            "修法:按序重打——先跑菜单 HybridCLR/Generate/All(生成本次裁剪 AOT dll),再点打包面板「构建 AssetBundle」(拷 bytes 并打 AB),最后点「构建 Player」;" +
            "不要在 Player 构建之后单独补打 AB,也不要用「只打 AB」的产物配这个包。");
        return false;
#else
        return true;
#endif
    }

    /// <summary>
    /// 把裁剪后的 AOT 补充元数据 dll 拷成 <c>.dll.bytes</c>。任一项缺失即抛
    /// <see cref="UnityEditor.Build.BuildFailedException"/>,不拷部分结果。
    /// </summary>
    public static void CopyAOTAssembliesToAssetPath()
    {
#if ENABLE_HYBRIDCLR
        ValidateAOTMetaAssembliesCoverage();
        var target = EditorUserBuildSettings.activeBuildTarget;
        string aotAssembliesSrcDir = SettingsUtil.GetAssembliesPostIl2CppStripDir(target);
        string aotAssembliesDstDir = Application.dataPath +"/"+ TEngine.Settings.UpdateSetting.AssemblyTextAssetPath;

        // 整批核对完再拷:缺一项就一项都不拷,不留半套 .dll.bytes 让后续步骤误当齐全。
        var missingFiles = new List<string>();
        foreach (var dll in TEngine.Settings.UpdateSetting.AOTMetaAssemblies)
        {
            if (!System.IO.File.Exists($"{aotAssembliesSrcDir}/{dll}"))
            {
                missingFiles.Add(dll);
            }
        }

        if (missingFiles.Count > 0)
        {
            throw new UnityEditor.Build.BuildFailedException(
                $"[BuildDLLCommand] 裁剪后的 AOT dll 不存在:{string.Join(", ", missingFiles)}(源目录 {aotAssembliesSrcDir})。" +
                "这些 dll 只在 BuildPlayer 期间由 il2cpp 裁剪产出,先跑一次菜单 HybridCLR/Generate/All 再单独打 AB;" +
                "刚切过目标平台也会这样——源目录按平台分,新平台的目录是空的。" +
                "缺它们打出的 AB 里没有 AOT 补充元数据,真机热更代码触发对应 AOT 泛型时抛 ExecutionEngineException。");
        }

        foreach (var dll in TEngine.Settings.UpdateSetting.AOTMetaAssemblies)
        {
            string srcDllPath = $"{aotAssembliesSrcDir}/{dll}";
            string dllBytesPath = $"{aotAssembliesDstDir}/{dll}.bytes";
            System.IO.File.Copy(srcDllPath, dllBytesPath, true);
            Debug.Log($"[CopyAOTAssembliesToStreamingAssets] copy AOT dll {srcDllPath} -> {dllBytesPath}");
        }
#endif
    }

    /// <summary>
    /// 把编译好的热更程序集拷成 <c>.dll.bytes</c>。任一项缺失即抛
    /// <see cref="UnityEditor.Build.BuildFailedException"/>,不拷部分结果。
    /// </summary>
    public static void CopyHotUpdateAssembliesToAssetPath()
    {
#if ENABLE_HYBRIDCLR
        var target = EditorUserBuildSettings.activeBuildTarget;

        string hotfixDllSrcDir = SettingsUtil.GetHotUpdateDllsOutputDirByTarget(target);
        string hotfixAssembliesDstDir = Application.dataPath +"/"+ TEngine.Settings.UpdateSetting.AssemblyTextAssetPath;

        // 与 CopyAOTAssembliesToAssetPath 同口径:整批核对完再拷,缺一项就一项都不拷。
        var missingFiles = new List<string>();
        foreach (var dll in SettingsUtil.HotUpdateAssemblyFilesExcludePreserved)
        {
            if (!System.IO.File.Exists($"{hotfixDllSrcDir}/{dll}"))
            {
                missingFiles.Add(dll);
            }
        }

        if (missingFiles.Count > 0)
        {
            throw new UnityEditor.Build.BuildFailedException(
                $"[BuildDLLCommand] 热更程序集不存在:{string.Join(", ", missingFiles)}(源目录 {hotfixDllSrcDir})。" +
                "这些 dll 由 CompileDllCommand.CompileDll 当场编译产出,缺文件意味着编译没跑、编译失败,或热更程序集清单里列了实际不存在的程序集。" +
                "先看 Console 有无编译错误;清单对不上时改 Assets/TEngine/Settings/UpdateSetting.asset 的 HotUpdateAssemblies(事实源)" +
                "再跑 UpdateSettingEditor.ForceUpdateAssemblies() 同步到 HybridCLRSettings,不直接改后者。");
        }

        foreach (var dll in SettingsUtil.HotUpdateAssemblyFilesExcludePreserved)
        {
            string dllPath = $"{hotfixDllSrcDir}/{dll}";
            string dllBytesPath = $"{hotfixAssembliesDstDir}/{dll}.bytes";
            System.IO.File.Copy(dllPath, dllBytesPath, true);
            Debug.Log($"[CopyHotUpdateAssembliesToStreamingAssets] copy hotfix dll {dllPath} -> {dllBytesPath}");
        }
#endif
    }
}