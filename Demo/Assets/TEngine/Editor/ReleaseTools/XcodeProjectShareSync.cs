using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using UnityEditor;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace TEngine
{
    /// <summary>
    /// 把 iOS 出包产物(Xcode 工程)镜像同步到本机配置的共享目录,供 Mac 端直接取用。
    /// </summary>
    /// <remarks>
    /// 共享目录存 EditorUserSettings(落本工程 UserSettings/、不入库):它是个人局域网环境,不是工程配置;
    /// 不用 EditorPrefs 的理由同 Player 输出目录,整机共享会让别的工程副本也往这里同步。留空 = 不同步。
    /// <para>
    /// 镜像只作用于 <c>&lt;共享目录&gt;/XCode_Project</c>,绝不对用户填的目录本身做镜像:robocopy /MIR 会删掉
    /// 目标里源没有的一切,填错一层就是整个共享目录被清空。
    /// </para>
    /// </remarks>
    public static class XcodeProjectShareSync
    {
        private const string ShareDirKey = "TEngine_BP_XcodeShareDir";
        private const string LastIosOutputKey = "TEngine_BP_LastIosPlayerOutput";
        private const string ProgressTitle = "同步 Xcode 工程到共享目录";
        private const string ResyncMenuPath = "TEngine/Build/重新同步 Xcode 工程到共享目录";

        /// <summary>本机配置的共享目录;空串表示不同步。</summary>
        public static string ShareDir
        {
            get => EditorUserSettings.GetConfigValue(ShareDirKey) ?? string.Empty;
            set => EditorUserSettings.SetConfigValue(ShareDirKey, value?.Trim() ?? string.Empty);
        }

        /// <summary>共享端实际被镜像的目录:共享目录下与本地产物同名的子目录。</summary>
        public static string GetDestinationDir(string shareDir)
        {
            return Path.Combine(shareDir.Trim(), BuildConfig.GetPlayerOutputLeafName(BuildTarget.iOS));
        }

        /// <summary>
        /// iOS Player 出包成功后调:记下产物位置供手动重同步,配置了共享目录就同步过去。
        /// </summary>
        /// <remarks>同步失败只记 Error、不改变出包结果:本地产物已完整可用,共享端可用菜单重同步。</remarks>
        public static void OnIosPlayerBuilt(string outputPath)
        {
            EditorUserSettings.SetConfigValue(LastIosOutputKey, outputPath);
            if (!string.IsNullOrWhiteSpace(ShareDir))
            {
                Sync(outputPath, ShareDir);
            }
        }

        [MenuItem(ResyncMenuPath, false, 31)]
        public static void ResyncLastBuild()
        {
            if (string.IsNullOrWhiteSpace(ShareDir))
            {
                Debug.LogError("[XcodeShareSync] 未配置共享目录:在打包工具窗口「打包Player设置」里,Player平台选 iOS 后填写「Xcode 共享目录」。");
                return;
            }

            string last = EditorUserSettings.GetConfigValue(LastIosOutputKey);
            if (string.IsNullOrWhiteSpace(last) || !Directory.Exists(last))
            {
                last = BuildConfig.GetDefaultPlayerOutputPath(BuildTarget.iOS);
            }

            Sync(last, ShareDir);
        }

        /// <summary>把 <paramref name="sourceDir"/> 镜像到 <c>&lt;共享目录&gt;/XCode_Project</c>。</summary>
        /// <returns>同步完成为 true;校验不过、失败或被取消为 false(原因已记 <c>Debug.LogError</c>)。</returns>
        public static bool Sync(string sourceDir, string shareDir)
        {
            if (Application.platform != RuntimePlatform.WindowsEditor)
            {
                Debug.LogWarning("[XcodeShareSync] 同步依赖 Windows 自带的 robocopy,非 Windows 编辑器跳过。");
                return false;
            }

            string source = Path.GetFullPath(sourceDir).TrimEnd('\\', '/');
            string dest = Path.GetFullPath(GetDestinationDir(shareDir)).TrimEnd('\\', '/');

            // 源不是一份完整的 Xcode 工程时绝不开镜像:空源会把共享端整个删空。
            if (!Directory.Exists(Path.Combine(source, "Unity-iPhone.xcodeproj")))
            {
                Debug.LogError($"[XcodeShareSync] 本地没有可同步的 Xcode 工程(缺 Unity-iPhone.xcodeproj):{source}");
                return false;
            }

            if (IsSameOrNested(source, dest))
            {
                Debug.LogError($"[XcodeShareSync] 共享端目录与本地产物目录相同或互相包含,拒绝同步。本地:{source},共享端:{dest}");
                return false;
            }

            EditorUtility.DisplayProgressBar(ProgressTitle, $"正在连接 {shareDir}", 0f);
            bool shareReachable = Directory.Exists(shareDir.Trim());
            EditorUtility.ClearProgressBar();
            if (!shareReachable)
            {
                Debug.LogError($"[XcodeShareSync] 共享目录不可达或不存在:{shareDir}。出包本身不受影响,修好后用菜单「{ResyncMenuPath}」重新同步。");
                return false;
            }

            return RunRobocopy(source, dest);
        }

        private static bool RunRobocopy(string source, string dest)
        {
            int totalFiles = Directory.EnumerateFiles(source, "*", SearchOption.AllDirectories).Count();

            // /R:2 /W:2:缺省重试是 100 万次、每次等 30 秒,共享端一断就永远卡在这里。
            // /FFT:按 2 秒精度比较时间戳,Mac / Samba 端的时间精度与 NTFS 不同,不放宽会把没变的文件也判成要复制。
            // /XD /XF:Mac 端 Xcode 与 Finder 自己生成的用户状态,Unity 不产出、也不进 App;被排除的项 /MIR 不会删,
            // 不排除的话每次同步都会重置 Mac 端 Xcode 的界面状态与 scheme 管理。
            // 编码走 ShellHelper 缺省的 OEM 页:robocopy 是 Windows 原生工具,按控制台码页写输出,
            // 按 UTF-8 解会把中文路径变成乱码——而这里回显的末尾日志正是用来看同步了哪些文件的。
            var startInfo = TEngine.Editor.ShellHelper.NewStartInfo(
                "robocopy",
                $"\"{source}\" \"{dest}\" /MIR /FFT /MT:16 /R:2 /W:2 /NP /NDL /XD xcuserdata project.xcworkspace /XF .DS_Store",
                null);

            int processed = 0;
            var tail = new Queue<string>();
            void Collect(string line)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    return;
                }

                Interlocked.Increment(ref processed);
                lock (tail)
                {
                    tail.Enqueue(line.Trim());
                    if (tail.Count > 15)
                    {
                        tail.Dequeue();
                    }
                }
            }

            var watch = Stopwatch.StartNew();
            bool canceled = false;
            int exitCode;
            try
            {
                using (var process = new Process { StartInfo = startInfo })
                {
                    process.OutputDataReceived += (_, e) => Collect(e.Data);
                    process.ErrorDataReceived += (_, e) => Collect(e.Data);
                    process.Start();
                    process.BeginOutputReadLine();
                    process.BeginErrorReadLine();

                    while (!process.WaitForExit(200))
                    {
                        int done = Volatile.Read(ref processed);
                        float progress = totalFiles > 0 ? Mathf.Clamp01((float)done / totalFiles) : 0f;
                        string info = $"{dest}\n已处理 {done} 项(本地共 {totalFiles} 个文件) · 已用时 {watch.Elapsed:mm\\:ss}";
                        if (EditorUtility.DisplayCancelableProgressBar(ProgressTitle, info, progress))
                        {
                            canceled = true;
                            process.Kill();
                            break;
                        }
                    }

                    process.WaitForExit();
                    exitCode = process.ExitCode;
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"[XcodeShareSync] 启动 robocopy 失败:{e.Message}。出包本身不受影响。");
                return false;
            }
            finally
            {
                EditorUtility.ClearProgressBar();
            }

            string recent;
            lock (tail)
            {
                recent = string.Join("\n", tail);
            }

            if (canceled)
            {
                Debug.LogWarning($"[XcodeShareSync] 同步已取消,共享端 {dest} 可能不完整;用菜单「{ResyncMenuPath}」重新同步。");
                return false;
            }

            // robocopy 退出码是位掩码:0-7 为成功(1 有复制、2 删了共享端多余文件等),8 及以上才是有文件没同步成。
            if (exitCode >= 8)
            {
                Debug.LogError($"[XcodeShareSync] 同步失败(robocopy 退出码 {exitCode}):{source} → {dest}。出包本身不受影响," +
                               $"修好后用菜单「{ResyncMenuPath}」重新同步。robocopy 最后输出:\n{recent}");
                return false;
            }

            Debug.Log($"[XcodeShareSync] 已同步到 {dest}(robocopy 退出码 {exitCode},用时 {watch.Elapsed.TotalSeconds:F0} 秒)");
            return true;
        }

        private static bool IsSameOrNested(string a, string b)
        {
            string left = a.TrimEnd('\\', '/') + Path.DirectorySeparatorChar;
            string right = b.TrimEnd('\\', '/') + Path.DirectorySeparatorChar;
            return left.StartsWith(right, StringComparison.OrdinalIgnoreCase)
                   || right.StartsWith(left, StringComparison.OrdinalIgnoreCase);
        }
    }
}
