using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 规则 §3.1、§4 补齐的机制:强化、版本(块与基因)、负片、重触发、成长计数、基因代价、换位与出售、
    /// 改造的使用(改块、删块、给钱、生成科技、改基因)、传说只在基因包、存档往返。
    /// </summary>
    public class CoreRulesCompletionTests
    {
        // 基因清单的号:纯形(×3,目标分 +25%)、首重(首格重触发 2 次)、叠层(成长计数)
        private const int PurityGene = 15;
        private const int FirstWeightGene = 103;
        private const int LayerGene = 81;

        private static RuleConfig ConfigOf(params LibraryEntry[] library) =>
            new RuleConfig(library, MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);

        /// <summary>两块 I 横放在第 7 行,第二块补满整行:一次单线消除,8 格两块各 4 格。</summary>
        private static StepResult ClearBottomRow(RunState run)
        {
            int[] ids = run.Blind.Tray.Where(s => !s.IsEmpty).Select(s => s.Id).Take(2).ToArray();
            TestRules.Place(run, ids[0], 0, 7, 0);
            return TestRules.Place(run, ids[1], 0, 7, 4);
        }

        private static RunState Started(RuleConfig config, long target = 100000, int discards = 3)
        {
            RunState run = RunState.NewRun(TestRules.Seed, config);
            run.StartBlind(new BlindSpec(1, 1, target, discards, 3));
            Assert.IsNull(run.Validate());
            return run;
        }

        [Test]
        public void Steel_AddsMultPerCleanedCell()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1, Enhancement.Steel), 6).ToArray()));
            StepResult step = ClearBottomRow(run);
            var steel = step.Events.OfType<EffectApplied>().Where(e => e.Source == EffectSource.Enhancement).ToList();
            Assert.AreEqual(8, steel.Count, "每被消 1 格触发一次强化");
            Assert.IsTrue(steel.All(e => e.AddMultPermille == CoreEffects.SteelMult * 1000));
        }

        [Test]
        public void Gold_GivesMoneyOncePerBlock()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1, Enhancement.Gold), 6).ToArray()));
            int before = run.Money;
            StepResult step = ClearBottomRow(run);
            Assert.AreEqual(2, step.Events.OfType<MoneyGained>().Count());
            Assert.AreEqual(before + 2 * CoreEffects.GoldMoney, run.Money);
        }

        [Test]
        public void Glass_MultipliesAndSometimesShatters_LeavingZonesConsistent()
        {
            int shattered = 0;
            for (int i = 0; i < 40 && shattered == 0; i++)
            {
                RuleConfig config = ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1, Enhancement.Glass), 6).ToArray());
                RunState run = RunState.NewRun(SeedText.FromEntropy((ulong)i + 5), config);
                run.StartBlind(new BlindSpec(1, 1, 100000, 3, 3));
                StepResult step = ClearBottomRow(run);
                Assert.AreEqual(8, step.Events.OfType<EffectApplied>().Count(e => e.XMultPermille == CoreEffects.GlassXMultPermille));
                List<BlockDestroyed> destroyed = step.Events.OfType<BlockDestroyed>().ToList();
                shattered += destroyed.Count;
                Assert.AreEqual(6 - destroyed.Count, run.Library.Count, "碎掉的块离开方块库");
                foreach (BlockDestroyed d in destroyed) Assert.IsNull(run.FindInstance(d.InstanceId));
                Assert.IsNull(run.Validate());
            }
            Assert.Greater(shattered, 0, "40 个种子里琉璃一次也没碎");
        }

        /// <summary>第 7 行由 O、I、O 拼满:两块 O 带不带万态决定算不算同形态。</summary>
        private static ClearType MixedRowType(Enhancement onO)
        {
            RunState run = Started(ConfigOf(
                new LibraryEntry(TetrominoKind.O, 1, onO), new LibraryEntry(TetrominoKind.O, 1, onO), new LibraryEntry(TetrominoKind.I, 1)));
            int[] o = run.Blind.Tray.Where(s => run.FindInstance(s.Id).Kind == TetrominoKind.O).Select(s => s.Id).ToArray();
            TestRules.Place(run, o[0], 0, 6, 0);
            TestRules.Place(run, o[1], 0, 6, 6);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 0, 7, 2);
            return step.Events.OfType<ClearResolved>().Single().Type;
        }

        [Test]
        public void Wild_MakesMixedShapesSameShape()
        {
            Assert.AreEqual(ClearType.SingleLine, MixedRowType(Enhancement.None));
            Assert.AreEqual(ClearType.SameShape, MixedRowType(Enhancement.Wild), "万态视作任意形态(规则 §4.4)");
        }

        [Test]
        public void BlockEdition_FoilAddsChipsPerCell()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1, Enhancement.None, Edition.Foil), 6).ToArray()));
            StepResult step = ClearBottomRow(run);
            var foil = step.Events.OfType<EffectApplied>().Where(e => e.Source == EffectSource.Edition).ToList();
            Assert.AreEqual(8, foil.Count);
            Assert.IsTrue(foil.All(e => e.AddChips == CoreEffects.BlockFoilChips));
        }

        [Test]
        public void GeneEdition_AdditiveBeforeBody_MultiplicativeAfter()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 6).ToArray()));
            run.AddGene(102, Edition.Holo);       // 本源:+4 倍率,带镭射
            run.AddGene(100, Edition.Polychrome); // 群聚:每带 1 个其他基因 +2 倍率,带多彩
            StepResult step = ClearBottomRow(run);
            var genes = step.Events.OfType<EffectApplied>().Where(e => e.Source == EffectSource.Gene).ToList();
            Assert.AreEqual(4, genes.Count);
            Assert.AreEqual(CoreEffects.GeneHoloMult * 1000, genes[0].AddMultPermille, "镭射在本体之前");
            Assert.AreEqual(4000, genes[1].AddMultPermille);
            Assert.AreEqual(2000, genes[2].AddMultPermille);
            Assert.AreEqual(CoreEffects.GenePolyXMultPermille, genes[3].XMultPermille, "多彩在本体之后");
            CollectionAssert.AreEqual(new[] { 0, 0, 1, 1 }, genes.Select(e => e.SourceIndex), "版本的加成记在它那一格基因上");
        }

        [Test]
        public void NegativeGene_DoesNotTakeASlot()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            for (int i = 0; i < run.GeneSlots; i++) Assert.IsTrue(run.TryAddGene(1));
            Assert.IsFalse(run.TryAddGene(2), "槽满");
            Assert.IsTrue(run.TryAddGene(2, Edition.Negative), "负片不占槽");
            Assert.AreEqual(run.GeneSlots, run.GeneSlotsUsed);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void MoveGene_ReordersAndChangesScore()
        {
            RunState a = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 6).ToArray()));
            RunState b = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 6).ToArray()));
            foreach (RunState run in new[] { a, b })
            {
                run.AddGene(64);  // 极连:×(1 + 0.2 × 连击)
                run.AddGene(102); // 本源:+4
            }
            Assert.IsTrue(b.MoveGene(1, 0));
            CollectionAssert.AreEqual(new[] { 102, 64 }, b.Genes.Select(g => g.GeneId));
            ClearBottomRow(a);
            ClearBottomRow(b);
            Assert.Greater(b.Blind.Score, a.Blind.Score, "+倍率放左边、×倍率放右边得分更高(规则 §3.1)");
        }

        [Test]
        public void Sell_GivesHalfPrice_AndRecycleRaisesIt()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            run.AddGene(12); // 重影,基础价 6
            int money = run.Money;
            Assert.AreEqual(3, run.SellGene(0));
            Assert.AreEqual(money + 3, run.Money);
            Assert.AreEqual(0, run.Genes.Count);

            run.AddMoney(20);
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.Recycle));
            run.AddGene(12);
            Assert.AreEqual(4, run.SellGene(0), "回收券:75% 向下取整");
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.Glass)));
            Assert.AreEqual(2, run.SellConsumable(0));
        }

        [Test]
        public void CostGene_RaisesOnlyTheNextBlindTarget()
        {
            RunState plain = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            RunState paid = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            Assert.IsTrue(paid.TryAddGene(PurityGene));
            Assert.IsTrue(paid.Genes[0].CostPending);
            foreach (RunState run in new[] { plain, paid }) Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            long baseTarget = plain.SpecForCurrentNode().Target;
            Assert.AreEqual(baseTarget * 1.25, paid.SpecForCurrentNode().Target, 1.0, "目标分 +25%,只做一次四舍五入");
            paid.StartBlindForCurrentNode();
            Assert.IsFalse(paid.Genes[0].CostPending, "开盲注时兑现,之后不再加");
        }

        [Test]
        public void RetriggerGene_RepeatsTheFirstCell()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 3), 6).ToArray()));
            run.AddGene(FirstWeightGene);
            StepResult step = ClearBottomRow(run);
            RepetitionGranted rep = step.Events.OfType<RepetitionGranted>().Single();
            int first = step.Events.OfType<ClearResolved>().Single().Cells[0];
            Assert.AreEqual(first, rep.Cell);
            Assert.AreEqual(2, rep.Count);
            Assert.AreEqual(10, step.Events.OfType<CellScored>().Count(), "8 格 + 首格多走 2 遍");
        }

        [Test]
        public void GrowthGene_CountsClearsAndDiscards()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 9).ToArray()));
            run.AddGene(LayerGene);
            ClearBottomRow(run);
            Assert.AreEqual(1, run.Genes[0].Counter);
            TestRules.Discard(run, run.Blind.Tray.First(s => !s.IsEmpty).Id);
            Assert.AreEqual(0, run.Genes[0].Counter);
            TestRules.Discard(run, run.Blind.Tray.First(s => !s.IsEmpty).Id);
            Assert.AreEqual(0, run.Genes[0].Counter, "计数不低于 0");
        }

        [Test]
        public void UseMod_EnhancesATrayBlockPermanently()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 6).ToArray()));
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.Steel)));
            int target = run.Blind.Tray[0].Id;
            Assert.AreEqual(UseReject.BadTarget, run.UseConsumable(0, 999).Reject);
            UseResult used = run.UseConsumable(0, target);
            Assert.IsTrue(used.Accepted);
            Assert.AreEqual(Enhancement.Steel, run.FindInstance(target).Enhancement);
            Assert.AreEqual(0, run.Consumables.Count);
            Assert.AreEqual(0, run.Blind.Step, "用改造不算一步");
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void UseMod_DestroyThinsTheLibrary_AndRedealsAnEmptyTray()
        {
            RunState run = RunState.NewRun(TestRules.Seed, ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 4).ToArray()));
            run.StartBlind(new BlindSpec(1, 1, 100000, 3, 1));
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.Destroy)));
            int target = run.Blind.Tray[0].Id;
            UseResult used = run.UseConsumable(0, target);
            Assert.IsTrue(used.Accepted);
            Assert.AreEqual(3, run.Library.Count, "删一块就少一次放置(规则 §5.3)");
            Assert.IsNotNull(used.Events.OfType<BlockDestroyed>().SingleOrDefault());
            Assert.IsNotNull(used.Events.OfType<GroupDealt>().SingleOrDefault(), "托盘空了就补发");
            Assert.IsFalse(run.Blind.Tray[0].IsEmpty);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void UseMod_DestroyOutsideABlindTargetsTheLibrary()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.Destroy)));
            int target = run.Library[5].Id;
            Assert.IsTrue(run.UseConsumable(0, target).Accepted);
            Assert.AreEqual(27, run.Library.Count);
            Assert.IsNull(run.FindInstance(target));
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void UseMod_MoneyTechAndGeneEdition()
        {
            RunState run = ShopStateTests.UnlockedAllClear(TestRules.Seed);
            run.AddMoney(30 - run.Money);
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.DoubleMoney)));
            Assert.IsTrue(run.UseConsumable(0).Accepted);
            Assert.AreEqual(30 + ModCatalog.DoubleMoneyCap, run.Money, "翻倍有上限");

            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.MakeTech)));
            Assert.IsTrue(run.UseConsumable(0).Accepted);
            CollectionAssert.AreEqual(new[] { ConsumableItem.Tech(MinimalContent.TechOf(ClearType.AllClear)) }, run.Consumables,
                "只生成已解锁的科技");
            Assert.Greater(run.SellConsumable(0), 0);

            run.AddGene(1);
            int successes = 0;
            for (int i = 0; i < 40; i++)
            {
                Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.GeneEdition)));
                UseResult used = run.UseConsumable(0, 0);
                if (used.Reject == UseReject.BadTarget)
                {
                    run.SellConsumable(0);
                    break;
                }
                Assert.IsTrue(used.Accepted);
                if (used.Events.OfType<ConsumableUsed>().Single().Succeeded) successes++;
            }
            Assert.AreEqual(1, successes, "成功一次之后基因已有版本,不能再镀");
            Assert.AreNotEqual(Edition.None, run.Genes[0].Edition);
            Assert.AreNotEqual(Edition.Negative, run.Genes[0].Edition);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void MakeTech_IsRejectedBeforeAnyTypeWasPlayed()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.MakeTech)));
            Assert.AreEqual(UseReject.NotUsable, run.UseConsumable(0).Reject);
            Assert.AreEqual(1, run.Consumables.Count, "被拒不消耗");
        }

        [Test]
        public void Legendary_NeverInShopGoods_ButCanAppearInGenePacks()
        {
            bool inPack = false;
            for (int i = 0; i < 300; i++)
            {
                RunState run = RunState.NewRun(SeedText.FromEntropy((ulong)i * 7919UL + 3UL), MinimalContent.Config);
                ShopState shop = ShopState.Open(run.Rng.Get(RngKeys.Shop(1, 1)), run, true, false);
                Assert.IsFalse(shop.Goods.Any(g => g.Kind == ItemKind.Gene && g.Id == GeneTable.Legendary1), "传说不进商店");
                BoosterPack pack = BoosterPack.Open(run.Rng.Get(RngKeys.Shop(1, 1)), run, BoosterPack.GenePack);
                if (pack.Options.Any(o => o.Id == GeneTable.Legendary1)) inPack = true;
            }
            Assert.IsTrue(inPack, "300 个基因包里一张传说都没有");
        }

        [Test]
        public void Snapshot_RoundTripsGeneStateConsumablesAndTypeCounts()
        {
            RunState run = Started(ConfigOf(Enumerable.Repeat(new LibraryEntry(TetrominoKind.I, 1), 9).ToArray()));
            run.AddGene(LayerGene, Edition.Foil);
            run.AddGene(PurityGene, Edition.Negative);
            ClearBottomRow(run);
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Tech(1)));
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(ModCatalog.Wild)));
            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, run.Config);
            Assert.IsTrue(read.Ok, read.Detail);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
            Assert.AreEqual(1, read.State.Genes[0].Counter);
            Assert.AreEqual(Edition.Negative, read.State.Genes[1].Edition);
            Assert.IsTrue(read.State.Genes[1].CostPending);
            Assert.AreEqual(1, read.State.TypeCounts.Sum(), "打出过一次消除");
        }
    }
}
