package x1;

import android.content.Context;
import com.google.android.gms.common.api.Status;
import e1.a;
import e1.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class p extends e1.e implements x0.b {

    /* renamed from: m, reason: collision with root package name */
    private static final a.g f5123m;

    /* renamed from: n, reason: collision with root package name */
    private static final a.AbstractC0041a f5124n;

    /* renamed from: o, reason: collision with root package name */
    private static final e1.a f5125o;

    /* renamed from: k, reason: collision with root package name */
    private final Context f5126k;

    /* renamed from: l, reason: collision with root package name */
    private final d1.j f5127l;

    static {
        a.g gVar = new a.g();
        f5123m = gVar;
        n nVar = new n();
        f5124n = nVar;
        f5125o = new e1.a("AppSet.API", nVar, gVar);
    }

    p(Context context, d1.j jVar) {
        super(context, f5125o, a.d.f3142a, e.a.f3154c);
        this.f5126k = context;
        this.f5127l = jVar;
    }

    @Override // x0.b
    public final g2.h a() {
        return this.f5127l.g(this.f5126k, 212800000) == 0 ? g(f1.q.a().d(x0.h.f5108a).b(new f1.m() { // from class: x1.m
            @Override // f1.m
            public final void accept(Object obj, Object obj2) {
                ((g) ((d) obj).C()).i(new x0.d(null, null), new o(p.this, (g2.i) obj2));
            }
        }).c(false).e(27601).a()) : g2.k.a(new e1.b(new Status(17)));
    }
}
