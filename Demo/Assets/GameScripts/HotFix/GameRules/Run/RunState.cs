using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>
    /// 一局的状态与命令入口(06 号票 §6)。对象之间只用 id 引用:实例对象只存在方块库和盲注临时块两个列表里。
    /// 表现层只拿 <see cref="IRunView"/>,改状态只经命令。
    /// </summary>
    public sealed class RunState : IRunView
    {
        private readonly List<BlockInstance> _library;
        private readonly int[] _typeLevels;
        private readonly List<GeneSlot> _genes;

        public RuleConfig Config { get; }

        /// <summary>本局的全部随机流。表现层的随机(演出、粒子)用引擎自己的,绝不取这里,否则改一个动画就改了这一局(08 号票)。</summary>
        public RngStreams Rng { get; }

        public string Seed => Rng.Seed;

        /// <summary>
        /// 下一个要发的实例 id,从 1 起。计数器本身进存档:读档不能用「最大 id + 1」推,最大号那块被毁之后会复用它的号。
        /// </summary>
        public int NextInstanceId { get; private set; }

        /// <summary>方块库,按 id 升序(只追加,天然有序)。永久的改块直接改这里的实例。</summary>
        public IReadOnlyList<BlockInstance> Library { get; }

        /// <summary>消除类型等级,下标 = (int)<see cref="ClearType"/>,从 1 起。本图恒为 1。</summary>
        public IReadOnlyList<int> TypeLevels { get; }

        /// <summary>基因栏,从左到右。本图恒为空。</summary>
        public IReadOnlyList<GeneSlot> Genes { get; }

        /// <summary>当前盲注;开局后、开第一个盲注前为 null。</summary>
        public BlindState Blind { get; private set; }

        IBlindView IRunView.Blind => Blind;

        private RunState(RuleConfig config, RngStreams rng, int nextInstanceId, List<BlockInstance> library,
            int[] typeLevels, List<GeneSlot> genes, BlindState blind)
        {
            Config = config ?? throw new ArgumentNullException(nameof(config));
            Rng = rng;
            NextInstanceId = nextInstanceId;
            _library = library;
            _typeLevels = typeLevels;
            _genes = genes;
            Blind = blind;
            Library = library.AsReadOnly();
            TypeLevels = Array.AsReadOnly(typeLevels);
            Genes = genes.AsReadOnly();
        }

        /// <summary>开新局:按配置里默认方块库清单的顺序逐块取号建库。种子文本须已规范(<see cref="SeedText"/>)。</summary>
        public static RunState NewRun(string seed, RuleConfig config)
        {
            var levels = new int[ClearTypes.Count];
            for (int i = 0; i < levels.Length; i++) levels[i] = 1;
            var run = new RunState(config, new RngStreams(seed), 1, new List<BlockInstance>(), levels, new List<GeneSlot>(), null);
            foreach (LibraryEntry e in config.DefaultLibrary)
            {
                run._library.Add(new BlockInstance(run.IssueId(), e.Kind, e.Points, e.Enhancement, e.Edition));
            }
            return run;
        }

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):各字段原样接上,不查约束,读档随后调 <see cref="Validate"/>。</summary>
        internal static RunState Restore(RuleConfig config, RngStreams rng, int nextInstanceId, List<BlockInstance> library,
            int[] typeLevels, List<GeneSlot> genes, BlindState blind) =>
            new RunState(config, rng, nextInstanceId, library, typeLevels, genes, blind);

        /// <summary>
        /// 唯一的取号口。方块库的块、首领预置块、将来「生成一块」的效果都从这里取,所以不能假设 id 都在方块库里。
        /// 只增不复用:碎裂、湮灭掉的 id 不回收。
        /// </summary>
        public int IssueId()
        {
            if (NextInstanceId == int.MaxValue) throw new InvalidOperationException("实例 id 用尽");
            return NextInstanceId++;
        }

        public int LevelOf(ClearType type)
        {
            int t = (int)type;
            if (t < 0 || t >= ClearTypes.Count) throw new ArgumentOutOfRangeException(nameof(type), type, "不是消除类型");
            return _typeLevels[t];
        }

        /// <summary>这种类型按当前等级的底注与基础倍率。界面的类型表、拖动预览与结算读底注(段 #7)用的是这一个查表。</summary>
        public ClearTypeBase BaseOf(ClearType type) => Config.ClearTypes.Get(type, LevelOf(type));

        /// <summary>
        /// 基因钩子:在基因栏最右边加一格。本图没有基因来源,只有单测调用(同 <see cref="BoardState.SetDead"/>);
        /// 槽数上限、买卖与换位归阶段 5。
        /// </summary>
        public void AddGene(int geneId) => _genes.Add(new GeneSlot(geneId));

        /// <summary>按 id 找方块库或本盲注临时块里的实例,找不到返回 null。</summary>
        public BlockInstance FindInstance(int instanceId)
        {
            int lo = 0, hi = _library.Count - 1;
            while (lo <= hi)
            {
                int mid = lo + (hi - lo) / 2;
                int id = _library[mid].Id;
                if (id == instanceId) return _library[mid];
                if (id < instanceId) lo = mid + 1;
                else hi = mid - 1;
            }
            if (Blind == null) return null;
            foreach (BlockInstance b in Blind.TempList)
            {
                if (b.Id == instanceId) return b;
            }
            return null;
        }

        /// <summary>
        /// 开盲注:库里全部 id 按升序排,再用 <c>shuffle@段.层</c> 那条流从后往前洗(08 号票),洗完的列表就是抽牌顺序;然后发第一组、判一次负。
        /// 盲注内抽牌不再消耗随机。不算一步(步数仍为 0),但同样返回事件(07 号票 §4)。上一个盲注还在进行时调用是流程错误。
        /// </summary>
        public StepResult StartBlind(BlindSpec spec)
        {
            if (spec == null) throw new ArgumentNullException(nameof(spec));
            if (Blind != null && Blind.Outcome == BlindOutcome.InProgress) throw new InvalidOperationException("上一个盲注还没结束");
            var blind = new BlindState(spec);
            foreach (BlockInstance b in _library) blind.DrawList.Add(b.Id);
            blind.DrawList.Sort();
            Rng.Get(RngKeys.Shuffle(spec.Segment, spec.Layer)).Shuffle(blind.DrawList);
            Blind = blind;
            return StepPipeline.AfterBlindStart(this);
        }

        /// <summary>
        /// 落子一步:校验 → 落子 → 判线 → 结算 → 判胜 → 发组 → 判负,一次推进到下一个稳定状态(07 号票 §4 的 17 段)。
        /// 被拒不抛异常、不改状态。落点以参数的 rot 为准,不看槽上存的朝向。
        /// </summary>
        public StepResult Place(int instanceId, int rot, int row, int col) => StepPipeline.Place(this, instanceId, rot, row, col);

        /// <summary>弃置一步:槽置空、进弃置堆、次数减一,不计分、连击不变,然后同样走步收尾、判胜、发组、判负。被拒不抛异常、不改状态。</summary>
        public StepResult Discard(int instanceId) => StepPipeline.Discard(this, instanceId);

        /// <summary>
        /// 判线、定类型(07 号票 §8):这块按 rot 落在 (row, col) 会消什么、算哪种类型。只读,不碰随机流、不跑钩子、不用 Clone。
        /// 拖动预览和真落子(段 #3、#5)都调它。只问几何,不问块在不在待放置区;rot 不在 0..3 抛异常(同 <see cref="CanPlace"/>)。
        /// </summary>
        public ClearResolution ResolveClear(int instanceId, int rot, int row, int col)
        {
            BlockInstance block = FindInstance(instanceId);
            if (block == null || Blind == null || !Blind.Board.CanPlace(block.Kind, rot, row, col)) return ClearResolution.Illegal;

            ClearResult lines = Blind.Board.FullLinesAfter(block.Kind, rot, row, col, out ulong occupiedAfter);
            int[] rows = lines.Rows.ToArray(), cols = lines.Cols.ToArray();
            if (rows.Length + cols.Length == 0) return new ClearResolution(true, null, rows, cols, null, null);

            int[] cells = ClearRules.OrderCells(rows, cols);
            var owners = new int[cells.Length];
            ulong cleared = 0UL;
            for (int i = 0; i < cells.Length; i++)
            {
                // 满线上只有占用格;落子前是空的那几格就是这块自己的
                int owner = Blind.Board.OwnerAt(cells[i]);
                owners[i] = owner == 0 ? instanceId : owner;
                cleared |= BoardCells.BoardMaskBit(cells[i]);
            }
            bool allClear = (occupiedAfter & ~cleared) == 0UL;
            ClearType type = ClearRules.Classify(rows, cols, IsSameShape(owners), allClear);
            return new ClearResolution(true, type, rows, cols, cells, owners);
        }

        /// <summary>同形态:被消各格所属块的 Kind 全相同(06 号票 §5)。万态「参与任意形态」以后只改这一处。</summary>
        private bool IsSameShape(int[] owners)
        {
            TetrominoKind kind = FindInstance(owners[0]).Kind;
            for (int i = 1; i < owners.Length; i++)
            {
                if (FindInstance(owners[i]).Kind != kind) return false;
            }
            return true;
        }

        /// <summary>
        /// 进行中的盲注此刻该不该判负(规则 §2.4,07 号票 §9):抽牌堆和待放置区都空 → 预算耗尽;
        /// 否则待放置区非空、剩下的块怎么转都放不下、弃置用完 → 放不下。两种互斥。段 #16 与 <see cref="Validate"/> 的稳定态约束共用它。
        /// </summary>
        internal FailReason PendingFailure()
        {
            if (Blind.IsTrayEmpty) return Blind.DrawList.Count == 0 ? FailReason.BudgetExhausted : FailReason.None;
            if (Blind.DiscardsLeft > 0) return FailReason.None;
            foreach (TraySlot slot in Blind.TraySlots)
            {
                if (!slot.IsEmpty && CanPlaceAnyRotation(slot.Id)) return FailReason.None;
            }
            return FailReason.CannotPlace;
        }

        /// <summary>
        /// 改待放置区里一块的朝向:不算步、不碰随机流、不吐事件(06 号票 §4)。
        /// 块不在待放置区、rot 不在 0..3、盲注不在进行中时不改,返回 false。
        /// </summary>
        public bool SetRotation(int instanceId, int rot)
        {
            if (Blind == null || Blind.Outcome != BlindOutcome.InProgress || !Tetromino.IsValidRot(rot)) return false;
            int slot = Blind.SlotOf(instanceId);
            if (slot < 0) return false;
            Blind.TraySlots[slot] = new TraySlot(instanceId, rot);
            return true;
        }

        /// <summary>
        /// 这块按 rot 档朝向、包围盒左上角落在 (row, col) 时放得下吗(死格挡落子)。只问几何,不问它在不在待放置区。
        /// 按实例问而不按种类问:以后万态这类「落子规则随块变」的强化只改这里。
        /// </summary>
        public bool CanPlace(int instanceId, int rot, int row, int col)
        {
            BlockInstance block = FindInstance(instanceId);
            return block != null && Blind != null && Blind.Board.CanPlace(block.Kind, rot, row, col);
        }

        /// <summary>这块转到任一朝向有地方放吗。托盘置灰与「放不下」判负共用它(12 号票)。</summary>
        public bool CanPlaceAnyRotation(int instanceId)
        {
            BlockInstance block = FindInstance(instanceId);
            return block != null && Blind != null && Blind.Board.CanPlaceAnyRotation(block.Kind);
        }

        /// <summary>
        /// 深拷贝全部状态,随机流一起拷:在拷贝上试走,原局的流不动。规则配置是参数不是状态,两边共享同一份。
        /// </summary>
        public RunState Clone()
        {
            var library = new List<BlockInstance>(_library.Count);
            foreach (BlockInstance b in _library) library.Add(b.Clone());
            var genes = new List<GeneSlot>(_genes.Count);
            foreach (GeneSlot g in _genes) genes.Add(g.Clone());
            return new RunState(Config, Rng.Clone(), NextInstanceId, library, (int[])_typeLevels.Clone(), genes, Blind?.Clone());
        }

        /// <summary>
        /// 状态约束,返回第一条不成立的,形如「路径: 说明」,路径用存档快照的成员名(<see cref="RunSnapshot"/>);全部成立返回 null。
        /// 单测每步之后断言与读档校验(09 号票 §5)共用这一个函数,不另写。查:
        /// 实例 id 有效且唯一、枚举都有定义、类型等级在 1..类型表上限、基因都在效果注册表里登记过;
        /// 盲注的计数非负、弃置次数不超过规格、待放置区长度等于每组块数且朝向在 0..3、结局与失败原因相配;
        /// 盘面两条不变式(06 §2)、区守恒——方块库与临时块里每个 id 恰好在抽牌堆、待放置区、盘上、弃置堆、消尽堆之一,
        /// 不在库里的 id 不许出现(06 §3);进行中的盲注处在稳定态(09 §5 的两条)。
        /// 09 §5 的随机流四条(种子规范、键合法、键升序不重、状态不全零)由 <see cref="RngStreams"/> 的构造保证、走不出坏值,
        /// 坏档在构造之前由 <see cref="RunSnapshot.Read"/> 拦下,这里不重查。
        /// </summary>
        public string Validate()
        {
            // id → 所在区;null = 还没在任何区里见到。只按 id 查,不遍历,结果次序全由下面的有序列表定
            var zoneOf = new Dictionary<int, string>();
            int prev = 0;
            for (int i = 0; i < _library.Count; i++)
            {
                BlockInstance b = _library[i];
                if (b.Id <= prev) return Invariant($"library[{i}].id: {b.Id} 不大于前一块的 {prev}(id 须 > 0 且严格升序)");
                if (b.Id >= NextInstanceId) return Invariant($"library[{i}].id: {b.Id} 不小于 nextInstanceId {NextInstanceId}");
                string enumError = CheckEnums(b, Invariant($"library[{i}]"));
                if (enumError != null) return enumError;
                zoneOf.Add(b.Id, null);
                prev = b.Id;
            }
            for (int t = 0; t < ClearTypes.Count; t++)
            {
                int max = Config.ClearTypes.MaxLevel((ClearType)t);
                if (_typeLevels[t] < 1 || _typeLevels[t] > max) return Invariant($"typeLevels.{(ClearType)t}: 等级 {_typeLevels[t]} 不在 1..{max}");
            }
            for (int i = 0; i < _genes.Count; i++)
            {
                // 09 §5 写的是「genes 为空」;本图注册表为空,两者等价,而单测经 AddGene 加登记过的替身基因(20 号票补的约束)
                int gene = _genes[i].GeneId;
                if (Config.Effects.Find(EffectSource.Gene, gene) == null) return Invariant($"genes[{i}].id: 基因 {gene} 没在效果注册表里登记");
            }
            if (Blind == null) return null;

            string err = CheckBlindValues(Blind);
            if (err != null) return err;
            for (int i = 0; i < Blind.TempList.Count; i++)
            {
                BlockInstance b = Blind.TempList[i];
                if (zoneOf.ContainsKey(b.Id)) return Invariant($"blind.tempBlocks[{i}].id: {b.Id} 重复");
                if (b.Id >= NextInstanceId) return Invariant($"blind.tempBlocks[{i}].id: {b.Id} 不小于 nextInstanceId {NextInstanceId}");
                err = CheckEnums(b, Invariant($"blind.tempBlocks[{i}]"));
                if (err != null) return err;
                zoneOf.Add(b.Id, null);
            }

            string boardError = Blind.Board.Validate();
            if (boardError != null) return "blind.owner: " + boardError;

            err = ClaimAll(zoneOf, Blind.DrawList, "blind.draw");
            if (err != null) return err;
            for (int i = 0; i < Blind.TraySlots.Length; i++)
            {
                if (Blind.TraySlots[i].IsEmpty) continue;
                err = Claim(zoneOf, Blind.TraySlots[i].Id, "blind.tray", Invariant($"blind.tray[{i}].id"));
                if (err != null) return err;
            }
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                int id = Blind.Board.OwnerAt(cell);
                if (id == 0 || (zoneOf.TryGetValue(id, out string zone) && zone == "blind.owner")) continue;
                err = Claim(zoneOf, id, "blind.owner", Invariant($"blind.owner[{BoardCells.RowOf(cell)}][{BoardCells.ColOf(cell)}]"));
                if (err != null) return err;
                if (Blind.Board.CellsOf(id) > Tetromino.CellCount) return Invariant($"blind.owner: 实例 {id} 占了 {Blind.Board.CellsOf(id)} 格");
            }
            err = ClaimAll(zoneOf, Blind.DiscardedList, "blind.discarded");
            if (err != null) return err;
            err = ClaimAll(zoneOf, Blind.DepartedList, "blind.departed");
            if (err != null) return err;

            foreach (BlockInstance b in _library)
            {
                if (zoneOf[b.Id] == null) return Invariant($"library: 实例 {b.Id} 不在任何区");
            }
            foreach (BlockInstance b in Blind.TempList)
            {
                if (zoneOf[b.Id] == null) return Invariant($"blind.tempBlocks: 实例 {b.Id} 不在任何区");
            }

            // 稳定态(09 号票 §5):进行中的盲注不会停在「本该发组」或「本该判负」的地方
            if (Blind.Outcome == BlindOutcome.InProgress)
            {
                if (Blind.IsTrayEmpty && Blind.DrawList.Count > 0) return "blind: 进行中,待放置区全空而抽牌堆非空(本该已发组)";
                FailReason pending = PendingFailure();
                if (pending != FailReason.None) return Invariant($"blind: 进行中,却已满足判负条件 {pending}");
            }
            return null;
        }

        private static string CheckEnums(BlockInstance b, string path)
        {
            if (!Enum.IsDefined(typeof(TetrominoKind), b.Kind)) return Invariant($"{path}.kind: 未定义的值 {(int)b.Kind}");
            if (!Enum.IsDefined(typeof(Enhancement), b.Enhancement)) return Invariant($"{path}.enhancement: 未定义的值 {(int)b.Enhancement}");
            if (!Enum.IsDefined(typeof(Edition), b.Edition)) return Invariant($"{path}.edition: 未定义的值 {(int)b.Edition}");
            return null;
        }

        private static string CheckBlindValues(BlindState b)
        {
            if (!Enum.IsDefined(typeof(BlindOutcome), b.Outcome)) return Invariant($"blind.outcome: 未定义的值 {(int)b.Outcome}");
            if (!Enum.IsDefined(typeof(FailReason), b.FailReason)) return Invariant($"blind.failReason: 未定义的值 {(int)b.FailReason}");
            if ((b.Outcome == BlindOutcome.Lost) != (b.FailReason != FailReason.None))
            {
                return Invariant($"blind.failReason: 结局 {b.Outcome} 配不上失败原因 {b.FailReason}(只有输了才有原因)");
            }
            if (b.Step < 0) return Invariant($"blind.step: {b.Step} 为负");
            if (b.Group < 0) return Invariant($"blind.group: {b.Group} 为负");
            if (b.Score < 0) return Invariant($"blind.score: {b.Score} 为负");
            if (b.Combo < 0) return Invariant($"blind.combo: {b.Combo} 为负");
            if (b.DiscardsLeft < 0 || b.DiscardsLeft > b.Spec.Discards)
            {
                return Invariant($"blind.discardsLeft: {b.DiscardsLeft} 不在 0..{b.Spec.Discards}");
            }
            if (b.TraySlots.Length != b.Spec.GroupSize)
            {
                return Invariant($"blind.tray: 有 {b.TraySlots.Length} 槽,每组块数是 {b.Spec.GroupSize}");
            }
            for (int i = 0; i < b.TraySlots.Length; i++)
            {
                TraySlot slot = b.TraySlots[i];
                if (!slot.IsEmpty && !Tetromino.IsValidRot(slot.Rot)) return Invariant($"blind.tray[{i}].rot: {slot.Rot} 不在 0..3");
            }
            return null;
        }

        private static string ClaimAll(Dictionary<int, string> zoneOf, List<int> ids, string zone)
        {
            for (int i = 0; i < ids.Count; i++)
            {
                string err = Claim(zoneOf, ids[i], zone, Invariant($"{zone}[{i}]"));
                if (err != null) return err;
            }
            return null;
        }

        private static string Claim(Dictionary<int, string> zoneOf, int id, string zone, string path)
        {
            if (!zoneOf.TryGetValue(id, out string seen)) return Invariant($"{path}: 实例 {id} 不在方块库与临时块里");
            if (seen != null) return Invariant($"{path}: 实例 {id} 已在 {seen}");
            zoneOf[id] = zone;
            return null;
        }
    }
}
