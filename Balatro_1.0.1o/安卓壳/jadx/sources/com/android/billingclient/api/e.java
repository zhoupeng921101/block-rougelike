package com.android.billingclient.api;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e {

    /* renamed from: a, reason: collision with root package name */
    private final boolean f2306a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f2307b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private boolean f2308a;

        /* renamed from: b, reason: collision with root package name */
        private boolean f2309b;

        private a() {
        }

        public e a() {
            if (!this.f2308a) {
                throw new IllegalArgumentException("Pending purchases for one-time products must be supported.");
            }
            return new e(true, this.f2309b);
        }

        public a b() {
            this.f2308a = true;
            return this;
        }
    }

    private e(boolean z3, boolean z4) {
        this.f2306a = z3;
        this.f2307b = z4;
    }

    public static a c() {
        return new a();
    }

    boolean a() {
        return this.f2306a;
    }

    boolean b() {
        return this.f2307b;
    }
}
