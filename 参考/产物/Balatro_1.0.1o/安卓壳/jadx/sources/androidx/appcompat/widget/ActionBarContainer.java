package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.ActionMode;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ActionBarContainer extends FrameLayout {

    /* renamed from: a, reason: collision with root package name */
    private boolean f302a;

    /* renamed from: b, reason: collision with root package name */
    private View f303b;

    /* renamed from: c, reason: collision with root package name */
    private View f304c;

    /* renamed from: d, reason: collision with root package name */
    private View f305d;

    /* renamed from: e, reason: collision with root package name */
    Drawable f306e;

    /* renamed from: f, reason: collision with root package name */
    Drawable f307f;

    /* renamed from: g, reason: collision with root package name */
    Drawable f308g;

    /* renamed from: h, reason: collision with root package name */
    boolean f309h;

    /* renamed from: i, reason: collision with root package name */
    boolean f310i;

    /* renamed from: j, reason: collision with root package name */
    private int f311j;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a {
        public static void a(ActionBarContainer actionBarContainer) {
            actionBarContainer.invalidateOutline();
        }
    }

    public ActionBarContainer(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        androidx.core.view.v.J(this, new b(this));
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, c.i.f1945a);
        this.f306e = obtainStyledAttributes.getDrawable(c.i.f1949b);
        this.f307f = obtainStyledAttributes.getDrawable(c.i.f1957d);
        this.f311j = obtainStyledAttributes.getDimensionPixelSize(c.i.f1977i, -1);
        boolean z3 = true;
        if (getId() == c.e.f1916x) {
            this.f309h = true;
            this.f308g = obtainStyledAttributes.getDrawable(c.i.f1953c);
        }
        obtainStyledAttributes.recycle();
        if (!this.f309h ? this.f306e != null || this.f307f != null : this.f308g != null) {
            z3 = false;
        }
        setWillNotDraw(z3);
    }

    private int a(View view) {
        FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) view.getLayoutParams();
        return view.getMeasuredHeight() + layoutParams.topMargin + layoutParams.bottomMargin;
    }

    private boolean b(View view) {
        return view == null || view.getVisibility() == 8 || view.getMeasuredHeight() == 0;
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void drawableStateChanged() {
        super.drawableStateChanged();
        Drawable drawable = this.f306e;
        if (drawable != null && drawable.isStateful()) {
            this.f306e.setState(getDrawableState());
        }
        Drawable drawable2 = this.f307f;
        if (drawable2 != null && drawable2.isStateful()) {
            this.f307f.setState(getDrawableState());
        }
        Drawable drawable3 = this.f308g;
        if (drawable3 == null || !drawable3.isStateful()) {
            return;
        }
        this.f308g.setState(getDrawableState());
    }

    public View getTabContainer() {
        return this.f303b;
    }

    @Override // android.view.ViewGroup, android.view.View
    public void jumpDrawablesToCurrentState() {
        super.jumpDrawablesToCurrentState();
        Drawable drawable = this.f306e;
        if (drawable != null) {
            drawable.jumpToCurrentState();
        }
        Drawable drawable2 = this.f307f;
        if (drawable2 != null) {
            drawable2.jumpToCurrentState();
        }
        Drawable drawable3 = this.f308g;
        if (drawable3 != null) {
            drawable3.jumpToCurrentState();
        }
    }

    @Override // android.view.View
    public void onFinishInflate() {
        super.onFinishInflate();
        this.f304c = findViewById(c.e.f1893a);
        this.f305d = findViewById(c.e.f1898f);
    }

    @Override // android.view.View
    public boolean onHoverEvent(MotionEvent motionEvent) {
        super.onHoverEvent(motionEvent);
        return true;
    }

    @Override // android.view.ViewGroup
    public boolean onInterceptTouchEvent(MotionEvent motionEvent) {
        return this.f302a || super.onInterceptTouchEvent(motionEvent);
    }

    @Override // android.widget.FrameLayout, android.view.ViewGroup, android.view.View
    public void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        Drawable drawable;
        super.onLayout(z3, i4, i5, i6, i7);
        View view = this.f303b;
        boolean z4 = true;
        boolean z5 = false;
        boolean z6 = (view == null || view.getVisibility() == 8) ? false : true;
        if (view != null && view.getVisibility() != 8) {
            int measuredHeight = getMeasuredHeight();
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) view.getLayoutParams();
            int measuredHeight2 = measuredHeight - view.getMeasuredHeight();
            int i8 = layoutParams.bottomMargin;
            view.layout(i4, measuredHeight2 - i8, i6, measuredHeight - i8);
        }
        if (this.f309h) {
            Drawable drawable2 = this.f308g;
            if (drawable2 != null) {
                drawable2.setBounds(0, 0, getMeasuredWidth(), getMeasuredHeight());
            }
            z4 = z5;
        } else {
            if (this.f306e != null) {
                if (this.f304c.getVisibility() == 0) {
                    this.f306e.setBounds(this.f304c.getLeft(), this.f304c.getTop(), this.f304c.getRight(), this.f304c.getBottom());
                } else {
                    View view2 = this.f305d;
                    if (view2 == null || view2.getVisibility() != 0) {
                        this.f306e.setBounds(0, 0, 0, 0);
                    } else {
                        this.f306e.setBounds(this.f305d.getLeft(), this.f305d.getTop(), this.f305d.getRight(), this.f305d.getBottom());
                    }
                }
                z5 = true;
            }
            this.f310i = z6;
            if (z6 && (drawable = this.f307f) != null) {
                drawable.setBounds(view.getLeft(), view.getTop(), view.getRight(), view.getBottom());
            }
            z4 = z5;
        }
        if (z4) {
            invalidate();
        }
    }

    @Override // android.widget.FrameLayout, android.view.View
    public void onMeasure(int i4, int i5) {
        int i6;
        if (this.f304c == null && View.MeasureSpec.getMode(i5) == Integer.MIN_VALUE && (i6 = this.f311j) >= 0) {
            i5 = View.MeasureSpec.makeMeasureSpec(Math.min(i6, View.MeasureSpec.getSize(i5)), Integer.MIN_VALUE);
        }
        super.onMeasure(i4, i5);
        if (this.f304c == null) {
            return;
        }
        int mode = View.MeasureSpec.getMode(i5);
        View view = this.f303b;
        if (view == null || view.getVisibility() == 8 || mode == 1073741824) {
            return;
        }
        setMeasuredDimension(getMeasuredWidth(), Math.min((!b(this.f304c) ? a(this.f304c) : !b(this.f305d) ? a(this.f305d) : 0) + a(this.f303b), mode == Integer.MIN_VALUE ? View.MeasureSpec.getSize(i5) : Integer.MAX_VALUE));
    }

    @Override // android.view.View
    public boolean onTouchEvent(MotionEvent motionEvent) {
        super.onTouchEvent(motionEvent);
        return true;
    }

    public void setPrimaryBackground(Drawable drawable) {
        Drawable drawable2 = this.f306e;
        if (drawable2 != null) {
            drawable2.setCallback(null);
            unscheduleDrawable(this.f306e);
        }
        this.f306e = drawable;
        if (drawable != null) {
            drawable.setCallback(this);
            View view = this.f304c;
            if (view != null) {
                this.f306e.setBounds(view.getLeft(), this.f304c.getTop(), this.f304c.getRight(), this.f304c.getBottom());
            }
        }
        boolean z3 = false;
        if (!this.f309h ? !(this.f306e != null || this.f307f != null) : this.f308g == null) {
            z3 = true;
        }
        setWillNotDraw(z3);
        invalidate();
        a.a(this);
    }

    public void setSplitBackground(Drawable drawable) {
        Drawable drawable2;
        Drawable drawable3 = this.f308g;
        if (drawable3 != null) {
            drawable3.setCallback(null);
            unscheduleDrawable(this.f308g);
        }
        this.f308g = drawable;
        boolean z3 = false;
        if (drawable != null) {
            drawable.setCallback(this);
            if (this.f309h && (drawable2 = this.f308g) != null) {
                drawable2.setBounds(0, 0, getMeasuredWidth(), getMeasuredHeight());
            }
        }
        if (!this.f309h ? !(this.f306e != null || this.f307f != null) : this.f308g == null) {
            z3 = true;
        }
        setWillNotDraw(z3);
        invalidate();
        a.a(this);
    }

    public void setStackedBackground(Drawable drawable) {
        Drawable drawable2;
        Drawable drawable3 = this.f307f;
        if (drawable3 != null) {
            drawable3.setCallback(null);
            unscheduleDrawable(this.f307f);
        }
        this.f307f = drawable;
        if (drawable != null) {
            drawable.setCallback(this);
            if (this.f310i && (drawable2 = this.f307f) != null) {
                drawable2.setBounds(this.f303b.getLeft(), this.f303b.getTop(), this.f303b.getRight(), this.f303b.getBottom());
            }
        }
        boolean z3 = false;
        if (!this.f309h ? !(this.f306e != null || this.f307f != null) : this.f308g == null) {
            z3 = true;
        }
        setWillNotDraw(z3);
        invalidate();
        a.a(this);
    }

    public void setTabContainer(f0 f0Var) {
        View view = this.f303b;
        if (view != null) {
            removeView(view);
        }
        this.f303b = f0Var;
    }

    public void setTransitioning(boolean z3) {
        this.f302a = z3;
        setDescendantFocusability(z3 ? 393216 : 262144);
    }

    @Override // android.view.View
    public void setVisibility(int i4) {
        super.setVisibility(i4);
        boolean z3 = i4 == 0;
        Drawable drawable = this.f306e;
        if (drawable != null) {
            drawable.setVisible(z3, false);
        }
        Drawable drawable2 = this.f307f;
        if (drawable2 != null) {
            drawable2.setVisible(z3, false);
        }
        Drawable drawable3 = this.f308g;
        if (drawable3 != null) {
            drawable3.setVisible(z3, false);
        }
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public ActionMode startActionModeForChild(View view, ActionMode.Callback callback) {
        return null;
    }

    @Override // android.view.ViewGroup, android.view.ViewParent
    public ActionMode startActionModeForChild(View view, ActionMode.Callback callback, int i4) {
        if (i4 != 0) {
            return super.startActionModeForChild(view, callback, i4);
        }
        return null;
    }

    @Override // android.view.View
    protected boolean verifyDrawable(Drawable drawable) {
        if (drawable == this.f306e && !this.f309h) {
            return true;
        }
        if (drawable == this.f307f && this.f310i) {
            return true;
        }
        return (drawable == this.f308g && this.f309h) || super.verifyDrawable(drawable);
    }
}
