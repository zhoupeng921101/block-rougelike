using System;
using System.IO;
using UnityEngine;

namespace TEngine
{
    /// <summary>
    /// 资源版本号（YooAsset PackageVersion）的仓内存储，形态为「主.次」两段数字，如 <c>1.2</c>。
    /// </summary>
    /// <remarks>
    /// 三个入口：<see cref="Peek"/> 读当前号、<see cref="PeekNext"/> 算候选号，两者都不写盘；
    /// 只有 <see cref="Commit"/> 覆写 <c>Assets/Editor/Build/PackageVersion.json</c>（文件缺失时按 1.0 建立）。
    /// 号必须等构建成功后才 Commit：构建失败或取消时若已写盘，那个号就永久废掉，而 CDN 上并没有对应产物。
    /// 主版本只由人工改该 json 的 major 字段，本类不动它。
    /// 该 json 不参与资源加载，调用后无需 <c>AssetDatabase.Refresh()</c>。
    /// json 未入库时每台机器各自从 1.0 起算，会打出重号资源包（同号覆盖 CDN 上的旧清单），故该文件必须随仓提交。
    /// </remarks>
    public static class PackageVersionStore
    {
        private const string RelativePath = "Editor/Build/PackageVersion.json";

        private static string FilePath => Path.Combine(Application.dataPath, RelativePath).Replace('\\', '/');

        /// <summary>读取当前资源版本号。不写盘。</summary>
        public static string Peek()
        {
            return Load().ToVersionString();
        }

        /// <summary>算下一个候选号（当前号次版本 +1）。不写盘——号由 <see cref="Commit"/> 在构建成功后落定。</summary>
        public static string PeekNext()
        {
            VersionData data = Load();
            data.minor++;
            return data.ToVersionString();
        }

        /// <summary>算指定号之后的下一个号（次版本 +1）。不写盘。</summary>
        /// <param name="version">形如 <c>1.2</c> 的两段数字串。</param>
        /// <returns>下一个号；<paramref name="version"/> 不是两段数字时返回 null。</returns>
        public static string NextAfter(string version)
        {
            if (!TryParse(version, out VersionData data))
            {
                return null;
            }

            data.minor++;
            return data.ToVersionString();
        }

        /// <summary>把版本号写回 json。只在构建成功后调。</summary>
        /// <param name="version">形如 <c>1.2</c> 的两段数字串（通常来自 <see cref="PeekNext"/> 或用户在打包窗口手填）。</param>
        /// <returns>写盘成功为 true；<paramref name="version"/> 不是两段数字或写盘失败为 false，此时 json 保持原值。</returns>
        public static bool Commit(string version)
        {
            if (!TryParse(version, out VersionData data))
            {
                Debug.LogWarning($"[PackageVersionStore] 版本号格式不是「主.次」两段数字，未写盘：{version}");
                return false;
            }

            try
            {
                Save(data);
                return true;
            }
            catch (Exception e)
            {
                Debug.LogError($"[PackageVersionStore] 写盘失败：{FilePath}\n{e.Message}");
                return false;
            }
        }

        private static bool TryParse(string version, out VersionData data)
        {
            data = null;
            if (string.IsNullOrWhiteSpace(version))
            {
                return false;
            }

            string[] parts = version.Trim().Split('.');
            if (parts.Length != 2
                || !int.TryParse(parts[0], out int major)
                || !int.TryParse(parts[1], out int minor))
            {
                return false;
            }

            data = new VersionData { major = major, minor = minor };
            return true;
        }

        private static VersionData Load()
        {
            string path = FilePath;
            if (File.Exists(path))
            {
                try
                {
                    VersionData data = JsonUtility.FromJson<VersionData>(File.ReadAllText(path));
                    if (data != null)
                    {
                        return data;
                    }
                }
                catch (Exception e)
                {
                    Debug.LogWarning($"[PackageVersionStore] 读取失败，按 1.0 重建：{path}\n{e.Message}");
                }
            }

            return new VersionData();
        }

        private static void Save(VersionData data)
        {
            string path = FilePath;
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            File.WriteAllText(path, JsonUtility.ToJson(data, true));
        }

        [Serializable]
        private class VersionData
        {
            public int major = 1;
            public int minor = 0;

            public string ToVersionString()
            {
                return $"{major}.{minor}";
            }
        }
    }
}
