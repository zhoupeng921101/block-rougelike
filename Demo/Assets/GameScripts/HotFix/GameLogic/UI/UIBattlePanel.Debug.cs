#if UNITY_EDITOR || DEVELOPMENT_BUILD
using System.Collections.Generic;
using System.Text;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 战斗窗的调试入口,只在编辑器和开发包里有(28 号票第 7 条):拖拽(29 号票)接上之前,用按键让规则核心随机走一步、再全量刷新,验画面。
/// F5:在托盘里所有块的合法落点(任一朝向)里随机挑一个落下,一块都放不下时随机弃一块;F6:随机弃一块;F7:托盘里的块各随机转一个朝向。
/// 随机用 <see cref="Random"/>(引擎的),不碰规则核心的随机流(08 号票)。每一步之后把画面和规则核心逐项比一遍,一致记 Info、不一致记 Error。
/// 走步与转朝向照真输入一样存档(<see cref="RunSaveService"/>),不演出。
/// </summary>
public partial class UIBattlePanel
{
    partial void UpdateDebug()
    {
        if (Input.GetKeyDown(KeyCode.F5)) DebugStep(false);
        else if (Input.GetKeyDown(KeyCode.F6)) DebugStep(true);
        else if (Input.GetKeyDown(KeyCode.F7)) DebugRotate();
    }

    /// <summary>随机走一步(<paramref name="discard"/> = 弃置),刷新并核对。返回这一步的日志行;没走成返回 null。</summary>
    public string DebugStep(bool discard)
    {
        if (_run?.Blind == null || _run.Blind.Outcome != BlindOutcome.InProgress)
        {
            Log.Info("[BattleDebug] 盲注已结束,不再走");
            return null;
        }
        IReadOnlyList<TraySlot> tray = _run.Blind.Tray;
        StepResult result = null;
        string what = null;
        if (!discard)
        {
            var moves = new List<(int id, int rot, int row, int col)>();
            foreach (TraySlot slot in tray)
            {
                if (slot.IsEmpty) continue;
                for (int rot = 0; rot < BlockShapeMap.RotCount; rot++)
                    for (int row = 0; row < BoardCells.Rows; row++)
                        for (int col = 0; col < BoardCells.Cols; col++)
                            if (_run.CanPlace(slot.Id, rot, row, col)) moves.Add((slot.Id, rot, row, col));
            }
            if (moves.Count > 0)
            {
                var m = moves[Random.Range(0, moves.Count)];
                result = _run.Place(m.id, m.rot, m.row, m.col);
                what = $"落子 #{m.id} rot {m.rot} 落在 ({m.row},{m.col})";
            }
            else discard = true;
        }
        if (discard)
        {
            var ids = new List<int>();
            foreach (TraySlot slot in tray)
                if (!slot.IsEmpty) ids.Add(slot.Id);
            if (ids.Count == 0 || _run.Blind.DiscardsLeft == 0)
            {
                Log.Info("[BattleDebug] 没有可弃的块或弃置次数用完");
                return null;
            }
            int id = ids[Random.Range(0, ids.Count)];
            result = _run.Discard(id);
            what = $"弃置 #{id}";
        }
        if (!result.Accepted)
        {
            Log.Error($"[BattleDebug] {what} 被拒:{result.Reject}");
            return null;
        }
        RunSaveService.Instance.CommitStep(_run, result);
        return RefreshAndVerify($"第 {result.Step} 步 {what}");
    }

    /// <summary>托盘里的块各随机转一个朝向(不算步),刷新并核对。</summary>
    public string DebugRotate()
    {
        if (_run?.Blind == null || _run.Blind.Outcome != BlindOutcome.InProgress) return null;
        var sb = new StringBuilder("转朝向");
        foreach (TraySlot slot in _run.Blind.Tray)
        {
            if (slot.IsEmpty) continue;
            int rot = Random.Range(0, BlockShapeMap.RotCount);
            _run.SetRotation(slot.Id, rot);
            sb.Append($" #{slot.Id}→{rot}");
        }
        RunSaveService.Instance.MarkRotated(_run);
        return RefreshAndVerify(sb.ToString());
    }

    private string RefreshAndVerify(string what)
    {
        Refresh(_run);
        IBlindView b = _run.Blind;
        string line = $"[BattleDebug] {what} · 累计 {b.Score}/{b.Spec.Target} · 库剩 {b.Draw.Count} · 弃置剩 {b.DiscardsLeft} · {b.Outcome}"
            + (b.FailReason != FailReason.None ? $"({b.FailReason})" : string.Empty);
        string diff = DebugVerify();
        if (diff == null) Log.Info(line + " · 画面与规则核心逐项一致");
        else Log.Error(line + " · 不一致:" + diff);
        return diff == null ? line + " · OK" : line + " · DIFF " + diff;
    }

    /// <summary>
    /// 画面与规则核心逐项比:盘面逐格(有没有块、颜色、位置)、托盘每槽(块 id、朝向、格子拼出的形状、颜色、置灰、点数)、
    /// 累计分与进度、方块库剩余、弃置余数与两态、类型表 11 行;再跑一次规则核心自己的 <see cref="RunState.Validate"/>。
    /// 全部一致返回 null,否则返回前几条不一致。
    /// </summary>
    public string DebugVerify()
    {
        var problems = new List<string>();
        void Check(bool ok, string message)
        {
            if (!ok && problems.Count < 8) problems.Add(message);
        }
        IRunView run = _run;
        IBlindView b = run.Blind;
        TextTable table = TextTable.Instance;

        string invalid = _run.Validate();
        Check(invalid == null, "规则核心 Validate: " + invalid);

        // 盘面:有块(或死格)的格恰好有一个方块,样子按所属块的种类与强化,位置是格心
        Check(Mathf.Approximately(m_part_BoardArea.CellSize(), BlockLayout.CellSize), $"格距 {m_part_BoardArea.CellSize()} ≠ 布局表的 {BlockLayout.CellSize}");
        for (int cell = 0; cell < BoardCells.Count; cell++)
        {
            int r = BoardCells.RowOf(cell), c = BoardCells.ColOf(cell);
            int owner = b.Board.OwnerAt(cell);
            bool dead = b.Board.IsDead(cell);
            BlockPart part = m_part_BoardArea.PartAt(r, c);
            bool drawn = part != null && part.gameObject.activeSelf;
            Check(drawn == (owner != 0 || dead), $"格 ({r},{c}):规则核心 {(dead ? "死格" : owner == 0 ? "空" : "块 #" + owner)},画面{(drawn ? "有" : "没有")}方块");
            if (!drawn || owner == 0) continue;
            Check(Same(part.Skin, BlockLayout.SkinOf(run.FindInstance(owner))), $"格 ({r},{c}) 的样子不是块 #{owner} 的");
            Check(Vector2.Distance(part.rectTransform.anchoredPosition, m_part_BoardArea.CellLocalPos(c, r)) < 0.01f, $"格 ({r},{c}) 的方块不在格心");
        }

        // 托盘
        Check(m_part_TrayArea.SlotCount == b.Tray.Count, $"托盘画了 {m_part_TrayArea.SlotCount} 槽,规则核心 {b.Tray.Count} 槽");
        for (int i = 0; i < b.Tray.Count && i < m_part_TrayArea.SlotCount; i++)
        {
            TraySlot ts = b.Tray[i];
            TrayAreaPart.SlotView v = m_part_TrayArea.GetSlot(i);
            Check(Mathf.Abs(v.Slot.rectTransform.anchoredPosition.x - TrayAreaPart.SlotCenterX(i, b.Tray.Count)) < 0.01f, $"槽 {i} 的位置不对");
            Check(v.InstanceId == ts.Id && v.Rot == ts.Rot, $"槽 {i}:画面是 #{v.InstanceId} rot {v.Rot},规则核心 #{ts.Id} rot {ts.Rot}");
            if (ts.IsEmpty)
            {
                Check(v.Cells.Count == 0 && v.Points == null, $"槽 {i} 是空槽,画面却有块");
                continue;
            }
            BlockInstance block = run.FindInstance(ts.Id);
            bool greyed = !run.CanPlaceAnyRotation(ts.Id);
            Check(v.Greyed == greyed, $"槽 {i}:置灰画成 {v.Greyed},规则核心「怎么转都放不下」= {greyed}");
            BlockSkin want = BlockLayout.SkinOf(block);
            if (greyed) want = want.Greyed();
            foreach (BlockPart cellPart in v.Cells) Check(Same(cellPart.Skin, want), $"槽 {i} 的格样子不对(置灰 {greyed})");
            Check(ShapeOf(v.Cells) == ShapeKey(BlockShapeMap.GetRotated(Tetromino.BaseShapeId(block.Kind), ts.Rot)),
                $"槽 {i}:格子拼出的形状不是 {block.Kind} rot {ts.Rot}");
            Check(v.Points != null && v.Points.Text == table.Format(TextKeys.Battle.Points, block.Points), $"槽 {i} 的点数不是 {block.Points}");
        }

        // 读数
        Check(m_tmp_Score.text == Num(b.Score), $"累计分画的是 {m_tmp_Score.text},规则核心 {b.Score}");
        Check(Mathf.Approximately(m_slider_Score.value, ProgressOf(b.Score, b.Spec.Target)), "进度条不对");
        Check(m_tmp_BlindTarget.text == Num(b.Spec.Target), "目标分不对");
        Check(m_tmp_LibraryLeft.text == Num(b.Draw.Count), $"方块库剩余画的是 {m_tmp_LibraryLeft.text},规则核心 {b.Draw.Count}");
        Check(m_part_Discard.CountText == Num(b.DiscardsLeft), $"弃置余数画的是 {m_part_Discard.CountText},规则核心 {b.DiscardsLeft}");
        Check(m_part_Discard.IsOff == (b.DiscardsLeft == 0), "弃置区两态不对");

        // 类型表:按判定优先级排,数取类型表本级
        Check(m_part_TypeTable.RowCount == ClearTypes.Count, $"类型表画了 {m_part_TypeTable.RowCount} 行");
        for (int i = 0; i < m_part_TypeTable.RowCount; i++)
        {
            ClearTypeRowPart row = m_part_TypeTable.GetRow(i);
            ClearType type = ClearRules.Priority[i];
            ClearTypeBase values = run.BaseOf(type);
            string[] got = row.Texts;
            Check(row.Type == type && got[0] == table.Get(TextKeys.Of(type)) && got[1] == table.Format(TextKeys.Battle.Level, run.LevelOf(type))
                && got[2] == Num(values.Chips) && got[3] == table.Format(TextKeys.Battle.Mult, values.Mult), $"类型表第 {i} 行不是 {type}");
        }
        return problems.Count == 0 ? null : string.Join(";", problems);
    }

    private static bool Same(BlockSkin? a, BlockSkin b) => a.HasValue && a.Value.Kind == b.Kind && Same(a.Value.Tint, b.Tint);

    private static bool Same(Color a, Color b) =>
        Mathf.Abs(a.r - b.r) < 0.002f && Mathf.Abs(a.g - b.g) < 0.002f && Mathf.Abs(a.b - b.b) < 0.002f && Mathf.Abs(a.a - b.a) < 0.002f;

    /// <summary>托盘格子的位置按槽内格距折回格坐标,拼成「宽x高:各行掩码」,和形状表比。</summary>
    private static string ShapeOf(List<BlockPart> cells)
    {
        if (cells.Count == 0) return string.Empty;
        float minX = float.MaxValue, maxY = float.MinValue;
        foreach (BlockPart p in cells)
        {
            minX = Mathf.Min(minX, p.rectTransform.anchoredPosition.x);
            maxY = Mathf.Max(maxY, p.rectTransform.anchoredPosition.y);
        }
        var points = new List<(int r, int c)>();
        int w = 0, h = 0;
        foreach (BlockPart p in cells)
        {
            int c = Mathf.RoundToInt((p.rectTransform.anchoredPosition.x - minX) / BlockLayout.SlotCell);
            int r = Mathf.RoundToInt((maxY - p.rectTransform.anchoredPosition.y) / BlockLayout.SlotCell);
            points.Add((r, c));
            w = Mathf.Max(w, c + 1);
            h = Mathf.Max(h, r + 1);
        }
        var rows = new int[h];
        foreach (var (r, c) in points) rows[r] |= 1 << (w - c - 1);
        return w + "x" + h + ":" + string.Join(",", rows);
    }

    private static string ShapeKey(BlockShape shape) => shape.Width + "x" + shape.Height + ":" + string.Join(",", shape.Shape);
}
#endif
