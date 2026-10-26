using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace TEngine.Editor
{
    public static class LubanTools
    {
        /// <summary>
        /// 客户端仓内的转表产物,相对仓根;与 Configs/GameConfig 下三个 gen_*.bat 的输出目录一一对应。
        /// 增删导表目标须同步改此表,漏改的产物不进自动提交、只在别人拉不到新配置时才暴露。
        /// </summary>
        private static readonly string[] ClientCommitPaths =
        {
            "Configs/GameConfig/Datas",
            "Configs/GameConfig/EditorBytes",
            "UnityProject/Assets/AssetRaw/Configs/bytes",
            "UnityProject/Assets/GameScripts/HotFix/GameProto/GameConfig",
            "UnityProject/Assets/GameScripts/HotFix/GameProto/ConfigSystem.cs",
            "UnityProject/Assets/GameScripts/HotFix/GameProto/ExternalTypeUtil.cs",
            "UnityProject/Assets/Editor/GameConfigEditor"
        };

        /// <summary>
        /// 服务端仓内的转表产物,相对 Fantasy 仓根。
        /// </summary>
        private static readonly string[] ServerCommitPaths =
        {
            "examples/Server/APP/Entity/Generate/GameConfig",
            "examples/Server/APP/Entity/Generate/GameConfigBytes"
        };

        private const string TableDocPath = "Configs/GameConfig/Datas/配置表说明.md";

        [MenuItem("TEngine/Luban/转表 &X", priority = -100)]
        private static void ZhuanXiaoYi()
        {
            string repoRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "../.."));
            string configDir = Path.Combine(repoRoot, "Configs", "GameConfig");
#if UNITY_EDITOR_OSX || UNITY_EDITOR_LINUX
            string clientPath = Path.Combine(configDir, "gen_code_bin_to_project_lazyload.sh");
            string serverPath = Path.Combine(configDir, "gen_code_bin_to_server.sh");
#elif UNITY_EDITOR_WIN
            string clientPath = Path.Combine(configDir, "gen_code_bin_to_project_lazyload.bat");
            string serverPath = Path.Combine(configDir, "gen_code_bin_to_server.bat");
#endif
            try
            {
                EditorUtility.DisplayProgressBar("转表", "客户端导表", 0.1f);
                if (!RunExport("客户端", clientPath))
                {
                    return;
                }

                EditorUtility.DisplayProgressBar("转表", "服务端导表", 0.5f);
                if (!RunExport("服务端", serverPath))
                {
                    return;
                }
            }
            finally
            {
                EditorUtility.ClearProgressBar();
            }

            // 提交须排在导入之后:新增 .bytes 的 .meta 由这次 Refresh 生成,先提交会入库无 meta 的资源。
            // 锁住域重载,否则生成的 .cs 触发编译后重载会在提交执行前打断本方法。
            EditorApplication.LockReloadAssemblies();
            try
            {
                AssetDatabase.Refresh();
                CommitExportResult(repoRoot);
            }
            finally
            {
                EditorApplication.UnlockReloadAssemblies();
            }
        }

        private static bool RunExport(string label, string scriptPath)
        {
            Debug.Log($"执行{label}转表：{scriptPath}");
            int exitCode = ShellHelper.RunByPath(scriptPath);
            if (exitCode != 0)
            {
                Debug.LogError($"{label}转表失败(退出码 {exitCode})，已中止，未提交任何改动。");
                return false;
            }

            return true;
        }

        private static void CommitExportResult(string repoRoot)
        {
            WarnIfTableDocStale(repoRoot);
            CommitRepo(repoRoot, ClientCommitPaths, "【配置】导表: 自动提交客户端转表产物");

            string fantasyRoot = Path.Combine(repoRoot, "Fantasy");
            if (!Directory.Exists(fantasyRoot))
            {
                Debug.LogWarning($"未找到服务端仓 {fantasyRoot}，跳过服务端转表产物提交。");
                return;
            }

            CommitRepo(fantasyRoot, ServerCommitPaths, "【配置】导表: 自动提交服务端转表产物");
        }

        private static void CommitRepo(string repoDir, IEnumerable<string> relativePaths, string message)
        {
            string pathArgs = BuildPathArgs(repoDir, relativePaths);
            if (pathArgs.Length == 0)
            {
                Debug.LogWarning($"{repoDir}：转表产物路径均不存在，跳过提交。");
                return;
            }

            if (!TryRunGit(repoDir, $"status --porcelain -- {pathArgs}", out string status))
            {
                return;
            }

            if (string.IsNullOrWhiteSpace(status))
            {
                Debug.Log($"{repoDir}：转表产物无改动，跳过提交。");
                return;
            }

            if (!TryRunGit(repoDir, $"add -A -- {pathArgs}", out _))
            {
                return;
            }

            // 取唯一文件名:多个槽位编辑器同时转表时,固定名会互相覆盖内容、或提前删掉对方待读的文件。
            string messageFile = Path.GetTempFileName();
            // git 按 UTF-8 读提交信息文件,BOM 会被当成正文首字符。
            File.WriteAllText(messageFile, message + "\n", new UTF8Encoding(false));
            try
            {
                if (TryRunGit(repoDir, $"commit -F \"{messageFile}\" -- {pathArgs}", out string output))
                {
                    Debug.Log($"{repoDir}：已提交转表产物。\n{output}");
                    return;
                }

                // 提交失败须撤掉暂存:索引残留会让后续 merge 被 git 直接拒。
                TryRunGit(repoDir, $"reset -q -- {pathArgs}", out _);
            }
            finally
            {
                File.Delete(messageFile);
            }
        }

        private static void WarnIfTableDocStale(string repoRoot)
        {
            if (!TryRunGit(repoRoot, "status --porcelain -- \"Configs/GameConfig/Datas\"", out string status))
            {
                return;
            }

            if (status.IndexOf(".xlsx", StringComparison.OrdinalIgnoreCase) < 0)
            {
                return;
            }

            if (status.IndexOf(TableDocPath, StringComparison.Ordinal) >= 0)
            {
                return;
            }

            Debug.LogWarning($"表源有改动但 {TableDocPath} 未同步；本次自动提交不经提交检查，请自行确认表文档。");
        }

        private static string BuildPathArgs(string repoDir, IEnumerable<string> relativePaths)
        {
            List<string> quoted = new List<string>();
            foreach (string relativePath in relativePaths)
            {
                string full = Path.Combine(repoDir, relativePath);
                if (File.Exists(full) || Directory.Exists(full))
                {
                    quoted.Add($"\"{relativePath}\"");
                }
            }

            return string.Join(" ", quoted);
        }

        private static bool TryRunGit(string repoDir, string arguments, out string stdout)
        {
            // quotepath=false 让含中文的路径按原文输出,否则 status 结果是八进制转义、无法与路径比对。
            string full = $"-C \"{repoDir}\" -c core.quotepath=false -c i18n.commitEncoding=utf-8 {arguments}";
            int exitCode = ShellHelper.RunCommand("git", full, repoDir, out stdout, out string stderr, Encoding.UTF8);
            if (exitCode != 0)
            {
                Debug.LogError($"git {arguments} 失败(退出码 {exitCode})：{stderr}{stdout}");
                return false;
            }

            return true;
        }
    }
}