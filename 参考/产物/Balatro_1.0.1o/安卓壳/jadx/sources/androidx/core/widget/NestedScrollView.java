package androidx.core.widget;

import a1.b2.c3;
import android.R;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;
import android.util.AttributeSet;
import android.util.Log;
import android.util.TypedValue;
import android.view.FocusFinder;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.accessibility.AccessibilityEvent;
import android.view.animation.AnimationUtils;
import android.widget.EdgeEffect;
import android.widget.FrameLayout;
import android.widget.OverScroller;
import android.widget.ScrollView;
import androidx.core.view.accessibility.t;
import androidx.core.view.accessibility.v;
import androidx.core.view.m;
import androidx.core.view.n;
import androidx.core.view.p;
import androidx.core.view.q;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class NestedScrollView extends FrameLayout implements p {
    private static final float A = (float) (Math.log(0.78d) / Math.log(0.9d));
    private static final a B = new a();
    private static final int[] C = {R.attr.fillViewport};

    /* renamed from: a, reason: collision with root package name */
    private final float f1105a;

    /* renamed from: b, reason: collision with root package name */
    private long f1106b;

    /* renamed from: c, reason: collision with root package name */
    private final Rect f1107c;

    /* renamed from: d, reason: collision with root package name */
    private OverScroller f1108d;

    /* renamed from: e, reason: collision with root package name */
    public EdgeEffect f1109e;

    /* renamed from: f, reason: collision with root package name */
    public EdgeEffect f1110f;

    /* renamed from: g, reason: collision with root package name */
    private int f1111g;

    /* renamed from: h, reason: collision with root package name */
    private boolean f1112h;

    /* renamed from: i, reason: collision with root package name */
    private boolean f1113i;

    /* renamed from: j, reason: collision with root package name */
    private View f1114j;

    /* renamed from: k, reason: collision with root package name */
    private boolean f1115k;

    /* renamed from: l, reason: collision with root package name */
    private VelocityTracker f1116l;

    /* renamed from: m, reason: collision with root package name */
    private boolean f1117m;

    /* renamed from: n, reason: collision with root package name */
    private boolean f1118n;

    /* renamed from: o, reason: collision with root package name */
    private int f1119o;

    /* renamed from: p, reason: collision with root package name */
    private int f1120p;

    /* renamed from: q, reason: collision with root package name */
    private int f1121q;

    /* renamed from: r, reason: collision with root package name */
    private int f1122r;

    /* renamed from: s, reason: collision with root package name */
    private final int[] f1123s;

    /* renamed from: t, reason: collision with root package name */
    private final int[] f1124t;

    /* renamed from: u, reason: collision with root package name */
    private int f1125u;

    /* renamed from: v, reason: collision with root package name */
    private int f1126v;

    /* renamed from: w, reason: collision with root package name */
    private d f1127w;

    /* renamed from: x, reason: collision with root package name */
    private final q f1128x;

    /* renamed from: y, reason: collision with root package name */
    private final n f1129y;

    /* renamed from: z, reason: collision with root package name */
    private float f1130z;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a extends androidx.core.view.a {
        a() {
        }

        @Override // androidx.core.view.a
        public void f(View view, AccessibilityEvent accessibilityEvent) {
            super.f(view, accessibilityEvent);
            NestedScrollView nestedScrollView = (NestedScrollView) view;
            accessibilityEvent.setClassName(ScrollView.class.getName());
            accessibilityEvent.setScrollable(nestedScrollView.getScrollRange() > 0);
            accessibilityEvent.setScrollX(nestedScrollView.getScrollX());
            accessibilityEvent.setScrollY(nestedScrollView.getScrollY());
            v.a(accessibilityEvent, nestedScrollView.getScrollX());
            v.b(accessibilityEvent, nestedScrollView.getScrollRange());
        }

        @Override // androidx.core.view.a
        public void g(View view, t tVar) {
            int scrollRange;
            super.g(view, tVar);
            NestedScrollView nestedScrollView = (NestedScrollView) view;
            tVar.I(ScrollView.class.getName());
            if (!nestedScrollView.isEnabled() || (scrollRange = nestedScrollView.getScrollRange()) <= 0) {
                return;
            }
            tVar.M(true);
            if (nestedScrollView.getScrollY() > 0) {
                tVar.a(t.a.f1054q);
                tVar.a(t.a.B);
            }
            if (nestedScrollView.getScrollY() < scrollRange) {
                tVar.a(t.a.f1053p);
                tVar.a(t.a.D);
            }
        }

        @Override // androidx.core.view.a
        public boolean j(View view, int i4, Bundle bundle) {
            if (super.j(view, i4, bundle)) {
                return true;
            }
            NestedScrollView nestedScrollView = (NestedScrollView) view;
            if (!nestedScrollView.isEnabled()) {
                return false;
            }
            int height = nestedScrollView.getHeight();
            Rect rect = new Rect();
            if (nestedScrollView.getMatrix().isIdentity() && nestedScrollView.getGlobalVisibleRect(rect)) {
                height = rect.height();
            }
            if (i4 != 4096) {
                if (i4 == 8192 || i4 == 16908344) {
                    int max = Math.max(nestedScrollView.getScrollY() - ((height - nestedScrollView.getPaddingBottom()) - nestedScrollView.getPaddingTop()), 0);
                    if (max == nestedScrollView.getScrollY()) {
                        return false;
                    }
                    nestedScrollView.T(0, max, true);
                    return true;
                }
                if (i4 != 16908346) {
                    return false;
                }
            }
            int min = Math.min(nestedScrollView.getScrollY() + ((height - nestedScrollView.getPaddingBottom()) - nestedScrollView.getPaddingTop()), nestedScrollView.getScrollRange());
            if (min == nestedScrollView.getScrollY()) {
                return false;
            }
            nestedScrollView.T(0, min, true);
            return true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static boolean a(ViewGroup viewGroup) {
            return viewGroup.getClipToPadding();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface c {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class d extends View.BaseSavedState {
        public static final Parcelable.Creator<d> CREATOR = new a();

        /* renamed from: e, reason: collision with root package name */
        public int f1131e;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Parcelable.Creator {
            a() {
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: a, reason: merged with bridge method [inline-methods] */
            public d createFromParcel(Parcel parcel) {
                return new d(parcel);
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: b, reason: merged with bridge method [inline-methods] */
            public d[] newArray(int i4) {
                return new d[i4];
            }
        }

        d(Parcel parcel) {
            super(parcel);
            this.f1131e = parcel.readInt();
        }

        d(Parcelable parcelable) {
            super(parcelable);
        }

        public String toString() {
            return "HorizontalScrollView.SavedState{" + Integer.toHexString(System.identityHashCode(this)) + " scrollPosition=" + this.f1131e + "}";
        }

        @Override // android.view.View.BaseSavedState, android.view.AbsSavedState, android.os.Parcelable
        public void writeToParcel(Parcel parcel, int i4) {
            super.writeToParcel(parcel, i4);
            parcel.writeInt(this.f1131e);
        }
    }

    public NestedScrollView(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, l.a.f4062c);
    }

    public NestedScrollView(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f1107c = new Rect();
        this.f1112h = true;
        this.f1113i = false;
        this.f1114j = null;
        this.f1115k = false;
        this.f1118n = true;
        this.f1122r = -1;
        this.f1123s = new int[2];
        this.f1124t = new int[2];
        this.f1109e = androidx.core.widget.b.a(context, attributeSet);
        this.f1110f = androidx.core.widget.b.a(context, attributeSet);
        this.f1105a = context.getResources().getDisplayMetrics().density * 160.0f * 386.0878f * 0.84f;
        A();
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, C, i4, 0);
        setFillViewport(obtainStyledAttributes.getBoolean(0, false));
        obtainStyledAttributes.recycle();
        this.f1128x = new q(this);
        this.f1129y = new n(this);
        setNestedScrollingEnabled(true);
        androidx.core.view.v.H(this, B);
    }

    private void A() {
        this.f1108d = new OverScroller(getContext());
        setFocusable(true);
        setDescendantFocusability(262144);
        setWillNotDraw(false);
        ViewConfiguration viewConfiguration = ViewConfiguration.get(getContext());
        this.f1119o = viewConfiguration.getScaledTouchSlop();
        this.f1120p = viewConfiguration.getScaledMinimumFlingVelocity();
        this.f1121q = viewConfiguration.getScaledMaximumFlingVelocity();
    }

    private void B() {
        if (this.f1116l == null) {
            this.f1116l = VelocityTracker.obtain();
        }
    }

    private boolean C(View view) {
        return !E(view, 0, getHeight());
    }

    private static boolean D(View view, View view2) {
        if (view == view2) {
            return true;
        }
        Object parent = view.getParent();
        return (parent instanceof ViewGroup) && D((View) parent, view2);
    }

    private boolean E(View view, int i4, int i5) {
        view.getDrawingRect(this.f1107c);
        offsetDescendantRectToMyCoords(view, this.f1107c);
        return this.f1107c.bottom + i4 >= getScrollY() && this.f1107c.top - i4 <= getScrollY() + i5;
    }

    private void F(int i4, int i5, int[] iArr) {
        int scrollY = getScrollY();
        scrollBy(0, i4);
        int scrollY2 = getScrollY() - scrollY;
        if (iArr != null) {
            iArr[1] = iArr[1] + scrollY2;
        }
        this.f1129y.d(0, scrollY2, 0, i4 - scrollY2, null, i5, iArr);
    }

    private void G(MotionEvent motionEvent) {
        int actionIndex = motionEvent.getActionIndex();
        if (motionEvent.getPointerId(actionIndex) == this.f1122r) {
            int i4 = actionIndex == 0 ? 1 : 0;
            this.f1111g = (int) motionEvent.getY(i4);
            this.f1122r = motionEvent.getPointerId(i4);
            VelocityTracker velocityTracker = this.f1116l;
            if (velocityTracker != null) {
                velocityTracker.clear();
            }
        }
    }

    private void J() {
        VelocityTracker velocityTracker = this.f1116l;
        if (velocityTracker != null) {
            velocityTracker.recycle();
            this.f1116l = null;
        }
    }

    /* JADX WARN: Removed duplicated region for block: B:9:0x0060  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private int K(int r4, float r5) {
        /*
            r3 = this;
            int r0 = r3.getWidth()
            float r0 = (float) r0
            float r5 = r5 / r0
            float r4 = (float) r4
            int r0 = r3.getHeight()
            float r0 = (float) r0
            float r4 = r4 / r0
            android.widget.EdgeEffect r0 = r3.f1109e
            float r0 = androidx.core.widget.b.b(r0)
            r1 = 0
            int r0 = (r0 > r1 ? 1 : (r0 == r1 ? 0 : -1))
            if (r0 == 0) goto L31
            android.widget.EdgeEffect r0 = r3.f1109e
            float r4 = -r4
            float r4 = androidx.core.widget.b.d(r0, r4, r5)
            float r4 = -r4
            android.widget.EdgeEffect r5 = r3.f1109e
            float r5 = androidx.core.widget.b.b(r5)
            int r5 = (r5 > r1 ? 1 : (r5 == r1 ? 0 : -1))
            if (r5 != 0) goto L2f
            android.widget.EdgeEffect r5 = r3.f1109e
            r5.onRelease()
        L2f:
            r1 = r4
            goto L54
        L31:
            android.widget.EdgeEffect r0 = r3.f1110f
            float r0 = androidx.core.widget.b.b(r0)
            int r0 = (r0 > r1 ? 1 : (r0 == r1 ? 0 : -1))
            if (r0 == 0) goto L54
            android.widget.EdgeEffect r0 = r3.f1110f
            r2 = 1065353216(0x3f800000, float:1.0)
            float r2 = r2 - r5
            float r4 = androidx.core.widget.b.d(r0, r4, r2)
            android.widget.EdgeEffect r5 = r3.f1110f
            float r5 = androidx.core.widget.b.b(r5)
            int r5 = (r5 > r1 ? 1 : (r5 == r1 ? 0 : -1))
            if (r5 != 0) goto L2f
            android.widget.EdgeEffect r5 = r3.f1110f
            r5.onRelease()
            goto L2f
        L54:
            int r4 = r3.getHeight()
            float r4 = (float) r4
            float r1 = r1 * r4
            int r4 = java.lang.Math.round(r1)
            if (r4 == 0) goto L63
            r3.invalidate()
        L63:
            return r4
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.widget.NestedScrollView.K(int, float):int");
    }

    private void L(boolean z3) {
        if (z3) {
            U(2, 1);
        } else {
            W(1);
        }
        this.f1126v = getScrollY();
        androidx.core.view.v.B(this);
    }

    private boolean M(int i4, int i5, int i6) {
        int height = getHeight();
        int scrollY = getScrollY();
        int i7 = height + scrollY;
        boolean z3 = false;
        boolean z4 = i4 == 33;
        View t3 = t(z4, i5, i6);
        if (t3 == null) {
            t3 = this;
        }
        if (i5 < scrollY || i6 > i7) {
            p(z4 ? i5 - scrollY : i6 - i7);
            z3 = true;
        }
        if (t3 != findFocus()) {
            t3.requestFocus(i4);
        }
        return z3;
    }

    private void N(View view) {
        view.getDrawingRect(this.f1107c);
        offsetDescendantRectToMyCoords(view, this.f1107c);
        int l3 = l(this.f1107c);
        if (l3 != 0) {
            scrollBy(0, l3);
        }
    }

    private boolean O(Rect rect, boolean z3) {
        int l3 = l(rect);
        boolean z4 = l3 != 0;
        if (z4) {
            if (z3) {
                scrollBy(0, l3);
                return z4;
            }
            Q(0, l3);
        }
        return z4;
    }

    private boolean P(EdgeEffect edgeEffect, int i4) {
        if (i4 > 0) {
            return true;
        }
        return w(-i4) < androidx.core.widget.b.b(edgeEffect) * ((float) getHeight());
    }

    private void R(int i4, int i5, int i6, boolean z3) {
        if (getChildCount() == 0) {
            return;
        }
        if (AnimationUtils.currentAnimationTimeMillis() - this.f1106b > 250) {
            View childAt = getChildAt(0);
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
            int height = childAt.getHeight() + layoutParams.topMargin + layoutParams.bottomMargin;
            int height2 = (getHeight() - getPaddingTop()) - getPaddingBottom();
            int scrollY = getScrollY();
            this.f1108d.startScroll(getScrollX(), scrollY, 0, Math.max(0, Math.min(i5 + scrollY, Math.max(0, height - height2))) - scrollY, i6);
            L(z3);
        } else {
            if (!this.f1108d.isFinished()) {
                g();
            }
            scrollBy(i4, i5);
        }
        this.f1106b = AnimationUtils.currentAnimationTimeMillis();
    }

    private boolean V(MotionEvent motionEvent) {
        boolean z3;
        if (androidx.core.widget.b.b(this.f1109e) != 0.0f) {
            androidx.core.widget.b.d(this.f1109e, 0.0f, motionEvent.getX() / getWidth());
            z3 = true;
        } else {
            z3 = false;
        }
        if (androidx.core.widget.b.b(this.f1110f) == 0.0f) {
            return z3;
        }
        androidx.core.widget.b.d(this.f1110f, 0.0f, 1.0f - (motionEvent.getX() / getWidth()));
        return true;
    }

    private void g() {
        this.f1108d.abortAnimation();
        W(1);
    }

    private float getVerticalScrollFactorCompat() {
        if (this.f1130z == 0.0f) {
            TypedValue typedValue = new TypedValue();
            Context context = getContext();
            if (!context.getTheme().resolveAttribute(R.attr.listPreferredItemHeight, typedValue, true)) {
                throw new IllegalStateException("Expected theme to define listPreferredItemHeight.");
            }
            this.f1130z = typedValue.getDimension(context.getResources().getDisplayMetrics());
        }
        return this.f1130z;
    }

    private boolean i() {
        int overScrollMode = getOverScrollMode();
        return overScrollMode == 0 || (overScrollMode == 1 && getScrollRange() > 0);
    }

    private boolean j() {
        if (getChildCount() > 0) {
            View childAt = getChildAt(0);
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
            if (childAt.getHeight() + layoutParams.topMargin + layoutParams.bottomMargin > (getHeight() - getPaddingTop()) - getPaddingBottom()) {
                return true;
            }
        }
        return false;
    }

    private static int k(int i4, int i5, int i6) {
        if (i5 >= i6 || i4 < 0) {
            return 0;
        }
        return i5 + i4 > i6 ? i6 - i5 : i4;
    }

    private void p(int i4) {
        if (i4 != 0) {
            if (this.f1118n) {
                Q(0, i4);
            } else {
                scrollBy(0, i4);
            }
        }
    }

    private boolean q(int i4) {
        if (androidx.core.widget.b.b(this.f1109e) != 0.0f) {
            if (P(this.f1109e, i4)) {
                this.f1109e.onAbsorb(i4);
                return true;
            }
            u(-i4);
            return true;
        }
        if (androidx.core.widget.b.b(this.f1110f) == 0.0f) {
            return false;
        }
        int i5 = -i4;
        if (P(this.f1110f, i5)) {
            this.f1110f.onAbsorb(i5);
            return true;
        }
        u(i5);
        return true;
    }

    private void r() {
        this.f1115k = false;
        J();
        W(0);
        this.f1109e.onRelease();
        this.f1110f.onRelease();
    }

    private View t(boolean z3, int i4, int i5) {
        ArrayList<View> focusables = getFocusables(2);
        int size = focusables.size();
        View view = null;
        boolean z4 = false;
        for (int i6 = 0; i6 < size; i6++) {
            View view2 = focusables.get(i6);
            int top = view2.getTop();
            int bottom = view2.getBottom();
            if (i4 < bottom && top < i5) {
                boolean z5 = i4 < top && bottom < i5;
                if (view == null) {
                    view = view2;
                    z4 = z5;
                } else {
                    boolean z6 = (z3 && top < view.getTop()) || (!z3 && bottom > view.getBottom());
                    if (z4) {
                        if (z5) {
                            if (!z6) {
                            }
                            view = view2;
                        }
                    } else if (z5) {
                        view = view2;
                        z4 = true;
                    } else {
                        if (!z6) {
                        }
                        view = view2;
                    }
                }
            }
        }
        return view;
    }

    private float w(int i4) {
        double log = Math.log((Math.abs(i4) * 0.35f) / (this.f1105a * 0.015f));
        float f4 = A;
        return (float) (this.f1105a * 0.015f * Math.exp((f4 / (f4 - 1.0d)) * log));
    }

    private boolean y(int i4, int i5) {
        if (getChildCount() > 0) {
            int scrollY = getScrollY();
            View childAt = getChildAt(0);
            if (i5 >= childAt.getTop() - scrollY && i5 < childAt.getBottom() - scrollY && i4 >= childAt.getLeft() && i4 < childAt.getRight()) {
                return true;
            }
        }
        return false;
    }

    private void z() {
        VelocityTracker velocityTracker = this.f1116l;
        if (velocityTracker == null) {
            this.f1116l = VelocityTracker.obtain();
        } else {
            velocityTracker.clear();
        }
    }

    boolean H(int i4, int i5, int i6, int i7, int i8, int i9, int i10, int i11, boolean z3) {
        boolean z4;
        boolean z5;
        int i12;
        int overScrollMode = getOverScrollMode();
        boolean z6 = computeHorizontalScrollRange() > computeHorizontalScrollExtent();
        boolean z7 = computeVerticalScrollRange() > computeVerticalScrollExtent();
        boolean z8 = overScrollMode == 0 || (overScrollMode == 1 && z6);
        boolean z9 = overScrollMode == 0 || (overScrollMode == 1 && z7);
        int i13 = i6 + i4;
        int i14 = !z8 ? 0 : i10;
        int i15 = i7 + i5;
        int i16 = !z9 ? 0 : i11;
        int i17 = -i14;
        int i18 = i14 + i8;
        int i19 = -i16;
        int i20 = i16 + i9;
        if (i13 > i18) {
            i13 = i18;
            z4 = true;
        } else if (i13 < i17) {
            z4 = true;
            i13 = i17;
        } else {
            z4 = false;
        }
        if (i15 > i20) {
            i15 = i20;
            z5 = true;
        } else if (i15 < i19) {
            z5 = true;
            i15 = i19;
        } else {
            z5 = false;
        }
        if (!z5 || x(1)) {
            i12 = i13;
        } else {
            int i21 = i13;
            this.f1108d.springBack(i21, i15, 0, 0, 0, getScrollRange());
            i12 = i21;
        }
        onOverScrolled(i12, i15, z4, z5);
        return z4 || z5;
    }

    public boolean I(int i4) {
        boolean z3 = i4 == 130;
        int height = getHeight();
        if (z3) {
            this.f1107c.top = getScrollY() + height;
            int childCount = getChildCount();
            if (childCount > 0) {
                View childAt = getChildAt(childCount - 1);
                int bottom = childAt.getBottom() + ((FrameLayout.LayoutParams) childAt.getLayoutParams()).bottomMargin + getPaddingBottom();
                Rect rect = this.f1107c;
                if (rect.top + height > bottom) {
                    rect.top = bottom - height;
                }
            }
        } else {
            this.f1107c.top = getScrollY() - height;
            Rect rect2 = this.f1107c;
            if (rect2.top < 0) {
                rect2.top = 0;
            }
        }
        Rect rect3 = this.f1107c;
        int i5 = rect3.top;
        int i6 = height + i5;
        rect3.bottom = i6;
        return M(i4, i5, i6);
    }

    public final void Q(int i4, int i5) {
        R(i4, i5, 250, false);
    }

    void S(int i4, int i5, int i6, boolean z3) {
        R(i4 - getScrollX(), i5 - getScrollY(), i6, z3);
    }

    void T(int i4, int i5, boolean z3) {
        S(i4, i5, 250, z3);
    }

    public boolean U(int i4, int i5) {
        return this.f1129y.m(i4, i5);
    }

    public void W(int i4) {
        this.f1129y.n(i4);
    }

    @Override // androidx.core.view.o
    public void a(View view, View view2, int i4, int i5) {
        this.f1128x.c(view, view2, i4, i5);
        U(2, i5);
    }

    @Override // android.view.ViewGroup
    public void addView(View view) {
        if (getChildCount() > 0) {
            throw new IllegalStateException("ScrollView can host only one direct child");
        }
        super.addView(view);
    }

    @Override // android.view.ViewGroup
    public void addView(View view, int i4) {
        if (getChildCount() > 0) {
            throw new IllegalStateException(c3.d4(913));
        }
        super.addView(view, i4);
    }

    @Override // android.view.ViewGroup
    public void addView(View view, int i4, ViewGroup.LayoutParams layoutParams) {
        if (getChildCount() > 0) {
            throw new IllegalStateException(c3.d4(871));
        }
        super.addView(view, i4, layoutParams);
    }

    @Override // android.view.ViewGroup, android.view.ViewManager
    public void addView(View view, ViewGroup.LayoutParams layoutParams) {
        if (getChildCount() > 0) {
            throw new IllegalStateException("ScrollView can host only one direct child");
        }
        super.addView(view, layoutParams);
    }

    @Override // androidx.core.view.o
    public void b(View view, int i4) {
        this.f1128x.d(view, i4);
        W(i4);
    }

    @Override // androidx.core.view.o
    public void c(View view, int i4, int i5, int[] iArr, int i6) {
        n(i4, i5, iArr, null, i6);
    }

    @Override // android.view.View
    public int computeHorizontalScrollExtent() {
        return super.computeHorizontalScrollExtent();
    }

    @Override // android.view.View
    public int computeHorizontalScrollOffset() {
        return super.computeHorizontalScrollOffset();
    }

    @Override // android.view.View
    public int computeHorizontalScrollRange() {
        return super.computeHorizontalScrollRange();
    }

    @Override // android.view.View
    public void computeScroll() {
        int i4;
        if (this.f1108d.isFinished()) {
            return;
        }
        this.f1108d.computeScrollOffset();
        int currY = this.f1108d.getCurrY();
        int m3 = m(currY - this.f1126v);
        this.f1126v = currY;
        int[] iArr = this.f1124t;
        iArr[1] = 0;
        n(0, m3, iArr, null, 1);
        int i5 = m3 - this.f1124t[1];
        int scrollRange = getScrollRange();
        if (i5 != 0) {
            int scrollY = getScrollY();
            H(0, i5, getScrollX(), scrollY, 0, scrollRange, 0, 0, false);
            i4 = scrollRange;
            int scrollY2 = getScrollY() - scrollY;
            int i6 = i5 - scrollY2;
            int[] iArr2 = this.f1124t;
            iArr2[1] = 0;
            o(0, scrollY2, 0, i6, this.f1123s, 1, iArr2);
            i5 = i6 - this.f1124t[1];
        } else {
            i4 = scrollRange;
        }
        if (i5 != 0) {
            int overScrollMode = getOverScrollMode();
            if (overScrollMode == 0 || (overScrollMode == 1 && i4 > 0)) {
                if (i5 < 0) {
                    if (this.f1109e.isFinished()) {
                        this.f1109e.onAbsorb((int) this.f1108d.getCurrVelocity());
                    }
                } else if (this.f1110f.isFinished()) {
                    this.f1110f.onAbsorb((int) this.f1108d.getCurrVelocity());
                }
            }
            g();
        }
        if (this.f1108d.isFinished()) {
            W(1);
        } else {
            androidx.core.view.v.B(this);
        }
    }

    @Override // android.view.View
    public int computeVerticalScrollExtent() {
        return super.computeVerticalScrollExtent();
    }

    @Override // android.view.View
    public int computeVerticalScrollOffset() {
        return Math.max(0, super.computeVerticalScrollOffset());
    }

    @Override // android.view.View
    public int computeVerticalScrollRange() {
        int childCount = getChildCount();
        int height = (getHeight() - getPaddingBottom()) - getPaddingTop();
        if (childCount == 0) {
            return height;
        }
        View childAt = getChildAt(0);
        int bottom = childAt.getBottom() + ((FrameLayout.LayoutParams) childAt.getLayoutParams()).bottomMargin;
        int scrollY = getScrollY();
        int max = Math.max(0, bottom - height);
        return scrollY < 0 ? bottom - scrollY : scrollY > max ? bottom + (scrollY - max) : bottom;
    }

    @Override // androidx.core.view.p
    public void d(View view, int i4, int i5, int i6, int i7, int i8, int[] iArr) {
        F(i7, i8, iArr);
    }

    @Override // android.view.ViewGroup, android.view.View
    public boolean dispatchKeyEvent(KeyEvent keyEvent) {
        return super.dispatchKeyEvent(keyEvent) || s(keyEvent);
    }

    @Override // android.view.View
    public boolean dispatchNestedFling(float f4, float f5, boolean z3) {
        return this.f1129y.a(f4, f5, z3);
    }

    @Override // android.view.View
    public boolean dispatchNestedPreFling(float f4, float f5) {
        return this.f1129y.b(f4, f5);
    }

    @Override // android.view.View
    public boolean dispatchNestedPreScroll(int i4, int i5, int[] iArr, int[] iArr2) {
        return n(i4, i5, iArr, iArr2, 0);
    }

    @Override // android.view.View
    public boolean dispatchNestedScroll(int i4, int i5, int i6, int i7, int[] iArr) {
        return this.f1129y.e(i4, i5, i6, i7, iArr);
    }

    @Override // android.view.View
    public void draw(Canvas canvas) {
        int i4;
        super.draw(canvas);
        int scrollY = getScrollY();
        int i5 = 0;
        if (!this.f1109e.isFinished()) {
            int save = canvas.save();
            int width = getWidth();
            int height = getHeight();
            int min = Math.min(0, scrollY);
            if (b.a(this)) {
                width -= getPaddingLeft() + getPaddingRight();
                i4 = getPaddingLeft();
            } else {
                i4 = 0;
            }
            if (b.a(this)) {
                height -= getPaddingTop() + getPaddingBottom();
                min += getPaddingTop();
            }
            canvas.translate(i4, min);
            this.f1109e.setSize(width, height);
            if (this.f1109e.draw(canvas)) {
                androidx.core.view.v.B(this);
            }
            canvas.restoreToCount(save);
        }
        if (this.f1110f.isFinished()) {
            return;
        }
        int save2 = canvas.save();
        int width2 = getWidth();
        int height2 = getHeight();
        int max = Math.max(getScrollRange(), scrollY) + height2;
        if (b.a(this)) {
            width2 -= getPaddingLeft() + getPaddingRight();
            i5 = getPaddingLeft();
        }
        if (b.a(this)) {
            height2 -= getPaddingTop() + getPaddingBottom();
            max -= getPaddingBottom();
        }
        canvas.translate(i5 - width2, max);
        canvas.rotate(180.0f, width2, 0.0f);
        this.f1110f.setSize(width2, height2);
        if (this.f1110f.draw(canvas)) {
            androidx.core.view.v.B(this);
        }
        canvas.restoreToCount(save2);
    }

    @Override // androidx.core.view.o
    public void e(View view, int i4, int i5, int i6, int i7, int i8) {
        F(i7, i8, null);
    }

    @Override // androidx.core.view.o
    public boolean f(View view, View view2, int i4, int i5) {
        return (i4 & 2) != 0;
    }

    @Override // android.view.View
    protected float getBottomFadingEdgeStrength() {
        if (getChildCount() == 0) {
            return 0.0f;
        }
        View childAt = getChildAt(0);
        FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
        int verticalFadingEdgeLength = getVerticalFadingEdgeLength();
        int bottom = ((childAt.getBottom() + layoutParams.bottomMargin) - getScrollY()) - (getHeight() - getPaddingBottom());
        if (bottom < verticalFadingEdgeLength) {
            return bottom / verticalFadingEdgeLength;
        }
        return 1.0f;
    }

    public int getMaxScrollAmount() {
        return (int) (getHeight() * 0.5f);
    }

    @Override // android.view.ViewGroup
    public int getNestedScrollAxes() {
        return this.f1128x.a();
    }

    int getScrollRange() {
        if (getChildCount() <= 0) {
            return 0;
        }
        View childAt = getChildAt(0);
        FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
        return Math.max(0, ((childAt.getHeight() + layoutParams.topMargin) + layoutParams.bottomMargin) - ((getHeight() - getPaddingTop()) - getPaddingBottom()));
    }

    @Override // android.view.View
    protected float getTopFadingEdgeStrength() {
        if (getChildCount() == 0) {
            return 0.0f;
        }
        int verticalFadingEdgeLength = getVerticalFadingEdgeLength();
        int scrollY = getScrollY();
        if (scrollY < verticalFadingEdgeLength) {
            return scrollY / verticalFadingEdgeLength;
        }
        return 1.0f;
    }

    public boolean h(int i4) {
        View findFocus = findFocus();
        if (findFocus == this) {
            findFocus = null;
        }
        View findNextFocus = FocusFinder.getInstance().findNextFocus(this, findFocus, i4);
        int maxScrollAmount = getMaxScrollAmount();
        if (findNextFocus == null || !E(findNextFocus, maxScrollAmount, getHeight())) {
            if (i4 == 33 && getScrollY() < maxScrollAmount) {
                maxScrollAmount = getScrollY();
            } else if (i4 == 130 && getChildCount() > 0) {
                View childAt = getChildAt(0);
                maxScrollAmount = Math.min((childAt.getBottom() + ((FrameLayout.LayoutParams) childAt.getLayoutParams()).bottomMargin) - ((getScrollY() + getHeight()) - getPaddingBottom()), maxScrollAmount);
            }
            if (maxScrollAmount == 0) {
                return false;
            }
            if (i4 != 130) {
                maxScrollAmount = -maxScrollAmount;
            }
            p(maxScrollAmount);
        } else {
            findNextFocus.getDrawingRect(this.f1107c);
            offsetDescendantRectToMyCoords(findNextFocus, this.f1107c);
            p(l(this.f1107c));
            findNextFocus.requestFocus(i4);
        }
        if (findFocus == null || !findFocus.isFocused() || !C(findFocus)) {
            return true;
        }
        int descendantFocusability = getDescendantFocusability();
        setDescendantFocusability(131072);
        requestFocus();
        setDescendantFocusability(descendantFocusability);
        return true;
    }

    @Override // android.view.View
    public boolean hasNestedScrollingParent() {
        return x(0);
    }

    @Override // android.view.View
    public boolean isNestedScrollingEnabled() {
        return this.f1129y.j();
    }

    protected int l(Rect rect) {
        if (getChildCount() == 0) {
            return 0;
        }
        int height = getHeight();
        int scrollY = getScrollY();
        int i4 = scrollY + height;
        int verticalFadingEdgeLength = getVerticalFadingEdgeLength();
        if (rect.top > 0) {
            scrollY += verticalFadingEdgeLength;
        }
        View childAt = getChildAt(0);
        FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
        int i5 = rect.bottom < (childAt.getHeight() + layoutParams.topMargin) + layoutParams.bottomMargin ? i4 - verticalFadingEdgeLength : i4;
        int i6 = rect.bottom;
        if (i6 > i5 && rect.top > scrollY) {
            return Math.min(rect.height() > height ? rect.top - scrollY : rect.bottom - i5, (childAt.getBottom() + layoutParams.bottomMargin) - i4);
        }
        if (rect.top >= scrollY || i6 >= i5) {
            return 0;
        }
        return Math.max(rect.height() > height ? 0 - (i5 - rect.bottom) : 0 - (scrollY - rect.top), -getScrollY());
    }

    int m(int i4) {
        int height = getHeight();
        if (i4 > 0 && androidx.core.widget.b.b(this.f1109e) != 0.0f) {
            int round = Math.round(((-height) / 4.0f) * androidx.core.widget.b.d(this.f1109e, ((-i4) * 4.0f) / height, 0.5f));
            if (round != i4) {
                this.f1109e.finish();
            }
            return i4 - round;
        }
        if (i4 >= 0 || androidx.core.widget.b.b(this.f1110f) == 0.0f) {
            return i4;
        }
        float f4 = height;
        int round2 = Math.round((f4 / 4.0f) * androidx.core.widget.b.d(this.f1110f, (i4 * 4.0f) / f4, 0.5f));
        if (round2 != i4) {
            this.f1110f.finish();
        }
        return i4 - round2;
    }

    @Override // android.view.ViewGroup
    protected void measureChild(View view, int i4, int i5) {
        view.measure(ViewGroup.getChildMeasureSpec(i4, getPaddingLeft() + getPaddingRight(), view.getLayoutParams().width), View.MeasureSpec.makeMeasureSpec(0, 0));
    }

    @Override // android.view.ViewGroup
    protected void measureChildWithMargins(View view, int i4, int i5, int i6, int i7) {
        ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        view.measure(ViewGroup.getChildMeasureSpec(i4, getPaddingLeft() + getPaddingRight() + marginLayoutParams.leftMargin + marginLayoutParams.rightMargin + i5, marginLayoutParams.width), View.MeasureSpec.makeMeasureSpec(marginLayoutParams.topMargin + marginLayoutParams.bottomMargin, 0));
    }

    public boolean n(int i4, int i5, int[] iArr, int[] iArr2, int i6) {
        return this.f1129y.c(i4, i5, iArr, iArr2, i6);
    }

    public void o(int i4, int i5, int i6, int i7, int[] iArr, int i8, int[] iArr2) {
        this.f1129y.d(i4, i5, i6, i7, iArr, i8, iArr2);
    }

    @Override // android.view.ViewGroup, android.view.View
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        this.f1113i = false;
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // android.view.View
    public boolean onGenericMotionEvent(MotionEvent motionEvent) {
        boolean z3;
        int i4 = 0;
        if (motionEvent.getAction() == 8 && !this.f1115k) {
            float axisValue = m.a(motionEvent, 2) ? motionEvent.getAxisValue(9) : m.a(motionEvent, 4194304) ? motionEvent.getAxisValue(26) : 0.0f;
            if (axisValue != 0.0f) {
                int verticalScrollFactorCompat = (int) (axisValue * getVerticalScrollFactorCompat());
                int scrollRange = getScrollRange();
                int scrollY = getScrollY();
                int i5 = scrollY - verticalScrollFactorCompat;
                if (i5 < 0) {
                    if (!i() || m.a(motionEvent, 8194)) {
                        z3 = 0;
                    } else {
                        androidx.core.widget.b.d(this.f1109e, (-i5) / getHeight(), 0.5f);
                        this.f1109e.onRelease();
                        invalidate();
                        z3 = 1;
                    }
                } else if (i5 > scrollRange) {
                    if (i() && !m.a(motionEvent, 8194)) {
                        androidx.core.widget.b.d(this.f1110f, (i5 - scrollRange) / getHeight(), 0.5f);
                        this.f1110f.onRelease();
                        invalidate();
                        i4 = 1;
                    }
                    z3 = i4;
                    i4 = scrollRange;
                } else {
                    z3 = 0;
                    i4 = i5;
                }
                if (i4 == scrollY) {
                    return z3;
                }
                super.scrollTo(getScrollX(), i4);
                return true;
            }
        }
        return false;
    }

    @Override // android.view.ViewGroup
    public boolean onInterceptTouchEvent(MotionEvent motionEvent) {
        int action = motionEvent.getAction();
        boolean z3 = true;
        if (action == 2 && this.f1115k) {
            return true;
        }
        int i4 = action & 255;
        if (i4 != 0) {
            if (i4 != 1) {
                if (i4 == 2) {
                    int i5 = this.f1122r;
                    if (i5 != -1) {
                        int findPointerIndex = motionEvent.findPointerIndex(i5);
                        if (findPointerIndex == -1) {
                            Log.e(c3.d4(186), "Invalid pointerId=" + i5 + c3.d4(1480));
                        } else {
                            int y3 = (int) motionEvent.getY(findPointerIndex);
                            if (Math.abs(y3 - this.f1111g) > this.f1119o && (2 & getNestedScrollAxes()) == 0) {
                                this.f1115k = true;
                                this.f1111g = y3;
                                B();
                                this.f1116l.addMovement(motionEvent);
                                this.f1125u = 0;
                                ViewParent parent = getParent();
                                if (parent != null) {
                                    parent.requestDisallowInterceptTouchEvent(true);
                                }
                            }
                        }
                    }
                } else if (i4 != 3) {
                    if (i4 == 6) {
                        G(motionEvent);
                    }
                }
            }
            this.f1115k = false;
            this.f1122r = -1;
            J();
            if (this.f1108d.springBack(getScrollX(), getScrollY(), 0, 0, 0, getScrollRange())) {
                androidx.core.view.v.B(this);
            }
            W(0);
        } else {
            int y4 = (int) motionEvent.getY();
            if (y((int) motionEvent.getX(), y4)) {
                this.f1111g = y4;
                this.f1122r = motionEvent.getPointerId(0);
                z();
                this.f1116l.addMovement(motionEvent);
                this.f1108d.computeScrollOffset();
                if (!V(motionEvent) && this.f1108d.isFinished()) {
                    z3 = false;
                }
                this.f1115k = z3;
                U(2, 0);
            } else {
                if (!V(motionEvent) && this.f1108d.isFinished()) {
                    z3 = false;
                }
                this.f1115k = z3;
                J();
            }
        }
        return this.f1115k;
    }

    @Override // android.widget.FrameLayout, android.view.ViewGroup, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        super.onLayout(z3, i4, i5, i6, i7);
        int i8 = 0;
        this.f1112h = false;
        View view = this.f1114j;
        if (view != null && D(view, this)) {
            N(this.f1114j);
        }
        this.f1114j = null;
        if (!this.f1113i) {
            if (this.f1127w != null) {
                scrollTo(getScrollX(), this.f1127w.f1131e);
                this.f1127w = null;
            }
            if (getChildCount() > 0) {
                View childAt = getChildAt(0);
                FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
                i8 = childAt.getMeasuredHeight() + layoutParams.topMargin + layoutParams.bottomMargin;
            }
            int paddingTop = ((i7 - i5) - getPaddingTop()) - getPaddingBottom();
            int scrollY = getScrollY();
            int k4 = k(scrollY, paddingTop, i8);
            if (k4 != scrollY) {
                scrollTo(getScrollX(), k4);
            }
        }
        scrollTo(getScrollX(), getScrollY());
        this.f1113i = true;
    }

    @Override // android.widget.FrameLayout, android.view.View
    protected void onMeasure(int i4, int i5) {
        super.onMeasure(i4, i5);
        if (this.f1117m && View.MeasureSpec.getMode(i5) != 0 && getChildCount() > 0) {
            View childAt = getChildAt(0);
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
            int measuredHeight = childAt.getMeasuredHeight();
            int measuredHeight2 = (((getMeasuredHeight() - getPaddingTop()) - getPaddingBottom()) - layoutParams.topMargin) - layoutParams.bottomMargin;
            if (measuredHeight < measuredHeight2) {
                childAt.measure(ViewGroup.getChildMeasureSpec(i4, getPaddingLeft() + getPaddingRight() + layoutParams.leftMargin + layoutParams.rightMargin, layoutParams.width), View.MeasureSpec.makeMeasureSpec(measuredHeight2, 1073741824));
            }
        }
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean onNestedFling(View view, float f4, float f5, boolean z3) {
        if (z3) {
            return false;
        }
        dispatchNestedFling(0.0f, f5, true);
        u((int) f5);
        return true;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean onNestedPreFling(View view, float f4, float f5) {
        return dispatchNestedPreFling(f4, f5);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onNestedPreScroll(View view, int i4, int i5, int[] iArr) {
        c(view, i4, i5, iArr, 0);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onNestedScroll(View view, int i4, int i5, int i6, int i7) {
        F(i7, 0, null);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onNestedScrollAccepted(View view, View view2, int i4) {
        a(view, view2, i4, 0);
    }

    @Override // android.view.View
    protected void onOverScrolled(int i4, int i5, boolean z3, boolean z4) {
        super.scrollTo(i4, i5);
    }

    @Override // android.view.ViewGroup
    protected boolean onRequestFocusInDescendants(int i4, Rect rect) {
        if (i4 == 2) {
            i4 = 130;
        } else if (i4 == 1) {
            i4 = 33;
        }
        View findNextFocus = rect == null ? FocusFinder.getInstance().findNextFocus(this, null, i4) : FocusFinder.getInstance().findNextFocusFromRect(this, rect, i4);
        if (findNextFocus == null || C(findNextFocus)) {
            return false;
        }
        return findNextFocus.requestFocus(i4, rect);
    }

    @Override // android.view.View
    protected void onRestoreInstanceState(Parcelable parcelable) {
        if (!(parcelable instanceof d)) {
            super.onRestoreInstanceState(parcelable);
            return;
        }
        d dVar = (d) parcelable;
        super.onRestoreInstanceState(dVar.getSuperState());
        this.f1127w = dVar;
        requestLayout();
    }

    @Override // android.view.View
    protected Parcelable onSaveInstanceState() {
        d dVar = new d(super.onSaveInstanceState());
        dVar.f1131e = getScrollY();
        return dVar;
    }

    @Override // android.view.View
    protected void onScrollChanged(int i4, int i5, int i6, int i7) {
        super.onScrollChanged(i4, i5, i6, i7);
    }

    @Override // android.view.View
    protected void onSizeChanged(int i4, int i5, int i6, int i7) {
        super.onSizeChanged(i4, i5, i6, i7);
        View findFocus = findFocus();
        if (findFocus == null || this == findFocus || !E(findFocus, 0, i7)) {
            return;
        }
        findFocus.getDrawingRect(this.f1107c);
        offsetDescendantRectToMyCoords(findFocus, this.f1107c);
        p(l(this.f1107c));
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean onStartNestedScroll(View view, View view2, int i4) {
        return f(view, view2, i4, 0);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void onStopNestedScroll(View view) {
        b(view, 0);
    }

    /* JADX WARN: Removed duplicated region for block: B:74:0x01c5  */
    @Override // android.view.View
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public boolean onTouchEvent(android.view.MotionEvent r22) {
        /*
            Method dump skipped, instructions count: 599
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.widget.NestedScrollView.onTouchEvent(android.view.MotionEvent):boolean");
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void requestChildFocus(View view, View view2) {
        if (this.f1112h) {
            this.f1114j = view2;
        } else {
            N(view2);
        }
        super.requestChildFocus(view, view2);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public boolean requestChildRectangleOnScreen(View view, Rect rect, boolean z3) {
        rect.offset(view.getLeft() - view.getScrollX(), view.getTop() - view.getScrollY());
        return O(rect, z3);
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public void requestDisallowInterceptTouchEvent(boolean z3) {
        if (z3) {
            J();
        }
        super.requestDisallowInterceptTouchEvent(z3);
    }

    @Override // android.view.View, android.view.ViewParent
    public void requestLayout() {
        this.f1112h = true;
        super.requestLayout();
    }

    public boolean s(KeyEvent keyEvent) {
        this.f1107c.setEmpty();
        if (j()) {
            if (keyEvent.getAction() == 0) {
                int keyCode = keyEvent.getKeyCode();
                if (keyCode == 19) {
                    return !keyEvent.isAltPressed() ? h(33) : v(33);
                }
                if (keyCode == 20) {
                    return !keyEvent.isAltPressed() ? h(130) : v(130);
                }
                if (keyCode == 62) {
                    I(keyEvent.isShiftPressed() ? 33 : 130);
                    return false;
                }
            }
            return false;
        }
        if (isFocused() && keyEvent.getKeyCode() != 4) {
            View findFocus = findFocus();
            if (findFocus == this) {
                findFocus = null;
            }
            View findNextFocus = FocusFinder.getInstance().findNextFocus(this, findFocus, 130);
            if (findNextFocus != null && findNextFocus != this && findNextFocus.requestFocus(130)) {
                return true;
            }
        }
        return false;
    }

    @Override // android.view.View
    public void scrollTo(int i4, int i5) {
        if (getChildCount() > 0) {
            View childAt = getChildAt(0);
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) childAt.getLayoutParams();
            int width = (getWidth() - getPaddingLeft()) - getPaddingRight();
            int width2 = childAt.getWidth() + layoutParams.leftMargin + layoutParams.rightMargin;
            int height = (getHeight() - getPaddingTop()) - getPaddingBottom();
            int height2 = childAt.getHeight() + layoutParams.topMargin + layoutParams.bottomMargin;
            int k4 = k(i4, width, width2);
            int k5 = k(i5, height, height2);
            if (k4 == getScrollX() && k5 == getScrollY()) {
                return;
            }
            super.scrollTo(k4, k5);
        }
    }

    public void setFillViewport(boolean z3) {
        if (z3 != this.f1117m) {
            this.f1117m = z3;
            requestLayout();
        }
    }

    @Override // android.view.View
    public void setNestedScrollingEnabled(boolean z3) {
        this.f1129y.k(z3);
    }

    public void setOnScrollChangeListener(c cVar) {
    }

    public void setSmoothScrollingEnabled(boolean z3) {
        this.f1118n = z3;
    }

    @Override // android.widget.FrameLayout, android.view.ViewGroup
    public boolean shouldDelayChildPressedState() {
        return true;
    }

    @Override // android.view.View
    public boolean startNestedScroll(int i4) {
        return U(i4, 0);
    }

    @Override // android.view.View
    public void stopNestedScroll() {
        W(0);
    }

    public void u(int i4) {
        if (getChildCount() > 0) {
            this.f1108d.fling(getScrollX(), getScrollY(), 0, i4, 0, 0, Integer.MIN_VALUE, Integer.MAX_VALUE, 0, 0);
            L(true);
        }
    }

    public boolean v(int i4) {
        int childCount;
        boolean z3 = i4 == 130;
        int height = getHeight();
        Rect rect = this.f1107c;
        rect.top = 0;
        rect.bottom = height;
        if (z3 && (childCount = getChildCount()) > 0) {
            View childAt = getChildAt(childCount - 1);
            this.f1107c.bottom = childAt.getBottom() + ((FrameLayout.LayoutParams) childAt.getLayoutParams()).bottomMargin + getPaddingBottom();
            Rect rect2 = this.f1107c;
            rect2.top = rect2.bottom - height;
        }
        Rect rect3 = this.f1107c;
        return M(i4, rect3.top, rect3.bottom);
    }

    public boolean x(int i4) {
        return this.f1129y.i(i4);
    }
}
