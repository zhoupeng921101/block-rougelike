package v2;

import a1.b2.c3;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface d extends e.b {

    /* renamed from: d, reason: collision with root package name */
    public static final b f5081d = b.f5082a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        public static e.b a(d dVar, e.c cVar) {
            e.b b4;
            b3.f.e(cVar, c3.d4(861));
            if (!(cVar instanceof v2.b)) {
                if (d.f5081d != cVar) {
                    return null;
                }
                b3.f.c(dVar, c3.d4(713));
                return dVar;
            }
            v2.b bVar = (v2.b) cVar;
            if (!bVar.a(dVar.getKey()) || (b4 = bVar.b(dVar)) == null) {
                return null;
            }
            return b4;
        }

        public static e b(d dVar, e.c cVar) {
            b3.f.e(cVar, c3.d4(498));
            if (!(cVar instanceof v2.b)) {
                return d.f5081d == cVar ? f.f5084e : dVar;
            }
            v2.b bVar = (v2.b) cVar;
            return (!bVar.a(dVar.getKey()) || bVar.b(dVar) == null) ? dVar : f.f5084e;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b implements e.c {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ b f5082a = new b();

        private b() {
        }
    }
}
