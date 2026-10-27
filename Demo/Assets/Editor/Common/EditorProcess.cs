using System;
using System.Diagnostics;
using System.Text;

/// <summary>
/// 编辑器工具起外部进程的共用原语。调 luban_helper(经 <see cref="LubanRows"/>)、跑导表 bat、
/// 调 `.claude` 下的扫描脚本都走这一条,不要在各窗口里再各写一份。
/// </summary>
internal static class EditorProcess
{
    /// <summary>
    /// 同步起子进程并收干 stdout/stderr(按 UTF-8 读),返回退出码;进程起不来返回 -1,原因放进 <paramref name="stderr"/>。
    /// </summary>
    /// <param name="workDir">子进程工作目录;null 或空 = 继承编辑器进程的。</param>
    internal static int Run(string exe, string args, string workDir, out string stdout, out string stderr)
    {
        var psi = NewStartInfo(exe, args, workDir);

        try
        {
            using (var p = Process.Start(psi))
            {
                stdout = p.StandardOutput.ReadToEnd();
                stderr = p.StandardError.ReadToEnd();
                p.WaitForExit();
                return p.ExitCode;
            }
        }
        catch (Exception ex)
        {
            stdout = string.Empty;
            stderr = ex.Message;
            return -1;
        }
    }

    /// <summary>
    /// 捕获 stdout/stderr 的 <see cref="ProcessStartInfo"/> 统一出口:编码显式钉成 UTF-8。
    /// 缺省走的是本机 OEM 码页(简中机器上是 GBK),而 ssh / git / dotnet / python 这批工具输出的是
    /// UTF-8 字节,按 GBK 解出来的中文全是乱码——诊断文本一旦不可读,真正的失败原因就被掩盖
    /// (FantasyServerWindow 曾因此把「私钥路径格式不对」误读成密钥文件名损坏)。
    /// <see cref="Run"/> 收不住的调用方(要自管超时、环境变量、异步读取)从这里取 psi,不另起一份。
    /// </summary>
    /// <param name="workDir">子进程工作目录;null 或空 = 继承编辑器进程的。</param>
    internal static ProcessStartInfo NewStartInfo(string exe, string args, string workDir)
    {
        var psi = new ProcessStartInfo(exe, args)
        {
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardOutputEncoding = new UTF8Encoding(false),
            StandardErrorEncoding = new UTF8Encoding(false),
        };
        if (!string.IsNullOrEmpty(workDir)) psi.WorkingDirectory = workDir;
        return psi;
    }
}
