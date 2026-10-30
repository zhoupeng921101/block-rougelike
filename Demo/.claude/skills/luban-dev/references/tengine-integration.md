# TEngine 框架 Luban 集成指南

> **本作尚未接入 Luban**(接入状态与接入时要一并处理的工作流件见 SKILL.md「本作接入状态」)。本篇写的是 block-client 已跑通的集成形态,作为接入时的默认方案;标「block-client」的段落是它独有、本作单机不需要或要另定的部分。

## 概述

TEngine 项目使用 Luban 作为配置表方案,生成格式为 **cs-bin**(C# 代码)+ **bin**(二进制数据),通过 YooAsset 资源系统加载二进制数据。block-client 的生成代码位于热更程序集 `GameScripts/HotFix/GameProto/`;本作工程计划把它叫「配置生成物」程序集,等第一张表时建,程序集名与是否进热更清单接入时定(现在热更程序集是 GameRules 与 GameLogic)。

## 项目目录结构(block-client 形态)

```
Configs/GameConfig/                           # 配置工程根目录(仓根下)
├── luban.conf                                # Luban 主配置文件
├── gen_code_bin_to_project.bat               # 客户端代码+数据(与 _lazyload 实质等价)
├── gen_code_bin_to_project_lazyload.bat      # 客户端代码+数据(推荐入口)
├── Defines/                                  # XML Schema 定义
│   └── builtin.xml                           # 内置类型(vector2/vector3 等)
├── Datas/                                    # Excel 数据源目录
│   ├── __tables__.xlsx                       # 表注册索引
│   ├── __beans__.xlsx                        # Bean 复合类型定义
│   ├── __enums__.xlsx                        # 枚举类型定义
│   └── item.xlsx                             # 业务数据表(示例)
└── CustomTemplate/                           # 自定义代码生成模板
    ├── ConfigSystem.cs                       # 配置加载器模板(非自动生成)
    ├── ExternalTypeUtil.cs                   # Unity 类型转换工具(非自动生成)
    └── CustomTemplate_Client_LazyLoad/       # 懒加载表模板
        └── cs-bin/tables.sbn

Tools/Luban/                                  # Luban 工具链
└── Luban.dll                                 # Luban 主程序

Demo/Assets/
├── GameScripts/HotFix/GameProto/             # 配置程序集(生成代码)
│   ├── ConfigSystem.cs                       # 配置加载器
│   ├── ExternalTypeUtil.cs                   # Unity 类型映射
│   └── GameConfig/                           # Luban 自动生成的代码
│       ├── Tables.cs                         # 表管理类
│       └── item/                             # 按模块组织的生成代码
│           ├── TbItem.cs                     # 表类
│           ├── Item.cs                       # 数据类
│           ├── ItemExchange.cs               # 关联数据类
│           └── EQuality.cs                   # 枚举类
└── AssetRaw/Configs/bytes/                   # 二进制配置数据(YooAsset 管理)
    └── item_tbitem.bytes                     # Item 表二进制数据
```

block-client 另有服务端与 editor 两个导出目标(`gen_code_bin_to_server` / `gen_code_bin_to_editor`,产物分别落服务端仓与 `Assets/Editor/GameConfigEditor/`),本作不带。

## luban.conf 配置

项目使用 Excel 定义方式(`__tables__.xlsx`/`__beans__.xlsx`/`__enums__.xlsx`),搭配 XML Schema(`Defines/`)。本作只有客户端一个目标,接入时可收成:

```json
{
    "groups": [
        {"names": ["c"], "default": true}
    ],
    "schemaFiles": [
        {"fileName": "Defines", "type": ""},
        {"fileName": "Datas/__tables__.xlsx", "type": "table"},
        {"fileName": "Datas/__beans__.xlsx", "type": "bean"},
        {"fileName": "Datas/__enums__.xlsx", "type": "enum"}
    ],
    "dataDir": "Datas",
    "targets": [
        {"name": "client", "manager": "Tables", "groups": ["c"], "topModule": "GameConfig"}
    ]
}
```

block-client 的同一文件另有 `s`(服务端)、`e`(编辑器)两个分组与 `server` / `all` 目标。

**关键约定**:
- `topModule` 为 `GameConfig`,生成代码命名空间为 `GameConfig.xxx`
- 代码输出目标:`cs-bin`,数据输出目标:`bin`

## 代码生成脚本(导出数据的唯一入口)

**导出数据时,始终使用项目提供的脚本,不要手动拼接 dotnet 命令。**

脚本位于 `Configs/GameConfig/` 目录下,使用相对路径调用:

| 脚本 | 用途 | 说明 |
|:---|:---|:---|
| `gen_code_bin_to_project_lazyload` | 客户端代码+数据 | **推荐入口**,AI 调用此脚本 |
| `gen_code_bin_to_project` | 客户端代码+数据 | 与 `_lazyload` **实质等价**:两者都传 `--customTemplateDir CustomTemplate_Client_LazyLoad`,只差注释与变量写法。名字暗示的「标准模板 / 非懒加载」并不存在 |

接入后把入口填进 `flow-config.psd1` 的 `LubanGenClientBat`(相对仓根),生成域登记的导出命令核对才认得它。

### AI 调用导表命令

**Windows**(经 PowerShell 工具执行,见 shell-conventions「引擎」节;会话 cwd = Demo,bat 以 `%~dp0` 自锚定):
```powershell
$env:AI_MODE = '1'; & ..\Configs\GameConfig\gen_code_bin_to_project_lazyload.bat
```

**macOS/Linux:**
```bash
bash Configs/GameConfig/gen_code_bin_to_project_lazyload.sh
```

### 客户端生成脚本

**位置**:`Configs/GameConfig/gen_code_bin_to_project_lazyload.bat`(Windows)/ `.sh`(macOS/Linux)

**脚本流程**:
1. 复制 `CustomTemplate/ConfigSystem.cs` → `GameProto/ConfigSystem.cs`
2. 复制 `CustomTemplate/ExternalTypeUtil.cs` → `GameProto/ExternalTypeUtil.cs`
3. 执行 Luban 代码生成(`--customTemplateDir` 启用懒加载模板)

**注意事项**:
- 懒加载脚本使用 `--customTemplateDir` 启用懒加载模板(表数据首次访问时才加载)
- `xcopy`/`cp` 复制的 `ConfigSystem.cs` 和 `ExternalTypeUtil.cs` 不是 Luban 自动生成的
- 生成前确保 `.NET SDK 8.0+` 已安装
- 仓内 `.bat` 须纯 ASCII(客户端自检 `bat编码核对`,面 = `Demo/` 下的 `.bat`;脚本放仓根 `Configs/` 时不在面内,自己守)

## ConfigSystem 配置加载器

`ConfigSystem.cs` 桥接 Luban 生成代码与 TEngine 的 YooAsset 资源系统:

```csharp
using Luban;
using GameConfig;
using TEngine;
using UnityEngine;

public class ConfigSystem
{
    private static ConfigSystem _instance;
    public static ConfigSystem Instance => _instance ??= new ConfigSystem();

    private bool _init = false;
    private Tables _tables;

    /// <summary>懒加载访问所有配置表</summary>
    public Tables Tables
    {
        get
        {
            if (!_init) Load();
            return _tables;
        }
    }

    private IResourceModule _resourceModule;

    public void Load()
    {
        _tables = new Tables(LoadByteBuf);
        _init = true;
    }

    private ByteBuf LoadByteBuf(string file)
    {
        if (_resourceModule == null)
        {
            _resourceModule = ModuleSystem.GetModule<IResourceModule>();
        }
        TextAsset textAsset = _resourceModule.LoadAsset<TextAsset>(file);
        return new ByteBuf(textAsset.bytes);
    }
}
```

### 初始化时机

block-client 在热更启动尾段由启动管线 `StartupPreloader` 先调 `ConfigSystem.Instance.Load()`,再 `await PreloadAsync()` 把 `TableAssetNames` 清单内全部 `.bytes` 并行读进字节缓存,运行时 `LoadByteBuf` 只从缓存取——那是为 WebGL 禁同步加载。本作没有那条启动管线(热更入口 `GameApp.Entrance` 直接开主界面),PC 上同步加载可用:接入时在 `GameApp` 开主界面之前定初始化点,要不要保留整表预载随模板一起定。

## ExternalTypeUtil Unity 类型映射

通过 `Defines/builtin.xml` 的 `mapper` 定义,将 Luban 配置类型映射到 Unity 内置类型。

> **block-client 的状态:vector\* 不可用。** 它的 `CustomTemplate/ExternalTypeUtil.cs` 里下列方法**已全部注释掉**——
> 无字段使用 vector\*,留着会让 GameConfig 程序集编译失败(引用 `GameConfig.vector2` 等未生成的类型)。
> 真要用先取消注释。另注:它的 `Defines/builtin.xml` 实际写的 constructor 是
> `GameLogic.ExternalTypeUtil.NewVector3`,而该类在**全局命名空间**(无 namespace),路径对不上——
> 搬模板时一并修正。

```csharp
public static class ExternalTypeUtil
{
    public static Vector2 NewVector2(GameConfig.vector2 v)
        => new Vector2(v.X, v.Y);

    public static Vector3 NewVector3(GameConfig.vector3 v)
        => new Vector3(v.X, v.Y, v.Z);

    public static Vector4 NewVector4(GameConfig.vector4 v)
        => new Vector4(v.X, v.Y, v.Z, v.W);

    public static Vector2Int NewVector2Int(GameConfig.vector2int v)
        => new Vector2Int(v.X, v.Y);

    public static Vector3Int NewVector3Int(GameConfig.vector3int v)
        => new Vector3Int(v.X, v.Y, v.Z);
}
```

对应的 XML 定义(`Defines/builtin.xml`):

```xml
<module name="">
    <bean name="vector3" valueType="1" sep=",">
        <var name="x" type="float"/>
        <var name="y" type="float"/>
        <var name="z" type="float"/>
        <mapper target="client" codeTarget="cs-bin,cs-simple-json,cs-newtonsoft-json">
            <option name="type" value="UnityEngine.Vector3"/>
            <option name="constructor" value="ExternalTypeUtil.NewVector3"/>
        </mapper>
    </bean>
</module>
```

## 配置数据访问

### 基础访问

```csharp
// 获取表实例
var tables = ConfigSystem.Instance.Tables;

// Map 表:按主键查询
var itemCfg = tables.TbItem.Get(1001);

// 遍历所有数据
foreach (var item in tables.TbItem.DataList)
{
    Log.Info($"{item.Id} - {item.Name}");
}
```

### 推荐封装 ConfigManager

复杂模块应封装配置管理器,避免业务代码直接散落 `ConfigSystem.Instance.Tables.TbXxx`:

```csharp
// GameLogic/Config/ItemConfigMgr.cs
public class ItemConfigMgr
{
    private static ItemConfigMgr _instance;
    public static ItemConfigMgr Instance => _instance ??= new ItemConfigMgr();

    /// <summary>获取物品配置</summary>
    public Item GetItem(int id)
    {
        return ConfigSystem.Instance.Tables.TbItem.Get(id);
    }

    /// <summary>按品质筛选物品</summary>
    public List<Item> GetItemsByQuality(EQuality quality)
    {
        return ConfigSystem.Instance.Tables.TbItem.DataList
            .Where(i => i.Quality == quality)
            .ToList();
    }
}
```

**使用**:
```csharp
// 推荐
var item = ItemConfigMgr.Instance.GetItem(1001);

// 不推荐(简单场景可直接用)
var item = ConfigSystem.Instance.Tables.TbItem.Get(1001);
```

**规则核心怎么拿表数据接入时定**:本作规则核心是不依赖 UnityEngine 的纯 C# 程序集(工程计划「立项裁定」),要在 Unity 外批量跑局。`ConfigSystem` 经 TEngine 的 `IResourceModule` 读 bytes,进不了规则核心;是由表现层读表后转交,还是让规则核心直接用生成的表类型、自带一个不经 YooAsset 的加载口,接入时定。

## Excel 表定义规范与新增表流程

**正本 = `.claude/references/tengine/luban-config.md`**,不在此复制。那篇的「__tables__.xlsx 表索引」
「Excel 数据行结构」「类型支持」「添加新配置表」四节以 block-client 实表为据,另含三件本篇不再重复的规约:
`input` / `group` 两列的强制规约、文件名由 group+full_name 派生的规则、`##` 标记行的识别方式。

本篇只补两条那边没有的注意事项:

- 不要用 `#` 前缀自动导入方式(如 `#Item-道具表.xlsx`)。所有表必须在 `__tables__.xlsx` 正式注册。
- 新增表后在 Unity Editor 确认 `.bytes` 被 YooAsset 正确收集(收集规则见 AssetBundleCollectorSetting)。

导表命令与脚本流程见本篇上方「代码生成脚本」节——**日常恒用 `_lazyload` 版**
(`gen_code_bin_to_project.bat` 与它实质等价,见该节表)。

## 兼容性注意事项

- **新增字段**:前向兼容,旧客户端自动忽略新字段
- **删除字段**:不兼容,旧客户端会报错
- **修改字段类型**:不兼容,需同步更新代码
- **重命名字段**:不兼容,影响热更包
- 生成代码(`GameConfig/` 目录)**不要手动修改**,下次生成会覆盖
- `ConfigSystem.cs` 和 `ExternalTypeUtil.cs` 是手动维护的桥接文件,位于 `CustomTemplate/` 模板中
- 本作开发阶段没有线上玩家,删改字段直接在结构上改(CLAUDE.md「沟通与协作」),上面几条不兼容的代价是要同步改代码与本地存档,不是理由保留旧字段
