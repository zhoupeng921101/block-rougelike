# ugui-widgets.md — 多节点控件手搭手册

> 搭 UGUI prefab 时多节点控件的**结构、交叉引用与工程强约束**。block-client 有一套控件模板库
> (`Assets/Editor/UIWidgetLibrary/`,`UIWidgetLibrary.Clone` 一次克隆 + 改名 + 保存),本作**还没有搬入**,
> 下列控件一律经 MCP 手搭,搭完逐项对照本文核交叉引用。库搬入后本文改回取用手册。
>
> 本文只写**工程强约束**——每条都能指到工程里的代码、配置或已发生过的故障。UGUI 通用知识不在此复述。

## 手搭通则

- **建好即改成带前缀的语义名**:中性结构名(`Button` / `Text` / `Viewport`)只用于不被代码引用的内部节点。
  命名风格随生成器:`m_btn_Close` 这样**前缀后接下划线再接语义名**。前缀表按 StartsWith 匹配,驼峰写法也能过,但与生成物不齐。
- **新名在窗内必须唯一**:工程 UI 走按节点名绑定(`ScriptGenerator.FindNodeByNameWithWidgetBoundary`),重名会绑错引用,且只在运行期显形。
- 写 prefab 的 `execute_code` 首行置落点守卫(正本 = unity-check「槽位分工与占用」):漂到别的槽位就是写进另一个任务的 prefab,工具照常回 OK。
- 用 `DefaultControls.CreateXxx` 起手省事,但它给的默认值有几处与本文冲突(ScrollRect 的 `Mask`、Text 的 Truncate、各处默认尺寸),起手后按下文逐条改。

## 各控件

### Button — 前缀 `m_btn`

```
Button [Image, Button]
  └ 文字 [TextMeshProUGUI(主字体资产,raycastTarget 关), LocalizedText]
```

- `targetGraphic` 接到自身 Image。**别删那个 Image**——删了按钮没有点击反馈图形,且 Raycast 目标也没了。
- 子文字节点若代码不引用就保持无前缀名;要引用则改成 `m_tmp_Xxx` 且窗内唯一。先例:`UIMainMenuPanel` 的 `m_btn_Language`。
- 纯点击热区、不要图 → 不搭本控件,改用透明 `Image` + 同节点 `Button`,做法见 `ui-tools.md`§三。

### ScrollRect — 前缀 `m_scroll`

```
ScrollRect [Image, ScrollRect]
  ├ Viewport [Image, RectMask2D]
  │   └ Content
  ├ Scrollbar Horizontal → Sliding Area → Handle
  └ Scrollbar Vertical   → Sliding Area → Handle
```

- ScrollRect 上 `viewport` / `content` / 两条 Scrollbar 引用逐个接上,漏接 `content` 拖不动、不报错。
- **命名注意**:前缀表里 `m_scrollBar`(→Scrollbar)排在 `m_scroll`(→ScrollRect)之前,按序 StartsWith 匹配。
  给 ScrollRect 起名不能以 `m_scrollBar` 开头,否则会被判成 Scrollbar、生成错类型的字段。
- 动态列表内容挂 `Content` 下,搭建期留空容器,运行时由 dev 段代码填。
- 用不到的 Scrollbar 不搭(或删节点,ScrollRect 上对应字段自动变 None),**但此时 `Viewport` 必须铺满**:anchorMin (0,0)、anchorMax (1,1)、sizeDelta (0,0)。Viewport 的尺寸若靠滚动条的 `AutoHideAndExpandViewport` 驱动,序列化值是 0×0;滚动条一删驱动消失,视口塌成 0×0 被 `RectMask2D` 全裁,症状是列表整片空白、不报错。
- `Viewport` 上的 `RectMask2D` 是裁剪来源,删了内容会溢出容器。
- `Viewport` 的 `Image` 是**视口空白处的 raycast 底板**(sprite 空、alpha 0.01),内容不铺满视口时靠它接住拖拽,别删。

### Toggle — 前缀 `m_toggle`

```
Toggle [Toggle]
  ├ Background [Image]
  │   └ Checkmark [Image]
  └ Label [Text]
```

- 两个图形引用别搞混:`graphic` = Checkmark(勾选态显隐的那个),
  `targetGraphic` = Background(点击反馈的那个)。
- **根高要给所用字体的行高留余量**:压到行高以下 Label 整行消失、Console 无报错。Label 纵向拉伸,不在客户端自检「文本截断核对」覆盖内(该道跳过纵向拉伸锚点),只能靠本条。
- 多选一分组用 `ToggleGroup`,前缀 `m_group`。

### Slider — 前缀 `m_slider`

```
Slider [Slider]
  ├ Background [Image]
  ├ Fill Area → Fill [Image]
  └ Handle Slide Area → Handle [Image]
```

- `fillRect` / `handleRect` 要接上。**改这两级的层级结构会断引用**,要改先记下再重接。
- 只做展示、不给玩家拖的进度条按下文「进度条」搭,不是本件。

### InputField — 前缀 `m_input`

```
InputField [Image, InputField]
  ├ Placeholder [Text]
  └ Text [Text]
```

- InputField 上 `textComponent` 接 `Text`、`placeholder` 接 `Placeholder`,漏接输入不显示、不报错。
- 用 **legacy InputField**,不用 TMP_InputField。前缀表里 `m_tmpInput` 存在,但 TMP 只有自带的 LiberationSans SDF,无中文字形。
- `Text` / `Placeholder` 上下 offset 取 4/4 一类小值(非 Unity 默认 6/7),高度紧时默认值会把文字挤没;以所用字体实看为准。
- **InputField 的值变化回调要自己在 impl 里接**,`_Gen.g.cs` 只生成字段(挂事件范围见 `ui-tools.md`§一)。

### Text — 前缀 `m_text`

```
Text [Text]
```

- 新界面不再建旧版 `Text`:文字一律 TMP(`m_tmp`)挂主字体资产,口径见 `ui-tools.md`「字体」段。本节只管存量的旧版 `Text`。
- `verticalOverflow` / `horizontalOverflow` 设 Overflow。留 Truncate 时,
  一旦容器高度装不下行高,整行文字会被丢弃(不是截一半,是一个字都不画);客户端自检「文本截断核对」只拦得到非拉伸锚点的那部分。

### 页签组 — 前缀 `m_group`

```
页签组 [ToggleGroup, HorizontalLayoutGroup]
  ├ Tab1 [Toggle]
  │   ├ Background [Image 铺满] > Checkmark [Image 铺满]
  │   ├ TextOff [Text 未选中样式]
  │   └ TextOn  [Text 选中样式]
  ├ Tab2 [同上]
  └ Tab3 [同上]
```

页签 / 菜单栏组。各 Toggle 的 `group` 全部接到根的 `ToggleGroup`,**互斥由组件承担**,不必写代码管。

- **底板式结构**:Background(未选中底)与 Checkmark(选中底)都铺满整个 Tab,Toggle 的 `graphic` = Checkmark,
  选中时 Checkmark 盖住 Background。
- **文字是两套节点,显隐要自己接**:`Toggle` 只把 `graphic` 自身 CanvasRenderer 的 alpha 归零,
  **不传给子节点**——文字挂在 Checkmark 下也不会跟着隐,必须在 Toggle 回调里显隐。
  接错症状:切页签时底图切了、文字不切。回调里 `if (!isOn) return;`(切页签会让两个 Toggle 各回调一次,被关掉的那次不做事),
  四个文本节点的 `SetActive` 收在一个方法里算。
- **复位页签别用 `isOn = true` 赋值**:关窗时本就停在该页签时该值未变,回调一次都不触发,
  文字与内容会漏刷。用 `SetIsOnWithoutNotify` 摆组件态 + 显式刷一次。
- **命名**:每个 Tab 改成 `m_toggle_Xxx`,两套文本改成 `m_text_XxxOn` / `m_text_XxxOff`(代码要引用它们);同窗两组页签不得重名。
- `allowSwitchOff` 默认 false = 必须有一个选中,正是页签语义;Tab1 预置 `isOn = true` 且其 TextOn 可见。

### 进度条(纯展示)— 前缀 `m_slider`

```
ProgressBar [Slider]
  ├ Background [Image]
  └ Fill Area → Fill [Image]
```

- 与 `Slider` 同构,但**不搭 Handle Slide Area**,`handleRect` 留空。
- **`interactable = false`**——开着玩家就能拖动展示条改数值。
- `minValue/maxValue = 0/1`、`direction = LeftToRight`;运行时直接赋 `slider.value`(0~1)。竖向条改 `direction`(自顶向下 = `TopToBottom`),赋值口径不变。

## 进度条选型

线性进度一律按上节搭 Slider 形态,横条竖条同此一形、不另搭填充节点;item / cell 内的填充条不例外。
`Image.fillAmount`(`type = Filled`)只留给径向进度与扇形冷却。

- **九宫格圆角条不用 fillAmount**:`Filled` 忽略九宫格边,圆角被拉变形;Fill 的 Image 保持 `Sliced`,由 Slider 改锚点伸缩。
- **填充条尺寸落 `Fill Area`,不落 `Fill`**:`Slider` 每次改写 Fill 两轴锚点,写在 `Fill` 上的尺寸被无声覆盖。
- **别拿 Fill 的 `sizeDelta` 兜最小宽度**:锚点不等时它是偏移不是宽度,进度 0 露一截、满进度溢出,且不报错;border 超长时 Unity 自动压缩,不必兜。

## 本作没有的

| 要什么 | 怎么办 |
|---|---|
| Image / RawImage / CanvasGroup / 三种 LayoutGroup | 单组件节点,直接 `manage_components` 加 |
| 列表 / 网格铺 item | block-client 的 `ItemContainer`(模板重复容器)与 `LoopGridView` / `LoopListView`(SuperScrollView 虚拟列表)都未搬入。量小的由宿主持模板引用、经 `UIPartFactory` 实例化;量大到要回收复用的先立项搬 SuperScrollView,不在业务里自写虚拟列表 |
| Dropdown | 前缀表只有 `m_tmpDropdown` 无 legacy 项,要做就用 `TMP_Dropdown`,文字挂主字体资产;本篇还没有它的手搭条目 |
| 弹窗壳 / 列表行 等业务复合件 | 参照既有 panel 手搭 |

## 全局约束(手搭一律适用)

- 命名、图片组件、窗口根禁挂 `CanvasScaler` 的正本分别在 `naming-rules.md`§UI 节点命名规范、`ui-tools.md`§二、`devflow-ui/SKILL.md`「工作流」第 2 步。
- **遮罩一律 `RectMask2D`,不用 `Mask`**:前者走 shader clip rect,不占 stencil、不产生额外 draw call。
  只有真需要按 sprite alpha 做**不规则**遮罩时才用 `Mask`——滚动视口不属于该场景。
  两处坑:①`DefaultControls.CreateScrollView` 起手默认给的是 `Mask`,须手动换掉;
  ②`Mask` 依赖同节点 Graphic 定义遮罩形状,故它挂的 Image 带 `UIMask` sprite,换 `RectMask2D` 后
  **该 sprite 必须清空**,否则不再作遮罩用的它会直接渲染成一个白色圆角框。
