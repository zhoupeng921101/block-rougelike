using TEngine;
using UnityEngine;
using ProcedureOwner = TEngine.IFsm<TEngine.IProcedureModule>;

namespace Launcher
{
    public class ProcedureDownloadOver : ProcedureBase
    {
        public override bool UseNativeDialog { get; }

        protected override void OnEnter(ProcedureOwner procedureOwner)
        {
            Log.Info("下载完成!!!");

            LauncherMgr.ShowUI<LoadUpdateUI>($"下载完成...");

            // 下载完成之后再保存本地版本:它是 Optional 模式离线兜底进入的版本,只能指向已下全的版本,不可提前写。
            Utility.PlayerPrefs.SetString("GAME_VERSION", _resourceModule.PackageVersion);
        }

        protected override void OnUpdate(ProcedureOwner procedureOwner, float elapseSeconds, float realElapseSeconds)
        {
            ChangeState<ProcedureClearCache>(procedureOwner);
        }
    }
}