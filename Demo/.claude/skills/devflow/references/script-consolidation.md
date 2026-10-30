# 固定序列脚本化 · 约束细则

固定序列脚本化的正本,受众 = 改工作流基建(卡片/脚本)的会话;入站指针 = `.claude/rules/shell-conventions.md`「引擎」节。

规则卡中**成文的固定多步命令序列**(或同一会话内第二次现场重拼的序列)= 结构性复发,应固化为 `.claude/devflow/` 下的脚本,不留给模型每次现场重打。约束三条:①机械步骤入脚本,判断类步骤留会话;提交前检查与提交的 Agent 接口固定为 `客户端自检.ps1`、`单仓提交.ps1`,内部脚本不直接暴露给 Agent(入口登记见 `静态扫描.ps1` `$EntryAllow`);②固化与卡片改写同一改动交付;③新脚本在义务台账登记承载关系。
> 理由见 .claude/devflow/rationale.md#fixed-sequence-separate-section
