package androidx.appcompat.widget;

import a1.b2.c3;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.accessibility.AccessibilityManager;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class s0 implements View.OnLongClickListener, View.OnHoverListener, View.OnAttachStateChangeListener {

    /* renamed from: k, reason: collision with root package name */
    private static s0 f674k;

    /* renamed from: l, reason: collision with root package name */
    private static s0 f675l;

    /* renamed from: a, reason: collision with root package name */
    private final View f676a;

    /* renamed from: b, reason: collision with root package name */
    private final CharSequence f677b;

    /* renamed from: c, reason: collision with root package name */
    private final int f678c;

    /* renamed from: d, reason: collision with root package name */
    private final Runnable f679d = new Runnable() { // from class: androidx.appcompat.widget.q0
        @Override // java.lang.Runnable
        public final void run() {
            s0.this.h(false);
        }
    };

    /* renamed from: e, reason: collision with root package name */
    private final Runnable f680e = new Runnable() { // from class: androidx.appcompat.widget.r0
        @Override // java.lang.Runnable
        public final void run() {
            s0.this.d();
        }
    };

    /* renamed from: f, reason: collision with root package name */
    private int f681f;

    /* renamed from: g, reason: collision with root package name */
    private int f682g;

    /* renamed from: h, reason: collision with root package name */
    private t0 f683h;

    /* renamed from: i, reason: collision with root package name */
    private boolean f684i;

    /* renamed from: j, reason: collision with root package name */
    private boolean f685j;

    private s0(View view, CharSequence charSequence) {
        this.f676a = view;
        this.f677b = charSequence;
        this.f678c = androidx.core.view.x.a(ViewConfiguration.get(view.getContext()));
        c();
        view.setOnLongClickListener(this);
        view.setOnHoverListener(this);
    }

    private void b() {
        this.f676a.removeCallbacks(this.f679d);
    }

    private void c() {
        this.f685j = true;
    }

    private void e() {
        this.f676a.postDelayed(this.f679d, ViewConfiguration.getLongPressTimeout());
    }

    private static void f(s0 s0Var) {
        s0 s0Var2 = f674k;
        if (s0Var2 != null) {
            s0Var2.b();
        }
        f674k = s0Var;
        if (s0Var != null) {
            s0Var.e();
        }
    }

    public static void g(View view, CharSequence charSequence) {
        s0 s0Var = f674k;
        if (s0Var != null && s0Var.f676a == view) {
            f(null);
        }
        if (!TextUtils.isEmpty(charSequence)) {
            new s0(view, charSequence);
            return;
        }
        s0 s0Var2 = f675l;
        if (s0Var2 != null && s0Var2.f676a == view) {
            s0Var2.d();
        }
        view.setOnLongClickListener(null);
        view.setLongClickable(false);
        view.setOnHoverListener(null);
    }

    private boolean i(MotionEvent motionEvent) {
        int x3 = (int) motionEvent.getX();
        int y3 = (int) motionEvent.getY();
        if (!this.f685j && Math.abs(x3 - this.f681f) <= this.f678c && Math.abs(y3 - this.f682g) <= this.f678c) {
            return false;
        }
        this.f681f = x3;
        this.f682g = y3;
        this.f685j = false;
        return true;
    }

    void d() {
        if (f675l == this) {
            f675l = null;
            t0 t0Var = this.f683h;
            if (t0Var != null) {
                t0Var.c();
                this.f683h = null;
                c();
                this.f676a.removeOnAttachStateChangeListener(this);
            } else {
                Log.e(c3.d4(816), "sActiveHandler.mPopup == null");
            }
        }
        if (f674k == this) {
            f(null);
        }
        this.f676a.removeCallbacks(this.f680e);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public void h(boolean z3) {
        long longPressTimeout;
        long j4;
        long j5;
        if (androidx.core.view.v.v(this.f676a)) {
            f(null);
            s0 s0Var = f675l;
            if (s0Var != null) {
                s0Var.d();
            }
            f675l = this;
            this.f684i = z3;
            t0 t0Var = new t0(this.f676a.getContext());
            this.f683h = t0Var;
            t0Var.e(this.f676a, this.f681f, this.f682g, this.f684i, this.f677b);
            this.f676a.addOnAttachStateChangeListener(this);
            if (this.f684i) {
                j5 = 2500;
            } else {
                if ((androidx.core.view.v.t(this.f676a) & 1) == 1) {
                    longPressTimeout = ViewConfiguration.getLongPressTimeout();
                    j4 = 3000;
                } else {
                    longPressTimeout = ViewConfiguration.getLongPressTimeout();
                    j4 = 15000;
                }
                j5 = j4 - longPressTimeout;
            }
            this.f676a.removeCallbacks(this.f680e);
            this.f676a.postDelayed(this.f680e, j5);
        }
    }

    @Override // android.view.View.OnHoverListener
    public boolean onHover(View view, MotionEvent motionEvent) {
        if (this.f683h != null && this.f684i) {
            return false;
        }
        AccessibilityManager accessibilityManager = (AccessibilityManager) this.f676a.getContext().getSystemService("accessibility");
        if (accessibilityManager.isEnabled() && accessibilityManager.isTouchExplorationEnabled()) {
            return false;
        }
        int action = motionEvent.getAction();
        if (action != 7) {
            if (action == 10) {
                c();
                d();
            }
        } else if (this.f676a.isEnabled() && this.f683h == null && i(motionEvent)) {
            f(this);
        }
        return false;
    }

    @Override // android.view.View.OnLongClickListener
    public boolean onLongClick(View view) {
        this.f681f = view.getWidth() / 2;
        this.f682g = view.getHeight() / 2;
        h(true);
        return true;
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public void onViewAttachedToWindow(View view) {
    }

    @Override // android.view.View.OnAttachStateChangeListener
    public void onViewDetachedFromWindow(View view) {
        d();
    }
}
