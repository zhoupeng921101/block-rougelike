package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j8 {

    /* renamed from: a, reason: collision with root package name */
    Object f2821a;

    /* renamed from: b, reason: collision with root package name */
    n8 f2822b;

    /* renamed from: c, reason: collision with root package name */
    private p8 f2823c = p8.i();

    /* renamed from: d, reason: collision with root package name */
    private boolean f2824d;

    j8() {
    }

    final void a() {
        this.f2821a = null;
        this.f2822b = null;
        this.f2823c.d(null);
    }

    public final boolean b(Object obj) {
        this.f2824d = true;
        n8 n8Var = this.f2822b;
        boolean z3 = n8Var != null && n8Var.b(obj);
        if (z3) {
            this.f2821a = null;
            this.f2822b = null;
            this.f2823c = null;
        }
        return z3;
    }

    protected final void finalize() {
        p8 p8Var;
        n8 n8Var = this.f2822b;
        if (n8Var != null && !n8Var.isDone()) {
            n8Var.c(new k8("The completer object was garbage collected - this future would otherwise never complete. The tag was: ".concat(String.valueOf(this.f2821a))));
        }
        if (this.f2824d || (p8Var = this.f2823c) == null) {
            return;
        }
        p8Var.d(null);
    }
}
