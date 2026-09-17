package i3;

import v2.d;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c extends v2.a implements v2.d {

    /* renamed from: e, reason: collision with root package name */
    public static final a f3627e = new a(null);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a extends v2.b {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: i3.c$a$a, reason: collision with other inner class name */
        static final class C0049a extends b3.g implements a3.l {

            /* renamed from: f, reason: collision with root package name */
            public static final C0049a f3628f = new C0049a();

            C0049a() {
                super(1);
            }

            @Override // a3.l
            /* renamed from: d, reason: merged with bridge method [inline-methods] */
            public final c c(e.b bVar) {
                if (bVar instanceof c) {
                    return (c) bVar;
                }
                return null;
            }
        }

        private a() {
            super(v2.d.f5081d, C0049a.f3628f);
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }
    }

    public c() {
        super(v2.d.f5081d);
    }

    public abstract void a(v2.e eVar, Runnable runnable);

    public boolean b(v2.e eVar) {
        return true;
    }

    public c c(int i4) {
        k3.b.a(i4);
        return new k3.a(this, i4);
    }

    @Override // v2.a, v2.e.b, v2.e
    public e.b get(e.c cVar) {
        return d.a.a(this, cVar);
    }

    @Override // v2.a, v2.e
    public v2.e minusKey(e.c cVar) {
        return d.a.b(this, cVar);
    }

    public String toString() {
        return g.a(this) + '@' + g.b(this);
    }
}
