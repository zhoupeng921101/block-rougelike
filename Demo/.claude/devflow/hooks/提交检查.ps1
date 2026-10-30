# 提交检查.ps1 - PreToolUse hook on Bash/PowerShell: the single hard choke point.
# Intercepts git commit / push / merge-like command strings:
#   1. force-push: denied outright.
#   2. client-code ticket check (gate-then-commit): a commit touching Assets/GameScripts|Launcher
#      **.cs/.asmdef requires .gate/ticket.json PASS whose tree equals the CURRENT working tree,
#      tolerating temp-test deletions (Assets/Editor/Tests) and drift outside the client
#      verification surface (校验库.ps1 ClientSurfaceRe) between gate and commit.
#   3. SERVER repo (root basename = ServerDirName; channel off while that key is empty): a commit
#      touching any .cs requires a .gate/ticket.json PASS from 服务端自检.ps1, strict tree.
#   4. local-persistence probe: added lines in GameLogic / GameBase matching PlayerPrefs write / file
#      write APIs require the commit message (or a pushed commit message) to carry a
#      本地白名单 justification tag, per data-authority whitelist rule.
# COMMAND MODEL: the command is split into segments at shell separators (; && || | & and
# newlines) and every git invocation is judged on its own - any invocation that should be
# denied denies the whole command. (Before: the first recognised verb decided the whole
# command - `git merge origin/main; git commit -a` ran as a merge and the commit was never
# checked.) Quoted arguments of shell launchers (cmd /c, powershell -Command, bash -c, iex)
# are analysed recursively as commands; cd / Set-Location / pushd segments move the working
# directory used to resolve later invocations.
# Commit file-set mirrors what each commit form records: staged (plus the whole worktree
# diff for -a/--all, in any short-option cluster such as -av / -qam); for pathspec commits
# (paths after ` -- `, positional paths, -o <paths>, --pathspec-from-file - the main-repo
# close-out form that bypasses the shared index) it is the pathspec-scoped HEAD-to-worktree
# diff plus untracked files under the pathspec INSTEAD, and the staged set does not enter;
# -i <paths> (staged + paths) over-collects.
# Push validation beyond force-deny is intentionally absent: commit is the choke point and
# pushing adds no new code (ledger records this). Merge-like verbs are not gated either: the
# slot pool whose un-pushed branches they could bring in was removed 2026-10-30.
# Besides the git gate, this hook carries ONE non-git policy: a full run_tests.ps1 matrix
# launch escalates to an "ask" decision (user veto; see the run_tests block below). If more
# command-surface policy ever accrues, split it into its own hook instead of widening this one.
# Fail-open on internal errors, telemetered for liveness review.
# PREFILTER: settings.json registers this hook behind `if` prefilters (Bash *git* / *Git* / *GIT* /
# *run_tests*, PowerShell *git* / *run_tests*), so most calls never start it. That set must stay a
# superset of what the fast path below lets through - a new non-git policy here widens those `if`
# entries first; coverage is checked by tests\命令通路检查测试.ps1 section S.
# FAST PATH: calls the prefilter lets through (and every call where harness cannot parse the
# command) still wait on this hook, and most of those are not git or a run_tests launch. The payload is read first (hook函数库 Read-HookStdin; that library loads
# without module autoload, see its header) and a payload containing neither `git` nor
# `run_tests` (case-insensitive) exits 0 before 校验库 loads - the same allow, no telemetry,
# as the full path gives it. Matching the raw JSON over-covers the command (another field
# hitting only costs the full path); a payload spelling ASCII as \u00XX escapes also takes the
# full path, so a command naming either word never skips a policy.
# Check functions/constants live in 校验库.ps1 (single check source, shared with the
# approved commit script 单仓提交 - same checks, script-internal git,
# fail-closed there); this hook keeps command-surface lexing, deny policy and fail-open.
# No script-name whitelist: waving through a whole command because it invokes an approved
# delivery script would let `<script call>; git push --force` escape as a unit. The approved
# scripts need no such rule anyway - their internal git runs in a subprocess, which is not a
# tool call and never reaches this hook.
$ErrorActionPreference = "Continue"
. ([System.IO.Path]::Combine($PSScriptRoot, "hook函数库.ps1"))
$hookRaw = Read-HookStdin
if ($hookRaw -notmatch '(?i)git|run_tests|\\u00[4-7]') { exit 0 }
. (Join-Path $PSScriptRoot "校验库.ps1")

# flow-config (baseline / server switch) is loaded lazily, so non-git tool calls never pay
# the load. Config load failure is one of two fail-closed paths of this hook (deny +
# telemetry + fix pointer): the config is the gate's rule source, and failing open here
# silently drops the ticket and persistence checks (null config disarmed the repo-shape
# matches; live-verified). The other fail-closed path is an
# unresolvable repo root for a gated invocation (see Resolve-InvRoot). Other internal errors
# keep the outer fail-open posture.

function Write-AllowNote([string]$Note) {
  # allow-with-note: same raw-UTF8 stdout channel as Deny-ToolUse, but permissionDecision
  # stays "allow" - the note rides additionalContext back into the session so the warning
  # gets named in the close-out report instead of dying in telemetry. Callers exit 0 after.
  $noteObj = @{ hookSpecificOutput = @{ hookEventName = "PreToolUse"; permissionDecision = "allow"; permissionDecisionReason = $Note; additionalContext = $Note } }
  $noteJson  = $noteObj | ConvertTo-Json -Depth 5 -Compress
  $noteBytes = [System.Text.Encoding]::UTF8.GetBytes($noteJson)
  $noteOut = [Console]::OpenStandardOutput()
  $noteOut.Write($noteBytes, 0, $noteBytes.Length); $noteOut.Flush()
}

function Format-DriftNote($DriftPaths, [string]$Channel) {
  return ("【提交检查·警示(已放行)】" + $Channel + "验证面内存在不属于本次提交的未提交改动(" + $DriftPaths.Count + " 个,如 " + (@($DriftPaths | Select-Object -First 4) -join ", ") + ")。检查凭据认证的是整棵工作树,本次提交产出的树(HEAD+清单路径)未单独受测——若被提交代码依赖这些未提交文件,推送后的提交可能编译失败。请在呈报中点名该状态,或将相关依赖一并入库。")
}

function Deny-TableDoc($Sources, [string]$Sid, [string]$Action, [string]$Root, [string]$Retry) {
  $sample = @($Sources | Select-Object -First 4) -join ", "
  Write-Telemetry @{ event = "提交检查"; action = $Action; decision = "deny"; reason = "tabledoc-not-synced"; repo = $Root; sid = $Sid }
  Deny-ToolUse ("【提交检查·表文档同步】本次变更改了 Luban 表源(" + $sample + ")但未同步 Configs/GameConfig/Datas/配置表说明.md。该文档是策划查字段语义的单一入口,漏更即过时误导。补上对应节(字段名/类型/说明/枚举取值)与表改动一并提交;确无字段语义变化(仅样式/格式/重排)时," + $Retry)
}

function Deny-DocDataRow($Rows, [string]$Sid, [string]$Action, [string]$Root, [string]$Retry) {
  $sample = @($Rows | Select-Object -First 3 | ForEach-Object { $_.TrimStart('+').Trim() }) -join "  /  "
  Write-Telemetry @{ event = "提交检查"; action = $Action; decision = "deny"; reason = "docdatarow-transcribed"; repo = $Root; sid = $Sid }
  Deny-ToolUse ("【提交检查·表数据转述探测】配置表说明.md 新增了逐行罗列表数据的表格行(" + $sample + ")。抄进文档的表数据没有任何闸校验其与 xlsx 一致,表一改就静默过时(三轮交付内出过三次)。改为一行指向源表(如「现行配置直接看 xxx.xlsx」),表里读不出来的知识(id 编码约定 / 「这是未标定占位」的警告 / 编排意图)照写不受影响;确有必要固化这份数据时," + $Retry)
}

# ============================ command lexing ============================
# All verb/flag sniffing runs on the COMMAND SKELETON: quoted spans, here-strings and bash
# heredoc bodies are replaced by NUMBERED placeholders first, so commit-message text carries
# zero weight (live incidents: "add persist code" read as staging; "--amend 文件集" text
# triggered the amend union; "(git -C 识别)" hijacked repo resolution). Quoted contents are
# kept in a side table so `-C "<quoted path>"` still resolves to the real repo (live incident:
# quoted -C stripped to a bare placeholder skipped ticket checks as repo-unresolved, Fantasy
# commit 78df40ff), and so a launcher's quoted command (cmd /c "git ...") can be re-lexed.
# The whitelist-tag checks deliberately search the ORIGINAL command - the tag lives inside
# the message - plus the -F/--file message file when present.
$script:CmdQuotes = New-Object System.Collections.Generic.List[string]
function Get-CmdSkeleton([string]$C) {
  $s = $C
  $s = [regex]::Replace($s, "(?s)@'.*?'@", ' <hs> ')
  $s = [regex]::Replace($s, '(?s)@".*?"@', ' <hs> ')
  # bash heredoc: body lines would otherwise split into "commands" at the newlines.
  $s = [regex]::Replace($s, '(?ms)<<-?[ \t]*([''"]?)([A-Za-z_][\w-]*)\1([^\n]*)\n.*?^[ \t]*\2[ \t]*\r?$', ' <hs> $3')
  $qEval = {
    param($m)
    $v = $m.Value
    $inner = $v.Substring(1, $v.Length - 2)
    if ($v[0] -eq [char]39) { $inner = $inner.Replace("''", "'") }
    $script:CmdQuotes.Add($inner)
    return (' <q' + $script:CmdQuotes.Count + '> ')
  }
  # One pass, leftmost wins: a double quote inside a single-quoted span (and vice versa)
  # stays inside its span instead of being carved out first.
  $s = [regex]::Replace($s, '"(?:[^"\\]|\\.)*"|''(?:[^'']|'''')*''', $qEval)
  # Line continuations (PowerShell backtick, bash backslash) join lines before the split.
  $s = [regex]::Replace($s, '`\r?\n', ' ')
  $s = [regex]::Replace($s, '\\\r?\n', ' ')
  # Redirections are not arguments: `2>&1`, `> out.txt`, `< msg.txt`, `<<< word` would
  # otherwise read as positional pathspecs (and the `&` in `2>&1` as a separator). The
  # lookbehinds keep placeholders (<q12>, <hs>) intact.
  $s = [regex]::Replace($s, '<<<\s*(?:<q\d+>|\S+)', ' ')
  $s = [regex]::Replace($s, '(?<![<\w])(?:\d|\*)?>>?(?:&\d+|\s*(?:<q\d+>|[^\s;&|<>()]+))?', ' ')
  $s = [regex]::Replace($s, '(?<![<\w])<(?!q\d|hs>|<)\s*(?:<q\d+>|[^\s;&|<>()]+)', ' ')
  return $s
}
function Resolve-QuotePlaceholder([string]$Tok) {
  # <qN> placeholder -> original quoted text; bounds-checked, because a LITERAL "<q99>"
  # typed in a command would otherwise throw list indexing into the outer fail-open
  # catch and silently release the whole gate.
  $m = [regex]::Match($Tok, '^<q(\d+)>$')
  if (-not $m.Success) { return $Tok }
  $i = [int]$m.Groups[1].Value
  if ($i -ge 1 -and $i -le $script:CmdQuotes.Count) { return $script:CmdQuotes[$i - 1] }
  return $Tok
}
function Get-SegTokens([string]$S) {
  # Whitespace tokens of one segment, with shell grouping punctuation peeled off (`(git`,
  # `$(git`, `{`, `}`) - left on, `}` would read as a positional pathspec. `@{...}` ref
  # suffixes keep their braces.
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($t in ($S -split '\s+')) {
    # <hs> = here-string / heredoc body: stdin to the command, never an argument.
    if (-not $t -or $t -eq '<hs>') { continue }
    $x = $t -replace '^(\$\(|@\(|[({!])+', ''
    if ($x -notmatch '@\{[^}]*\}$') { $x = $x -replace '[)}]+$', '' }
    if ($x) { $out.Add($x) }
  }
  return , $out.ToArray()
}
function Join-CmdPath([string]$Base, [string]$P) {
  # Never throws: an exception here would reach the outer fail-open catch and release the
  # whole command. A path .NET rejects comes back as-is (rev-parse then fails closed).
  try {
    $q = ConvertTo-WinRepoPath $P
    if (-not $q) { return $Base }
    if ([System.IO.Path]::IsPathRooted($q) -or -not $Base) { return $q }
    return [System.IO.Path]::GetFullPath((Join-Path $Base $q))
  } catch { return ([string]$Base + '\' + [string]$P) }
}
function Test-GitToken([string]$Tok, [bool]$First) {
  if ($Tok -match '^<q\d+>$') {
    # A quoted git executable counts only when it carries a path (`& "C:\...\git.exe"`) or
    # opens the segment (`& 'git'`): a bare "git" argument elsewhere is message text.
    $r = Resolve-QuotePlaceholder $Tok
    return (($r -match '(?i)[\\/]git(\.exe)?$') -or ($First -and $r -match '(?i)^git(\.exe)?$'))
  }
  return ($Tok -match '(?i)^(?:.*[\\/])?git(\.exe)?$')
}

$script:Invs = New-Object System.Collections.Generic.List[object]
function Add-GitInvocations([string]$Text, [string]$Cwd, [int]$Depth) {
  # Appends one record per git invocation: verb, args (skeleton tokens), dir (the -C /
  # --work-tree / cd-aware directory git runs in), cwd (for -F resolution).
  $skel = Get-CmdSkeleton $Text
  $cur = $Cwd
  $stack = New-Object System.Collections.Generic.Stack[string]
  foreach ($segText in [regex]::Split($skel, '\r?\n|;|&&|\|\||\||&')) {
    $toks = Get-SegTokens $segText
    if ($toks.Count -eq 0) { continue }
    $head = $toks[0].ToLowerInvariant()
    if (@('cd', 'chdir', 'set-location', 'sl', 'pushd', 'push-location') -contains $head) {
      $target = $null
      for ($k = 1; $k -lt $toks.Count; $k++) {
        if ($toks[$k] -match '^(/d|--|-Path|-LiteralPath)$') { continue }
        $target = Resolve-QuotePlaceholder $toks[$k]; break
      }
      # Variable-valued targets ($root) are unknowable here: keep the previous directory.
      if ($target -and $target -notmatch '\$') {
        if ($head -eq 'pushd' -or $head -eq 'push-location') { $stack.Push($cur) }
        $cur = Join-CmdPath $cur $target
      }
      continue
    }
    if ($head -eq 'popd' -or $head -eq 'pop-location') { if ($stack.Count -gt 0) { $cur = $stack.Pop() }; continue }
    if ($Depth -lt 4) {
      $launch = $false
      foreach ($t in $toks) {
        if ($t -match '(?i)(^|[\\/])(cmd|powershell|pwsh|bash|sh|wsl)(\.exe)?$' -or $t -match '(?i)^(iex|invoke-expression)$') { $launch = $true; continue }
        if ($launch -and $t -match '^<q\d+>$') {
          $inner = Resolve-QuotePlaceholder $t
          if ($inner -match '(?i)git') { Add-GitInvocations (($inner -replace '\\"', '"') -replace '`"', '"') $cur ($Depth + 1) }
        }
      }
    }
    $gitIdx = @()
    for ($i = 0; $i -lt $toks.Count; $i++) { if (Test-GitToken $toks[$i] ($i -eq 0)) { $gitIdx += $i } }
    for ($g = 0; $g -lt $gitIdx.Count; $g++) {
      $i = $gitIdx[$g]
      $end = if ($g + 1 -lt $gitIdx.Count) { $gitIdx[$g + 1] } else { $toks.Count }
      $dir = $cur
      $j = $i + 1
      # git's global prefix options. -C is case-SENSITIVE (lowercase -c is a config
      # assignment) and cumulative like git's own. Value-taking long options are consumed
      # with their value, or the value would be read as the verb and the gate skipped.
      while ($j -lt $end) {
        $t = $toks[$j]
        if ($t -ceq '-C') { if ($j + 1 -lt $end) { $dir = Join-CmdPath $dir (Resolve-QuotePlaceholder $toks[$j + 1]) }; $j += 2; continue }
        if ($t -ceq '-c' -or $t -match '^--(git-dir|namespace|config-env)$') { $j += 2; continue }
        if ($t -eq '--work-tree') { if ($j + 1 -lt $end) { $dir = Join-CmdPath $dir (Resolve-QuotePlaceholder $toks[$j + 1]) }; $j += 2; continue }
        if ($t -match '^--work-tree=(.+)$') { $dir = Join-CmdPath $dir (Resolve-QuotePlaceholder $Matches[1]); $j++; continue }
        if ($t.StartsWith('-', [StringComparison]::Ordinal)) { $j++; continue }
        break
      }
      if ($j -ge $end) { continue }
      $verb = (Resolve-QuotePlaceholder $toks[$j]).ToLowerInvariant()
      $argv = if ($j + 1 -lt $end) { @($toks[($j + 1)..($end - 1)]) } else { @() }
      $script:Invs.Add(@{ verb = $verb; args = $argv; dir = $dir; cwd = $cur })
    }
  }
}

function Resolve-LongOpt([string]$Name, [string[]]$Known) {
  # git accepts any unambiguous prefix of a long option (--al = --all).
  if ($Known -contains $Name) { return $Name }
  $c = @($Known | Where-Object { $_.StartsWith($Name, [StringComparison]::Ordinal) })
  if ($Name -and $c.Count -eq 1) { return $c[0] }
  return $Name
}

$script:CommitLong = @('all', 'include', 'only', 'amend', 'message', 'file', 'reuse-message', 'reedit-message', 'fixup', 'squash', 'author', 'date', 'template', 'cleanup', 'trailer', 'pathspec-from-file', 'pathspec-file-nul', 'untracked-files', 'verbose', 'quiet', 'dry-run', 'short', 'branch', 'porcelain', 'long', 'null', 'edit', 'no-edit', 'signoff', 'no-signoff', 'no-verify', 'verify', 'allow-empty', 'allow-empty-message', 'reset-author', 'status', 'no-status', 'gpg-sign', 'no-gpg-sign', 'interactive', 'patch', 'no-post-rewrite')
$script:CommitLongVal = @('message', 'file', 'reuse-message', 'reedit-message', 'fixup', 'squash', 'author', 'date', 'template', 'cleanup', 'trailer', 'pathspec-from-file')
function Read-CommitArgs($Toks) {
  # Real git-commit option grammar: short clusters (-qam x: q, a, then m takes the next
  # token), value options, `--`, and positional pathspecs (raw tokens, filtered later).
  $r = @{ all = $false; include = $false; amend = $false; pos = @(); dd = $false; ddPaths = @(); pf = $null; msgFile = $null }
  $i = 0
  while ($i -lt $Toks.Count) {
    $t = [string]$Toks[$i]; $i++
    if ($r.dd) { $r.ddPaths += (Resolve-QuotePlaceholder $t); continue }
    if ($t -eq '--') { $r.dd = $true; continue }
    if ($t.StartsWith('--', [StringComparison]::Ordinal)) {
      $name = $t.Substring(2); $val = $null; $hasEq = $false
      $eq = $name.IndexOf('=', [StringComparison]::Ordinal)
      if ($eq -ge 0) {
        $val = $name.Substring($eq + 1); $name = $name.Substring(0, $eq); $hasEq = $true
        if ($val -eq '' -and $i -lt $Toks.Count) { $val = [string]$Toks[$i]; $i++ }   # --message= <q1>
      }
      $name = Resolve-LongOpt $name $script:CommitLong
      if (-not $hasEq -and ($script:CommitLongVal -contains $name) -and $i -lt $Toks.Count) { $val = [string]$Toks[$i]; $i++ }
      switch ($name) {
        'all' { $r.all = $true }
        'include' { $r.include = $true }
        'amend' { $r.amend = $true }
        'file' { $r.msgFile = $val }
        'pathspec-from-file' { $r.pf = $val }
      }
      continue
    }
    if ($t.Length -gt 1 -and $t[0] -eq [char]'-') {
      $cl = $t.Substring(1)
      for ($k = 0; $k -lt $cl.Length; $k++) {
        $ch = [string]$cl[$k]
        if ($ch -cmatch '^[mFCct]$') {
          $rest = $cl.Substring($k + 1); $val = $null
          if ($rest) { $val = $rest } elseif ($i -lt $Toks.Count) { $val = [string]$Toks[$i]; $i++ }
          if ($ch -ceq 'F') { $r.msgFile = $val }
          break
        }
        if ($ch -cmatch '^[Su]$') { break }   # optional attached value (-S<keyid>, -uno)
        if ($ch -ceq 'a') { $r.all = $true }
        elseif ($ch -ceq 'i') { $r.include = $true }
      }
      continue
    }
    $r.pos += $t
  }
  return $r
}

$script:PushLong = @('force', 'force-with-lease', 'force-if-includes', 'no-force-with-lease', 'no-force-if-includes', 'mirror', 'all', 'branches', 'delete', 'tags', 'follow-tags', 'no-follow-tags', 'repo', 'receive-pack', 'exec', 'push-option', 'set-upstream', 'dry-run', 'porcelain', 'prune', 'no-verify', 'verify', 'atomic', 'no-atomic', 'signed', 'no-signed', 'recurse-submodules', 'no-recurse-submodules', 'quiet', 'verbose', 'progress', 'no-progress', 'thin', 'no-thin', 'ipv4', 'ipv6')
$script:PushLongVal = @('repo', 'receive-pack', 'exec', 'push-option')
function Read-PushArgs($Toks) {
  # force = --force* / --mirror / any `f` in a short cluster (-uf) / a `+refspec`.
  $r = @{ force = $false; all = $false; del = $false; pos = @() }
  $dd = $false; $i = 0
  while ($i -lt $Toks.Count) {
    $t = [string]$Toks[$i]; $i++
    if ($dd) { $r.pos += (Resolve-QuotePlaceholder $t); continue }
    if ($t -eq '--') { $dd = $true; continue }
    if ($t.StartsWith('--', [StringComparison]::Ordinal)) {
      $name = $t.Substring(2); $hasEq = $false
      $eq = $name.IndexOf('=', [StringComparison]::Ordinal)
      if ($eq -ge 0) { $name = $name.Substring(0, $eq); $hasEq = $true }
      $name = Resolve-LongOpt $name $script:PushLong
      if ($name -match '^force' -or $name -eq 'mirror') { $r.force = $true }
      elseif ($name -eq 'all' -or $name -eq 'branches') { $r.all = $true }
      elseif ($name -eq 'delete') { $r.del = $true }
      if (-not $hasEq -and ($script:PushLongVal -contains $name) -and $i -lt $Toks.Count) { $i++ }
      continue
    }
    if ($t.Length -gt 1 -and $t[0] -eq [char]'-') {
      $cl = $t.Substring(1)
      for ($k = 0; $k -lt $cl.Length; $k++) {
        $ch = [string]$cl[$k]
        if ($ch -ceq 'o') { if ($k + 1 -ge $cl.Length -and $i -lt $Toks.Count) { $i++ }; break }
        if ($ch -ceq 'f') { $r.force = $true }
        elseif ($ch -ceq 'd') { $r.del = $true }
      }
      continue
    }
    $r.pos += (Resolve-QuotePlaceholder $t)
  }
  for ($k = 1; $k -lt $r.pos.Count; $k++) { if (([string]$r.pos[$k]).StartsWith('+', [StringComparison]::Ordinal)) { $r.force = $true } }
  return $r
}

function Get-GateConfig {
  if ($script:CfgWf) { return $script:CfgWf }
  $c = $null
  try { $c = Get-FlowConfig } catch {}
  # ServerDirName 留空 = 服务端通道关闭(合法配置,见 flow-config 该键注释),不算缺键。
  if (-not $c -or -not $c.ClientBaseline -or -not $c.FantasyBaseline) {
    Write-Telemetry @{ event = "提交检查"; decision = "error"; error = "flow-config load failed or keys missing"; sid = $script:Sid }
    Deny-ToolUse "【提交检查】工作流配置 .claude/devflow/flow-config.psd1 加载失败或关键键缺失(ClientBaseline/FantasyBaseline),检查无法判定通道,本次 git 提交/推送先行拒绝(失败即停)。请修复该配置文件(语法自检.ps1 覆盖 psd1 语法)后重试。"
  }
  $script:CfgWf = $c
  return $c
}

function Resolve-InvRoot($Inv, [string]$Action) {
  $lines = Get-GitLines $Inv.dir "rev-parse --show-toplevel"
  if ($lines.Count -eq 0) {
    # Fail-CLOSED: a legitimate gated git invocation always resolves its repo; one whose repo
    # resolves neither from the normalized -C / cd path nor from cwd is either a command git
    # itself would reject or an attempt to route around the gate - deny, never skip.
    # (Fail-open here let a Bash-tool `git -C /d/work/... commit` slide through
    # repo-unresolved and bypass every check - live incident 2026-07-17.)
    Write-Telemetry @{ event = "提交检查"; action = $Action; decision = "deny"; reason = "repo-unresolved"; repo = $Inv.dir; sid = $script:Sid }
    Deny-ToolUse ("【提交检查】无法解析 git 仓根(-C/cd/cwd = " + $Inv.dir + "),提交检查无法定位受检仓,本次 git 提交/推送/合并先行拒绝(失败即停)。若经 Bash 工具发起、-C 用了 unix 风格路径(如 /d/work/...),请改用 Windows 盘符路径(D:\work\...),或改用 PowerShell 工具发起提交。")
  }
  return $lines[0].Trim()
}

function Test-PathspecToken([string]$Dir, [string]$Tok) {
  # A positional commit argument only switches the commit to pathspec form when git would
  # see it too. Shell debris the lexer failed to peel would otherwise flip the commit to
  # the INSTEAD semantics and drop the staged set from review; a pathspec that matches
  # nothing makes git itself refuse the commit, so dropping such a token loses nothing.
  if ($Tok -match '[<>|"]') { return $false }
  if ($Tok -match '[*?\[]' -or $Tok.StartsWith(':', [StringComparison]::Ordinal)) { return $true }
  $p = Join-CmdPath $Dir $Tok
  if ($p -and (Test-Path -LiteralPath $p)) { return $true }
  return ((Get-GitLines $Dir ("ls-files -- `"" + ($Tok -replace '"', '') + "`"")).Count -gt 0)
}

function Get-UntrackedAddedLines([string]$Root, $Paths, [string]$HdrRe) {
  # Untracked files entering a pathspec commit (staged by a `git add` earlier in the same
  # command) never show in a HEAD diff: every line of theirs is an added line.
  $out = @()
  foreach ($p in $Paths) {
    if (('+++ b/' + $p) -notmatch $HdrRe) { continue }
    $f = Join-Path $Root $p
    if (Test-Path -LiteralPath $f -PathType Leaf) { foreach ($l in [System.IO.File]::ReadAllLines($f)) { $out += ('+' + $l) } }
  }
  return , $out
}

# ============================== COMMIT ==============================
function Test-CommitInv($Inv) {
  $root = Resolve-InvRoot $Inv "commit"
  $cfg = Get-GateConfig
  $isServer = ([bool]$cfg.ServerDirName -and ($root -match ('[/\\]' + [regex]::Escape($cfg.ServerDirName) + '$')))
  # Pathspecs resolve against the command's -C/cd-aware dir, NOT the repo root: main-repo
  # commits run from Demo/, one level inside the repo.
  $repo = if ($Inv.dir) { $Inv.dir } else { $root }
  $c = Read-CommitArgs $Inv.args
  $sid = $script:Sid

  # Commit forms and the file set each records:
  #   pathspec (paths after --, positional paths, -o, --pathspec-from-file; the main-repo
  #     close-out form bypassing the shared index): HEAD + worktree state of the listed
  #     paths -> `diff HEAD -- <paths>` plus untracked files under them; the staged set does
  #     NOT enter (diffing against the index hides a path a parallel session staged at
  #     worktree content; folding the staged set in lets foreign staged files false-deny).
  #   over: -i/--include or -a with paths, or a pathspec list that could not be read ->
  #     staged + whole worktree diff (over-collection can only deny, never skip).
  #   all: -a/--all -> staged + worktree diff.   staged: plain commit.
  $psPaths = $null; $psBroken = $false
  if ($c.pf) {
    $psPaths = @()
    $pfPath = Resolve-QuotePlaceholder $c.pf
    # Relative --pathspec-from-file resolves against the -C-aware dir, matching git (-C
    # chdir happens before the file is opened).
    if (-not [System.IO.Path]::IsPathRooted($pfPath)) { $pfPath = Join-CmdPath $repo $pfPath }
    if (Test-Path -LiteralPath $pfPath) {
      $psPaths = @(Get-Content -LiteralPath $pfPath -Encoding UTF8 | Where-Object { $_ -and $_.ToString().Trim() } | ForEach-Object { $_.ToString().Trim() })
    } else { $psBroken = $true }
  }
  if ($c.dd) {
    if ($null -eq $psPaths) { $psPaths = @() }
    $psPaths += $c.ddPaths
    if ($c.ddPaths.Count -eq 0) { $psBroken = $true }
  }
  foreach ($t in $c.pos) {
    $pt = Resolve-QuotePlaceholder $t
    if (Test-PathspecToken $repo $pt) {
      if ($null -eq $psPaths) { $psPaths = @() }
      $psPaths += $pt
    }
  }
  $hasPs = ($null -ne $psPaths)
  if ($c.all -or $c.include) {
    $mode = if ($hasPs) { 'over' } elseif ($c.all) { 'all' } else { 'staged' }
  } elseif ($hasPs) {
    $mode = if ($psBroken -or $psPaths.Count -eq 0) { 'over' } else { 'pathspec' }
  } else { $mode = 'staged' }

  # Staging and committing in ONE command: PreToolUse fires before the command runs, so
  # staging done inside it is invisible (live incident: `git add F; git commit` sailed
  # through as "empty-set"). A pure pathspec commit is exempt from `add` only: its set is
  # the worktree state of the paths (untracked included), which an earlier add does not
  # change. rm/mv change the worktree itself and stay denied.
  if ($script:HasRmMv -or ($script:HasAdd -and $mode -ne 'pathspec')) {
    Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "deny"; reason = "stage-and-commit-same-command"; sid = $sid }
    Deny-ToolUse "【提交检查】git add/rm/mv 与 git commit 不允许写在同一条命令里——提交检查在命令执行前校验暂存区,同命令内的暂存对它不可见。请分两条命令:先 add,再单独 commit(路径提交 git commit -- <路径> 可与 git add 同命令)。"
  }

  $entries = @()
  $pathspecArgs = ""
  $psUntracked = @()
  if ($mode -eq 'pathspec') {
    $qArgs = (@($psPaths | ForEach-Object { '"' + ($_ -replace '"', '') + '"' }) -join ' ')
    $psEntries = ConvertTo-Entries (Get-GitLines $repo ("-c core.quotepath=false diff HEAD --name-status -- " + $qArgs))
    if ($LASTEXITCODE -eq 0) {
      $entries += $psEntries
      $psUntracked = @((Get-GitLines $repo ("-c core.quotepath=false ls-files --others --exclude-standard --full-name -- " + $qArgs)) | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ })
      foreach ($u in $psUntracked) { $entries += , @{ status = 'A'; paths = @($u) } }
      $pathspecArgs = $qArgs
    } else {
      # Gate-side diff replay failed (quoting/command-length/cwd skew) while git itself may
      # still commit fine: an empty set here would ALLOW with every check skipped.
      $mode = 'over'
    }
  }
  # core.quotepath=false on every file-set query: git's default octal-escapes non-ASCII paths
  # and any domain regex carrying Chinese then silently never matches.
  if ($mode -ne 'pathspec') {
    $entries += ConvertTo-Entries (Get-GitLines $root "-c core.quotepath=false diff --cached --name-status")
    if ($mode -eq 'all' -or $mode -eq 'over') { $entries += ConvertTo-Entries (Get-GitLines $root "-c core.quotepath=false diff --name-status") }
  }
  # --amend rewrites HEAD: its own file set re-enters the commit under review.
  if ($c.amend) { $entries += ConvertTo-Entries (Get-GitLines $root "-c core.quotepath=false diff --name-status HEAD~1 HEAD") }
  if ($entries.Count -eq 0) {
    Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = "empty-set"; repo = $root; sid = $sid }
    return
  }
  $allPaths = @(); foreach ($e in $entries) { $allPaths += $e.paths }
  $gatedHit = @($allPaths | Where-Object { $_ -match $script:GatedRe })

  # Message scope for the tag-gated checks: the original command text plus the -F/--file
  # message body (relative paths: the invocation's cwd first, then its -C dir).
  $tagScope = $script:Cmd
  if ($c.msgFile -and $c.msgFile -ne '-') {
    $fPath = Resolve-QuotePlaceholder $c.msgFile
    $fCands = if ([System.IO.Path]::IsPathRooted($fPath)) { @($fPath) } else { @((Join-CmdPath $Inv.cwd $fPath), (Join-CmdPath $repo $fPath)) }
    foreach ($fc in $fCands) {
      if ($fc -and (Test-Path -LiteralPath $fc -PathType Leaf)) { $tagScope += "`n" + (Get-Content -LiteralPath $fc -Raw -Encoding UTF8); break }
    }
  }

  # Added-line probes follow the commit form: pathspec -> scoped HEAD diff (+ untracked
  # bodies); all/over -> whole HEAD-to-worktree diff (staged + unstaged tracked lines);
  # staged -> --cached.
  $docGap = Get-TableDocGap $allPaths
  if ($docGap.Count -gt 0 -and $tagScope -notmatch '表文档无关') {
    Deny-TableDoc $docGap $sid "commit" $root "提交信息补「[表文档无关:理由]」后重试(消息经 -F 文件传递时,标注写在消息文件内即可)。"
  }
  if ($mode -eq 'pathspec') {
    # 逐条 += 累加:两者都以 `, $arr` 返回,@(f) + @(f) 得「元素是数组的 2 元数组」(静态扫描 R15)
    $docAdded = @()
    $docAdded += Get-AddedLinesInDomain $repo ("-U0 HEAD -- " + $pathspecArgs) $script:TableDocHdrRe
    $docAdded += Get-UntrackedAddedLines $root $psUntracked $script:TableDocHdrRe
  } elseif ($mode -eq 'staged') {
    $docAdded = Get-AddedLinesInDomain $root "--cached -U0" $script:TableDocHdrRe
  } else {
    $docAdded = Get-AddedLinesInDomain $root "-U0 HEAD" $script:TableDocHdrRe
  }
  $docRows = @($docAdded | Where-Object { $_ -match $script:DocDataRowRe })
  if ($docRows.Count -gt 0 -and $tagScope -notmatch '数据快照') {
    Deny-DocDataRow $docRows $sid "commit" $root "提交信息补「[数据快照:理由]」后重试(消息经 -F 文件传递时,标注写在消息文件内即可)。"
  }

  if (-not $isServer) {
    if ($mode -eq 'pathspec') {
      $added = @()
      $added += Get-AddedLinesInDomain $repo ("-U0 HEAD -- " + $pathspecArgs) $script:PersistScanHdrRe
      $added += Get-UntrackedAddedLines $root $psUntracked $script:PersistScanHdrRe
    } elseif ($mode -eq 'staged') {
      $added = Get-AddedLines $root ("--cached -U0 -- " + $script:PersistScanSpec)
    } else {
      $added = Get-AddedLines $root ("-U0 HEAD -- " + $script:PersistScanSpec)
    }
    if (@($added | Where-Object { $_ -match $script:PersistRe }).Count -gt 0) {
      if ($tagScope -notmatch '本地白名单') {
        Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "deny"; reason = "persist-no-whitelist"; repo = $root; sid = $sid }
        Deny-ToolUse "【提交检查·本地持久化探测】暂存的新增代码含本地持久化调用(PlayerPrefs 写 / File 写),但提交信息无白名单论证。按 data-authority 规约:该数据丢了能否从服务端重建?能(设备偏好/可丢缓存)→ 提交信息补「[本地白名单:理由]」后重试(消息经 -F 文件传递时,标注写在消息文件内即可);不能 → 数据归属错误,改走服务端权威,撤回本地写。"
      }
    }
  }

  # --- server-repo ticket check: any .cs requires a 服务端自检 ticket (gate-then-commit).
  if ($isServer) {
    $srvGated = @($allPaths | Where-Object { $_ -match '\.cs$' })
    if ($srvGated.Count -gt 0) {
      $why = Get-TicketVerdict $root
      if (-not (Test-TicketVerdictPass $why)) {
        Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "deny"; reason = ("server-" + $why); repo = $root; files = $srvGated.Count; sid = $sid }
        Deny-ToolUse ("【提交检查·服务端验凭据】本次提交含服务端代码(" + $srvGated.Count + " 个 .cs),但无有效凭据(" + $why + ")。先跑服务端自检:Demo/.claude/devflow/服务端自检.ps1(dotnet build 0 错 0 警,PASS 发票);检查后任何改动会使票失效。")
      }
      Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = ("server-ticket-" + $why); repo = $root; files = $srvGated.Count; sid = $sid }
      # Same partial-commit blind spot as the client channel.
      $srvDrift = Get-SurfaceDrift $root $script:ServerSurfaceRe $allPaths
      if ($srvDrift.Count -gt 0) {
        Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = "surface-drift-warn"; repo = $root; files = $srvDrift.Count; sid = $sid }
        $script:Notes.Add((Format-DriftNote $srvDrift "服务端"))
      }
    } else {
      Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = "server-no-cs"; repo = $root; sid = $sid }
    }
    return
  }

  # --- client-code ticket check.
  if ($gatedHit.Count -gt 0) {
    # Standalone temp-test cleanup commit (all entries = deletions under the scratch dir):
    # exempt without a ticket - verdicts stay anchored to the tested tree.
    if (Test-AllScratchDeletion $entries) {
      Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = "scratch-deletion-exempt"; repo = $root; sid = $sid }
    } else {
      $why = Get-TicketVerdict $root $script:ClientSurfaceRe
      if (-not (Test-TicketVerdictPass $why)) {
        Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "deny"; reason = $why; repo = $root; files = $gatedHit.Count; sid = $sid }
        $msg = "【提交检查·验凭据】本次提交含客户端代码(" + $gatedHit.Count + " 个 .cs/.asmdef),"
        if ($why -eq "tree-mismatch") { $msg += "但检查凭据树与当前工作树不符(检查后有非豁免改动)——检查凭据已失效。重跑检查(PASS 后不再改动)再提交。" }
        elseif ($why -eq "ticket-not-pass") { $msg += "但检查凭据结论不是 PASS。检查通过后再提交。" }
        else { $msg += ("但无有效凭据。先跑 .claude\devflow\客户端自检.ps1 -ProjectDir " + (Join-Path $root "Demo") + ",PASS 后经 .claude\devflow\单仓提交.ps1 -MessageFile <信息文件> -PathListFile <清单文件> 提交(该脚本内置同源校验)。检查后除删临时测试外任何改动会使票失效;唯一豁免:纯临时测试删除提交。") }
        Deny-ToolUse $msg
      }
      Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = ("ticket-" + $why); repo = $root; files = $gatedHit.Count; sid = $sid }
      # Degraded defense for the partial-commit blind spot (judgement source = 校验库
      # Get-SurfaceDrift). Warn + telemetry, never deny.
      $driftPaths = Get-SurfaceDrift $root $script:ClientSurfaceRe $allPaths
      if ($driftPaths.Count -gt 0) {
        Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = "surface-drift-warn"; repo = $root; files = $driftPaths.Count; sid = $sid }
        $script:Notes.Add((Format-DriftNote $driftPaths "客户端"))
      }
    }
  } else {
    Write-Telemetry @{ event = "提交检查"; action = "commit"; decision = "allow"; reason = "no-gated-paths"; repo = $root; sid = $sid }
  }
}

try {
  $in = Read-HookInput -Raw $hookRaw
  if (-not $in) { exit 0 }
  if (-not $in.tool_input) { exit 0 }
  $cmdProp = $in.tool_input.PSObject.Properties["command"]
  if (-not $cmdProp -or -not $cmdProp.Value) { exit 0 }
  $cmd = [string]$cmdProp.Value
  $script:Cmd = $cmd
  $script:Sid = [string]$in.session_id
  $script:Notes = New-Object System.Collections.Generic.List[string]

  # run_tests 全量矩阵的命令面匹配限执行形态:脚本名须紧跟启动位(行首、`;`/`|`/`&`、-File、
  # -Command),其间只容目录前缀且不跨空白。故把脚本当数据读不误伤——`Get-Content <目录>\run_tests.ps1`
  # 的前缀含空格够不到脚本名,`Select-String -Path <p>` 的 -Path 也不是启动位。
  $script:BgLaunch = '(?m)(?:^|[;|&]|-File\s|-Command\s)\s*["'']?(?:[^\s"'']*[\\/])?'
  $script:BgTestsRe = $script:BgLaunch + 'run_tests\.ps1'
  # 全量测试矩阵跑不跑由用户裁定,不由 agent 自行追加。正道是 agent 先用 AskUserQuestion 问,
  # 本档只作兜底 —— 拦住的是「跳过询问直接开跑」。理由:它耗时数分钟,而 agent 常在
  # 「已逐套件自测通过」之后仍自行补一轮全量回归——那属请求范围外的额外工序(实发:补完 7 道
  # 扫描的测试套件后自行发起全矩阵,被用户中断)。判决取 ask 而非 deny:跑它本身是正当的,
  # 只是该由人决定;ask 交 harness 弹框,agent 伪造不了用户的点击,故强制力不依赖自律。
  # -Suite <名> 单套件不在此列:秒级、是改完某脚本后的常规自测,照常直跑。豁免按段判:
  # -Suite 须与该次启动同在一段(别段里出现的 -Suite 不豁免)。
  # devflow-check 检查项 4 要求跑它时同样会弹一次确认,这是有意的——用户仍持否决权。
  # 判决推迟到 git 检查之后:同命令里有应拒的 git 段时拒优先于问。
  $askRunTests = $false
  foreach ($part in [regex]::Split($cmd, '\r?\n|;|&&|\|\||\||&')) {
    if (($part -match $script:BgTestsRe) -and ($part -notmatch '(?i)\s-Suite\s+\S')) { $askRunTests = $true }
  }

  if ($cmd -match '(?i)git') { Add-GitInvocations $cmd ([string]$in.cwd) 0 }
  $gateVerbs = @('commit', 'push')
  $rel = @($script:Invs | Where-Object { $gateVerbs -contains $_.verb })
  $script:HasAdd = (@($script:Invs | Where-Object { @('add', 'stage') -contains $_.verb }).Count -gt 0)
  $script:HasRmMv = (@($script:Invs | Where-Object { @('rm', 'mv') -contains $_.verb }).Count -gt 0)

  # --- force push: no marker path, denied unconditionally (user runs it manually if ever
  # needed). Judged before anything else in the command. Short-cluster match is
  # case-SENSITIVE: `commit -F <msgfile>` is not `-f` (live false-deny 2026-07-15).
  foreach ($inv in $rel) {
    if ($inv.verb -ne 'push') { continue }
    $inv.push = Read-PushArgs $inv.args
    if ($inv.push.force) {
      Write-Telemetry @{ event = "提交检查"; action = "push"; decision = "deny"; reason = "force-push"; sid = $script:Sid }
      Deny-ToolUse "【提交检查】禁止 force push(工作流硬约束)。若确有必要,由用户在 Claude 之外手动执行。"
    }
  }

  foreach ($inv in $rel) {
    if ($inv.verb -eq 'commit') { Test-CommitInv $inv }
  }

  $note = ($script:Notes -join "`n")
  if ($askRunTests) {
    Write-Telemetry @{ event = "提交检查"; action = "runtests"; decision = "ask"; sid = $script:Sid }
    $askMsg = "【全量回归由你决定】agent 要跑 run_tests.ps1 全量矩阵(全部套件,数分钟)。这是「要不要做全量回归」的业务判断,不是权限问题 —— agent 本应先用 AskUserQuestion 摆出选项问你(跑全量 / 只跑某套件 / 不跑),走到这一档说明它跳过了那步。可直接拒绝并让它改用 -Suite <套件名> 单跑。"
    if ($note) { $askMsg += "`n" + $note }
    Ask-ToolUse $askMsg
  }
  if ($note) { Write-AllowNote $note }
  exit 0
} catch {
  Write-Telemetry @{ event = "提交检查"; decision = "error"; error = [string]$_ }
  exit 0
}
