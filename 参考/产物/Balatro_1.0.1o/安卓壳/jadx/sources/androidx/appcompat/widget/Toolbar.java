package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.ContextThemeWrapper;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import androidx.appcompat.view.menu.e;
import androidx.appcompat.view.menu.i;
import androidx.appcompat.widget.ActionMenuView;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class Toolbar extends ViewGroup implements androidx.core.view.i {
    private ColorStateList A;
    private boolean B;
    private boolean C;
    private final ArrayList D;
    private final ArrayList E;
    private final int[] F;
    final androidx.core.view.j G;
    private ArrayList H;
    private final ActionMenuView.e I;
    private o0 J;
    private androidx.appcompat.widget.c K;
    private f L;
    private i.a M;
    e.a N;
    private boolean O;
    private OnBackInvokedCallback P;
    private OnBackInvokedDispatcher Q;
    private boolean R;
    private final Runnable S;

    /* renamed from: a, reason: collision with root package name */
    ActionMenuView f431a;

    /* renamed from: b, reason: collision with root package name */
    private TextView f432b;

    /* renamed from: c, reason: collision with root package name */
    private TextView f433c;

    /* renamed from: d, reason: collision with root package name */
    private ImageButton f434d;

    /* renamed from: e, reason: collision with root package name */
    private ImageView f435e;

    /* renamed from: f, reason: collision with root package name */
    private Drawable f436f;

    /* renamed from: g, reason: collision with root package name */
    private CharSequence f437g;

    /* renamed from: h, reason: collision with root package name */
    ImageButton f438h;

    /* renamed from: i, reason: collision with root package name */
    View f439i;

    /* renamed from: j, reason: collision with root package name */
    private Context f440j;

    /* renamed from: k, reason: collision with root package name */
    private int f441k;

    /* renamed from: l, reason: collision with root package name */
    private int f442l;

    /* renamed from: m, reason: collision with root package name */
    private int f443m;

    /* renamed from: n, reason: collision with root package name */
    int f444n;

    /* renamed from: o, reason: collision with root package name */
    private int f445o;

    /* renamed from: p, reason: collision with root package name */
    private int f446p;

    /* renamed from: q, reason: collision with root package name */
    private int f447q;

    /* renamed from: r, reason: collision with root package name */
    private int f448r;

    /* renamed from: s, reason: collision with root package name */
    private int f449s;

    /* renamed from: t, reason: collision with root package name */
    private e0 f450t;

    /* renamed from: u, reason: collision with root package name */
    private int f451u;

    /* renamed from: v, reason: collision with root package name */
    private int f452v;

    /* renamed from: w, reason: collision with root package name */
    private int f453w;

    /* renamed from: x, reason: collision with root package name */
    private CharSequence f454x;

    /* renamed from: y, reason: collision with root package name */
    private CharSequence f455y;

    /* renamed from: z, reason: collision with root package name */
    private ColorStateList f456z;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements ActionMenuView.e {
        a() {
        }

        @Override // androidx.appcompat.widget.ActionMenuView.e
        public boolean onMenuItemClick(MenuItem menuItem) {
            if (Toolbar.this.G.d(menuItem)) {
                return true;
            }
            Toolbar.this.getClass();
            return false;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Toolbar.this.M();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements e.a {
        c() {
        }

        @Override // androidx.appcompat.view.menu.e.a
        public boolean a(androidx.appcompat.view.menu.e eVar, MenuItem menuItem) {
            e.a aVar = Toolbar.this.N;
            return aVar != null && aVar.a(eVar, menuItem);
        }

        @Override // androidx.appcompat.view.menu.e.a
        public void b(androidx.appcompat.view.menu.e eVar) {
            if (!Toolbar.this.f431a.F()) {
                Toolbar.this.G.e(eVar);
            }
            e.a aVar = Toolbar.this.N;
            if (aVar != null) {
                aVar.b(eVar);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements View.OnClickListener {
        d() {
        }

        @Override // android.view.View.OnClickListener
        public void onClick(View view) {
            Toolbar.this.e();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class e {
        static OnBackInvokedDispatcher a(View view) {
            return view.findOnBackInvokedDispatcher();
        }

        static OnBackInvokedCallback b(Runnable runnable) {
            Objects.requireNonNull(runnable);
            return new androidx.activity.k(runnable);
        }

        static void c(Object obj, Object obj2) {
            ((OnBackInvokedDispatcher) obj).registerOnBackInvokedCallback(1000000, (OnBackInvokedCallback) obj2);
        }

        static void d(Object obj, Object obj2) {
            ((OnBackInvokedDispatcher) obj).unregisterOnBackInvokedCallback((OnBackInvokedCallback) obj2);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class f implements androidx.appcompat.view.menu.i {

        /* renamed from: a, reason: collision with root package name */
        androidx.appcompat.view.menu.e f461a;

        /* renamed from: b, reason: collision with root package name */
        androidx.appcompat.view.menu.f f462b;

        f() {
        }

        @Override // androidx.appcompat.view.menu.i
        public void a(androidx.appcompat.view.menu.e eVar, boolean z3) {
        }

        @Override // androidx.appcompat.view.menu.i
        public void c(Context context, androidx.appcompat.view.menu.e eVar) {
            androidx.appcompat.view.menu.f fVar;
            androidx.appcompat.view.menu.e eVar2 = this.f461a;
            if (eVar2 != null && (fVar = this.f462b) != null) {
                eVar2.e(fVar);
            }
            this.f461a = eVar;
        }

        @Override // androidx.appcompat.view.menu.i
        public boolean e(androidx.appcompat.view.menu.m mVar) {
            return false;
        }

        @Override // androidx.appcompat.view.menu.i
        public void f(boolean z3) {
            if (this.f462b != null) {
                androidx.appcompat.view.menu.e eVar = this.f461a;
                if (eVar != null) {
                    int size = eVar.size();
                    for (int i4 = 0; i4 < size; i4++) {
                        if (this.f461a.getItem(i4) == this.f462b) {
                            return;
                        }
                    }
                }
                h(this.f461a, this.f462b);
            }
        }

        @Override // androidx.appcompat.view.menu.i
        public boolean g() {
            return false;
        }

        @Override // androidx.appcompat.view.menu.i
        public boolean h(androidx.appcompat.view.menu.e eVar, androidx.appcompat.view.menu.f fVar) {
            KeyEvent.Callback callback = Toolbar.this.f439i;
            if (callback instanceof h.b) {
                ((h.b) callback).c();
            }
            Toolbar toolbar = Toolbar.this;
            toolbar.removeView(toolbar.f439i);
            Toolbar toolbar2 = Toolbar.this;
            toolbar2.removeView(toolbar2.f438h);
            Toolbar toolbar3 = Toolbar.this;
            toolbar3.f439i = null;
            toolbar3.a();
            this.f462b = null;
            Toolbar.this.requestLayout();
            fVar.q(false);
            Toolbar.this.N();
            return true;
        }

        @Override // androidx.appcompat.view.menu.i
        public boolean j(androidx.appcompat.view.menu.e eVar, androidx.appcompat.view.menu.f fVar) {
            Toolbar.this.f();
            ViewParent parent = Toolbar.this.f438h.getParent();
            Toolbar toolbar = Toolbar.this;
            if (parent != toolbar) {
                if (parent instanceof ViewGroup) {
                    ((ViewGroup) parent).removeView(toolbar.f438h);
                }
                Toolbar toolbar2 = Toolbar.this;
                toolbar2.addView(toolbar2.f438h);
            }
            Toolbar.this.f439i = fVar.getActionView();
            this.f462b = fVar;
            ViewParent parent2 = Toolbar.this.f439i.getParent();
            Toolbar toolbar3 = Toolbar.this;
            if (parent2 != toolbar3) {
                if (parent2 instanceof ViewGroup) {
                    ((ViewGroup) parent2).removeView(toolbar3.f439i);
                }
                g generateDefaultLayoutParams = Toolbar.this.generateDefaultLayoutParams();
                Toolbar toolbar4 = Toolbar.this;
                generateDefaultLayoutParams.f3078a = (toolbar4.f444n & 112) | 8388611;
                generateDefaultLayoutParams.f464b = 2;
                toolbar4.f439i.setLayoutParams(generateDefaultLayoutParams);
                Toolbar toolbar5 = Toolbar.this;
                toolbar5.addView(toolbar5.f439i);
            }
            Toolbar.this.G();
            Toolbar.this.requestLayout();
            fVar.q(true);
            KeyEvent.Callback callback = Toolbar.this.f439i;
            if (callback instanceof h.b) {
                ((h.b) callback).b();
            }
            Toolbar.this.N();
            return true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class g extends d.a {

        /* renamed from: b, reason: collision with root package name */
        int f464b;

        public g(int i4, int i5) {
            super(i4, i5);
            this.f464b = 0;
            this.f3078a = 8388627;
        }

        public g(Context context, AttributeSet attributeSet) {
            super(context, attributeSet);
            this.f464b = 0;
        }

        public g(ViewGroup.LayoutParams layoutParams) {
            super(layoutParams);
            this.f464b = 0;
        }

        public g(ViewGroup.MarginLayoutParams marginLayoutParams) {
            super(marginLayoutParams);
            this.f464b = 0;
            a(marginLayoutParams);
        }

        public g(g gVar) {
            super((d.a) gVar);
            this.f464b = 0;
            this.f464b = gVar.f464b;
        }

        public g(d.a aVar) {
            super(aVar);
            this.f464b = 0;
        }

        void a(ViewGroup.MarginLayoutParams marginLayoutParams) {
            ((ViewGroup.MarginLayoutParams) this).leftMargin = marginLayoutParams.leftMargin;
            ((ViewGroup.MarginLayoutParams) this).topMargin = marginLayoutParams.topMargin;
            ((ViewGroup.MarginLayoutParams) this).rightMargin = marginLayoutParams.rightMargin;
            ((ViewGroup.MarginLayoutParams) this).bottomMargin = marginLayoutParams.bottomMargin;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface h {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class i extends r.a {
        public static final Parcelable.Creator<i> CREATOR = new a();

        /* renamed from: g, reason: collision with root package name */
        int f465g;

        /* renamed from: h, reason: collision with root package name */
        boolean f466h;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Parcelable.ClassLoaderCreator {
            a() {
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: a, reason: merged with bridge method [inline-methods] */
            public i createFromParcel(Parcel parcel) {
                return new i(parcel, null);
            }

            @Override // android.os.Parcelable.ClassLoaderCreator
            /* renamed from: b, reason: merged with bridge method [inline-methods] */
            public i createFromParcel(Parcel parcel, ClassLoader classLoader) {
                return new i(parcel, classLoader);
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: c, reason: merged with bridge method [inline-methods] */
            public i[] newArray(int i4) {
                return new i[i4];
            }
        }

        public i(Parcel parcel, ClassLoader classLoader) {
            super(parcel, classLoader);
            this.f465g = parcel.readInt();
            this.f466h = parcel.readInt() != 0;
        }

        public i(Parcelable parcelable) {
            super(parcelable);
        }

        @Override // r.a, android.os.Parcelable
        public void writeToParcel(Parcel parcel, int i4) {
            super.writeToParcel(parcel, i4);
            parcel.writeInt(this.f465g);
            parcel.writeInt(this.f466h ? 1 : 0);
        }
    }

    public Toolbar(Context context, AttributeSet attributeSet) {
        this(context, attributeSet, c.a.f1847s);
    }

    public Toolbar(Context context, AttributeSet attributeSet, int i4) {
        super(context, attributeSet, i4);
        this.f453w = 8388627;
        this.D = new ArrayList();
        this.E = new ArrayList();
        this.F = new int[2];
        this.G = new androidx.core.view.j(new Runnable() { // from class: androidx.appcompat.widget.n0
            @Override // java.lang.Runnable
            public final void run() {
                Toolbar.this.x();
            }
        });
        this.H = new ArrayList();
        this.I = new a();
        this.S = new b();
        l0 s3 = l0.s(getContext(), attributeSet, c.i.f1948a2, i4, 0);
        androidx.core.view.v.F(this, context, c.i.f1948a2, attributeSet, s3.o(), i4, 0);
        this.f442l = s3.l(c.i.C2, 0);
        this.f443m = s3.l(c.i.f2024t2, 0);
        this.f453w = s3.j(c.i.f1952b2, this.f453w);
        this.f444n = s3.j(c.i.f1956c2, 48);
        int d4 = s3.d(c.i.f2036w2, 0);
        d4 = s3.p(c.i.B2) ? s3.d(c.i.B2, d4) : d4;
        this.f449s = d4;
        this.f448r = d4;
        this.f447q = d4;
        this.f446p = d4;
        int d5 = s3.d(c.i.f2048z2, -1);
        if (d5 >= 0) {
            this.f446p = d5;
        }
        int d6 = s3.d(c.i.f2044y2, -1);
        if (d6 >= 0) {
            this.f447q = d6;
        }
        int d7 = s3.d(c.i.A2, -1);
        if (d7 >= 0) {
            this.f448r = d7;
        }
        int d8 = s3.d(c.i.f2040x2, -1);
        if (d8 >= 0) {
            this.f449s = d8;
        }
        this.f445o = s3.e(c.i.f2000n2, -1);
        int d9 = s3.d(c.i.f1984j2, Integer.MIN_VALUE);
        int d10 = s3.d(c.i.f1968f2, Integer.MIN_VALUE);
        int e4 = s3.e(c.i.f1976h2, 0);
        int e5 = s3.e(c.i.f1980i2, 0);
        g();
        this.f450t.e(e4, e5);
        if (d9 != Integer.MIN_VALUE || d10 != Integer.MIN_VALUE) {
            this.f450t.g(d9, d10);
        }
        this.f451u = s3.d(c.i.f1988k2, Integer.MIN_VALUE);
        this.f452v = s3.d(c.i.f1972g2, Integer.MIN_VALUE);
        this.f436f = s3.f(c.i.f1964e2);
        this.f437g = s3.n(c.i.f1960d2);
        CharSequence n3 = s3.n(c.i.f2032v2);
        if (!TextUtils.isEmpty(n3)) {
            setTitle(n3);
        }
        CharSequence n4 = s3.n(c.i.f2020s2);
        if (!TextUtils.isEmpty(n4)) {
            setSubtitle(n4);
        }
        this.f440j = getContext();
        setPopupTheme(s3.l(c.i.f2016r2, 0));
        Drawable f4 = s3.f(c.i.f2012q2);
        if (f4 != null) {
            setNavigationIcon(f4);
        }
        CharSequence n5 = s3.n(c.i.f2008p2);
        if (!TextUtils.isEmpty(n5)) {
            setNavigationContentDescription(n5);
        }
        Drawable f5 = s3.f(c.i.f1992l2);
        if (f5 != null) {
            setLogo(f5);
        }
        CharSequence n6 = s3.n(c.i.f1996m2);
        if (!TextUtils.isEmpty(n6)) {
            setLogoDescription(n6);
        }
        if (s3.p(c.i.D2)) {
            setTitleTextColor(s3.c(c.i.D2));
        }
        if (s3.p(c.i.f2028u2)) {
            setSubtitleTextColor(s3.c(c.i.f2028u2));
        }
        if (s3.p(c.i.f2004o2)) {
            w(s3.l(c.i.f2004o2, 0));
        }
        s3.t();
    }

    private int A(View view, int i4, int[] iArr, int i5) {
        g gVar = (g) view.getLayoutParams();
        int i6 = ((ViewGroup.MarginLayoutParams) gVar).leftMargin - iArr[0];
        int max = i4 + Math.max(0, i6);
        iArr[0] = Math.max(0, -i6);
        int q3 = q(view, i5);
        int measuredWidth = view.getMeasuredWidth();
        view.layout(max, q3, max + measuredWidth, view.getMeasuredHeight() + q3);
        return max + measuredWidth + ((ViewGroup.MarginLayoutParams) gVar).rightMargin;
    }

    private int B(View view, int i4, int[] iArr, int i5) {
        g gVar = (g) view.getLayoutParams();
        int i6 = ((ViewGroup.MarginLayoutParams) gVar).rightMargin - iArr[1];
        int max = i4 - Math.max(0, i6);
        iArr[1] = Math.max(0, -i6);
        int q3 = q(view, i5);
        int measuredWidth = view.getMeasuredWidth();
        view.layout(max - measuredWidth, q3, max, view.getMeasuredHeight() + q3);
        return max - (measuredWidth + ((ViewGroup.MarginLayoutParams) gVar).leftMargin);
    }

    private int C(View view, int i4, int i5, int i6, int i7, int[] iArr) {
        ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        int i8 = marginLayoutParams.leftMargin - iArr[0];
        int i9 = marginLayoutParams.rightMargin - iArr[1];
        int max = Math.max(0, i8) + Math.max(0, i9);
        iArr[0] = Math.max(0, -i8);
        iArr[1] = Math.max(0, -i9);
        view.measure(ViewGroup.getChildMeasureSpec(i4, getPaddingLeft() + getPaddingRight() + max + i5, marginLayoutParams.width), ViewGroup.getChildMeasureSpec(i6, getPaddingTop() + getPaddingBottom() + marginLayoutParams.topMargin + marginLayoutParams.bottomMargin + i7, marginLayoutParams.height));
        return view.getMeasuredWidth() + max;
    }

    private void D(View view, int i4, int i5, int i6, int i7, int i8) {
        ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        int childMeasureSpec = ViewGroup.getChildMeasureSpec(i4, getPaddingLeft() + getPaddingRight() + marginLayoutParams.leftMargin + marginLayoutParams.rightMargin + i5, marginLayoutParams.width);
        int childMeasureSpec2 = ViewGroup.getChildMeasureSpec(i6, getPaddingTop() + getPaddingBottom() + marginLayoutParams.topMargin + marginLayoutParams.bottomMargin + i7, marginLayoutParams.height);
        int mode = View.MeasureSpec.getMode(childMeasureSpec2);
        if (mode != 1073741824 && i8 >= 0) {
            if (mode != 0) {
                i8 = Math.min(View.MeasureSpec.getSize(childMeasureSpec2), i8);
            }
            childMeasureSpec2 = View.MeasureSpec.makeMeasureSpec(i8, 1073741824);
        }
        view.measure(childMeasureSpec, childMeasureSpec2);
    }

    private void E() {
        Menu menu = getMenu();
        ArrayList<MenuItem> currentMenuItems = getCurrentMenuItems();
        this.G.b(menu, getMenuInflater());
        ArrayList<MenuItem> currentMenuItems2 = getCurrentMenuItems();
        currentMenuItems2.removeAll(currentMenuItems);
        this.H = currentMenuItems2;
    }

    private void F() {
        removeCallbacks(this.S);
        post(this.S);
    }

    private boolean K() {
        if (!this.O) {
            return false;
        }
        int childCount = getChildCount();
        for (int i4 = 0; i4 < childCount; i4++) {
            View childAt = getChildAt(i4);
            if (L(childAt) && childAt.getMeasuredWidth() > 0 && childAt.getMeasuredHeight() > 0) {
                return false;
            }
        }
        return true;
    }

    private boolean L(View view) {
        return (view == null || view.getParent() != this || view.getVisibility() == 8) ? false : true;
    }

    private void b(List list, int i4) {
        boolean z3 = androidx.core.view.v.o(this) == 1;
        int childCount = getChildCount();
        int a4 = androidx.core.view.e.a(i4, androidx.core.view.v.o(this));
        list.clear();
        if (!z3) {
            for (int i5 = 0; i5 < childCount; i5++) {
                View childAt = getChildAt(i5);
                g gVar = (g) childAt.getLayoutParams();
                if (gVar.f464b == 0 && L(childAt) && p(gVar.f3078a) == a4) {
                    list.add(childAt);
                }
            }
            return;
        }
        for (int i6 = childCount - 1; i6 >= 0; i6--) {
            View childAt2 = getChildAt(i6);
            g gVar2 = (g) childAt2.getLayoutParams();
            if (gVar2.f464b == 0 && L(childAt2) && p(gVar2.f3078a) == a4) {
                list.add(childAt2);
            }
        }
    }

    private void c(View view, boolean z3) {
        ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
        g generateDefaultLayoutParams = layoutParams == null ? generateDefaultLayoutParams() : !checkLayoutParams(layoutParams) ? generateLayoutParams(layoutParams) : (g) layoutParams;
        generateDefaultLayoutParams.f464b = 1;
        if (!z3 || this.f439i == null) {
            addView(view, generateDefaultLayoutParams);
        } else {
            view.setLayoutParams(generateDefaultLayoutParams);
            this.E.add(view);
        }
    }

    private void g() {
        if (this.f450t == null) {
            this.f450t = new e0();
        }
    }

    private ArrayList<MenuItem> getCurrentMenuItems() {
        ArrayList<MenuItem> arrayList = new ArrayList<>();
        Menu menu = getMenu();
        for (int i4 = 0; i4 < menu.size(); i4++) {
            arrayList.add(menu.getItem(i4));
        }
        return arrayList;
    }

    private MenuInflater getMenuInflater() {
        return new h.c(getContext());
    }

    private void h() {
        if (this.f435e == null) {
            this.f435e = new l(getContext());
        }
    }

    private void i() {
        j();
        if (this.f431a.I() == null) {
            androidx.appcompat.view.menu.e eVar = (androidx.appcompat.view.menu.e) this.f431a.getMenu();
            if (this.L == null) {
                this.L = new f();
            }
            this.f431a.setExpandedActionViewsExclusive(true);
            eVar.b(this.L, this.f440j);
            N();
        }
    }

    private void j() {
        if (this.f431a == null) {
            ActionMenuView actionMenuView = new ActionMenuView(getContext());
            this.f431a = actionMenuView;
            actionMenuView.setPopupTheme(this.f441k);
            this.f431a.setOnMenuItemClickListener(this.I);
            this.f431a.J(this.M, new c());
            g generateDefaultLayoutParams = generateDefaultLayoutParams();
            generateDefaultLayoutParams.f3078a = (this.f444n & 112) | 8388613;
            this.f431a.setLayoutParams(generateDefaultLayoutParams);
            c(this.f431a, false);
        }
    }

    private void k() {
        if (this.f434d == null) {
            this.f434d = new j(getContext(), null, c.a.f1846r);
            g generateDefaultLayoutParams = generateDefaultLayoutParams();
            generateDefaultLayoutParams.f3078a = (this.f444n & 112) | 8388611;
            this.f434d.setLayoutParams(generateDefaultLayoutParams);
        }
    }

    private int p(int i4) {
        int o3 = androidx.core.view.v.o(this);
        int a4 = androidx.core.view.e.a(i4, o3) & 7;
        return (a4 == 1 || a4 == 3 || a4 == 5) ? a4 : o3 == 1 ? 5 : 3;
    }

    private int q(View view, int i4) {
        g gVar = (g) view.getLayoutParams();
        int measuredHeight = view.getMeasuredHeight();
        int i5 = i4 > 0 ? (measuredHeight - i4) / 2 : 0;
        int r3 = r(gVar.f3078a);
        if (r3 == 48) {
            return getPaddingTop() - i5;
        }
        if (r3 == 80) {
            return (((getHeight() - getPaddingBottom()) - measuredHeight) - ((ViewGroup.MarginLayoutParams) gVar).bottomMargin) - i5;
        }
        int paddingTop = getPaddingTop();
        int paddingBottom = getPaddingBottom();
        int height = getHeight();
        int i6 = (((height - paddingTop) - paddingBottom) - measuredHeight) / 2;
        int i7 = ((ViewGroup.MarginLayoutParams) gVar).topMargin;
        if (i6 < i7) {
            i6 = i7;
        } else {
            int i8 = (((height - paddingBottom) - measuredHeight) - i6) - paddingTop;
            int i9 = ((ViewGroup.MarginLayoutParams) gVar).bottomMargin;
            if (i8 < i9) {
                i6 = Math.max(0, i6 - (i9 - i8));
            }
        }
        return paddingTop + i6;
    }

    private int r(int i4) {
        int i5 = i4 & 112;
        return (i5 == 16 || i5 == 48 || i5 == 80) ? i5 : this.f453w & 112;
    }

    private int s(View view) {
        ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        return androidx.core.view.h.b(marginLayoutParams) + androidx.core.view.h.a(marginLayoutParams);
    }

    private int t(View view) {
        ViewGroup.MarginLayoutParams marginLayoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
        return marginLayoutParams.topMargin + marginLayoutParams.bottomMargin;
    }

    private int u(List list, int[] iArr) {
        int i4 = iArr[0];
        int i5 = iArr[1];
        int size = list.size();
        int i6 = 0;
        int i7 = 0;
        while (i6 < size) {
            View view = (View) list.get(i6);
            g gVar = (g) view.getLayoutParams();
            int i8 = ((ViewGroup.MarginLayoutParams) gVar).leftMargin - i4;
            int i9 = ((ViewGroup.MarginLayoutParams) gVar).rightMargin - i5;
            int max = Math.max(0, i8);
            int max2 = Math.max(0, i9);
            int max3 = Math.max(0, -i8);
            int max4 = Math.max(0, -i9);
            i7 += max + view.getMeasuredWidth() + max2;
            i6++;
            i5 = max4;
            i4 = max3;
        }
        return i7;
    }

    private boolean y(View view) {
        return view.getParent() == this || this.E.contains(view);
    }

    void G() {
        for (int childCount = getChildCount() - 1; childCount >= 0; childCount--) {
            View childAt = getChildAt(childCount);
            if (((g) childAt.getLayoutParams()).f464b != 2 && childAt != this.f431a) {
                removeViewAt(childCount);
                this.E.add(childAt);
            }
        }
    }

    public void H(int i4, int i5) {
        g();
        this.f450t.g(i4, i5);
    }

    public void I(Context context, int i4) {
        this.f443m = i4;
        TextView textView = this.f433c;
        if (textView != null) {
            textView.setTextAppearance(context, i4);
        }
    }

    public void J(Context context, int i4) {
        this.f442l = i4;
        TextView textView = this.f432b;
        if (textView != null) {
            textView.setTextAppearance(context, i4);
        }
    }

    public boolean M() {
        ActionMenuView actionMenuView = this.f431a;
        return actionMenuView != null && actionMenuView.K();
    }

    void N() {
        OnBackInvokedDispatcher onBackInvokedDispatcher;
        if (Build.VERSION.SDK_INT >= 33) {
            OnBackInvokedDispatcher a4 = e.a(this);
            boolean z3 = v() && a4 != null && androidx.core.view.v.v(this) && this.R;
            if (z3 && this.Q == null) {
                if (this.P == null) {
                    this.P = e.b(new Runnable() { // from class: androidx.appcompat.widget.m0
                        @Override // java.lang.Runnable
                        public final void run() {
                            Toolbar.this.e();
                        }
                    });
                }
                e.c(a4, this.P);
                this.Q = a4;
                return;
            }
            if (z3 || (onBackInvokedDispatcher = this.Q) == null) {
                return;
            }
            e.d(onBackInvokedDispatcher, this.P);
            this.Q = null;
        }
    }

    void a() {
        for (int size = this.E.size() - 1; size >= 0; size--) {
            addView((View) this.E.get(size));
        }
        this.E.clear();
    }

    @Override // android.view.ViewGroup
    protected boolean checkLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return super.checkLayoutParams(layoutParams) && (layoutParams instanceof g);
    }

    @Override // androidx.core.view.i
    public void d(androidx.core.view.l lVar) {
        this.G.f(lVar);
    }

    public void e() {
        f fVar = this.L;
        androidx.appcompat.view.menu.f fVar2 = fVar == null ? null : fVar.f462b;
        if (fVar2 != null) {
            fVar2.collapseActionView();
        }
    }

    void f() {
        if (this.f438h == null) {
            j jVar = new j(getContext(), null, c.a.f1846r);
            this.f438h = jVar;
            jVar.setImageDrawable(this.f436f);
            this.f438h.setContentDescription(this.f437g);
            g generateDefaultLayoutParams = generateDefaultLayoutParams();
            generateDefaultLayoutParams.f3078a = (this.f444n & 112) | 8388611;
            generateDefaultLayoutParams.f464b = 2;
            this.f438h.setLayoutParams(generateDefaultLayoutParams);
            this.f438h.setOnClickListener(new d());
        }
    }

    public CharSequence getCollapseContentDescription() {
        ImageButton imageButton = this.f438h;
        if (imageButton != null) {
            return imageButton.getContentDescription();
        }
        return null;
    }

    public Drawable getCollapseIcon() {
        ImageButton imageButton = this.f438h;
        if (imageButton != null) {
            return imageButton.getDrawable();
        }
        return null;
    }

    public int getContentInsetEnd() {
        e0 e0Var = this.f450t;
        if (e0Var != null) {
            return e0Var.a();
        }
        return 0;
    }

    public int getContentInsetEndWithActions() {
        int i4 = this.f452v;
        return i4 != Integer.MIN_VALUE ? i4 : getContentInsetEnd();
    }

    public int getContentInsetLeft() {
        e0 e0Var = this.f450t;
        if (e0Var != null) {
            return e0Var.b();
        }
        return 0;
    }

    public int getContentInsetRight() {
        e0 e0Var = this.f450t;
        if (e0Var != null) {
            return e0Var.c();
        }
        return 0;
    }

    public int getContentInsetStart() {
        e0 e0Var = this.f450t;
        if (e0Var != null) {
            return e0Var.d();
        }
        return 0;
    }

    public int getContentInsetStartWithNavigation() {
        int i4 = this.f451u;
        return i4 != Integer.MIN_VALUE ? i4 : getContentInsetStart();
    }

    public int getCurrentContentInsetEnd() {
        androidx.appcompat.view.menu.e I;
        ActionMenuView actionMenuView = this.f431a;
        return (actionMenuView == null || (I = actionMenuView.I()) == null || !I.hasVisibleItems()) ? getContentInsetEnd() : Math.max(getContentInsetEnd(), Math.max(this.f452v, 0));
    }

    public int getCurrentContentInsetLeft() {
        return androidx.core.view.v.o(this) == 1 ? getCurrentContentInsetEnd() : getCurrentContentInsetStart();
    }

    public int getCurrentContentInsetRight() {
        return androidx.core.view.v.o(this) == 1 ? getCurrentContentInsetStart() : getCurrentContentInsetEnd();
    }

    public int getCurrentContentInsetStart() {
        return getNavigationIcon() != null ? Math.max(getContentInsetStart(), Math.max(this.f451u, 0)) : getContentInsetStart();
    }

    public Drawable getLogo() {
        ImageView imageView = this.f435e;
        if (imageView != null) {
            return imageView.getDrawable();
        }
        return null;
    }

    public CharSequence getLogoDescription() {
        ImageView imageView = this.f435e;
        if (imageView != null) {
            return imageView.getContentDescription();
        }
        return null;
    }

    public Menu getMenu() {
        i();
        return this.f431a.getMenu();
    }

    View getNavButtonView() {
        return this.f434d;
    }

    public CharSequence getNavigationContentDescription() {
        ImageButton imageButton = this.f434d;
        if (imageButton != null) {
            return imageButton.getContentDescription();
        }
        return null;
    }

    public Drawable getNavigationIcon() {
        ImageButton imageButton = this.f434d;
        if (imageButton != null) {
            return imageButton.getDrawable();
        }
        return null;
    }

    androidx.appcompat.widget.c getOuterActionMenuPresenter() {
        return this.K;
    }

    public Drawable getOverflowIcon() {
        i();
        return this.f431a.getOverflowIcon();
    }

    Context getPopupContext() {
        return this.f440j;
    }

    public int getPopupTheme() {
        return this.f441k;
    }

    public CharSequence getSubtitle() {
        return this.f455y;
    }

    final TextView getSubtitleTextView() {
        return this.f433c;
    }

    public CharSequence getTitle() {
        return this.f454x;
    }

    public int getTitleMarginBottom() {
        return this.f449s;
    }

    public int getTitleMarginEnd() {
        return this.f447q;
    }

    public int getTitleMarginStart() {
        return this.f446p;
    }

    public int getTitleMarginTop() {
        return this.f448r;
    }

    final TextView getTitleTextView() {
        return this.f432b;
    }

    public t getWrapper() {
        if (this.J == null) {
            this.J = new o0(this, true);
        }
        return this.J;
    }

    @Override // androidx.core.view.i
    public void l(androidx.core.view.l lVar) {
        this.G.a(lVar);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.view.ViewGroup
    /* renamed from: m, reason: merged with bridge method [inline-methods] */
    public g generateDefaultLayoutParams() {
        return new g(-2, -2);
    }

    @Override // android.view.ViewGroup
    /* renamed from: n, reason: merged with bridge method [inline-methods] */
    public g generateLayoutParams(AttributeSet attributeSet) {
        return new g(getContext(), attributeSet);
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // android.view.ViewGroup
    /* renamed from: o, reason: merged with bridge method [inline-methods] */
    public g generateLayoutParams(ViewGroup.LayoutParams layoutParams) {
        return layoutParams instanceof g ? new g((g) layoutParams) : layoutParams instanceof d.a ? new g((d.a) layoutParams) : layoutParams instanceof ViewGroup.MarginLayoutParams ? new g((ViewGroup.MarginLayoutParams) layoutParams) : new g(layoutParams);
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        N();
    }

    @Override // android.view.ViewGroup, android.view.View
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        removeCallbacks(this.S);
        N();
    }

    @Override // android.view.View
    public boolean onHoverEvent(MotionEvent motionEvent) {
        int actionMasked = motionEvent.getActionMasked();
        if (actionMasked == 9) {
            this.C = false;
        }
        if (!this.C) {
            boolean onHoverEvent = super.onHoverEvent(motionEvent);
            if (actionMasked == 9 && !onHoverEvent) {
                this.C = true;
            }
        }
        if (actionMasked == 10 || actionMasked == 3) {
            this.C = false;
        }
        return true;
    }

    /* JADX WARN: Removed duplicated region for block: B:107:0x01a2  */
    /* JADX WARN: Removed duplicated region for block: B:112:0x0133  */
    /* JADX WARN: Removed duplicated region for block: B:113:0x012c  */
    /* JADX WARN: Removed duplicated region for block: B:114:0x011d  */
    /* JADX WARN: Removed duplicated region for block: B:115:0x00ff  */
    /* JADX WARN: Removed duplicated region for block: B:13:0x0060  */
    /* JADX WARN: Removed duplicated region for block: B:18:0x0077  */
    /* JADX WARN: Removed duplicated region for block: B:23:0x00b4  */
    /* JADX WARN: Removed duplicated region for block: B:28:0x00cb  */
    /* JADX WARN: Removed duplicated region for block: B:33:0x00e8  */
    /* JADX WARN: Removed duplicated region for block: B:35:0x0104  */
    /* JADX WARN: Removed duplicated region for block: B:41:0x0297 A[LOOP:0: B:40:0x0295->B:41:0x0297, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:45:0x02b5 A[LOOP:1: B:44:0x02b3->B:45:0x02b5, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:49:0x02dd  */
    /* JADX WARN: Removed duplicated region for block: B:54:0x02ec A[LOOP:2: B:53:0x02ea->B:54:0x02ec, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:60:0x0129  */
    /* JADX WARN: Removed duplicated region for block: B:62:0x0130  */
    /* JADX WARN: Removed duplicated region for block: B:70:0x0166  */
    /* JADX WARN: Removed duplicated region for block: B:77:0x01af  */
    /* JADX WARN: Removed duplicated region for block: B:90:0x021e  */
    @Override // android.view.ViewGroup, android.view.View
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    protected void onLayout(boolean r20, int r21, int r22, int r23, int r24) {
        /*
            Method dump skipped, instructions count: 769
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.Toolbar.onLayout(boolean, int, int, int, int):void");
    }

    @Override // android.view.View
    protected void onMeasure(int i4, int i5) {
        int i6;
        int i7;
        int i8;
        int i9;
        int[] iArr;
        int i10;
        int i11;
        int i12;
        int[] iArr2 = this.F;
        boolean a4 = v0.a(this);
        int i13 = !a4 ? 1 : 0;
        if (L(this.f434d)) {
            D(this.f434d, i4, 0, i5, 0, this.f445o);
            i6 = this.f434d.getMeasuredWidth() + s(this.f434d);
            i7 = Math.max(0, this.f434d.getMeasuredHeight() + t(this.f434d));
            i8 = View.combineMeasuredStates(0, this.f434d.getMeasuredState());
        } else {
            i6 = 0;
            i7 = 0;
            i8 = 0;
        }
        if (L(this.f438h)) {
            D(this.f438h, i4, 0, i5, 0, this.f445o);
            i6 = this.f438h.getMeasuredWidth() + s(this.f438h);
            i7 = Math.max(i7, this.f438h.getMeasuredHeight() + t(this.f438h));
            i8 = View.combineMeasuredStates(i8, this.f438h.getMeasuredState());
        }
        int currentContentInsetStart = getCurrentContentInsetStart();
        int max = Math.max(currentContentInsetStart, i6);
        iArr2[a4 ? 1 : 0] = Math.max(0, currentContentInsetStart - i6);
        if (L(this.f431a)) {
            D(this.f431a, i4, max, i5, 0, this.f445o);
            i9 = this.f431a.getMeasuredWidth() + s(this.f431a);
            i7 = Math.max(i7, this.f431a.getMeasuredHeight() + t(this.f431a));
            i8 = View.combineMeasuredStates(i8, this.f431a.getMeasuredState());
        } else {
            i9 = 0;
        }
        int currentContentInsetEnd = getCurrentContentInsetEnd();
        int max2 = max + Math.max(currentContentInsetEnd, i9);
        iArr2[i13] = Math.max(0, currentContentInsetEnd - i9);
        if (L(this.f439i)) {
            iArr = iArr2;
            max2 += C(this.f439i, i4, max2, i5, 0, iArr);
            i7 = Math.max(i7, this.f439i.getMeasuredHeight() + t(this.f439i));
            i8 = View.combineMeasuredStates(i8, this.f439i.getMeasuredState());
        } else {
            iArr = iArr2;
        }
        if (L(this.f435e)) {
            max2 += C(this.f435e, i4, max2, i5, 0, iArr);
            i7 = Math.max(i7, this.f435e.getMeasuredHeight() + t(this.f435e));
            i8 = View.combineMeasuredStates(i8, this.f435e.getMeasuredState());
        }
        int childCount = getChildCount();
        for (int i14 = 0; i14 < childCount; i14++) {
            View childAt = getChildAt(i14);
            if (((g) childAt.getLayoutParams()).f464b == 0 && L(childAt)) {
                max2 += C(childAt, i4, max2, i5, 0, iArr);
                int max3 = Math.max(i7, childAt.getMeasuredHeight() + t(childAt));
                i8 = View.combineMeasuredStates(i8, childAt.getMeasuredState());
                i7 = max3;
            } else {
                max2 = max2;
            }
        }
        int i15 = max2;
        int i16 = this.f448r + this.f449s;
        int i17 = this.f446p + this.f447q;
        if (L(this.f432b)) {
            C(this.f432b, i4, i15 + i17, i5, i16, iArr);
            int measuredWidth = this.f432b.getMeasuredWidth() + s(this.f432b);
            int measuredHeight = this.f432b.getMeasuredHeight() + t(this.f432b);
            i10 = measuredWidth;
            i11 = View.combineMeasuredStates(i8, this.f432b.getMeasuredState());
            i12 = measuredHeight;
        } else {
            i10 = 0;
            i11 = i8;
            i12 = 0;
        }
        if (L(this.f433c)) {
            i10 = Math.max(i10, C(this.f433c, i4, i15 + i17, i5, i16 + i12, iArr));
            i12 += this.f433c.getMeasuredHeight() + t(this.f433c);
            i11 = View.combineMeasuredStates(i11, this.f433c.getMeasuredState());
        }
        setMeasuredDimension(View.resolveSizeAndState(Math.max(i15 + i10 + getPaddingLeft() + getPaddingRight(), getSuggestedMinimumWidth()), i4, (-16777216) & i11), K() ? 0 : View.resolveSizeAndState(Math.max(Math.max(i7, i12) + getPaddingTop() + getPaddingBottom(), getSuggestedMinimumHeight()), i5, i11 << 16));
    }

    @Override // android.view.View
    protected void onRestoreInstanceState(Parcelable parcelable) {
        MenuItem findItem;
        if (!(parcelable instanceof i)) {
            super.onRestoreInstanceState(parcelable);
            return;
        }
        i iVar = (i) parcelable;
        super.onRestoreInstanceState(iVar.o());
        ActionMenuView actionMenuView = this.f431a;
        androidx.appcompat.view.menu.e I = actionMenuView != null ? actionMenuView.I() : null;
        int i4 = iVar.f465g;
        if (i4 != 0 && this.L != null && I != null && (findItem = I.findItem(i4)) != null) {
            findItem.expandActionView();
        }
        if (iVar.f466h) {
            F();
        }
    }

    @Override // android.view.View
    public void onRtlPropertiesChanged(int i4) {
        super.onRtlPropertiesChanged(i4);
        g();
        this.f450t.f(i4 == 1);
    }

    @Override // android.view.View
    protected Parcelable onSaveInstanceState() {
        androidx.appcompat.view.menu.f fVar;
        i iVar = new i(super.onSaveInstanceState());
        f fVar2 = this.L;
        if (fVar2 != null && (fVar = fVar2.f462b) != null) {
            iVar.f465g = fVar.getItemId();
        }
        iVar.f466h = z();
        return iVar;
    }

    @Override // android.view.View
    public boolean onTouchEvent(MotionEvent motionEvent) {
        int actionMasked = motionEvent.getActionMasked();
        if (actionMasked == 0) {
            this.B = false;
        }
        if (!this.B) {
            boolean onTouchEvent = super.onTouchEvent(motionEvent);
            if (actionMasked == 0 && !onTouchEvent) {
                this.B = true;
            }
        }
        if (actionMasked == 1 || actionMasked == 3) {
            this.B = false;
        }
        return true;
    }

    public void setBackInvokedCallbackEnabled(boolean z3) {
        if (this.R != z3) {
            this.R = z3;
            N();
        }
    }

    public void setCollapseContentDescription(int i4) {
        setCollapseContentDescription(i4 != 0 ? getContext().getText(i4) : null);
    }

    public void setCollapseContentDescription(CharSequence charSequence) {
        if (!TextUtils.isEmpty(charSequence)) {
            f();
        }
        ImageButton imageButton = this.f438h;
        if (imageButton != null) {
            imageButton.setContentDescription(charSequence);
        }
    }

    public void setCollapseIcon(int i4) {
        setCollapseIcon(e.a.b(getContext(), i4));
    }

    public void setCollapseIcon(Drawable drawable) {
        if (drawable != null) {
            f();
            this.f438h.setImageDrawable(drawable);
        } else {
            ImageButton imageButton = this.f438h;
            if (imageButton != null) {
                imageButton.setImageDrawable(this.f436f);
            }
        }
    }

    public void setCollapsible(boolean z3) {
        this.O = z3;
        requestLayout();
    }

    public void setContentInsetEndWithActions(int i4) {
        if (i4 < 0) {
            i4 = Integer.MIN_VALUE;
        }
        if (i4 != this.f452v) {
            this.f452v = i4;
            if (getNavigationIcon() != null) {
                requestLayout();
            }
        }
    }

    public void setContentInsetStartWithNavigation(int i4) {
        if (i4 < 0) {
            i4 = Integer.MIN_VALUE;
        }
        if (i4 != this.f451u) {
            this.f451u = i4;
            if (getNavigationIcon() != null) {
                requestLayout();
            }
        }
    }

    public void setLogo(int i4) {
        setLogo(e.a.b(getContext(), i4));
    }

    public void setLogo(Drawable drawable) {
        if (drawable != null) {
            h();
            if (!y(this.f435e)) {
                c(this.f435e, true);
            }
        } else {
            ImageView imageView = this.f435e;
            if (imageView != null && y(imageView)) {
                removeView(this.f435e);
                this.E.remove(this.f435e);
            }
        }
        ImageView imageView2 = this.f435e;
        if (imageView2 != null) {
            imageView2.setImageDrawable(drawable);
        }
    }

    public void setLogoDescription(int i4) {
        setLogoDescription(getContext().getText(i4));
    }

    public void setLogoDescription(CharSequence charSequence) {
        if (!TextUtils.isEmpty(charSequence)) {
            h();
        }
        ImageView imageView = this.f435e;
        if (imageView != null) {
            imageView.setContentDescription(charSequence);
        }
    }

    public void setNavigationContentDescription(int i4) {
        setNavigationContentDescription(i4 != 0 ? getContext().getText(i4) : null);
    }

    public void setNavigationContentDescription(CharSequence charSequence) {
        if (!TextUtils.isEmpty(charSequence)) {
            k();
        }
        ImageButton imageButton = this.f434d;
        if (imageButton != null) {
            imageButton.setContentDescription(charSequence);
            p0.a(this.f434d, charSequence);
        }
    }

    public void setNavigationIcon(int i4) {
        setNavigationIcon(e.a.b(getContext(), i4));
    }

    public void setNavigationIcon(Drawable drawable) {
        if (drawable != null) {
            k();
            if (!y(this.f434d)) {
                c(this.f434d, true);
            }
        } else {
            ImageButton imageButton = this.f434d;
            if (imageButton != null && y(imageButton)) {
                removeView(this.f434d);
                this.E.remove(this.f434d);
            }
        }
        ImageButton imageButton2 = this.f434d;
        if (imageButton2 != null) {
            imageButton2.setImageDrawable(drawable);
        }
    }

    public void setNavigationOnClickListener(View.OnClickListener onClickListener) {
        k();
        this.f434d.setOnClickListener(onClickListener);
    }

    public void setOnMenuItemClickListener(h hVar) {
    }

    public void setOverflowIcon(Drawable drawable) {
        i();
        this.f431a.setOverflowIcon(drawable);
    }

    public void setPopupTheme(int i4) {
        if (this.f441k != i4) {
            this.f441k = i4;
            if (i4 == 0) {
                this.f440j = getContext();
            } else {
                this.f440j = new ContextThemeWrapper(getContext(), i4);
            }
        }
    }

    public void setSubtitle(int i4) {
        setSubtitle(getContext().getText(i4));
    }

    public void setSubtitle(CharSequence charSequence) {
        if (TextUtils.isEmpty(charSequence)) {
            TextView textView = this.f433c;
            if (textView != null && y(textView)) {
                removeView(this.f433c);
                this.E.remove(this.f433c);
            }
        } else {
            if (this.f433c == null) {
                Context context = getContext();
                p pVar = new p(context);
                this.f433c = pVar;
                pVar.setSingleLine();
                this.f433c.setEllipsize(TextUtils.TruncateAt.END);
                int i4 = this.f443m;
                if (i4 != 0) {
                    this.f433c.setTextAppearance(context, i4);
                }
                ColorStateList colorStateList = this.A;
                if (colorStateList != null) {
                    this.f433c.setTextColor(colorStateList);
                }
            }
            if (!y(this.f433c)) {
                c(this.f433c, true);
            }
        }
        TextView textView2 = this.f433c;
        if (textView2 != null) {
            textView2.setText(charSequence);
        }
        this.f455y = charSequence;
    }

    public void setSubtitleTextColor(int i4) {
        setSubtitleTextColor(ColorStateList.valueOf(i4));
    }

    public void setSubtitleTextColor(ColorStateList colorStateList) {
        this.A = colorStateList;
        TextView textView = this.f433c;
        if (textView != null) {
            textView.setTextColor(colorStateList);
        }
    }

    public void setTitle(int i4) {
        setTitle(getContext().getText(i4));
    }

    public void setTitle(CharSequence charSequence) {
        if (TextUtils.isEmpty(charSequence)) {
            TextView textView = this.f432b;
            if (textView != null && y(textView)) {
                removeView(this.f432b);
                this.E.remove(this.f432b);
            }
        } else {
            if (this.f432b == null) {
                Context context = getContext();
                p pVar = new p(context);
                this.f432b = pVar;
                pVar.setSingleLine();
                this.f432b.setEllipsize(TextUtils.TruncateAt.END);
                int i4 = this.f442l;
                if (i4 != 0) {
                    this.f432b.setTextAppearance(context, i4);
                }
                ColorStateList colorStateList = this.f456z;
                if (colorStateList != null) {
                    this.f432b.setTextColor(colorStateList);
                }
            }
            if (!y(this.f432b)) {
                c(this.f432b, true);
            }
        }
        TextView textView2 = this.f432b;
        if (textView2 != null) {
            textView2.setText(charSequence);
        }
        this.f454x = charSequence;
    }

    public void setTitleMarginBottom(int i4) {
        this.f449s = i4;
        requestLayout();
    }

    public void setTitleMarginEnd(int i4) {
        this.f447q = i4;
        requestLayout();
    }

    public void setTitleMarginStart(int i4) {
        this.f446p = i4;
        requestLayout();
    }

    public void setTitleMarginTop(int i4) {
        this.f448r = i4;
        requestLayout();
    }

    public void setTitleTextColor(int i4) {
        setTitleTextColor(ColorStateList.valueOf(i4));
    }

    public void setTitleTextColor(ColorStateList colorStateList) {
        this.f456z = colorStateList;
        TextView textView = this.f432b;
        if (textView != null) {
            textView.setTextColor(colorStateList);
        }
    }

    public boolean v() {
        f fVar = this.L;
        return (fVar == null || fVar.f462b == null) ? false : true;
    }

    public void w(int i4) {
        getMenuInflater().inflate(i4, getMenu());
    }

    public void x() {
        ArrayList arrayList = this.H;
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            getMenu().removeItem(((MenuItem) obj).getItemId());
        }
        E();
    }

    public boolean z() {
        ActionMenuView actionMenuView = this.f431a;
        return actionMenuView != null && actionMenuView.F();
    }
}
