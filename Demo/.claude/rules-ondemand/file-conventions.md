# file-conventions.md — 持久文件写作规约

**适用**:写持久文档(规则、设计稿、状态文件、说明、记忆)时读。不适用会话回复、commit message、scratchpad 临时件、日志与账本。代码注释另遵 `.claude/rules-ondemand/tengine-conventions.md`「注释准入」节。理由见 .claude/rules-archive/rules-rationale.md#comment-rule-split-from-file-conventions

1. **正文只写现值**——当前定案与支撑它的事实。改动史、被否方案、查证经过交 git,不进正文;被否方案留下的约束可作 `>` 旁注。句子脱离当下对话成立:禁「你说的」「刚才」「从 X 改成 Y」。
2. **正本在别处的不抄**——正本在脚本/代码 → 删;在另一份文档 → 留指针;正本就是本句(定案 / 不变量 / 行为约束)→ 留。设计稿不写代码符号、文件路径、file:line。指令类文件(CLAUDE.md / rules / skill 卡)只写指令、做错的后果、指针三类,机制解释删;审计期理由外移 rationale 文件,原位留 `理由见 <文件>#<slug>`(`.claude/devflow/理由对齐核对.ps1` 核双向对齐)。参考类文件(API 手册 / 接入契约,如 `.claude/references/tengine/`)不受本句约束。脚本索引(`.claude/devflow/README.md`)与义务台账不在此列:每行只写是什么、用法、出口码(台账写义务、绑定对象、保证等级、未覆盖面),判据与步骤指向脚本头注,行长由 `静态扫描.ps1` R17 机判。
3. **过时即重写或删除**——仍有活引用 → 覆盖式重写到现状;已下线 → 删篇并清入站链接。不叠勘误注。改一处即同步被它过时的他篇。例外 `docs/adr/`:不重写不删,头部标状态并链到取代篇。
