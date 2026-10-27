# TEngine Luban 配置表指南

> **适用场景**：ConfigSystem/Tables 访问配置数据、Excel 数据表字段定义、Luban 代码生成流程、配置表初始化与预加载 | **关联文档**：[architecture.md](architecture.md)（AssetRaw/Configs 目录）、[resource-api.md](resource-api.md)（配置文件加载）

## 接入状态

**本作尚未接入 Luban**：仓里没有 `Configs/GameConfig/` 配置工程，`Assets` 下没有 `GameConfig` 程序集、`ConfigSystem` 与导表产物，`flow-config.psd1` 的 `LubanGenClientBat` 留空（槽位交付的 Luban 重导步因此跳过）。按 `新游戏/工程计划.md`，配置程序集等第一张配置表时建，数值进表在阶段 5。

下文写的是 block-client 的接法，作接入时的参照。接入时按单端裁过，裁完以本作实际重写本篇：

- **去服务端目标**：block-client 的 `luban.conf` 带 server / client / all / editor 四个 target、服务端导表脚本与投放配置校验工具 `OfferCfgCheck`；本作只要 client 目标。
- **定 group 用不用**：block-client 用表级 / 字段级 `group`（`c` / `s` / `e`）与文件名前缀区分端归属；单端下这套可以整体不要，或固定为 `c`，接入时定。
- **数据镜像与自定义模板**：block-client 导表前先跑数据镜像（`build_data_mirror`，允许文件名带中文备注后缀），`ConfigSystem.cs` / `ExternalTypeUtil.cs` 出自 `CustomTemplate/`；要不要沿用接入时定。
- **编辑器菜单路径**：`TEngine/Luban/转表`（`Assets/TEngine/Editor/LubanTools/LubanTools.cs`）里的产物路径还写着 `UnityProject/`，接入时改成 `Demo/`。
- **客户端自检**：block-client 有配置预载 / 配置表前缀 / 表间引用 / 导表指纹四道 Luban 静态核对，本作的客户端自检没带，接入时随表一起搬回。

---

## 核心 API

### 技术栈

- **Luban**：Excel/JSON/YAML → C# 代码 + 二进制数据
- **生成格式**：`cs-bin`（C#）+ `bin`（二进制）
- **数据位置**：`Assets/AssetRaw/Configs/`（YooAsset `Configs` 组已在收集器里）
- **代码位置**：配置程序集 `GameConfig`（热更，建时定目录；block-client 是 `GameScripts/HotFix/GameProto/GameConfig/`）

---

### ConfigSystem 加载器

> `ConfigSystem.cs` 需从 Luban 模板生成（`luban-dev` skill 的 CustomTemplate/），不在 Assets 默认目录中。

block-client 模板的行为要点：

- **预载优先**：模板内维护 `TableAssetNames` 资产名清单；启动时 `PreloadAsync()` 把清单内全部 .bytes 读进字节缓存，`LoadByteBuf` 命中缓存直接返回。
- **运行时禁同步保障**：未预载的表在运行时访问直接抛异常（为 WebGL 禁同步加载而设）；仅编辑器环境允许同步加载回退。本作首发 Windows、资源随包，这条保障要不要留，接入时定。
- **初始化时机**：入口接线里先 `ConfigSystem.Instance.Load()` 再 `await PreloadAsync()`，以预载完成作为入口放行检查。
- ConfigSystem 位于配置程序集，取资源用 `ModuleSystem.GetModule<IResourceModule>()`（非 `GameModule.Resource`——配置层不依赖业务层），延迟获取并缓存。

---

### 配置数据访问

```csharp
var tables = ConfigSystem.Instance.Tables;

// 按 ID 查询（map 模式）
var itemCfg = tables.TbItemDef.Get(1001);

// 遍历所有行
foreach (var item in tables.TbItemDef.DataList) { }

// 条件查询（枚举生成在业务域子命名空间下，引用带全名）
var materials = tables.TbItemDef.DataList
    .Where(i => i.Type == GameConfig.item.EItemType.MATERIAL).ToList();
```

#### 配置管理器封装（推荐）

复杂模块封装配置管理器，不直接在业务代码散落 `ConfigSystem.Instance.Tables.TbXxx`：

```csharp
public class LevelConfigMgr
{
    public static LevelConfigMgr Instance => _instance ??= new LevelConfigMgr();
    public PlayerLevel GetLevel(int id) => ConfigSystem.Instance.Tables.TbPlayerLevel.GetOrDefault(id);
    public List<PlayerLevel> GetRewardLevels() => ConfigSystem.Instance.Tables.TbPlayerLevel.DataList.Where(l => l.Reward > 0).ToList();
}
```

---

## 使用模式

### 配置工程结构（block-client 形态）

```
Configs/GameConfig/                       # 位于仓根
├── luban.conf                            # Luban 主配置（topModule=GameConfig）
├── gen_code_bin_to_project_lazyload.bat  # 客户端导表（配套懒加载模板）
├── Datas/                                # Excel 数据源
│   ├── __tables__.xlsx                   # 表索引（注册所有表）
│   ├── __beans__.xlsx                    # Bean 复合类型
│   ├── __enums__.xlsx                    # 枚举类型
│   ├── 配置表说明.md                     # 命名规约正本
│   └── item_def.xlsx                     # 业务数据表（文件名由 full_name 派生）
├── Defines/builtin.xml                   # 内置 Bean（vector2/3/4、vector2int/3int），由 luban.conf schemaFiles 引用
└── CustomTemplate/                       # 自定义模板（ConfigSystem.cs / ExternalTypeUtil.cs 的唯一正本）
```

### 数据表定义

#### __tables__.xlsx 表索引

列序（A→K）：`##var` `full_name` `value_type` `read_schema_from_file` `input` `index` `mode` `group` `comment` `tags` `output`。A 列是 Luban 标记列（表头行写 `##var` / `##`，数据行留空）。

| full_name | value_type | read_schema_from_file | input | index | mode | comment |
|-----------|-----------|----------------------|-------|-------|------|---------|
| item.TbItemDef | ItemDef | True | item_def.xlsx | id | map | 道具定义表 |

- `full_name`：`业务域.表名`（topModule=GameConfig，模块前缀取业务域）→ 生成 `Tables.TbXxx`
- `read_schema_from_file`：`True` = 字段定义从数据 xlsx 的表头行读
- `index`：主键字段名。`mode=map` 时必填；`mode=list` 时留空
- `mode`：`map`（按 index 索引）/ `list`（列表）/ `one`（单例）。留空自动为 `map`
- `input`：数据文件名，由 `full_name` **派生**，不自由起名 —— 见下方「添加新配置表」
- `tags` / `output`：`output` 空时默认 `<module>_<name>.bytes`

#### Excel 数据行结构

**表头行由 A 列的 `##` 标记识别，不按行号定位**——标记行之间可任意排序，A 列留空即视为数据行开始。

```
A 列标记      B 列起
##var    │ id      | name   | rewards                        ← 字段名
##type   │ int     | string | (list#sep=|),reward.RewardEntry ← 类型
##       │ 道具id  | 名称   | 奖励列表                        ← 注释（A 列只写 ## 无后缀）
（空）   │ 30001   | 经验宝箱 | Currency,3,510                ← 数据行，可多行
```

用了 `group` 时另有一行 `##group`（字段级端归属，多端写 `c,s` 而不是 `cs`）。

---

### 代码生成

导表脚本在 `Configs/GameConfig/` 目录下运行（block-client 客户端恒用 lazyload 版，配套懒加载模板与 `TableAssetNames`）：

```bat
gen_code_bin_to_project_lazyload.bat
```

生成产物：
```
GameConfig 程序集目录 → Tables.cs, ItemDef.cs, item.TbItemDef.cs, item.EItemType.cs, ...（自动生成，勿手改）
                      + ConfigSystem.cs, ExternalTypeUtil.cs（从 CustomTemplate/ 静态拷贝）
AssetRaw/Configs/     → item_tbitemdef.bytes, ...（名 = <module>_<name> 小写）
```

---

### 类型支持

下表是 `##type` 行的写法形态。枚举与 Bean 同样可加 `?` 表可空（如 `reward.ERewardType?`）；类型后可跟校验器（`int#ref=item.TbItemDef`、`int#range=[1,5]`，用法见 luban-dev 的 `references/validators.md`）。

| `##type` 写法 | C# 类型 | 单元格示例 |
|-----------|---------|------|
| `int` | `int` | `100` |
| `int?` | `int?` | 留空 = null |
| `long` | `long` | `1000000` |
| `float` | `float` | `1.5` |
| `bool` | `bool` | `True` |
| `string` | `string` | `剑士` |
| `item.EItemQuality` | 枚举（`GameConfig.item.EItemQuality`） | `WHITE` |
| `reward.RewardEntry` | Bean 类 | `Currency,2,50`（字段按 Bean 的 `sep` 分隔） |
| `(list#sep=\|),reward.RewardEntry` | `List<RewardEntry>` | `Currency,3,510\|Item,30013,1` |
| `(list#sep=,),int` | `List<int>` | `1,2,3` |
| `(array#sep=,),int` | `int[]` | `1,2,3` |

- 容器写法是 `(list#sep=X),元素类型` / `(array#sep=X),元素类型`——**没有 `int[]` 这种后缀写法**。`#sep` 省略时（如 `(list),int`）用列的默认分隔。
- 枚举与 Bean 一律写**全名**（`业务域.类型名`），与 `__enums__.xlsx` / `__beans__.xlsx` 的 `full_name` 列一致。
- `vector2/3/4`、`vector2int/3int` 在 `Defines/builtin.xml` 有定义，但 block-client 的 `CustomTemplate/ExternalTypeUtil.cs` 把转换方法全注释掉了（无字段使用，留着会让 GameConfig 程序集编译失败）。真要用先恢复该文件对应方法。

---

### 添加新配置表

```
1. __tables__.xlsx 注册新表：full_name=业务域.TbNewTable, value_type=NewTableRow,
   read_schema_from_file=True, index=id, mode=map, input=数据文件名（派生，见第 2 步）
2. 创建 Datas/<派生文件名>.xlsx，按「Excel 数据行结构」加 ##var/##type/## 三行与数据
   文件名主干 = 表名去 Tb 后转 snake_case（TbItemDef → item_def），业务域不进文件名。
   用 luban-dev skill 的 luban_helper.py 建表会自动推导并回填 input 列，不必手写。
3. （如需）在 __beans__.xlsx 定义 Bean
4. 沿用预载模板时，同步 CustomTemplate/ConfigSystem.cs 的 TableAssetNames 清单
5. 导表：gen_code_bin_to_project_lazyload.bat
6. 验证：GameConfig 程序集目录下新增文件，AssetRaw/Configs/ 下新增 .bytes
7. 创建 Config/NewTableConfigMgr.cs 封装查询方法
```

---

## 常见错误

| 错误 | 原因 | 修复 |
|------|------|------|
| ConfigSystem.cs 找不到 | 该文件不在 Assets 默认目录 | 需从 Luban CustomTemplate 模板生成，或通过 `luban-dev` skill 创建 |
| `GameModule.Resource` 在配置程序集中不可用 | 配置层不依赖业务层 GameLogic | ConfigSystem 使用 `ModuleSystem.GetModule<IResourceModule>()` |
| `_resourceModule` 为 null | Load() 在模块系统初始化前调用 | 确保在热更入口（`GameApp.Entrance`）之后调用 |
| .bytes 加载失败 | 文件未在 YooAsset 收集器中 | 检查 AssetBundleCollectorSetting 中 `Configs` 组（`Assets/AssetRaw/Configs`）的收集规则 |
| Tables 为 null | 未调用 ConfigSystem.Instance.Load() | 懒加载会在首次访问 Tables 时自动 Load；沿用预载模板时确认表名在 `TableAssetNames` 内且 `PreloadAsync()` 已完成 |

---

## 交叉引用

- 架构总览见 [architecture.md](architecture.md)
- 热更开发见 [hotfix-workflow.md](hotfix-workflow.md)
- 资源加载见 [resource-api.md](resource-api.md)
- 问题排查见 [troubleshooting.md](troubleshooting.md)
