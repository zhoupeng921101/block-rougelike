using System.Globalization;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 战斗界面(规则 §8.5,布局照 13 号票线框 A)。画面全从规则核心的只读状态画:<see cref="Refresh"/> 是唯一的全量刷新入口,
/// 开新局与续玩(23 号票)走同一条路。打开时传入这一局的 <see cref="RunState"/>(UserData)。
/// 拖拽与输入归 29,结算演出与结果浮层归 30,存档归 23。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIBattlePanel : UIPanelMono
{
    /// <summary>这一局。命令(29 号票)经它发,画面只读它的 <see cref="IRunView"/>。</summary>
    private RunState _run;

    protected override void OnCreate()
    {
        m_part_BoardArea.InitPools();
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
        Refresh(_run);
    }

    protected override void OnUpdate()
    {
        // 12 号票:没在拖时 Esc 直接回主界面;拖拽中先取消,那一支归 29
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            BackToMenu();
            return;
        }
        UpdateDebug();
    }

    /// <summary>
    /// 按局面全量刷新:盘面、托盘(含朝向)、累计分与进度、盲注信息、方块库剩余、弃置余数、类型表。不读事件、不演出。
    /// 方块库剩余是抽牌堆里还没发出来的块数,托盘里的不算(规则 §8.5:剩余预算)。
    /// </summary>
    public void Refresh(IRunView run)
    {
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
        m_part_TrayArea.Refresh(run);
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
