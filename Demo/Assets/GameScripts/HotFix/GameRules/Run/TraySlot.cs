namespace GameRules
{
    /// <summary>
    /// 待放置区的一个槽:块的 id 和它当前的朝向。Id 为 0 是空槽。
    /// 朝向只存在槽上:抽到时为 0,落子时作为参数传入,放下后不再保存(06 号票 §4)。
    /// </summary>
    public readonly struct TraySlot
    {
        public readonly int Id;

        /// <summary>0..3,每档顺时针 90°,不按朝向数折算:I 的 rot 2 与 rot 0 形状相同,块内编号却是倒过来的。</summary>
        public readonly int Rot;

        public TraySlot(int id, int rot)
        {
            Id = id;
            Rot = rot;
        }

        public bool IsEmpty => Id == 0;
    }
}
