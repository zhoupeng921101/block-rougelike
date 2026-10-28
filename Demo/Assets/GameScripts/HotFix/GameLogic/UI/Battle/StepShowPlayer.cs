using System;
using System.Collections.Generic;
using System.Globalization;
using DG.Tweening;
using GameRules;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Object = UnityEngine.Object;

/// <summary>
/// 一步的结算演出(30 号票,节奏照 21 号票):落子或弃置被规则核心接受后,先把整份事件排成 <see cref="ClearTimeline"/>,再照表把补间排进一条 DOTween 序列。
/// 序列挂在战斗窗上(<c>SetLink</c>),窗销毁即停。演出只读事件,不回读规则核心的盘面(那时已是这一步的终态,07 号票第 3 节);
/// 唯一的例外是被消格全部退场那一刻,按规则核心的终态把盘面同步一次,当作兜底(正常情况下什么都不改)。
///
/// 结算锁:松手即锁,到 <see cref="ClearTimeline.UnlockAt"/> 解锁,结局步不解锁。下一步开演之前,上一步没播完的尾巴先跳到终态(<see cref="Finish"/>)。
/// 演出中途离开(Esc、返回主界面)调 <see cref="Kill"/>:停掉一切、清掉临时节点,不再到位。
/// </summary>
public sealed class StepShowPlayer
{
    private readonly GameObject _link;
    private readonly RectTransform _root;
    private readonly BoardAreaPart _board;
    private readonly TrayAreaPart _tray;
    private readonly DiscardAreaPart _discard;
    private readonly ClearTypeTablePart _typeTable;
    private readonly PreviewBadgePart _badge;
    private readonly TMP_Text _score;
    private readonly Slider _scoreBar;
    private readonly TMP_Text _libraryLeft;
    private readonly GameObject _popPrefab;
    private readonly PieceGestureFlow _gesture;
    private readonly Action<BlindEnded, long> _showResult;

    private Sequence _seq;

    /// <summary>在回调里才建的补间(起点要等到那一刻才知道):跳到终态时和主序列一起到位。</summary>
    private readonly List<Tween> _loose = new List<Tween>();

    /// <summary>演出用的临时节点:计数框、跳字、飞分、弃置的块、退场中的格。跳到终态或离开时一并销毁。</summary>
    private readonly List<GameObject> _temps = new List<GameObject>();

    /// <summary>这一步演完时界面该停在哪:跳到终态时照它补齐读数。</summary>
    private StepEnded _final;

    private IRunView _run;

    public StepShowPlayer(GameObject link, RectTransform root, BoardAreaPart board, TrayAreaPart tray, DiscardAreaPart discard,
        ClearTypeTablePart typeTable, PreviewBadgePart badge, TMP_Text score, Slider scoreBar, TMP_Text libraryLeft,
        GameObject popPrefab, PieceGestureFlow gesture, Action<BlindEnded, long> showResult)
    {
        _link = link;
        _root = root;
        _board = board;
        _tray = tray;
        _discard = discard;
        _typeTable = typeTable;
        _badge = badge;
        _score = score;
        _scoreBar = scoreBar;
        _libraryLeft = libraryLeft;
        _popPrefab = popPrefab;
        _gesture = gesture;
        _showResult = showResult;
    }

    /// <summary>
    /// 演一步。<paramref name="release"/> 是松手那一刻手上那块的样子(弃置演出要它)。
    /// 进来时规则核心已是这一步的终态;手势流已收起预览、把块放回了槽里,托盘还没重建。
    /// </summary>
    public void Play(StepResult result, PieceGestureFlow.PieceRelease release, IRunView run)
    {
        Finish();
        _run = run;
        float speed = ClearPacing.Speed > 0f ? ClearPacing.Speed : 1f;
        float k = 1f / speed;
        ClearTimeline t = ClearTimeline.Build(result.Events, speed);

        PiecePlaced placed = null;
        ClearResolved clear = null;
        BaseApplied baseApplied = null;
        ScoreBooked booked = null;
        PieceDiscarded discarded = null;
        GroupDealt dealt = null;
        BlindEnded ended = null;
        foreach (RuleEvent e in result.Events)
        {
            switch (e)
            {
                case PiecePlaced p: placed = p; break;
                case ClearResolved c: clear = c; break;
                case BaseApplied b: baseApplied = b; break;
                case ScoreBooked s: booked = s; break;
                case PieceDiscarded d: discarded = d; break;
                case GroupDealt g: dealt = g; break;
                case BlindEnded b: ended = b; break;
                case StepEnded s: _final = s; break;
            }
        }

        _seq = DOTween.Sequence().SetUpdate(true).SetLink(_link);

        // 结算锁(21 号票第 5 节):松手即锁,被消格全部退场时解锁;不成线、弃置、发组不锁;结局步一直锁
        if (t.UnlockAt > 0f)
        {
            _gesture.Lock();
            if (!float.IsPositiveInfinity(t.UnlockAt)) _seq.InsertCallback(t.UnlockAt, _gesture.Unlock);
        }

        // 托盘按终态重建(落下或弃掉的那块不在了);发了新组就先藏着,到弹出那一刻再弹
        _gesture.RefreshTray();
        if (dealt != null)
        {
            _tray.HideForPopIn();
            int drawLeft = _final.DrawLeft;
            _seq.InsertCallback(t.GroupPopAt, () =>
            {
                _tray.PlayPopIn(ClearPacing.GroupPopIn * k);
                _libraryLeft.text = Num(drawLeft);
            });
        }

        if (discarded != null) PlayDiscard(discarded, release, k);
        if (placed != null) PlacePiece(placed, clear, t, k);
        if (clear != null && baseApplied != null && booked != null && placed != null) PlayClear(placed, clear, baseApplied, booked, t, k);

        if (ended != null)
        {
            long total = _final.Total;
            _seq.InsertCallback(t.ResultAt, () => _showResult(ended, total));
        }
        // 序列至少拉到演完:没有回调的步(不成线的落子)也要把放大播完
        _seq.InsertCallback(t.EndAt, () => { });
    }

    /// <summary>
    /// 跳到终态:没播完的补间直接到位、回调照常触发(解锁、新组弹出、读数),然后清掉临时节点、按 <see cref="StepEnded"/> 补齐读数。
    /// 下一步开演前、全量刷新前调;没有演出时什么都不做。
    /// </summary>
    public void Finish()
    {
        if (_seq == null) return;
        Sequence seq = _seq;
        _seq = null;
        if (seq.IsActive()) seq.Complete(true);
        seq.Kill();
        // 回调里建的补间可能又是在上面那次 Complete 里才建出来的,所以放在后面
        for (int i = 0; i < _loose.Count; i++)
            if (_loose[i].IsActive()) _loose[i].Complete(true);
        _loose.Clear();
        _tray.FinishPopIn();
        DestroyTemps();
        if (_final != null)
        {
            ShowTotal(_final.Total);
            _libraryLeft.text = Num(_final.DrawLeft);
        }
    }

    /// <summary>中途离开(Esc、返回主界面、窗销毁):停掉一切,不再到位;临时节点清掉。</summary>
    public void Kill()
    {
        _seq?.Kill();
        _seq = null;
        foreach (Tween tw in _loose) tw.Kill();
        _loose.Clear();
        DestroyTemps();
    }

    // ─── 落子 ────────────────────────────────────────────────────

    /// <summary>块出现在终位,各格放大(不占锁,21 号票第 7 节)。不成线时到这里就演完了。</summary>
    private void PlacePiece(PiecePlaced placed, ClearResolved clear, ClearTimeline t, float k)
    {
        // 预览池从头用起:下面按线号取光带(TryGetBand)要和这次 ShowClearPreview 的次序对上;
        // 手势流只在画过预览时才收,上一步留下的已淡出的光带还占着池位
        _board.ClearGhostAndPreview();
        List<BlockPart> parts = _board.ShowPlaced(placed.Cells, BlockLayout.ColorOf(placed.Kind));
        foreach (BlockPart part in parts) _seq.Insert(0f, part.PunchTween(ClearPacing.PlacePunch * k));
        if (clear == null) return;
        // 拖动时画的光带和填充松手不收(手势流松手时收掉了,这里同一帧画回来,看不出断),被消线上已有的块照旧上浮
        _board.ShowClearPreview(clear.Rows, clear.Cols);
    }

    // ─── 消除 ────────────────────────────────────────────────────

    private void PlayClear(PiecePlaced placed, ClearResolved clear, BaseApplied baseApplied, ScoreBooked booked, ClearTimeline t, float k)
    {
        TextTable text = TextTable.Instance;
        _typeTable.Highlight(clear.Type);

        // 计数框 = 落了位的预览徽章(21 号票第 6 节)。拷一份另画,手势流的徽章留给下一手的预览:解锁后两者会同时在场
        PreviewBadgePart box = Object.Instantiate(_badge.gameObject, _root, false).GetComponent<PreviewBadgePart>();
        _temps.Add(box.gameObject);
        foreach (Graphic g in box.GetComponentsInChildren<Graphic>(true)) g.raycastTarget = false;
        box.Show(clear.Type, baseApplied.Level, _run.BaseOf(clear.Type));
        box.transform.SetAsLastSibling();
        ClearTypeRowPart row = box.Row;
        row.SetHighlight(false);
        row.SetChipsMult(baseApplied.Chips, baseApplied.Mult);
        PlaceTallyBox(box, placed.Cells);

        // 逐格段:每拍弹「+k」、计数框底分跳一下,格在它自己的最后一拍退场
        foreach (ClearBeat beat in t.Beats)
        {
            int r = BoardCells.RowOf(beat.Cell), c = BoardCells.ColOf(beat.Cell);
            if (beat.Kind == ClearBeatKind.Cell) PopCellGain(r, c, beat.Points, beat.Time, k);
            long chips = beat.Chips, mult = beat.Mult;
            _seq.InsertCallback(beat.Time, () => row.SetChipsMult(chips, mult));
            _seq.Insert(beat.Time, Bump(row.ChipsText.transform, ClearPacing.TallyBump * k));
            if (!beat.Exits) continue;
            BlockPart part = _board.TakeForExit(r, c);
            if (part == null) continue;
            _temps.Add(part.gameObject);
            float exit = ClearPacing.CellExit * k;
            _seq.Insert(beat.Time, part.ExitTween(exit, BlockLayout.CellExitEndScale));
            // 刚落下的格可能在头几拍就退场,这时它的放大还没播完:等放大播完再销毁(退场后它已看不见),免得补间写到销毁了的节点上
            _seq.InsertCallback(Math.Max(beat.Time + exit, t.PunchEndAt), () => { if (part != null) Object.Destroy(part.gameObject); });
        }

        // 每条线的最后一格退场时,这条线的光带与填充跟着淡出
        for (int i = 0; i < t.Lines.Count; i++)
        {
            if (!_board.TryGetBand(i, out Image fill, out Image glow, out GlowPulse pulse)) continue;
            float at = t.Lines[i].FadeAt, dur = ClearPacing.CellExit * k;
            _seq.InsertCallback(at, () => pulse.enabled = false);   // 呼吸每帧改 alpha,先停
            _seq.Insert(at, fill.DOFade(0f, dur));
            _seq.Insert(at, glow.DOFade(0f, dur));
            _seq.InsertCallback(at + dur, () =>
            {
                fill.gameObject.SetActive(false);
                glow.gameObject.SetActive(false);
            });
        }

        // 被消格全部退场:盘面画面应当已等于规则核心的终态,按终态同步一次兜底
        IRunView run = _run;
        _seq.InsertCallback(t.CellsGoneAt, () => _board.Refresh(run));

        // 合成:「底分 × 倍率」并成「= 得分」
        long gain = booked.Gain;
        _seq.InsertCallback(t.MergeAt, () => row.ChipsText.text = text.Format(TextKeys.Battle.Gain, gain));
        _seq.Insert(t.MergeAt, row.MultText.DOFade(0f, ClearPacing.Merge * k));
        _seq.Insert(t.MergeAt, Bump(row.ChipsText.transform, ClearPacing.Merge * k));

        // 飞分:得分沿直线飞到累计分的数字上。起点是那一刻框里数字的位置,补间在回调里建
        TMP_Text fly = NewPop(_root, text.Format(TextKeys.Battle.CellGain, gain), BlockLayout.CellGainFontSizes[BlockLayout.CellGainFontSizes.Length - 1]);
        if (fly != null)
        {
            fly.gameObject.SetActive(false);
            _seq.InsertCallback(t.FlyAt, () =>
            {
                fly.transform.position = row.ChipsText.transform.position;
                fly.transform.SetAsLastSibling();
                fly.gameObject.SetActive(true);
                row.ChipsText.alpha = 0f;
                // 挂在飞分自己身上:落地那一刻主序列就销毁它,补间的最后一帧可能还没走
                _loose.Add(fly.transform.DOMove(_score.transform.position, ClearPacing.FlyToTotal * k).SetEase(Ease.InCubic).SetUpdate(true).SetLink(fly.gameObject));
            });
        }

        // 落地:框删掉,累计分从旧值滚到新值,进度条同步走
        long from = booked.Total - booked.Gain, to = booked.Total;
        float roll = ClearPacing.TotalRoll * k;
        _seq.InsertCallback(t.RollAt, () =>
        {
            if (fly != null) Object.Destroy(fly.gameObject);
            if (box != null) Object.Destroy(box.gameObject);
            // 类型表那一行亮到得分落地;已经被下一手的预览接管就不动它
            if (!_badge.IsShown) _typeTable.Highlight(null);
        });
        // 滚的是 0→1 的进度、数按它在整数之间插:分数是 long,不经 float 表示
        float p = 0f;
        _seq.Insert(t.RollAt, DOTween.To(() => p, v => { p = v; _score.text = Num(from + (long)Math.Round((to - from) * (double)v)); }, 1f, roll).SetEase(Ease.OutCubic));
        _seq.Insert(t.RollAt, _scoreBar.DOValue(ProgressOf(to), roll).SetEase(Ease.OutCubic));
        _seq.InsertCallback(t.RollAt + roll, () => ShowTotal(to));
    }

    /// <summary>计数框贴落下那块包围盒的上沿、水平居中,底边离块顶 <see cref="BlockLayout.BadgeGap"/>;块压着第 0 行时改贴下沿(21 号票第 6 节)。</summary>
    private void PlaceTallyBox(PreviewBadgePart box, IReadOnlyList<int> cells)
    {
        int minR = int.MaxValue, maxR = int.MinValue, minC = int.MaxValue, maxC = int.MinValue;
        foreach (int cell in cells)
        {
            int r = BoardCells.RowOf(cell), c = BoardCells.ColOf(cell);
            minR = Math.Min(minR, r);
            maxR = Math.Max(maxR, r);
            minC = Math.Min(minC, c);
            maxC = Math.Max(maxC, c);
        }
        Vector2 center = _board.WorldToCellSpace((_board.CellWorldPos(minC, minR) + _board.CellWorldPos(maxC, maxR)) / 2f);
        float half = (maxR - minR + 1) * _board.CellSize() / 2f;
        Vector2 bottom = minR == 0
            ? center - Vector2.up * (half + BlockLayout.BadgeGap + box.rectTransform.rect.height)
            : center + Vector2.up * (half + BlockLayout.BadgeGap);
        box.MoveTo(_board.CellSpaceToWorld(bottom));
    }

    /// <summary>一拍的「+k」:在格心弹出、停一会、淡出(叠着放,不占时间),字号按点数分四档。</summary>
    private void PopCellGain(int r, int c, int points, float at, float k)
    {
        int tier = Mathf.Clamp(points, 1, BlockLayout.CellGainFontSizes.Length) - 1;
        TMP_Text pop = NewPop(_board.PreviewLayer, TextTable.Instance.Format(TextKeys.Battle.CellGain, points), BlockLayout.CellGainFontSizes[tier]);
        if (pop == null) return;
        var rt = pop.rectTransform;
        rt.anchoredPosition = _board.CellLocalPos(c, r) + UnityEngine.Random.insideUnitCircle * BlockLayout.CellGainJitter;
        rt.localScale = Vector3.zero;
        float popIn = ClearPacing.CellPop * k, hold = ClearPacing.CellHold * k, fade = ClearPacing.CellExit * k;
        _seq.Insert(at, rt.DOScale(1f, popIn).SetEase(Ease.OutBack));
        _seq.Insert(at + popIn + hold, pop.DOFade(0f, fade));
        _seq.InsertCallback(at + popIn + hold + fade, () => { if (pop != null) Object.Destroy(pop.gameObject); });
    }

    // ─── 弃置 ────────────────────────────────────────────────────

    /// <summary>块(这时块心在弃置区里)缩进弃置区,剩余次数 n → n−1 弹一下(不占锁,21 号票第 7 节)。</summary>
    private void PlayDiscard(PieceDiscarded discarded, PieceGestureFlow.PieceRelease release, float k)
    {
        _discard.Refresh(discarded.DiscardsLeft);
        float dur = ClearPacing.DiscardShrink * k;
        _seq.Insert(0f, Bump(_discard.CountRect, dur));

        BlockInstance block = _run.FindInstance(discarded.InstanceId);
        if (block == null) return;
        var piece = new GameObject("弃置中的块", typeof(RectTransform), typeof(CanvasGroup));
        _temps.Add(piece);
        var prt = (RectTransform)piece.transform;
        prt.SetParent(_root, false);
        prt.SetAsLastSibling();
        prt.position = release.Center;
        var group = piece.GetComponent<CanvasGroup>();
        group.blocksRaycasts = false;

        BlockShape shape = BlockShapeMap.GetRotated(Tetromino.BaseShapeId(block.Kind), release.Rot);
        float cell = _board.CellSize();
        Color color = BlockLayout.ColorOf(block.Kind);
        for (int r = 0; r < shape.Height; r++)
        {
            for (int c = 0; c < shape.Width; c++)
            {
                if (((shape.Shape[r] >> (shape.Width - c - 1)) & 1) == 0) continue;
                BlockPart part = _board.CreateLooseCell(prt);
                if (part == null) continue;
                part.SetColor(color);
                part.rectTransform.anchoredPosition = new Vector2((c - (shape.Width - 1) / 2f) * cell, ((shape.Height - 1) / 2f - r) * cell);
            }
        }
        _seq.Insert(0f, prt.DOMove(_discard.CenterWorld, dur).SetEase(Ease.InCubic));
        _seq.Insert(0f, prt.DOScale(BlockLayout.DiscardShrinkEndScale, dur).SetEase(Ease.InCubic));
        _seq.Insert(0f, group.DOFade(0f, dur).SetEase(Ease.InCubic));
        _seq.InsertCallback(dur, () => { if (piece != null) Object.Destroy(piece); });
    }

    // ─── 小件 ────────────────────────────────────────────────────

    private TMP_Text NewPop(RectTransform parent, string content, float fontSize)
    {
        var pop = UIPartFactory.Create<TMP_Text>(_popPrefab, parent, nameof(StepShowPlayer));
        if (pop == null) return null;   // 失败原因已由 UIPartFactory 记录
        _temps.Add(pop.gameObject);
        var rt = pop.rectTransform;
        rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
        pop.text = content;
        pop.fontSize = fontSize;
        pop.raycastTarget = false;
        return pop;
    }

    /// <summary>
    /// 弹一下:从 <see cref="BlockLayout.TallyBumpScale"/> 缩回原大。一条补间、起止都是绝对值:逐拍间隔比它短,前后两条会叠着播,
    /// 相对的写法(DOPunchScale)叠了会停在半途;也不用两段的序列,64 格的大消除会把序列池撑过默认容量。
    /// </summary>
    private static Tween Bump(Transform target, float duration) =>
        target.DOScale(1f, duration).From(Vector3.one * BlockLayout.TallyBumpScale, false).SetEase(Ease.OutCubic);

    private void ShowTotal(long total)
    {
        _score.text = Num(total);
        _scoreBar.value = ProgressOf(total);
    }

    private float ProgressOf(long score)
    {
        long target = _run?.Blind?.Spec.Target ?? 0;
        return target > 0 ? Mathf.Clamp01((float)((double)score / target)) : 1f;
    }

    private void DestroyTemps()
    {
        foreach (GameObject go in _temps)
            if (go != null) Object.Destroy(go);
        _temps.Clear();
    }

    private static string Num(long n) => n.ToString(CultureInfo.InvariantCulture);
}
