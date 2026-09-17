package androidx.fragment.app;

import a1.b2.c3;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class e extends Fragment implements DialogInterface.OnCancelListener, DialogInterface.OnDismissListener {

    /* renamed from: d0, reason: collision with root package name */
    private Handler f1418d0;

    /* renamed from: m0, reason: collision with root package name */
    private boolean f1427m0;

    /* renamed from: o0, reason: collision with root package name */
    private Dialog f1429o0;

    /* renamed from: p0, reason: collision with root package name */
    private boolean f1430p0;

    /* renamed from: q0, reason: collision with root package name */
    private boolean f1431q0;

    /* renamed from: r0, reason: collision with root package name */
    private boolean f1432r0;

    /* renamed from: e0, reason: collision with root package name */
    private Runnable f1419e0 = new a();

    /* renamed from: f0, reason: collision with root package name */
    private DialogInterface.OnCancelListener f1420f0 = new b();

    /* renamed from: g0, reason: collision with root package name */
    private DialogInterface.OnDismissListener f1421g0 = new c();

    /* renamed from: h0, reason: collision with root package name */
    private int f1422h0 = 0;

    /* renamed from: i0, reason: collision with root package name */
    private int f1423i0 = 0;

    /* renamed from: j0, reason: collision with root package name */
    private boolean f1424j0 = true;

    /* renamed from: k0, reason: collision with root package name */
    private boolean f1425k0 = true;

    /* renamed from: l0, reason: collision with root package name */
    private int f1426l0 = -1;

    /* renamed from: n0, reason: collision with root package name */
    private androidx.lifecycle.p f1428n0 = new d();

    /* renamed from: s0, reason: collision with root package name */
    private boolean f1433s0 = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            e.this.f1421g0.onDismiss(e.this.f1429o0);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements DialogInterface.OnCancelListener {
        b() {
        }

        @Override // android.content.DialogInterface.OnCancelListener
        public void onCancel(DialogInterface dialogInterface) {
            if (e.this.f1429o0 != null) {
                e eVar = e.this;
                eVar.onCancel(eVar.f1429o0);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements DialogInterface.OnDismissListener {
        c() {
        }

        @Override // android.content.DialogInterface.OnDismissListener
        public void onDismiss(DialogInterface dialogInterface) {
            if (e.this.f1429o0 != null) {
                e eVar = e.this;
                eVar.onDismiss(eVar.f1429o0);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements androidx.lifecycle.p {
        d() {
        }

        @Override // androidx.lifecycle.p
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public void a(androidx.lifecycle.k kVar) {
            if (kVar == null || !e.this.f1425k0) {
                return;
            }
            View o12 = e.this.o1();
            if (o12.getParent() != null) {
                throw new IllegalStateException("DialogFragment can not be attached to a container view");
            }
            if (e.this.f1429o0 != null) {
                if (x.G0(3)) {
                    Log.d("FragmentManager", "DialogFragment " + this + " setting the content view on " + e.this.f1429o0);
                }
                e.this.f1429o0.setContentView(o12);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.fragment.app.e$e, reason: collision with other inner class name */
    class C0019e extends l {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ l f1438a;

        C0019e(l lVar) {
            this.f1438a = lVar;
        }

        @Override // androidx.fragment.app.l
        public View j(int i4) {
            return this.f1438a.s() ? this.f1438a.j(i4) : e.this.H1(i4);
        }

        @Override // androidx.fragment.app.l
        public boolean s() {
            return this.f1438a.s() || e.this.I1();
        }
    }

    private void E1(boolean z3, boolean z4, boolean z5) {
        if (this.f1431q0) {
            return;
        }
        this.f1431q0 = true;
        this.f1432r0 = false;
        Dialog dialog = this.f1429o0;
        if (dialog != null) {
            dialog.setOnDismissListener(null);
            this.f1429o0.dismiss();
            if (!z4) {
                if (Looper.myLooper() == this.f1418d0.getLooper()) {
                    onDismiss(this.f1429o0);
                } else {
                    this.f1418d0.post(this.f1419e0);
                }
            }
        }
        this.f1430p0 = true;
        if (this.f1426l0 >= 0) {
            if (z5) {
                G().V0(this.f1426l0, 1);
            } else {
                G().T0(this.f1426l0, 1, z3);
            }
            this.f1426l0 = -1;
            return;
        }
        f0 o3 = G().o();
        o3.m(true);
        o3.l(this);
        if (z5) {
            o3.h();
        } else if (z3) {
            o3.g();
        } else {
            o3.f();
        }
    }

    private void J1(Bundle bundle) {
        if (this.f1425k0 && !this.f1433s0) {
            try {
                this.f1427m0 = true;
                Dialog G1 = G1(bundle);
                this.f1429o0 = G1;
                if (this.f1425k0) {
                    L1(G1, this.f1422h0);
                    Context t3 = t();
                    if (t3 instanceof Activity) {
                        this.f1429o0.setOwnerActivity((Activity) t3);
                    }
                    this.f1429o0.setCancelable(this.f1424j0);
                    this.f1429o0.setOnCancelListener(this.f1420f0);
                    this.f1429o0.setOnDismissListener(this.f1421g0);
                    this.f1433s0 = true;
                } else {
                    this.f1429o0 = null;
                }
                this.f1427m0 = false;
            } catch (Throwable th) {
                this.f1427m0 = false;
                throw th;
            }
        }
    }

    public int F1() {
        return this.f1423i0;
    }

    public Dialog G1(Bundle bundle) {
        if (x.G0(3)) {
            Log.d("FragmentManager", c3.d4(823) + this);
        }
        return new androidx.activity.g(n1(), F1());
    }

    View H1(int i4) {
        Dialog dialog = this.f1429o0;
        if (dialog != null) {
            return dialog.findViewById(i4);
        }
        return null;
    }

    @Override // androidx.fragment.app.Fragment
    public void I0(Bundle bundle) {
        super.I0(bundle);
        Dialog dialog = this.f1429o0;
        if (dialog != null) {
            Bundle onSaveInstanceState = dialog.onSaveInstanceState();
            onSaveInstanceState.putBoolean("android:dialogShowing", false);
            bundle.putBundle("android:savedDialogState", onSaveInstanceState);
        }
        int i4 = this.f1422h0;
        if (i4 != 0) {
            bundle.putInt(c3.d4(364), i4);
        }
        int i5 = this.f1423i0;
        if (i5 != 0) {
            bundle.putInt("android:theme", i5);
        }
        boolean z3 = this.f1424j0;
        if (!z3) {
            bundle.putBoolean("android:cancelable", z3);
        }
        boolean z4 = this.f1425k0;
        if (!z4) {
            bundle.putBoolean("android:showsDialog", z4);
        }
        int i6 = this.f1426l0;
        if (i6 != -1) {
            bundle.putInt("android:backStackId", i6);
        }
    }

    boolean I1() {
        return this.f1433s0;
    }

    @Override // androidx.fragment.app.Fragment
    public void J0() {
        super.J0();
        Dialog dialog = this.f1429o0;
        if (dialog != null) {
            this.f1430p0 = false;
            dialog.show();
            View decorView = this.f1429o0.getWindow().getDecorView();
            androidx.lifecycle.c0.a(decorView, this);
            androidx.lifecycle.d0.a(decorView, this);
            z.f.a(decorView, this);
        }
    }

    @Override // androidx.fragment.app.Fragment
    public void K0() {
        super.K0();
        Dialog dialog = this.f1429o0;
        if (dialog != null) {
            dialog.hide();
        }
    }

    public void K1(boolean z3) {
        this.f1425k0 = z3;
    }

    public void L1(Dialog dialog, int i4) {
        if (i4 != 1 && i4 != 2) {
            if (i4 != 3) {
                return;
            }
            Window window = dialog.getWindow();
            if (window != null) {
                window.addFlags(24);
            }
        }
        dialog.requestWindowFeature(1);
    }

    @Override // androidx.fragment.app.Fragment
    public void M0(Bundle bundle) {
        Bundle bundle2;
        super.M0(bundle);
        if (this.f1429o0 == null || bundle == null || (bundle2 = bundle.getBundle(c3.d4(969))) == null) {
            return;
        }
        this.f1429o0.onRestoreInstanceState(bundle2);
    }

    public void M1(x xVar, String str) {
        this.f1431q0 = false;
        this.f1432r0 = true;
        f0 o3 = xVar.o();
        o3.m(true);
        o3.d(this, str);
        o3.f();
    }

    @Override // androidx.fragment.app.Fragment
    void T0(LayoutInflater layoutInflater, ViewGroup viewGroup, Bundle bundle) {
        Bundle bundle2;
        super.T0(layoutInflater, viewGroup, bundle);
        if (this.I != null || this.f1429o0 == null || bundle == null || (bundle2 = bundle.getBundle("android:savedDialogState")) == null) {
            return;
        }
        this.f1429o0.onRestoreInstanceState(bundle2);
    }

    @Override // androidx.fragment.app.Fragment
    l g() {
        return new C0019e(super.g());
    }

    @Override // androidx.fragment.app.Fragment
    public void g0(Bundle bundle) {
        super.g0(bundle);
    }

    @Override // androidx.fragment.app.Fragment
    public void j0(Context context) {
        super.j0(context);
        U().i(this.f1428n0);
        if (this.f1432r0) {
            return;
        }
        this.f1431q0 = false;
    }

    @Override // androidx.fragment.app.Fragment
    public void m0(Bundle bundle) {
        super.m0(bundle);
        this.f1418d0 = new Handler();
        this.f1425k0 = this.f1291y == 0;
        if (bundle != null) {
            this.f1422h0 = bundle.getInt("android:style", 0);
            this.f1423i0 = bundle.getInt(c3.d4(365), 0);
            this.f1424j0 = bundle.getBoolean("android:cancelable", true);
            this.f1425k0 = bundle.getBoolean(c3.d4(1108), this.f1425k0);
            this.f1426l0 = bundle.getInt("android:backStackId", -1);
        }
    }

    @Override // android.content.DialogInterface.OnCancelListener
    public void onCancel(DialogInterface dialogInterface) {
    }

    @Override // android.content.DialogInterface.OnDismissListener
    public void onDismiss(DialogInterface dialogInterface) {
        if (this.f1430p0) {
            return;
        }
        if (x.G0(3)) {
            Log.d("FragmentManager", "onDismiss called for DialogFragment " + this);
        }
        E1(true, true, false);
    }

    @Override // androidx.fragment.app.Fragment
    public void t0() {
        super.t0();
        Dialog dialog = this.f1429o0;
        if (dialog != null) {
            this.f1430p0 = true;
            dialog.setOnDismissListener(null);
            this.f1429o0.dismiss();
            if (!this.f1431q0) {
                onDismiss(this.f1429o0);
            }
            this.f1429o0 = null;
            this.f1433s0 = false;
        }
    }

    @Override // androidx.fragment.app.Fragment
    public void u0() {
        super.u0();
        if (!this.f1432r0 && !this.f1431q0) {
            this.f1431q0 = true;
        }
        U().m(this.f1428n0);
    }

    @Override // androidx.fragment.app.Fragment
    public LayoutInflater v0(Bundle bundle) {
        LayoutInflater v02 = super.v0(bundle);
        if (this.f1425k0 && !this.f1427m0) {
            J1(bundle);
            if (x.G0(2)) {
                Log.d("FragmentManager", "get layout inflater for DialogFragment " + this + " from dialog context");
            }
            Dialog dialog = this.f1429o0;
            if (dialog != null) {
                return v02.cloneInContext(dialog.getContext());
            }
        } else if (x.G0(2)) {
            String str = "getting layout inflater for DialogFragment " + this;
            if (!this.f1425k0) {
                Log.d("FragmentManager", "mShowsDialog = false: " + str);
                return v02;
            }
            Log.d("FragmentManager", "mCreatingDialog = true: " + str);
        }
        return v02;
    }
}
