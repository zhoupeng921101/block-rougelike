using UnityEngine;
using UnityEngine.Audio;
using YooAsset;

namespace TEngine
{
    /// <summary>
    /// 音频代理辅助器。
    /// </summary>
    [System.Serializable]
    public class AudioAgent
    {
#if UNITY_6000_1_OR_NEWER
        private EntityId _instanceId;
#else
        private int _instanceId;
#endif
        private AudioSource _source;
        private AudioData _audioData;
        private IAudioModule _audioModule;
        private IResourceModule _resourceModule;
        private Transform _transform;
        private float _volume = 1.0f;
        private float _duration;
        private float _fadeoutTimer;
        private const float FADEOUT_DURATION = 0.2f;

        /// <summary>
        /// 等待音频数据解码的剩余秒数,0 表示当前不处于等待解码阶段。
        /// </summary>
        /// <remarks>
        /// 与 <see cref="AudioAgentRuntimeState.Loading"/> 合用来区分「资源句柄加载中」和「句柄已完成、音频数据仍在解码」
        /// 两个阶段:两者对外都要表现为「本通道不空闲」,但只有后者需要轮询补播。
        /// </remarks>
        private float _waitDecodeTimer;

        /// <summary>
        /// 等待音频数据解码的超时秒数。
        /// </summary>
        private const float WAIT_DECODE_TIMEOUT = 5f;
        private bool _inPool;

        /// <summary>
        /// 音频代理辅助器运行时状态。
        /// </summary>
        AudioAgentRuntimeState _audioAgentRuntimeState = AudioAgentRuntimeState.None;

        /// <summary>
        /// 音频代理加载请求。
        /// </summary>
        class LoadRequest
        {
            /// <summary>
            /// 音频代理辅助器加载路径。
            /// </summary>
            public string Path;
            
            /// <summary>
            /// 是否异步。
            /// </summary>
            public bool BAsync;
            
            /// <summary>
            /// 是否池化。
            /// </summary>
            public bool BInPool;
        }

        /// <summary>
        /// 音频代理加载请求。
        /// </summary>
        LoadRequest _pendingLoad = null;

        /// <summary>
        /// AudioSource实例化Id
        /// </summary>
#if UNITY_6000_1_OR_NEWER
        private EntityId InstanceID => _instanceId;
#else
        private int InstanceID => _instanceId;
#endif

        /// <summary>
        /// 资源操作句柄。
        /// </summary>
        public AudioData AudioData => _audioData;

        /// <summary>
        /// 音频代理辅助器音频大小。
        /// </summary>
        public float Volume
        {
            set
            {
                if (_source != null)
                {
                    _volume = value;
                    _source.volume = _volume;
                }
            }
            get => _volume;
        }

        /// <summary>
        /// 音频代理辅助器当前是否空闲。
        /// </summary>
        public bool IsFree
        {
            get
            {
                if (_source != null)
                {
                    return _audioAgentRuntimeState == AudioAgentRuntimeState.End;
                }
                else
                {
                    return true;
                }
            }
        }

        /// <summary>
        /// 音频代理辅助器当前是否正在等待资源加载完成。
        /// </summary>
        /// <remarks>
        /// 选通道时必须排除本状态:<see cref="AudioData"/> 只在加载完成那一刻才赋值,加载期间恒为 null,
        /// 仅凭它判空闲会把正在加载的通道再次选中——新请求落进 <c>_pendingLoad</c>,原请求的句柄在
        /// <c>OnAssetLoadComplete</c> 里被 Dispose 且从不播放,听感是「这一声没响、下一声慢一拍」,
        /// 且其余通道全程空转。
        /// </remarks>
        public bool IsLoading => _audioAgentRuntimeState == AudioAgentRuntimeState.Loading;

        /// <summary>
        /// 音频代理辅助器播放秒数。
        /// </summary>
        public float Duration => _duration;

        /// <summary>
        /// 音频代理辅助器当前音频长度。
        /// </summary>
        public float Length
        {
            get
            {
                // 未解码完成时读 length,WebGL 后端会报 "Trying to get length of sound which is not loaded yet."
                if (_source != null && _source.clip != null && _source.clip.loadState == AudioDataLoadState.Loaded)
                {
                    return _source.clip.length;
                }

                return 0;
            }
        }

        /// <summary>
        /// 音频代理辅助器实例位置。
        /// </summary>
        public Vector3 Position
        {
            get => _transform.position;
            set => _transform.position = value;
        }

        /// <summary>
        /// 音频代理辅助器是否循环。
        /// </summary>
        public bool IsLoop
        {
            get
            {
                if (_source != null)
                {
                    return _source.loop;
                }
                else
                {
                    return false;
                }
            }
            set
            {
                if (_source != null)
                {
                    _source.loop = value;
                }
            }
        }

        /// <summary>
        /// 音频代理辅助器是否正在播放。
        /// </summary>
        internal bool IsPlaying
        {
            get
            {
                if (_source != null && _source.isPlaying)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// 音频代理辅助器获取当前声源。
        /// </summary>
        /// <returns></returns>
        public AudioSource AudioResource()
        {
            return _source;
        }

        /// <summary>
        /// 创建音频代理辅助器。
        /// </summary>
        /// <param name="path">生效路径。</param>
        /// <param name="bAsync">是否异步。</param>
        /// <param name="audioCategory">音频轨道（类别）。</param>
        /// <param name="bInPool">是否池化。</param>
        /// <returns>音频代理辅助器。</returns>
        public static AudioAgent Create(string path, bool bAsync, AudioCategory audioCategory, bool bInPool = false)
        {
            AudioAgent audioAgent = new AudioAgent();
            audioAgent.Init(audioCategory);
            audioAgent.Load(path, bAsync, bInPool);
            return audioAgent;
        }

        /// <summary>
        /// 初始化音频代理辅助器。
        /// </summary>
        /// <param name="audioCategory">音频轨道（类别）。</param>
        /// <param name="index">音频代理辅助器编号。</param>
        public void Init(AudioCategory audioCategory, int index = 0)
        {
            _audioModule = ModuleSystem.GetModule<IAudioModule>();
            _resourceModule = ModuleSystem.GetModule<IResourceModule>();
            GameObject host = new GameObject(Utility.Text.Format("Audio Agent Helper - {0} - {1}", audioCategory.AudioMixerGroup.name, index));
            host.transform.SetParent(audioCategory.InstanceRoot);
            host.transform.localPosition = Vector3.zero;
            _transform = host.transform;
            _source = host.AddComponent<AudioSource>();
            _source.playOnAwake = false;
            AudioMixerGroup[] audioMixerGroups =
                audioCategory.AudioMixer.FindMatchingGroups(Utility.Text.Format("Master/{0}/{1}", audioCategory.AudioMixerGroup.name,
                    $"{audioCategory.AudioMixerGroup.name} - {index}"));
            _source.outputAudioMixerGroup = audioMixerGroups.Length > 0 ? audioMixerGroups[0] : audioCategory.AudioMixerGroup;
            _source.rolloffMode = audioCategory.AudioGroupConfig.audioRolloffMode;
            _source.minDistance = audioCategory.AudioGroupConfig.minDistance;
            _source.maxDistance = audioCategory.AudioGroupConfig.maxDistance;
#if UNITY_6000_1_OR_NEWER
            _instanceId = _source.GetEntityId();
#else
            _instanceId = _source.GetInstanceID();
#endif
        }

        /// <summary>
        /// 加载音频代理辅助器。
        /// </summary>
        /// <param name="path">资源路径。</param>
        /// <param name="bAsync">是否异步。</param>
        /// <param name="bInPool">是否池化。</param>
        public void Load(string path, bool bAsync, bool bInPool = false)
        {
            _inPool = bInPool;
            if (_audioAgentRuntimeState == AudioAgentRuntimeState.None || _audioAgentRuntimeState == AudioAgentRuntimeState.End)
            {
                _duration = 0;
                _waitDecodeTimer = 0f;
                if (!string.IsNullOrEmpty(path))
                {
                    if (bInPool && _audioModule.AudioClipPool.TryGetValue(path, out var operationHandle))
                    {
                        OnAssetLoadComplete(operationHandle);
                        return;
                    }

                    if (bAsync)
                    {
                        _audioAgentRuntimeState = AudioAgentRuntimeState.Loading;
                        AssetHandle handle = _resourceModule.LoadAssetAsyncHandle<AudioClip>(path);
                        handle.Completed += OnAssetLoadComplete;
                    }
                    else
                    {
                        AssetHandle handle = _resourceModule.LoadAssetSyncHandle<AudioClip>(path);
                        OnAssetLoadComplete(handle);
                    }
                }
            }
            else
            {
                _pendingLoad = new LoadRequest { Path = path, BAsync = bAsync, BInPool = bInPool };

                if (_audioAgentRuntimeState == AudioAgentRuntimeState.Playing)
                {
                    Stop(true);
                }
            }
        }

        /// <summary>
        /// 停止播放音频代理辅助器。
        /// </summary>
        /// <param name="fadeout">是否渐出。</param>
        public void Stop(bool fadeout = false)
        {
            if (_source != null)
            {
                if (fadeout)
                {
                    _fadeoutTimer = FADEOUT_DURATION;
                    _audioAgentRuntimeState = AudioAgentRuntimeState.FadingOut;
                }
                else
                {
                    _source.Stop();
                    _waitDecodeTimer = 0f;
                    _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                }
            }
        }

        /// <summary>
        /// 暂停音频代理辅助器。
        /// </summary>
        public void Pause()
        {
            if (_source != null)
            {
                _source.Pause();
            }
        }

        /// <summary>
        /// 取消暂停音频代理辅助器。
        /// </summary>
        public void UnPause()
        {
            if (_source != null)
            {
                _source.UnPause();
            }
        }

        /// <summary>
        /// 资源加载完成。
        /// </summary>
        /// <param name="handle">资源操作句柄。</param>
        void OnAssetLoadComplete(AssetHandle handle)
        {
            if (handle != null)
            {
                if (_inPool)
                {
                    _audioModule.AudioClipPool.TryAdd(handle.GetAssetInfo().Address, handle);
                }
            }

            if (_pendingLoad != null)
            {
                if (!_inPool && handle != null)
                {
                    handle.Dispose();
                }

                _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                string path = _pendingLoad.Path;
                bool bAsync = _pendingLoad.BAsync;
                bool bInPool = _pendingLoad.BInPool;
                _pendingLoad = null;
                Load(path, bAsync, bInPool);
            }
            else if (handle != null)
            {
                if (_audioData != null)
                {
                    AudioData.DeAlloc(_audioData);
                    _audioData = null;
                }

                _audioData = AudioData.Alloc(handle, _inPool);

                _source.clip = handle.AssetObject as AudioClip;
                if (_source.clip != null)
                {
                    BeginPlay();
                }
                else
                {
                    _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                }
            }
            else
            {
                _audioAgentRuntimeState = AudioAgentRuntimeState.End;
            }
        }

        /// <summary>
        /// 开始播放当前音频,音频数据未解码完成时转入等待、由轮询补播。
        /// </summary>
        /// <remarks>
        /// 资源句柄完成 != 音频数据可播:WebGL 的音频解码在句柄完成后才异步进行,此时直接 <c>Play()</c> 会让后端
        /// 报 "Trying to get length of sound which is not loaded yet.",且这一声不会真正启动——下一帧 <c>isPlaying</c>
        /// 为假,<see cref="Update"/> 随即判为播放结束并回收通道,听感是「第一声没响、第二声才响」。
        /// 等待期间沿用 <see cref="AudioAgentRuntimeState.Loading"/>,使 <see cref="IsLoading"/> 继续把本通道排除在
        /// 空闲之外,不必改动选通道逻辑。
        /// </remarks>
        private void BeginPlay()
        {
            AudioClip clip = _source.clip;
            if (clip.loadState == AudioDataLoadState.Loaded)
            {
                _waitDecodeTimer = 0f;
                _source.Play();
                _audioAgentRuntimeState = AudioAgentRuntimeState.Playing;
                return;
            }

            if (clip.loadState == AudioDataLoadState.Unloaded)
            {
                clip.LoadAudioData();
            }

            _waitDecodeTimer = WAIT_DECODE_TIMEOUT;
            _audioAgentRuntimeState = AudioAgentRuntimeState.Loading;
        }

        /// <summary>
        /// 轮询等待解码阶段。
        /// </summary>
        /// <remarks>
        /// 解码失败与超时都必须把通道转回 <see cref="AudioAgentRuntimeState.End"/>:缺这两个出口时通道会永久停在
        /// Loading,既不发声也不被 <see cref="AudioCategory.Play"/> 当作空闲重选,比不等待更糟。
        /// </remarks>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        private void UpdateWaitDecode(float elapseSeconds)
        {
            // 所有通道都忙时本通道可能被新请求抢占。等待解码发生在句柄回调之后,不会再有回调来消费
            // _pendingLoad,必须在这里转手,否则新请求挂死、这一声永远不响。
            if (_pendingLoad != null)
            {
                _waitDecodeTimer = 0f;
                _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                string path = _pendingLoad.Path;
                bool bAsync = _pendingLoad.BAsync;
                bool bInPool = _pendingLoad.BInPool;
                _pendingLoad = null;
                Load(path, bAsync, bInPool);
                return;
            }

            AudioClip clip = _source.clip;
            if (clip == null)
            {
                _waitDecodeTimer = 0f;
                _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                return;
            }

            if (clip.loadState == AudioDataLoadState.Loaded)
            {
                _waitDecodeTimer = 0f;
                _source.Play();
                _audioAgentRuntimeState = AudioAgentRuntimeState.Playing;
                return;
            }

            if (clip.loadState == AudioDataLoadState.Failed)
            {
                Log.Warning($"Audio data decode failed, drop playback: {clip.name}");
                _waitDecodeTimer = 0f;
                _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                return;
            }

            _waitDecodeTimer -= elapseSeconds;
            if (_waitDecodeTimer <= 0f)
            {
                Log.Warning($"Audio data decode timeout in {WAIT_DECODE_TIMEOUT}s, drop playback: {clip.name}");
                _waitDecodeTimer = 0f;
                _audioAgentRuntimeState = AudioAgentRuntimeState.End;
            }
        }

        /// <summary>
        /// 轮询音频代理辅助器。
        /// </summary>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        public void Update(float elapseSeconds)
        {
            if (_audioAgentRuntimeState == AudioAgentRuntimeState.Playing)
            {
                if (!_source.isPlaying)
                {
                    _audioAgentRuntimeState = AudioAgentRuntimeState.End;
                }
            }
            else if (_audioAgentRuntimeState == AudioAgentRuntimeState.Loading && _waitDecodeTimer > 0f)
            {
                UpdateWaitDecode(elapseSeconds);
            }
            else if (_audioAgentRuntimeState == AudioAgentRuntimeState.FadingOut)
            {
                if (_fadeoutTimer > 0f)
                {
                    _fadeoutTimer -= elapseSeconds;
                    _source.volume = _volume * _fadeoutTimer / FADEOUT_DURATION;
                }
                else
                {
                    Stop();
                    if (_pendingLoad != null)
                    {
                        string path = _pendingLoad.Path;
                        bool bAsync = _pendingLoad.BAsync;
                        bool bInPool = _pendingLoad.BInPool;
                        _pendingLoad = null;
                        Load(path, bAsync, bInPool);
                    }

                    _source.volume = _volume;
                }
            }

            _duration += elapseSeconds;
        }

        /// <summary>
        /// 销毁音频代理辅助器。
        /// </summary>
        public void Destroy()
        {
            if (_transform != null)
            {
                Object.Destroy(_transform.gameObject);
            }

            if (_audioData != null)
            {
                AudioData.DeAlloc(_audioData);
            }
        }
    }
}