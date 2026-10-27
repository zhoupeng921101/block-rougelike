namespace GameRules
{
    /// <summary>
    /// 盘面上两套下标的唯一换算处。格号(数组下标、事件、存档)= row*8 + col,row 0 在上、col 0 在左;
    /// <see cref="BinaryBoard"/> 的掩码位 = row*8 + (7 - col),最左列是行内最高位。两套别在调用点各算一遍。
    /// </summary>
    public static class BoardCells
    {
        public const int Rows = BinaryBoard.RowCount;
        public const int Cols = BinaryBoard.ColCount;
        public const int Count = Rows * Cols;

        public static int Index(int row, int col) => row * Cols + col;

        public static int RowOf(int cell) => cell / Cols;

        public static int ColOf(int cell) => cell % Cols;

        public static bool IsValid(int cell) => cell >= 0 && cell < Count;

        public static bool IsInside(int row, int col) => row >= 0 && row < Rows && col >= 0 && col < Cols;

        /// <summary>第 col 列在 8 位行掩码里的位(<see cref="BinaryBoard.OrRow"/> 那一套)。</summary>
        public static int RowMaskBit(int col) => 1 << (Cols - 1 - col);

        /// <summary>格在 64 位盘面掩码里的位(<see cref="BinaryBoard.Cells"/> 与死格掩码那一套)。</summary>
        public static ulong BoardMaskBit(int cell) => 1UL << (RowOf(cell) * Cols + (Cols - 1 - ColOf(cell)));

        /// <summary>64 位盘面掩码里第 row 行的 8 位行掩码。</summary>
        public static int RowBits(ulong boardMask, int row) => (int)((boardMask >> (row * Cols)) & BinaryBoard.FullRow);
    }
}
