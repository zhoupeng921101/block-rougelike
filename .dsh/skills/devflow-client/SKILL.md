---
name: devflow-client
description: devflow 客户端实现段(DSH 适配卡)。只由 devflow 主流程在 client 段调用;用户直接要求做客户端功能时进 devflow,不进本卡。正文正本 = Demo/.claude/skills/devflow-client/SKILL.md。
---

# devflow-client(DSH 适配层)

**正本 = `Demo/.claude/skills/devflow-client/SKILL.md`。开工先 Read 全篇,按它执行**:输入与范围承载、取篇、编码禁止事项、开工前设施复用、自检口径、临时测试与规则核心单测各节全部照正本。

## DSH 差异

- 取篇用 `read` 工具,路径按仓根:`Demo/.claude/rules-ondemand/tengine-conventions.md`、`Demo/.claude/references/tengine/`。
- 跑脚本用 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File`,不直接在 `pwsh` 里跑 5.1 脚本。
- Unity MCP 工具同名(`manage_*` / `execute_code` / `read_console` 等);`execute_code` 首行落点守卫照正本要求写。
- 编译、自检这类长命令后台跑;实现期不另跑 `dotnet build` 的约束不变。
- 交付:槽位通道调 `.claude/devflow/槽位交付.ps1`;主工程通道提交走 `.dsh/scripts/提交.ps1`(DSH 没有 hook,不要裸敲 git 写命令)。
