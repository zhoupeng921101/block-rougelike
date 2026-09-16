package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.ContextThemeWrapper;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;
import android.widget.LinearLayout;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.view.menu.e;
import androidx.appcompat.view.menu.i;
import androidx.appcompat.widget.y;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ActionMenuView extends y implements e.b, androidx.appcompat.view.menu.j {
    e A;

    /* renamed from: p, reason: collision with root package name */
    private androidx.appcompat.view.menu.e f352p;

    /* renamed from: q, reason: collision with root package name */
    private Context f353q;

    /* renamed from: r, reason: collision with root package name */
    private int f354r;

    /* renamed from: s, reason: collision with root package name */
    private boolean f355s;

    /* renamed from: t, reason: collision with root package name */
    private androidx.appcompat.widget.c f356t;

    /* renamed from: u, reason: collision with root package name */
    private i.a f357u;

    /* renamed from: v, reason: collision with root package name */
    e.a f358v;

    /* renamed from: w, reason: collision with root package name */
    private boolean f359w;

    /* renamed from: x, reason: collision with root package name */
    private int f360x;

    /* renamed from: y, reason: collision with root package name */
    private int f361y;

    /* renamed from: z, reason: collision with root package name */
    private int f362z;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        boolean b();

        boolean c();
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class b implements i.a {
        b() {
        }

        @Override // androidx.appcompat.view.menu.i.a
        public void a(androidx.appcompat.view.menu.e eVar, boolean z3) {
        }

        @Override // androidx.appcompat.view.menu.i.a
        public boolean b(androidx.appcompat.view.menu.e eVar) {
            return false;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class c extends y.a {

        /* renamed from: a, reason: collision with root package name */
        public boolean f363a;

        /* renamed from: b, reason: collision with root package name */
        public int f364b;

        /* renamed from: c, reason: collision with root package name */
        public int f365c;

        /* renamed from: d, reason: collision with root package name */
        public boolean f366d;

        /* renamed from: e, reason: collision with root package name */
        public boolean f367e;

        /* renamed from: f, reason: collision with root package name */
        boolean f368f;

        public c(int i4, int i5) {
            super(i4, i5);
            this.f363a = false;
        }

        public c(Context context, AttributeSet attributeSet) {
            super(context, attributeSet);
        }

        public c(ViewGroup.LayoutParams layoutParams) {
            super(layoutParams);
        }

        public c(c cVar) {
            super(cVar);
            this.f363a = cVar.f363a;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class d implements e.a {
        d() {
        }

        @Override // androidx.appcompat.view.menu.e.a
        public boolean a(androidx.appcompat.view.menu.e eVar, MenuItem menuItem) {
            e eVar2 = ActionMenuView.this.A;
            return eVar2 != null && eVar2.onMenuItemClick(menuItem);
        }

        @Override // androidx.appcompat.view.menu.e.a
        public void b(androidx.appcompat.view.menu.e eVar) {
            e.a aVar = ActionMenuView.this.f358v;
            if (aVar != null) {
                aVar.b(eVar);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface e {
        boolean onMenuItemClick(MenuItem menuItem);
    }

    public ActionMenuView(Context context) {
        this(context, null);
    }

    public ActionMenuView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        setBaselineAligned(false);
        float f4 = context.getResources().getDisplayMetrics().density;
        this.f361y = (int) (56.0f * f4);
        this.f362z = (int) (f4 * 4.0f);
        this.f353q = context;
        this.f354r = 0;
    }

    static int G(View view, int i4, int i5, int i6, int i7) {
        int i8;
        c cVar = (c) view.getLayoutParams();
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(View.MeasureSpec.getSize(i6) - i7, View.MeasureSpec.getMode(i6));
        ActionMenuItemView actionMenuItemView = view instanceof ActionMenuItemView ? (ActionMenuItemView) view : null;
        boolean z3 = false;
        boolean z4 = actionMenuItemView != null && actionMenuItemView.r();
        if (i5 > 0) {
            i8 = 2;
            if (!z4 || i5 >= 2) {
                view.measure(View.MeasureSpec.makeMeasureSpec(i5 * i4, Integer.MIN_VALUE), makeMeasureSpec);
                int measuredWidth = view.getMeasuredWidth();
                int i9 = measuredWidth / i4;
                if (measuredWidth % i4 != 0) {
                    i9++;
                }
                if (!z4 || i9 >= 2) {
                    i8 = i9;
                }
                if (!cVar.f363a && z4) {
                    z3 = true;
                }
                cVar.f366d = z3;
                cVar.f364b = i8;
                view.measure(View.MeasureSpec.makeMeasureSpec(i4 * i8, 1073741824), makeMeasureSpec);
                return i8;
            }
        }
        i8 = 0;
        if (!cVar.f363a) {
            z3 = true;
        }
        cVar.f366d = z3;
        cVar.f364b = i8;
        view.measure(View.MeasureSpec.makeMeasureSpec(i4 * i8, 1073741824), makeMeasureSpec);
        return i8;
    }

    /* JADX WARN: Type inference failed for: r3v33 */
    /* JADX WARN: Type inference failed for: r3v34, types: [boolean, int] */
    /* JADX WARN: Type inference failed for: r3v48 */
    private void H(int i4, int i5) {
        long j4;
        int i6;
        int i7;
        boolean z3;
        boolean z4;
        ?? r3;
        int i8;
        int mode = View.MeasureSpec.getMode(i5);
        int size = View.MeasureSpec.getSize(i4);
        int size2 = View.MeasureSpec.getSize(i5);
        int paddingLeft = getPaddingLeft() + getPaddingRight();
        int paddingTop = getPaddingTop() + getPaddingBottom();
        int childMeasureSpec = ViewGroup.getChildMeasureSpec(i5, paddingTop, -2);
        int i9 = size - paddingLeft;
        int i10 = this.f361y;
        int i11 = i9 / i10;
        int i12 = i9 % i10;
        if (i11 == 0) {
            setMeasuredDimension(i9, 0);
            return;
        }
        int i13 = i10 + (i12 / i11);
        int childCount = getChildCount();
        int i14 = 0;
        int i15 = 0;
        boolean z5 = false;
        int i16 = 0;
        int i17 = 0;
        int i18 = 0;
        long j5 = 0;
        while (i15 < childCount) {
            View childAt = getChildAt(i15);
            int i19 = size2;
            if (childAt.getVisibility() == 8) {
                i8 = i13;
            } else {
                boolean z6 = childAt instanceof ActionMenuItemView;
                i16++;
                if (z6) {
                    int i20 = this.f362z;
                    z4 = z6;
                    r3 = 0;
                    childAt.setPadding(i20, 0, i20, 0);
                } else {
                    z4 = z6;
                    r3 = 0;
                }
                c cVar = (c) childAt.getLayoutParams();
                cVar.f368f = r3;
                cVar.f365c = r3;
                cVar.f364b = r3;
                cVar.f366d = r3;
                ((LinearLayout.LayoutParams) cVar).leftMargin = r3;
                ((LinearLayout.LayoutParams) cVar).rightMargin = r3;
                cVar.f367e = z4 && ((ActionMenuItemView) childAt).r();
                int G = G(childAt, i13, cVar.f363a ? 1 : i11, childMeasureSpec, paddingTop);
                i17 = Math.max(i17, G);
                i8 = i13;
                if (cVar.f366d) {
                    i18++;
                }
                if (cVar.f363a) {
                    z5 = true;
                }
                i11 -= G;
                i14 = Math.max(i14, childAt.getMeasuredHeight());
                if (G == 1) {
                    j5 |= 1 << i15;
                }
            }
            i15++;
            size2 = i19;
            i13 = i8;
        }
        int i21 = size2;
        int i22 = i13;
        char c4 = 2;
        boolean z7 = z5 && i16 == 2;
        boolean z8 = false;
        while (i18 > 0 && i11 > 0) {
            int i23 = Integer.MAX_VALUE;
            long j6 = 0;
            char c5 = c4;
            int i24 = 0;
            int i25 = 0;
            j4 = 1;
            while (i25 < childCount) {
                c cVar2 = (c) getChildAt(i25).getLayoutParams();
                boolean z9 = z7;
                if (cVar2.f366d) {
                    int i26 = cVar2.f364b;
                    if (i26 < i23) {
                        j6 = 1 << i25;
                        i23 = i26;
                        i24 = 1;
                    } else if (i26 == i23) {
                        j6 |= 1 << i25;
                        i24++;
                    }
                }
                i25++;
                z7 = z9;
            }
            boolean z10 = z7;
            j5 |= j6;
            if (i24 > i11) {
                break;
            }
            int i27 = i23 + 1;
            int i28 = 0;
            while (i28 < childCount) {
                View childAt2 = getChildAt(i28);
                c cVar3 = (c) childAt2.getLayoutParams();
                long j7 = 1 << i28;
                if ((j6 & j7) == 0) {
                    if (cVar3.f364b == i27) {
                        j5 |= j7;
                    }
                    i7 = i28;
                } else {
                    if (!z10 || !cVar3.f367e) {
                        i7 = i28;
                        z3 = true;
                    } else if (i11 == 1) {
                        int i29 = this.f362z;
                        z3 = true;
                        i7 = i28;
                        childAt2.setPadding(i29 + i22, 0, i29, 0);
                    } else {
                        i7 = i28;
                        z3 = true;
                    }
                    cVar3.f364b++;
                    cVar3.f368f = z3;
                    i11--;
                }
                i28 = i7 + 1;
            }
            c4 = c5;
            z7 = z10;
            z8 = true;
        }
        j4 = 1;
        boolean z11 = !z5 && i16 == 1;
        if (i11 <= 0 || j5 == 0 || (i11 >= i16 - 1 && !z11 && i17 <= 1)) {
            i6 = 0;
        } else {
            float bitCount = Long.bitCount(j5);
            if (z11) {
                i6 = 0;
            } else {
                if ((j5 & j4) != 0) {
                    i6 = 0;
                    if (!((c) getChildAt(0).getLayoutParams()).f367e) {
                        bitCount -= 0.5f;
                    }
                } else {
                    i6 = 0;
                }
                int i30 = childCount - 1;
                if ((j5 & (1 << i30)) != 0 && !((c) getChildAt(i30).getLayoutParams()).f367e) {
                    bitCount -= 0.5f;
                }
            }
            int i31 = bitCount > 0.0f ? (int) ((i11 * i22) / bitCount) : i6;
            boolean z12 = z8;
            for (int i32 = i6; i32 < childCount; i32++) {
                if ((j5 & (1 << i32)) != 0) {
                    View childAt3 = getChildAt(i32);
                    c cVar4 = (c) childAt3.getLayoutParams();
                    if (childAt3 instanceof ActionMenuItemView) {
                        cVar4.f365c = i31;
                        cVar4.f368f = true;
                        if (i32 == 0 && !cVar4.f367e) {
                            ((LinearLayout.LayoutParams) cVar4).leftMargin = (-i31) / 2;
                        }
                        z12 = true;
                    } else {
                        if (cVar4.f363a) {
                            cVar4.f365c = i31;
                            cVar4.f368f = true;
                            ((LinearLayout.LayoutParams) cVar4).rightMargin = (-i31) / 2;
                            z12 = true;
                        } else {
                            if (i32 != 0) {
                                ((LinearLayout.LayoutParams) cVar4).leftMargin = i31 / 2;
                            }
                            if (i32 != childCount - 1) {
                                ((LinearLayout.LayoutParams) cVar4).rightMargin = i31 / 2;
                            }
                        }
                    }
                }
            }
            z8 = z12;
        }
        if (z8) {
            for (int i33 = i6; i33 < childCount; i33++) {
                View childAt4 = getChildAt(i33);
                c cVar5 = (c) childAt4.getLayoutParams();
                if (cVar5.f368f) {
                    childAt4.measure(View.MeasureSpec.makeMeasureSpec((cVar5.f364b * i22) + cVar5.f365c, 1073741824), childMeasureSpec);
                }
            }
        }
        setMeasuredDimension(i9, mode != 1073741824 ? i14 : i21);
    }

    @Override // androidx.appcompat.widget.y
    /* renamed from: A, reason: merged with bridge method [inline-methods] */
    public c generateLayoutParams(AttributeSet attributeSet) {
        return new c(getContext(), attributeSet);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.appcompat.widget.y
    /* renamed from: B, reason: merged with bridge method [inline-methods] */
    public c generateLayoutParams(ViewGroup.LayoutParams layoutParams) {
        if (layoutParams == null) {
            return generateDefaultLayoutParams();
        }
        c cVar = layoutParams instanceof c ? new c((c) layoutParams) : new c(layoutParams);
        if (((LinearLayout.LayoutParams) cVar).gravity <= 0) {
            ((LinearLayout.LayoutParams) cVar).gravity = 16;
        }
        return cVar;
    }

    public c C() {
        c generateDefaultLayoutParams = generateDefaultLayoutParams();
        generateDefaultLayoutParams.f363a = true;
        return generateDefaultLayoutParams;
    }

    protected boolean D(int i4) {
        boolean z3 = false;
        if (i4 == 0) {
            return false;
        }
        KeyEvent.Callback childAt = getChildAt(i4 - 1);
        KeyEvent.Callback childAt2 = getChildAt(i4);
        if (i4 < getChildCount() && (childAt instanceof a)) {
            z3 = ((a) childAt).b();
        }
        return (i4 <= 0 || !(childAt2 instanceof a)) ? z3 : ((a) childAt2).c() | z3;
    }

    public void E(androidx.appcompat.view.menu.e eVar) {
        this.f352p = eVar;
    }

    public boolean F() {
        androidx.appcompat.widget.c cVar = this.f356t;
        return cVar != null && cVar.B();
    }

    public androidx.appcompat.view.menu.e I() {
        return this.f352p;
    }

    public void J(i.a aVar, e.a aVar2) {
        this.f357u = aVar;
        this.f358v = aVar2;
    }

    public boolean K() {
        androidx.appcompat.widget.c cVar = this.f356t;
        return cVar != null && cVar.H();
    }

    @Override // androidx.appcompat.view.menu.e.b
    public boolean a(androidx.appcompat.view.menu.f fVar) {
        return this.f352p.H(fVar, 0);
    }

    @Override // androidx.appcompat.widget.y, android.view.ViewGroup
    protected boolean checkLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return layoutParams instanceof c;
    }

    @Override // android.view.View
    public boolean dispatchPopulateAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        return false;
    }

    public Menu getMenu() {
        if (this.f352p == null) {
            Context context = getContext();
            androidx.appcompat.view.menu.e eVar = new androidx.appcompat.view.menu.e(context);
            this.f352p = eVar;
            eVar.L(new d());
            androidx.appcompat.widget.c cVar = new androidx.appcompat.widget.c(context);
            this.f356t = cVar;
            cVar.G(true);
            androidx.appcompat.widget.c cVar2 = this.f356t;
            i.a aVar = this.f357u;
            if (aVar == null) {
                aVar = new b();
            }
            cVar2.k(aVar);
            this.f352p.b(this.f356t, this.f353q);
            this.f356t.E(this);
        }
        return this.f352p;
    }

    public Drawable getOverflowIcon() {
        getMenu();
        return this.f356t.y();
    }

    public int getPopupTheme() {
        return this.f354r;
    }

    public int getWindowAnimations() {
        return 0;
    }

    @Override // android.view.View
    public void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);
        androidx.appcompat.widget.c cVar = this.f356t;
        if (cVar != null) {
            cVar.f(false);
            if (this.f356t.B()) {
                this.f356t.z();
                this.f356t.H();
            }
        }
    }

    @Override // android.view.ViewGroup, android.view.View
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        y();
    }

    @Override // androidx.appcompat.widget.y, android.view.ViewGroup, android.view.View
    protected void onLayout(boolean z3, int i4, int i5, int i6, int i7) {
        int width;
        int i8;
        if (!this.f359w) {
            super.onLayout(z3, i4, i5, i6, i7);
            return;
        }
        int childCount = getChildCount();
        int i9 = (i7 - i5) / 2;
        int dividerWidth = getDividerWidth();
        int i10 = i6 - i4;
        int paddingRight = (i10 - getPaddingRight()) - getPaddingLeft();
        boolean a4 = v0.a(this);
        int i11 = 0;
        int i12 = 0;
        for (int i13 = 0; i13 < childCount; i13++) {
            View childAt = getChildAt(i13);
            if (childAt.getVisibility() != 8) {
                c cVar = (c) childAt.getLayoutParams();
                if (cVar.f363a) {
                    int measuredWidth = childAt.getMeasuredWidth();
                    if (D(i13)) {
                        measuredWidth += dividerWidth;
                    }
                    int measuredHeight = childAt.getMeasuredHeight();
                    if (a4) {
                        i8 = getPaddingLeft() + ((LinearLayout.LayoutParams) cVar).leftMargin;
                        width = i8 + measuredWidth;
                    } else {
                        width = (getWidth() - getPaddingRight()) - ((LinearLayout.LayoutParams) cVar).rightMargin;
                        i8 = width - measuredWidth;
                    }
                    int i14 = i9 - (measuredHeight / 2);
                    childAt.layout(i8, i14, width, measuredHeight + i14);
                    paddingRight -= measuredWidth;
                    i11 = 1;
                } else {
                    paddingRight -= (childAt.getMeasuredWidth() + ((LinearLayout.LayoutParams) cVar).leftMargin) + ((LinearLayout.LayoutParams) cVar).rightMargin;
                    D(i13);
                    i12++;
                }
            }
        }
        if (childCount == 1 && i11 == 0) {
            View childAt2 = getChildAt(0);
            int measuredWidth2 = childAt2.getMeasuredWidth();
            int measuredHeight2 = childAt2.getMeasuredHeight();
            int i15 = (i10 / 2) - (measuredWidth2 / 2);
            int i16 = i9 - (measuredHeight2 / 2);
            childAt2.layout(i15, i16, measuredWidth2 + i15, measuredHeight2 + i16);
            return;
        }
        int i17 = i12 - (i11 ^ 1);
        int max = Math.max(0, i17 > 0 ? paddingRight / i17 : 0);
        if (a4) {
            int width2 = getWidth() - getPaddingRight();
            for (int i18 = 0; i18 < childCount; i18++) {
                View childAt3 = getChildAt(i18);
                c cVar2 = (c) childAt3.getLayoutParams();
                if (childAt3.getVisibility() != 8 && !cVar2.f363a) {
                    int i19 = width2 - ((LinearLayout.LayoutParams) cVar2).rightMargin;
                    int measuredWidth3 = childAt3.getMeasuredWidth();
                    int measuredHeight3 = childAt3.getMeasuredHeight();
                    int i20 = i9 - (measuredHeight3 / 2);
                    childAt3.layout(i19 - measuredWidth3, i20, i19, measuredHeight3 + i20);
                    width2 = i19 - ((measuredWidth3 + ((LinearLayout.LayoutParams) cVar2).leftMargin) + max);
                }
            }
            return;
        }
        int paddingLeft = getPaddingLeft();
        for (int i21 = 0; i21 < childCount; i21++) {
            View childAt4 = getChildAt(i21);
            c cVar3 = (c) childAt4.getLayoutParams();
            if (childAt4.getVisibility() != 8 && !cVar3.f363a) {
                int i22 = paddingLeft + ((LinearLayout.LayoutParams) cVar3).leftMargin;
                int measuredWidth4 = childAt4.getMeasuredWidth();
                int measuredHeight4 = childAt4.getMeasuredHeight();
                int i23 = i9 - (measuredHeight4 / 2);
                childAt4.layout(i22, i23, i22 + measuredWidth4, measuredHeight4 + i23);
                paddingLeft = i22 + measuredWidth4 + ((LinearLayout.LayoutParams) cVar3).rightMargin + max;
            }
        }
    }

    @Override // androidx.appcompat.widget.y, android.view.View
    protected void onMeasure(int i4, int i5) {
        androidx.appcompat.view.menu.e eVar;
        boolean z3 = this.f359w;
        boolean z4 = View.MeasureSpec.getMode(i4) == 1073741824;
        this.f359w = z4;
        if (z3 != z4) {
            this.f360x = 0;
        }
        int size = View.MeasureSpec.getSize(i4);
        if (this.f359w && (eVar = this.f352p) != null && size != this.f360x) {
            this.f360x = size;
            eVar.G(true);
        }
        int childCount = getChildCount();
        if (this.f359w && childCount > 0) {
            H(i4, i5);
            return;
        }
        for (int i6 = 0; i6 < childCount; i6++) {
            c cVar = (c) getChildAt(i6).getLayoutParams();
            ((LinearLayout.LayoutParams) cVar).rightMargin = 0;
            ((LinearLayout.LayoutParams) cVar).leftMargin = 0;
        }
        super.onMeasure(i4, i5);
    }

    public void setExpandedActionViewsExclusive(boolean z3) {
        this.f356t.D(z3);
    }

    public void setOnMenuItemClickListener(e eVar) {
        this.A = eVar;
    }

    public void setOverflowIcon(Drawable drawable) {
        getMenu();
        this.f356t.F(drawable);
    }

    public void setOverflowReserved(boolean z3) {
        this.f355s = z3;
    }

    public void setPopupTheme(int i4) {
        if (this.f354r != i4) {
            this.f354r = i4;
            if (i4 == 0) {
                this.f353q = getContext();
            } else {
                this.f353q = new ContextThemeWrapper(getContext(), i4);
            }
        }
    }

    public void setPresenter(androidx.appcompat.widget.c cVar) {
        this.f356t = cVar;
        cVar.E(this);
    }

    public void y() {
        androidx.appcompat.widget.c cVar = this.f356t;
        if (cVar != null) {
            cVar.w();
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.appcompat.widget.y
    /* renamed from: z, reason: merged with bridge method [inline-methods] */
    public c generateDefaultLayoutParams() {
        c cVar = new c(-2, -2);
        ((LinearLayout.LayoutParams) cVar).gravity = 16;
        return cVar;
    }
}
