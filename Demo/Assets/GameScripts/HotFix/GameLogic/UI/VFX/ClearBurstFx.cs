using System.Collections.Generic;
using TEngine;
using UnityEngine;

/// <summary>
/// 粒子迸点播放器(摘自动物乐园 GameLogic/UI/VFX/ClearBurstFx,32 号票):消除碎块(白光闪核 + 碎块放射,约 0.6s 消散)与落子光点共用。
/// 视觉壳是预制(根 UIParticle + 两层 ParticleSystem:「Flash」闪光核保持白;「Debris」碎块按给的颜色染),模板走 <see cref="BattleFxAssets"/>。
/// UIParticle 每帧把子 ParticleSystem 的模拟结果烘进 Canvas mesh,本类只碰内置 ParticleSystem(染色、播放、计时回收),
/// 故 GameLogic 不引 UIParticle 包。播完按模板分池收回而不销毁:清屏一手要几十发,逐发新建在编辑器里约 40ms。
/// </summary>
public sealed class ClearBurstFx : MonoBehaviour
{
    // 回收时长:覆盖两层最长生命周期(Debris lifetime 0.66 + 余量)。起播延迟的那一份另计(见 Update)。
    private const float SelfDestroyDelay = 0.9f;

    /// <summary>每种模板最多留几份空闲实例:清屏一手的庆祝波再叠大消逐格的碎块。</summary>
    private const int PoolCapPerPrefab = 128;

    private static readonly Dictionary<GameObject, Stack<ClearBurstFx>> Pool = new Dictionary<GameObject, Stack<ClearBurstFx>>();

    private GameObject _template;
    private float _t;
    private float _delay;
    private bool _played;
    private ParticleSystem[] _systems;
    private RectTransform _rect;
    private GameObject _flash;

    /// <summary>
    /// 在 <paramref name="parent"/> 本地坐标放一发。
    /// </summary>
    /// <param name="localAnchored">在 parent 本地的 anchoredPosition(相对父层矩形中心)。</param>
    /// <param name="debrisColor">碎块层主色;null = 不染,用预制配置的颜色(落子光点是预制自带的彩色随机)。</param>
    /// <param name="delay">起播延迟(秒),0 = 当帧起播。延迟期间粒子系统未 Play,不发射也就不可见。</param>
    /// <param name="flash">是否带白光闪核。成片齐发(清屏庆祝波)传 false:闪核叠在一起糊成一团白雾。</param>
    public static void Spawn(GameObject template, Transform parent, Vector2 localAnchored, Color? debrisColor, float delay = 0f, bool flash = true)
    {
        var fx = Acquire(parent, template);
        if (fx == null) return;
        if (fx._flash != null && fx._flash.activeSelf != flash) fx._flash.SetActive(flash);

        var rt = fx._rect;
        if (rt != null)
        {
            rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.localScale = Vector3.one;
            rt.anchoredPosition = localAnchored;
        }

        // Debris 的 colorOverLifetime 保持白→白,主色相完全由 main.startColor 注入;池按模板分开,不染色的模板不会领到别人染过的实例。
        var debris = debrisColor.HasValue ? fx.transform.Find("Debris") : null;
        if (debris != null)
        {
            var ps = debris.GetComponent<ParticleSystem>();
            if (ps != null)
            {
                var main = ps.main;
                main.startColor = debrisColor.Value;
            }
        }

        // 两层都是 playOnAwake:新建或复用显示的当帧已在播。延迟起播的那一路须先停住再清,到点由 PlayNow 从头播,
        // 否则 0 秒那发 burst 照样在下一次模拟里喷出,延迟形同虚设。
        foreach (var ps in fx._systems)
        {
            if (ps == null) continue;
            if (delay > 0f) ps.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
            else ps.Clear(true);
        }

        fx._t = 0f;
        fx._delay = delay > 0f ? delay : 0f;
        fx._played = false;
        if (fx._delay <= 0f) fx.PlayNow();
    }

    private static ClearBurstFx Acquire(Transform parent, GameObject template)
    {
        if (template == null)
        {
            Log.Warning("[ClearBurstFx] 模板引用为空,特效未播放。检查战斗窗上的 BattleFxAssets。");
            return null;
        }
        var stack = StackOf(template);
        while (stack.Count > 0)
        {
            var fx = stack.Pop();
            if (fx == null) continue;   // 随原父节点一起销毁了
            if (fx.transform.parent != parent) fx.transform.SetParent(parent, false);
            fx.transform.SetAsLastSibling();
            fx.gameObject.SetActive(true);
            return fx;
        }

        var go = Object.Instantiate(template, parent);
        var created = go.AddComponent<ClearBurstFx>();
        created._template = template;
        created._systems = go.GetComponentsInChildren<ParticleSystem>(true);
        created._rect = go.GetComponent<RectTransform>();
        var flash = go.transform.Find("Flash");
        created._flash = flash != null ? flash.gameObject : null;
        return created;
    }

    private static Stack<ClearBurstFx> StackOf(GameObject template)
    {
        if (!Pool.TryGetValue(template, out var stack))
        {
            stack = new Stack<ClearBurstFx>();
            Pool[template] = stack;
        }
        return stack;
    }

    private void PlayNow()
    {
        _played = true;
        foreach (var ps in _systems)
            if (ps != null) ps.Play(true);
    }

    /// <summary>停播清空后收回池里;该模板空闲份已满则销毁。</summary>
    private void Release()
    {
        var stack = StackOf(_template);
        if (stack.Count >= PoolCapPerPrefab)
        {
            Object.Destroy(gameObject);
            return;
        }
        foreach (var ps in _systems)
            if (ps != null) ps.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
        gameObject.SetActive(false);
        stack.Push(this);
    }

    private void Update()
    {
        _t += Time.deltaTime;
        if (!_played)
        {
            if (_t < _delay) return;
            PlayNow();
        }
        // 回收窗口从起播算起:否则延迟越大的那几发被砍得越早,扩散的尾巴会缺一截。
        if (_t >= _delay + SelfDestroyDelay) Release();
    }
}
