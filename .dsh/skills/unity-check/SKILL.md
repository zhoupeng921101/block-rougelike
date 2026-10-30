---
name: unity-check
description: UnityMCP 连接自检。对 Unity 执行操作前确认 MCP 连到正确实例;或交互中工具突然报错、怀疑连接掉线/绑错实例时手动诊断。触发:用户说 Unity 连不上/连接自检/绑错实例。
---

# unity-check(DSH 适配层)

**正本 = `Demo/.claude/skills/unity-check/SKILL.md`。开工先 Read 全篇,按它执行;本卡只写 DSH 侧的差异,不重述正本。**

- 正本里的「实例路由与落点」「落点守卫」「落错的不止返回值还有副作用」各节,是 devflow-client / devflow-ui 反复引用的判据正本,照用。
- **实例路由的 DSH 对应**:DSH 的 Unity 走 MCP,查活动实例用 `list_mcp_resources`(server=`unity`)与 `mcpforunity://instances`,多实例时 `set_active_instance` 钉住本会话;绑定异常的判据与处置照正本,工具名换成这套。
- `execute_code` / `read_console` 等 MCP 工具同名可用;诊断步骤照正本。
