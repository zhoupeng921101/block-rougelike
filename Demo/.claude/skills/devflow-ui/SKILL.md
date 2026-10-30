---
name: devflow-ui
description: devflow UI 制作段:经 MCP 搭 UGUI prefab + 生成绑定脚手架。只由 devflow 主流程在含新 UI 窗口/prefab 的 client 段用 Skill 工具调用(先于业务逻辑);用户直接要求搭 UI 时进 devflow,不进本卡。
---

# devflow · UI 制作段

把 UI 意图直接在 Unity 里(经 MCP)搭成完整 UGUI prefab——节点层级、组件、容器、锚点布局——并为**窗**生成绑定骨架。产出节点清单回主流程,业务逻辑由后续 `devflow-client` 段填。

## 输入

主流程第一步产出的简报:UI 意图(窗口/控件清单、布局关系、参照范式如「照 UIMainMenuPanel」、规则 §8 的界面草图)+ 数据/交互期望 + 目的。

## 开工前

- 工作根固定为主工作树 Demo;全部 MCP 操作发往它的编辑器实例(按工程路径解析 id);路由纪律(绑定、落点守卫、加不了守卫的工具怎么处置)正本 = unity-check 卡「实例路由与落点」。
- 先跑 `/unity-check` 确认 MCP 连到本次目标实例(以 path 复核,不误打非目标实例);搭树全程依赖 Unity 响应,连不上先解决连接。
- 读本卡工具索引 `references/ui-tools.md`(生成绑定链 API 与行为契约、图集体系、自有组件、截图做法、字体现状);建节点/选字体/用图集前先查其中既有设施(如 SpriteAtlas v2 图集链、窗口入场组件),有则直接使用,不以引擎默认组件、内置资源重新实现;**本作还没定正式字体**,用字见该篇「字体」段。
- 读控件手册 `references/ugui-widgets.md`(各控件的节点结构、交叉引用与工程强约束、命名前缀)。block-client 的控件模板库 `UIWidgetLibrary` 尚未搬入本作,多节点控件只能手搭;**手搭后逐项对照该篇接全交叉引用**(`targetGraphic` / `viewport` / `content` / `fillRect` / `textComponent`),漏了只在运行期显形。

## 继承规范(全部引用正本,不复制)

- 窗与 Part 的生命周期、节点绑定、事件:`.claude/references/tengine/ui-lifecycle.md` + `ui-patterns.md`;节点命名判据:`naming-rules.md`§UI 节点命名规范(只绑代码会引用的)。
- `ui-patterns.md`§三:选基类(定级判据——窗用 `UIPanelMono`,其余一律裸 `MonoBehaviour`)、Part 判据与 `Part` 命名、新建 Part 前查重防重复造,定级结论随节点清单报回主流程;§四:设计师可调参数公开到 Inspector 的判据。
- MCP 操作机制(`batch_execute` 批量优先、target 定位、manage_ui 速查、常见错误表):`.claude/references/tengine/mcp-tools.md`。生成绑定不走菜单:本卡「生成绑定」节的 `execute_code` + `ScriptGenerator` + 按名绑定流程是唯一正本。
- 编码禁止事项唯一信息源:`.claude/rules-ondemand/tengine-conventions.md`「核心禁止事项」。

## 工作流

1. **规划节点树**:区分需绑定控件(`m_` 前缀)与纯结构/装饰节点(无前缀、中文名)。**层级即语义包含**——视觉上 A 在 B 里就作 B 的子节点(按钮文字放按钮下、卡片内图标文字放卡片下),不拍平成同级。动态内容区搭**空容器节点**,运行时由 dev 段代码填 item。
2. **搭树**:用 MCP 现搭(`manage_prefabs` / `manage_gameobject` / `manage_ui` / `manage_components`)。Button / ScrollRect / Toggle / Slider / InputField / Text / 纯展示进度条这类多节点控件,节点结构、交叉引用与基线参数照 `references/ugui-widgets.md` 逐项搭全,建好即改成带前缀的语义名;进度条选型判据同在该篇。窗口根搭建期只挂 Canvas + GraphicRaycaster(面板类组件在绑定步编译后补挂),**不挂 CanvasScaler**(误挂会让 root scale 塌成 0、整窗不可见)。根 RectTransform 必须 stretch:`anchorMin=(0,0)` / `anchorMax=(1,1)` / `localScale=(1,1,1)` / `pivot=(0.5,0.5)` / `sizeDelta=0`。
3. **命名**:控件按前缀表(见下);所有 `m_` 节点名在窗内唯一(按名绑定的前提)。
4. **布局**:锚点/pivot 适配分辨率;成排/列表用 LayoutGroup(`m_hlay`/`m_vlay`/`m_grid`),固定位用锚定。
5. **静态视觉**:素材已就绪、永不变的静态图(底框/图标)直接烤进 prefab 的 `m_Sprite`+`m_Color`;尚无终稿美术的留裸 Image + 占位纯色。**随状态变的动态换皮始终运行时 SetSprite,不烤。**
   - **尺寸**:烤了 sprite 的非九宫格 Image(type 非 `Sliced` / `Tiled`)一律 `Image.SetNativeSize()` 取原图尺寸(`execute_code` 调用后存 prefab),不手填 `sizeDelta`——手填会把图拉变形或糊边;九宫格底板/边框才设 `Sliced` 按布局给尺寸。例外:四角拉伸铺满的全屏背景不调(`SetNativeSize` 会把 `anchorMax` 收成 `anchorMin`,拉伸失效)。
6. **生成绑定**(见下)。

## 命名前缀表(常用项;完整以 `Assets/Editor/UIScriptGenerator/ScriptGeneratorSetting.asset` 的 `scriptGenerateRule` 为准)

正本 = `.claude/references/tengine/naming-rules.md`§UI 节点命名规范。前缀表里有些项对应的组件本作还没有(`m_eximg` → ExImage、`m_loopGrid` → LoopGridView、`m_container` → ItemContainer),在组件搬入前不用。`m_part*` / `m_item*` 是遍历边界,到此停止递归。

## 弹窗:落 `UILayer.Window` + 全屏遮罩节点

**弹窗一律 `[Window(UILayer.Window, ...)]`,且 prefab 里必须有全屏遮罩节点 `m_btn_Mask`**(铺满窗根、置 sibling 0)。层级表、栈语义、遮罩绑定与关闭机制、`DismissOnMask` / `DismissByMask` 覆写口径正本 = `.claude/references/tengine/ui-lifecycle.md`「UILayer 层级」节(含「栈层」)。

生成器给新窗的默认层是 `UILayer.Window`,搭的是功能页时改回 `UILayer.UI`。

## 安全区:PC 首发暂不搭

本作 PC 横屏首发(设计分辨率 1920×1080,UIRoot 的 CanvasScaler 即此值),没有刘海与 Home 条,安全区组件 `UISafeArea` 没有搬入,窗里**不搭 `安全区*` 节点**。交付闸 `安全区结构核对` 在该组件缺席时空过。移植手机时连组件一起搬回,并恢复 block-client 的摆法:贴边内容进 `安全区*` 节点,`m_btn_Mask` 与全屏背景留在它外面、作窗根直接子节点铺满。现在搭窗就把遮罩与全屏背景放在窗根直下,移植时不用挪。

## 生成绑定(`_Gen.g.cs` + 按名绑定引用)

**只有窗走生成器**:`_Gen.g.cs` 生成 `[SerializeField] private T m_xxx;` 字段 + 事件挂载点(`ScriptGenerator()` 虚方法)。节点引用靠**按节点名绑定**存进 prefab 序列化,不走运行时查找。生成物不带 namespace。

新面板两步(`execute_code` 驱动编辑器 API):

1. **生成类**:`ScriptGenerator.GenerateCSharpScript(root, isUniTask:false, savePath:ScriptGeneratorSetting.GetGenCodePath(), className:"<prefab 根名>", uiGenTypeName:"UIPanelMono", isGenImp:true, impSavePath:ScriptGeneratorSetting.GetImpCodePath())` → 写 `<类名>_Gen.g.cs`(只读生成物,落 `GameLogic/UI/Gen/`)+ impl partial 脚手架(落 `GameLogic/UI/`)。两个取路径的方法仍带 block-client 遗留的 `toBase` 参数,传 `true` 会取到本作不存在的 `GameBase/UI`,**一律不传**。`uiGenTypeName` 无第二个合法值。
2. **编译后挂组件 + 按名绑定**:在带落点守卫的 `execute_code` 内触发导入与编译并确认新字段已进程序集(做法见 `unity-check` 卡「落错的不止返回值,还有副作用」条)→ prefab 根挂本面板组件 → 按节点名把引用绑回 `[SerializeField]` 字段:`ScriptGenerator.FindNodeByNameWithWidgetBoundary(root, 字段名)` → `SerializedObject.FindProperty(字段名).objectReferenceValue = 引用` → `SaveAsPrefabAsset`。正本 = `UIBindingService.BindByNodeName`(窗 Inspector 按钮与菜单 `TEngine/UI 绑定/…` 都调它)。

> **按名绑定约定**:MPrefix 风格下字段名与节点名恒等,`m_` 节点名唯一即安全。改了节点树:重生成 `_Gen`(`isGenImp:false`,不碰 impl)→ 等编译 → 重跑按名绑定;加唯一命名节点不会移位既有绑定。

## 自检(交付前必做)

- prefab 能 `LoadGameObject` 加载;根仅 Canvas + GraphicRaycaster + 本面板组件、无 CanvasScaler;根 `localScale==1` 且 `anchorMax==(1,1)`。
- **绑定完整**(窗):`m_` 字段引用非空。交付闸 `UI绑定核对` 兜底,交付前自查省一次返工。
- **Play 开窗(或 Instantiate 进 UICanvas)目视渲染,不只信"控制台 0 错"**——root scale=0 / CanvasScaler 误挂类故障只有目视才暴露;重游戏态依赖的窗按 AABB 取景截图;带根 Canvas 的静态面板离屏截图口径见 `references/ui-tools.md`§四。
- **手搭控件的交叉引用**:逐个对照 `references/ugui-widgets.md` 该控件条目,引用字段非空、指向对的节点。
- 编译过:`_Gen.g.cs` + impl 零编译错误,手段见 `devflow-client` 卡「自检」节(`read_console` 加不了落点守卫,不单独作判据)。只搭 Part prefab 时本段无新代码,跳过。

## 产出(回主流程)

1. prefab 路径;窗另附 `_Gen.g.cs` 路径 + impl partial 路径。
2. 节点清单:所有 `m_` 控件节点 + 组件类型(供 dev 段直接用)。Part 的清单同时是 dev 段手写 `[SerializeField]` 字段的依据——字段名须与节点名逐字恒等,否则绑不上。
3. 结构性约束(LayoutGroup 配置、ScrollRect 参数、动态容器节点名)+ 占位待美术项。
4. 目视自检证据:开窗方式(Play / Instantiate 进 UICanvas)+ 目视结果一句话;重游戏态依赖的窗附 AABB 截图路径(自检步已产,此处转录)。主流程呈报的「附目视证据」照此转录。

## 不做

- 业务逻辑(OnCreate 取数 / refresh / 回调体)→ dev 段。
- **Part 的类文件**(`XxxPart.cs`:类声明、`[SerializeField]` 字段、`Awake()` 挂载,无 `_Gen.g.cs`,形态见 `.claude/references/tengine/ui-patterns.md`§三)及其挂组件与按名绑定(菜单 `TEngine/UI 绑定/…`;`UI绑定核对` 的 Part 档只在交付时核缺项 / 空引用,不代做绑定)→ dev 段。手写 Part 类是客户端编码,受 devflow 卡「实现段承载不变量」约束,本段只交 prefab 与节点清单。
- 终稿美术 sprite → 重画同名图 / 代码寻址。

## 禁止事项

- 控件命名必用前缀表前缀且窗内唯一,否则不生成绑定或绑错。
- `_Gen.g.cs` 是只读生成物(置文件系统只读位),不手改;改树按「按名绑定约定」重生成 + 重绑。
