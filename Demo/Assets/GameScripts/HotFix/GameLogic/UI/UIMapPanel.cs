using System.Collections.Generic;
using System.Globalization;
using GameRules;
using TEngine;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 选关屏(局外循环设计稿 §2,规则 §8.3):6 段 × 3 层,可选的节点亮着,点一下进节点开打。
/// 节点按钮是运行时按布局摆的(窗里只留空容器 <c>m_rect_Map</c>);首领场标出这一场的负面效果。
/// 左栏是消除类型表(本级底注 × 倍率、本局打出过几次),右栏是背包栏(<see cref="RunInventoryView"/>)。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIMapPanel : UIPanelMono
{
    private static readonly Color NodeNormal = new Color(0.22f, 0.25f, 0.38f, 1f);
    private static readonly Color NodeLight = new Color(0.20f, 0.30f, 0.32f, 1f);
    private static readonly Color NodeHeavy = new Color(0.32f, 0.22f, 0.28f, 1f);
    private static readonly Color NodeBoss = new Color(0.42f, 0.16f, 0.20f, 1f);
    private static readonly Color NodeDisabled = new Color(0.14f, 0.15f, 0.20f, 1f);

    private RunState _run;

    private readonly List<GameObject> _buttons = new List<GameObject>();

    /// <summary>节点区左右各让出的宽度(m_rect_Map 坐标):左边是类型表,右边是背包栏。</summary>
    private const float LeftReserve = 260f;
    private const float RightReserve = 340f;

    private RectTransform _typeTable;
    private RunInventoryView _inventory;

    protected override void OnCreate()
    {
        _typeTable = RuntimeUI.Node("类型表", rectTransform, new Vector2(24f, -220f), new Vector2(320f, 520f), typeof(Image));
        _typeTable.GetComponent<Image>().color = RuntimeUI.PanelColor;
        _inventory = new RunInventoryView(RunInventoryView.CreateDock(rectTransform, 400f, 120f, 820f), m_text_Title.font, Rebuild);
        AddServiceEvent(
            () => TextTable.Instance.LanguageChanged += Rebuild,
            () => { if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= Rebuild; });
    }

    protected override void OnRefresh()
    {
        _run = UserData as RunState;
        if (_run == null)
        {
            Log.Error("[UIMapPanel] 打开时没有传入 RunState,回主界面");
            RunFlow.BackToMenu();
            return;
        }
        Rebuild();
    }

    protected override void OnDestroyWindow() => ClearButtons();

    /// <summary>整屏重画:标题、信息行、每个节点一个按钮。语言切换与每次打开都走这里。</summary>
    private void Rebuild()
    {
        if (_run == null) return;
        TextTable table = TextTable.Instance;
        m_text_Title.text = table.Get(TextKeys.Map.Title);
        m_text_Info.text = table.Format(TextKeys.Map.Info,
            _run.Progress.CurrentNodeId == 0 ? 1 : _run.Map.Get(_run.Progress.CurrentNodeId).Segment,
            _run.Map.SegmentCount,
            _run.Money.ToString(CultureInfo.InvariantCulture));
        SetBackLabel(table.Get(TextKeys.Map.Back));
        LayoutNodes(table);
        BuildTypeTable(table);
        if (_inventory.IsBoundTo(_run)) _inventory.Rebuild();
        else _inventory.Bind(_run);
    }

    /// <summary>11 种消除类型按判定优先级排:名字、等级、本级底注 × 倍率、本局打出过几次。</summary>
    private void BuildTypeTable(TextTable table)
    {
        RuntimeUI.Clear(_typeTable);
        float y = -8f;
        RuntimeUI.Label(_typeTable, m_text_Title.font, table.Get(TextKeys.Inventory.MapTypes), new Vector2(10f, y), new Vector2(300f, 36f), 24,
            TextAnchor.MiddleLeft, RuntimeUI.Gold);
        y -= 42f;
        foreach (ClearType type in ClearRules.Priority)
        {
            ClearTypeBase b = _run.BaseOf(type);
            string row = table.Format(TextKeys.Inventory.MapTypeRow, table.Get(TextKeys.Of(type)), _run.LevelOf(type), b.Chips, b.Mult,
                _run.TypeCounts[(int)type]);
            RuntimeUI.Label(_typeTable, m_text_Title.font, row, new Vector2(10f, y), new Vector2(300f, 38f), 19);
            y -= 40f;
        }
    }

    private void ClearButtons()
    {
        foreach (GameObject go in _buttons) Destroy(go);
        _buttons.Clear();
    }

    /// <summary>6 段从上到下排成 6 行,3 层从左到右排成 3 列;一格里有几个节点就并排几个。</summary>
    private void LayoutNodes(TextTable table)
    {
        ClearButtons();
        Rect rect = m_rect_Map.rect;
        float width = (rect.width > 0f ? rect.width : 1600f) - LeftReserve - RightReserve;
        float height = rect.height > 0f ? rect.height : 800f;
        int segments = _run.Map.SegmentCount;
        float rowHeight = height / segments;
        float cellWidth = width / RunMap.LayersPerSegment;
        float buttonHeight = Mathf.Min(rowHeight * 0.72f, 96f);

        IReadOnlyList<MapNode> choices = _run.Progress.Choices(_run.Map);
        var choiceIds = new HashSet<int>();
        foreach (MapNode node in choices) choiceIds.Add(node.Id);

        for (int segment = 1; segment <= segments; segment++)
        {
            for (int layer = 1; layer <= RunMap.LayersPerSegment; layer++)
            {
                IReadOnlyList<MapNode> nodes = _run.Map.NodesAt(segment, layer);
                float cellCenterX = LeftReserve + cellWidth * (layer - 0.5f);
                float centerY = -rowHeight * (segment - 0.5f) - 20f;
                float buttonWidth = Mathf.Min(cellWidth * 0.9f / nodes.Count, 280f);
                for (int i = 0; i < nodes.Count; i++)
                {
                    MapNode node = nodes[i];
                    float offset = (i - (nodes.Count - 1) * 0.5f) * buttonWidth;
                    CreateNode(table, node, choiceIds.Contains(node.Id),
                        new Vector2(cellCenterX + offset, centerY), new Vector2(buttonWidth * 0.92f, buttonHeight));
                }
            }
        }
    }

    private void CreateNode(TextTable table, MapNode node, bool enabled, Vector2 position, Vector2 size)
    {
        var go = new GameObject("Node_" + node.Id, typeof(RectTransform), typeof(Image), typeof(Button));
        go.layer = gameObject.layer;
        go.transform.SetParent(m_rect_Map, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = new Vector2(0f, 1f);
        rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = position;
        rt.sizeDelta = size;

        Image image = go.GetComponent<Image>();
        image.color = ColorOf(node, enabled);
        Button button = go.GetComponent<Button>();
        button.targetGraphic = image;
        button.interactable = enabled;
        if (enabled)
        {
            int nodeId = node.Id;
            button.onClick.AddListener(() => RunFlow.EnterNode(_run, nodeId));
        }

        var labelGo = new GameObject("文字", typeof(RectTransform), typeof(Text));
        labelGo.layer = gameObject.layer;
        labelGo.transform.SetParent(go.transform, false);
        var labelRt = labelGo.GetComponent<RectTransform>();
        labelRt.anchorMin = Vector2.zero;
        labelRt.anchorMax = Vector2.one;
        labelRt.offsetMin = Vector2.zero;
        labelRt.offsetMax = Vector2.zero;
        Text label = labelGo.GetComponent<Text>();
        label.font = m_text_Title.font;
        label.fontSize = 24;
        label.alignment = TextAnchor.MiddleCenter;
        label.color = enabled ? new Color(0.95f, 0.95f, 1f, 1f) : new Color(0.45f, 0.47f, 0.55f, 1f);
        label.horizontalOverflow = HorizontalWrapMode.Wrap;
        label.verticalOverflow = VerticalWrapMode.Truncate;
        label.text = LabelOf(table, node);
        _buttons.Add(go);
    }

    private string LabelOf(TextTable table, MapNode node)
    {
        if (node.IsBoss)
        {
            string label = table.Format(TextKeys.Map.NodeBoss, node.Segment, node.Layer);
            // 情报标签之前只看得见「首领」,拿到之后才显示这一场带什么负面效果
            return _run.BossIntel ? label + "\n" + Bosses.Name(node.BossId) : label;
        }
        string strength = table.Get(TextKeys.Of(node.Strength));
        string key = node.CanSkip ? TextKeys.Map.NodeSkip : TextKeys.Map.Node;
        return table.Format(key, node.Segment, node.Layer, strength);
    }

    private static Color ColorOf(MapNode node, bool enabled)
    {
        if (!enabled) return NodeDisabled;
        if (node.IsBoss) return NodeBoss;
        switch (node.Strength)
        {
            case NodeStrength.Light: return NodeLight;
            case NodeStrength.Heavy: return NodeHeavy;
            default: return NodeNormal;
        }
    }

    /// <summary>返回按钮的文字(窗里是旧版 Text,没有 LocalizedText)。</summary>
    private void SetBackLabel(string text)
    {
        m_btn_Back.GetComponentInChildren<Text>(true).text = text;
    }

    #region 事件

    private partial void OnClick_BackBtn() => RunFlow.BackToMenu();

    #endregion
}
