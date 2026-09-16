package i3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class u extends c {
    public abstract u d();

    protected final String e() {
        u uVar;
        u b4 = l.b();
        if (this == b4) {
            return "Dispatchers.Main";
        }
        try {
            uVar = b4.d();
        } catch (UnsupportedOperationException unused) {
            uVar = null;
        }
        if (this == uVar) {
            return "Dispatchers.Main.immediate";
        }
        return null;
    }
}
