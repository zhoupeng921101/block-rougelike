using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace TEngine.Editor
{
    using UnityEditor;
    using UnityEngine;

    public class SpritePostprocessor : AssetPostprocessor
    {
        // 导入设置强制的覆盖范围：各 UI 源图根目录，比图集成员范围更广（不要求进图集）。
        // 新增 UI 源图目录时必须加进这里。漏加的症状不报错也不当场显形：Unity 按项目默认把图切成
        // spriteImportMode=Multiple，而 Multiple 下 TextureImporter.spriteBorder 不生效——
        // 九宫格 border 写进去不起作用，要到界面拉伸变形时才被发现。
        private static readonly string[] UISourceRootDirs =
        {
            "Assets/AssetRaw/UI/Atlas",
            "Assets/AssetRaw/UI/NewAtlas",
        };

        // 只强制 textureType=Sprite + spriteImportMode=Single 的目录：不进图集、按名单张寻址的独立贴图，
        // 压缩 / WebGL 格式 / mipmap 维持各图现状（UISourceRootDirs 那套是为图集源图定的，套到独立贴图上会改变其压缩口径）。
        // 漏在范围外的症状同上：新图被切成 Multiple，与同目录其余图口径不一。
        private static readonly string[] SpriteModeOnlyRootDirs =
        {
            "Assets/AssetRaw/UI/Texture",
        };

        // SpriteModeOnlyRootDirs 下保留 Multiple 的图：被引用的子图 rect 不等于整图，转 Single 后
        // 引用处会改显示整张图。新增条目须写明被引用的子图与原因。
        private static readonly HashSet<string> SpriteModeOnlyExcludedFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            // 128 张自动切片的星点图，UILevelUpPanel.prefab 的 deco_stars / ball_round_light (1) 引用其中 34×34 的 stars_0。
            "Assets/AssetRaw/UI/Texture/UILevelUpPanel/stars.png",
        };

        // 去空格重命名撞到已有文件时的递增序号上限，纯粹防死循环，正常场景摸不到。
        private const int MaxRenameProbe = 100;

        private static List<string> m_resourcesToDelete = new List<string>();

        // 待去空格重命名的资源：(原路径, 规范化后的文件名/不含扩展名)。
        // 与 m_resourcesToDelete 一样延到 OnPostprocessAllAssets 的 finally 执行——
        // 导入回调遍历途中调 AssetDatabase 写操作会重入导入管线。
        private static List<KeyValuePair<string, string>> m_resourcesToRename = new List<KeyValuePair<string, string>>();

        // 同名查重缓存：key=「图集归属 + 小写文件名(不含扩展名)」的复合键, value=完整路径集合。
        // 复合键把查重作用域限定在「同一图集」内——跨图集(不同叶子目录/single/rootChild 归属)重名放行,
        // 同一图集内重名(如同目录 abc.png 与 abc.jpg 都成子图 abc)仍视为冲突。
        private static Dictionary<string, HashSet<string>> s_fileNameCache;
        private static bool s_cacheInitialized = false;

        /// <summary>
        /// 初始化文件名缓存
        /// </summary>
        private static void EnsureCacheInitialized()
        {
            if (s_cacheInitialized && s_fileNameCache != null) return;

            s_fileNameCache = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
            var config = AtlasConfiguration.Instance;

            var tempRootDirArr = new List<string>(config.sourceAtlasRootDir);
            tempRootDirArr.AddRange(config.rootChildAtlasDir);
            tempRootDirArr.AddRange(config.singleAtlasDir);

            foreach (var rootDir in tempRootDirArr)
            {
                if (string.IsNullOrEmpty(rootDir) || !Directory.Exists(rootDir)) continue;

                var files = Directory.GetFiles(rootDir, "*.*", SearchOption.AllDirectories)
                    .Where(CheckIsValidImageFile);

                foreach (var file in files)
                {
                    var key = ComposeCacheKey(file);
                    var normalizedPath = Path.GetFullPath(file).Replace("\\", "/");

                    if (!s_fileNameCache.TryGetValue(key, out var pathSet))
                    {
                        pathSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                        s_fileNameCache[key] = pathSet;
                    }
                    pathSet.Add(normalizedPath);
                }
            }

            s_cacheInitialized = true;
        }

        /// <summary>
        /// 重置缓存（配置变更时调用）
        /// </summary>
        public static void ResetCache()
        {
            s_cacheInitialized = false;
            s_fileNameCache?.Clear();
            s_fileNameCache = null;
        }

        /// <summary>
        /// 从缓存中移除文件
        /// </summary>
        private static void RemoveFromCache(string assetPath)
        {
            if (s_fileNameCache == null) return;

            var key = ComposeCacheKey(assetPath);
            var normalizedPath = Path.GetFullPath(assetPath).Replace("\\", "/");

            if (s_fileNameCache.TryGetValue(key, out var pathSet))
            {
                pathSet.Remove(normalizedPath);
                if (pathSet.Count == 0)
                {
                    s_fileNameCache.Remove(key);
                }
            }
        }

        /// <summary>
        /// 添加文件到缓存
        /// </summary>
        private static void AddToCache(string assetPath)
        {
            if (s_fileNameCache == null) return;

            var key = ComposeCacheKey(assetPath);
            var normalizedPath = Path.GetFullPath(assetPath).Replace("\\", "/");

            if (!s_fileNameCache.TryGetValue(key, out var pathSet))
            {
                pathSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                s_fileNameCache[key] = pathSet;
            }
            pathSet.Add(normalizedPath);
        }

        /// <summary>
        /// 构造查重复合键：图集归属 + 小写文件名(不含扩展名)。同名冲突仅在「同一图集」作用域内成立。
        /// 图集归属取自权威判定 <see cref="EditorSpriteSaveInfo.ResolveAtlasName"/>(已含 single/rootChild 粒度);
        /// 无图集归属的图(根目录直属等,不进任何图集)退化为按所在目录作用域,不与他处同名图相撞。
        /// 分隔符用换行符——图集名(目录派生)与文件名均不含换行,无碰撞风险。
        /// 整键小写:缓存由磁盘扫描(Directory.GetFiles 的磁盘大小写)播种、由 Unity assetPath 查询,
        /// 整键归一小写消除两侧目录大小写偶发不一致导致的漏判(维持原查重的大小写不敏感语义)。
        /// </summary>
        private static string ComposeCacheKey(string assetPath)
        {
            var scope = EditorSpriteSaveInfo.ResolveAtlasName(assetPath);
            if (string.IsNullOrEmpty(scope))
            {
                scope = Path.GetDirectoryName(assetPath)?.Replace("\\", "/") ?? string.Empty;
            }
            var fileName = Path.GetFileNameWithoutExtension(assetPath);
            return (scope + "\n" + fileName).ToLowerInvariant();
        }

        private static void OnPostprocessAllAssets(
            string[] importedAssets,
            string[] deletedAssets,
            string[] movedAssets,
            string[] movedFromAssetPaths)
        {
            m_resourcesToDelete.Clear();
            m_resourcesToRename.Clear();
            var config = AtlasConfiguration.Instance;

            if (!config.autoGenerate) return;

            // 计算需要处理的资源总数（用于进度显示）
            int totalAssets = (importedAssets?.Length ?? 0) + (deletedAssets?.Length ?? 0) + (movedAssets?.Length ?? 0);
            bool showProgress = totalAssets > 10; // 超过10个资源时显示进度条

            try
            {
                if (showProgress)
                {
                    EditorUtility.DisplayProgressBar("处理图集资源", "正在分析资源变更...", 0f);
                }

                ProcessAssetChanges(
                    importedAssets: importedAssets,
                    deletedAssets: deletedAssets,
                    movedAssets: movedAssets,
                    movedFromPaths: movedFromAssetPaths
                );
            }
            catch (Exception e)
            {
                Debug.LogError($"Atlas processing error: {e.Message}\n{e.StackTrace}");
            }
            finally
            {
                if (showProgress)
                {
                    EditorUtility.ClearProgressBar();
                }

                bool isRename = ExecuteScheduledRenames();

                bool isDelete = m_resourcesToDelete.Count > 0;
                foreach (var res in m_resourcesToDelete)
                {
                    AssetDatabase.DeleteAsset(res);
                }
                if (isDelete)
                {
                    Debug.LogError($"<color=red>针对 {config.sourceAtlasRootDir} 路径下资源</color>\n<color=red>移除了同名资源，请检查重新合入相关资源</color>");
                }

                if (isDelete || isRename)
                {
                    AssetDatabase.Refresh();
                }
            }
        }

        private static void ProcessAssetChanges(
            string[] importedAssets,
            string[] deletedAssets,
            string[] movedAssets,
            string[] movedFromPaths)
        {
            // 处理删除的资源（先处理删除，再处理导入）
            ProcessAssets(deletedAssets, (path) =>
            {
                RemoveFromCache(path);
                EditorSpriteSaveInfo.OnDeleteSprite(path);
                LogProcessed("[Deleted]", path);
            }, isDelete: true);

            // 处理导入的资源
            ProcessAssets(importedAssets, (path) =>
            {
                AddToCache(path);
                EditorSpriteSaveInfo.OnImportSprite(path);
                LogProcessed("[Added]", path);
            }, isDelete: false);

            ProcessMovedAssets(movedFromPaths, movedAssets);
        }

        private static void ProcessAssets(string[] assets, Action<string> processor, bool isDelete = false)
        {
            if (assets == null) return;

            foreach (var asset in assets)
            {
                // 导入设置强制覆盖整个 UI 源图目录（含 Texture/ 等非图集图），独立于图集成员判定。
                // reimport 会再次触发本回调，本回合不再继续做图集脏标记，待 reimport 后的回合处理。
                if (!isDelete && ShouldForceImportSettings(asset) && EnforceImportSettings(asset))
                {
                    continue;
                }

                if (!isDelete && ShouldForceSpriteModeOnly(asset) && EnforceSpriteModeOnly(asset))
                {
                    continue;
                }

                if (ShouldProcessAsset(asset))
                {
                    if (!isDelete && (CheckAndScheduleSpaceRename(asset) || CheckDuplicateAssetName(asset)))
                    {
                        continue;
                    }

                    processor?.Invoke(asset);
                }
            }
        }

        /// <summary>
        /// 幂等强制 UI 源图的导入设置：textureType=Sprite、spriteImportMode=Single、
        /// WebGL 平台格式 override，以及按配置开关的 mipmap。
        /// 仅在当前值与目标不同时写回并 SaveAndReimport，返回是否触发了 reimport。
        /// </summary>
        private static bool EnforceImportSettings(string path)
        {
            var importer = AssetImporter.GetAtPath(path) as TextureImporter;

            if (importer == null)
            {
                return false;
            }
            bool isChange = false;
            if (importer.textureType != TextureImporterType.Sprite)
            {
                importer.textureType = TextureImporterType.Sprite;
                isChange = true;
            }

            if (importer.spriteImportMode != SpriteImportMode.Single)
            {
                importer.spriteImportMode = SpriteImportMode.Single;
                isChange = true;
            }

            if (EnforceWebGLSourceFormat(importer))
            {
                isChange = true;
            }

            if (AtlasConfiguration.Instance.checkMipmaps)
            {
                if (AtlasConfiguration.Instance.enableMipmaps && !importer.mipmapEnabled)
                {
                    importer.mipmapEnabled = true;
                    isChange = true;
                }
                else if (!AtlasConfiguration.Instance.enableMipmaps && importer.mipmapEnabled)
                {
                    importer.mipmapEnabled = false;
                    isChange = true;
                }
            }

            if (importer.textureCompression != AtlasConfiguration.Instance.textureCompression)
            {
                importer.textureCompression = AtlasConfiguration.Instance.textureCompression;
                isChange = true;
            }

            if (isChange)
            {
                LogProcessed("[Sprite Import Changed Reimport]", path);
                importer.SaveAndReimport();
            }
            return isChange;
        }

        /// <summary>
        /// 幂等强制 <see cref="SpriteModeOnlyRootDirs"/> 下的图为 Sprite + Single，不碰其余导入设置。
        /// 仅在当前值与目标不同时写回并 SaveAndReimport，返回是否触发了 reimport。
        /// </summary>
        private static bool EnforceSpriteModeOnly(string path)
        {
            var importer = AssetImporter.GetAtPath(path) as TextureImporter;
            if (importer == null)
            {
                return false;
            }

            if (importer.textureType == TextureImporterType.Sprite
                && importer.spriteImportMode == SpriteImportMode.Single)
            {
                return false;
            }

            importer.textureType = TextureImporterType.Sprite;
            importer.spriteImportMode = SpriteImportMode.Single;
            LogProcessed("[Sprite Mode Changed Reimport]", path);
            importer.SaveAndReimport();
            return true;
        }

        private static bool ShouldForceSpriteModeOnly(string assetPath)
        {
            if (string.IsNullOrEmpty(assetPath)) return false;

            var normalized = assetPath.Replace("\\", "/");
            return IsUnderAnyRoot(normalized, SpriteModeOnlyRootDirs)
                && IsValidImageFile(normalized)
                && !SpriteModeOnlyExcludedFiles.Contains(normalized);
        }

        /// <summary>
        /// 幂等设置 WebGL 平台 override 为配置的源图格式，仅覆盖 WebGL 一项，
        /// maxTextureSize 沿用默认平台当前值。返回是否发生改动。
        /// </summary>
        private static bool EnforceWebGLSourceFormat(TextureImporter importer)
        {
            var target = AtlasConfiguration.Instance.webglSourceFormat;
            var settings = importer.GetPlatformTextureSettings("WebGL");

            if (settings.overridden && settings.format == target)
            {
                return false;
            }

            settings.overridden = true;
            settings.format = target;
            settings.maxTextureSize = importer.GetDefaultPlatformTextureSettings().maxTextureSize;
            importer.SetPlatformTextureSettings(settings);
            return true;
        }

        /// <summary>
        /// 检出文件名含空格的资源，登记为待去空格重命名，返回是否命中。
        /// 命中即本轮不再继续处理该路径——重命名延到 finally 执行，届时旧路径已失效；
        /// 改名后 Unity 会再发一轮导入回调，新路径在那一轮走完整流程（含同图集查重）。
        ///
        /// 之所以是重命名而非删除：Unity 内置 Duplicate(Ctrl+D) 的命名规则就是「原名 + 空格 + 序号」，
        /// 直接删会让编辑器里最常规的「复制一张图再改名」操作静默失败。
        /// </summary>
        private static bool CheckAndScheduleSpaceRename(string assetPath)
        {
            var fileName = Path.GetFileNameWithoutExtension(assetPath);

            if (!fileName.Contains(" "))
            {
                return false;
            }

            var normalized = NormalizeFileName(fileName);
            var directory = Path.GetDirectoryName(assetPath)?.Replace("\\", "/");
            var extension = Path.GetExtension(assetPath);

            // 规范化后为空（文件名全是空格）无法构成合法资源名，退回原有的删除处置。
            if (string.IsNullOrEmpty(normalized) || string.IsNullOrEmpty(directory))
            {
                m_resourcesToDelete.Add(assetPath);
                Debug.LogError($"<color=red>资源名去空格后为空，已移除: {assetPath}</color>");
                return true;
            }

            var uniqueName = ResolveUniqueRenameName(directory, normalized, extension);

            // 递增序号也找不到空位，说明该目录下已堆积大量同基名文件，退回删除避免无限占位。
            if (uniqueName == null)
            {
                m_resourcesToDelete.Add(assetPath);
                Debug.LogError($"<color=red>资源名含空格且去空格后 {MaxRenameProbe} 次探测均撞名，已移除: {assetPath}</color>");
                return true;
            }

            m_resourcesToRename.Add(new KeyValuePair<string, string>(assetPath, uniqueName));
            return true;
        }

        /// <summary>
        /// 去掉文件名中的空格：首尾空格直接裁掉，中间空格转下划线，连续空格压成一个。
        /// 只处理半角空格，与 <see cref="CheckAndScheduleSpaceRename"/> 的检出口径一致。
        /// 输出恒不含空格，故改名后的资源在下一轮导入回调不会再次命中，天然幂等、不递归。
        /// </summary>
        private static string NormalizeFileName(string fileName)
        {
            var trimmed = fileName.Trim(' ');
            var builder = new StringBuilder(trimmed.Length);
            var lastIsUnderscore = false;

            foreach (var c in trimmed)
            {
                if (c == ' ')
                {
                    // 前一个字符已是下划线（原有的或空格转来的）就不再叠加，避免 "a  b" 变 "a__b"。
                    if (!lastIsUnderscore)
                    {
                        builder.Append('_');
                        lastIsUnderscore = true;
                    }
                    continue;
                }

                builder.Append(c);
                lastIsUnderscore = c == '_';
            }

            return builder.ToString();
        }

        /// <summary>
        /// 在目标目录内找一个未被占用的文件名（不含扩展名），撞名则递增 _1、_2……
        /// 全部探测位均被占用时返回 null。
        ///
        /// 不用 AssetDatabase.GenerateUniqueAssetPath：它生成的正是「原名 + 空格 + 序号」，
        /// 会把刚去掉的空格重新引进来。
        /// 用 File.Exists 而非 AssetDatabase 查询：本方法在导入回调途中调用，
        /// AssetDatabase 未必已收敛到磁盘现状，磁盘是此刻更可靠的真值（同 CheckDuplicateAssetName）。
        /// </summary>
        private static string ResolveUniqueRenameName(string directory, string baseName, string extension)
        {
            if (!File.Exists($"{directory}/{baseName}{extension}"))
            {
                return baseName;
            }

            for (var i = 1; i <= MaxRenameProbe; i++)
            {
                var candidate = $"{baseName}_{i}";
                if (!File.Exists($"{directory}/{candidate}{extension}"))
                {
                    return candidate;
                }
            }

            return null;
        }

        /// <summary>
        /// 执行本轮登记的全部去空格重命名，返回是否至少改名成功一个。
        /// </summary>
        private static bool ExecuteScheduledRenames()
        {
            var renamed = false;

            foreach (var pair in m_resourcesToRename)
            {
                var error = AssetDatabase.RenameAsset(pair.Key, pair.Value);

                if (string.IsNullOrEmpty(error))
                {
                    renamed = true;
                    Debug.LogWarning($"资源名存在空格，已自动改名: {pair.Key} -> {pair.Value}{Path.GetExtension(pair.Key)}\n请改成有意义的名字，它会以此名进入图集。");
                }
                else
                {
                    Debug.LogError($"<color=red>资源名存在空格且自动改名失败: {pair.Key} -> {pair.Value}，原因: {error}</color>");
                }
            }

            return renamed;
        }

        private static bool CheckDuplicateAssetName(string assetPath)
        {
            // 确保缓存已初始化
            EnsureCacheInitialized();

            var key = ComposeCacheKey(assetPath);
            var normalizedCurrentPath = Path.GetFullPath(assetPath).Replace("\\", "/");

            // 仅在「同一图集」作用域内查同名文件(复合键 = 图集归属 + 文件名),跨图集重名放行
            if (s_fileNameCache.TryGetValue(key, out var existingPaths))
            {
                // 收集需要移除的过期路径
                List<string> pathsToRemove = null;

                foreach (var existingPath in existingPaths)
                {
                    // 跳过自身
                    if (existingPath.Equals(normalizedCurrentPath, StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }

                    // 确保文件确实存在（防止缓存过期）
                    if (File.Exists(existingPath))
                    {
                        m_resourcesToDelete.Add(assetPath);
                        Debug.LogError($"<color=red>发现同名资源冲突: 合入资源: {assetPath} 存在资源: {existingPath}</color>");
                        return true;
                    }
                    else
                    {
                        // 文件不存在，标记为需要移除
                        pathsToRemove ??= new List<string>();
                        pathsToRemove.Add(existingPath);
                    }
                }

                // 遍历结束后再移除过期路径
                if (pathsToRemove != null)
                {
                    foreach (var path in pathsToRemove)
                    {
                        existingPaths.Remove(path);
                    }
                }
            }

            return false;
        }

        private static bool CheckIsValidImageFile(string path)
        {
            var ext = Path.GetExtension(path).ToLower();
            return ext.Equals(".png") || ext.Equals(".jpg") || ext.Equals(".jpeg");
        }

        private static void ProcessMovedAssets(string[] oldPaths, string[] newPaths)
        {
            if (oldPaths == null || newPaths == null) return;

            for (int i = 0; i < oldPaths.Length; i++)
            {
                if (ShouldProcessAsset(oldPaths[i]))
                {
                    RemoveFromCache(oldPaths[i]);
                    EditorSpriteSaveInfo.OnDeleteSprite(oldPaths[i]);
                    LogProcessed("[Moved From]", oldPaths[i]);
                    EditorSpriteSaveInfo.MarkParentAtlasesDirty(oldPaths[i], true);
                }

                if (ShouldForceImportSettings(newPaths[i]) && EnforceImportSettings(newPaths[i]))
                {
                    continue;
                }

                if (ShouldForceSpriteModeOnly(newPaths[i]) && EnforceSpriteModeOnly(newPaths[i]))
                {
                    continue;
                }

                if (ShouldProcessAsset(newPaths[i]))
                {
                    if (CheckAndScheduleSpaceRename(newPaths[i]) || CheckDuplicateAssetName(newPaths[i]))
                    {
                        continue;
                    }
                    AddToCache(newPaths[i]);
                    EditorSpriteSaveInfo.OnImportSprite(newPaths[i]);
                    LogProcessed("[Moved To]", newPaths[i]);
                    EditorSpriteSaveInfo.MarkParentAtlasesDirty(newPaths[i], false);
                }
            }
        }

        private static bool ShouldProcessAsset(string assetPath)
        {
            var config = AtlasConfiguration.Instance;

            if (string.IsNullOrEmpty(assetPath)) return false;
            if (assetPath.StartsWith("Packages/")) return false;

            if (!CheckIsShowProcessPath(assetPath)) return false;
            if (CheckIsExcludeFolder(assetPath)) return false;

            if (!IsValidImageFile(assetPath)) return false;

            foreach (var keyword in config.excludeKeywords)
            {
                if (assetPath.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) >= 0)
                    return false;
            }

            return true;
        }

        /// <summary>
        /// 导入设置强制的范围判定：整个 UI 源图目录下的图片即纳入，与图集成员范围解耦。
        /// 比 ShouldProcessAsset 更广（不限于 Atlas 子树、不排除 Texture），但仍尊重 excludeKeywords。
        /// </summary>
        private static bool ShouldForceImportSettings(string assetPath)
        {
            var config = AtlasConfiguration.Instance;

            if (string.IsNullOrEmpty(assetPath)) return false;
            if (assetPath.StartsWith("Packages/")) return false;

            var normalized = assetPath.Replace("\\", "/");
            if (!IsUnderUISourceRoot(normalized)) return false;

            if (!IsValidImageFile(normalized)) return false;

            foreach (var keyword in config.excludeKeywords)
            {
                if (normalized.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) >= 0)
                    return false;
            }

            return true;
        }

        /// <summary>
        /// 路径是否落在任一 UI 源图根目录下。入参须已归一为正斜杠。
        /// </summary>
        private static bool IsUnderUISourceRoot(string normalizedPath)
        {
            return IsUnderAnyRoot(normalizedPath, UISourceRootDirs);
        }

        private static bool IsUnderAnyRoot(string normalizedPath, string[] roots)
        {
            foreach (var root in roots)
            {
                if (normalizedPath.StartsWith(root + "/", StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        private static bool CheckIsShowProcessPath(string assetPath)
        {
            var tempRootDirArr = new List<string>(AtlasConfiguration.Instance.sourceAtlasRootDir);
            tempRootDirArr.AddRange(AtlasConfiguration.Instance.rootChildAtlasDir);
            foreach (var rootPath in tempRootDirArr)
            {
                var tempPath = rootPath.Replace("\\", "/").TrimEnd('/');
                if (!assetPath.StartsWith(tempPath + "/"))
                {
                    continue;
                }
                return true;
            }
            return false;
        }

        private static bool CheckIsExcludeFolder(string assetPath)
        {
            foreach (var rootPath in AtlasConfiguration.Instance.excludeFolder)
            {
                var tempPath = rootPath.Replace("\\", "/").TrimEnd('/');
                if (assetPath.StartsWith(tempPath + "/"))
                {
                    return true;
                }
            }
            return false;
        }

        private static bool IsValidImageFile(string path)
        {
            var ext = Path.GetExtension(path).ToLower();
            return ext switch
            {
                ".png" => true,
                ".jpg" => true,
                ".jpeg" => true,
                _ => false
            };
        }

        private static void LogProcessed(string operation, string path)
        {
            if (AtlasConfiguration.Instance.enableLogging)
            {
                Debug.Log($"{operation} {Path.GetFileName(path)}\nPath: {path}");
            }
        }

        /// <summary>
        /// 对存量 UI 源图批量强制导入设置。postprocessor 只在导入时触发，已存在的图需手动跑一次本菜单。
        /// </summary>
        [MenuItem("UITools/图集工具-强制刷新UI源图导入设置")]
        private static void ForceEnforceAllImportSettings()
        {
            var allRoots = UISourceRootDirs.Concat(SpriteModeOnlyRootDirs).ToList();
            var existingRoots = allRoots.Where(Directory.Exists).ToList();
            foreach (var missing in allRoots.Where(d => !Directory.Exists(d)))
            {
                Debug.LogWarning($"UI 源图目录不存在: {missing}");
            }

            if (existingRoots.Count == 0)
            {
                return;
            }

            var files = existingRoots
                .SelectMany(root => Directory.GetFiles(root, "*.*", SearchOption.AllDirectories))
                .Select(p => p.Replace("\\", "/"))
                .Where(p => ShouldForceImportSettings(p) || ShouldForceSpriteModeOnly(p))
                .ToList();

            int changed = 0;
            try
            {
                AssetDatabase.StartAssetEditing();
                for (int i = 0; i < files.Count; i++)
                {
                    EditorUtility.DisplayProgressBar("强制刷新UI源图导入设置",
                        Path.GetFileName(files[i]), (float)i / Mathf.Max(1, files.Count));
                    bool isChange = ShouldForceImportSettings(files[i])
                        ? EnforceImportSettings(files[i])
                        : EnforceSpriteModeOnly(files[i]);
                    if (isChange)
                    {
                        changed++;
                    }
                }
            }
            finally
            {
                EditorUtility.ClearProgressBar();
                AssetDatabase.StopAssetEditing();
                AssetDatabase.Refresh();
            }

            Debug.Log($"UI 源图导入设置强制完成：扫描 {files.Count} 张，改动 {changed} 张。");
        }
    }
}