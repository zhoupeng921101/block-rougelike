package androidx.lifecycle;

import a1.b2.c3;
import x.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class y {

    /* renamed from: a, reason: collision with root package name */
    private final a0 f1706a;

    /* renamed from: b, reason: collision with root package name */
    private final b f1707b;

    /* renamed from: c, reason: collision with root package name */
    private final x.a f1708c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a extends c {

        /* renamed from: d, reason: collision with root package name */
        public static final C0021a f1709d = new C0021a(null);

        /* renamed from: e, reason: collision with root package name */
        public static final a.b f1710e = C0021a.C0022a.f1711a;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: androidx.lifecycle.y$a$a, reason: collision with other inner class name */
        public static final class C0021a {

            /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
            /* renamed from: androidx.lifecycle.y$a$a$a, reason: collision with other inner class name */
            private static final class C0022a implements a.b {

                /* renamed from: a, reason: collision with root package name */
                public static final C0022a f1711a = new C0022a();

                private C0022a() {
                }
            }

            private C0021a() {
            }

            public /* synthetic */ C0021a(b3.d dVar) {
                this();
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b {

        /* renamed from: a, reason: collision with root package name */
        public static final a f1712a = a.f1713a;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class a {

            /* renamed from: a, reason: collision with root package name */
            static final /* synthetic */ a f1713a = new a();

            private a() {
            }
        }

        default x a(Class cls) {
            b3.f.e(cls, c3.d4(369));
            throw new UnsupportedOperationException("Factory.create(String) is unsupported.  This Factory requires `CreationExtras` to be passed into `create` method.");
        }

        default x b(Class cls, x.a aVar) {
            b3.f.e(cls, "modelClass");
            b3.f.e(aVar, "extras");
            return a(cls);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class c implements b {

        /* renamed from: b, reason: collision with root package name */
        public static final a f1714b = new a(null);

        /* renamed from: c, reason: collision with root package name */
        public static final a.b f1715c = a.C0023a.f1716a;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class a {

            /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
            /* renamed from: androidx.lifecycle.y$c$a$a, reason: collision with other inner class name */
            private static final class C0023a implements a.b {

                /* renamed from: a, reason: collision with root package name */
                public static final C0023a f1716a = new C0023a();

                private C0023a() {
                }
            }

            private a() {
            }

            public /* synthetic */ a(b3.d dVar) {
                this();
            }
        }
    }

    /* JADX WARN: 'this' call moved to the top of the method (can break code semantics) */
    public y(a0 a0Var, b bVar) {
        this(a0Var, bVar, null, 4, null);
        b3.f.e(a0Var, c3.d4(233));
        b3.f.e(bVar, c3.d4(1486));
    }

    public y(a0 a0Var, b bVar, x.a aVar) {
        b3.f.e(a0Var, "store");
        b3.f.e(bVar, c3.d4(512));
        b3.f.e(aVar, "defaultCreationExtras");
        this.f1706a = a0Var;
        this.f1707b = bVar;
        this.f1708c = aVar;
    }

    public /* synthetic */ y(a0 a0Var, b bVar, x.a aVar, int i4, b3.d dVar) {
        this(a0Var, bVar, (i4 & 4) != 0 ? a.C0083a.f5096b : aVar);
    }

    /* JADX WARN: Illegal instructions before constructor call */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public y(androidx.lifecycle.b0 r3, androidx.lifecycle.y.b r4) {
        /*
            r2 = this;
            r0 = 0
            r0 = 1064(0x428, float:1.491E-42)
            java.lang.String r0 = a1.b2.c3.d4(r0)
            b3.f.e(r3, r0)
            java.lang.String r0 = "factory"
            b3.f.e(r4, r0)
            androidx.lifecycle.a0 r0 = r3.o()
            java.lang.String r1 = "owner.viewModelStore"
            b3.f.d(r0, r1)
            x.a r3 = androidx.lifecycle.z.a(r3)
            r2.<init>(r0, r4, r3)
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.lifecycle.y.<init>(androidx.lifecycle.b0, androidx.lifecycle.y$b):void");
    }

    public x a(Class cls) {
        b3.f.e(cls, "modelClass");
        String canonicalName = cls.getCanonicalName();
        if (canonicalName == null) {
            throw new IllegalArgumentException(c3.d4(1404));
        }
        return b("androidx.lifecycle.ViewModelProvider.DefaultKey:" + canonicalName, cls);
    }

    public x b(String str, Class cls) {
        x a4;
        b3.f.e(str, "key");
        b3.f.e(cls, "modelClass");
        x b4 = this.f1706a.b(str);
        if (cls.isInstance(b4)) {
            if (b4 != null) {
                return b4;
            }
            throw new NullPointerException("null cannot be cast to non-null type T of androidx.lifecycle.ViewModelProvider.get");
        }
        x.d dVar = new x.d(this.f1708c);
        dVar.b(c.f1715c, str);
        try {
            a4 = this.f1707b.b(cls, dVar);
        } catch (AbstractMethodError unused) {
            a4 = this.f1707b.a(cls);
        }
        this.f1706a.d(str, a4);
        return a4;
    }
}
