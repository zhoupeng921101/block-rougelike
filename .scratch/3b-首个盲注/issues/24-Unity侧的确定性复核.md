# 24 · Unity 侧的确定性复核

Type: wayfinder:grilling
Status: resolved
Claimed by: unity-determinism
Blocked by: 17, 23

> **提前开工**（2026-10-28 用户裁定）：23 的代码已在 main（de292bac、b9a1d3c5），Windows 包能写出存档，只差真输入手测、票仍 claimed。用户决定不等手测先派本票。

## Question

dotnet 侧同种子一致，不代表 Mono 包里也一致。要不要在 Unity 里再对拍一次，在哪儿跑，怎么跑？

已经定了、不用再议的：

- **比什么**：dotnet 跑局测试用的那份规范化轨迹（[工程形态](10-规则核心的工程形态与跑局测试.md) 第 7 节），终局状态就是存档快照的规范文本（[局内存档](09-局内存档的形态与时机.md) 第 3 节）。
- **按论证两端应当一致**：随机流全整数（[08](08-种子与随机流.md)）；状态不靠字典遍历序，要遍历的一律是有序列表（[06](06-盘面与方块实例的数据模型.md)）；计分全整数、没有浮点（[07](07-结算管线与事件流.md) 第 6 节）；存档只有整数和 ASCII 字符串，规范形逐字节固定（09 第 3 节）。

要裁的：

- **做不做**：论证已经覆盖了已知的不一致来源，实测是不是值得。剩下没有论证覆盖的，是 Mono 与 CoreCLR 在 BCL 上的行为差（`string.CompareOrdinal`、`long` 的格式化、`List.Sort` 是否稳定这类）。
- **在哪儿跑**：EditMode 测试（Unity Test Framework，也是 NUnit 系，10 第 4 节留了这条路），还是 Windows 包里的调试入口。前者在编辑器的 Mono 里，后者才是真正发出去的那份。
- **策略代码怎么进 Unity**：`greedy` 现在在 `DotNet/Sim/` 里，Unity 编不到。可以把它挪进规则核心的一个不进包的程序集，可以用 Link 把同一个文件编进一个 Editor 程序集，也可以不搬。
- **一条更便宜的路，由 09 带出来**：存档本身就跨运行时。Windows 包写出的 `run.json`，拿到 dotnet 里读回、再写，应当逐字节相同；接着用 `Sim` 打完，还能和「在包里打完再读出终局档」对比。
  这样不用把策略搬进 Unity，只比快照。它够不够、漏掉了什么（比如包里只走了玩家实际打的那几步），要在这里裁。
- **跑在哪道检查里**：要不要进客户端自检；不进的话，在哪个时点手动跑一次（比如每次改了 `GameRules` 的计分或随机件）。

本图做完 Windows 包的验收就够，HybridCLR / IL2CPP 不在本图（地图 Out of scope），本票只管 Mono。

为什么被这两张票挡住：

- 17：轨迹格式、`Sim` 和策略由它落地，要比的东西得先有。
- 23：Windows 包里要能写出存档，「存档跨运行时互读」这条路才走得通。

## Answer

**据此裁定：**

- **做，本票已经做过一次，结果一致**，作为本图 Unity 侧的确定性凭据。不再建常驻的对拍。
- **在包外宿主里跑**：在 64 位进程里加载包里的 Mono 运行时（`MonoBleedingEdge/EmbedRuntime/mono-2.0-bdwgc.dll`，即 win64 非开发包那一份），照播放器的做法把程序集目录指到 `3B_Data/Managed`，规则核心和文件层用的都是包里那两份 dll。
  不选 EditMode，也不加包内调试入口。
- **策略代码不搬进 Unity**：`Sim` 的四个源文件原样，和对拍脚本一起用 csc 编成 exe，引用包里的 `GameRules.dll`。
- **存档跨运行时互读两个方向都做了**，算进本方案。只靠包里玩家实际打的那几步不够，不拿它当主手段；23 的手测也不用加额外核对。
- **不进客户端自检**，也不定「改了计分或随机件就手动跑一次」这种时点。只在两种情况下重做：一是打开 HybridCLR 或移植 IL2CPP；二是规则核心第一次引入浮点、可能出现平手的比较器排序，或者往事件、快照里放非整数成员。

没有一项改变目的地或产品形状，按授权自裁。依据写在各节，要推翻哪条只改那一节。
（wayfinder 要求的 domain-modeling 技能本机没有，只按 `.agents/skills/grilling` 裁，同 10 号票。）

### 1 实测：包里的 Mono 与 CoreCLR 逐字节一致

**两端各用什么**

| | Mono 端（包外宿主） | CoreCLR 端 |
|---|---|---|
| 运行时 | 包里的 `mono-2.0-bdwgc.dll`，md5 `ef1e28b8…`，和 Unity 安装里 `Variations/win64_player_nondevelopment_mono` 那份相同；Mono 6.13.0，64 位 | .NET 8.0.29 |
| 类库 | 包里的 `3B_Data/Managed/mscorlib.dll`，md5 `e8ea47ed…`，和编辑器 `MonoBleedingEdge/lib/mono/unityjit-win32/mscorlib.dll` 相同（包没有裁剪类库） | .NET 8 自带 |
| 规则核心 | 包里的 `GameRules.dll`（10-27 18:58 出包，晚于 `GameRules` 最后一次提交 36f96a77 的 17:54） | 同一份源码在 scratchpad 里编成 netstandard2.1 镜像 |
| 文件层 | 包里 `GameLogic.dll` 的 `RunSaveFile`，用反射调：GameLogic 引用了 UnityEngine，`RunSaveFile` 本身不碰它，在播放器外面也能加载 | 把 `RunSaveFile.cs` 直接编进来，和 `DotNet/Tests` 的做法一样 |
| 跑局 | `Sim` 的 `SimPolicies` / `LookaheadPolicies` / `TraceWriter` / `SimGame` 原样，加一个对拍入口 | 同左 |

- 运行时、类库、两份 dll 是不是包里那份，由对拍入口自己打出来：已加载模块的路径和 md5、各程序集的 `Location` 和 MVID。
- **CoreCLR 端先对一次仓里的 `Sim.dll`**：8 个种子、两种策略，轨迹和 `dotnet Sim.dll --seeds … --policy greedy,random` 逐字节相同（230,728 字节）。
- **编辑器自带的 `mono.exe` 是 32 位的**（`MonoBleedingEdge/bin` 下全是 x86），加载不了包里的 64 位运行时。所以宿主改用 64 位 Python，经 ctypes 加载那个 dll，先调 `mono_set_dirs` 和 `mono_set_assemblies_path` 指到 `Managed`，再调 `mono_main`。

**结果**（全部 0 处不同）

| 哪一路 | 规模 | 结果 | 耗时（Mono / CoreCLR） |
|---|---|---|---|
| A 基准：17 号票那 8 个种子 × greedy、random | 16 局 | 轨迹全文逐字节相同，230,728 字节 | 0.27 / 0.15 秒 |
| A 加宽：`FromEntropy(1)`…`(1000)` × greedy、random | 2000 局 | 相同，26,226,840 字节 | 4.2 / 2.1 秒 |
| A 前瞻策略：onestep × 100 个种子、plan × 20 个种子，每一步都要大量 `Clone` | 120 局 | 相同 | 1.3 / 1.7 秒；1.3 / 1.6 秒 |
| B：Mono 下用 17 号票那份夸大过的 tr-TR | 16 局 + 2000 局 | 和 CoreCLR 的 A 相同 | 0.3 秒；4.6 秒 |
| D：Mono 内部每步「写 → 读 → 再写」，而且每一步之后都存读一次接着打完，和不中断的那一局比全文 | 16 局续打 389 次；400 局续打 9085 次 | 0 处不同 | 1.1 秒；15.5 秒 |
| 档从 Mono 到 CoreCLR：Mono 端每步经包里的 `RunSaveFile.Write` 写档（第二份起走 `File.Replace`），再用 `Load` 读回核对；CoreCLR 端读每一份 | 16 局 405 份；400 局 9485 份 | 和 CoreCLR 同一步的快照逐字节相同；读回再写也逐字节相同；读回后接着打完，和 Mono 不中断那局的全文相同；终局档 `Load` 当无档并删掉 | 0.7 秒；5.4 秒 |
| 档从 CoreCLR 到 Mono：反过来做一遍 | 16 局 405 份 | 同上，0 处不同 | 1.4 秒 |
| 样档 `Tests/GameRules/Samples/run-v1.json`：盘上有块、托盘带朝向、有弃置堆和死格 | 1 份 | Mono 下读回再写与原文相同 | — |
| 附：编辑器的 x86 `mono.exe` 加 `unityjit-win32` 类库 | 16 局 | 相同 | 0.2 秒 |

17 号票留下的「B 路在 Mono 下要不要也用夸大过的区域设置」：用了，结果一样。

### 2 为什么一次就够：剩下的差异来源

- 票面点名的风险是 BCL 行为差：每个运行时各自确定，但两个运行时之间不同。A、B、C、D 四路都在 CoreCLR 上跑，拦不住这一类。
  规则核心和轨迹现在只碰到这么几处 BCL：
  - `List<int>.Sort()`，排的是互不相同的 id 和列号，稳不稳定都无所谓；
  - `SortedDictionary<string, …>(StringComparer.Ordinal)`（`RngStreams`）；
  - `int` / `long` 的 `ToString(InvariantCulture)`、`ToUpperInvariant`、`StringBuilder`、`FormattableString.Invariant`；
  - 枚举名；
  - `Dictionary<int, …>`，只用来查表和建静态形状表，建完按 id 排序（`BlockShapeMap.cs:57-71`）；
  - 轨迹的反射打印按成员名的 ordinal 序排。
  上面每一处都在第 1 节的跑局里被走到了，而类库正是包里那份。
- **包外宿主覆盖不到的**有两样：
  - 播放器宿主本身，也就是 `UnityPlayer.dll` 初始化 Mono 时的选项、线程和 GC 设置。它们改不了整数运算的语义。
  - 真输入那条路。它的对错归 28、29 每一步「画面对规则核心」的逐项比对，不归确定性。
- 编辑器 Play 模式用的是编辑器自己的 64 位运行时（md5 `af4e0c1f…`，又是另一种构建）和 `Library/ScriptAssemblies` 里编辑器编出来的 dll。这个组合没跑过，但它不是发出去的那份；同一套类库在 x86 Mono 上也一致。

### 3 在哪儿跑：为什么不选 EditMode、不选包内调试入口

| 做法 | 测到的是什么 | 代价 | 结论 |
|---|---|---|---|
| EditMode 测试 | 编辑器的 Mono 构建，加上编辑器编出来的 `GameRules.dll`。都不是发出去的那份 | 策略要编进一个 Editor 程序集（新 asmdef，走人工入库通道）；主工程编辑器关着 Auto Refresh，每次跑都要手拨 MCP、要用户授权 | 不选 |
| 包内调试入口 | 包里的运行时和 dll，再加播放器宿主 | 现在的包是**非开发包**（`UnityPlayer.dll` 与 `win64_player_nondevelopment_mono` 那份相同），F5–F7 在 `#if UNITY_EDITOR \|\| DEVELOPMENT_BUILD` 里（`UIBattlePanel.Debug.cs:1`），根本不在包里。加入口要么改 GameLogic、往正式包里留后门，要么出开发包，而开发包换的是另一份运行时（`win64_player_development_mono`，md5 `b559b246…`） | 不选 |
| **包外宿主** | **包里的运行时、类库、`GameRules.dll`、`GameLogic.dll`，md5 逐个对上** | 不要真输入，不改 `Demo/`；全套跑完约 1.5 分钟 | **选** |

包内入口比包外宿主多出来的只有播放器宿主（见第 2 节），换不回它的代价。

### 4 策略代码怎么进 Unity：不进

- 用 dotnet SDK 8.0.423 自带的 Roslyn（`csc.dll -nostdlib -langversion:9`），引用包里的 `mscorlib`、`netstandard`、`System`、`System.Core`、`GameRules.dll`，把 `Sim` 的四个源文件原样编进去，一行没改就编过了。17 号票说的「只依赖规则核心的公开 API」成立。
- 不挪进规则核心的程序集，也不用 Link 进 Editor 程序集，理由见第 3 节。

### 5 存档跨运行时那条路

- 两个方向都做了（第 1 节），这是「续玩」最直接的凭据：一端写的档，另一端读回，接着打完，和原端不中断的那一局全文相同。
- **只靠包里玩家实际打的那几步不够**：
  - 覆盖面就是手打到的那几个状态，还要真输入；
  - 09 号票只存快照、不存操作日志，`Sim` 重放不出玩家的走法，所以只能比「读回再写」，比不了「续打」。
  - 包外宿主写了 9890 份档，覆盖面大得多。
- **23 的手测不加额外核对**：`RunSaveService.Write` 把 `RunSnapshot.Write(_run)` 的结果原样交给 `RunSaveFile.Write`（`RunSaveService.cs:105-111`），而文件层已经在 Mono 下测过。真档只多验证了「什么时候写」，这一项 23 的手测清单本来就在验。

### 6 不进客户端自检

- **剩下的那类差异只在规则核心碰到新的 BCL 面时才会出现**，现有的面第 2 节已经测全。
- **常驻对拍要新的基础设施**：
  - 镜像库要在 Mono 上跑，就要用 Unity 安装里的 Mono（x86 的 `mono.exe`，或者 64 位运行时加一个宿主），还要对着 Unity 的类库编一个 exe；
  - `dotnet单测` 今天只依赖 dotnet；
  - 用包里 dll 的那种做法，包一不重出就过时了，过时的 dll 照样判绿。
- **票面写了「本图做完 Windows 包的验收就够」**，常驻化不在目的地之内，记进地图的 Out of scope。
- **不定「改了计分或随机件就手动跑」的时点**：那两块全是整数，又有 A–D 守着；仓里也没有工具，这种时点定了也不会有人去跑。只在下面两种情况重做：
  1. **打开 HybridCLR 或移植 IL2CPP**。运行时换了，本次结论不能外推，要换成在包里或设备上对拍（地图 Out of scope 里已有）。
  2. **规则核心第一次引入浮点、可能出现平手的比较器排序，或者往事件、快照里放非整数成员**。这几类在各自的运行时里稳定，两个运行时之间却可能不同（平手时不稳定排序的次序、`double.ToString("R")`），A–D 拦不住。
     到那时再决定要不要常驻化。本票验过的最便宜的形态是：编辑器的 x86 `mono.exe` 加 `unityjit-win32` 类库（这份 `mscorlib` 和包里的 md5 相同），16 局 0.2 秒，不用 Python。
- 对拍脚本按派单放在 scratchpad，不进仓；源码另抄了一份到本组会话的笔记目录 `24-mono对拍脚本/`（`run.sh` 里的路径按 scratchpad 写的，挪用时要改）。

### 对其它票

- **[存档接线](23-存档接线-文件读写与续玩.md)**：手测照原清单做，本票不加项。另外，包是非开发包，没有 F5–F7，手测只能真打。
- **新票**：无。
