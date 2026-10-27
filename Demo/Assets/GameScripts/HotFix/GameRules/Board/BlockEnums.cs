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

    /// <summary>块的强化(规则 §4.4)。本图恒为 None,效果在阶段 5 经效果注册表接入。</summary>
    public enum Enhancement
    {
        None = 0,
        Glass = 1,
        Steel = 2,
        Gold = 3,
        Wild = 4,
    }

    /// <summary>块的版本。本图恒为 None。</summary>
    public enum Edition
    {
        None = 0,
        Foil = 1,
        Holo = 2,
        Polychrome = 3,
    }
}
