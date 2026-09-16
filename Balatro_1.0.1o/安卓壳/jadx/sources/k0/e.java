package k0;

import android.content.Context;
import k0.u;
import r0.w;
import s0.n0;
import s0.u0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e extends u {

    /* renamed from: e, reason: collision with root package name */
    private s2.a f3946e;

    /* renamed from: f, reason: collision with root package name */
    private s2.a f3947f;

    /* renamed from: g, reason: collision with root package name */
    private s2.a f3948g;

    /* renamed from: h, reason: collision with root package name */
    private s2.a f3949h;

    /* renamed from: i, reason: collision with root package name */
    private s2.a f3950i;

    /* renamed from: j, reason: collision with root package name */
    private s2.a f3951j;

    /* renamed from: k, reason: collision with root package name */
    private s2.a f3952k;

    /* renamed from: l, reason: collision with root package name */
    private s2.a f3953l;

    /* renamed from: m, reason: collision with root package name */
    private s2.a f3954m;

    /* renamed from: n, reason: collision with root package name */
    private s2.a f3955n;

    /* renamed from: o, reason: collision with root package name */
    private s2.a f3956o;

    /* renamed from: p, reason: collision with root package name */
    private s2.a f3957p;

    /* renamed from: q, reason: collision with root package name */
    private s2.a f3958q;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class b implements u.a {

        /* renamed from: a, reason: collision with root package name */
        private Context f3959a;

        private b() {
        }

        @Override // k0.u.a
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public b a(Context context) {
            this.f3959a = (Context) m0.d.b(context);
            return this;
        }

        @Override // k0.u.a
        public u build() {
            m0.d.a(this.f3959a, Context.class);
            return new e(this.f3959a);
        }
    }

    private e(Context context) {
        d(context);
    }

    public static u.a c() {
        return new b();
    }

    private void d(Context context) {
        this.f3946e = m0.a.a(k.a());
        m0.b a4 = m0.c.a(context);
        this.f3947f = a4;
        l0.j a5 = l0.j.a(a4, u0.c.a(), u0.d.a());
        this.f3948g = a5;
        this.f3949h = m0.a.a(l0.l.a(this.f3947f, a5));
        this.f3950i = u0.a(this.f3947f, s0.g.a(), s0.i.a());
        this.f3951j = m0.a.a(s0.h.a(this.f3947f));
        this.f3952k = m0.a.a(n0.a(u0.c.a(), u0.d.a(), s0.j.a(), this.f3950i, this.f3951j));
        q0.g b4 = q0.g.b(u0.c.a());
        this.f3953l = b4;
        q0.i a6 = q0.i.a(this.f3947f, this.f3952k, b4, u0.d.a());
        this.f3954m = a6;
        s2.a aVar = this.f3946e;
        s2.a aVar2 = this.f3949h;
        s2.a aVar3 = this.f3952k;
        this.f3955n = q0.d.a(aVar, aVar2, a6, aVar3, aVar3);
        s2.a aVar4 = this.f3947f;
        s2.a aVar5 = this.f3949h;
        s2.a aVar6 = this.f3952k;
        this.f3956o = r0.s.a(aVar4, aVar5, aVar6, this.f3954m, this.f3946e, aVar6, u0.c.a(), u0.d.a(), this.f3952k);
        s2.a aVar7 = this.f3946e;
        s2.a aVar8 = this.f3952k;
        this.f3957p = w.a(aVar7, aVar8, this.f3954m, aVar8);
        this.f3958q = m0.a.a(v.a(u0.c.a(), u0.d.a(), this.f3955n, this.f3956o, this.f3957p));
    }

    @Override // k0.u
    s0.d a() {
        return (s0.d) this.f3952k.get();
    }

    @Override // k0.u
    t b() {
        return (t) this.f3958q.get();
    }
}
