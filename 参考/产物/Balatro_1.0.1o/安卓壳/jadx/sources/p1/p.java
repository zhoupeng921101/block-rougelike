package p1;

import a1.b2.c3;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface p {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private final Object f4619a;

        /* renamed from: b, reason: collision with root package name */
        private final b f4620b;

        public a(Object obj, b bVar) {
            this.f4619a = obj;
            this.f4620b = bVar;
        }

        public b a() {
            if (c()) {
                return this.f4620b;
            }
            throw new IllegalStateException("getConflict called when there is no conflict.");
        }

        public Object b() {
            if (c()) {
                throw new IllegalStateException(c3.d4(1347));
            }
            return this.f4619a;
        }

        public boolean c() {
            return this.f4620b != null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private final v1.a f4621a;

        /* renamed from: b, reason: collision with root package name */
        private final String f4622b;

        /* renamed from: c, reason: collision with root package name */
        private final v1.a f4623c;

        /* renamed from: d, reason: collision with root package name */
        private final v1.b f4624d;

        public b(v1.a aVar, String str, v1.a aVar2, v1.b bVar) {
            this.f4621a = aVar;
            this.f4622b = str;
            this.f4623c = aVar2;
            this.f4624d = bVar;
        }

        public String a() {
            return this.f4622b;
        }

        public v1.a b() {
            return this.f4623c;
        }

        public v1.b c() {
            return this.f4624d;
        }

        public v1.a d() {
            return this.f4621a;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class c extends e1.b {

        /* renamed from: f, reason: collision with root package name */
        protected final v1.e f4625f;

        public c(Status status, v1.e eVar) {
            super(status);
            this.f4625f = eVar;
        }
    }

    g2.h a(v1.a aVar);

    g2.h b(v1.a aVar, v1.g gVar);

    g2.h c(String str, String str2, v1.g gVar, v1.b bVar);

    g2.h d(String str, boolean z3, int i4);
}
