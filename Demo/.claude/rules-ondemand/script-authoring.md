# script-authoring.md — `.claude` 脚本编写规约

> 按需规则:**新增或修改 `.claude` 下的自动化脚本**(`.ps1` / `.psd1` / `.py`)时读,承载只在写脚本这个时机命中的规约。执行层惯例(命令怎么调、参数怎么传、输出怎么读)在常驻的 `.claude/rules/shell-conventions.md`,对脚本作者一并适用。

**适用**:所有 agent(含子 agent)编写或修改 `.claude` 下的自动化脚本。

## 语言与共享层

- **`.claude/devflow` 下全部脚本均为 `.ps1`,不新增其他语言**(R10)。
- **共享层单源**(配置、git 薄封装、遥测、工作树哈希)在 `hooks/hook函数库.ps1`,不各自造副本;测试侧共享层 = `tests/测试夹具库.ps1`(它 dot-source 前者,反向不成立)。
- **脚本拉起子脚本用 `Get-FlowEngine`(同库),禁写死引擎路径**(R6)——写死的路径一旦在别的机器上不存在,子进程调用整片静默失效;settings.json 的 hook 入口固定 `powershell.exe`。
> 理由见 .claude/rules-archive/rules-rationale.md#shell-single-engine

## 编码与语法自检

**含非 ASCII 的 `.ps1` / `.psd1` 一律 UTF-8 BOM,无例外**——5.1 读无 BOM 的 UTF-8 会按 ANSI 解码、把中文字面量打乱并解析失败,BOM 是脚本可执行的前提而非可选项。任何 `.ps1` / `.psd1` / `.py` 改动收尾必跑 `.claude/devflow/语法自检.ps1`(无参 = 全量检查 `.claude` 下三类;`.py` 走 `python -B -m py_compile`;也可传单文件)。经 Write / Edit 写的 `.ps1` / `.psd1` 由 `hooks/写入补BOM.ps1` 当场补 BOM,但语法错不在其视野,改动收尾照跑。

**输出编码钉在脚本侧、不在个别脚本里单独钉**(R7):正本 = `hooks/hook函数库.ps1` 点源处,机制与调用侧例外见 shell-conventions「内联命令」首条,新脚本不另起一份。
> 理由见 .claude/rules-archive/rules-rationale.md#shell-psd1-in-syntax-check
> 理由见 .claude/rules-archive/rules-rationale.md#shell-bom-fail-open

## 脚本接口设计(有写动作的脚本)

调用正确性不依赖调用方读文档。文档中形如「记得加 X,否则会 Y」的句子标记的是脚本缺陷,须在脚本侧消除,不在文档侧加粗。

- **不可逆动作不做缺省**:推送、合并、删除、部署等对外或不可回退的动作,须显式开关才执行(先例:`单仓提交.ps1` 全通道缺省不推,`-Push` 才推)。缺省行为按通道/环境推导属同族缺陷。唯一例外是 `集成交付.ps1` 服务端通道的本机开发服部署点(缺省执行、`-NoDeploy` 关),本作服务端通道关闭,不走。
- **歧义参数缺则报错**:必填用 `Mandatory`、枚举用 `ValidateSet`,不替调用方猜缺省值。**有写动作的脚本一律 `[CmdletBinding(PositionalBinding=$false)]`**(R8)——不关则裸 token 静默绑到首个参数(交付脚本上就是推错仓、交付错槽),关掉后误用就地报错。只读脚本按需:有意接收多值的(如 `语法自检.ps1 -Path`)保留位置绑定。
- **清单参数须提供文件形态**(R11):新入口脚本接收列表/数组时提供 `-XxxFile` 类参数(每行一项,UTF-8),不只留数组形态——数组穿 argv 会展平错绑,判据见 shell-conventions「文本走文件」。
- **有实写副作用的入口提供 `-CheckOnly`**(R9:新增写入口须在扫描器的 Required / Exempt 两表之一登记,否则报未登记):跑完全部校验、零写动作,命名统一(不混用 `-DryRun` / `-WhatIf`)。适用面 = 会话直接调用的入口与认可交付脚本;入口内部调用的构件不作要求;兼会话直调的构件按入口论,其中写动作只落可重跑覆盖或可丢产物、无不可逆动作可预演的(如 `看板`)不加,理由登记在扫描器 Exempt 表。两类**不加**:①只读脚本(自检 / 扫描 / 核对类)——加了会稀释「带 `-CheckOnly` = 有副作用」这一信号;②已有专职只读预检脚本覆盖其探查面的入口,指向那个脚本、不造第二份(`槽位领取` → `占用面板.ps1`,`槽位交付` 的合并面 → `合并预检.ps1`)。
> 理由见 .claude/rules-archive/rules-rationale.md#shell-safe-by-default-cli

## 验收检查

- 新增 / 修改 `.claude` 下脚本:`语法自检.ps1` 必做;涉 hook 的用 `hook演练.ps1` 按既有演练样本回归;涉 devflow 脚本(共享库 / 检查 / 入口 / 认可交付构件 / 机械脚本任一)的另跑 `.claude/devflow/run_tests.ps1` 全量矩阵(夹具与隔离 LOCALAPPDATA 落 %TEMP%,不触真仓 / 真 claude-wf-3b;矩阵成员正本 = 该脚本内 `$Suites`,单套件用 `-Suite <中文短名>`)。
- **全量矩阵开跑前先用选择题问用户跑不跑**(devflow-check 语境下该询问已并进其收尾档位选择题,不再单独二问;其余脚本改动场景照本条单独问):一句话说明本次改了哪些脚本、涉面多大,供其按风险裁量,用户选跑才跑。它耗时分钟级且会打断当前节奏,该由用户按当下优先级决定,不由 agent 代决。**不靠工具权限提示代替询问**——那个弹窗问的是「准不准执行这条命令」,不是「这轮该不该做这件事」,用户只能被动拦、拦下来还得自己说明意图。单套件(`-Suite`)秒级,不在本条限定内,径直跑。
- 新增自检道次:在该道脚本头注写一行 `# 准入:` 登记,缺登记或不合判据时自检判 INFRA(判据正本 = `hooks/hook函数库.ps1` `Get-GateAdmissionGap`);在役各道的命中统计与零命中复核候选见 `检查命中面板.ps1`。
- **标 R# 的条款已由 `.claude/devflow/静态扫描.ps1` 机判**(R6 引擎路径 / R7 编码钉 / R8 位置绑定 / R9 CheckOnly 登记 / R10 非 .ps1 脚本 / R11 清单参数文件形态);BOM 由 `语法自检.ps1` 机判。文档侧只留判据与理由,违规由扫描器拦。
