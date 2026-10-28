using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 消除预览发光的呼吸脉动（挂在对象池化的发光 Image 上，随 GameObject 显隐自门控：
/// Update 不在 inactive GameObject 上执行，ClearGhost 隐藏发光层时脉动自然停摆、零开销）。
/// 在基色（暖金，由窗口在激活时写入 <see cref="BaseColor"/>）的 alpha 上叠加正弦呼吸，
/// 让玩家更易把「会消除的行列」从静态绿 ghost 中区分出来。默认只改 alpha，不改 RGB / scale；
/// 开了彩色流转（<see cref="SetRainbow"/>）时 RGB 改沿色相环流转，alpha 照旧呼吸。
/// 另挂在签到窗今天可签格的高亮底上：那里基色烤在 prefab 的 <see cref="BaseColor"/>，不由窗口写入。
/// </summary>
public sealed class GlowPulse : MonoBehaviour
{
    /// <summary>基色（暖金），由窗口在每次激活该发光格时写入。脉动以其 alpha 为中心起伏。</summary>
    public Color BaseColor;

    [Header("呼吸脉动")]
    [Tooltip("一次明暗循环的时长（秒）。越小呼吸越快")]
    [SerializeField, Range(0.1f, 3f)] private float _period = 0.9f;
    [Tooltip("alpha 相对基色的上下摆幅。以基色 alpha 为中心在 ±此值内起伏；0 = 不呼吸")]
    [SerializeField, Range(0f, 1f)] private float _alphaSwing = 0.22f;

    /// <summary>彩色流转时的饱和度：取不满，流转的是一圈亮色而不是刺眼的纯色。</summary>
    private const float RainbowSaturation = 0.6f;

    private Image _img;
    private float _phase;

    private bool _rainbow;
    private float _hueOffset;
    private float _huePeriod = 1f;

    private void Awake() => _img = GetComponent<Image>();

    // 每次重新激活时错开相位的入口（窗口在 SetActive(true) 前调用），避免整片发光齐刷同步呆板。
    public void Restart(float phaseOffset)
    {
        _phase = phaseOffset;
        ApplyAlpha(0f);
    }

    /// <summary>
    /// 开关彩色流转：开着时 RGB 沿色相环转一圈用 <paramref name="huePeriod"/> 秒，起点色相 = <paramref name="hueOffset"/>（0~1，几条并排时错开）；
    /// 关着时用 <see cref="BaseColor"/> 的 RGB。池化件每次激活都要显式设一次，否则带着上一次的状态。
    /// </summary>
    public void SetRainbow(bool on, float hueOffset = 0f, float huePeriod = 1f)
    {
        _rainbow = on;
        _hueOffset = hueOffset;
        _huePeriod = Mathf.Max(0.1f, huePeriod);
    }

    private void Update()
    {
        _phase += Time.deltaTime;
        ApplyAlpha(_phase);
    }

    private void ApplyAlpha(float t)
    {
        if (_img == null) return;
        float k = Mathf.Sin(t / _period * Mathf.PI * 2f);            // [-1,1]
        float a = Mathf.Clamp01(BaseColor.a + k * _alphaSwing);
        Color rgb = _rainbow
            ? Color.HSVToRGB(Mathf.Repeat(_hueOffset + t / _huePeriod, 1f), RainbowSaturation, 1f)
            : BaseColor;
        _img.color = new Color(rgb.r, rgb.g, rgb.b, a);
    }
}
