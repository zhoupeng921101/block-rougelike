using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace TEngine.Editor
{
    /// <summary>
    /// 平台脚本宏策略。
    /// 按 ProjectSettings/PlatformDefinePolicy.json 声明的规则核对并对齐各出包平台的脚本宏定义。
    /// 该清单是「哪个宏该出现在哪些平台」的唯一声明处，本类不内嵌任何平台与宏的对照表。
    /// </summary>
    public static class PlatformDefinePolicy
    {
        private const string POLICY_FILE_NAME = "PlatformDefinePolicy.json";
        private const string POLICY_REQUIRED = "required";
        private const string POLICY_EXCLUSIVE = "exclusive";

        /// <summary>
        /// 违规类别。
        /// </summary>
        public enum ViolationKind
        {
            /// <summary>
            /// required 宏在该平台缺失，需补上。
            /// </summary>
            MissingRequired,

            /// <summary>
            /// exclusive 宏出现在了不该出现的平台，需移除。
            /// </summary>
            ForbiddenPresence
        }

        /// <summary>
        /// 一条策略违规。
        /// </summary>
        public readonly struct Violation
        {
            public Violation(ViolationKind kind, BuildTargetGroup platform, string symbol, string reason)
            {
                Kind = kind;
                Platform = platform;
                Symbol = symbol;
                Reason = reason;
            }

            public ViolationKind Kind { get; }

            public BuildTargetGroup Platform { get; }

            public string Symbol { get; }

            public string Reason { get; }

            public override string ToString()
            {
                string action = Kind == ViolationKind.MissingRequired ? "缺失，应补上" : "多余，应移除";
                return $"[{Platform}] {Symbol} {action}：{Reason}";
            }
        }

        /// <summary>
        /// 策略清单的绝对路径。
        /// </summary>
        public static string PolicyFilePath =>
            Path.Combine(Path.GetDirectoryName(Application.dataPath) ?? string.Empty, "ProjectSettings", POLICY_FILE_NAME);

        /// <summary>
        /// 核对所有平台的脚本宏定义，返回全部违规项；无违规时返回空列表。
        /// </summary>
        /// <returns>违规项列表。</returns>
        public static List<Violation> Audit()
        {
            PolicyDocument document = LoadPolicy();
            List<BuildTargetGroup> coveredPlatforms = ResolvePlatforms(document.coveredPlatforms, "coveredPlatforms");
            List<Violation> violations = new List<Violation>();

            foreach (PolicyRule rule in document.rules)
            {
                if (string.IsNullOrEmpty(rule.symbol))
                {
                    throw new InvalidOperationException($"策略清单存在 symbol 为空的规则：{PolicyFilePath}");
                }

                List<BuildTargetGroup> rulePlatforms = ResolvePlatforms(rule.platforms, $"规则 {rule.symbol} 的 platforms");

                foreach (BuildTargetGroup platform in rulePlatforms)
                {
                    if (!coveredPlatforms.Contains(platform))
                    {
                        throw new InvalidOperationException(
                            $"规则 {rule.symbol} 引用了 coveredPlatforms 之外的平台 {platform}：{PolicyFilePath}");
                    }
                }

                switch (rule.policy)
                {
                    case POLICY_REQUIRED:
                        foreach (BuildTargetGroup platform in rulePlatforms)
                        {
                            if (!ScriptingDefineSymbols.HasScriptingDefineSymbol(platform, rule.symbol))
                            {
                                violations.Add(new Violation(ViolationKind.MissingRequired, platform, rule.symbol, rule.reason));
                            }
                        }

                        break;

                    case POLICY_EXCLUSIVE:
                        foreach (BuildTargetGroup platform in coveredPlatforms)
                        {
                            if (rulePlatforms.Contains(platform))
                            {
                                continue;
                            }

                            if (ScriptingDefineSymbols.HasScriptingDefineSymbol(platform, rule.symbol))
                            {
                                violations.Add(new Violation(ViolationKind.ForbiddenPresence, platform, rule.symbol, rule.reason));
                            }
                        }

                        break;

                    default:
                        throw new InvalidOperationException(
                            $"规则 {rule.symbol} 的 policy 取值 '{rule.policy}' 无法识别，仅支持 '{POLICY_REQUIRED}' 与 '{POLICY_EXCLUSIVE}'：{PolicyFilePath}");
                }
            }

            return violations;
        }

        /// <summary>
        /// 核对各平台脚本宏定义是否符合策略，只报告不改动。
        /// </summary>
        [MenuItem("TEngine/Platform Define Symbols/Check Policy", false, 20)]
        public static void CheckPolicy()
        {
            List<Violation> violations;
            try
            {
                violations = Audit();
            }
            catch (Exception exception)
            {
                ReportFailure(exception);
                return;
            }

            if (violations.Count <= 0)
            {
                Debug.Log("[平台宏策略] 各平台脚本宏定义符合策略。");
                EditorUtility.DisplayDialog("平台宏策略", "各平台脚本宏定义符合策略。", "确定");
                return;
            }

            string detail = Describe(violations);
            Debug.LogError($"[平台宏策略] 发现 {violations.Count} 项违规：\n{detail}");
            EditorUtility.DisplayDialog("平台宏策略", $"发现 {violations.Count} 项违规：\n\n{detail}\n\n可执行 Align To Policy 自动对齐。", "确定");
        }

        /// <summary>
        /// 按策略对齐各平台脚本宏定义：补上缺失的 required 宏，移除越界的 exclusive 宏。
        /// 无违规时不触碰任何设置，不产生改动。
        /// </summary>
        /// <returns>本次实际应用的违规项；无违规时为空列表。</returns>
        public static List<Violation> ApplyPolicy()
        {
            List<Violation> violations = Audit();
            if (violations.Count <= 0)
            {
                return violations;
            }

            foreach (Violation violation in violations)
            {
                if (violation.Kind == ViolationKind.MissingRequired)
                {
                    ScriptingDefineSymbols.AddScriptingDefineSymbol(violation.Platform, violation.Symbol);
                }
                else
                {
                    ScriptingDefineSymbols.RemoveScriptingDefineSymbol(violation.Platform, violation.Symbol);
                }
            }

            AssetDatabase.SaveAssets();
            return violations;
        }

        /// <summary>
        /// 核对并按策略对齐各平台脚本宏定义，改动前经用户确认。
        /// </summary>
        [MenuItem("TEngine/Platform Define Symbols/Align To Policy", false, 21)]
        public static void AlignToPolicy()
        {
            List<Violation> violations;
            try
            {
                violations = Audit();
            }
            catch (Exception exception)
            {
                ReportFailure(exception);
                return;
            }

            if (violations.Count <= 0)
            {
                Debug.Log("[平台宏策略] 各平台脚本宏定义已符合策略，无需改动。");
                EditorUtility.DisplayDialog("平台宏策略", "各平台脚本宏定义已符合策略，无需改动。", "确定");
                return;
            }

            string detail = Describe(violations);
            if (!EditorUtility.DisplayDialog("平台宏策略", $"将改动 {violations.Count} 项：\n\n{detail}\n\n改动后 Unity 会重新编译。", "对齐", "取消"))
            {
                return;
            }

            try
            {
                ApplyPolicy();
            }
            catch (Exception exception)
            {
                ReportFailure(exception);
                return;
            }

            Debug.Log($"[平台宏策略] 已对齐 {violations.Count} 项：\n{detail}");
        }

        private static PolicyDocument LoadPolicy()
        {
            string path = PolicyFilePath;
            if (!File.Exists(path))
            {
                throw new InvalidOperationException($"策略清单不存在：{path}");
            }

            PolicyDocument document = JsonUtility.FromJson<PolicyDocument>(File.ReadAllText(path, Encoding.UTF8));
            if (document == null)
            {
                throw new InvalidOperationException($"策略清单解析失败：{path}");
            }

            if (document.coveredPlatforms == null || document.coveredPlatforms.Length <= 0)
            {
                throw new InvalidOperationException($"策略清单未声明 coveredPlatforms：{path}");
            }

            if (document.rules == null)
            {
                throw new InvalidOperationException($"策略清单未声明 rules：{path}");
            }

            return document;
        }

        private static List<BuildTargetGroup> ResolvePlatforms(string[] names, string fieldDescription)
        {
            if (names == null || names.Length <= 0)
            {
                throw new InvalidOperationException($"策略清单的 {fieldDescription} 为空：{PolicyFilePath}");
            }

            List<BuildTargetGroup> platforms = new List<BuildTargetGroup>(names.Length);
            foreach (string name in names)
            {
                if (!Enum.TryParse(name, false, out BuildTargetGroup platform) || platform == BuildTargetGroup.Unknown)
                {
                    throw new InvalidOperationException(
                        $"策略清单的 {fieldDescription} 含无法识别的平台名 '{name}'，取值须为 BuildTargetGroup 枚举名：{PolicyFilePath}");
                }

                if (!platforms.Contains(platform))
                {
                    platforms.Add(platform);
                }
            }

            return platforms;
        }

        private static string Describe(List<Violation> violations)
        {
            StringBuilder builder = new StringBuilder();
            foreach (Violation violation in violations)
            {
                builder.AppendLine(violation.ToString());
            }

            return builder.ToString().TrimEnd();
        }

        private static void ReportFailure(Exception exception)
        {
            Debug.LogError($"[平台宏策略] 读取策略清单失败：{exception.Message}");
            EditorUtility.DisplayDialog("平台宏策略", $"读取策略清单失败：\n\n{exception.Message}", "确定");
        }

        [Serializable]
        private sealed class PolicyRule
        {
            public string symbol;
            public string policy;
            public string[] platforms;
            public string reason;
        }

        [Serializable]
        private sealed class PolicyDocument
        {
            public string[] coveredPlatforms;
            public PolicyRule[] rules;
        }
    }
}
