using TEngine;

namespace Launcher
{
    /// <summary>
    /// 热更入口已调用后的终态流程。启动器界面不在这里关:关闭回调随入口参数交给热更侧,
    /// 由它在自己的首个全屏窗显示后调用(见 <see cref="ProcedureLoadAssembly"/> 调入口处)。
    /// </summary>
    public class ProcedureStartGame : ProcedureBase
    {
        public override bool UseNativeDialog { get; }
    }
}