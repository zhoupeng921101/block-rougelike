using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 首个盲注的占位数值(11 号票),全部待定标:阶段 6 定标时整体替换;阶段 5 接 Luban 时,开新局那一处改从表构造同样的参数,再删掉本文件。
    /// 规则逻辑不读它,只有开新局、dotnet 单测、Sim 三处引用。
    /// </summary>
    public static class PlaceholderTuning
    {
        /// <summary>七种骨牌 × 点数 1–4 各一块,按 <see cref="TetrominoKind"/> 序、同种按点数升序,共 28 块;强化、版本都是「无」。</summary>
        public static IReadOnlyList<LibraryEntry> DefaultLibrary { get; } = BuildDefaultLibrary();

        /// <summary>11 种类型各只有 1 级:底注从单线 10 到清屏 60 每级 +5,倍率 ×1 / ×2 / ×3 / ×4 四档。</summary>
        public static ClearTypeTable ClearTypes { get; } = new ClearTypeTable(new[]
        {
            new ClearTypeRow(ClearType.AllClear, 1, 60, 4),
            new ClearTypeRow(ClearType.FiveLine, 1, 55, 4),
            new ClearTypeRow(ClearType.SameShapeCross, 1, 50, 4),
            new ClearTypeRow(ClearType.MultiLine, 1, 45, 3),
            new ClearTypeRow(ClearType.SameShape, 1, 40, 3),
            new ClearTypeRow(ClearType.TripleLine, 1, 35, 3),
            new ClearTypeRow(ClearType.Corner, 1, 30, 2),
            new ClearTypeRow(ClearType.Cross, 1, 25, 2),
            new ClearTypeRow(ClearType.Parallel, 1, 20, 2),
            new ClearTypeRow(ClearType.DoubleLine, 1, 15, 2),
            new ClearTypeRow(ClearType.SingleLine, 1, 10, 1),
        });

        /// <summary>本图没有任何强化、版本、基因效果,注册表是空的。</summary>
        public static RuleConfig Config { get; } = new RuleConfig(DefaultLibrary, ClearTypes, new EffectRegistry());

        /// <summary>第 1 段第 1 层:目标 350、弃置 3 次。每组 3 块是规则默认值(§2.1),不是占位。</summary>
        public static BlindSpec FirstBlind { get; } = new BlindSpec(segment: 1, layer: 1, target: 350, discards: 3, groupSize: 3);

        private static IReadOnlyList<LibraryEntry> BuildDefaultLibrary()
        {
            var list = new List<LibraryEntry>(Tetromino.KindCount * 4);
            for (int kind = 0; kind < Tetromino.KindCount; kind++)
            {
                for (int points = 1; points <= 4; points++) list.Add(new LibraryEntry((TetrominoKind)kind, points));
            }
            return list.AsReadOnly();
        }
    }
}
