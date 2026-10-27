# Excel 数据格式详解

## 标题行格式

Excel 数据表使用特殊标记行定义结构：

| 标记 | 用途 | 必需 |
|:---|:---|:---|
| `##var` | 字段定义行 | 是 |
| `##type` | 类型定义行 | 是 |
| `##` | 字段说明行，内容生成为 C# `/// <summary>` | 否 |
| `##group` | 导出分组行 | 否 |

标题区的 `##` 与数据区第一列的 `##`（见下方「标签系统」）是两回事：前者是字段说明行，后者标记该条数据永不导出。

数据表一律用 `##` 承载字段说明，不用 `##comment`（block-client 的约定，本作接入时沿用）。实测该行内容会原样进入生成代码的 XML 文档注释（block-client 例：某表第 3 行 → `GameConfig/` 下对应数据类的 `/// <summary>`）。

### 字段说明必须写中文

`##` 行每一列都要填，且用中文。它有两个消费面：直接打开 xlsx 时的列说明，以及生成代码里 IDE 悬停显示的 `/// <summary>`——写英文两处都退化。

字段的完整语义（取值边界、跨表联动、坑）不写在这行，写在 `Configs/GameConfig/Datas/配置表说明.md`——那里是策划查字段语义的单一入口，改表源时提交检查强制同步（本作接入时随表建这份文档）。本行只做一句话速览，措辞与该文档对齐，别两处各说一套。

- 风格紧凑，取值含义写进括号：`道具唯一id(主键)`、`品质(1-6)`、`获得时是否自动使用(0否1是)`
- 字段值对应代码常量时，保留英文常量名再加中文释义，别只写中文：`触发类型(1=Login登录时+1 2=Cumulative业务方推累计)`。只写「1登录 2累计」会切断表与 `TypeCumulative` 这类常量的对照链。
- 引用别的表用生成类名，不用文件名：`指向TbRewardBox`、`引用TbStorySegment`。写 `引用 rewardbox.box_id` 这种文件名形态的表里也有，但只是少数
- 指向 `global.xlsx` 写 `TbGlobal id=N`，不写臆造的键名：`≤0 用 TbGlobal id=32 兜底`

## 标准表格式

### 示例

| | A | B | C | D |
|:---|:---|:---|:---|:---|
| 1 | ##var | id | name | reward |
| 2 | ##type | int | string | Reward |
| 3 | ## | 货币id(主键) | 货币名 | 奖励(道具id,数量) |
| 4 | ##group | c,s | c,s | c,s |
| 5 | | 1001 | 金币 | 1,100 |
| 6 | | 1002 | 钻石 | 2,50 |

### 多行数据

字段名前加 `*` 表示该字段数据跨多行：

```
##var | id | *items
##type| int| list,int
     | 1  | 100
     |    | 200
     |    | 300
     | 2  | 400
     |    | 500
```

## 列限定格式

使用多级标题头表示嵌套结构：`a.b.c`

```
##var | id | pos.x | pos.y | pos.z
##type| int| float | float | float
     | 1  | 1.0   | 2.0   | 3.0
```

## 流式格式（单单元格）

使用 `sep` 分隔符拆分单元格内容：

```xml
<bean name="vec3" sep=",">
    <var name="x" type="float"/>
    <var name="y" type="float"/>
    <var name="z" type="float"/>
</bean>
```

Excel 数据：`1,2,3` 表示 `x=1, y=2, z=3`

## 紧凑格式标记

| 标记 | 说明 |
|:---|:---|
| `#format=lite` | Luban 专有格式 |
| `#format=json` | JSON 格式 |
| `#format=lua` | Lua 格式 |

```
##var | id | data#format=json
##type| int| string
     | 1  | {"a":1,"b":2}
```

## 数据类型格式

### bool

支持：`true`, `false`, `0`, `1`, `是`, `否`（大小写不敏感）

### string

- 留空 = 空字符串
- 流式格式用 `""` 表示空串
- 加 `#escape=1` 处理转义字符

### datetime

- 支持 Excel 内置日期格式
- 支持字符串格式：`yyyy-mm-dd hh:mm:ss`

### 可空类型

- 除 datetime 外的基础类型可留空取默认值
- `int?` 类型留空或填 `null` 表示 null

## 容器类型格式

### array/list/set

**多单元格：**
```
##var | id | tags
##type| int| list,string
     | 1  | tag1  | tag2  | tag3
```

**单单元格（sep）：**
```
##var | id | tags
##type| int| list,string
     | 1  | tag1,tag2,tag3
```

**多行：**
```
##var | id | *tags
##type| int| list,string
     | 1  | tag1
     |    | tag2
     |    | tag3
```

### map

**单单元格（需两个分隔符）：**
```
##var | id | attrs
##type| int| map,int,int
     | 1  | 1:100;2:200
```

**多行：**
```
##var | id | *attrs
##type| int| map,int,int
     | 1  | 1 | 100
     |    | 2 | 200
```

## 多态类型格式

**流式格式：**
第一值指定类型名：`Circle,5` 或 `矩形,3,4`

**列限定格式：**
```
##var | id | shape.$type | shape.radius | shape.width
##type| int| string      | float        | float
     | 1  | Circle      | 5            |
     | 2  | Rectangle   |              | 3
```

## 特殊表类型

### 纵表（Vertical Table）

A1 为 `##column`：

```
##column
name    string
value   int
```

### 单例表

```xml
<table name="TbGlobalConfig" mode="one" valueType="GlobalConfig"/>
```

Excel 只需一行数据。

## 标签系统

| Tag | 作用 |
|:---|:---|
| `##` | 注释记录，永不导出 |
| `dev` | 开发数据 |
| `test` | 测试数据 |
| `unchecked` | 跳过校验器验证 |

在数据的第一列填写 tag：

```
##var | tag | id   | name
##type|     | int  | string
     |     | 1    | 正式数据
     | dev | 2    | 开发数据
     | ##  | 3    | 注释数据
```

## 变体（Variants）

```xml
<var name="price" type="int" variants="cn,en,jp"/>
```

Excel 标题：
```
##var | id | price | price@cn | price@en | price@jp
```
