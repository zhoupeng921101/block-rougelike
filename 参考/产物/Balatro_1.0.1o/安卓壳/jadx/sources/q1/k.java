package q1;

import a1.b2.c3;
import android.R;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.view.Display;
import android.view.View;
import android.view.ViewTreeObserver;
import c2.e1;
import java.lang.ref.WeakReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k implements View.OnAttachStateChangeListener, ViewTreeObserver.OnGlobalLayoutListener, n {

    /* renamed from: a, reason: collision with root package name */
    private final d f4722a;

    /* renamed from: b, reason: collision with root package name */
    private final c2.c f4723b;

    /* renamed from: c, reason: collision with root package name */
    private WeakReference f4724c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f4725d = false;

    private k(d dVar, int i4) {
        this.f4722a = dVar;
        this.f4723b = new c2.c(i4, null);
    }

    public static k b(d dVar, int i4) {
        return new k(dVar, i4);
    }

    private final void h(View view) {
        Display display = view.getDisplay();
        int displayId = display != null ? display.getDisplayId() : -1;
        IBinder windowToken = view.getWindowToken();
        int[] iArr = new int[2];
        view.getLocationInWindow(iArr);
        int width = view.getWidth();
        int height = view.getHeight();
        c2.c cVar = this.f4723b;
        cVar.f2087c = displayId;
        cVar.f2085a = windowToken;
        int i4 = iArr[0];
        cVar.f2088d = i4;
        int i5 = iArr[1];
        cVar.f2089e = i5;
        cVar.f2090f = i4 + width;
        cVar.f2091g = i5 + height;
        if (this.f4725d) {
            g();
        }
    }

    @Override // q1.n
    public final void a(Activity activity) {
        View view;
        try {
            view = activity.findViewById(R.id.content);
        } catch (IllegalStateException unused) {
            view = null;
        }
        if (view == null && (view = activity.getWindow().getDecorView()) == null) {
            e1.e("PopupManager", c3.d4(97).concat(String.valueOf(activity)));
        } else {
            e1.c("PopupManager", c3.d4(853).concat(String.valueOf(activity)));
            f(view);
        }
    }

    public final Bundle c() {
        return this.f4723b.a();
    }

    public final IBinder d() {
        return this.f4723b.f2085a;
    }

    public final c2.c e() {
        return this.f4723b;
    }

    public final void f(View view) {
        d dVar = this.f4722a;
        dVar.p0();
        WeakReference weakReference = this.f4724c;
        if (weakReference != null) {
            View view2 = (View) weakReference.get();
            Context x3 = dVar.x();
            if (view2 == null && (x3 instanceof Activity)) {
                view2 = ((Activity) x3).getWindow().getDecorView();
            }
            if (view2 != null) {
                view2.removeOnAttachStateChangeListener(this);
                view2.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
        }
        this.f4724c = null;
        Context x4 = dVar.x();
        if (view == null && (x4 instanceof Activity)) {
            Activity activity = (Activity) x4;
            try {
                view = activity.findViewById(R.id.content);
            } catch (IllegalStateException unused) {
            }
            if (view == null) {
                view = activity.getWindow().getDecorView();
            }
            e1.e("PopupManager", c3.d4(1299));
        }
        if (view == null) {
            e1.g("PopupManager", "No content view usable to display popups. Popups will not be displayed in response to this client's calls. Use setViewForPopups() to set your content view.");
            return;
        }
        h(view);
        this.f4724c = new WeakReference(view);
        view.addOnAttachStateChangeListener(this);
        view.getViewTreeObserver().addOnGlobalLayoutListener(this);
    }

    public final void g() {
        boolean z3;
        c2.c cVar = this.f4723b;
        IBinder iBinder = cVar.f2085a;
        if (iBinder != null) {
            this.f4722a.o0(iBinder, cVar.a());
            z3 = false;
        } else {
            z3 = true;
        }
        this.f4725d = z3;
    }

    @Override // android.view.ViewTreeObserver.OnGlobalLayoutListener
    public final void onGlobalLayout() {
        View view;
        WeakReference weakReference = this.f4724c;
        if (weakReference == null || (view = (View) weakReference.get()) == null) {
            return;
        }
        h(view);
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public final void onViewAttachedToWindow(View view) {
        h(view);
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public final void onViewDetachedFromWindow(View view) {
        this.f4722a.p0();
        view.removeOnAttachStateChangeListener(this);
    }
}
