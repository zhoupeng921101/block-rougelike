using TEngine;
using UnityEngine;

/// <summary>
/// Part 实例化的无状态工具:按宿主序列化持有的 prefab 引用建出一个 Part 实例。
///
/// 是工具不是基类——Part 仍是裸 MonoBehaviour,不因本类多出一档继承层。宿主自己 <c>Instantiate</c>
/// 也完全等价,本类只是把「实例化 + 取组件 + 取不到就清理干净」这三步的重复写法收成一处。
///
/// 模板走宿主的 <c>[SerializeField] GameObject</c> 引用而非按名加载:prefab 依赖随宿主 prefab 一并
/// 进 bundle 并驻留,故此处的 <c>Instantiate</c> 是纯实例化、零资源 LOAD(WebGL 禁同步加载,见 UIPreloader 头注),
/// 且漏拖在编辑期即由 UI 绑定校验工具扫出,不必等运行时。
/// </summary>
public static class UIPartFactory
{
    /// <summary>
    /// 实例化 <paramref name="prefab"/> 到 <paramref name="parent"/> 下并取其根上的 <typeparamref name="T"/>。
    /// prefab 未拖(null)或其根上没挂该组件时记 Error 返 null,并销毁已建出的半成品实例,不留孤儿节点。
    /// </summary>
    /// <param name="prefab">宿主序列化持有的 Part 模板。</param>
    /// <param name="parent">实例父节点。</param>
    /// <param name="ownerTag">日志里标识调用方的短名(通常是宿主类名)。</param>
    public static T Create<T>(GameObject prefab, Transform parent, string ownerTag) where T : MonoBehaviour
    {
        if (prefab == null)
        {
            Log.Error($"[{ownerTag}] {typeof(T).Name} 的 prefab 引用未拖，实例未创建。请在 Inspector 上补拖，" +
                "或跑「TEngine/UI 绑定/只校验 UI prefab 引用」定位全部漏拖项。");
            return null;
        }

        GameObject instance = Object.Instantiate(prefab, parent);
        var part = instance.GetComponent<T>();
        if (part == null)
        {
            Log.Error($"[{ownerTag}] prefab [{prefab.name}] 根上缺少组件 {typeof(T).Name}，实例未创建。");
            Object.Destroy(instance);
            return null;
        }

        return part;
    }
}
