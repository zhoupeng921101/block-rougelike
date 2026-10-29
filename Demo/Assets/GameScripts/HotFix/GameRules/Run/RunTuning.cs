using System;

namespace GameRules
{
    /// <summary>难度档对一局参数的修正(局外循环设计稿 §5):三档,只改目标分、弃置、利息封顶与价格。</summary>
    public readonly struct DifficultyTuning
    {
        public readonly int TargetPermille;
        public readonly int DiscardDelta;
        public readonly int InterestCap;
        public readonly int PricePermille;

        public DifficultyTuning(int targetPermille, int discardDelta, int interestCap, int pricePermille)
        {
            TargetPermille = targetPermille;
            DiscardDelta = discardDelta;
            InterestCap = interestCap;
            PricePermille = pricePermille;
        }
    }

    /// <summary>
    /// 一局的数值表(阶段 5 的占位值,阶段 6 定标)。全部集中在这里,<see cref="Default"/> 的值等于代码里原来的常量;
    /// 游戏从 <c>AssetRaw/Configs/tuning.json</c> 读一份覆盖它(<c>GameLogic</c> 的 TuningTable),测试与缺表时用默认值。
    /// 只装数字,不装内容:基因/科技/改造/券/补给包的清单仍在 <see cref="MinimalContent"/>。
    /// </summary>
    public sealed class RunTuning
    {
        // ── 一局 ──
        public int StartingMoney = 4;
        public int MapSegments = 6;
        public int FirstTarget = 350;
        public int SegmentTargetPermille = 2300;
        public int BaseDiscards = 3;
        public int DefaultGroupSize = 3;
        public int InterestPer = 10;
        public int InterestCap = 50;
        public int GeneSlots = 4;
        public int ConsumableSlots = 2;

        // ── 难度三档 ──
        public DifficultyTuning Standard = new DifficultyTuning(1000, 0, 50, 1000);
        public DifficultyTuning Advanced = new DifficultyTuning(1150, -1, 50, 1000);
        public DifficultyTuning Expert = new DifficultyTuning(1300, -1, 25, 1200);

        // ── 地图节点 ──
        public int LayerSecondPermille = 1500;
        public int BossPermille = 2100;
        public int LightPermille = 900;
        public int NormalPermille = 1000;
        public int HeavyPermille = 1100;
        public int RewardLight = 3;
        public int RewardNormal = 4;
        public int RewardHeavy = 5;
        public int RewardBoss = 6;

        // ── 商店 ──
        public int GoodsCount = 4;
        public int RerollBase = 5;
        public int RerollStep = 1;
        public int WeightGene = 60;
        public int WeightBlock = 16;
        public int WeightTech = 12;
        public int WeightMod = 12;
        public int GeneCommonPermille = 700;
        public int GeneUncommonPermille = 250;
        public int GeneRarePermille = 50;
        public int GeneCommonShiftPermille = 600;
        public int GeneUncommonShiftPermille = 300;
        public int GeneRareShiftPermille = 100;

        // ── 首领 ──
        public int PresetBlocks = 6;
        public int ShrinkBlocks = 4;
        public int DeadCellCount = 5;
        public int HighWallPermille = 1300;
        public int ShatterGroupSize = 2;
        public int SpawnPerDeal = 1;
        public int YawEverySteps = 4;

        // ── 标签 ──
        public int TagCash = 6;
        public int TagBlocks = 3;
        public int TagFallbackMoney = 3;
        public int TagDiscountPermille = 750;
        public int TagLightTargetPermille = 850;
        public int TagExtraDiscards = 2;
        public int TagInterestCap = 20;

        /// <summary>代码里的默认值;测试与非游戏路径用它。</summary>
        public static RunTuning Default { get; } = new RunTuning();

        public DifficultyTuning DifficultyOf(RunDifficulty difficulty)
        {
            switch (difficulty)
            {
                case RunDifficulty.Standard: return Standard;
                case RunDifficulty.Advanced: return Advanced;
                case RunDifficulty.Expert: return Expert;
                default: throw new ArgumentOutOfRangeException(nameof(difficulty), difficulty, "没定义的难度档");
            }
        }

        /// <summary>节点的目标分倍率(千分值):大盲是层 1 的 ×1.5,首领 ×2.1;普通节点再乘轻/中/重。</summary>
        public int NodeTargetPermille(MapNode node)
        {
            if (node.IsBoss) return BossPermille;
            int layer = node.Layer == 1 ? 1000 : LayerSecondPermille;
            int strength = node.Strength == NodeStrength.Light ? LightPermille
                : node.Strength == NodeStrength.Normal ? NormalPermille
                : HeavyPermille;
            return layer * strength / 1000;
        }

        /// <summary>节点的通关奖励(美元)。</summary>
        public int NodeReward(MapNode node)
        {
            switch (node.Strength)
            {
                case NodeStrength.Light: return RewardLight;
                case NodeStrength.Normal: return RewardNormal;
                case NodeStrength.Heavy: return RewardHeavy;
                default: return RewardBoss;
            }
        }

        /// <summary>基因稀有度权重(千分比);稀券把普通往下压、往上挪给罕见与稀有。</summary>
        public void GeneWeights(bool shift, out int common, out int uncommon, out int rare)
        {
            common = shift ? GeneCommonShiftPermille : GeneCommonPermille;
            uncommon = shift ? GeneUncommonShiftPermille : GeneUncommonPermille;
            rare = shift ? GeneRareShiftPermille : GeneRarePermille;
        }

        /// <summary>数值表自身的下限校验:开局前查一遍,错在表里而不是打到一半才炸。</summary>
        public string Validate()
        {
            if (StartingMoney < 0) return "startingMoney 不能为负";
            if (MapSegments < 1) return "mapSegments 至少 1";
            if (FirstTarget < 0) return "firstTarget 不能为负";
            if (SegmentTargetPermille < 1000) return "segmentTargetPermille 至少 1000";
            if (BaseDiscards < 0) return "baseDiscards 不能为负";
            if (DefaultGroupSize < 1 || DefaultGroupSize > BlindSpec.MaxGroupSize) return "defaultGroupSize 越界";
            if (InterestPer < 1) return "interestPer 至少 1";
            if (InterestCap < 0) return "interestCap 不能为负";
            if (GoodsCount < 1) return "goodsCount 至少 1";
            if (RerollBase < 0 || RerollStep < 0) return "刷新费不能为负";
            if (WeightGene + WeightBlock + WeightTech + WeightMod <= 0) return "商店权重之和必须为正";
            return null;
        }
    }
}
