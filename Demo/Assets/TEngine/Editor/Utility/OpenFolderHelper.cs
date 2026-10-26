using System.Diagnostics;
using UnityEditor;
using UnityEngine;

namespace TEngine.Editor
{
    /// <summary>
    /// 打开文件夹相关的实用函数。
    /// </summary>
    public static class OpenFolderHelper
    {
        /// <summary>
        /// 打开 Data Path 文件夹。
        /// </summary>
        [MenuItem("TEngine/Open Folder/Data Path", false, 10)]
        public static void OpenFolderDataPath()
        {
            Execute(Application.dataPath);
        }

        /// <summary>
        /// 打开 Persistent Data Path 文件夹。
        /// </summary>
        [MenuItem("TEngine/Open Folder/Persistent Data Path", false, 11)]
        public static void OpenFolderPersistentDataPath()
        {
            Execute(Application.persistentDataPath);
        }

        /// <summary>
        /// 打开 Streaming Assets Path 文件夹。
        /// </summary>
        [MenuItem("TEngine/Open Folder/Streaming Assets Path", false, 12)]
        public static void OpenFolderStreamingAssetsPath()
        {
            Execute(Application.streamingAssetsPath);
        }

        /// <summary>
        /// 打开 Temporary Cache Path 文件夹。
        /// </summary>
        [MenuItem("TEngine/Open Folder/Temporary Cache Path", false, 13)]
        public static void OpenFolderTemporaryCachePath()
        {
            Execute(Application.temporaryCachePath);
        }

#if UNITY_2018_3_OR_NEWER

        /// <summary>
        /// 打开 Console Log Path 文件夹。
        /// </summary>
        [MenuItem("TEngine/Open Folder/Console Log Path", false, 14)]
        public static void OpenFolderConsoleLogPath()
        {
            Execute(System.IO.Path.GetDirectoryName(Application.consoleLogPath));
        }

#endif

        /// <summary>
        /// 打开网络协议 proto 文件夹（下辖 Outer / Inner 两个子目录）。
        /// </summary>
        [MenuItem("TEngine/Open Folder/Proto Path", false, 15)]
        public static void OpenFolderProtoPath()
        {
            string folder = ProtoFolder;
            if (!System.IO.Directory.Exists(folder))
            {
                // 只拉了客户端仓的机器没有服务端目录：报出预期路径，不打开无关目录。
                UnityEngine.Debug.LogError($"网络协议目录不存在：{folder}");
                return;
            }

            Execute(folder);
        }

        /// <summary>
        /// 网络协议 proto 目录的绝对路径。
        /// 该目录在 Unity 工程之外：服务端仓 Fantasy 与 UnityProject 并列于仓根下，故自 Assets 上溯两级再进入。
        /// </summary>
        private static string ProtoFolder =>
            System.IO.Path.GetFullPath($"{Application.dataPath}/../../Fantasy/examples/Config/NetworkProtocol");

        /// <summary>
        /// 打开指定路径的文件夹。
        /// </summary>
        /// <param name="folder">要打开的文件夹的路径。</param>
        public static void Execute(string folder)
        {
            folder = $"\"{folder}\"";
            switch (Application.platform)
            {
                case RuntimePlatform.WindowsEditor:
                    Process.Start("Explorer.exe", folder.Replace('/', '\\'));
                    break;

                case RuntimePlatform.OSXEditor:
                    Process.Start("open", folder);
                    break;

                default:
                    throw new System.Exception($"Not support open folder on '{Application.platform}' platform.");
            }
        }
    }
}
