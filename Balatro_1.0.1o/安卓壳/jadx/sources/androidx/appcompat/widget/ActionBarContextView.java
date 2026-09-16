package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ActionBarContextView extends a {

    /* renamed from: h, reason: collision with root package name */
    private CharSequence f312h;

    /* renamed from: i, reason: collision with root package name */
    private CharSequence f313i;

    /* renamed from: j, reason: collision with root package name */
    private View f314j;

    /* renamed from: k, reason: collision with root package name */
    private View f315k;

    /* renamed from: l, reason: collision with root package name */
    private LinearLayout f316l;

    /* renamed from: m, reason: collision with root package name */
    private TextView f317m;

    /* renamed from: n, reason: collision with root package name */
    private TextView f318n;

    /* renamed from: o, reason: collision with root package name */
    private int f319o;

    /* renamed from: p, reason: collision with root package name */
    private int f320p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f321q;

    /* renamed from: r, reason: collision with root package name */
    private int f322r;

    public ActionBarContextView(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, c.a.f1832d);
    }

    public ActionBarContextView(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        l0 s3 = l0.s(context, attributeSet, c.i.f2033w, i4, 0);
        androidx.core.view.v.J(this, s3.f(c.i.f2037x));
        this.f319o = s3.l(c.i.B, 0);
        this.f320p = s3.l(c.i.A, 0);
        this.f475e = s3.k(c.i.f2045z, 0);
        this.f322r = s3.l(c.i.f2041y, c.f.f1922d);
        s3.t();
    }

    private void d() {
        if (this.f316l == null) {
            LayoutInflater.from(getContext()).inflate(c.f.f1919a, this);
            LinearLayout linearLayout = (LinearLayout) getChildAt(getChildCount() - 1);
            this.f316l = linearLayout;
            this.f317m = (TextView) linearLayout.findViewById(c.e.f1897e);
            this.f318n = (TextView) this.f316l.findViewById(c.e.f1896d);
            if (this.f319o != 0) {
                this.f317m.setTextAppearance(getContext(), this.f319o);
            }
            if (this.f320p != 0) {
                this.f318n.setTextAppearance(getContext(), this.f320p);
            }
        }
        this.f317m.setText(this.f312h);
        this.f318n.setText(this.f313i);
        boolean isEmpty = TextUtils.isEmpty(this.f312h);
        boolean isEmpty2 = TextUtils.isEmpty(this.f313i);
        this.f318n.setVisibility(!isEmpty2 ? 0 : 8);
        this.f316l.setVisibility((isEmpty && isEmpty2) ? 8 : 0);
        if (this.f316l.getParent() == null) {
            addView(this.f316l);
        }
    }

    @Override // android.view.ViewGroup
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new ViewGroup.MarginLayoutParams(-1, -2);
    }

    @Override // android.view.ViewGroup
    public ViewGroup.LayoutParams generateLayoutParams(AttributeSet attributeSet) {
        return new ViewGroup.MarginLayoutParams(getContext(), attributeSet);
    }

    @Override // androidx.appcompat.widget.a
    public /* bridge */ /* synthetic */ int getAnimatedVisibility() {
        return super.getAnimatedVisibility();
    }

    @Override // androidx.appcompat.widget.a
    public /* bridge */ /* synthetic */ int getContentHeight() {
        return super.getContentHeight();
    }

    public CharSequence getSubtitle() {
        return this.f313i;
    }

    public CharSequence getTitle() {
        return this.f312h;
    }

    @Override // android.view.ViewGroup, android.view.View
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        c cVar = this.f474d;
        if (cVar != null) {
            cVar.z();
            this.f474d.A();
        }
    }

    @Override // androidx.appcompat.widget.a, android.view.View
    public /* bridge */ /* synthetic */ boolean onHoverEvent(MotionEvent motionEvent) {
        return super.onHoverEvent(motionEvent);
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        boolean a4 = v0.a(this);
        int paddingRight = a4 ? (i6 - i4) - getPaddingRight() : getPaddingLeft();
        int paddingTop = getPaddingTop();
        int paddingTop2 = ((i7 - i5) - getPaddingTop()) - getPaddingBottom();
        View view = this.f314j;
        if (view != null && view.getVisibility() != 8) {
            ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) this.f314j.getLayoutParams();
            int i8 = a4 ? marginLayoutParams.rightMargin : marginLayoutParams.leftMargin;
            int i9 = a4 ? marginLayoutParams.leftMargin : marginLayoutParams.rightMargin;
            int b4 = a.b(paddingRight, i8, a4);
            paddingRight = a.b(b4 + c(this.f314j, b4, paddingTop, paddingTop2, a4), i9, a4);
        }
        int i10 = paddingRight;
        LinearLayout linearLayout = this.f316l;
        if (linearLayout != null && this.f315k == null && linearLayout.getVisibility() != 8) {
            i10 += c(this.f316l, i10, paddingTop, paddingTop2, a4);
        }
        View view2 = this.f315k;
        if (view2 != null) {
            c(view2, i10, paddingTop, paddingTop2, a4);
        }
        int paddingLeft = a4 ? getPaddingLeft() : (i6 - i4) - getPaddingRight();
        ActionMenuView actionMenuView = this.f473c;
        if (actionMenuView != null) {
            c(actionMenuView, paddingLeft, paddingTop, paddingTop2, !a4);
        }
    }

    @Override // android.view.View
    protected void onMeasure(int i4, int i5) {
        if (View.MeasureSpec.getMode(i4) != 1073741824) {
            throw new IllegalStateException(getClass().getSimpleName() + c3.d4(714));
        }
        if (View.MeasureSpec.getMode(i5) == 0) {
            throw new IllegalStateException(getClass().getSimpleName() + " can only be used with android:layout_height=\"wrap_content\"");
        }
        int size = View.MeasureSpec.getSize(i4);
        int i6 = this.f475e;
        if (i6 <= 0) {
            i6 = View.MeasureSpec.getSize(i5);
        }
        int paddingTop = getPaddingTop() + getPaddingBottom();
        int paddingLeft = (size - getPaddingLeft()) - getPaddingRight();
        int i7 = i6 - paddingTop;
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(i7, Integer.MIN_VALUE);
        View view = this.f314j;
        if (view != null) {
            int a4 = a(view, paddingLeft, makeMeasureSpec, 0);
            ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) this.f314j.getLayoutParams();
            paddingLeft = a4 - (marginLayoutParams.leftMargin + marginLayoutParams.rightMargin);
        }
        ActionMenuView actionMenuView = this.f473c;
        if (actionMenuView != null && actionMenuView.getParent() == this) {
            paddingLeft = a(this.f473c, paddingLeft, makeMeasureSpec, 0);
        }
        LinearLayout linearLayout = this.f316l;
        if (linearLayout != null && this.f315k == null) {
            if (this.f321q) {
                this.f316l.measure(View.MeasureSpec.makeMeasureSpec(0, 0), makeMeasureSpec);
                int measuredWidth = this.f316l.getMeasuredWidth();
                boolean z3 = measuredWidth <= paddingLeft;
                if (z3) {
                    paddingLeft -= measuredWidth;
                }
                this.f316l.setVisibility(z3 ? 0 : 8);
            } else {
                paddingLeft = a(linearLayout, paddingLeft, makeMeasureSpec, 0);
            }
        }
        View view2 = this.f315k;
        if (view2 != null) {
            ViewGroup.LayoutParams layoutParams = view2.getLayoutParams();
            int i8 = layoutParams.width;
            int i9 = i8 != -2 ? 1073741824 : Integer.MIN_VALUE;
            if (i8 >= 0) {
                paddingLeft = Math.min(i8, paddingLeft);
            }
            int i10 = layoutParams.height;
            int i11 = i10 == -2 ? Integer.MIN_VALUE : 1073741824;
            if (i10 >= 0) {
                i7 = Math.min(i10, i7);
            }
            this.f315k.measure(View.MeasureSpec.makeMeasureSpec(paddingLeft, i9), View.MeasureSpec.makeMeasureSpec(i7, i11));
        }
        if (this.f475e > 0) {
            setMeasuredDimension(size, i6);
            return;
        }
        int childCount = getChildCount();
        int i12 = 0;
        for (int i13 = 0; i13 < childCount; i13++) {
            int measuredHeight = getChildAt(i13).getMeasuredHeight() + paddingTop;
            if (measuredHeight > i12) {
                i12 = measuredHeight;
            }
        }
        setMeasuredDimension(size, i12);
    }

    @Override // androidx.appcompat.widget.a, android.view.View
    public /* bridge */ /* synthetic */ boolean onTouchEvent(MotionEvent motionEvent) {
        return super.onTouchEvent(motionEvent);
    }

    @Override // androidx.appcompat.widget.a
    public void setContentHeight(int i4) {
        this.f475e = i4;
    }

    public void setCustomView(View view) {
        LinearLayout linearLayout;
        View view2 = this.f315k;
        if (view2 != null) {
            removeView(view2);
        }
        this.f315k = view;
        if (view != null && (linearLayout = this.f316l) != null) {
            removeView(linearLayout);
            this.f316l = null;
        }
        if (view != null) {
            addView(view);
        }
        requestLayout();
    }

    public void setSubtitle(CharSequence charSequence) {
        this.f313i = charSequence;
        d();
    }

    public void setTitle(CharSequence charSequence) {
        this.f312h = charSequence;
        d();
        androidx.core.view.v.I(this, charSequence);
    }

    public void setTitleOptional(boolean z3) {
        if (z3 != this.f321q) {
            requestLayout();
        }
        this.f321q = z3;
    }

    @Override // androidx.appcompat.widget.a, android.view.View
    public /* bridge */ /* synthetic */ void setVisibility(int i4) {
        super.setVisibility(i4);
    }

    @Override // android.view.ViewGroup
    public boolean shouldDelayChildPressedState() {
        return false;
    }
}
