using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>盘面:两个写口与不变式、块内序号、交叉格只清一次、死格挡落子而不成满线。</summary>
    public class BoardStateTests
    {
        private static BlockInstance Block(int id, TetrominoKind kind) => new BlockInstance(id, kind, 1, Enhancement.None, Edition.None);

        private static void AssertInvariants(BoardState board)
        {
            Assert.IsNull(board.Validate());
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                Assert.AreEqual(board.OwnerAt(cell) != 0, board.IsOccupied(cell), "格 " + cell + ":占用位 ⇔ 格层非 0");
                Assert.IsFalse(board.IsDead(cell) && board.IsOccupied(cell), "格 " + cell + ":死格不占用");
            }
        }

        [Test]
        public void BoardCells_ConvertsBetweenIndexAndMaskBit()
        {
            Assert.AreEqual(1UL << 7, BoardCells.BoardMaskBit(0), "最左列是行内最高位");
            Assert.AreEqual(1UL << 0, BoardCells.BoardMaskBit(7));
            Assert.AreEqual(1UL << 63, BoardCells.BoardMaskBit(BoardCells.Index(7, 0)));
            Assert.AreEqual(0x80, BoardCells.RowMaskBit(0));
            Assert.AreEqual(0x01, BoardCells.RowMaskBit(7));
            Assert.AreEqual(19, BoardCells.Index(2, 3));
            Assert.AreEqual(2, BoardCells.RowOf(19));
            Assert.AreEqual(3, BoardCells.ColOf(19));
        }

        [TestCase(0, 0, 0, new[] { 1, 8, 9, 10 })]
        [TestCase(1, 0, 0, new[] { 9, 0, 8, 16 })]
        [TestCase(1, 2, 3, new[] { 28, 19, 27, 35 })]
        public void Place_ReturnsCellsInOriginalOrientationOrder(int rot, int row, int col, int[] expected)
        {
            var board = new BoardState();
            CollectionAssert.AreEqual(expected, board.Place(Block(5, TetrominoKind.T), rot, row, col));
        }

        [Test]
        public void Place_CoversTheRotatedMaskForEveryKindAndRot()
        {
            for (int k = 0; k < Tetromino.KindCount; k++)
            {
                for (int rot = 0; rot < 4; rot++)
                {
                    var kind = (TetrominoKind)k;
                    var board = new BoardState();
                    int[] cells = board.Place(Block(3, kind), rot, 2, 1);

                    BlockShape shape = BlockShapeMap.GetRotated(Tetromino.BaseShapeId(kind), rot);
                    var expected = new SortedSet<int>();
                    for (int r = 0; r < shape.Height; r++)
                    {
                        for (int c = 0; c < shape.Width; c++)
                        {
                            if (((shape.Shape[r] >> (shape.Width - c - 1)) & 1) != 0) expected.Add(BoardCells.Index(2 + r, 1 + c));
                        }
                    }
                    CollectionAssert.AreEquivalent(expected, cells, kind + " rot " + rot);
                    foreach (int cell in cells) Assert.AreEqual(3, board.OwnerAt(cell));
                    Assert.AreEqual(4, board.CellsOf(3));
                    AssertInvariants(board);
                }
            }
        }

        [Test]
        public void WritePorts_KeepInvariants()
        {
            var board = new BoardState();
            AssertInvariants(board);
            board.Place(Block(1, TetrominoKind.I), 0, 0, 0);
            board.Place(Block(2, TetrominoKind.O), 0, 1, 0);
            board.Place(Block(3, TetrominoKind.L), 3, 2, 5);
            AssertInvariants(board);
            board.ClearCell(0);
            board.ClearCell(BoardCells.Index(1, 1));
            board.SetDead(0);
            AssertInvariants(board);
            CollectionAssert.AreEqual(new[] { 1, 2, 3 }, board.InstancesOnBoard());
            Assert.AreEqual(3, board.CellsOf(1));
            Assert.AreEqual(3, board.CellsOf(2));
        }

        [Test]
        public void ClearCell_ReturnsCrossCellOnce_AndZeroForEmpty()
        {
            var board = new BoardState();
            board.Place(Block(1, TetrominoKind.I), 0, 0, 0);
            board.Place(Block(2, TetrominoKind.I), 0, 0, 4);
            board.Place(Block(3, TetrominoKind.I), 1, 1, 0);
            board.Place(Block(4, TetrominoKind.T), 1, 5, 0);

            ClearResult lines = board.FullLines();
            CollectionAssert.AreEqual(new[] { 0 }, lines.Rows);
            CollectionAssert.AreEqual(new[] { 0 }, lines.Cols);

            var rowPass = new List<int>();
            for (int c = 0; c < 8; c++) rowPass.Add(board.ClearCell(BoardCells.Index(0, c)));
            var colPass = new List<int>();
            for (int r = 0; r < 8; r++) colPass.Add(board.ClearCell(BoardCells.Index(r, 0)));

            CollectionAssert.AreEqual(new[] { 1, 1, 1, 1, 2, 2, 2, 2 }, rowPass);
            CollectionAssert.AreEqual(new[] { 0, 3, 3, 3, 3, 4, 4, 4 }, colPass, "交叉格在行里已清,走到列上返回 0");
            Assert.AreEqual(0, board.ClearCell(BoardCells.Index(7, 7)), "空格返回 0");
            Assert.AreEqual(1, board.CellsOf(4));
            CollectionAssert.AreEqual(new[] { 4 }, board.InstancesOnBoard());
            AssertInvariants(board);
        }

        [Test]
        public void FullLines_ReturnsColsAscending()
        {
            var board = new BoardState();
            int id = 1;
            foreach (int col in new[] { 5, 2 })
            {
                board.Place(Block(id++, TetrominoKind.I), 1, 0, col);
                board.Place(Block(id++, TetrominoKind.I), 1, 4, col);
            }
            ClearResult lines = board.FullLines();
            Assert.That(lines.Rows, Is.Empty);
            CollectionAssert.AreEqual(new[] { 2, 5 }, lines.Cols);
        }

        [Test]
        public void DeadCell_BlocksPlacement()
        {
            var board = new BoardState();
            board.SetDead(3);
            Assert.IsTrue(board.IsDead(3));
            Assert.IsFalse(board.IsOccupied(3));
            Assert.AreEqual(0, board.OwnerAt(3));
            Assert.IsFalse(board.CanPlace(TetrominoKind.I, 0, 0, 0));
            Assert.IsTrue(board.CanPlace(TetrominoKind.I, 0, 0, 4));
            Assert.IsTrue(board.CanPlace(TetrominoKind.I, 0, 1, 0));
            Assert.Throws<InvalidOperationException>(() => board.Place(Block(1, TetrominoKind.I), 0, 0, 0));
            Assert.AreEqual(0, board.ClearCell(3), "死格不会被清,返回 0");
            AssertInvariants(board);
        }

        [Test]
        public void DeadCell_DoesNotCompleteLine()
        {
            var board = new BoardState();
            board.SetDead(7);
            board.Place(Block(1, TetrominoKind.I), 0, 0, 0);
            for (int col = 4; col <= 6; col++) board.Place(Block(col, TetrominoKind.I), 1, 0, col);

            Assert.That(board.FullLines().Rows, Is.Empty, "第 0 行 7 格有块、1 格死格:死格算空洞,凑不满");
            AssertInvariants(board);
        }

        [Test]
        public void SetDead_RejectsOccupiedCell()
        {
            var board = new BoardState();
            board.Place(Block(1, TetrominoKind.O), 0, 0, 0);
            Assert.Throws<InvalidOperationException>(() => board.SetDead(9));
            Assert.IsFalse(board.IsDead(9));
        }

        [Test]
        public void DeadCells_CanLeaveNoRoomForAnyRotation()
        {
            var board = new BoardState();
            for (int k = 0; k < Tetromino.KindCount; k++) Assert.IsTrue(board.CanPlaceAnyRotation((TetrominoKind)k));

            // 棋盘格:空格两两不相邻,四格骨牌哪种朝向都放不下
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if ((BoardCells.RowOf(cell) + BoardCells.ColOf(cell)) % 2 == 0) board.SetDead(cell);
            }
            for (int k = 0; k < Tetromino.KindCount; k++) Assert.IsFalse(board.CanPlaceAnyRotation((TetrominoKind)k), ((TetrominoKind)k).ToString());
        }

        [Test]
        public void Queries_OutsideBoardAreFalse_BadRotThrows()
        {
            var board = new BoardState();
            Assert.IsFalse(board.CanPlace(TetrominoKind.I, 0, 0, 5));
            Assert.IsFalse(board.CanPlace(TetrominoKind.I, 1, 5, 0));
            Assert.IsFalse(board.CanPlace(TetrominoKind.O, 0, -1, 0));
            Assert.Throws<ArgumentOutOfRangeException>(() => board.CanPlace(TetrominoKind.O, 4, 0, 0));
            Assert.Throws<ArgumentOutOfRangeException>(() => board.OwnerAt(64));
        }

        [Test]
        public void Clone_IsIndependent()
        {
            var board = new BoardState();
            board.Place(Block(1, TetrominoKind.S), 0, 0, 0);
            BoardState copy = board.Clone();

            copy.ClearCell(1);
            copy.Place(Block(2, TetrominoKind.O), 0, 6, 6);
            copy.SetDead(BoardCells.Index(4, 4));

            Assert.AreEqual(1, board.OwnerAt(1));
            Assert.AreEqual(0, board.OwnerAt(BoardCells.Index(6, 6)));
            Assert.IsFalse(board.IsDead(BoardCells.Index(4, 4)));
            Assert.IsTrue(board.CanPlace(TetrominoKind.O, 0, 4, 4));
            CollectionAssert.AreEqual(new[] { 1 }, board.InstancesOnBoard());
            AssertInvariants(board);
            AssertInvariants(copy);
        }
    }
}
