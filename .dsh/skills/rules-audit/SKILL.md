---
name: rules-audit
description: 规则栈 + 记忆层审计,防规则副本/死规则/规则间矛盾、记忆过时/索引失配。触发:用户要求"审计规则/查规则栈/查记忆"。
---

# rules-audit(DSH 适配层)

**正本 = `Demo/.claude/skills/rules-audit/SKILL.md`。开工先 Read 全篇,按它执行;本卡只写 DSH 侧的差异,不重述正本。**

- 审计范围与「规则副本 / 死规则 / 规则间矛盾」的判据照正本;本仓 DSH 侧的 `.dsh/`、`Demo/AGENTS.md` 一并纳入规则族审计。
- 脚本(`记忆索引核对.ps1`、`理由对齐核对.ps1` 等)经 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File` 调;提问用 `ask_user_question`。
- 修复走人工入库通道(提交用 `.dsh/scripts/提交.ps1`),不裸敲 git 写命令。
