using System.Globalization;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 战斗界面(规则 §8.5,布局照 13 号票线框 A)。画面全从规则核心的只读状态画:<see cref="Refresh"/> 是唯一的全量刷新入口,
/// 开新局与续玩(23 号票)走同一条路。打开时传入 <see cref="Entry"/>(UserData)。
/// 拖拽、旋转、弃置与预览在 <see cref="PieceGestureFlow"/>;一步的结算演出在 <see cref="StepShowPlayer"/>,特效在 <see cref="BattleFxDirector"/>,结局弹 <see cref="UIBattleResultPanel"/>;
/// 存档时机在 <see cref="RunSaveService"/>。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIBattlePanel : UIPanelMono
{
    /// <summary>这一局。命令经手势流发,画面只读它的 <see cref="IRunView"/>。</summary>
    private RunState _run;

    /// <summary>落子手势。结算锁 <see cref="PieceGestureFlow.Lock"/> / <see cref="PieceGestureFlow.Unlock"/> 由演出调。</summary>
    private PieceGestureFlow _gesture;

    /// <summary>一步的结算演出(30 号票)。</summary>
    private StepShowPlayer _show;

    /// <summary>特效(32 号票):挂在结算演出的时间表上,另管开局点亮与扫描线。</summary>
    private BattleFxDirector _fx;

    [Tooltip("特效素材(现在全是动物乐园的占位,见 Effects/ZooPlaceholder/占位登记表.md)")]
    [SerializeField] private BattleFxAssets _fxAssets = new BattleFxAssets();

    /// <summary>打开战斗窗时的 UserData:这一局,以及它是不是从主界面「继续」进来的(开局特效不同,31 号票第 20 项)。</summary>
    public sealed class Entry
    {
        public readonly RunState Run;
        public readonly bool Resumed;

        public Entry(RunState run, bool resumed)
        {
            Run = run;
            Resumed = resumed;
        }
    }

    protected override void OnCreate()
    {
        m_part_BoardArea.InitPools();
        // 窗根当拖拽层:拿起的块挂到最上层,盖在弃置区之上
        _gesture = new PieceGestureFlow(m_part_BoardArea, m_part_TrayArea, m_part_Discard, m_part_TypeTable, m_part_Badge, rectTransform, OnStepAccepted,
            () => RunSaveService.Instance.MarkRotated(_run));
        _fx = new BattleFxDirector(_fxAssets, m_part_BoardArea, rectTransform, gameObject);
        _show = new StepShowPlayer(gameObject, rectTransform, m_part_BoardArea, m_part_TrayArea, m_part_Discard, m_part_TypeTable, m_part_Badge,
            m_tmp_Score, m_slider_Score, m_tmp_LibraryLeft, _fxAssets, _fx, _gesture, ShowResult);
    }

    protected override void OnDestroyWindow() => _show?.Kill();

    protected override void OnRefresh()
    {
        var entry = UserData as Entry;
        _run = entry?.Run;
        if (_run == null || _run.Blind == null)
        {
            // 没有局面可画:不留一张盖住主界面的空窗
            Log.Error("[UIBattlePanel] 打开时没有传入开了盲注的 RunState,回主界面");
            BackToMenu();
            return;
        }
        _gesture.Bind(_run);
        Refresh(_run);
        AudioConfigMgr.SwitchMusic(AudioIds.MusicBoard);
        _fx.PlayOpening(entry.Resumed);
    }

    protected override void OnUpdate()
    {
        // 12 号票:拖拽中 Esc 是取消这一手,没在拖时直接回主界面
        if (PieceKeymap.CancelOrBackPressed())
        {
            if (!_gesture.IsDragging)
            {
                BackToMenu();
                return;
            }
            _gesture.Cancel();
        }
        _gesture.Update();
        UpdateDebug();
    }

    /// <summary>
    /// 落子或弃置被规则核心接受之后:先存档,再演这一步(上锁、照时间表演到解锁时刻再解锁;结局步演完弹结果浮层)。
    /// 存档在开演之前写完(09 号票第 2 节):演到一半关窗,读回来就是这一步之后的局面。
    /// </summary>
    private void OnStepAccepted(StepResult result, PieceGestureFlow.PieceRelease release)
    {
        RunSaveService.Instance.CommitStep(_run, result);
        _show.Play(result, release, _run);
        IBlindView blind = _run.Blind;
        if (blind.Outcome != BlindOutcome.InProgress)
            Log.Info($"[UIBattlePanel] 盲注结束:{blind.Outcome}({blind.FailReason}),累计 {blind.Score}/{blind.Spec.Target},第 {result.Step} 步");
    }

    /// <summary>
    /// 结局步演完再过 <see cref="ClearPacing.ResultDelay"/>,弹结果浮层(13 号票:胜或负、失败原因、累计分 / 目标分)。
    /// 赢了先结算入账(回地图后钱已经变了),输了删档;浮层上「继续」回地图或主界面,由 <see cref="RunFlow"/> 接。
    /// </summary>
    private void ShowResult(BlindEnded ended, long total)
    {
        bool won = ended.Outcome == BlindOutcome.Won;
        long target = _run.Blind.Spec.Target;
        Settlement? settlement = null;
        if (won && _run.Progress.CurrentNodeId != 0) settlement = RunFlow.SettleWon(_run);
        else if (!won) RunFlow.LoseRun();
        RectTransform board = m_part_BoardArea.rectTransform;
        GameModule.UI.ShowUIAsync<UIBattleResultPanel>(new UIBattleResultPanel.Data(
            ended.Outcome, ended.Reason, total, target, board.TransformPoint(board.rect.center), settlement,
            () => RunFlow.AfterResult(_run, won), BackToMenu));
    }

    /// <summary>
    /// 按局面全量刷新:盘面、托盘(含朝向)、累计分与进度、盲注信息、方块库剩余、弃置余数、类型表。不读事件、不演出:
    /// 在播的演出先跳到终态,再整个重画。
    /// 方块库剩余是抽牌堆里还没发出来的块数,托盘里的不算(规则 §8.5:剩余预算)。
    /// </summary>
    public void Refresh(IRunView run)
    {
        _show.Finish();
        // 托盘只经手势流重建,而且放最前:块在手上时先收回来、收掉盘上的预览,再重画别的;新槽要挂拖拽器
        _gesture.RefreshTray();
        IBlindView blind = run.Blind;
        BlindSpec spec = blind.Spec;
        TextTable table = TextTable.Instance;
        m_tmp_BlindTitle.text = table.Format(TextKeys.Battle.BlindNormal, spec.Segment, spec.Layer);
        m_tmp_BlindTarget.text = Num(spec.Target);
        m_tmp_LibraryLeft.text = Num(blind.Draw.Count);
        m_tmp_LibraryTotal.text = table.Format(TextKeys.Battle.LibraryTotal, run.Library.Count);
        m_tmp_Score.text = Num(blind.Score);
        m_tmp_ScoreTarget.text = table.Format(TextKeys.Battle.ScoreOf, spec.Target);
        m_slider_Score.value = ProgressOf(blind.Score, spec.Target);
        m_part_TypeTable.Refresh(run);
        m_part_BoardArea.Refresh(run);
        m_part_Discard.Refresh(blind.DiscardsLeft);
    }

    private static float ProgressOf(long score, long target) => target > 0 ? Mathf.Clamp01((float)((double)score / target)) : 1f;

    private static string Num(long n) => n.ToString(CultureInfo.InvariantCulture);

    /// <summary>
    /// 回主界面:先杀掉演出,再交给 <see cref="RunFlow.BackToMenu"/>(关掉局内各窗并把主界面开回来)。
    /// 主界面在开局时已经关掉,这里不重开就会剩一张空屏。
    /// </summary>
    private void BackToMenu()
    {
        _show?.Kill();
        RunFlow.BackToMenu();
    }

    /// <summary>调试入口(编辑器与开发包),实现在 UIBattlePanel.Debug.cs;出包时连调用一起编掉。</summary>
    partial void UpdateDebug();

    #region 事件

    // 纯展示的进度条,interactable 关着,不接回调
    private partial void OnSlider_ScoreChange(float value)
    {
    }

    private partial void OnClick_BackBtn() => BackToMenu();

    #endregion
}
