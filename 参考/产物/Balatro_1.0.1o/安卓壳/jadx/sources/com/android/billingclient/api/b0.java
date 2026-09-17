package com.android.billingclient.api;

import a1.b2.c3;
import android.content.ComponentName;
import android.content.Context;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.DeadObjectException;
import android.os.Handler;
import android.os.IBinder;
import android.os.RemoteException;
import android.text.TextUtils;
import com.google.android.gms.internal.play_billing.b8;
import com.google.android.gms.internal.play_billing.c8;
import com.google.android.gms.internal.play_billing.d6;
import com.google.android.gms.internal.play_billing.e8;
import com.google.android.gms.internal.play_billing.f6;
import com.google.android.gms.internal.play_billing.h6;
import com.google.android.gms.internal.play_billing.k6;
import com.google.android.gms.internal.play_billing.l6;
import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.p6;
import com.google.android.gms.internal.play_billing.s6;
import com.google.android.gms.internal.play_billing.v7;
import com.google.android.gms.internal.play_billing.x7;
import java.util.Objects;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b0 implements ServiceConnection {

    /* renamed from: a, reason: collision with root package name */
    private final e0.d f2266a;

    /* renamed from: b, reason: collision with root package name */
    private final com.google.android.gms.internal.play_billing.x f2267b;

    /* renamed from: c, reason: collision with root package name */
    private final com.google.android.gms.internal.play_billing.x f2268c;

    /* renamed from: d, reason: collision with root package name */
    private final int f2269d;

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ b f2270e;

    /* synthetic */ b0(b bVar, e0.d dVar, int i4, e0.r rVar) {
        com.google.android.gms.internal.play_billing.a0 a0Var;
        com.google.android.gms.internal.play_billing.a0 a0Var2;
        Objects.requireNonNull(bVar);
        this.f2270e = bVar;
        a0Var = bVar.K;
        this.f2267b = com.google.android.gms.internal.play_billing.x.c(a0Var);
        a0Var2 = bVar.K;
        this.f2268c = com.google.android.gms.internal.play_billing.x.c(a0Var2);
        this.f2266a = dVar;
        this.f2269d = i4;
    }

    public static /* synthetic */ Object a(b0 b0Var) {
        Object obj;
        int i4;
        int i5;
        Bundle bundle;
        Object obj2;
        com.google.android.gms.internal.play_billing.d dVar;
        Context context;
        int i6;
        int i7;
        o0 o0Var;
        int i8;
        String str;
        String str2;
        Long l3;
        b bVar = b0Var.f2270e;
        obj = bVar.f2240a;
        synchronized (obj) {
            try {
                i4 = bVar.f2241b;
                if (i4 != 3) {
                    i5 = bVar.f2241b;
                    boolean z3 = true;
                    if (i5 != 1) {
                        z3 = false;
                    }
                    if (TextUtils.isEmpty(null)) {
                        bundle = null;
                    } else {
                        bundle = new Bundle();
                        bundle.putString("accountName", null);
                        str = bVar.f2242c;
                        str2 = bVar.f2243d;
                        l3 = bVar.J;
                        com.google.android.gms.internal.play_billing.m0.c(bundle, str, str2, l3.longValue());
                    }
                    n6 n6Var = n6.REASON_UNSPECIFIED;
                    obj2 = bVar.f2240a;
                    synchronized (obj2) {
                        dVar = bVar.f2248i;
                    }
                    if (dVar == null) {
                        b bVar2 = b0Var.f2270e;
                        bVar2.V(0);
                        int i9 = b0Var.f2269d;
                        n6 n6Var2 = n6.SERVICE_RESET_TO_NULL;
                        d dVar2 = p0.f2431j;
                        bVar2.U(n6Var2, dVar2, i9);
                        b0Var.g(dVar2);
                    } else {
                        b bVar3 = b0Var.f2270e;
                        context = bVar3.f2246g;
                        String packageName = context.getPackageName();
                        int i10 = 27;
                        int i11 = 3;
                        int i12 = 27;
                        while (true) {
                            if (i12 < 3) {
                                i12 = 0;
                                break;
                            }
                            try {
                                com.google.android.gms.internal.play_billing.m0.l("BillingClient", "trying subs apiVersion: " + i12);
                                i11 = bundle == null ? dVar.e0(i12, packageName, "subs") : dVar.T(i12, packageName, "subs", bundle);
                                if (i11 == 0) {
                                    com.google.android.gms.internal.play_billing.m0.l("BillingClient", "highestLevelSupportedForSubs: " + i12);
                                    break;
                                }
                                i12--;
                            } catch (Exception e4) {
                                com.google.android.gms.internal.play_billing.m0.n(c3.d4(1160), "Exception while checking if billing is supported; try to reconnect", e4);
                                n6 n6Var3 = e4 instanceof DeadObjectException ? n6.R0 : e4 instanceof RemoteException ? n6.IS_BILLING_SUPPORTED_REMOTE_EXCEPTION : e4 instanceof SecurityException ? n6.S0 : n6.U;
                                String a4 = n6Var3.equals(n6.U) ? n0.a(e4) : null;
                                b0Var.f2270e.V(0);
                                b0Var.f(b.t0(e4), n6Var3, a4, z3, 0);
                                b0Var.g(b.t0(e4));
                            }
                        }
                        bVar3.f2251l = i12 >= 5;
                        bVar3.f2250k = i12 >= 3;
                        if (i12 < 3) {
                            n6Var = n6.SUBSCRIPTIONS_NOT_SUPPORTED;
                            com.google.android.gms.internal.play_billing.m0.l("BillingClient", "In-app billing API does not support subscription on this device.");
                        }
                        while (true) {
                            if (i10 < 3) {
                                break;
                            }
                            com.google.android.gms.internal.play_billing.m0.l("BillingClient", "trying inapp apiVersion: " + i10);
                            i11 = bundle == null ? dVar.e0(i10, packageName, "inapp") : dVar.T(i10, packageName, "inapp", bundle);
                            if (i11 == 0) {
                                bVar3.f2252m = i10;
                                i8 = bVar3.f2252m;
                                com.google.android.gms.internal.play_billing.m0.l("BillingClient", "mHighestLevelSupportedForInApp: " + i8);
                                break;
                            }
                            i10--;
                        }
                        i6 = bVar3.f2252m;
                        b.A(bVar3, i6);
                        i7 = bVar3.f2252m;
                        if (i7 < 3) {
                            n6Var = n6.ONE_TIME_PRODUCT_NOT_SUPPORTED;
                            com.google.android.gms.internal.play_billing.m0.m("BillingClient", "In-app billing API version 3 is not supported on this device.");
                        }
                        n6 n6Var4 = n6Var;
                        b.C(bVar3, i11);
                        if (i11 != 0) {
                            d dVar3 = p0.f2423b;
                            b0Var.f(dVar3, n6Var4, null, z3, 0);
                            b0Var.g(dVar3);
                        } else {
                            try {
                                Long e5 = b0Var.e(z3);
                                if (z3) {
                                    h6 D = k6.D();
                                    D.p(6);
                                    c8 C = e8.C();
                                    int i13 = b0Var.f2269d;
                                    C.m(i13 > 0);
                                    C.n(i13);
                                    C.p(0);
                                    if (e5 != null) {
                                        C.o(e5.longValue());
                                    }
                                    b bVar4 = b0Var.f2270e;
                                    D.o(C);
                                    bVar4.T((k6) D.i());
                                } else {
                                    v7 C2 = x7.C();
                                    l6 D2 = p6.D();
                                    D2.r(0);
                                    D2.o(0);
                                    C2.m(D2);
                                    if (e5 != null) {
                                        C2.n(e5.longValue());
                                    }
                                    o0Var = b0Var.f2270e.f2247h;
                                    o0Var.k((x7) C2.i());
                                }
                            } catch (Throwable th) {
                                com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th);
                            }
                            b0Var.g(p0.f2430i);
                        }
                    }
                }
            } finally {
            }
        }
        return null;
    }

    public static /* synthetic */ void b(b0 b0Var) {
        b bVar = b0Var.f2270e;
        bVar.V(0);
        n6 n6Var = n6.EXECUTE_ASYNC_TIMEOUT;
        d dVar = p0.f2432k;
        bVar.U(n6Var, dVar, b0Var.f2269d);
        b0Var.g(dVar);
    }

    private final Long e(boolean z3) {
        Object obj;
        Object obj2;
        try {
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Exception getting connection establishment duration.", th);
        }
        if (z3) {
            obj2 = this.f2270e.f2240a;
            synchronized (obj2) {
                try {
                    com.google.android.gms.internal.play_billing.x xVar = this.f2267b;
                    if (!xVar.g()) {
                        return null;
                    }
                    xVar.f();
                    return Long.valueOf(xVar.a(TimeUnit.MILLISECONDS));
                } finally {
                }
            }
        }
        obj = this.f2270e.f2240a;
        synchronized (obj) {
            try {
                com.google.android.gms.internal.play_billing.x xVar2 = this.f2268c;
                if (!xVar2.g()) {
                    return null;
                }
                xVar2.f();
                return Long.valueOf(xVar2.a(TimeUnit.MILLISECONDS));
            } finally {
            }
        }
        com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Exception getting connection establishment duration.", th);
        return null;
    }

    private final void f(d dVar, n6 n6Var, String str, boolean z3, int i4) {
        o0 o0Var;
        try {
            l6 D = p6.D();
            D.r(dVar.c());
            D.n(dVar.a());
            D.q(n6Var);
            D.o(0);
            if (str != null) {
                D.m(str);
            }
            Long e4 = e(z3);
            if (!z3) {
                v7 C = x7.C();
                C.m(D);
                if (e4 != null) {
                    C.n(e4.longValue());
                }
                o0Var = this.f2270e.f2247h;
                o0Var.k((x7) C.i());
                return;
            }
            c8 C2 = e8.C();
            int i5 = this.f2269d;
            C2.m(i5 > 0);
            C2.n(i5);
            C2.p(0);
            if (e4 != null) {
                C2.o(e4.longValue());
            }
            b bVar = this.f2270e;
            d6 F = f6.F();
            F.n(D);
            F.q(6);
            F.p(C2);
            bVar.R((f6) F.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th);
        }
    }

    private final void g(d dVar) {
        Object obj;
        int i4;
        b bVar = this.f2270e;
        obj = bVar.f2240a;
        synchronized (obj) {
            try {
                i4 = bVar.f2241b;
                if (i4 == 3) {
                    return;
                }
                try {
                    this.f2266a.a(dVar);
                } catch (Throwable th) {
                    com.google.android.gms.internal.play_billing.m0.n(c3.d4(426), "Exception while calling onBillingSetupFinished.", th);
                }
            } catch (Throwable th2) {
                throw th2;
            }
        }
    }

    public final void c() {
        Object obj;
        obj = this.f2270e.f2240a;
        synchronized (obj) {
            com.google.android.gms.internal.play_billing.x xVar = this.f2267b;
            xVar.d();
            xVar.e();
        }
    }

    final boolean d() {
        return this.f2269d > 0;
    }

    @Override // android.content.ServiceConnection
    public final void onBindingDied(ComponentName componentName) {
        Object obj;
        int i4;
        int i5;
        o0 o0Var;
        o0 o0Var2;
        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Billing service died.");
        try {
            b bVar = this.f2270e;
            if (b.G(bVar)) {
                o0Var2 = bVar.f2247h;
                d6 F = f6.F();
                F.q(6);
                l6 D = p6.D();
                D.q(n6.BINDING_DIED);
                F.n(D);
                c8 C = e8.C();
                int i6 = this.f2269d;
                C.m(i6 > 0);
                C.n(i6);
                F.p(C);
                o0Var2.f((f6) F.i());
            } else {
                o0Var = bVar.f2247h;
                o0Var.b(s6.D());
            }
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th);
        }
        b bVar2 = this.f2270e;
        obj = bVar2.f2240a;
        synchronized (obj) {
            i4 = bVar2.f2241b;
            if (i4 != 3) {
                i5 = bVar2.f2241b;
                if (i5 != 0) {
                    bVar2.V(0);
                    bVar2.X();
                    try {
                        this.f2266a.b();
                    } catch (Throwable th2) {
                        com.google.android.gms.internal.play_billing.m0.n(c3.d4(776), "Exception while calling onBillingServiceDisconnected.", th2);
                    }
                }
            }
        }
    }

    @Override // android.content.ServiceConnection
    public final void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        Object obj;
        int i4;
        Handler L;
        d O;
        com.google.android.gms.internal.play_billing.m0.l(c3.d4(1409), "Billing service connected.");
        b bVar = this.f2270e;
        obj = bVar.f2240a;
        synchronized (obj) {
            try {
                i4 = bVar.f2241b;
                if (i4 == 3) {
                    return;
                }
                bVar.f2248i = com.google.android.gms.internal.play_billing.c.m0(iBinder);
                Callable callable = new Callable() { // from class: com.android.billingclient.api.z
                    @Override // java.util.concurrent.Callable
                    public final Object call() {
                        b0.a(b0.this);
                        return null;
                    }
                };
                Runnable runnable = new Runnable() { // from class: com.android.billingclient.api.a0
                    @Override // java.lang.Runnable
                    public final void run() {
                        b0.b(b0.this);
                    }
                };
                L = bVar.L();
                if (b.j(callable, 30000L, runnable, L, bVar.i()) == null) {
                    int i5 = this.f2269d;
                    O = bVar.O();
                    bVar.U(n6.MISSING_RESULT_FROM_EXECUTE_ASYNC, O, i5);
                    g(O);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // android.content.ServiceConnection
    public final void onServiceDisconnected(ComponentName componentName) {
        Object obj;
        int i4;
        o0 o0Var;
        o0 o0Var2;
        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Billing service disconnected.");
        try {
            b bVar = this.f2270e;
            if (b.G(bVar)) {
                o0Var2 = bVar.f2247h;
                d6 F = f6.F();
                F.q(6);
                l6 D = p6.D();
                D.q(n6.SERVICE_DISCONNECTED);
                F.n(D);
                c8 C = e8.C();
                int i5 = this.f2269d;
                C.m(i5 > 0);
                C.n(i5);
                F.p(C);
                o0Var2.f((f6) F.i());
            } else {
                o0Var = bVar.f2247h;
                o0Var.i(b8.D());
            }
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th);
        }
        b bVar2 = this.f2270e;
        obj = bVar2.f2240a;
        synchronized (obj) {
            try {
                com.google.android.gms.internal.play_billing.x xVar = this.f2268c;
                xVar.d();
                xVar.e();
                i4 = bVar2.f2241b;
                if (i4 == 3) {
                    return;
                }
                bVar2.V(0);
                try {
                    this.f2266a.b();
                } catch (Throwable th2) {
                    com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Exception while calling onBillingServiceDisconnected.", th2);
                }
            } finally {
            }
        }
    }
}
