# tengine-conventions.md — TEngine 开发规约

> 单一信息源。需要这套规则的地方**引用本文件,不复制内容**。

## 取篇

知识源 = `.claude/references/tengine/`(AI 专用精炼文档,唯一权威来源)。

维护守分层披露:CLAUDE.md 只放路由表(常驻、便宜),深度内容一律进 `.claude/references/tengine/` 按需层,**不内联回 CLAUDE.md**;增删篇目时同步路由表(refs-check 卡的宿主同步项)。

references 对 API 的事实描述(签名/参数/行为)与代码不符时,以代码为准(Grep 实际方法签名验证),在呈报中标注冲突点(哪篇哪节 + 代码依据 `文件:行号`),处置见下方「references 与代码不符时」。此条只辖事实层冲突:规范性条款(核心禁止事项、命名规约、流程约束)不因既有代码违规而失效——发现存量违规按规约处理或上报,不以代码现状覆盖规范。

---

## 核心禁止事项

> 编码红线,唯一信息源。

1. **异步优先**:IO 操作用 `UniTask`,禁止同步加载/Coroutine
2. **模块访问**:通过 `GameModule.XXX` 访问,而非 `ModuleSystem.GetModule<T>()`
3. **资源必须释放**:`LoadAssetAsync` 对应 `UnloadAsset`,GameObject 用 `LoadGameObjectAsync`
4. **热更边界**:`Assets/Launcher/` 与 `Assets/TEngine/` 在 AOT 域、不热更,`Assets/GameScripts/HotFix/` 全部热更(层表见 `.claude/references/tengine/architecture.md`;HybridCLR 暂关期间边界照守,否则开热更那天要拆引用)
5. **事件解耦**:UI 内部用 `AddUIEvent`(随窗销毁自动清理);跨模块通知**按方向选路径**,判据见 `.claude/references/tengine/event-system.md`「选哪条通知路径」——模块间通知并非一律走 `GameEvent`,服务模块通知订阅它的 UI 走服务对象自身的 `event Action`
6. **UI 绑定字段不判空**:`m_` 前缀的 `[SerializeField]` 字段一律视为有值(窗的由 `_Gen.g.cs` 生成、Part 的手写在自己类里,两者同一口径),业务代码直接取用,禁止 `if (m_xxx != null)` 包裹或 `?.` 兜底
   > 字段以 `null!` 声明,绑定完整性由 UI 制作段按名绑定验收保证;判空会把绑定缺失掩盖成静默不刷新,而非在首次运行时报错。
7. **shader 取用**:业务代码禁止 `Shader.Find`;要用的 shader 由 prefab 上的 .mat 模板引用带进包,代码克隆模板建材质(见 `.claude/references/tengine/ui-patterns.md`§五)
   > 未被材质 / prefab 引用、也不在 Always Included Shaders 里的 shader 构建时被整个剥离,`Shader.Find` 在包里恒返回 null;编辑器认得全部 shader 资产故一切正常,只在出包后显形,且调用方多半兜底成「退化表现」而非抛错——画面少一层效果、无日志指向根因。本作没有静态检查拦这条(block-client 的 `shader取用核对` 与预载器都没带),靠自审。

---

## 注释准入

判据:**删掉这段,读代码的人会做错什么**。答不出就删。

去处:改动理由进 commit message,设计全景进 `新游戏/` 下的设计文档(玩法规则 `新游戏/设计/`、工程路线 `新游戏/工程计划.md`),注释里各留一行指路;跨文件契约用 `<see cref>` 指路。
> 理由见 .claude/rules-archive/rules-rationale.md#design-panorama-destination

只约束本次改动触及的注释:存量注释在改到该处时顺带收敛,不单独立项清理。

---

## 客户端命名空间

业务代码与编辑器工具不声明命名空间,类型落全局命名空间:隔离由 asmdef 的程序集边界承担,模块划分由目录承担,命名空间不再重复表达同一件事。框架层、规则核心与跨程序集按名反射处保留命名空间(见下表与旁注)。

| 路径 | 命名空间 |
|---|---|
| `Assets/GameScripts/HotFix/GameRules/**` | `GameRules`(规则核心,见下文「规则核心」) |
| `Assets/GameScripts/HotFix/**`(其余) | 无(全局) |
| `Assets/Editor/**` | 无(全局) |
| `Assets/Launcher/**` | `Launcher` |
| `Assets/TEngine/**` | `TEngine` |

不受本规约约束(按路径排除,各自保留原命名空间):HybridCLR 生成物 `Launcher/HybridCLRGenerate/`(开热更后才有)、vendored 第三方 `ThirdParty/`;接 Luban 后的配置生成物与 Luban 运行时库同样排除,命名空间沿用生成器的 `GameConfig`。`AssemblyInfo.cs` 按设计不声明命名空间,不参与扫描。

> 扫描脚本的排除项与 `Overrides` 里还留着 block-client 布局的几条路径(`GameProto/` 下的 Luban 产物、`Editor/ToolbarExtender/`、`Editor/GameConfigEditor/`、`HotFix/Network/` 的两条覆写),本作没有这些目录,不生效;改动对应目录时与上表一并核。

> 全局命名空间的类型优先级高于 `using` 引入的类型:新增类型若与 `UnityEngine` / `System` 的常用类型同名(`Debug`、`Random`、`Object`、`Settings`…),同文件内的既有引用会静默改指向而不报错。起名避开这批。
> 按名反射的字符串须与命名空间同步:热更入口 `ProcedureLoadAssembly` 取 `GetType("GameApp")`、`Singleton` 用堆栈串匹配自身类型名,改类名或增删命名空间都要联动。
> `TEngine` 下有两类刻意的全局命名空间例外:扩展方法类(`SetSpriteExtensions`)落全局使调用方免 `using`;`TEngine/Editor/` 下个别工具类(`BuildDLLCommand`、`CommandLineReader`、两个 Inspector)沿用无命名空间。二者不视为对上表的违反。

规约由 `.claude/devflow/命名空间扫描.ps1` 静态强制(客户端自检的第一道,违规 = 检查未过)。脚本的 `$rules` 覆盖 `GameScripts`、`Launcher`、`Editor` 三个根;`Assets/TEngine` 未纳入强制——它有上述刻意例外,纳入前须先在脚本里列净排除项。改工程布局时上表与脚本同步。

## 程序集归属

`Assets` 下每个非 Editor 的 .cs 必须落在某个 asmdef 子树内。不落在任何 asmdef 下的代码编进 Unity 的 predefined 程序集(`Assembly-CSharp` / `Assembly-CSharp-firstpass`),这类程序集恒在 AOT 侧且无显式引用清单——业务代码误落其中会绕开热更边界,编译期无症状、出包才暴露。

新增代码放进已有 asmdef 子树;新建程序集的边界见 [architecture.md](../references/tengine/architecture.md)「程序集新增边界」(按层划分,不按业务模块)。新增 vendored 第三方若自带 runtime 代码而无 asmdef,须补 asmdef 或列入白名单,不得放任落入 predefined。

排除两类:路径含 `Editor` 目录的(编进 `Assembly-CSharp-Editor`,不打包、不涉热更边界);白名单 `Plugins/`(Unity firstpass 特殊目录,存 vendored 包自带件)。白名单正本 = `命名空间扫描.ps1` 内 `$coverageExcludes`(程序集归属检查与命名空间扫描同一道)。

> `Editor` 目录的自动归属规则只在无 asmdef 时生效:给一个含 `Editor/` 子目录的树补 runtime asmdef,会把 Editor 代码一并吃进去,并因引用 `UnityEditor` 在打包时失败——补 asmdef 须 runtime 与 Editor 各一个。

> 流程类型名以字符串序列化在 `ProcedureSetting.asset`:改流程类的命名空间或类名须联动该 asset,否则运行期按名反射取不到类型。这也是 `Launcher` 保留命名空间的原因——它的类型名要作为字符串写进资产,带一层稳定前缀比裸类名更不易与业务层撞名。
> 程序集名与目录名的对应关系见 [architecture.md](../references/tengine/architecture.md)「命名规则」。

---

## 规则核心

**适用**:`Assets/GameScripts/HotFix/GameRules/`(程序集 `GameRules`)。它两端编:Unity 按 asmdef 编进包,dotnet 侧经 `Demo/DotNet/GameRules/` 镜像库通配链接同一份源码跑单测与跑局。两端编的必须是同一份代码,同一种子每次跑出的结果也必须一样;违反时单测与出包行为不一致,或同种子复现不了同一局。

| 约束 | 谁拦 |
|---|---|
| 不引 UnityEngine,不写 `#if UNITY_*`(镜像库没有 Unity 宏,分支在两端走不同的路) | asmdef `noEngineReferences` + 镜像库;`#if` 由源码禁用清单拦 |
| 不用 `record`、`init`,不用 C# 10 以上语法、.NET 6 以上 API | 镜像库(netstandard2.1 + C# 9) |
| 不碰非确定来源:`System.Random`、`DateTime.Now` / `UtcNow`、`Guid.NewGuid`、`Environment.TickCount`、`Stopwatch`;随机只经 `RngStreams` 取整数,不调 `NextDouble` | 源码禁用清单(`Demo/DotNet/Tests/GameRules/SourceBanTests.cs`) |
| 不拿字符串哈希、默认对象哈希派生任何东西;可观察的结果(事件顺序、存档文本、发块)不依赖 `Dictionary` / `HashSet` 的遍历序,要遍历的用有序列表 | 静态扫不出:跑局测试的子进程比对兜底(CoreCLR 每个进程的字符串哈希都不同),建成前靠自审 |
| 格式化与大小写转换一律 InvariantCulture | 跑局测试换区域设置的那一路,建成前靠自审 |

- 单测常驻入库,写进 `Demo/DotNet/Tests/`(按模块分目录),由客户端自检的 `dotnet单测` 那一道跑;只走公开 API,不开 `InternalsVisibleTo`。
- 从 block-client 拷来的文件只在首尾各加一行 `namespace GameRules {` / `}`,正文不重新缩进,对照上游时 diff 只多两行。
- 要引第三方库时,asmdef 与镜像库的引用在同一笔改动里一起加,版本对齐 Unity 包里那份;只加一侧,两端引用集就不一致。

---

## references 与代码不符时

命中任一情形即适用:发现某篇 reference 对 API 的事实描述与代码不符(经 Grep/Read 验证);生成的代码编译或运行报错且根因是文档描述有误;用户指出某处描述有误。

处置分两轮,当轮只报不改:

1. **当轮** — 按代码实际写对本次任务,并在本轮呈报中点名:哪篇哪节、错在哪、代码依据 `文件:行号`。**不改 references**——边写代码边改自己的规范依据会形成自证循环。
2. **另起一轮** — 由 `/refs-check <模块>` 承载:全量核该篇断言、以代码为准改文档、同步交叉引用与 evals。程序正本 = `.claude/skills/refs-check/SKILL.md`。

呈报点名是第二轮的唯一入口,不落队列文件:漏报即漏修,只在下次核验该篇时暴露。
