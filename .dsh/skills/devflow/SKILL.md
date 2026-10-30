---
name: devflow
description: DeepSeek(DSH)侧的 devflow 主流程入口:需求审计 → 主工作树实现 → 自检提交。改 Demo/Assets 下产品代码或资产时默认进入,或用户显式要求走 devflow 时进入。规则正本在 Demo/.claude/skills/devflow/SKILL.md,本卡只写 DSH 的工具替换与 hook 缺位的补偿。
---

# devflow(DSH 适配层)

**正本 = `Demo/.claude/skills/devflow/SKILL.md`。开工先 Read 全篇,按它执行。** 三步的判据、停机呈报档位、自审义务、禁止事项都在正本里,本卡不重述;本卡只处理 Claude 侧那几件在 DSH 里没有对应物的事。

## 工具替换

| 正本里的动作 | DSH 侧 |
|---|---|
| Skill 工具调 `devflow-client` / `devflow-ui` | `skill` 工具调同名卡(两张自动、正文指回 `Demo/.claude/skills/<名>/SKILL.md`);`devflow-check` 是手动技能,只由用户点名,不进本流程的调用链 |
| AskUserQuestion | `ask_user_question`;裁定项仍按 CLAUDE.md「裁定项结构化」一次收齐互不依赖的项 |
| PowerShell 工具 | `pwsh`。但 **devflow 脚本一律 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <脚本> <参数>`**:脚本按 Windows PowerShell 5.1 写,不在 `pwsh` 里直接跑或点源 |
| Bash 工具 | 没有;git 与 POSIX 工具在 `pwsh` 里跑。文本走文件的惯例不变 |

## 斜杠卡

Claude 侧的斜杠卡在 DSH 没有注册命令。已落 DSH 适配卡的:自动的(`rules-audit`、`refs-check`、`unity-check`、`dotween-effects`)模型可按需 `skill` 调;手动的(`devflow-check`、`playtest`、`daily-code-review`、`show-me`)只由用户点名。没落卡的(如 `luban-dev`)按需 Read `Demo/.claude/skills/<名>/SKILL.md` 照做。

## 没有 hook:三件自动件改手动

Claude 侧 `Demo/.claude/settings.json` 的 hooks 自动做提交检查、命令通路检查、写文件补 BOM。DSH 没有 hook 机制,三件这样兜:

1. **提交**:唯一口 = `Demo/.dsh/scripts/提交.ps1`(补 BOM → 可选客户端自检 → `单仓提交.ps1` 同源校验并提交)。裸 `git commit` / `push` / `merge` 不会被拦,所以不敲。
2. **命令通路**:无对应物。DSH 侧没有「Bash 拉 powershell」「`cmd` 裸名调 bat」两条通路;风险换成「在 `pwsh` 里直接跑 5.1 脚本」,按上表禁掉。
3. **BOM**:提交入口补提交文件集里的 `.ps1` / `.psd1`。新增或改脚本后仍跑 `Demo/.claude/devflow/语法自检.ps1` 判 BOM 与语法。

## 长任务

`客户端自检.ps1` 是分钟级:一律后台作业跑,前台调用会在工具超时处被杀在半截。等待期间做不依赖该结果的工作。

## 会话位置

DSH 的技能根是 `<仓根>/.dsh/skills`(按 `.git` 定位仓根,不随工作目录变),在仓根或 `Demo/` 起会话都挂得上。脚本参数里的路径一律按仓根写。
