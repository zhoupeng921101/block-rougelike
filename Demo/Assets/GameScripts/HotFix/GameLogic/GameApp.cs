using System;
using System.Collections.Generic;
using System.Reflection;
using Cysharp.Threading.Tasks;
using TEngine;

/// <summary>
/// 游戏 App:热更域的入口。由启动器的 ProcedureLoadAssembly 反射调用 <see cref="Entrance"/>。
/// </summary>
public partial class GameApp
{
    private static List<Assembly> _hotfixAssembly;

    /// <summary>启动器界面的关闭回调(入口参数第二项)。主界面开出来之后才调,之前一直留着启动器界面,不露黑屏。</summary>
    private static Action _releaseLauncherUI;

    /// <summary>
    /// 热更域 App 主入口。参数:[0] 热更程序集清单;[1] 启动器界面的关闭回调;
    /// [2]、[3] 清理缓存的两步,本作首发离线不用。
    /// </summary>
    public static void Entrance(object[] objects)
    {
        _hotfixAssembly = (List<Assembly>)objects[0];
        _releaseLauncherUI = objects.Length > 1 ? objects[1] as Action : null;
        Utility.Unity.AddDestroyListener(Release);
        StartGameLogic().Forget();
    }

    private static async UniTaskVoid StartGameLogic()
    {
        await TuningTable.Instance.LoadAsync();
        await TextTable.Instance.LoadAsync();
        GameModule.UI.ShowUIAsync<UIMainMenuPanel>();
        var menu = await GameModule.UI.WaitOpenedAsync(typeof(UIMainMenuPanel));
        if (menu == null)
        {
            Log.Error("[GameApp] 主界面没能打开,启动器界面保留");
            return;
        }

        _releaseLauncherUI?.Invoke();
        _releaseLauncherUI = null;
    }

    private static void Release()
    {
        SingletonSystem.Release();
    }
}
