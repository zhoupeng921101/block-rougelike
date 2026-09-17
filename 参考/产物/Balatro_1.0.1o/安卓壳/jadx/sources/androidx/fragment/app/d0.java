package androidx.fragment.app;

import a1.b2.c3;
import android.app.Activity;
import android.content.res.Resources;
import android.os.Bundle;
import android.os.Parcelable;
import android.util.Log;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import androidx.fragment.app.l0;
import androidx.lifecycle.g;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class d0 {

    /* renamed from: a, reason: collision with root package name */
    private final r f1410a;

    /* renamed from: b, reason: collision with root package name */
    private final e0 f1411b;

    /* renamed from: c, reason: collision with root package name */
    private final Fragment f1412c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f1413d = false;

    /* renamed from: e, reason: collision with root package name */
    private int f1414e = -1;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements View.OnAttachStateChangeListener {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ View f1415a;

        a(View view) {
            this.f1415a = view;
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewAttachedToWindow(View view) {
            this.f1415a.removeOnAttachStateChangeListener(this);
            androidx.core.view.v.E(this.f1415a);
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewDetachedFromWindow(View view) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class b {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f1417a;

        static {
            int[] iArr = new int[g.c.values().length];
            f1417a = iArr;
            try {
                iArr[g.c.RESUMED.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f1417a[g.c.STARTED.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f1417a[g.c.CREATED.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                f1417a[g.c.INITIALIZED.ordinal()] = 4;
            } catch (NoSuchFieldError unused4) {
            }
        }
    }

    d0(r rVar, e0 e0Var, Fragment fragment) {
        this.f1410a = rVar;
        this.f1411b = e0Var;
        this.f1412c = fragment;
    }

    d0(r rVar, e0 e0Var, Fragment fragment, c0 c0Var) {
        this.f1410a = rVar;
        this.f1411b = e0Var;
        this.f1412c = fragment;
        fragment.f1269c = null;
        fragment.f1270d = null;
        fragment.f1285s = 0;
        fragment.f1282p = false;
        fragment.f1278l = false;
        Fragment fragment2 = fragment.f1274h;
        fragment.f1275i = fragment2 != null ? fragment2.f1272f : null;
        fragment.f1274h = null;
        Bundle bundle = c0Var.f1363q;
        if (bundle != null) {
            fragment.f1267b = bundle;
        } else {
            fragment.f1267b = new Bundle();
        }
    }

    d0(r rVar, e0 e0Var, ClassLoader classLoader, o oVar, c0 c0Var) {
        this.f1410a = rVar;
        this.f1411b = e0Var;
        Fragment o3 = c0Var.o(oVar, classLoader);
        this.f1412c = o3;
        if (x.G0(2)) {
            Log.v("FragmentManager", "Instantiated fragment " + o3);
        }
    }

    private boolean l(View view) {
        if (view == this.f1412c.I) {
            return true;
        }
        for (ViewParent parent = view.getParent(); parent != null; parent = parent.getParent()) {
            if (parent == this.f1412c.I) {
                return true;
            }
        }
        return false;
    }

    private Bundle q() {
        Bundle bundle = new Bundle();
        this.f1412c.h1(bundle);
        this.f1410a.j(this.f1412c, bundle, false);
        if (bundle.isEmpty()) {
            bundle = null;
        }
        if (this.f1412c.I != null) {
            s();
        }
        if (this.f1412c.f1269c != null) {
            if (bundle == null) {
                bundle = new Bundle();
            }
            bundle.putSparseParcelableArray(c3.d4(507), this.f1412c.f1269c);
        }
        if (this.f1412c.f1270d != null) {
            if (bundle == null) {
                bundle = new Bundle();
            }
            bundle.putBundle("android:view_registry_state", this.f1412c.f1270d);
        }
        if (!this.f1412c.K) {
            if (bundle == null) {
                bundle = new Bundle();
            }
            bundle.putBoolean(c3.d4(53), this.f1412c.K);
        }
        return bundle;
    }

    void a() {
        if (x.G0(3)) {
            Log.d("FragmentManager", "moveto ACTIVITY_CREATED: " + this.f1412c);
        }
        Fragment fragment = this.f1412c;
        fragment.N0(fragment.f1267b);
        r rVar = this.f1410a;
        Fragment fragment2 = this.f1412c;
        rVar.a(fragment2, fragment2.f1267b, false);
    }

    void b() {
        int j4 = this.f1411b.j(this.f1412c);
        Fragment fragment = this.f1412c;
        fragment.H.addView(fragment.I, j4);
    }

    void c() {
        if (x.G0(3)) {
            Log.d("FragmentManager", c3.d4(231) + this.f1412c);
        }
        Fragment fragment = this.f1412c;
        Fragment fragment2 = fragment.f1274h;
        d0 d0Var = null;
        if (fragment2 != null) {
            d0 n3 = this.f1411b.n(fragment2.f1272f);
            if (n3 == null) {
                throw new IllegalStateException("Fragment " + this.f1412c + " declared target fragment " + this.f1412c.f1274h + " that does not belong to this FragmentManager!");
            }
            Fragment fragment3 = this.f1412c;
            fragment3.f1275i = fragment3.f1274h.f1272f;
            fragment3.f1274h = null;
            d0Var = n3;
        } else {
            String str = fragment.f1275i;
            if (str != null && (d0Var = this.f1411b.n(str)) == null) {
                throw new IllegalStateException("Fragment " + this.f1412c + " declared target fragment " + this.f1412c.f1275i + " that does not belong to this FragmentManager!");
            }
        }
        if (d0Var != null) {
            d0Var.m();
        }
        Fragment fragment4 = this.f1412c;
        fragment4.f1287u = fragment4.f1286t.t0();
        Fragment fragment5 = this.f1412c;
        fragment5.f1289w = fragment5.f1286t.w0();
        this.f1410a.g(this.f1412c, false);
        this.f1412c.O0();
        this.f1410a.b(this.f1412c, false);
    }

    int d() {
        Fragment fragment = this.f1412c;
        if (fragment.f1286t == null) {
            return fragment.f1265a;
        }
        int i4 = this.f1414e;
        int i5 = b.f1417a[fragment.S.ordinal()];
        if (i5 != 1) {
            i4 = i5 != 2 ? i5 != 3 ? i5 != 4 ? Math.min(i4, -1) : Math.min(i4, 0) : Math.min(i4, 1) : Math.min(i4, 5);
        }
        Fragment fragment2 = this.f1412c;
        if (fragment2.f1281o) {
            if (fragment2.f1282p) {
                i4 = Math.max(this.f1414e, 2);
                View view = this.f1412c.I;
                if (view != null && view.getParent() == null) {
                    i4 = Math.min(i4, 2);
                }
            } else {
                i4 = this.f1414e < 4 ? Math.min(i4, fragment2.f1265a) : Math.min(i4, 1);
            }
        }
        if (!this.f1412c.f1278l) {
            i4 = Math.min(i4, 1);
        }
        Fragment fragment3 = this.f1412c;
        ViewGroup viewGroup = fragment3.H;
        l0.e.b l3 = viewGroup != null ? l0.n(viewGroup, fragment3.G()).l(this) : null;
        if (l3 == l0.e.b.ADDING) {
            i4 = Math.min(i4, 6);
        } else if (l3 == l0.e.b.f1541g) {
            i4 = Math.max(i4, 3);
        } else {
            Fragment fragment4 = this.f1412c;
            if (fragment4.f1279m) {
                i4 = fragment4.a0() ? Math.min(i4, 1) : Math.min(i4, -1);
            }
        }
        Fragment fragment5 = this.f1412c;
        if (fragment5.J && fragment5.f1265a < 5) {
            i4 = Math.min(i4, 4);
        }
        if (x.G0(2)) {
            Log.v("FragmentManager", "computeExpectedState() of " + i4 + " for " + this.f1412c);
        }
        return i4;
    }

    void e() {
        if (x.G0(3)) {
            Log.d("FragmentManager", "moveto CREATED: " + this.f1412c);
        }
        Fragment fragment = this.f1412c;
        if (fragment.Q) {
            fragment.p1(fragment.f1267b);
            this.f1412c.f1265a = 1;
            return;
        }
        this.f1410a.h(fragment, fragment.f1267b, false);
        Fragment fragment2 = this.f1412c;
        fragment2.R0(fragment2.f1267b);
        r rVar = this.f1410a;
        Fragment fragment3 = this.f1412c;
        rVar.c(fragment3, fragment3.f1267b, false);
    }

    void f() {
        String str;
        if (this.f1412c.f1281o) {
            return;
        }
        if (x.G0(3)) {
            Log.d("FragmentManager", "moveto CREATE_VIEW: " + this.f1412c);
        }
        Fragment fragment = this.f1412c;
        LayoutInflater X0 = fragment.X0(fragment.f1267b);
        Fragment fragment2 = this.f1412c;
        ViewGroup viewGroup = fragment2.H;
        if (viewGroup == null) {
            int i4 = fragment2.f1291y;
            if (i4 == 0) {
                viewGroup = null;
            } else {
                if (i4 == -1) {
                    throw new IllegalArgumentException("Cannot create fragment " + this.f1412c + c3.d4(769));
                }
                viewGroup = (ViewGroup) fragment2.f1286t.p0().j(this.f1412c.f1291y);
                if (viewGroup == null) {
                    Fragment fragment3 = this.f1412c;
                    if (!fragment3.f1283q) {
                        try {
                            str = fragment3.M().getResourceName(this.f1412c.f1291y);
                        } catch (Resources.NotFoundException unused) {
                            str = "unknown";
                        }
                        throw new IllegalArgumentException("No view found for id 0x" + Integer.toHexString(this.f1412c.f1291y) + " (" + str + ") for fragment " + this.f1412c);
                    }
                } else if (!(viewGroup instanceof m)) {
                    v.c.i(this.f1412c, viewGroup);
                }
            }
        }
        Fragment fragment4 = this.f1412c;
        fragment4.H = viewGroup;
        fragment4.T0(X0, viewGroup, fragment4.f1267b);
        View view = this.f1412c.I;
        if (view != null) {
            view.setSaveFromParentEnabled(false);
            Fragment fragment5 = this.f1412c;
            fragment5.I.setTag(u.b.f5007a, fragment5);
            if (viewGroup != null) {
                b();
            }
            Fragment fragment6 = this.f1412c;
            if (fragment6.A) {
                fragment6.I.setVisibility(8);
            }
            if (androidx.core.view.v.v(this.f1412c.I)) {
                androidx.core.view.v.E(this.f1412c.I);
            } else {
                View view2 = this.f1412c.I;
                view2.addOnAttachStateChangeListener(new a(view2));
            }
            this.f1412c.k1();
            r rVar = this.f1410a;
            Fragment fragment7 = this.f1412c;
            rVar.m(fragment7, fragment7.I, fragment7.f1267b, false);
            int visibility = this.f1412c.I.getVisibility();
            this.f1412c.x1(this.f1412c.I.getAlpha());
            Fragment fragment8 = this.f1412c;
            if (fragment8.H != null && visibility == 0) {
                View findFocus = fragment8.I.findFocus();
                if (findFocus != null) {
                    this.f1412c.u1(findFocus);
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "requestFocus: Saved focused view " + findFocus + " for Fragment " + this.f1412c);
                    }
                }
                this.f1412c.I.setAlpha(0.0f);
            }
        }
        this.f1412c.f1265a = 2;
    }

    void g() {
        Fragment f4;
        if (x.G0(3)) {
            Log.d("FragmentManager", c3.d4(362) + this.f1412c);
        }
        Fragment fragment = this.f1412c;
        boolean z3 = true;
        boolean z4 = fragment.f1279m && !fragment.a0();
        if (z4) {
            Fragment fragment2 = this.f1412c;
            if (!fragment2.f1280n) {
                this.f1411b.B(fragment2.f1272f, null);
            }
        }
        if (!z4 && !this.f1411b.p().q(this.f1412c)) {
            String str = this.f1412c.f1275i;
            if (str != null && (f4 = this.f1411b.f(str)) != null && f4.C) {
                this.f1412c.f1274h = f4;
            }
            this.f1412c.f1265a = 0;
            return;
        }
        p pVar = this.f1412c.f1287u;
        if (pVar instanceof androidx.lifecycle.b0) {
            z3 = this.f1411b.p().n();
        } else if (pVar.u() instanceof Activity) {
            z3 = true ^ ((Activity) pVar.u()).isChangingConfigurations();
        }
        if ((z4 && !this.f1412c.f1280n) || z3) {
            this.f1411b.p().f(this.f1412c);
        }
        this.f1412c.U0();
        this.f1410a.d(this.f1412c, false);
        for (d0 d0Var : this.f1411b.k()) {
            if (d0Var != null) {
                Fragment k4 = d0Var.k();
                if (this.f1412c.f1272f.equals(k4.f1275i)) {
                    k4.f1274h = this.f1412c;
                    k4.f1275i = null;
                }
            }
        }
        Fragment fragment3 = this.f1412c;
        String str2 = fragment3.f1275i;
        if (str2 != null) {
            fragment3.f1274h = this.f1411b.f(str2);
        }
        this.f1411b.s(this);
    }

    void h() {
        View view;
        if (x.G0(3)) {
            Log.d(c3.d4(614), "movefrom CREATE_VIEW: " + this.f1412c);
        }
        Fragment fragment = this.f1412c;
        ViewGroup viewGroup = fragment.H;
        if (viewGroup != null && (view = fragment.I) != null) {
            viewGroup.removeView(view);
        }
        this.f1412c.V0();
        this.f1410a.n(this.f1412c, false);
        Fragment fragment2 = this.f1412c;
        fragment2.H = null;
        fragment2.I = null;
        fragment2.U = null;
        fragment2.V.n(null);
        this.f1412c.f1282p = false;
    }

    void i() {
        if (x.G0(3)) {
            Log.d("FragmentManager", c3.d4(326) + this.f1412c);
        }
        this.f1412c.W0();
        this.f1410a.e(this.f1412c, false);
        Fragment fragment = this.f1412c;
        fragment.f1265a = -1;
        fragment.f1287u = null;
        fragment.f1289w = null;
        fragment.f1286t = null;
        if ((!fragment.f1279m || fragment.a0()) && !this.f1411b.p().q(this.f1412c)) {
            return;
        }
        if (x.G0(3)) {
            Log.d("FragmentManager", "initState called for fragment: " + this.f1412c);
        }
        this.f1412c.W();
    }

    void j() {
        Fragment fragment = this.f1412c;
        if (fragment.f1281o && fragment.f1282p && !fragment.f1284r) {
            if (x.G0(3)) {
                Log.d("FragmentManager", "moveto CREATE_VIEW: " + this.f1412c);
            }
            Fragment fragment2 = this.f1412c;
            fragment2.T0(fragment2.X0(fragment2.f1267b), null, this.f1412c.f1267b);
            View view = this.f1412c.I;
            if (view != null) {
                view.setSaveFromParentEnabled(false);
                Fragment fragment3 = this.f1412c;
                fragment3.I.setTag(u.b.f5007a, fragment3);
                Fragment fragment4 = this.f1412c;
                if (fragment4.A) {
                    fragment4.I.setVisibility(8);
                }
                this.f1412c.k1();
                r rVar = this.f1410a;
                Fragment fragment5 = this.f1412c;
                rVar.m(fragment5, fragment5.I, fragment5.f1267b, false);
                this.f1412c.f1265a = 2;
            }
        }
    }

    Fragment k() {
        return this.f1412c;
    }

    void m() {
        ViewGroup viewGroup;
        ViewGroup viewGroup2;
        ViewGroup viewGroup3;
        if (this.f1413d) {
            if (x.G0(2)) {
                Log.v("FragmentManager", c3.d4(668) + k());
                return;
            }
            return;
        }
        try {
            this.f1413d = true;
            boolean z3 = false;
            while (true) {
                int d4 = d();
                Fragment fragment = this.f1412c;
                int i4 = fragment.f1265a;
                if (d4 == i4) {
                    if (!z3 && i4 == -1 && fragment.f1279m && !fragment.a0() && !this.f1412c.f1280n) {
                        if (x.G0(3)) {
                            Log.d("FragmentManager", "Cleaning up state of never attached fragment: " + this.f1412c);
                        }
                        this.f1411b.p().f(this.f1412c);
                        this.f1411b.s(this);
                        if (x.G0(3)) {
                            Log.d("FragmentManager", "initState called for fragment: " + this.f1412c);
                        }
                        this.f1412c.W();
                    }
                    Fragment fragment2 = this.f1412c;
                    if (fragment2.O) {
                        if (fragment2.I != null && (viewGroup = fragment2.H) != null) {
                            l0 n3 = l0.n(viewGroup, fragment2.G());
                            if (this.f1412c.A) {
                                n3.c(this);
                            } else {
                                n3.e(this);
                            }
                        }
                        Fragment fragment3 = this.f1412c;
                        x xVar = fragment3.f1286t;
                        if (xVar != null) {
                            xVar.E0(fragment3);
                        }
                        Fragment fragment4 = this.f1412c;
                        fragment4.O = false;
                        fragment4.w0(fragment4.A);
                        this.f1412c.f1288v.I();
                    }
                    this.f1413d = false;
                    return;
                }
                if (d4 <= i4) {
                    switch (i4 - 1) {
                        case -1:
                            i();
                            break;
                        case 0:
                            if (fragment.f1280n && this.f1411b.q(fragment.f1272f) == null) {
                                r();
                            }
                            g();
                            break;
                        case BuildConfig.VERSION_CODE /* 1 */:
                            h();
                            this.f1412c.f1265a = 1;
                            break;
                        case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                            fragment.f1282p = false;
                            fragment.f1265a = 2;
                            break;
                        case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                            if (x.G0(3)) {
                                Log.d("FragmentManager", "movefrom ACTIVITY_CREATED: " + this.f1412c);
                            }
                            Fragment fragment5 = this.f1412c;
                            if (fragment5.f1280n) {
                                r();
                            } else if (fragment5.I != null && fragment5.f1269c == null) {
                                s();
                            }
                            Fragment fragment6 = this.f1412c;
                            if (fragment6.I != null && (viewGroup2 = fragment6.H) != null) {
                                l0.n(viewGroup2, fragment6.G()).d(this);
                            }
                            this.f1412c.f1265a = 3;
                            break;
                        case 4:
                            v();
                            break;
                        case 5:
                            fragment.f1265a = 5;
                            break;
                        case 6:
                            n();
                            break;
                    }
                } else {
                    switch (i4 + 1) {
                        case 0:
                            c();
                            break;
                        case BuildConfig.VERSION_CODE /* 1 */:
                            e();
                            break;
                        case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                            j();
                            f();
                            break;
                        case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                            a();
                            break;
                        case 4:
                            if (fragment.I != null && (viewGroup3 = fragment.H) != null) {
                                l0.n(viewGroup3, fragment.G()).b(l0.e.c.b(this.f1412c.I.getVisibility()), this);
                            }
                            this.f1412c.f1265a = 4;
                            break;
                        case 5:
                            u();
                            break;
                        case 6:
                            fragment.f1265a = 6;
                            break;
                        case 7:
                            p();
                            break;
                    }
                }
                z3 = true;
            }
        } catch (Throwable th) {
            this.f1413d = false;
            throw th;
        }
    }

    void n() {
        if (x.G0(3)) {
            Log.d(c3.d4(1401), c3.d4(6) + this.f1412c);
        }
        this.f1412c.c1();
        this.f1410a.f(this.f1412c, false);
    }

    void o(ClassLoader classLoader) {
        Bundle bundle = this.f1412c.f1267b;
        if (bundle == null) {
            return;
        }
        bundle.setClassLoader(classLoader);
        Fragment fragment = this.f1412c;
        fragment.f1269c = fragment.f1267b.getSparseParcelableArray("android:view_state");
        Fragment fragment2 = this.f1412c;
        fragment2.f1270d = fragment2.f1267b.getBundle("android:view_registry_state");
        Fragment fragment3 = this.f1412c;
        fragment3.f1275i = fragment3.f1267b.getString("android:target_state");
        Fragment fragment4 = this.f1412c;
        if (fragment4.f1275i != null) {
            fragment4.f1276j = fragment4.f1267b.getInt("android:target_req_state", 0);
        }
        Fragment fragment5 = this.f1412c;
        Boolean bool = fragment5.f1271e;
        if (bool != null) {
            fragment5.K = bool.booleanValue();
            this.f1412c.f1271e = null;
        } else {
            fragment5.K = fragment5.f1267b.getBoolean("android:user_visible_hint", true);
        }
        Fragment fragment6 = this.f1412c;
        if (fragment6.K) {
            return;
        }
        fragment6.J = true;
    }

    void p() {
        if (x.G0(3)) {
            Log.d("FragmentManager", "moveto RESUMED: " + this.f1412c);
        }
        View A = this.f1412c.A();
        if (A != null && l(A)) {
            boolean requestFocus = A.requestFocus();
            if (x.G0(2)) {
                StringBuilder sb = new StringBuilder();
                sb.append("requestFocus: Restoring focused view ");
                sb.append(A);
                sb.append(" ");
                sb.append(requestFocus ? "succeeded" : "failed");
                sb.append(" on Fragment ");
                sb.append(this.f1412c);
                sb.append(c3.d4(54));
                sb.append(this.f1412c.I.findFocus());
                Log.v("FragmentManager", sb.toString());
            }
        }
        this.f1412c.u1(null);
        this.f1412c.g1();
        this.f1410a.i(this.f1412c, false);
        Fragment fragment = this.f1412c;
        fragment.f1267b = null;
        fragment.f1269c = null;
        fragment.f1270d = null;
    }

    void r() {
        c0 c0Var = new c0(this.f1412c);
        Fragment fragment = this.f1412c;
        if (fragment.f1265a <= -1 || c0Var.f1363q != null) {
            c0Var.f1363q = fragment.f1267b;
        } else {
            Bundle q3 = q();
            c0Var.f1363q = q3;
            if (this.f1412c.f1275i != null) {
                if (q3 == null) {
                    c0Var.f1363q = new Bundle();
                }
                c0Var.f1363q.putString(c3.d4(1402), this.f1412c.f1275i);
                int i4 = this.f1412c.f1276j;
                if (i4 != 0) {
                    c0Var.f1363q.putInt("android:target_req_state", i4);
                }
            }
        }
        this.f1411b.B(this.f1412c.f1272f, c0Var);
    }

    void s() {
        if (this.f1412c.I == null) {
            return;
        }
        if (x.G0(2)) {
            Log.v("FragmentManager", "Saving view state for fragment " + this.f1412c + " with view " + this.f1412c.I);
        }
        SparseArray<Parcelable> sparseArray = new SparseArray<>();
        this.f1412c.I.saveHierarchyState(sparseArray);
        if (sparseArray.size() > 0) {
            this.f1412c.f1269c = sparseArray;
        }
        Bundle bundle = new Bundle();
        this.f1412c.U.g(bundle);
        if (bundle.isEmpty()) {
            return;
        }
        this.f1412c.f1270d = bundle;
    }

    void t(int i4) {
        this.f1414e = i4;
    }

    void u() {
        if (x.G0(3)) {
            Log.d("FragmentManager", c3.d4(1211) + this.f1412c);
        }
        this.f1412c.i1();
        this.f1410a.k(this.f1412c, false);
    }

    void v() {
        if (x.G0(3)) {
            Log.d("FragmentManager", c3.d4(279) + this.f1412c);
        }
        this.f1412c.j1();
        this.f1410a.l(this.f1412c, false);
    }
}
