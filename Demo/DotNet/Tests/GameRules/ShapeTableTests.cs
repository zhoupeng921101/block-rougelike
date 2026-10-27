using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>形状表裁到七种四格骨牌的 19 个朝向、id 不变;种类 → 基准 id 七项常量表转满四档恰好走遍该种全部朝向。</summary>
    public class ShapeTableTests
    {
        private static readonly int[] TetrominoIds = { 7, 8, 9, 10, 14, 16, 17, 18, 19, 20, 25, 26, 29, 30, 31, 32, 33, 34, 42 };

        [Test]
        public void Map_HoldsExactlyTheNineteenTetrominoOrientations()
        {
            CollectionAssert.AreEquivalent(TetrominoIds, BlockShapeMap.Map.Keys);
            foreach (int id in TetrominoIds) Assert.AreEqual(4, BlockShapeMap.GetCellCount(id), "id " + id);
            Assert.That(BlockShapeMap.NonTightDefinitionIds, Is.Empty);
            Assert.AreEqual(5, BlockShapeMap.MaxLinesPerPlacement, "规则 §3.3:四格骨牌一次最多完成 5 条线");
        }

        [TestCase(TetrominoKind.I, 17, 2, new[] { 7, 17 })]
        [TestCase(TetrominoKind.O, 9, 1, new[] { 9 })]
        [TestCase(TetrominoKind.T, 10, 4, new[] { 10, 20, 25, 26 })]
        [TestCase(TetrominoKind.S, 14, 2, new[] { 14, 16 })]
        [TestCase(TetrominoKind.Z, 18, 2, new[] { 18, 19 })]
        [TestCase(TetrominoKind.J, 8, 4, new[] { 8, 29, 30, 31 })]
        [TestCase(TetrominoKind.L, 33, 4, new[] { 32, 33, 34, 42 })]
        public void BaseShape_RotatesThroughEveryOrientationOfItsKind(TetrominoKind kind, int baseId, int orientations, int[] kindIds)
        {
            Assert.AreEqual(baseId, Tetromino.BaseShapeId(kind));
            Assert.AreEqual(orientations, BlockShapeMap.GetOrientationCount(baseId));
            var reached = new SortedSet<int>();
            for (int rot = 0; rot < BlockShapeMap.RotCount; rot++) reached.Add(IdOf(BlockShapeMap.GetRotated(baseId, rot)));
            CollectionAssert.AreEqual(kindIds, reached);
        }

        [Test]
        public void BaseShapeId_RejectsUndefinedKind()
        {
            Assert.Throws<ArgumentOutOfRangeException>(() => Tetromino.BaseShapeId((TetrominoKind)7));
        }

        private static int IdOf(BlockShape shape)
        {
            return BlockShapeMap.Map.Single(kv => kv.Value.Width == shape.Width && kv.Value.Height == shape.Height
                                                  && kv.Value.Shape.SequenceEqual(shape.Shape)).Key;
        }
    }
}
