package com.android.billingclient.api;

import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.u1;
import java.util.Objects;
import java.util.concurrent.TimeoutException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j0 implements u1 {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ androidx.core.util.a f2392a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ Runnable f2393b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ m0 f2394c;

    /* renamed from: d, reason: collision with root package name */
    final /* synthetic */ int f2395d;

    j0(m0 m0Var, int i4, androidx.core.util.a aVar, Runnable runnable) {
        this.f2395d = i4;
        this.f2392a = aVar;
        this.f2393b = runnable;
        Objects.requireNonNull(m0Var);
        this.f2394c = m0Var;
    }

    @Override // com.google.android.gms.internal.play_billing.u1
    public final /* bridge */ /* synthetic */ void a(Object obj) {
        boolean N0;
        d O0;
        Integer num = (Integer) obj;
        int intValue = num.intValue();
        m0 m0Var = this.f2394c;
        N0 = m0.N0(intValue);
        if (!N0) {
            this.f2393b.run();
        } else {
            O0 = m0Var.O0(this.f2395d, num.intValue());
            this.f2392a.accept(O0);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.u1
    public final void b(Throwable th) {
        if (th instanceof TimeoutException) {
            this.f2394c.Q0(n6.f2889c1, 28, p0.E);
            com.google.android.gms.internal.play_billing.m0.n("BillingClientTesting", "Asynchronous call to Billing Override Service timed out.", th);
        } else {
            this.f2394c.Q0(n6.BILLING_OVERRIDE_SERVICE_CALL_EXCEPTION, 28, p0.E);
            com.google.android.gms.internal.play_billing.m0.n("BillingClientTesting", "An error occurred while retrieving billing override.", th);
        }
        this.f2393b.run();
    }
}
