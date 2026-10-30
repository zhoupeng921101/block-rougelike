using System;
using System.Collections.Generic;
using System.Globalization;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>
    /// 局内存档快照:状态 ↔ 规范 JSON 文本(09 号票 §1、§3–§5)。两个纯函数,不碰文件和时钟;文件层与存档时机归 GameLogic(23 号票)。
    /// 同一状态写出的字节逐个相同,跑局轨迹终局的 state 就是它(10 号票 §7)。形状的样档 = DotNet/Tests/GameRules/Samples/run-v1.json。
    /// 读档要传开局时那一份规则配置:类型表、效果注册表、默认方块库都不进快照。
    /// </summary>
    public static class RunSnapshot
    {
        public const string Format = "3b.run";

        /// <summary>存档形状的版本。首次对外发包前恒为 1,形状随便改、旧档作废;发包后改形状就加一、写迁移、留样档(09 号票 §4)。</summary>
        public const int Schema = 1;

        // 读入端按这些次序对形状;写出端的调用次序与它们一致,往返单测逐字节比对兜住两边
        private static readonly string[] RootMembers =
        {
            "format", "schema", "seed", "rng", "difficulty", "money", "map", "shop",
            "nextInstanceId", "library", "typeLevels", "typeCounts", "consumables", "vouchers", "genes", "blind",
            "pending", "bossIntel", "interestBonus", "interestBonusSegment",
            "modsUsed", "techsUsed", "soldCount", "skipCount", "boostersOpened", "bossesBeaten", "sellBonus", "lastConsumable",
            "discardedCount", "lastPlaceRow", "lastPlaceCol", "destroyedCount",
        };
        private static readonly string[] RngMembers = { "scheme", "streams" };
        private static readonly string[] StreamMembers = { "key", "s0", "s1" };
        private static readonly string[] MapMembers = { "segmentCount", "nodes", "progress" };
        private static readonly string[] MapNodeMembers = { "id", "segment", "layer", "strength", "tag", "boss" };
        private static readonly string[] ProgressMembers = { "current", "resolved", "skipped", "visited" };
        private static readonly string[] ShopMembers = { "rerolls", "guaranteeGene", "voucher", "booster", "pack", "goods" };
        private static readonly string[] ShopOfferMembers = { "kind", "id", "price", "sold", "enhancement", "edition" };
        private static readonly string[] ConsumableMembers = { "kind", "id" };
        private static readonly string[] PackMembers = { "boosterId", "picksLeft", "options" };
        private static readonly string[] BlockMembers = { "id", "kind", "points", "enhancement", "edition" };
        private static readonly string[] GeneMembers = { "id", "edition", "counter", "costPending", "state", "sellBonus" };
        private static readonly string[] BlindMembers =
        {
            "spec", "outcome", "failReason", "step", "group", "score", "combo", "discardsLeft",
            "draw", "tray", "owner", "dead", "discarded", "departed", "removed", "tempBlocks",
            "placedKinds", "typeCounts", "lastClear", "comboShield", "bossSuppressed",
        };
        private static readonly string[] SpecMembers = { "segment", "layer", "target", "discards", "groupSize", "boss" };
        private static readonly string[] PendingMembers =
        {
            "shopDiscount", "extraShopGoods", "freeReroll", "freeBooster", "blindTarget", "blindDiscards",
        };
        private static readonly string[] SlotMembers = { "id", "rot" };
        private static readonly string[] TypeLevelMembers = BuildTypeLevelMembers();

        /// <summary>
        /// 状态 → 规范文本。状态须过 <see cref="RunState.Validate"/>(未定义的枚举值写不出名字,直接抛)。
        /// 盲注可以为 null(商店、选关这些两个盲注之间的时刻),那里写 null;战斗中的形状与此前相同。
        /// </summary>
        public static string Write(RunState run)
        {
            if (run == null) throw new ArgumentNullException(nameof(run));
            BlindState blind = run.Blind;
            var w = new CanonicalJsonWriter();
            w.BeginObject(JsonLayout.Lines);
            w.Name("format").String(Format);
            w.Name("schema").Int(Schema);
            w.Name("seed").String(run.Seed);

            w.Name("rng").BeginObject(JsonLayout.Lines);
            w.Name("scheme").Int(RngStreams.SchemeVersion);
            w.Name("streams").BeginArray(JsonLayout.Lines);
            foreach (RngStreamState s in run.Rng.Export())
            {
                w.BeginObject(JsonLayout.Inline).Name("key").String(s.Key).Name("s0").String(Hex(s.S0)).Name("s1").String(Hex(s.S1)).End();
            }
            w.End().End();

            w.Name("difficulty").String(NameOf(run.Difficulty));
            w.Name("money").Int(run.Money);
            WriteMap(w, run.Map, run.Progress);
            if (run.Shop == null) w.Name("shop").Null();
            else WriteShop(w, run.Shop);

            w.Name("nextInstanceId").Int(run.NextInstanceId);
            w.Name("library");
            WriteBlocks(w, run.Library);
            w.Name("typeLevels").BeginObject(JsonLayout.Lines);
            for (int t = 0; t < ClearTypes.Count; t++) w.Name(TypeLevelMembers[t]).Int(run.TypeLevels[t]);
            w.End();
            w.Name("typeCounts").BeginObject(JsonLayout.Lines);
            for (int t = 0; t < ClearTypes.Count; t++) w.Name(TypeLevelMembers[t]).Int(run.TypeCounts[t]);
            w.End();
            w.Name("consumables").BeginArray(JsonLayout.Lines);
            foreach (ConsumableItem c in run.Consumables)
            {
                w.BeginObject(JsonLayout.Inline).Name("kind").String(NameOf(c.Kind)).Name("id").Int(c.Id).End();
            }
            w.End();
            w.Name("vouchers");
            WriteIds(w, run.Vouchers);
            w.Name("genes").BeginArray(JsonLayout.Lines);
            foreach (GeneSlot g in run.Genes)
            {
                w.BeginObject(JsonLayout.Inline)
                    .Name("id").Int(g.GeneId)
                    .Name("edition").String(NameOf(g.Edition))
                    .Name("counter").Int(g.Counter)
                    .Name("costPending").Bool(g.CostPending)
                    .Name("state").Int(g.State)
                    .Name("sellBonus").Int(g.SellBonus)
                    .End();
            }
            w.End();

            if (blind == null) w.Name("blind").Null();
            else WriteBlind(w, blind);

            w.Name("pending").BeginObject(JsonLayout.Inline)
                .Name("shopDiscount").Int(run.Pending.ShopDiscountPermille)
                .Name("extraShopGoods").Int(run.Pending.ExtraShopGoods)
                .Name("freeReroll").Bool(run.Pending.FreeReroll)
                .Name("freeBooster").Bool(run.Pending.FreeBooster)
                .Name("blindTarget").Int(run.Pending.BlindTargetPermille)
                .Name("blindDiscards").Int(run.Pending.BlindDiscards)
                .End();
            w.Name("bossIntel").Bool(run.BossIntel);
            w.Name("interestBonus").Int(run.PendingInterestBonus);
            w.Name("interestBonusSegment").Int(run.PendingInterestBonusSegment);
            w.Name("modsUsed").Int(run.ModsUsed);
            w.Name("techsUsed").Int(run.TechsUsedMask);
            w.Name("soldCount").Int(run.SoldCount);
            w.Name("skipCount").Int(run.SkipCount);
            w.Name("boostersOpened").Int(run.BoostersOpened);
            w.Name("bossesBeaten").Int(run.BossesBeaten);
            w.Name("sellBonus").Int(run.SellBonus);
            if (run.LastConsumable == null) w.Name("lastConsumable").Null();
            else
            {
                ConsumableItem last = run.LastConsumable.Value;
                w.Name("lastConsumable").BeginObject(JsonLayout.Inline).Name("kind").String(NameOf(last.Kind)).Name("id").Int(last.Id).End();
            }
            w.Name("discardedCount").Int(run.DiscardedCount);
            w.Name("lastPlaceRow").Int(run.LastPlaceRow);
            w.Name("lastPlaceCol").Int(run.LastPlaceCol);
            w.Name("destroyedCount").Int(run.DestroyedCount);

            w.End();
            return w.Finish();
        }

        /// <summary>一个盲注的形状。字段次序与 <see cref="BlindMembers"/> 一致。</summary>
        private static void WriteBlind(CanonicalJsonWriter w, BlindState blind)
        {
            BlindSpec spec = blind.Spec;
            w.Name("blind").BeginObject(JsonLayout.Lines);
            w.Name("spec").BeginObject(JsonLayout.Inline)
                .Name("segment").Int(spec.Segment)
                .Name("layer").Int(spec.Layer)
                .Name("target").String(Dec(spec.Target))
                .Name("discards").Int(spec.Discards)
                .Name("groupSize").Int(spec.GroupSize)
                .Name("boss").Int(spec.BossId)
                .End();
            w.Name("outcome").String(NameOf(blind.Outcome));
            w.Name("failReason").String(NameOf(blind.FailReason));
            w.Name("step").Int(blind.Step);
            w.Name("group").Int(blind.Group);
            w.Name("score").String(Dec(blind.Score));
            w.Name("combo").Int(blind.Combo);
            w.Name("discardsLeft").Int(blind.DiscardsLeft);
            w.Name("draw");
            WriteIds(w, blind.Draw);
            w.Name("tray").BeginArray(JsonLayout.Inline);
            foreach (TraySlot slot in blind.Tray)
            {
                if (slot.IsEmpty) w.Null();
                else w.BeginObject(JsonLayout.Inline).Name("id").Int(slot.Id).Name("rot").Int(slot.Rot).End();
            }
            w.End();
            // 一行盘面一行文本,row 0 在上;格号 = row*8 + col,和事件同一套,不写掩码(掩码的位布局见 BoardCells)
            w.Name("owner").BeginArray(JsonLayout.Lines);
            for (int r = 0; r < BoardCells.Rows; r++)
            {
                w.BeginArray(JsonLayout.Inline);
                for (int c = 0; c < BoardCells.Cols; c++) w.Int(blind.Board.OwnerAt(BoardCells.Index(r, c)));
                w.End();
            }
            w.End();
            w.Name("dead").BeginArray(JsonLayout.Inline);
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (blind.Board.IsDead(cell)) w.Int(cell);
            }
            w.End();
            w.Name("discarded");
            WriteIds(w, blind.Discarded);
            w.Name("departed");
            WriteIds(w, blind.Departed);
            w.Name("removed");
            WriteIds(w, blind.Removed);
            w.Name("tempBlocks");
            WriteBlocks(w, blind.TempBlocks);
            w.Name("placedKinds").Int(blind.PlacedKinds);
            w.Name("typeCounts");
            WriteIds(w, blind.TypeCounts);
            w.Name("lastClear").Int(blind.LastClearType);
            w.Name("comboShield").Bool(blind.ComboShieldUsed);
            w.Name("bossSuppressed").Bool(blind.BossSuppressed);
            w.End();
        }

        /// <summary>地图布局与进度。布局进档是因为生成代码以后可能改;存下来才能让旧档照原图继续打。</summary>
        private static void WriteMap(CanonicalJsonWriter w, RunMap map, MapProgress progress)
        {
            w.Name("map").BeginObject(JsonLayout.Lines);
            w.Name("segmentCount").Int(map.SegmentCount);
            w.Name("nodes").BeginArray(JsonLayout.Lines);
            foreach (MapNode n in map.Nodes)
            {
                w.BeginObject(JsonLayout.Inline)
                    .Name("id").Int(n.Id)
                    .Name("segment").Int(n.Segment)
                    .Name("layer").Int(n.Layer)
                    .Name("strength").String(NameOf(n.Strength))
                    .Name("tag").Int(n.TagId)
                    .Name("boss").Int(n.BossId)
                    .End();
            }
            w.End();
            w.Name("progress").BeginObject(JsonLayout.Lines);
            w.Name("current").Int(progress.CurrentNodeId);
            w.Name("resolved").Bool(progress.CurrentResolved);
            w.Name("skipped").Bool(progress.CurrentSkipped);
            w.Name("visited");
            WriteIds(w, progress.Visited);
            w.End();
            w.End();
        }

        /// <summary>货架。目录与难度不进档:它们是开局配置,读档时由调用方传进来。</summary>
        private static void WriteShop(CanonicalJsonWriter w, ShopState shop)
        {
            w.Name("shop").BeginObject(JsonLayout.Lines);
            w.Name("rerolls").Int(shop.Rerolls);
            w.Name("guaranteeGene").Bool(shop.GuaranteeGene);
            w.Name("voucher");
            if (shop.Voucher == null) w.Null();
            else WriteOffer(w, shop.Voucher.Value);
            w.Name("booster");
            if (shop.Booster == null) w.Null();
            else WriteOffer(w, shop.Booster.Value);
            w.Name("pack");
            WritePack(w, shop.Pack);
            w.Name("goods").BeginArray(JsonLayout.Lines);
            foreach (ShopOffer offer in shop.Goods)
            {
                WriteOffer(w, offer);
            }
            w.End();
            w.End();
        }

        /// <summary>开了一半的包:包号、还剩几次、以及剩下的候选。已选走的候选不在列表里。</summary>
        private static void WritePack(CanonicalJsonWriter w, BoosterPack pack)
        {
            if (pack == null)
            {
                w.Null();
                return;
            }
            w.BeginObject(JsonLayout.Lines);
            w.Name("boosterId").Int(pack.BoosterId);
            w.Name("picksLeft").Int(pack.PicksLeft);
            w.Name("options").BeginArray(JsonLayout.Lines);
            foreach (ShopOffer option in pack.Options) WriteOffer(w, option);
            w.End();
            w.End();
        }

        private static void WriteOffer(CanonicalJsonWriter w, ShopOffer offer)
        {
            w.BeginObject(JsonLayout.Inline)
                .Name("kind").String(NameOf(offer.Kind))
                .Name("id").Int(offer.Id)
                .Name("price").Int(offer.Price)
                .Name("sold").Bool(offer.Sold)
                .Name("enhancement").String(NameOf(offer.Enhancement))
                .Name("edition").String(NameOf(offer.Edition))
                .End();
        }

        /// <summary>
        /// 规范文本 → 状态。任何文本都不抛异常:形状严格(多、少成员或次序不对都算坏档),枚举按名字精确匹配,
        /// 还原后再过 <see cref="RunState.Validate"/>;返回状态,或错误码加第一处出错的成员路径。
        /// </summary>
        public static SnapshotReadResult Read(string text, RuleConfig config) => Read(text, config, null);

        /// <summary>读档;元进程解锁的基因由调用方给,存档里不存(局外循环 §6)。null = 全解锁。</summary>
        public static SnapshotReadResult Read(string text, RuleConfig config, IReadOnlyCollection<int> unlockedGenes)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            SnapshotReadResult fault = JsonSubsetReader.Parse(text, out JsonNode root);
            if (fault != null) return fault;
            var p = new Parser();
            RunState run = ReadRoot(p, root, config, unlockedGenes);
            if (run == null) return p.Fault;
            string invalid = run.Validate();
            if (invalid == null) return SnapshotReadResult.Success(run);
            int colon = invalid.IndexOf(": ", StringComparison.Ordinal);
            return SnapshotReadResult.Failure(SnapshotError.Invalid, colon < 0 ? "" : invalid.Substring(0, colon), invalid);
        }

        /// <summary>
        /// 迁移链的入口(09 号票 §4):发包后每升一版,在这里加一级「旧 → 新」,作用在解析树上、一级一级串到当前版本。
        /// 首发前 schema 恒为 1,链是空的;接不上返回 null。
        /// </summary>
        private static JsonNode Migrate(JsonNode root, long schema) => schema == Schema ? root : null;

        private static RunState ReadRoot(Parser p, JsonNode root, RuleConfig config, IReadOnlyCollection<int> unlockedGenes)
        {
            if (root.Kind != JsonKind.Object) return p.Fail(SnapshotError.Shape, "", "根应是对象");
            // format、schema 先于整体形状查:别的版本的档形状本来就不同,要先认出它是哪一版
            List<KeyValuePair<string, JsonNode>> head = root.Members;
            if (head.Count == 0 || head[0].Key != "format" || head[0].Value.Kind != JsonKind.String || head[0].Value.String != Format)
            {
                return p.Fail(SnapshotError.BadFormat, "format", "不是 " + Format + " 局内存档");
            }
            if (head.Count < 2 || head[1].Key != "schema") return p.Fail(SnapshotError.Shape, "schema", "format 之后应是 schema");
            if (head[1].Value.Kind != JsonKind.Integer) return p.Fail(SnapshotError.Shape, "schema", "应是整数");
            long schema = head[1].Value.Integer;
            JsonNode current = Migrate(root, schema);
            if (current == null) return p.Fail(SnapshotError.UnsupportedSchema, "schema", Invariant($"存档的 schema 是 {schema},本版只认 {Schema}"));

            JsonNode[] v = p.ReadObject(current, "", RootMembers);
            if (v == null) return null;
            string seed = p.ReadString(v[2], "seed");
            if (p.Failed) return null;
            if (!SeedText.IsCanonical(seed)) return p.Fail(SnapshotError.BadValue, "seed", "不是规范种子文本");

            List<RngStreamState> streams = ReadStreams(p, v[3]);
            if (streams == null) return null;
            RunDifficulty difficulty = p.ReadEnum<RunDifficulty>(v[4], "difficulty");
            int money = p.ReadInt(v[5], "money");
            if (p.Failed) return null;
            if (money < -RunState.DebtLimit) return p.Fail(SnapshotError.BadValue, "money", "金钱低于赊账下限");
            if (!ReadMap(p, v[6], out RunMap map, out MapProgress progress)) return null;
            if (!ReadShop(p, v[7], config.Catalog, difficulty, config.Tuning, out ShopState shop)) return null;
            int nextInstanceId = p.ReadInt(v[8], "nextInstanceId");
            if (p.Failed) return null;
            List<BlockInstance> library = ReadBlocks(p, v[9], "library");
            if (library == null) return null;

            JsonNode[] lv = p.ReadObject(v[10], "typeLevels", TypeLevelMembers);
            if (lv == null) return null;
            var levels = new int[ClearTypes.Count];
            for (int t = 0; t < levels.Length; t++) levels[t] = p.ReadInt(lv[t], "typeLevels." + TypeLevelMembers[t]);
            JsonNode[] cv = p.ReadObject(v[11], "typeCounts", TypeLevelMembers);
            if (cv == null) return null;
            var counts = new int[ClearTypes.Count];
            for (int t = 0; t < counts.Length; t++) counts[t] = p.ReadInt(cv[t], "typeCounts." + TypeLevelMembers[t]);

            List<JsonNode> geneItems = p.ReadArray(v[14], "genes");
            if (geneItems == null) return null;
            var genes = new List<GeneSlot>(geneItems.Count);
            for (int i = 0; i < geneItems.Count; i++)
            {
                string path = Invariant($"genes[{i}]");
                JsonNode[] g = p.ReadObject(geneItems[i], path, GeneMembers);
                if (g == null) return null;
                int geneId = p.ReadInt(g[0], path + ".id");
                Edition edition = p.ReadEnum<Edition>(g[1], path + ".edition");
                int counter = p.ReadInt(g[2], path + ".counter");
                bool costPending = p.ReadBool(g[3], path + ".costPending");
                int state = p.ReadInt(g[4], path + ".state");
                int geneSellBonus = p.ReadInt(g[5], path + ".sellBonus");
                if (p.Failed) return null;
                genes.Add(new GeneSlot(geneId, edition, counter, costPending, state, geneSellBonus));
            }
            List<JsonNode> consumableItems = p.ReadArray(v[12], "consumables");
            if (consumableItems == null) return null;
            var consumables = new List<ConsumableItem>(consumableItems.Count);
            for (int i = 0; i < consumableItems.Count; i++)
            {
                string path = Invariant($"consumables[{i}]");
                JsonNode[] c = p.ReadObject(consumableItems[i], path, ConsumableMembers);
                if (c == null) return null;
                ItemKind kind = p.ReadEnum<ItemKind>(c[0], path + ".kind");
                int id = p.ReadInt(c[1], path + ".id");
                if (p.Failed) return null;
                consumables.Add(new ConsumableItem(kind, id));
            }
            List<int> vouchers = p.ReadIntList(v[13], "vouchers");
            if (p.Failed) return null;

            BlindState blind = null;
            if (v[15].Kind != JsonKind.Null)
            {
                blind = ReadBlind(p, v[15]);
                if (blind == null) return null;
            }

            JsonNode[] pd = p.ReadObject(v[16], "pending", PendingMembers);
            if (pd == null) return null;
            var pending = new RunPending
            {
                ShopDiscountPermille = p.ReadInt(pd[0], "pending.shopDiscount"),
                ExtraShopGoods = p.ReadInt(pd[1], "pending.extraShopGoods"),
                FreeReroll = p.ReadBool(pd[2], "pending.freeReroll"),
                FreeBooster = p.ReadBool(pd[3], "pending.freeBooster"),
                BlindTargetPermille = p.ReadInt(pd[4], "pending.blindTarget"),
                BlindDiscards = p.ReadInt(pd[5], "pending.blindDiscards"),
            };
            bool bossIntel = p.ReadBool(v[17], "bossIntel");
            int interestBonus = p.ReadInt(v[18], "interestBonus");
            int interestBonusSegment = p.ReadInt(v[19], "interestBonusSegment");
            int modsUsed = p.ReadInt(v[20], "modsUsed");
            int techsUsed = p.ReadInt(v[21], "techsUsed");
            int soldCount = p.ReadInt(v[22], "soldCount");
            int skipCount = p.ReadInt(v[23], "skipCount");
            int boostersOpened = p.ReadInt(v[24], "boostersOpened");
            int bossesBeaten = p.ReadInt(v[25], "bossesBeaten");
            int sellBonus = p.ReadInt(v[26], "sellBonus");
            ConsumableItem? lastConsumable = null;
            if (v[27].Kind != JsonKind.Null)
            {
                JsonNode[] lc = p.ReadObject(v[27], "lastConsumable", ConsumableMembers);
                if (lc == null) return null;
                ItemKind lk = p.ReadEnum<ItemKind>(lc[0], "lastConsumable.kind");
                int li = p.ReadInt(lc[1], "lastConsumable.id");
                if (p.Failed) return null;
                lastConsumable = new ConsumableItem(lk, li);
            }
            if (p.Failed) return null;

            int discardedCount = p.ReadInt(v[28], "discardedCount");
            int lastPlaceRow = p.ReadInt(v[29], "lastPlaceRow");
            int lastPlaceCol = p.ReadInt(v[30], "lastPlaceCol");
            int destroyedCount = p.ReadInt(v[31], "destroyedCount");
            if (p.Failed) return null;

            return RunState.Restore(config, RngStreams.Restore(seed, streams), difficulty, money, map, progress, shop, nextInstanceId,
                library, levels, counts, genes, consumables, vouchers, blind, pending, bossIntel, interestBonus, interestBonusSegment,
                modsUsed, techsUsed, soldCount, skipCount, boostersOpened, bossesBeaten, sellBonus, lastConsumable, discardedCount,
                lastPlaceRow, lastPlaceCol, destroyedCount, unlockedGenes);
        }

        /// <summary>货架。null 是合法的(不在商店)。</summary>
        private static bool ReadShop(Parser p, JsonNode node, ContentCatalog catalog, RunDifficulty difficulty, RunTuning tuning, out ShopState shop)
        {
            shop = null;
            if (node.Kind == JsonKind.Null) return true;
            JsonNode[] s = p.ReadObject(node, "shop", ShopMembers);
            if (s == null) return false;
            int rerolls = p.ReadInt(s[0], "shop.rerolls");
            bool guaranteeGene = p.ReadBool(s[1], "shop.guaranteeGene");
            ShopOffer? voucher = null;
            if (s[2].Kind != JsonKind.Null)
            {
                voucher = ReadOffer(p, s[2], "shop.voucher");
                if (p.Failed) return false;
            }
            ShopOffer? booster = null;
            if (s[3].Kind != JsonKind.Null)
            {
                booster = ReadOffer(p, s[3], "shop.booster");
                if (p.Failed) return false;
            }
            BoosterPack pack = null;
            if (s[4].Kind != JsonKind.Null)
            {
                pack = ReadPack(p, s[4], "shop.pack");
                if (pack == null) return false;
            }
            List<JsonNode> items = p.ReadArray(s[5], "shop.goods");
            if (items == null) return false;
            if (items.Count < tuning.GoodsCount || items.Count > tuning.GoodsCount + 2)
            {
                p.Fail(SnapshotError.Shape, "shop.goods",
                    Invariant($"应有 {tuning.GoodsCount}..{tuning.GoodsCount + 2} 格"));
                return false;
            }
            var goods = new ShopOffer[items.Count];
            for (int i = 0; i < goods.Length; i++)
            {
                string path = Invariant($"shop.goods[{i}]");
                goods[i] = ReadOffer(p, items[i], path);
                if (p.Failed) return false;
            }
            shop = ShopState.Restore(goods, rerolls, guaranteeGene, voucher, booster, pack, catalog, difficulty, tuning);
            return true;
        }

        private static BoosterPack ReadPack(Parser p, JsonNode node, string path)
        {
            JsonNode[] members = p.ReadObject(node, path, PackMembers);
            if (members == null) return null;
            int boosterId = p.ReadInt(members[0], path + ".boosterId");
            int picksLeft = p.ReadInt(members[1], path + ".picksLeft");
            List<JsonNode> options = p.ReadArray(members[2], path + ".options");
            if (options == null) return null;
            var list = new List<ShopOffer>(options.Count);
            for (int i = 0; i < options.Count; i++)
            {
                list.Add(ReadOffer(p, options[i], Invariant($"{path}.options[{i}]")));
                if (p.Failed) return null;
            }
            if (picksLeft < 0) p.Fail(SnapshotError.BadValue, path + ".picksLeft", "剩下次数不能为负");
            return BoosterPack.Restore(boosterId, picksLeft, list);
        }

        /// <summary>读一件货;kinds 与价格在这里只做基本合法性,放不放得下归 <see cref="ShopState.TryBuy"/>。</summary>
        private static ShopOffer ReadOffer(Parser p, JsonNode node, string path)
        {
            JsonNode[] o = p.ReadObject(node, path, ShopOfferMembers);
            if (o == null) return default;
            ItemKind kind = p.ReadEnum<ItemKind>(o[0], path + ".kind");
            int id = p.ReadInt(o[1], path + ".id");
            int price = p.ReadInt(o[2], path + ".price");
            bool sold = p.ReadBool(o[3], path + ".sold");
            Enhancement enhancement = p.ReadEnum<Enhancement>(o[4], path + ".enhancement");
            Edition edition = p.ReadEnum<Edition>(o[5], path + ".edition");
            if (p.Failed) return default;
            if (price < 0) p.Fail(SnapshotError.BadValue, path + ".price", "价格不能为负");
            return new ShopOffer(kind, id, price, sold, enhancement, edition);
        }

        /// <summary>地图布局与进度。布局的形状约束由 <see cref="RunMap.Validate"/> 在整局校验里查,这里只判读得下来。</summary>
        private static bool ReadMap(Parser p, JsonNode node, out RunMap map, out MapProgress progress)
        {
            map = null;
            progress = null;
            JsonNode[] m = p.ReadObject(node, "map", MapMembers);
            if (m == null) return false;
            int segmentCount = p.ReadInt(m[0], "map.segmentCount");
            List<JsonNode> nodeItems = p.ReadArray(m[1], "map.nodes");
            if (nodeItems == null) return false;
            var nodes = new List<MapNode>(nodeItems.Count);
            for (int i = 0; i < nodeItems.Count; i++)
            {
                string path = Invariant($"map.nodes[{i}]");
                JsonNode[] n = p.ReadObject(nodeItems[i], path, MapNodeMembers);
                if (n == null) return false;
                int id = p.ReadInt(n[0], path + ".id");
                int segment = p.ReadInt(n[1], path + ".segment");
                int layer = p.ReadInt(n[2], path + ".layer");
                NodeStrength strength = p.ReadEnum<NodeStrength>(n[3], path + ".strength");
                int tag = p.ReadInt(n[4], path + ".tag");
                int boss = p.ReadInt(n[5], path + ".boss");
                if (p.Failed) return false;
                nodes.Add(new MapNode(id, segment, layer, strength, tag, boss));
            }

            JsonNode[] pr = p.ReadObject(m[2], "map.progress", ProgressMembers);
            if (pr == null) return false;
            int current = p.ReadInt(pr[0], "map.progress.current");
            bool resolved = p.ReadBool(pr[1], "map.progress.resolved");
            bool skipped = p.ReadBool(pr[2], "map.progress.skipped");
            List<int> visited = p.ReadIntList(pr[3], "map.progress.visited");
            if (p.Failed) return false;

            map = RunMap.Restore(nodes, segmentCount);
            progress = MapProgress.Restore(current, resolved, skipped, visited);
            return true;
        }

        private static List<RngStreamState> ReadStreams(Parser p, JsonNode node)
        {
            JsonNode[] rng = p.ReadObject(node, "rng", RngMembers);
            if (rng == null) return null;
            int scheme = p.ReadInt(rng[0], "rng.scheme");
            if (p.Failed) return null;
            if (scheme != RngStreams.SchemeVersion)
            {
                return p.Fail<List<RngStreamState>>(SnapshotError.UnsupportedRngScheme, "rng.scheme",
                    Invariant($"随机流方案是 {scheme},本版只认 {RngStreams.SchemeVersion}"));
            }
            List<JsonNode> items = p.ReadArray(rng[1], "rng.streams");
            if (items == null) return null;

            // 这里拦下的坏值 RngStreams 的构造要么抛异常、要么悄悄改掉(全零态),所以在构造之前查
            var streams = new List<RngStreamState>(items.Count);
            string prevKey = null;
            for (int i = 0; i < items.Count; i++)
            {
                string path = Invariant($"rng.streams[{i}]");
                JsonNode[] s = p.ReadObject(items[i], path, StreamMembers);
                if (s == null) return null;
                string key = p.ReadString(s[0], path + ".key");
                ulong s0 = p.ReadHex64(s[1], path + ".s0");
                ulong s1 = p.ReadHex64(s[2], path + ".s1");
                if (p.Failed) return null;
                if (!RngKeys.IsValid(key)) return p.Fail<List<RngStreamState>>(SnapshotError.BadValue, path + ".key", "不合键语法");
                if (prevKey != null && string.CompareOrdinal(prevKey, key) >= 0)
                {
                    return p.Fail<List<RngStreamState>>(SnapshotError.BadValue, path + ".key", "键须按 ordinal 严格升序,不许重复");
                }
                if (s0 == 0UL && s1 == 0UL)
                {
                    return p.Fail<List<RngStreamState>>(SnapshotError.BadValue, path, "s0、s1 全为 0:xorshift 的全零态出不来随机数");
                }
                streams.Add(new RngStreamState(key, s0, s1));
                prevKey = key;
            }
            return streams;
        }

        private static BlindState ReadBlind(Parser p, JsonNode node)
        {
            JsonNode[] b = p.ReadObject(node, "blind", BlindMembers);
            if (b == null) return null;

            JsonNode[] s = p.ReadObject(b[0], "blind.spec", SpecMembers);
            if (s == null) return null;
            int segment = p.ReadInt(s[0], "blind.spec.segment");
            int layer = p.ReadInt(s[1], "blind.spec.layer");
            long target = p.ReadDecimal(s[2], "blind.spec.target");
            int discards = p.ReadInt(s[3], "blind.spec.discards");
            int groupSize = p.ReadInt(s[4], "blind.spec.groupSize");
            if (p.Failed) return null;
            // BlindSpec 的构造对这些越界抛异常,先查
            if (segment < 1) return p.Fail<BlindState>(SnapshotError.BadValue, "blind.spec.segment", "段从 1 数");
            if (layer < 1) return p.Fail<BlindState>(SnapshotError.BadValue, "blind.spec.layer", "层从 1 数");
            if (target < 0) return p.Fail<BlindState>(SnapshotError.BadValue, "blind.spec.target", "目标分不能为负");
            if (discards < 0) return p.Fail<BlindState>(SnapshotError.BadValue, "blind.spec.discards", "弃置次数不能为负");
            if (groupSize < 1 || groupSize > BlindSpec.MaxGroupSize)
            {
                return p.Fail<BlindState>(SnapshotError.BadValue, "blind.spec.groupSize", Invariant($"每组块数在 1..{BlindSpec.MaxGroupSize}"));
            }

            BlindOutcome outcome = p.ReadEnum<BlindOutcome>(b[1], "blind.outcome");
            FailReason failReason = p.ReadEnum<FailReason>(b[2], "blind.failReason");
            int step = p.ReadInt(b[3], "blind.step");
            int group = p.ReadInt(b[4], "blind.group");
            long score = p.ReadDecimal(b[5], "blind.score");
            int combo = p.ReadInt(b[6], "blind.combo");
            int discardsLeft = p.ReadInt(b[7], "blind.discardsLeft");
            List<int> draw = p.ReadIntList(b[8], "blind.draw");
            if (p.Failed) return null;

            List<JsonNode> trayItems = p.ReadArray(b[9], "blind.tray");
            if (trayItems == null) return null;
            var tray = new TraySlot[trayItems.Count];
            for (int i = 0; i < tray.Length; i++)
            {
                if (trayItems[i].Kind == JsonKind.Null) continue;
                string path = Invariant($"blind.tray[{i}]");
                JsonNode[] t = p.ReadObject(trayItems[i], path, SlotMembers);
                if (t == null) return null;
                int id = p.ReadInt(t[0], path + ".id");
                int rot = p.ReadInt(t[1], path + ".rot");
                if (p.Failed) return null;
                if (id < 1) return p.Fail<BlindState>(SnapshotError.BadValue, path + ".id", "实例 id 从 1 起;空槽写 null");
                tray[i] = new TraySlot(id, rot);
            }

            int[] owner = ReadOwner(p, b[10]);
            if (owner == null) return null;
            List<int> deadCells = p.ReadIntList(b[11], "blind.dead");
            if (deadCells == null) return null;
            ulong dead = 0UL;
            for (int i = 0; i < deadCells.Count; i++)
            {
                string path = Invariant($"blind.dead[{i}]");
                if (!BoardCells.IsValid(deadCells[i])) return p.Fail<BlindState>(SnapshotError.BadValue, path, "格号在 0..63");
                if (i > 0 && deadCells[i] <= deadCells[i - 1]) return p.Fail<BlindState>(SnapshotError.BadValue, path, "格号须严格升序");
                dead |= BoardCells.BoardMaskBit(deadCells[i]);
            }

            List<int> discarded = p.ReadIntList(b[12], "blind.discarded");
            List<int> departed = p.ReadIntList(b[13], "blind.departed");
            if (p.Failed) return null;
            List<int> removed = p.ReadIntList(b[14], "blind.removed");
            if (removed == null) return null;
            List<BlockInstance> temp = ReadBlocks(p, b[15], "blind.tempBlocks");
            if (temp == null) return null;

            int placedKinds = p.ReadInt(b[16], "blind.placedKinds");
            List<int> typeCounts = p.ReadIntList(b[17], "blind.typeCounts");
            int lastClear = p.ReadInt(b[18], "blind.lastClear");
            bool comboShield = p.ReadBool(b[19], "blind.comboShield");
            bool bossSuppressed = p.ReadBool(b[20], "blind.bossSuppressed");
            if (p.Failed) return null;
            if (placedKinds < 0 || placedKinds >= 1 << Tetromino.KindCount)
            {
                return p.Fail<BlindState>(SnapshotError.BadValue, "blind.placedKinds", Invariant($"形状位掩码在 0..{(1 << Tetromino.KindCount) - 1}"));
            }
            if (typeCounts.Count != ClearTypes.Count)
            {
                return p.Fail<BlindState>(SnapshotError.Shape, "blind.typeCounts", Invariant($"应有 {ClearTypes.Count} 项"));
            }
            for (int i = 0; i < typeCounts.Count; i++)
            {
                if (typeCounts[i] < 0) return p.Fail<BlindState>(SnapshotError.BadValue, Invariant($"blind.typeCounts[{i}]"), "次数不能为负");
            }
            if (lastClear < -1 || lastClear >= ClearTypes.Count)
            {
                return p.Fail<BlindState>(SnapshotError.BadValue, "blind.lastClear", Invariant($"在 -1..{ClearTypes.Count - 1}"));
            }

            int boss = p.ReadInt(s[5], "blind.spec.boss");
            if (p.Failed) return null;
            if (boss != Bosses.None && !Bosses.IsKnown(boss))
            {
                return p.Fail<BlindState>(SnapshotError.BadValue, "blind.spec.boss", Invariant($"未登记的首领 {boss}"));
            }

            return BlindState.Restore(new BlindSpec(segment, layer, target, discards, groupSize, boss), outcome, failReason, step, group, score,
                combo, discardsLeft, placedKinds, typeCounts.ToArray(), lastClear, draw, tray, BoardState.Restore(owner, dead), discarded,
                departed, removed, temp, comboShield, bossSuppressed);
        }

        private static int[] ReadOwner(Parser p, JsonNode node)
        {
            List<JsonNode> rows = p.ReadArray(node, "blind.owner");
            if (rows == null) return null;
            if (rows.Count != BoardCells.Rows) return p.Fail<int[]>(SnapshotError.Shape, "blind.owner", Invariant($"应有 {BoardCells.Rows} 行"));
            var owner = new int[BoardCells.Count];
            for (int r = 0; r < BoardCells.Rows; r++)
            {
                string path = Invariant($"blind.owner[{r}]");
                List<JsonNode> cells = p.ReadArray(rows[r], path);
                if (cells == null) return null;
                if (cells.Count != BoardCells.Cols) return p.Fail<int[]>(SnapshotError.Shape, path, Invariant($"应有 {BoardCells.Cols} 列"));
                for (int c = 0; c < BoardCells.Cols; c++) owner[BoardCells.Index(r, c)] = p.ReadInt(cells[c], Invariant($"{path}[{c}]"));
            }
            return p.Failed ? null : owner;
        }

        private static List<BlockInstance> ReadBlocks(Parser p, JsonNode node, string path)
        {
            List<JsonNode> items = p.ReadArray(node, path);
            if (items == null) return null;
            var blocks = new List<BlockInstance>(items.Count);
            for (int i = 0; i < items.Count; i++)
            {
                string at = Invariant($"{path}[{i}]");
                JsonNode[] b = p.ReadObject(items[i], at, BlockMembers);
                if (b == null) return null;
                int id = p.ReadInt(b[0], at + ".id");
                TetrominoKind kind = p.ReadEnum<TetrominoKind>(b[1], at + ".kind");
                int points = p.ReadInt(b[2], at + ".points");
                Enhancement enhancement = p.ReadEnum<Enhancement>(b[3], at + ".enhancement");
                Edition edition = p.ReadEnum<Edition>(b[4], at + ".edition");
                if (p.Failed) return null;
                if (id < 1) return p.Fail<List<BlockInstance>>(SnapshotError.BadValue, at + ".id", "实例 id 从 1 起");
                blocks.Add(new BlockInstance(id, kind, points, enhancement, edition));
            }
            return blocks;
        }

        private static void WriteBlocks(CanonicalJsonWriter w, IReadOnlyList<BlockInstance> blocks)
        {
            w.BeginArray(JsonLayout.Lines);
            foreach (BlockInstance b in blocks)
            {
                w.BeginObject(JsonLayout.Inline)
                    .Name("id").Int(b.Id)
                    .Name("kind").String(NameOf(b.Kind))
                    .Name("points").Int(b.Points)
                    .Name("enhancement").String(NameOf(b.Enhancement))
                    .Name("edition").String(NameOf(b.Edition))
                    .End();
            }
            w.End();
        }

        private static void WriteIds(CanonicalJsonWriter w, IReadOnlyList<int> ids)
        {
            w.BeginArray(JsonLayout.Inline);
            foreach (int id in ids) w.Int(id);
            w.End();
        }

        // 64 位的量写成字符串,任何 JSON 工具打开都不丢精度:十进制给分数,16 位小写十六进制给随机流状态
        private static string Dec(long v) => v.ToString(CultureInfo.InvariantCulture);

        private static string Hex(ulong v) => v.ToString("x16", CultureInfo.InvariantCulture);

        private static string NameOf<T>(T value) where T : struct, Enum =>
            Enum.GetName(typeof(T), value) ?? throw new ArgumentException(Invariant($"{typeof(T).Name} 的值 {value} 没有名字:写档前状态须过 Validate"));

        private static string[] BuildTypeLevelMembers()
        {
            var names = new string[ClearTypes.Count];
            for (int t = 0; t < names.Length; t++) names[t] = NameOf((ClearType)t);
            return names;
        }

        /// <summary>
        /// 形状与取值的读取助手。只记第一处错:读失败返回零值或 null,之后的调用什么也不做;
        /// 调用方在拿值构造状态之前查 <see cref="Failed"/>,容器读失败(返回 null)当场返回。
        /// </summary>
        private sealed class Parser
        {
            public SnapshotReadResult Fault { get; private set; }

            public bool Failed => Fault != null;

            public RunState Fail(SnapshotError error, string path, string detail) => Fail<RunState>(error, path, detail);

            public T Fail<T>(SnapshotError error, string path, string detail) where T : class
            {
                if (Fault == null) Fault = SnapshotReadResult.Failure(error, path, detail);
                return null;
            }

            /// <summary>成员名与次序必须和 <paramref name="names"/> 逐个相同;返回按次序的成员值。</summary>
            public JsonNode[] ReadObject(JsonNode node, string path, string[] names)
            {
                if (Failed) return null;
                if (node.Kind != JsonKind.Object) return Fail<JsonNode[]>(SnapshotError.Shape, path, "应是对象");
                List<KeyValuePair<string, JsonNode>> members = node.Members;
                for (int i = 0; i < Math.Max(names.Length, members.Count); i++)
                {
                    if (i >= members.Count) return Fail<JsonNode[]>(SnapshotError.Shape, Child(path, names[i]), "缺这个成员");
                    string found = members[i].Key;
                    if (i < names.Length && found == names[i]) continue;
                    int expectedAt = Array.IndexOf(names, found);
                    if (expectedAt < 0) return Fail<JsonNode[]>(SnapshotError.Shape, Child(path, found), "多出的成员");
                    if (expectedAt < i) return Fail<JsonNode[]>(SnapshotError.Shape, Child(path, found), "重复的成员");
                    if (!HasMember(members, names[i])) return Fail<JsonNode[]>(SnapshotError.Shape, Child(path, names[i]), "缺这个成员");
                    return Fail<JsonNode[]>(SnapshotError.Shape, Child(path, names[i]), "次序不对:这里是 " + found);
                }
                var values = new JsonNode[names.Length];
                for (int i = 0; i < values.Length; i++) values[i] = members[i].Value;
                return values;
            }

            public List<JsonNode> ReadArray(JsonNode node, string path)
            {
                if (Failed) return null;
                if (node.Kind != JsonKind.Array) return Fail<List<JsonNode>>(SnapshotError.Shape, path, "应是数组");
                return node.Items;
            }

            public int ReadInt(JsonNode node, string path)
            {
                if (Failed) return 0;
                if (node.Kind != JsonKind.Integer)
                {
                    Fail<JsonNode>(SnapshotError.Shape, path, "应是整数");
                    return 0;
                }
                if (node.Integer < int.MinValue || node.Integer > int.MaxValue)
                {
                    Fail<JsonNode>(SnapshotError.OutOfRange, path, "超出 32 位");
                    return 0;
                }
                return (int)node.Integer;
            }

            public string ReadString(JsonNode node, string path)
            {
                if (Failed) return null;
                if (node.Kind != JsonKind.String) return Fail<string>(SnapshotError.Shape, path, "应是字符串");
                return node.String;
            }

            public bool ReadBool(JsonNode node, string path)
            {
                if (Failed) return false;
                if (node.Kind != JsonKind.Bool)
                {
                    Fail<JsonNode>(SnapshotError.Shape, path, "应是布尔");
                    return false;
                }
                return node.Bool;
            }

            /// <summary>规范的十进制整数串:写出端 <c>long.ToString(InvariantCulture)</c> 写得出的形状,不认 +、前导零、-0、空白。</summary>
            public long ReadDecimal(JsonNode node, string path)
            {
                string s = ReadString(node, path);
                if (s == null) return 0;
                if (!long.TryParse(s, NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture, out long v)
                    || v.ToString(CultureInfo.InvariantCulture) != s)
                {
                    Fail<JsonNode>(SnapshotError.BadValue, path, "应是规范的十进制整数串");
                    return 0;
                }
                return v;
            }

            /// <summary>16 位小写十六进制。</summary>
            public ulong ReadHex64(JsonNode node, string path)
            {
                string s = ReadString(node, path);
                if (s == null) return 0;
                ulong v = 0;
                bool ok = s.Length == 16;
                for (int i = 0; ok && i < s.Length; i++)
                {
                    char c = s[i];
                    if (c >= '0' && c <= '9') v = (v << 4) | (uint)(c - '0');
                    else if (c >= 'a' && c <= 'f') v = (v << 4) | (uint)(c - 'a' + 10);
                    else ok = false;
                }
                if (ok) return v;
                Fail<JsonNode>(SnapshotError.BadValue, path, "应是 16 位小写十六进制");
                return 0;
            }

            /// <summary>按名字精确匹配:不认数字、不忽略大小写。不用 Enum.Parse,它把 "3" 也当成合法值。</summary>
            public T ReadEnum<T>(JsonNode node, string path) where T : struct, Enum
            {
                string s = ReadString(node, path);
                if (s == null) return default;
                foreach (T v in (T[])Enum.GetValues(typeof(T)))
                {
                    if (string.Equals(Enum.GetName(typeof(T), v), s, StringComparison.Ordinal)) return v;
                }
                Fail<JsonNode>(SnapshotError.BadValue, path, "不认的 " + typeof(T).Name + " 名字");
                return default;
            }

            public List<int> ReadIntList(JsonNode node, string path)
            {
                List<JsonNode> items = ReadArray(node, path);
                if (items == null) return null;
                var list = new List<int>(items.Count);
                for (int i = 0; i < items.Count; i++) list.Add(ReadInt(items[i], Invariant($"{path}[{i}]")));
                return Failed ? null : list;
            }

            private static bool HasMember(List<KeyValuePair<string, JsonNode>> members, string name)
            {
                foreach (KeyValuePair<string, JsonNode> m in members)
                {
                    if (m.Key == name) return true;
                }
                return false;
            }

            private static string Child(string path, string name) => path.Length == 0 ? name : path + "." + name;
        }
    }
}
