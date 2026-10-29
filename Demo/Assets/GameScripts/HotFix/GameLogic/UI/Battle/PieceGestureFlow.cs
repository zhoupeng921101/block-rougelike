using System;
using System.Collections.Generic;
using GameRules;
using TEngine;
using UnityEngine;
using Object = UnityEngine.Object;

/// <summary>
/// 战斗里的落子手势(12 号票):左键从托盘拖起块,盘上松手落子、弃置区里松手弃置、别处松手弹回;旋转随时可转;悬停、虚影、消除预览、弃置区高亮。
/// 由战斗窗持有、每帧经 <see cref="Update"/> 驱动;托盘只经 <see cref="RefreshTray"/> 重建(重建会换掉槽上的拖拽器,也要先把手上的块收回来)。
///
/// 骨架是 block-client <c>BoardGestureFlow</c> 的几段(02 号票 §3.3):拾起 / 拖动 / 抬手、转向、虚影与消除预览、收预览、落点解析;
/// 3B 补的是按键过滤(在 <see cref="BlockPieceDragger"/>)、键位表(<see cref="PieceKeymap"/>)、悬停、拖拽中旋转、弃置区落点、预览徽章与类型表高亮、
/// 结算锁、Esc 与失焦取消。改状态只经规则核心的命令(<see cref="RunState.Place"/> / <see cref="RunState.Discard"/> / <see cref="RunState.SetRotation"/>);
/// 命令被接受后交给宿主(<c>stepAccepted</c>),宿主在那里存档、开演这一步(<see cref="StepShowPlayer"/>);转朝向成功后告诉宿主(<c>rotated</c>),宿主置存档脏标记。
/// </summary>
public sealed class PieceGestureFlow
{
    /// <summary>松手那一刻手上那块的样子:块心(世界坐标)与朝向。弃置演出从这里把块缩进弃置区;弃置之后槽上的朝向就没了,事件里也不带。</summary>
    public readonly struct PieceRelease
    {
        public readonly Vector3 Center;
        public readonly int Rot;

        public PieceRelease(Vector3 center, int rot)
        {
            Center = center;
            Rot = rot;
        }
    }

    private const int N = BlockLayout.BoardSize;

    private readonly BoardAreaPart _board;
    private readonly TrayAreaPart _tray;
    private readonly DiscardAreaPart _discard;
    private readonly ClearTypeTablePart _typeTable;
    private readonly PreviewBadgePart _badge;
    private readonly RectTransform _dragLayer;
    private readonly Action<StepResult, PieceRelease> _stepAccepted;
    private readonly Action _rotated;

    private RunState _run;
    private Canvas _rootCanvas;

    /// <summary>根画布的事件相机。懒取:建本类时窗可能还没挂到 UIRoot 下。</summary>
    private Camera EventCamera
    {
        get
        {
            if (_rootCanvas == null) _rootCanvas = _dragLayer.GetComponentInParent<Canvas>().rootCanvas;
            return UICanvasSpace.RenderCameraOf(_rootCanvas);
        }
    }

    /// <summary>各槽的拖拽器,下标 = 槽号;空槽为 null。随托盘重建整份换掉。</summary>
    private readonly List<BlockPieceDragger> _draggers = new List<BlockPieceDragger>(BlindSpec.MaxGroupSize);

    // ── 拖拽态:_dragSlot ≥ 0 即块在手上 ──
    private int _dragSlot = -1;
    private int _dragId;
    private RectTransform _dragPiece;
    private BlockSkin _dragSkin;

    /// <summary>左键按在哪个槽上、还没抬起(含没越过起拖阈值的那一段);-1 = 没按。</summary>
    private int _pressSlot = -1;

    // 虚影与预览的缓存键:同一 (col, row, rot) 不重算不重画。拖拽中转了朝向,rot 一变就重算(指针没动也一样)。
    private static readonly (int col, int row, int rot) NothingShown = (int.MinValue, int.MinValue, -1);
    private (int col, int row, int rot) _shown = NothingShown;
    private bool _overDiscard;

    /// <summary>指针停在哪个有块的槽上(悬停事件记录);-1 = 不在任何一块上。它也是没在拖时的旋转对象。</summary>
    private int _hoverSlot = -1;

    /// <summary>画了悬停态的槽;-1 = 没画。</summary>
    private int _hoverShown = -1;

    private float _wheelCarry;
    private bool _locked;

    /// <summary>托盘画面落后于规则核心(转到位时块在手上或左键按着,推迟了重建)。手放开后在 <see cref="Update"/> 里补。</summary>
    private bool _trayStale;

    public PieceGestureFlow(BoardAreaPart board, TrayAreaPart tray, DiscardAreaPart discard, ClearTypeTablePart typeTable,
        PreviewBadgePart badge, RectTransform dragLayer, Action<StepResult, PieceRelease> stepAccepted, Action rotated)
    {
        _board = board;
        _tray = tray;
        _discard = discard;
        _typeTable = typeTable;
        _badge = badge;
        _dragLayer = dragLayer;
        _stepAccepted = stepAccepted;
        _rotated = rotated;
        _badge.Hide();
    }

    /// <summary>块在手上。</summary>
    public bool IsDragging => _dragSlot >= 0;

    /// <summary>结算锁锁着(<see cref="Lock"/>)。</summary>
    public bool IsLocked => _locked;

    /// <summary>现在能拾起和旋转:没上锁、盲注还在进行。结局已定时规则核心本来也拒,这里不让块离槽。</summary>
    private bool CanAct => !_locked && _run?.Blind != null && _run.Blind.Outcome == BlindOutcome.InProgress;

    public void Bind(RunState run) => _run = run;

    // ─── 结算锁(21 号票第 5 节:松手落子起锁,最后一个被消格退场时解锁;结局步不解锁)────

    /// <summary>
    /// 上锁:托盘不接受拾起和旋转。Esc 与「返回主界面」不受影响。本类自己不调,结算演出(<see cref="StepShowPlayer"/>)在松手后调。
    /// 万一锁的时候块还在手上,按取消处理。
    /// </summary>
    public void Lock()
    {
        _locked = true;
        if (IsDragging || _pressSlot >= 0) Cancel();
    }

    public void Unlock() => _locked = false;

    // ─── 托盘重建 ────────────────────────────────────────────────

    /// <summary>
    /// 按规则核心的状态重建托盘,给各槽挂上拖拽器。块在手上时先收回来:重建会销毁槽,块的视觉根要随槽一起走,不能留在拖拽层上。
    /// 悬停对象按指针位置重新认一次:被销毁的旧槽收不到移出事件。
    /// </summary>
    public void RefreshTray()
    {
        AbortGesture();
        _trayStale = false;
        _tray.Refresh(_run);
        _draggers.Clear();
        for (int i = 0; i < _tray.SlotCount; i++)
        {
            TrayAreaPart.SlotView v = _tray.GetSlot(i);
            BlockPieceDragger d = null;
            if (v.Slot != null && v.InstanceId != 0)
            {
                d = v.Slot.gameObject.GetOrAddComponent<BlockPieceDragger>();
                d.SlotIndex = i;
                d.Target = v.Slot.PieceRoot;
                d.OnPress = OnPress;
                d.OnBegin = OnBegin;
                d.OnDragMove = OnDragMove;
                d.OnEnd = OnEnd;
                d.OnHover = OnHover;
            }
            _draggers.Add(d);
        }
        _hoverShown = -1;
        _hoverSlot = SlotUnderPointer();
        ApplyHover();
    }

    private int SlotUnderPointer()
    {
        for (int i = 0; i < _draggers.Count; i++)
        {
            if (_draggers[i] != null
                && RectTransformUtility.RectangleContainsScreenPoint((RectTransform)_draggers[i].transform, Input.mousePosition, EventCamera))
                return i;
        }
        return -1;
    }

    // ─── 每帧 ────────────────────────────────────────────────────

    /// <summary>失焦与丢了抬起事件的取消、旋转输入、悬停态。战斗窗每帧调。Esc 由窗先判(拖拽中取消、否则回主界面)。</summary>
    public void Update()
    {
        if (_run == null) return;

        // 失焦、或左键已经松开又没收到抬起事件:按取消处理(12 号票)。松开的那一帧抬起事件可能还没派发,不算丢
        if ((IsDragging || _pressSlot >= 0)
            && (!Application.isFocused || (!Input.GetMouseButton(0) && !Input.GetMouseButtonUp(0))))
            Cancel();

        int steps = PieceKeymap.ReadRotation(ref _wheelCarry);
        if (steps != 0 && CanAct)
        {
            if (IsDragging) RotateHeld(steps);
            else if (_hoverSlot >= 0) RotateSlot(_hoverSlot, steps);
        }
        if (_trayStale && !IsDragging && _pressSlot < 0) RefreshTray();
        ApplyHover();
    }

    /// <summary>
    /// 取消这一手:块弹回托盘,不落子。Esc、失焦、丢了抬起事件、上锁时调。拖拽中转过的朝向已经生效(不算步),弹回后按新朝向画。
    /// </summary>
    public void Cancel()
    {
        bool wasDragging = IsDragging;
        AbortGesture();
        if (wasDragging)
        {
            BattleAudio.Return();
            RefreshTray();
        }
    }

    // ─── 拾起、拖动、抬手 ─────────────────────────────────────────

    private void OnPress(int slot) => _pressSlot = slot;

    private bool OnBegin(int slot)
    {
        TrayAreaPart.SlotView v = _tray.GetSlot(slot);
        if (!CanAct || IsDragging || v?.Slot == null || v.InstanceId == 0) return false;

        // 转到一半被拾起:角度立刻推到目标,块以新朝向的外观跟手。不能走重建——重建会销毁正在处理这次拖拽事件的节点
        _tray.SnapRotate(slot);
        // 新组弹到一半被拾起:弹出直接跳到终态(21 号票第 5 节)
        _tray.FinishPopIn();
        _hoverSlot = -1;
        ApplyHover();

        _dragSlot = slot;
        _dragId = v.InstanceId;
        BattleAudio.Pickup();
        _dragSkin = BlockLayout.SkinOf(_run.FindInstance(_dragId));
        _dragPiece = v.Slot.PieceRoot;
        _tray.SetHeld(slot);

        // 挪到窗根最上层:托盘在弃置区之前绘制,留在槽里的话块拖到弃置区上会被区盖住
        _dragPiece.SetParent(_dragLayer, true);
        _dragPiece.SetAsLastSibling();
        // 拾起时放大到和盘格一样大
        float scale = _board.CellSize() * _board.rectTransform.lossyScale.x / (BlockLayout.SlotCell * _dragLayer.lossyScale.x);
        _dragPiece.localScale = new Vector3(scale, scale, 1f);

        _shown = NothingShown;
        _overDiscard = false;
        return true;
    }

    private void OnDragMove(int slot)
    {
        if (slot == _dragSlot) UpdatePreview();
    }

    private void OnEnd(int slot, bool isTap)
    {
        if (slot == _pressSlot) _pressSlot = -1;

        // 原地点一下 = 转朝向,不落子。块从没离开过槽
        if (isTap)
        {
            if (CanAct && !IsDragging) RotateSlot(slot, PieceKeymap.TapSteps);
            return;
        }
        if (slot != _dragSlot) return;

        int id = _dragId;
        int rot = SlotRot(slot);
        BlockShape shape = ShapeOf(id, rot);
        // 与虚影同一个方法解析落点(含吸附),否则会落在与虚影不同的格上
        var (col, row) = ResolveDrop(_dragPiece.position, shape, id, rot);
        bool overDiscard = _overDiscard;
        var release = new PieceRelease(_dragPiece.position, rot);
        AbortGesture();

        StepResult result = null;
        if (overDiscard)
        {
            if (_run.Blind.DiscardsLeft > 0) result = _run.Discard(id);
        }
        else if (_run.CanPlace(id, rot, row, col))
        {
            result = _run.Place(id, rot, row, col);
        }

        if (result != null && result.Accepted)
        {
            _stepAccepted(result, release);
            return;
        }
        if (result != null) Log.Warning($"[PieceGestureFlow] 块 #{id} 的命令被规则核心拒绝:{result.Reject},弹回");
        // 弹回:放不下、拖到盘外或托盘上、弃置次数用完。不提示,也不算任何操作(12 号票)
        RefreshTray();
    }

    /// <summary>收掉这一手的全部临时画面与状态:预览、徽章、类型表高亮、弃置区高亮;块的视觉根放回槽里(重建时随槽销毁)。不重建托盘。</summary>
    private void AbortGesture()
    {
        if (_pressSlot >= 0 && _pressSlot < _draggers.Count && _draggers[_pressSlot] != null) _draggers[_pressSlot].Cancel();
        _pressSlot = -1;
        if (!IsDragging) return;

        ClearPreview();
        if (_overDiscard) _discard.SetHover(false);
        _overDiscard = false;
        TrayAreaPart.SlotView v = _tray.GetSlot(_dragSlot);
        if (v?.Slot != null) _dragPiece.SetParent(v.Slot.transform, false);
        else Object.Destroy(_dragPiece.gameObject);
        _dragSlot = -1;
        _dragId = 0;
        _dragPiece = null;
    }

    // ─── 虚影、消除预览、弃置区 ───────────────────────────────────

    /// <summary>
    /// 按手上那块的当前位置与朝向刷新:块心在弃置区内就亮弃置区、盘上什么都不画;否则解析落点,放得下就画虚影,
    /// 成线再画行列光带、挂徽章、亮类型表那一行(12、13 号票)。判线用规则核心的 <see cref="RunState.ResolveClear"/>,数取类型表本级。
    /// </summary>
    private void UpdatePreview()
    {
        Vector3 center = _dragPiece.position;
        Camera cam = EventCamera;
        bool overDiscard = _discard.Contains(RectTransformUtility.WorldToScreenPoint(cam, center), cam);
        if (overDiscard != _overDiscard)
        {
            _overDiscard = overDiscard;
            _discard.SetHover(overDiscard);
        }
        if (overDiscard)
        {
            ClearPreview();
            return;
        }

        int rot = SlotRot(_dragSlot);
        BlockShape shape = ShapeOf(_dragId, rot);
        var (col, row) = ResolveDrop(center, shape, _dragId, rot);
        if ((col, row, rot) != _shown)
        {
            ClearPreview();
            _shown = (col, row, rot);
            ClearResolution clear = _run.ResolveClear(_dragId, rot, row, col);
            if (clear.Legal)
            {
                _board.ShowGhost(shape, col, row, _dragSkin);
                if (clear.HasClear)
                {
                    _board.ShowClearPreview(clear.Rows, clear.Cols);
                    ClearType type = clear.Type.Value;
                    _badge.Show(type, _run.LevelOf(type), _run.BaseOf(type));
                    _typeTable.Highlight(type);
                }
            }
        }
        // 徽章贴手上那块的上沿、逐次拖动都挪,而不是停在虚影上:虚影随吸附逐格跳,手上的块才是视线所在
        if (_badge.IsShown)
        {
            Vector2 top = _board.WorldToCellSpace(center) + Vector2.up * (shape.Height * _board.CellSize() / 2f + BlockLayout.BadgeGap);
            _badge.MoveTo(_board.CellSpaceToWorld(top));
        }
    }

    private void ClearPreview()
    {
        if (_shown == NothingShown) return;
        _shown = NothingShown;
        _board.ClearGhostAndPreview();
        _badge.Hide();
        _typeTable.Highlight(null);
    }

    /// <summary>
    /// 落点解析 = 几何反算 + 吸附。虚影和真落子必须共用这一个方法,否则会出现「虚影画在这格、落子落在那格」。
    /// <paramref name="center"/> 是手上那块的中心(世界坐标),对应块阵中心。返回包围盒左上角的格;越界值原样返回,由落子判定拒。
    /// </summary>
    private (int col, int row) ResolveDrop(Vector3 center, BlockShape shape, int id, int rot)
    {
        var (col, row) = TopLeftCellOf(_board.WorldToCellSpace(center), _board.CellSize(), shape.Width, shape.Height);
        return SnapToPlaceable(col, row, shape, id, rot);
    }

    /// <summary>
    /// 格坐标系里的块阵中心 → 包围盒左上角的格(纯几何,不含吸附)。块阵 W×H,左上格中心 = 块阵中心 − ((W−1)/2, −(H−1)/2) × 格距;
    /// 格 (0,0) 中心 = (−盘宽/2 + 格距/2, 盘高/2 − 格距/2)。格坐标系 Y 向上,块阵向下展开。
    /// </summary>
    private static (int col, int row) TopLeftCellOf(Vector2 cellSpace, float cell, int width, int height)
    {
        if (cell <= 0f) return (-1, -1);
        float grid = cell * N;
        float tlX = cellSpace.x - (width - 1) * cell / 2f;
        float tlY = cellSpace.y + (height - 1) * cell / 2f;
        int col = Mathf.RoundToInt((tlX - (-grid / 2f + cell / 2f)) / cell);
        int row = Mathf.RoundToInt(((grid / 2f - cell / 2f) - tlY) / cell);
        return (col, row);
    }

    /// <summary>
    /// 落点吸附(block-client 原样):精确格放得下就用它,否则在 <see cref="BlockLayout.SnapRadius"/> 格内找最近的可放格,
    /// 同距取先遍历到的;向上吸附时不吸进最底 <see cref="BlockLayout.SnapNoUpBottomRows"/> 行(托盘在盘下方)。都放不下时返回精确格。
    /// 能不能放用规则核心的落子判定(含死格)。
    /// </summary>
    private (int col, int row) SnapToPlaceable(int col, int row, BlockShape shape, int id, int rot)
    {
        if (_run.CanPlace(id, rot, row, col)) return (col, row);

        int noUpFromRow = N - BlockLayout.SnapNoUpBottomRows;
        int bestCol = col, bestRow = row, bestDist = int.MaxValue;
        for (int dr = -BlockLayout.SnapRadius; dr <= BlockLayout.SnapRadius; dr++)
        {
            // 按吸附后的底边判:整排向上的候选一并跳过
            if (dr < 0 && row + dr + shape.Height - 1 >= noUpFromRow) continue;
            for (int dc = -BlockLayout.SnapRadius; dc <= BlockLayout.SnapRadius; dc++)
            {
                if (dr == 0 && dc == 0) continue;
                int dist = dr * dr + dc * dc;
                if (dist >= bestDist) continue;
                if (!_run.CanPlace(id, rot, row + dr, col + dc)) continue;
                bestDist = dist;
                bestCol = col + dc;
                bestRow = row + dr;
            }
        }
        return (bestCol, bestRow);
    }

    // ─── 旋转 ────────────────────────────────────────────────────

    /// <summary>
    /// 转托盘上没在拖的那块:逻辑朝向立即生效,动画只补视觉,转到位再重建托盘(重建把角度归零、按新朝向重摆格子,正是动画末帧的样子)。
    /// 转到位时块在手上或左键按着就先不重建:重建会销毁正在处理拖拽事件的槽,作废这一手。转到位的画面本来就是新朝向的样子,手放开再补。
    /// </summary>
    private void RotateSlot(int slot, int steps)
    {
        TrayAreaPart.SlotView v = _tray.GetSlot(slot);
        if (v == null || v.InstanceId == 0) return;
        if (!_run.SetRotation(v.InstanceId, BlockShapeMap.NormalizeRot(SlotRot(slot) + steps))) return;
        _rotated();
        BattleAudio.Rotate();
        bool clockwise = steps > 0;
        for (int i = 0; i < Math.Abs(steps); i++)
        {
            _tray.PlayRotate(slot, clockwise, () =>
            {
                if (IsDragging || _pressSlot >= 0) _trayStale = true;
                else RefreshTray();
            });
        }
    }

    /// <summary>
    /// 转手上那块:逻辑朝向立即生效,视觉上直接转手上那个容器(绕块心),并立即重算虚影和预览——指针没动也要重算。拖拽期间不重建托盘。
    /// </summary>
    private void RotateHeld(int steps)
    {
        if (!_run.SetRotation(_dragId, BlockShapeMap.NormalizeRot(SlotRot(_dragSlot) + steps))) return;
        _rotated();
        BattleAudio.Rotate();
        var fx = _dragPiece.gameObject.GetOrAddComponent<RotateFx>();
        bool clockwise = steps > 0;
        for (int i = 0; i < Math.Abs(steps); i++) fx.PlayStep(null, null, clockwise);
        UpdatePreview();
    }

    private int SlotRot(int slot) => _run.Blind.Tray[slot].Rot;

    private BlockShape ShapeOf(int id, int rot) => BlockShapeMap.GetRotated(Tetromino.BaseShapeId(_run.FindInstance(id).Kind), rot);

    // ─── 悬停 ────────────────────────────────────────────────────

    private void OnHover(int slot, bool entering)
    {
        if (entering) _hoverSlot = slot;
        else if (_hoverSlot == slot) _hoverSlot = -1;
    }

    /// <summary>悬停态只在能拿的时候画:块在手上、上了锁、盲注结束时都不画。</summary>
    private void ApplyHover()
    {
        int want = CanAct && !IsDragging ? _hoverSlot : -1;
        if (want == _hoverShown) return;
        if (_hoverShown >= 0) _tray.SetHover(_hoverShown, false);
        _hoverShown = want;
        if (want >= 0) _tray.SetHover(want, true);
    }
}
