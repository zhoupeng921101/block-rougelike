using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace Launcher
{
    /// <summary>
    /// UI更新界面。
    /// </summary>
    public class LoadUpdateUI : UIBase
    {
        #region 脚本工具生成的代码

        private Image m_imgBg;
        private Slider m_sliderProgress;
        private Text m_textPercent;
        private Text m_textTips;
        private Text m_textUpdateDesc;
        private Text m_textVersion;
        private Text m_textLabelAppid;
        private Button m_btnClearCache;
        private Text m_textClearCache;
        private GameObject m_goClearConfirm;
        private Text m_textClearDesc;
        private Button m_btnClearCancel;
        private Text m_textClearCancel;
        private Button m_btnClearOk;
        private Text m_textClearOk;

        protected override void ScriptGenerator()
        {
            m_imgBg = FindChildComponent<Image>("m_imgBg");
            m_sliderProgress = FindChildComponent<Slider>("Fillbar/m_sliderProgress");
            m_textPercent = FindChildComponent<Text>("Fillbar/m_textPercent");
            m_textTips = FindChildComponent<Text>("m_textTips");
            m_textUpdateDesc = FindChildComponent<Text>("m_textUpdateDesc");
            m_textVersion = FindChildComponent<Text>("m_textVersion");
            m_textLabelAppid = FindChildComponent<Text>("m_textLabelAppid");
            m_btnClearCache = FindChildComponent<Button>("清理缓存层/m_btnClearCache");
            m_textClearCache = FindChildComponent<Text>("清理缓存层/m_btnClearCache/m_textClearCache");
            m_goClearConfirm = FindChild("清理缓存层/m_goClearConfirm").gameObject;
            m_textClearDesc = FindChildComponent<Text>("清理缓存层/m_goClearConfirm/弹框/m_textClearDesc");
            m_btnClearCancel = FindChildComponent<Button>("清理缓存层/m_goClearConfirm/弹框/按钮组/m_btnClearCancel");
            m_textClearCancel = FindChildComponent<Text>("清理缓存层/m_goClearConfirm/弹框/按钮组/m_btnClearCancel/m_textClearCancel");
            m_btnClearOk = FindChildComponent<Button>("清理缓存层/m_goClearConfirm/弹框/按钮组/m_btnClearOk");
            m_textClearOk = FindChildComponent<Text>("清理缓存层/m_goClearConfirm/弹框/按钮组/m_btnClearOk/m_textClearOk");
            m_btnClearCache.onClick.AddListener(OnClickClearCacheBtn);
            m_btnClearCancel.onClick.AddListener(OnClickClearCancelBtn);
            m_btnClearOk.onClick.AddListener(OnClickClearOkBtn);
        }

        #endregion

        /// <summary>
        /// 提示语文案。热更阶段配置系统未就绪,读不到 Luban 表 <c>TbLoadingTip</c>,
        /// 故与热更后的 <c>UILoadingPanel</c> 分两份文案:改表不会同步到这里。
        /// </summary>
        private static readonly string[] Tips =
        {
            "小提示：一整行填满就会消除，别急着把角落塞死",
            "小提示：合成台的订单会随等级刷新，先看清再动手",
            "小提示：卡住时先看还有没有能放下的形状，再考虑用道具",
            "小提示：每天的登录奖励别忘了领",
            "小提示：升级建筑能解锁新的玩法入口",
            "小提示：体力会随时间自然恢复，攒着用不亏",
        };

        /// <summary>
        /// 清理缓存的文案。写在代码里而不是只烤进 prefab:启动器字体是按本目录 .cs 用字生成的子集
        /// (docs/tools/subset_launcher_font.py),只在 prefab 里的字进不了字体、静默不渲染。
        /// 热更后的 <c>UILoadingPanel</c> 另有一份同文案。
        /// </summary>
        private const string ClearButtonText = "清理缓存";
        private const string ClearCancelText = "取消";
        private const string ClearOkText = "确定";
        private const string ClearConfirmDesc = "确定要清理缓存？\n将清除已下载的游戏资源，\n下次进入时重新下载。";
        private const string ClearRunningDesc = "正在清理…";
        private const string ClearDoneDesc = "清理完成，请重新打开游戏。";
        private const string ClearDoneDescWeb = "清理完成，点击确定刷新页面。";

        private enum ClearStage
        {
            None,
            Confirm,
            Clearing,
            Done,
        }

        private bool m_tipPicked;
        private ClearStage m_clearStage;

        protected override bool FullScreen => true;

        public override void OnInit(object param)
        {
            base.OnInit(param);
            m_textUpdateDesc.text = param?.ToString();

            // OnInit 随每次 ShowUI 调用(下载期每帧一次),提示语只取一次,否则文案逐帧跳变。
            if (!m_tipPicked)
            {
                m_tipPicked = true;
                m_textTips.text = Tips[Random.Range(0, Tips.Length)];
                m_textClearCache.text = ClearButtonText;
                m_textClearCancel.text = ClearCancelText;
                m_textClearOk.text = ClearOkText;
                RevealClearButtonLaterAsync().Forget();
            }
        }

        /// <summary>加载界面停留够久才露出清理按钮,正常几秒进游戏时不出现。</summary>
        private async UniTaskVoid RevealClearButtonLaterAsync()
        {
            float wait = CacheCleaner.RevealAfterSeconds - Time.unscaledTime;
            if (wait > 0f)
            {
                await UniTask.Delay(System.TimeSpan.FromSeconds(wait), ignoreTimeScale: true);
            }

            // 等待期间本界面可能已被关掉(热更后的加载窗接手),节点随之销毁。
            if (gameObject == null)
            {
                return;
            }

            m_btnClearCache.gameObject.SetActive(true);
        }

        private void OnClickClearCacheBtn()
        {
            m_clearStage = ClearStage.Confirm;
            m_textClearDesc.text = ClearConfirmDesc;
            m_btnClearCancel.gameObject.SetActive(true);
            m_btnClearOk.gameObject.SetActive(true);
            m_goClearConfirm.SetActive(true);
        }

        private void OnClickClearCancelBtn()
        {
            m_clearStage = ClearStage.None;
            m_goClearConfirm.SetActive(false);
        }

        private void OnClickClearOkBtn()
        {
            if (m_clearStage == ClearStage.Confirm)
            {
                RunClearAsync().Forget();
            }
            else if (m_clearStage == ClearStage.Done)
            {
                CacheCleaner.ExitGame();
            }
        }

        private async UniTaskVoid RunClearAsync()
        {
            m_clearStage = ClearStage.Clearing;
            m_textClearDesc.text = ClearRunningDesc;
            m_btnClearCancel.gameObject.SetActive(false);
            m_btnClearOk.gameObject.SetActive(false);

            await CacheCleaner.ClearAllAsync();

            if (gameObject == null)
            {
                return;
            }

            m_clearStage = ClearStage.Done;
            m_textClearDesc.text = Application.platform == RuntimePlatform.WebGLPlayer ? ClearDoneDescWeb : ClearDoneDesc;
            m_btnClearOk.gameObject.SetActive(true);
        }

        internal void RefreshProgress(float progress)
        {
            m_sliderProgress.value = Mathf.Clamp01(progress);
            m_textPercent.text = Mathf.RoundToInt(m_sliderProgress.value * 100f) + "%";
        }

        internal void RefreshVersion(string version)
        {
            m_textVersion.text = version;
        }

        internal void RefreshAppid(string appid)
        {
            m_textLabelAppid.text = appid;
        }
    }
}
