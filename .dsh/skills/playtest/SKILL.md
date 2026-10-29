---
name: playtest
description: AI 验收跑测:在 Play 模式真实操作游戏、核对功能是否达成目标。触发:用户要求在编辑器里实测 / 验收 / 自行测试已交付的功能。只观察与报告,不改产品代码。
disable-model-invocation: true
---

# playtest(DSH 适配层)

**正本 = `Demo/.claude/skills/playtest/SKILL.md`。开工先 Read 全篇,按它执行;本卡只写 DSH 侧的差异,不重述正本。**

- Play 模式控制:DSH 经 Unity MCP 的 `manage_editor`(play/pause/stop)与 `manage_camera`(screenshot)操作;取实例、落点守卫照 `unity-check` 卡。
- 跑测中间产物仍落 `playtest/`(仓根已 gitignore);只观察与报告、不改产品代码的边界照正本。
