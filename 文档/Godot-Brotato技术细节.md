# Godot（土豆兄弟 Brotato）技术细节

动 `Brotato_0.8.0.3/工具/` 里任何脚本前先读这份。正文（`AGENTS.md` / 包内 `README.md`）
只留命令与产物清单，格式怎么解、判据是什么、踩过什么坑写在这里。

包：`tudouxiongdi.apk` → `Brotato_0.8.0.3/`。
引擎 **Godot 3.5.1.stable**，GDScript，Android 导出。
**全包无加密、无壳、无热更、无服务端下发**——和同库的 Balatro 一样，数值结论不用带
「服务端可覆盖」的前提。

---

## 0. 为什么 Godot 的 Android 包不用"解包"

Godot 桌面版把资源打进 `.pck`；Android 导出则是把 PCK 的目录树**原样摊进 APK 的 `assets/`**。
所以 `zipfile` 直读就拿到 `assets/items/all/acid/acid_data.tres` 这种完整路径，
`.tres` / `.tscn` / `.import` 都是明文 UTF-8 文本。

真正要解码的只有三类二进制，外加一个"资源本体被搬去扁平目录"的间接层：

```
assets/
  items/all/acid/acid.png.import   <- 文本，写着 source_file 与 path
  .import/acid.png-<md5>.stex      <- 真正的图片本体（扁平、文件名带 md5）
  items/all/acid/acid_data.tres    <- 明文数值
  singletons/run_data.gd.remap     <- 文本，写着 path="res://singletons/run_data.gd"
  singletons/run_data.gdc          <- GDScript tokenizer 输出
```

`*.import` 文本里的 `source_file=` 是原始 `res://` 路径、`path=` 是 `res://.import/...stex`，
`brotato_unpack.py` 建的就是这张 `stex -> 原路径` 的反查表，把 818 张图和 153 个音频摆回原位。

`*.gd.remap` 只是一行指向；**`main.gd` 是唯一随包发的明文 `.gd`**（remap 指回它自己），
其余 255 个都编成了 `.gdc`。

---

## 1. `.gdc` —— 它不是字节码，是 token 流

这是整条链路最容易想歪的地方。Godot 3 的 `.gdc` 是
`GDScriptTokenizerBuffer`（`modules/gdscript/gdscript_tokenizer.cpp`）的产物：
**tokenizer 跑完就把 token 序列存下来**，编译器加载时直接从 token 开始 parse。
所以"反编译"实质是**逆 token 化**，能还原到接近原文的程度；丢的只有注释、空行、
字面量原始写法（`0x10` → `16`）和具体空白。变量名、函数名、字符串全在。

### 文件结构

```
"GDSC"                 4 字节
version                uint32，Godot 3.1~3.5 都是 13
identifier_count       uint32
constant_count         uint32
line_count             uint32
token_count            uint32
标识符表  identifier_count × ( uint32 len + len 字节，每字节 ^ 0xB6 )
常量表    constant_count  × marshalls 版 decode_variant
行号表    line_count      × ( uint32 token下标, uint32 行列 )
token 流  token_count 个，变长：
            若首字节 & 0x80 -> 读 4 字节 uint32，值 = v & ~0x80
            否则            -> 读 1 字节
```

每个 token：低 8 位是类型（`TOKEN_MASK`），高位右移 8 位是负载（`TOKEN_BITS = 8`）：

| 类型 | 负载含义 |
|---|---|
| `TK_IDENTIFIER` | 标识符表下标 |
| `TK_CONSTANT` | 常量表下标 |
| `TK_BUILT_IN_TYPE` | `Variant::Type` **枚举值** |
| `TK_BUILT_IN_FUNC` | `GDScriptFunctions::Function` 枚举值 |
| `TK_NEWLINE` | **下一行的缩进层数** |

缩进就藏在换行 token 里，所以不需要任何语法分析就能排出正确的块结构 —— 这是
`brotato_gdc.py::decompile()` 只有一层循环就够用的原因。

### 三张表必须从 so 里读，不能凭记忆写

token 名序、内置函数序、内置类型序都是**版本敏感**的枚举顺序。写错一格，产出的源码
语法完全正常、函数名却全错（`floor` 变 `ceil`、`print` 变 `printt`），而且**不会报错**。

Godot 在 release 里保留了两个名表数组（错误信息要用），可以直接从
`Brotato_0.8.0.3/安卓壳/lib/arm64-v8a/libgodot_android.so` 里读出来：

```bash
python 工具/brotato_gdc.py --tables 安卓壳/lib/arm64-v8a/libgodot_android.so
```

做法（`dump_tables()`）：

1. 这个 `.so` 的第一个 PT_LOAD 的 `p_vaddr == p_offset == 0`，**文件偏移就是链接期 VA**；
   lld 用 RELR 打包重定位，指针的值就写在文件里，不必解析重定位表。
2. 找锚字符串（内置函数用 `polar2cartesian`，token 名用 `'=='`）的文件偏移，
   打包成 8 字节小端去全文件搜，命中的就是指向它的指针槽。
3. 两张表都是**24 字节步长**的结构数组（名字在 +16 那格，不是裸 `const char*[]`），
   按 `base = 命中位置 - 序号 × 24` 往前推到 0 号，再逐格 `cstr()` 出来。

实测结果（Godot 3.5.1）：

- 内置函数 90 项，`sin` … `deep_equal`。**27 号是 `decimals`、28 号才是 `step_decimals`** ——
  按 Godot 4 的印象只写 `step_decimals` 会让 28 号之后整体错位一格。
- token 名 98 项，`Empty` … `Cursor`。注意 68 号显示名是 `rpc`、71/72 是 `puppet`/`slave`
  （与常见的 `remote/sync/master/slave/puppet` 记忆顺序**不同**）；本包是单机，用不到，
  但改别的 Godot 包时要按这张表来。
- 紧跟在函数表后面的是 tokenizer 的**内置类型关键字表**（`bool,int,float,String,Vector2,
  Rect2,Transform2D,Vector3,AABB,...`），**它和 `Variant::Type` 枚举顺序不一样**。
  `TK_BUILT_IN_TYPE` 的负载是枚举值，所以 `BUILTIN_TYPES` 必须用枚举序
  （`Nil,bool,int,float,String,Vector2,Rect2,Vector3,Transform2D,Plane,Quat,AABB,...`），
  别把从 so 里读到的那张关键字表直接拿来用。

### 怎么验证反编译对不对

不用猜 —— `.tres` 就是现成的判据。一个 `.tres` 的 `[resource]` 段按**脚本里 `export var` 的
声明顺序**逐字段写出来，所以拿 `weapon_data.gdc` 反编译结果对 `pistol_data.tres`：

```
weapon_data.gd:  weapon_id / type / sets / scene / stats / upgrades_into
pistol_data.tres: weapon_id, type, sets, scene, stats, upgrades_into    ← 逐字段同序
```

对上就说明标识符表、token 序、`export` 相关 token 全部正确。本包 255 个全过，失败 0。

### 排版上打的几个补丁

逆 token 化没有空白信息，全靠规则拼。三条特例：

- `.` 前一般不留空格（`a.b`），但 GDScript 的**父类调用**写成 `var x = .get_effects_text()`，
  所以只有前一个 token 是标识符/常量/`self`/右括号时才贴紧。
- `:` 后跟 `=` 时要拼成 ` := `（类型推断），两条规则配合：`:` 前留空格、`=` 前不留。
- 一元 `+` / `-`：前一个 token 是运算符、逗号、冒号、左括号、`return`、`in`、`not` 或行首时，
  按一元处理（后面不留空格）。实现上是把 `prev` 临时改成 `T_PERIOD` 借用"后面不加空格"的语义。

---

## 2. `.stex` —— StreamTexture

```
"GDST"    4
width     uint16 + width_custom  uint16
height    uint16 + height_custom uint16
flags     uint32
format    uint32     bit20=LOSSLESS(PNG) bit21=LOSSY(WebP) bit22=STREAM bit24/25/26=DETECT_*
mipmaps   uint32
size      uint32
"WEBP" 或 "PNG " 四字节幌子     <- Godot 的 packer 自己加的
载荷
```

本包 818 张全是 `format = 0x07200000`（LOSSY + DETECT_3D/SRGB/NORMAL），
**载荷是 WebP，而且内部是 VP8L（无损）** —— Godot 把无损 WebP 也走 lossy 分支存。

`stex_payload()` 不去精确解析 mipmap 链，直接找 PNG 签名或 `RIFF`，
按 RIFF 头里的 size 取出整块。Pillow 直接能开（`features.check('webp')` 为真）。

**没有遇到过的分支**：VRAM 压缩（ETC/S3TC）和未压缩原始像素。如果换个 Godot 包报
"未压缩/VRAM 压缩的 stex"，要按 `Image::Format` 自己解块压缩，本文件里没实现。

---

## 3. RSRC —— 二进制资源（`.translation` / `.sample` / `.mp3str` / `.oggstr`）

`core/io/resource_format_binary.cpp` 的格式。头部：

```
"RSRC" | big_endian u32 | use_real64 u32 | ver_major u32 | ver_minor u32 | ver_format u32
type (pascal 串: u32 len + len 字节, len 含结尾 NUL, 不补齐)
importmd_ofs u64 | flags u32 | 13 × u32 保留
string_table_size u32 + 各串
ext_resources_size u32 + 各 (type, path)
int_resources_size u32 + 各 (path, offset u64)
各内部资源 @offset: type 串 | 属性数 u32 | 属性数 × ( _get_string(), parse_variant() )
```

`_get_string()`：读 u32，最高位为 1 则低 31 位是内联串长度，否则是 `string_table` 下标。

### 两套 variant 编码，别混

| | `.gdc` 常量表 | RSRC 属性值 |
|---|---|---|
| 出处 | `core/io/marshalls.cpp::decode_variant` | `resource_format_binary.cpp::parse_variant` |
| 类型号 | `Variant::Type` 枚举（NIL=0, BOOL=1, INT=2, REAL=3, STRING=4…） | 自己一套（NIL=1, BOOL=2, INT=3, REAL=4, STRING=5, VECTOR2=**10**…） |
| 字符串 | u32 len + 字节 + **补齐到 4** | u32 len + 字节（len 含 NUL）**不补齐** |
| 64 位 | 靠 `type & (1<<16)` 标志位 | 独立类型号 INT64=40 / DOUBLE=41 |

`godot_fmt.py` 里分成 `decode_variant()` 与 `BinResource._var()` 两份，互不复用。
搞混的话解出来的数看着像随机数但不报错，很难查。

### 音频

- `.sample` = `AudioStreamSample`，属性 `data`(PoolByteArray) + `format`(0=8bit 1=16bit 2=IMA-ADPCM)
  + `mix_rate` + `stereo`。`sample_to_wav()` 手拼 44 字节 RIFF 头接上 `data`。
  **IMA-ADPCM 分支没实现**（本包没出现）。
- `.mp3str` / `.oggstr` = `AudioStreamMP3` / `AudioStreamOGGVorbis`，`data` 里就是完整的
  mp3 / ogg 文件字节，直接落盘。

---

## 4. `.translation` —— PHashTranslation，**只存 key 的哈希**

导出时 Godot 把 `Translation` 转成 `PHashTranslation`（`core/translation.cpp`），
表里存的是 **key 的 32 位哈希 → 译文**，key 本身不在文件里。
所以**倒不出全量词表，只能先凑一份 key 名单再逐个查**。

### 查表算法

```
h = hash(0, key_utf8)
p = hash_table[h % len(hash_table)]        ; 0xFFFFFFFF 表示空槽
bucket = bucket_table[p:]                  ; 布局 [size, func, (key_hash, str_offset, comp, uncomp) × size]
h = hash(bucket.func, key_utf8)            ; 二次哈希，每桶一个扰动种子
在桶里线性找 key_hash == h 的那条
comp == uncomp -> strings[off:off+comp] 直接 UTF-8
否则           -> smaz_decompress(strings[off:off+comp])[:uncomp]

hash(d, s): d = 0x1000193 if d == 0; for c in s: d = (d * 0x1000193) & 0xFFFFFFFF ^ c
```

`smaz`（`thirdparty/misc/smaz.c`）的 254 项反查码本抄在 `godot_fmt.py::SMAZ_RCB`。
英文短句会被压，中日韩的 UTF-8 基本压不动所以按原文存 —— 但**不能假设中文一定不压**，
`comp != uncomp` 就得走 smaz。

### key 名单从哪来

`brotato_text.py::harvest()` + `candidates()`：

1. `.tres` / `.tscn` / 反编译的 `.gd` 里所有**字符串字面量**（大写化）
2. 所有小写标识符（大写化）—— 覆盖 `key.to_upper()` 这种现拼的
3. 19 个前缀 × 词根 × 17 个后缀的笛卡尔积兜底（约 240 万条候选，比对约 9 秒）

源码里靠拼接产生 key 的地方（决定了前缀表怎么定）：

```
items/global/effect.gd:42     key.to_upper() 或 text_key.to_upper()
ui/menus/shop/stat_popup.gd   "INFO_" + stat_sign + title.to_upper()   -> INFO_POS_* / INFO_NEG_*
challenges/global/challenge_data.gd:22   tr(stat.to_upper())
singletons/utils.gd:160       "LANGUAGE_" + lang.to_upper()
```

**覆盖率的分母**是哈希桶里数出来的真实条目数（`entry_count()`：非空槽的 `bucket[size]` 求和），
en 表 732 条，当前命中 691 条 = 94.4%，写在 `文本/_覆盖率.txt`。
没命中的 41 条是没在资源/源码里以字面量出现过的 UI 串，拿不到 key 就查不出来。

---

## 5. `.tres` 解析与跨文件解引用

`brotato_tres.py`。格式是 INI 风格的段 + GDScript 字面量子集：

```
[gd_resource type="Resource" load_steps=6 format=2]
[ext_resource path="res://..." type="Resource" id=3]
[sub_resource type="CircleShape2D" id=1]
[resource]
key = value        ; value ∈ 字面量 / [ ] / { } / ExtResource(n) / SubResource(n) / Vector2(x,y) / Color(...)
[node name="..." parent="." index="0"]      ; 只有 .tscn 有
```

要点：

- **属性解析必须逐行找 `^名字\s*=` 再从那个位置递归下降**，不能整段正则 —— 值里可以有换行、
  嵌套数组、带转义的字符串。
- `Project.deref()` 做跨文件摊平（道具 → 效果 → 数值）。**引用有环**
  （武器 `upgrades_into` 链、套装 ↔ 道具互指），靠 `max_depth` + 路径栈两道闸挡住；
  深度用完就退化成 `res://` 路径字符串。
- `depth` 取值：总表用 2（道具 → 效果 / 武器 → stats 够了），波次用 3
  （wave → group → unit）。调大会爆内存也没意义。
- `by_script(res)` 按挂的脚本归堆，这是分类的唯一依据 —— Brotato 的资源类型全是 `Resource`，
  区分完全靠 `script = ExtResource(n)` 指向哪个 `.gd`。

各脚本对应多少个资源（`Project` 载入 2527 个文本资源后的分布）：

```
708 items/global/effect.gd          248 items/global/item_appearance_data.gd
172 items/global/weapon_data.gd     171 items/global/item_data.gd
134 zones/wave_unit_data.gd         130 zones/wave_group_data.gd
104 melee_weapon_stats.gd            92 ranged_weapon_stats.gd
 78 items/upgrades/upgrade_data.gd    76 challenges/global/challenge_data.gd
 38 items/characters/character_data.gd  28 entities/units/unit/stats.gd
 23 zones/wave_data.gd                14 items/sets/set_data.gd
 11 items/difficulties/difficulty_data.gd  ...（其余见 brotato_config.py 的 SC_* 常量）
```

---

## 6. 效果描述怎么拼（这块最容易出错）

游戏里一件道具的说明是 `Text.text(key, args, signs)` 现拼的，不是存好的整句。
规则在 `源码/singletons/text.gd`：

```
key_text = (text_key or key).to_upper()
tpl      = tr(key_text)
若 key 在 keys_needing_operator 里 且 tpl 不含 "{0}"  ->  tpl = "{0} " + tpl
args     = 效果对象的 get_args()
对每个 arg i：在 keys_needing_operator[key] 里就补正负号，在 keys_needing_percent[key] 里就补 %
tpl.replace("{i}", arg)
```

`keys_needing_operator` / `keys_needing_percent` 两张名单**从 `text.gd` 现读**
（`Loc._parse_text_gd()` 正则抓），不在 `brotato_config.py` 里抄第二份 —— 抄了就会漂。

**`get_args()` 是多态的**。基类 `effect.gd:118-125` 返回 `[str(value), tr(key.to_upper())]`，
但 21 个子类里有 19 个重写了它。一律套基类的后果很好认：

```
击中敌人时产生3投射物，造成击中敌人时产生{0}投射物，造成{1}（{3}）伤害
                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ {1} 被填成了模板自己
```

因为 `projectiles_on_hit_effect` 的 key 是 `effect_projectiles_on_hit`，
`tr()` 它拿到的就是整条模板。`Loc.effect_args()` 逐个照抄了子类实现：

| 子类 | `get_args()` |
|---|---|
| `effect` / `null_effect` / `healing_effect` | `[value, tr(key)]`（`custom_key=="starting_weapon"` 时 key 去掉末两字符） |
| `stat_gains_modification_effect` | `[tr(stat_displayed), abs(value)]` |
| `gain_stat_for_every_stat_effect` | `[value, tr(key), nb_stat_scaled, tr(stat_scaled), 运行期bonus]` |
| `class_bonus_effect` | `[value, tr(stat_displayed_name), tr(set.name)]` |
| `convert_stat_effect` | `[pct_converted, tr(key), tr(to_stat), value, to_value]` |
| `stat_with_max_effect` | `[value, tr(key), max_value]` |
| `weapon_stack_effect` | `[value, tr(stat_displayed_name), tr(weapon_stacked_name), 运行期]` |
| `gain_stat_every_killed_enemies_effect` | `[stat_nb, tr(stat), value]` |
| `exploding_effect` | `[round(chance*100)]` |
| `chance_stat_damage_effect` | `[chance, 运行期dmg, 缩放文案]` |
| `item_exploding_effect` | `[round(chance*100), 运行期, 运行期]` |
| `projectile_effect` / `projectiles_on_hit_effect` | `[value, stats.damage, stats.bounce+1, 缩放, cooldown]` |
| `structure_effect` | `[value, spawn_cooldown, stats.damage, 缩放]` |
| `turret_effect` | 按 `is_burning` / `is_spawning` 分三支 |
| `burning_effect` / `burn_chance_effect` | `[(chance*100), damage, duration, 缩放]` |
| `stat_cap_effect` | `[value]` |
| `slow_in_zone_effect` | `[]` |

**依赖玩家当前属性/持有武器的量填 `«运行期»`**（静态拆包算不出来），
剩余没填上的 `{n}` 也统一替换成 `«运行期»`。原始 `key=value` 另存一列（「效果原始」），
那一列是精确值，做归因用它。

---

## 6.5 角色构筑推导（`brotato_builds.py`）

"这个角色能玩什么流派"不是玩法经验，是三条机制的直接推论。动这个脚本前先看懂这三条：

### ① `gain_<stat>` 是乘区，`-100` 把整条属性焊死

`源码/singletons/run_data.gd:537-546`：

```gdscript
func get_stat(name) -> float:  return effects[name] * get_stat_gain(name)
func get_stat_gain(name) -> float:  return 1 + effects["gain_" + name] / 100
```

`stat_gains_modification_effect` 改的就是 `gain_<stat>`，它的 `stats_modified` 是个**列表**
（`stat_displayed = "stat_damage"` 会一次改掉 `stat_percent_damage / stat_ranged_damage /
stat_melee_damage / stat_elemental_damage / piercing_damage / explosion_damage / bounce_damage`
七条），所以读"这角色削了什么"必须展开 `stats_modified`，不能只看 `stat_displayed`。

`gain = -100` → 乘区 = 0 → **那条属性的全部道具对该角色是字面意义的废纸**。
`Char.dead_stats` / `useless_items()` 就是按这条算的，是整张表里最硬的一个结论。

### ② 伤害乘区只有一个括号

`源码/singletons/weapon_service.gd:110-127`：

```gdscript
damage = max(1, damage + Σ(属性 × scaling_stats 系数))
percent_dmg_bonus  = 1 + get_stat("stat_percent_damage") / 100
exploding_dmg_bonus = get_stat("explosion_damage") / 100     # 仅当武器带 ExplodingEffect
if is_structure: percent_dmg_bonus = 1                       # 炮台不吃这个乘区
damage = max(1, round(damage × (percent_dmg_bonus + exploding_dmg_bonus)))
crit_chance = base + get_stat("stat_crit_chance")/100
if is_structure: crit_chance = base                          # 炮台也不吃暴击
```

两个加号在同一个括号里，这是 `stat_percent_damage = -100` 的角色（技工/受虐狂/
和平主义者/公牛）为什么"只能走爆炸或炮台"的**唯一**原因。

### ③ `class_bonus_effect` 是角色↔套装的硬绑定

`源码/singletons/weapon_service.gd:60-67`：命中套装的武器 `base_stats.<stat_name> += value`，
`lifesteal` 特判要除 100。加在 **scaling 之前**，所以幽灵的 `damage +10` 吃满百分比乘区。

### 模拟 DPS 的口径

排武器用的不是抽象打分，是**照 `weapon_service` 的顺序真算一遍**。参考属性向量的口径
写死在 `BUDGET=60 / PCT_BUDGET=30 / LINK_BUDGET=30` 三个常量上：
给该角色"还活着"的主伤害属性均分 60 点、另给 30 点 %伤害、有属性联动的再给源属性 30 点，
过一遍 `gain` 乘区后结算 `links`。**这是把武器排出高下的相对量，不是实战数值**，
换口径会换出不同的排序，所以常量放在文件顶部而不是散在函数里。

### 道具推荐为什么要除以全角色均分

直接按"每百材料买到几点加权属性"排，结果是 38 个角色的推荐位全被献血/眼镜/咖啡这种
对谁都强的白板占满，等于没推荐。`recommend_items()` 用
**角色得分 ÷ 该道具在 38 个角色上的平均分**，比值 > 1 才是"这角色特别吃"的。

这里有个坑：正负效果互相抵消的道具（毒污泥 `+2 元素 / -2 闪避`、幸运硬币 `+2 幸运 / -2 护甲`）
平均分接近 0，比值会炸到几十上百。所以加了两道闸：分母 `avg > 0.2`，且绝对分要到
**本角色最高分的 25%**。没有这两道闸，输出里会出现"毒污泥 ×95.0"这种噪音。

`性价比道具(每百材料)` 那列是不除均分的绝对排名，两列互补着看。

---

## 6.6 武器搭配与套装组合（`brotato_loadouts.py`）

套装那套规则全在 `源码/singletons/run_data.gd:401-423`，三条都反直觉：

```gdscript
for weapon in weapons:                       # ① 按"持有的武器件数"计数，不是按武器族
    for set in weapon.sets:
        active_sets[set.my_id] += 1
for key in active_sets:
    if active_sets[key] >= 2:
        var set_effects = set.set_bonuses[min(active_sets[key] - 2, set.set_bonuses.size() - 1)]
        for effect in set_effects: effect.apply()      # ② 只取当前件数那一档，不累加
```

- **6 把同款也算 6 件**，而一把武器最多属于 2 个套装 → 6 把同族双套装武器 = 两套同时 6 件。
  这是套装收益的上限走法，也是穷举时"同款可重复"那个口径存在的原因。
- `set_bonuses` 是 5 项（2~6 件），值是**绝对值不是增量**，`min(count-2, 4)` 让件数 >6 封顶。
- `run_data.gd:549-556` 的 `can_combine` 要 2 把**同 `my_id`（同族同档）**，合成后武器数 −1，
  套装件数跟着 −1 —— "凑套装"和"升档"在 6 个格子上是直接对立的。

### 穷举的两个口径与复杂度

- **同款可重复**：只有"套装签名"（武器属于哪几个套装的 frozenset）有意义，
  49 族压成 34 种签名，`combinations_with_replacement(34, 6)` = 326 万，约 14 秒。
- **6 把全不同族**：`combinations(49, 6)` = 1398 万，约 60 秒。

两个口径都直接照 `update_sets()` 的规则算套装计数，没有近似。

### 一个已经踩过的确定性坑

`_最优套装组合.csv` 早先按 `sorted(cnt.items(), key=lambda x: -x[1])` 排激活套装，
**件数相同的两套没有次键**，落盘顺序会跟着 `Counter`/`frozenset` 的哈希顺序在两次运行之间变。
行顺序也一样：`sorted(set(...), key=-最优值)` 在最优值打平时不稳定。
表面症状是"复跑有 1 个文件变了、内容看着一样" —— 实际只是两列里同分项的先后换了。

**凡是要落盘的排序都必须给到全序**（这里是 `(-件数, 套装id)` 与 `(-最优值, 目标名)`）。
和 Balatro 那边"Lua 表转出来的列序/键序要显式定死"是同一条教训，Python 的 `set` 一样中招。

### 武器协同表里的"效果吃哪条属性"是怎么定的

22 族武器带特殊效果，`EFFECT_NOTE` 把每个效果类映射到它真正放大的那条属性，
依据都在 `weapon_service.gd`：

| 效果类 | 吃什么 | 出处 |
|---|---|---|
| `burning_effect` | `stat_elemental_damage` | `:148-167`，元素伤害 1:1 加进每跳，再乘 `%伤害`；炮台的燃烧两样都不吃 |
| `exploding_effect` | `explosion_damage` | `:112-121`，只有爆炸武器能把这一项加进伤害乘区 |
| `projectiles_on_hit_effect` | 副弹**自己的** `scaling_stats` | 副弹是独立的 `weapon_stats`，所以刺棍这把纯近战武器的副弹吃远程伤害 |
| `turret_effect` / `structure_effect` | `stat_engineering` | `:115,125` 明写炮台不吃 `%伤害` 乘区也不吃暴击率 |
| `weapon_stack_effect` | 同款持有数 | `run_data.gd` 的 `weapon_stack`，只有树枝有 |
| `gain_stat_every_killed_enemies_effect` | 击杀数 | 波内累积，幽魂三兄弟各给一条不同属性 |

---

## 7. 复跑与验证

```bash
cd Brotato_0.8.0.3
python 工具/brotato_all.py                  # 全量，约 20 秒
python 工具/brotato_all.py --skip=unpack    # 约 10 秒
```

**幂等判据**：连跑两次，`源码/` + `文本/` + `配置/` 下 306 个文件 md5 全部相同。
改了脚本就用这个比对来确认影响面。

需要注意的非确定性来源（已处理）：

- `brotato_text.py` 的候选是 `set`，但最终 `keys = sorted(...)`，输出稳定。
- `brotato_gdc.py` 搬随包明文 `.gd` 时**总是覆盖**（早期版本会 `if exists: continue`，
  导致 `源码/_索引.csv` 里"随包明文 .gd"的计数在首跑与复跑之间不一致）。

`_错误.txt` 两份都应为空：`Brotato_0.8.0.3/_错误.txt`（拆包）、`源码/_错误.txt`（反编译）；
`文本/_覆盖率.txt` 不是错误文件但要盯着覆盖率别掉。

复跑 7 步：`unpack -> gdc -> text -> config -> builds -> loadouts -> index`。
`builds` 与 `loadouts` 都 import `brotato_config` 的 `Loc` 与 `SC_*` 常量，
`index` 依赖前面所有步骤的 CSV。`loadouts` 的两轮穷举占掉全程 80 秒里的 70 秒。

---

## 8. 与其它包的关系

`Brotato_0.8.0.3/工具/` **完全自给自足**，不依赖任何外部公共模块（和同库的 Balatro 一样）。`brotato_common.py` 里自带 `setup_stdout()` / `write_csv()`（utf-8-sig）
/ `ensure()` / `Progress`。

没有骨架动画链路 —— Brotato 是纯 2D 精灵 + `AnimationPlayer`，
`资源/` 下没有 Spine/DragonBones 资产，所以 `animpose.py` / `*_player.py` 那套用不上。
