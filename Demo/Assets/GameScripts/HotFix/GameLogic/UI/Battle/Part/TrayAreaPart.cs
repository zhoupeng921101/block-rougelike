using System;
using System.Collections.Generic;
using DG.Tweening;
using GameRules;
using TEngine;
using UnityEngine;

// TEngine 也有个 Ease 枚举,同时 using 两个命名空间时裸写 Ease 报 CS0104。
using Ease = DG.Tweening.Ease;

/// <summary>
/// 待放置区 Part(挂在战斗窗的 m_part_TrayArea 节点上,由宿主序列化持有;节点按 5 槽留位,宽 830)。
/// 按局面画出 3–5 个槽(槽数 = 盲注的每组块数):块的格子(朝向取槽上存的 rot)、右下角的点数、置灰态、空槽。
/// 纯视图:数据由宿主推入(<see cref="Refresh"/>);拖拽与悬停由 <see cref="PieceGestureFlow"/> 接在这里暴露的槽上,托盘只经它重建。
/// </summary>
public sealed class TrayAreaPart : MonoBehaviour
{
    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    [Header("动态格模板")]
    [Tooltip("槽 prefab（AssetRaw/UI/Prefabs/Parts/TraySlot.prefab）")]
    [SerializeField] private GameObject _slotPrefab;
    [Tooltip("一格方块 prefab（AssetRaw/UI/Prefabs/Parts/BlockPart.prefab）")]
    [SerializeField] private GameObject _blockPrefab;
    [Tooltip("点数标签 prefab（AssetRaw/UI/Prefabs/Parts/ElementPart.prefab）")]
    [SerializeField] private GameObject _elementPrefab;

    [Header("点数标签")]
    [Tooltip("标签右下角离槽右下角的内缩(设计像素):x 向左、y 向上。")]
    [SerializeField] private Vector2 _pointsInset = new Vector2(10f, 6f);

    /// <summary>一个槽这次画成了什么。重建托盘时整份丢掉。</summary>
    public sealed class SlotView
    {
        public TraySlotPart Slot;
        public int InstanceId;
        public int Rot;
        public bool Greyed;
        public ElementPart Points;
        public readonly List<BlockPart> Cells = new List<BlockPart>(Tetromino.CellCount);
    }

    private readonly List<SlotView> _slots = new List<SlotView>(BlindSpec.MaxGroupSize);

    /// <summary>这次画了几个槽。</summary>
    public int SlotCount => _slots.Count;

    /// <summary>第 <paramref name="slot"/> 个槽这次画成了什么(越界返回 null)。拖拽流与调试核对读。</summary>
    public SlotView GetSlot(int slot) => slot >= 0 && slot < _slots.Count ? _slots[slot] : null;

    /// <summary>
    /// 按局面重建全部槽。置灰 = 这块转到任一朝向都没地方放(规则核心的 <see cref="IRunView.CanPlaceAnyRotation"/>,与「放不下」判负同一个查询)。
    /// </summary>
    public void Refresh(IRunView run)
    {
        _popIns.Clear();   // 在途的弹出随槽销毁(SetLink)
        foreach (SlotView v in _slots)
        {
            // 补间由各自 SetLink 随节点销毁而 Kill
            if (v.Slot != null) Destroy(v.Slot.gameObject);
        }
        _slots.Clear();

        IReadOnlyList<TraySlot> tray = run.Blind.Tray;
        for (int i = 0; i < tray.Count; i++) _slots.Add(BuildSlot(i, tray.Count, tray[i], run));
    }

    /// <summary>悬停态(13 号票):描边变亮、上浮。置灰的块也照样亮。</summary>
    public void SetHover(int slot, bool on)
    {
        var view = GetSlot(slot);
        if (view?.Slot != null) view.Slot.SetHover(on);
    }

    /// <summary>块在手上:槽画成空槽、藏起点数;块的视觉根由拖拽流挪走。重建托盘时整个槽一起丢掉,不必复原。</summary>
    public void SetHeld(int slot)
    {
        var view = GetSlot(slot);
        if (view?.Slot == null) return;
        view.Slot.SetHeld();
        if (view.Points != null) view.Points.gameObject.SetActive(false);
    }

    /// <summary>第 <paramref name="slot"/> 个槽在本层里的中心 x:各槽以本层中心为轴排开,槽距 = 槽宽 + 槽间。</summary>
    public static float SlotCenterX(int slot, int count) =>
        (slot - (count - 1) * 0.5f) * (BlockLayout.SlotWidth + BlockLayout.SlotGap);

    private SlotView BuildSlot(int index, int count, TraySlot traySlot, IRunView run)
    {
        var view = new SlotView { InstanceId = traySlot.Id, Rot = traySlot.Rot };
        var slot = UIPartFactory.Create<TraySlotPart>(_slotPrefab, rectTransform, nameof(TrayAreaPart));
        if (slot == null) return view;   // 失败原因已由 UIPartFactory 记录
        view.Slot = slot;
        var srt = slot.rectTransform;
        srt.anchorMin = srt.anchorMax = new Vector2(0.5f, 0.5f);
        srt.pivot = new Vector2(0.5f, 0.5f);
        srt.sizeDelta = new Vector2(BlockLayout.SlotWidth, BlockLayout.SlotHeight);
        srt.anchoredPosition = new Vector2(SlotCenterX(index, count), 0f);

        slot.SetEmpty(traySlot.IsEmpty);
        if (traySlot.IsEmpty) return view;

        BlockInstance block = run.FindInstance(traySlot.Id);
        if (block == null)
        {
            Log.Error($"[TrayAreaPart] 槽 {index} 的块 {traySlot.Id} 在局面里找不到,这一槽不画");
            return view;
        }
        view.Greyed = !run.CanPlaceAnyRotation(traySlot.Id);
        BlockSkin skin = BlockLayout.SkinOf(block);
        if (view.Greyed) skin = skin.Greyed();

        int baseId = Tetromino.BaseShapeId(block.Kind);
        BlockShape src = BlockShapeMap.Get(baseId);
        BlockShape rotated = BlockShapeMap.GetRotated(baseId, traySlot.Rot);
        var pieceRoot = slot.PieceRoot;
        pieceRoot.sizeDelta = new Vector2(rotated.Width * BlockLayout.SlotCell, rotated.Height * BlockLayout.SlotCell);
        BuildPieceCells(pieceRoot, src, rotated, traySlot.Rot, skin, view.Cells);

        var points = UIPartFactory.Create<ElementPart>(_elementPrefab, srt, nameof(TrayAreaPart));
        if (points != null)
        {
            var prt = points.rectTransform;
            prt.anchorMin = prt.anchorMax = prt.pivot = new Vector2(1f, 0f);
            prt.anchoredPosition = new Vector2(-_pointsInset.x, _pointsInset.y);
            points.SetPoints(block.Points, view.Greyed, BlockLayout.EditionMark(block.Edition));
            view.Points = points;
        }
        return view;
    }

    /// <summary>
    /// 按形状位图铺格。遍历沿 <paramref name="src"/>(原始朝向)走、只把落点转到 rot 档,与规则核心落子写盘同一口径:
    /// 块内格的序号按原始朝向编、不随旋转变,改成沿转过的形状遍历,序号的含义就变了(逐格触发要用这个序号)。
    /// </summary>
    private void BuildPieceCells(RectTransform pieceRoot, BlockShape src, BlockShape rotated, int rot, BlockSkin skin, List<BlockPart> sink)
    {
        float cell = BlockLayout.SlotCell;
        float visual = cell - BlockLayout.SlotCellGap;
        float offX = -(rotated.Width * cell) / 2f + cell / 2f;
        float offY = (rotated.Height * cell) / 2f - cell / 2f;
        for (int r = 0; r < src.Height; r++)
        {
            for (int c = 0; c < src.Width; c++)
            {
                if (((src.Shape[r] >> (src.Width - c - 1)) & 1) == 0) continue;
                BlockShapeMap.RotateCell(src.Width, src.Height, rot, r, c, out int rr, out int rc);
                var part = UIPartFactory.Create<BlockPart>(_blockPrefab, pieceRoot, nameof(TrayAreaPart));
                if (part == null) continue;   // 失败原因已由 UIPartFactory 记录
                var crt = part.rectTransform;
                crt.anchorMin = crt.anchorMax = new Vector2(0.5f, 0.5f);
                crt.pivot = new Vector2(0.5f, 0.5f);
                crt.sizeDelta = new Vector2(visual, visual);
                crt.anchoredPosition = new Vector2(offX + rc * cell, offY - rr * cell);
                part.SetSkin(skin);
                sink.Add(part);
            }
        }
    }

    // ── 新组弹出(21 号票第 5、7 节:不占锁,弹的过程中就能拿;一拿起就跳到终态)──

    private readonly List<Tween> _popIns = new List<Tween>(BlindSpec.MaxGroupSize);

    /// <summary>新组先藏着(各槽缩成 0),等结算演出到了弹出那一刻再 <see cref="PlayPopIn"/>。只在刚 <see cref="Refresh"/> 完、这一步发了新组时调。</summary>
    public void HideForPopIn()
    {
        foreach (SlotView v in _slots)
            if (v.Slot != null) v.Slot.transform.localScale = Vector3.zero;
    }

    /// <summary>各槽从 0 弹到原大(整槽一起缩放:命中区、块、点数跟着长出来)。补间挂在各槽上,托盘重建即随槽销毁。</summary>
    public void PlayPopIn(float duration)
    {
        FinishPopIn();
        foreach (SlotView v in _slots)
        {
            if (v.Slot == null) continue;
            Transform t = v.Slot.transform;
            t.localScale = Vector3.zero;
            _popIns.Add(t.DOScale(1f, duration).SetEase(Ease.OutBack).SetUpdate(true).SetLink(v.Slot.gameObject));
        }
    }

    /// <summary>在途的弹出直接跳到终态(拾起时调;托盘重建前也调,免得留下停在半途的缩放)。</summary>
    public void FinishPopIn()
    {
        foreach (Tween t in _popIns)
            if (t.IsActive()) t.Complete();
        _popIns.Clear();
    }

    // ── 旋转动画 ────────────────────────────────────────────────

    /// <summary>
    /// 播一档旋转:块的视觉根转 90°。播放中再调即叠加一档、从当前角继续转。
    /// <paramref name="onDone"/> 只在自然转到位时触发——调用方在那里重建托盘,故它不会在被打断时误触发。
    /// 槽为空或已被重建掉时直接回调,不让调用方悬着。
    /// </summary>
    public void PlayRotate(int slot, bool clockwise, Action onDone)
    {
        var view = GetSlot(slot);
        if (view?.Slot == null || view.InstanceId == 0) { onDone?.Invoke(); return; }
        var fx = view.Slot.PieceRoot.gameObject.GetOrAddComponent<RotateFx>();
        fx.PlayStep(null, onDone, clockwise);
    }

    /// <summary>
    /// 把该槽在途的旋转立刻推到目标角并停下,<b>不触发完成回调</b>。
    /// 用于转到一半被拾起:那一刻「原布局 + 转满一档」正是新朝向的外观;回调那侧的重建会销毁正在处理拖拽事件的节点。
    /// </summary>
    public void SnapRotate(int slot)
    {
        var view = GetSlot(slot);
        if (view?.Slot != null && view.Slot.PieceRoot.TryGetComponent<RotateFx>(out var fx)) fx.SnapToTarget();
    }
}
