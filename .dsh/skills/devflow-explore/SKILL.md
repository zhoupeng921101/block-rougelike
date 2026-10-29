---
name: devflow-explore
description: 任务成形前的探索模式:梳理问题、调查代码库、对比方案,不写产品代码。触发:用户想在立项前探讨想法与方案取舍;结论收敛时按简报模板生成草稿,衔接 devflow 第一步。
---

# devflow-explore(DSH 适配层)

**正本 = `Demo/.claude/skills/devflow-explore/SKILL.md`。开工先 Read 全篇,按它执行;本卡只写 DSH 侧的差异,不重述正本。**

- 不写产品代码、结论收敛时按 `Demo/.claude/devflow/templates/简报模板.md` 生成草稿衔接 devflow 第一步——这条照正本。
- 调查代码库用 `grep` / `read`(DSH 侧无 Bash);提问用 `ask_user_question`。
