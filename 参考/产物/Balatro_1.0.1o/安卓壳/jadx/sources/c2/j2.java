package c2;

import android.content.Context;
import e1.a;
import e1.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j2 extends e1.e implements f2 {

    /* renamed from: k, reason: collision with root package name */
    private static final a.g f2133k;

    /* renamed from: l, reason: collision with root package name */
    private static final a.AbstractC0041a f2134l;

    /* renamed from: m, reason: collision with root package name */
    private static final e1.a f2135m;

    static {
        a.g gVar = new a.g();
        f2133k = gVar;
        g2 g2Var = new g2();
        f2134l = g2Var;
        f2135m = new e1.a("GamesConnect.API", g2Var, gVar);
    }

    j2(Context context, d2 d2Var) {
        super(context, f2135m, d2Var, e.a.f3154c);
    }

    @Override // c2.f2
    public final g2.h c(final l2 l2Var, boolean z3) {
        f1.q a4 = f1.q.a().b(new f1.m() { // from class: c2.i2
            @Override // f1.m
            public final /* synthetic */ void accept(Object obj, Object obj2) {
                ((r2) ((k2) obj).C()).m0(new h2(j2.this, (g2.i) obj2), l2Var);
            }
        }).e(6737).c(z3).a();
        return z3 ? i(a4) : f(a4);
    }
}
