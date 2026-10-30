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
        private readonly List<ConsumableItem> _consumables;
        private readonly int[] _typeCounts;
        private readonly List<int> _vouchers;
        private readonly HashSet<int> _unlockedGenes;
        private int _money;
        private int _modsUsed;
        private int _techsUsedMask;
        private int _soldCount;
        private int _skipCount;
        private int _boostersOpened;
        private int _bossesBeaten;
        private int _sellBonus;
        private int _discardedCount;
        private int _lastPlaceRow = -1;
        private int _lastPlaceCol = -1;
        private int _destroyedCount;
        private ConsumableItem? _lastConsumable;

        /// <summary>赊账基因能让钱低到多少(规则 §4.1.1 G092 的 −$20)。</summary>
        public const int DebtLimit = 20;

        /// <summary>本局用过的改造张数(卜算基因读)。</summary>
        public int ModsUsed => _modsUsed;

        /// <summary>本局用过的科技:按科技号 − 1 的位掩码(星金读种数)。</summary>
        public int TechsUsedMask => _techsUsedMask;

        /// <summary>本局卖掉过几张东西(基因与消耗品都算)。</summary>
        public int SoldCount => _soldCount;

        /// <summary>本局跳过过几个节点(跳关基因读)。</summary>
        public int SkipCount => _skipCount;

        /// <summary>本局开过几个补给包(开包基因读)。</summary>
        public int BoostersOpened => _boostersOpened;

        /// <summary>本局已打过的首领数(升空基因读)。</summary>
        public int BossesBeaten => _bossesBeaten;

        /// <summary>全局卖价加成(增值基因每盲注结束给所有基因与道具栏 +$1)。</summary>
        public int SellBonus => _sellBonus;

        /// <summary>本局累计弃掉的块数(斋戒、回响读)。</summary>
        public int DiscardedCount => _discardedCount;

        /// <summary>上一次落子的包围盒左上角;还没落过为 -1(远投基因读)。</summary>
        public int LastPlaceRow => _lastPlaceRow;

        public int LastPlaceCol => _lastPlaceCol;

        /// <summary>本局湮灭掉的方块数(永续基因读)。</summary>
        public int DestroyedCount => _destroyedCount;

        /// <summary>记下这次落点(远投基因读上一次)。</summary>
        internal void RecordPlacement(int row, int col)
        {
            _lastPlaceRow = row;
            _lastPlaceCol = col;
        }

        /// <summary>上一次用掉的消耗品(摹写改造读);没用了为 null。</summary>
        public ConsumableItem? LastConsumable => _lastConsumable;

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

        /// <summary>
        /// 本局每种消除类型打出过几次,下标 = (int)<see cref="ClearType"/>。科技软锁看它(规则 §4.2:打出过一次才进池)。
        /// </summary>
        public IReadOnlyList<int> TypeCounts { get; }

        /// <summary>基因栏,从左到右;顺序就是结算顺序(规则 §4.1),可经 <see cref="MoveGene"/> 换位。</summary>
        public IReadOnlyList<GeneSlot> Genes { get; }

        /// <summary>道具栏里的消耗品(科技、改造),按放进来的先后;经 <see cref="UseConsumable"/> 用掉。</summary>
        public IReadOnlyList<ConsumableItem> Consumables { get; }

        /// <summary>本局已经买下的优惠券(号),按买下的次序。</summary>
        public IReadOnlyList<int> Vouchers { get; }

        /// <summary>券带来的参数修正;每次都从券列表现算。</summary>
        public RunModifiers Modifiers => RunModifiers.From(_vouchers);

        // ── 基因的 C 类开关与 B 类参数(效果系统 §3.2、§3.3):每次用到时从持有的基因现算,不进存档 ──

        /// <summary>任一持有基因满足这个开关。</summary>
        private bool AnyGene(Func<RuleEffect, bool> pred)
        {
            foreach (GeneSlot g in _genes)
            {
                RuleEffect e = Config.Effects.Find(EffectSource.Gene, g.GeneId);
                if (e != null && pred(e)) return true;
            }
            return false;
        }

        private int SumGene(Func<RuleEffect, int> value)
        {
            int sum = 0;
            foreach (GeneSlot g in _genes)
            {
                RuleEffect e = Config.Effects.Find(EffectSource.Gene, g.GeneId);
                if (e != null) sum += value(e);
            }
            return sum;
        }

        private int MaxGene(Func<RuleEffect, int> value)
        {
            int max = 0;
            foreach (GeneSlot g in _genes)
            {
                RuleEffect e = Config.Effects.Find(EffectSource.Gene, g.GeneId);
                if (e != null) max = Math.Max(max, value(e));
            }
            return max;
        }

        /// <summary>镜合:同形态判定里 S/Z、J/L 各算一种。</summary>
        public bool MirrorSameShape => AnyGene(e => e.MirrorSameShape);

        /// <summary>转码:被消格的点数改成倍率。</summary>
        public bool PointsToMult => AnyGene(e => e.PointsToMult);

        /// <summary>保连:每个盲注一次,没消除时连击不清零。</summary>
        public bool ComboShield => AnyGene(e => e.ComboShield);

        /// <summary>赊账:钱可以花到 −<see cref="DebtLimit"/>。</summary>
        public bool AllowDebt => AnyGene(e => e.AllowDebt);

        /// <summary>重现:商店与补给包里可以出现已持有的基因。</summary>
        public bool ShopOffersOwned => AnyGene(e => e.ShopOffersOwned);

        /// <summary>赦免:首领盲注的负面效果失效。</summary>
        public bool BossDisabled => AnyGene(e => e.DisablesBoss);

        /// <summary>利息门槛:复利基因改成每 $5 给 $1。</summary>
        public int InterestPer
        {
            get
            {
                int per = MaxGene(e => e.InterestPer);
                return per > 0 ? per : Config.InterestPer;
            }
        }

        /// <summary>利息封顶的千分比(囤金 = 2000)。</summary>
        public int InterestCapPermille
        {
            get
            {
                int cap = MaxGene(e => e.InterestCapPermille);
                return cap > 0 ? cap : 1000;
            }
        }

        /// <summary>方块货的价格增量(选块 = −1,不低于 0)。</summary>
        public int BlockPriceDelta => SumGene(e => e.BlockPriceDelta);

        /// <summary>商店里的科技与科技补给包免费。</summary>
        public bool TechFree => AnyGene(e => e.FreeTechs);

        /// <summary>琉璃碎裂概率的分母(坚璃翻倍)。</summary>
        public int GlassShatterDen => CoreEffects.GlassShatterDen * Math.Max(1, MaxGene(e => e.GlassShatterDenMultiplier));

        /// <summary>被消格的计点倍率(倍点 = 2)。</summary>
        public int PointsMultiplier => Math.Max(1, MaxGene(e => e.PointsMultiplier));

        /// <summary>基因段结束后要不要把两个累加器取平均(均衡)。</summary>
        public bool BalancesAccumulators => AnyGene(e => e.BalancesAccumulators);

        /// <summary>免死:得分 ≥ 目标分 1/4 时把这次判负改判通关,湮灭那张基因;没有可救的返回 -1,否则返回被湮灭的基因号。</summary>
        internal int TryRescueBlind()
        {
            if (Blind == null || Blind.Score * 4 < Blind.Spec.Target) return -1;
            for (int slot = 0; slot < _genes.Count; slot++)
            {
                RuleEffect e = Config.Effects.Find(EffectSource.Gene, _genes[slot].GeneId);
                if (e == null || !e.RescuesBlind) continue;
                int geneId = _genes[slot].GeneId;
                _genes.RemoveAt(slot);
                return geneId;
            }
            return -1;
        }

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

        /// <summary>基因槽总数 = 配置默认 + 扩槽券,最多 <see cref="MaxGeneSlots"/>(规则 §4.1)。</summary>
        public int GeneSlots => Math.Min(MaxGeneSlots, Config.GeneSlots + Modifiers.GeneSlotBonus);

        /// <summary>基因槽的上限(规则 §4.1:默认 4、最多 6);负片基因不占槽,不受它限。</summary>
        public const int MaxGeneSlots = 6;

        /// <summary>占着槽的基因数:负片不算(规则 §4.1)。</summary>
        public int GeneSlotsUsed
        {
            get
            {
                int used = 0;
                foreach (GeneSlot g in _genes)
                {
                    if (g.Edition != Edition.Negative) used++;
                }
                return used;
            }
        }

        /// <summary>道具栏格数 = 配置默认 + 扩容券。</summary>
        public int ConsumableSlots => Config.ConsumableSlots + Modifiers.ConsumableSlotBonus;

        /// <summary>当前盲注;开局后、开第一个盲注前为 null。</summary>
        public BlindState Blind { get; private set; }

        IBlindView IRunView.Blind => Blind;

        private RunState(RuleConfig config, RngStreams rng, RunDifficulty difficulty, int money, RunMap map, MapProgress progress,
            ShopState shop, int nextInstanceId, List<BlockInstance> library, int[] typeLevels, int[] typeCounts, List<GeneSlot> genes,
            List<ConsumableItem> consumables, List<int> vouchers, BlindState blind, RunPending pending, bool bossIntel,
            int interestBonus, int interestBonusSegment, int modsUsed = 0, int techsUsedMask = 0, int soldCount = 0,
            int skipCount = 0, int boostersOpened = 0, int bossesBeaten = 0, int sellBonus = 0, ConsumableItem? lastConsumable = null,
            int discardedCount = 0, int lastPlaceRow = -1, int lastPlaceCol = -1, int destroyedCount = 0,
            IReadOnlyCollection<int> unlockedGenes = null)
        {
            Config = config ?? throw new ArgumentNullException(nameof(config));
            _unlockedGenes = unlockedGenes == null ? null : new HashSet<int>(unlockedGenes);
            Rng = rng;
            Difficulty = difficulty;
            _money = money;
            _modsUsed = modsUsed;
            _techsUsedMask = techsUsedMask;
            _soldCount = soldCount;
            _skipCount = skipCount;
            _boostersOpened = boostersOpened;
            _bossesBeaten = bossesBeaten;
            _sellBonus = sellBonus;
            _discardedCount = discardedCount;
            _lastPlaceRow = lastPlaceRow;
            _lastPlaceCol = lastPlaceCol;
            _destroyedCount = destroyedCount;
            _lastConsumable = lastConsumable;
            Map = map ?? throw new ArgumentNullException(nameof(map));
            Progress = progress ?? throw new ArgumentNullException(nameof(progress));
            Shop = shop;
            NextInstanceId = nextInstanceId;
            _library = library;
            _typeLevels = typeLevels;
            _typeCounts = typeCounts;
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
            TypeCounts = Array.AsReadOnly(typeCounts);
            Genes = genes.AsReadOnly();
            Consumables = consumables.AsReadOnly();
            Vouchers = vouchers.AsReadOnly();
        }

        /// <summary>
        /// 开新局:先生成地图(只消费 <c>map</c> 一条流一次),再按配置里默认方块库清单的顺序逐块取号建库。
        /// 种子文本须已规范(<see cref="SeedText"/>)。难度默认标准档,选难度的那一屏由表现层传入。
        /// </summary>
        public static RunState NewRun(string seed, RuleConfig config, RunDifficulty difficulty = RunDifficulty.Standard,
            IReadOnlyCollection<int> unlockedGenes = null)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            var levels = new int[ClearTypes.Count];
            for (int i = 0; i < levels.Length; i++) levels[i] = 1;
            var rng = new RngStreams(seed);
            RunMap map = RunMap.Generate(rng.Get(RngKeys.Map), config.MapSegments);
            var run = new RunState(config, rng, difficulty, config.StartingMoney, map, new MapProgress(), null,
                1, new List<BlockInstance>(), levels, new int[ClearTypes.Count], new List<GeneSlot>(), new List<ConsumableItem>(),
                new List<int>(), null, new RunPending(), false, 0, 0, unlockedGenes: unlockedGenes);
            foreach (LibraryEntry e in config.DefaultLibrary)
            {
                run._library.Add(new BlockInstance(run.IssueId(), e.Kind, e.Points, e.Enhancement, e.Edition));
            }
            return run;
        }

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):各字段原样接上,不查约束,读档随后调 <see cref="Validate"/>。</summary>
        internal static RunState Restore(RuleConfig config, RngStreams rng, RunDifficulty difficulty, int money, RunMap map,
            MapProgress progress, ShopState shop, int nextInstanceId, List<BlockInstance> library, int[] typeLevels, int[] typeCounts,
            List<GeneSlot> genes, List<ConsumableItem> consumables, List<int> vouchers, BlindState blind, RunPending pending,
            bool bossIntel, int interestBonus, int interestBonusSegment, int modsUsed = 0, int techsUsedMask = 0,
            int soldCount = 0, int skipCount = 0, int boostersOpened = 0, int bossesBeaten = 0, int sellBonus = 0,
            ConsumableItem? lastConsumable = null, int discardedCount = 0, int lastPlaceRow = -1, int lastPlaceCol = -1,
            int destroyedCount = 0, IReadOnlyCollection<int> unlockedGenes = null) =>
            new RunState(config, rng, difficulty, money, map, progress, shop, nextInstanceId, library, typeLevels, typeCounts, genes,
                consumables, vouchers, blind, pending, bossIntel, interestBonus, interestBonusSegment, modsUsed, techsUsedMask,
                soldCount, skipCount, boostersOpened, bossesBeaten, sellBonus, lastConsumable, discardedCount, lastPlaceRow, lastPlaceCol,
                destroyedCount, unlockedGenes);

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

        /// <summary>扣钱。钱不够(赊账基因允许低到 −<see cref="DebtLimit"/>)返回 false 且不改状态;金额为负抛异常。</summary>
        public bool TrySpend(int amount)
        {
            if (amount < 0) throw new ArgumentOutOfRangeException(nameof(amount), amount, "扣款金额不能为负");
            int floor = AllowDebt ? -DebtLimit : 0;
            if (_money - amount < floor) return false;
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
        /// 在基因栏最右边加一格,不查槽数(单测与 <see cref="TryAddGene"/> 用)。基因带「目标分 +X%」代价的,
        /// 拿到这一刻记下待生效,下一个盲注兑现(规则 §4.1)。
        /// </summary>
        public void AddGene(int geneId, Edition edition = Edition.None)
        {
            RuleEffect effect = Config.Effects.Find(EffectSource.Gene, geneId);
            _genes.Add(new GeneSlot(geneId, edition, 0, effect != null && effect.CostTargetPermille > 0));
        }

        /// <summary>这张基因这一局进不进池:元进程没解锁的不进商店、不进补给包(<see cref="MetaUnlocks"/>)。</summary>
        public bool IsGeneUnlocked(int geneId) => _unlockedGenes == null || _unlockedGenes.Contains(geneId);

        /// <summary>已解锁的基因位;全解锁或旧档为 null。<see cref="RunSnapshot"/> 不存它,读档由外部重新给。</summary>
        public IReadOnlyCollection<int> UnlockedGenes => _unlockedGenes;

        /// <summary>这张基因现在放得进基因栏吗:注册表里有,且槽没满(负片不占槽)。</summary>
        public bool CanTakeGene(int geneId, Edition edition = Edition.None)
        {
            if (Config.Effects.Find(EffectSource.Gene, geneId) == null) return false;
            if (!IsGeneUnlocked(geneId)) return false;
            return edition == Edition.Negative || GeneSlotsUsed < GeneSlots;
        }

        /// <summary>商店买基因、开包选基因用:放不进时返回 false 且不改状态。</summary>
        public bool TryAddGene(int geneId, Edition edition = Edition.None)
        {
            if (!CanTakeGene(geneId, edition)) return false;
            AddGene(geneId, edition);
            return true;
        }

        /// <summary>
        /// 基因换位(规则 §4.1:可以拖动换位,位置决定 ×倍率放大哪些加成):把 from 那一格挪到 to,其余顺次让开。
        /// 不算步、不碰随机流;越界返回 false。
        /// </summary>
        public bool MoveGene(int from, int to)
        {
            if (from < 0 || from >= _genes.Count || to < 0 || to >= _genes.Count) return false;
            if (from == to) return true;
            GeneSlot g = _genes[from];
            _genes.RemoveAt(from);
            _genes.Insert(to, g);
            return true;
        }

        /// <summary>卖掉基因栏第 slot 格,按 <see cref="SellPriceOf(GeneSlot)"/> 入账,返回卖得的钱;越界返回 -1。</summary>
        public int SellGene(int slot)
        {
            if (slot < 0 || slot >= _genes.Count) return -1;
            GeneSlot g = _genes[slot];
            int price = SellPriceOf(g);
            _genes.RemoveAt(slot);
            AddMoney(price);
            _soldCount++;
            StepPipeline.AfterSold(this, ItemKind.Gene, g.GeneId, slot, true);
            return price;
        }

        /// <summary>卖掉道具栏第 index 件,返回卖得的钱;越界返回 -1。</summary>
        public int SellConsumable(int index)
        {
            if (index < 0 || index >= _consumables.Count) return -1;
            ConsumableItem item = _consumables[index];
            int price = SellPriceOf(item.Kind, item.Id, Edition.None);
            _consumables.RemoveAt(index);
            AddMoney(price);
            _soldCount++;
            StepPipeline.AfterSold(this, item.Kind, item.Id, -1, false);
            return price;
        }

        /// <summary>卖一张基因的实价:目录价折半(回收券 75%)再加这张基因自己的与全局的卖价加成,至少 $1。</summary>
        public int SellPriceOf(GeneSlot gene)
        {
            if (gene == null) throw new ArgumentNullException(nameof(gene));
            return SellPriceOf(ItemKind.Gene, gene.GeneId, gene.Edition) + Math.Max(0, gene.SellBonus + _sellBonus);
        }

        /// <summary>
        /// 卖价(局外循环设计稿 §3.1、§4.2):按难度折过的基础价加版本附加费,取 50%(回收券 75%),向下取整,至少 $1。
        /// 目录里没有的东西按基础价 0 算。卖价只按目录现算,不进存档。
        /// </summary>
        public int SellPriceOf(ItemKind kind, int id, Edition edition)
        {
            CatalogEntry? entry = Config.Catalog.Find(kind, id);
            int basePrice = entry.HasValue ? entry.Value.Price : 0;
            int price = ShopState.PriceFor(basePrice + ShopState.EditionSurcharge(edition), Difficulty, RunPending.PermilleOne, Config.Tuning);
            return Math.Max(1, price * Modifiers.SellPermille / 1000);
        }

        /// <summary>道具栏放一件消耗品(科技或改造)。栏满返回 false。</summary>
        public bool TryAddConsumable(ConsumableItem item)
        {
            if (item.Kind != ItemKind.Tech && item.Kind != ItemKind.Mod)
            {
                throw new ArgumentOutOfRangeException(nameof(item), item.Kind, "道具栏只放科技与改造");
            }
            if (item.Id < 1) throw new ArgumentOutOfRangeException(nameof(item), item.Id, "号从 1 起");
            if (_consumables.Count >= ConsumableSlots) return false;
            _consumables.Add(item);
            return true;
        }

        /// <summary>
        /// 用道具栏第 index 件(规则 §4.2、§4.3)。科技随时可用;改造要目标的,target 是块的实例 id 或基因槽位(<see cref="ModCatalog.TargetOf"/>)。
        /// 盲注里用:改块只改块本身;删块后待放置区空了就补发一组、再判一次负(不算一步,不走步收尾)。
        /// 盲注已分出胜负时不能用。被拒时状态一点不改。
        /// </summary>
        public UseResult UseConsumable(int index, int target = 0) => UseConsumable(index, target, 0);

        /// <summary>
        /// 用道具栏第 index 件(规则 §4.2、§4.3)。科技随时可用;改造要目标的,target 是块的实例 id 或基因槽位
        /// (<see cref="ModCatalog.TargetOf"/>),双块改造的 secondTarget 是目标块(先来源后目标)。
        /// 盲注里用:改块只改块本身;删块后待放置区空了就补发一组、再判一次负(不算一步,不走步收尾)。
        /// 盲注已分出胜负时不能用。被拒时状态一点不改。
        /// </summary>
        public UseResult UseConsumable(int index, int target, int secondTarget)
        {
            if (index < 0 || index >= _consumables.Count) return UseResult.Rejected(UseReject.NoSuchItem);
            if (Blind != null && Blind.Outcome != BlindOutcome.InProgress) return UseResult.Rejected(UseReject.NotUsable);
            ConsumableItem item = _consumables[index];
            var events = new List<RuleEvent>();
            if (item.Kind == ItemKind.Tech)
            {
                ClearType type = Config.Catalog.TechTypeOf(item.Id);
                if (_typeLevels[(int)type] >= Config.ClearTypes.MaxLevel(type)) return UseResult.Rejected(UseReject.NotUsable);
                _consumables.RemoveAt(index);
                UpgradeType(type);
                _techsUsedMask |= 1 << (item.Id - 1);
                _lastConsumable = item;
                events.Add(new ConsumableUsed(item.Kind, item.Id, 0, true));
                StepPipeline.AfterConsumableUsed(this, item, events);
                return UseResult.Done(events);
            }

            int mod = item.Id;
            ModTarget need = ModCatalog.TargetOf(mod);
            BlockInstance source = null, destination = null;
            switch (need)
            {
                case ModTarget.Block:
                    if (FindUsableBlock(target) == null) return UseResult.Rejected(UseReject.BadTarget);
                    break;
                case ModTarget.BoardBlock:
                    if (FindBoardBlock(target) == null) return UseResult.Rejected(UseReject.BadTarget);
                    break;
                case ModTarget.Gene:
                    if (target < 0 || target >= _genes.Count || _genes[target].Edition != Edition.None)
                    {
                        return UseResult.Rejected(UseReject.BadTarget);
                    }
                    break;
                case ModTarget.TwoBlocks:
                    source = FindUsableBlock(target);
                    destination = FindUsableBlock(secondTarget);
                    if (source == null || destination == null || source.Id == destination.Id) return UseResult.Rejected(UseReject.BadTarget);
                    break;
            }
            if (mod == ModCatalog.MakeTech && UnlockedTechs().Count == 0) return UseResult.Rejected(UseReject.NotUsable);
            if (mod == ModCatalog.MakeLast && (_lastConsumable == null || _lastConsumable.Value.Id == ModCatalog.MakeLast && _lastConsumable.Value.Kind == ItemKind.Mod))
            {
                return UseResult.Rejected(UseReject.NotUsable);
            }
            if (mod == ModCatalog.MakeGene && !HasFreeGeneSlot()) return UseResult.Rejected(UseReject.NotUsable);
            if (mod == ModCatalog.MakeAllPoints && (Blind == null || Blind.IsTrayEmpty)) return UseResult.Rejected(UseReject.NotUsable);

            _consumables.RemoveAt(index);
            bool succeeded = true;
            switch (mod)
            {
                case ModCatalog.Glass:
                case ModCatalog.Steel:
                case ModCatalog.Gold:
                case ModCatalog.Wild:
                    FindUsableBlock(target).Enhancement = ModCatalog.EnhancementOf(mod);
                    break;
                case ModCatalog.Points:
                    FindUsableBlock(target).Points += ModCatalog.PointsBonus;
                    break;
                case ModCatalog.MakeAllPoints:
                    foreach (TraySlot slot in Blind.TraySlots)
                    {
                        if (!slot.IsEmpty) FindInstance(slot.Id).Points++;
                    }
                    break;
                case ModCatalog.ToO:
                case ModCatalog.ToI:
                case ModCatalog.ToT:
                    FindUsableBlock(target).Kind = ModCatalog.ShapeOf(mod).Value;
                    break;
                case ModCatalog.Mirror:
                    {
                        BlockInstance block = FindUsableBlock(target);
                        block.Kind = block.Kind == TetrominoKind.S ? TetrominoKind.Z
                            : block.Kind == TetrominoKind.Z ? TetrominoKind.S
                            : block.Kind == TetrominoKind.J ? TetrominoKind.L
                            : block.Kind == TetrominoKind.L ? TetrominoKind.J
                            : block.Kind;
                        break;
                    }
                case ModCatalog.Twin:
                    destination.Kind = source.Kind;
                    destination.Points = source.Points;
                    destination.Enhancement = source.Enhancement;
                    destination.Edition = source.Edition;
                    break;
                case ModCatalog.Devour:
                    destination.Points += source.Points;
                    events.Add(new ConsumableUsed(item.Kind, mod, target, true));
                    StepPipeline.Destroy(this, source.Id, events);
                    _modsUsed++;
                    _lastConsumable = item;
                    StepPipeline.AfterConsumableUsed(this, item, events);
                    StepPipeline.AfterConsumable(this, events);
                    return UseResult.Done(events);
                case ModCatalog.Dismantle:
                    {
                        BlockInstance block = FindBoardBlock(target);
                        int[] cells = new int[BoardCells.Count];
                        int n = 0;
                        for (int cell = 0; cell < BoardCells.Count; cell++)
                        {
                            if (Blind.Board.OwnerAt(cell) != block.Id) continue;
                            Blind.Board.ClearCell(cell);
                            cells[n++] = cell;
                        }
                        var cleared = new int[n];
                        Array.Copy(cells, cleared, n);
                        Blind.DepartedList.Add(block.Id);
                        Blind.DepartedList.Sort();
                        events.Add(new BlockDestroyed(block.Id, cleared));
                        break;
                    }
                case ModCatalog.Destroy:
                case ModCatalog.Tilt:
                    events.Add(new ConsumableUsed(item.Kind, mod, target, true));
                    StepPipeline.Destroy(this, target, events);
                    if (mod == ModCatalog.Tilt) GrantRandomMods(1);
                    _modsUsed++;
                    _lastConsumable = item;
                    StepPipeline.AfterConsumableUsed(this, item, events);
                    StepPipeline.AfterConsumable(this, events);
                    return UseResult.Done(events);
                case ModCatalog.DoubleMoney:
                    AddMoney(Math.Min(Math.Max(0, _money), ModCatalog.DoubleMoneyCap));
                    break;
                case ModCatalog.Tribute:
                    {
                        int total = 0;
                        foreach (GeneSlot g in _genes) total += SellPriceOf(g);
                        AddMoney(Math.Min(total, ModCatalog.TributeCap));
                        break;
                    }
                case ModCatalog.MakeTech:
                    GrantRandomTechs(2);
                    break;
                case ModCatalog.MakeMods:
                    GrantRandomMods(2);
                    break;
                case ModCatalog.MakeLast:
                    if (_lastConsumable != null) _consumables.Add(_lastConsumable.Value);
                    break;
                case ModCatalog.MakeGene:
                    {
                        var pool = new List<CatalogEntry>();
                        foreach (CatalogEntry e in Config.Catalog.Genes)
                        {
                            if (e.Rarity != Rarity.Legendary) pool.Add(e);
                        }
                        if (pool.Count > 0) TryAddGene(pool[Rng.Get(RngKeys.Mod).Index(pool.Count)].Id);
                        break;
                    }
                case ModCatalog.GeneEdition:
                    IRandomSource rng = Rng.Get(RngKeys.Mod);
                    succeeded = rng.Chance(1, ModCatalog.EditionChanceDen);
                    if (succeeded) _genes[target].Edition = (Edition)(1 + rng.Index(3));
                    break;
            }
            events.Add(new ConsumableUsed(item.Kind, mod, ModCatalog.TargetOf(mod) == ModTarget.None ? 0 : target, succeeded));
            _modsUsed++;
            _lastConsumable = item;
            StepPipeline.AfterConsumableUsed(this, item, events);
            return UseResult.Done(events);
        }

        /// <summary>还有不占槽的基因位吗(负片不算占槽)。</summary>
        public bool HasFreeGeneSlot() => GeneSlotsUsed < GeneSlots;

        /// <summary>给 n 张随机改造,放得下几张给几张。</summary>
        private void GrantRandomMods(int n)
        {
            if (Config.Catalog.Mods.Count == 0) return;
            IRandomSource rng = Rng.Get(RngKeys.Mod);
            for (int i = 0; i < n; i++)
            {
                int id = Config.Catalog.Mods[rng.Index(Config.Catalog.Mods.Count)].Id;
                if (!TryAddConsumable(ConsumableItem.Mod(id))) return;
            }
        }

        /// <summary>给 n 张已解锁的随机科技,放得下几张给几张;尽量不重复。</summary>
        private void GrantRandomTechs(int n)
        {
            List<int> techs = UnlockedTechs();
            if (techs.Count == 0) return;
            IRandomSource rng = Rng.Get(RngKeys.Mod);
            var picked = new List<int>();
            for (int i = 0; i < n && picked.Count < techs.Count; i++)
            {
                int at = rng.Index(techs.Count);
                for (int guard = 0; guard < techs.Count && picked.Contains(techs[at]); guard++)
                {
                    at = (at + 1) % techs.Count;
                }
                if (picked.Contains(techs[at])) break;
                picked.Add(techs[at]);
                if (!TryAddConsumable(ConsumableItem.Tech(techs[at]))) return;
            }
        }

        /// <summary>盘上的块;不在盘上返回 null(拆解只认盘上)。</summary>
        private BlockInstance FindBoardBlock(int instanceId)
        {
            if (instanceId <= 0 || Blind == null) return null;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (Blind.Board.OwnerAt(cell) != instanceId) continue;
                return FindInstance(instanceId);
            }
            return null;
        }

        /// <summary>改造能作用的块:盲注进行中是方块库与本盲注临时块里的,不在盲注里只认方块库里的。</summary>
        private BlockInstance FindUsableBlock(int instanceId)
        {
            if (instanceId <= 0) return null;
            if (Blind == null || Blind.Outcome != BlindOutcome.InProgress)
            {
                int at = LibraryIndexOf(instanceId);
                return at >= 0 ? _library[at] : null;
            }
            return FindInstance(instanceId);
        }

        /// <summary>已解锁(这一局打出过对应类型)且还没升到顶的科技号,按目录次序(规则 §4.2 的软锁)。</summary>
        public List<int> UnlockedTechs()
        {
            var list = new List<int>();
            foreach (CatalogEntry e in Config.Catalog.Techs)
            {
                ClearType type = Config.Catalog.TechTypeOf(e.Id);
                if (_typeCounts[(int)type] > 0 && _typeLevels[(int)type] < Config.ClearTypes.MaxLevel(type)) list.Add(e.Id);
            }
            return list;
        }

        /// <summary>这张科技过不过软锁:对应的消除类型本局打出过(规则 §4.2)。</summary>
        public bool IsTechUnlocked(int techId) => _typeCounts[(int)Config.Catalog.TechTypeOf(techId)] > 0;

        /// <summary>记一次打出的消除类型(段 #5)。</summary>
        internal void RecordClear(ClearType type)
        {
            int t = (int)type;
            if (_typeCounts[t] < int.MaxValue) _typeCounts[t]++;
            int[] blindCounts = Blind.TypeCountsArr;
            if (blindCounts[t] < int.MaxValue) blindCounts[t]++;
        }

        /// <summary>
        /// 湮灭一块(效果系统 §3.4 的 D 类):离开方块库或本盲注临时块,并从本盲注的抽牌堆、待放置区、弃置堆、消尽堆、拿掉区里去掉,
        /// 盘上剩下的格清掉。返回被清掉的格(升序);id 不在库里也不在临时块里返回 null。id 不回收。
        /// </summary>
        internal int[] DestroyInstance(int instanceId)
        {
            int at = LibraryIndexOf(instanceId);
            int temp = -1;
            if (at < 0 && Blind != null)
            {
                for (int i = 0; i < Blind.TempList.Count; i++)
                {
                    if (Blind.TempList[i].Id == instanceId) temp = i;
                }
            }
            if (at < 0 && temp < 0) return null;
            var cells = new List<int>();
            if (Blind != null)
            {
                for (int cell = 0; cell < BoardCells.Count; cell++)
                {
                    if (Blind.Board.OwnerAt(cell) != instanceId) continue;
                    Blind.Board.ClearCell(cell);
                    cells.Add(cell);
                }
                Blind.DrawList.Remove(instanceId);
                Blind.DiscardedList.Remove(instanceId);
                Blind.DepartedList.Remove(instanceId);
                Blind.RemovedList.Remove(instanceId);
                int slot = Blind.SlotOf(instanceId);
                if (slot >= 0) Blind.TraySlots[slot] = default;
                if (temp >= 0) Blind.TempList.RemoveAt(temp);
            }
            if (at >= 0) _library.RemoveAt(at);
            _destroyedCount++;
            return cells.ToArray();
        }

        /// <summary>方块库按 id 升序,二分查下标;不在库里返回 -1。</summary>
        private int LibraryIndexOf(int instanceId)
        {
            int lo = 0, hi = _library.Count - 1;
            while (lo <= hi)
            {
                int mid = lo + (hi - lo) / 2;
                int id = _library[mid].Id;
                if (id == instanceId) return mid;
                if (id < instanceId) lo = mid + 1;
                else hi = mid - 1;
            }
            return -1;
        }

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

        /// <summary>商店买方块:直接进方块库(加块 = 加预算)。返回新实例。负片只给基因。</summary>
        public BlockInstance AddBlock(TetrominoKind kind, int points, Enhancement enhancement = Enhancement.None, Edition edition = Edition.None)
        {
            if (points < 0) throw new ArgumentOutOfRangeException(nameof(points), points, "点数不能为负");
            if (edition == Edition.Negative) throw new ArgumentOutOfRangeException(nameof(edition), edition, "负片只给基因");
            var block = new BlockInstance(IssueId(), kind, points, enhancement, edition);
            _library.Add(block);
            return block;
        }

        /// <summary>按 id 找方块库或本盲注临时块里的实例,找不到返回 null。</summary>
        public BlockInstance FindInstance(int instanceId)
        {
            int at = LibraryIndexOf(instanceId);
            if (at >= 0) return _library[at];
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
                    int take = Math.Min(Config.Tuning.ShrinkBlocks, blind.DrawList.Count);
                    for (int i = 0; i < take; i++)
                    {
                        int last = blind.DrawList.Count - 1;
                        blind.RemovedList.Add(blind.DrawList[last]);
                        blind.DrawList.RemoveAt(last);
                    }
                    blind.RemovedList.Sort();
                    break;
                case Bosses.Preset:
                    Bosses.SpawnBlocks(blind, rng, this, Config.Tuning.PresetBlocks);
                    break;
                case Bosses.DeadCells:
                    Bosses.MarkDeadCells(blind, rng, Config.Tuning.DeadCellCount);
                    break;
            }
        }

        /// <summary>发一组之后的首领效果:增殖盲在随机空格补一块。由步管线调用,不在规则核心外直接调。</summary>
        internal void ApplyBossOnDeal()
        {
            if (Blind == null || Blind.Outcome != BlindOutcome.InProgress || Blind.BossSuppressed) return;
            if (Blind.Spec.BossId != Bosses.Spawn) return;
            Bosses.SpawnBlocks(Blind, Rng.Get(RngKeys.Boss(Blind.Spec.Segment, Blind.Spec.Layer)), this, Config.Tuning.SpawnPerDeal);
        }

        /// <summary>一步收尾后的首领效果:偏航盲每 4 步把盘面整体转 90°。由步管线调用。</summary>
        internal void ApplyBossOnStepEnd()
        {
            if (Blind == null || Blind.Outcome != BlindOutcome.InProgress || Blind.BossSuppressed) return;
            if (Blind.Spec.BossId != Bosses.Yaw) return;
            if (Blind.Step <= 0 || Blind.Step % Config.Tuning.YawEverySteps != 0) return;
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
            // 赦免(L2):首领盲注的负面效果整个失效,连目标分与弃置的修正也不进
            int boss = BossDisabled ? Bosses.None : node.BossId;
            // 基因的 B 类修正(效果系统 §3.2):每次开盲注从持有的基因重算,不记增量
            int geneDiscards = 0, geneGroupSize = 0;
            foreach (GeneSlot g in _genes)
            {
                RuleEffect e = Config.Effects.Find(EffectSource.Gene, g.GeneId);
                geneDiscards += e.DiscardDelta;
                geneGroupSize += e.GroupSizeDelta;
            }
            int discards = Math.Max(0, Config.BaseDiscards + Config.Tuning.DifficultyOf(Difficulty).DiscardDelta + Modifiers.DiscardBonus
                + Pending.BlindDiscards + geneDiscards);
            int groupSize = Math.Max(1, Math.Min(BlindSpec.MaxGroupSize, Config.DefaultGroupSize + Modifiers.GroupSizeBonus + geneGroupSize));
            // 首领、券、轻敌、基因代价并进一个千分值,只做一次四舍五入
            int extra = Modifiers.TargetPermille * Bosses.BossPermilleOf(boss, Config.Tuning) / 1000 * Pending.BlindTargetPermille / 1000;
            foreach (GeneSlot g in _genes)
            {
                if (!g.CostPending) continue;
                long cost = 1000 + Config.Effects.Find(EffectSource.Gene, g.GeneId).CostTargetPermille;
                extra = (int)Math.Min(int.MaxValue, extra * cost / 1000);
            }
            long target = RunTargets.For(node, Difficulty, Config, extra);
            return new BlindSpec(node.Segment, node.Layer, target, Bosses.Discards(discards, boss, Config.Tuning), Bosses.GroupSize(groupSize, boss, Config.Tuning), boss);
        }

        /// <summary>当前节点的首领(0 = 普通场);给表现层与「情报」标签预览用。</summary>
        public int CurrentBoss => Progress.CurrentNodeId == 0 ? Bosses.None : Map.Get(Progress.CurrentNodeId).BossId;

        /// <summary>开当前节点的盲注。上一个盲注还在进行时由 <see cref="StartBlind"/> 拦下;轻敌、弃权与基因代价在这里用掉。</summary>
        public StepResult StartBlindForCurrentNode()
        {
            BlindSpec spec = SpecForCurrentNode();
            Pending.ClearBlind();
            foreach (GeneSlot g in _genes) g.CostPending = false;
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

        /// <summary>记录一次弃置(斋戒、回响读本局的累计)。</summary>
        internal void RecordDiscard() => _discardedCount++;

        /// <summary>全局卖价加成(增值基因每盲注结束给所有基因与道具栏 +$1)。</summary>
        internal void AddSellBonus(int amount)
        {
            if (amount < 0) throw new System.ArgumentOutOfRangeException(nameof(amount), amount, "卖价加成不能为负");
            _sellBonus += amount;
        }

        /// <summary>吃掉/移走基因栏的一格(吞噬、出售的底层口)。越界什么也不做。</summary>
        internal void RemoveGeneAt(int slot)
        {
            if (slot >= 0 && slot < _genes.Count) _genes.RemoveAt(slot);
        }

        /// <summary>开过一个补给包之后记账并问基因的「开包」挂点(基因清单 §2.12)。</summary>
        internal void RecordBoosterOpened(int boosterId)
        {
            _boostersOpened++;
            StepPipeline.AfterBoosterOpened(this, boosterId, new List<RuleEvent>());
        }

        /// <summary>跳过当前可选的节点:不打、不拿通关奖励、不开店,换一个标签(设计稿 §2.3)。</summary>
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
            _skipCount++;
            StepPipeline.AfterSkipped(this, nodeId);
            return true;
        }

        /// <summary>标签的效果(设计稿 §7.1):四种当场结清,四种改下一次商店,两种改下一个盲注,一个开情报。</summary>
        private void ApplyTag(int tagId)
        {
            IRandomSource rng = Rng.Get(RngKeys.Tag);
            switch (tagId)
            {
                case Tags.Cash:
                    AddMoney(Config.Tuning.TagCash);
                    break;
                case Tags.Tech:
                    if (!GrantRandomTech(rng)) AddMoney(Config.Tuning.TagFallbackMoney);
                    break;
                case Tags.Mod:
                    if (!GrantRandomMod(rng)) AddMoney(Config.Tuning.TagFallbackMoney);
                    break;
                case Tags.Blocks:
                    if (!GrantRandomBlocks(rng)) AddMoney(Config.Tuning.TagFallbackMoney);
                    break;
                case Tags.Discount:
                    Pending.ShopDiscountPermille = Config.Tuning.TagDiscountPermille;
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
                    Pending.BlindTargetPermille = Config.Tuning.TagLightTargetPermille;
                    break;
                case Tags.ExtraDiscards:
                    Pending.BlindDiscards += Config.Tuning.TagExtraDiscards;
                    break;
                case Tags.InterestCap:
                    _interestBonus = Config.Tuning.TagInterestCap;
                    _interestBonusSegment = CurrentSegment;
                    break;
                case Tags.Intel:
                    BossIntel = true;
                    break;
            }
        }

        /// <summary>科技标签:一张已解锁的随机科技进道具栏(软锁照样管);没有可给的、或栏满返回 false。</summary>
        private bool GrantRandomTech(IRandomSource rng)
        {
            List<int> techs = UnlockedTechs();
            if (techs.Count == 0 || _consumables.Count >= ConsumableSlots) return false;
            return TryAddConsumable(ConsumableItem.Tech(techs[rng.Index(techs.Count)]));
        }

        private bool GrantRandomMod(IRandomSource rng)
        {
            if (Config.Catalog.Mods.Count == 0) return false;
            int id = Config.Catalog.Mods[rng.Index(Config.Catalog.Mods.Count)].Id;
            return TryAddConsumable(ConsumableItem.Mod(id));
        }

        private bool GrantRandomBlocks(IRandomSource rng)
        {
            if (Config.Catalog.Blocks.Count == 0) return false;
            for (int i = 0; i < Config.Tuning.TagBlocks; i++)
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
            int interestCap = Config.Tuning.DifficultyOf(Difficulty).InterestCap + Modifiers.InterestCapBonus + SegmentInterestCapBonus;
            interestCap = interestCap * InterestCapPermille / 1000;
            Settlement settlement = RunEconomy.Settle(node, Config.Tuning.NodeReward(node), _money, InterestPer, interestCap);
            AddMoney(settlement.Total);
            int before = _money;
            if (node.IsBoss) _bossesBeaten++;
            StepPipeline.AfterBlindWon(this);
            Progress.Resolve();
            return new Settlement(node.Id, settlement.Reward, settlement.Interest, _money, _money - before);
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

        /// <summary>
        /// 商店货与补给包候选的版本、强化、传说那条流(<see cref="RngKeys.Edition"/>),按当前节点的段层取;
        /// 还没进节点时(单测直接开店)按第 1 段第 1 层。
        /// </summary>
        public IRandomSource EditionRng()
        {
            if (Progress.CurrentNodeId == 0) return Rng.Get(RngKeys.Edition(1, 1));
            MapNode node = Map.Get(Progress.CurrentNodeId);
            return Rng.Get(RngKeys.Edition(node.Segment, node.Layer));
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

        /// <summary>
        /// 同形态:被消各格所属块的 Kind 全相同(06 号票 §5)。万态块视作任意形态(规则 §4.4,效果系统 §3.3 的判定改写),
        /// 只比其余块;被消的全是万态块也算。
        /// </summary>
        private bool IsSameShape(int[] owners)
        {
            int? kind = null;
            foreach (int owner in owners)
            {
                BlockInstance b = FindInstance(owner);
                if (b.Enhancement == Enhancement.Wild) continue;
                int key = (int)b.Kind;
                if (MirrorSameShape)
                {
                    // 镜合:把镜像对折成同一个键(S/Z、J/L),I、O、T 不动
                    if (b.Kind == TetrominoKind.S || b.Kind == TetrominoKind.Z) key = (int)TetrominoKind.S;
                    else if (b.Kind == TetrominoKind.J || b.Kind == TetrominoKind.L) key = (int)TetrominoKind.J;
                }
                if (kind == null) kind = key;
                else if (key != kind) return false;
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
                library, (int[])_typeLevels.Clone(), (int[])_typeCounts.Clone(), genes, new List<ConsumableItem>(_consumables),
                new List<int>(_vouchers), Blind?.Clone(), Pending.Clone(), BossIntel, _interestBonus, _interestBonusSegment,
                _modsUsed, _techsUsedMask, _soldCount, _skipCount, _boostersOpened, _bossesBeaten, _sellBonus, _lastConsumable,
                _discardedCount, _lastPlaceRow, _lastPlaceCol, _destroyedCount, _unlockedGenes);
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
            if (_money < (AllowDebt ? -DebtLimit : 0)) return Invariant($"money: {_money} 低于下限 {(AllowDebt ? -DebtLimit : 0)}");
            if (_modsUsed < 0) return Invariant($"modsUsed: {_modsUsed} 为负");
            if (_techsUsedMask < 0) return Invariant($"techsUsed: {_techsUsedMask} 为负");
            if (_soldCount < 0) return Invariant($"soldCount: {_soldCount} 为负");
            if (_skipCount < 0) return Invariant($"skipCount: {_skipCount} 为负");
            if (_boostersOpened < 0) return Invariant($"boostersOpened: {_boostersOpened} 为负");
            if (_bossesBeaten < 0) return Invariant($"bossesBeaten: {_bossesBeaten} 为负");
            if (_sellBonus < 0) return Invariant($"sellBonus: {_sellBonus} 为负");
            if (_discardedCount < 0) return Invariant($"discardedCount: {_discardedCount} 为负");
            if (_lastPlaceRow < -1 || _lastPlaceRow >= BoardCells.Rows) return Invariant($"lastPlaceRow: {_lastPlaceRow} 越界");
            if (_lastPlaceCol < -1 || _lastPlaceCol >= BoardCells.Cols) return Invariant($"lastPlaceCol: {_lastPlaceCol} 越界");
            if (_destroyedCount < 0) return Invariant($"destroyedCount: {_destroyedCount} 为负");
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
                int baseGoods = Config.Tuning.GoodsCount;
                if (Shop.Count < baseGoods || Shop.Count > baseGoods + 2)
                {
                    return Invariant($"shop.goods: 应有 {baseGoods}..{baseGoods + 2} 格,实有 {Shop.Count}");
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
            for (int t = 0; t < ClearTypes.Count; t++)
            {
                if (_typeCounts[t] < 0) return Invariant($"typeCounts.{(ClearType)t}: {_typeCounts[t]} 为负");
            }
            for (int i = 0; i < _genes.Count; i++)
            {
                // 09 §5 写的是「genes 为空」;本图注册表为空,两者等价,而单测经 AddGene 加登记过的替身基因(20 号票补的约束)
                GeneSlot g = _genes[i];
                if (Config.Effects.Find(EffectSource.Gene, g.GeneId) == null) return Invariant($"genes[{i}].id: 基因 {g.GeneId} 没在效果注册表里登记");
                if (!Enum.IsDefined(typeof(Edition), g.Edition)) return Invariant($"genes[{i}].edition: 未定义的值 {(int)g.Edition}");
                if (g.Counter < 0) return Invariant($"genes[{i}].counter: {g.Counter} 为负");
                if (g.State < 0) return Invariant($"genes[{i}].state: {g.State} 为负");
                if (g.SellBonus < 0) return Invariant($"genes[{i}].sellBonus: {g.SellBonus} 为负");
            }
            if (GeneSlotsUsed > GeneSlots) return Invariant($"genes: 占槽的有 {GeneSlotsUsed} 张,基因槽只有 {GeneSlots} 格");
            if (_consumables.Count > ConsumableSlots)
            {
                return Invariant($"consumables: 有 {_consumables.Count} 件,道具栏只有 {ConsumableSlots} 格");
            }
            for (int i = 0; i < _consumables.Count; i++)
            {
                ConsumableItem c = _consumables[i];
                bool known = c.Kind == ItemKind.Tech ? Config.Catalog.HasTech(c.Id) : c.Kind == ItemKind.Mod && ModCatalog.IsKnown(c.Id);
                if (!known) return Invariant($"consumables[{i}]: {c} 不是有效的科技或改造");
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
            if (b.Edition == Edition.Negative) return Invariant($"{path}.edition: 负片只给基因");
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
