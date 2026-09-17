package androidx.appcompat.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import androidx.appcompat.widget.y;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class AlertDialogLayout extends y {
    public AlertDialogLayout(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }

    private void i(int i4, int i5) {
        int i6;
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(getMeasuredWidth(), 1073741824);
        int i7 = 0;
        while (i7 < i4) {
            View childAt = getChildAt(i7);
            if (childAt.getVisibility() != 8) {
                y.a aVar = (y.a) childAt.getLayoutParams();
                if (((LinearLayout.LayoutParams) aVar).width == -1) {
                    int i8 = ((LinearLayout.LayoutParams) aVar).height;
                    ((LinearLayout.LayoutParams) aVar).height = childAt.getMeasuredHeight();
                    i6 = i5;
                    measureChildWithMargins(childAt, makeMeasureSpec, 0, i6, 0);
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

    private static int y(View view) {
        int p3 = androidx.core.view.v.p(view);
        if (p3 > 0) {
            return p3;
        }
        if (view instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) view;
            if (viewGroup.getChildCount() == 1) {
                return y(viewGroup.getChildAt(0));
            }
        }
        return 0;
    }

    private boolean z(int i4, int i5) {
        int i6;
        int i7;
        int i8;
        int i9;
        int childCount = getChildCount();
        View view = null;
        View view2 = null;
        View view3 = null;
        for (int i10 = 0; i10 < childCount; i10++) {
            View childAt = getChildAt(i10);
            if (childAt.getVisibility() != 8) {
                int id = childAt.getId();
                if (id == c.e.B) {
                    view = childAt;
                } else if (id == c.e.f1899g) {
                    view2 = childAt;
                } else {
                    if ((id != c.e.f1901i && id != c.e.f1902j) || view3 != null) {
                        return false;
                    }
                    view3 = childAt;
                }
            }
        }
        int mode = View.MeasureSpec.getMode(i5);
        int size = View.MeasureSpec.getSize(i5);
        int mode2 = View.MeasureSpec.getMode(i4);
        int paddingTop = getPaddingTop() + getPaddingBottom();
        if (view != null) {
            view.measure(i4, 0);
            paddingTop += view.getMeasuredHeight();
            i6 = View.combineMeasuredStates(0, view.getMeasuredState());
        } else {
            i6 = 0;
        }
        if (view2 != null) {
            view2.measure(i4, 0);
            i7 = y(view2);
            i8 = view2.getMeasuredHeight() - i7;
            paddingTop += i7;
            i6 = View.combineMeasuredStates(i6, view2.getMeasuredState());
        } else {
            i7 = 0;
            i8 = 0;
        }
        if (view3 != null) {
            view3.measure(i4, mode == 0 ? 0 : View.MeasureSpec.makeMeasureSpec(Math.max(0, size - paddingTop), mode));
            i9 = view3.getMeasuredHeight();
            paddingTop += i9;
            i6 = View.combineMeasuredStates(i6, view3.getMeasuredState());
        } else {
            i9 = 0;
        }
        int i11 = size - paddingTop;
        if (view2 != null) {
            int i12 = paddingTop - i7;
            int min = Math.min(i11, i8);
            if (min > 0) {
                i11 -= min;
                i7 += min;
            }
            view2.measure(i4, View.MeasureSpec.makeMeasureSpec(i7, 1073741824));
            paddingTop = i12 + view2.getMeasuredHeight();
            i6 = View.combineMeasuredStates(i6, view2.getMeasuredState());
        }
        if (view3 != null && i11 > 0) {
            view3.measure(i4, View.MeasureSpec.makeMeasureSpec(i9 + i11, mode));
            paddingTop = (paddingTop - i9) + view3.getMeasuredHeight();
            i6 = View.combineMeasuredStates(i6, view3.getMeasuredState());
        }
        int i13 = 0;
        for (int i14 = 0; i14 < childCount; i14++) {
            View childAt2 = getChildAt(i14);
            if (childAt2.getVisibility() != 8) {
                i13 = Math.max(i13, childAt2.getMeasuredWidth());
            }
        }
        setMeasuredDimension(View.resolveSizeAndState(i13 + getPaddingLeft() + getPaddingRight(), i4, i6), View.resolveSizeAndState(paddingTop, i5, 0));
        if (mode2 == 1073741824) {
            return true;
        }
        i(childCount, i5);
        return true;
    }

    /* JADX WARN: Removed duplicated region for block: B:26:0x00a0  */
    @Override // androidx.appcompat.widget.y, android.view.ViewGroup, android.view.View
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    protected void onLayout(boolean r11, int r12, int r13, int r14, int r15) {
        /*
            r10 = this;
            int r11 = r10.getPaddingLeft()
            int r14 = r14 - r12
            int r12 = r10.getPaddingRight()
            int r12 = r14 - r12
            int r14 = r14 - r11
            int r0 = r10.getPaddingRight()
            int r14 = r14 - r0
            int r0 = r10.getMeasuredHeight()
            int r1 = r10.getChildCount()
            int r2 = r10.getGravity()
            r3 = r2 & 112(0x70, float:1.57E-43)
            r4 = 8388615(0x800007, float:1.1754953E-38)
            r2 = r2 & r4
            r4 = 16
            if (r3 == r4) goto L39
            r4 = 80
            if (r3 == r4) goto L30
            int r13 = r10.getPaddingTop()
            goto L43
        L30:
            int r3 = r10.getPaddingTop()
            int r3 = r3 + r15
            int r3 = r3 - r13
            int r13 = r3 - r0
            goto L43
        L39:
            int r3 = r10.getPaddingTop()
            int r15 = r15 - r13
            int r15 = r15 - r0
            int r15 = r15 / 2
            int r13 = r3 + r15
        L43:
            android.graphics.drawable.Drawable r15 = r10.getDividerDrawable()
            r0 = 0
            if (r15 != 0) goto L4c
            r15 = r0
            goto L50
        L4c:
            int r15 = r15.getIntrinsicHeight()
        L50:
            if (r0 >= r1) goto Lb1
            android.view.View r4 = r10.getChildAt(r0)
            if (r4 == 0) goto Lae
            int r3 = r4.getVisibility()
            r5 = 8
            if (r3 == r5) goto Lae
            int r7 = r4.getMeasuredWidth()
            int r8 = r4.getMeasuredHeight()
            android.view.ViewGroup$LayoutParams r3 = r4.getLayoutParams()
            r9 = r3
            androidx.appcompat.widget.y$a r9 = (androidx.appcompat.widget.y.a) r9
            int r3 = r9.gravity
            if (r3 >= 0) goto L74
            r3 = r2
        L74:
            int r5 = androidx.core.view.v.o(r10)
            int r3 = androidx.core.view.e.a(r3, r5)
            r3 = r3 & 7
            r5 = 1
            if (r3 == r5) goto L8f
            r5 = 5
            if (r3 == r5) goto L89
            int r3 = r9.leftMargin
            int r3 = r3 + r11
        L87:
            r5 = r3
            goto L9a
        L89:
            int r3 = r12 - r7
            int r5 = r9.rightMargin
        L8d:
            int r3 = r3 - r5
            goto L87
        L8f:
            int r3 = r14 - r7
            int r3 = r3 / 2
            int r3 = r3 + r11
            int r5 = r9.leftMargin
            int r3 = r3 + r5
            int r5 = r9.rightMargin
            goto L8d
        L9a:
            boolean r3 = r10.q(r0)
            if (r3 == 0) goto La1
            int r13 = r13 + r15
        La1:
            int r3 = r9.topMargin
            int r6 = r13 + r3
            r3 = r10
            r3.x(r4, r5, r6, r7, r8)
            int r13 = r9.bottomMargin
            int r8 = r8 + r13
            int r6 = r6 + r8
            r13 = r6
        Lae:
            int r0 = r0 + 1
            goto L50
        Lb1:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.AlertDialogLayout.onLayout(boolean, int, int, int, int):void");
    }

    @Override // androidx.appcompat.widget.y, android.view.View
    protected void onMeasure(int i4, int i5) {
        if (z(i4, i5)) {
            return;
        }
        super.onMeasure(i4, i5);
    }
}
