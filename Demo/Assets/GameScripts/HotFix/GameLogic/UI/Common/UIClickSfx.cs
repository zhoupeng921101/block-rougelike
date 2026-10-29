using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 界面点击音效(33 号票):给一个窗里所有按钮挂一声 <see cref="AudioIds.ButtonClick"/>。
/// 窗基类在生成绑定之后调一次;已有的监听器不动,点击音是额外加的那一条。
/// </summary>
public static class UIClickSfx
{
    public static void Attach(GameObject root)
    {
        if (root == null) return;
        foreach (Button button in root.GetComponentsInChildren<Button>(true))
        {
            if (button.GetComponent<UIClickSfxMarker>() != null) continue;
            button.gameObject.AddComponent<UIClickSfxMarker>();
            button.onClick.AddListener(OnClick);
        }
    }

    private static void OnClick() => AudioConfigMgr.Play(AudioIds.ButtonClick);
}

/// <summary>「这个按钮已经接过点击音」的标记,防止同一个按钮挂两次。</summary>
public sealed class UIClickSfxMarker : MonoBehaviour
{
}
