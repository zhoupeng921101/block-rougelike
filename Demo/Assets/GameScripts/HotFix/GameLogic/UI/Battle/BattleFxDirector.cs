using System;
using System.Collections.Generic;
using DG.Tweening;
using GameRules;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Object = UnityEngine.Object;

/// <summary>
/// 战斗演出的特效层(32 号票,口径 31 号票第 2 节第 14–21 项、第 3 节):落子光点、逐格碎块、整线光束、震盘、评价字、清屏、飞分落点星环、开局。
/// 编排是正式的,素材是占位(<see cref="BattleFxAssets"/>)。时刻全部取自 <see cref="ClearTimeline"/>,由 <see cref="StepShowPlayer"/> 在排一步的时候调进来;
/// 本类只起播、不等待,特效与尾巴一样和下一手并行,不影响解锁。
///
/// 每一步的待播特效排在本类自己的一条序列里(<see cref="BeginStep"/>):下一步开演、全量刷新时这条序列直接作废(<see cref="SkipPending"/>),
/// 还没到点的不再补播,已经起播的照常播完。中途离开(<see cref="Kill"/>)连已起播的一起清掉,不留节点。
/// 特效节点挂在另建的三层:盘面区里 <c>FxLayer</c> 在方块格之上、预览层之下(光束、碎块、清屏、开局),<c>FxTopLayer</c> 在盘面区最上(评价字);
/// 窗根下 <c>FxRootLayer</c> 铺满整窗(星环,落点在盘外的累计分上)。
/// </summary>
public sealed class BattleFxDirector
{
    private const int N = BlockLayout.BoardSize;

    private readonly BattleFxAssets _assets;
    private readonly BoardAreaPart _board;
    private readonly RectTransform _root;
    private readonly GameObject _link;

    /// <summary>震盘震的是盘框(盘面区的父节点):格底、方块、预览、特效一起动。</summary>
    private readonly Transform _shakeTarget;

    private RectTransform _fxLayer;
    private RectTransform _topLayer;
    private RectTransform _rootLayer;

    /// <summary>这一步还没到点的特效。</summary>
    private Sequence _seq;

    /// <summary>开局点亮 / 扫描线的待播。</summary>
    private Tween _opening;

    private Tween _shake;
    private Vector3 _shakeRest;

    /// <summary>方块雨(首用时建,常驻特效层)。</summary>
    private AllClearRainFx _rain;

    /// <summary>清屏整盘特效与开局点亮的轮播游标。static:挂在实例上的话每局第一发恒是表里第一套。</summary>
    private static int _boardClearTurn;

    public BattleFxDirector(BattleFxAssets assets, BoardAreaPart board, RectTransform root, GameObject link)
    {
        _assets = assets;
        _board = board;
        _root = root;
        _link = link;
        _shakeTarget = board.transform.parent;
    }

    private static float Speed => ClearPacing.Speed > 0f ? ClearPacing.Speed : 1f;

    // ─── 一步 ────────────────────────────────────────────────────

    /// <summary>开演一步:上一步没到点的特效作废,开一条新的待播序列。由 <see cref="StepShowPlayer.Play"/> 在排这一步之前调。</summary>
    public void BeginStep()
    {
        SkipPending();
        _seq = DOTween.Sequence().SetUpdate(true).SetLink(_link);
    }

    /// <summary>上一步没到点的特效不再播(跳到终态、全量刷新时调);已经起播的照常播完。</summary>
    public void SkipPending()
    {
        _seq?.Kill();
        _seq = null;
    }

    /// <summary>落子:每个落下的格迸一发光点(31 号票第 14 项),t = 0。</summary>
    public void Place(IReadOnlyList<int> cells)
    {
        var pts = new List<Vector2>(cells.Count);
        foreach (int cell in cells) pts.Add(_board.CellLocalPos(BoardCells.ColOf(cell), BoardCells.RowOf(cell)));
        _seq.InsertCallback(0f, () =>
        {
            foreach (Vector2 p in pts) ClearBurstFx.Spawn(_assets.PlaceBurst, FxLayer, p, null);
        });
    }

    /// <summary>逐格:这一格在自己的退场拍迸碎块,染被消方块色(31 号票第 16 项)。</summary>
    public void CellBurst(float at, int row, int col, Color color)
    {
        Vector2 p = _board.CellLocalPos(col, row);
        _seq.InsertCallback(at, () => ClearBurstFx.Spawn(_assets.ClearBurst, FxLayer, p, color));
    }

    /// <summary>
    /// 一步消除的整线与加料:每条线的最后一格退场时播这条线的光束;Great 档起在最后一条光束起播时震盘;
    /// 合成那一刻在被消区域中心弹评价字(单线不出);清屏另加整盘特效、庆祝波与方块雨(31 号票第 16–19 项)。
    /// </summary>
    /// <param name="kind">这一步落下那块的种类:光束与评价字的颜色(31 号票第 4 节)。</param>
    /// <param name="placed">落下那块的格(row*8 + col),庆祝波以它为圆心。</param>
    public void Clear(ClearTimeline t, ClearResolved clear, TetrominoKind kind, IReadOnlyList<int> placed)
    {
        int tier = ClearFxTiers.TierOf(clear.Type);
        bool rainbow = ClearFxTiers.RainbowBeam(tier);
        Sprite beam = rainbow ? _assets.ClearBeamRainbow : _assets.ClearBeam;
        Color beamTint = BlockLayout.ColorOf(kind);

        float lastBeam = 0f;
        foreach (ClearLine line in t.Lines)
        {
            bool isRow = line.IsRow;
            int idx = line.Index;
            lastBeam = Math.Max(lastBeam, line.FadeAt);
            _seq.InsertCallback(line.FadeAt, () =>
            {
                Vector2 a = isRow ? _board.CellLocalPos(0, idx) : _board.CellLocalPos(idx, 0);
                Vector2 b = isRow ? _board.CellLocalPos(N - 1, idx) : _board.CellLocalPos(idx, N - 1);
                ClearBeamFx.Spawn(FxLayer, beam, (a + b) * 0.5f, N * _board.CellSize(), isRow ? 0f : 90f, beamTint, Speed);
            });
        }

        if (tier >= ClearFxTiers.Great) _seq.InsertCallback(lastBeam, () => Shake(tier));

        if (tier >= ClearFxTiers.Good)
        {
            TierWordFx.Tint tint = TierWordFx.TintOf(kind);
            _seq.InsertCallback(t.MergeAt, () => SpawnTierWord(tier, tint, clear.Rows, clear.Cols));
        }

        if (clear.Type == ClearType.AllClear) AllClear(t, placed);
    }

    /// <summary>飞分落到累计分的那一刻,在累计分的数字上放一发星环(31 号票第 21 项)。套在字面中心,不是文字节点的 pivot(累计分左对齐)。</summary>
    public void LandRing(float at, TMP_Text total)
    {
        _seq.InsertCallback(at, () =>
        {
            if (total == null) return;
            RectTransform layer = RootLayer;
            layer.SetAsLastSibling();   // 盖过这之后才建的计数框等临时节点
            Vector3 world = total.transform.TransformPoint(total.textBounds.center);
            Vector2 local = (Vector2)layer.InverseTransformPoint(world) - layer.rect.center;
            LandRingFx.Spawn(layer, _assets.LandRing, local, BlockLayout.LandRingWidth, Speed);
        });
    }

    // ─── 开局 ────────────────────────────────────────────────────

    /// <summary>
    /// 战斗窗打开后过 <see cref="ClearPacing.OpenFx"/> 起播:开盲注整盘逐格点亮(db_boardOpen),「继续」进来是一道自下而上的扫描线(db_FHQPD)。不锁托盘(31 号票第 20 项)。
    /// </summary>
    public void PlayOpening(bool resumed)
    {
        _opening?.Kill();
        _opening = DOVirtual.DelayedCall(ClearPacing.OpenFx / Speed, () =>
        {
            _opening = null;
            if (resumed) SpawnBoardSweep();
            else SpawnBoardOpen();
        }).SetUpdate(true).SetLink(_link);
    }

    private void SpawnBoardOpen()
    {
        BoardOpenFx.Play(FxLayer, _assets.BoardOpenGlow, N, _board.CellSize(), BoardCenter(), Speed);
    }

    /// <summary>扫描线自盘底外扫到盘顶外,越出盘面的两段裁掉;光带图 + 补间,不再用 DragonBones(见 <see cref="BoardSweepFx"/>)。</summary>
    private void SpawnBoardSweep()
    {
        BoardSweepFx.Spawn(FxLayer, _assets.BoardSweepBand, BoardCenter(), N * _board.CellSize(), Speed);
    }

    // ─── 加料 ────────────────────────────────────────────────────

    /// <summary>震盘,按档加强。上一次还没震完就先放回静止位置再震:DOShakePosition 收尾回到的是起播那一刻的位置,叠着震盘面会歪掉。</summary>
    private void Shake(int tier)
    {
        float dur = tier >= ClearFxTiers.Unbelievable ? ClearPacing.ShakeUnbelievable : tier >= ClearFxTiers.Excellent ? ClearPacing.ShakeExcellent : ClearPacing.ShakeGreat;
        float strength = tier >= ClearFxTiers.Unbelievable ? BlockLayout.ShakeUnbelievable : tier >= ClearFxTiers.Excellent ? BlockLayout.ShakeExcellent : BlockLayout.ShakeGreat;
        StopShake();
        _shakeRest = _shakeTarget.localPosition;
        _shake = _shakeTarget.DOShakePosition(dur / Speed, strength, BlockLayout.ShakeVibrato, 90f, false, true)
            .SetUpdate(true).SetLink(_link);
    }

    private void StopShake()
    {
        if (_shake == null) return;
        if (_shake.IsActive())
        {
            _shake.Kill();
            _shakeTarget.localPosition = _shakeRest;
        }
        _shake = null;
    }

    /// <summary>评价字站在被消区域(全部被消行列的外框)的中心,整词夹在盘内。</summary>
    private void SpawnTierWord(int tier, TierWordFx.Tint tint, IReadOnlyList<int> rows, IReadOnlyList<int> cols)
    {
        float cell = _board.CellSize();
        int minR = 0, maxR = N - 1, minC = 0, maxC = N - 1;
        if (rows.Count > 0 && cols.Count == 0) { minR = Min(rows); maxR = Max(rows); }
        if (cols.Count > 0 && rows.Count == 0) { minC = Min(cols); maxC = Max(cols); }
        Vector2 center = (_board.CellLocalPos(minC, minR) + _board.CellLocalPos(maxC, maxR)) * 0.5f;
        float half = N * cell * 0.5f;
        TierWordFx.Spawn(TopLayer, _assets, tier, tint, cell * BlockLayout.TierWordInkCells / TierWordFx.SourceInkHeight, size =>
        {
            Vector2 c = BoardCenter();
            float hx = Mathf.Max(0f, half - size.x * 0.5f), hy = Mathf.Max(0f, half - size.y * 0.5f);
            return new Vector2(Mathf.Clamp(center.x, c.x - hx, c.x + hx), Mathf.Clamp(center.y, c.y - hy, c.y + hy));
        }, Speed);
    }

    /// <summary>清屏:被消格全部退场时起庆祝波,紧跟方块雨,再起整盘特效(db_CC / db_FHQP 轮播)。</summary>
    private void AllClear(ClearTimeline t, IReadOnlyList<int> placed)
    {
        var origins = new List<(int r, int c)>(placed.Count);
        foreach (int cell in placed) origins.Add((BoardCells.RowOf(cell), BoardCells.ColOf(cell)));
        float k = 1f / Speed;

        _seq.InsertCallback(t.CellsGoneAt, () =>
        {
            // 隔格(32 发)只迸碎块、不带闪核:整盘 64 发带闪核时叠成一团白雾(动物乐园逐帧截图得出)
            for (int r = 0; r < N; r++)
            {
                for (int c = 0; c < N; c++)
                {
                    if (((r + c) & 1) != 0) continue;
                    int ring = int.MaxValue;
                    foreach (var o in origins) ring = Math.Min(ring, Math.Abs(r - o.r) + Math.Abs(c - o.c));
                    if (ring == int.MaxValue) ring = 0;
                    float hue = 0.8f * Mathf.Min(ring, 2 * (N - 1)) / (2 * (N - 1));
                    ClearBurstFx.Spawn(_assets.ClearBurst, FxLayer, _board.CellLocalPos(c, r), Color.HSVToRGB(hue, 0.9f, 1f),
                        ring * ClearPacing.AllClearWaveStep * k, flash: false);
                }
            }
        });

        _seq.InsertCallback(t.CellsGoneAt + ClearPacing.AllClearRain * k, () =>
        {
            if (_rain == null) _rain = AllClearRainFx.Create(FxLayer, _board.BlockPrefab, _assets.GlowSoft);
            if (_rain != null) _rain.Play(BoardCenter(), _board.CellSize(), 0f, Speed);
        });

        _seq.InsertCallback(t.CellsGoneAt + ClearPacing.AllClearBoardFx * k, () =>
        {
            bool a = (_boardClearTurn++ & 1) == 0;
            BoardClearFx.Play(FxLayer, _assets.BoardOpenGlow, N, _board.CellSize(), BoardCenter(), Speed, !a);
        });
    }

    // ─── 离开 ────────────────────────────────────────────────────

    /// <summary>中途离开(Esc、回主界面、窗销毁):待播的作废、震盘归位、已起播的特效节点全部销毁。</summary>
    public void Kill()
    {
        SkipPending();
        _opening?.Kill();
        _opening = null;
        StopShake();
        _rain = null;
        DestroyChildren(_fxLayer);
        DestroyChildren(_topLayer);
        DestroyChildren(_rootLayer);
    }

    private static void DestroyChildren(RectTransform layer)
    {
        if (layer == null) return;
        for (int i = layer.childCount - 1; i >= 0; i--) Object.Destroy(layer.GetChild(i).gameObject);
    }

    // ─── 层 ──────────────────────────────────────────────────────

    /// <summary>方块格之上、预览层之下:光束不盖住「+k」和计数框,碎块盖在格上。</summary>
    private RectTransform FxLayer => _fxLayer != null ? _fxLayer : _fxLayer = NewLayer(_board.rectTransform, "FxLayer", _board.PreviewLayer.GetSiblingIndex());

    /// <summary>盘面区最上层:评价字。</summary>
    private RectTransform TopLayer => _topLayer != null ? _topLayer : _topLayer = NewLayer(_board.rectTransform, "FxTopLayer", -1);

    /// <summary>窗根下铺满整窗的一层:落点不在盘面上的特效。</summary>
    private RectTransform RootLayer => _rootLayer != null ? _rootLayer : _rootLayer = NewLayer(_root, "FxRootLayer", -1);

    /// <summary><paramref name="parent"/> 下一个铺满、pivot 居中的空层(盘面区里即与方块格同一坐标系)。<paramref name="siblingIndex"/> 为 -1 时放最后。</summary>
    private static RectTransform NewLayer(RectTransform parent, string name, int siblingIndex)
    {
        var rt = new GameObject(name, typeof(RectTransform)).GetComponent<RectTransform>();
        rt.SetParent(parent, false);
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.one;
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.offsetMin = rt.offsetMax = Vector2.zero;
        if (siblingIndex >= 0) rt.SetSiblingIndex(siblingIndex);
        else rt.SetAsLastSibling();
        return rt;
    }

    private Vector2 BoardCenter() => (_board.CellLocalPos(0, 0) + _board.CellLocalPos(N - 1, N - 1)) * 0.5f;

    private static int Min(IReadOnlyList<int> xs)
    {
        int m = int.MaxValue;
        foreach (int x in xs) m = Math.Min(m, x);
        return m;
    }

    private static int Max(IReadOnlyList<int> xs)
    {
        int m = int.MinValue;
        foreach (int x in xs) m = Math.Max(m, x);
        return m;
    }
}
