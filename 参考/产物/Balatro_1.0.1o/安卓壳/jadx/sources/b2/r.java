package b2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class r {
    public static Object a(Class cls, String str, q... qVarArr) {
        return b(cls, "isIsolated", null, false, qVarArr);
    }

    private static Object b(Class cls, String str, Object obj, boolean z3, q... qVarArr) {
        int length = qVarArr.length;
        Class<?>[] clsArr = new Class[length];
        Object[] objArr = new Object[length];
        Object obj2 = null;
        if (qVarArr.length <= 0) {
            return cls.getDeclaredMethod(str, clsArr).invoke(null, objArr);
        }
        q qVar = qVarArr[0];
        obj2.getClass();
        throw null;
    }
}
