using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>
    /// 效果注册表,按(来源种类,id)查(07 号票 §5)。和类型表一样是开局时传入的规则配置:不进存档,Clone 共享同一份。
    /// 交给 <see cref="RuleConfig"/> 时封住,之后不能再登记:配置是多局共享的,登记进已在用的表会串到别的局。
    /// dotnet 单测的测试替身和阶段 5 的真效果都从 <see cref="Register"/> 进来。
    /// </summary>
    public sealed class EffectRegistry
    {
        // 只按键查,不遍历
        private readonly Dictionary<(EffectSource, int), RuleEffect> _effects = new Dictionary<(EffectSource, int), RuleEffect>();

        public bool IsSealed { get; private set; }

        public EffectRegistry Register(EffectSource source, int id, RuleEffect effect)
        {
            if (IsSealed) throw new InvalidOperationException("注册表已交给规则配置,不能再登记");
            if (effect == null) throw new ArgumentNullException(nameof(effect));
            if ((source == EffectSource.Enhancement || source == EffectSource.Edition) && id == 0)
            {
                throw new ArgumentException("强化、版本的 None 不挂效果", nameof(id));
            }
            if (_effects.ContainsKey((source, id))) throw new ArgumentException(Invariant($"{source} {id} 已登记"), nameof(id));
            _effects.Add((source, id), effect);
            return this;
        }

        /// <summary>没登记的返回 null。</summary>
        public RuleEffect Find(EffectSource source, int id) => _effects.TryGetValue((source, id), out RuleEffect e) ? e : null;

        internal void Seal() => IsSealed = true;
    }
}
