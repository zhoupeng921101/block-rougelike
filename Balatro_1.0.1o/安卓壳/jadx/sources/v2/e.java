package v2;

import a1.b2.c3;
import a3.p;
import b3.g;
import v2.d;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface e {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: v2.e$a$a, reason: collision with other inner class name */
        static final class C0079a extends g implements p {

            /* renamed from: f, reason: collision with root package name */
            public static final C0079a f5083f = new C0079a();

            C0079a() {
                super(2);
            }

            @Override // a3.p
            /* renamed from: d, reason: merged with bridge method [inline-methods] */
            public final e b(e eVar, b bVar) {
                b3.f.e(eVar, "acc");
                b3.f.e(bVar, "element");
                e minusKey = eVar.minusKey(bVar.getKey());
                f fVar = f.f5084e;
                if (minusKey == fVar) {
                    return bVar;
                }
                d.b bVar2 = d.f5081d;
                d dVar = (d) minusKey.get(bVar2);
                if (dVar == null) {
                    return new v2.c(minusKey, bVar);
                }
                e minusKey2 = minusKey.minusKey(bVar2);
                return minusKey2 == fVar ? new v2.c(bVar, dVar) : new v2.c(new v2.c(minusKey2, bVar), dVar);
            }
        }

        public static e a(e eVar, e eVar2) {
            b3.f.e(eVar2, "context");
            return eVar2 == f.f5084e ? eVar : (e) eVar2.fold(eVar, C0079a.f5083f);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b extends e {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class a {
            public static Object a(b bVar, Object obj, p pVar) {
                b3.f.e(pVar, "operation");
                return pVar.b(obj, bVar);
            }

            public static b b(b bVar, c cVar) {
                b3.f.e(cVar, "key");
                if (!b3.f.a(bVar.getKey(), cVar)) {
                    return null;
                }
                b3.f.c(bVar, c3.d4(42));
                return bVar;
            }

            public static e c(b bVar, c cVar) {
                b3.f.e(cVar, "key");
                return b3.f.a(bVar.getKey(), cVar) ? f.f5084e : bVar;
            }

            public static e d(b bVar, e eVar) {
                b3.f.e(eVar, "context");
                return a.a(bVar, eVar);
            }
        }

        @Override // v2.e
        b get(c cVar);

        c getKey();
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface c {
    }

    Object fold(Object obj, p pVar);

    b get(c cVar);

    e minusKey(c cVar);
}
