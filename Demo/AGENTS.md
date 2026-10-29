# AGENTS.md(Demo · DeepSeek)

DeepSeek(DSH)会话在 `Demo/` 下的入口。**工作规则的正文与正本 = 同目录 `CLAUDE.md`**,开工先读它;本文件只写 DSH 侧的差异、入口与后果,不重述规则。

## 与 Claude 侧的差异

- **没有 hooks。** Claude 侧由 `.claude/settings.json` 自动跑提交检查、命令通路检查、写文件补 BOM;DSH 没有 hook 机制,这三件不自动发生。后果:裸 `git commit` / `push` / `merge` 不会被拒,含中文的 `.ps1` 写完不会自动补 BOM。
  - 提交一律走 `.dsh/scripts/提交.ps1`(补 BOM → 可选客户端自检 → `单仓提交.ps1` 同源校验),不裸敲 git 写命令;改动落在客户端自检读取面时带 `-Gate`。槽位通道仍只调 `槽位领取.ps1` / `槽位交付.ps1`。
  - 新增或改 `.ps1` / `.psd1` 后跑 `.claude/devflow/语法自检.ps1`。
- **shell 是 PowerShell 7。** devflow 脚本按 Windows PowerShell 5.1 写,一律 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <脚本> <参数>`;不在 `pwsh` 里直接跑或点源 `.claude` 下脚本。
- **工具名**:提问 = `ask_user_question`;子会话/并行分派 = `subagent`;技能 = `skill`;改文件 = `write` / `edit`。
- **技能与脚本不随工作目录变**:技能根 = 仓根 `.dsh/skills`(按 `.git` 定位仓根),在仓根或 `Demo/` 起会话都挂得上;脚本路径一律按仓根写。
- **长任务后台跑**:`槽位领取` / `客户端自检` / `槽位交付` 是分钟级,前台调用会被工具超时杀掉。

## 入口

| 要做的事 | 入口 |
|---|---|
| 产品代码与资产的默认流程 | skill `devflow`(三段式:需求审计 → 槽位实现 → 槽位交付) |
| 客户端实现段 / UI 段 | skill `devflow-client` / `devflow-ui` |
| 改完工作流族文件后核对一致性 | skill `devflow-check` |
| 主工程通道提交 | `.dsh/scripts/提交.ps1` |
| 槽位领取 / 交付 | `.claude/devflow/槽位领取.ps1` / `.claude/devflow/槽位交付.ps1` |
| 交付前自审触发项 | `.claude/devflow/自审触发判定.ps1 -Slot <N> -MessageFile <文件>` |
