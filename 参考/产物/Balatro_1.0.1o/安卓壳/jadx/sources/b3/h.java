package b3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h {

    /* renamed from: a, reason: collision with root package name */
    private static final i f1827a;

    /* renamed from: b, reason: collision with root package name */
    private static final f3.a[] f1828b;

    static {
        i iVar = null;
        try {
            iVar = (i) Class.forName("kotlin.reflect.jvm.internal.ReflectionFactoryImpl").newInstance();
        } catch (ClassCastException | ClassNotFoundException | IllegalAccessException | InstantiationException unused) {
        }
        if (iVar == null) {
            iVar = new i();
        }
        f1827a = iVar;
        f1828b = new f3.a[0];
    }

    public static f3.a a(Class cls) {
        return f1827a.a(cls);
    }

    public static String b(g gVar) {
        return f1827a.c(gVar);
    }
}
