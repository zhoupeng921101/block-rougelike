package r0;

import a1.b2.c3;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executor;
import l0.g;
import n0.c;
import t0.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class r {

    /* renamed from: a, reason: collision with root package name */
    private final Context f4798a;

    /* renamed from: b, reason: collision with root package name */
    private final l0.e f4799b;

    /* renamed from: c, reason: collision with root package name */
    private final s0.d f4800c;

    /* renamed from: d, reason: collision with root package name */
    private final x f4801d;

    /* renamed from: e, reason: collision with root package name */
    private final Executor f4802e;

    /* renamed from: f, reason: collision with root package name */
    private final t0.b f4803f;

    /* renamed from: g, reason: collision with root package name */
    private final u0.a f4804g;

    /* renamed from: h, reason: collision with root package name */
    private final u0.a f4805h;

    /* renamed from: i, reason: collision with root package name */
    private final s0.c f4806i;

    public r(Context context, l0.e eVar, s0.d dVar, x xVar, Executor executor, t0.b bVar, u0.a aVar, u0.a aVar2, s0.c cVar) {
        this.f4798a = context;
        this.f4799b = eVar;
        this.f4800c = dVar;
        this.f4801d = xVar;
        this.f4802e = executor;
        this.f4803f = bVar;
        this.f4804g = aVar;
        this.f4805h = aVar2;
        this.f4806i = cVar;
    }

    public static /* synthetic */ Object b(r rVar, Iterable iterable, k0.o oVar, long j4) {
        rVar.f4800c.S(iterable);
        rVar.f4800c.V(oVar, rVar.f4804g.a() + j4);
        return null;
    }

    public static /* synthetic */ Object c(r rVar) {
        rVar.f4806i.d();
        return null;
    }

    public static /* synthetic */ Object e(r rVar, Iterable iterable) {
        rVar.f4800c.q(iterable);
        return null;
    }

    public static /* synthetic */ Object f(r rVar, k0.o oVar, int i4) {
        rVar.f4801d.b(oVar, i4 + 1);
        return null;
    }

    public static /* synthetic */ Object g(r rVar, k0.o oVar, long j4) {
        rVar.f4800c.V(oVar, rVar.f4804g.a() + j4);
        return null;
    }

    public static /* synthetic */ Object h(r rVar, Map map) {
        rVar.getClass();
        Iterator it = map.entrySet().iterator();
        while (it.hasNext()) {
            rVar.f4806i.b(((Integer) r0.getValue()).intValue(), c.b.INVALID_PAYLOD, (String) ((Map.Entry) it.next()).getKey());
        }
        return null;
    }

    public static /* synthetic */ void i(final r rVar, final k0.o oVar, final int i4, Runnable runnable) {
        rVar.getClass();
        try {
            try {
                t0.b bVar = rVar.f4803f;
                final s0.d dVar = rVar.f4800c;
                Objects.requireNonNull(dVar);
                bVar.a(new b.a() { // from class: r0.i
                    @Override // t0.b.a
                    public final Object a() {
                        return Integer.valueOf(s0.d.this.o());
                    }
                });
                if (rVar.k()) {
                    rVar.l(oVar, i4);
                } else {
                    rVar.f4803f.a(new b.a() { // from class: r0.j
                        @Override // t0.b.a
                        public final Object a() {
                            return r.f(r.this, oVar, i4);
                        }
                    });
                }
                runnable.run();
            } catch (t0.a unused) {
                rVar.f4801d.b(oVar, i4 + 1);
                runnable.run();
            }
        } catch (Throwable th) {
            runnable.run();
            throw th;
        }
    }

    public k0.i j(l0.m mVar) {
        t0.b bVar = this.f4803f;
        final s0.c cVar = this.f4806i;
        Objects.requireNonNull(cVar);
        return mVar.a(k0.i.a().i(this.f4804g.a()).k(this.f4805h.a()).j(c3.d4(1350)).h(new k0.h(i0.b.b(c3.d4(1009)), ((n0.a) bVar.a(new b.a() { // from class: r0.h
            @Override // t0.b.a
            public final Object a() {
                return s0.c.this.c();
            }
        })).f())).d());
    }

    boolean k() {
        NetworkInfo activeNetworkInfo = ((ConnectivityManager) this.f4798a.getSystemService(c3.d4(138))).getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    public l0.g l(final k0.o oVar, int i4) {
        l0.g b4;
        l0.m a4 = this.f4799b.a(oVar.b());
        l0.g e4 = l0.g.e(0L);
        final long j4 = 0;
        while (((Boolean) this.f4803f.a(new b.a() { // from class: r0.k
            @Override // t0.b.a
            public final Object a() {
                Boolean valueOf;
                valueOf = Boolean.valueOf(r.this.f4800c.y(oVar));
                return valueOf;
            }
        })).booleanValue()) {
            final Iterable iterable = (Iterable) this.f4803f.a(new b.a() { // from class: r0.l
                @Override // t0.b.a
                public final Object a() {
                    Iterable Q;
                    Q = r.this.f4800c.Q(oVar);
                    return Q;
                }
            });
            if (!iterable.iterator().hasNext()) {
                return e4;
            }
            if (a4 == null) {
                o0.a.b("Uploader", c3.d4(1396), oVar);
                b4 = l0.g.a();
            } else {
                ArrayList arrayList = new ArrayList();
                Iterator it = iterable.iterator();
                while (it.hasNext()) {
                    arrayList.add(((s0.k) it.next()).b());
                }
                if (oVar.e()) {
                    arrayList.add(j(a4));
                }
                b4 = a4.b(l0.f.a().b(arrayList).c(oVar.c()).a());
            }
            e4 = b4;
            if (e4.c() == g.a.f4126f) {
                final k0.o oVar2 = oVar;
                this.f4803f.a(new b.a() { // from class: r0.m
                    @Override // t0.b.a
                    public final Object a() {
                        return r.b(r.this, iterable, oVar2, j4);
                    }
                });
                this.f4801d.a(oVar2, i4 + 1, true);
                return e4;
            }
            k0.o oVar3 = oVar;
            this.f4803f.a(new b.a() { // from class: r0.n
                @Override // t0.b.a
                public final Object a() {
                    return r.e(r.this, iterable);
                }
            });
            if (e4.c() == g.a.f4125e) {
                long max = Math.max(j4, e4.b());
                if (oVar3.e()) {
                    this.f4803f.a(new b.a() { // from class: r0.o
                        @Override // t0.b.a
                        public final Object a() {
                            return r.c(r.this);
                        }
                    });
                }
                j4 = max;
            } else if (e4.c() == g.a.INVALID_PAYLOAD) {
                final HashMap hashMap = new HashMap();
                Iterator it2 = iterable.iterator();
                while (it2.hasNext()) {
                    String j5 = ((s0.k) it2.next()).b().j();
                    if (hashMap.containsKey(j5)) {
                        hashMap.put(j5, Integer.valueOf(((Integer) hashMap.get(j5)).intValue() + 1));
                    } else {
                        hashMap.put(j5, 1);
                    }
                }
                this.f4803f.a(new b.a() { // from class: r0.p
                    @Override // t0.b.a
                    public final Object a() {
                        return r.h(r.this, hashMap);
                    }
                });
            }
            oVar = oVar3;
        }
        final k0.o oVar4 = oVar;
        this.f4803f.a(new b.a() { // from class: r0.q
            @Override // t0.b.a
            public final Object a() {
                return r.g(r.this, oVar4, j4);
            }
        });
        return e4;
    }

    public void m(final k0.o oVar, final int i4, final Runnable runnable) {
        this.f4802e.execute(new Runnable() { // from class: r0.g
            @Override // java.lang.Runnable
            public final void run() {
                r.i(r.this, oVar, i4, runnable);
            }
        });
    }
}
