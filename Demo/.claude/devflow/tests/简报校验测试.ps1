# 简报校验测试.ps1 — 简报校验.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:合规 PASS/缺段/空段/占位(独立 TODO / TBD 拒、紧邻中文仍拒、模板指引行未替换拒;待定 / 待补、
#   小写与非独立的 todo / TODOs / TODOS / myTODO 放行;明细写出命中词、同段多处全列、一行多词连写)/验收点空话/
#   简报缺失/模板缺失 INFRA/自定义模板为必填段正本/模板外多段合法。
# 跑法:简报校验测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 简报校验.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "简报校验.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-brief-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

function New-BriefFile([string[]]$Lines) {
  $p = Join-Path $script:fx ("brief-" + [Guid]::NewGuid().ToString("N") + ".md")
  [System.IO.File]::WriteAllLines($p, $Lines, (New-Object System.Text.UTF8Encoding($false)))
  return $p
}
function Invoke-BriefCheck([string]$BriefPath, [string]$TemplatePath) {
  $argv = @('-BriefFile', $BriefPath)
  if ($TemplatePath) { $argv += @('-TemplateFile', $TemplatePath) }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}
function Get-GoodBriefLines {
  return @(
    "## 目的", "让玩家能按品质排序背包,减少翻找时间",
    "## 需求与方案", "背包界面新增品质排序按钮,点击按品质降序重排;客户端 UI 层复用既有品质字段,不涉服务端",
    "## 验收点", "点击排序按钮后,背包物品按品质降序显示",
    "## 调查摘要", "无"
  )
}

Write-Host "== 简报校验 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 合规
  $r = Invoke-BriefCheck (New-BriefFile (Get-GoodBriefLines)) ""
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: PASS') "T1 四段合规 -> PASS exit 0"

  # T2 缺段
  $lines = @(Get-GoodBriefLines | Where-Object { $_ -ne "## 验收点" -and $_ -notmatch '品质降序显示' })
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 1 -and $r.out -match '缺段: 验收点' -and $r.out -match 'VERDICT: FAIL') "T2 缺验收点段 -> FAIL 点名"

  # T3 空段(标题在、内容空)
  $lines = @(Get-GoodBriefLines | Where-Object { $_ -notmatch '品质降序显示' })
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 1 -and $r.out -match '空段: 验收点') "T3 验收点空段 -> FAIL 点名"

  # T4 独立 TODO 占位 -> 拒,明细行写出命中词、段名与行原文
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "TODO 补接口清单")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 1 -and $r.out -match 'BRIEF-ISSUE: 占位「TODO」: \[改动范围\] TODO 补接口清单') "T4 独立 TODO -> FAIL 点名命中词与段"

  # T4b 独立 TBD 占位 -> 拒
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "数值表:TBD")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 1 -and $r.out -match '占位「TBD」: \[改动范围\] 数值表:TBD') "T4b 独立 TBD -> FAIL"

  # T4c 紧邻中文的 TODO 仍算独立标记(边界只排 ASCII 字母数字下划线)
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "这里TODO接口")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 1 -and $r.out -match '占位「TODO」: \[改动范围\]') "T4c 中文紧邻 TODO -> FAIL"

  # T5 模板自身当简报(指引行未替换)-> 占位拒,四段各报一条「填写指引」
  $tpl = Join-Path $dfDir "templates\简报模板.md"
  $r = Invoke-BriefCheck $tpl ""
  $tplHits = @([regex]::Matches($r.out, 'BRIEF-ISSUE: 占位「填写指引」: \[')).Count
  Assert-True ($r.code -eq 1 -and $tplHits -eq 4) "T5 未替换指引行 -> FAIL,四段各报「填写指引」(实得 $tplHits)"

  # T7 验收点空话
  $lines = @(Get-GoodBriefLines | ForEach-Object { if ($_ -match '品质降序显示') { "对排序异常做适当处理" } else { $_ } })
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 1 -and $r.out -match '验收点空话') "T7 空话验收点 -> FAIL"

  # T8 常规功能验收点写「同目的」合法
  $lines = @(Get-GoodBriefLines | ForEach-Object { if ($_ -match '品质降序显示') { "同目的" } else { $_ } })
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: PASS') "T8 验收点「同目的」-> PASS"

  # T9 简报文件缺失
  $r = Invoke-BriefCheck (Join-Path $script:fx "no-such-brief.md") ""
  Assert-True ($r.code -eq 1 -and $r.out -match 'brief not found') "T9 简报缺失 -> FAIL exit 1"

  # T10 模板缺失 -> INFRA
  $r = Invoke-BriefCheck (New-BriefFile (Get-GoodBriefLines)) (Join-Path $script:fx "no-such-template.md")
  Assert-True ($r.code -eq 2 -and $r.out -match 'VERDICT: INFRA') "T10 模板缺失 -> INFRA exit 2"

  # T11 自定义模板为必填段正本(A/B 两段即合规,不要求默认模板的各段)
  $ct = Join-Path $script:fx "tpl-ab.md"
  [System.IO.File]::WriteAllLines($ct, @("## A", "(填写指引:x)", "## B", "(填写指引:y)"), (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-BriefCheck (New-BriefFile @("## A", "内容甲", "## B", "内容乙")) $ct
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: PASS') "T11 模板即必填段正本"

  # T12 模板外多段合法
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "Demo/Assets/GameLogic/Bag/")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: PASS') "T12 多出改动范围段 -> PASS"

  # T13 「待定」「待补」是产品用语,不算占位(历史误报原句形态)
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "美术:沿用现有礼包窗皮,呈报标注美术待补", "通行证数值仍是策划待定项,不在本轮")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: PASS') "T13 待定 / 待补 -> PASS"

  # T14 非独立或小写的 todo / TBD 不算占位(含全大写后缀 TODOS / TBDX)
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "背包 todo 列表", "清理 TODOs 注释", "TODOS 汇总", "myTODO 与 TODO_list", "TBDs 字段", "TBDX 标记", "TODO2 编号")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: PASS') "T14 todo / TODOs / TODOS / myTODO / TODO_list / TBDs / TBDX / TODO2 -> PASS"

  # T15 同段多处命中全部列出(不止首处),计数随之
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "TODO 甲", "正常行", "TBD 乙")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  $c15 = @([regex]::Matches($r.out, 'BRIEF-ISSUE: 占位')).Count
  Assert-True ($r.code -eq 1 -and $c15 -eq 2 -and $r.out -match '占位「TODO」: \[改动范围\] TODO 甲' -and $r.out -match '占位「TBD」: \[改动范围\] TBD 乙' -and $r.out -match '2 issue\(s\)') "T15 同段两处命中 -> 两条明细(实得 $c15)"

  # T16 一行命中多个词 -> 一条明细,命中词按出现序连写、去重
  $lines = @(Get-GoodBriefLines) + @("## 改动范围", "TBD 与 TODO 及 TODO")
  $r = Invoke-BriefCheck (New-BriefFile $lines) ""
  $c16 = @([regex]::Matches($r.out, 'BRIEF-ISSUE: 占位')).Count
  Assert-True ($r.code -eq 1 -and $c16 -eq 1 -and $r.out -match '占位「TBD」「TODO」: \[改动范围\]') "T16 一行两词 -> 一条明细连写命中词(实得 $c16)"
}
finally {
  Remove-Fixture
}

Write-Host ""
Exit-TestSuite
