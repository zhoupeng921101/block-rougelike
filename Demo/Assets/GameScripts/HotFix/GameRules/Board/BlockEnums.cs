namespace GameRules
{
    // 以下枚举都进存档(09 号票:存档写名字)。取值写死,只追加、不改序、不改名;改名就是改存档形状。

    /// <summary>七种四格骨牌。同形态判定比的就是它:朝向不算,镜像算两种(规则 §3.3)。</summary>
    public enum TetrominoKind
    {
        I = 0,
        O = 1,
        T = 2,
        S = 3,
        Z = 4,
        J = 5,
        L = 6,
    }

    /// <summary>块的强化(规则 §4.4)。效果在 <see cref="CoreEffects"/>:琉璃 ×倍率且可能碎、铁芯 +倍率、金箔给钱、万态参与任意形态的同形态。</summary>
    public enum Enhancement
    {
        None = 0,
        Glass = 1,
        Steel = 2,
        Gold = 3,
        Wild = 4,
    }

    /// <summary>版本(规则 §4.1、§4.4):块与基因都能带;闪箔 +底分、镭射 +倍率、多彩 ×倍率(效果系统 §10 的起草口径)。负片只给基因,带负片的基因不占槽。</summary>
    public enum Edition
    {
        None = 0,
        Foil = 1,
        Holo = 2,
        Polychrome = 3,
        Negative = 4,
    }
}
