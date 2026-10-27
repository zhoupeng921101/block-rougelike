# ui-tools.md — 工程 UI 工具与设施索引

> devflow-ui 段开工速查:存在什么 + 入口 + 关键契约,行为细节以工具源码为准。流程正本 = SKILL.md「生成绑定」节。

**MCP 调用约束**:编辑器工具不声明命名空间,类型在全局命名空间;经 `execute_code` 直接用裸类名调用,编译器为 C#6。

## 一、生成绑定链(本段核心)

工具类 `ScriptGenerator`(partial,分居 `Assets/Editor/UIScriptGenerator/ScriptGenerator.cs` 与 `ScriptAutoGenerator.cs`):

| 静态 API | 用途 |
|---|---|
| `GenerateCSharpScript(Transform root, bool isUniTask=false, string savePath=null, string className=null, string uiGenTypeName=null, bool isGenImp=false, string impSavePath=null)` | 生成 `_Gen.g.cs`(+可选 impl 脚手架);调用序见 SKILL.md「生成绑定」 |
| `GenerateUIScriptFiles(root, className, uiGenTypeName, isUniTask)` | 首次生成封装,gen/impl 路径从 Setting 读 |
| `FindNodeByNameWithWidgetBoundary(root, nodeName)` | 带 widget 边界的按名找节点(程序化绑定用) |
| `GetUIScriptDefaults(root, out className, out uiGenTypeName)` | 按根名推导类名;基类恒为 `UIPanelMono`(生成器只产窗一档,Part 手写不进生成器) |

行为契约:

- 窗代码只有一个根:`Assets/GameScripts/HotFix/GameLogic/UI/`,`_Gen.g.cs` 在其下 `Gen/`。impl 与 Gen 是同一个 partial 类、必须同一程序集。新窗取 `GetGenCodePath()` / `GetImpCodePath()`,已有窗取 `GetGenCodePathFor(类名)`。代码里仍留着 block-client 的两根形态(`toBase` 参数、`ScriptGeneratorSetting.ResolveGenCodePath` 按 impl 所在根校正、设置里的 `baseGenCodePath` / `baseImpCodePath` 指向本作不存在的 `GameBase/UI`),**不传 `toBase: true`**。
- `_Gen.g.cs` 写后置文件系统只读属性(重生成自动清除重写);impl **已存在永不覆盖**(只打一条 Warning,不影响 `GenerateCSharpScript` 的返回值)——重生成安全,业务代码不丢。
- `ScriptGenerator()` 内只对 Button / Toggle / TMP_Dropdown / Slider 四类挂事件并声明 partial 回调;其余前缀只生成字段。
- `m_part*` 与 `m_item*` 是 widget 边界:节点本身生成字段可被绑定(`m_item` 绑 GameObject,`m_part` 绑其上的 Part 组件),子树不下钻(归子 widget 的脚本管)。
- 按名绑定的前提「字段名==节点名」仅 MPrefix 代码风格成立(当前配置即是)。

人工入口(编辑器手动操作,与程序化路径产物一致):首次生成 = prefab 编辑模式下**带 Canvas 且未挂窗脚本**的根节点 Inspector 头部按钮「生成UI脚本文件」(`UIScriptGenHeaderButton`,恒写 GameLogic/UI);重生成/绑定 = 面板组件 Inspector 按钮「重新生成 _Gen.g.cs」「按节点名自动绑定 [SerializeField]」(`UIPanelMonoEditor`)。Part 根不带 Canvas,不显示生成按钮——Part 手写,只用菜单 `TEngine/UI 绑定/…` 绑定与校验。

配置:`ScriptGeneratorSetting.asset`(工程仅一份,在 `Assets/Editor/UIScriptGenerator/`;可视化编辑入口 Project Settings → TEngine → UISettings)。生成路径、命名空间、前缀规则表、代码风格全在此;前缀表增改判据(按序 StartsWith 匹配、长前缀在前)见 `naming-rules.md`§UI 节点命名规范。

## 二、图片与图集:SpriteAtlas v2 唯一体系

图集工具链(`Assets/TEngine/Editor/AtlasMakerEditor/`)已在,但本作**还没有任何图集与切图**:`Assets/AssetRaw/UI/` 下只有 `Prefabs/` 与空的 `Texture/`,`Assets/AssetArt/Atlas/` 为空。第一批 UI 图入库时按下表落。

| 环节 | 落点 |
|---|---|
| 源散切图 | `Assets/AssetRaw/UI/Atlas/<模块名>/` 或 `Assets/AssetRaw/UI/NewAtlas/<模块名>/`(两根都在 `ProjectSettings/AtlasConfiguration.asset` 的 `sourceAtlasRootDir` 里),`spriteImportMode=Single`(导入器强制,见下) |
| 打包 | `SpritePostprocessor` 导入时自动触发(配置 `autoGenerate`),无需点菜单 |
| 图集产物 | `Assets/AssetArt/Atlas/<源根目录名>_<子目录名>.spriteatlasv2`(如 `Atlas_Battle.spriteatlasv2`) |
| 运行时取图 | 静态图拖 Source Image 引用;按名换图的组件(block-client 的 `ExImage` / `SpriteBind`)未搬入,见下 |

- **不是每张图都进图集**:整幅背景 / 面板底框 / 主视觉放 `Assets/AssetRaw/UI/Texture/`(`excludeFolder`,不进图集)。归类判据、落点与搬家工序正本 = `.claude/rules-ondemand/ui-image-assets.md`,加图前先读。
- **按名换图还没有设施**:block-client 靠 `ExImage`(绑图集后赋 `SpriteName`)与 `SpriteBind.Bind` 寻址图集子图,本作两者都没搬。图集子图不可按 location 寻址,只能经图集取;要做「随状态换皮」先立项把这套搬进 GameLogic,别在业务里各自 `SpriteAtlas.GetSprite`。交付闸 `图集子图组件核对` 在 `ExImage` 缺席时空过,搬入后才开始拦。
- **导入设置由 `SpritePostprocessor.EnforceImportSettings` 强制,改了会被静默改回**:覆盖面是图集源根 `Assets/AssetRaw/UI/Atlas` 与 `Assets/AssetRaw/UI/NewAtlas` **整个目录**(比图集成员范围宽),每次导入把 `textureType` 钉成 Sprite、`spriteImportMode` 钉成 **Single**,并覆写 WebGL 平台格式与 mipmap;`Assets/AssetRaw/UI/Texture` 另走一套,只钉 Sprite + Single(`EnforceSpriteModeOnly`,个别保留 Multiple 的图登记在 `SpriteModeOnlyExcludedFiles`)。**故一张图切不成 Multiple**,要分出两个 sprite 只能派生成两个 png 文件。`spriteBorder` 不在强制面内,可自由设,但本作没有九宫格推断工具,border 手填。存量图批量刷该设置走菜单 `UITools/图集工具-强制刷新UI源图导入设置`。
- 图集成员由 `EditorSpriteSaveInfo` 按目录自动收集、随导入回调增删,**手改 `.spriteatlasv2` 的 packables 不是正路**(下次导入会按目录重算);要让一张图不进图集,把它移出图集子目录——放在源根**根目录**的图不属于任何子图集,放进子目录会把整张稿子打进该模块图集。另有两条排除口径:路径含 `_Delete` / `_Temp` 关键字,或落在 `Assets/AssetRaw/UI/Texture`。手动重算走菜单 `UITools/图集工具-立即重新生成变动的图集数据`,参数在 `UITools/图集工具-配置面板`。
- `Assets/AssetArt/`(图集产物的落点)是导入期重算的生成物,但**在库**(连 .meta):图集 guid 跨工作树稳定,prefab 上对图集的序列化引用靠它不断。删图 / 加图仍只须动 `AssetRaw` 侧(重算自动增删成员,源目录整个消失时 `DeleteStaleAtlases` 连图集资产一起删)。**新建图集**(连 .meta)随槽位交付入库,guid 在槽位定下;**已跟踪图集**的重算改动(含删除)由 `槽位交付` 在槽位通道不出声地剔除,由**主工作树**导入后经 `单仓提交.ps1 -PathListFile` 收口(理由与判据见 `.claude/devflow/单仓提交.ps1` 该处注释)。
- 图集引用是 prefab 上的序列化字段,不经 YooAsset location 加载;脚本建的图集 stub 须先落定再提交。
- 工程 Sprite Packer 模式须为 SpriteAtlasV2(Project Settings → Editor → Sprite Packer),否则 v2 图集 `spriteCount=0`、`GetSprite` 全返回 null。

## 三、自有 UGUI 组件(搭 prefab 选型)

本作 GameLogic 里的自有 UI 组件只有窗口开关动画一族与倒计时绑定:

| 组件 | 何时用 | 关键契约 |
|---|---|---|
| `UIWindowOpenAnim` 及其子类 `WindowPopInAnim`(`Assets/GameScripts/HotFix/GameLogic/UI/VFX/`) | 窗口入场 / 退场形态 | 挂在窗根,「挂了没有」本身就是开关;弹窗层不挂也有层默认的缩放弹入(`WindowPopIn`)与退场(`WindowPopOut`),那两个由框架 AddComponent,业务不挂。不在弹窗层却要同款弹框表现的窗挂 `WindowPopInAnim`。选型正本 = `.claude/references/tengine/ui-lifecycle.md` |
| `CountdownBinder`(`Assets/GameScripts/HotFix/GameLogic/UI/Common/`) | 文本节点显示倒计时 | 行为以源码头注为准 |

block-client 的 `ExImage` / `ItemContainer` / `LoopGridView`(SuperScrollView)/ 控件模板库都没有搬入;前缀表里还留着它们的前缀,组件到位前不用。

> **纯点击 / 遮挡热区没有专用组件**:用透明 `Image`(sprite 空、`raycastTarget` 开)+ 需要回调时同节点挂 `Button`;
> 纯热区取极低 alpha(0.01),需要遮暗的弹窗遮罩取可见值(0.6 上下)。
>
> **按下 / 抬起 / 拖拽回调也没有专用组件**:`Button.onClick` 之外的指针事件由脚本自己实现
> `IPointerDownHandler` / `IDragHandler` / `IPointerUpHandler` 接口(战斗盘面的拖拽落子按工程计划从 block-client 移植)。
> **长按与按钮音效工程内无现成设施**,要用得先立项做。

字体:**本作还没有正式字体资产**。`Assets/AssetRaw/Fonts/` 是空目录;现有 `UIMainMenuPanel` 的 Text 用 Unity 内置字体(无中文字形);`Assets/Launcher/Resources/Fonts/LauncherFont.otf` 是启动器专用的子集字体,只含启动器源码里出现的字,业务窗**不引用**(超出子集的字画不出来,`启动器字体核对` 只核启动器侧)。TMP 只有自带的 LiberationSans SDF(无中文)。首发要中英双语,中文字体资产要先立项定,在那之前新窗沿用内置字体并在呈报里列为占位项。

## 四、截图与目视自检辅助

- 本作没有离屏截 prefab 的现成工具(block-client 的 `PrefabScreenshot` 未搬入),截图在 `execute_code` 里自写:
  - 无游戏态依赖、带根 Canvas 的静态面板走 EditMode 离屏:自建 1px=1unit 的正交相机 + 把 prefab 根 Canvas 切 WorldSpace 捕获(根 Canvas 须保持启用,禁用会截出空帧;沿用 Screen Space 会被 CanvasScaler 离屏误缩放糊屏),用完销毁临时对象。
  - 游戏态依赖窗(OnCreate 取数)的目视自检:Play 态经 UIRoot 的 UICamera 离屏渲染,不截 GameView。
- **EditMode 离屏渲染不还原 `Mask`**(stencil),离屏截图里 Mask 不裁切,别据此改 prefab;含 Mask 的裁切效果留运行时验证,并列入呈报的「待执行验证点」。`RectMask2D` 不受影响。

## 五、低频/治理工具(知道存在即可,勿重造)

- `AtlasEditorWindow`(菜单 `UITools/图集工具-配置面板`):图集生成参数(源根、排除目录、压缩、padding 等),写 `ProjectSettings/AtlasConfiguration.asset`。
- 菜单 `UITools/图集工具-强制刷新UI源图导入设置` / `UITools/图集工具-立即重新生成变动的图集数据`:见§二。
- 菜单 `TEngine/UI 绑定/全量绑定并校验 UI prefab 引用`、`TEngine/UI 绑定/只校验 UI prefab 引用(不改动)`(`UIPrefabBindingTool`):批量按名绑定与空引用清单。

## 六、运行时设施约束(本段不写业务,但结构决策受其约束)

- **模板取用口径**:UI Part 的 prefab 由宿主 `[SerializeField] GameObject` 直接引用(依赖随宿主 prefab 进 bundle),实例化走 `UIPartFactory`(纯实例化、零资源加载)。本作没有 block-client 的启动预载器 `UIPreloader`,按名取用的 prefab 走资源模块异步加载,口径见 `.claude/references/tengine/resource-api.md`。本段产出「结构性约束」时把这类依赖列给 dev 段。
- CanvasScaler 全工程只在 UIRoot 的 UICanvas 一层(`Assets/TEngine/Settings/Prefab/UIRoot.prefab`,设计分辨率 1920×1080、按高匹配);窗口 prefab 根禁挂 CanvasScaler 的根源即此(禁令正本在 SKILL.md「工作流」第 2 步)。
- 全局轻提示(Toast)本作还没有,`UILayer.Tips` 层已留给它;要提示类需求先立项做,不为单个需求另搭窗。
