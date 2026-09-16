package androidx.fragment.app;

import a1.b2.c3;
import android.content.Context;
import android.os.Bundle;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedDispatcher;
import androidx.activity.result.ActivityResultRegistry;
import androidx.core.app.a;
import androidx.lifecycle.g;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import z.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class j extends ComponentActivity implements a.c {

    /* renamed from: u, reason: collision with root package name */
    boolean f1502u;

    /* renamed from: v, reason: collision with root package name */
    boolean f1503v;

    /* renamed from: s, reason: collision with root package name */
    final n f1500s = n.b(new a());

    /* renamed from: t, reason: collision with root package name */
    final androidx.lifecycle.l f1501t = new androidx.lifecycle.l(this);

    /* renamed from: w, reason: collision with root package name */
    boolean f1504w = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends p implements androidx.core.content.b, androidx.core.content.c, androidx.core.app.x, androidx.core.app.y, androidx.lifecycle.b0, androidx.activity.l, androidx.activity.result.d, z.e, b0, androidx.core.view.i {
        public a() {
            super(j.this);
        }

        @Override // androidx.fragment.app.p
        public void A() {
            B();
        }

        public void B() {
            j.this.B();
        }

        @Override // androidx.fragment.app.p
        /* renamed from: C, reason: merged with bridge method [inline-methods] */
        public j x() {
            return j.this;
        }

        @Override // androidx.fragment.app.b0
        public void a(x xVar, Fragment fragment) {
            j.this.P(fragment);
        }

        @Override // androidx.activity.l
        public OnBackPressedDispatcher b() {
            return j.this.b();
        }

        @Override // z.e
        public z.c c() {
            return j.this.c();
        }

        @Override // androidx.core.view.i
        public void d(androidx.core.view.l lVar) {
            j.this.d(lVar);
        }

        @Override // androidx.core.content.b
        public void f(androidx.core.util.a aVar) {
            j.this.f(aVar);
        }

        @Override // androidx.core.app.y
        public void g(androidx.core.util.a aVar) {
            j.this.g(aVar);
        }

        @Override // androidx.core.content.c
        public void h(androidx.core.util.a aVar) {
            j.this.h(aVar);
        }

        @Override // androidx.core.content.c
        public void i(androidx.core.util.a aVar) {
            j.this.i(aVar);
        }

        @Override // androidx.fragment.app.l
        public View j(int i4) {
            return j.this.findViewById(i4);
        }

        @Override // androidx.core.app.y
        public void k(androidx.core.util.a aVar) {
            j.this.k(aVar);
        }

        @Override // androidx.core.view.i
        public void l(androidx.core.view.l lVar) {
            j.this.l(lVar);
        }

        @Override // androidx.activity.result.d
        public ActivityResultRegistry m() {
            return j.this.m();
        }

        @Override // androidx.core.app.x
        public void n(androidx.core.util.a aVar) {
            j.this.n(aVar);
        }

        @Override // androidx.lifecycle.b0
        public androidx.lifecycle.a0 o() {
            return j.this.o();
        }

        @Override // androidx.core.app.x
        public void p(androidx.core.util.a aVar) {
            j.this.p(aVar);
        }

        @Override // androidx.lifecycle.k
        public androidx.lifecycle.g q() {
            return j.this.f1501t;
        }

        @Override // androidx.core.content.b
        public void r(androidx.core.util.a aVar) {
            j.this.r(aVar);
        }

        @Override // androidx.fragment.app.l
        public boolean s() {
            Window window = j.this.getWindow();
            return (window == null || window.peekDecorView() == null) ? false : true;
        }

        @Override // androidx.fragment.app.p
        public void w(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
            j.this.dump(str, fileDescriptor, printWriter, strArr);
        }

        @Override // androidx.fragment.app.p
        public LayoutInflater y() {
            return j.this.getLayoutInflater().cloneInContext(j.this);
        }
    }

    public j() {
        M();
    }

    public static /* synthetic */ Bundle H(j jVar) {
        jVar.N();
        jVar.f1501t.h(g.b.ON_STOP);
        return new Bundle();
    }

    private void M() {
        c().h("android:support:lifecycle", new c.InterfaceC0086c() { // from class: androidx.fragment.app.f
            @Override // z.c.InterfaceC0086c
            public final Bundle a() {
                return j.H(j.this);
            }
        });
        f(new androidx.core.util.a() { // from class: androidx.fragment.app.g
            @Override // androidx.core.util.a
            public final void accept(Object obj) {
                j.this.f1500s.m();
            }
        });
        y(new androidx.core.util.a() { // from class: androidx.fragment.app.h
            @Override // androidx.core.util.a
            public final void accept(Object obj) {
                j.this.f1500s.m();
            }
        });
        x(new a.b() { // from class: androidx.fragment.app.i
            @Override // a.b
            public final void a(Context context) {
                j.this.f1500s.a(null);
            }
        });
    }

    private static boolean O(x xVar, g.c cVar) {
        boolean z3 = false;
        for (Fragment fragment : xVar.s0()) {
            if (fragment != null) {
                if (fragment.B() != null) {
                    z3 |= O(fragment.s(), cVar);
                }
                j0 j0Var = fragment.U;
                if (j0Var != null && j0Var.q().b().a(g.c.STARTED)) {
                    fragment.U.h(cVar);
                    z3 = true;
                }
                if (fragment.T.b().a(g.c.STARTED)) {
                    fragment.T.o(cVar);
                    z3 = true;
                }
            }
        }
        return z3;
    }

    final View J(View view, String str, Context context, AttributeSet attributeSet) {
        return this.f1500s.n(view, str, context, attributeSet);
    }

    public x K() {
        return this.f1500s.l();
    }

    public androidx.loader.app.a L() {
        return androidx.loader.app.a.b(this);
    }

    void N() {
        while (O(K(), g.c.CREATED)) {
        }
    }

    public void P(Fragment fragment) {
    }

    protected void Q() {
        this.f1501t.h(g.b.ON_RESUME);
        this.f1500s.h();
    }

    @Override // androidx.core.app.a.c
    public final void a(int i4) {
    }

    @Override // android.app.Activity
    public void dump(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        super.dump(str, fileDescriptor, printWriter, strArr);
        if (s(strArr)) {
            printWriter.print(str);
            printWriter.print(c3.d4(1309));
            printWriter.print(Integer.toHexString(System.identityHashCode(this)));
            printWriter.println(c3.d4(1310));
            String str2 = str + c3.d4(874);
            printWriter.print(str2);
            printWriter.print("mCreated=");
            printWriter.print(this.f1502u);
            printWriter.print(" mResumed=");
            printWriter.print(this.f1503v);
            printWriter.print(" mStopped=");
            printWriter.print(this.f1504w);
            if (getApplication() != null) {
                androidx.loader.app.a.b(this).a(str2, fileDescriptor, printWriter, strArr);
            }
            this.f1500s.l().W(str, fileDescriptor, printWriter, strArr);
        }
    }

    @Override // androidx.activity.ComponentActivity, androidx.core.app.c, android.app.Activity
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        this.f1501t.h(g.b.ON_CREATE);
        this.f1500s.e();
    }

    @Override // android.app.Activity, android.view.LayoutInflater.Factory2
    public View onCreateView(View view, String str, Context context, AttributeSet attributeSet) {
        View J = J(view, str, context, attributeSet);
        return J == null ? super.onCreateView(view, str, context, attributeSet) : J;
    }

    @Override // android.app.Activity, android.view.LayoutInflater.Factory
    public View onCreateView(String str, Context context, AttributeSet attributeSet) {
        View J = J(null, str, context, attributeSet);
        return J == null ? super.onCreateView(str, context, attributeSet) : J;
    }

    @Override // android.app.Activity
    protected void onDestroy() {
        super.onDestroy();
        this.f1500s.f();
        this.f1501t.h(g.b.ON_DESTROY);
    }

    @Override // androidx.activity.ComponentActivity, android.app.Activity, android.view.Window.Callback
    public boolean onMenuItemSelected(int i4, MenuItem menuItem) {
        if (super.onMenuItemSelected(i4, menuItem)) {
            return true;
        }
        if (i4 == 6) {
            return this.f1500s.d(menuItem);
        }
        return false;
    }

    @Override // android.app.Activity
    protected void onPause() {
        super.onPause();
        this.f1503v = false;
        this.f1500s.g();
        this.f1501t.h(g.b.ON_PAUSE);
    }

    @Override // android.app.Activity
    protected void onPostResume() {
        super.onPostResume();
        Q();
    }

    @Override // androidx.activity.ComponentActivity, android.app.Activity
    public void onRequestPermissionsResult(int i4, String[] strArr, int[] iArr) {
        this.f1500s.m();
        super.onRequestPermissionsResult(i4, strArr, iArr);
    }

    @Override // android.app.Activity
    protected void onResume() {
        this.f1500s.m();
        super.onResume();
        this.f1503v = true;
        this.f1500s.k();
    }

    @Override // android.app.Activity
    protected void onStart() {
        this.f1500s.m();
        super.onStart();
        this.f1504w = false;
        if (!this.f1502u) {
            this.f1502u = true;
            this.f1500s.c();
        }
        this.f1500s.k();
        this.f1501t.h(g.b.ON_START);
        this.f1500s.i();
    }

    @Override // android.app.Activity
    public void onStateNotSaved() {
        this.f1500s.m();
    }

    @Override // android.app.Activity
    protected void onStop() {
        super.onStop();
        this.f1504w = true;
        N();
        this.f1500s.j();
        this.f1501t.h(g.b.ON_STOP);
    }
}
