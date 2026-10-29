using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 运行时拼界面件的几个小工具:选关、商店、背包栏、主界面子页都是按状态现搭的按钮与文字(窗里只留空容器),
/// 搭法照商店屏原有的写法(旧版 Text + Image + Button),集中在这里,配色也只在这里改。
/// 节点一律左上角锚定,位置按「距父节点左上角」给,y 向下为负。
/// </summary>
public static class RuntimeUI
{
    public static readonly Color ButtonColor = new Color(0.2f, 0.23f, 0.34f, 1f);
    public static readonly Color ButtonDisabled = new Color(0.14f, 0.15f, 0.2f, 1f);
    public static readonly Color ButtonAccent = new Color(0.30f, 0.24f, 0.42f, 1f);
    public static readonly Color PanelColor = new Color(0.06f, 0.07f, 0.11f, 0.92f);
    public static readonly Color TextColor = new Color(0.95f, 0.95f, 1f, 1f);
    public static readonly Color TextMuted = new Color(0.5f, 0.52f, 0.6f, 1f);
    public static readonly Color Gold = new Color(1f, 0.839f, 0.361f, 1f);

    public static RectTransform Node(string name, Transform parent, Vector2 position, Vector2 size, params Type[] components)
    {
        var all = new Type[components.Length + 1];
        all[0] = typeof(RectTransform);
        Array.Copy(components, 0, all, 1, components.Length);
        var go = new GameObject(name, all);
        go.layer = parent.gameObject.layer;
        go.transform.SetParent(parent, false);
        var rt = (RectTransform)go.transform;
        rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0f, 1f);
        rt.anchoredPosition = position;
        rt.sizeDelta = size;
        return rt;
    }

    /// <summary>铺满父节点的一层(遮罩、面板底)。</summary>
    public static RectTransform Fill(string name, Transform parent, Color color)
    {
        RectTransform rt = Node(name, parent, Vector2.zero, Vector2.zero, typeof(Image));
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.one;
        rt.offsetMin = rt.offsetMax = Vector2.zero;
        rt.GetComponent<Image>().color = color;
        return rt;
    }

    public static Text Label(Transform parent, Font font, string text, Vector2 position, Vector2 size, int fontSize = 24,
        TextAnchor align = TextAnchor.MiddleLeft, Color? color = null)
    {
        RectTransform rt = Node("文字", parent, position, size, typeof(Text));
        Text t = rt.GetComponent<Text>();
        t.font = font;
        t.fontSize = fontSize;
        t.alignment = align;
        t.color = color ?? TextColor;
        t.horizontalOverflow = HorizontalWrapMode.Wrap;
        t.verticalOverflow = VerticalWrapMode.Truncate;
        t.raycastTarget = false;
        t.text = text;
        return t;
    }

    public static Button Button(Transform parent, Font font, string text, Vector2 position, Vector2 size, Action onClick,
        bool enabled = true, int fontSize = 24, Color? color = null)
    {
        RectTransform rt = Node("按钮", parent, position, size, typeof(Image), typeof(Button));
        Image image = rt.GetComponent<Image>();
        image.color = enabled ? color ?? ButtonColor : ButtonDisabled;
        Button button = rt.GetComponent<Button>();
        button.targetGraphic = image;
        button.interactable = enabled;
        if (enabled && onClick != null) button.onClick.AddListener(() => onClick());
        Text label = Label(rt, font, text, Vector2.zero, size, fontSize, TextAnchor.MiddleCenter, enabled ? TextColor : TextMuted);
        RectTransform lrt = label.rectTransform;
        lrt.anchorMin = Vector2.zero;
        lrt.anchorMax = Vector2.one;
        lrt.offsetMin = new Vector2(6f, 0f);
        lrt.offsetMax = new Vector2(-6f, 0f);
        return button;
    }

    /// <summary>TMP 版的文字(战斗窗只有 TMP 主字体,没有旧版 Text 的字体可借)。</summary>
    public static TextMeshProUGUI TmpLabel(Transform parent, TMP_FontAsset font, string text, Vector2 position, Vector2 size, float fontSize = 20f,
        TextAlignmentOptions align = TextAlignmentOptions.Center, Color? color = null)
    {
        RectTransform rt = Node("文字", parent, position, size, typeof(TextMeshProUGUI));
        TextMeshProUGUI t = rt.GetComponent<TextMeshProUGUI>();
        t.font = font;
        t.fontSize = fontSize;
        t.alignment = align;
        t.color = color ?? TextColor;
        t.raycastTarget = false;
        t.text = text;
        return t;
    }

    public static Button TmpButton(Transform parent, TMP_FontAsset font, string text, Vector2 position, Vector2 size, Action onClick,
        float fontSize = 18f, Color? color = null)
    {
        RectTransform rt = Node("按钮", parent, position, size, typeof(Image), typeof(Button));
        Image image = rt.GetComponent<Image>();
        image.color = color ?? ButtonColor;
        Button button = rt.GetComponent<Button>();
        button.targetGraphic = image;
        if (onClick != null) button.onClick.AddListener(() => onClick());
        TextMeshProUGUI label = TmpLabel(rt, font, text, Vector2.zero, size, fontSize);
        RectTransform lrt = label.rectTransform;
        lrt.anchorMin = Vector2.zero;
        lrt.anchorMax = Vector2.one;
        lrt.offsetMin = lrt.offsetMax = Vector2.zero;
        return button;
    }

    /// <summary>删掉 parent 下的全部子节点。</summary>
    public static void Clear(Transform parent)
    {
        for (int i = parent.childCount - 1; i >= 0; i--) UnityEngine.Object.Destroy(parent.GetChild(i).gameObject);
    }
}
