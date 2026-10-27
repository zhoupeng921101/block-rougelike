using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>
    /// 盘面三层:占用(<see cref="BinaryBoard"/>)、格 → 实例 id、死格掩码(06 号票 §2)。
    /// 写口只有 <see cref="Place"/>、<see cref="ClearCell"/> 两个,加只给单测用的 <see cref="SetDead"/>。
    /// 不变式:占用位为 1 ⇔ 格层非 0;死格不占用(<see cref="Validate"/>)。
    /// 死格挡落子的做法:落子类查询问「占用 | 死格」的影子盘;满线只问占用,死格自然算空洞。
    /// </summary>
    public sealed class BoardState : IBoardView
    {
        private readonly BinaryBoard _occupied;
        private readonly int[] _owner;
        private ulong _dead;

        // 落子类查询问的影子盘 = 占用 | 死格;没有死格时直接问 _occupied
        private readonly BinaryBoard _blocking = new BinaryBoard();
        private bool _blockingStale = true;

        public BoardState()
        {
            _occupied = new BinaryBoard();
            _owner = new int[BoardCells.Count];
        }

        private BoardState(BoardState src)
        {
            _occupied = src._occupied.Clone();
            _owner = (int[])src._owner.Clone();
            _dead = src._dead;
        }

        public BoardState Clone() => new BoardState(this);

        public int OwnerAt(int cell) => _owner[CheckCell(cell)];

        public bool IsOccupied(int cell) => (_occupied.Cells & BoardCells.BoardMaskBit(CheckCell(cell))) != 0UL;

        public bool IsDead(int cell) => (_dead & BoardCells.BoardMaskBit(CheckCell(cell))) != 0UL;

        public int CellsOf(int instanceId)
        {
            if (instanceId <= 0) return 0;
            int n = 0;
            foreach (int id in _owner)
            {
                if (id == instanceId) n++;
            }
            return n;
        }

        public List<int> InstancesOnBoard()
        {
            var ids = new List<int>();
            foreach (int id in _owner)
            {
                if (id != 0 && !ids.Contains(id)) ids.Add(id);
            }
            ids.Sort();
            return ids;
        }

        public bool CanPlace(TetrominoKind kind, int rot, int row, int col)
        {
            CheckRot(rot);
            return Blocking.CanPutBlock(Tetromino.BaseShapeId(kind), rot, new Vec2Int(col, row));
        }

        public bool CanPlaceAnyRotation(TetrominoKind kind) => Blocking.CanPutAnyRotation(Tetromino.BaseShapeId(kind));

        /// <summary>
        /// 当前的满行、满列,都按升序(Core 按列号降序收满列,这里已排好)。只问占用:死格所在的线凑不满(规则 §3.3)。
        /// 只读。清格一律走 <see cref="ClearCell"/>:Core 的 <c>CanClearRowCols(doClear: true)</c> 只清占用、不清格层,规则核心里不许用。
        /// </summary>
        public ClearResult FullLines()
        {
            ClearResult result = _occupied.CanClearRowCols(false);
            result.Cols.Sort();
            return result;
        }

        /// <summary>
        /// 落子:沿原始朝向逐格遍历、经 <see cref="BlockShapeMap.RotateCell"/> 转到 rot 档,同一个循环里写格层和占用位。
        /// 返回的 4 格按块内序号(原始朝向的行优先序)排列,不随旋转变;表现层要块内编号时从这里拿,盘面不另存。
        /// 落点不合法时抛异常:调用方应先问过 <see cref="CanPlace"/>。
        /// </summary>
        public int[] Place(BlockInstance block, int rot, int row, int col)
        {
            if (block == null) throw new ArgumentNullException(nameof(block));
            if (!CanPlace(block.Kind, rot, row, col))
            {
                throw new InvalidOperationException(Invariant($"实例 {block.Id}({block.Kind} rot {rot})放不到 ({row},{col})"));
            }

            BlockShape shape = BlockShapeMap.Get(Tetromino.BaseShapeId(block.Kind));
            var cells = new int[Tetromino.CellCount];
            int n = 0;
            for (int r = 0; r < shape.Height; r++)
            {
                for (int c = 0; c < shape.Width; c++)
                {
                    if (((shape.Shape[r] >> (shape.Width - c - 1)) & 1) == 0) continue;
                    BlockShapeMap.RotateCell(shape.Width, shape.Height, rot, r, c, out int rr, out int rc);
                    int cell = BoardCells.Index(row + rr, col + rc);
                    _owner[cell] = block.Id;
                    _occupied.OrRow(row + rr, BoardCells.RowMaskBit(col + rc));
                    cells[n++] = cell;
                }
            }
            _blockingStale = true;
            return cells;
        }

        /// <summary>
        /// 清一格:清格层和占用位,返回原来的实例 id;空格(含死格)返回 0。
        /// 行列交叉的格因此只算一次:先清行时拿到 id,再清列时已是 0。
        /// </summary>
        public int ClearCell(int cell)
        {
            int id = _owner[CheckCell(cell)];
            if (id == 0) return 0;
            _owner[cell] = 0;
            _occupied.ClearCell(BoardCells.RowOf(cell), BoardCells.ColOf(cell));
            _blockingStale = true;
            return id;
        }

        /// <summary>
        /// 死格钩子,本图只有单测调用。只许置在空格上,否则破坏不变式;占着块的格变成死格怎么处理,等有死格来源时再定。
        /// </summary>
        public void SetDead(int cell)
        {
            if (_owner[CheckCell(cell)] != 0) throw new InvalidOperationException(Invariant($"格 {cell} 上有块,不能置死格"));
            _dead |= BoardCells.BoardMaskBit(cell);
            _blockingStale = true;
        }

        /// <summary>两条不变式,返回第一条不成立的,全部成立返回 null。</summary>
        public string Validate()
        {
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (_owner[cell] < 0) return Invariant($"格 {cell} 的实例 id 为负:{_owner[cell]}");
                if (IsOccupied(cell) != (_owner[cell] != 0)) return Invariant($"格 {cell} 的占用位与格层不一致");
                if (IsDead(cell) && IsOccupied(cell)) return Invariant($"格 {cell} 是死格却有占用");
            }
            return null;
        }

        private BinaryBoard Blocking
        {
            get
            {
                if (_dead == 0UL) return _occupied;
                if (_blockingStale)
                {
                    _blocking.CopyFrom(_occupied);
                    for (int r = 0; r < BoardCells.Rows; r++) _blocking.OrRow(r, BoardCells.RowBits(_dead, r));
                    _blockingStale = false;
                }
                return _blocking;
            }
        }

        private static int CheckCell(int cell)
        {
            if (!BoardCells.IsValid(cell)) throw new ArgumentOutOfRangeException(nameof(cell), cell, "格号在 0..63");
            return cell;
        }

        private static void CheckRot(int rot)
        {
            if (!Tetromino.IsValidRot(rot)) throw new ArgumentOutOfRangeException(nameof(rot), rot, "rot 在 0..3");
        }
    }
}
