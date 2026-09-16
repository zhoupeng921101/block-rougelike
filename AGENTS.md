# 项目协作指南

## 核心用途与优先入口

本项目以研究肉鸽游戏的玩法、构筑设计和数值系统为主要工作，当前包含《Balatro（小丑牌）》与《Brotato（土豆兄弟）》两套资料。拆包源码、数据表和 Python 工具用于支撑这些研究，也用于按需对比两款游戏的设计。

先根据用户关注的游戏选择目录，再按以下三个方向查阅。版本以目录为准，不将这些版本的结论直接推广到其他版本。

| 想了解什么 | Balatro 1.0.1o | Brotato 0.8.0.3 |
|---|---|---|
| 肉鸽玩法和构筑设计 | [肉鸽玩法设计分析.md](Balatro_1.0.1o/肉鸽玩法设计分析.md)、[Boss盲注专题.md](Balatro_1.0.1o/Boss盲注专题.md) | [角色构筑指南.md](Brotato_0.8.0.3/角色构筑指南.md)、[武器搭配与套装组合.md](Brotato_0.8.0.3/武器搭配与套装组合.md)、[升级卡系统.md](Brotato_0.8.0.3/升级卡系统.md) |
| 具体数值、经济和概率 | [数值设计报告.md](Balatro_1.0.1o/数值设计报告.md)、[出牌结算管线.md](Balatro_1.0.1o/出牌结算管线.md) | [数值设计报告.md](Brotato_0.8.0.3/数值设计报告.md) |
| 各类卡牌、角色、武器和道具的详细数据 | [总表索引.md](Balatro_1.0.1o/配置/总表索引.md) | [总表索引.md](Brotato_0.8.0.3/配置/总表索引.md) |
| 改脚本 / 排查解析问题 | [工具文档/Balatro技术细节.md](工具文档/Balatro技术细节.md) | [工具文档/Godot-Brotato技术细节.md](工具文档/Godot-Brotato技术细节.md) |
| 两款之间的机制对比 | [Balatro与Brotato横向对比.md](Balatro与Brotato横向对比.md) | 同左 |

### 肉鸽玩法和构筑设计

围绕局内循环、决策取舍、成长方式、流派组合、Boss 限制和局外解锁展开分析。Balatro 重点看小丑配合、牌型与牌组构筑，28 个 Boss 盲注的压制面、抽取轮转和反制手段单列在 [Boss盲注专题.md](Balatro_1.0.1o/Boss盲注专题.md)；Brotato 重点看角色限制、属性收益、武器协同、套装组合和波次生存，升级卡抽取与保底规则单列在 [升级卡系统.md](Brotato_0.8.0.3/升级卡系统.md)。优先解释机制如何影响玩家选择，以及这些机制之间如何配合；涉及具体条目和参数时，再查总表与源码。

### 具体数值、经济和概率

围绕成长曲线、商店经济、价格、稀有度、出现概率和抽取权重展开分析。Balatro 重点核对得分公式与盲注需求；Brotato 重点核对伤害与属性加成、敌人每波成长、刷怪规则、材料收益和危险等级。说明数值所处的版本、触发条件和计算口径，区分初始值、成长值与实际局内效果；不要把权重直接当作最终概率。

### 各类内容的详细数据

从对应游戏的总表索引定位条目，再查该游戏目录下的 `配置/配置CSV/` 或 `配置/配置JSON/`。

- Balatro：小丑、塔罗、幽灵牌、优惠券、牌组、标签、盲注、补充包、强化牌、版本和蜡封等。
- Brotato：角色、武器、道具、敌人、波次、刷怪组、套装、升级、挑战、难度与属性等；构筑问题继续查角色构筑、属性道具、套装武器、武器协同和套装组合等派生表。

需要确认触发时机、结算顺序或特殊规则时，Balatro 追溯 `源码/` 中的 Lua；Brotato 结合 `资源/` 中的 `.tres` / `.tscn` 与 `源码/` 中还原的 GDScript 核对。

## 研究与回答原则

- 默认用中文交流，先回答用户的玩法或数值问题，再给出必要的依据。
- 现有报告是研究入口；关键数值和机制应按任务需要核对对应游戏的数据表、原始资源及源码。发现报告与实现不一致时，明确指出差异。
- 跨游戏比较时分别注明游戏、版本和计算口径，比较机制与取舍，避免直接混用得分、DPS、经济或难度指标。已成文的对比结论与不可比量纲清单见 [Balatro与Brotato横向对比.md](Balatro与Brotato横向对比.md)。
- Brotato 的模拟 DPS、武器推荐和最优套装组合是特定假设下的推导，须说明属性投入、武器等级、槽位和是否允许重复等条件，不能直接视作实战排名。区分可玩内容与测试波次、空壳区域。
- 区分游戏已有机制、分析推论和新的设计建议；提出可借鉴的方案时，说明适用条件与取舍。
- 给出结论时尽量附上对应文档、数据表或源码位置，便于继续追查。
- 研究和查询优先使用已有产物；仅在需要更新数据、修复解析或调整展示时运行或修改生成工具。
- 当前目录主要是 Balatro 与 Brotato 的研究资料和工具，没有配置自研游戏的构建或启动流程。

## 工具与资料维护

以下约定用于维护支撑研究的源码、数据及生成工具。

### Project Structure & Module Organization

Each game has its own extracted Android package and analysis tooling. Paths below are relative to the named game directory.

`Balatro_1.0.1o/`:

- `工具/`: Python extraction, table generation, chart, and report scripts; `balatro_all.py` orchestrates the main pipeline.
- `源码/`, `本地化/`, `资源/`: extracted Lua code, language packs, and original graphics/audio/shaders.
- `配置/配置JSON/`, `配置/配置CSV/`, `文本/`, `图片资源/`: generated tables, text, and sprite crops.
- `图表/`, `报告/`, and top-level analysis Markdown: charts and design reports.
- `安卓壳/`, `原生库/`: Android wrapper, decompiled SDK code, and native libraries.

`Brotato_0.8.0.3/`:

- `工具/`: extraction, Godot format parsing, table generation, and build analysis scripts; `brotato_all.py` orchestrates the pipeline.
- `资源/`: original Godot resources, including `.tres`, `.tscn`, `.gdc`, `.stex`, and `.translation`; `源码/` contains restored `.gd` scripts.
- `配置/配置JSON/`, `配置/配置CSV/`, `文本/`: extracted tables, derived build/loadout tables, and localization outputs.
- `图片资源/`, `音频/`: decoded textures and extracted audio; `安卓壳/` includes native libraries under `lib/`.
- Top-level analysis Markdown and `配置/总表索引.md`: the primary research entry points above.

`工具文档/`（workspace root）:

- `Balatro技术细节.md` / `Godot-Brotato技术细节.md`: format specs, parser judgement calls, and known pitfalls for each toolchain. **Read the relevant one before changing any script under a game's `工具/`.** Each game's `README.md` links to it as `../工具文档/`.

Prefer changing generators over manually editing generated files. Preserve extracted inputs unless the task specifically requires modifying them.

### Build, Test, and Development Commands

Use Python 3.12 with `lupa` and `Pillow`. Run these commands from `Balatro_1.0.1o/`:

```powershell
python -m pip install lupa Pillow
python 工具/balatro_all.py --dry
python 工具/balatro_all.py --skip=unpack
python 工具/balatro_all.py --only=jokers,index
python 工具/balatro_report.py
```

These install dependencies, preview the pipeline, regenerate from existing inputs, refresh selected tables, and rebuild the HTML report, respectively. Selected steps require existing upstream outputs. Run `config` before `text`, and `index` after table generation.

Full extraction requires an APK, which is not committed (see the APK note below): `python 工具/balatro_all.py --apk="D:\path\game.apk"`. Optional `--jadx` requires Java and the expected external jadx installation. No packaged application build or local game launch workflow is configured.

For Brotato, run from `Brotato_0.8.0.3/` (Python, plus Pillow for texture conversion):

```powershell
python 工具/brotato_all.py --dry
python 工具/brotato_all.py --skip=unpack
python 工具/brotato_all.py --only=config,index
```

The pipeline order is `unpack -> gdc -> text -> config -> builds -> loadouts -> index`. Selected steps require existing upstream outputs. Refresh affected build/loadout tables when their inputs change, then regenerate the index.

**The source APKs are not in this repository.** They are gitignored (`*.apk`) because `tudouxiongdi.apk` is 103 MiB, past GitHub's 100 MiB per-file hard limit, and neither package is ours to redistribute. Supply your own copies and place them in the workspace root as `com.playstack.balatro.android.apk` and `tudouxiongdi.apk`; each toolchain resolves its default APK from the script location, so no path configuration is needed once they are there.

Every pipeline step except `unpack` reads the extracted inputs that *are* committed, so a fresh clone can regenerate all tables without an APK. `brotato_all.py` only requires the APK when the plan actually includes `unpack`; `--skip=unpack` and `--dry` run without it. To extract a different APK, use `python 工具/brotato_unpack.py "D:\path\game.apk"`; do not assume the Balatro `--apk` flag works with `brotato_all.py`.

### Coding Style & Naming Conventions

Follow existing Python conventions: four-space indentation, `snake_case` functions, uppercase constants, and `balatro_<purpose>.py` or `brotato_<purpose>.py` filenames according to the game. Keep shared Godot format parsing in Brotato's `godot_fmt.py`. Resolve paths relative to the script location. Preserve Chinese directory names and Windows UTF-8 console handling.

Write CSV with UTF-8 BOM (`utf-8-sig`); use UTF-8 for text and JSON. Explicitly stabilize column and key ordering when serializing Lua tables. No formatter or linter configuration is present.

### Testing Guidelines

No automated test framework or coverage threshold is configured. `Balatro_1.0.1o/源码/functions/test_functions.lua` contains game debugging helpers, not a standalone test suite.

After generator changes, rerun affected steps and downstream consumers. Compare output hashes across two identical runs, check table counts and representative values, and inspect changed charts or reports visually. Explain intentional output differences.

For Brotato parser or localization changes, also inspect extraction/decompilation error files and `文本/_覆盖率.txt`. Validate GDScript tokens against this package's Godot version; do not substitute Godot 4 mappings. Stabilize tie-breaking order in derived build/loadout tables.

### Commit & Pull Request Guidelines

This snapshot contains no Git metadata, so historical commit conventions cannot be verified. Use concise imperative subjects, such as `Fix deterministic joker table ordering`.

In pull requests, describe the change, affected generators and outputs, validation commands and results, and any linked issue. Include screenshots for chart or report layout changes. Keep unrelated extracted assets out of the change.
