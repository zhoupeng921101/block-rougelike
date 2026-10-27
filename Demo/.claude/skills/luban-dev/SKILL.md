---
name: luban-dev
description: Luban 游戏配置全栈：枚举/Bean/数据表的增删改查、导表与代码生成、TEngine 集成。本作尚未接入 Luban，首张表落地前作参考与接入指引。触发：编辑游戏配置数据（方块/基因/科技/改造/关卡数值等）、增删改表结构、定义枚举/Bean/字段、导表、写 luban.conf 或 Schema、Luban 类型与校验器问题、接入 Luban；用户没说「Luban」，只要是编辑配置数据也用。
---

# Luban 数据配置工具

## 本作接入状态（先读）

**Luban 还没有接入本作**。工程里没有表源（`Configs/GameConfig/` 不存在）、没有配置程序集、没有生成物，`Assets/AssetRaw/Configs/` 是空目录；`flow-config.psd1` 的 `LubanGenClientBat` 留空，槽位交付的 Luban 基线自动同步重导步因此跳过。按 `新游戏/工程计划.md`，配置程序集等第一张配置表再建（阶段 5「数值进 Luban 表」）。

- **菜单 `TEngine/Luban/转表` 接入前不要点**：`Assets/TEngine/Editor/LubanTools/LubanTools.cs` 的产物清单还写着 block-client 的 `UnityProject/…` 路径与 Fantasy 服务端路径。
- **下文多数路径与流程是 block-client 的形态**：它的导表流程带数据镜像（`build_data_mirror`）、自定义模板、服务端与 editor 两个额外目标和服务端前置校验，本作单机买断、没有服务端，接入时按单端裁过。下文标「block-client」的条目接入时改写或删掉；没标的（Luban 语法、`luban_helper.py`、各 reference 篇的 Luban 本体知识、`examples/`）是通用件。
- **接入时一并处理的工作流件**：客户端自检少了 block-client 的四道 Luban 检查（配置预载 / 配置表前缀 / 表间引用 / 导表指纹），随表搬回；提交检查的「表文档同步」闸按仓根相对路径 `Configs/GameConfig/Datas/` 认表源（正则在 `.claude/devflow/hooks/校验库.ps1` `TableSrcRe` / `TableDocRe`），表源不放仓根 `Configs/` 时同步改那里；填上 `LubanGenClientBat`。
- **数值口径**：本作数值都还没定标，落表的值按 CLAUDE.md「产品设计基准」折候选、标「待定标」。

## TEngine 项目核心约定（block-client，接入时默认沿用）

- **生成格式**：`cs-bin`（C# 代码）+ `bin`（二进制数据）
- **命名空间**：`GameConfig`（非默认 `cfg`）
- **数据加载**：`ConfigSystem.Instance.Tables` 懒加载，底层走 YooAsset
- **代码位置**：`GameScripts/HotFix/GameProto/GameConfig/`（block-client 的配置程序集 `GameProto`；本作工程计划里叫「配置生成物」程序集，名字接入时定）
- **数据位置**：`AssetRaw/Configs/bytes/`（YooAsset 管理）
- **表定义**：Excel（`__tables__.xlsx`/`__beans__.xlsx`/`__enums__.xlsx`）+ XML Schema（`Defines/`）
- **导出数据 → 使用导出脚本，不要手动拼 dotnet 命令**

### 导出脚本（block-client）

block-client 的脚本位于仓根 `Configs/GameConfig/`，使用相对路径调用。本作只要客户端目标：

| 脚本 | 用途 | 说明 |
|:---|:---|:---|
| `gen_code_bin_to_project_lazyload` | 客户端 | **推荐入口**，AI 调用此脚本 |
| `gen_code_bin_to_project` | 客户端 | 与 `_lazyload` 实质等价（同一套懒加载模板），不是「标准 / 非懒加载」 |

> block-client 另有服务端目标与 editor 目标（服务端脚本前置导 editor 目标并跑服务端校验），一次导表写三处落点；本作不带这两个目标，接入时从 `luban.conf` 与脚本里一并裁掉。

### AI 调用导表命令（block-client）

根据操作系统选择对应扩展名：

**Windows：**（经 PowerShell 工具执行，见 shell-conventions「引擎」节；会话 cwd = Demo，bat 以 `%~dp0` 自锚定）
```powershell
$env:AI_MODE = '1'; & ..\Configs\GameConfig\gen_code_bin_to_project_lazyload.bat
```

**macOS/Linux：**
```bash
bash Configs/GameConfig/gen_code_bin_to_project_lazyload.sh
```

### 新增配置表流程

1. 在 `Datas/__tables__.xlsx` 注册新表
2. 创建 `Datas/xxx.xlsx` 数据表，文件名与 `__tables__.xlsx` 的 `input` 列一致。（block-client 允许加中文备注后缀 `xxx-<备注>.xlsx`，靠导表前的数据镜像脚本 `build_data_mirror` 映射回规范名；本作接入时带不带这一层另定，没带就不能加后缀。）
3. 在 `__beans__.xlsx` / `__enums__.xlsx` 定义复合类型/枚举（可选）
4. 运行导出脚本生成代码和数据
5. **预载清单（block-client）**：block-client 把每张客户端表的 bytes 名加进模板正本 `Configs/GameConfig/CustomTemplate/ConfigSystem.cs` 的 `ConfigSystem.TableAssetNames` 启动期预载，因为 WebGL 禁同步加载。本作 PC 首发、同步加载可用，要不要保留预载清单接入时随模板定；保留的话照此做，并把对应的自检道一起搬回。
6. 在 `GameLogic/Config/` 封装 `XxxConfigMgr`
7. 在 `Configs/GameConfig/Datas/配置表说明.md` 增补该表的说明节(用途 + 字段表 + 枚举取值)

### 配置管理禁止事项

- **不要直接修改** `GameProto/GameConfig/` 下的生成代码
- `GameProto/ConfigSystem.cs`、`GameProto/ExternalTypeUtil.cs` 的正本是 `Configs/GameConfig/CustomTemplate/` 下同名文件:客户端导表(含交付合并后的自动重导)整份拷贝覆盖,只改 Assets 副本会被冲掉。改模板再重导(block-client 由自检 `配置预载核对` 拦两份分叉,本作该道未搬)
- 复杂模块封装 `XxxConfigMgr`，业务代码通过管理器访问
- 新增字段前向兼容，删除/改名字段不兼容
- **增删改表字段 / 枚举 → 同步更新 `Configs/GameConfig/Datas/配置表说明.md` 对应节**(字段名 / 类型 / 说明 / 枚举取值),与 xlsx 改动同一次完成,勿留失配。该说明文档是策划查阅字段语义的单一入口,漏更即过时误导。本条由提交检查机器强制:提交含 `Datas/*.xlsx` 而不含该文档即拒;确无字段语义变化(仅样式/格式/重排)时提交信息补「[表文档无关:理由]」放行。
- **代码给某配置字段新增或改变取值语义(加一档枚举值 / 加一个特殊值 / 改字段间约束)→ 回头核对该字段在两处文档的描述**:表源第三行的 `##` 列注释 + `配置表说明.md` 对应行,与代码改动同一次完成。**上一条的机器闸在此不生效**——它按「提交含 `Datas/*.xlsx`」触发,而这类改动常常一个字节的表源都不碰,漏更没有任何拦截,只靠本条卡纪律。
  - **核对面不止该字段自己那一行,引用它的其他字段行同样被波及**:加档前先 grep 该字段名,把提到它的行一并过一遍。
    > block-client 2026-08-21 给某表的时间类型字段加一档时,只更新了说明文档的该字段行,另一字段行那句「仅取值 1 时生效」当场变成错述(新档也读那个字段且必填),表内两列 `##` 注释则一起停在旧档位时代,五天后才被发现。
  - 表内 `##` 注释会原样进生成物的 C# XML 注释,是程序员在 IDE 里唯一看得到的那份;`配置表说明.md` 才是硬约束正本。**两处分工写法**:`##` 注释写全档位枚举(填表现场必需、低频变动)+ 一句指向说明文档,长约束别抄进去——抄一份就是养第二份正本,下次改一处忘另一处。

---

## 配置表操作工具（luban_helper.py）

通过 Python 脚本直接 CRUD Excel 配置表，无需手动编辑 xlsx。

### 前置条件

Python 3.8+，`pip install openpyxl`

### 执行方式

```bash
python scripts/luban_helper.py --data-dir Configs/GameConfig/Datas <command>
```

`--data-dir` 必须放在子命令之前。PowerShell 中用 `;` 分隔命令，JSON 参数推荐用 `--file` 从文件读取。

**参数类型**：位置参数（大写，如 `NAME`、`TABLE`）直接传值，不加 `--` 前缀；可选参数带 `--` 前缀。例如 `table get test.TbItem`（正确）而非 `table get --name test.TbItem`（错误）。

### 命令速查

| 分类 | 命令 | 功能 |
|------|------|------|
| 枚举 | `enum list/get/add/update/delete` | 枚举 CRUD |
| 结构 | `bean list/get/add/update/delete` | Bean CRUD |
| 表 | `table list/get/add/update/delete` | 表 CRUD |
| 字段 | `field list/add/update/delete/disable/enable` | 字段操作 |
| 数据 | `row list/get/query/add/update/delete` | 数据行操作 |
| 批量 | `batch fields/rows` | 批量操作 |
| 导入导出 | `export/import` | JSON 导入导出 |
| 验证 | `validate` / `ref` | 数据验证 / 引用检查 |
| 类型 | `type list/validate/suggest/search/guide/info` | 类型系统 |
| 自动 | `auto list/create` | 自动导入表（`#` 前缀，不推荐） |
| 管理 | `rename/copy/diff/template` | 表管理工具 |

### 操作规范

- **只读操作**（list/get/query/search）：直接执行
- **写入操作**（add/update/delete）：槽位内写表属任务授权范围，不逐次确认；在主工作树直接写表先经用户确认（通道判据见 CLAUDE.md「devflow 适用面」）。表源若放仓根 `Configs/`，注意槽位只稀疏检出 `Demo/` 与 `新游戏/`（`flow-config.psd1` `SlotSparseDirs`），接入时要把表源目录加进去
- **删除操作**：先 `ref` 检查引用；连数据文件一起删（`--delete-data`）先经用户确认
  - `table delete NAME`：NAME 为全名精确匹配，或不带模块的短名精确匹配；短名命中多张表时报错列出候选，改用全名。
  - 连数据文件一起删须 `table delete NAME --delete-data --yes`；只给 `--delete-data` 不删任何东西，打印将删除的表定义行与数据文件后以非零退出，可当预演用。
- **修改前**：先 `table get` / `field list` 确认结构，`row get` 避免主键冲突
- **修改后**：用 `validate` 验证
- **含公式的表**：xlsx 的公式单元格存两份东西——公式 `<f>` 与上次算出的缓存值 `<v>`，而 **Luban 与读表的静态扫描读的是缓存值**（它们不算公式）。openpyxl 存盘只保留公式、丢掉缓存值，那一列对机器就成了空。本脚本的所有写操作已统一走 `_save_workbook()`，存盘后自动把缓存值补回仍是公式的单元格，命中时打印「已保留 N 个公式单元格的缓存值」。**看到那行提示就要判断一次**：补回的是**改动前**的值，本次改动若会改变公式的计算结果（例如改了被公式引用的单元格），需用 Excel 打开该表重算后另存，否则表里留着的是过期值。做错的后果：公式列对 Luban 静默变 0（如某列写成 `=C15+1` 这类递推公式）。读操作 `row list/get/query` 同口径输出与比较缓存值；无缓存值的公式格输出 `null`，stderr 列出这些格与公式。
  - **会移动行/列的写操作**（`row delete`、`row add` 按 id 插到中间、`field add --position`、`field delete`、`variant add`、多行注释插行等）统一走 `_shift_sheet()`：全簿里受影响的公式引用按移位规则改写（含 `$` 绝对引用、`Sheet!` 限定、整行/整列引用、其他 sheet 引用本 sheet），缓存值按新地址补回，打印「行/列移位已同步改写 N 个公式的引用」。只做**纯平移**——被引用的格子整体随移位搬走、内容不变，公式结果才保证不变。以下情形**整条命令拒绝、文件不动**，报错列出受影响的公式格与原因：引用了被删的行/列；区域会被插入撑大或被删除截断（如 `SUM(C5:C200)` 中间插/删行）；公式所在格要移动且含无参 `ROW()`/`COLUMN()`；含 `INDIRECT()`、命名区域、结构化引用、三维引用、数组公式。被拒时的替代：用 Excel 手工增删（Excel 会改写引用并重算）后另存，或先 `row update` 把受影响的公式格改成字面值再重跑。定义名称、条件格式、数据验证、合并单元格的地址不随移位改写（openpyxl 限制；本仓表未用）。

### 分组自动推断

添加字段时不指定 `--group`，自动推断：
- `c`（客户端）：name, desc, icon, image, model, effect, sound, ui 等
- `s`（服务器）：server, logic, damage, hp, mp, exp, level, rate 等
- `c,s`（两端）：id, 其他无法判断的字段

本作只有客户端一个导出目标：接入时若 `luban.conf` 只留 `c` 分组，`s` 分组的字段不会导出——添加字段一律显式给 `--group c`（或接入时把分组收成单组），别依赖自动推断。

---

## 参考文档（按需加载）

| 场景 | 文档 | 内容 |
|------|------|------|
| TEngine 集成 / ConfigSystem / 生成脚本 / 兼容性 | [tengine-integration.md](references/tengine-integration.md) | 项目结构、加载器、导出脚本、Excel规范 |
| 操作工具命令详解 / Excel结构 / 数据填写格式 | [operating-guide.md](references/operating-guide.md) | luban_helper.py 完整命令参考 |
| 类型系统和语法 | [type-system.md](references/type-system.md) | 基础/容器/自定义/可空类型、Mapper、constalias |
| Schema 定义（XML/Excel）/ 多态规范 | [schema.md](references/schema.md) | enum/bean/table 定义、字段属性、多态bean、flags约束 |
| luban.conf 配置 | [luban-conf.md](references/luban-conf.md) | 完整配置项、分组策略、级联选项、topModule |
| 校验器类型和用法 / ref行为 | [validators.md](references/validators.md) | ref/range/path/size/set/index/!、Ref字段命名、ResolveRef |
| Excel 数据格式 | [excel-format.md](references/excel-format.md) | 标题行、容器格式、多态、标签 |
| CLI 命令行参数 | [command-reference.md](references/command-reference.md) | 完整参数列表、代码/数据目标、--variant/--timeZone |
| JSON/XML/YAML/Lua 数据源 | [data-sources.md](references/data-sources.md) | 非Excel数据源格式、多态鉴别符 |
| 运行时加载 / 类型映射 / 本地化工作流 | [runtime.md](references/runtime.md) | Unity加载、代码风格、本地化完整流程 |

示例：`examples/tengine-project/`（TEngine 完整示例）、`examples/item-system/`（CSV+XML）、`examples/skill-system/`（JSON+多态）

脚本：`scripts/luban_helper.py`（操作工具）、`scripts/requirements.txt`（依赖）

官方文档：https://www.datable.cn/docs/intro
