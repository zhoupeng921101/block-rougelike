using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>几组单测共用的开局、走步与转储。走步助手每步之后都断言 <see cref="RunState.Validate"/>(06 的不变式与区守恒、09 §5 的稳定态)。</summary>
    internal static class TestRules
    {
        public const string Seed = "TESTSEED";

        public static RuleConfig Config(params LibraryEntry[] library) => Config(new EffectRegistry(), library);

        public static RuleConfig Config(EffectRegistry effects, params LibraryEntry[] library) =>
            new RuleConfig(library, PlaceholderTuning.ClearTypes, effects);

        public static BlindSpec Spec(long target = 350, int discards = 3, int groupSize = 3) => new BlindSpec(1, 1, target, discards, groupSize);

        public static LibraryEntry[] Repeat(int n, TetrominoKind kind, int points = 1) =>
            Enumerable.Repeat(new LibraryEntry(kind, points), n).ToArray();

        public static RunState Started(RuleConfig config, BlindSpec spec)
        {
            RunState run = RunState.NewRun(Seed, config);
            run.StartBlind(spec);
            Assert.IsNull(run.Validate());
            return run;
        }

        /// <summary>待放置区里第一块满足条件的。</summary>
        public static int InTray(RunState run, Func<BlockInstance, bool> match)
        {
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (!slot.IsEmpty && match(run.FindInstance(slot.Id))) return slot.Id;
            }
            Assert.Fail("待放置区里没有要找的块");
            return 0;
        }

        public static int InTray(RunState run, TetrominoKind kind) => InTray(run, b => b.Kind == kind);

        public static StepResult Place(RunState run, int id, int rot, int row, int col) => Accepted(run, run.Place(id, rot, row, col));

        public static StepResult Place(RunState run, TetrominoKind kind, int rot, int row, int col) => Place(run, InTray(run, kind), rot, row, col);

        public static StepResult Discard(RunState run, int id) => Accepted(run, run.Discard(id));

        public static StepResult Accepted(RunState run, StepResult result)
        {
            Assert.AreEqual(StepReject.None, result.Reject);
            Assert.AreEqual(run.Blind.Step, result.Step);
            Assert.IsInstanceOf<StepEnded>(result.Events.Last(), "每步最后一个事件是 StepEnded");
            Assert.AreEqual(1, result.Events.OfType<StepEnded>().Count());
            Assert.IsNull(run.Validate());
            return result;
        }

        public static List<T> Of<T>(this StepResult result) where T : RuleEvent => result.Events.OfType<T>().ToList();

        public static T Single<T>(this StepResult result) where T : RuleEvent => result.Events.OfType<T>().Single();

        private static string Inv(FormattableString s) => FormattableString.Invariant(s);

        /// <summary>测试用的全量转储:只为比较「状态变没变」,不是存档格式。</summary>
        public static string Dump(RunState run)
        {
            var sb = new StringBuilder();
            sb.Append(Inv($"seed={run.Seed} next={run.NextInstanceId}\n"));
            foreach (BlockInstance b in run.Library) sb.Append(Inv($"lib {b.Id} {b.Kind} {b.Points} {b.Enhancement} {b.Edition}\n"));
            sb.Append("levels=").Append(string.Join(",", run.TypeLevels.Select(l => l.ToString(CultureInfo.InvariantCulture)))).Append('\n');
            sb.Append("genes=").Append(string.Join(",", run.Genes.Select(g => g.GeneId.ToString(CultureInfo.InvariantCulture)))).Append('\n');
            foreach (RngStreamState s in run.Rng.Export()) sb.Append(Inv($"rng {s.Key} {s.S0:x16} {s.S1:x16}\n"));
            BlindState b2 = run.Blind;
            sb.Append(Inv($"blind {b2.Outcome} {b2.FailReason} step={b2.Step} group={b2.Group} score={b2.Score} combo={b2.Combo} discards={b2.DiscardsLeft}\n"));
            sb.Append("draw=").Append(string.Join(",", b2.Draw)).Append('\n');
            for (int i = 0; i < b2.Tray.Count; i++) sb.Append(Inv($"tray[{i}]={b2.Tray[i].Id}@{b2.Tray[i].Rot}\n"));
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                sb.Append(Inv($"{b2.Board.OwnerAt(cell)}{(b2.Board.IsDead(cell) ? "x" : "")} "));
            }
            sb.Append('\n');
            sb.Append("discarded=").Append(string.Join(",", b2.Discarded)).Append('\n');
            sb.Append("departed=").Append(string.Join(",", b2.Departed)).Append('\n');
            sb.Append(Inv($"temp={b2.TempBlocks.Count}\n"));
            return sb.ToString();
        }
    }
}
