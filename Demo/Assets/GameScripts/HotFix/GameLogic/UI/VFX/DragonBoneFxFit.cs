using System;
using UnityEngine;

/// <summary>
/// 骨骼特效的贴合系数:把骨架 aabb 撑到「该对齐的部分 == 调用方给的目标宽」所需的倍率。挂在 db_* 预制根上。
/// </summary>
/// <remarks>
/// 这批素材的 aabb 普遍比它实际画出来的内容大,且每套比例不同,故 <see cref="DragonBoneFx.SpawnFitWidth"/>
/// 按 aabb 铺出来的尺寸会失配。系数放在预制上而不是代码常量里:它是素材的属性,换素材时跟着一起换,
/// 不会被漏改。
///
/// 现有各预制上的值是动物乐园用它的量尺菜单(<c>TEngine/特效/量 DragonBones 贴合系数</c>,没搬进本作)量的,连 guid 原样搬来(32 号票)。
/// 别手工目测——那边量错过两次:一次拿整体包围盒当格网,一次在小分辨率下把抗锯齿噪声当真实差异。
/// </remarks>
public sealed class DragonBoneFxFit : MonoBehaviour
{
    /// <summary>一个动画的贴合系数。</summary>
    [Serializable]
    public sealed class Entry
    {
        [Tooltip("动画名,须与骨架里的逐字一致;拼错则该动画取默认系数,不报错")]
        public string Anim;

        [Tooltip("贴合系数 = 骨架 aabb 宽 / 该对齐部分的实测宽")]
        public float WidthScale = 1f;
    }

    [Header("贴合系数")]
    [Tooltip("按动画名给。表里没列的动画取下面的默认值")]
    [SerializeField] private Entry[] _entries;

    [Tooltip("表外动画的默认系数。素材 aabb 与其内容一致时留 1")]
    [SerializeField, Range(0.2f, 4f)] private float _defaultWidthScale = 1f;

    /// <summary>取该动画的贴合系数;表里没有则取默认值。</summary>
    public float WidthScaleFor(string animName)
    {
        if (_entries != null)
        {
            for (int i = 0; i < _entries.Length; i++)
            {
                var e = _entries[i];
                if (e != null && e.Anim == animName) return e.WidthScale;
            }
        }

        return _defaultWidthScale;
    }
}
