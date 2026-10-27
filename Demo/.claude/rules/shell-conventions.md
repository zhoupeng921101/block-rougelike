# shell-conventions.md — 命令层执行规约

**适用**:所有 agent(含子 agent)在本机执行 shell / git / 构建命令。写 `.claude` 下脚本另读 `.claude/rules-ondemand/script-authoring.md`。

## 引擎

- 一律 Windows PowerShell 5.1:`.claude` 下脚本与会话命令同引擎,不混用;成文的固定序列按 `.claude/skills/devflow/references/script-consolidation.md` 收编为脚本。
- PowerShell 命令、`.claude` 脚本调用、`.bat` 走 **PowerShell 工具**(即 5.1);Bash 工具只跑 POSIX 工具、git、python。Bash 里拉起 powershell / pwsh、`cmd` 裸名调 bat 由 `hooks/命令通路检查.ps1` 拦,拒绝理由即改写法。
> 理由见 .claude/rules-archive/rules-rationale.md#shell-session-powershell-tool

## 文本走文件(硬惯例)

多行文本、含中文、含英文引号的参数不以字符串穿越进程边界,一律写临时文件传路径:

- hook 演练输入:`hook演练.ps1 -Json <文件>`,勿绕过脚本直管道。
- 列表/数组参数:PowerShell 数组传原生进程时在 argv 层展平为多个 token,接收侧按位置错绑。跨进程清单一律写临时文件(每行一项,UTF-8)传 `-XxxFile` 类参数(先例:`槽位领取.ps1 -PathsFile`)。
> 理由见 .claude/rules-archive/rules-rationale.md#shell-text-to-file-zero-counterexample

## 内联命令

- UTF-8 输出编码钉在脚本侧(正本 = `hooks/hook函数库.ps1` 点源处)。经 PowerShell 工具一律 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <脚本> <参数>`,调用侧不加前置;只有在非 UTF-8 控制台里单独调未点源 `hook函数库.ps1` 的脚本(如 `语法自检.ps1`、`简报校验.ps1`)才前置 `[Console]::OutputEncoding=[Text.Encoding]::UTF8`。
- 含非 ASCII 的 `.ps1` / `.psd1`(含 scratchpad 临时件)须 UTF-8 BOM,否则中文字面量打乱成解析错或「路径中具有非法字符」。经 Write / Edit 写的由 `hooks/写入补BOM.ps1` 自动补;经命令写(heredoc、Set-Content 等)的自己补:`[IO.File]::WriteAllText($p, [IO.File]::ReadAllText($p), (New-Object Text.UTF8Encoding $true))`。
- 删除/清理用 .NET API(`[System.IO.Directory]::Delete(path, $false)`、`[System.IO.File]::Delete`),不用 Remove-Item / cmd rmdir。
- 长复合命令拆成多条工具调用,每条单一动作。
- 脚本内捕获原生命令 stderr 沿用 `cmd /c "... 2>&1"`(正本见 hook函数库.ps1 `Get-WorkTreeHash` 注释);内联命令少用 `2>&1`。
- 中文乱码两种,处置相反,不据乱码断定文件损坏:①`Get-Content` 读无 BOM UTF-8 文件的乱码是显示层假象,文件没坏,改用 Read 工具核对;②`powershell.exe` 输出经 Bash 落到会话或文件里的乱码是字节层真损坏(GBK 字节),改走 PowerShell 工具重跑。已损坏文件用 `iconv -f GBK -t UTF-8` 取证,不作判据。
