package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a1 implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final e1 f2709e;

    /* renamed from: f, reason: collision with root package name */
    final c2 f2710f;

    a1(e1 e1Var, c2 c2Var) {
        this.f2709e = e1Var;
        this.f2710f = c2Var;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Object s3;
        if (this.f2709e.f2832e != this) {
            return;
        }
        c2 c2Var = this.f2710f;
        e1 e1Var = this.f2709e;
        s3 = e1.s(c2Var);
        if (k1.j(e1Var, this, s3)) {
            e1.v(this.f2709e, false);
        }
    }
}
