package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.content.res.TypedArray;
import android.database.DataSetObserver;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Handler;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.PopupWindow;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class z implements androidx.appcompat.view.menu.k {
    private static Method G;
    private static Method H;
    private Runnable A;
    final Handler B;
    private Rect D;
    private boolean E;
    PopupWindow F;

    /* renamed from: a, reason: collision with root package name */
    private Context f745a;

    /* renamed from: b, reason: collision with root package name */
    private ListAdapter f746b;

    /* renamed from: c, reason: collision with root package name */
    v f747c;

    /* renamed from: f, reason: collision with root package name */
    private int f750f;

    /* renamed from: g, reason: collision with root package name */
    private int f751g;

    /* renamed from: i, reason: collision with root package name */
    private boolean f753i;

    /* renamed from: j, reason: collision with root package name */
    private boolean f754j;

    /* renamed from: k, reason: collision with root package name */
    private boolean f755k;

    /* renamed from: p, reason: collision with root package name */
    private View f760p;

    /* renamed from: r, reason: collision with root package name */
    private DataSetObserver f762r;

    /* renamed from: s, reason: collision with root package name */
    private View f763s;

    /* renamed from: t, reason: collision with root package name */
    private Drawable f764t;

    /* renamed from: u, reason: collision with root package name */
    private AdapterView.OnItemClickListener f765u;

    /* renamed from: v, reason: collision with root package name */
    private AdapterView.OnItemSelectedListener f766v;

    /* renamed from: d, reason: collision with root package name */
    private int f748d = -2;

    /* renamed from: e, reason: collision with root package name */
    private int f749e = -2;

    /* renamed from: h, reason: collision with root package name */
    private int f752h = 1002;

    /* renamed from: l, reason: collision with root package name */
    private int f756l = 0;

    /* renamed from: m, reason: collision with root package name */
    private boolean f757m = false;

    /* renamed from: n, reason: collision with root package name */
    private boolean f758n = false;

    /* renamed from: o, reason: collision with root package name */
    int f759o = Integer.MAX_VALUE;

    /* renamed from: q, reason: collision with root package name */
    private int f761q = 0;

    /* renamed from: w, reason: collision with root package name */
    final i f767w = new i();

    /* renamed from: x, reason: collision with root package name */
    private final h f768x = new h();

    /* renamed from: y, reason: collision with root package name */
    private final g f769y = new g();

    /* renamed from: z, reason: collision with root package name */
    private final e f770z = new e();
    private final Rect C = new Rect();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            View h4 = z.this.h();
            if (h4 == null || h4.getWindowToken() == null) {
                return;
            }
            z.this.b();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements AdapterView.OnItemSelectedListener {
        b() {
        }

        @Override // android.widget.AdapterView.OnItemSelectedListener
        public void onItemSelected(AdapterView adapterView, View view, int i4, long j4) {
            v vVar;
            if (i4 == -1 || (vVar = z.this.f747c) == null) {
                return;
            }
            vVar.setListSelectionHidden(false);
        }

        @Override // android.widget.AdapterView.OnItemSelectedListener
        public void onNothingSelected(AdapterView adapterView) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {
        static int a(PopupWindow popupWindow, View view, int i4, boolean z3) {
            return popupWindow.getMaxAvailableHeight(view, i4, z3);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class d {
        static void a(PopupWindow popupWindow, Rect rect) {
            popupWindow.setEpicenterBounds(rect);
        }

        static void b(PopupWindow popupWindow, boolean z3) {
            popupWindow.setIsClippedToScreen(z3);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class e implements Runnable {
        e() {
        }

        @Override // java.lang.Runnable
        public void run() {
            z.this.f();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class f extends DataSetObserver {
        f() {
        }

        @Override // android.database.DataSetObserver
        public void onChanged() {
            if (z.this.i()) {
                z.this.b();
            }
        }

        @Override // android.database.DataSetObserver
        public void onInvalidated() {
            z.this.dismiss();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class g implements AbsListView.OnScrollListener {
        g() {
        }

        @Override // android.widget.AbsListView.OnScrollListener
        public void onScroll(AbsListView absListView, int i4, int i5, int i6) {
        }

        @Override // android.widget.AbsListView.OnScrollListener
        public void onScrollStateChanged(AbsListView absListView, int i4) {
            if (i4 != 1 || z.this.m() || z.this.F.getContentView() == null) {
                return;
            }
            z zVar = z.this;
            zVar.B.removeCallbacks(zVar.f767w);
            z.this.f767w.run();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class h implements View.OnTouchListener {
        h() {
        }

        @Override // android.view.View.OnTouchListener
        public boolean onTouch(View view, MotionEvent motionEvent) {
            PopupWindow popupWindow;
            int action = motionEvent.getAction();
            int x3 = (int) motionEvent.getX();
            int y3 = (int) motionEvent.getY();
            if (action == 0 && (popupWindow = z.this.F) != null && popupWindow.isShowing() && x3 >= 0 && x3 < z.this.F.getWidth() && y3 >= 0 && y3 < z.this.F.getHeight()) {
                z zVar = z.this;
                zVar.B.postDelayed(zVar.f767w, 250L);
                return false;
            }
            if (action != 1) {
                return false;
            }
            z zVar2 = z.this;
            zVar2.B.removeCallbacks(zVar2.f767w);
            return false;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class i implements Runnable {
        i() {
        }

        @Override // java.lang.Runnable
        public void run() {
            v vVar = z.this.f747c;
            if (vVar == null || !androidx.core.view.v.v(vVar) || z.this.f747c.getCount() <= z.this.f747c.getChildCount()) {
                return;
            }
            int childCount = z.this.f747c.getChildCount();
            z zVar = z.this;
            if (childCount <= zVar.f759o) {
                zVar.F.setInputMethodMode(2);
                z.this.b();
            }
        }
    }

    static {
        if (Build.VERSION.SDK_INT <= 28) {
            try {
                G = PopupWindow.class.getDeclaredMethod("setClipToScreenEnabled", Boolean.TYPE);
            } catch (NoSuchMethodException unused) {
                Log.i("ListPopupWindow", "Could not find method setClipToScreenEnabled() on PopupWindow. Oh well.");
            }
            try {
                H = PopupWindow.class.getDeclaredMethod("setEpicenterBounds", Rect.class);
            } catch (NoSuchMethodException unused2) {
                Log.i("ListPopupWindow", "Could not find method setEpicenterBounds(Rect) on PopupWindow. Oh well.");
            }
        }
    }

    public z(Context context, AttributeSet attributeSet, int i4, int i5) {
        this.f745a = context;
        this.B = new Handler(context.getMainLooper());
        TypedArray obtainStyledAttributes = context.obtainStyledAttributes(attributeSet, c.i.C0, i4, i5);
        this.f750f = obtainStyledAttributes.getDimensionPixelOffset(c.i.D0, 0);
        int dimensionPixelOffset = obtainStyledAttributes.getDimensionPixelOffset(c.i.E0, 0);
        this.f751g = dimensionPixelOffset;
        if (dimensionPixelOffset != 0) {
            this.f753i = true;
        }
        obtainStyledAttributes.recycle();
        m mVar = new m(context, attributeSet, i4, i5);
        this.F = mVar;
        mVar.setInputMethodMode(1);
    }

    private void B(boolean z3) {
        if (Build.VERSION.SDK_INT > 28) {
            d.b(this.F, z3);
            return;
        }
        Method method = G;
        if (method != null) {
            try {
                method.invoke(this.F, Boolean.valueOf(z3));
            } catch (Exception unused) {
                Log.i("ListPopupWindow", "Could not call setClipToScreenEnabled() on PopupWindow. Oh well.");
            }
        }
    }

    private int e() {
        int i4;
        int i5;
        int makeMeasureSpec;
        int i6;
        if (this.f747c == null) {
            Context context = this.f745a;
            this.A = new a();
            v g4 = g(context, !this.E);
            this.f747c = g4;
            Drawable drawable = this.f764t;
            if (drawable != null) {
                g4.setSelector(drawable);
            }
            this.f747c.setAdapter(this.f746b);
            this.f747c.setOnItemClickListener(this.f765u);
            this.f747c.setFocusable(true);
            this.f747c.setFocusableInTouchMode(true);
            this.f747c.setOnItemSelectedListener(new b());
            this.f747c.setOnScrollListener(this.f769y);
            AdapterView.OnItemSelectedListener onItemSelectedListener = this.f766v;
            if (onItemSelectedListener != null) {
                this.f747c.setOnItemSelectedListener(onItemSelectedListener);
            }
            View view = this.f747c;
            View view2 = this.f760p;
            if (view2 != null) {
                LinearLayout linearLayout = new LinearLayout(context);
                linearLayout.setOrientation(1);
                ViewGroup.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, 0, 1.0f);
                int i7 = this.f761q;
                if (i7 == 0) {
                    linearLayout.addView(view2);
                    linearLayout.addView(view, layoutParams);
                } else if (i7 != 1) {
                    Log.e("ListPopupWindow", c3.d4(320) + this.f761q);
                } else {
                    linearLayout.addView(view, layoutParams);
                    linearLayout.addView(view2);
                }
                int i8 = this.f749e;
                if (i8 >= 0) {
                    i6 = Integer.MIN_VALUE;
                } else {
                    i8 = 0;
                    i6 = 0;
                }
                view2.measure(View.MeasureSpec.makeMeasureSpec(i8, i6), 0);
                LinearLayout.LayoutParams layoutParams2 = (LinearLayout.LayoutParams) view2.getLayoutParams();
                i4 = view2.getMeasuredHeight() + layoutParams2.topMargin + layoutParams2.bottomMargin;
                view = linearLayout;
            } else {
                i4 = 0;
            }
            this.F.setContentView(view);
        } else {
            View view3 = this.f760p;
            if (view3 != null) {
                LinearLayout.LayoutParams layoutParams3 = (LinearLayout.LayoutParams) view3.getLayoutParams();
                i4 = view3.getMeasuredHeight() + layoutParams3.topMargin + layoutParams3.bottomMargin;
            } else {
                i4 = 0;
            }
        }
        Drawable background = this.F.getBackground();
        if (background != null) {
            background.getPadding(this.C);
            Rect rect = this.C;
            int i9 = rect.top;
            i5 = rect.bottom + i9;
            if (!this.f753i) {
                this.f751g = -i9;
            }
        } else {
            this.C.setEmpty();
            i5 = 0;
        }
        int k4 = k(h(), this.f751g, this.F.getInputMethodMode() == 2);
        if (this.f757m || this.f748d == -1) {
            return k4 + i5;
        }
        int i10 = this.f749e;
        if (i10 == -2) {
            int i11 = this.f745a.getResources().getDisplayMetrics().widthPixels;
            Rect rect2 = this.C;
            makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(i11 - (rect2.left + rect2.right), Integer.MIN_VALUE);
        } else if (i10 != -1) {
            makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(i10, 1073741824);
        } else {
            int i12 = this.f745a.getResources().getDisplayMetrics().widthPixels;
            Rect rect3 = this.C;
            makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(i12 - (rect3.left + rect3.right), 1073741824);
        }
        int d4 = this.f747c.d(makeMeasureSpec, 0, -1, k4 - i4, -1);
        if (d4 > 0) {
            i4 += i5 + this.f747c.getPaddingTop() + this.f747c.getPaddingBottom();
        }
        return d4 + i4;
    }

    private int k(View view, int i4, boolean z3) {
        return c.a(this.F, view, i4, z3);
    }

    private void o() {
        View view = this.f760p;
        if (view != null) {
            ViewParent parent = view.getParent();
            if (parent instanceof ViewGroup) {
                ((ViewGroup) parent).removeView(this.f760p);
            }
        }
    }

    public void A(boolean z3) {
        this.f755k = true;
        this.f754j = z3;
    }

    public void C(int i4) {
        this.f751g = i4;
        this.f753i = true;
    }

    public void D(int i4) {
        this.f749e = i4;
    }

    @Override // androidx.appcompat.view.menu.k
    public void b() {
        int e4 = e();
        boolean m3 = m();
        androidx.core.widget.f.b(this.F, this.f752h);
        if (this.F.isShowing()) {
            if (androidx.core.view.v.v(h())) {
                int i4 = this.f749e;
                if (i4 == -1) {
                    i4 = -1;
                } else if (i4 == -2) {
                    i4 = h().getWidth();
                }
                int i5 = this.f748d;
                if (i5 == -1) {
                    if (!m3) {
                        e4 = -1;
                    }
                    if (m3) {
                        this.F.setWidth(this.f749e == -1 ? -1 : 0);
                        this.F.setHeight(0);
                    } else {
                        this.F.setWidth(this.f749e == -1 ? -1 : 0);
                        this.F.setHeight(-1);
                    }
                } else if (i5 != -2) {
                    e4 = i5;
                }
                this.F.setOutsideTouchable((this.f758n || this.f757m) ? false : true);
                this.F.update(h(), this.f750f, this.f751g, i4 < 0 ? -1 : i4, e4 < 0 ? -1 : e4);
                return;
            }
            return;
        }
        int i6 = this.f749e;
        if (i6 == -1) {
            i6 = -1;
        } else if (i6 == -2) {
            i6 = h().getWidth();
        }
        int i7 = this.f748d;
        if (i7 == -1) {
            e4 = -1;
        } else if (i7 != -2) {
            e4 = i7;
        }
        this.F.setWidth(i6);
        this.F.setHeight(e4);
        B(true);
        this.F.setOutsideTouchable((this.f758n || this.f757m) ? false : true);
        this.F.setTouchInterceptor(this.f768x);
        if (this.f755k) {
            androidx.core.widget.f.a(this.F, this.f754j);
        }
        if (Build.VERSION.SDK_INT <= 28) {
            Method method = H;
            if (method != null) {
                try {
                    method.invoke(this.F, this.D);
                } catch (Exception e5) {
                    Log.e("ListPopupWindow", c3.d4(664), e5);
                }
            }
        } else {
            d.a(this.F, this.D);
        }
        androidx.core.widget.f.c(this.F, h(), this.f750f, this.f751g, this.f756l);
        this.f747c.setSelection(-1);
        if (!this.E || this.f747c.isInTouchMode()) {
            f();
        }
        if (this.E) {
            return;
        }
        this.B.post(this.f770z);
    }

    @Override // androidx.appcompat.view.menu.k
    public ListView d() {
        return this.f747c;
    }

    @Override // androidx.appcompat.view.menu.k
    public void dismiss() {
        this.F.dismiss();
        o();
        this.F.setContentView(null);
        this.f747c = null;
        this.B.removeCallbacks(this.f767w);
    }

    public void f() {
        v vVar = this.f747c;
        if (vVar != null) {
            vVar.setListSelectionHidden(true);
            vVar.requestLayout();
        }
    }

    abstract v g(Context context, boolean z3);

    public View h() {
        return this.f763s;
    }

    @Override // androidx.appcompat.view.menu.k
    public boolean i() {
        return this.F.isShowing();
    }

    public int j() {
        return this.f750f;
    }

    public int l() {
        if (this.f753i) {
            return this.f751g;
        }
        return 0;
    }

    public boolean m() {
        return this.F.getInputMethodMode() == 2;
    }

    public boolean n() {
        return this.E;
    }

    public void p(ListAdapter listAdapter) {
        DataSetObserver dataSetObserver = this.f762r;
        if (dataSetObserver == null) {
            this.f762r = new f();
        } else {
            ListAdapter listAdapter2 = this.f746b;
            if (listAdapter2 != null) {
                listAdapter2.unregisterDataSetObserver(dataSetObserver);
            }
        }
        this.f746b = listAdapter;
        if (listAdapter != null) {
            listAdapter.registerDataSetObserver(this.f762r);
        }
        v vVar = this.f747c;
        if (vVar != null) {
            vVar.setAdapter(this.f746b);
        }
    }

    public void q(View view) {
        this.f763s = view;
    }

    public void r(int i4) {
        this.F.setAnimationStyle(i4);
    }

    public void s(int i4) {
        Drawable background = this.F.getBackground();
        if (background == null) {
            D(i4);
            return;
        }
        background.getPadding(this.C);
        Rect rect = this.C;
        this.f749e = rect.left + rect.right + i4;
    }

    public void t(int i4) {
        this.f756l = i4;
    }

    public void u(Rect rect) {
        this.D = rect != null ? new Rect(rect) : null;
    }

    public void v(int i4) {
        this.f750f = i4;
    }

    public void w(int i4) {
        this.F.setInputMethodMode(i4);
    }

    public void x(boolean z3) {
        this.E = z3;
        this.F.setFocusable(z3);
    }

    public void y(PopupWindow.OnDismissListener onDismissListener) {
        this.F.setOnDismissListener(onDismissListener);
    }

    public void z(AdapterView.OnItemClickListener onItemClickListener) {
        this.f765u = onItemClickListener;
    }
}
