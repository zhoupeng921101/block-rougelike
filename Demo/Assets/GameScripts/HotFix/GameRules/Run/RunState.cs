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
        private readonly List<int> _consumables;
        private readonly List<int> _vouchers;
        private int _money;

        public RuleConfig Config { get; }

        /// <summary>本局的难度档(局外循环设计稿 §5);只影响开局参数与目标分曲线,不改战斗规则本身。</summary>
        public RunDifficulty Difficulty { get; }

        /// <summary>持有的金钱。本图只有通关奖励与利息两个来源;能不能透支等经济票再接。</summary>
        public int Money => _money;

        /// <summary>这一局的地图布局。开局一次生成,之后只读。</summary>
        public RunMap Map { get; }

        /// <summary>走到地图哪里(当前节点、是否已结算、走过的节点)。</summary>
        public MapProgress Progress { get; }

        /// <summary>当前还开着的商店;进下一个节点即关。没开店时为 null。</summary>
        public ShopState Shop { get; private set; }

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

        /// <summary>道具栏里的改造(号);本图只买不用,使用归战斗表现。</summary>
        public IReadOnlyList<int> Consumables { get; }

        /// <summary>本局已经买下的优惠券(号),按买下的次序。</summary>
        public IReadOnlyList<int> Vouchers { get; }

        /// <summary>券带来的参数修正;每次都从券列表现算。</summary>
        public RunModifiers Modifiers => RunModifiers.From(_vouchers);

        /// <summary>跳过节点换来的「下一次」效果(折扣、扩货、急售、补给、轻敌、弃权);用掉即清。</summary>
        public RunPending Pending { get; }

        /// <summary>情报标签:买到之后地图一直显示首领的负面效果;没拿到时首领只显示「首领」。</summary>
        public bool BossIntel { get; private set; }

        /// <summary>蓄息标签给的那一段加的利息封顶(美元);<see cref="_interestBonusSegment"/> 之外不生效。</summary>
        private int _interestBonus;

        /// <summary>蓄息标签作用到哪一段;0 = 没有。</summary>
        private int _interestBonusSegment;

        /// <summary>当前这一段的利息封顶加值(蓄息只在它那一段有效)。</summary>
        public int SegmentInterestCapBonus => _interestBonusSegment != 0 && CurrentSegment == _interestBonusSegment ? _interestBonus : 0;

        /// <summary>蓄息给的封顶加值本身(存档用;生效与否看 <see cref="SegmentInterestCapBonus"/>)。</summary>
        public int PendingInterestBonus => _interestBonus;

        /// <summary>蓄息作用在哪一段(存档用)。</summary>
        public int PendingInterestBonusSegment => _interestBonusSegment;

        /// <summary>现在走到第几段(还没进节点算第 1 段)。</summary>
        public int CurrentSegment => Progress.CurrentNodeId == 0 ? 1 : Map.Get(Progress.CurrentNodeId).Segment;

        /// <summary>基因槽总数 = 配置默认 + 扩槽券。</summary>
        public int GeneSlots => Config.GeneSlots + Modifiers.GeneSlotBonus;

        /// <summary>道具栏格数 = 配置默认 + 扩容券。</summary>
        public int ConsumableSlots => Config.ConsumableSlots + Modifiers.ConsumableSlotBonus;

        /// <summary>当前盲注;开局后、开第一个盲注前为 null。</summary>
        public BlindState Blind { get; private set; }

        IBlindView IRunView.Blind => Blind;

        private RunState(RuleConfig config, RngStreams rng, RunDifficulty difficulty, int money, RunMap map, MapProgress progress,
            ShopState shop, int nextInstanceId, List<BlockInstance> library, int[] typeLevels, List<GeneSlot> genes,
            List<int> consumables, List<int> vouchers, BlindState blind, RunPending pending, bool bossIntel,
            int interestBonus, int interestBonusSegment)
        {
            Config = config ?? throw new ArgumentNullException(nameof(config));
            Rng = rng;
            Difficulty = difficulty;
            _money = money;
            Map = map ?? throw new ArgumentNullException(nameof(map));
            Progress = progress ?? throw new ArgumentNullException(nameof(progress));
            Shop = shop;
            NextInstanceId = nextInstanceId;
            _library = library;
            _typeLevels = typeLevels;
            _genes = genes;
            _consumables = consumables;
            _vouchers = vouchers;
            Blind = blind;
            Pending = pending ?? new RunPending();
            BossIntel = bossIntel;
            _interestBonus = interestBonus;
            _interestBonusSegment = interestBonusSegment;
            Library = library.AsReadOnly();
            TypeLevels = Array.AsReadOnly(typeLevels);
            Genes = genes.AsReadOnly();
            Consumables = consumables.AsReadOnly();
            Vouchers = vouchers.AsReadOnly();
        }

        /// <summary>
        /// 开新局:先生成地图(只消费 <c>map</c> 一条流一次),再按配置里默认方块库清单的顺序逐块取号建库。
        /// 种子文本须已规范(<see cref="SeedText"/>)。难度默认标准档,选难度的那一屏由表现层传入。
        /// </summary>
        public static RunState NewRun(string seed, RuleConfig config, RunDifficulty difficulty = RunDifficulty.Standard)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            var levels = new int[ClearTypes.Count];
            for (int i = 0; i < levels.Length; i++) levels[i] = 1;
            var rng = new RngStreams(seed);
            RunMap map = RunMap.Generate(rng.Get(RngKeys.Map), config.MapSegments);
            var run = new RunState(config, rng, difficulty, config.StartingMoney, map, new MapProgress(), null,
                1, new List<BlockInstance>(), levels, new List<GeneSlot>(), new List<int>(), new List<int>(), null,
                new RunPending(), false, 0, 0);
            foreach (LibraryEntry e in config.DefaultLibrary)
            {
                run._library.Add(new BlockInstance(run.IssueId(), e.Kind, e.Points, e.Enhancement, e.Edition));
            }
            return run;
        }

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):各字段原样接上,不查约束,读档随后调 <see cref="Validate"/>。</summary>
        internal static RunState Restore(RuleConfig config, RngStreams rng, RunDifficulty difficulty, int money, RunMap map,
            MapProgress progress, ShopState shop, int nextInstanceId, List<BlockInstance> library, int[] typeLevels,
            List<GeneSlot> genes, List<int> consumables, List<int> vouchers, BlindState blind, RunPending pending,
            bool bossIntel, int interestBonus, int interestBonusSegment) =>
            new RunState(config, rng, difficulty, money, map, progress, shop, nextInstanceId, library, typeLevels, genes,
                consumables, vouchers, blind, pending, bossIntel, interestBonus, interestBonusSegment);

        /// <summary>
        /// 唯一的取号口。方块库的块、首领预置块、将来「生成一块」的效果都从这里取,所以不能假设 id 都在方块库里。
        /// 只增不复用:碎裂、湮灭掉的 id 不回收。
        /// </summary>
        public int IssueId()
        {
            if (NextInstanceId == int.MaxValue) throw new InvalidOperationException("实例 id 用尽");
            return NextInstanceId++;
        }

        /// <summary>入账。金额为负抛异常:扣钱走 <see cref="TrySpend"/>,两条路分开,读代码的人不会把符号搞反。</summary>
        public void AddMoney(int amount)
        {
            if (amount < 0) throw new ArgumentOutOfRangeException(nameof(amount), amount, "入账金额不能为负");
            if (_money > int.MaxValue - amount) throw new InvalidOperationException("金钱溢出");
            _money += amount;
        }

        /// <summary>扣钱。钱不够返回 false 且不改状态;金额为负抛异常。</summary>
        public bool TrySpend(int amount)
        {
            if (amount < 0) throw new ArgumentOutOfRangeException(nameof(amount), amount, "扣款金额不能为负");
            if (amount > _money) return false;
            _money -= amount;
            return true;
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

        /// <summary>商店买基因用:槽满、或注册表里没有这张基因时返回 false 且不改状态。</summary>
        public bool TryAddGene(int geneId)
        {
            if (_genes.Count >= GeneSlots) return false;
            if (Config.Effects.Find(EffectSource.Gene, geneId) == null) return false;
            AddGene(geneId);
            return true;
        }

        /// <summary>道具栏放一件改造。栏满返回 false。</summary>
        public bool TryAddConsumable(int itemId)
        {
            if (itemId < 1) throw new ArgumentOutOfRangeException(nameof(itemId), itemId, "改造号从 1 起");
            if (_consumables.Count >= ConsumableSlots) return false;
            _consumables.Add(itemId);
            return true;
        }

        /// <summary>用掉或卖掉一件改造。没有这件时返回 false。</summary>
        public bool RemoveConsumable(int itemId) => _consumables.Remove(itemId);

        /// <summary>
        /// 买下一张优惠券:号不认、或已经持有时返回 false。启动券在买下的这一刻入账 $4,其余券的效果在
        /// <see cref="Modifiers"/> 里现算;券不占格。
        /// </summary>
        public bool TryAddVoucher(int voucherId)
        {
            if (!VoucherCatalog.IsKnown(voucherId)) return false;
            if (_vouchers.Contains(voucherId)) return false;
            _vouchers.Add(voucherId);
            if (voucherId == VoucherCatalog.StartMoney) AddMoney(4);
            return true;
        }

        public bool HasVoucher(int voucherId) => _vouchers.Contains(voucherId);

        /// <summary>科技升级一种消除类型。已经到表里最高级时返回 false。</summary>
        public bool UpgradeType(ClearType type)
        {
            int t = (int)type;
            if (t < 0 || t >= ClearTypes.Count) throw new ArgumentOutOfRangeException(nameof(type), type, "不是消除类型");
            if (_typeLevels[t] >= Config.ClearTypes.MaxLevel(type)) return false;
            _typeLevels[t]++;
            return true;
        }

        /// <summary>商店买方块:直接进方块库(加块 = 加预算)。返回新实例。</summary>
        public BlockInstance AddBlock(TetrominoKind kind, int points)
        {
            if (points < 0) throw new ArgumentOutOfRangeException(nameof(points), points, "点数不能为负");
            var block = new BlockInstance(IssueId(), kind, points, Enhancement.None, Edition.None);
            _library.Add(block);
            return block;
        }

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
            if (Shop != null) throw new InvalidOperationException("商店还开着,先离开商店");
            if (Blind != null && Blind.Outcome == BlindOutcome.InProgress) throw new InvalidOperationException("上一个盲注还没结束");
            var blind = new BlindState(spec);
            foreach (BlockInstance b in _library) blind.DrawList.Add(b.Id);
            blind.DrawList.Sort();
            Rng.Get(RngKeys.Shuffle(spec.Segment, spec.Layer)).Shuffle(blind.DrawList);
            Blind = blind;
            ApplyBossOnStart(blind);
            return StepPipeline.AfterBlindStart(this);
        }

        /// <summary>
        /// 开盲注时立刻生效的首领效果(设计稿 §7.2):紧缩拿掉抽牌堆末尾的几块、预置在盘上摆几块、死格标几格。
        /// 高墙 / 碎组 / 断弃已在 <see cref="SpecForCurrentNode"/> 折进规格;增殖与偏航在走步里生效。
        /// </summary>
        private void ApplyBossOnStart(BlindState blind)
        {
            int boss = blind.Spec.BossId;
            if (boss == Bosses.None) return;
            IRandomSource rng = Rng.Get(RngKeys.Boss(blind.Spec.Segment, blind.Spec.Layer));
            switch (boss)
            {
                case Bosses.Shrink:
                    int take = Math.Min(Bosses.ShrinkBlocks, blind.DrawList.Count);
                    for (int i = 0; i < take; i++)
                    {
                        int last = blind.DrawList.Count - 1;
                        blind.RemovedList.Add(blind.DrawList[last]);
                        blind.DrawList.RemoveAt(last);
                    }
                    blind.RemovedList.Sort();
                    break;
                case Bosses.Preset:
                    Bosses.SpawnBlocks(blind, rng, this, Bosses.PresetBlocks);
                    break;
                case Bosses.DeadCells:
                    Bosses.MarkDeadCells(blind, rng, Bosses.DeadCellCount);
                    break;
            }
        }

        /// <summary>发一组之后的首领效果:增殖盲在随机空格补一块。由步管线调用,不在规则核心外直接调。</summary>
        internal void ApplyBossOnDeal()
        {
            if (Blind == null || Blind.Outcome != BlindOutcome.InProgress) return;
            if (Blind.Spec.BossId != Bosses.Spawn) return;
            Bosses.SpawnBlocks(Blind, Rng.Get(RngKeys.Boss(Blind.Spec.Segment, Blind.Spec.Layer)), this, Bosses.SpawnPerDeal);
        }

        /// <summary>一步收尾后的首领效果:偏航盲每 4 步把盘面整体转 90°。由步管线调用。</summary>
        internal void ApplyBossOnStepEnd()
        {
            if (Blind == null || Blind.Outcome != BlindOutcome.InProgress) return;
            if (Blind.Spec.BossId != Bosses.Yaw) return;
            if (Blind.Step <= 0 || Blind.Step % Bosses.YawEverySteps != 0) return;
            Blind.Board.Rotate();
        }

        /// <summary>
        /// 进地图节点(局外循环设计稿 §2):只能进当前可选范围内的节点;进完要打完或跳过才算结算。
        /// 进节点即离开商店(货架作废);战斗与地图的接线由表现层按「进节点 → 开盲注」两步走。
        /// </summary>
        public bool EnterNode(int nodeId)
        {
            bool entered = Progress.Enter(Map, nodeId);
            if (entered) Shop = null;
            return entered;
        }

        /// <summary>
        /// 当前节点该打的那一场:目标分按节点的层×强度、难度、券与「轻敌」算,弃置按难度、券与「弃权」加减,
        /// 每组块数取默认加券。盲注那份待生效效果在开盲注时清掉(见 <see cref="SpecForCurrentNode"/> 的调用方)。
        /// </summary>
        public BlindSpec SpecForCurrentNode()
        {
            if (Progress.CurrentNodeId == 0) throw new InvalidOperationException("还没进节点");
            if (Progress.CurrentResolved) throw new InvalidOperationException("当前节点已结算");
            MapNode node = Map.Get(Progress.CurrentNodeId);
            int boss = node.BossId;
            int discards = Math.Max(0, Config.BaseDiscards + DifficultyRules.Of(Difficulty).DiscardDelta + Modifiers.DiscardBonus
                + Pending.BlindDiscards);
            int groupSize = Math.Min(BlindSpec.MaxGroupSize, Config.DefaultGroupSize + Modifiers.GroupSizeBonus);
            // 首领、券、轻敌三档并进一个千分值,只做一次四舍五入
            int extra = Modifiers.TargetPermille * Bosses.TargetPermille(boss) / 1000 * Pending.BlindTargetPermille / 1000;
            long target = RunTargets.For(node, Difficulty, Config, extra);
            return new BlindSpec(node.Segment, node.Layer, target, Bosses.Discards(discards, boss), Bosses.GroupSize(groupSize, boss), boss);
        }

        /// <summary>当前节点的首领(0 = 普通场);给表现层与「情报」标签预览用。</summary>
        public int CurrentBoss => Progress.CurrentNodeId == 0 ? Bosses.None : Map.Get(Progress.CurrentNodeId).BossId;

        /// <summary>开当前节点的盲注。上一个盲注还在进行时由 <see cref="StartBlind"/> 拦下;轻敌与弃权在这里用掉。</summary>
        public StepResult StartBlindForCurrentNode()
        {
            BlindSpec spec = SpecForCurrentNode();
            Pending.ClearBlind();
            return StartBlind(spec);
        }

        /// <summary>
        /// 结算之后开店;已经开着就返回同一个(界面来回切不再重掷)。前 3 场保底一个基因格。
        /// 节点没结算、整局已结束、或配置里没有目录时抛异常。
        /// </summary>
        public ShopState OpenShop()
        {
            if (Shop != null) return Shop;
            if (Progress.CurrentNodeId == 0 || !Progress.CurrentResolved) throw new InvalidOperationException("当前节点还没结算,不能开店");
            if (Progress.CurrentSkipped) throw new InvalidOperationException("跳过的节点不进商店");
            if (Progress.IsComplete(Map)) throw new InvalidOperationException("整局已结束,没有商店");
            MapNode node = Map.Get(Progress.CurrentNodeId);
            bool guaranteeGene = Progress.Visited.Count <= 3;
            Shop = ShopState.Open(Rng.Get(RngKeys.Shop(node.Segment, node.Layer)), this, guaranteeGene, node.Layer == 1,
                Pending.ShopDiscountPermille, Pending.ExtraShopGoods, Pending.FreeReroll, Pending.FreeBooster);
            Pending.ClearShop();
            return Shop;
        }

        /// <summary>
        /// 跳过当前可选的节点:不打、不拿通关奖励、不开店,换一个标签(设计稿 §2.3)。
        /// 节点不可跳(首领、第一段)或不在可选范围时返回 false,状态不动。
        /// </summary>
        public bool SkipNode(int nodeId)
        {
            if (nodeId < 1 || nodeId > Map.Nodes.Count) return false;
            MapNode node = Map.Get(nodeId);
            if (!node.CanSkip) return false;
            if (!Progress.Skip(Map, nodeId)) return false;
            Shop = null;
            ApplyTag(node.TagId);
            return true;
        }

        /// <summary>标签的效果(设计稿 §7.1):四种当场结清,四种改下一次商店,两种改下一个盲注,一个开情报。</summary>
        private void ApplyTag(int tagId)
        {
            IRandomSource rng = Rng.Get(RngKeys.Tag);
            switch (tagId)
            {
                case Tags.Cash:
                    AddMoney(6);
                    break;
                case Tags.Tech:
                    if (!GrantRandomTech(rng)) AddMoney(3);
                    break;
                case Tags.Mod:
                    if (!GrantRandomMod(rng)) AddMoney(3);
                    break;
                case Tags.Blocks:
                    if (!GrantRandomBlocks(rng)) AddMoney(3);
                    break;
                case Tags.Discount:
                    Pending.ShopDiscountPermille = Tags.DiscountPermille;
                    break;
                case Tags.ExtraGoods:
                    Pending.ExtraShopGoods += 1;
                    break;
                case Tags.FireSale:
                    Pending.FreeReroll = true;
                    break;
                case Tags.Supply:
                    Pending.FreeBooster = true;
                    break;
                case Tags.LightTarget:
                    Pending.BlindTargetPermille = Tags.LightTargetPermille;
                    break;
                case Tags.ExtraDiscards:
                    Pending.BlindDiscards += Tags.ExtraDiscardCount;
                    break;
                case Tags.InterestCap:
                    _interestBonus = Tags.InterestCapBonus;
                    _interestBonusSegment = CurrentSegment;
                    break;
                case Tags.Intel:
                    BossIntel = true;
                    break;
            }
        }

        private bool GrantRandomTech(IRandomSource rng)
        {
            var candidates = new List<ClearType>(ClearTypes.Count);
            for (int t = 0; t < ClearTypes.Count; t++)
            {
                ClearType type = (ClearType)t;
                if (_typeLevels[t] < Config.ClearTypes.MaxLevel(type)) candidates.Add(type);
            }
            if (candidates.Count == 0) return false;
            UpgradeType(candidates[rng.Index(candidates.Count)]);
            return true;
        }

        private bool GrantRandomMod(IRandomSource rng)
        {
            if (Config.Catalog.Mods.Count == 0) return false;
            int id = Config.Catalog.Mods[rng.Index(Config.Catalog.Mods.Count)].Id;
            return TryAddConsumable(id);
        }

        private bool GrantRandomBlocks(IRandomSource rng)
        {
            if (Config.Catalog.Blocks.Count == 0) return false;
            for (int i = 0; i < 3; i++)
            {
                BlockEntry entry = Config.Catalog.Blocks[rng.Index(Config.Catalog.Blocks.Count)];
                AddBlock(entry.Kind, entry.Points);
            }
            return true;
        }

        /// <summary>
        /// 结算一场打赢的盲注:按当前节点算通关奖励与利息,入账,并把地图进度推到「已结算」。
        /// 盲注没赢、当前节点没有待结算的盲注、或盲注与节点不是同一关时抛异常(调用方按事件流走,不该出现)。
        /// </summary>
        public Settlement SettleBlind()
        {
            if (Blind == null) throw new InvalidOperationException("没有盲注可结算");
            if (Blind.Outcome != BlindOutcome.Won) throw new InvalidOperationException("盲注没有赢,不能结算");
            if (Progress.CurrentNodeId == 0 || Progress.CurrentResolved) throw new InvalidOperationException("当前节点没有待结算的盲注");
            MapNode node = Map.Get(Progress.CurrentNodeId);
            if (Blind.Spec.Segment != node.Segment || Blind.Spec.Layer != node.Layer)
            {
                throw new InvalidOperationException("盲注与当前节点不是同一关");
            }
            int interestCap = DifficultyRules.Of(Difficulty).InterestCap + Modifiers.InterestCapBonus + SegmentInterestCapBonus;
            Settlement settlement = RunEconomy.Settle(node, _money, Config.InterestPer, interestCap);
            AddMoney(settlement.Total);
            Progress.Resolve();
            return new Settlement(node.Id, settlement.Reward, settlement.Interest, _money);
        }

        /// <summary>
        /// 结算完离开这一场:盲注对象丢掉,回到「两个盲注之间」(地图、商店、结算屏之间都能存档)。
        /// 盲注还在进行时调用是流程错误:先判胜负再离场。
        /// </summary>
        public void LeaveBlind()
        {
            if (Blind == null) return;
            if (Blind.Outcome == BlindOutcome.InProgress) throw new InvalidOperationException("盲注还没结束,不能离场");
            Blind = null;
        }

        /// <summary>关店:货架作废,下一步回地图。</summary>
        public void CloseShop() => Shop = null;

        /// <summary>本店那条随机流(刷新货格、开补给包都消费它);没进节点时抛异常。</summary>
        public IRandomSource ShopRng()
        {
            if (Progress.CurrentNodeId == 0) throw new InvalidOperationException("还没进节点");
            MapNode node = Map.Get(Progress.CurrentNodeId);
            return Rng.Get(RngKeys.Shop(node.Segment, node.Layer));
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
            return new RunState(Config, Rng.Clone(), Difficulty, _money, Map, Progress.Clone(), Shop?.Clone(), NextInstanceId,
                library, (int[])_typeLevels.Clone(), genes, new List<int>(_consumables), new List<int>(_vouchers), Blind?.Clone(),
                Pending.Clone(), BossIntel, _interestBonus, _interestBonusSegment);
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
            if (!Enum.IsDefined(typeof(RunDifficulty), Difficulty)) return Invariant($"difficulty: 未定义的值 {(int)Difficulty}");
            if (_money < 0) return Invariant($"money: {_money} 为负");
            string pendingError = Pending.Validate();
            if (pendingError != null) return pendingError;
            if (_interestBonus < 0) return Invariant($"interestBonus: {_interestBonus} 为负");
            if (_interestBonusSegment < 0) return Invariant($"interestBonusSegment: {_interestBonusSegment} 为负");
            string mapError = Map.Validate();
            if (mapError != null) return mapError;
            string progressError = Progress.Validate(Map);
            if (progressError != null) return "map: " + progressError;
            if (Shop != null)
            {
                if (Shop.Count < ShopState.GoodsCount || Shop.Count > ShopState.MaxGoodsCount)
                {
                    return Invariant($"shop.goods: 应有 {ShopState.GoodsCount}..{ShopState.MaxGoodsCount} 格,实有 {Shop.Count}");
                }
                if (Shop.Rerolls < 0) return Invariant($"shop.rerolls: {Shop.Rerolls} 为负");
                if (!Progress.CurrentResolved) return "shop: 当前节点还没结算就开着商店";
                foreach (ShopOffer offer in Shop.Goods)
                {
                    if (offer.Price < 0) return Invariant($"shop.goods: 价格 {offer.Price} 为负");
                    if (!Enum.IsDefined(typeof(ItemKind), offer.Kind)) return Invariant($"shop.goods: 未定义的种类 {(int)offer.Kind}");
                }
            }

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
            if (_genes.Count > GeneSlots) return Invariant($"genes: 有 {_genes.Count} 张,基因槽只有 {GeneSlots} 格");
            if (_consumables.Count > ConsumableSlots)
            {
                return Invariant($"consumables: 有 {_consumables.Count} 件,道具栏只有 {ConsumableSlots} 格");
            }
            for (int i = 0; i < _consumables.Count; i++)
            {
                if (_consumables[i] < 1) return Invariant($"consumables[{i}]: {_consumables[i]} 不是有效的改造号");
            }
            for (int i = 0; i < _vouchers.Count; i++)
            {
                if (!VoucherCatalog.IsKnown(_vouchers[i])) return Invariant($"vouchers[{i}]: {_vouchers[i]} 不是有效的券号");
                if (_vouchers.IndexOf(_vouchers[i]) != i) return Invariant($"vouchers[{i}]: 券 {_vouchers[i]} 重复");
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

            // 区守恒只管进行中的盲注:打完之后方块库还能加块(商店买方块),那些新块不在这一场的任何区里。
            // 打过的盲注冻结在结算那一刻,不再参与守恒,读档照原样接上。
            if (Blind.Outcome != BlindOutcome.InProgress) return null;

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
            err = ClaimAll(zoneOf, Blind.RemovedList, "blind.removed");
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
