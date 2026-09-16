package androidx.fragment.app;

import a1.b2.c3;
import android.animation.Animator;
import android.app.Activity;
import android.app.Application;
import android.content.ComponentCallbacks;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Parcelable;
import android.util.AttributeSet;
import android.util.Log;
import android.util.SparseArray;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.g;
import androidx.lifecycle.y;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class Fragment implements ComponentCallbacks, View.OnCreateContextMenuListener, androidx.lifecycle.k, androidx.lifecycle.b0, androidx.lifecycle.f, z.e {

    /* renamed from: c0, reason: collision with root package name */
    static final Object f1264c0 = new Object();
    boolean A;
    boolean B;
    boolean C;
    boolean D;
    boolean E;
    private boolean G;
    ViewGroup H;
    View I;
    boolean J;
    f L;
    Handler M;
    boolean O;
    LayoutInflater P;
    boolean Q;
    public String R;
    androidx.lifecycle.l T;
    j0 U;
    y.b W;
    z.d X;
    private int Y;

    /* renamed from: b, reason: collision with root package name */
    Bundle f1267b;

    /* renamed from: c, reason: collision with root package name */
    SparseArray f1269c;

    /* renamed from: d, reason: collision with root package name */
    Bundle f1270d;

    /* renamed from: e, reason: collision with root package name */
    Boolean f1271e;

    /* renamed from: g, reason: collision with root package name */
    Bundle f1273g;

    /* renamed from: h, reason: collision with root package name */
    Fragment f1274h;

    /* renamed from: j, reason: collision with root package name */
    int f1276j;

    /* renamed from: l, reason: collision with root package name */
    boolean f1278l;

    /* renamed from: m, reason: collision with root package name */
    boolean f1279m;

    /* renamed from: n, reason: collision with root package name */
    boolean f1280n;

    /* renamed from: o, reason: collision with root package name */
    boolean f1281o;

    /* renamed from: p, reason: collision with root package name */
    boolean f1282p;

    /* renamed from: q, reason: collision with root package name */
    boolean f1283q;

    /* renamed from: r, reason: collision with root package name */
    boolean f1284r;

    /* renamed from: s, reason: collision with root package name */
    int f1285s;

    /* renamed from: t, reason: collision with root package name */
    x f1286t;

    /* renamed from: u, reason: collision with root package name */
    p f1287u;

    /* renamed from: w, reason: collision with root package name */
    Fragment f1289w;

    /* renamed from: x, reason: collision with root package name */
    int f1290x;

    /* renamed from: y, reason: collision with root package name */
    int f1291y;

    /* renamed from: z, reason: collision with root package name */
    String f1292z;

    /* renamed from: a, reason: collision with root package name */
    int f1265a = -1;

    /* renamed from: f, reason: collision with root package name */
    String f1272f = UUID.randomUUID().toString();

    /* renamed from: i, reason: collision with root package name */
    String f1275i = null;

    /* renamed from: k, reason: collision with root package name */
    private Boolean f1277k = null;

    /* renamed from: v, reason: collision with root package name */
    x f1288v = new y();
    boolean F = true;
    boolean K = true;
    Runnable N = new a();
    g.c S = g.c.RESUMED;
    androidx.lifecycle.o V = new androidx.lifecycle.o();
    private final AtomicInteger Z = new AtomicInteger();

    /* renamed from: a0, reason: collision with root package name */
    private final ArrayList f1266a0 = new ArrayList();

    /* renamed from: b0, reason: collision with root package name */
    private final i f1268b0 = new b();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Fragment.this.A1();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends i {
        b() {
            super(null);
        }

        @Override // androidx.fragment.app.Fragment.i
        void a() {
            Fragment.this.X.c();
            androidx.lifecycle.u.a(Fragment.this);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements Runnable {
        c() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Fragment.this.f(false);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ l0 f1297e;

        d(l0 l0Var) {
            this.f1297e = l0Var;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f1297e.g();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class e extends l {
        e() {
        }

        @Override // androidx.fragment.app.l
        public View j(int i4) {
            View view = Fragment.this.I;
            if (view != null) {
                return view.findViewById(i4);
            }
            throw new IllegalStateException("Fragment " + Fragment.this + " does not have a view");
        }

        @Override // androidx.fragment.app.l
        public boolean s() {
            return Fragment.this.I != null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class f {

        /* renamed from: a, reason: collision with root package name */
        View f1300a;

        /* renamed from: b, reason: collision with root package name */
        boolean f1301b;

        /* renamed from: c, reason: collision with root package name */
        int f1302c;

        /* renamed from: d, reason: collision with root package name */
        int f1303d;

        /* renamed from: e, reason: collision with root package name */
        int f1304e;

        /* renamed from: f, reason: collision with root package name */
        int f1305f;

        /* renamed from: g, reason: collision with root package name */
        int f1306g;

        /* renamed from: h, reason: collision with root package name */
        ArrayList f1307h;

        /* renamed from: i, reason: collision with root package name */
        ArrayList f1308i;

        /* renamed from: j, reason: collision with root package name */
        Object f1309j = null;

        /* renamed from: k, reason: collision with root package name */
        Object f1310k;

        /* renamed from: l, reason: collision with root package name */
        Object f1311l;

        /* renamed from: m, reason: collision with root package name */
        Object f1312m;

        /* renamed from: n, reason: collision with root package name */
        Object f1313n;

        /* renamed from: o, reason: collision with root package name */
        Object f1314o;

        /* renamed from: p, reason: collision with root package name */
        Boolean f1315p;

        /* renamed from: q, reason: collision with root package name */
        Boolean f1316q;

        /* renamed from: r, reason: collision with root package name */
        float f1317r;

        /* renamed from: s, reason: collision with root package name */
        View f1318s;

        /* renamed from: t, reason: collision with root package name */
        boolean f1319t;

        f() {
            Object obj = Fragment.f1264c0;
            this.f1310k = obj;
            this.f1311l = null;
            this.f1312m = obj;
            this.f1313n = null;
            this.f1314o = obj;
            this.f1317r = 1.0f;
            this.f1318s = null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class g {
        static void a(View view) {
            view.cancelPendingInputEvents();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class h extends RuntimeException {
        public h(String str, Exception exc) {
            super(str, exc);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static abstract class i {
        private i() {
        }

        /* synthetic */ i(a aVar) {
            this();
        }

        abstract void a();
    }

    public Fragment() {
        V();
    }

    private int D() {
        g.c cVar = this.S;
        return (cVar == g.c.INITIALIZED || this.f1289w == null) ? cVar.ordinal() : Math.min(cVar.ordinal(), this.f1289w.D());
    }

    private Fragment S(boolean z3) {
        String str;
        if (z3) {
            v.c.h(this);
        }
        Fragment fragment = this.f1274h;
        if (fragment != null) {
            return fragment;
        }
        x xVar = this.f1286t;
        if (xVar == null || (str = this.f1275i) == null) {
            return null;
        }
        return xVar.e0(str);
    }

    private void V() {
        this.T = new androidx.lifecycle.l(this);
        this.X = z.d.a(this);
        this.W = null;
        if (this.f1266a0.contains(this.f1268b0)) {
            return;
        }
        l1(this.f1268b0);
    }

    public static Fragment X(Context context, String str, Bundle bundle) {
        String d4 = c3.d4(967);
        try {
            Fragment fragment = (Fragment) o.d(context.getClassLoader(), str).getConstructor(null).newInstance(null);
            if (bundle == null) {
                return fragment;
            }
            bundle.setClassLoader(fragment.getClass().getClassLoader());
            fragment.t1(bundle);
            return fragment;
        } catch (IllegalAccessException e4) {
            throw new h("Unable to instantiate fragment " + str + d4, e4);
        } catch (InstantiationException e5) {
            throw new h("Unable to instantiate fragment " + str + d4, e5);
        } catch (NoSuchMethodException e6) {
            throw new h("Unable to instantiate fragment " + str + c3.d4(968), e6);
        } catch (InvocationTargetException e7) {
            throw new h("Unable to instantiate fragment " + str + ": calling Fragment constructor caused an exception", e7);
        }
    }

    private f i() {
        if (this.L == null) {
            this.L = new f();
        }
        return this.L;
    }

    private void l1(i iVar) {
        if (this.f1265a >= 0) {
            iVar.a();
        } else {
            this.f1266a0.add(iVar);
        }
    }

    private void q1() {
        if (x.G0(3)) {
            Log.d("FragmentManager", "moveto RESTORE_VIEW_STATE: " + this);
        }
        if (this.I != null) {
            r1(this.f1267b);
        }
        this.f1267b = null;
    }

    View A() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        return fVar.f1318s;
    }

    public boolean A0(MenuItem menuItem) {
        return false;
    }

    public void A1() {
        if (this.L == null || !i().f1319t) {
            return;
        }
        if (this.f1287u == null) {
            i().f1319t = false;
        } else if (Looper.myLooper() != this.f1287u.v().getLooper()) {
            this.f1287u.v().postAtFrontOfQueue(new c());
        } else {
            f(true);
        }
    }

    public final Object B() {
        p pVar = this.f1287u;
        if (pVar == null) {
            return null;
        }
        return pVar.x();
    }

    public void B0(Menu menu) {
    }

    public LayoutInflater C(Bundle bundle) {
        p pVar = this.f1287u;
        if (pVar == null) {
            throw new IllegalStateException(c3.d4(821));
        }
        LayoutInflater y3 = pVar.y();
        androidx.core.view.g.a(y3, this.f1288v.u0());
        return y3;
    }

    public void C0() {
        this.G = true;
    }

    public void D0(boolean z3) {
    }

    int E() {
        f fVar = this.L;
        if (fVar == null) {
            return 0;
        }
        return fVar.f1306g;
    }

    public void E0(Menu menu) {
    }

    public final Fragment F() {
        return this.f1289w;
    }

    public void F0(boolean z3) {
    }

    public final x G() {
        x xVar = this.f1286t;
        if (xVar != null) {
            return xVar;
        }
        throw new IllegalStateException("Fragment " + this + " not associated with a fragment manager.");
    }

    public void G0(int i4, String[] strArr, int[] iArr) {
    }

    boolean H() {
        f fVar = this.L;
        if (fVar == null) {
            return false;
        }
        return fVar.f1301b;
    }

    public void H0() {
        this.G = true;
    }

    int I() {
        f fVar = this.L;
        if (fVar == null) {
            return 0;
        }
        return fVar.f1304e;
    }

    public void I0(Bundle bundle) {
    }

    int J() {
        f fVar = this.L;
        if (fVar == null) {
            return 0;
        }
        return fVar.f1305f;
    }

    public void J0() {
        this.G = true;
    }

    float K() {
        f fVar = this.L;
        if (fVar == null) {
            return 1.0f;
        }
        return fVar.f1317r;
    }

    public void K0() {
        this.G = true;
    }

    public Object L() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        Object obj = fVar.f1312m;
        return obj == f1264c0 ? y() : obj;
    }

    public void L0(View view, Bundle bundle) {
    }

    public final Resources M() {
        return n1().getResources();
    }

    public void M0(Bundle bundle) {
        this.G = true;
    }

    public Object N() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        Object obj = fVar.f1310k;
        return obj == f1264c0 ? v() : obj;
    }

    void N0(Bundle bundle) {
        this.f1288v.Q0();
        this.f1265a = 3;
        this.G = false;
        g0(bundle);
        if (this.G) {
            q1();
            this.f1288v.x();
        } else {
            throw new n0(c3.d4(719) + this + " did not call through to super.onActivityCreated()");
        }
    }

    public Object O() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        return fVar.f1313n;
    }

    void O0() {
        ArrayList arrayList = this.f1266a0;
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            ((i) obj).a();
        }
        this.f1266a0.clear();
        this.f1288v.m(this.f1287u, g(), this);
        this.f1265a = 0;
        this.G = false;
        j0(this.f1287u.u());
        if (this.G) {
            this.f1286t.H(this);
            this.f1288v.y();
        } else {
            throw new n0("Fragment " + this + " did not call through to super.onAttach()");
        }
    }

    public Object P() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        Object obj = fVar.f1314o;
        return obj == f1264c0 ? O() : obj;
    }

    void P0(Configuration configuration) {
        onConfigurationChanged(configuration);
    }

    ArrayList Q() {
        ArrayList arrayList;
        f fVar = this.L;
        return (fVar == null || (arrayList = fVar.f1307h) == null) ? new ArrayList() : arrayList;
    }

    boolean Q0(MenuItem menuItem) {
        if (this.A) {
            return false;
        }
        if (l0(menuItem)) {
            return true;
        }
        return this.f1288v.A(menuItem);
    }

    ArrayList R() {
        ArrayList arrayList;
        f fVar = this.L;
        return (fVar == null || (arrayList = fVar.f1308i) == null) ? new ArrayList() : arrayList;
    }

    void R0(Bundle bundle) {
        this.f1288v.Q0();
        this.f1265a = 1;
        this.G = false;
        this.T.a(new androidx.lifecycle.i() { // from class: androidx.fragment.app.Fragment.6
            @Override // androidx.lifecycle.i
            public void g(androidx.lifecycle.k kVar, g.b bVar) {
                View view;
                if (bVar != g.b.ON_STOP || (view = Fragment.this.I) == null) {
                    return;
                }
                g.a(view);
            }
        });
        this.X.d(bundle);
        m0(bundle);
        this.Q = true;
        if (this.G) {
            this.T.h(g.b.ON_CREATE);
            return;
        }
        throw new n0("Fragment " + this + " did not call through to super.onCreate()");
    }

    boolean S0(Menu menu, MenuInflater menuInflater) {
        boolean z3 = false;
        if (this.A) {
            return false;
        }
        if (this.E && this.F) {
            p0(menu, menuInflater);
            z3 = true;
        }
        return this.f1288v.C(menu, menuInflater) | z3;
    }

    public View T() {
        return this.I;
    }

    void T0(LayoutInflater layoutInflater, ViewGroup viewGroup, Bundle bundle) {
        this.f1288v.Q0();
        this.f1284r = true;
        this.U = new j0(this, o());
        View q02 = q0(layoutInflater, viewGroup, bundle);
        this.I = q02;
        if (q02 == null) {
            if (this.U.e()) {
                throw new IllegalStateException("Called getViewLifecycleOwner() but onCreateView() returned null");
            }
            this.U = null;
        } else {
            this.U.d();
            androidx.lifecycle.c0.a(this.I, this.U);
            androidx.lifecycle.d0.a(this.I, this.U);
            z.f.a(this.I, this.U);
            this.V.n(this.U);
        }
    }

    public LiveData U() {
        return this.V;
    }

    void U0() {
        this.f1288v.D();
        this.T.h(g.b.ON_DESTROY);
        this.f1265a = 0;
        this.G = false;
        this.Q = false;
        r0();
        if (this.G) {
            return;
        }
        throw new n0("Fragment " + this + " did not call through to super.onDestroy()");
    }

    void V0() {
        this.f1288v.E();
        if (this.I != null && this.U.q().b().a(g.c.CREATED)) {
            this.U.a(g.b.ON_DESTROY);
        }
        this.f1265a = 1;
        this.G = false;
        t0();
        if (this.G) {
            androidx.loader.app.a.b(this).d();
            this.f1284r = false;
        } else {
            throw new n0("Fragment " + this + c3.d4(361));
        }
    }

    void W() {
        V();
        this.R = this.f1272f;
        this.f1272f = UUID.randomUUID().toString();
        this.f1278l = false;
        this.f1279m = false;
        this.f1281o = false;
        this.f1282p = false;
        this.f1283q = false;
        this.f1285s = 0;
        this.f1286t = null;
        this.f1288v = new y();
        this.f1287u = null;
        this.f1290x = 0;
        this.f1291y = 0;
        this.f1292z = null;
        this.A = false;
        this.B = false;
    }

    void W0() {
        this.f1265a = -1;
        this.G = false;
        u0();
        this.P = null;
        if (this.G) {
            if (this.f1288v.F0()) {
                return;
            }
            this.f1288v.D();
            this.f1288v = new y();
            return;
        }
        throw new n0(c3.d4(613) + this + " did not call through to super.onDetach()");
    }

    LayoutInflater X0(Bundle bundle) {
        LayoutInflater v02 = v0(bundle);
        this.P = v02;
        return v02;
    }

    public final boolean Y() {
        return this.f1287u != null && this.f1278l;
    }

    void Y0() {
        onLowMemory();
    }

    public final boolean Z() {
        if (this.A) {
            return true;
        }
        x xVar = this.f1286t;
        return xVar != null && xVar.J0(this.f1289w);
    }

    void Z0(boolean z3) {
        z0(z3);
    }

    final boolean a0() {
        return this.f1285s > 0;
    }

    boolean a1(MenuItem menuItem) {
        if (this.A) {
            return false;
        }
        if (this.E && this.F && A0(menuItem)) {
            return true;
        }
        return this.f1288v.J(menuItem);
    }

    public final boolean b0() {
        if (!this.F) {
            return false;
        }
        x xVar = this.f1286t;
        return xVar == null || xVar.K0(this.f1289w);
    }

    void b1(Menu menu) {
        if (this.A) {
            return;
        }
        if (this.E && this.F) {
            B0(menu);
        }
        this.f1288v.K(menu);
    }

    @Override // z.e
    public final z.c c() {
        return this.X.b();
    }

    boolean c0() {
        f fVar = this.L;
        if (fVar == null) {
            return false;
        }
        return fVar.f1319t;
    }

    void c1() {
        this.f1288v.M();
        if (this.I != null) {
            this.U.a(g.b.ON_PAUSE);
        }
        this.T.h(g.b.ON_PAUSE);
        this.f1265a = 6;
        this.G = false;
        C0();
        if (this.G) {
            return;
        }
        throw new n0("Fragment " + this + " did not call through to super.onPause()");
    }

    public final boolean d0() {
        return this.f1279m;
    }

    void d1(boolean z3) {
        D0(z3);
    }

    public final boolean e0() {
        x xVar = this.f1286t;
        if (xVar == null) {
            return false;
        }
        return xVar.N0();
    }

    boolean e1(Menu menu) {
        boolean z3 = false;
        if (this.A) {
            return false;
        }
        if (this.E && this.F) {
            E0(menu);
            z3 = true;
        }
        return this.f1288v.O(menu) | z3;
    }

    public final boolean equals(Object obj) {
        return super.equals(obj);
    }

    void f(boolean z3) {
        ViewGroup viewGroup;
        x xVar;
        f fVar = this.L;
        if (fVar != null) {
            fVar.f1319t = false;
        }
        if (this.I == null || (viewGroup = this.H) == null || (xVar = this.f1286t) == null) {
            return;
        }
        l0 n3 = l0.n(viewGroup, xVar);
        n3.p();
        if (z3) {
            this.f1287u.v().post(new d(n3));
        } else {
            n3.g();
        }
        Handler handler = this.M;
        if (handler != null) {
            handler.removeCallbacks(this.N);
            this.M = null;
        }
    }

    void f0() {
        this.f1288v.Q0();
    }

    void f1() {
        boolean L0 = this.f1286t.L0(this);
        Boolean bool = this.f1277k;
        if (bool == null || bool.booleanValue() != L0) {
            this.f1277k = Boolean.valueOf(L0);
            F0(L0);
            this.f1288v.P();
        }
    }

    l g() {
        return new e();
    }

    public void g0(Bundle bundle) {
        this.G = true;
    }

    void g1() {
        this.f1288v.Q0();
        this.f1288v.a0(true);
        this.f1265a = 7;
        this.G = false;
        H0();
        if (!this.G) {
            throw new n0("Fragment " + this + " did not call through to super.onResume()");
        }
        androidx.lifecycle.l lVar = this.T;
        g.b bVar = g.b.ON_RESUME;
        lVar.h(bVar);
        if (this.I != null) {
            this.U.a(bVar);
        }
        this.f1288v.Q();
    }

    public void h(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        printWriter.print(str);
        printWriter.print(c3.d4(52));
        printWriter.print(Integer.toHexString(this.f1290x));
        printWriter.print(" mContainerId=#");
        printWriter.print(Integer.toHexString(this.f1291y));
        printWriter.print(" mTag=");
        printWriter.println(this.f1292z);
        printWriter.print(str);
        printWriter.print("mState=");
        printWriter.print(this.f1265a);
        printWriter.print(" mWho=");
        printWriter.print(this.f1272f);
        printWriter.print(" mBackStackNesting=");
        printWriter.println(this.f1285s);
        printWriter.print(str);
        printWriter.print("mAdded=");
        printWriter.print(this.f1278l);
        printWriter.print(" mRemoving=");
        printWriter.print(this.f1279m);
        printWriter.print(" mFromLayout=");
        printWriter.print(this.f1281o);
        printWriter.print(c3.d4(4));
        printWriter.println(this.f1282p);
        printWriter.print(str);
        printWriter.print("mHidden=");
        printWriter.print(this.A);
        printWriter.print(" mDetached=");
        printWriter.print(this.B);
        printWriter.print(" mMenuVisible=");
        printWriter.print(this.F);
        printWriter.print(" mHasMenu=");
        printWriter.println(this.E);
        printWriter.print(str);
        printWriter.print(c3.d4(1481));
        printWriter.print(this.C);
        printWriter.print(c3.d4(1103));
        printWriter.println(this.K);
        if (this.f1286t != null) {
            printWriter.print(str);
            printWriter.print("mFragmentManager=");
            printWriter.println(this.f1286t);
        }
        if (this.f1287u != null) {
            printWriter.print(str);
            printWriter.print("mHost=");
            printWriter.println(this.f1287u);
        }
        if (this.f1289w != null) {
            printWriter.print(str);
            printWriter.print(c3.d4(767));
            printWriter.println(this.f1289w);
        }
        if (this.f1273g != null) {
            printWriter.print(str);
            printWriter.print("mArguments=");
            printWriter.println(this.f1273g);
        }
        if (this.f1267b != null) {
            printWriter.print(str);
            printWriter.print("mSavedFragmentState=");
            printWriter.println(this.f1267b);
        }
        if (this.f1269c != null) {
            printWriter.print(str);
            printWriter.print("mSavedViewState=");
            printWriter.println(this.f1269c);
        }
        if (this.f1270d != null) {
            printWriter.print(str);
            printWriter.print("mSavedViewRegistryState=");
            printWriter.println(this.f1270d);
        }
        Fragment S = S(false);
        if (S != null) {
            printWriter.print(str);
            printWriter.print(c3.d4(505));
            printWriter.print(S);
            printWriter.print(" mTargetRequestCode=");
            printWriter.println(this.f1276j);
        }
        printWriter.print(str);
        printWriter.print("mPopDirection=");
        printWriter.println(H());
        if (u() != 0) {
            printWriter.print(str);
            printWriter.print("getEnterAnim=");
            printWriter.println(u());
        }
        if (x() != 0) {
            printWriter.print(str);
            printWriter.print("getExitAnim=");
            printWriter.println(x());
        }
        if (I() != 0) {
            printWriter.print(str);
            printWriter.print("getPopEnterAnim=");
            printWriter.println(I());
        }
        if (J() != 0) {
            printWriter.print(str);
            printWriter.print("getPopExitAnim=");
            printWriter.println(J());
        }
        if (this.H != null) {
            printWriter.print(str);
            printWriter.print("mContainer=");
            printWriter.println(this.H);
        }
        if (this.I != null) {
            printWriter.print(str);
            printWriter.print(c3.d4(667));
            printWriter.println(this.I);
        }
        if (p() != null) {
            printWriter.print(str);
            printWriter.print(c3.d4(5));
            printWriter.println(p());
        }
        if (t() != null) {
            androidx.loader.app.a.b(this).a(str, fileDescriptor, printWriter, strArr);
        }
        printWriter.print(str);
        printWriter.println("Child " + this.f1288v + ":");
        this.f1288v.W(str + "  ", fileDescriptor, printWriter, strArr);
    }

    public void h0(int i4, int i5, Intent intent) {
        if (x.G0(2)) {
            Log.v("FragmentManager", "Fragment " + this + " received the following in onActivityResult(): requestCode: " + i4 + " resultCode: " + i5 + " data: " + intent);
        }
    }

    void h1(Bundle bundle) {
        I0(bundle);
        this.X.e(bundle);
        Bundle d12 = this.f1288v.d1();
        if (d12 != null) {
            bundle.putParcelable("android:support:fragments", d12);
        }
    }

    public final int hashCode() {
        return super.hashCode();
    }

    public void i0(Activity activity) {
        this.G = true;
    }

    void i1() {
        this.f1288v.Q0();
        this.f1288v.a0(true);
        this.f1265a = 5;
        this.G = false;
        J0();
        if (!this.G) {
            throw new n0("Fragment " + this + " did not call through to super.onStart()");
        }
        androidx.lifecycle.l lVar = this.T;
        g.b bVar = g.b.ON_START;
        lVar.h(bVar);
        if (this.I != null) {
            this.U.a(bVar);
        }
        this.f1288v.R();
    }

    @Override // androidx.lifecycle.f
    public x.a j() {
        Application application;
        Context applicationContext = n1().getApplicationContext();
        while (true) {
            if (!(applicationContext instanceof ContextWrapper)) {
                application = null;
                break;
            }
            if (applicationContext instanceof Application) {
                application = (Application) applicationContext;
                break;
            }
            applicationContext = ((ContextWrapper) applicationContext).getBaseContext();
        }
        if (application == null && x.G0(3)) {
            Log.d(c3.d4(768), "Could not find Application instance from Context " + n1().getApplicationContext() + ", you will not be able to use AndroidViewModel with the default ViewModelProvider.Factory");
        }
        x.d dVar = new x.d();
        if (application != null) {
            dVar.b(y.a.f1710e, application);
        }
        dVar.b(androidx.lifecycle.u.f1693a, this);
        dVar.b(androidx.lifecycle.u.f1694b, this);
        if (r() != null) {
            dVar.b(androidx.lifecycle.u.f1695c, r());
        }
        return dVar;
    }

    public void j0(Context context) {
        this.G = true;
        p pVar = this.f1287u;
        Activity t3 = pVar == null ? null : pVar.t();
        if (t3 != null) {
            this.G = false;
            i0(t3);
        }
    }

    void j1() {
        this.f1288v.T();
        if (this.I != null) {
            this.U.a(g.b.ON_STOP);
        }
        this.T.h(g.b.ON_STOP);
        this.f1265a = 4;
        this.G = false;
        K0();
        if (this.G) {
            return;
        }
        throw new n0(c3.d4(1022) + this + " did not call through to super.onStop()");
    }

    Fragment k(String str) {
        return str.equals(this.f1272f) ? this : this.f1288v.i0(str);
    }

    public void k0(Fragment fragment) {
    }

    void k1() {
        L0(this.I, this.f1267b);
        this.f1288v.U();
    }

    public final j l() {
        p pVar = this.f1287u;
        if (pVar == null) {
            return null;
        }
        return (j) pVar.t();
    }

    public boolean l0(MenuItem menuItem) {
        return false;
    }

    public boolean m() {
        Boolean bool;
        f fVar = this.L;
        if (fVar == null || (bool = fVar.f1316q) == null) {
            return true;
        }
        return bool.booleanValue();
    }

    public void m0(Bundle bundle) {
        this.G = true;
        p1(bundle);
        if (this.f1288v.M0(1)) {
            return;
        }
        this.f1288v.B();
    }

    public final j m1() {
        j l3 = l();
        if (l3 != null) {
            return l3;
        }
        throw new IllegalStateException("Fragment " + this + c3.d4(873));
    }

    public boolean n() {
        Boolean bool;
        f fVar = this.L;
        if (fVar == null || (bool = fVar.f1315p) == null) {
            return true;
        }
        return bool.booleanValue();
    }

    public Animation n0(int i4, boolean z3, int i5) {
        return null;
    }

    public final Context n1() {
        Context t3 = t();
        if (t3 != null) {
            return t3;
        }
        throw new IllegalStateException("Fragment " + this + " not attached to a context.");
    }

    @Override // androidx.lifecycle.b0
    public androidx.lifecycle.a0 o() {
        if (this.f1286t == null) {
            throw new IllegalStateException("Can't access ViewModels from detached fragment");
        }
        if (D() != g.c.INITIALIZED.ordinal()) {
            return this.f1286t.B0(this);
        }
        throw new IllegalStateException("Calling getViewModelStore() before a Fragment reaches onCreate() when using setMaxLifecycle(INITIALIZED) is not supported");
    }

    public Animator o0(int i4, boolean z3, int i5) {
        return null;
    }

    public final View o1() {
        View T = T();
        if (T != null) {
            return T;
        }
        throw new IllegalStateException("Fragment " + this + " did not return a View from onCreateView() or this was called before onCreateView().");
    }

    @Override // android.content.ComponentCallbacks
    public void onConfigurationChanged(Configuration configuration) {
        this.G = true;
    }

    @Override // android.view.View.OnCreateContextMenuListener
    public void onCreateContextMenu(ContextMenu contextMenu, View view, ContextMenu.ContextMenuInfo contextMenuInfo) {
        m1().onCreateContextMenu(contextMenu, view, contextMenuInfo);
    }

    @Override // android.content.ComponentCallbacks
    public void onLowMemory() {
        this.G = true;
    }

    View p() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        return fVar.f1300a;
    }

    public void p0(Menu menu, MenuInflater menuInflater) {
    }

    void p1(Bundle bundle) {
        Parcelable parcelable;
        if (bundle == null || (parcelable = bundle.getParcelable(c3.d4(1104))) == null) {
            return;
        }
        this.f1288v.b1(parcelable);
        this.f1288v.B();
    }

    @Override // androidx.lifecycle.k
    public androidx.lifecycle.g q() {
        return this.T;
    }

    public View q0(LayoutInflater layoutInflater, ViewGroup viewGroup, Bundle bundle) {
        int i4 = this.Y;
        if (i4 != 0) {
            return layoutInflater.inflate(i4, viewGroup, false);
        }
        return null;
    }

    public final Bundle r() {
        return this.f1273g;
    }

    public void r0() {
        this.G = true;
    }

    final void r1(Bundle bundle) {
        SparseArray<Parcelable> sparseArray = this.f1269c;
        if (sparseArray != null) {
            this.I.restoreHierarchyState(sparseArray);
            this.f1269c = null;
        }
        if (this.I != null) {
            this.U.f(this.f1270d);
            this.f1270d = null;
        }
        this.G = false;
        M0(bundle);
        if (this.G) {
            if (this.I != null) {
                this.U.a(g.b.ON_CREATE);
            }
        } else {
            throw new n0("Fragment " + this + c3.d4(187));
        }
    }

    public final x s() {
        if (this.f1287u != null) {
            return this.f1288v;
        }
        throw new IllegalStateException("Fragment " + this + c3.d4(1307));
    }

    public void s0() {
    }

    void s1(int i4, int i5, int i6, int i7) {
        if (this.L == null && i4 == 0 && i5 == 0 && i6 == 0 && i7 == 0) {
            return;
        }
        i().f1302c = i4;
        i().f1303d = i5;
        i().f1304e = i6;
        i().f1305f = i7;
    }

    public void startActivityForResult(Intent intent, int i4) {
        z1(intent, i4, null);
    }

    public Context t() {
        p pVar = this.f1287u;
        if (pVar == null) {
            return null;
        }
        return pVar.u();
    }

    public void t0() {
        this.G = true;
    }

    public void t1(Bundle bundle) {
        if (this.f1286t != null && e0()) {
            throw new IllegalStateException("Fragment already added and state has been saved");
        }
        this.f1273g = bundle;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(128);
        sb.append(getClass().getSimpleName());
        sb.append("{");
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        sb.append("}");
        sb.append(" (");
        sb.append(this.f1272f);
        if (this.f1290x != 0) {
            sb.append(" id=0x");
            sb.append(Integer.toHexString(this.f1290x));
        }
        if (this.f1292z != null) {
            sb.append(" tag=");
            sb.append(this.f1292z);
        }
        sb.append(")");
        return sb.toString();
    }

    int u() {
        f fVar = this.L;
        if (fVar == null) {
            return 0;
        }
        return fVar.f1302c;
    }

    public void u0() {
        this.G = true;
    }

    void u1(View view) {
        i().f1318s = view;
    }

    public Object v() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        return fVar.f1309j;
    }

    public LayoutInflater v0(Bundle bundle) {
        return C(bundle);
    }

    void v1(int i4) {
        if (this.L == null && i4 == 0) {
            return;
        }
        i();
        this.L.f1306g = i4;
    }

    androidx.core.app.b0 w() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        fVar.getClass();
        return null;
    }

    public void w0(boolean z3) {
    }

    void w1(boolean z3) {
        if (this.L == null) {
            return;
        }
        i().f1301b = z3;
    }

    int x() {
        f fVar = this.L;
        if (fVar == null) {
            return 0;
        }
        return fVar.f1303d;
    }

    public void x0(Activity activity, AttributeSet attributeSet, Bundle bundle) {
        this.G = true;
    }

    void x1(float f4) {
        i().f1317r = f4;
    }

    public Object y() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        return fVar.f1311l;
    }

    public void y0(Context context, AttributeSet attributeSet, Bundle bundle) {
        this.G = true;
        p pVar = this.f1287u;
        Activity t3 = pVar == null ? null : pVar.t();
        if (t3 != null) {
            this.G = false;
            x0(t3, attributeSet, bundle);
        }
    }

    void y1(ArrayList arrayList, ArrayList arrayList2) {
        i();
        f fVar = this.L;
        fVar.f1307h = arrayList;
        fVar.f1308i = arrayList2;
    }

    androidx.core.app.b0 z() {
        f fVar = this.L;
        if (fVar == null) {
            return null;
        }
        fVar.getClass();
        return null;
    }

    public void z0(boolean z3) {
    }

    public void z1(Intent intent, int i4, Bundle bundle) {
        if (this.f1287u != null) {
            G().O0(this, intent, i4, bundle);
            return;
        }
        throw new IllegalStateException("Fragment " + this + " not attached to Activity");
    }
}
