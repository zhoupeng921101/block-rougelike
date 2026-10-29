---
name: refs-check
description: 文档与代码的事实一致性核验:把 `.claude/references/`、各卡 references、devflow 族卡里对产品代码行为的断言、`新游戏/工程计划.md` 里的工程现状段与产品代码注释里的跨处引用,和 `Demo/Assets/` 现状比对,以代码为准修文档;代码注释只出报告。触发:发现、怀疑某处事实描述与代码不符时。
---

# refs-check(DSH 适配层)

**正本 = `Demo/.claude/skills/refs-check/SKILL.md`。开工先 Read 全篇,按它执行;本卡只写 DSH 侧的差异,不重述正本。**

- 以代码为准修文档、代码注释只出报告的边界照正本;扫描用 `grep` / `read`。
- 修文档的提交走人工入库通道(`.dsh/scripts/提交.ps1`),不裸敲 git 写命令。
