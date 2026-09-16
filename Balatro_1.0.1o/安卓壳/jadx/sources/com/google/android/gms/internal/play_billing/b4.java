package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b4 extends v2 {

    /* renamed from: e, reason: collision with root package name */
    private final d4 f2721e;

    /* renamed from: f, reason: collision with root package name */
    protected d4 f2722f;

    protected b4(d4 d4Var) {
        this.f2721e = d4Var;
        if (d4Var.l()) {
            throw new IllegalArgumentException("Default instance must be immutable.");
        }
        this.f2722f = d4Var.v();
    }

    private static void b(Object obj, Object obj2) {
        h5.a().b(obj.getClass()).j(obj, obj2);
    }

    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public final b4 clone() {
        b4 b4Var = (b4) this.f2721e.p(5, null, null);
        b4Var.f2722f = d();
        return b4Var;
    }

    public final b4 e(d4 d4Var) {
        if (!this.f2721e.equals(d4Var)) {
            if (!this.f2722f.l()) {
                l();
            }
            b(this.f2722f, d4Var);
        }
        return this;
    }

    public final d4 i() {
        d4 d4 = d();
        if (d4.r()) {
            return d4;
        }
        throw new p5(d4);
    }

    @Override // com.google.android.gms.internal.play_billing.z4
    /* renamed from: j, reason: merged with bridge method [inline-methods] */
    public d4 d() {
        if (!this.f2722f.l()) {
            return this.f2722f;
        }
        this.f2722f.B();
        return this.f2722f;
    }

    protected final void k() {
        if (this.f2722f.l()) {
            return;
        }
        l();
    }

    protected void l() {
        d4 v3 = this.f2721e.v();
        b(v3, this.f2722f);
        this.f2722f = v3;
    }
}
