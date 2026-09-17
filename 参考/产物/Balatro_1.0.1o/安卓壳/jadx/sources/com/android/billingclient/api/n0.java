package com.android.billingclient.api;

import a1.b2.c3;
import com.google.android.gms.internal.play_billing.d6;
import com.google.android.gms.internal.play_billing.f6;
import com.google.android.gms.internal.play_billing.h6;
import com.google.android.gms.internal.play_billing.k6;
import com.google.android.gms.internal.play_billing.l6;
import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.p6;
import com.google.android.gms.internal.play_billing.u6;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract /* synthetic */ class n0 {

    /* renamed from: a, reason: collision with root package name */
    public static final /* synthetic */ int f2415a = 0;

    static {
        int i4 = o0.f2419a;
    }

    public static String a(Exception exc) {
        if (exc == null) {
            return null;
        }
        try {
            String str = exc.getClass().getSimpleName() + ":" + com.google.android.gms.internal.play_billing.y.c(exc.getMessage());
            int i4 = com.google.android.gms.internal.play_billing.m0.f2862a;
            return str.length() > 40 ? str.substring(0, 40) : str;
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to get truncated exception info", th);
            return null;
        }
    }

    public static f6 b(n6 n6Var, int i4, d dVar, String str, u6 u6Var) {
        try {
            l6 D = p6.D();
            D.r(dVar.c());
            D.n(dVar.a());
            if (dVar.b() != 0) {
                D.p(dVar.b());
            }
            if (n6Var != null) {
                D.q(n6Var);
            }
            if (str != null) {
                D.m(str);
            }
            d6 F = f6.F();
            F.n(D);
            F.q(i4);
            if (!u6Var.equals(u6.BROADCAST_ACTION_UNSPECIFIED)) {
                F.m(u6Var);
            }
            return (f6) F.i();
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingLogger", "Unable to create logging payload", th);
            return null;
        }
    }

    public static k6 c(int i4, u6 u6Var) {
        try {
            h6 D = k6.D();
            D.p(i4);
            if (!u6Var.equals(u6.BROADCAST_ACTION_UNSPECIFIED)) {
                D.m(u6Var);
            }
            return (k6) D.i();
        } catch (Exception e4) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(1275), "Unable to create logging payload", e4);
            return null;
        }
    }
}
