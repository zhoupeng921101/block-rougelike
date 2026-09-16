package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e5 implements k5 {

    /* renamed from: a, reason: collision with root package name */
    private final a5 f2757a;

    /* renamed from: b, reason: collision with root package name */
    private final q5 f2758b;

    /* renamed from: c, reason: collision with root package name */
    private final boolean f2759c = false;

    /* renamed from: d, reason: collision with root package name */
    private final w3 f2760d;

    private e5(q5 q5Var, w3 w3Var, a5 a5Var) {
        this.f2758b = q5Var;
        this.f2760d = w3Var;
        this.f2757a = a5Var;
    }

    static e5 b(q5 q5Var, w3 w3Var, a5 a5Var) {
        return new e5(q5Var, w3Var, a5Var);
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final int a(Object obj) {
        int hashCode = ((d4) obj).zzc.hashCode();
        if (!this.f2759c) {
            return hashCode;
        }
        h.d.a(obj);
        throw null;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final Object e() {
        a5 a5Var = this.f2757a;
        return a5Var instanceof d4 ? ((d4) a5Var).v() : a5Var.f().d();
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void f(Object obj, byte[] bArr, int i4, int i5, z2 z2Var) {
        d4 d4Var = (d4) obj;
        if (d4Var.zzc == r5.c()) {
            d4Var.zzc = r5.f();
        }
        h.d.a(obj);
        throw null;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void g(Object obj) {
        this.f2758b.b(obj);
        this.f2760d.a(obj);
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void h(Object obj, c6 c6Var) {
        h.d.a(obj);
        throw null;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final int i(Object obj) {
        int b4 = ((d4) obj).zzc.b();
        if (!this.f2759c) {
            return b4;
        }
        h.d.a(obj);
        throw null;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void j(Object obj, Object obj2) {
        m5.w(this.f2758b, obj, obj2);
        if (this.f2759c) {
            m5.v(this.f2760d, obj, obj2);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final boolean k(Object obj, Object obj2) {
        if (!((d4) obj).zzc.equals(((d4) obj2).zzc)) {
            return false;
        }
        if (!this.f2759c) {
            return true;
        }
        h.d.a(obj);
        throw null;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final boolean l(Object obj) {
        h.d.a(obj);
        throw null;
    }
}
