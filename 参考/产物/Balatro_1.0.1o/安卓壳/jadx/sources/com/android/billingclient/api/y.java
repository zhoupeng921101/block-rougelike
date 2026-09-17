package com.android.billingclient.api;

import a1.b2.c3;
import com.google.android.gms.internal.play_billing.j8;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class y implements e0.d {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ j8 f2475a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ b f2476b;

    y(b bVar, j8 j8Var) {
        this.f2475a = j8Var;
        Objects.requireNonNull(bVar);
        this.f2476b = bVar;
    }

    @Override // e0.d
    public final void a(final d dVar) {
        e0.d dVar2;
        String str = "Reconnection finished with result: " + dVar.c();
        String d4 = c3.d4(1221);
        com.google.android.gms.internal.play_billing.m0.l(d4, str);
        try {
            this.f2475a.b(dVar);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(d4, c3.d4(1028), th);
        }
        b bVar = this.f2476b;
        dVar2 = bVar.H;
        if (dVar2 != null) {
            bVar.E(new Runnable() { // from class: com.android.billingclient.api.x
                @Override // java.lang.Runnable
                public final void run() {
                    e0.d dVar3;
                    y yVar = y.this;
                    d dVar4 = dVar;
                    try {
                        dVar3 = yVar.f2476b.H;
                        dVar3.a(dVar4);
                    } catch (Throwable th2) {
                        com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(977), th2);
                    }
                }
            });
        }
    }

    @Override // e0.d
    public final void b() {
        e0.d dVar;
        String d4 = c3.d4(728);
        com.google.android.gms.internal.play_billing.m0.l(d4, "Reconnection attempt failed.");
        try {
            this.f2475a.b(p0.f2431j);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(d4, "Exception setting completer.", th);
        }
        b bVar = this.f2476b;
        dVar = bVar.H;
        if (dVar != null) {
            bVar.E(new Runnable() { // from class: com.android.billingclient.api.w
                @Override // java.lang.Runnable
                public final void run() {
                    e0.d dVar2;
                    try {
                        dVar2 = y.this.f2476b.H;
                        dVar2.b();
                    } catch (Throwable th2) {
                        com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Exception calling onBillingServiceDisconnected.", th2);
                    }
                }
            });
        }
    }
}
