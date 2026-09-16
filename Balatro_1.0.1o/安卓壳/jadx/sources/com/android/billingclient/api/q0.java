package com.android.billingclient.api;

import a1.b2.c3;
import android.content.Context;
import com.google.android.gms.internal.play_billing.b7;
import com.google.android.gms.internal.play_billing.b8;
import com.google.android.gms.internal.play_billing.d6;
import com.google.android.gms.internal.play_billing.f6;
import com.google.android.gms.internal.play_billing.h6;
import com.google.android.gms.internal.play_billing.j7;
import com.google.android.gms.internal.play_billing.k6;
import com.google.android.gms.internal.play_billing.p7;
import com.google.android.gms.internal.play_billing.r7;
import com.google.android.gms.internal.play_billing.s6;
import com.google.android.gms.internal.play_billing.x7;
import com.google.android.gms.internal.play_billing.z6;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class q0 implements o0 {

    /* renamed from: b, reason: collision with root package name */
    private b7 f2450b;

    /* renamed from: c, reason: collision with root package name */
    private final r0 f2451c;

    q0(Context context, b7 b7Var) {
        this.f2451c = new r0(context);
        this.f2450b = b7Var;
    }

    private final void l(f6 f6Var, b7 b7Var) {
        if (f6Var == null) {
            return;
        }
        try {
            p7 D = r7.D();
            D.p(b7Var);
            D.m(f6Var);
            this.f2451c.a((r7) D.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", c3.d4(881), th);
        }
    }

    private final void m(k6 k6Var, b7 b7Var) {
        if (k6Var == null) {
            return;
        }
        try {
            p7 D = r7.D();
            D.p(b7Var);
            D.n(k6Var);
            this.f2451c.a((r7) D.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", c3.d4(1324), th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void a(k6 k6Var, long j4, boolean z3) {
        b7 b7Var;
        try {
            h6 h6Var = (h6) k6Var.t();
            j7 j7Var = (j7) k6Var.F().t();
            j7Var.m(z3);
            h6Var.n(j7Var);
            k6 k6Var2 = (k6) h6Var.i();
            if (j4 == 0) {
                b7Var = this.f2450b;
            } else {
                z6 z6Var = (z6) this.f2450b.t();
                z6Var.q(j4);
                b7Var = (b7) z6Var.i();
            }
            m(k6Var2, b7Var);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(976), "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void b(s6 s6Var) {
        try {
            p7 D = r7.D();
            D.p(this.f2450b);
            D.o(s6Var);
            this.f2451c.a((r7) D.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void c(f6 f6Var, int i4, long j4, boolean z3) {
        b7 b7Var;
        try {
            z6 z6Var = (z6) this.f2450b.t();
            z6Var.o(i4);
            this.f2450b = (b7) z6Var.i();
            d6 d6Var = (d6) f6Var.t();
            j7 j7Var = (j7) f6Var.I().t();
            j7Var.m(z3);
            d6Var.o(j7Var);
            f6 f6Var2 = (f6) d6Var.i();
            if (j4 == 0) {
                b7Var = this.f2450b;
            } else {
                z6 z6Var2 = (z6) this.f2450b.t();
                z6Var2.q(j4);
                b7Var = (b7) z6Var2.i();
            }
            l(f6Var2, b7Var);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void d(f6 f6Var, long j4, boolean z3) {
        b7 b7Var;
        try {
            d6 d6Var = (d6) f6Var.t();
            j7 j7Var = (j7) f6Var.I().t();
            j7Var.m(z3);
            d6Var.o(j7Var);
            f6 f6Var2 = (f6) d6Var.i();
            if (j4 == 0) {
                b7Var = this.f2450b;
            } else {
                z6 z6Var = (z6) this.f2450b.t();
                z6Var.q(j4);
                b7Var = (b7) z6Var.i();
            }
            l(f6Var2, b7Var);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void e(f6 f6Var, int i4) {
        try {
            z6 z6Var = (z6) this.f2450b.t();
            z6Var.o(i4);
            this.f2450b = (b7) z6Var.i();
            f(f6Var);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void f(f6 f6Var) {
        try {
            l(f6Var, this.f2450b);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void g(k6 k6Var, int i4) {
        try {
            z6 z6Var = (z6) this.f2450b.t();
            z6Var.o(i4);
            this.f2450b = (b7) z6Var.i();
            h(k6Var);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(783), "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void h(k6 k6Var) {
        try {
            m(k6Var, this.f2450b);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void i(b8 b8Var) {
        if (b8Var == null) {
            return;
        }
        try {
            p7 D = r7.D();
            D.p(this.f2450b);
            D.r(b8Var);
            this.f2451c.a((r7) D.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void j(f6 f6Var, int i4, long j4) {
        try {
            z6 z6Var = (z6) this.f2450b.t();
            z6Var.o(i4);
            b7 b7Var = (b7) z6Var.i();
            this.f2450b = b7Var;
            if (j4 != 0) {
                z6 z6Var2 = (z6) b7Var.t();
                z6Var2.q(j4);
                b7Var = (b7) z6Var2.i();
            }
            l(f6Var, b7Var);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(286), "Unable to log.", th);
        }
    }

    @Override // com.android.billingclient.api.o0
    public final void k(x7 x7Var) {
        try {
            r0 r0Var = this.f2451c;
            p7 D = r7.D();
            D.p(this.f2450b);
            D.q(x7Var);
            r0Var.a((r7) D.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to log.", th);
        }
    }
}
