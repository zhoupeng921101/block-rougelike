package j1;

import android.content.Context;
import e1.a;
import e1.e;
import f1.m;
import f1.q;
import g2.h;
import g2.i;
import h1.t;
import h1.v;
import h1.w;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends e1.e implements v {

    /* renamed from: k, reason: collision with root package name */
    private static final a.g f3827k;

    /* renamed from: l, reason: collision with root package name */
    private static final a.AbstractC0041a f3828l;

    /* renamed from: m, reason: collision with root package name */
    private static final e1.a f3829m;

    /* renamed from: n, reason: collision with root package name */
    public static final /* synthetic */ int f3830n = 0;

    static {
        a.g gVar = new a.g();
        f3827k = gVar;
        c cVar = new c();
        f3828l = cVar;
        f3829m = new e1.a("ClientTelemetry.API", cVar, gVar);
    }

    public d(Context context, w wVar) {
        super(context, f3829m, wVar, e.a.f3154c);
    }

    @Override // h1.v
    public final h b(final t tVar) {
        q.a a4 = q.a();
        a4.d(a2.d.f14a);
        a4.c(false);
        a4.b(new m() { // from class: j1.b
            @Override // f1.m
            public final void accept(Object obj, Object obj2) {
                int i4 = d.f3830n;
                ((a) ((e) obj).C()).m0(t.this);
                ((i) obj2).c(null);
            }
        });
        return f(a4.a());
    }
}
