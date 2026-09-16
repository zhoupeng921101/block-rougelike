package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.ContextThemeWrapper;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class a extends ViewGroup {

    /* renamed from: a, reason: collision with root package name */
    protected final C0003a f471a;

    /* renamed from: b, reason: collision with root package name */
    protected final Context f472b;

    /* renamed from: c, reason: collision with root package name */
    protected ActionMenuView f473c;

    /* renamed from: d, reason: collision with root package name */
    protected c f474d;

    /* renamed from: e, reason: collision with root package name */
    protected int f475e;

    /* renamed from: f, reason: collision with root package name */
    private boolean f476f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f477g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.appcompat.widget.a$a, reason: collision with other inner class name */
    protected class C0003a {

        /* renamed from: a, reason: collision with root package name */
        private boolean f478a = false;

        protected C0003a() {
        }
    }

    a(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f471a = new C0003a();
        TypedValue typedValue = new TypedValue();
        if (!context.getTheme().resolveAttribute(c.a.f1829a, typedValue, true) || typedValue.resourceId == 0) {
            this.f472b = context;
        } else {
            this.f472b = new ContextThemeWrapper(context, typedValue.resourceId);
        }
    }

    protected static int b(int i4, int i5, boolean z3) {
        return z3 ? i4 - i5 : i4 + i5;
    }

    protected int a(View view, int i4, int i5, int i6) {
        view.measure(View.MeasureSpec.makeMeasureSpec(i4, Integer.MIN_VALUE), i5);
        return Math.max(0, (i4 - view.getMeasuredWidth()) - i6);
    }

    protected int c(View view, int i4, int i5, int i6, boolean z3) {
        int measuredWidth = view.getMeasuredWidth();
        int measuredHeight = view.getMeasuredHeight();
        int i7 = i5 + ((i6 - measuredHeight) / 2);
        if (z3) {
            view.layout(i4 - measuredWidth, i7, i4, measuredHeight + i7);
        } else {
            view.layout(i4, i7, i4 + measuredWidth, measuredHeight + i7);
        }
        return z3 ? -measuredWidth : measuredWidth;
    }

    public int getAnimatedVisibility() {
        return getVisibility();
    }

    public int getContentHeight() {
        return this.f475e;
    }

    @Override // android.view.View
    protected void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);
        TypedArray obtainStyledAttributes = getContext().obtainStyledAttributes(null, c.i.f1945a, c.a.f1831c, 0);
        setContentHeight(obtainStyledAttributes.getLayoutDimension(c.i.f1977i, 0));
        obtainStyledAttributes.recycle();
        c cVar = this.f474d;
        if (cVar != null) {
            cVar.C(configuration);
        }
    }

    @Override // android.view.View
    public boolean onHoverEvent(MotionEvent motionEvent) {
        int actionMasked = motionEvent.getActionMasked();
        if (actionMasked == 9) {
            this.f477g = false;
        }
        if (!this.f477g) {
            boolean onHoverEvent = super.onHoverEvent(motionEvent);
            if (actionMasked == 9 && !onHoverEvent) {
                this.f477g = true;
            }
        }
        if (actionMasked == 10 || actionMasked == 3) {
            this.f477g = false;
        }
        return true;
    }

    @Override // android.view.View
    public boolean onTouchEvent(MotionEvent motionEvent) {
        int actionMasked = motionEvent.getActionMasked();
        if (actionMasked == 0) {
            this.f476f = false;
        }
        if (!this.f476f) {
            boolean onTouchEvent = super.onTouchEvent(motionEvent);
            if (actionMasked == 0 && !onTouchEvent) {
                this.f476f = true;
            }
        }
        if (actionMasked == 1 || actionMasked == 3) {
            this.f476f = false;
        }
        return true;
    }

    public abstract void setContentHeight(int i4);

    @Override // android.view.View
    public void setVisibility(int i4) {
        if (i4 != getVisibility()) {
            super.setVisibility(i4);
        }
    }
}
