package com.android.billingclient.api;

import a1.b2.c3;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Bundle;
import android.os.DeadObjectException;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import com.android.billingclient.api.a;
import com.android.billingclient.api.c;
import com.android.billingclient.api.g;
import com.google.android.gms.internal.play_billing.b7;
import com.google.android.gms.internal.play_billing.c2;
import com.google.android.gms.internal.play_billing.c8;
import com.google.android.gms.internal.play_billing.d6;
import com.google.android.gms.internal.play_billing.e8;
import com.google.android.gms.internal.play_billing.f6;
import com.google.android.gms.internal.play_billing.h6;
import com.google.android.gms.internal.play_billing.j8;
import com.google.android.gms.internal.play_billing.k6;
import com.google.android.gms.internal.play_billing.l8;
import com.google.android.gms.internal.play_billing.m0;
import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.o8;
import com.google.android.gms.internal.play_billing.u6;
import com.google.android.gms.internal.play_billing.w1;
import com.google.android.gms.internal.play_billing.z6;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class b extends a {
    private boolean A;
    private boolean B;
    private boolean C;
    private boolean D;
    private e E;
    private boolean F;
    private boolean G;
    private volatile e0.d H;
    private ExecutorService I;
    private final Long J;
    private com.google.android.gms.internal.play_billing.a0 K;

    /* renamed from: a, reason: collision with root package name */
    private final Object f2240a;

    /* renamed from: b, reason: collision with root package name */
    private volatile int f2241b;

    /* renamed from: c, reason: collision with root package name */
    private final String f2242c;

    /* renamed from: d, reason: collision with root package name */
    private final String f2243d;

    /* renamed from: e, reason: collision with root package name */
    private final Handler f2244e;

    /* renamed from: f, reason: collision with root package name */
    private volatile k f2245f;

    /* renamed from: g, reason: collision with root package name */
    private Context f2246g;

    /* renamed from: h, reason: collision with root package name */
    private o0 f2247h;

    /* renamed from: i, reason: collision with root package name */
    private volatile com.google.android.gms.internal.play_billing.d f2248i;

    /* renamed from: j, reason: collision with root package name */
    private volatile b0 f2249j;

    /* renamed from: k, reason: collision with root package name */
    private boolean f2250k;

    /* renamed from: l, reason: collision with root package name */
    private boolean f2251l;

    /* renamed from: m, reason: collision with root package name */
    private int f2252m;

    /* renamed from: n, reason: collision with root package name */
    private boolean f2253n;

    /* renamed from: o, reason: collision with root package name */
    private boolean f2254o;

    /* renamed from: p, reason: collision with root package name */
    private boolean f2255p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f2256q;

    /* renamed from: r, reason: collision with root package name */
    private boolean f2257r;

    /* renamed from: s, reason: collision with root package name */
    private boolean f2258s;

    /* renamed from: t, reason: collision with root package name */
    private boolean f2259t;

    /* renamed from: u, reason: collision with root package name */
    private boolean f2260u;

    /* renamed from: v, reason: collision with root package name */
    private boolean f2261v;

    /* renamed from: w, reason: collision with root package name */
    private boolean f2262w;

    /* renamed from: x, reason: collision with root package name */
    private boolean f2263x;

    /* renamed from: y, reason: collision with root package name */
    private boolean f2264y;

    /* renamed from: z, reason: collision with root package name */
    private boolean f2265z;

    b(String str, Context context, o0 o0Var, ExecutorService executorService, a.C0032a c0032a) {
        this.f2240a = new Object();
        this.f2241b = 0;
        this.f2244e = new Handler(Looper.getMainLooper());
        this.f2252m = 0;
        Long valueOf = Long.valueOf(new Random().nextLong());
        this.J = valueOf;
        this.K = com.google.android.gms.internal.play_billing.p.a();
        this.f2242c = "8.3.0";
        String r3 = r();
        this.f2243d = r3;
        this.f2246g = context.getApplicationContext();
        z6 M = b7.M();
        M.z("8.3.0");
        if (r3 != null) {
            M.A(r3);
        }
        M.s(this.f2246g.getPackageName());
        M.p(valueOf.longValue());
        M.y(c0032a.f2238i);
        M.m(Build.VERSION.SDK_INT);
        M.r(846465066L);
        c0(M, context);
        try {
            M.n(this.f2246g.getPackageManager().getPackageInfo(this.f2246g.getPackageName(), 0).versionCode);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(194), th);
        }
        this.f2247h = new q0(this.f2246g, (b7) M.i());
        this.f2246g.getPackageName();
        this.F = c0032a.f2238i;
    }

    b(String str, e eVar, Context context, e0.i iVar, e0.q qVar, o0 o0Var, ExecutorService executorService, a.C0032a c0032a) {
        this.f2240a = new Object();
        this.f2241b = 0;
        this.f2244e = new Handler(Looper.getMainLooper());
        this.f2252m = 0;
        this.J = Long.valueOf(new Random().nextLong());
        this.K = com.google.android.gms.internal.play_billing.p.a();
        String d4 = c3.d4(1319);
        this.f2242c = d4;
        this.f2243d = r();
        h(context, iVar, eVar, null, d4, null, c0032a);
    }

    b(String str, e eVar, Context context, e0.x xVar, o0 o0Var, ExecutorService executorService, a.C0032a c0032a) {
        this.f2240a = new Object();
        this.f2241b = 0;
        this.f2244e = new Handler(Looper.getMainLooper());
        this.f2252m = 0;
        Long valueOf = Long.valueOf(new Random().nextLong());
        this.J = valueOf;
        this.K = com.google.android.gms.internal.play_billing.p.a();
        String d4 = c3.d4(373);
        this.f2242c = d4;
        String r3 = r();
        this.f2243d = r3;
        this.f2246g = context.getApplicationContext();
        z6 M = b7.M();
        M.z(d4);
        if (r3 != null) {
            M.A(r3);
        }
        M.s(this.f2246g.getPackageName());
        M.p(valueOf.longValue());
        M.y(c0032a.f2238i);
        M.m(Build.VERSION.SDK_INT);
        M.r(846465066L);
        c0(M, context);
        try {
            M.n(this.f2246g.getPackageManager().getPackageInfo(this.f2246g.getPackageName(), 0).versionCode);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(12), th);
        }
        this.f2247h = new q0(this.f2246g, (b7) M.i());
        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Billing client should have a valid listener but the provided is null.");
        this.f2245f = new k(this.f2246g, null, null, null, null, null, this.f2247h);
        this.E = eVar;
        this.f2246g.getPackageName();
        this.F = c0032a.f2238i;
    }

    static /* bridge */ /* synthetic */ void A(b bVar, int i4) {
        bVar.f2252m = i4;
        bVar.D = i4 >= 27;
        bVar.C = i4 >= 26;
        bVar.B = i4 >= 24;
        bVar.A = i4 >= 23;
        bVar.f2265z = i4 >= 22;
        bVar.f2264y = i4 >= 21;
        bVar.f2263x = i4 >= 20;
        bVar.f2262w = i4 >= 19;
        bVar.f2261v = i4 >= 18;
        bVar.f2260u = i4 >= 17;
        bVar.f2259t = i4 >= 16;
        bVar.f2258s = i4 >= 15;
        bVar.f2257r = i4 >= 14;
        bVar.f2256q = i4 >= 12;
        bVar.f2255p = i4 >= 9;
        bVar.f2254o = i4 >= 8;
        bVar.f2253n = i4 >= 6;
    }

    public static /* synthetic */ Object A0(b bVar, e0.b bVar2, e0.a aVar) {
        bVar.p(bVar2, aVar);
        return null;
    }

    static /* bridge */ /* synthetic */ void C(b bVar, int i4) {
        if (i4 != 0) {
            bVar.V(0);
            return;
        }
        synchronized (bVar.f2240a) {
            try {
                if (bVar.f2241b == 3) {
                    return;
                }
                bVar.V(2);
                k kVar = bVar.f2245f != null ? bVar.f2245f : null;
                if (kVar != null) {
                    kVar.g(bVar.f2264y);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    static /* bridge */ /* synthetic */ boolean G(b bVar) {
        boolean z3;
        synchronized (bVar.f2240a) {
            z3 = true;
            if (bVar.f2241b != 1) {
                z3 = false;
            }
        }
        return z3;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final /* synthetic */ Bundle J(int i4, String str, String str2, c cVar, Bundle bundle) {
        com.google.android.gms.internal.play_billing.d dVar;
        try {
            synchronized (this.f2240a) {
                dVar = this.f2248i;
            }
            return dVar == null ? com.google.android.gms.internal.play_billing.m0.d(p0.f2431j, n6.SERVICE_RESET_TO_NULL) : dVar.x(i4, this.f2246g.getPackageName(), str, str2, null, bundle);
        } catch (DeadObjectException e4) {
            return com.google.android.gms.internal.play_billing.m0.e(p0.f2431j, n6.LAUNCH_BILLING_FLOW_EXCEPTION, n0.a(e4));
        } catch (Exception e5) {
            return com.google.android.gms.internal.play_billing.m0.e(p0.f2429h, n6.LAUNCH_BILLING_FLOW_EXCEPTION, n0.a(e5));
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final /* synthetic */ Bundle K(String str, String str2) {
        com.google.android.gms.internal.play_billing.d dVar;
        try {
            synchronized (this.f2240a) {
                dVar = this.f2248i;
            }
            return dVar == null ? com.google.android.gms.internal.play_billing.m0.d(p0.f2431j, n6.SERVICE_RESET_TO_NULL) : dVar.Y(3, this.f2246g.getPackageName(), str, str2, null);
        } catch (DeadObjectException e4) {
            return com.google.android.gms.internal.play_billing.m0.e(p0.f2431j, n6.LAUNCH_BILLING_FLOW_EXCEPTION, n0.a(e4));
        } catch (Exception e5) {
            return com.google.android.gms.internal.play_billing.m0.e(p0.f2429h, n6.LAUNCH_BILLING_FLOW_EXCEPTION, n0.a(e5));
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final Handler L() {
        return Looper.myLooper() == null ? this.f2244e : new Handler(Looper.myLooper());
    }

    private final c0 M(d dVar, n6 n6Var, String str, Exception exc) {
        com.google.android.gms.internal.play_billing.m0.n(c3.d4(62), str, exc);
        h0(n6Var, 7, dVar, n0.a(exc));
        return new c0(dVar.c(), dVar.a(), new ArrayList(), new ArrayList());
    }

    private final d N(int i4) {
        com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Service connection is valid. No need to re-initialize.");
        h6 D = k6.D();
        D.p(6);
        c8 C = e8.C();
        C.q(true);
        C.m(i4 > 0);
        C.n(i4);
        D.o(C);
        T((k6) D.i());
        return p0.f2430i;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final d O() {
        int[] iArr = {0, 3};
        synchronized (this.f2240a) {
            for (int i4 = 0; i4 < 2; i4++) {
                if (this.f2241b == iArr[i4]) {
                    return p0.f2431j;
                }
            }
            return p0.f2429h;
        }
    }

    private final c2 P(final int i4) {
        if (this.F && !a0()) {
            return o8.a(new l8() { // from class: com.android.billingclient.api.l
                @Override // com.google.android.gms.internal.play_billing.l8
                public final Object a(j8 j8Var) {
                    return b.y0(b.this, i4, j8Var);
                }
            });
        }
        com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Already connected or not opted into auto reconnection.");
        return w1.a(p0.f2430i);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void R(f6 f6Var) {
        try {
            this.f2247h.e(f6Var, this.f2252m);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(725), c3.d4(195), th);
        }
    }

    private final void S(f6 f6Var, long j4, boolean z3) {
        try {
            this.f2247h.c(f6Var, this.f2252m, j4, z3);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(519), c3.d4(974), th);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void T(k6 k6Var) {
        try {
            this.f2247h.g(k6Var, this.f2252m);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(196), th);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void U(n6 n6Var, d dVar, int i4) {
        try {
            int i5 = n0.f2415a;
            d6 d6Var = (d6) n0.b(n6Var, 6, dVar, null, u6.BROADCAST_ACTION_UNSPECIFIED).t();
            c8 C = e8.C();
            C.m(i4 > 0);
            C.n(i4);
            d6Var.p(C);
            R((f6) d6Var.i());
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(c3.d4(1410), "Unable to log.", th);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void V(int i4) {
        synchronized (this.f2240a) {
            try {
                if (this.f2241b == 3) {
                    return;
                }
                com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Setting clientState from " + b0(this.f2241b) + " to " + b0(i4));
                this.f2241b = i4;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    private final void W(e0.d dVar, int i4) {
        n6 n6Var;
        d dVar2;
        d dVar3;
        synchronized (this.f2240a) {
            try {
                if (a0()) {
                    dVar2 = N(i4);
                } else {
                    if (this.f2241b == 1) {
                        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Client is already in the process of connecting to billing service.");
                        n6 n6Var2 = n6.BILLING_CLIENT_CONNECTING;
                        dVar3 = p0.f2425d;
                        U(n6Var2, dVar3, i4);
                    } else if (this.f2241b == 3) {
                        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Client was already closed and can't be reused. Please create another instance.");
                        n6 n6Var3 = n6.BILLING_CLIENT_CLOSED;
                        dVar3 = p0.f2431j;
                        U(n6Var3, dVar3, i4);
                    } else {
                        V(1);
                        if (i4 == 0) {
                            this.H = dVar;
                            i4 = 0;
                        }
                        X();
                        com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Starting in-app billing setup.");
                        this.f2249j = new b0(this, dVar, i4, null);
                        this.f2249j.c();
                        Intent intent = new Intent("com.android.vending.billing.InAppBillingService.BIND");
                        intent.setPackage("com.android.vending");
                        List<ResolveInfo> queryIntentServices = this.f2246g.getPackageManager().queryIntentServices(intent, 0);
                        if (queryIntentServices == null || queryIntentServices.isEmpty()) {
                            n6Var = n6.INTENT_SERVICE_NOT_FOUND;
                        } else {
                            ServiceInfo serviceInfo = queryIntentServices.get(0).serviceInfo;
                            if (serviceInfo != null) {
                                String str = serviceInfo.packageName;
                                String str2 = serviceInfo.name;
                                if (!Objects.equals(str, "com.android.vending") || str2 == null) {
                                    n6Var = n6.S;
                                    com.google.android.gms.internal.play_billing.m0.m("BillingClient", "The device doesn't have valid Play Store.");
                                } else {
                                    ComponentName componentName = new ComponentName(str, str2);
                                    Intent intent2 = new Intent(intent);
                                    intent2.setComponent(componentName);
                                    intent2.putExtra("playBillingLibraryVersion", this.f2242c);
                                    synchronized (this.f2240a) {
                                        try {
                                            if (this.f2241b == 2) {
                                                dVar2 = N(i4);
                                            } else if (this.f2241b != 1) {
                                                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Client state no longer CONNECTING, returning service disconnected.");
                                                n6 n6Var4 = n6.BILLING_CLIENT_TRANSITIONED_OUT_OF_CONNECTING;
                                                dVar3 = p0.f2431j;
                                                U(n6Var4, dVar3, i4);
                                            } else {
                                                b0 b0Var = this.f2249j;
                                                if ((i4 <= 0 || Build.VERSION.SDK_INT < 29) ? this.f2246g.bindService(intent2, b0Var, 1) : this.f2246g.bindService(intent2, 1, i(), b0Var)) {
                                                    com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Service was bonded successfully.");
                                                    dVar2 = null;
                                                } else {
                                                    n6Var = n6.BILLING_SERVICE_BLOCKED;
                                                    com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Connection to Billing service is blocked.");
                                                }
                                            }
                                        } finally {
                                        }
                                    }
                                }
                            } else {
                                n6Var = n6.S;
                                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "The device doesn't have valid Play Store.");
                            }
                        }
                        V(0);
                        com.google.android.gms.internal.play_billing.m0.l(c3.d4(726), "Billing service unavailable on device.");
                        d dVar4 = p0.f2423b;
                        U(n6Var, dVar4, i4);
                        dVar2 = dVar4;
                    }
                    dVar2 = dVar3;
                }
            } finally {
            }
        }
        if (dVar2 != null) {
            dVar.a(dVar2);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Multi-variable type inference failed */
    public final void X() {
        synchronized (this.f2240a) {
            if (this.f2249j != null) {
                try {
                    this.f2246g.unbindService(this.f2249j);
                } catch (Throwable th) {
                    try {
                        com.google.android.gms.internal.play_billing.m0.n("BillingClient", "There was an exception while unbinding service!", th);
                        this.f2248i = null;
                        this.f2249j = null;
                    } finally {
                        this.f2248i = null;
                        this.f2249j = null;
                    }
                }
            }
        }
    }

    private final boolean Y(long j4) {
        try {
            d dVar = (d) P(1).get(Build.VERSION.SDK_INT < 29 ? 0L : 3000L, TimeUnit.MILLISECONDS);
            if (dVar.c() == 0) {
                com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Reconnection succeeded with result: " + dVar.c());
            } else {
                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Reconnection failed with result: " + dVar.c());
            }
        } catch (Exception e4) {
            if (e4 instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Error during reconnection attempt: ", e4);
        }
        return a0();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final boolean Z(long j4) {
        long max;
        com.google.android.gms.internal.play_billing.x b4 = com.google.android.gms.internal.play_billing.x.b(this.K);
        long j5 = 30000;
        for (int i4 = 1; i4 <= 3; i4++) {
            try {
                max = Math.max(0L, j5);
            } catch (Exception e4) {
                if (e4 instanceof InterruptedException) {
                    Thread.currentThread().interrupt();
                }
                com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Error during reconnection attempt: ", e4);
            }
            if (max <= 0) {
                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "No time remaining for reconnection attempt.");
                return a0();
            }
            d dVar = (d) P(i4).get(max, TimeUnit.MILLISECONDS);
            if (dVar.c() == 0) {
                com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Reconnection succeeded with result: " + dVar.c());
                return a0();
            }
            com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Reconnection failed with result: " + dVar.c());
            TimeUnit timeUnit = TimeUnit.MILLISECONDS;
            j5 = 30000 - b4.a(timeUnit);
            long pow = ((long) Math.pow(2.0d, i4 - 1)) * 1000;
            if (j5 < pow) {
                com.google.android.gms.internal.play_billing.m0.m("BillingClient", c3.d4(727));
                return a0();
            }
            if (i4 < 3 && pow > 0) {
                try {
                    Thread.sleep(pow);
                    j5 = 30000 - b4.a(timeUnit);
                } catch (InterruptedException e5) {
                    Thread.currentThread().interrupt();
                    com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Error sleeping during reconnection attempt: ", e5);
                }
            }
        }
        com.google.android.gms.internal.play_billing.m0.m("BillingClient", c3.d4(1321));
        return a0();
    }

    private final boolean a0() {
        boolean z3;
        synchronized (this.f2240a) {
            try {
                z3 = false;
                if (this.f2241b == 2 && this.f2248i != null && this.f2249j != null) {
                    z3 = true;
                }
            } finally {
            }
        }
        return z3;
    }

    private static final String b0(int i4) {
        return i4 != 0 ? i4 != 1 ? i4 != 2 ? "CLOSED" : "CONNECTED" : "CONNECTING" : "DISCONNECTED";
    }

    private static final void c0(z6 z6Var, Context context) {
        try {
            ActivityManager activityManager = (ActivityManager) context.getSystemService("activity");
            if (activityManager != null) {
                ActivityManager.MemoryInfo memoryInfo = new ActivityManager.MemoryInfo();
                activityManager.getMemoryInfo(memoryInfo);
                z6Var.x((int) (memoryInfo.totalMem / 1048576));
                z6Var.t(Build.BRAND);
                z6Var.w(Build.MODEL);
                z6Var.v(Build.MANUFACTURER);
                z6Var.u(Build.FINGERPRINT);
            }
        } catch (RuntimeException e4) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Runtime error while populating device info.", e4);
        }
    }

    private final e0.z d0(int i4, d dVar, n6 n6Var, String str, Exception exc) {
        h0(n6Var, 9, dVar, n0.a(exc));
        com.google.android.gms.internal.play_billing.m0.n("BillingClient", str, exc);
        return new e0.z(dVar, null);
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:35:0x01a1  */
    /* JADX WARN: Removed duplicated region for block: B:61:0x0195 A[SYNTHETIC] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public final e0.z e0(java.lang.String r17, boolean r18, int r19) {
        /*
            Method dump skipped, instructions count: 598
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.android.billingclient.api.b.e0(java.lang.String, boolean, int):e0.z");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void f0(n6 n6Var, int i4, d dVar) {
        try {
            int i5 = n0.f2415a;
            R(n0.b(n6Var, i4, dVar, null, u6.BROADCAST_ACTION_UNSPECIFIED));
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(1219), th);
        }
    }

    private final void g0(n6 n6Var, int i4, d dVar, long j4) {
        try {
            int i5 = n0.f2415a;
            try {
                this.f2247h.j(n0.b(n6Var, 2, dVar, null, u6.BROADCAST_ACTION_UNSPECIFIED), this.f2252m, j4);
            } catch (Throwable th) {
                com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th);
            }
        } catch (Throwable th2) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th2);
        }
    }

    private void h(Context context, e0.i iVar, e eVar, e0.q qVar, String str, o0 o0Var, a.C0032a c0032a) {
        String d4 = c3.d4(566);
        this.f2246g = context.getApplicationContext();
        z6 M = b7.M();
        M.z(str);
        String str2 = this.f2243d;
        if (str2 != null) {
            M.A(str2);
        }
        M.s(this.f2246g.getPackageName());
        M.p(this.J.longValue());
        M.y(c0032a.f2238i);
        M.m(Build.VERSION.SDK_INT);
        M.r(846465066L);
        c0(M, context);
        try {
            M.n(this.f2246g.getPackageManager().getPackageInfo(this.f2246g.getPackageName(), 0).versionCode);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n(d4, "Error getting app version code.", th);
        }
        if (o0Var != null) {
            this.f2247h = o0Var;
        } else {
            this.f2247h = new q0(this.f2246g, (b7) M.i());
        }
        if (iVar == null) {
            com.google.android.gms.internal.play_billing.m0.m(d4, "Billing client should have a valid listener but the provided is null.");
        }
        this.f2245f = new k(this.f2246g, iVar, null, qVar, null, null, this.f2247h);
        this.E = eVar;
        this.G = qVar != null;
        this.f2246g.getPackageName();
        this.F = c0032a.f2238i;
    }

    private final void h0(n6 n6Var, int i4, d dVar, String str) {
        try {
            int i5 = n0.f2415a;
            R(n0.b(n6Var, i4, dVar, str, u6.BROADCAST_ACTION_UNSPECIFIED));
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Unable to log.", th);
        }
    }

    private final void i0(n6 n6Var, int i4, d dVar, long j4, boolean z3) {
        try {
            int i5 = n0.f2415a;
            S(n0.b(n6Var, 2, dVar, null, u6.BROADCAST_ACTION_UNSPECIFIED), j4, z3);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(1411), th);
        }
    }

    static Future j(Callable callable, long j4, final Runnable runnable, Handler handler, ExecutorService executorService) {
        try {
            final Future submit = executorService.submit(callable);
            handler.postDelayed(new Runnable() { // from class: e0.p
                @Override // java.lang.Runnable
                public final void run() {
                    Future future = submit;
                    if (future.isDone() || future.isCancelled()) {
                        return;
                    }
                    Runnable runnable2 = runnable;
                    future.cancel(true);
                    m0.m("BillingClient", "Async task is taking too long, cancel it!");
                    if (runnable2 != null) {
                        runnable2.run();
                    }
                }
            }, (long) (j4 * 0.95d));
            return submit;
        } catch (Exception e4) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Async task throws exception!", e4);
            return null;
        }
    }

    private final void j0(n6 n6Var, int i4, d dVar, String str, long j4, boolean z3) {
        try {
            int i5 = n0.f2415a;
            S(n0.b(n6Var, 2, dVar, str, u6.BROADCAST_ACTION_UNSPECIFIED), j4, z3);
        } catch (Throwable th) {
            com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(681), th);
        }
    }

    public static /* synthetic */ void k(b bVar, e0.h hVar) {
        n6 n6Var = n6.EXECUTE_ASYNC_TIMEOUT;
        d dVar = p0.f2432k;
        bVar.f0(n6Var, 9, dVar);
        hVar.a(dVar, com.google.android.gms.internal.play_billing.i0.m());
    }

    public static /* synthetic */ void l(b bVar, e0.b bVar2) {
        n6 n6Var = n6.EXECUTE_ASYNC_TIMEOUT;
        d dVar = p0.f2432k;
        bVar.f0(n6Var, 3, dVar);
        bVar2.a(dVar);
    }

    public static /* synthetic */ void m(b bVar, e0.g gVar) {
        n6 n6Var = n6.EXECUTE_ASYNC_TIMEOUT;
        d dVar = p0.f2432k;
        bVar.f0(n6Var, 7, dVar);
        gVar.a(dVar, new h(com.google.android.gms.internal.play_billing.i0.m(), com.google.android.gms.internal.play_billing.i0.m()));
    }

    public static /* synthetic */ void n(b bVar, d dVar) {
        if (bVar.f2245f.e() != null) {
            bVar.f2245f.e().a(dVar, null);
        } else {
            com.google.android.gms.internal.play_billing.m0.m("BillingClient", "No valid listener is set in BroadcastManager");
        }
    }

    private final /* synthetic */ Object p(e0.b bVar, e0.a aVar) {
        com.google.android.gms.internal.play_billing.d dVar;
        try {
            if (!Z(30000L)) {
                n6 n6Var = n6.SERVICE_CONNECTION_NOT_READY;
                d dVar2 = p0.f2431j;
                f0(n6Var, 3, dVar2);
                bVar.a(dVar2);
            } else if (TextUtils.isEmpty(aVar.a())) {
                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Please provide a valid purchase token.");
                n6 n6Var2 = n6.EMPTY_PURCHASE_TOKEN;
                d dVar3 = p0.f2428g;
                f0(n6Var2, 3, dVar3);
                bVar.a(dVar3);
            } else if (this.f2255p) {
                synchronized (this.f2240a) {
                    dVar = this.f2248i;
                }
                if (dVar != null) {
                    String packageName = this.f2246g.getPackageName();
                    String a4 = aVar.a();
                    String str = this.f2242c;
                    String str2 = this.f2243d;
                    long longValue = this.J.longValue();
                    int i4 = com.google.android.gms.internal.play_billing.m0.f2862a;
                    Bundle bundle = new Bundle();
                    com.google.android.gms.internal.play_billing.m0.c(bundle, str, str2, longValue);
                    Bundle f02 = dVar.f0(9, packageName, a4, bundle);
                    bVar.a(p0.a(com.google.android.gms.internal.play_billing.m0.b(f02, "BillingClient"), com.google.android.gms.internal.play_billing.m0.i(f02, "BillingClient")));
                    return null;
                }
                s(bVar, p0.f2431j, n6.SERVICE_RESET_TO_NULL, null);
            } else {
                n6 n6Var3 = n6.API_VERSION_NOT_V9;
                d dVar4 = p0.f2422a;
                f0(n6Var3, 3, dVar4);
                bVar.a(dVar4);
            }
            return null;
        } catch (DeadObjectException e4) {
            s(bVar, p0.f2431j, n6.ACKNOWLEDGE_PURCHASE_SERVICE_CALL_EXCEPTION, e4);
            return null;
        } catch (Exception e5) {
            s(bVar, p0.f2429h, n6.ACKNOWLEDGE_PURCHASE_SERVICE_CALL_EXCEPTION, e5);
            return null;
        }
    }

    private final String q(g gVar) {
        if (TextUtils.isEmpty(null)) {
            return this.f2246g.getPackageName();
        }
        return null;
    }

    private static String r() {
        try {
            return (String) Class.forName("com.android.billingclient.ktx.BuildConfig").getField("VERSION_NAME").get(null);
        } catch (Exception unused) {
            return null;
        }
    }

    private final void s(e0.b bVar, d dVar, n6 n6Var, Exception exc) {
        com.google.android.gms.internal.play_billing.m0.n("BillingClient", c3.d4(148), exc);
        h0(n6Var, 3, dVar, n0.a(exc));
        bVar.a(dVar);
    }

    static /* bridge */ /* synthetic */ d t0(Exception exc) {
        return exc instanceof DeadObjectException ? p0.f2431j : p0.f2429h;
    }

    public static /* synthetic */ Object y0(b bVar, int i4, j8 j8Var) {
        bVar.W(new y(bVar, j8Var), i4);
        return "reconnectIfNeeded";
    }

    public static /* synthetic */ Object z0(b bVar, e0.g gVar, g gVar2) {
        if (!bVar.Z(30000L)) {
            n6 n6Var = n6.SERVICE_CONNECTION_NOT_READY;
            d dVar = p0.f2431j;
            bVar.f0(n6Var, 7, dVar);
            gVar.a(dVar, new h(com.google.android.gms.internal.play_billing.i0.m(), com.google.android.gms.internal.play_billing.i0.m()));
            return null;
        }
        if (bVar.f2260u) {
            c0 o02 = bVar.o0(gVar2);
            gVar.a(p0.a(o02.a(), o02.b()), new h(o02.c(), o02.d()));
            return null;
        }
        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Querying product details is not supported.");
        n6 n6Var2 = n6.PRODUCT_DETAILS_NOT_SUPPORTED;
        d dVar2 = p0.f2439r;
        bVar.f0(n6Var2, 7, dVar2);
        gVar.a(dVar2, new h(com.google.android.gms.internal.play_billing.i0.m(), com.google.android.gms.internal.play_billing.i0.m()));
        return null;
    }

    public final void E(Runnable runnable) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            runnable.run();
        } else {
            this.f2244e.post(runnable);
        }
    }

    @Override // com.android.billingclient.api.a
    public void a(final e0.a aVar, final e0.b bVar) {
        if (j(new Callable() { // from class: com.android.billingclient.api.o
            @Override // java.util.concurrent.Callable
            public final Object call() {
                b.A0(b.this, bVar, aVar);
                return null;
            }
        }, 30000L, new Runnable() { // from class: com.android.billingclient.api.p
            @Override // java.lang.Runnable
            public final void run() {
                b.l(b.this, bVar);
            }
        }, L(), i()) == null) {
            d O = O();
            f0(n6.MISSING_RESULT_FROM_EXECUTE_ASYNC, 3, O);
            bVar.a(O);
        }
    }

    @Override // com.android.billingclient.api.a
    public final boolean b() {
        if (this.F) {
            return true;
        }
        return a0();
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // com.android.billingclient.api.a
    public d c(Activity activity, c cVar) {
        boolean d4;
        Activity activity2;
        long j4;
        String str;
        Future j5;
        long j6;
        long j7;
        long j8;
        n6 n6Var;
        boolean z3;
        long nextLong = new Random().nextLong();
        if (this.f2245f == null || this.f2245f.e() == null) {
            n6 n6Var2 = n6.f2927q;
            d dVar = p0.D;
            g0(n6Var2, 2, dVar, nextLong);
            return dVar;
        }
        cVar.a();
        if (!Y(3000L)) {
            n6 n6Var3 = n6.SERVICE_CONNECTION_NOT_READY;
            d dVar2 = p0.f2431j;
            g0(n6Var3, 2, dVar2, nextLong);
            u0(dVar2);
            return dVar2;
        }
        synchronized (this.f2240a) {
            try {
                d4 = this.f2249j != null ? this.f2249j.d() : false;
            } finally {
            }
        }
        ArrayList l3 = cVar.l();
        List m3 = cVar.m();
        h.d.a(com.google.android.gms.internal.play_billing.o0.a(l3, null));
        c.b bVar = (c.b) com.google.android.gms.internal.play_billing.o0.a(m3, null);
        final String c4 = bVar.c().c();
        final String d5 = bVar.c().d();
        if (d5.equals("subs") && !this.f2250k) {
            com.google.android.gms.internal.play_billing.m0.m(c3.d4(778), "Current client doesn't support subscriptions.");
            n6 n6Var4 = n6.SUBSCRIPTIONS_NOT_SUPPORTED;
            d dVar3 = p0.f2433l;
            i0(n6Var4, 2, dVar3, nextLong, d4);
            u0(dVar3);
            return dVar3;
        }
        if (cVar.w() && !this.f2253n) {
            com.google.android.gms.internal.play_billing.m0.m("BillingClient", c3.d4(921));
            n6 n6Var5 = n6.f2945w;
            d dVar4 = p0.f2427f;
            i0(n6Var5, 2, dVar4, nextLong, d4);
            u0(dVar4);
            return dVar4;
        }
        if (l3.size() > 1 && !this.f2259t) {
            com.google.android.gms.internal.play_billing.m0.m(c3.d4(13), "Current client doesn't support multi-item purchases.");
            n6 n6Var6 = n6.f2948x;
            d dVar5 = p0.f2437p;
            i0(n6Var6, 2, dVar5, nextLong, d4);
            u0(dVar5);
            return dVar5;
        }
        if (!m3.isEmpty() && !this.f2260u) {
            com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Current client doesn't support purchases with ProductDetails.");
            n6 n6Var7 = n6.PRODUCT_DETAILS_NOT_SUPPORTED;
            d dVar6 = p0.f2439r;
            i0(n6Var7, 2, dVar6, nextLong, d4);
            u0(dVar6);
            return dVar6;
        }
        d f4 = cVar.f();
        if (f4 != p0.f2430i) {
            i0(n6.f2905i1, 2, f4, nextLong, d4);
            u0(f4);
            return f4;
        }
        boolean z4 = d4;
        if (this.f2253n) {
            j4 = nextLong;
            final Bundle f5 = com.google.android.gms.internal.play_billing.m0.f(cVar, this.f2255p, this.f2262w, this.E.a(), this.E.b(), this.G, this.f2242c, this.f2243d, this.J.longValue(), this.f2246g.getPackageName(), j4);
            if (l3.isEmpty()) {
                ArrayList<String> arrayList = new ArrayList<>(m3.size() - 1);
                ArrayList<String> arrayList2 = new ArrayList<>(m3.size() - 1);
                ArrayList<String> arrayList3 = new ArrayList<>();
                ArrayList<String> arrayList4 = new ArrayList<>();
                ArrayList<String> arrayList5 = new ArrayList<>();
                ArrayList<Integer> arrayList6 = new ArrayList<>();
                for (int i4 = 0; i4 < m3.size(); i4++) {
                    c.b bVar2 = (c.b) m3.get(i4);
                    f c5 = bVar2.c();
                    if (!c5.g().isEmpty()) {
                        arrayList3.add(c5.g());
                    }
                    String d6 = bVar2.d();
                    arrayList4.add(d6);
                    String h4 = c5.h(d6);
                    if (!TextUtils.isEmpty(h4)) {
                        arrayList5.add(h4);
                    }
                    if (i4 > 0) {
                        arrayList.add(((c.b) m3.get(i4)).c().c());
                        arrayList2.add(((c.b) m3.get(i4)).c().d());
                    }
                }
                f5.putStringArrayList("SKU_OFFER_ID_TOKEN_LIST", arrayList4);
                if (!arrayList6.isEmpty()) {
                    f5.putIntegerArrayList("autoPayBalanceThresholdList", arrayList6);
                }
                if (!arrayList3.isEmpty()) {
                    f5.putStringArrayList("skuDetailsTokens", arrayList3);
                }
                if (!arrayList5.isEmpty()) {
                    f5.putStringArrayList("SKU_SERIALIZED_DOCID_LIST", arrayList5);
                }
                if (!arrayList.isEmpty()) {
                    f5.putStringArrayList("additionalSkus", arrayList);
                    f5.putStringArrayList("additionalSkuTypes", arrayList2);
                }
            } else {
                ArrayList<String> arrayList7 = new ArrayList<>();
                new ArrayList();
                new ArrayList();
                new ArrayList();
                new ArrayList();
                Iterator it = l3.iterator();
                if (it.hasNext()) {
                    h.d.a(it.next());
                    throw null;
                }
                if (!arrayList7.isEmpty()) {
                    f5.putStringArrayList("skuDetailsTokens", arrayList7);
                }
                if (l3.size() > 1) {
                    ArrayList<String> arrayList8 = new ArrayList<>(l3.size() - 1);
                    ArrayList<String> arrayList9 = new ArrayList<>(l3.size() - 1);
                    if (1 < l3.size()) {
                        h.d.a(l3.get(1));
                        throw null;
                    }
                    f5.putStringArrayList("additionalSkus", arrayList8);
                    f5.putStringArrayList("additionalSkuTypes", arrayList9);
                }
            }
            if (f5.containsKey("SKU_OFFER_ID_TOKEN_LIST") && !this.f2257r) {
                n6 n6Var8 = n6.f2954z;
                d dVar7 = p0.f2438q;
                i0(n6Var8, 2, dVar7, j4, z4);
                u0(dVar7);
                return dVar7;
            }
            if (bVar == null || TextUtils.isEmpty(bVar.c().f())) {
                z3 = false;
            } else {
                f5.putString("skuPackageName", bVar.c().f());
                z3 = true;
            }
            if (!TextUtils.isEmpty(null)) {
                f5.putString("accountName", null);
            }
            Intent intent = activity.getIntent();
            if (intent == null) {
                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Activity's intent is null.");
            } else if (!TextUtils.isEmpty(intent.getStringExtra(c3.d4(1364)))) {
                String stringExtra = intent.getStringExtra("PROXY_PACKAGE");
                f5.putString("proxyPackage", stringExtra);
                try {
                    f5.putString("proxyPackageVersion", this.f2246g.getPackageManager().getPackageInfo(stringExtra, 0).versionName);
                } catch (PackageManager.NameNotFoundException unused) {
                    f5.putString(c3.d4(829), "package not found");
                }
            }
            final int i5 = (!this.f2260u || m3.isEmpty()) ? (this.f2258s && z3) ? 15 : this.f2255p ? 9 : 6 : 17;
            activity2 = activity;
            str = null;
            final c cVar2 = cVar;
            j5 = j(new Callable() { // from class: com.android.billingclient.api.m
                @Override // java.util.concurrent.Callable
                public final Object call() {
                    Bundle J;
                    J = b.this.J(i5, c4, d5, cVar2, f5);
                    return J;
                }
            }, 5000L, null, this.f2244e, i());
            j6 = cVar2;
        } else {
            activity2 = activity;
            j4 = nextLong;
            str = null;
            j5 = j(new Callable() { // from class: com.android.billingclient.api.n
                @Override // java.util.concurrent.Callable
                public final Object call() {
                    Bundle K;
                    K = b.this.K(c4, d5);
                    return K;
                }
            }, 5000L, null, this.f2244e, i());
            j6 = nextLong;
        }
        try {
            if (j5 == null) {
                try {
                    n6 n6Var9 = n6.MISSING_RESULT_FROM_EXECUTE_ASYNC;
                    d dVar8 = p0.f2424c;
                    i0(n6Var9, 2, dVar8, j4, z4);
                    u0(dVar8);
                    return dVar8;
                } catch (CancellationException e4) {
                    e = e4;
                    j8 = j4;
                    com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Time out while launching billing flow. Try to reconnect", e);
                    n6 n6Var10 = n6.f2903i;
                    d dVar9 = p0.f2432k;
                    j0(n6Var10, 2, dVar9, n0.a(e), j8, z4);
                    u0(dVar9);
                    return dVar9;
                } catch (TimeoutException e5) {
                    e = e5;
                    j8 = j4;
                    com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Time out while launching billing flow. Try to reconnect", e);
                    n6 n6Var102 = n6.f2903i;
                    d dVar92 = p0.f2432k;
                    j0(n6Var102, 2, dVar92, n0.a(e), j8, z4);
                    u0(dVar92);
                    return dVar92;
                } catch (Exception e6) {
                    e = e6;
                    j7 = j4;
                    com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Exception while launching billing flow. Try to reconnect", e);
                    n6 n6Var11 = n6.LAUNCH_BILLING_FLOW_EXCEPTION;
                    d dVar10 = p0.f2431j;
                    j0(n6Var11, 2, dVar10, n0.a(e), j7, z4);
                    u0(dVar10);
                    return dVar10;
                }
            }
            long j9 = j4;
            Bundle bundle = (Bundle) j5.get(5000L, TimeUnit.MILLISECONDS);
            int b4 = com.google.android.gms.internal.play_billing.m0.b(bundle, "BillingClient");
            String i6 = com.google.android.gms.internal.play_billing.m0.i(bundle, "BillingClient");
            if (b4 == 0) {
                Intent intent2 = new Intent(activity2, (Class<?>) ProxyBillingActivity.class);
                intent2.putExtra("BUY_INTENT", (PendingIntent) bundle.getParcelable("BUY_INTENT"));
                intent2.putExtra("billingClientTransactionId", j9);
                intent2.putExtra("wasServiceAutoReconnected", z4);
                activity2.startActivity(intent2);
                return p0.f2430i;
            }
            com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Unable to buy item, Error response code: " + b4);
            d a4 = p0.a(b4, i6);
            try {
                if (bundle == null) {
                    n6Var = n6.REASON_UNSPECIFIED;
                } else {
                    Object obj = bundle.get("LOG_REASON");
                    if (obj == null) {
                        n6Var = n6.REASON_UNSPECIFIED;
                    } else if (obj instanceof Integer) {
                        n6Var = n6.b(((Integer) obj).intValue());
                    } else {
                        com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Unexpected type for bundle log reason: " + obj.getClass().getName());
                        n6Var = n6.REASON_UNSPECIFIED;
                    }
                }
            } catch (Throwable th) {
                com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Failed to get log reason from bundle: ".concat(String.valueOf(th.getMessage())));
                n6Var = n6.REASON_UNSPECIFIED;
            }
            if (n6Var == n6.REASON_UNSPECIFIED) {
                n6Var = n6.B;
            }
            n6 n6Var12 = n6Var;
            if (bundle != null) {
                try {
                    str = bundle.getString("ADDITIONAL_LOG_DETAILS");
                } catch (Throwable th2) {
                    com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Failed to get additional log details from bundle: ".concat(String.valueOf(th2.getMessage())));
                }
            }
            try {
                j0(n6Var12, 2, a4, str, j9, z4);
                u0(a4);
                return a4;
            } catch (CancellationException e7) {
                e = e7;
                j8 = j9;
                z4 = z4;
                com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Time out while launching billing flow. Try to reconnect", e);
                n6 n6Var1022 = n6.f2903i;
                d dVar922 = p0.f2432k;
                j0(n6Var1022, 2, dVar922, n0.a(e), j8, z4);
                u0(dVar922);
                return dVar922;
            } catch (TimeoutException e8) {
                e = e8;
                j8 = j9;
                z4 = z4;
                com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Time out while launching billing flow. Try to reconnect", e);
                n6 n6Var10222 = n6.f2903i;
                d dVar9222 = p0.f2432k;
                j0(n6Var10222, 2, dVar9222, n0.a(e), j8, z4);
                u0(dVar9222);
                return dVar9222;
            } catch (Exception e9) {
                e = e9;
                j7 = j9;
                z4 = z4;
                com.google.android.gms.internal.play_billing.m0.n("BillingClient", "Exception while launching billing flow. Try to reconnect", e);
                n6 n6Var112 = n6.LAUNCH_BILLING_FLOW_EXCEPTION;
                d dVar102 = p0.f2431j;
                j0(n6Var112, 2, dVar102, n0.a(e), j7, z4);
                u0(dVar102);
                return dVar102;
            }
        } catch (CancellationException e10) {
            e = e10;
        } catch (TimeoutException e11) {
            e = e11;
            j8 = j6;
        } catch (Exception e12) {
            e = e12;
        }
    }

    @Override // com.android.billingclient.api.a
    public void e(final g gVar, final e0.g gVar2) {
        if (j(new Callable() { // from class: com.android.billingclient.api.r
            @Override // java.util.concurrent.Callable
            public final Object call() {
                b.z0(b.this, gVar2, gVar);
                return null;
            }
        }, 30000L, new Runnable() { // from class: com.android.billingclient.api.s
            @Override // java.lang.Runnable
            public final void run() {
                b.m(b.this, gVar2);
            }
        }, L(), i()) == null) {
            d O = O();
            f0(n6.MISSING_RESULT_FROM_EXECUTE_ASYNC, 7, O);
            gVar2.a(O, new h(com.google.android.gms.internal.play_billing.i0.m(), com.google.android.gms.internal.play_billing.i0.m()));
        }
    }

    @Override // com.android.billingclient.api.a
    public final void f(e0.j jVar, final e0.h hVar) {
        if (j(new v(this, hVar, jVar.c(), jVar.a()), 30000L, new Runnable() { // from class: com.android.billingclient.api.t
            @Override // java.lang.Runnable
            public final void run() {
                b.k(b.this, hVar);
            }
        }, L(), i()) == null) {
            d O = O();
            f0(n6.MISSING_RESULT_FROM_EXECUTE_ASYNC, 9, O);
            hVar.a(O, com.google.android.gms.internal.play_billing.i0.m());
        }
    }

    @Override // com.android.billingclient.api.a
    public void g(e0.d dVar) {
        W(dVar, 0);
    }

    final synchronized ExecutorService i() {
        try {
            if (this.I == null) {
                this.I = Executors.newFixedThreadPool(com.google.android.gms.internal.play_billing.m0.f2862a, new u(this));
            }
        } catch (Throwable th) {
            throw th;
        }
        return this.I;
    }

    final c0 o0(g gVar) {
        com.google.android.gms.internal.play_billing.d dVar;
        int i4;
        int i5;
        ArrayList arrayList = new ArrayList();
        ArrayList arrayList2 = new ArrayList();
        String c4 = gVar.c();
        com.google.android.gms.internal.play_billing.i0 b4 = gVar.b();
        int size = b4.size();
        int i6 = 0;
        while (i6 < size) {
            int i7 = i6 + 20;
            ArrayList arrayList3 = new ArrayList(b4.subList(i6, i7 > size ? size : i7));
            ArrayList<String> arrayList4 = new ArrayList<>();
            int size2 = arrayList3.size();
            for (int i8 = 0; i8 < size2; i8++) {
                arrayList4.add(((g.b) arrayList3.get(i8)).b());
            }
            Bundle bundle = new Bundle();
            bundle.putStringArrayList("ITEM_ID_LIST", arrayList4);
            String str = this.f2242c;
            bundle.putString("playBillingLibraryVersion", str);
            try {
                synchronized (this.f2240a) {
                    dVar = this.f2248i;
                }
                if (dVar == null) {
                    return M(p0.f2431j, n6.SERVICE_RESET_TO_NULL, "Service has been reset to null.", null);
                }
                boolean z3 = this.f2262w && this.E.b();
                q(gVar);
                q(gVar);
                q(gVar);
                q(gVar);
                Bundle W = dVar.W(true != this.f2263x ? 17 : 20, this.f2246g.getPackageName(), c4, bundle, com.google.android.gms.internal.play_billing.m0.g(str, this.f2243d, arrayList3, null, null, com.google.android.gms.internal.play_billing.a.a(z3, true, true, true, false, true), this.J.longValue()));
                if (W == null) {
                    return M(p0.A, n6.NULL_BUNDLE_FROM_GET_SKU_DETAILS_SERVICE_CALL, c3.d4(238), null);
                }
                if (!W.containsKey("DETAILS_LIST")) {
                    int b5 = com.google.android.gms.internal.play_billing.m0.b(W, c3.d4(1365));
                    String i9 = com.google.android.gms.internal.play_billing.m0.i(W, "BillingClient");
                    if (b5 == 0) {
                        return M(p0.a(6, i9), n6.X, c3.d4(15), null);
                    }
                    return M(p0.a(b5, i9), n6.B, c3.d4(475) + b5, null);
                }
                ArrayList<String> stringArrayList = W.getStringArrayList(c3.d4(878));
                if (stringArrayList == null) {
                    return M(p0.A, n6.NULL_DETAILS_LIST_IN_GET_SKU_DETAILS_RESPONSE, "queryProductDetailsAsync got null response list", null);
                }
                ArrayList arrayList5 = new ArrayList();
                int size3 = stringArrayList.size();
                for (int i10 = 0; i10 < size3; i10++) {
                    try {
                        f fVar = new f(stringArrayList.get(i10));
                        com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Got product details: ".concat(fVar.toString()));
                        arrayList5.add(fVar);
                    } catch (JSONException e4) {
                        return M(p0.a(6, "Error trying to decode SkuDetails."), n6.ERROR_DECODING_SKU_DETAILS, "Got a JSON exception trying to decode ProductDetails. \n Exception: ", e4);
                    }
                }
                ArrayList<String> stringArrayList2 = W.getStringArrayList("UNFETCHED_PRODUCT_LIST");
                new ArrayList();
                try {
                    ArrayList arrayList6 = new ArrayList();
                    if (stringArrayList2 != null) {
                        int size4 = stringArrayList2.size();
                        int i11 = 0;
                        while (i11 < size4) {
                            String str2 = stringArrayList2.get(i11);
                            i11++;
                            i iVar = new i(str2);
                            com.google.android.gms.internal.play_billing.m0.l("BillingClient", "Got unfetchedProduct: ".concat(iVar.toString()));
                            arrayList6.add(iVar);
                        }
                    } else {
                        int size5 = arrayList3.size();
                        int i12 = 0;
                        while (i12 < size5) {
                            Object obj = arrayList3.get(i12);
                            int i13 = i12 + 1;
                            g.b bVar = (g.b) obj;
                            int size6 = arrayList5.size();
                            int i14 = 0;
                            while (true) {
                                if (i14 >= size6) {
                                    i4 = size5;
                                    i5 = i13;
                                    arrayList6.add(new i(new JSONObject().put("productId", bVar.b()).put("type", bVar.c()).put("statusCode", 0).toString()));
                                    break;
                                }
                                Object obj2 = arrayList5.get(i14);
                                i14++;
                                f fVar2 = (f) obj2;
                                i4 = size5;
                                i5 = i13;
                                if (!bVar.b().equals(fVar2.c()) || !bVar.c().equals(fVar2.d())) {
                                    size5 = i4;
                                    i13 = i5;
                                }
                            }
                            size5 = i4;
                            i12 = i5;
                        }
                    }
                    arrayList.addAll(arrayList5);
                    arrayList2.addAll(arrayList6);
                    i6 = i7;
                } catch (JSONException e5) {
                    return M(p0.a(6, "Error trying to decode SkuDetails."), n6.ERROR_DECODING_SKU_DETAILS, c3.d4(879), e5);
                }
            } catch (DeadObjectException e6) {
                return M(p0.f2431j, n6.GET_SKU_DETAILS_SERVICE_CALL_EXCEPTION, "queryProductDetailsAsync got a remote exception (try to reconnect).", e6);
            } catch (Exception e7) {
                return M(p0.f2429h, n6.GET_SKU_DETAILS_SERVICE_CALL_EXCEPTION, c3.d4(374), e7);
            }
        }
        return new c0(0, "", arrayList, arrayList2);
    }

    final o0 r0() {
        return this.f2247h;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public final d u0(final d dVar) {
        if (Thread.interrupted()) {
            return dVar;
        }
        this.f2244e.post(new Runnable() { // from class: com.android.billingclient.api.q
            @Override // java.lang.Runnable
            public final void run() {
                b.n(b.this, dVar);
            }
        });
        return dVar;
    }
}
