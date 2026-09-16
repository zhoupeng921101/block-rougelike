package androidx.fragment.app;

import a1.b2.c3;
import android.animation.LayoutTransition;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m extends FrameLayout {

    /* renamed from: a, reason: collision with root package name */
    private final List f1548a;

    /* renamed from: b, reason: collision with root package name */
    private final List f1549b;

    /* renamed from: c, reason: collision with root package name */
    private View.OnApplyWindowInsetsListener f1550c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f1551d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        public static final a f1552a = new a();

        private a() {
        }

        public final WindowInsets a(View.OnApplyWindowInsetsListener onApplyWindowInsetsListener, View view, WindowInsets windowInsets) {
            b3.f.e(onApplyWindowInsetsListener, "onApplyWindowInsetsListener");
            b3.f.e(view, "v");
            b3.f.e(windowInsets, "insets");
            WindowInsets onApplyWindowInsets = onApplyWindowInsetsListener.onApplyWindowInsets(view, windowInsets);
            b3.f.d(onApplyWindowInsets, "onApplyWindowInsetsListe…lyWindowInsets(v, insets)");
            return onApplyWindowInsets;
        }
    }

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public m(Context context, AttributeSet attributeSet, x xVar) {
        super(context, attributeSet);
        String str;
        b3.f.e(context, c3.d4(970));
        b3.f.e(attributeSet, c3.d4(1355));
        b3.f.e(xVar, "fm");
        this.f1548a = new ArrayList();
        this.f1549b = new ArrayList();
        this.f1551d = true;
        String classAttribute = attributeSet.getClassAttribute();
        int[] iArr = u.c.f5014e;
        b3.f.d(iArr, "FragmentContainerView");
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, iArr, 0, 0);
        classAttribute = classAttribute == null ? obtainStyledAttributes.getString(u.c.f5015f) : classAttribute;
        String string = obtainStyledAttributes.getString(u.c.f5016g);
        obtainStyledAttributes.recycle();
        int id = getId();
        Fragment g02 = xVar.g0(id);
        if (classAttribute != null && g02 == null) {
            if (id == -1) {
                if (string != null) {
                    str = " with tag " + string;
                } else {
                    str = "";
                }
                throw new IllegalStateException(c3.d4(670) + classAttribute + str);
            }
            Fragment a4 = xVar.r0().a(context.getClassLoader(), classAttribute);
            b3.f.d(a4, "fm.fragmentFactory.insta…ontext.classLoader, name)");
            a4.y0(context, attributeSet, null);
            xVar.o().m(true).c(this, a4, string).i();
        }
        xVar.R0(this);
    }

    private final void a(View view) {
        if (this.f1549b.contains(view)) {
            this.f1548a.add(view);
        }
    }

    @Override // android.view.ViewGroup
    public void addView(View view, int i4, ViewGroup.LayoutParams layoutParams) {
        b3.f.e(view, "child");
        if (x.A0(view) != null) {
            super.addView(view, i4, layoutParams);
            return;
        }
        throw new IllegalStateException(("Views added to a FragmentContainerView must be associated with a Fragment. View " + view + " is not associated with a Fragment.").toString());
    }

    @Override // android.view.ViewGroup, android.view.View
    public WindowInsets dispatchApplyWindowInsets(WindowInsets windowInsets) {
        androidx.core.view.a0 z3;
        b3.f.e(windowInsets, "insets");
        androidx.core.view.a0 t3 = androidx.core.view.a0.t(windowInsets);
        b3.f.d(t3, "toWindowInsetsCompat(insets)");
        View.OnApplyWindowInsetsListener onApplyWindowInsetsListener = this.f1550c;
        if (onApplyWindowInsetsListener != null) {
            a aVar = a.f1552a;
            b3.f.b(onApplyWindowInsetsListener);
            z3 = androidx.core.view.a0.t(aVar.a(onApplyWindowInsetsListener, this, windowInsets));
        } else {
            z3 = androidx.core.view.v.z(this, t3);
        }
        b3.f.d(z3, "if (applyWindowInsetsLis…, insetsCompat)\n        }");
        if (!z3.n()) {
            int childCount = getChildCount();
            for (int i4 = 0; i4 < childCount; i4++) {
                androidx.core.view.v.c(getChildAt(i4), z3);
            }
        }
        return windowInsets;
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void dispatchDraw(Canvas canvas) {
        b3.f.e(canvas, "canvas");
        if (this.f1551d) {
            Iterator it = this.f1548a.iterator();
            while (it.hasNext()) {
                super.drawChild(canvas, (View) it.next(), getDrawingTime());
            }
        }
        super.dispatchDraw(canvas);
    }

    @Override // android.view.ViewGroup
    protected boolean drawChild(Canvas canvas, View view, long j4) {
        b3.f.e(canvas, "canvas");
        b3.f.e(view, c3.d4(771));
        if (this.f1551d && !this.f1548a.isEmpty() && this.f1548a.contains(view)) {
            return false;
        }
        return super.drawChild(canvas, view, j4);
    }

    @Override // android.view.ViewGroup
    public void endViewTransition(View view) {
        b3.f.e(view, "view");
        this.f1549b.remove(view);
        if (this.f1548a.remove(view)) {
            this.f1551d = true;
        }
        super.endViewTransition(view);
    }

    public final <F extends Fragment> F getFragment() {
        return (F) x.j0(this).g0(getId());
    }

    @Override // android.view.View
    public WindowInsets onApplyWindowInsets(WindowInsets windowInsets) {
        b3.f.e(windowInsets, c3.d4(421));
        return windowInsets;
    }

    @Override // android.view.ViewGroup
    public void removeAllViewsInLayout() {
        int childCount = getChildCount();
        while (true) {
            childCount--;
            if (-1 >= childCount) {
                super.removeAllViewsInLayout();
                return;
            } else {
                View childAt = getChildAt(childCount);
                b3.f.d(childAt, c3.d4(772));
                a(childAt);
            }
        }
    }

    @Override // android.view.ViewGroup, android.view.ViewManager
    public void removeView(View view) {
        b3.f.e(view, "view");
        a(view);
        super.removeView(view);
    }

    @Override // android.view.ViewGroup
    public void removeViewAt(int i4) {
        View childAt = getChildAt(i4);
        b3.f.d(childAt, "view");
        a(childAt);
        super.removeViewAt(i4);
    }

    @Override // android.view.ViewGroup
    public void removeViewInLayout(View view) {
        b3.f.e(view, "view");
        a(view);
        super.removeViewInLayout(view);
    }

    @Override // android.view.ViewGroup
    public void removeViews(int i4, int i5) {
        int i6 = i4 + i5;
        for (int i7 = i4; i7 < i6; i7++) {
            View childAt = getChildAt(i7);
            b3.f.d(childAt, "view");
            a(childAt);
        }
        super.removeViews(i4, i5);
    }

    @Override // android.view.ViewGroup
    public void removeViewsInLayout(int i4, int i5) {
        int i6 = i4 + i5;
        for (int i7 = i4; i7 < i6; i7++) {
            View childAt = getChildAt(i7);
            b3.f.d(childAt, "view");
            a(childAt);
        }
        super.removeViewsInLayout(i4, i5);
    }

    public final void setDrawDisappearingViewsLast(boolean z3) {
        this.f1551d = z3;
    }

    @Override // android.view.ViewGroup
    public void setLayoutTransition(LayoutTransition layoutTransition) {
        throw new UnsupportedOperationException(c3.d4(508));
    }

    @Override // android.view.View
    public void setOnApplyWindowInsetsListener(View.OnApplyWindowInsetsListener onApplyWindowInsetsListener) {
        b3.f.e(onApplyWindowInsetsListener, "listener");
        this.f1550c = onApplyWindowInsetsListener;
    }

    @Override // android.view.ViewGroup
    public void startViewTransition(View view) {
        b3.f.e(view, "view");
        if (view.getParent() == this) {
            this.f1549b.add(view);
        }
        super.startViewTransition(view);
    }
}
