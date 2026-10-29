using System;

namespace GameRules
{
    /// <summary>
    /// 首领的负面效果(局外循环设计稿 §7.2):8 个,只挂在第 3 层的首领场上。
    /// 段 1–6 各有一组候选,生成地图时按 <c>map</c> 那条流抽一个,存进 <see cref="MapNode.BossId"/>,
    /// 进盲注时再拷进 <see cref="BlindSpec.BossId"/>。参数全部是阶段 5 的占位值,集中在这里,阶段 6 定标时一处改。
    /// </summary>
    public static class Bosses
    {
        /// <summary>不是首领场(或没抽到)。</summary>
        public const int None = 0;

        /// <summary>预置盲:开局预置 6 块。</summary>
        public const int Preset = 1;

        /// <summary>紧缩盲:本盲注方块库 −4 块。</summary>
        public const int Shrink = 2;

        /// <summary>死格盲:开局随机 5 格变死格。</summary>
        public const int DeadCells = 3;

        /// <summary>高墙盲:目标分 ×1.3。</summary>
        public const int HighWall = 4;

        /// <summary>碎组盲:本盲注每组只发 2 块。</summary>
        public const int Shatter = 5;

        /// <summary>断弃盲:本盲注弃置 0 次。</summary>
        public const int NoDiscard = 6;

        /// <summary>增殖盲:每发一组,在随机空格生成 1 块。</summary>
        public const int Spawn = 7;

        /// <summary>偏航盲:每 4 步把网格整体旋转 90°(含块)。</summary>
        public const int Yaw = 8;

        public const int PresetBlocks = 6;
        public const int ShrinkBlocks = 4;
        public const int DeadCellCount = 5;
        public const int HighWallPermille = 1300;
        public const int ShatterGroupSize = 2;
        public const int SpawnPerDeal = 1;
        public const int YawEverySteps = 4;

        /// <summary>预置块的点数(设计稿没写,先按 1,待定标)。</summary>
        public const int TempPoints = 1;

        /// <summary>生成预置块时的尝试次数上限:随机朝向与落点放不下就重抽,抽满就少放一块。</summary>
        private const int SpawnAttempts = 24;

        /// <summary>七种骨牌(<see cref="TetrominoKind"/>)。</summary>
        private const int KindCount = 7;

        // 段 → 候选(设计稿「出场段」):前期是通用轻压制,后期才放反制构筑的那两个
        private static readonly int[][] BySegment =
        {
            new[] { Preset, Shrink },
            new[] { Preset, Shrink, DeadCells, HighWall },
            new[] { DeadCells, HighWall, Shatter, NoDiscard },
            new[] { HighWall, Shatter, NoDiscard, Spawn },
            new[] { NoDiscard, Spawn, Yaw },
            new[] { Spawn, Yaw },
        };

        public static bool IsKnown(int boss) => boss >= Preset && boss <= Yaw;

        public static string Name(int boss)
        {
            switch (boss)
            {
                case None: return "无";
                case Preset: return "预置盲";
                case Shrink: return "紧缩盲";
                case DeadCells: return "死格盲";
                case HighWall: return "高墙盲";
                case Shatter: return "碎组盲";
                case NoDiscard: return "断弃盲";
                case Spawn: return "增殖盲";
                case Yaw: return "偏航盲";
                default: return "首领 " + boss;
            }
        }

        /// <summary>该段的首领候选(只读,给预览与单测用)。超过 6 段时沿用最后一段的候选。</summary>
        public static int[] CandidatesOf(int segment)
        {
            if (segment < 1) return Array.Empty<int>();
            int index = Math.Min(segment, BySegment.Length) - 1;
            return (int[])BySegment[index].Clone();
        }

        /// <summary>按 <c>map</c> 那条流给这一段抽一个首领;段超出候选表返回 <see cref="None"/>。</summary>
        public static int Pick(int segment, IRandomSource rng)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            int[] list = CandidatesOf(segment);
            return list.Length == 0 ? None : list[rng.Index(list.Length)];
        }

        /// <summary>目标分修正(千分值):高墙盲 ×1.3,其余不修。</summary>
        public static int TargetPermille(int boss, RunTuning tuning = null) =>
            boss == HighWall ? (tuning ?? RunTuning.Default).HighWallPermille : 1000;

        /// <summary>目标分修正(千分值)的别名,给规格计算用。</summary>
        public static int BossPermilleOf(int boss, RunTuning tuning = null) => TargetPermille(boss, tuning);

        /// <summary>每组块数:碎组盲压到 2;券加过也压回去(首领效果优先于券,设计稿 §7.2)。</summary>
        public static int GroupSize(int groupSize, int boss, RunTuning tuning = null) =>
            boss == Shatter ? Math.Min(groupSize, (tuning ?? RunTuning.Default).ShatterGroupSize) : groupSize;

        /// <summary>弃置次数:断弃盲归零。</summary>
        public static int Discards(int discards, int boss, RunTuning tuning = null) => boss == NoDiscard ? 0 : discards;

        /// <summary>开局预置 / 增殖用的随机形状落点:放得下才落,避免直接凑成一条线。</summary>
        internal static void SpawnBlocks(BlindState blind, IRandomSource rng, RunState run, int count)
        {
            for (int i = 0; i < count; i++)
            {
                for (int attempt = 0; attempt < SpawnAttempts; attempt++)
                {
                    var kind = (TetrominoKind)rng.Index(KindCount);
                    int rot = rng.Index(4);
                    int row = rng.Index(BoardCells.Rows);
                    int col = rng.Index(BoardCells.Cols);
                    if (!blind.Board.CanPlace(kind, rot, row, col)) continue;
                    ClearResult probe = blind.Board.FullLinesAfter(kind, rot, row, col, out _);
                    if (probe.Rows.Count + probe.Cols.Count > 0) continue;
                    var block = new BlockInstance(run.IssueId(), kind, TempPoints, Enhancement.None, Edition.None);
                    blind.TempList.Add(block);
                    blind.Board.Place(block, rot, row, col);
                    break;
                }
            }
        }

        /// <summary>随机把空格标成死格;可选的格不够就有几格标几格。</summary>
        internal static void MarkDeadCells(BlindState blind, IRandomSource rng, int count)
        {
            var cells = new System.Collections.Generic.List<int>(BoardCells.Count);
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (blind.Board.OwnerAt(cell) == 0 && !blind.Board.IsDead(cell)) cells.Add(cell);
            }
            int take = Math.Min(count, cells.Count);
            for (int i = 0; i < take; i++)
            {
                int j = i + rng.Index(cells.Count - i);
                int swap = cells[i];
                cells[i] = cells[j];
                cells[j] = swap;
                blind.Board.SetDead(cells[i]);
            }
        }
    }
}
