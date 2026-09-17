package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.util.SparseBooleanArray;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.view.menu.i;
import androidx.appcompat.view.menu.j;
import androidx.appcompat.widget.ActionMenuView;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class c extends androidx.appcompat.view.menu.b {
    private b A;
    final f B;
    int C;

    /* renamed from: j, reason: collision with root package name */
    d f485j;

    /* renamed from: k, reason: collision with root package name */
    private Drawable f486k;

    /* renamed from: l, reason: collision with root package name */
    private boolean f487l;

    /* renamed from: m, reason: collision with root package name */
    private boolean f488m;

    /* renamed from: n, reason: collision with root package name */
    private boolean f489n;

    /* renamed from: o, reason: collision with root package name */
    private int f490o;

    /* renamed from: p, reason: collision with root package name */
    private int f491p;

    /* renamed from: q, reason: collision with root package name */
    private int f492q;

    /* renamed from: r, reason: collision with root package name */
    private boolean f493r;

    /* renamed from: s, reason: collision with root package name */
    private boolean f494s;

    /* renamed from: t, reason: collision with root package name */
    private boolean f495t;

    /* renamed from: u, reason: collision with root package name */
    private boolean f496u;

    /* renamed from: v, reason: collision with root package name */
    private int f497v;

    /* renamed from: w, reason: collision with root package name */
    private final SparseBooleanArray f498w;

    /* renamed from: x, reason: collision with root package name */
    e f499x;

    /* renamed from: y, reason: collision with root package name */
    a f500y;

    /* renamed from: z, reason: collision with root package name */
    RunnableC0004c f501z;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class a extends androidx.appcompat.view.menu.h {
        public a(Context context, androidx.appcompat.view.menu.m mVar, View view) {
            super(context, mVar, view, false, c.a.f1834f);
            if (!((androidx.appcompat.view.menu.f) mVar.getItem()).k()) {
                View view2 = c.this.f485j;
                f(view2 == null ? (View) ((androidx.appcompat.view.menu.b) c.this).f171i : view2);
            }
            j(c.this.B);
        }

        @Override // androidx.appcompat.view.menu.h
        protected void e() {
            c cVar = c.this;
            cVar.f500y = null;
            cVar.C = 0;
            super.e();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b extends ActionMenuItemView.b {
        b() {
        }

        @Override // androidx.appcompat.view.menu.ActionMenuItemView.b
        public androidx.appcompat.view.menu.k a() {
            a aVar = c.this.f500y;
            if (aVar != null) {
                return aVar.c();
            }
            return null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.appcompat.widget.c$c, reason: collision with other inner class name */
    private class RunnableC0004c implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        private e f504e;

        public RunnableC0004c(e eVar) {
            this.f504e = eVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (((androidx.appcompat.view.menu.b) c.this).f165c != null) {
                ((androidx.appcompat.view.menu.b) c.this).f165c.c();
            }
            View view = (View) ((androidx.appcompat.view.menu.b) c.this).f171i;
            if (view != null && view.getWindowToken() != null && this.f504e.m()) {
                c.this.f499x = this.f504e;
            }
            c.this.f501z = null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class d extends l implements ActionMenuView.a {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a extends x {

            /* renamed from: j, reason: collision with root package name */
            final /* synthetic */ c f507j;

            /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
            a(View view, c cVar) {
                super(view);
                this.f507j = cVar;
            }

            @Override // androidx.appcompat.widget.x
            public androidx.appcompat.view.menu.k b() {
                e eVar = c.this.f499x;
                if (eVar == null) {
                    return null;
                }
                return eVar.c();
            }

            @Override // androidx.appcompat.widget.x
            public boolean c() {
                c.this.H();
                return true;
            }

            @Override // androidx.appcompat.widget.x
            public boolean d() {
                c cVar = c.this;
                if (cVar.f501z != null) {
                    return false;
                }
                cVar.z();
                return true;
            }
        }

        public d(Context context) {
            super(context, null, c.a.f1833e);
            setClickable(true);
            setFocusable(true);
            setVisibility(0);
            setEnabled(true);
            p0.a(this, getContentDescription());
            setOnTouchListener(new a(this, c.this));
        }

        @Override // androidx.appcompat.widget.ActionMenuView.a
        public boolean b() {
            return false;
        }

        @Override // androidx.appcompat.widget.ActionMenuView.a
        public boolean c() {
            return false;
        }

        @Override // android.view.View
        public boolean performClick() {
            if (super.performClick()) {
                return true;
            }
            playSoundEffect(0);
            c.this.H();
            return true;
        }

        @Override // android.widget.ImageView
        protected boolean setFrame(int i4, int i5, int i6, int i7) {
            boolean frame = super.setFrame(i4, i5, i6, i7);
            Drawable drawable = getDrawable();
            Drawable background = getBackground();
            if (drawable != null && background != null) {
                int width = getWidth();
                int height = getHeight();
                int max = Math.max(width, height) / 2;
                int paddingLeft = (width + (getPaddingLeft() - getPaddingRight())) / 2;
                int paddingTop = (height + (getPaddingTop() - getPaddingBottom())) / 2;
                androidx.core.graphics.drawable.a.d(background, paddingLeft - max, paddingTop - max, paddingLeft + max, paddingTop + max);
            }
            return frame;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class e extends androidx.appcompat.view.menu.h {
        public e(Context context, androidx.appcompat.view.menu.e eVar, View view, boolean z3) {
            super(context, eVar, view, z3, c.a.f1834f);
            h(8388613);
            j(c.this.B);
        }

        @Override // androidx.appcompat.view.menu.h
        protected void e() {
            if (((androidx.appcompat.view.menu.b) c.this).f165c != null) {
                ((androidx.appcompat.view.menu.b) c.this).f165c.close();
            }
            c.this.f499x = null;
            super.e();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class f implements i.a {
        f() {
        }

        @Override // androidx.appcompat.view.menu.i.a
        public void a(androidx.appcompat.view.menu.e eVar, boolean z3) {
            if (eVar instanceof androidx.appcompat.view.menu.m) {
                eVar.z().d(false);
            }
            i.a m3 = c.this.m();
            if (m3 != null) {
                m3.a(eVar, z3);
            }
        }

        @Override // androidx.appcompat.view.menu.i.a
        public boolean b(androidx.appcompat.view.menu.e eVar) {
            if (eVar == ((androidx.appcompat.view.menu.b) c.this).f165c) {
                return false;
            }
            c.this.C = ((androidx.appcompat.view.menu.m) eVar).getItem().getItemId();
            i.a m3 = c.this.m();
            if (m3 != null) {
                return m3.b(eVar);
            }
            return false;
        }
    }

    public c(Context context) {
        super(context, c.f.f1921c, c.f.f1920b);
        this.f498w = new SparseBooleanArray();
        this.B = new f();
    }

    /* JADX WARN: Multi-variable type inference failed */
    private View x(MenuItem menuItem) {
        ViewGroup viewGroup = (ViewGroup) this.f171i;
        if (viewGroup == null) {
            return null;
        }
        int childCount = viewGroup.getChildCount();
        for (int i4 = 0; i4 < childCount; i4++) {
            View childAt = viewGroup.getChildAt(i4);
            if ((childAt instanceof j.a) && ((j.a) childAt).getItemData() == menuItem) {
                return childAt;
            }
        }
        return null;
    }

    public boolean A() {
        a aVar = this.f500y;
        if (aVar == null) {
            return false;
        }
        aVar.b();
        return true;
    }

    public boolean B() {
        e eVar = this.f499x;
        return eVar != null && eVar.d();
    }

    public void C(Configuration configuration) {
        if (!this.f493r) {
            this.f492q = h.a.a(this.f164b).c();
        }
        androidx.appcompat.view.menu.e eVar = this.f165c;
        if (eVar != null) {
            eVar.G(true);
        }
    }

    public void D(boolean z3) {
        this.f496u = z3;
    }

    public void E(ActionMenuView actionMenuView) {
        this.f171i = actionMenuView;
        actionMenuView.E(this.f165c);
    }

    public void F(Drawable drawable) {
        d dVar = this.f485j;
        if (dVar != null) {
            dVar.setImageDrawable(drawable);
        } else {
            this.f487l = true;
            this.f486k = drawable;
        }
    }

    public void G(boolean z3) {
        this.f488m = z3;
        this.f489n = true;
    }

    public boolean H() {
        androidx.appcompat.view.menu.e eVar;
        if (!this.f488m || B() || (eVar = this.f165c) == null || this.f171i == null || this.f501z != null || eVar.v().isEmpty()) {
            return false;
        }
        RunnableC0004c runnableC0004c = new RunnableC0004c(new e(this.f164b, this.f165c, this.f485j, true));
        this.f501z = runnableC0004c;
        ((View) this.f171i).post(runnableC0004c);
        return true;
    }

    @Override // androidx.appcompat.view.menu.b, androidx.appcompat.view.menu.i
    public void a(androidx.appcompat.view.menu.e eVar, boolean z3) {
        w();
        super.a(eVar, z3);
    }

    @Override // androidx.appcompat.view.menu.b, androidx.appcompat.view.menu.i
    public void c(Context context, androidx.appcompat.view.menu.e eVar) {
        super.c(context, eVar);
        Resources resources = context.getResources();
        h.a a4 = h.a.a(context);
        if (!this.f489n) {
            this.f488m = a4.d();
        }
        if (!this.f495t) {
            this.f490o = a4.b();
        }
        if (!this.f493r) {
            this.f492q = a4.c();
        }
        int i4 = this.f490o;
        if (this.f488m) {
            if (this.f485j == null) {
                d dVar = new d(this.f163a);
                this.f485j = dVar;
                if (this.f487l) {
                    dVar.setImageDrawable(this.f486k);
                    this.f486k = null;
                    this.f487l = false;
                }
                int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, 0);
                this.f485j.measure(makeMeasureSpec, makeMeasureSpec);
            }
            i4 -= this.f485j.getMeasuredWidth();
        } else {
            this.f485j = null;
        }
        this.f491p = i4;
        this.f497v = (int) (resources.getDisplayMetrics().density * 56.0f);
    }

    @Override // androidx.appcompat.view.menu.b
    public void d(androidx.appcompat.view.menu.f fVar, j.a aVar) {
        aVar.d(fVar, 0);
        ActionMenuItemView actionMenuItemView = (ActionMenuItemView) aVar;
        actionMenuItemView.setItemInvoker((ActionMenuView) this.f171i);
        if (this.A == null) {
            this.A = new b();
        }
        actionMenuItemView.setPopupCallback(this.A);
    }

    @Override // androidx.appcompat.view.menu.b, androidx.appcompat.view.menu.i
    public boolean e(androidx.appcompat.view.menu.m mVar) {
        boolean z3 = false;
        if (!mVar.hasVisibleItems()) {
            return false;
        }
        androidx.appcompat.view.menu.m mVar2 = mVar;
        while (mVar2.W() != this.f165c) {
            mVar2 = (androidx.appcompat.view.menu.m) mVar2.W();
        }
        View x3 = x(mVar2.getItem());
        if (x3 == null) {
            return false;
        }
        this.C = mVar.getItem().getItemId();
        int size = mVar.size();
        int i4 = 0;
        while (true) {
            if (i4 >= size) {
                break;
            }
            MenuItem item = mVar.getItem(i4);
            if (item.isVisible() && item.getIcon() != null) {
                z3 = true;
                break;
            }
            i4++;
        }
        a aVar = new a(this.f164b, mVar, x3);
        this.f500y = aVar;
        aVar.g(z3);
        this.f500y.k();
        super.e(mVar);
        return true;
    }

    @Override // androidx.appcompat.view.menu.b, androidx.appcompat.view.menu.i
    public void f(boolean z3) {
        super.f(z3);
        ((View) this.f171i).requestLayout();
        androidx.appcompat.view.menu.e eVar = this.f165c;
        boolean z4 = false;
        if (eVar != null) {
            ArrayList r3 = eVar.r();
            int size = r3.size();
            for (int i4 = 0; i4 < size; i4++) {
                ((androidx.appcompat.view.menu.f) r3.get(i4)).g();
            }
        }
        androidx.appcompat.view.menu.e eVar2 = this.f165c;
        ArrayList v3 = eVar2 != null ? eVar2.v() : null;
        if (this.f488m && v3 != null) {
            int size2 = v3.size();
            if (size2 == 1) {
                z4 = !((androidx.appcompat.view.menu.f) v3.get(0)).isActionViewExpanded();
            } else if (size2 > 0) {
                z4 = true;
            }
        }
        if (z4) {
            if (this.f485j == null) {
                this.f485j = new d(this.f163a);
            }
            ViewGroup viewGroup = (ViewGroup) this.f485j.getParent();
            if (viewGroup != this.f171i) {
                if (viewGroup != null) {
                    viewGroup.removeView(this.f485j);
                }
                ActionMenuView actionMenuView = (ActionMenuView) this.f171i;
                actionMenuView.addView(this.f485j, actionMenuView.C());
            }
        } else {
            d dVar = this.f485j;
            if (dVar != null) {
                Object parent = dVar.getParent();
                Object obj = this.f171i;
                if (parent == obj) {
                    ((ViewGroup) obj).removeView(this.f485j);
                }
            }
        }
        ((ActionMenuView) this.f171i).setOverflowReserved(this.f488m);
    }

    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r3v0 */
    /* JADX WARN: Type inference failed for: r3v1, types: [int] */
    /* JADX WARN: Type inference failed for: r3v12 */
    @Override // androidx.appcompat.view.menu.i
    public boolean g() {
        ArrayList arrayList;
        int i4;
        int i5;
        int i6;
        boolean z3;
        int i7;
        c cVar = this;
        androidx.appcompat.view.menu.e eVar = cVar.f165c;
        View view = null;
        ?? r3 = 0;
        if (eVar != null) {
            arrayList = eVar.A();
            i4 = arrayList.size();
        } else {
            arrayList = null;
            i4 = 0;
        }
        int i8 = cVar.f492q;
        int i9 = cVar.f491p;
        int makeMeasureSpec = View.MeasureSpec.makeMeasureSpec(0, 0);
        ViewGroup viewGroup = (ViewGroup) cVar.f171i;
        boolean z4 = false;
        int i10 = 0;
        int i11 = 0;
        for (int i12 = 0; i12 < i4; i12++) {
            androidx.appcompat.view.menu.f fVar = (androidx.appcompat.view.menu.f) arrayList.get(i12);
            if (fVar.n()) {
                i10++;
            } else if (fVar.m()) {
                i11++;
            } else {
                z4 = true;
            }
            if (cVar.f496u && fVar.isActionViewExpanded()) {
                i8 = 0;
            }
        }
        if (cVar.f488m && (z4 || i11 + i10 > i8)) {
            i8--;
        }
        int i13 = i8 - i10;
        SparseBooleanArray sparseBooleanArray = cVar.f498w;
        sparseBooleanArray.clear();
        if (cVar.f494s) {
            int i14 = cVar.f497v;
            i6 = i9 / i14;
            i5 = i14 + ((i9 % i14) / i6);
        } else {
            i5 = 0;
            i6 = 0;
        }
        int i15 = 0;
        int i16 = 0;
        while (i15 < i4) {
            androidx.appcompat.view.menu.f fVar2 = (androidx.appcompat.view.menu.f) arrayList.get(i15);
            if (fVar2.n()) {
                View n3 = cVar.n(fVar2, view, viewGroup);
                if (cVar.f494s) {
                    i6 -= ActionMenuView.G(n3, i5, i6, makeMeasureSpec, r3);
                } else {
                    n3.measure(makeMeasureSpec, makeMeasureSpec);
                }
                int measuredWidth = n3.getMeasuredWidth();
                i9 -= measuredWidth;
                if (i16 == 0) {
                    i16 = measuredWidth;
                }
                int groupId = fVar2.getGroupId();
                if (groupId != 0) {
                    sparseBooleanArray.put(groupId, true);
                }
                fVar2.t(true);
                z3 = r3;
                i7 = i4;
            } else if (fVar2.m()) {
                int groupId2 = fVar2.getGroupId();
                boolean z5 = sparseBooleanArray.get(groupId2);
                boolean z6 = (i13 > 0 || z5) && i9 > 0 && (!cVar.f494s || i6 > 0);
                boolean z7 = z6;
                i7 = i4;
                if (z6) {
                    View n4 = cVar.n(fVar2, null, viewGroup);
                    if (cVar.f494s) {
                        int G = ActionMenuView.G(n4, i5, i6, makeMeasureSpec, 0);
                        i6 -= G;
                        if (G == 0) {
                            z7 = false;
                        }
                    } else {
                        n4.measure(makeMeasureSpec, makeMeasureSpec);
                    }
                    boolean z8 = z7;
                    int measuredWidth2 = n4.getMeasuredWidth();
                    i9 -= measuredWidth2;
                    if (i16 == 0) {
                        i16 = measuredWidth2;
                    }
                    z6 = z8 & (!cVar.f494s ? i9 + i16 <= 0 : i9 < 0);
                }
                if (z6 && groupId2 != 0) {
                    sparseBooleanArray.put(groupId2, true);
                } else if (z5) {
                    sparseBooleanArray.put(groupId2, false);
                    for (int i17 = 0; i17 < i15; i17++) {
                        androidx.appcompat.view.menu.f fVar3 = (androidx.appcompat.view.menu.f) arrayList.get(i17);
                        if (fVar3.getGroupId() == groupId2) {
                            if (fVar3.k()) {
                                i13++;
                            }
                            fVar3.t(false);
                        }
                    }
                }
                if (z6) {
                    i13--;
                }
                fVar2.t(z6);
                z3 = false;
            } else {
                z3 = r3;
                i7 = i4;
                fVar2.t(z3);
            }
            i15++;
            r3 = z3;
            i4 = i7;
            view = null;
            cVar = this;
        }
        return true;
    }

    @Override // androidx.appcompat.view.menu.b
    public boolean l(ViewGroup viewGroup, int i4) {
        if (viewGroup.getChildAt(i4) == this.f485j) {
            return false;
        }
        return super.l(viewGroup, i4);
    }

    @Override // androidx.appcompat.view.menu.b
    public View n(androidx.appcompat.view.menu.f fVar, View view, ViewGroup viewGroup) {
        View actionView = fVar.getActionView();
        if (actionView == null || fVar.i()) {
            actionView = super.n(fVar, view, viewGroup);
        }
        actionView.setVisibility(fVar.isActionViewExpanded() ? 8 : 0);
        ActionMenuView actionMenuView = (ActionMenuView) viewGroup;
        ViewGroup.LayoutParams layoutParams = actionView.getLayoutParams();
        if (!actionMenuView.checkLayoutParams(layoutParams)) {
            actionView.setLayoutParams(actionMenuView.generateLayoutParams(layoutParams));
        }
        return actionView;
    }

    @Override // androidx.appcompat.view.menu.b
    public boolean o(int i4, androidx.appcompat.view.menu.f fVar) {
        return fVar.k();
    }

    public boolean w() {
        return z() | A();
    }

    public Drawable y() {
        d dVar = this.f485j;
        if (dVar != null) {
            return dVar.getDrawable();
        }
        if (this.f487l) {
            return this.f486k;
        }
        return null;
    }

    public boolean z() {
        Object obj;
        RunnableC0004c runnableC0004c = this.f501z;
        if (runnableC0004c != null && (obj = this.f171i) != null) {
            ((View) obj).removeCallbacks(runnableC0004c);
            this.f501z = null;
            return true;
        }
        e eVar = this.f499x;
        if (eVar == null) {
            return false;
        }
        eVar.b();
        return true;
    }
}
