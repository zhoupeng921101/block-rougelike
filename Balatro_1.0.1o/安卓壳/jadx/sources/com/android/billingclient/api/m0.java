package com.android.billingclient.api;

import a1.b2.c3;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.content.pm.ServiceInfo;
import com.android.billingclient.api.a;
import com.google.android.gms.internal.play_billing.c2;
import com.google.android.gms.internal.play_billing.f6;
import com.google.android.gms.internal.play_billing.j8;
import com.google.android.gms.internal.play_billing.k6;
import com.google.android.gms.internal.play_billing.l8;
import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.o8;
import com.google.android.gms.internal.play_billing.u6;
import com.google.android.gms.internal.play_billing.w1;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class m0 extends b {
    private final Context L;
    private volatile int M;
    private volatile com.google.android.gms.internal.play_billing.j N;
    private volatile l0 O;
    private volatile ScheduledExecutorService P;

    m0(String str, Context context, o0 o0Var, ExecutorService executorService, a.C0032a c0032a) {
        super(null, context, null, null, c0032a);
        this.M = 0;
        this.L = context;
    }

    m0(String str, e eVar, Context context, e0.i iVar, e0.q qVar, o0 o0Var, ExecutorService executorService, a.C0032a c0032a) {
        super(null, eVar, context, iVar, null, null, null, c0032a);
        this.M = 0;
        this.L = context;
    }

    m0(String str, e eVar, Context context, e0.x xVar, o0 o0Var, ExecutorService executorService, a.C0032a c0032a) {
        super(null, eVar, context, null, null, null, c0032a);
        this.M = 0;
        this.L = context;
    }

    public static /* synthetic */ Object H0(m0 m0Var, int i4, j8 j8Var) {
        try {
            if (m0Var.N == null) {
                throw null;
            }
            m0Var.N.y(m0Var.L.getPackageName(), i4 != 2 ? i4 != 3 ? i4 != 4 ? i4 != 5 ? i4 != 6 ? "QUERY_PRODUCT_DETAILS_ASYNC" : "START_CONNECTION" : "IS_FEATURE_SUPPORTED" : "CONSUME_ASYNC" : "ACKNOWLEDGE_PURCHASE" : "LAUNCH_BILLING_FLOW", new k0(j8Var));
            return "billingOverrideService.getBillingOverride";
        } catch (Exception e4) {
            m0Var.Q0(n6.BILLING_OVERRIDE_SERVICE_CALL_EXCEPTION, 28, p0.E);
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(17), "An error occurred while retrieving billing override.", e4);
            j8Var.b(0);
            return "billingOverrideService.getBillingOverride";
        }
    }

    private final int K0(c2 c2Var) {
        try {
            return ((Integer) c2Var.get(28500L, TimeUnit.MILLISECONDS)).intValue();
        } catch (TimeoutException e4) {
            Q0(n6.f2889c1, 28, p0.E);
            com.google.android.gms.internal.play_billing.m0.n("BillingClientTesting", "Asynchronous call to Billing Override Service timed out.", e4);
            return 0;
        } catch (Exception e5) {
            if (e5 instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            Q0(n6.BILLING_OVERRIDE_SERVICE_CALL_EXCEPTION, 28, p0.E);
            com.google.android.gms.internal.play_billing.m0.n("BillingClientTesting", "An error occurred while retrieving billing override.", e5);
            return 0;
        }
    }

    private final synchronized ScheduledExecutorService L0() {
        try {
            if (this.P == null) {
                this.P = Executors.newSingleThreadScheduledExecutor();
            }
        } catch (Throwable th) {
            throw th;
        }
        return this.P;
    }

    private final synchronized void M0() {
        if (F0()) {
            com.google.android.gms.internal.play_billing.m0.l("BillingClientTesting", "Billing Override Service connection is valid. No need to re-initialize.");
            R0(26);
            return;
        }
        if (this.M == 1) {
            com.google.android.gms.internal.play_billing.m0.m("BillingClientTesting", "Client is already in the process of connecting to Billing Override Service.");
            return;
        }
        if (this.M == 3) {
            com.google.android.gms.internal.play_billing.m0.m("BillingClientTesting", "Billing Override Service Client was already closed and can't be reused. Please create another instance.");
            Q0(n6.BILLING_CLIENT_CLOSED, 26, p0.a(-1, "Billing Override Service connection is disconnected."));
            return;
        }
        this.M = 1;
        com.google.android.gms.internal.play_billing.m0.l("BillingClientTesting", "Starting Billing Override Service setup.");
        this.O = new l0(this, null);
        Intent intent = new Intent("com.google.android.apps.play.billingtestcompanion.BillingOverrideService.BIND");
        intent.setPackage("com.google.android.apps.play.billingtestcompanion");
        Context context = this.L;
        List<ResolveInfo> queryIntentServices = context.getPackageManager().queryIntentServices(intent, 0);
        n6 n6Var = n6.REASON_UNSPECIFIED;
        if (queryIntentServices == null || queryIntentServices.isEmpty()) {
            n6Var = n6.INTENT_SERVICE_NOT_FOUND;
        } else {
            ServiceInfo serviceInfo = queryIntentServices.get(0).serviceInfo;
            if (serviceInfo != null) {
                String str = serviceInfo.packageName;
                String str2 = serviceInfo.name;
                if (!Objects.equals(str, "com.google.android.apps.play.billingtestcompanion") || str2 == null) {
                    n6Var = n6.BILLING_SERVICE_BLOCKED;
                    com.google.android.gms.internal.play_billing.m0.m("BillingClientTesting", "The device doesn't have valid Play Billing Lab.");
                } else {
                    ComponentName componentName = new ComponentName(str, str2);
                    Intent intent2 = new Intent(intent);
                    intent2.setComponent(componentName);
                    if (context.bindService(intent2, this.O, 1)) {
                        com.google.android.gms.internal.play_billing.m0.l("BillingClientTesting", "Billing Override Service was bonded successfully.");
                        return;
                    } else {
                        n6Var = n6.BILLING_SERVICE_BLOCKED;
                        com.google.android.gms.internal.play_billing.m0.m("BillingClientTesting", "Connection to Billing Override Service is blocked.");
                    }
                }
            }
        }
        this.M = 0;
        com.google.android.gms.internal.play_billing.m0.l("BillingClientTesting", "Billing Override Service unavailable on device.");
        Q0(n6Var, 26, p0.a(2, "Billing Override Service unavailable on device."));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final boolean N0(int i4) {
        return i4 > 0;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final d O0(int i4, int i5) {
        d a4 = p0.a(i5, "Billing override value was set by a license tester.");
        Q0(n6.LICENSE_TESTER_BILLING_OVERRIDE, i4, a4);
        return a4;
    }

    private final c2 P0(final int i4) {
        if (F0()) {
            return o8.a(new l8() { // from class: com.android.billingclient.api.f0
                @Override // com.google.android.gms.internal.play_billing.l8
                public final Object a(j8 j8Var) {
                    return m0.H0(m0.this, i4, j8Var);
                }
            });
        }
        com.google.android.gms.internal.play_billing.m0.m("BillingClientTesting", "Billing Override Service is not ready.");
        Q0(n6.BILLING_OVERRIDE_SERVICE_CONNECTION_NOT_READY, 28, p0.a(-1, "Billing Override Service connection is disconnected."));
        return w1.a(0);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void Q0(n6 n6Var, int i4, d dVar) {
        int i5 = n0.f2415a;
        f6 b4 = n0.b(n6Var, i4, dVar, null, u6.BROADCAST_ACTION_UNSPECIFIED);
        Objects.requireNonNull(b4, c3.d4(880));
        r0().f(b4);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void R0(int i4) {
        int i5 = n0.f2415a;
        k6 c4 = n0.c(i4, u6.BROADCAST_ACTION_UNSPECIFIED);
        Objects.requireNonNull(c4, c3.d4(1449));
        r0().h(c4);
    }

    private final void S0(int i4, androidx.core.util.a aVar, Runnable runnable) {
        w1.c(w1.b(P0(i4), 28500L, TimeUnit.MILLISECONDS, L0()), new j0(this, i4, aVar, runnable), i());
    }

    public final synchronized boolean F0() {
        if (this.M == 2 && this.N != null) {
            if (this.O != null) {
                return true;
            }
        }
        return false;
    }

    @Override // com.android.billingclient.api.b, com.android.billingclient.api.a
    public final void a(final e0.a aVar, final e0.b bVar) {
        Objects.requireNonNull(bVar);
        S0(3, new androidx.core.util.a() { // from class: e0.s
            @Override // androidx.core.util.a
            public final void accept(Object obj) {
                b.this.a((com.android.billingclient.api.d) obj);
            }
        }, new Runnable() { // from class: com.android.billingclient.api.g0
            @Override // java.lang.Runnable
            public final void run() {
                super/*com.android.billingclient.api.b*/.a(aVar, bVar);
            }
        });
    }

    @Override // com.android.billingclient.api.b, com.android.billingclient.api.a
    public final d c(final Activity activity, final c cVar) {
        androidx.core.util.a aVar = new androidx.core.util.a() { // from class: com.android.billingclient.api.h0
            @Override // androidx.core.util.a
            public final void accept(Object obj) {
                super/*com.android.billingclient.api.b*/.u0((d) obj);
            }
        };
        Callable callable = new Callable() { // from class: com.android.billingclient.api.i0
            @Override // java.util.concurrent.Callable
            public final Object call() {
                d c4;
                c4 = super/*com.android.billingclient.api.b*/.c(activity, cVar);
                return c4;
            }
        };
        int K0 = K0(P0(2));
        if (N0(K0)) {
            d O0 = O0(2, K0);
            aVar.accept(O0);
            return O0;
        }
        try {
            return (d) callable.call();
        } catch (Exception e4) {
            n6 n6Var = n6.BILLING_OVERRIDE_SERVICE_FALLBACK_ERROR;
            d dVar = p0.f2429h;
            Q0(n6Var, 2, dVar);
            com.google.android.gms.internal.play_billing.m0.n("BillingClientTesting", "An internal error occurred.", e4);
            return dVar;
        }
    }

    @Override // com.android.billingclient.api.b, com.android.billingclient.api.a
    public final void e(final g gVar, final e0.g gVar2) {
        S0(7, new androidx.core.util.a() { // from class: com.android.billingclient.api.d0
            @Override // androidx.core.util.a
            public final void accept(Object obj) {
                h hVar = new h(new ArrayList(), new ArrayList());
                e0.g.this.a((d) obj, hVar);
            }
        }, new Runnable() { // from class: com.android.billingclient.api.e0
            @Override // java.lang.Runnable
            public final void run() {
                super/*com.android.billingclient.api.b*/.e(gVar, gVar2);
            }
        });
    }

    @Override // com.android.billingclient.api.b, com.android.billingclient.api.a
    public final void g(e0.d dVar) {
        M0();
        super.g(dVar);
    }
}
