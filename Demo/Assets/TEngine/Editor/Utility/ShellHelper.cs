using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace TEngine.Editor
{
    /// <summary>
    /// Unity编辑器主动执行cmd帮助类。
    /// </summary>
    public static class ShellHelper
    {
        // cmd.exe 与 dotnet CLI 按控制台 OEM 代码页写 stdout/stderr,按 UTF8 解码会让中文报错整段变乱码。
#if UNITY_EDITOR_WIN
        private static readonly Encoding ProcessOutputEncoding = Encoding.GetEncoding((int)GetOEMCP());

        [DllImport("kernel32.dll")]
        private static extern uint GetOEMCP();
#else
        private static readonly Encoding ProcessOutputEncoding = Encoding.UTF8;
#endif

        /// <summary>
        /// 造一个捕获 stdout/stderr 的 <see cref="ProcessStartInfo"/>,读取方式由调用方自管。
        /// 本程序集内要捕获子进程输出的地方一律从这里取 psi,不各自 new 一个——编码该取哪一页
        /// 是按子进程定的判断(见 <paramref name="outputEncoding"/>),每个调用点各判一次必然漏。
        /// <see cref="RunCommand"/> 收得住的(同步读完即可)直接用它,不必走这里。
        /// </summary>
        /// <param name="outputEncoding">留空取控制台 OEM 页(cmd / dotnet CLI / robocopy / where 这批);
        /// git、ssh、python 等按 UTF-8 写输出的进程须显式传 UTF8,否则中文路径解码错位。</param>
        public static ProcessStartInfo NewStartInfo(string fileName, string arguments, string workDirectory,
            Encoding outputEncoding = null)
        {
            Encoding encoding = outputEncoding ?? ProcessOutputEncoding;
            return new ProcessStartInfo(fileName)
            {
                Arguments = arguments ?? string.Empty,
                WorkingDirectory = workDirectory ?? string.Empty,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                StandardOutputEncoding = encoding,
                StandardErrorEncoding = encoding
            };
        }

        /// <summary>
        /// 同步执行外部命令,等待进程退出后返回退出码,并回收全部 stdout/stderr。
        /// </summary>
        /// <param name="outputEncoding">留空取控制台 OEM 页(cmd 与 dotnet CLI 用);git 等按 UTF-8 写输出的进程须显式传 UTF8,否则中文路径解码错位。</param>
        public static int RunCommand(string fileName, string arguments, string workDirectory,
            out string stdout, out string stderr, Encoding outputEncoding = null)
        {
            ProcessStartInfo startInfo = NewStartInfo(fileName, arguments, workDirectory, outputEncoding);
            // 工程内的 .bat 失败时执行 pause;不置 AI_MODE 会卡在等按键,同步等待随之永久挂起。
            // 留在这里而不进 NewStartInfo:它是给 .bat 兜底的,与「怎么造 psi」无关,
            // robocopy / where 这类调用点不需要它。
            startInfo.EnvironmentVariables["AI_MODE"] = "1";

            using (Process process = Process.Start(startInfo))
            {
                // 先挂异步读 stderr 再主线程读 stdout;两路都用同步 ReadToEnd 会在任一管道写满时互锁。
                Task<string> errorTask = process.StandardError.ReadToEndAsync();
                stdout = process.StandardOutput.ReadToEnd();
                process.WaitForExit();
                stderr = errorTask.Result;
                return process.ExitCode;
            }
        }

        /// <summary>
        /// 同步执行脚本文件,输出转 Console,返回退出码;启动失败返回 -1。
        /// </summary>
        public static int RunByPath(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                return -1;
            }

            try
            {
                int exitCode = RunCommand(path, null, Path.GetDirectoryName(path), out string stdout, out string stderr);
                if (!string.IsNullOrWhiteSpace(stdout))
                {
                    UnityEngine.Debug.Log(stdout);
                }

                if (!string.IsNullOrWhiteSpace(stderr))
                {
                    UnityEngine.Debug.LogError(stderr);
                }

                return exitCode;
            }
            catch (Exception e)
            {
                UnityEngine.Debug.LogError($"Error starting process at path {path}: {e.Message}");
                UnityEngine.Debug.LogException(e);
                return -1;
            }
        }
    }
}