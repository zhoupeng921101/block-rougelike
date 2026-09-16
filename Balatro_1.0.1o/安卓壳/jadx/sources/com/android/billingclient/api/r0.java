package com.android.billingclient.api;

import a1.b2.c3;
import android.content.Context;
import com.google.android.gms.internal.play_billing.r7;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class r0 {

    /* renamed from: a, reason: collision with root package name */
    private boolean f2455a;

    /* renamed from: b, reason: collision with root package name */
    private i0.f f2456b;

    r0(Context context) {
        try {
            k0.t.f(context);
            this.f2456b = k0.t.c().g(com.google.android.datatransport.cct.a.f2483g).a("PLAY_BILLING_LIBRARY", r7.class, i0.b.b("proto"), new i0.e() { // from class: e0.w
                @Override // i0.e
                public final Object apply(Object obj) {
                    return ((r7) obj).b();
                }
            });
        } catch (Throwable unused) {
            this.f2455a = true;
        }
    }

    public final void a(r7 r7Var) {
        boolean z3 = this.f2455a;
        String d4 = c3.d4(1163);
        if (z3) {
            com.google.android.gms.internal.play_billing.m0.m(d4, "Skipping logging since initialization failed.");
            return;
        }
        try {
            this.f2456b.a(i0.c.d(r7Var));
        } catch (Throwable unused) {
            com.google.android.gms.internal.play_billing.m0.m(d4, "logging failed.");
        }
    }
}
