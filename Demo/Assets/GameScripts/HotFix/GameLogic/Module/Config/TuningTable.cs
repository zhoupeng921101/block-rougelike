using System;
using Cysharp.Threading.Tasks;
using GameRules;
using Newtonsoft.Json.Linq;
using TEngine;
using UnityEngine;

/// <summary>
/// 数值表(阶段 5 的占位值):读 <c>AssetRaw/Configs/tuning.json</c> 覆盖 <see cref="RunTuning"/> 的默认值,
/// 和 <see cref="MinimalContent"/> 的内容一起拼成开局配置。启动时读一次,主界面打开之前完成;
/// 读不到或字段缺失就用 <see cref="RunTuning.Default"/>,并在日志里点出来。
/// </summary>
/// <remarks>表里只有数字;内容(基因/科技/改造/券/补给包的清单)仍在 <see cref="MinimalContent"/>。阶段 6 换成 Luban 表时,
/// 只要这里产出的还是 <see cref="RunTuning"/>,规则核心不用动。</remarks>
public sealed class TuningTable : Singleton<TuningTable>
{
    /// <summary>表的资源地址(YooAsset 按文件名寻址)。</summary>
    private const string TableLocation = "tuning";

    /// <summary>开局配置(内容 + 数值);没读表之前是空效果 + 默认数值。</summary>
    public RuleConfig Config { get; private set; } = MinimalContent.Config;

    /// <summary>当前生效的数值表。</summary>
    public RunTuning Tuning { get; private set; } = RunTuning.Default;

    /// <summary>启动时调一次:读表、覆盖数值、拼配置。读不到不抛,用默认值继续。</summary>
    public async UniTask LoadAsync()
    {
        RunTuning tuning = RunTuning.Default;
        TextAsset asset = await GameModule.Resource.LoadAssetAsync<TextAsset>(TableLocation);
        if (asset == null)
        {
            Log.Error("[Tuning] 读不到数值表:" + TableLocation + ",用默认值");
        }
        else
        {
            string json = asset.text;
            GameModule.Resource.UnloadAsset(asset);
            try
            {
                tuning = Parse(json);
            }
            catch (Exception e)
            {
                Log.Error("[Tuning] 数值表解析失败,用默认值:" + e.Message);
                tuning = RunTuning.Default;
            }
        }
        string invalid = tuning.Validate();
        if (invalid != null)
        {
            Log.Error("[Tuning] 数值表越界,用默认值:" + invalid);
            tuning = RunTuning.Default;
        }
        Tuning = tuning;
        Config = new RuleConfig(MinimalContent.Library, MinimalContent.ClearTypes, MinimalContent.Effects,
            MinimalContent.Catalog, tuning);
    }

    /// <summary>把表文本读成 <see cref="RunTuning"/>;缺的字段保持默认值。</summary>
    public static RunTuning Parse(string json)
    {
        var tuning = new RunTuning();
        JObject root = JObject.Parse(json);

        JObject run = Obj(root, "run");
        tuning.StartingMoney = Int(run, "startingMoney", tuning.StartingMoney);
        tuning.MapSegments = Int(run, "mapSegments", tuning.MapSegments);
        tuning.FirstTarget = Int(run, "firstTarget", tuning.FirstTarget);
        tuning.SegmentTargetPermille = Int(run, "segmentTargetPermille", tuning.SegmentTargetPermille);
        tuning.BaseDiscards = Int(run, "baseDiscards", tuning.BaseDiscards);
        tuning.DefaultGroupSize = Int(run, "defaultGroupSize", tuning.DefaultGroupSize);
        tuning.InterestPer = Int(run, "interestPer", tuning.InterestPer);
        tuning.InterestCap = Int(run, "interestCap", tuning.InterestCap);
        tuning.GeneSlots = Int(run, "geneSlots", tuning.GeneSlots);
        tuning.ConsumableSlots = Int(run, "consumableSlots", tuning.ConsumableSlots);

        JObject difficulty = Obj(root, "difficulty");
        tuning.Standard = Difficulty(difficulty, "standard", tuning.Standard);
        tuning.Advanced = Difficulty(difficulty, "advanced", tuning.Advanced);
        tuning.Expert = Difficulty(difficulty, "expert", tuning.Expert);

        JObject map = Obj(root, "map");
        tuning.LayerSecondPermille = Int(map, "layerSecondPermille", tuning.LayerSecondPermille);
        tuning.BossPermille = Int(map, "bossPermille", tuning.BossPermille);
        tuning.LightPermille = Int(map, "lightPermille", tuning.LightPermille);
        tuning.NormalPermille = Int(map, "normalPermille", tuning.NormalPermille);
        tuning.HeavyPermille = Int(map, "heavyPermille", tuning.HeavyPermille);
        tuning.RewardLight = Int(map, "rewardLight", tuning.RewardLight);
        tuning.RewardNormal = Int(map, "rewardNormal", tuning.RewardNormal);
        tuning.RewardHeavy = Int(map, "rewardHeavy", tuning.RewardHeavy);
        tuning.RewardBoss = Int(map, "rewardBoss", tuning.RewardBoss);

        JObject shop = Obj(root, "shop");
        tuning.GoodsCount = Int(shop, "goodsCount", tuning.GoodsCount);
        tuning.RerollBase = Int(shop, "rerollBase", tuning.RerollBase);
        tuning.RerollStep = Int(shop, "rerollStep", tuning.RerollStep);
        tuning.WeightGene = Int(shop, "weightGene", tuning.WeightGene);
        tuning.WeightBlock = Int(shop, "weightBlock", tuning.WeightBlock);
        tuning.WeightTech = Int(shop, "weightTech", tuning.WeightTech);
        tuning.WeightMod = Int(shop, "weightMod", tuning.WeightMod);
        tuning.GeneCommonPermille = Int(shop, "geneCommonPermille", tuning.GeneCommonPermille);
        tuning.GeneUncommonPermille = Int(shop, "geneUncommonPermille", tuning.GeneUncommonPermille);
        tuning.GeneRarePermille = Int(shop, "geneRarePermille", tuning.GeneRarePermille);
        tuning.GeneCommonShiftPermille = Int(shop, "geneCommonShiftPermille", tuning.GeneCommonShiftPermille);
        tuning.GeneUncommonShiftPermille = Int(shop, "geneUncommonShiftPermille", tuning.GeneUncommonShiftPermille);
        tuning.GeneRareShiftPermille = Int(shop, "geneRareShiftPermille", tuning.GeneRareShiftPermille);

        JObject boss = Obj(root, "boss");
        tuning.PresetBlocks = Int(boss, "presetBlocks", tuning.PresetBlocks);
        tuning.ShrinkBlocks = Int(boss, "shrinkBlocks", tuning.ShrinkBlocks);
        tuning.DeadCellCount = Int(boss, "deadCellCount", tuning.DeadCellCount);
        tuning.HighWallPermille = Int(boss, "highWallPermille", tuning.HighWallPermille);
        tuning.ShatterGroupSize = Int(boss, "shatterGroupSize", tuning.ShatterGroupSize);
        tuning.SpawnPerDeal = Int(boss, "spawnPerDeal", tuning.SpawnPerDeal);
        tuning.YawEverySteps = Int(boss, "yawEverySteps", tuning.YawEverySteps);

        JObject tag = Obj(root, "tag");
        tuning.TagCash = Int(tag, "cash", tuning.TagCash);
        tuning.TagBlocks = Int(tag, "blocks", tuning.TagBlocks);
        tuning.TagFallbackMoney = Int(tag, "fallbackMoney", tuning.TagFallbackMoney);
        tuning.TagDiscountPermille = Int(tag, "discountPermille", tuning.TagDiscountPermille);
        tuning.TagLightTargetPermille = Int(tag, "lightTargetPermille", tuning.TagLightTargetPermille);
        tuning.TagExtraDiscards = Int(tag, "extraDiscards", tuning.TagExtraDiscards);
        tuning.TagInterestCap = Int(tag, "interestCap", tuning.TagInterestCap);
        return tuning;
    }

    private static JObject Obj(JObject root, string name) => root[name] as JObject;

    private static int Int(JObject obj, string name, int fallback)
    {
        JToken token = obj?[name];
        return token == null || token.Type != JTokenType.Integer ? fallback : (int)token;
    }

    private static DifficultyTuning Difficulty(JObject obj, string name, DifficultyTuning fallback)
    {
        JObject row = obj?[name] as JObject;
        if (row == null) return fallback;
        return new DifficultyTuning(
            Int(row, "targetPermille", fallback.TargetPermille),
            Int(row, "discardDelta", fallback.DiscardDelta),
            Int(row, "interestCap", fallback.InterestCap),
            Int(row, "pricePermille", fallback.PricePermille));
    }
}
