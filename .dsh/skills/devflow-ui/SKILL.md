---
name: devflow-ui
description: devflow UI 实现段(DSH 适配卡)。只由 devflow 主流程在含新 UI 窗口或 prefab 时、先于 devflow-client 调用。正文正本 = Demo/.claude/skills/devflow-ui/SKILL.md。
---

# devflow-ui(DSH 适配层)

**正本 = `Demo/.claude/skills/devflow-ui/SKILL.md`。开工先 Read 全篇,按它执行**:搭 prefab、生成绑定、目视自检、产出清单与「不做」的边界全部照正本。

## DSH 差异

- 脚本调用用 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File`;MCP 工具名不变。
- `execute_code` 首行落点守卫照正本与 `unity-check` 卡执行;长编译后台跑。
- 呈报里的目视证据照正本产出(开窗方式 + 结果一句话 + 截图路径)。DSH 侧截图走 MCP 的同名工具,取图来源是主工程编辑器。
- 本段不写业务代码与 Part 类文件的边界不变;提交走 devflow 主流程,不自行提交。
