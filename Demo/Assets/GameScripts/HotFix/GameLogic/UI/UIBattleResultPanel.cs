using System;
using System.Globalization;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 盲注结果浮层(13 号票):全屏压暗,卡片中心对准网格中心;胜 660×400、负 660×480。写胜或负、失败原因、累计分 / 目标分,只有「返回主界面」一个出口。
/// 战斗窗在结局步演完、再过 <see cref="ClearPacing.ResultDelay"/> 后打开它(30 号票)。Esc 等同「返回主界面」(12 号票),由下面仍在跑的战斗窗接。
/// 遮罩只挡点击、点了不关:浮层是一局的终点,关掉它底下就是一张拿不起块的盘。
/// </summary>
[Window(UILayer.Window, location : "UIBattleResultPanel")]
public partial class UIBattleResultPanel
{
    /// <summary>打开时传的内容。<see cref="Back"/> 是「返回主界面」,由战斗窗给(它连自己一起关)。</summary>
    public sealed class Data
    {
        public readonly BlindOutcome Outcome;
        public readonly FailReason Reason;
        public readonly long Total;
        public readonly long Target;

        /// <summary>网格中心的世界坐标,卡片中心对准它。</summary>
        public readonly Vector3 Anchor;

        public readonly Action Back;

        public Data(BlindOutcome outcome, FailReason reason, long total, long target, Vector3 anchor, Action back)
        {
            Outcome = outcome;
            Reason = reason;
            Total = total;
            Target = target;
            Anchor = anchor;
            Back = back;
        }
    }

    [Header("卡片")]
    [Tooltip("胜利时的卡片尺寸(13 号票)。")]
    [SerializeField] private Vector2 _wonSize = new Vector2(660f, 400f);
    [Tooltip("失败时的卡片尺寸,多一行失败原因(13 号票)。")]
    [SerializeField] private Vector2 _lostSize = new Vector2(660f, 480f);
    [Tooltip("胜利标题的颜色。")]
    [SerializeField] private Color _wonColor = new Color32(0xf0, 0xc6, 0x3f, 0xFF);
    [Tooltip("失败标题的颜色。")]
    [SerializeField] private Color _lostColor = new Color32(0xf0, 0x52, 0x52, 0xFF);

    private Data _data;

    protected override bool DismissOnMask => false;

    protected override void OnRefresh()
    {
        _data = UserData as Data;
        if (_data == null)
        {
            Log.Error("[UIBattleResultPanel] 打开时没有传入结果,直接关掉");
            GameModule.UI.CloseUI<UIBattleResultPanel>();
            return;
        }
        bool won = _data.Outcome == BlindOutcome.Won;
        TextTable table = TextTable.Instance;
        m_tmp_Title.text = table.Get(won ? TextKeys.Battle.ResultWon : TextKeys.Battle.ResultLost);
        m_tmp_Title.color = won ? _wonColor : _lostColor;
        string reason = TextKeys.FailReasonKey(_data.Reason);
        m_tmp_Reason.gameObject.SetActive(!won && reason != null);
        if (reason != null) m_tmp_Reason.text = table.Get(reason);
        m_tmp_Score.text = table.Format(TextKeys.Battle.ResultScore,
            _data.Total.ToString(CultureInfo.InvariantCulture), _data.Target.ToString(CultureInfo.InvariantCulture));
        m_rect_Card.sizeDelta = won ? _wonSize : _lostSize;
        m_rect_Card.position = _data.Anchor;
    }

    #region 事件

    private partial void OnClick_BackBtn() => _data?.Back?.Invoke();

    #endregion
}
