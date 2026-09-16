package androidx.core.view;

import android.view.View;
import android.view.ViewTreeObserver;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class t implements ViewTreeObserver.OnPreDrawListener, View.OnAttachStateChangeListener {

    /* renamed from: a, reason: collision with root package name */
    private final View f1083a;

    /* renamed from: b, reason: collision with root package name */
    private ViewTreeObserver f1084b;

    /* renamed from: c, reason: collision with root package name */
    private final Runnable f1085c;

    private t(View view, Runnable runnable) {
        this.f1083a = view;
        this.f1084b = view.getViewTreeObserver();
        this.f1085c = runnable;
    }

    public static t a(View view, Runnable runnable) {
        if (view == null) {
            throw new NullPointerException("view == null");
        }
        if (runnable == null) {
            throw new NullPointerException("runnable == null");
        }
        t tVar = new t(view, runnable);
        view.getViewTreeObserver().addOnPreDrawListener(tVar);
        view.addOnAttachStateChangeListener(tVar);
        return tVar;
    }

    public void b() {
        if (this.f1084b.isAlive()) {
            this.f1084b.removeOnPreDrawListener(this);
        } else {
            this.f1083a.getViewTreeObserver().removeOnPreDrawListener(this);
        }
        this.f1083a.removeOnAttachStateChangeListener(this);
    }

    @Override // android.view.ViewTreeObserver.OnPreDrawListener
    public boolean onPreDraw() {
        b();
        this.f1085c.run();
        return true;
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public void onViewAttachedToWindow(View view) {
        this.f1084b = view.getViewTreeObserver();
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public void onViewDetachedFromWindow(View view) {
        b();
    }
}
