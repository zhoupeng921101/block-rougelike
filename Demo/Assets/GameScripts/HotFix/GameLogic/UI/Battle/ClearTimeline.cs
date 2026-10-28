using System.Collections.Generic;
using GameRules;

/// <summary>演出时间表里的一拍是什么(21 号票第 3 节:拍数 = 逐格段里的 <see cref="CellScored"/>,阶段 5 的重触发、带格的效果各算一拍)。</summary>
public enum ClearBeatKind
{
    /// <summary>这一格要额外触发几遍(<see cref="RepetitionGranted"/>)。</summary>
    Repetition = 0,

    /// <summary>这一格计一次点数(<see cref="CellScored"/>):格心弹「+点数」,计数框底分跳到 <see cref="ClearBeat.Chips"/>。</summary>
    Cell = 1,

    /// <summary>这一格上的一条效果(<see cref="EffectApplied"/>,Cell ≥ 0)。本图不会出现。</summary>
    Effect = 2,
}

/// <summary>逐格段的一拍。时刻从松手那一刻算起(秒,已除以 <see cref="ClearPacing.Speed"/>)。</summary>
public readonly struct ClearBeat
{
    public readonly float Time;
    public readonly ClearBeatKind Kind;

    /// <summary>格 = row*8 + col。</summary>
    public readonly int Cell;

    /// <summary>这一拍属于 <see cref="ClearTimeline.Lines"/> 的第几条。</summary>
    public readonly int Line;

    /// <summary><see cref="ClearBeatKind.Cell"/> 拍:这一格的点数;其余为 0。</summary>
    public readonly int Points;

    /// <summary>这一拍之后计数框上的底分与倍率(取自事件,不回读规则核心)。</summary>
    public readonly long Chips;

    /// <summary>倍率千分值,1000 = 1。</summary>
    public readonly long MultPermille;

    /// <summary>这是这一格的最后一拍:格从这一拍起退场。</summary>
    public readonly bool Exits;

    public ClearBeat(float time, ClearBeatKind kind, int cell, int line, int points, long chips, long multPermille, bool exits)
    {
        Time = time;
        Kind = kind;
        Cell = cell;
        Line = line;
        Points = points;
        Chips = chips;
        MultPermille = multPermille;
        Exits = exits;
    }
}

/// <summary>一条被消的线。</summary>
public readonly struct ClearLine
{
    public readonly bool IsRow;
    public readonly int Index;

    /// <summary>这条线的最后一格开始退场的时刻:光带从这时起跟着淡出(21 号票第 2 节)。</summary>
    public readonly float FadeAt;

    public ClearLine(bool isRow, int index, float fadeAt)
    {
        IsRow = isRow;
        Index = index;
        FadeAt = fadeAt;
    }
}

/// <summary>
/// 一步的演出时间表(21 号票第 1、3、5、7、9 节)。表现层拿到这一步的整份事件,先排成这张表再播:每一拍在几秒、哪一刻解锁、哪一刻演完。
/// 纯函数,只读事件和 <see cref="ClearPacing"/>,不读规则核心的盘面、不碰 UnityEngine(dotnet 测试链接编译它,引了就编不过)。
///
/// 一步消除:t = 0 落子(放大 <see cref="ClearPacing.PlacePunch"/>,不占锁)→ <see cref="ClearPacing.ClearLead"/> 后第 1 拍 → 每拍隔 <see cref="ClearPacing.CellStep"/>,
/// 换线多停 <see cref="ClearPacing.LineGap"/>,逐格段超过 <see cref="ClearPacing.CellSegmentMax"/> 就把两者等比压缩到正好等于它 →
/// 最后一拍 + <see cref="ClearPacing.CellExit"/> 被消格全部退场、解锁、新组弹出 → 最后一拍 + TallyHold 合成 → + Merge 飞分 → + FlyToTotal 累计分滚动 → + TotalRoll 演完。
/// 不成线的落子、弃置、发组都不锁(解锁时刻 0);带 <see cref="BlindEnded"/> 的步永不解锁,演完再过 <see cref="ClearPacing.ResultDelay"/> 弹结果浮层。
/// 基因段(<see cref="EffectApplied"/> 的 Cell = -1)不排拍:按 21 号票会落在解锁之后,阶段 5 有了基因再重新裁。
/// </summary>
public sealed class ClearTimeline
{
    private const int N = 8;

    /// <summary>永不:结局步的解锁时刻、不结局步的结果浮层时刻。</summary>
    public const float Never = float.PositiveInfinity;

    /// <summary>这一步有消除。</summary>
    public bool HasClear { get; private set; }

    /// <summary>这一步是弃置(块缩进弃置区)。</summary>
    public bool IsDiscard { get; private set; }

    /// <summary>这一步落了块(各格放大到 <see cref="PunchEndAt"/>)。</summary>
    public bool IsPlace { get; private set; }

    /// <summary>逐格段的各拍,按时间先后(= 事件次序)。</summary>
    public IReadOnlyList<ClearBeat> Beats => _beats;

    /// <summary>被消的线:先行后列,行、列各自升序(= <see cref="ClearResolved"/> 的 Rows、Cols)。</summary>
    public IReadOnlyList<ClearLine> Lines => _lines;

    /// <summary>逐格段长度(第 1 拍到最后一拍,压缩后)。没有消除为 0。</summary>
    public float CellSegment { get; private set; }

    /// <summary>最后一个被消格退场完的时刻;没有消除为 0。新组在这一刻弹出。</summary>
    public float CellsGoneAt { get; private set; }

    /// <summary>托盘解锁的时刻;结局步为 <see cref="Never"/>。</summary>
    public float UnlockAt { get; private set; }

    /// <summary>落子放大播完的时刻;不是落子为 0。</summary>
    public float PunchEndAt { get; private set; }

    /// <summary>块缩进弃置区播完的时刻;不是弃置为 0。</summary>
    public float DiscardEndAt { get; private set; }

    /// <summary>「底分 × 倍率」开始并成得分;没有消除为 0。</summary>
    public float MergeAt { get; private set; }

    /// <summary>得分开始飞向累计分;没有消除为 0。</summary>
    public float FlyAt { get; private set; }

    /// <summary>得分落地、累计分开始滚动;没有消除为 0。</summary>
    public float RollAt { get; private set; }

    /// <summary>新组开始弹出;这一步没发组为 -1。</summary>
    public float GroupPopAt { get; private set; } = -1f;

    /// <summary>这一步的全部演出播完。</summary>
    public float EndAt { get; private set; }

    /// <summary>这一步定了结局(有 <see cref="BlindEnded"/>)。</summary>
    public bool Ends { get; private set; }

    /// <summary>结果浮层弹出的时刻:演完再过 <see cref="ClearPacing.ResultDelay"/>;不结局为 <see cref="Never"/>。</summary>
    public float ResultAt { get; private set; } = Never;

    private readonly List<ClearBeat> _beats = new List<ClearBeat>();
    private readonly List<ClearLine> _lines = new List<ClearLine>();

    private ClearTimeline()
    {
    }

    /// <summary>按当前的 <see cref="ClearPacing.Speed"/> 排。</summary>
    public static ClearTimeline Build(IReadOnlyList<RuleEvent> events) => Build(events, ClearPacing.Speed);

    /// <summary>所有时长除以 <paramref name="speed"/>(≤ 0 按 1)。</summary>
    public static ClearTimeline Build(IReadOnlyList<RuleEvent> events, float speed)
    {
        float k = speed > 0f ? 1f / speed : 1f;
        var t = new ClearTimeline();
        ClearResolved clear = null;
        BaseApplied baseApplied = null;
        var raw = new List<RuleEvent>();
        foreach (RuleEvent e in events)
        {
            switch (e)
            {
                case PiecePlaced _:
                    t.IsPlace = true;
                    break;
                case PieceDiscarded _:
                    t.IsDiscard = true;
                    break;
                case ClearResolved c:
                    clear = c;
                    break;
                case BaseApplied b:
                    baseApplied = b;
                    break;
                case RepetitionGranted _:
                case CellScored _:
                    raw.Add(e);
                    break;
                case EffectApplied fx when fx.Cell >= 0:
                    raw.Add(e);
                    break;
                case GroupDealt _:
                    t.GroupPopAt = 0f;
                    break;
                case BlindEnded _:
                    t.Ends = true;
                    break;
            }
        }

        if (t.IsPlace) t.PunchEndAt = ClearPacing.PlacePunch * k;
        if (t.IsDiscard) t.DiscardEndAt = ClearPacing.DiscardShrink * k;
        float end = System.Math.Max(t.PunchEndAt, t.DiscardEndAt);

        if (clear != null && raw.Count > 0)
        {
            t.HasClear = true;
            end = System.Math.Max(end, t.LayOutCells(clear, baseApplied, raw, k));
        }

        if (t.GroupPopAt >= 0f)
        {
            t.GroupPopAt = t.CellsGoneAt;
            end = System.Math.Max(end, t.GroupPopAt + ClearPacing.GroupPopIn * k);
        }
        t.EndAt = end;
        t.UnlockAt = t.Ends ? Never : t.CellsGoneAt;
        if (t.Ends) t.ResultAt = t.EndAt + ClearPacing.ResultDelay * k;
        return t;
    }

    /// <summary>排逐格段与它后面的合成、飞分、滚动,返回演完的时刻。</summary>
    private float LayOutCells(ClearResolved clear, BaseApplied baseApplied, List<RuleEvent> raw, float k)
    {
        var rowLine = new Dictionary<int, int>();
        var colLine = new Dictionary<int, int>();
        foreach (int r in clear.Rows) rowLine[r] = rowLine.Count;
        foreach (int c in clear.Cols) colLine[c] = rowLine.Count + colLine.Count;

        // 每拍属于哪条线:格所在的行被消就归行(交叉格归行,07 §1),否则归列
        var lineOf = new int[raw.Count];
        int lineChanges = 0;
        for (int i = 0; i < raw.Count; i++)
        {
            int cell = CellOf(raw[i]);
            lineOf[i] = rowLine.TryGetValue(cell / N, out int line) ? line : colLine.TryGetValue(cell % N, out line) ? line : -1;
            if (i > 0 && lineOf[i] != lineOf[i - 1]) lineChanges++;
        }

        float step = ClearPacing.CellStep, gap = ClearPacing.LineGap;
        float segment = (raw.Count - 1) * step + lineChanges * gap;
        if (segment > ClearPacing.CellSegmentMax)
        {
            float squeeze = ClearPacing.CellSegmentMax / segment;
            step *= squeeze;
            gap *= squeeze;
            segment = ClearPacing.CellSegmentMax;
        }

        // 每格的最后一拍是它退场的那一拍
        var lastBeatOf = new Dictionary<int, int>();
        for (int i = 0; i < raw.Count; i++) lastBeatOf[CellOf(raw[i])] = i;

        var exitAt = new Dictionary<int, float>();
        float time = ClearPacing.ClearLead;
        // 逐格段从本级底注 × 基础倍率起跳;本图倍率在逐格段里不变,有效果拍时跟着它带的累计值走
        long chips = baseApplied?.Chips ?? 0, mult = baseApplied?.MultPermille ?? 0;
        for (int i = 0; i < raw.Count; i++)
        {
            if (i > 0) time += step + (lineOf[i] != lineOf[i - 1] ? gap : 0f);
            int cell = CellOf(raw[i]);
            int points = 0;
            ClearBeatKind kind;
            switch (raw[i])
            {
                case CellScored s:
                    kind = ClearBeatKind.Cell;
                    points = s.Points;
                    chips = s.Chips;
                    break;
                case EffectApplied fx:
                    kind = ClearBeatKind.Effect;
                    chips = fx.Chips;
                    mult = fx.MultPermille;
                    break;
                default:
                    kind = ClearBeatKind.Repetition;
                    break;
            }
            bool exits = lastBeatOf[cell] == i;
            if (exits) exitAt[cell] = time * k;
            _beats.Add(new ClearBeat(time * k, kind, cell, lineOf[i], points, chips, mult, exits));
        }

        foreach (int r in clear.Rows) _lines.Add(new ClearLine(true, r, LineFadeAt(exitAt, true, r)));
        foreach (int c in clear.Cols) _lines.Add(new ClearLine(false, c, LineFadeAt(exitAt, false, c)));

        float last = time;
        CellSegment = segment * k;
        CellsGoneAt = (last + ClearPacing.CellExit) * k;
        MergeAt = (last + ClearPacing.TallyHold) * k;
        FlyAt = MergeAt + ClearPacing.Merge * k;
        RollAt = FlyAt + ClearPacing.FlyToTotal * k;
        return System.Math.Max(CellsGoneAt, RollAt + ClearPacing.TotalRoll * k);
    }

    /// <summary>线上 8 格里最晚开始退场的那一刻(列上的交叉格早在行里退过了)。</summary>
    private static float LineFadeAt(Dictionary<int, float> exitAt, bool isRow, int index)
    {
        float latest = 0f;
        for (int i = 0; i < N; i++)
        {
            int cell = isRow ? index * N + i : i * N + index;
            if (exitAt.TryGetValue(cell, out float at) && at > latest) latest = at;
        }
        return latest;
    }

    private static int CellOf(RuleEvent e)
    {
        switch (e)
        {
            case CellScored s: return s.Cell;
            case RepetitionGranted r: return r.Cell;
            case EffectApplied fx: return fx.Cell;
            default: return -1;
        }
    }
}
