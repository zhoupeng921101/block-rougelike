using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 判线、定类型的结果(<see cref="RunState.ResolveClear"/>)。拖动预览和真落子用的是同一份,所以预告的类型、被消格不会和落下去的判岔。
    /// 不含点数、强化、基因、随机结果:预览只显示类型本级的底注与倍率(规则 §8.5)。
    /// </summary>
    public sealed class ClearResolution
    {
        private static readonly IReadOnlyList<int> Empty = Array.AsReadOnly(new int[0]);

        internal static readonly ClearResolution Illegal = new ClearResolution(false, null, null, null, null, null);

        /// <summary>落点放得下吗。放不下时下面全空。</summary>
        public bool Legal { get; }

        /// <summary>消除类型;放不下或不成线时为 null。</summary>
        public ClearType? Type { get; }

        public bool HasClear => Type.HasValue;

        /// <summary>满行、满列,升序。</summary>
        public IReadOnlyList<int> Rows { get; }

        public IReadOnlyList<int> Cols { get; }

        /// <summary>被消格,按结算次序:先走行(从上到下、行内从左到右),再走列(从左到右、列内从上到下),交叉格归行(07 号票 §1)。</summary>
        public IReadOnlyList<int> Cells { get; }

        /// <summary>与 <see cref="Cells"/> 逐项对应的所属块 id;落下的这块自己的格就是它的 id。</summary>
        public IReadOnlyList<int> Owners { get; }

        internal ClearResolution(bool legal, ClearType? type, int[] rows, int[] cols, int[] cells, int[] owners)
        {
            Legal = legal;
            Type = type;
            Rows = rows == null ? Empty : Array.AsReadOnly(rows);
            Cols = cols == null ? Empty : Array.AsReadOnly(cols);
            Cells = cells == null ? Empty : Array.AsReadOnly(cells);
            Owners = owners == null ? Empty : Array.AsReadOnly(owners);
        }
    }
}
