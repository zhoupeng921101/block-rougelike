# .claude/scripts — 开发辅助脚本索引

devflow 流程之外的独立工具,会话与人工都可直接调用。各脚本的参数语义、前置条件与副作用写在
自己的头注里,本索引只登记「有什么、解决什么问题」,不复制用法。

| 脚本 | 解决什么 |
|------|---------|
| `崩溃栈符号化.ps1` | 把 Android 原生崩溃栈里 `pc <偏移> libil2cpp.so` 这类地址还原成函数名。用 `Library\Bee` 下未剥离的同一次构建产物做映射,符号化前强制比对 BuildId——不同源或取不到 BuildId 就停,不出会看不出错的错误结果。本作现出 Windows Mono 包,用不上;移植手机走 IL2CPP 后才有用。 |
| `subset_launcher_font.py` | 按 `Assets/Launcher` 下 `.cs` 的用字重新生成启动器子集字体 `LauncherFont.otf`。给启动器加了字体里没有的字就得跑,否则新字在启动器界面上不渲染;漏跑由客户端自检的 `启动器字体核对.ps1` 拦下。需要 python 与 fonttools。 |

block-client 的模拟器 logcat、热更 AOT 体检与 WebGL 静态服务器三组脚本没有搬:本作 PC 首发、HybridCLR 暂关、不出 WebGL。

新增脚本须同时在本表登记 —— `.claude/devflow/静态扫描.ps1` 的 R5 会拦下全扫描范围内无任何
引用点的 `.ps1`。
