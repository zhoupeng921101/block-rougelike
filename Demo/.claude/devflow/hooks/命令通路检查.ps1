# 命令通路检查.ps1 - PreToolUse hook on Bash/PowerShell: 拦两类在本机必然失败或必然乱码的
# 命令通路,拒绝理由里直接给出改写法。与 提交检查.ps1 同 matcher 并行注册(那边头注约定:命令面
# 新策略另起 hook,不加宽 git 闸)。
#   1. Bash 工具里拉起 powershell.exe / pwsh:Bash 双引号吞 `$`(`$_` 变 unsetenv)、未加引号的
#      路径吞 `\`、子进程输出按系统 ANSI(GBK)回显进会话。同一命令改走 PowerShell 工具即无此三族。
#      只判 Bash 侧;PowerShell 工具里再拉 powershell.exe -File 是 shell-conventions 的正规形态。
#   2. `cmd /c x.bat` 裸名调 bat/cmd(Bash 与 PowerShell 两侧都判):harness 置了
#      NoDefaultCurrentDirectoryInExePath,cmd 不搜当前目录,先 `cd /d` 也报「不是内部或外部命令」。
#      只在该环境变量非空时判,别处不误拦。裸名 = 不含路径分隔符、盘符、`%`(`%~dp0x.bat` 展开后带路径)。
# 判据按「启动位」匹配(行首、`;` `&` `|` `(` `$(` 之后,允许前置 VAR=x 与目录前缀),把命令名当数据
# 读的(grep powershell、echo "... pwsh ...")不误伤。heredoc 正文先剔除,写脚本/文档的正文不算命令。
# 误拦面:引号字符串里恰在启动位之后出现的命令名会被当成启动(第 1 类是 `;` 之后);提交信息正文本就走 -F 文件。
# 失败放行:内部异常 exit 0 并记遥测 error 行,活性靠 error 行为零。hook 进程本身起不来(超时、引擎
# 缺失)时 harness 同样放行。
# 两层预筛:settings.json 若给本 hook 的 handler 带 `if`(harness 侧对命令文本的子串匹配,best-effort:
# harness 判不出命令时照跑本 hook),它是第一层、下面的快速路径是第二层,`if` 集合须是快速路径放行集补集
# 的超集——本脚本新增一类或改触发字样,先加宽那些 `if`,否则新类在 harness 侧就被筛掉;覆盖由
# tests\命令通路检查测试.ps1 S 段核(注册不带 `if` 时只核到 matcher)。
# 快速路径:先取载荷原文(hook函数库 Read-HookStdin,该库载入不触发模块自动加载,见其头注),两类都
# 不可能命中即 exit 0,不载入 cmdlet 模块:第 1 类要 Bash 工具且原文含 powershell/pwsh,第 2 类要环境
# 变量已置且原文含 .bat/.cmd(均不分大小写)。按原文判是对命令的超集(别的字段碰上只是走全量);原文把 ASCII 写成
# \u00XX 转义的一律走全量,故命令里真出现这些字样时不会被快速路径漏判。与全量路径同为放行、不记遥测。
$ErrorActionPreference = "Continue"
. ([System.IO.Path]::Combine($PSScriptRoot, "hook函数库.ps1"))
$hookRaw = Read-HookStdin
$maybeBash = ($hookRaw -match '(?i)"tool_name"\s*:\s*"bash"') -and ($hookRaw -match '(?i)powershell|pwsh')
$maybeBat = [bool]$env:NoDefaultCurrentDirectoryInExePath -and ($hookRaw -match '(?i)\.(bat|cmd)')
if (-not $maybeBash -and -not $maybeBat -and $hookRaw -notmatch '\\u00[4-7]') { exit 0 }

function Remove-HeredocBody([string]$S) {
  # 同 提交检查.ps1 的 heredoc 剔除式:正文行在换行处会被误切成「命令」。
  return [regex]::Replace($S, '(?ms)<<-?[ \t]*([''"]?)([A-Za-z_][\w-]*)\1([^\n]*)\n.*?^[ \t]*\2[ \t]*\r?$', ' $3')
}

function Find-BashPowerShellLaunch([string]$Cmd) {
  $re = '(?im)(?:^|[;&|(`]|\$\(|\b(?:then|do|else|exec|time|timeout\s+\d+)\s)\s*(?:[A-Za-z_]\w*=\S*\s+)*["'']?(?:[^\s"'';&|]*[\\/])?(powershell|pwsh)(?:\.exe)?["'']?(?=\s|$|[;&|)])'
  $m = [regex]::Match($Cmd, $re)
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Find-BareBatInCmd([string]$Cmd) {
  if ($Cmd -notmatch '(?i)\bcmd(?:\.exe)?\b') { return $null }
  # 启动位:/c /k 之后(含 Start-Process 的 '/c','x.bat' 数组形态)、cmd 内的 && & || 之后、call 之后。
  $re = '(?i)(?:/[ck]["'']?\s*(?:,\s*)?|&&\s*|(?<![&>])&\s*|\|\|\s*|\bcall\s+)["'']?([^\s"''\\/:%&|<>(),;]+\.(?:bat|cmd))(?=$|[\s"''<>|&),;])'
  $m = [regex]::Match($Cmd, $re)
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

try {
  $in = Read-HookInput -Raw $hookRaw
  if (-not $in -or -not $in.tool_input) { exit 0 }
  $cmdProp = $in.tool_input.PSObject.Properties["command"]
  if (-not $cmdProp -or -not $cmdProp.Value) { exit 0 }
  $tool = [string]$in.tool_name
  $cmd = Remove-HeredocBody ([string]$cmdProp.Value)
  $sid = [string]$in.session_id

  if ($tool -match '^(?i:bash)$') {
    $hit = Find-BashPowerShellLaunch $cmd
    if ($hit) {
      Write-Telemetry @{ event = "命令通路检查"; decision = "deny"; reason = "bash-embeds-powershell"; hit = $hit; sid = $sid }
      Deny-ToolUse ("【命令通路检查】Bash 工具里拉起 " + $hit + ":Bash 双引号会吞 `$、未加引号的路径会吞 \、子进程中文输出按 GBK 回显成乱码。改用 PowerShell 工具执行同一命令(即 Windows PowerShell 5.1,控制台 UTF-8),并去掉为 Bash 加的转义。正本 = .claude/rules/shell-conventions.md「引擎」节。")
    }
  }

  if ($env:NoDefaultCurrentDirectoryInExePath) {
    $bat = Find-BareBatInCmd $cmd
    if ($bat) {
      Write-Telemetry @{ event = "命令通路检查"; decision = "deny"; reason = "bare-bat"; hit = $bat; sid = $sid }
      Deny-ToolUse ("【命令通路检查】cmd 裸名调 " + $bat + " 必然失败:harness 置了 NoDefaultCurrentDirectoryInExePath,cmd 不搜当前目录(先 cd /d 也一样)。改写成 .\" + $bat + " 或绝对路径。")
    }
  }

  exit 0
} catch {
  Write-Telemetry @{ event = "命令通路检查"; decision = "error"; error = [string]$_ }
  exit 0
}
