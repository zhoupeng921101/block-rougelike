package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.LinearLayout;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class y extends ViewGroup {

    /* renamed from: a, reason: collision with root package name */
    private boolean f730a;

    /* renamed from: b, reason: collision with root package name */
    private int f731b;

    /* renamed from: c, reason: collision with root package name */
    private int f732c;

    /* renamed from: d, reason: collision with root package name */
    private int f733d;

    /* renamed from: e, reason: collision with root package name */
    private int f734e;

    /* renamed from: f, reason: collision with root package name */
    private int f735f;

    /* renamed from: g, reason: collision with root package name */
    private float f736g;

    /* renamed from: h, reason: collision with root package name */
    private boolean f737h;

    /* renamed from: i, reason: collision with root package name */
    private int[] f738i;

    /* renamed from: j, reason: collision with root package name */
    private int[] f739j;

    /* renamed from: k, reason: collision with root package name */
    private Drawable f740k;

    /* renamed from: l, reason: collision with root package name */
    private int f741l;

    /* renamed from: m, reason: collision with root package name */
    private int f742m;

    /* renamed from: n, reason: collision with root package name */
    private int f743n;

    /* renamed from: o, reason: collision with root package name */
    private int f744o;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a extends LinearLayout.LayoutParams {
        public a(int i4, int i5) {
            super(i4, i5);
        }

        public a(Context context, AttributeSet attributeSet) {
            super(context, attributeSet);
        }

        public a(ViewGroup.LayoutParams layoutParams) {
            super(layoutParams);
        }
    }

    public y(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, 0);
    }

    public y(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f730a = true;
        this.f731b = -1;
        this.f732c = 0;
        this.f734e = 8388659;
        l0 s3 = l0.s(context, attributeSet, c.i.f2014r0, i4, 0);
        androidx.core.view.v.F(this, context, c.i.f2014r0, attributeSet, s3.o(), i4, 0);
        int i5 = s3.i(c.i.f2022t0, -1);
        if (i5 >= 0) {
            setOrientation(i5);
        }
        int i6 = s3.i(c.i.f2018s0, -1);
        if (i6 >= 0) {
            setGravity(i6);
        }
        boolean a4 = s3.a(c.i.f2026u0, true);
        if (!a4) {
            setBaselineAligned(a4);
        }
        this.f736g = s3.g(c.i.f2034w0, -1.0f);
        this.f731b = s3.i(c.i.f2030v0, -1);
        this.f737h = s3.a(c.i.f2046z0, false);
        setDividerDrawable(s3.f(c.i.f2038x0));
        this.f743n = s3.i(c.i.A0, 0);
        this.f744o = s3.e(c.i.f2042y0, 0);
        s3.t();
    }

    private void h(int i4, int i5) {
        int i6;
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(getMeasuredHeight(), 1073741824);
        int i7 = 0;
        while (i7 < i4) {
            View p3 = p(i7);
            if (p3.getVisibility() != 8) {
                a aVar = (a) p3.getLayoutParams();
                if (((LinearLayout.LayoutParams) aVar).height == -1) {
                    int i8 = ((LinearLayout.LayoutParams) aVar).width;
                    ((LinearLayout.LayoutParams) aVar).width = p3.getMeasuredWidth();
                    i6 = i5;
                    measureChildWithMargins(p3, i6, 0, makeMeasureSpec, 0);
                    ((LinearLayout.LayoutParams) aVar).width = i8;
                    i7++;
                    i5 = i6;
                }
            }
            i6 = i5;
            i7++;
            i5 = i6;
        }
    }

    private void i(int i4, int i5) {
        int i6;
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(getMeasuredWidth(), 1073741824);
        int i7 = 0;
        while (i7 < i4) {
            View p3 = p(i7);
            if (p3.getVisibility() != 8) {
                a aVar = (a) p3.getLayoutParams();
                if (((LinearLayout.LayoutParams) aVar).width == -1) {
                    int i8 = ((LinearLayout.LayoutParams) aVar).height;
                    ((LinearLayout.LayoutParams) aVar).height = p3.getMeasuredHeight();
                    i6 = i5;
                    measureChildWithMargins(p3, makeMeasureSpec, 0, i6, 0);
                    ((LinearLayout.LayoutParams) aVar).height = i8;
                    i7++;
                    i5 = i6;
                }
            }
            i6 = i5;
            i7++;
            i5 = i6;
        }
    }

    private void x(View view, int i4, int i5, int i6, int i7) {
        view.layout(i4, i5, i6 + i4, i7 + i5);
    }

    @Override // android.view.ViewGroup
    protected boolean checkLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return layoutParams instanceof a;
    }

    void d(Canvas canvas) {
        int right;
        int left;
        int i4;
        int virtualChildCount = getVirtualChildCount();
        boolean a4 = v0.a(this);
        for (int i5 = 0; i5 < virtualChildCount; i5++) {
            View p3 = p(i5);
            if (p3 != null && p3.getVisibility() != 8 && q(i5)) {
                a aVar = (a) p3.getLayoutParams();
                g(canvas, a4 ? p3.getRight() + ((LinearLayout.LayoutParams) aVar).rightMargin : (p3.getLeft() - ((LinearLayout.LayoutParams) aVar).leftMargin) - this.f741l);
            }
        }
        if (q(virtualChildCount)) {
            View p4 = p(virtualChildCount - 1);
            if (p4 != null) {
                a aVar2 = (a) p4.getLayoutParams();
                if (a4) {
                    left = p4.getLeft() - ((LinearLayout.LayoutParams) aVar2).leftMargin;
                    i4 = this.f741l;
                    right = left - i4;
                } else {
                    right = p4.getRight() + ((LinearLayout.LayoutParams) aVar2).rightMargin;
                }
            } else if (a4) {
                right = getPaddingLeft();
            } else {
                left = getWidth() - getPaddingRight();
                i4 = this.f741l;
                right = left - i4;
            }
            g(canvas, right);
        }
    }

    void e(Canvas canvas) {
        int virtualChildCount = getVirtualChildCount();
        for (int i4 = 0; i4 < virtualChildCount; i4++) {
            View p3 = p(i4);
            if (p3 != null && p3.getVisibility() != 8 && q(i4)) {
                f(canvas, (p3.getTop() - ((LinearLayout.LayoutParams) ((a) p3.getLayoutParams())).topMargin) - this.f742m);
            }
        }
        if (q(virtualChildCount)) {
            View p4 = p(virtualChildCount - 1);
            f(canvas, p4 == null ? (getHeight() - getPaddingBottom()) - this.f742m : p4.getBottom() + ((LinearLayout.LayoutParams) ((a) p4.getLayoutParams())).bottomMargin);
        }
    }

    void f(Canvas canvas, int i4) {
        this.f740k.setBounds(getPaddingLeft() + this.f744o, i4, (getWidth() - getPaddingRight()) - this.f744o, this.f742m + i4);
        this.f740k.draw(canvas);
    }

    void g(Canvas canvas, int i4) {
        this.f740k.setBounds(i4, getPaddingTop() + this.f744o, this.f741l + i4, (getHeight() - getPaddingBottom()) - this.f744o);
        this.f740k.draw(canvas);
    }

    @Override // android.view.View
    public int getBaseline() {
        int i4;
        if (this.f731b < 0) {
            return super.getBaseline();
        }
        int childCount = getChildCount();
        int i5 = this.f731b;
        if (childCount <= i5) {
            throw new RuntimeException("mBaselineAlignedChildIndex of LinearLayout set to an index that is out of bounds.");
        }
        View childAt = getChildAt(i5);
        int baseline = childAt.getBaseline();
        if (baseline == -1) {
            if (this.f731b == 0) {
                return -1;
            }
            throw new RuntimeException(c3.d4(551));
        }
        int i6 = this.f732c;
        if (this.f733d == 1 && (i4 = this.f734e & 112) != 48) {
            if (i4 == 16) {
                i6 += ((((getBottom() - getTop()) - getPaddingTop()) - getPaddingBottom()) - this.f735f) / 2;
            } else if (i4 == 80) {
                i6 = ((getBottom() - getTop()) - getPaddingBottom()) - this.f735f;
            }
        }
        return i6 + ((LinearLayout.LayoutParams) ((a) childAt.getLayoutParams())).topMargin + baseline;
    }

    public int getBaselineAlignedChildIndex() {
        return this.f731b;
    }

    public Drawable getDividerDrawable() {
        return this.f740k;
    }

    public int getDividerPadding() {
        return this.f744o;
    }

    public int getDividerWidth() {
        return this.f741l;
    }

    public int getGravity() {
        return this.f734e;
    }

    public int getOrientation() {
        return this.f733d;
    }

    public int getShowDividers() {
        return this.f743n;
    }

    int getVirtualChildCount() {
        return getChildCount();
    }

    public float getWeightSum() {
        return this.f736g;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.view.ViewGroup
    /* renamed from: j, reason: merged with bridge method [inline-methods] */
    public a generateDefaultLayoutParams() {
        int i4 = this.f733d;
        if (i4 == 0) {
            return new a(-2, -2);
        }
        if (i4 == 1) {
            return new a(-1, -2);
        }
        return null;
    }

    @Override // android.view.ViewGroup
    /* renamed from: k, reason: merged with bridge method [inline-methods] */
    public a generateLayoutParams(AttributeSet attributeSet) {
        return new a(getContext(), attributeSet);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.view.ViewGroup
    /* renamed from: l, reason: merged with bridge method [inline-methods] */
    public a generateLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return new a(layoutParams);
    }

    int m(View view, int i4) {
        return 0;
    }

    int n(View view) {
        return 0;
    }

    int o(View view) {
        return 0;
    }

    @Override // android.view.View
    protected void onDraw(Canvas canvas) {
        if (this.f740k == null) {
            return;
        }
        if (this.f733d == 1) {
            e(canvas);
        } else {
            d(canvas);
        }
    }

    @Override // android.view.View
    public void onInitializeAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        super.onInitializeAccessibilityEvent(accessibilityEvent);
        accessibilityEvent.setClassName("androidx.appcompat.widget.LinearLayoutCompat");
    }

    @Override // android.view.View
    public void onInitializeAccessibilityNodeInfo(AccessibilityNodeInfo accessibilityNodeInfo) {
        super.onInitializeAccessibilityNodeInfo(accessibilityNodeInfo);
        accessibilityNodeInfo.setClassName(c3.d4(103));
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        if (this.f733d == 1) {
            s(i4, i5, i6, i7);
        } else {
            r(i4, i5, i6, i7);
        }
    }

    @Override // android.view.View
    protected void onMeasure(int i4, int i5) {
        if (this.f733d == 1) {
            w(i4, i5);
        } else {
            u(i4, i5);
        }
    }

    View p(int i4) {
        return getChildAt(i4);
    }

    protected boolean q(int i4) {
        if (i4 == 0) {
            return (this.f743n & 1) != 0;
        }
        if (i4 == getChildCount()) {
            return (this.f743n & 4) != 0;
        }
        if ((this.f743n & 2) != 0) {
            for (int i5 = i4 - 1; i5 >= 0; i5--) {
                if (getChildAt(i5).getVisibility() != 8) {
                    return true;
                }
            }
        }
        return false;
    }

    /* JADX WARN: Removed duplicated region for block: B:25:0x00b6  */
    /* JADX WARN: Removed duplicated region for block: B:28:0x00bf  */
    /* JADX WARN: Removed duplicated region for block: B:35:0x0100  */
    /* JADX WARN: Removed duplicated region for block: B:38:0x0105  */
    /* JADX WARN: Removed duplicated region for block: B:46:0x00ed  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    void r(int r22, int r23, int r24, int r25) {
        /*
            Method dump skipped, instructions count: 321
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.y.r(int, int, int, int):void");
    }

    /* JADX WARN: Removed duplicated region for block: B:27:0x0099  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    void s(int r12, int r13, int r14, int r15) {
        /*
            r11 = this;
            int r0 = r11.getPaddingLeft()
            int r14 = r14 - r12
            int r12 = r11.getPaddingRight()
            int r12 = r14 - r12
            int r14 = r14 - r0
            int r1 = r11.getPaddingRight()
            int r14 = r14 - r1
            int r1 = r11.getVirtualChildCount()
            int r2 = r11.f734e
            r3 = r2 & 112(0x70, float:1.57E-43)
            r4 = 8388615(0x800007, float:1.1754953E-38)
            r2 = r2 & r4
            r4 = 16
            if (r3 == r4) goto L35
            r4 = 80
            if (r3 == r4) goto L2a
            int r13 = r11.getPaddingTop()
            goto L41
        L2a:
            int r3 = r11.getPaddingTop()
            int r3 = r3 + r15
            int r3 = r3 - r13
            int r13 = r11.f735f
            int r13 = r3 - r13
            goto L41
        L35:
            int r3 = r11.getPaddingTop()
            int r15 = r15 - r13
            int r13 = r11.f735f
            int r15 = r15 - r13
            int r15 = r15 / 2
            int r13 = r3 + r15
        L41:
            r15 = 0
        L42:
            if (r15 >= r1) goto Lb9
            android.view.View r4 = r11.p(r15)
            r9 = 1
            if (r4 != 0) goto L52
            int r3 = r11.v(r15)
            int r13 = r13 + r3
        L50:
            r3 = r11
            goto Lb7
        L52:
            int r3 = r4.getVisibility()
            r5 = 8
            if (r3 == r5) goto L50
            int r7 = r4.getMeasuredWidth()
            int r8 = r4.getMeasuredHeight()
            android.view.ViewGroup$LayoutParams r3 = r4.getLayoutParams()
            r10 = r3
            androidx.appcompat.widget.y$a r10 = (androidx.appcompat.widget.y.a) r10
            int r3 = r10.gravity
            if (r3 >= 0) goto L6e
            r3 = r2
        L6e:
            int r5 = androidx.core.view.v.o(r11)
            int r3 = androidx.core.view.e.a(r3, r5)
            r3 = r3 & 7
            if (r3 == r9) goto L88
            r5 = 5
            if (r3 == r5) goto L82
            int r3 = r10.leftMargin
            int r3 = r3 + r0
        L80:
            r5 = r3
            goto L93
        L82:
            int r3 = r12 - r7
            int r5 = r10.rightMargin
        L86:
            int r3 = r3 - r5
            goto L80
        L88:
            int r3 = r14 - r7
            int r3 = r3 / 2
            int r3 = r3 + r0
            int r5 = r10.leftMargin
            int r3 = r3 + r5
            int r5 = r10.rightMargin
            goto L86
        L93:
            boolean r3 = r11.q(r15)
            if (r3 == 0) goto L9c
            int r3 = r11.f742m
            int r13 = r13 + r3
        L9c:
            int r3 = r10.topMargin
            int r13 = r13 + r3
            int r3 = r11.n(r4)
            int r6 = r13 + r3
            r3 = r11
            r3.x(r4, r5, r6, r7, r8)
            int r5 = r10.bottomMargin
            int r8 = r8 + r5
            int r5 = r11.o(r4)
            int r8 = r8 + r5
            int r13 = r13 + r8
            int r4 = r11.m(r4, r15)
            int r15 = r15 + r4
        Lb7:
            int r15 = r15 + r9
            goto L42
        Lb9:
            r3 = r11
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.y.s(int, int, int, int):void");
    }

    public void setBaselineAligned(boolean z3) {
        this.f730a = z3;
    }

    public void setBaselineAlignedChildIndex(int i4) {
        if (i4 >= 0 && i4 < getChildCount()) {
            this.f731b = i4;
            return;
        }
        throw new IllegalArgumentException("base aligned child index out of range (0, " + getChildCount() + ")");
    }

    public void setDividerDrawable(Drawable drawable) {
        if (drawable == this.f740k) {
            return;
        }
        this.f740k = drawable;
        if (drawable != null) {
            this.f741l = drawable.getIntrinsicWidth();
            this.f742m = drawable.getIntrinsicHeight();
        } else {
            this.f741l = 0;
            this.f742m = 0;
        }
        setWillNotDraw(drawable == null);
        requestLayout();
    }

    public void setDividerPadding(int i4) {
        this.f744o = i4;
    }

    public void setGravity(int i4) {
        if (this.f734e != i4) {
            if ((8388615 & i4) == 0) {
                i4 |= 8388611;
            }
            if ((i4 & 112) == 0) {
                i4 |= 48;
            }
            this.f734e = i4;
            requestLayout();
        }
    }

    public void setHorizontalGravity(int i4) {
        int i5 = i4 & 8388615;
        int i6 = this.f734e;
        if ((8388615 & i6) != i5) {
            this.f734e = i5 | ((-8388616) & i6);
            requestLayout();
        }
    }

    public void setMeasureWithLargestChildEnabled(boolean z3) {
        this.f737h = z3;
    }

    public void setOrientation(int i4) {
        if (this.f733d != i4) {
            this.f733d = i4;
            requestLayout();
        }
    }

    public void setShowDividers(int i4) {
        if (i4 != this.f743n) {
            requestLayout();
        }
        this.f743n = i4;
    }

    public void setVerticalGravity(int i4) {
        int i5 = i4 & 112;
        int i6 = this.f734e;
        if ((i6 & 112) != i5) {
            this.f734e = i5 | (i6 & (-113));
            requestLayout();
        }
    }

    public void setWeightSum(float f4) {
        this.f736g = Math.max(0.0f, f4);
    }

    @Override // android.view.ViewGroup
    public boolean shouldDelayChildPressedState() {
        return false;
    }

    void t(View view, int i4, int i5, int i6, int i7, int i8) {
        measureChildWithMargins(view, i5, i6, i7, i8);
    }

    /* JADX WARN: Removed duplicated region for block: B:180:0x0461  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    void u(int r39, int r40) {
        /*
            Method dump skipped, instructions count: 1294
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.y.u(int, int):void");
    }

    int v(int i4) {
        return 0;
    }

    /* JADX WARN: Removed duplicated region for block: B:46:0x0156  */
    /* JADX WARN: Removed duplicated region for block: B:51:0x0160  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    void w(int r28, int r29) {
        /*
            Method dump skipped, instructions count: 879
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.y.w(int, int):void");
    }
}
