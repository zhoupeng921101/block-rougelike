# .dsh — DeepSeek(DSH)侧工作流

Claude Code 的工作流在 `Demo/.claude/`。本目录只装 DSH 的适配层:**规则正文不在这里**,规则正本仍是 `Demo/CLAUDE.md` 与 `Demo/.claude/` 下的规则篇、skill 卡与脚本。

```
skills/     DSH 技能卡(仓根发现,rank 100;在仓根或 Demo/ 起会话都挂得上)
scripts/    只有 DSH 才需要的机械件
```

## skills

本仓 `.dsh/skills/` 下的卡都是薄适配卡:正文正本在 `Demo/.claude/skills/<同名>/SKILL.md`,卡里只写 DSH 的工具替换与 hook 缺位的补偿。改规则改正本,不改这里;正本改了而卡里的替换关系不再成立时,才改卡。

- 流程:`devflow`、`devflow-client`、`devflow-ui`、`devflow-explore`、`devflow-check`
- 配套:`daily-code-review`、`playtest`、`unity-check`、`dotween-effects`、`refs-check`、`rules-audit`、`show-me`

其中 `devflow-check`、`playtest`、`daily-code-review`、`show-me` 带 `disable-model-invocation: true`(手动技能,不被模型自动调用),与正本语义一致。

`grilling` 在用户级 `~/.agents/skills/grilling`(跨工程共享,DSH 扫 `~/.agents/skills` 挂上)。

用户级技能(chatgpt-image / chatgpt-map / huaban / wayfinder / wayfinder-dispatch)的适配卡不在本仓,在 `~/.dsh/skills/<名>/SKILL.md`——它们的正本是用户级目录,适配卡也放用户级,跨工程都能用,且不把机器绝对路径写进本仓。

## scripts

| 脚本 | 职责 | 用法 | 出口码 |
|---|---|---|---|
| [提交.ps1](scripts/提交.ps1) | DSH 没有 hook,把 Claude 侧「写文件补 BOM + 提交检查」收编为提交入口:补 BOM → 可选客户端自检 → `单仓提交.ps1` 同源校验并提交(不推送) | `提交.ps1 -MessageFile <文件> (-PathListFile <文件> \| -All) [-Gate] [-CheckOnly]` | 同 单仓提交 / 客户端自检;自检不过时补一行 `VERDICT: GATE-FAIL` |

脚本按 Windows PowerShell 5.1 写,调用方一律 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <脚本> <参数>`。
