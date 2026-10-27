# xlsx读取库测试.ps1 — hooks\xlsx读取库.ps1 的单元测试(同进程 dot-source,夹具落 %TEMP%,零 git)。
# 覆盖:inlineStr / sharedStrings 两种字符串形态的 XML 实体解码(&amp; &lt; &gt; &quot; &apos; 与数字字符引用);
#   自闭合 <row .../>(空样式行)不并入下一行;自闭合单元格不窃取右邻;文件缺失 / 空路径返回 $null。
# 各扫描道次经它读表,其 CLI 套件只间接覆盖;本套件直接锁读取层契约。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
. (Join-Path $script:TestLibDfDir "hooks\xlsx读取库.ps1")

$script:fx = Join-Path $env:TEMP ("flowtest-xlsx-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 原样写 sheet1.xml(与可选 sharedStrings.xml)进 zip:需要自闭合行、实体等 New-XlsxFixture 不产出的形态。
function New-RawXlsx([string]$SheetData, [string]$SharedXml = "") {
  Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction Stop
  $p = Join-Path $script:fx ([Guid]::NewGuid().ToString("N") + ".xlsx")
  $zip = [System.IO.Compression.ZipFile]::Open($p, 'Create')
  try {
    $entries = @{ 'xl/worksheets/sheet1.xml' = ('<?xml version="1.0" encoding="UTF-8"?><worksheet><sheetData>' + $SheetData + '</sheetData></worksheet>') }
    if ($SharedXml) { $entries['xl/sharedStrings.xml'] = ('<?xml version="1.0" encoding="UTF-8"?><sst>' + $SharedXml + '</sst>') }
    foreach ($k in $entries.Keys) {
      $sw = New-Object System.IO.StreamWriter($zip.CreateEntry($k).Open(), (New-Object System.Text.UTF8Encoding($false)))
      try { $sw.Write($entries[$k]) } finally { $sw.Close() }
    }
  } finally { $zip.Dispose() }
  return $p
}

Write-Host "== xlsx读取库 单元测试 =="
try {
  # T1 inlineStr 实体(经共享夹具 New-XlsxFixture:它按 XML 规则转义 & < >)
  $p = Join-Path $script:fx "inline.xlsx"
  New-XlsxFixture $p @(@{ A = 'a&b'; B = '<x>'; C = 'plain' })
  $rows = Get-XlsxRowCells $p
  Assert-True ($rows[0]['A'] -eq 'a&b' -and $rows[0]['B'] -eq '<x>' -and $rows[0]['C'] -eq 'plain') "T1 inlineStr &amp; &lt; &gt; 解码"

  # T2 sharedStrings 实体(含 rich text 拆段、&quot; &apos; 与十进制 / 十六进制字符引用)
  $shared = '<si><t>&quot;q&quot;</t></si><si><r><t>it&apos;s </t></r><r><t>&#20013;&#x6587;</t></r></si>'
  $p = New-RawXlsx '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>' $shared
  $rows = Get-XlsxRowCells $p
  Assert-True ($rows[0]['A'] -eq '"q"' -and $rows[0]['B'] -eq "it's 中文") "T2 sharedStrings 实体与字符引用解码"

  # T3 &amp;lt; 只解一层(不二次解码成 <)
  $p = New-RawXlsx '<row r="1"><c r="A1" t="inlineStr"><is><t>&amp;lt;</t></is></c></row>'
  $rows = Get-XlsxRowCells $p
  Assert-True ($rows[0]['A'] -eq '&lt;') "T3 &amp;lt; -> &lt;(单层解码)"

  # T4 自闭合空样式行不并入下一行:行数与行序保持
  $p = New-RawXlsx ('<row r="1"><c r="A1" t="inlineStr"><is><t>h</t></is></c></row>' +
                    '<row r="2" s="3" customFormat="1"/>' +
                    '<row r="3"><c r="A3" t="inlineStr"><is><t>d</t></is></c></row>')
  $rows = Get-XlsxRowCells $p
  Assert-True ($rows.Count -eq 3 -and $rows[1].Count -eq 0 -and $rows[2]['A'] -eq 'd') "T4 自闭合行独立成空行,下一行不被吞"

  # T5 自闭合单元格不窃取右邻(既有修复的回归锚)
  $p = New-RawXlsx '<row r="1"><c r="A1" s="8" t="inlineStr"/><c r="B1" t="inlineStr"><is><t>v</t></is></c></row>'
  $rows = Get-XlsxRowCells $p
  Assert-True (-not $rows[0].ContainsKey('A') -and $rows[0]['B'] -eq 'v') "T5 自闭合单元格不吞右邻"

  # T6 数值单元格原样
  $p = New-RawXlsx '<row r="1"><c r="A1"><v>42</v></c></row>'
  $rows = Get-XlsxRowCells $p
  Assert-True ($rows[0]['A'] -eq '42') "T6 数值单元格"

  # T7 读不到:文件缺失 / 空路径 -> $null
  Assert-True ($null -eq (Get-XlsxRowCells (Join-Path $script:fx "none.xlsx")) -and $null -eq (Get-XlsxRowCells "")) "T7 缺失 / 空路径 -> `$null"
}
finally {
  Remove-Fixture
}
Exit-TestSuite
