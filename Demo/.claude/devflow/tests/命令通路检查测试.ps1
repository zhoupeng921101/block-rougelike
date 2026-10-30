# 命令通路检查测试.ps1 — 命令通路检查 hook(PreToolUse:Bash/PowerShell)的命令面演练矩阵。
# 经 hook演练.ps1 按 harness 方式(stdin JSON、同引擎)喂伪造输入,断言 allow/deny。无需 git 夹具。
# 覆盖:Bash 侧拉起 powershell/pwsh 的各种启动位 -> deny;把命令名当数据读(grep/echo/heredoc 正文)
#   与 PowerShell 工具侧的正规 -File 形态 -> allow;cmd 裸名调 bat 的四种写法 -> deny;带路径、%~dp0、
#   变量、非启动位 -> allow;NoDefaultCurrentDirectoryInExePath 未置时不判 bat;快速路径(两类字样都不沾即放行)不漏判:
#   大小写不敏感、载荷以 \u00XX 转义 ASCII 时走全量(转义串在运行期拼出,源码里不写字面 \u 序列)。
#   S 段读 .claude\settings.json:按 harness `if` 的模型核对上面每个 deny 样例(及 提交检查 的 git /
#   run_tests 代表形态)都会拉起对应 hook,预筛在场时普通命令不拉起。
# 隔离:$env:LOCALAPPDATA 指到夹具内,遥测落夹具;末尾核遥测 error 行为零(失败放行未触发)。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$drill = Join-Path $dfDir "hooks\hook演练.ps1"

$fx = Join-Path $env:TEMP ("flowtest-cmdpath-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null
$script:fx = $fx
$env:LOCALAPPDATA = Join-Path $fx "lad"
$savedNoDefault = $env:NoDefaultCurrentDirectoryInExePath

$script:n = 0
function New-PathPayload([string]$Tool, [string]$Command, $Bg = $null) {
  # $Bg:$null = 载荷不带 run_in_background 字段(harness 前台调用的形态);$true/$false = 显式带上。
  $ti = @{ command = $Command }
  if ($null -ne $Bg) { $ti["run_in_background"] = [bool]$Bg }
  $payload = @{ session_id = "drill"; tool_name = $Tool; cwd = $fx; tool_input = $ti }
  return ($payload | ConvertTo-Json -Depth 4 -Compress)
}
function Invoke-PathPayloadDrill([string]$Payload) {
  $script:n++
  $j = Join-Path $fx ("d" + $script:n + ".json")
  [System.IO.File]::WriteAllText($j, $Payload, (New-Object System.Text.UTF8Encoding($false)))
  return ((@(& (Get-FlowEngine) -NoProfile -File $drill -Hook "命令通路检查" -Json $j 2>&1 | ForEach-Object { [string]$_ })) -join "`n")
}
function Invoke-PathDrill([string]$Tool, [string]$Command, $Bg = $null) {
  return (Invoke-PathPayloadDrill (New-PathPayload $Tool $Command $Bg))
}
# settings.json 的 if 预筛模型(S 段用):harness 对每个 handler 的 `if` 做「工具名 + 命令文本通配」匹配,
# 不带 if 的 handler 只看 matcher。大小写口径从严(Bash 区分、PowerShell 不区分),`*` 匹配任意文本(含换行),
# 判某条命令会不会让指定 hook 被 harness 拉起。harness 的子命令切分、剥前导 VAR=、heredoc 处理不建模:模型对
# 整串匹配,这几处比 harness 宽(整串含字样而子命令不含时,模型判覆盖、harness 未必拉起)。
$script:SettingsPath = Join-Path (Split-Path $dfDir -Parent) "settings.json"
function Get-HookRegistrations([string]$ScriptName) {
  $cfg = [System.IO.File]::ReadAllText($script:SettingsPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
  $regs = @()
  foreach ($grp in @($cfg.hooks.PreToolUse)) {
    foreach ($h in @($grp.hooks)) {
      if ([string]$h.command -notmatch [regex]::Escape($ScriptName)) { continue }
      $ifProp = $h.PSObject.Properties["if"]
      $regs += , @{ matcher = [string]$grp.matcher; rule = $(if ($ifProp) { [string]$ifProp.Value } else { $null }) }
    }
  }
  return , $regs
}
function Test-HookPrefilterCovers($Regs, [string]$Tool, [string]$Command) {
  foreach ($r in $Regs) {
    if ($Tool -cnotmatch $r.matcher) { continue }
    if (-not $r.rule) { return $true }
    $m = [regex]::Match($r.rule, '^(\w+)\((.*)\)$', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $m.Success -or $m.Groups[1].Value -cne $Tool) { continue }
    $globRe = '^' + ([regex]::Escape($m.Groups[2].Value) -replace '\\\*', '.*') + '$'
    $opt = [System.Text.RegularExpressions.RegexOptions]::Singleline
    if ($Tool -ne 'Bash') { $opt = $opt -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase }
    if ([regex]::IsMatch($Command, $globRe, $opt)) { return $true }
  }
  return $false
}

try {
  # ---------- B:Bash 侧拉起 powershell ----------
  $env:NoDefaultCurrentDirectoryInExePath = ""
  $deny = @(
    'powershell.exe -NoProfile -File x.ps1',
    'cd /e/x && powershell.exe -NoProfile -Command "[Console]::OutputEncoding=[Text.Encoding]::UTF8; & ''a.ps1''" 2>&1 | tail -5',
    'ls; "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe" -File a.ps1',
    'X=1 pwsh -c ''Get-Date''',
    'echo a | powershell -Command -',
    'POWERSHELL.EXE -File x.ps1',
    ('S=/tmp; cat > $S/a.ps1 <<''EOF''' + "`n" + 'Write-Host hi' + "`n" + 'EOF' + "`n" + 'powershell.exe -File $S/a.ps1')
  )
  $i = 0
  foreach ($c in $deny) { $i++; Assert-True (Test-Denied (Invoke-PathDrill "Bash" $c)) ("B-deny$i Bash 拉起 powershell -> deny: " + $c.Split("`n")[0]) }
  $bDeny = $deny
  $allow = @(
    'grep -rn "powershell.exe" .claude',
    'echo "later run powershell here"',
    'git log --grep=pwsh --oneline',
    ('cat > a.md <<''EOF''' + "`n" + 'powershell.exe -File x.ps1' + "`n" + 'EOF'),
    'ls ./powershell-notes'
  )
  $i = 0
  foreach ($c in $allow) { $i++; Assert-True (-not (Test-Denied (Invoke-PathDrill "Bash" $c))) ("B-allow$i 命令名当数据 -> allow: " + $c.Split("`n")[0]) }
  $o = Invoke-PathDrill "PowerShell" 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File ''E:\x\a.ps1'''
  Assert-True (-not (Test-Denied $o)) "B-ps PowerShell 工具侧 -File 正规形态 -> allow"
  $o = Invoke-PathDrill "Bash" 'powershell.exe -File x.ps1'
  Assert-True ($o -match 'PowerShell') "B-msg 拒绝理由指向 PowerShell 工具"

  # ---------- T:cmd 裸名调 bat ----------
  $env:NoDefaultCurrentDirectoryInExePath = "1"
  $deny = @(
    @("PowerShell", 'Set-Location E:\x\Configs\GameConfig; cmd /c "gen_code_bin_to_server.bat < nul" | Select-Object -Last 15'),
    @("PowerShell", 'cmd /c "cd /d E:\x && call gen.bat < nul"'),
    @("PowerShell", '$p = Start-Process -FilePath ''cmd.exe'' -ArgumentList ''/c'',''gen.bat'' -Wait -PassThru'),
    @("Bash", 'cd /e/x && cmd.exe /c gen.cmd')
  )
  $i = 0
  foreach ($c in $deny) { $i++; Assert-True (Test-Denied (Invoke-PathDrill $c[0] $c[1])) ("T-deny$i 裸名 bat -> deny: " + $c[1]) }
  $tDeny = $deny
  $allow = @(
    'cmd /c ".\gen.bat < nul"',
    'cmd /c "E:\x\Configs\GameConfig\gen.bat"',
    'cmd /c "%~dp0gen.bat"',
    'cmd /c "`"$bat`" 2>&1"',
    'findstr /c:"x.bat" list.txt',
    'cmd /c "echo x > out.bat"',
    'git -C E:\x add tools/gen.bat'
  )
  $i = 0
  foreach ($c in $allow) { $i++; Assert-True (-not (Test-Denied (Invoke-PathDrill "PowerShell" $c))) ("T-allow$i 带路径/非启动位 -> allow: " + $c) }
  $o = Invoke-PathDrill "PowerShell" 'cmd /c "gen.bat"'
  Assert-True ($o -match 'gen\.bat 或绝对路径') "T-msg 拒绝理由给出 .\gen.bat 改写"
  $env:NoDefaultCurrentDirectoryInExePath = ""
  Assert-True (-not (Test-Denied (Invoke-PathDrill "PowerShell" 'cmd /c "gen.bat"'))) "T-env 环境变量未置 -> 不判 bat"

  # ---------- F:快速路径(夹具路径不含两类字样;env 此时未置)----------
  Assert-True (-not (Test-Denied (Invoke-PathDrill "Bash" 'ls -la'))) "F-allow Bash 普通命令走快速路径 -> allow"
  $u = [string][char]92 + 'u'
  $esc = (New-PathPayload "Bash" 'powershell.exe -File x.ps1').Replace('powershell', ($u + '0070owershell'))
  Assert-True (-not $esc.Contains('powershell')) "F-esc 夹具自检:载荷里 powershell 已改写成转义形态"
  Assert-True (Test-Denied (Invoke-PathPayloadDrill $esc)) "F-deny 载荷以 \u00XX 转义 ASCII 字母 -> 走全量路径,照判 deny"

  # ---------- S:settings.json 的 if 预筛不漏本 hook 与 提交检查 的拒绝样例 ----------
  # 预筛只许比两 hook 的判据宽:上面每个 deny 样例在 harness 侧都必须拉起本 hook;不碰任何字样的普通命令不拉起。
  $regs = Get-HookRegistrations "命令通路检查.ps1"
  Assert-True ($regs.Count -gt 0) ("S-reg 命令通路检查 在 settings.json PreToolUse 有注册: " + $script:SettingsPath)
  $i = 0
  foreach ($c in $bDeny) { $i++; Assert-True (Test-HookPrefilterCovers $regs "Bash" $c) ("S-cover-B$i if 预筛覆盖: " + $c.Split("`n")[0]) }
  $i = 0
  foreach ($c in $tDeny) { $i++; Assert-True (Test-HookPrefilterCovers $regs $c[0] $c[1]) ("S-cover-T$i if 预筛覆盖: " + $c[1]) }
  $extra = @(
    @("Bash", 'PowerShell.exe -File x.ps1'), @("Bash", 'Powershell -Command x'), @("Bash", 'PWSH -c x'), @("Bash", 'Pwsh -c x'),
    @("Bash", 'cmd //c GEN.BAT'), @("Bash", 'cmd //c Gen.Cmd'), @("PowerShell", 'cmd /c GEN.CMD')
  )
  foreach ($c in $extra) { Assert-True (Test-HookPrefilterCovers $regs $c[0] $c[1]) ("S-cover-case 大小写变体覆盖: " + $c[0] + " " + $c[1]) }
  $gRegs = Get-HookRegistrations "提交检查.ps1"
  Assert-True ($gRegs.Count -gt 0) "S-reg 提交检查 在 settings.json PreToolUse 有注册"
  $gitCmds = @(
    @("Bash", 'git -C /c/x push --force origin main'),
    @("Bash", 'cd /c/x && GIT commit -F m.txt'),
    @("Bash", 'echo a; Git push origin agent/dev1'),
    @("Bash", 'cmd //c "git commit -m x"'),
    @("Bash", 'bash -c "git merge agent/dev1"'),
    @("Bash", 'r=$(git rev-parse HEAD) && echo $r'),
    @("Bash", '"/c/Program Files/Git/cmd/git.exe" commit -F m.txt'),
    @("Bash", ('cat > m.txt <<''EOF''' + "`n" + 'msg' + "`n" + 'EOF' + "`n" + 'git commit -F m.txt')),
    @("Bash", 'powershell.exe -File .claude/devflow/run_tests.ps1'),
    @("PowerShell", '& "C:\Program Files\Git\cmd\git.exe" -C E:\x commit -m x'),
    @("PowerShell", 'Set-Location E:\x; GIT push --force origin main'),
    @("PowerShell", 'if ($true) { git -C E:\x merge agent/dev2 }'),
    @("PowerShell", 'powershell.exe -NoProfile -File E:\x\.claude\devflow\run_tests.ps1')
  )
  foreach ($c in $gitCmds) { Assert-True (Test-HookPrefilterCovers $gRegs $c[0] $c[1]) ("S-cover-G 提交检查 if 预筛覆盖: " + $c[0] + " " + $c[1].Split("`n")[0]) }
  # 预筛在场时(任一注册带 if)才断言它真的筛掉普通命令;整体退回无条件注册是安全侧的回退(只多耗时),
  # 此时只打一行 INFO。
  if (@(($regs + $gRegs) | Where-Object { $_.rule }).Count -gt 0) {
    foreach ($c in @(@("Bash", 'ls -la'), @("Bash", 'python -V'), @("PowerShell", 'Get-ChildItem C:\t | Select-Object -First 3'))) {
      Assert-True (-not (Test-HookPrefilterCovers ($regs + $gRegs) $c[0] $c[1])) ("S-skip 普通命令不拉起两 hook: " + $c[0] + " " + $c[1])
    }
  } else { Write-Host "[INFO] S-skip 跳过:settings.json 里两 hook 均为无条件注册(无 if 预筛)" }

  # ---------- 活性 ----------
  $telDir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
  $errLines = @()
  if (Test-Path $telDir) { $errLines = @(Get-ChildItem $telDir -Filter *.jsonl | ForEach-Object { Get-Content $_.FullName -Encoding UTF8 } | Where-Object { $_ -match '"decision":"error"' }) }
  Assert-True ($errLines.Count -eq 0) ("L1 遥测无 error 行(失败放行未触发)" + $(if ($errLines.Count) { ": " + $errLines[0] } else { "" }))
}
finally {
  $env:NoDefaultCurrentDirectoryInExePath = $savedNoDefault
  Remove-Fixture
}

Write-Host ""
Exit-TestSuite
