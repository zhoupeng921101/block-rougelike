using System;

namespace GameRules
{
    /// <summary>
    /// 骨牌种类 → <see cref="BlockShapeMap"/> 的基准 id(rot 0 = Tetris 惯例的出生朝向:I 横放、T 朝上、J/L 的角在上)。
    /// 块实例不存形状 id,形状一律经 <c>GetRotated(BaseShapeId(kind), rot)</c> 取:改造改形态只改 Kind 一个字段。
    /// </summary>
    public static class Tetromino
    {
        public const int KindCount = 7;

        /// <summary>每块的格数;盘上一块的格数不会超过它。</summary>
        public const int CellCount = 4;

        // 下标 = (int)TetrominoKind
        private static readonly int[] BaseIds = { 17, 9, 10, 14, 18, 8, 33 };

        public static int BaseShapeId(TetrominoKind kind)
        {
            int k = (int)kind;
            if (k < 0 || k >= KindCount) throw new ArgumentOutOfRangeException(nameof(kind), kind, "不是骨牌种类");
            return BaseIds[k];
        }

        public static bool IsValidRot(int rot) => rot >= 0 && rot < BlockShapeMap.RotCount;
    }
}
