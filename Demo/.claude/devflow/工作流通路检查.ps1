# 工作流通路检查.ps1 — devflow 真环境 canary 通路检查(半自动,需本机可启动的 Unity 编辑器)。
# 抓假仓测试永远抓不到的环境失配:领取(双仓基线同步 + Unity 启动 + UnityMCP 就绪)+ 真客户端自检
# (静态扫描系列直跑槽位工作树)。领取段是 devflow 最常坏、最难调的部分,检查段在此验其在真槽位
# 布局上跑得通并签得出凭据。
# 不碰交付/合并:那段假仓矩阵(集成交付测试/槽位交付测试)已测透,且真跑会污染 main。检查不依赖
# 有无改动,故在纯净领取的槽位上直接跑即可验检查健康;检查后按结果释放或保留。
#
# 用法: powershell.exe -File 工作流通路检查.ps1 [-Slot <N>] [-NoRelease]
#   检查 PASS       -> 释放槽位(回滚 claim + 清看板),报 CANARY-GREEN。
#   检查非 PASS/领取失败 -> 保留槽位与已启动的编辑器供排查,报 CANARY-RED。
#   -Slot         钉住指定槽位(默认取首个空闲)。 -NoRelease 检查通过也保留槽位(调试用)。
# 退出码: 0 全通过;1 检查 FAIL 或 STALE(VERDICT 正文分报);2 领取失败/检查 INFRA。
# 只调 Agent 面入口(槽位领取)+ 检查(客户端自检)+ 受控释放(槽位领取内核 -Release);绝不调交付,不 push、不合并。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Slot = "",
  [switch]$NoRelease
)
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")
function Out-Verdict([string]$Line, [int]$Code) { Write-Host ""; Write-Host ("VERDICT: " + $Line); exit $Code }

# 拉起子脚本一律经 hook函数库 Invoke-FlowChild -Echo(边收边回显,回 @{ code; lines };子进程写 stderr
# 不抛、参数不经 cmd 改写,理由见其头注)——与 槽位交付 同一份实现。

# 槽位号的合法区间来自 flow-config,param 块的 ValidateSet 拿不到它(写死会在槽位池扩容后卡住高号槽)。
# 这里先拦一道只是为了在写简报文件之前报错;真正的归属校验在 槽位领取 内核。
if ($Slot) {
  $slotCount = (Get-FlowConfig).SlotCount
  if ($Slot -notmatch '^\d+$' -or [int]$Slot -lt 1 -or [int]$Slot -gt [int]$slotCount) {
    Out-Verdict ("CANARY-RED | slot must be in 1..$slotCount") 2
  }
}

# -- 1. 真领取:双仓基线同步 + Unity 启动 + UnityMCP 就绪确认 --
# 简报为领取入口必传(简报机判,2026-07-29):canary 生成一份合规简报(内容照实=通路检查),
# 结构须过 简报校验(段齐全/验收点非空话/无占位),不可用占位字样。
Write-Host "== [1/3] 领取(基线同步 + Unity 启动 + UnityMCP 就绪) =="
$briefFile = New-FlowTempFile "canary-brief"
$briefText = @"
## 目的

验证 devflow 真环境通路(领取基线同步、Unity 启动、UnityMCP 就绪、客户端自检)当前健康。

## 需求与方案

在一个空闲槽位执行一次纯净领取与客户端自检,不做任何产品改动,结束后按结果释放或保留槽位。调用 槽位领取 入口领取空闲槽位,随后在该槽位 Demo 直接跑 客户端自检;涉及端 = 仅客户端环境,零代码改动。

## 验收点

领取返回 ACQUIRED 且编辑器就绪;客户端自检 报 PASS 并发检查凭据;通过后槽位被释放回空闲。

## 调查摘要

无(通路检查不涉产品代码)
"@
[System.IO.File]::WriteAllText($briefFile, $briefText, (New-Object System.Text.UTF8Encoding($false)))
$acqArgs = @("-Topic", "工作流通路检查 canary", "-BriefFile", $briefFile)
if ($Slot) { $acqArgs += @("-Slot", $Slot) }
$acq = Invoke-FlowChild (Join-Path $here "槽位领取.ps1") $acqArgs -Echo
Remove-FlowTempFiles   # 简报只供领取读,领取子进程已退出
$acqOut = $acq.lines
$acqCode = $acq.code
$acqV = @($acqOut | Where-Object { $_ -match '^VERDICT: ' } | Select-Object -Last 1)
if ($acqCode -ne 0 -or $acqV.Count -eq 0 -or $acqV[0] -notmatch 'ACQUIRED') {
  $line = if ($acqV.Count -gt 0) { $acqV[0] } else { "no VERDICT line (exit=$acqCode)" }
  Out-Verdict ("CANARY-RED | 领取失败,检查未跑 | " + $line) 2
}
$m = [regex]::Match($acqV[0], 'slot=(\d+).*?root=(\S+).*?unity=(\S+)')
if (-not $m.Success) { Out-Verdict ("CANARY-RED | 领取结果无法解析: " + $acqV[0]) 2 }
$slotN = $m.Groups[1].Value
$slotRoot = $m.Groups[2].Value
$projectDir = $m.Groups[3].Value
Write-Host ("  -> 领取成功 dev" + $slotN + "  root=" + $slotRoot)

# -- 2. 真客户端自检:静态扫描系列(纯净槽位,验检查在当前环境健康) --
Write-Host ""
Write-Host "== [2/3] 客户端自检(静态扫描系列;口径正本见 客户端自检.ps1 头注) =="
$gateCode = (Invoke-FlowChild (Join-Path $here "客户端自检.ps1") @("-ProjectDir", $projectDir) -Echo).code

# -- 3. 检查通过释放槽位(回滚 claim + 清看板);检查未过保留供排查 --
function Release-Slot {
  Write-Host ""
  Write-Host "== [3/3] 释放槽位(回滚 claim + 清看板) =="
  Invoke-FlowChild (Join-Path $here "槽位领取内核.ps1") @("-Release", $slotRoot) -Echo | Out-Null
  Invoke-FlowChild (Join-Path $here "看板.ps1") @("-Slot", $slotN, "-Close") -Echo | Out-Null
}

switch ($gateCode) {
  0 {
    if ($NoRelease) { Write-Host ""; Write-Host "  (-NoRelease: 检查通过但保留槽位)" }
    else { Release-Slot }
    $tail = if ($NoRelease) { " | 槽位保留" } else { " | 已释放" }
    Out-Verdict ("CANARY-GREEN | dev" + $slotN + " | 领取 + MCP 就绪 + 检查 PASS 全通过" + $tail) 0
  }
  1 { Out-Verdict ("CANARY-RED | dev" + $slotN + " | 检查 FAIL(扫描判违规) | 槽位保留供排查,看 " + $slotRoot + "\.gate") 1 }
  3 { Out-Verdict ("CANARY-RED | dev" + $slotN + " | 检查 STALE(各道均过,槽位工作树在检查期间变了,无凭据) | 槽位保留供排查:查是谁在改这个槽位,停下后重跑") 1 }
  default { Out-Verdict ("CANARY-RED | dev" + $slotN + " | 检查 INFRA(exit=" + $gateCode + ") | 槽位保留供排查") 2 }
}
