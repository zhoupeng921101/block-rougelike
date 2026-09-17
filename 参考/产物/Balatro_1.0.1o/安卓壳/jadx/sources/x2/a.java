package x2;

import b3.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends w2.a {
    @Override // w2.a
    public void a(Throwable th, Throwable th2) {
        f.e(th, "cause");
        f.e(th2, "exception");
        th.addSuppressed(th2);
    }
}
