using System.Globalization;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 战斗界面(规则 §8.5,布局照 13 号票线框 A)。画面全从规则核心的只读状态画:<see cref="Refresh"/> 是唯一的全量刷新入口,
/// 开新局与续玩(23 号票)走同一条路。打开时传入这一局的 <see cref="RunState"/>(UserData)。
/// 拖拽、旋转、弃置与预览在 <see cref="PieceGestureFlow"/>;结算演出与结果浮层归 30,存档归 23。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIBattlePanel : UIPanelMono
{
    /// <summary>这一局。命令经手势流发,画面只读它的 <see cref="IRunView"/>。</summary>
    private RunState _run;

    /// <summary>落子手势。结算锁 <see cref="PieceGestureFlow.Lock"/> / <see cref="PieceGestureFlow.Unlock"/> 由 30 号票的演出调。</summary>
    private PieceGestureFlow _gesture;

    protected override void OnCreate()
    {
        m_part_BoardArea.InitPools();
        // 窗根当拖拽层:拿起的块挂到最上层,盖在弃置区之上
        _gesture = new PieceGestureFlow(m_part_BoardArea, m_part_TrayArea, m_part_Discard, m_part_TypeTable, m_part_Badge, rectTransform, OnStepAccepted);
    }

    protected override void OnRefresh()
    {
        _run = UserData as RunState;
        if (_run == null || _run.Blind == null)
        {
            // 没有局面可画:不留一张盖住主界面的空窗
            Log.Error("[UIBattlePanel] 打开时没有传入开了盲注的 RunState,回主界面");
            BackToMenu();
            return;
        }
        _gesture.Bind(_run);
        Refresh(_run);
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
    /// 落子或弃置被规则核心接受之后。本票没有演出,直接全量刷新,盘面跳到终态;30 号票在这里接上演出(先上锁,演到解锁时刻再解锁)。
    /// </summary>
    private void OnStepAccepted(StepResult result)
    {
        Refresh(_run);
        IBlindView blind = _run.Blind;
        if (blind.Outcome != BlindOutcome.InProgress)
            Log.Info($"[UIBattlePanel] 盲注结束:{blind.Outcome}({blind.FailReason}),累计 {blind.Score}/{blind.Spec.Target},第 {result.Step} 步");
    }

    /// <summary>
    /// 按局面全量刷新:盘面、托盘(含朝向)、累计分与进度、盲注信息、方块库剩余、弃置余数、类型表。不读事件、不演出。
    /// 方块库剩余是抽牌堆里还没发出来的块数,托盘里的不算(规则 §8.5:剩余预算)。
    /// </summary>
    public void Refresh(IRunView run)
    {
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

    private void BackToMenu() => GameModule.UI.CloseUI<UIBattlePanel>();

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
