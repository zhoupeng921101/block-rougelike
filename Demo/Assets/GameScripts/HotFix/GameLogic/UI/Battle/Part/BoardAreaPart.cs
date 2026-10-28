using System.Collections.Generic;
using GameRules;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 盘面区 Part(挂在战斗窗的 m_part_BoardArea 节点上,由宿主序列化持有;节点尺寸就是 8×8 盘面)。
///
/// 本类是宿主看到的门面:持序列化的格层、格底网格与模板,按职责把调用转给三个协作类——
/// <see cref="BoardGeometry"/>(格几何单一事实源)、<see cref="BoardCellRenderer"/>(盘上的方块格)、<see cref="BoardPreviewLayer"/>(虚影与消除预览池)。
/// 协作类是普通 C# 类、不是 MonoBehaviour:序列化字段全部留在本类上。
///
/// 纯视图:画面全从规则核心的只读状态画(<see cref="Refresh"/>),几何经公开接口供拖拽流反算落点。
/// </summary>
public sealed class BoardAreaPart : MonoBehaviour
{
    [SerializeField] private RectTransform m_rect_CellLayer = null!;
    [SerializeField] private RectTransform m_rect_PreviewLayer = null!;

    /// <summary>格底方格那一层的网格布局。格距与原点由 <see cref="BoardGeometry.SyncCellBgLayout"/> 对齐到格几何。</summary>
    [SerializeField] private GridLayoutGroup m_grid_CellBg = null!;

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    [Header("动态格模板")]
    [Tooltip("一格方块 prefab（AssetRaw/UI/Prefabs/Parts/BlockPart.prefab）")]
    [SerializeField] private GameObject _blockPrefab;
    [Tooltip("消除预览的行内填充 prefab（AssetRaw/UI/Prefabs/Parts/ClearFill.prefab）")]
    [SerializeField] private GameObject _clearFillPrefab;
    [Tooltip("消除预览的呼吸光带 prefab（AssetRaw/UI/Prefabs/Parts/ClearGlow.prefab）")]
    [SerializeField] private GameObject _clearGlowPrefab;

    [Header("预览材质模板(代码克隆后改参数;占位,见 Effects/ZooPlaceholder/占位登记表.md)")]
    [Tooltip("光带的描边辉光（Effects/ZooPlaceholder/Shaders/UI_GlowCell.mat）")]
    [SerializeField] private Material _glowCellMat;
    [Tooltip("被消块的提亮（Effects/ZooPlaceholder/Shaders/UI_Brighten.mat）")]
    [SerializeField] private Material _brightenMat;

    private BoardGeometry _geo;
    private BoardCellRenderer _cells;
    private BoardPreviewLayer _preview;

    /// <summary>
    /// 建起三个协作类。放 Awake 而非懒建:序列化字段此刻已就位,而宿主取到本 Part 时 Awake 必已跑完
    /// (Unity 在 Instantiate 期间调它),故各公开入口无须各自判「建了没」。
    /// </summary>
    private void Awake()
    {
        _geo = new BoardGeometry(rectTransform, m_grid_CellBg);
        _cells = new BoardCellRenderer(_geo, m_rect_CellLayer, _blockPrefab, _brightenMat);
        _preview = new BoardPreviewLayer(_geo, m_rect_PreviewLayer, _blockPrefab, _clearFillPrefab, _clearGlowPrefab, _glowCellMat);
    }

    private void OnDestroy()
    {
        _cells.DestroyMaterials();
        _preview.DestroyMaterials();
    }

    /// <summary>按局面全量重画盘面。</summary>
    public void Refresh(IRunView run) => _cells.Refresh(run.Blind.Board, run.FindInstance);

    // ─── 盘面几何(正本 = BoardGeometry)──────────────────────────

    /// <inheritdoc cref="BoardGeometry.CellSize"/>
    public float CellSize() => _geo.CellSize();

    /// <inheritdoc cref="BoardGeometry.CellLocalPos"/>
    public Vector2 CellLocalPos(int col, int row) => _geo.CellLocalPos(col, row);

    /// <inheritdoc cref="BoardGeometry.WorldToCellSpace"/>
    public Vector2 WorldToCellSpace(Vector3 world) => _geo.WorldToCellSpace(world);

    /// <inheritdoc cref="BoardGeometry.CellSpaceToWorld"/>
    public Vector3 CellSpaceToWorld(Vector2 cellSpace) => _geo.CellSpaceToWorld(cellSpace);

    /// <inheritdoc cref="BoardGeometry.CellWorldPos"/>
    public Vector3 CellWorldPos(int col, int row) => _geo.CellWorldPos(col, row);

    /// <inheritdoc cref="BoardGeometry.ScreenToCell"/>
    public (int col, int row) ScreenToCell(Vector2 screen) => _geo.ScreenToCell(screen);

    // ─── 格渲染(正本 = BoardCellRenderer)───────────────────────

    /// <inheritdoc cref="BoardCellRenderer.PunchCell"/>
    public void PunchCell(int row, int col) => _cells.PunchCell(row, col);

    /// <inheritdoc cref="BoardCellRenderer.DeferExit"/>
    public void DeferExit(int r, int c, float delay) => _cells.DeferExit(r, c, delay);

    /// <inheritdoc cref="BoardCellRenderer.PlayEntrance"/>
    public void PlayBoardEntrance() => _cells.PlayEntrance();

    /// <inheritdoc cref="BoardCellRenderer.PartAt"/>
    public BlockPart PartAt(int row, int col) => _cells.PartAt(row, col);

    /// <inheritdoc cref="BoardCellRenderer.ShowPlaced"/>
    public List<BlockPart> ShowPlaced(IReadOnlyList<int> cells, Color color) => _cells.ShowPlaced(cells, color);

    /// <inheritdoc cref="BoardCellRenderer.TakeForExit"/>
    public BlockPart TakeForExit(int row, int col) => _cells.TakeForExit(row, col);

    /// <summary>
    /// 在 <paramref name="parent"/> 下建一格不进格表的方块(尺寸同盘上的格),弃置演出拿它拼出手上那块。
    /// </summary>
    public BlockPart CreateLooseCell(RectTransform parent)
    {
        var part = UIPartFactory.Create<BlockPart>(_blockPrefab, parent, nameof(BoardAreaPart));
        if (part == null) return null;
        var rt = part.rectTransform;
        rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
        rt.localScale = Vector3.one;
        float visual = _geo.BoardCellVisual();
        rt.sizeDelta = new Vector2(visual, visual);
        foreach (var g in part.GetComponentsInChildren<Graphic>(true)) g.raycastTarget = false;
        return part;
    }

    /// <summary>预览层:在盘面格之上、与盘面同坐标系。结算演出的「+k」跳字挂在这里;特效层插在它下面(<see cref="BattleFxDirector"/>)。</summary>
    public RectTransform PreviewLayer => m_rect_PreviewLayer;

    /// <summary>一格方块的模板。清屏方块雨拿它当雨滴(<see cref="AllClearRainFx"/>)。</summary>
    public GameObject BlockPrefab => _blockPrefab;

    // ─── 虚影与消除预览(正本 = BoardPreviewLayer)───────────────

    /// <inheritdoc cref="BoardPreviewLayer.InitPools"/>
    public void InitPools() => _preview.InitPools();

    /// <inheritdoc cref="BoardPreviewLayer.ShowGhost"/>
    public void ShowGhost(BlockShape shape, int col, int row, Color color) => _preview.ShowGhost(shape, col, row, color);

    /// <summary>消除预览:填充与光带(<see cref="BoardPreviewLayer.ShowClearPreview"/>),外加行列里已有的块上浮(<see cref="BoardCellRenderer.HighlightLines"/>)。</summary>
    public void ShowClearPreview(IReadOnlyList<int> rows, IReadOnlyList<int> cols)
    {
        _preview.ShowClearPreview(rows, cols);
        _cells.HighlightLines(rows, cols);
    }

    /// <inheritdoc cref="BoardPreviewLayer.TryGetBand"/>
    public bool TryGetBand(int line, out Image fill, out Image glow, out GlowPulse pulse) => _preview.TryGetBand(line, out fill, out glow, out pulse);

    /// <summary>收起虚影与消除预览,并复原上浮的块。</summary>
    public void ClearGhostAndPreview()
    {
        _preview.ClearGhostAndPreview();
        _cells.ClearHighlight();
    }
}
