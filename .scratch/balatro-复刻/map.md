# Balatro 1.0.1o web 复刻

Label: wayfinder:map

## Destination

一个跑在 localhost 的 Balatro 1.0.1o web 复刻件，基于 Phaser 3 + Vite + TS
（模版 https://github.com/phaserjs/template-vite-ts），**四条轴全部对齐**：
机制与数值一致、同 seed 同局（可对拍）、像素级外观、音效与音乐。

地图走完 = 这个复刻件可玩，且四条轴各有验收手段。

## Notes

- **领域**：游戏复刻。源引擎 LÖVE 2D / Lua 5.1，目标 Phaser 3 + Vite + TS。
- **执行带进地图**（覆盖 wayfinder 的 plan-don't-do 默认）：destination 是一个可玩的交付物，
  不是一份规格。决策票仍先行，但 task 票会真的动手写代码。
- **每个 session 必读**：grilling、domain-modeling。
- **版本口径固定为 Balatro 1.0.1o**，不把结论推广到其他版本。
- **只跑 localhost，不部署、不分发**。这是原素材可用的前提，反转它整张图要重画。
- **证据源**（均在本仓库内）：
  - 源码 `参考/产物/Balatro_1.0.1o/源码/` —— 34 个 Lua 文件，35,876 行，全量游戏逻辑
  - 配置 `参考/产物/Balatro_1.0.1o/配置/配置CSV/`、`配置JSON/`
  - 素材 `参考/产物/Balatro_1.0.1o/图片资源/`、`资源/`、`本地化/`
  - 分析 `参考/结论/Balatro_1.0.1o/` 5 篇，尤其 `出牌结算管线.md`
- **仓库落位**：新开顶层 `复刻/`，与 `参考/`（研究）、`新游戏/`（原创）平级。

## Decisions so far

<!-- 一行一张已关闭的票：够判断相关性，细节点链接进票里看 -->

- **1:1 的轴与工程落位**（charting 时裁定）—— 四条轴全要；工程落在仓库新顶层 `复刻/`；只跑 localhost
- [Lua 到 TS 的翻译策略](issues/03-Lua到TS的翻译策略.md) —— **直译，含事件队列**。
  实测发现队列回调里调用 `pseudoseed`，RNG 消费顺序由队列执行顺序决定，
  队列因此属于逻辑层而非表现层；只有渲染与输入按 TS 惯例重写。
- [LuaJIT RNG 复刻口径](issues/02-LuaJIT-RNG-复刻口径.md) —— **可行，16/16 外部真值对拍通过**。
  发生器是 LuaJIT TW223（LÖVE 未覆盖 `math.random`），四个状态常量已在本仓库的
  `liblove.so` 里核实命中。`%.13f` 要用 BigInt 精确展开，不能用 `toFixed` 或
  `round(x*1e13)/1e13`。留下 16 条测试向量作为 CI 资产。
- [shader 能否移植到 Phaser](issues/05-shader能否移植到Phaser.md) —— **Balatro 一侧可行**
  （19 个 `.fs`，90% 机械替换，3D 倾斜是 vertex 阶段改 `w` 分量）；
  **Phaser 一侧的结论作废**：证据基于 Phaser 3，而模版已 pin v4.0.0。另查明
  **本产物是移动版构建**（`PROD_mobile`），CRT 30 而非桌面的 70、卡牌不倾斜。
- [Phaser 版本选型与渲染 API 复核](issues/11-Phaser版本选型与渲染API复核.md) —— **pin `phaser@4.2.1`**。
  v4 确已移除 Pipeline 体系；per-instance uniform 经源码验证**成立**，
  但走 `Shader` GameObject 而非 Filter——**卡牌要建模成 `Shader` 而不是 `Sprite`**。
  仍是 WebGL 1。CRT 走 `CaptureFrame` + 全屏 Shader。
- [工程骨架落地](issues/01-工程骨架落地.md) —— 工程在 `复刻/Balatro/`，dev/test/build 全通。
  **npm（非 pnpm）/ 端口 8080 / Phaser 4.2.1**。RNG 核心已落地，
  **24 个测试全绿，其中 16 条是外部真值**。
- [第一个可玩里程碑的切片边界](issues/07-第一个可玩里程碑的切片边界.md) ——
  **纵切到「用红牌组打过 Ante 1 的小盲注」**（300 分 / 8 张手牌 / 4 出牌 / 3 弃牌）。
  无小丑、无商店、无强化。连带把 [原版对拍基准](issues/04-原版对拍基准能否导出.md)
  拉回关键路径：本切片的 RNG 消费点是洗牌，现有 16 条向量覆盖不到。
- [原版对拍基准能否导出](issues/04-原版对拍基准能否导出.md) —— **社区工具拿不到洗牌真值**
  （它们全是 seed-search 模型，不建模洗牌）。裁定走**结构性验证**：
  独立重推一遍 Fisher–Yates 逐位比对，不动实机。`pseudoshuffle` 已落地，全仓 32 个测试绿。
- [Phaser 4 渲染路线 spike](issues/13-Phaser4渲染路线spike.md) —— **路线成立**，真机实测。
  per-instance uniform 确认独立（40 个各异的 uniform，有截图）；`dissolve.fs` 移植成功。
  **性能不是风险**：40 张牌 p50 仅 0.2ms，且全屏背景几乎免费——上一张票
  「风险在 fill-rate」的判断被推翻，开销其实线性于对象数。工作量维持 9–16 人日但不确定性大降。
- [素材与配置的接入方式](issues/06-素材与配置的接入方式.md) ——
  **素材拷进 `public/assets/` 并入库**（只拷用得上的，第一个切片 288K；字体只带拉丁）；
  **配置从 Lua 直译，不碰 `配置CSV/`**（那是派生的研究产物，且只覆盖 13% 的小丑行为）。
  图集元数据纯可推导，不手写 atlas JSON。
- [仓库三层结构的约定更新](issues/08-仓库三层结构的约定更新.md) —— `README.md` / `AGENTS.md` /
  `参考/README.md` 已加 `复刻/` 层，新写 `复刻/README.md`。
  两条新约定入册：**复刻不得对外部署**、**研究查 CSV 复刻读源码**。
- [坐标驱动排序的解耦](issues/10-坐标驱动排序的解耦.md) —— **原样直译，TS 侧也维护 `T.x`**。
  本票原先的担忧不成立：`T` 是目标变换、`VT` 才是动画插值的，逻辑从不读 `VT`；
  没被拖的牌 `T.x` 每帧由下标重算，排序只是拖拽提交进数组的方式。
  **硬约束：`T` 全程用 tile 单位，像素换算只允许出现在渲染/输入边界。**
- [外观基准是移动版还是桌面版](issues/12-外观基准是移动版还是桌面版.md) ——
  **机制与数值对齐本产物（移动版），纯观感的四个常数取桌面值**（CRT 70、文字 ×1 等），
  集中配置、逐条留痕。卡牌悬停倾斜在本产物里是死代码（`touch_collide_tilt` 在 `Card` 上
  从不设置，**与 `F_MOBILE` 无关**），但照桌面观感实现——它是 Balatro 最具辨识度的动作。
- [事件队列调度语义的复刻口径](issues/09-事件队列调度语义的复刻口径.md) ——
  **对 RNG 而言 `delay` 不影响顺序**，复刻件可把动画 delay 压成 0，
  只需保持 `base` 队列的 FIFO 与 blocking 语义。全仓 270 个 `add_event` 块里
  11 个消费 RNG，6 个有 delay/blockable 风险，但**第一个切片零命中**。
- [CRT 全屏链路验证](issues/14-CRT全屏链路验证.md) —— **链路跑通**，
  `setForceComposite` + `captureFrame` + 全屏 `Shader` 采样具名纹理即可。
  CRT.fs 移植成功，**开销约 +0.5ms**。剥掉 `bloom_fac` 与 `glitch_intensity` 两段死码
  （原作硬编码为 0），有效代码从 153 行降到约 60 行。

- [第二个里程碑的切片边界](issues/15-第二个里程碑的切片边界.md) ——
  **纵切到「带小丑打过 Ante 1」**：小盲注 → 商店 → 大盲注 → 商店 → Boss 盲注。
  小丑接**全部 61 张 rarity 1** + 形状需要的少量 rarity 2/3；Ante 1 的 Boss 池是 8 个，
  八个 debuff 全要实现（它们是管线第 2/5/8 步的唯一内容）。
  同时裁定 `calculate_joker` 的翻译形状：**context 分支照抄、分支内按名字查表**，
  但 main 分支前四条（含三条泛化判定）必须按原序写死在查表之前。

- [消耗品的切片边界](issues/16-消耗品的切片边界.md) ——
  **槽位 + 星球 + 塔罗 + 强化牌。幽灵牌与补充包推到 17 号票**
  （依据：`spectral_rate` 默认 0，商店永远不出幽灵牌，它只能从补充包与 The Soul 来，
  而 The Soul 也进不了商店）。同时裁定另外三件：
  商店的消耗品格**只多一次池子抽取**（`rarity`/`etperpoll`/`edi`/`front`/`soul_` 全不消费）；
  09 号票那条「delay 可以压成 0」**在本切片内仍然成立**（5 处只命中 The Wheel of Fortune，
  它三次掷点共用一个 key、严格 FIFO）；`level_up_hand` 是**重算 + 三个 clamp**，没有上限。
- [补充包与幽灵牌的切片边界](issues/17-补充包与幽灵牌的切片边界.md) ——
  **补充包五种 + 幽灵牌 18 张 + 版本 4 种 + 蜡封 4 种**。比 16 号票大，但切不小：
  五种包各自拽着一个系统，而版本与幽灵牌互相拽（`Aura` / `Hex` / `Ectoplasm` 全是版本，
  `Perkeo` 要 Negative，`The Wheel of Fortune` 要 `poll_edition`）。
  同时裁定：**delay 仍可压成 0**（但理由换了，见已知的坑）、
  **`soulable` 在包里传真值**（三种包掷点次数各不相同）、
  **商店末尾多两次 `shop_pack<ante>`**（第一个商店只多一次）。
- [标签与跳过盲注的切片边界](issues/18-标签与跳过盲注的切片边界.md) ——
  **24 个标签全部进池、跳过盲注整条流程照抄**。关键发现：`discover_card` 第一句是
  `if G.GAME.seeded then return end`，指定 seed 的对局里**什么都不会被发现**，
  所以 Rare 与四个版本标签（`requires` 已发现）**永远抽不到**，只占位。Voucher Tag 拿得到、
  效果不做（优惠券系统不在）。`orbital` 每个 Ante 在盲注选择界面对三格各掷一次，不管标签是什么。

> **第一个里程碑已交付**（红牌组打小盲注，可玩，带动画/shader/音效）。
>
> **第二个里程碑的逻辑层已交付**：小丑结算管线、经济层、`Run` 状态机、商店、
> Ante 1 的 8 个 Boss。295 个测试绿，其中 `core/ante1.test.ts` 会**真的打完**
> 小盲注 → 商店 → 大盲注 → 商店 → Boss → Ante 2（不 mock、不直接写 phase，四个 seed 都通）。
>
> **第二个里程碑的表现层也接上了**：小丑区、商店（买／卖／重掷）、回合收益明细，
> 场景从 `RoundScene` 改名 `RunScene`（它现在持有的是 `Run`）。304 个测试绿。
>
> **但表现层这一版没有人眼验收过**——本机的无头 Edge 截不到图，
> 而「像素级外观」与「音效」两条轴只能人工验。**得在浏览器里实际跑一遍**，
> 逐条对照 07 号票的验收表。
>
> **28 个 Boss 已全部实现**（原先只有 Ante 1 的 8 个，其余撞 `assertImplemented` 的墙）。
> 商店与小丑区会给未实现的小丑标 `⚠未实现`；消耗品区同理。
>
> **消耗品已交付**（16 号票）：消耗品槽位（2 格）、12 张星球、
> 22 张塔罗里的 21 张（差 `The Wheel of Fortune`，它要版本系统）、
> 8 种强化牌，商店真的卖消耗品。563 个测试绿。
>
> **小丑覆盖面 119 / 150**（原先 111）。剩下 31 张卡在：
> 强化牌 9（**前置已落地，只是还没做**）/ 增删牌 8 / 幽灵与补充包 5 /
> 负债 4 / 标签 3 / 关掉 Boss 2（分组见 `jokers/coverage.test.ts`）。
> 消耗品覆盖面 **33 / 34**。
>
> **但 Ante 3 的墙没破。** 实测八个 seed 的贪心深度仍是 Ante 2–4：
> 商店两格里只有 ~28.6% 是消耗品、其中一半是塔罗，整局买到 1–5 张星球，
> 而且抽到哪个牌型不由人挑。**原作里星球的主要来源是天体补充包**
> （一包 3 张、Jumbo 5 张）——这条实测把补充包从「放最后」抬成了关键路径。
>
> **补充包已交付**（17 号票）：五种包 + 18 张幽灵牌 + 4 种版本 + 4 种蜡封。
> 718 个测试绿。**小丑覆盖面 124 / 150，消耗品 52 / 52，补充包 5 / 5。**
>
> **墙又松了一格，还是没破。** 八个 seed 的贪心深度
> 2.875（16 号票前）→ 3.0（消耗品）→ **3.375**（补充包），最深到 Ante 5。
> 一个天体包一次给 3 张星球、Jumbo 5 张，供给确实上来了。
> 剩下的差距里有多少是内容、有多少是策略**仍然说不清**——
> 贪心不挑手牌，所以一半塔罗与全部「给选中的牌加蜡封」的幽灵牌都用不出来；
> 买小丑也不挑好坏。
>
> **下一刀最划算的是强化牌那 9 张小丑**（`coverage.test.ts` 里最大的一组，
> 前置全在）。但**在那之前值得先写一个会挑牌的策略**——
> 不然「还差多少内容」这个问题永远测不出来。
>
> **强化牌那 9 张已交付**（没开新票，前置全在）。746 个测试绿。
> **小丑覆盖面 133 / 150**，剩 17：增删牌 8 / 负债 4 / 标签 3 / 关掉 Boss 2。
>
> **上面那条「先写策略」的预判被实测坐实了。** 墙现在有了钉住的快照
> （`src/core/depth.test.ts` + 共享 bot `src/core/fixtures/greedy-bot.ts`，
> `ante1.test.ts` 也改用它）：八个 seed 平均 **2.625**，**这一刀前后逐 seed 完全相同**
> ——连买到的小丑与星球张数都一样，也就是 RNG 流一步都没分叉。
> 原因是结构性的：9 张要整副牌里有强化牌，强化牌来自塔罗（要选手牌）与标准包，
> 贪心两样都用不出来。**2.625 与上面的 3.375 不可比**——那是一次性脚本，
> seed 与阈值都没留下来。从这里起以快照为准。
>
> **下一刀：会挑牌的策略。** 不是可选项了——不做它，后面任何内容量出来都是零，
> 包括「增删牌」那 8 张。
>
> **会挑牌的策略已交付**（`src/core/fixtures/picky-bot.ts`）。三件贪心不会的事：
> 要选牌的塔罗 / 幽灵牌**攒着、进盲注后对手牌用**（往主花色同花上攒）；
> **拿真的结算管线在沙盒里给小丑估值**（克隆小丑与牌，不碰真 RNG、不调 `makeCard`），
> 小丑排在包前面买；包里挑最常打牌型的星球。
>
> **墙的读数改看 60 个 seed**（`npm run test:slow`，`depth.slow.test.ts`）——
> 8 个 seed 被噪声带着走，一处小改动就能让某些 seed 升三级、另一些降两级。
>
> | | 60 seed 均值 | 最深 |
> |---|---|---|
> | 贪心 | 2.333 | Ante 5 |
> | 挑牌 | **3.867** | 打穿 Ante 8（一局到 10） |
> | 挑牌、禁掉强化牌那 9 张 | 3.883 | 同上 |
>
> **结论：贪心量到的墙主要是策略墙**（差 1.5 个 Ante）。最大的一项是小丑估值——
> 贪心死的时候小丑区常常只有一两张废的、身上 $0。
>
> **强化牌那 9 张换成挑牌 bot 也还是零**，原因不在 bot：
> 3 张（Golden Ticket / Glass Joker / Driver's License）是 `start_locked`，**新档池子里根本没有**；
> 另外 6 张的价值在「以后」（要牌组先有强化、或是越打越强），而估值只看眼前。
>
> 顺带修了一个洞：**`Run.useConsumable` 以前不查 `canUse`**，
> 选 0 张用 Death 会崩、用 The Magician 会静默吞掉那张卡（计数照记、效果为空）。
> 贪心 bot 此前就是这么「用」掉塔罗的。现在用不了就抛，表现层本来就先查了 `canUse`。
>
> **挑牌 bot 的已知短板**（下一步调它时从这里挑）：估值不看成长；不存利息（死时多半 $0–3）；
> 每关基本只凑得出一手同花，剩下的手打对子；不重掷、不跳盲注。
> 另有一处 **Run 层与原作的偏差**：原作开奥秘 / 幽灵包会发一手牌、包里的塔罗当场对它用；
> 复刻件是把塔罗拿进消耗品区，格子满了就挑不了。
>
> **下一刀的判断**：现在内容与策略都还有空间。按覆盖面，最大的一组是「增删牌」8 张；
> 按墙，挑牌 bot 的经济（存利息）大概比任何一批内容都值钱。
>
> **存利息试过了，预判被推翻：不划算。** 60 个 seed 试了 15 种组合
> （存 5 / 10 / 15 / 25、前期 / 后期才存、放不放行天体包、配不配重掷），
> 没有一种比不存（3.867）好；全程存 $25 掉到 2.900，后期才存 + 重掷 3.633。
> 利息是真发了（全程存 $25 每回合多拿约 $2.5），但变不成战力：
> 少花 $25 要 5 回合满利息才回本，而 bot 平均只活十来个回合；
> 重掷只换货架两格，刷到的小丑多半过不了估值线。
> 存钱与重掷做成了 `Economy` 参数、默认关，对比钉在 `depth.slow.test.ts`。
>
> **真正卡住挑牌 bot 的是出牌与估值**：每关基本只凑得出一手同花，剩下的手打对子；
> 小丑估值只看眼前、不看成长。**下一刀从这两处挑**，改好之后重跑存利息那两条——
> 钱那时可能就有用了。
>
> **出牌改好了：60 seed 3.867 → 4.133**，在另一批没参与调参的 60 个 seed 上复核 3.967 → 4.350。
> 三件事：挑哪一手时**带着小丑进沙盒精算**（粗估筛前 12 个）；弃哪几张**模拟 24 次换牌**
> 挑期望最好的（只看牌堆构成、不看顺序，用 bot 自己的随机数）；**弃牌按手数分配额**
> `ceil(剩余弃牌 / 剩余手数)`。第三条是关键——光有模拟不分配额反而更差（3.600），
> 因为它会在第一手把弃牌全烧光，后面三手只能出对子。
> 「落后于进度就弃」「顺子以上直接出」两条试过，没区别，删了。
>
> 顺带修了 bot 的一个洞：小丑区满时它会卖「最弱」那张再买，但卖的若是 **Negative** 的
> （它自己那一格是它带来的），卖完还是满的，接着买就抛。
>
> 存利息按约定重跑了：全程存 $25 2.867、后期存 + 重掷 4.017，仍不如不存（4.133）。
> 强化牌那 9 张：禁掉之后 **60 局逐局深度完全相同**。
>
> **8 个 seed 的快照这次反着走了**（3.75 → 2.75，而 60 个是涨的）——`depth.test.ts` 只能当变更探测。
>
> **下一刀的判断**：策略这一侧剩下最大的是**估值不看成长**（它也是强化牌那 9 张、
> 以及存利息都用不上的共同原因）。内容这一侧仍是「增删牌」8 张。
>
> **估值看成长了：60 seed 4.133 → 4.333。** 沙盒里同一组小丑**连打 4 手参考牌**、
> 状态带进下一手，取平均；掷点换成 bot 自己的固定种子随机数（原先一律 0.5，
> 1/5 的幸运牌在沙盒里永远不中）。Green Joker 的估值 1 / 4 / 8 手是 0.14 / 0.34 / 0.62，
> Runner / Hiker / Supernova 同样随视野涨，定值的 Joker / Droll / Crazy 不变。
> 视野在 240 个 seed（四批）上选的：1 / 4 / 8 手 = 3.967 / **4.158** / 4.125，4 手每批都赢。
>
> **上一条预判只对了一半。** 成长型确实看得到了，但：
> - **强化牌那 9 张仍然零贡献**（禁掉之后 60 局逐局相同）。估值连打的是**固定的参考牌**，
>   新牌组里没有强化牌——Steel / Stone / Lucky Cat / Vampire 的成长条件在沙盒里根本碰不到。
>   Square（恰好 4 张）/ Wee（打出 2）/ Obelisk（换着牌型打）同理
> - **存利息仍不划算**（全程存 2.950、后期存 + 重掷 4.133，对不存 4.333）
>
> 要让那几张有价值，估值得看到「bot 自己以后会往牌组里加什么」——比如按它手上的塔罗
> 预先改一改参考牌。那是另一个量级的活，而且只影响少数几张。
>
> **下一刀的判断（更新）**：策略侧的大头都吃掉了（贪心 2.333 → 挑牌 4.333），
> 继续调 bot 边际在变小。**建议回到内容侧**：「增删牌」8 张，覆盖面最大的一组。
>
> **「增删牌」8 张已交付**：Ceremonial Dagger / DNA / Madness / Riff-raff / Invisible Joker /
> Caino / Yorick / Hologram。775 个测试绿，**小丑覆盖面 141 / 150**，剩 9：
> 负债 4 / 标签 3 / 关掉 Boss 2。为它们补了四样机制：`getting_sliced`（先标记、跑完一趟再删）、
> `joker_buffer`、`playing_card_added`（五个触发点）、卖出时复制小丑。
>
> **顺带修掉的三处，都是真 bug**：
> - **本回合出牌数在结算之前就 +1 了**（原作在结算之后，`state_events.lua:545`）。
>   **Sixth Sense 在真局里一次都没触发过**——它的单测用手写视图，所以一直是绿的
> - **`setting_blind` 跑在 Round 发完牌之后**。原作是 `set_blind → setting_blind → 洗牌 → 发牌`，
>   所以 Riff-raff 造的 Juggler 这一关就加手牌。`Round` 构造拆成两段，中间回调 `Run`
> - **Marble Joker 的石头牌这一关就在牌堆里**。上一刀写成「这一关摸不到」是读漏了
>   紧跟着的 `draw_card(G.play, G.deck)`——它把牌放回牌堆，排在洗牌之前
>
> 另外 `Round` 的小丑格数原先写死 5（没算 Negative），Cryptid 的复制原先漏抄永久筹码与 debuff。
>
> **墙：挑牌 bot 对这 8 张的贡献还是零**（240 seed 放开 / 禁掉逐局相同，4.146）。
> 这次原因很干净：它们的作用**全在「打一手」之外**——Madness / Dagger 在进盲注时长、
> Hologram 在加牌时长、Yorick 在弃牌时长、Riff-raff 造的是小丑不是分；
> 估值只在沙盒里连打参考牌，这些时机它看不见。Caino / Yorick 是传奇，只有 The Soul 出。
> 贪心反而涨了（2.333 → 2.417）：它什么都买，买到的 Riff-raff 现在真的会造小丑。
>
> **「钱」那 3 张已交付**：Credit Card / Rocket / Gift Card。788 个测试绿，
> **小丑覆盖面 144 / 150，rarity 1 全部做完**。剩 6：标签 4（Diet Cola 从「负债」挪过去了——
> 它卖掉时造的是 Double Tag）/ 关掉 Boss 2。Rocket 原先也分错了组，它跟负债无关。
>
> **顺带补上 `set_cost` 的版本加价**（Foil +2 / Holo +3 / Polychrome +5 / Negative +5）。
> 17 号票接版本时漏了：带版本的小丑一直按基础价卖，卖价也不跟着涨。现在造卡、`set_edition`
> （Wheel / Ectoplasm / Hex）、`copy_card`（Ankh / Invisible / Perkeo）、Egg / Gift Card 之后都重算。
> Egg 原先直接改 `sell_cost`，改成攒 `extra_value` 再重算——否则之后加版本会把它冲掉。
>
> **墙因此降了，这是纠偏**：240 seed 挑牌 4.146 → 3.992，60 seed 4.267 → 4.083。
> 原先复刻件比原作便宜，墙被高估了约 0.15 个 Ante。新加的 3 张贡献为零（禁掉 3.996）。
>
> **下一刀的判断**：内容剩 6 张，两组各拽一个新系统（标签与跳盲注、关掉 Boss）。
>
> **又做了 4 张：Trading Card / Certificate / Luchador / Chicot**。808 个测试绿，
> **小丑覆盖面 148 / 150**。Certificate 与 Trading Card 原先分在「标签」，其实用不到标签
> （一个在每关第一次发完牌时造牌，一个在第一次弃牌时毁牌给钱）。
> 剩下的 **Throwback / Diet Cola 都要标签与跳过盲注**。
>
> 为它们补的：`Blind:disable()`（各 Boss 的进场效果逐个还原，重跑 debuff，够分当场过关）、
> `first_hand_drawn`、弃牌时的 `remove`（毁掉的牌不进弃牌堆，玻璃牌算「碎掉」）、
> Chicot 的 `add_to_deck`（Boss 局中途进小丑区也关掉）。
>
> **顺带修掉的两处**：
> - **弃牌计数加早了**，与上一刀出牌计数同一类：原作在逐张问完小丑之后才扣次数、计数。
>   Burnt Joker 原先靠传 `discardsUsed - 1` 绕过去，现在去掉了这个补丁
> - **The Needle 写死「减 3」**，而原文是 `round_resets.hands - 1`（含 Troubadour 的 -1）。
>   Troubadour + The Needle 原先得到 0 次出牌，进场即输
>
> **墙：第一批让挑牌 bot 受益的内容**，虽然很小：240 seed 放开 4.000、禁掉 3.992，2 局更深、0 局更浅。
>
> **标签与跳过盲注已交付（18 号票前 3 步），小丑 150 / 150。** 830 个测试绿。
> 24 个标签的数据由生成器出；池子、`Tag<ante>` 抽取与重抽、开局与打完 Boss 各抽两个；
> 跳过盲注（skips、`add_tag`、小丑的 `skip_blind`、`immediate`、`new_blind_choice`）；
> 18 个可达标签的效果全部接上（立即生效 6、开包 5 + Boss、Double、Juggle、Investment、
> 商店里的 Uncommon / D6 / Coupon）。表现层加了盲注选择这一屏（原先离开商店直接开打）、
> 「跳过盲注」按钮与标签栏——**没有人眼验过**。
>
> 两个 bot 都不跳过，所以**墙一格没动**（快照全部不变——标签用独立的随机流）。
> **下一刀：18 号票第 4 步，挑牌 bot 学会跳过。** 这是标签系统唯一会动墙的地方。
> 墙那边，估值的短板已经很清楚——**它只认计分管线里的成长**。要让 bot 用上这类小丑，
> 沙盒得在连打之间模拟进盲注 / 弃牌 / 加牌，而 Madness 还会毁队友，模拟不当会高估。

## Not yet specified

- **局内手感的还原口径**。卡牌物理、缓动曲线、抽牌/计分的节奏与停顿——
  Balatro 的「爽」有很大一块在这里，但说不清要还原到什么粒度，
  得等 [shader 能否移植到 Phaser](issues/05-shader能否移植到Phaser.md) 有结论才看得清。
- **存档格式**。要不要与原版存档互通，还是自己一套。取决于翻译策略。
- **本地化接入**。`本地化/` 有全量文本，但多语言要不要进第一版没定。
- **性能预算**。Balatro 的 shader 在浏览器上的开销未知，可能反向约束外观轴。
- **验收的自动化程度**。RNG 层已有 16 条向量可进 CI（见 [工程骨架落地](issues/01-工程骨架落地.md)），
  但**整局**的对拍怎么自动化仍不清楚，等对拍基准那张票落地再说。
- **弱类型的边界**。直译会带进大量 `any`（`self.ability` 在 `calculate_joker` 里被引用 379 次）。
  哪些地方值得补类型、哪些认了，等第一段直译落地后才看得出来。
- **重复触发的实现形态**。蓝图 / 头脑风暴 / 双子座这类「代跑另一张小丑」的效果
  在直译下是递归调用 `calculate_joker`，深度与终止条件要单独核，但现在说不清要核什么。

## 已知的坑

<!-- 不是待决策，是后面每个 session 都该记着的事实 -->

- **产物是移动版构建**（`PROD_mobile`，`Singular-v12.11.0`，2026-01-26）。
  全仓 `F_MOBILE` 分支已枚举，与玩法有关的只有四条纯观感常数：
  CRT 30/70（`globals.lua:231`）、FPS 60/200（`main.lua:85`）、
  卡面文字 ×1.45/×1（`card.lua:767`）、描述文字 ×1.45/×1（`misc_functions.lua:1747`）。
  **复刻件取桌面值，集中配置、逐条留痕**，见
  [外观基准](issues/12-外观基准是移动版还是桌面版.md)。
- **卡牌悬停倾斜在本产物里是死代码**，且**与 `F_MOBILE` 无关**：
  `Card` 设了 `hover_tilt = 1`，但 shader 条件还要 `touch_collide_tilt`，
  而那个标志全仓只在盲注与标签上设置。复刻件仍要实现它（Balatro 最具辨识度的动作），
  这是全图唯一一处有意偏离产物的地方。
- **`参考/产物/Balatro_1.0.1o/` 的目录名没有记录「移动版」这件事**，
  而 `AGENTS.md` 写着「版本以目录名为准」。这是**参考层**的问题，本图不处理，
  但 5 篇 Balatro 结论文档都建立在这份产物上，值得单独提给用户。
- **别抄 Immolate 系的 `round(x*1e13)/1e13`** 做 `%.13f`，实测 0.042% 偏差。
- **FMA 收缩**是 RNG 的残留风险。若整条链对不上，第一个试 FMA 版。
- **Phaser 4 的 Filter 体系没有自定义 shader 入口**。24 个 filter 全是内置的，
  19 个 Balatro shader 一个都进不去，全部走 `Shader` GameObject。
- **`#pragma phaserTemplate` 不是给用户着色器分节用的**。`vertexSource` 整体替换模板，
  自定义着色器要写完整程序，遵守 `uProjectionMatrix` / `inPosition` / `inTexCoord` / `outTexCoord` 契约，
  并 `setUniform('uMainSampler', 0)` 绑纹理单元。
- **「delay 可以压成 0」在塔罗＋星球这一刀里仍然成立**（16 号票复核过）。
  09 号票列的 5 处里只命中 `card.lua:1472` 的 The Wheel of Fortune，
  而它那三次掷点共用 `wheel_of_fortune` 一个 key、在一次 `use_consumeable` 里严格 FIFO。
  **但这条结论不要带过 17 号票**：`card.lua:1723`（开补充包）与
  Familiar / Grim / Incantation（`card.lua:1312`）那几处到时候会进范围。
- **`ease_dollars` 在原作里是入队延迟的，本复刻是同步立即的。** 后果：
  `G.GAME.dollar_buffer` 这个字段在复刻件里**必须恒为 0**。它在原作里的唯一用途是
  让同一次结算里后面的小丑（只有 `Bull`）看到「在路上的钱」；同步加钱之下
  `dollars` 本身已经最新，再往 buffer 里加就是把同一笔算两遍。
- **小丑区遍历的顺序会改分数。** `[Joker, Cavendish]` 是 `(2+4)×3 = 18`，
  `[Cavendish, Joker]` 是 `2×3+4 = 10`。所以小丑区的数组顺序是逻辑状态，不是展示顺序。
- **打出去的牌在结算时已经不在手牌区了。** 原作 `play_cards_from_highlighted` 先把牌
  移到 `G.play`，再跑 `evaluate_play`，所以管线第 10 步（手牌区遍历）看不到它们。
  `Raised Fist` / `Baron` / `Shoot the Moon` 全吃这个差别——`Round.play()` 里
  `moveOut` 必须在 `evaluatePlay` **之前**。
- **`calculate_joker` 里有 6 张小丑在结算中途消费 RNG**
  （Misprint / Business Card / Reserved Parking / Space Joker / 8 Ball / Bloodstone）。
  掷点的**位置**有语义：Business Card 是「先判人头牌、再掷」，所以非人头牌不消耗 RNG；
  Reserved Parking 反过来是「先掷、再判 debuff」。搞反了整条 seed 链就分叉。
- **RNG 状态必须由 `Run` 持有，不能每回合新建。** `G.GAME.pseudorandom` 是整局共享的表，
  每个 key 的第 n 次调用依赖前 n-1 次。每回合 `new PseudorandomState(seed)` 会让
  `'hook'` / `'business'` / `'misprint'` 全部从头开始——而这种分叉**在单回合测试里看不出来**。
- **`get_new_boss` 的池子顺序是 key 的字母序，不是 `order`。** `eligible_bosses` 是
  以 key 为键的表，`pseudorandom_element` 对这种表按 key 排（`misc_functions.lua:266`）。
  另外 `bosses_used` 的**最小使用次数过滤会改池子大小**，也就改 `math.random(#keys)` 的取值域，
  省掉它第二个 Ante 起就分叉。**12 条外部真值现在打在生产代码上**（`blinds.test.ts`），
  不再是测试里手写一遍。
- **`evaluate_round` 的利息读的是「入账前」的余额。** 加钱顺序是
  盲注 → 剩余出牌 → 小丑 → 利息，而利息读 `G.GAME.dollars`。
  用加完之后的余额算，每关都多给钱。
- **`The Hook` 的额外弃牌不扣弃牌次数。** `ease_discard(-1)` 与 `discards_used++`
  都在 `if not hook` 里面（`state_events.lua:1213` 附近）。但它**照样触发小丑的
  `discard` 分支**——被 Hook 弃掉的人头牌会给 Faceless Joker 算进去。
- **`played_this_ante` 只在 Boss 打完之后清**（`state_events.lua:286`），不是每回合。
  `The Pillar` 靠它。
- **那四个 `reset_*`（idol / mail / anc / cas）每回合都跑**，不只是 Ante 结束
  （`state_events.lua:294`）。它们各用一个独立 key，所以少跑不影响别的 key——
  但接 `The Idol` / `Ancient Joker` / `Castle` 时那几个 key 的调用次数必须已经对齐，
  所以现在就跑完。
- **未实现行为的 Boss 要抛，不能静默放过。** 一个「有需求但没 debuff」的 Boss
  看起来完全正常、玩起来是白送一关——等于把正确性缺口伪装成正常行为。
  `assertImplemented` 挡在 `Run.startRound`；28 个 Boss 现在全实现了，
  但**那道闸要留着**（挑战模式带自己的 Boss）。
- **`The Arm` 是唯一一个「`debuff_hand` 返回假但仍然生效」的 Boss。**
  它把牌型降一级然后**让这手牌照常计分**（`blind.lua:551` 只设 `triggered`、不 return）。
  `The Ox`（清空钱）同理。所以 `debuffHand` 的返回值只表示「这手算不算 0 分」，
  不表示「Boss 有没有干活」。
- **盖牌不是 debuff。** 四个 Boss 会盖牌（Wheel / House / Mark / Fish），
  牌照样能选、照样计分，玩家只是看不见。**但 `The Wheel` 的 1/7 判定消费 RNG**，
  所以 `stayFlipped` 必须在逻辑层、由抽牌流程调，挪进表现层 RNG 顺序就随渲染时机变了。
- **`The Water` 的 `discards_sub` 砍的是「进场时实际剩多少」**，含小丑给的 `d_size`。
  写死 3 会在带 Drunkard 时留下 1 次弃牌，所以复刻件用哨兵 `ALL_DISCARDS`。
- **主遍历（管线第 15 步）不给钱。** `state_events.lua:929-936` 只处理
  `mult_mod` / `chip_mod` / `Xmult_mod` 三个。`Matador` 之类返回的 `dollars`
  只是给提示文字用的，钱是它自己调 `ease_dollars` 加的——在管线里再加一遍就翻倍。
- **小丑对小丑要直接调 `calculate_joker`，不能走 `eval_card`。**
  `eval_card` 的 `other_joker` 分支（`common_events.lua:647`）转调的是
  **`context.other_joker` 自己**，而 `state_events.lua:940` 要问的是 `v`
  （提供效果的那张）。走错了主体与对象颠倒，`Baseball Card` 这类一个都不触发。
- **Hiker 与 Wee Joker 的成长时机不同。** 两者都在逐张型里长，但
  Hiker 长的是**牌**的 `perma_bonus`，而牌自己的筹码在同一轮里已经先算过，
  所以本手用旧值；Wee Joker 长的是**自己**的 `extra.chips`，
  要等第 15 步主遍历才被读，所以本手就吃到加成。
- **`blueprint_compat` 不参与判定。** 它只喂 UI 的提示文字（`card.lua:4227`），
  机制上蓝图会去复制「标着不兼容」的小丑。别顺手加 `if (!compat) return null`。
- **蓝图递归的上限是 `#小丑区 + 1`**，不是 `#小丑区`——多的那 1 是给
  「链到非蓝图那张」留的。
- **`Oops! All 6s` 把 `probabilities` 里每一项 ×2，所以两张是 ×4**，不是 +100%。
- **商店那两次掷点一个要算一个不要算。** `etperpoll<ante>`（永恒／易腐）那行
  `local ... = pseudorandom(...)` 在 `if` 外面，**无条件消费**；
  租赁那次在 `and` 右边、`enable_rentals_in_shop` 默认关，**短路不消费**。
  搞反这一对，后面每一格商店都偏。
- **池子剔除不改池子长度。** 被剔的位置换成 `'UNAVAILABLE'` 而不是从数组删掉，
  所以 `math.random(#pool)` 的取值域不变，抽到就换 `_resample<n>` 的 key 重抽。
  真删掉会让同 seed 立刻分叉。三个剔除源：45 张 `start_locked`（新档不解锁）、
  `used_jokers`（**商店摆出来那一刻就算见过**，`card.lua:350` 在 `set_ability` 里标记）、
  `pool_flag`（Gros Michel 灭绝退池 / Cavendish 灭绝才进池）。
- **`j_joker` 与 `j_wee` 共用同一个图集格**（两者 `pos` 都是 `{x=0,y=0}`，
  `game.lua:371` 与 `:502`）。Wee Joker 的卡面就是普通 Joker 的脸，
  只是 `set_ability` 把它缩到 0.7（`card.lua:250`）。150 张小丑只占 149 格，
  别把这一处当成抽取错误。
- **越界的图集 `pos` 不会报错**，只会安静地画出网格里另一张卡的图。
  `core/atlas.ts` 刻意不 import Phaser，就是为了让「每张卡的 pos 都在网格内」
  能进单测（`core/atlas.test.ts`）——这是表现层里唯一能自动验的部分。
- **`not v.demo` 在完整版里不剔除任何小丑。** `game.lua:746` 有
  `if not G.FTP_LOCKED then v.demo = nil end`，而 `G.FTP_LOCKED` 在
  `globals.lua:162` 是注释掉的。150 张全部进稀有度池，一张不少。
  读 `game.lua:840` 那行时别被 `not v.demo` 骗了。
- **商店在 `ante++` 之后开。** 商店的所有 key 都带 ante（`cdt` / `rarity` / `Joker<r>sho`），
  在推进 ante 之前开商店会用上一个 ante 的 key。
- **免费重掷用掉的那一次不涨价。** `reroll_shop` 里
  `calculate_reroll_cost(final_free)` 传了 `skip_increment`。
- **Ante 1 的 600 分打得通，但要会弃牌。** 基础牌组不追同花是过不了的：
  一对只有 50–60 分，四手打满 240；同花 300 分一手就够小盲注。
  `core/ante1.test.ts` 里那个策略就是这么写的，它同时是「引擎跑得通」的验收。
- **小丑的 `base.nominal` 是 0。** `set_base(P_CARDS.empty)` 匹配不到任何点数，
  所以 `get_chip_bonus` 对小丑返回 0、`ret.chips` 不会被写。重复触发那一问
  （拿小丑问 `cardarea = G.play`）靠这条才成为空转，不是靠调用方少传字段。
- **`T` 是目标变换，`VT` 是动画插值的那个。逻辑只读 `T`，绝不读 `VT`。**
  全仓九处按 `T.x` 排序（`align_cards` 六处 + `state_events` 三处），
  外加 `cardarea.lua:534` 的 pinned 特例（`-100*sort_id` 强制排前），直译时别简化掉。
- **`T.x` / `T.y` 的单位是 tile 不是像素**（`TILESIZE=20`、`CARD_W≈2.05` tile）。
  `align_cards` 里那堆手调常数全是 tile 尺度的，用像素维护 `T` 会让它们一个都不能用。
- **`Shader` GameObject 不会自动应用 spritesheet 的帧**，`outTexCoord` 默认跨整张纹理。
  必须显式调 `setTextureCoordinatesFromFrame(frame, texture)`，否则整张图集会被画进每个 quad。
- **复刻件的配置源头是 `源码/` 里的 Lua，不是 `配置CSV/`**。后者是派生的研究产物，
  且装不下行为（`_小丑总表.csv` 配置驱动仅 19/150）。
- **Phaser 4 的 `outTexCoord.y` 方向与 LÖVE 相反**。影响 `dissolve_mask` 的 borders
  上下不对称逻辑——翻 uv 或翻 borders，二选一。
- **性能数据来自 RTX 3060**，只说明桌面端够用，不能外推到移动端。
- **`Shader` GameObject 的 `setAlpha` 是 NOOP**，alpha 必须走 shader uniform；
  它也不带 Animation / Tint / Input 组件，交互要自己挂 hit area。
- **用 npm，不要用 pnpm**。pnpm 装 `esbuild` 时稳定复现 `ERR_PNPM_EPERM`。
- **模版的 `log.js` 已删**。它每次 dev/build 都会向 `gryzor.co` 上报项目名与 Phaser 版本。
- **改 `src/core/rng/` 之前先跑 `npm test`**。那 24 个测试是后面每一步直译的底座。
- **「结算管线做全但不要小丑」是自相矛盾的**。15 步里第 6、11、15 步全是小丑遍历，
  管线的难度恰恰在小丑，零小丑时这三步空跑、测不到。
- **洗牌顺序没有外部真值**，只做了结构性验证。别把它当对拍结果引用。
  实机挂钩子那条路没废，只是没走——真要走的话它能一次性服务所有里程碑。
- **UI 占全仓 28%**（`UI_definitions.lua` 6,607 行 + `button_callbacks.lua` 3,314 行），
  而按直译裁定这部分是**重写**不是直译。估工作量时别把它算进那 35,876 行里。

- **`used_jokers` 的语义是「此刻被摆出来或被持有的」，不是「整局见过的」。**
  `card.lua:350` 的 `set_ability` 标上，而 `card.lua:4829` 的 `Card:remove()`
  有一条对称的清除（小丑区与消耗品区里都没有同名的了就抹掉）。
  **重掷商店**（`button_callbacks.lua:2983` 的 `c:remove()`）与
  **离开商店**（`UIBox:remove` → `CardArea:remove` → `remove_all(cards)`）都会走那条清除。
  写成「见过就永久剔除」的后果不是「多剔几张」：池子长度不变（剔的位置是 UNAVAILABLE），
  但**内容**窄了，于是 `_resample` 的次数对不上，同 seed 从第二个商店起分叉。
  **它对消耗品同样生效**——那个标记循环按 `name` 匹配全体 `P_CENTERS`。
- **`level_up_hand` 是从 1 级值重算的，不是增量加减**（`common_events.lua:467`）：
  `level = max(0, level+amount)`、`mult = max(s_mult + l_mult*(level-1), 1)`、
  `chips = max(s_chips + l_chips*(level-1), 0)`。**三个 clamp 都要，没有上限。**
  只要等级不撞下限两者等价，一撞就永久跑偏：High Card 降到 0 级时原作给 mult = 1，
  减法给 0 —— 那一手直接 0 分。
- **`G.GAME.hands` 的 `visible` 开局不是全 false**：九个常规牌型是 `true`，
  只有 Flush Five / Flush House / Five of a Kind 是 `false`（`game.lua:2212`）。
  写成全 false 会让 `To Do List` 的可选池在开局是空的。
- **商店的消耗品格只消费一次池子抽取**（`<Type>sho<ante>` + resample）。
  `rarity` / `etperpoll` / `edi` 全在 `if _type == 'Joker'` 里面，
  `front` 只有 Base/Enhanced 才掷；`soul_<Type><ante>` 要 `soulable`，
  而 `create_card_for_shop` 传的第 6 个实参是 **nil**（`UI_definitions.lua:825`）——
  所以 **The Soul / Black Hole 出不了商店**，它们还被 `get_current_pool` 无条件剔除。
- **星球池有 `softlock`**：Planet X / Ceres / Eris 要对应牌型 `played > 0` 才进池
  （`common_events.lua:2044`）。新档是 12 个位置、9 张可用。
- **石头牌凑不成任何牌型，却无条件计分。** `get_id` 返回一个假点数、`is_suit` 一律否，
  所以它进不了 `results.top`；但 `state_events.lua:605` 的 `pures` 会把它追加进计分集。
  它加的是 `config.bonus`(50)**而不是自己的点数**（`get_chip_bonus` 对它不加 `base.nominal`）。
- **幸运牌的两次掷点无条件发生**（`lucky_mult` 1/5 给倍率、`lucky_money` 1/15 给钱），
  两个独立 key，中不中都消耗，顺序是 mult 在前（由 `chips → mult → dollars` 定死）。
  挪进 `if` 里会让同 seed 从这一手起分叉。
- **碎掉的玻璃牌本手照样出过力**：销毁判定（`state_events.lua:971`）排在
  那唯一一次乘法之前。`glass` 掷点只对「计分集里、没被 debuff 的玻璃牌」发生（`and` 短路），
  而且小丑那边的 `destroying_card` 判定**不会**让它跳过——原文两个 if 是并列的。
- **钢铁牌的 ×1.5 写进 `ret.x_mult` 而不是 `h_x_mult`**（`common_events.lua:634`）。
  手牌区的效果应用对 `x_mult` 是不分来源统一处理的。
- **黄金牌的 $3 在 `evaluate_round` 之前入账**，所以它**参与本回合的利息**。
  `end_round` 的顺序是：小丑 `end_of_round`（`state_events.lua:99`）→
  手牌区 `get_end_of_round_effect`（`:192`）→ 回合结算界面调 `evaluate_round`（`:1156`）。
- **`The Fool` 读的是「上一张」，不是自己。** `G.GAME.last_tarot_planet` 由
  `set_consumeable_usage` 的**双层嵌套** immediate 事件设置，而 The Fool 自己的
  创建事件先入队——FIFO 下 The Fool 先跑。所以复刻要「先 apply、再记 lastTarotPlanet」。
  但**用量计数是同步的**（只有 `last_tarot_planet` 走那个嵌套事件）。
- **`Death` 复制的是 `T.x` 最大的那张**，不是数组第一张。
  **`Strength` 让 A 绕回 2**（`id == 14 and 2 or min(id+1, 14)`），不是停在 A。
- **`8 Ball` 的三个条件是嵌套的**：先查消耗品区空位、再判点数是不是 8、最后才掷点。
  区满了或者不是 8 都**不消费 `8ball`**。同一形状的还有 `Vagabond` / `Superposition` / `Cartomancer`。
- **加了新的 context handler 表，要补进 `NAMES_WITH_HANDLERS`。**
  漏了会让新实现的小丑被 `isJokerImplemented` 报成未实现——
  那张「算出来的名单」只算它知道的表。
- **实测：商店供不起星球。** 八个 seed 的贪心深度在接消耗品前后都是 Ante 2–4
  （2.875 → 3.0）。商店两格里 ~28.6% 是消耗品、一半还是塔罗，整局买到 1–5 张，
  而且抽到哪个牌型不由人挑。**原作里星球的主要来源是天体补充包**（一包 3 张、Jumbo 5 张）。
- **`G.GAME.spectral_rate` 默认 0，商店永远不出幽灵牌。**
  幽灵牌只能从幽灵补充包与 The Soul 来，所以「不做补充包」自动蕴含「不做幽灵牌」。
- **`Card:set_base` 换点数换花色时不动 `sort_id` 与 `unique_val`**——
  换的是同一张牌，不是新造一张。新造会让 `pseudoshuffle` 的规范序跟着变。
- **「写了 handler」不等于「有人调」。** `/code-review high` 在收尾时逮到两处
  **整张 handler 表没有调用方**：`evaluate_play` 从没跑过 `context.after` 那一趟
  （`state_events.lua:1089`，`Ice Cream` / `Vagabond` / `Superposition` 全是死代码），
  `Run.useConsumable` 从没发过 `using_consumeable`
  （`button_callbacks.lua:2330`，`Constellation` 同样）。
  两处都被 `isJokerImplemented` 报成已实现——因为它从 handler 表算，
  而表里有没有东西与「这张表会不会被调」是两回事。
  **加新 context 表时，把「谁来调它」和 handler 一起写。**
- **`after` 那一趟排在分数算完之后**（`state_events.lua:1052` 先算
  `math.floor(hand_chips*mult)`，`:1089` 才跑 after），所以它改不了这一手的分数。
- **换牌面不要借 `makeCard`。** `Card:set_base` 换的是同一张牌的 `base`，
  而 `makeCard` 会推进 `sort_id` / `unique_val` 两个全局自增计数器，
  `sort_id` 正是 `pseudoshuffle` 的规范序。今天看不出来（没有运行时造牌的路径），
  但 `增删牌` 那组小丑接进来之后，用过几次 The Sun 就会让新造的牌拿到偏移过的
  `sort_id`，同 seed 的洗牌跟着分叉。用 `makeBase`（纯函数）。
- **有两张小丑「有 handler 但效果落空」**，且被 `isJokerImplemented` 报成已实现：
  `To Do List`（`pickToDoHand` 全仓没有调用方，牌型从没被抽过）与
  `Mr. Bones`（返回的 `saved` 标志没有读取方）。
  这正是 coverage 那套想挡却挡不住的漏网形态——**「有 handler」不等于「有效果」**。
  两张都已开后台任务，不在 16 号票范围。

- **`get_pack` 的第一次调用不掷点。** 新档的第一个商店，第一个补充包格子
  恒是小丑包（`common_events.lua:1984` 提前 return），而且那一格**不消费
  `shop_pack<ante>`**。所以第一个商店消费 1 次、以后每个商店 2 次。
  那条路用的 `math.random(1, 2)` 走**全局流**（不是 pseudoseed），
  而 `p_buffoon_normal_1/2` 除图集坐标完全一样，所以不可复现也不影响数值。
- **补充包的权重和是 `22.420000000000005`，不是 `22.42`。**
  原文按 order 序逐个累加双精度，0.25 / 0.3 / 0.07 / 0.6 / 0.15 在二进制里都不精确。
  写成 22.42 会让贴着边界的那次掷点落进不同的桶。**要按同一个顺序累加**。
- **补充包不参与重掷**：`reroll_shop` 只清 `G.shop_jokers`。
  包的 key 存在 `G.GAME.current_round.used_packs`，买掉置 `'USED'`。
- **`Card:open` 里造牌那段只是入队，`open_booster` 的小丑遍历是同步的。**
  所以真实执行序是「`Hallucination` 先造塔罗、包里的牌后造」——
  照着读代码会写反，因为造牌那段写在上面。这个顺序有观测后果：
  Hallucination 造的那张会标 `used_jokers`，改包里那几张的池子内容。
- **`soulable` 在商店路径传 nil、在补充包路径传真值。** 掷点次数按 `_type` 分：
  Tarot 1 次、Planet 1 次、**Spectral 2 次**（The Soul 与 Black Hole 是
  两个并列的 if，不是 if/elseif，而且第二次能盖掉第一次）、Joker 0 次。
  **中了就 `forced_key`，那条路不抽池子**——所以一个奥秘包的账是
  「3 次 soul + (3 − 抽到 The Soul 的张数) 次抽取」。
- **小丑包用 `packetper<ante>`，商店用 `etperpoll<ante>`**
  （`common_events.lua:2180` 那行三元）。两个 key 搞混，两条链会互相污染。
  `edi<append><ante>` 那次**三条路都消费**。
- **`The Soul` 的池 key 既不带 append 也不带 ante**：legendary 时
  `_pool_key..(not _legendary and ante or '')` 取空串，所以是 `'Joker4'`。
  但**rarity 那次点照掷**（`_rarity` 是 nil），只是结果被 `legendary and 4` 盖掉。
  `Wraith` 反过来：传了 `_rarity = 0.99`，**不掷点**。
- **小丑身上的版本效果分两段**（`state_events.lua:900` 起）：
  `chip_mod`/`mult_mod` 在那张小丑自己的效果**之前**，
  `x_mult_mod` 在**「小丑对小丑」之后**。所以 Polychrome 的 ×1.5 是最外层那一乘。
  合并成一段会让 `Polychrome 的 Jolly Joker` 从 450 算成 330。
  **扑克牌身上不分段**（`state_events.lua:780`）。
- **`poll_edition` 的两支公式不一样**：`guaranteed` 把四档系数全部 ×25
  **且不乘 `edition_rate`**，普通支只有后三档乘。合并会让保底那一支算错。
- **四种蜡封挂在四个不同的钩子上**：Red 在 `context.repetition`（**排在小丑的
  重复之前**）、Gold 在 `get_p_dollars`（**排在幸运牌那一段之前**，两者叠加）、
  Purple 在 `context.discard`、Blue 在 `get_end_of_round_effect`（**只认留在手里的**）。
  分开挂是有意的——合成一张表会掩盖「某个钩子压根没人调」这种错。
- **Blue 蜡封造的不是随机星球**，是 `G.GAME.last_hand_played` 对应的那一张
  （`card.lua:1050` 按 `hand_type` 查表）。
- **Purple 蜡封造塔罗时用的 key_append 是 `'8ba'`**（`card.lua:2263`），
  也就是 `8 Ball` 那张小丑的。看起来是抄下来忘了改，但它决定 seed key，**照抄才对**。
- **标准包的账与别的包完全不一样**：`stdset<ante>` →（Enhanced 才有的
  `Enhancedsta<ante>`）→ `frontsta<ante>` → `standard_edition<ante>`（mod 2、no_neg）
  → `stdseal<ante>` →（有蜡封才有的 `stdsealtype<ante>`）。
  两处容易漏：**`soulable` 传了真值但一次都不掷**（`_type` 是 Base/Enhanced，
  两支都不匹配）、**Base 不抽池子**（`forced_key = 'c_base'` 直接跳过）。
- **`front` 抽的是以 key 为键的 `P_CARDS` 表**，所以排出来是
  `C_2..C_9, C_A, C_J, C_K, C_Q, C_T, D_2, …` 的字节序，**不是**牌组那个 2→A 的顺序。
- **三张造牌幽灵牌的 RNG 账各不相同**：Familiar 与 Incantation
  **用同一个 key 掷两次**（先点数、再花色），Grim 点数固定 A、**只掷花色**。
  强化池是 8 张里**去掉石头牌**的 7 张。
- **幽灵牌只进 `consumeable_usage_total.spectral` 与 `all`**，不进 `tarot_planet`
  （`misc_functions.lua:1205`）。`Fortune Teller` 数的是塔罗，算进幽灵牌就多给倍率。
- **`Astronomer` 的价格必须现算。** 原作在它进小丑区时把**所有卡重新定价一遍**
  （`card.lua:616`），所以「先买 Astronomer 再买天体包」是免费的。
  把价格烤进商品对象会让它只在「开商店之前就握着」时生效。
- **销毁判定里小丑那一趟排在玻璃牌之前，而且两个 if 是并列的**
  （`state_events.lua:977` / `:982`）——小丑毁掉了也**照样掷 `glass`**。

- **`context.cards_destroyed` 是死代码。** `card.lua:2625` 有这个分支（Glass Joker 在里面），
  但全仓没有一处调用方传它。Glass Joker 实际生效的是另外两条：
  `remove_playing_cards`（计分碎牌，数 `shattered`）与
  `using_consumeable` + `The Hanged Man`（数 `G.hand.highlighted` 里的玻璃牌）。
  **两条靠 `shattered` 互斥**——被 The Hanged Man 毁掉的牌不带这个标记，所以不会被数两遍。
- **`lucky_trigger` 的清除点在小丑逐张循环之后**（`state_events.lua:721`），
  不在 getter 里。它由 `get_chip_mult` / `get_p_dollars` 置位，中倍率或中钱都算。
  漏清会让 `Lucky Cat` 在后面每张牌上都当成「刚中了」。
- **`Vampire` 的 `not v.vampired` 护栏在复刻件里是多余的**：`set_ability(c_base)` 是同步的，
  吸完那张牌的 center 当场就是 `Default Base`，第二次扫描已经进不来。
- **`Marble Joker` 造的牌进的是 `G.play` 不是 `G.deck`**，所以这一关摸不到它。
  复刻件只进 `Run.fullDeck`。它跟着入队的 `G.deck.config.card_limit + 1` 是牌堆那一摞的
  视觉高度，不是数值上限，不建模。
- **`Driver's License` 的门槛 16 写死在代码里**，`config.extra = 3` 是倍率不是门槛。

- **本回合出牌数（`current_round.hands_played`）在结算之后才 +1**（`state_events.lua:545`）。
  放在结算前，结算里读到的第一手就是 1——Sixth Sense / DNA 永远不触发。
  注意它与**出牌次数**（`hands_left`，结算前就减，Dusk / Acrobat 靠它）是两回事。
- **`setting_blind` 在洗牌与发牌之前**（`state_events.lua:354`）。复刻件的 `Round` 构造拆成两段，
  中间回调 `Run.settingBlind`；手牌上限、出牌/弃牌次数、Four Fingers 这类判定松紧都在它之后才算。
  **残留偏差**：原作里 Burglar 在同一趟里先入队了效果、之后才被 Madness 切掉的话，效果照样生效；
  复刻件的 Burglar 是从「这一趟之后还活着的小丑」重算的，切掉就没了。
- **Marble Joker 的石头牌这一关就在牌堆里**：先 `emplace` 进出牌区，紧跟着 `draw_card(G.play, G.deck)`。
- **`setting_blind` 那一趟里的增删都是「先标记、跑完、再落地」**：Madness / Dagger 只打 `getting_sliced`，
  后面的小丑仍看得见被判死刑的那张（Riff-raff 数空位时算它一张）。
  **`joker_buffer`**：Riff-raff `+n`、Dagger `-1`、**Madness 不减**——原文如此。
  跑完先造 Riff-raff 的小丑、再删判了死刑的（删是带动画的 `start_dissolve`，造是紧跟着的事件）。
- **小丑没有 `sort_id`**。原作的小丑也是 Card，`pseudorandom_element` 会按 `sort_id`（创建序）排；
  复刻件按小丑区顺序。bot 从不挪小丑所以一致；**玩家拖过小丑顺序后，Madness / Invisible Joker /
  Ankh 的随机结果会与原作不同**。修它要给 `Joker` 加 `sort_id` 并与扑克牌共用计数器。
- **`playing_card_added` 有五个触发点**：Marble（同步，在自己的 `setting_blind` 里）、
  DNA（同步，在 before 循环里、下一张小丑之前）、Cryptid 与 Familiar / Grim / Incantation
  （整批一次）、标准包挑走一张。Certificate 也是一个，它还没实现。

- **`set_cost` 是「从头重算」，不是增量**：`cost = floor(base + 版本加价 + 0.5)`、
  `sell = max(1, floor(cost/2)) + extra_value`。原作在造卡、`set_edition`、`set_seal`
  （所以 `copy_card` 末尾一定会重算）之后都调它。**漏调一处，那张卡的价格就停在旧版本上**。
  攒卖价的（Egg / Gift Card）必须写 `extra_value`，直接改 `sell_cost` 会被下一次重算冲掉。
- **`bankrupt_at`**（Credit Card 每张 -20）从小丑区**现算**：卖掉、被毁、被 debuff 都自动收回。
  判买不买得起是 `cost > 0 and cost > dollars - bankrupt_at`——**免费的永远买得起**。
  收回下限不会抹平已经欠下的钱；负债时没有利息（`dollars >= 5` 才算）。

- **`Blind:disable()` 在构造中途与之后做的事不一样**。Chicot 在 `setting_blind` 里调它时，
  手牌上限、出牌/弃牌次数、牌堆 debuff 都还没算，所以只打标记、改分数要求，构造后半段读 `disabled`
  （等价于原作「set_blind 先扣、Chicot 的事件再还回来」）。之后调（Luchador、中途进场的 Chicot）
  才逐个还原：The Water 还弃牌、The Needle 还出牌、The Manacle +1 上限并补抽 1 张（不看上限）、
  四个盖牌 Boss 翻牌、Cerulean Bell 清强制选中、The Wall / Violet Vessel 分数要求 ÷2 / ÷3，
  然后整副牌与小丑区重跑 debuff，**够分就当场过关**。
- **弃牌计数（`discards_used` / `discards_left`）在逐张弃牌循环之后才变**（`state_events.lua:451`），
  与出牌计数同一类坑。

- **Orbital Tag 的候选牌型顺序没核实**：原文 `pairs(G.GAME.hands)` 是 LuaJIT 哈希序，
  复刻件按牌型声明序。掷点次数对（每个 Ante 三次），「掷出的数对应哪个牌型」要跑实机才知道。
  **To Do List 同一个坑**，而且复刻件造它时根本没掷 `to_do`——`makeJoker` 留了 `pickToDoHand`
  口子，`Run` 从来没传。
- **标签开的包**：Charm / Meteor 原文是 `'p_..._mega_'..math.random(1, 2)`（全局流），两张只差美术，
  复刻件固定取 1。包在盲注选择界面打开，关掉之后**再轮一次** `new_blind_choice`（下一个开包标签接着开）。

## Out of scope

<!-- 越过 destination 的工作；关闭后不再回到 frontier -->

- **Brotato 与 Block 的 web 复刻件**。本图只到 Balatro。三个复刻件是长期目的，
  但 Brotato 是连续存活制、Block 是服务端驱动，技术形状与 Balatro 差太远，
  共用一张图会让 frontier 失焦。Balatro 这张图走完后另起新图。
- **Block 的「完整」1:1**。定义上不成立：真实发牌是「端上 TFLite → 服务端推理 → 兜底权重」
  三层，包内只有兜底层（见 `AGENTS.md`）。任何 Block 复刻最多只能复刻兜底层。
- **公开部署与分发**。已裁定只跑 localhost。机制与数值不受版权保护，
  但美术、音频、文案受保护，而本仓库用的正是原素材——一旦对外可访问即构成侵权。
