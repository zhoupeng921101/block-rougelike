# 资源管理模式与生命周期

> **适用场景**：OnRefresh/OnDestroyWindow 内资源生命周期管理、资源泄漏根因分析、CancellationToken 取消模式、多资源包协调 | **关联文档**：[resource-api.md](resource-api.md)（核心 API）、[ui-lifecycle.md](ui-lifecycle.md)（UI 内释放时机）

> 本文档是 [resource-api.md](resource-api.md) 的进阶补充，聚焦于资源生命周期管理模式和常见泄漏根因。

---

## 一、窗口内资源生命周期

### 模式：OnRefresh 加载 + OnDestroyWindow 释放

```csharp
[Window(UILayer.UI, "UIHeroDetailPanel")]
public partial class UIHeroDetailPanel : UIPanelMono
{
    private TextAsset _heroConfig;
    private CancellationTokenSource _cts = new();

    protected override async void OnRefresh()
    {
        // 每次 ShowUIAsync 重新加载（userData 决定加载哪个）
        int heroId = (int)UserData;

        // 取消上一次未完成的加载
        _cts.Cancel();
        _cts.Dispose();
        _cts = new CancellationTokenSource();

        try
        {
            _heroConfig = await GameModule.Resource.LoadAssetAsync<TextAsset>(
                $"hero_config_{heroId}", _cts.Token);
            // 使用数据...
        }
        catch (OperationCanceledException) { /* 正常取消 */ }
    }

    protected override void OnDestroyWindow()
    {
        _cts.Cancel();
        _cts.Dispose();
        if (_heroConfig != null)
        {
            GameModule.Resource.UnloadAsset(_heroConfig);
            _heroConfig = null;
        }
    }
}
```

**关键点**：
- `OnRefresh` 每次 ShowUIAsync 都执行，多次打开同一窗口需先取消上次加载
- `OnDestroyWindow` 是释放的唯一时机（不存在 `OnClose`；`OnDestroy` 是 Unity 魔法回调，在 `UIPanelMono` 中为 private，子类 override 不到）
- `CancellationTokenSource` 本身也需要 `Dispose`

---

### 模式：OnCreate 加载一次 + OnDestroyWindow 释放

适合：整个窗口生命周期内使用同一份资源（如背景音乐、固定配置）。

```csharp
[Window(UILayer.UI, "UIBattleMainPanel", fullScreen: true)]
public partial class UIBattleMainPanel : UIPanelMono
{
    private AudioClip _bgmClip;

    protected override async void OnCreate()
    {
        _bgmClip = await GameModule.Resource.LoadAssetAsync<AudioClip>("battle_bgm");
        GameModule.Audio.Play(AudioType.Music, "battle_bgm", bLoop: true);
    }

    protected override void OnDestroyWindow()
    {
        GameModule.Audio.Stop(AudioType.Music);
        if (_bgmClip != null)
        {
            GameModule.Resource.UnloadAsset(_bgmClip);
            _bgmClip = null;
        }
    }
}
```

---

## 二、Part 内资源生命周期

Part 是宿主自持的裸 MonoBehaviour，随宿主子树被 Unity 销毁。引用走 `[SerializeField]`，
不在代码里按路径查找；按名换图走 `SetSprite`（内置缓存池，无需手动释放）。

```csharp
public sealed class ShopSlotPart : MonoBehaviour    // Part 手写单文件，字段自己声明
{
    [SerializeField] private Text m_text_Name = null!;
    [SerializeField] private Image m_img_Icon = null!;

    // SetSprite 内置缓存池，无需手动释放
    public void SetData(string name, string iconLocation)
    {
        m_text_Name.text = name;
        m_img_Icon.SetSprite(iconLocation, cancellationToken: this.GetCancellationTokenOnDestroy());
    }

    // 只有「运行时 new 出来的」资源才需要自己释放（如按实例克隆的材质）
    private Material _instMat;
    private void OnDestroy()
    {
        if (_instMat != null) Destroy(_instMat);
    }
}
```

Part 不持有 `LoadAssetAsync` 的 Asset 句柄，无需释放；持有的按下方 §三 口径管理。

## 三、场景切换资源整理

### 完整场景切换流程

```csharp
public async UniTask SwitchToBattleScene()
{
    // 1. 关闭当前所有 UI（触发各窗口 OnDestroyWindow 释放资源）
    GameModule.UI.CloseAll();

    // 2. 加载新场景（Single 模式自动卸载旧场景）
    await GameModule.Scene.LoadSceneAsync("BattleScene", LoadSceneMode.Single,
        progressCallBack: p => { /* 显示进度条 */ });

    // 3. 整理已无引用的资源
    GameModule.Resource.UnloadUnusedAssets();

    // 4. 强制 GC（可选，视内存压力决定）
    // GameModule.Resource.ForceUnloadUnusedAssets(performGCCollect: true);

    // 5. 打开新 UI
    GameModule.UI.ShowUIAsync<UIBattleMainPanel>();
}
```

### 叠加场景的资源管理

```csharp
// 叠加场景加载
await GameModule.Scene.LoadSceneAsync("MinigameScene", LoadSceneMode.Additive);

// 卸载叠加场景时显式清理
await GameModule.Scene.UnloadAsync("MinigameScene");
GameModule.Resource.UnloadUnusedAssets();   // 清理叠加场景释放出的资源
```

---

## 四、跨模块资源共享

### 反模式：静态变量持有 Asset 引用

```csharp
// ❌ 危险：静态引用导致资源永不释放，内存持续增长
public class IconManager
{
    private static Dictionary<int, Sprite> _cache = new();

    public static async UniTask<Sprite> GetIcon(int iconId)
    {
        if (!_cache.ContainsKey(iconId))
        {
            // LoadAssetAsync<Sprite> 本身就是错误用法，应用 SetSprite
            // 但即使换成正确方式，静态缓存也会泄漏
            var sprite = await GameModule.Resource.LoadAssetAsync<Sprite>($"icon_{iconId}");
            _cache[iconId] = sprite;
        }
        return _cache[iconId];
    }
    // 没有 UnloadAsset，资源永远不释放
}

// ✅ 正确：Sprite 直接用 SetSprite，框架内置缓存池自动管理
_imgIcon.SetSprite($"icon_{itemCfg.IconId}");
```

### 模式：共享配置数据通过 ConfigSystem（接 Luban 后适用）

```csharp
// ✅ 正确：Luban 配置数据通过 ConfigSystem 统一管理
var itemCfg = ConfigSystem.Instance.Tables.TbItemDef.Get(itemId);

// 不要将配置数据缓存到自己的静态变量中
// 配置数据由 ConfigSystem 统一持有和释放
```

本作尚未接入 Luban，接入状态见 [luban-config.md](luban-config.md)。

---

## 五、常见资源泄漏根因

### 泄漏类型1：OnDestroyWindow 中未释放

```
症状：内存随操作次数线性增长，调试器显示资源引用计数不降
根因：LoadAssetAsync 有调用，但 UnloadAsset 缺失或条件分支遗漏
排查：TEngine 调试器（~ 键）→ 资源引用计数视图，找引用计数 > 预期的项
```

### 泄漏类型2：异步加载后对象已销毁

```csharp
// ❌ 危险：await 期间窗口关闭，OnDestroyWindow 早于 LoadAssetAsync 完成
// 导致 OnDestroyWindow 中 _config == null 跳过释放，await 完成后赋值泄漏

protected override async void OnRefresh()
{
    _config = await GameModule.Resource.LoadAssetAsync<TextAsset>("config");
    // 若此时窗口已销毁，_config 赋值但 OnDestroyWindow 已执行，资源泄漏
}

// ✅ 正确：检查 this == null 或使用 CancellationToken
protected override async void OnRefresh()
{
    try
    {
        var config = await GameModule.Resource.LoadAssetAsync<TextAsset>("config", _cts.Token);
        if (this == null) return;   // 窗口已销毁
        _config = config;
        RefreshUI();
    }
    catch (OperationCanceledException) { /* CancellationToken 取消 */ }
}
```

### 泄漏类型3：Part 列表重建不释放旧资源

```csharp
// ❌ 错误：每次刷新都建新 Part，旧 Part 持有的资源未释放
protected override void OnRefresh()
{
    _skillSlots.Clear();                           // 只清列表，Part 未销毁
    for (int i = 0; i < skills.Count; i++)
    {
        var slot = UIPartFactory.Create<SkillSlotPart>(_slotPrefab, _tfSkillPanel, nameof(UIBattleMainPanel));
        _skillSlots.Add(slot);   // ← 每次刷新都新建，旧的没销毁
    }
}

// ✅ 正确：复用已有实例，只补建差额，多余的销毁或隐藏
for (int i = _skillSlots.Count; i < skills.Count; i++)
{
    var slot = UIPartFactory.Create<SkillSlotPart>(_slotPrefab, _tfSkillPanel, nameof(UIBattleMainPanel));
    if (slot == null) break;
    _skillSlots.Add(slot);
}
for (int i = skills.Count; i < _skillSlots.Count; i++)
    _skillSlots[i].gameObject.SetActive(false);
for (int i = 0; i < skills.Count; i++)
{
    _skillSlots[i].gameObject.SetActive(true);
    _skillSlots[i].SetData(skills[i]);
}
```

---

## 六、多资源包场景

### packageName 参数用法

```csharp
// DLC 或分包资源需要指定 packageName
var bossAsset = await GameModule.Resource.LoadGameObjectAsync(
    "BossPrefab", parent, packageName: "DLC_Chapter2");

// 检查资源是否在包内
bool valid = GameModule.Resource.CheckLocationValid("BossPrefab", "DLC_Chapter2");
```

### 分包资源下载前置检查

```csharp
public async UniTask EnsureDLCReady(string packageName)
{
    // 检查本地是否已有
    var result = GameModule.Resource.HasAsset("BossPrefab", packageName);
    if (result == HasAssetResult.Valid) return;   // 本地已有，直接使用

    // 触发下载（参考 hotfix-workflow.md 的下载流程）
    var downloader = GameModule.Resource.CreateResourceDownloader(packageName);
    if (downloader.TotalDownloadCount > 0)
    {
        downloader.BeginDownload();
        await downloader.Task;
    }
}
```

---

## 七、资源加载性能模式

### 并发批量加载（同类型）

```csharp
// 批量加载多个配置，并发执行
var locations = new[] { "level_1_data", "level_2_data", "level_3_data" };
var configs = await UniTask.WhenAll(
    locations.Select(loc => GameModule.Resource.LoadAssetAsync<TextAsset>(loc)));

// 释放时逐一 Unload
foreach (var config in configs)
    GameModule.Resource.UnloadAsset(config);
```

### 预加载策略

```csharp
// 资源一律异步加载；首发离线、资源全部随包，加载只是读本地 bundle
var bossConfig = await GameModule.Resource.LoadAssetAsync<TextAsset>("boss_config");

// 战斗中高频实例化的件（方块格、特效模板）由宿主 prefab 序列化引用带入，
// 依赖随宿主进 bundle 并驻留，Instantiate 零资源 LOAD（见 ui-patterns.md §一）
```

本作没有启动期预载器（block-client 的 `UIPreloader` / `StartupPreloader` 没搬）。真要在启动时预热一批资源，先定预载清单放哪、谁持引用、何时释放，再落代码。

---

## 交叉引用

| 主题 | 文档 |
|------|------|
| 资源加载核心 API（SetSprite/LoadGameObjectAsync/LoadAssetAsync）| [resource-api.md](resource-api.md) |
| 窗口生命周期（OnCreate/OnRefresh/OnDestroyWindow）| [ui-lifecycle.md](ui-lifecycle.md) |
| 绑定与创建口径、Part 判据 | [ui-patterns.md](ui-patterns.md) |
| Luban 配置数据访问 | [luban-config.md](luban-config.md) |
| 问题排查（内存增长、location 无效）| [troubleshooting.md](troubleshooting.md) |
