---
name: daily-code-review
description: 每日审查(夜审):对仓库近 24h 改动跑正确性审查,产出中文报告,确认级(CONFIRMED)发现交 devflow 修复。未启用定时任务,触发 = 用户显式要求运行每日/夜审。
disable-model-invocation: true
---

# daily-code-review(DSH 适配层)

**正本 = `Demo/.claude/skills/daily-code-review/SKILL.md`。开工先 Read 全篇,按它执行;本卡只写 DSH 侧的差异,不重述正本。**

- 审查范围、报告格式、CONFIRMED 发现交 devflow 的归属全照正本。
- **git 与脚本经 `pwsh`** 跑(DSH 没有 Bash 工具);改动清单用 `git -c core.quotepath=false log/diff`,报告写文件再给用户。
- 修复发现的缺陷走 devflow 或 `.dsh/scripts/提交.ps1`,不裸敲 git 写命令。
