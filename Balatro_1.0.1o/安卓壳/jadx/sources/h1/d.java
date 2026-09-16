package h1;

import a1.b2.c3;
import android.accounts.Account;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.os.DeadObjectException;
import android.os.Handler;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import android.os.RemoteException;
import android.text.TextUtils;
import android.util.Log;
import com.google.android.gms.common.api.Scope;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicInteger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class d {

    /* renamed from: a, reason: collision with root package name */
    private int f3442a;

    /* renamed from: b, reason: collision with root package name */
    private long f3443b;

    /* renamed from: c, reason: collision with root package name */
    private long f3444c;

    /* renamed from: d, reason: collision with root package name */
    private int f3445d;

    /* renamed from: e, reason: collision with root package name */
    private long f3446e;

    /* renamed from: g, reason: collision with root package name */
    l1 f3448g;

    /* renamed from: h, reason: collision with root package name */
    private final Context f3449h;

    /* renamed from: i, reason: collision with root package name */
    private final Looper f3450i;

    /* renamed from: j, reason: collision with root package name */
    private final i f3451j;

    /* renamed from: k, reason: collision with root package name */
    private final d1.j f3452k;

    /* renamed from: l, reason: collision with root package name */
    final Handler f3453l;

    /* renamed from: o, reason: collision with root package name */
    private m f3456o;

    /* renamed from: p, reason: collision with root package name */
    protected c f3457p;

    /* renamed from: q, reason: collision with root package name */
    private IInterface f3458q;

    /* renamed from: s, reason: collision with root package name */
    private z0 f3460s;

    /* renamed from: u, reason: collision with root package name */
    private final a f3462u;

    /* renamed from: v, reason: collision with root package name */
    private final b f3463v;

    /* renamed from: w, reason: collision with root package name */
    private final int f3464w;

    /* renamed from: x, reason: collision with root package name */
    private final String f3465x;

    /* renamed from: y, reason: collision with root package name */
    private volatile String f3466y;
    private static final d1.c[] E = new d1.c[0];
    public static final String[] D = {"service_esmobile", "service_googleme"};

    /* renamed from: f, reason: collision with root package name */
    private volatile String f3447f = null;

    /* renamed from: m, reason: collision with root package name */
    private final Object f3454m = new Object();

    /* renamed from: n, reason: collision with root package name */
    private final Object f3455n = new Object();

    /* renamed from: r, reason: collision with root package name */
    private final ArrayList f3459r = new ArrayList();

    /* renamed from: t, reason: collision with root package name */
    private int f3461t = 1;

    /* renamed from: z, reason: collision with root package name */
    private d1.a f3467z = null;
    private boolean A = false;
    private volatile c1 B = null;
    protected AtomicInteger C = new AtomicInteger(0);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        void a(int i4);

        void i(Bundle bundle);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b {
        void h(d1.a aVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface c {
        void c(d1.a aVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: h1.d$d, reason: collision with other inner class name */
    protected class C0047d implements c {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ d f3468a;

        public C0047d(d dVar) {
            Objects.requireNonNull(dVar);
            this.f3468a = dVar;
        }

        @Override // h1.d.c
        public final void c(d1.a aVar) {
            if (aVar.m0()) {
                d dVar = this.f3468a;
                dVar.e(null, dVar.B());
            } else {
                d dVar2 = this.f3468a;
                if (dVar2.c0() != null) {
                    dVar2.c0().h(aVar);
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface e {
        void a();
    }

    protected d(Context context, Looper looper, i iVar, d1.j jVar, int i4, a aVar, b bVar, String str) {
        q.j(context, "Context must not be null");
        this.f3449h = context;
        q.j(looper, c3.d4(1077));
        this.f3450i = looper;
        q.j(iVar, "Supervisor must not be null");
        this.f3451j = iVar;
        q.j(jVar, "API availability must not be null");
        this.f3452k = jVar;
        this.f3453l = new w0(this, looper);
        this.f3464w = i4;
        this.f3462u = aVar;
        this.f3463v = bVar;
        this.f3465x = str;
    }

    private final void g0(int i4, IInterface iInterface) {
        l1 l1Var;
        q.a((i4 == 4) == (iInterface != null));
        synchronized (this.f3454m) {
            try {
                this.f3461t = i4;
                this.f3458q = iInterface;
                Bundle bundle = null;
                if (i4 == 1) {
                    z0 z0Var = this.f3460s;
                    if (z0Var != null) {
                        i iVar = this.f3451j;
                        String a4 = this.f3448g.a();
                        q.i(a4);
                        iVar.d(a4, this.f3448g.b(), 4225, z0Var, R(), this.f3448g.c());
                        this.f3460s = null;
                    }
                } else if (i4 == 2 || i4 == 3) {
                    z0 z0Var2 = this.f3460s;
                    if (z0Var2 != null && (l1Var = this.f3448g) != null) {
                        String a5 = l1Var.a();
                        String b4 = l1Var.b();
                        StringBuilder sb = new StringBuilder(String.valueOf(a5).length() + 70 + String.valueOf(b4).length());
                        sb.append("Calling connect() while still connected, missing disconnect() for ");
                        sb.append(a5);
                        sb.append(" on ");
                        sb.append(b4);
                        Log.e("GmsClient", sb.toString());
                        i iVar2 = this.f3451j;
                        String a6 = this.f3448g.a();
                        q.i(a6);
                        iVar2.d(a6, this.f3448g.b(), 4225, z0Var2, R(), this.f3448g.c());
                        this.C.incrementAndGet();
                    }
                    z0 z0Var3 = new z0(this, this.C.get());
                    this.f3460s = z0Var3;
                    l1 l1Var2 = (this.f3461t != 3 || A() == null) ? new l1(F(), E(), false, 4225, H()) : new l1(x().getPackageName(), A(), true, 4225, false);
                    this.f3448g = l1Var2;
                    if (l1Var2.c() && f() < 17895000) {
                        throw new IllegalStateException("Internal Error, the minimum apk version of this BaseGmsClient is too low to support dynamic lookup. Start service action: ".concat(String.valueOf(this.f3448g.a())));
                    }
                    i iVar3 = this.f3451j;
                    String a7 = this.f3448g.a();
                    q.i(a7);
                    d1.a c4 = iVar3.c(new g1(a7, this.f3448g.b(), 4225, this.f3448g.c()), z0Var3, R(), v());
                    if (!c4.m0()) {
                        String a8 = this.f3448g.a();
                        String b5 = this.f3448g.b();
                        StringBuilder sb2 = new StringBuilder(String.valueOf(a8).length() + 34 + String.valueOf(b5).length());
                        sb2.append("unable to connect to service: ");
                        sb2.append(a8);
                        sb2.append(" on ");
                        sb2.append(b5);
                        Log.w("GmsClient", sb2.toString());
                        int i02 = c4.i0() == -1 ? 16 : c4.i0();
                        if (c4.k0() != null) {
                            bundle = new Bundle();
                            bundle.putParcelable("pendingIntent", c4.k0());
                        }
                        S(i02, bundle, this.C.get());
                    }
                } else if (i4 == 4) {
                    q.i(iInterface);
                    J(iInterface);
                }
            } finally {
            }
        }
    }

    protected String A() {
        return null;
    }

    protected abstract Set B();

    public final IInterface C() {
        IInterface iInterface;
        synchronized (this.f3454m) {
            try {
                if (this.f3461t == 5) {
                    throw new DeadObjectException();
                }
                q();
                iInterface = this.f3458q;
                q.j(iInterface, "Client is connected but service is null");
            } catch (Throwable th) {
                throw th;
            }
        }
        return iInterface;
    }

    protected abstract String D();

    protected abstract String E();

    protected String F() {
        return "com.google.android.gms";
    }

    public f G() {
        c1 c1Var = this.B;
        if (c1Var == null) {
            return null;
        }
        return c1Var.f3441h;
    }

    protected boolean H() {
        return f() >= 211700000;
    }

    public boolean I() {
        return this.B != null;
    }

    protected void J(IInterface iInterface) {
        this.f3444c = System.currentTimeMillis();
    }

    protected void K(d1.a aVar) {
        this.f3445d = aVar.i0();
        this.f3446e = System.currentTimeMillis();
    }

    protected void L(int i4) {
        this.f3442a = i4;
        this.f3443b = System.currentTimeMillis();
    }

    protected void M(int i4, IBinder iBinder, Bundle bundle, int i5) {
        a1 a1Var = new a1(this, i4, iBinder, bundle);
        Handler handler = this.f3453l;
        handler.sendMessage(handler.obtainMessage(1, i5, -1, a1Var));
    }

    public boolean N() {
        return false;
    }

    public void O(String str) {
        this.f3466y = str;
    }

    public void P(int i4) {
        int i5 = this.C.get();
        Handler handler = this.f3453l;
        handler.sendMessage(handler.obtainMessage(6, i5, i4));
    }

    public boolean Q() {
        return false;
    }

    protected final String R() {
        String str = this.f3465x;
        return str == null ? this.f3449h.getClass().getName() : str;
    }

    protected final void S(int i4, Bundle bundle, int i5) {
        b1 b1Var = new b1(this, i4, bundle);
        Handler handler = this.f3453l;
        handler.sendMessage(handler.obtainMessage(7, i5, -1, b1Var));
    }

    final /* synthetic */ void T(c1 c1Var) {
        this.B = c1Var;
        if (Q()) {
            f fVar = c1Var.f3441h;
            r.b().c(fVar == null ? null : fVar.m0());
        }
    }

    final /* synthetic */ void U(int i4, IInterface iInterface) {
        g0(i4, null);
    }

    final /* synthetic */ boolean V(int i4, int i5, IInterface iInterface) {
        synchronized (this.f3454m) {
            try {
                if (this.f3461t != i4) {
                    return false;
                }
                g0(i5, iInterface);
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    final /* synthetic */ void W(int i4) {
        int i5;
        int i6;
        synchronized (this.f3454m) {
            i5 = this.f3461t;
        }
        if (i5 == 3) {
            this.A = true;
            i6 = 5;
        } else {
            i6 = 4;
        }
        Handler handler = this.f3453l;
        handler.sendMessage(handler.obtainMessage(i6, this.C.get(), 16));
    }

    final /* synthetic */ boolean X() {
        if (this.A || TextUtils.isEmpty(D()) || TextUtils.isEmpty(A())) {
            return false;
        }
        try {
            Class.forName(D());
            return true;
        } catch (ClassNotFoundException unused) {
            return false;
        }
    }

    final /* synthetic */ Object Y() {
        return this.f3455n;
    }

    final /* synthetic */ void Z(m mVar) {
        this.f3456o = mVar;
    }

    public boolean a() {
        boolean z3;
        synchronized (this.f3454m) {
            z3 = this.f3461t == 4;
        }
        return z3;
    }

    final /* synthetic */ ArrayList a0() {
        return this.f3459r;
    }

    final /* synthetic */ a b0() {
        return this.f3462u;
    }

    public void c(String str) {
        this.f3447f = str;
        l();
    }

    final /* synthetic */ b c0() {
        return this.f3463v;
    }

    public boolean d() {
        return true;
    }

    final /* synthetic */ d1.a d0() {
        return this.f3467z;
    }

    public void e(k kVar, Set set) {
        Bundle z3 = z();
        String str = Build.VERSION.SDK_INT < 31 ? this.f3466y : this.f3466y;
        int i4 = this.f3464w;
        int i5 = d1.j.f3111a;
        Scope[] scopeArr = g.f3492s;
        Bundle bundle = new Bundle();
        d1.c[] cVarArr = g.f3493t;
        g gVar = new g(6, i4, i5, null, null, scopeArr, bundle, null, cVarArr, cVarArr, true, 0, false, str);
        gVar.f3497h = this.f3449h.getPackageName();
        gVar.f3500k = z3;
        if (set != null) {
            gVar.f3499j = (Scope[]) set.toArray(new Scope[0]);
        }
        if (m()) {
            Account t3 = t();
            if (t3 == null) {
                t3 = new Account("<<default account>>", "com.google");
            }
            gVar.f3501l = t3;
            if (kVar != null) {
                gVar.f3498i = kVar.asBinder();
            }
        } else if (N()) {
            gVar.f3501l = t();
        }
        gVar.f3502m = E;
        gVar.f3503n = u();
        if (Q()) {
            gVar.f3506q = true;
        }
        try {
            synchronized (this.f3455n) {
                try {
                    m mVar = this.f3456o;
                    if (mVar != null) {
                        mVar.z(new y0(this, this.C.get()), gVar);
                    } else {
                        Log.w("GmsClient", "mServiceBroker is null, client disconnected");
                    }
                } finally {
                }
            }
        } catch (DeadObjectException e4) {
            Log.w("GmsClient", "IGmsServiceBroker.getService failed", e4);
            P(3);
        } catch (RemoteException e5) {
            e = e5;
            Log.w("GmsClient", "IGmsServiceBroker.getService failed", e);
            M(8, null, null, this.C.get());
        } catch (SecurityException e6) {
            throw e6;
        } catch (RuntimeException e7) {
            e = e7;
            Log.w("GmsClient", "IGmsServiceBroker.getService failed", e);
            M(8, null, null, this.C.get());
        }
    }

    final /* synthetic */ void e0(d1.a aVar) {
        this.f3467z = aVar;
    }

    public int f() {
        return d1.j.f3111a;
    }

    final /* synthetic */ boolean f0() {
        return this.A;
    }

    public boolean g() {
        boolean z3;
        synchronized (this.f3454m) {
            int i4 = this.f3461t;
            z3 = true;
            if (i4 != 2 && i4 != 3) {
                z3 = false;
            }
        }
        return z3;
    }

    public final d1.c[] h() {
        c1 c1Var = this.B;
        if (c1Var == null) {
            return null;
        }
        return c1Var.f3439f;
    }

    public String i() {
        l1 l1Var;
        if (!a() || (l1Var = this.f3448g) == null) {
            throw new RuntimeException("Failed to connect when checking package");
        }
        return l1Var.b();
    }

    public String j() {
        return this.f3447f;
    }

    public void l() {
        this.C.incrementAndGet();
        ArrayList arrayList = this.f3459r;
        synchronized (arrayList) {
            try {
                int size = arrayList.size();
                for (int i4 = 0; i4 < size; i4++) {
                    ((x0) arrayList.get(i4)).d();
                }
                arrayList.clear();
            } catch (Throwable th) {
                throw th;
            }
        }
        synchronized (this.f3455n) {
            this.f3456o = null;
        }
        g0(1, null);
    }

    public boolean m() {
        return false;
    }

    public void n(e eVar) {
        eVar.a();
    }

    public void p(c cVar) {
        q.j(cVar, "Connection progress callbacks cannot be null.");
        this.f3457p = cVar;
        g0(2, null);
    }

    protected final void q() {
        if (!a()) {
            throw new IllegalStateException(c3.d4(438));
        }
    }

    protected abstract IInterface r(IBinder iBinder);

    protected boolean s() {
        return false;
    }

    public abstract Account t();

    public d1.c[] u() {
        return E;
    }

    protected abstract Executor v();

    public Bundle w() {
        return null;
    }

    public final Context x() {
        return this.f3449h;
    }

    public int y() {
        return this.f3464w;
    }

    protected Bundle z() {
        return new Bundle();
    }
}
