package androidx.appcompat.widget;

import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewParent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class x implements View.OnTouchListener, View.OnAttachStateChangeListener {

    /* renamed from: a, reason: collision with root package name */
    private final float f719a;

    /* renamed from: b, reason: collision with root package name */
    private final int f720b;

    /* renamed from: c, reason: collision with root package name */
    private final int f721c;

    /* renamed from: d, reason: collision with root package name */
    final View f722d;

    /* renamed from: e, reason: collision with root package name */
    private Runnable f723e;

    /* renamed from: f, reason: collision with root package name */
    private Runnable f724f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f725g;

    /* renamed from: h, reason: collision with root package name */
    private int f726h;

    /* renamed from: i, reason: collision with root package name */
    private final int[] f727i = new int[2];

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            ViewParent parent = x.this.f722d.getParent();
            if (parent != null) {
                parent.requestDisallowInterceptTouchEvent(true);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            x.this.e();
        }
    }

    public x(View view) {
        this.f722d = view;
        view.setLongClickable(true);
        view.addOnAttachStateChangeListener(this);
        this.f719a = ViewConfiguration.get(view.getContext()).getScaledTouchSlop();
        int tapTimeout = ViewConfiguration.getTapTimeout();
        this.f720b = tapTimeout;
        this.f721c = (tapTimeout + ViewConfiguration.getLongPressTimeout()) / 2;
    }

    private void a() {
        Runnable runnable = this.f724f;
        if (runnable != null) {
            this.f722d.removeCallbacks(runnable);
        }
        Runnable runnable2 = this.f723e;
        if (runnable2 != null) {
            this.f722d.removeCallbacks(runnable2);
        }
    }

    private boolean f(MotionEvent motionEvent) {
        v vVar;
        View view = this.f722d;
        androidx.appcompat.view.menu.k b4 = b();
        if (b4 != null && b4.i() && (vVar = (v) b4.d()) != null && vVar.isShown()) {
            MotionEvent obtainNoHistory = MotionEvent.obtainNoHistory(motionEvent);
            i(view, obtainNoHistory);
            j(vVar, obtainNoHistory);
            boolean e4 = vVar.e(obtainNoHistory, this.f726h);
            obtainNoHistory.recycle();
            int actionMasked = motionEvent.getActionMasked();
            boolean z3 = (actionMasked == 1 || actionMasked == 3) ? false : true;
            if (e4 && z3) {
                return true;
            }
        }
        return false;
    }

    /* JADX WARN: Code restructure failed: missing block: B:12:0x0017, code lost:
    
        if (r1 != 3) goto L28;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private boolean g(android.view.MotionEvent r6) {
        /*
            r5 = this;
            android.view.View r0 = r5.f722d
            boolean r1 = r0.isEnabled()
            r2 = 0
            if (r1 != 0) goto La
            return r2
        La:
            int r1 = r6.getActionMasked()
            if (r1 == 0) goto L41
            r3 = 1
            if (r1 == r3) goto L3d
            r4 = 2
            if (r1 == r4) goto L1a
            r6 = 3
            if (r1 == r6) goto L3d
            goto L6d
        L1a:
            int r1 = r5.f726h
            int r1 = r6.findPointerIndex(r1)
            if (r1 < 0) goto L6d
            float r4 = r6.getX(r1)
            float r6 = r6.getY(r1)
            float r1 = r5.f719a
            boolean r6 = h(r0, r4, r6, r1)
            if (r6 != 0) goto L6d
            r5.a()
            android.view.ViewParent r6 = r0.getParent()
            r6.requestDisallowInterceptTouchEvent(r3)
            return r3
        L3d:
            r5.a()
            goto L6d
        L41:
            int r6 = r6.getPointerId(r2)
            r5.f726h = r6
            java.lang.Runnable r6 = r5.f723e
            if (r6 != 0) goto L52
            androidx.appcompat.widget.x$a r6 = new androidx.appcompat.widget.x$a
            r6.<init>()
            r5.f723e = r6
        L52:
            java.lang.Runnable r6 = r5.f723e
            int r1 = r5.f720b
            long r3 = (long) r1
            r0.postDelayed(r6, r3)
            java.lang.Runnable r6 = r5.f724f
            if (r6 != 0) goto L65
            androidx.appcompat.widget.x$b r6 = new androidx.appcompat.widget.x$b
            r6.<init>()
            r5.f724f = r6
        L65:
            java.lang.Runnable r6 = r5.f724f
            int r1 = r5.f721c
            long r3 = (long) r1
            r0.postDelayed(r6, r3)
        L6d:
            return r2
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.x.g(android.view.MotionEvent):boolean");
    }

    private static boolean h(View view, float f4, float f5, float f6) {
        float f7 = -f6;
        return f4 >= f7 && f5 >= f7 && f4 < ((float) (view.getRight() - view.getLeft())) + f6 && f5 < ((float) (view.getBottom() - view.getTop())) + f6;
    }

    private boolean i(View view, MotionEvent motionEvent) {
        view.getLocationOnScreen(this.f727i);
        motionEvent.offsetLocation(r0[0], r0[1]);
        return true;
    }

    private boolean j(View view, MotionEvent motionEvent) {
        view.getLocationOnScreen(this.f727i);
        motionEvent.offsetLocation(-r0[0], -r0[1]);
        return true;
    }

    public abstract androidx.appcompat.view.menu.k b();

    protected abstract boolean c();

    protected boolean d() {
        androidx.appcompat.view.menu.k b4 = b();
        if (b4 == null || !b4.i()) {
            return true;
        }
        b4.dismiss();
        return true;
    }

    void e() {
        a();
        View view = this.f722d;
        if (view.isEnabled() && !view.isLongClickable() && c()) {
            view.getParent().requestDisallowInterceptTouchEvent(true);
            long uptimeMillis = SystemClock.uptimeMillis();
            MotionEvent obtain = MotionEvent.obtain(uptimeMillis, uptimeMillis, 3, 0.0f, 0.0f, 0);
            view.onTouchEvent(obtain);
            obtain.recycle();
            this.f725g = true;
        }
    }

    @Override // android.view.View.OnTouchListener
    public boolean onTouch(View view, MotionEvent motionEvent) {
        boolean z3;
        boolean z4 = this.f725g;
        if (z4) {
            z3 = f(motionEvent) || !d();
        } else {
            z3 = g(motionEvent) && c();
            if (z3) {
                long uptimeMillis = SystemClock.uptimeMillis();
                MotionEvent obtain = MotionEvent.obtain(uptimeMillis, uptimeMillis, 3, 0.0f, 0.0f, 0);
                this.f722d.onTouchEvent(obtain);
                obtain.recycle();
            }
        }
        this.f725g = z3;
        return z3 || z4;
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public void onViewAttachedToWindow(View view) {
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public void onViewDetachedFromWindow(View view) {
        this.f725g = false;
        this.f726h = -1;
        Runnable runnable = this.f723e;
        if (runnable != null) {
            this.f722d.removeCallbacks(runnable);
        }
    }
}
