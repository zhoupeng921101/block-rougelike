# Balatro（LÖVE / LuaJIT）技术细节

动 `Balatro_1.0.1o/工具/balatro_*.py` 之前读这份。正文导航在 [AGENTS.md](../../AGENTS.md)，
数值结论在 [Balatro_1.0.1o/数值设计报告.md](../结论/Balatro_1.0.1o/数值设计报告.md)。

## 包结构:没有壳

> APK 不在仓库里（`.gitignore` 忽略 `*.apk`，且不便公开分发）。要跑 `unpack` 请自备一份
> 放到仓库根的 `源包/`，命名 `com.playstack.balatro.android.apk`；其余步骤读已入库的解包产物，
> 无需 APK。

`com.playstack.balatro.android.apk` 是 LÖVE(Love2D) 打的包，**不是 `.love` 容器、不是字节码、
没有任何加密**。`assets/` 下就是原样的 `.lua` 源文件与 `resources/`，`zipfile` 直接读即可。
`lib/arm64-v8a/liblove.so` 是引擎，`classes.dex` 是 Playstack 的 Java 壳（账号/成就/IAP/广告）。

要点：
- **只有 arm64-v8a**，没有 armeabi-v7a
- `main.lua` 第 1 行 `if jit.arch == 'arm64' or jit.arch == 'arm' then jit.off() end` ——
  移动端关掉了 JIT，纯解释执行
- `assets/version.jkr` 三行：`1.0.1o-FULL [M]` / `1.0.1o` / `PROD_mobile`；
  `assets/info.txt` 是 Playstack 壳的构建信息（`version_name: 12.11.0`），**两个版本号不是一回事**，
  目录名用的是游戏本体的 `1.0.1o`
- `assets/AVConfig.json`(176KB) 是广告 SDK 的配置，不是游戏数值
- `assets/dexopt/` 是 ART profile，解包时跳过

## 数值抽取:切片 + lupa 沙箱（`balatro_config.py`）

所有原型数据集中在 `game.lua` 的 `Game:init_item_prototypes()`（219 行起）里，
是一整段 **纯字面量** 的 `self.XXX = self.XXX or {...}`。做法是把
`self.P_SEALS = ...` 到 `self.P_CENTER_POOLS = {` 之间的原文切出来，喂给 lupa 求值。

**必须提前塞进沙箱的两个桩**，否则 `execute` 直接报 `attempt to call a nil value`：

| 桩 | 为什么 | 怎么处理 |
|---|---|---|
| `localize(a, b)` | 少数字段（如 `bl_ox` 的 `vars`）在表里就调本地化 | 回填 `"localize:<参数>"` 占位串，名称列后面从 `本地化/*.lua` 另补 |
| `HEX(hex)` | Boss 盲注的 `boss_colour` 写成 `HEX('56789D')` | 照 `misc_functions.lua` 的实现补一份（含 `#hex <= 6` 时补 `FF`） |

牌型表 `hands` 不在这段里，它在 `Game:init_game_object()`（2211 行）的 return 体中间，
**前后都不是表边界**，按行切会切错——所以单独用 `_balanced()` 从 `hands = {` 起做花括号配平，
扫描时跳过字符串字面量与 `--` 注释。

`P_CENTERS` 是 299 条混装表（Joker/Tarot/Planet/Spectral/Voucher/Back/Enhanced/Edition/Booster
+ 3 条无 `set` 的 `soul` / `undiscovered_*`），按 `set` 字段拆成 10 张子表再各出一份 CSV，
否则单表 120 列没法看。

## 图集切片（`balatro_sprites.py`）

网格定义在 `game.lua:977` 的 `animation_atli` / `asset_atli` / `asset_images`，
每项写着 `px` × `py` 的单格像素尺寸（**1x 的尺寸，2x 图集要自己翻倍**）。
卡牌类统一 71×95，标签/盲注筹码 34×34，筹码 29×29，图标 66×66，UI 18×18。

**挑哪张图集**照 `card.lua:165` 的原式：

```
_center.atlas or ((set=='Joker' or consumeable or set=='Voucher') and set) or 'centers'
```

即：显式 `atlas` 字段优先（Booster、Edition 有）→ Joker/Voucher/消耗品用同名图集 →
其余（Back / Enhanced / Default）一律落到 `centers`（也就是 `Enhancers.png`）。
`Planet` 与 `Spectral` 两个图集名在 `game.lua:1086-1087` 被**别名到 `Tarot`**，
切片表里要照抄这条别名，否则这 30 张找不到图集。

两个额外分组：
- `soul_pos` —— 5 个传奇小丑 + `c_soul` 的浮空叠加层，另存到 `<set>_soul/`
- 盲注是 `BlindChips.png` 里 **21 帧的横向动画**，`pos.y` 是行号、`pos.x` 无意义，
  只取第 1 帧（x=0）作代表图

## 本地化与挑战（`balatro_text.py`）

`本地化/*.lua` 是 `return {descriptions=..., misc=...}` 的纯表，把开头的 `return` 换成
`LOC = ` 就能直接 execute，15 种语言全过。

`descriptions[set][key].text` 是**分行数组**，某些条目是 `[[行]]` 的两层（多页描述），
`join_text()` 要递归拼。描述里的 `{C:attention}` / `{X:mult,C:white}` / `#1#` 是富文本与
变量占位，**导 CSV 时原样保留**——剥掉就对不上游戏内显示，也没法反查变量来自 `config` 的哪个键。

`challenges.lua` 是 `G.CHALLENGES = {...}` 的数组，沙箱里先 `G = {}` 再 execute 即可，
它不依赖任何运行时。开头有一大段 `--[[ ... ]]` 注释掉的 `TEST` 模板，求值时自动忽略，
但**别用正则数 `{` 来清点挑战数**，会把注释里那份算进去。

## 小丑总表（`balatro_jokers.py`）

把四处信息拼成一行：原型数值（`配置JSON/P_CENTERS.Joker.json`）、描述模板（`文本/*.json`）、
占位变量（`card.lua` 的 loc_vars 链）、触发时机（`card.lua` 的 `calculate_joker`）。

**占位符怎么填**：描述里的 `#1#` `#2#` 由 `card.lua:732-950`
`generate_UIBox_ability_table` 那条 `elseif self.ability.name == 'X' then loc_vars = {...}`
链决定。要注意 `self.ability` **不是** `center.config` 的直接拷贝 —— `set_ability`
(`card.lua:277`) 做了重命名与兜底：

```
x_mult <- config.Xmult or 1      mult   <- config.mult or 0
t_mult <- config.t_mult or 0     t_chips<- config.t_chips or 0
h_size <- config.h_size or 0     d_size <- config.d_size or 0
extra  <- copy(config.extra)     type   <- config.type or ''
```

照着 config 直接取会错位。带运行时累加的（搭乘巴士的 `mult`、卡尼奥的 `caino_xmult`）
填的是**初始值**，填不出来的留 `<运行时:字段名>`，另有「成长型」列标记（43 张）。

**触发时机怎么反推**：`calculate_joker` 是一个 1770 行的巨函数（`card.lua:2294-4066`），
按 `context.*` 分层。Lua 没有花括号，所以靠缩进认块：遇到 `elseif`/`else`/`end`
先弹掉缩进 ≥ 本行的条件，再压入本行新的 `context.*`。三个坑：

1. **`context.X` 不都是分支**。`context.scoring_hand[i]`、`context.other_card.ability`、
   `#context.full_hand` 是取值不是条件，正则要用 `(?<![#\w.])context\.([a-z_]+)(?![\w\[.])`
   把它们排掉；`context.blueprint` 是「我是被蓝图复制的」标志位，也不算触发点
   （这一批列在 `DATA_CONTEXTS`）
2. **主计分块藏在一个 `else` 里**。`card.lua:3634` 那支既不是 `context.before` 也不是
   `context.after`，加倍率/加筹码的返回值全在里面，55 张小丑落在这。解析器给 `else`
   分支记了兄弟条件，渲染成 `其余(非出牌前/出牌后)`，再由 `PATH_ALIAS` 换成
   `小丑区 > 计分主阶段`。最外层那个 `else`（非 Planet/Tarot/…）兄弟有二十几个，
   纯噪音，所以兄弟数 > 3 就不标
3. **19 张小丑在 `calculate_joker` 里根本不出现名字**，走的是按 config 签名的公共分支：
   `effect == 'Suit Mult'`（4 张花色小丑，`card.lua:3220`）、
   `x_mult > 1 and type`（5 张，`3656`）、`t_mult > 0`（5 张，`3663`）、
   `t_chips > 0`（5 张，`3669`）。`GENERIC_RULES` / `match_generic` 就是补这条

剩下 25 张（四指、水花、拟像、蓝图、玩杂耍的…）是**被动改规则**的，
不在 `calculate_joker` 里，靠 `find_joker('名字')` 在 `misc_functions.lua` 的牌型判定、
商店定价、手牌数计算等处生效。这批在 `生效方式` 列标 `外部引用`，
`代码出处` 列给出全树扫出来的 文件:行号（扫描时跳过 `game.lua` 的原型表与
`card.lua` 的 loc_vars 链，那两处只是声明与显示，不是生效点）。

## 塔罗 / 幽灵 / 优惠券总表（`balatro_cards.py`）

和小丑那张同一路子，但**取变量的地方不一样**：小丑的 `#1#` 来自 `card.lua` 的
`self.ability.*`（过了 `set_ability` 那层重命名），这三类来自
`functions/common_events.lua` 的 `generate_card_ui`，分支形如
`elseif _c.set == 'Tarot' then … loc_vars = {_c.config.xxx}`，**直接读 `_c.config`**，
所以不需要 `ABILITY_FROM_CONFIG` 那张映射表。

效果归属也各走各的：

- **塔罗/幽灵**看 `use_consumeable`（`card.lua:1092`）里的
  `ability.consumeable.mod_conv / suit_conv / hand_type / remove_card / tarots / planets`，
  命中哪个字段就是哪种作用，只有特殊的才按名字开分支 —— 所以「作用类型」列是从
  config 签名推的（`CONSUMABLE_RULES`）
- **优惠券**全在 `Card:apply_to_run`（`card.lua:1882-1974`），一个 name 一个 `if` 块，
  块里改哪个全局字段就是生效点。但有 5 张**不在里面**：它们买下只记账，
  用到时才查 `G.GAME.used_vouchers.<key>`，所以要另扫一遍（`scan_used_vouchers`）

解析这三类时踩到的四个坑，都是真会算错的：

1. **引号要成对认**。`Director's Cut` 名字里带撇号，源码写成双引号
   `"Director's Cut"`；正则若写 `["']([^"']+)["']` 会把名字截成 `Director`，
   这张券的占位符与代码出处就全空了。要写成 `(?:"([^"]+)"|'([^']+)')`
2. **`used_vouchers` 有两种写法**。点号 `used_vouchers.v_telescope` 与中括号
   `used_vouchers["v_directors_cut"]` 都有，只认点号会漏掉导演剪辑版/重述
3. **`apply_to_run` 的块体不只有赋值**。`Paint Brush` 的块体是
   `G.hand:change_size(1)` —— 冒号方法调用，既不是 `G.x = ...` 也不是裸函数调用，
   只认这两种会把它误判成「未定位」
4. **Tarot 是 `_c.set` 链上最后一支**，后面没有下一个 `elseif _c.set ==` 作边界，
   得再认一条「缩进不深于分支行的 `end`」，否则 `next()` 直接 StopIteration

`localize{key = _c.config.mod_conv}` 这类占位解出来是资产 key（`m_lucky`），
游戏里显示的是本地化名，所以最后还要拿 `descriptions` 的 name 与 `misc` 下的
`suits_plural` / `suits_singular` / `poker_hands` 反查一次，否则表里会留一堆
`m_lucky` / `Diamonds` 这种半成品。

## 牌组 / 标签 / 盲注总表（`balatro_meta.py`）

这三类的生效机制彼此毫无共同点，所以列也各不相同：

- **牌组** `Back:apply_to_run`（`back.lua:176`）是**纯 config 分派**：
  `if self.effect.config.<字段> then …`，16 张牌组一个按名字的分支都没有。
  「生效字段」列就是这张牌组 config 里被 `apply_to_run` / `trigger_effect` 认的字段；
  跑下来「未被认的字段」全为空，说明配置与消费端是严丝合缝的。
  描述占位在另一处 —— `Back:generate_UI`（`back.lua:26`）里按名字给 `loc_args`，
  读的是 `effect_config.*`（就是 center.config）
- **标签** `Tag:apply_to_run(_context)`（`tag.lua:115`）先比
  `self.config.type == _context.type` 再按名字细分，**所以 `config.type` 就是触发时机**，
  一共 10 种。描述占位在 `Tag:get_uibox_table`（`tag.lua:546`），读 `self.config.*`
- **盲注** 没有集中入口，效果散在 `set_blind` / `press_play` / `debuff_hand` /
  `debuff_card` / `drawn_to_hand` / `stay_flipped` / `modify_hand` / `disable` /
  `defeat` 这些方法里按 `self.name` 认。「生效方法」列是扫出来的方法名，
  一眼能看出这个 Boss 是「改分数」还是「废牌」

盲注另有一层配置驱动：`P_BLINDS` 的 `debuff` 表（`suit` / `is_face` / `value` /
`nominal` / `hand` / `h_size_ge` / `h_size_le`），由 `debuff_card`（624）与
`debuff_hand`（519）消费，**这两处完全不看名字**。6 个 Boss 走这条，
只查名字会以为它们没实现（`DEBUFF_RULES`）。

两个坑：

1. **单双引号又一次咬人**。`blind.lua` 里 `"The Hook"` / `"The Flint"` / `"The Eye"` /
   `"The Mouth"` / `"The Tooth"` 等 7 处用双引号，其余用单引号。这是本链路第三次
   踩同一个雷（前两次在 `balatro_cards.py` 的 `Director's Cut` 与 `used_vouchers`），
   **以后凡是按名字扫 Lua，一律写 `(?:"([^"]+)"|'([^']+)')`**
2. **绘制/分类方法里也提名字**。`get_type` 里有 `self.name == "Small Blind"`，
   那只是分类不是玩法效果；不把这批（`BLIND_BOOKKEEPING`）滤掉，
   小盲/大盲会被误判成「有专属效果」

## 补充包 / 强化牌总表（`balatro_packs.py`）

两类各有一个「不知道就拿不到数据」的地方：

- **补充包的描述不在 `descriptions.Booster` 里**。`generate_card_ui`
  （`common_events.lua:2662`）先把 key 改写成 `desc_override`——
  `p_arcana_normal_1` 去掉尾号得 `p_arcana_normal`——再去
  **`descriptions.Other`** 取名称与文案。32 个包只有 15 条文案（5 种 × 3 档），
  同种同档的 2~4 个包共用一条。loc_vars 统一是 `{config.choose, config.extra}`，
  没有一个包有专属分支。原型表里另有 `kind`（种类）与 `weight`（商店出货权重），
  后者是这张表真正的数值大头，别的地方都查不到
- **强化牌的 loc_vars 按 `_c.effect` 分派，不是按 key**（`'Mult Card'` /
  `'Glass Card'` / …）。8 张里有 **5 张压根不出现在玩法代码里**：
  `set_ability` 把 config 拷进 `ability.*`，再由 `Card:get_chip_bonus` /
  `get_chip_mult` / `get_chip_x_mult` / `get_chip_h_x_mult` / `get_p_dollars`
  这几个通用 getter 直接读走。真按名字写的只有 3 张：石头牌与幸运牌比
  `ability.effect`，**万能牌比的是 `ability.name`**（`card.lua:4072` 的
  `is_suit`）——只扫 `effect ==` 会把万能牌误判成配置驱动，两种都要扫

所以 `_强化牌总表.csv` 里「数值消费点」列比「名字出现处」列更有用：
前者说这张牌的数值被谁读走，后者有不少只是描述分支或别的卡在引用它。

另外奖励牌 `m_bonus` 的 `descriptions.Enhanced.m_bonus.text` 是**空的**，
它整条描述来自 `common_events.lua:2659` 追加的那行
`descriptions.Other.card_extra_chips`（凡 `config.bonus` 存在且不是石头牌都会追加）。
不补这一步，表里这张牌的描述列会是空白。

## 版本 / 蜡封总表（`balatro_mods.py`）

八类里最不配置化的两类，各有一个「按常理找会找空」的地方：

- **版本的 `config.extra` 只有 3 个被读**。`card.lua:390-403` 的 `set_edition`
  把 `e_holo` / `e_foil` / `e_polychrome` 的 extra 拷进
  `self.edition.mult / chips / x_mult`；而 **`e_negative.config.extra = 1`
  全树没有任何地方读它**——负片的 +1 槽位是 `card.lua:409-413` 写死的
  `card_limit + 1`（且消耗品与小丑分两个分支）。这是包里少见的「配了但不用」的字段，
  照着 config 推效果会推错。另外版本的售价加成（foil +2 / holo +3 /
  poly +5 / neg +5）是 `card.lua:372-373` 的字面量，也不在 config 里
- **蜡封根本没有 config**。`P_SEALS` 四条只有 `order` / `set` / `discovered`，
  金 +$3（`Card:get_p_dollars` 里的 `ret + 3`）、红重复触发 1 次、
  蓝回合结束生成星球牌、紫弃牌生成塔罗牌，全部硬编码在 `card.lua`。
  文案也**不在 `descriptions.Seal`**——语言包里压根没有这个集合——
  而在 `descriptions.Other` 的 `gold_seal` / `red_seal` / `blue_seal` /
  `purple_seal` 键下。按 `set` 去找会一无所获

版本掉率那几个数别直接抄 `poll_edition` 的阈值：它是**累积阈值**写法
（`> 1 - 0.003` / `> 1 - 0.006` / `> 1 - 0.02` / `> 1 - 0.04` 依次兜底），
单档概率要按阈值从小到大相减才对。`_guaranteed` 分支把系数硬编成 25，
所以保底包里的单档概率是基础值的 25 倍。

## 一键重跑（`balatro_all.py`）

`python balatro_all.py` 按依赖顺序跑完 10 步（unpack → config → text → sprites →
jokers → cards → meta → packs → mods → index），每步一个子进程，单步失败即停——
后面的步骤都依赖前面的产物，硬依赖只有两条：`config` 必须在 `text` 之前
（text 要往 `配置JSON/` 写 `CHALLENGES.*`），`index` 必须最后。
jadx 那步默认不跑，`--jadx` 才跑。全流程约 3 秒。

**产物是幂等的**，连跑两次 492 个文件逐字节相同，所以改了脚本可以直接用
`md5sum` 前后比对来确认影响面。为了做到这点修了一处真实缺陷：

`balatro_config.py` 的 `write_csv` 原本按「字段首次出现的先后」攒列名，
而字段是 `lua_to_py` 按 **Lua 表的迭代序**取的 —— Lua 哈希部分的顺序每次跑可能不同，
于是同样的输入会产出列序不同的 CSV（18 张基础表全中，逐字节比对时全是假差异）。
现在固定成 `key` → 名称列 → 其余按字母序。
**以后凡是从 Lua 表转出来的东西要落盘，列序/键序都得显式定死**
（JSON 那边一直是 `sort_keys=True`，所以没出过这个问题）。

## 已知的坑

- `balatro_cards.py` 从 `balatro_jokers.py` import 解析工具（`split_args` / `fill` /
  `plain` / `flat_config` / `scan_external_refs`），改后者时留意别把签名动了
- `工具/` 八个脚本都在 `sys.path.insert` 之后立刻 `sys.stdout.reconfigure(encoding='utf-8')`，
  不加的话 Windows 控制台按 GBK 输出中文进度会花屏（这套脚本原先所在的 AniRes 工作区里其它链路是用 `common/fsutil.setup_stdout`，
  Balatro 这条链没有依赖 `common/`，所以自带了一份）
- CSV 一律 `utf-8-sig`，否则 Excel 打开乱码
- 切片默认吃 `2x` 图集；`--scale=1` 可以切 1x，两套图集内容一致只是分辨率差一倍
- `jadx` 反编译 `classes.dex` 出 1839 个 Java 文件，全是第三方 SDK（Firebase / Play Services /
  Playstack / 广告），**与玩法数值无关**，不要在里面找配置
