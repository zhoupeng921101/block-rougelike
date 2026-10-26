using System;
using System.IO;
using UnityEditor;

namespace YooAsset.Editor
{
    /// <summary>
    /// 出资源包前的脚本域新鲜度闸:编辑器已加载的程序集必须与磁盘上的脚本一致,否则拒绝出包。
    /// </summary>
    /// <remarks>
    /// 本工程补丁,非 YooAsset 上游代码;升级 YooAsset 时须保留本文件与 <see cref="AssetBundleBuilder.Run"/> 里的调用。
    /// 资源包里的 prefab / ScriptableObject 按当前域的类型序列化:域是旧的,新增的序列化字段被静默丢掉,
    /// 而同批热更 DLL 是按磁盘源码新编的,运行时字段读到 null。构建期没有任何报错,只能在出包前拦死。
    /// 不能同步等待:编译与域重载都靠编辑器主线程 tick 推进,域重载还要等当前调用栈退出,原地轮询只会卡死。
    /// </remarks>
    [InitializeOnLoad]
    public static class ScriptDomainGate
    {
        private const string ScriptAssembliesDir = "Library/ScriptAssemblies";

        /// <summary>本域加载时编辑器程序集的最新写入时间;域重载后随静态字段一起重取。</summary>
        private static readonly DateTime LoadedAssembliesStamp;

        private static int _acceptSelfGeneratedDepth;

        static ScriptDomainGate()
        {
            LoadedAssembliesStamp = GetScriptAssembliesStamp();
        }

        /// <summary>
        /// 作用域内 <see cref="TryPass"/> 直接放行。只给已在入口过闸、随后跑了 HybridCLR 生成链的整链出包用。
        /// </summary>
        /// <remarks>
        /// 生成链改写 <c>AOTGenericReferences.cs</c>,Refresh 后编辑器重编 Launcher,收口处必判「已编译未重载」;
        /// 而那份代码不含序列化类型,旧域打 AB 不丢字段。不放行则整链出包每逢该文件变化都被拦死。
        /// </remarks>
        public static IDisposable AcceptSelfGeneratedScripts()
        {
            _acceptSelfGeneratedDepth++;
            return new AcceptScope();
        }

        private sealed class AcceptScope : IDisposable
        {
            private bool _disposed;

            public void Dispose()
            {
                if (_disposed)
                {
                    return;
                }

                _disposed = true;
                _acceptSelfGeneratedDepth--;
            }
        }

        /// <summary>
        /// 同步导入磁盘改动后判定能否出包。
        /// </summary>
        /// <param name="error">不能出包时的原因与处置,可直接给用户看;能出包时为 null。</param>
        /// <returns>脚本域是最新的、可以出包为 true。</returns>
        public static bool TryPass(out string error)
        {
            if (_acceptSelfGeneratedDepth > 0)
            {
                error = null;
                return true;
            }

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);

            if (EditorApplication.isCompiling || EditorApplication.isUpdating)
            {
                error = "[ScriptDomainGate] 脚本编译或资源导入进行中,拒绝出资源包:此刻打包会按旧程序集序列化 prefab。" +
                        "等编译与域重载结束后重新发起构建。";
                return false;
            }

            if (EditorUtility.scriptCompilationFailed)
            {
                error = "[ScriptDomainGate] 编辑器脚本有编译错误,拒绝出资源包:当前域仍是上一次编译成功的旧程序集。" +
                        "修掉 Console 里的编译错误后重新发起构建。";
                return false;
            }

            // 前两条都过也不够:编译可能已在 Refresh 内完成、新程序集已落盘,但域重载要等本次调用栈退出才发生。
            // HybridCLR 编热更 DLL 走 player 脚本编译,产物不落这个目录,不会误触发。
            if (GetScriptAssembliesStamp() > LoadedAssembliesStamp)
            {
                error = "[ScriptDomainGate] 编辑器程序集已重新编译、但尚未重载进当前域,拒绝出资源包:" +
                        "此刻打包会按旧类型序列化 prefab,新增字段被丢掉。等域重载结束后重新发起构建。";
                return false;
            }

            error = null;
            return true;
        }

        private static DateTime GetScriptAssembliesStamp()
        {
            DateTime stamp = DateTime.MinValue;
            if (!Directory.Exists(ScriptAssembliesDir))
            {
                return stamp;
            }

            foreach (string file in Directory.GetFiles(ScriptAssembliesDir, "*.dll"))
            {
                DateTime writeTime = File.GetLastWriteTimeUtc(file);
                if (writeTime > stamp)
                {
                    stamp = writeTime;
                }
            }

            return stamp;
        }
    }
}
