using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 判线定类型(<see cref="RunState.ResolveClear"/>)与被消格的结算次序。盘面直接用 BoardState.Place 摆:这里只问只读查询,不走步,所以不查区守恒。
    /// 格号 = row*8 + col;I 的 rot 0 横放、rot 1 竖放,T 的 rot 2 是「上横三格、下中一格」。
    /// </summary>
    public class ClearRulesTests
    {
        private RunState _run;
        private readonly Dictionary<TetrominoKind, int> _nextOfKind = new Dictionary<TetrominoKind, int>();

        private const int PerKind = 20;

        [SetUp]
        public void SetUp()
        {
            // 每种 20 块,点数 1:种类 k 的 id 是 k*20+1 .. k*20+20
            var library = new List<LibraryEntry>();
            for (int k = 0; k < Tetromino.KindCount; k++) library.AddRange(TestRules.Repeat(PerKind, (TetrominoKind)k));
            _run = TestRules.Started(TestRules.Config(library.ToArray()), TestRules.Spec(groupSize: 3));
            // 洗牌后托盘里有三块;这里只用 FindInstance 认块,盘面从空起摆
            _nextOfKind.Clear();
        }

        private int Next(TetrominoKind kind)
        {
            _nextOfKind.TryGetValue(kind, out int n);
            _nextOfKind[kind] = n + 1;
            Assert.Less(n, PerKind);
            return (int)kind * PerKind + n + 1;
        }

        private void Put(TetrominoKind kind, int rot, int row, int col) => _run.Blind.Board.Place(_run.FindInstance(Next(kind)), rot, row, col);

        private ClearResolution Try(TetrominoKind kind, int rot, int row, int col)
        {
            ClearResolution r = _run.ResolveClear(Next(kind), rot, row, col);
            Assert.IsTrue(r.Legal);
            return r;
        }

        private static IEnumerable<int> Row(int r) => Enumerable.Range(0, 8).Select(c => r * 8 + c);

        private static IEnumerable<int> Col(int c, params int[] skipRows) =>
            Enumerable.Range(0, 8).Where(r => !skipRows.Contains(r)).Select(r => r * 8 + c);

        [Test]
        public void SingleLine()
        {
            Put(TetrominoKind.O, 0, 6, 0);
            Put(TetrominoKind.I, 0, 7, 2);
            ClearResolution r = Try(TetrominoKind.O, 0, 6, 6);
            Assert.AreEqual(ClearType.SingleLine, r.Type);
            CollectionAssert.AreEqual(new[] { 7 }, r.Rows);
            CollectionAssert.IsEmpty(r.Cols);
            CollectionAssert.AreEqual(Row(7), r.Cells);
        }

        [Test]
        public void SameShape_SingleLineOfOneKind()
        {
            Put(TetrominoKind.O, 0, 0, 0);
            Put(TetrominoKind.I, 0, 7, 0);
            Assert.AreEqual(ClearType.SameShape, Try(TetrominoKind.I, 0, 7, 4).Type);
        }

        [Test]
        public void AllClear_WinsOverSingleLineAndSameShape()
        {
            Put(TetrominoKind.I, 0, 7, 0);
            ClearResolution r = Try(TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(ClearType.AllClear, r.Type, "单线、同形态、清屏同时成立,取清屏");
        }

        [Test]
        public void AllClear_IgnoresDeadCells()
        {
            _run.Blind.Board.SetDead(0);
            Put(TetrominoKind.I, 0, 7, 0);
            Assert.AreEqual(ClearType.AllClear, Try(TetrominoKind.I, 0, 7, 4).Type, "死格不算方块");
        }

        [Test]
        public void DoubleLine_TwoRowsApart()
        {
            Put(TetrominoKind.I, 0, 0, 0);
            Put(TetrominoKind.T, 2, 0, 4);
            Put(TetrominoKind.I, 0, 3, 0);
            Put(TetrominoKind.T, 2, 3, 4);
            ClearResolution r = Try(TetrominoKind.I, 1, 0, 7);
            Assert.AreEqual(ClearType.DoubleLine, r.Type);
            CollectionAssert.AreEqual(new[] { 0, 3 }, r.Rows);
        }

        [Test]
        public void Parallel_TwoAdjacentRows()
        {
            Put(TetrominoKind.I, 0, 0, 0);
            Put(TetrominoKind.I, 0, 1, 0);
            Put(TetrominoKind.O, 0, 0, 4);
            Put(TetrominoKind.O, 0, 6, 0);
            ClearResolution r = Try(TetrominoKind.O, 0, 0, 6);
            Assert.AreEqual(ClearType.Parallel, r.Type);
            CollectionAssert.AreEqual(Row(0).Concat(Row(1)), r.Cells);
        }

        [Test]
        public void Cross_OrdersRowFirstAndGivesTheCrossCellToTheRow()
        {
            Put(TetrominoKind.O, 0, 0, 2);
            Put(TetrominoKind.O, 0, 6, 2);
            Put(TetrominoKind.T, 2, 3, 0);
            Put(TetrominoKind.I, 0, 3, 4);
            ClearResolution r = Try(TetrominoKind.I, 1, 2, 3);
            Assert.AreEqual(ClearType.Cross, r.Type);
            CollectionAssert.AreEqual(new[] { 3 }, r.Rows);
            CollectionAssert.AreEqual(new[] { 3 }, r.Cols);
            CollectionAssert.AreEqual(Row(3).Concat(Col(3, 3)), r.Cells, "先走行,再走列;交叉格 27 只在行里出现");
            Assert.AreEqual(15, r.Cells.Count);
            Assert.AreEqual(r.Cells.Count, r.Cells.Distinct().Count());
        }

        [Test]
        public void Corner_WinsOverCross()
        {
            Put(TetrominoKind.I, 0, 0, 2);
            Put(TetrominoKind.O, 0, 0, 6);
            Put(TetrominoKind.I, 1, 2, 0);
            Put(TetrominoKind.O, 0, 6, 0);
            ClearResolution r = Try(TetrominoKind.O, 0, 0, 0);
            Assert.AreEqual(ClearType.Corner, r.Type, "一行一列、交点在角上:拐角,不是十字");
            CollectionAssert.AreEqual(Row(0).Concat(Col(0, 0)), r.Cells);
        }

        [Test]
        public void SameShapeCross_WinsOverCross()
        {
            Put(TetrominoKind.I, 1, 0, 5);
            Put(TetrominoKind.I, 1, 0, 6);
            Put(TetrominoKind.I, 1, 0, 7);
            Put(TetrominoKind.I, 0, 3, 1);
            Put(TetrominoKind.I, 1, 4, 0);
            ClearResolution r = Try(TetrominoKind.I, 1, 0, 0);
            Assert.AreEqual(ClearType.SameShapeCross, r.Type, "一行一列、全是 I(横竖都算同一种)");
            CollectionAssert.AreEqual(new[] { 3 }, r.Rows);
            CollectionAssert.AreEqual(new[] { 0 }, r.Cols);
        }

        [Test]
        public void TripleLine()
        {
            Put(TetrominoKind.O, 0, 4, 0);
            Put(TetrominoKind.O, 0, 6, 0);
            Put(TetrominoKind.I, 0, 5, 2);
            Put(TetrominoKind.I, 0, 6, 2);
            Put(TetrominoKind.I, 0, 7, 2);
            Put(TetrominoKind.I, 1, 4, 6);
            ClearResolution r = Try(TetrominoKind.I, 1, 4, 7);
            Assert.AreEqual(ClearType.TripleLine, r.Type);
            CollectionAssert.AreEqual(new[] { 5, 6, 7 }, r.Rows);
        }

        [Test]
        public void MultiLine()
        {
            Put(TetrominoKind.O, 0, 0, 0);
            Put(TetrominoKind.O, 0, 4, 0);
            Put(TetrominoKind.O, 0, 6, 0);
            for (int row = 4; row < 8; row++) Put(TetrominoKind.I, 0, row, 2);
            Put(TetrominoKind.I, 1, 4, 6);
            ClearResolution r = Try(TetrominoKind.I, 1, 4, 7);
            Assert.AreEqual(ClearType.MultiLine, r.Type);
            CollectionAssert.AreEqual(new[] { 4, 5, 6, 7 }, r.Rows);
        }

        [Test]
        public void FiveLine()
        {
            for (int row = 0; row < 6; row += 2)
            {
                Put(TetrominoKind.O, 0, row, 0);
                Put(TetrominoKind.O, 0, row, 2);
            }
            Put(TetrominoKind.I, 0, 6, 0);
            Put(TetrominoKind.I, 0, 7, 4);
            Put(TetrominoKind.O, 0, 0, 6);
            ClearResolution r = Try(TetrominoKind.I, 0, 7, 0);
            Assert.AreEqual(ClearType.FiveLine, r.Type);
            CollectionAssert.AreEqual(new[] { 7 }, r.Rows);
            CollectionAssert.AreEqual(new[] { 0, 1, 2, 3 }, r.Cols);
            CollectionAssert.AreEqual(Row(7).Concat(Col(0, 7)).Concat(Col(1, 7)).Concat(Col(2, 7)).Concat(Col(3, 7)), r.Cells);
        }

        [Test]
        public void OnlyColumns_OrderedLeftToRightThenTopToBottom()
        {
            for (int row = 0; row < 6; row += 2) Put(TetrominoKind.O, 0, row, 5);
            ClearResolution r = Try(TetrominoKind.O, 0, 6, 5);
            CollectionAssert.IsEmpty(r.Rows);
            CollectionAssert.AreEqual(new[] { 5, 6 }, r.Cols, "满列升序(Core 给的是降序)");
            CollectionAssert.AreEqual(Col(5).Concat(Col(6)), r.Cells);
        }

        [Test]
        public void TwoRowsTwoCols_CrossCellsOnceAndInTheirRows()
        {
            Put(TetrominoKind.O, 0, 0, 2);
            Put(TetrominoKind.O, 0, 0, 4);
            Put(TetrominoKind.O, 0, 0, 6);
            Put(TetrominoKind.O, 0, 2, 0);
            Put(TetrominoKind.O, 0, 4, 0);
            Put(TetrominoKind.O, 0, 6, 0);
            ClearResolution r = Try(TetrominoKind.O, 0, 0, 0);
            CollectionAssert.AreEqual(new[] { 0, 1 }, r.Rows);
            CollectionAssert.AreEqual(new[] { 0, 1 }, r.Cols);
            CollectionAssert.AreEqual(Row(0).Concat(Row(1)).Concat(Col(0, 0, 1)).Concat(Col(1, 0, 1)), r.Cells);
            Assert.AreEqual(28, r.Cells.Count);
        }

        [Test]
        public void Owners_FollowCells_AndThePieceOwnsItsOwnCells()
        {
            Put(TetrominoKind.I, 0, 7, 0);
            int first = (int)TetrominoKind.I * PerKind + 1;
            int piece = first + 1;
            ClearResolution r = Try(TetrominoKind.I, 0, 7, 4);
            CollectionAssert.AreEqual(Enumerable.Repeat(first, 4).Concat(Enumerable.Repeat(piece, 4)), r.Owners);
        }

        [Test]
        public void NoLine_IsLegalWithoutType_AndIllegalIsEmpty()
        {
            ClearResolution r = Try(TetrominoKind.O, 0, 3, 3);
            Assert.IsFalse(r.HasClear);
            Assert.IsNull(r.Type);
            CollectionAssert.IsEmpty(r.Cells);

            Put(TetrominoKind.O, 0, 3, 3);
            ClearResolution blocked = _run.ResolveClear(Next(TetrominoKind.O), 0, 3, 3);
            Assert.IsFalse(blocked.Legal);
            Assert.IsFalse(_run.ResolveClear(Next(TetrominoKind.I), 0, 0, 5).Legal, "越出右边");
            Assert.IsFalse(_run.ResolveClear(999, 0, 0, 0).Legal, "不认识的 id");
            _run.Blind.Board.SetDead(0);
            Assert.IsFalse(_run.ResolveClear(Next(TetrominoKind.O), 0, 0, 0).Legal, "压死格");
        }

        [Test]
        public void ResolveClear_DoesNotTouchState()
        {
            Put(TetrominoKind.I, 0, 7, 0);
            string before = TestRules.Dump(_run);
            Try(TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(before, TestRules.Dump(_run));
        }

        [Test]
        public void Classify_PriorityConflicts()
        {
            int[] none = new int[0];
            Assert.AreEqual(ClearType.AllClear, ClearRules.Classify(new[] { 7 }, none, sameShape: true, allClear: true));
            Assert.AreEqual(ClearType.SameShapeCross, ClearRules.Classify(new[] { 0 }, new[] { 0 }, sameShape: true, allClear: false), "角上也先判同形态十字");
            Assert.AreEqual(ClearType.Corner, ClearRules.Classify(new[] { 7 }, new[] { 7 }, false, false));
            Assert.AreEqual(ClearType.Cross, ClearRules.Classify(new[] { 0 }, new[] { 3 }, false, false), "交点在边上不在角上");
            Assert.AreEqual(ClearType.FiveLine, ClearRules.Classify(new[] { 3 }, new[] { 0, 1, 2, 3 }, true, false), "五线先于同形态十字");
            Assert.AreEqual(ClearType.SameShapeCross, ClearRules.Classify(new[] { 0, 1 }, new[] { 0, 1 }, true, false), "同形态十字先于多线");
            Assert.AreEqual(ClearType.SameShape, ClearRules.Classify(new[] { 0, 1, 2 }, none, true, false), "同形态先于三线");
            Assert.AreEqual(ClearType.TripleLine, ClearRules.Classify(new[] { 0 }, new[] { 0, 1 }, false, false), "三线先于拐角、十字、平行线");
            Assert.AreEqual(ClearType.Parallel, ClearRules.Classify(none, new[] { 2, 3 }, false, false));
            Assert.AreEqual(ClearType.DoubleLine, ClearRules.Classify(none, new[] { 2, 5 }, false, false));
            CollectionAssert.AreEquivalent(System.Enum.GetValues(typeof(ClearType)), ClearRules.Priority, "优先级表正好列全 11 种");
        }

        [Test]
        public void OrderCells_IsThePureOrder()
        {
            CollectionAssert.AreEqual(Row(3).Concat(Col(3, 3)), ClearRules.OrderCells(new[] { 3 }, new[] { 3 }));
            CollectionAssert.AreEqual(Col(0).Concat(Col(7)), ClearRules.OrderCells(new int[0], new[] { 0, 7 }));
        }
    }
}
