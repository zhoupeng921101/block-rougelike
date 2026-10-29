---
name: devflow-check
description: devflow 工作流规则族一致性检查(DSH 适配卡)。改完工作流族文件后、或用户显式要求核对规则一致性时用。正文正本 = Demo/.claude/skills/devflow-check/SKILL.md。全栈审计归 rules-audit。
disable-model-invocation: true
---

# devflow-check(DSH 适配层)

**正本 = `Demo/.claude/skills/devflow-check/SKILL.md`。开工先 Read 全篇,按它执行**:检查范围、不变量矩阵、检查项、处置分流、报告格式全部照正本。

## DSH 差异

- 正本「检查范围」的 CLAUDE.md 工作流条款,在 DSH 侧多两个出现点:`Demo/AGENTS.md` 与 `.dsh/skills/*/SKILL.md`。按同一不变量矩阵核这两处;出现与正本冲突的详细副本即 finding,适配卡只许留工具替换与 DSH 差异。
- 检查项里的脚本一律 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File` 调。
- 全量矩阵 `run_tests.ps1` 是分钟级:先按正本「执行档位」问用户,用户选跑才后台跑。
- 修复的提交走 `.dsh/scripts/提交.ps1`(DSH 没有 hook),不裸敲 git 写命令。
