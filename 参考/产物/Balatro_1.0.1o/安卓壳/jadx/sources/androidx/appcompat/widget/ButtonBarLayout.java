package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.View;
import android.widget.LinearLayout;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ButtonBarLayout extends LinearLayout {

    /* renamed from: a, reason: collision with root package name */
    private boolean f371a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f372b;

    /* renamed from: c, reason: collision with root package name */
    private int f373c;

    public ButtonBarLayout(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        this.f373c = -1;
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, c.i.f1994m0);
        androidx.core.view.v.F(this, context, c.i.f1994m0, attributeSet, obtainStyledAttributes, 0, 0);
        this.f371a = obtainStyledAttributes.getBoolean(c.i.f1998n0, true);
        obtainStyledAttributes.recycle();
        if (getOrientation() == 1) {
            setStacked(this.f371a);
        }
    }

    private int a(int i4) {
        int childCount = getChildCount();
        while (i4 < childCount) {
            if (getChildAt(i4).getVisibility() == 0) {
                return i4;
            }
            i4++;
        }
        return -1;
    }

    private boolean b() {
        return this.f372b;
    }

    private void setStacked(boolean z3) {
        if (this.f372b != z3) {
            if (!z3 || this.f371a) {
                this.f372b = z3;
                setOrientation(z3 ? 1 : 0);
                setGravity(z3 ? 8388613 : 80);
                View findViewById = findViewById(c.e.f1915w);
                if (findViewById != null) {
                    findViewById.setVisibility(z3 ? 8 : 4);
                }
                for (int childCount = getChildCount() - 2; childCount >= 0; childCount--) {
                    bringChildToFront(getChildAt(childCount));
                }
            }
        }
    }

    @Override // android.widget.LinearLayout, android.view.View
    protected void onMeasure(int i4, int i5) {
        int i6;
        boolean z3;
        int size = View.MeasureSpec.getSize(i4);
        int i7 = 0;
        if (this.f371a) {
            if (size > this.f373c && b()) {
                setStacked(false);
            }
            this.f373c = size;
        }
        if (b() || View.MeasureSpec.getMode(i4) != 1073741824) {
            i6 = i4;
            z3 = false;
        } else {
            i6 = View.MeasureSpec.makeMeasureSpec(size, Integer.MIN_VALUE);
            z3 = true;
        }
        super.onMeasure(i6, i5);
        if (this.f371a && !b() && (getMeasuredWidthAndState() & (-16777216)) == 16777216) {
            setStacked(true);
            z3 = true;
        }
        if (z3) {
            super.onMeasure(i4, i5);
        }
        int a4 = a(0);
        if (a4 >= 0) {
            View childAt = getChildAt(a4);
            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) childAt.getLayoutParams();
            int paddingTop = getPaddingTop() + childAt.getMeasuredHeight() + layoutParams.topMargin + layoutParams.bottomMargin;
            if (b()) {
                int a5 = a(a4 + 1);
                if (a5 >= 0) {
                    paddingTop += getChildAt(a5).getPaddingTop() + ((int) (getResources().getDisplayMetrics().density * 16.0f));
                }
                i7 = paddingTop;
            } else {
                i7 = paddingTop + getPaddingBottom();
            }
        }
        if (androidx.core.view.v.p(this) != i7) {
            setMinimumHeight(i7);
            if (i5 == 0) {
                super.onMeasure(i4, i5);
            }
        }
    }

    public void setAllowStacking(boolean z3) {
        if (this.f371a != z3) {
            this.f371a = z3;
            if (!z3 && b()) {
                setStacked(false);
            }
            requestLayout();
        }
    }
}
