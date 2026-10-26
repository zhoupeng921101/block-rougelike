using System;
using Cysharp.Threading.Tasks;
using TEngine;
using YooAsset;
using ProcedureOwner = TEngine.IFsm<TEngine.IProcedureModule>;

namespace Launcher
{
    /// <summary>
    /// 流程 => 清理缓存。
    /// </summary>
    public class ProcedureClearCache : ProcedureBase
    {
        public override bool UseNativeDialog { get; }

        private ProcedureOwner _procedureOwner;

        protected override void OnEnter(ProcedureOwner procedureOwner)
        {
            _procedureOwner = procedureOwner;
            Log.Info("清理未使用的缓存文件！");

            LauncherMgr.ShowUI<LoadUpdateUI>($"清理未使用的缓存文件...");

            ClearCache().Forget();
        }

        private async UniTaskVoid ClearCache()
        {
            await ClearCacheFiles(EFileClearMode.ClearUnusedBundleFiles);
            await ClearCacheFiles(EFileClearMode.ClearUnusedManifestFiles);

            LauncherMgr.ShowUI<LoadUpdateUI>($"清理完成 即将进入游戏...");

            ChangeState<ProcedureLoadAssembly>(_procedureOwner);
        }

        /// <remarks>
        /// 失败与异常都只告警不阻断启动:残留的是当前清单用不到的旧文件,不影响本版本加载。
        /// 异常必须在此接住:边玩边下的包每次启动都经过本流程,逃逸出去则状态机停在这里、玩家卡在启动界面。
        /// </remarks>
        private async UniTask ClearCacheFiles(EFileClearMode clearMode)
        {
            try
            {
                var operation = _resourceModule.ClearCacheFilesAsync(clearMode);
                await operation;
                if (operation.Status != EOperationStatus.Succeed)
                {
                    Log.Warning($"清理缓存失败({clearMode}):{operation.Error}");
                }
            }
            catch (Exception e)
            {
                Log.Warning($"清理缓存异常({clearMode}):{e}");
            }
        }
    }
}