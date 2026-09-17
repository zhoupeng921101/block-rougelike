package androidx.activity;

import a1.b2.c3;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.window.OnBackInvokedDispatcher;
import androidx.activity.result.ActivityResultRegistry;
import androidx.core.app.x;
import androidx.core.app.y;
import androidx.core.app.z;
import androidx.lifecycle.a0;
import androidx.lifecycle.b0;
import androidx.lifecycle.c0;
import androidx.lifecycle.d0;
import androidx.lifecycle.g;
import androidx.lifecycle.t;
import androidx.lifecycle.u;
import androidx.lifecycle.y;
import b.a;
import java.util.Iterator;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import z.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class ComponentActivity extends androidx.core.app.c implements androidx.lifecycle.k, b0, androidx.lifecycle.f, z.e, l, androidx.activity.result.d, androidx.core.content.b, androidx.core.content.c, x, y, androidx.core.view.i {

    /* renamed from: c, reason: collision with root package name */
    final a.a f18c = new a.a();

    /* renamed from: d, reason: collision with root package name */
    private final androidx.core.view.j f19d = new androidx.core.view.j(new Runnable() { // from class: androidx.activity.b
        @Override // java.lang.Runnable
        public final void run() {
            ComponentActivity.this.B();
        }
    });

    /* renamed from: e, reason: collision with root package name */
    private final androidx.lifecycle.l f20e = new androidx.lifecycle.l(this);

    /* renamed from: f, reason: collision with root package name */
    final z.d f21f;

    /* renamed from: g, reason: collision with root package name */
    private a0 f22g;

    /* renamed from: h, reason: collision with root package name */
    private final OnBackPressedDispatcher f23h;

    /* renamed from: i, reason: collision with root package name */
    private int f24i;

    /* renamed from: j, reason: collision with root package name */
    private final AtomicInteger f25j;

    /* renamed from: k, reason: collision with root package name */
    private final ActivityResultRegistry f26k;

    /* renamed from: l, reason: collision with root package name */
    private final CopyOnWriteArrayList f27l;

    /* renamed from: m, reason: collision with root package name */
    private final CopyOnWriteArrayList f28m;

    /* renamed from: n, reason: collision with root package name */
    private final CopyOnWriteArrayList f29n;

    /* renamed from: o, reason: collision with root package name */
    private final CopyOnWriteArrayList f30o;

    /* renamed from: p, reason: collision with root package name */
    private final CopyOnWriteArrayList f31p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f32q;

    /* renamed from: r, reason: collision with root package name */
    private boolean f33r;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            try {
                ComponentActivity.super.onBackPressed();
            } catch (IllegalStateException e4) {
                if (!TextUtils.equals(e4.getMessage(), c3.d4(43))) {
                    throw e4;
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends ActivityResultRegistry {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ int f39e;

            /* renamed from: f, reason: collision with root package name */
            final /* synthetic */ a.C0031a f40f;

            a(int i4, a.C0031a c0031a) {
                this.f39e = i4;
                this.f40f = c0031a;
            }

            @Override // java.lang.Runnable
            public void run() {
                b.this.c(this.f39e, this.f40f.a());
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: androidx.activity.ComponentActivity$b$b, reason: collision with other inner class name */
        class RunnableC0000b implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ int f42e;

            /* renamed from: f, reason: collision with root package name */
            final /* synthetic */ IntentSender.SendIntentException f43f;

            RunnableC0000b(int i4, IntentSender.SendIntentException sendIntentException) {
                this.f42e = i4;
                this.f43f = sendIntentException;
            }

            @Override // java.lang.Runnable
            public void run() {
                b.this.b(this.f42e, 0, new Intent().setAction("androidx.activity.result.contract.action.INTENT_SENDER_REQUEST").putExtra("androidx.activity.result.contract.extra.SEND_INTENT_EXCEPTION", this.f43f));
            }
        }

        b() {
        }

        @Override // androidx.activity.result.ActivityResultRegistry
        public void f(int i4, b.a aVar, Object obj, androidx.core.app.b bVar) {
            Bundle bundle;
            int i5;
            ComponentActivity componentActivity = ComponentActivity.this;
            a.C0031a b4 = aVar.b(componentActivity, obj);
            if (b4 != null) {
                new Handler(Looper.getMainLooper()).post(new a(i4, b4));
                return;
            }
            Intent a4 = aVar.a(componentActivity, obj);
            if (a4.getExtras() != null && a4.getExtras().getClassLoader() == null) {
                a4.setExtrasClassLoader(componentActivity.getClassLoader());
            }
            if (a4.hasExtra("androidx.activity.result.contract.extra.ACTIVITY_OPTIONS_BUNDLE")) {
                bundle = a4.getBundleExtra("androidx.activity.result.contract.extra.ACTIVITY_OPTIONS_BUNDLE");
                a4.removeExtra("androidx.activity.result.contract.extra.ACTIVITY_OPTIONS_BUNDLE");
            } else {
                bundle = null;
            }
            Bundle bundle2 = bundle;
            if ("androidx.activity.result.contract.action.REQUEST_PERMISSIONS".equals(a4.getAction())) {
                String[] stringArrayExtra = a4.getStringArrayExtra("androidx.activity.result.contract.extra.PERMISSIONS");
                if (stringArrayExtra == null) {
                    stringArrayExtra = new String[0];
                }
                androidx.core.app.a.e(componentActivity, stringArrayExtra, i4);
                return;
            }
            if (!"androidx.activity.result.contract.action.INTENT_SENDER_REQUEST".equals(a4.getAction())) {
                androidx.core.app.a.g(componentActivity, a4, i4, bundle2);
                return;
            }
            androidx.activity.result.e eVar = (androidx.activity.result.e) a4.getParcelableExtra(c3.d4(102));
            try {
                i5 = i4;
                try {
                    androidx.core.app.a.h(componentActivity, eVar.y(), i5, eVar.o(), eVar.q(), eVar.v(), 0, bundle2);
                } catch (IntentSender.SendIntentException e4) {
                    e = e4;
                    new Handler(Looper.getMainLooper()).post(new RunnableC0000b(i5, e));
                }
            } catch (IntentSender.SendIntentException e5) {
                e = e5;
                i5 = i4;
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {
        static void a(View view) {
            view.cancelPendingInputEvents();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class d {
        static OnBackInvokedDispatcher a(Activity activity) {
            return activity.getOnBackInvokedDispatcher();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class e {

        /* renamed from: a, reason: collision with root package name */
        Object f45a;

        /* renamed from: b, reason: collision with root package name */
        a0 f46b;

        e() {
        }
    }

    public ComponentActivity() {
        z.d a4 = z.d.a(this);
        this.f21f = a4;
        this.f23h = new OnBackPressedDispatcher(new a());
        this.f25j = new AtomicInteger();
        this.f26k = new b();
        this.f27l = new CopyOnWriteArrayList();
        this.f28m = new CopyOnWriteArrayList();
        this.f29n = new CopyOnWriteArrayList();
        this.f30o = new CopyOnWriteArrayList();
        this.f31p = new CopyOnWriteArrayList();
        this.f32q = false;
        this.f33r = false;
        if (q() == null) {
            throw new IllegalStateException("getLifecycle() returned null in ComponentActivity's constructor. Please make sure you are lazily constructing your Lifecycle in the first call to getLifecycle() rather than relying on field initialization.");
        }
        q().a(new androidx.lifecycle.i() { // from class: androidx.activity.ComponentActivity.3
            @Override // androidx.lifecycle.i
            public void g(androidx.lifecycle.k kVar, g.b bVar) {
                if (bVar == g.b.ON_STOP) {
                    Window window = ComponentActivity.this.getWindow();
                    View peekDecorView = window != null ? window.peekDecorView() : null;
                    if (peekDecorView != null) {
                        c.a(peekDecorView);
                    }
                }
            }
        });
        q().a(new androidx.lifecycle.i() { // from class: androidx.activity.ComponentActivity.4
            @Override // androidx.lifecycle.i
            public void g(androidx.lifecycle.k kVar, g.b bVar) {
                if (bVar == g.b.ON_DESTROY) {
                    ComponentActivity.this.f18c.b();
                    if (ComponentActivity.this.isChangingConfigurations()) {
                        return;
                    }
                    ComponentActivity.this.o().a();
                }
            }
        });
        q().a(new androidx.lifecycle.i() { // from class: androidx.activity.ComponentActivity.5
            @Override // androidx.lifecycle.i
            public void g(androidx.lifecycle.k kVar, g.b bVar) {
                ComponentActivity.this.z();
                ComponentActivity.this.q().c(this);
            }
        });
        a4.c();
        u.a(this);
        c().h("android:support:activity-result", new c.InterfaceC0086c() { // from class: androidx.activity.c
            @Override // z.c.InterfaceC0086c
            public final Bundle a() {
                return ComponentActivity.v(ComponentActivity.this);
            }
        });
        x(new a.b() { // from class: androidx.activity.d
            @Override // a.b
            public final void a(Context context) {
                ComponentActivity.u(ComponentActivity.this, context);
            }
        });
    }

    private void A() {
        c0.a(getWindow().getDecorView(), this);
        d0.a(getWindow().getDecorView(), this);
        z.f.a(getWindow().getDecorView(), this);
        n.a(getWindow().getDecorView(), this);
    }

    public static /* synthetic */ void u(ComponentActivity componentActivity, Context context) {
        Bundle b4 = componentActivity.c().b("android:support:activity-result");
        if (b4 != null) {
            componentActivity.f26k.g(b4);
        }
    }

    public static /* synthetic */ Bundle v(ComponentActivity componentActivity) {
        componentActivity.getClass();
        Bundle bundle = new Bundle();
        componentActivity.f26k.h(bundle);
        return bundle;
    }

    public void B() {
        invalidateOptionsMenu();
    }

    public Object C() {
        return null;
    }

    public final androidx.activity.result.c D(b.a aVar, androidx.activity.result.b bVar) {
        return E(aVar, this.f26k, bVar);
    }

    public final androidx.activity.result.c E(b.a aVar, ActivityResultRegistry activityResultRegistry, androidx.activity.result.b bVar) {
        return activityResultRegistry.i(c3.d4(1) + this.f25j.getAndIncrement(), this, aVar, bVar);
    }

    @Override // android.app.Activity
    public void addContentView(View view, ViewGroup.LayoutParams layoutParams) {
        A();
        super.addContentView(view, layoutParams);
    }

    @Override // androidx.activity.l
    public final OnBackPressedDispatcher b() {
        return this.f23h;
    }

    @Override // z.e
    public final z.c c() {
        return this.f21f.b();
    }

    @Override // androidx.core.view.i
    public void d(androidx.core.view.l lVar) {
        this.f19d.f(lVar);
    }

    @Override // androidx.core.content.b
    public final void f(androidx.core.util.a aVar) {
        this.f27l.add(aVar);
    }

    @Override // androidx.core.app.y
    public final void g(androidx.core.util.a aVar) {
        this.f31p.remove(aVar);
    }

    @Override // androidx.core.content.c
    public final void h(androidx.core.util.a aVar) {
        this.f28m.remove(aVar);
    }

    @Override // androidx.core.content.c
    public final void i(androidx.core.util.a aVar) {
        this.f28m.add(aVar);
    }

    @Override // androidx.lifecycle.f
    public x.a j() {
        x.d dVar = new x.d();
        if (getApplication() != null) {
            dVar.b(y.a.f1710e, getApplication());
        }
        dVar.b(u.f1693a, this);
        dVar.b(u.f1694b, this);
        if (getIntent() != null && getIntent().getExtras() != null) {
            dVar.b(u.f1695c, getIntent().getExtras());
        }
        return dVar;
    }

    @Override // androidx.core.app.y
    public final void k(androidx.core.util.a aVar) {
        this.f31p.add(aVar);
    }

    @Override // androidx.core.view.i
    public void l(androidx.core.view.l lVar) {
        this.f19d.a(lVar);
    }

    @Override // androidx.activity.result.d
    public final ActivityResultRegistry m() {
        return this.f26k;
    }

    @Override // androidx.core.app.x
    public final void n(androidx.core.util.a aVar) {
        this.f30o.add(aVar);
    }

    @Override // androidx.lifecycle.b0
    public a0 o() {
        if (getApplication() == null) {
            throw new IllegalStateException("Your activity is not yet attached to the Application instance. You can't request ViewModel before onCreate call.");
        }
        z();
        return this.f22g;
    }

    @Override // android.app.Activity
    protected void onActivityResult(int i4, int i5, Intent intent) {
        if (this.f26k.b(i4, i5, intent)) {
            return;
        }
        super.onActivityResult(i4, i5, intent);
    }

    @Override // android.app.Activity
    public void onBackPressed() {
        this.f23h.e();
    }

    @Override // android.app.Activity, android.content.ComponentCallbacks
    public void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);
        Iterator it = this.f27l.iterator();
        while (it.hasNext()) {
            ((androidx.core.util.a) it.next()).accept(configuration);
        }
    }

    @Override // androidx.core.app.c, android.app.Activity
    protected void onCreate(Bundle bundle) {
        this.f21f.d(bundle);
        this.f18c.c(this);
        super.onCreate(bundle);
        t.g(this);
        if (androidx.core.os.a.c()) {
            this.f23h.f(d.a(this));
        }
        int i4 = this.f24i;
        if (i4 != 0) {
            setContentView(i4);
        }
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public boolean onCreatePanelMenu(int i4, Menu menu) {
        if (i4 != 0) {
            return true;
        }
        super.onCreatePanelMenu(i4, menu);
        this.f19d.b(menu, getMenuInflater());
        return true;
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public boolean onMenuItemSelected(int i4, MenuItem menuItem) {
        if (super.onMenuItemSelected(i4, menuItem)) {
            return true;
        }
        if (i4 == 0) {
            return this.f19d.d(menuItem);
        }
        return false;
    }

    @Override // android.app.Activity
    public void onMultiWindowModeChanged(boolean z3) {
        if (this.f32q) {
            return;
        }
        Iterator it = this.f30o.iterator();
        while (it.hasNext()) {
            ((androidx.core.util.a) it.next()).accept(new androidx.core.app.d(z3));
        }
    }

    @Override // android.app.Activity
    public void onMultiWindowModeChanged(boolean z3, Configuration configuration) {
        this.f32q = true;
        try {
            super.onMultiWindowModeChanged(z3, configuration);
            this.f32q = false;
            Iterator it = this.f30o.iterator();
            while (it.hasNext()) {
                ((androidx.core.util.a) it.next()).accept(new androidx.core.app.d(z3, configuration));
            }
        } catch (Throwable th) {
            this.f32q = false;
            throw th;
        }
    }

    @Override // android.app.Activity
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Iterator it = this.f29n.iterator();
        while (it.hasNext()) {
            ((androidx.core.util.a) it.next()).accept(intent);
        }
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public void onPanelClosed(int i4, Menu menu) {
        this.f19d.c(menu);
        super.onPanelClosed(i4, menu);
    }

    @Override // android.app.Activity
    public void onPictureInPictureModeChanged(boolean z3) {
        if (this.f33r) {
            return;
        }
        Iterator it = this.f31p.iterator();
        while (it.hasNext()) {
            ((androidx.core.util.a) it.next()).accept(new z(z3));
        }
    }

    @Override // android.app.Activity
    public void onPictureInPictureModeChanged(boolean z3, Configuration configuration) {
        this.f33r = true;
        try {
            super.onPictureInPictureModeChanged(z3, configuration);
            this.f33r = false;
            Iterator it = this.f31p.iterator();
            while (it.hasNext()) {
                ((androidx.core.util.a) it.next()).accept(new z(z3, configuration));
            }
        } catch (Throwable th) {
            this.f33r = false;
            throw th;
        }
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public boolean onPreparePanel(int i4, View view, Menu menu) {
        if (i4 != 0) {
            return true;
        }
        super.onPreparePanel(i4, view, menu);
        this.f19d.e(menu);
        return true;
    }

    @Override // android.app.Activity
    public void onRequestPermissionsResult(int i4, String[] strArr, int[] iArr) {
        if (this.f26k.b(i4, -1, new Intent().putExtra("androidx.activity.result.contract.extra.PERMISSIONS", strArr).putExtra("androidx.activity.result.contract.extra.PERMISSION_GRANT_RESULTS", iArr))) {
            return;
        }
        super.onRequestPermissionsResult(i4, strArr, iArr);
    }

    @Override // android.app.Activity
    public final Object onRetainNonConfigurationInstance() {
        e eVar;
        Object C = C();
        a0 a0Var = this.f22g;
        if (a0Var == null && (eVar = (e) getLastNonConfigurationInstance()) != null) {
            a0Var = eVar.f46b;
        }
        if (a0Var == null && C == null) {
            return null;
        }
        e eVar2 = new e();
        eVar2.f45a = C;
        eVar2.f46b = a0Var;
        return eVar2;
    }

    @Override // androidx.core.app.c, android.app.Activity
    protected void onSaveInstanceState(Bundle bundle) {
        androidx.lifecycle.g q3 = q();
        if (q3 instanceof androidx.lifecycle.l) {
            ((androidx.lifecycle.l) q3).o(g.c.CREATED);
        }
        super.onSaveInstanceState(bundle);
        this.f21f.e(bundle);
    }

    @Override // android.app.Activity, android.content.ComponentCallbacks2
    public void onTrimMemory(int i4) {
        super.onTrimMemory(i4);
        Iterator it = this.f28m.iterator();
        while (it.hasNext()) {
            ((androidx.core.util.a) it.next()).accept(Integer.valueOf(i4));
        }
    }

    @Override // androidx.core.app.x
    public final void p(androidx.core.util.a aVar) {
        this.f30o.remove(aVar);
    }

    @Override // androidx.lifecycle.k
    public androidx.lifecycle.g q() {
        return this.f20e;
    }

    @Override // androidx.core.content.b
    public final void r(androidx.core.util.a aVar) {
        this.f27l.remove(aVar);
    }

    @Override // android.app.Activity
    public void reportFullyDrawn() {
        try {
            if (b0.b.d()) {
                b0.b.a("reportFullyDrawn() for ComponentActivity");
            }
            super.reportFullyDrawn();
            b0.b.b();
        } catch (Throwable th) {
            b0.b.b();
            throw th;
        }
    }

    @Override // android.app.Activity
    public void setContentView(int i4) {
        A();
        super.setContentView(i4);
    }

    @Override // android.app.Activity
    public void setContentView(View view) {
        A();
        super.setContentView(view);
    }

    @Override // android.app.Activity
    public void setContentView(View view, ViewGroup.LayoutParams layoutParams) {
        A();
        super.setContentView(view, layoutParams);
    }

    @Override // android.app.Activity
    public void startActivityForResult(Intent intent, int i4) {
        super.startActivityForResult(intent, i4);
    }

    @Override // android.app.Activity
    public void startActivityForResult(Intent intent, int i4, Bundle bundle) {
        super.startActivityForResult(intent, i4, bundle);
    }

    @Override // android.app.Activity
    public void startIntentSenderForResult(IntentSender intentSender, int i4, Intent intent, int i5, int i6, int i7) {
        super.startIntentSenderForResult(intentSender, i4, intent, i5, i6, i7);
    }

    @Override // android.app.Activity
    public void startIntentSenderForResult(IntentSender intentSender, int i4, Intent intent, int i5, int i6, int i7, Bundle bundle) {
        super.startIntentSenderForResult(intentSender, i4, intent, i5, i6, i7, bundle);
    }

    public final void x(a.b bVar) {
        this.f18c.a(bVar);
    }

    public final void y(androidx.core.util.a aVar) {
        this.f29n.add(aVar);
    }

    void z() {
        if (this.f22g == null) {
            e eVar = (e) getLastNonConfigurationInstance();
            if (eVar != null) {
                this.f22g = eVar.f46b;
            }
            if (this.f22g == null) {
                this.f22g = new a0();
            }
        }
    }
}
