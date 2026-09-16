package b1;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b {

    /* renamed from: a, reason: collision with root package name */
    private int f1780a = 1;

    public b a(Object obj) {
        this.f1780a = (this.f1780a * 31) + (obj == null ? 0 : obj.hashCode());
        return this;
    }

    public int b() {
        return this.f1780a;
    }

    public final b c(boolean z3) {
        this.f1780a = (this.f1780a * 31) + (z3 ? 1 : 0);
        return this;
    }
}
