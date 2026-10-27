# slots-panel.ps1 - ASCII 名的薄转调壳,把参数原样交给同目录的 占用面板.ps1,不加任何逻辑。
# 存在理由:槽位.bat 必须是纯 ASCII(cmd 按系统 ANSI 代码页读 .bat,UTF-8 中文会让读取
# 指针偏移、后续行从中间被当命令执行,判据见 bat编码核对.ps1),而它要调的面板脚本是
# 中文名——本脚本承接这一次名字转换。
# 面板本身的职责、参数与退出码见 占用面板.ps1;本脚本不复述,也不拦截其退出码。
$ErrorActionPreference = "Stop"
$panel = Join-Path $PSScriptRoot "占用面板.ps1"
if (-not (Test-Path -LiteralPath $panel)) {
  Write-Host "VERDICT : INFRA - 占用面板.ps1 missing at '$panel'"
  exit 2
}
& $panel @args
exit $LASTEXITCODE
