package androidx.appcompat.widget;

import android.R;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewPropertyAnimator;
import android.view.Window;
import android.view.WindowInsets;
import android.widget.OverScroller;
import androidx.core.view.a0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ActionBarOverlayLayout extends ViewGroup implements androidx.core.view.o, androidx.core.view.p {
    static final int[] E = {c.a.f1830b, R.attr.windowContentOverlay};
    final AnimatorListenerAdapter A;
    private final Runnable B;
    private final Runnable C;
    private final androidx.core.view.q D;

    /* renamed from: a, reason: collision with root package name */
    private int f323a;

    /* renamed from: b, reason: collision with root package name */
    private int f324b;

    /* renamed from: c, reason: collision with root package name */
    private ContentFrameLayout f325c;

    /* renamed from: d, reason: collision with root package name */
    ActionBarContainer f326d;

    /* renamed from: e, reason: collision with root package name */
    private t f327e;

    /* renamed from: f, reason: collision with root package name */
    private Drawable f328f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f329g;

    /* renamed from: h, reason: collision with root package name */
    private boolean f330h;

    /* renamed from: i, reason: collision with root package name */
    private boolean f331i;

    /* renamed from: j, reason: collision with root package name */
    private boolean f332j;

    /* renamed from: k, reason: collision with root package name */
    boolean f333k;

    /* renamed from: l, reason: collision with root package name */
    private int f334l;

    /* renamed from: m, reason: collision with root package name */
    private int f335m;

    /* renamed from: n, reason: collision with root package name */
    private final Rect f336n;

    /* renamed from: o, reason: collision with root package name */
    private final Rect f337o;

    /* renamed from: p, reason: collision with root package name */
    private final Rect f338p;

    /* renamed from: q, reason: collision with root package name */
    private final Rect f339q;

    /* renamed from: r, reason: collision with root package name */
    private final Rect f340r;

    /* renamed from: s, reason: collision with root package name */
    private final Rect f341s;

    /* renamed from: t, reason: collision with root package name */
    private final Rect f342t;

    /* renamed from: u, reason: collision with root package name */
    private androidx.core.view.a0 f343u;

    /* renamed from: v, reason: collision with root package name */
    private androidx.core.view.a0 f344v;

    /* renamed from: w, reason: collision with root package name */
    private androidx.core.view.a0 f345w;

    /* renamed from: x, reason: collision with root package name */
    private androidx.core.view.a0 f346x;

    /* renamed from: y, reason: collision with root package name */
    private OverScroller f347y;

    /* renamed from: z, reason: collision with root package name */
    ViewPropertyAnimator f348z;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends AnimatorListenerAdapter {
        a() {
        }

        @Override // android.animation.AnimatorListenerAdapter, android.animation.Animator.AnimatorListener
        public void onAnimationCancel(Animator animator) {
            ActionBarOverlayLayout actionBarOverlayLayout = ActionBarOverlayLayout.this;
            actionBarOverlayLayout.f348z = null;
            actionBarOverlayLayout.f333k = false;
        }

        @Override // android.animation.AnimatorListenerAdapter, android.animation.Animator.AnimatorListener
        public void onAnimationEnd(Animator animator) {
            ActionBarOverlayLayout actionBarOverlayLayout = ActionBarOverlayLayout.this;
            actionBarOverlayLayout.f348z = null;
            actionBarOverlayLayout.f333k = false;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            ActionBarOverlayLayout.this.l();
            ActionBarOverlayLayout actionBarOverlayLayout = ActionBarOverlayLayout.this;
            actionBarOverlayLayout.f348z = actionBarOverlayLayout.f326d.animate().translationY(0.0f).setListener(ActionBarOverlayLayout.this.A);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements Runnable {
        c() {
        }

        @Override // java.lang.Runnable
        public void run() {
            ActionBarOverlayLayout.this.l();
            ActionBarOverlayLayout actionBarOverlayLayout = ActionBarOverlayLayout.this;
            actionBarOverlayLayout.f348z = actionBarOverlayLayout.f326d.animate().translationY(-ActionBarOverlayLayout.this.f326d.getHeight()).setListener(ActionBarOverlayLayout.this.A);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface d {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class e extends ViewGroup.MarginLayoutParams {
        public e(int i4, int i5) {
            super(i4, i5);
        }

        public e(Context context, AttributeSet attributeSet) {
            super(context, attributeSet);
        }

        public e(ViewGroup.LayoutParams layoutParams) {
            super(layoutParams);
        }
    }

    public ActionBarOverlayLayout(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        this.f324b = 0;
        this.f336n = new Rect();
        this.f337o = new Rect();
        this.f338p = new Rect();
        this.f339q = new Rect();
        this.f340r = new Rect();
        this.f341s = new Rect();
        this.f342t = new Rect();
        androidx.core.view.a0 a0Var = androidx.core.view.a0.f1001b;
        this.f343u = a0Var;
        this.f344v = a0Var;
        this.f345w = a0Var;
        this.f346x = a0Var;
        this.A = new a();
        this.B = new b();
        this.C = new c();
        m(context);
        this.D = new androidx.core.view.q(this);
    }

    private void g() {
        l();
        this.C.run();
    }

    /* JADX WARN: Removed duplicated region for block: B:11:0x0021  */
    /* JADX WARN: Removed duplicated region for block: B:15:0x002c  */
    /* JADX WARN: Removed duplicated region for block: B:7:0x0016  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private boolean h(android.view.View r3, android.graphics.Rect r4, boolean r5, boolean r6, boolean r7, boolean r8) {
        /*
            r2 = this;
            android.view.ViewGroup$LayoutParams r3 = r3.getLayoutParams()
            androidx.appcompat.widget.ActionBarOverlayLayout$e r3 = (androidx.appcompat.widget.ActionBarOverlayLayout.e) r3
            r0 = 1
            if (r5 == 0) goto L13
            int r5 = r3.leftMargin
            int r1 = r4.left
            if (r5 == r1) goto L13
            r3.leftMargin = r1
            r5 = r0
            goto L14
        L13:
            r5 = 0
        L14:
            if (r6 == 0) goto L1f
            int r6 = r3.topMargin
            int r1 = r4.top
            if (r6 == r1) goto L1f
            r3.topMargin = r1
            r5 = r0
        L1f:
            if (r8 == 0) goto L2a
            int r6 = r3.rightMargin
            int r8 = r4.right
            if (r6 == r8) goto L2a
            r3.rightMargin = r8
            r5 = r0
        L2a:
            if (r7 == 0) goto L35
            int r6 = r3.bottomMargin
            int r4 = r4.bottom
            if (r6 == r4) goto L35
            r3.bottomMargin = r4
            return r0
        L35:
            return r5
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.ActionBarOverlayLayout.h(android.view.View, android.graphics.Rect, boolean, boolean, boolean, boolean):boolean");
    }

    /* JADX WARN: Multi-variable type inference failed */
    private t k(View view) {
        if (view instanceof t) {
            return (t) view;
        }
        if (view instanceof Toolbar) {
            return ((Toolbar) view).getWrapper();
        }
        throw new IllegalStateException("Can't make a decor toolbar out of " + view.getClass().getSimpleName());
    }

    private void m(Context context) {
        TypedArray obtainStyledAttributes = getContext().getTheme().obtainStyledAttributes(E);
        this.f323a = obtainStyledAttributes.getDimensionPixelSize(0, 0);
        Drawable drawable = obtainStyledAttributes.getDrawable(1);
        this.f328f = drawable;
        setWillNotDraw(drawable == null);
        obtainStyledAttributes.recycle();
        this.f329g = context.getApplicationInfo().targetSdkVersion < 19;
        this.f347y = new OverScroller(context);
    }

    private void n() {
        l();
        postDelayed(this.C, 600L);
    }

    private void o() {
        l();
        postDelayed(this.B, 600L);
    }

    private void q() {
        l();
        this.B.run();
    }

    private boolean r(float f4) {
        this.f347y.fling(0, 0, 0, (int) f4, 0, 0, Integer.MIN_VALUE, Integer.MAX_VALUE);
        return this.f347y.getFinalY() > this.f326d.getHeight();
    }

    @Override // androidx.core.view.o
    public void a(View view, View view2, int i4, int i5) {
        if (i5 == 0) {
            onNestedScrollAccepted(view, view2, i4);
        }
    }

    @Override // androidx.core.view.o
    public void b(View view, int i4) {
        if (i4 == 0) {
            onStopNestedScroll(view);
        }
    }

    @Override // androidx.core.view.o
    public void c(View view, int i4, int i5, int[] iArr, int i6) {
        if (i6 == 0) {
            onNestedPreScroll(view, i4, i5, iArr);
        }
    }

    @Override // android.view.ViewGroup
    protected boolean checkLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return layoutParams instanceof e;
    }

    @Override // androidx.core.view.p
    public void d(View view, int i4, int i5, int i6, int i7, int i8, int[] iArr) {
        e(view, i4, i5, i6, i7, i8);
    }

    @Override // android.view.View
    public void draw(Canvas canvas) {
        super.draw(canvas);
        if (this.f328f == null || this.f329g) {
            return;
        }
        int bottom = this.f326d.getVisibility() == 0 ? (int) (this.f326d.getBottom() + this.f326d.getTranslationY() + 0.5f) : 0;
        this.f328f.setBounds(0, bottom, getWidth(), this.f328f.getIntrinsicHeight() + bottom);
        this.f328f.draw(canvas);
    }

    @Override // androidx.core.view.o
    public void e(View view, int i4, int i5, int i6, int i7, int i8) {
        if (i8 == 0) {
            onNestedScroll(view, i4, i5, i6, i7);
        }
    }

    @Override // androidx.core.view.o
    public boolean f(View view, View view2, int i4, int i5) {
        return i5 == 0 && onStartNestedScroll(view, view2, i4);
    }

    @Override // android.view.View
    protected boolean fitSystemWindows(Rect rect) {
        return super.fitSystemWindows(rect);
    }

    @Override // android.view.ViewGroup
    protected ViewGroup.LayoutParams generateLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return new e(layoutParams);
    }

    public int getActionBarHideOffset() {
        ActionBarContainer actionBarContainer = this.f326d;
        if (actionBarContainer != null) {
            return -((int) actionBarContainer.getTranslationY());
        }
        return 0;
    }

    @Override // android.view.ViewGroup
    public int getNestedScrollAxes() {
        return this.D.a();
    }

    public CharSequence getTitle() {
        p();
        return this.f327e.getTitle();
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.view.ViewGroup
    /* renamed from: i, reason: merged with bridge method [inline-methods] */
    public e generateDefaultLayoutParams() {
        return new e(-1, -1);
    }

    @Override // android.view.ViewGroup
    /* renamed from: j, reason: merged with bridge method [inline-methods] */
    public e generateLayoutParams(AttributeSet attributeSet) {
        return new e(getContext(), attributeSet);
    }

    void l() {
        removeCallbacks(this.B);
        removeCallbacks(this.C);
        ViewPropertyAnimator viewPropertyAnimator = this.f348z;
        if (viewPropertyAnimator != null) {
            viewPropertyAnimator.cancel();
        }
    }

    @Override // android.view.View
    public WindowInsets onApplyWindowInsets(WindowInsets windowInsets) {
        p();
        androidx.core.view.a0 u3 = androidx.core.view.a0.u(windowInsets, this);
        boolean h4 = h(this.f326d, new Rect(u3.i(), u3.k(), u3.j(), u3.h()), true, true, false, true);
        androidx.core.view.v.b(this, u3, this.f336n);
        Rect rect = this.f336n;
        androidx.core.view.a0 l3 = u3.l(rect.left, rect.top, rect.right, rect.bottom);
        this.f343u = l3;
        boolean z3 = true;
        if (!this.f344v.equals(l3)) {
            this.f344v = this.f343u;
            h4 = true;
        }
        if (this.f337o.equals(this.f336n)) {
            z3 = h4;
        } else {
            this.f337o.set(this.f336n);
        }
        if (z3) {
            requestLayout();
        }
        return u3.a().c().b().s();
    }

    @Override // android.view.View
    protected void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);
        m(getContext());
        androidx.core.view.v.E(this);
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        l();
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        int childCount = getChildCount();
        int paddingLeft = getPaddingLeft();
        int paddingTop = getPaddingTop();
        for (int i8 = 0; i8 < childCount; i8++) {
            View childAt = getChildAt(i8);
            if (childAt.getVisibility() != 8) {
                e eVar = (e) childAt.getLayoutParams();
                int measuredWidth = childAt.getMeasuredWidth();
                int measuredHeight = childAt.getMeasuredHeight();
                int i9 = ((ViewGroup.MarginLayoutParams) eVar).leftMargin + paddingLeft;
                int i10 = ((ViewGroup.MarginLayoutParams) eVar).topMargin + paddingTop;
                childAt.layout(i9, i10, measuredWidth + i9, measuredHeight + i10);
            }
        }
    }

    @Override // android.view.View
    protected void onMeasure(int i4, int i5) {
        int measuredHeight;
        p();
        measureChildWithMargins(this.f326d, i4, 0, i5, 0);
        e eVar = (e) this.f326d.getLayoutParams();
        int max = Math.max(0, this.f326d.getMeasuredWidth() + ((ViewGroup.MarginLayoutParams) eVar).leftMargin + ((ViewGroup.MarginLayoutParams) eVar).rightMargin);
        int max2 = Math.max(0, this.f326d.getMeasuredHeight() + ((ViewGroup.MarginLayoutParams) eVar).topMargin + ((ViewGroup.MarginLayoutParams) eVar).bottomMargin);
        int combineMeasuredStates = View.combineMeasuredStates(0, this.f326d.getMeasuredState());
        boolean z3 = (androidx.core.view.v.t(this) & 256) != 0;
        if (z3) {
            measuredHeight = this.f323a;
            if (this.f331i && this.f326d.getTabContainer() != null) {
                measuredHeight += this.f323a;
            }
        } else {
            measuredHeight = this.f326d.getVisibility() != 8 ? this.f326d.getMeasuredHeight() : 0;
        }
        this.f338p.set(this.f336n);
        androidx.core.view.a0 a0Var = this.f343u;
        this.f345w = a0Var;
        if (this.f330h || z3) {
            this.f345w = new a0.b(this.f345w).c(androidx.core.graphics.f.b(a0Var.i(), this.f345w.k() + measuredHeight, this.f345w.j(), this.f345w.h())).a();
        } else {
            Rect rect = this.f338p;
            rect.top += measuredHeight;
            rect.bottom = rect.bottom;
            this.f345w = a0Var.l(0, measuredHeight, 0, 0);
        }
        h(this.f325c, this.f338p, true, true, true, true);
        if (!this.f346x.equals(this.f345w)) {
            androidx.core.view.a0 a0Var2 = this.f345w;
            this.f346x = a0Var2;
            androidx.core.view.v.c(this.f325c, a0Var2);
        }
        measureChildWithMargins(this.f325c, i4, 0, i5, 0);
        e eVar2 = (e) this.f325c.getLayoutParams();
        int max3 = Math.max(max, this.f325c.getMeasuredWidth() + ((ViewGroup.MarginLayoutParams) eVar2).leftMargin + ((ViewGroup.MarginLayoutParams) eVar2).rightMargin);
        int max4 = Math.max(max2, this.f325c.getMeasuredHeight() + ((ViewGroup.MarginLayoutParams) eVar2).topMargin + ((ViewGroup.MarginLayoutParams) eVar2).bottomMargin);
        int combineMeasuredStates2 = View.combineMeasuredStates(combineMeasuredStates, this.f325c.getMeasuredState());
        setMeasuredDimension(View.resolveSizeAndState(Math.max(max3 + getPaddingLeft() + getPaddingRight(), getSuggestedMinimumWidth()), i4, combineMeasuredStates2), View.resolveSizeAndState(Math.max(max4 + getPaddingTop() + getPaddingBottom(), getSuggestedMinimumHeight()), i5, combineMeasuredStates2 << 16));
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean onNestedFling(View view, float f4, float f5, boolean z3) {
        if (!this.f332j || !z3) {
            return false;
        }
        if (r(f5)) {
            g();
        } else {
            q();
        }
        this.f333k = true;
        return true;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean onNestedPreFling(View view, float f4, float f5) {
        return false;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onNestedPreScroll(View view, int i4, int i5, int[] iArr) {
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onNestedScroll(View view, int i4, int i5, int i6, int i7) {
        int i8 = this.f334l + i5;
        this.f334l = i8;
        setActionBarHideOffset(i8);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onNestedScrollAccepted(View view, View view2, int i4) {
        this.D.b(view, view2, i4);
        this.f334l = getActionBarHideOffset();
        l();
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean onStartNestedScroll(View view, View view2, int i4) {
        if ((i4 & 2) == 0 || this.f326d.getVisibility() != 0) {
            return false;
        }
        return this.f332j;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onStopNestedScroll(View view) {
        if (!this.f332j || this.f333k) {
            return;
        }
        if (this.f334l <= this.f326d.getHeight()) {
            o();
        } else {
            n();
        }
    }

    @Override // android.view.View
    public void onWindowSystemUiVisibilityChanged(int i4) {
        super.onWindowSystemUiVisibilityChanged(i4);
        p();
        this.f335m = i4;
    }

    @Override // android.view.View
    protected void onWindowVisibilityChanged(int i4) {
        super.onWindowVisibilityChanged(i4);
        this.f324b = i4;
    }

    void p() {
        if (this.f325c == null) {
            this.f325c = (ContentFrameLayout) findViewById(c.e.f1894b);
            this.f326d = (ActionBarContainer) findViewById(c.e.f1895c);
            this.f327e = k(findViewById(c.e.f1893a));
        }
    }

    public void setActionBarHideOffset(int i4) {
        l();
        this.f326d.setTranslationY(-Math.max(0, Math.min(i4, this.f326d.getHeight())));
    }

    public void setActionBarVisibilityCallback(d dVar) {
        if (getWindowToken() != null) {
            throw null;
        }
    }

    public void setHasNonEmbeddedTabs(boolean z3) {
        this.f331i = z3;
    }

    public void setHideOnContentScrollEnabled(boolean z3) {
        if (z3 != this.f332j) {
            this.f332j = z3;
            if (z3) {
                return;
            }
            l();
            setActionBarHideOffset(0);
        }
    }

    public void setIcon(int i4) {
        p();
        this.f327e.setIcon(i4);
    }

    public void setIcon(Drawable drawable) {
        p();
        this.f327e.setIcon(drawable);
    }

    public void setLogo(int i4) {
        p();
        this.f327e.c(i4);
    }

    public void setOverlayMode(boolean z3) {
        this.f330h = z3;
        this.f329g = z3 && getContext().getApplicationInfo().targetSdkVersion < 19;
    }

    public void setShowingForActionMode(boolean z3) {
    }

    public void setUiOptions(int i4) {
    }

    public void setWindowCallback(Window.Callback callback) {
        p();
        this.f327e.b(callback);
    }

    public void setWindowTitle(CharSequence charSequence) {
        p();
        this.f327e.a(charSequence);
    }

    @Override // android.view.ViewGroup
    public boolean shouldDelayChildPressedState() {
        return false;
    }
}
