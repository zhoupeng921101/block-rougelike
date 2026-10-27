# xlsx读取库.ps1 — .xlsx(zip + xml)最小读取层。核对类脚本共用,勿在各脚本内联复制
# (同体副本会被 静态扫描 R2 拦;两处曾各持一份,其中一处的单元格正则漏洞只修了一半)。
# 用法: . (Join-Path $PSScriptRoot "hooks\xlsx读取库.ps1")  然后 Get-XlsxRowCells <路径>
#
# 只解 sheet1,两种字符串存储形态都处理:inlineStr(<is><t>) 与 sharedStrings(t="s" 下标)
# —— Excel 重存会在两者间切换,只认一种会在别人用 Excel 改过表之后突然读不出。
#
# 读取过程抛异常时先 Write-Host 一行真因再返 $null(最常见的是表正被 Excel 打开、OpenRead 抛
# IOException)。返回契约不变,调用方的降级与 INFRA 分支照旧;那一行只是让「解析不出数据行」
# 这类下游报错前面有个指得到根源的说明。

# zip 条目取文本;条目不存在返回 $null。
function Read-XlsxEntry($Zip, [string]$Name) {
  $e = $Zip.Entries | Where-Object { $_.FullName -eq $Name } | Select-Object -First 1
  if (-not $e) { return $null }
  $sr = New-Object System.IO.StreamReader($e.Open(), [System.Text.Encoding]::UTF8)
  try { return $sr.ReadToEnd() } finally { $sr.Close() }
}

# 单元格文本是 XML 字符数据:五个预定义实体与数字字符引用须解码,否则 `a&b` 读成 `a&amp;b`,
# 与代码侧字面量比对静默失配。单趟替换,`&amp;lt;` 只解成 `&lt;`、不二次解码。
function ConvertFrom-XlsxXmlText([string]$Text) {
  if ($Text.IndexOf('&', [System.StringComparison]::Ordinal) -lt 0) { return $Text }
  return [regex]::Replace($Text, '&(#x[0-9A-Fa-f]+|#[0-9]+|amp|lt|gt|quot|apos);', {
    param($m)
    $k = $m.Groups[1].Value
    switch -CaseSensitive ($k) {
      'amp'  { return '&' }
      'lt'   { return '<' }
      'gt'   { return '>' }
      'quot' { return '"' }
      'apos' { return "'" }
    }
    $cp = if ($k.StartsWith('#x', [System.StringComparison]::Ordinal)) { [Convert]::ToInt32($k.Substring(2), 16) } else { [int]$k.Substring(1) }
    return [char]::ConvertFromUtf32($cp)
  })
}

# 返回每行的「列字母 -> 单元格文本」哈希表数组(值已 Trim);读不到返回 $null,
# 由调用处决定判 INFRA 还是降级。行序即表内顺序,表头行一并返回——数据行判据各表不同,由调用方筛。
function Get-XlsxRowCells([string]$XlsxPath) {
  # 空路径与不存在同归「读不到」:调用方按模式找表时找不到会传空串(跨端配置核对 即如此),
  # 而 Test-Path -LiteralPath "" 抛的是参数绑定异常、且这句在 try 之外,会击穿调用方的降级路径。
  if (-not $XlsxPath -or -not (Test-Path -LiteralPath $XlsxPath)) { return $null }
  $zip = $null
  try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction Stop
    $zip = [System.IO.Compression.ZipFile]::OpenRead($XlsxPath)

    # sharedStrings(若有):按出现序建索引,<si> 内可能被 rich text 拆成多个 <t>,需拼接。
    $shared = @()
    $ssXml = Read-XlsxEntry $zip 'xl/sharedStrings.xml'
    if ($ssXml) {
      foreach ($m in [regex]::Matches($ssXml, '(?s)<si\b.*?</si>')) {
        $buf = ""
        foreach ($t in [regex]::Matches($m.Value, '(?s)<t\b[^>]*>(.*?)</t>')) { $buf += $t.Groups[1].Value }
        $shared += (ConvertFrom-XlsxXmlText $buf)
      }
    }

    $sheet = Read-XlsxEntry $zip 'xl/worksheets/sheet1.xml'
    if (-not $sheet) { return $null }

    $rows = @()
    # 行同单元格一样有自闭合形态(空样式行 <row r="5" s="3" customFormat="1"/>):只写成对形态会让它
    # 被当成开始标签、一路吞到下一行的 </row>,空行消失、其后行号全部前移一位。
    foreach ($rowM in [regex]::Matches($sheet, '(?s)<row\b[^>]*?(?:/>|>.*?</row>)')) {
      $cells = @{}
      # 两种单元格形态都要匹配:自闭合 <c r="A22" s="8" t="inlineStr"/> 与成对 <c ...>值</c>。
      # 只写成对形态会让自闭合标签被当成开始标签,(.*?) 一路吞到**下一个**单元格的 </c>,
      # 结果是空单元格窃取右邻的值、右邻整列消失(实发:__tables__.xlsx 第 22/23 行 A 列自闭合,
      # 致 shop.TbShopHot / shop.TbShopDaily 两张表被静默漏检,核对数 32 而非 34)。
      foreach ($cM in [regex]::Matches($rowM.Value, '(?s)<c\b([^>]*?)(?:/>|>(.*?)</c>)')) {
        $attr = $cM.Groups[1].Value
        $body = $cM.Groups[2].Value
        # 显式取组,不依赖 $matches 自动变量(它会被后续 -match 覆盖,且 -notmatch 分支下是否填充属隐晦行为)。
        $refM = [regex]::Match($attr, 'r="([A-Z]+)\d+"')
        if (-not $refM.Success) { continue }
        $col = $refM.Groups[1].Value
        $txt = $null
        # inlineStr: <is><t>值</t></is>
        $inline = [regex]::Matches($body, '(?s)<t\b[^>]*>(.*?)</t>')
        if ($inline.Count -gt 0) {
          $txt = ""
          foreach ($t in $inline) { $txt += $t.Groups[1].Value }
          $txt = ConvertFrom-XlsxXmlText $txt
        }
        else {
          $vM = [regex]::Match($body, '(?s)<v>(.*?)</v>')
          if ($vM.Success) {
            $raw = $vM.Groups[1].Value
            # t="s" = 指向 sharedStrings 的下标;其余按字面数值。
            if ($attr -match 't="s"') {
              $idx = 0
              if ([int]::TryParse($raw, [ref]$idx) -and $idx -ge 0 -and $idx -lt $shared.Count) { $txt = $shared[$idx] }
            } else { $txt = ConvertFrom-XlsxXmlText $raw }   # t="str" 公式串的缓存值同为字符数据
          }
        }
        if ($null -ne $txt) { $cells[$col] = $txt.Trim() }
      }
      $rows += $cells
    }
    if ($rows.Count -eq 0) { return $null }
    return , $rows
  }
  catch {
    # 不静默吞:调用方只看得到 $null,报出来的是「解析不出数据行」,与真因(多数是文件被 Excel
    # 占用、OpenRead 抛 IOException)毫无关系,排查会一路查到 XML 解析上去(实发一次)。
    # 只加一行输出、不改返回契约 —— 调用方各自的降级/INFRA 分支一律不动。
    $why = $_.Exception.Message
    if ($_.Exception.InnerException) { $why = $_.Exception.InnerException.Message }
    Write-Host ('  [xlsx] 读不出 ' + (Split-Path $XlsxPath -Leaf) + ' —— ' + $why)
    return $null
  }
  finally { if ($zip) { $zip.Dispose() } }
}

# 按主干名在 Datas 下反查唯一数据表文件。表文件名可带 `-<中文备注>` 后缀
# (正本 = 配置表说明.md「基本约定」节),故按模式找、不按字面名找 —— 写死字面名时改个文件名
# 就把调用它的那道检查静默关掉。零命中与多命中都返回空串:前者是表确实没有,后者属命名歧义、
# 由 配置表前缀核对.ps1 的 [命名歧义] 拦下,本函数不替调用方区分,由调用方按自己的语义处置。
function Resolve-TableFile([string]$dir, [string]$stem) {
  if (-not (Test-Path -LiteralPath $dir)) { return "" }
  $re = '^' + [regex]::Escape($stem) + '(-[^-]+)?\.xlsx$'
  $hits = @(Get-ChildItem -LiteralPath $dir -Filter "*.xlsx" -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match $re })
  if ($hits.Count -eq 1) { return $hits[0].FullName }
  return ""
}

# 按 ##var 行定位列字母再逐行取值,不硬编码列序 —— 表加字段不会让调用方静默错位。
# 返回 [pscustomobject] 数组(属性名 = 请求的字段名);缺列、读不出、无数据行一律返回 $null,
# 由调用处决定判 INFRA 还是降级。跳过 `#` 起头的表头行(##var / ##type / ##group / ##)与全空行。
function Get-XlsxTableRows([string]$XlsxPath, [string[]]$Cols) {
  $raw = Get-XlsxRowCells $XlsxPath
  if (-not $raw) { return $null }
  $colOf = @{}
  foreach ($cells in $raw) {
    $a = if ($cells.ContainsKey('A')) { $cells['A'] } else { "" }
    if ($a -ne '##var') { continue }
    foreach ($k in $cells.Keys) { if ($k -ne 'A' -and $cells[$k]) { $colOf[$cells[$k]] = $k } }
    break
  }
  foreach ($c in $Cols) { if (-not $colOf.ContainsKey($c)) { return $null } }

  $rows = @()
  foreach ($cells in $raw) {
    $a = if ($cells.ContainsKey('A')) { $cells['A'] } else { "" }
    if ($a -like '#*') { continue }
    $o = [ordered]@{}
    $empty = $true
    foreach ($c in $Cols) {
      $k = $colOf[$c]
      $v = if ($cells.ContainsKey($k)) { [string]$cells[$k] } else { "" }
      if ($v) { $empty = $false }
      $o[$c] = $v
    }
    if ($empty) { continue }
    $rows += [pscustomobject]$o
  }
  if ($rows.Count -eq 0) { return $null }
  return , $rows
}

# Resolve-TableFile 的「找不到就判 INFRA 停下」封装,给必须拿到该表才能跑的检查道次用。
# 表缺失对这类道次是基础设施问题、不是被检出的违规,故统一走 exit 2 而非返回空让调用方各写一遍。
# 注意 exit 在点源函数里退的是**调用脚本**,这正是所需语义:缺表即刻停,不往下跑空解析。
function Resolve-TableFileOrExit([string]$dir, [string]$stem) {
  $p = Resolve-TableFile $dir $stem
  if (-not $p) { Write-Host ("VERDICT : INFRA - 数据表找不到: " + $stem + "*.xlsx 于 " + $dir); exit 2 }
  return $p
}
