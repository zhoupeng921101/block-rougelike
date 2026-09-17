package f1;

import e1.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class q {

    /* renamed from: a, reason: collision with root package name */
    private final d1.c[] f3292a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f3293b;

    /* renamed from: c, reason: collision with root package name */
    private final int f3294c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private m f3295a;

        /* renamed from: c, reason: collision with root package name */
        private d1.c[] f3297c;

        /* renamed from: b, reason: collision with root package name */
        private boolean f3296b = true;

        /* renamed from: d, reason: collision with root package name */
        private int f3298d = 0;

        /* synthetic */ a(u0 u0Var) {
        }

        public q a() {
            h1.q.b(this.f3295a != null, "execute parameter required");
            return new t0(this, this.f3297c, this.f3296b, this.f3298d);
        }

        public a b(m mVar) {
            this.f3295a = mVar;
            return this;
        }

        public a c(boolean z3) {
            this.f3296b = z3;
            return this;
        }

        public a d(d1.c... cVarArr) {
            this.f3297c = cVarArr;
            return this;
        }

        public a e(int i4) {
            this.f3298d = i4;
            return this;
        }
    }

    protected q(d1.c[] cVarArr, boolean z3, int i4) {
        this.f3292a = cVarArr;
        boolean z4 = false;
        if (cVarArr != null && z3) {
            z4 = true;
        }
        this.f3293b = z4;
        this.f3294c = i4;
    }

    public static a a() {
        return new a(null);
    }

    protected abstract void b(a.b bVar, g2.i iVar);

    public boolean c() {
        return this.f3293b;
    }

    public final int d() {
        return this.f3294c;
    }

    public final d1.c[] e() {
        return this.f3292a;
    }
}
