using System.Collections.Generic;
using System.Globalization;
using GameRules;
using TEngine;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.U2D;

/// <summary>
/// 选关屏(局外循环设计稿 §2,规则 §8.3):6 段 × 3 层,每段一行;每个节点画成那颗要打的目标星球,
/// 可打的亮着、打过的打勾、打不了的暗下去。点星球进节点开打,能跳的节点下方给「跳过」。
/// 左栏消除类型表、右栏背包摘要走 <see cref="RunChromeView"/>;顶栏是持有 / 段与难度 / 方块库。
/// 节点全部运行时按 <c>m_rect_Map</c> 的尺寸现摆,窗里只留空容器。
/// </summary>
[Window(UILayer.UI, fullScreen: true)]
public partial class UIMapPanel : UIPanelMono
{
    /// <summary>一行的行高按段数均分;星球画在行内的这个位置(0–1),下面留标签。</summary>
    private const float RowNodeAnchor = 0.40f;

    /// <summary>普通节点与首领节点的大小(设计像素)。</summary>
    private const float NodeSize = 60f;
    private const float BossSize = 76f;

    /// <summary>状态环比星球大一圈。</summary>
    private const float RingPadding = 12f;

    /// <summary>星球下面的标签占的高度。</summary>
    private const float LabelHeight = 30f;

    private static readonly Color32 TextMain = new Color32(0xe8, 0xee, 0xf2, 0xFF);
    private static readonly Color32 TextMuted = new Color32(0x8f, 0xa3, 0xb0, 0xFF);
    private static readonly Color32 TextDim = new Color32(0x5c, 0x6f, 0x7a, 0xFF);
    private static readonly Color32 GoldColor = new Color32(0xff, 0xc8, 0x3d, 0xFF);
    private static readonly Color32 BossColor = new Color32(0xff, 0x8f, 0x9e, 0xFF);

    /// <summary>八种星球底子,按节点 id 稳定地取一个(同一个节点每屏长得一样)。</summary>
    private static readonly string[] Planets =
    {
        "run_planet_rock", "run_planet_rust", "run_planet_lava", "run_planet_crimson",
        "run_planet_ice", "run_planet_amethyst", "run_planet_jade", "run_planet_shattered",
    };

    [Tooltip("局外三屏共用件的图集(Atlas_Run):星球、状态环、打勾都按名从这里取。")]
    [SerializeField] private SpriteAtlas _runAtlas = null!;

    private RunState _run;

    private readonly List<GameObject> _nodes = new List<GameObject>();

    protected override void OnCreate() => AddServiceEvent(
        () => TextTable.Instance.LanguageChanged += Rebuild,
        () => { if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= Rebuild; });

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

    protected override void OnDestroyWindow() => ClearNodes();

    private void Rebuild()
    {
        if (_run == null) return;
        TextTable table = TextTable.Instance;
        int segment = _run.Progress.CurrentNodeId == 0 ? 1 : _run.Map.Get(_run.Progress.CurrentNodeId).Segment;
        m_tmp_Money.text = table.Format(TextKeys.Common.Money, _run.Money.ToString(CultureInfo.InvariantCulture));
        m_tmp_HeaderTitle.text = table.Get(TextKeys.Map.Title);
        m_tmp_HeaderInfo.text = table.Format(TextKeys.Map.HeaderInfo, segment, _run.Map.SegmentCount, table.Get(TextKeys.Of(_run.Difficulty)));
        m_tmp_LibraryCount.text = _run.Library.Count.ToString(CultureInfo.InvariantCulture);
        m_tmp_BackLabel.text = table.Get(TextKeys.Map.Back);

        RunChromeView.BuildTypeTable(m_rect_TypeTable, MainFont, _run);
        RunChromeView.BuildInventory(m_rect_Inventory, MainFont, _run);
        BuildNodes(table);
    }

    /// <summary>每段一行,行内按层分三块(小盲 / 大盲 / 首领),同一层的几个节点在这一块里均分。</summary>
    private void BuildNodes(TextTable table)
    {
        ClearNodes();
        Rect rect = m_rect_Map.rect;
        float width = rect.width > 0f ? rect.width : 936f;
        float height = rect.height > 0f ? rect.height : 866f;
        int segments = _run.Map.SegmentCount;
        const float headerReserve = 46f;
        float rowHeight = (height - headerReserve) / segments;
        float layerWidth = width / RunMap.LayersPerSegment;

        var choices = new HashSet<int>();
        foreach (MapNode node in _run.Progress.Choices(_run.Map)) choices.Add(node.Id);
        var visited = new HashSet<int>();
        foreach (int id in _run.Progress.Visited) visited.Add(id);

        // 表头:小盲 / 大盲 / 首领,对着三层的列
        string[] headers = { TextKeys.Map.LayerLight, TextKeys.Map.LayerHeavy, TextKeys.Map.LayerBoss };
        for (int layer = 1; layer <= RunMap.LayersPerSegment && layer <= headers.Length; layer++)
        {
            float x = layerWidth * (layer - 0.5f);
            var header = new GameObject("表头", typeof(RectTransform), typeof(TextMeshProUGUI));
            header.layer = gameObject.layer;
            header.transform.SetParent(m_rect_Map, false);
            var hrt = header.GetComponent<RectTransform>();
            hrt.anchorMin = hrt.anchorMax = new Vector2(0f, 1f);
            hrt.pivot = new Vector2(0.5f, 0.5f);
            hrt.anchoredPosition = new Vector2(x, -18f);
            hrt.sizeDelta = new Vector2(layerWidth - 20f, 32f);
            var tmp = header.GetComponent<TextMeshProUGUI>();
            tmp.font = MainFont;
            tmp.text = table.Get(headers[layer - 1]);
            tmp.fontSize = 20f;
            tmp.color = TextMuted;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.raycastTarget = false;
            _nodes.Add(header);
        }

        for (int segment = 1; segment <= segments; segment++)
        {
            float rowCenter = -(headerReserve + rowHeight * (segment - 0.5f));
            RuntimeUI.TmpLabel(m_rect_Map, MainFont, segment.ToString(CultureInfo.InvariantCulture),
                new Vector2(10f, rowCenter - 18f), new Vector2(40f, 36f), 28f, TextAlignmentOptions.Center, TextMuted);
            if (segment < segments)
            {
                var line = new GameObject("分隔线", typeof(RectTransform), typeof(Image));
                line.layer = gameObject.layer;
                line.transform.SetParent(m_rect_Map, false);
                var lrt = line.GetComponent<RectTransform>();
                lrt.anchorMin = lrt.anchorMax = new Vector2(0f, 1f);
                lrt.pivot = new Vector2(0.5f, 0.5f);
                lrt.anchoredPosition = new Vector2(width * 0.5f + 20f, -(headerReserve + rowHeight * segment));
                lrt.sizeDelta = new Vector2(width - 80f, 2f);
                line.GetComponent<Image>().color = new Color32(0x3a, 0x52, 0x62, 0xff);
                _nodes.Add(line);
            }

            for (int layer = 1; layer <= RunMap.LayersPerSegment; layer++)
            {
                IReadOnlyList<MapNode> nodes = _run.Map.NodesAt(segment, layer);
                if (nodes.Count == 0) continue;
                float layerCenter = layerWidth * (layer - 0.5f);
                float pitch = Mathf.Min(layerWidth / nodes.Count, 150f);
                for (int i = 0; i < nodes.Count; i++)
                {
                    MapNode node = nodes[i];
                    float x = layerCenter + (i - (nodes.Count - 1) * 0.5f) * pitch;
                    float y = rowCenter + rowHeight * (0.5f - RowNodeAnchor);
                    CreateNode(table, node, choices.Contains(node.Id), visited.Contains(node.Id),
                        new Vector2(x, y), nodes.Count);
                }
            }
        }
    }

    private void CreateNode(TextTable table, MapNode node, bool enabled, bool done, Vector2 center, int siblings)
    {
        float planet = node.IsBoss ? BossSize : NodeSize;
        float ring = planet + RingPadding;
        float rowHeight = ring + LabelHeight;

        var go = new GameObject("Node_" + node.Id, typeof(RectTransform), typeof(Button));
        go.layer = gameObject.layer;
        go.transform.SetParent(m_rect_Map, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0f, 1f);
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = center;
        rt.sizeDelta = new Vector2(Mathf.Max(ring, 130f), rowHeight);

        var hit = go.AddComponent<ExImage>();
        hit.spriteAtlas = _runAtlas;
        hit.color = new Color(1f, 1f, 1f, 0f);            // 透明热区:星球和环各是子节点
        hit.raycastTarget = true;
        var button = go.GetComponent<Button>();
        button.targetGraphic = hit;
        button.interactable = enabled;
        if (enabled)
        {
            int nodeId = node.Id;
            button.onClick.AddListener(() => RunFlow.EnterNode(_run, nodeId));
        }

        // 节点中心的竖向位置:上面是星球、下面一条标签
        float planetY = LabelHeight * 0.5f;
        float labelY = -ring * 0.5f;

        // 状态环:可打亮青、打过绿、首领红;打不了的不画
        if (enabled || done)
        {
            string ringSprite = done ? "run_node_ring_done" : node.IsBoss ? "run_node_ring_boss" : "run_node_ring_ready";
            AddImage(go.transform, "环", ringSprite, new Vector2(0f, planetY), new Vector2(ring, ring), Color.white);
        }

        // 星球
        string planetSprite = Planets[Mathf.Abs(node.Id * 7 + node.Segment * 3) % Planets.Length];
        Color tint = enabled || done ? Color.white : new Color(0.42f, 0.45f, 0.52f, 1f);
        AddImage(go.transform, "星球", planetSprite, new Vector2(0f, planetY), new Vector2(planet, planet), tint);

        // 打过的打勾
        if (done)
        {
            AddImage(go.transform, "勾", "run_check",
                new Vector2(planet * 0.34f, planetY + planet * 0.34f), new Vector2(26f, 26f), Color.white);
        }

        // 标签:名字 + 奖励;首领写首领名
        AddLabel(go.transform, LabelOf(table, node), new Vector2(0f, labelY), new Vector2(130f, LabelHeight - 6f),
            enabled ? (node.IsBoss ? BossColor : TextMain) : done ? TextMuted : TextDim);

        // 能跳的节点:标签下面一个「跳过」小钮
        if (enabled && node.CanSkip)
        {
            int nodeId = node.Id;
            var skipGo = new GameObject("跳过", typeof(RectTransform), typeof(ExImage), typeof(Button));
            skipGo.layer = gameObject.layer;
            skipGo.transform.SetParent(go.transform, false);
            var srt = skipGo.GetComponent<RectTransform>();
            srt.anchorMin = srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, labelY - LabelHeight * 0.5f - 2f);
            srt.sizeDelta = new Vector2(70f, 22f);
            var sex = skipGo.GetComponent<ExImage>();
            sex.spriteAtlas = _runAtlas;
            sex.SpriteName = "run_btn_secondary";
            sex.type = Image.Type.Sliced;
            sex.color = Color.white;
            var sbtn = skipGo.GetComponent<Button>();
            sbtn.targetGraphic = sex;
            sbtn.onClick.AddListener(() => Skip(nodeId));
            AddLabel(skipGo.transform, table.Get(TextKeys.Map.Skip), Vector2.zero, new Vector2(70f, 22f), TextMuted, 16f);
        }

        _nodes.Add(go);
    }

    /// <summary>居中对齐的一行字(节点标签、跳过钮):锚点与 pivot 都取中,位置就是中心。</summary>
    private void AddLabel(Transform parent, string text, Vector2 center, Vector2 size, Color color, float fontSize = 18f)
    {
        var go = new GameObject("文字", typeof(RectTransform), typeof(TextMeshProUGUI));
        go.layer = gameObject.layer;
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = center;
        rt.sizeDelta = size;
        var tmp = go.GetComponent<TextMeshProUGUI>();
        tmp.font = MainFont;
        tmp.text = text;
        tmp.fontSize = fontSize;
        tmp.color = color;
        tmp.alignment = TextAlignmentOptions.Center;
        tmp.enableWordWrapping = false;
        tmp.raycastTarget = false;
    }

    private void AddImage(Transform parent, string name, string spriteName, Vector2 position, Vector2 size, Color tint)
    {
        var go = new GameObject(name, typeof(RectTransform), typeof(ExImage));
        go.layer = gameObject.layer;
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = position;
        rt.sizeDelta = size;
        var ex = go.GetComponent<ExImage>();
        ex.spriteAtlas = _runAtlas;
        ex.SpriteName = spriteName;
        ex.color = tint;
        ex.raycastTarget = false;
    }

    private string LabelOf(TextTable table, MapNode node)
    {
        if (node.IsBoss)
        {
            // 情报标签拿到之后才写首领名(13 号票:没情报时只写「首领」)
            return _run.BossIntel ? Bosses.Name(node.BossId) : table.Get(TextKeys.Map.BossPlaceholder);
        }
        return table.Format(TextKeys.Map.NodeLabel, table.Get(TextKeys.Of(node.Strength)), node.Reward);
    }

    private void Skip(int nodeId)
    {
        if (!_run.SkipNode(nodeId)) return;
        RunSaveService.Instance.CommitRun(_run, "跳过");
        Rebuild();
    }

    private void ClearNodes()
    {
        foreach (GameObject go in _nodes) Destroy(go);
        _nodes.Clear();
        RuntimeUI.Clear(m_rect_Map);
    }

    /// <summary>TMP 主字体:静态字挂着主字体资产,运行期现搭的节点借它。</summary>
    private TMP_FontAsset MainFont => m_tmp_HeaderTitle.font;

    #region 事件

    private partial void OnClick_BackBtn() => RunFlow.BackToMenu();

    #endregion
}
