namespace GameRules
{
    /// <summary>读档失败的原因(<see cref="RunSnapshot.Read"/>)。读不了的档一律挪成 <c>.bad</c>,不按原因分别处置(09 号票 §6);原因只给日志和单测。</summary>
    public enum SnapshotError
    {
        None = 0,

        /// <summary>文本超过 1 MiB。</summary>
        TooLarge = 1,

        /// <summary>不是合乎语法的 JSON:空串、截断、根值之后还有内容、坏的转义或字面量。</summary>
        Syntax = 2,

        /// <summary>嵌套超过 16 层。</summary>
        TooDeep = 3,

        /// <summary>数带小数点或指数。</summary>
        NotInteger = 4,

        /// <summary>整数超出 64 位,或超出这个成员的 32 位。</summary>
        OutOfRange = 5,

        /// <summary><c>format</c> 不对:不是本作的局内存档。</summary>
        BadFormat = 6,

        /// <summary><c>schema</c> 不认:新版本存的,或没有迁移接得上(09 号票 §4)。</summary>
        UnsupportedSchema = 7,

        /// <summary><c>rng.scheme</c> 不认。</summary>
        UnsupportedRngScheme = 8,

        /// <summary>形状不对:多、少成员,次序不对,值的种类不对,定长数组长度不对。</summary>
        Shape = 9,

        /// <summary>值还原不成状态:枚举名不认、种子或键不合语法、数字串不规范、id ≤ 0、随机流全零、规格越界……</summary>
        BadValue = 10,

        /// <summary>还原得出状态,但 <see cref="RunState.Validate"/> 不过。</summary>
        Invalid = 11,
    }

    /// <summary>读档的结果:状态,或错误码加第一处出错的成员路径。</summary>
    public sealed class SnapshotReadResult
    {
        /// <summary>读成功时的状态;失败为 null。</summary>
        public RunState State { get; }

        public SnapshotError Error { get; }

        /// <summary>第一处出错的成员路径,如 <c>blind.tray[1].rot</c>,根是空串;成功为 null。</summary>
        public string Path { get; }

        /// <summary>给日志看的说明;成功为 null。</summary>
        public string Detail { get; }

        public bool Ok => Error == SnapshotError.None;

        private SnapshotReadResult(RunState state, SnapshotError error, string path, string detail)
        {
            State = state;
            Error = error;
            Path = path;
            Detail = detail;
        }

        internal static SnapshotReadResult Success(RunState state) => new SnapshotReadResult(state, SnapshotError.None, null, null);

        internal static SnapshotReadResult Failure(SnapshotError error, string path, string detail) =>
            new SnapshotReadResult(null, error, path, detail);
    }
}
