using System;
using TEngine;
using UnityEditor;

/// <summary>
/// 出 Windows 包:打资源包(全量随包)→ 出 Player。
/// 菜单与命令行共用:<c>Unity.exe -batchmode -quit -buildTarget Win64 -projectPath Demo -executeMethod WindowsBuild.Build</c>。
/// 失败抛异常,batchmode 下以非零码退出。
/// </summary>
/// <remarks>
/// 热更 DLL 不编:HybridCLR 关闭期间热更程序集按普通程序集编进 Player(见 ProcedureLoadAssembly 的非热更分支)。
/// 开热更时改走 TEngine/Build 打包工具窗口,本入口随之停用。
/// </remarks>
public static class WindowsBuild
{
    /// <summary>Player 输出路径,相对工程根;Build/ 已被 .gitignore 忽略。</summary>
    private const string PlayerPath = "Build/Windows/3B.exe";

    [MenuItem("3B/出 Windows 包")]
    public static void Build()
    {
        var config = BuildConfig.CreateDefault();
        config.BuildTarget = BuildTarget.StandaloneWindows64;
        config.PlayerPlatform = BuildTarget.StandaloneWindows64;
        config.BuildHotFixDll = false;
        config.BuildPlayer = false;
        config.PackageVersion = ReleaseTools.ResolveAvailablePackageVersion(config);

        // 不出 Player 时 BuildWithConfig 同步跑完并在返回前回调。
        bool assetsOk = false;
        ReleaseTools.BuildWithConfig(config, buildPlayer: false, ok => assetsOk = ok);
        if (!assetsOk)
        {
            throw new Exception("[WindowsBuild] 资源包构建失败,见上方日志");
        }

        PackageVersionStore.Commit(config.PackageVersion);

        if (!ReleaseTools.BuildImp(BuildTargetGroup.Standalone, BuildTarget.StandaloneWindows64, PlayerPath))
        {
            throw new Exception("[WindowsBuild] Player 构建失败,见上方日志");
        }
    }
}
