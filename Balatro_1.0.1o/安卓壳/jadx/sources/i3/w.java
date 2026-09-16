package i3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class w extends c {

    /* renamed from: f, reason: collision with root package name */
    public static final w f3653f = new w();

    private w() {
    }

    @Override // i3.c
    public void a(v2.e eVar, Runnable runnable) {
        h.d.a(eVar.get(x.f3654e));
        throw new UnsupportedOperationException("Dispatchers.Unconfined.dispatch function can only be used by the yield function. If you wrap Unconfined dispatcher in your code, make sure you properly delegate isDispatchNeeded and dispatch calls.");
    }

    @Override // i3.c
    public boolean b(v2.e eVar) {
        return false;
    }

    @Override // i3.c
    public String toString() {
        return "Dispatchers.Unconfined";
    }
}
