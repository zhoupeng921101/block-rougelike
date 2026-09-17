package androidx.appcompat.view.menu;

import android.R;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Rect;
import android.os.Build;
import android.os.Handler;
import android.os.SystemClock;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import android.widget.HeaderViewListAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.TextView;
import androidx.appcompat.view.menu.i;
import androidx.appcompat.widget.a0;
import androidx.appcompat.widget.b0;
import androidx.core.view.v;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends g implements i, View.OnKeyListener, PopupWindow.OnDismissListener {
    private static final int B = c.f.f1923e;
    boolean A;

    /* renamed from: b, reason: collision with root package name */
    private final Context f172b;

    /* renamed from: c, reason: collision with root package name */
    private final int f173c;

    /* renamed from: d, reason: collision with root package name */
    private final int f174d;

    /* renamed from: e, reason: collision with root package name */
    private final int f175e;

    /* renamed from: f, reason: collision with root package name */
    private final boolean f176f;

    /* renamed from: g, reason: collision with root package name */
    final Handler f177g;

    /* renamed from: o, reason: collision with root package name */
    private View f185o;

    /* renamed from: p, reason: collision with root package name */
    View f186p;

    /* renamed from: r, reason: collision with root package name */
    private boolean f188r;

    /* renamed from: s, reason: collision with root package name */
    private boolean f189s;

    /* renamed from: t, reason: collision with root package name */
    private int f190t;

    /* renamed from: u, reason: collision with root package name */
    private int f191u;

    /* renamed from: w, reason: collision with root package name */
    private boolean f193w;

    /* renamed from: x, reason: collision with root package name */
    private i.a f194x;

    /* renamed from: y, reason: collision with root package name */
    ViewTreeObserver f195y;

    /* renamed from: z, reason: collision with root package name */
    private PopupWindow.OnDismissListener f196z;

    /* renamed from: h, reason: collision with root package name */
    private final List f178h = new ArrayList();

    /* renamed from: i, reason: collision with root package name */
    final List f179i = new ArrayList();

    /* renamed from: j, reason: collision with root package name */
    final ViewTreeObserver.OnGlobalLayoutListener f180j = new a();

    /* renamed from: k, reason: collision with root package name */
    private final View.OnAttachStateChangeListener f181k = new b();

    /* renamed from: l, reason: collision with root package name */
    private final a0 f182l = new C0002c();

    /* renamed from: m, reason: collision with root package name */
    private int f183m = 0;

    /* renamed from: n, reason: collision with root package name */
    private int f184n = 0;

    /* renamed from: v, reason: collision with root package name */
    private boolean f192v = false;

    /* renamed from: q, reason: collision with root package name */
    private int f187q = D();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements ViewTreeObserver.OnGlobalLayoutListener {
        a() {
        }

        @Override // android.view.ViewTreeObserver.OnGlobalLayoutListener
        public void onGlobalLayout() {
            if (!c.this.i() || c.this.f179i.size() <= 0 || ((d) c.this.f179i.get(0)).f204a.n()) {
                return;
            }
            View view = c.this.f186p;
            if (view == null || !view.isShown()) {
                c.this.dismiss();
                return;
            }
            Iterator it = c.this.f179i.iterator();
            while (it.hasNext()) {
                ((d) it.next()).f204a.b();
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements View.OnAttachStateChangeListener {
        b() {
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewAttachedToWindow(View view) {
        }

        @Override // android.view.View.OnAttachStateChangeListener
        public void onViewDetachedFromWindow(View view) {
            ViewTreeObserver viewTreeObserver = c.this.f195y;
            if (viewTreeObserver != null) {
                if (!viewTreeObserver.isAlive()) {
                    c.this.f195y = view.getViewTreeObserver();
                }
                c cVar = c.this;
                cVar.f195y.removeGlobalOnLayoutListener(cVar.f180j);
            }
            view.removeOnAttachStateChangeListener(this);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.appcompat.view.menu.c$c, reason: collision with other inner class name */
    class C0002c implements a0 {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: androidx.appcompat.view.menu.c$c$a */
        class a implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ d f200e;

            /* renamed from: f, reason: collision with root package name */
            final /* synthetic */ MenuItem f201f;

            /* renamed from: g, reason: collision with root package name */
            final /* synthetic */ e f202g;

            a(d dVar, MenuItem menuItem, e eVar) {
                this.f200e = dVar;
                this.f201f = menuItem;
                this.f202g = eVar;
            }

            @Override // java.lang.Runnable
            public void run() {
                d dVar = this.f200e;
                if (dVar != null) {
                    c.this.A = true;
                    dVar.f205b.d(false);
                    c.this.A = false;
                }
                if (this.f201f.isEnabled() && this.f201f.hasSubMenu()) {
                    this.f202g.H(this.f201f, 4);
                }
            }
        }

        C0002c() {
        }

        @Override // androidx.appcompat.widget.a0
        public void a(e eVar, MenuItem menuItem) {
            c.this.f177g.removeCallbacksAndMessages(null);
            int size = c.this.f179i.size();
            int i4 = 0;
            while (true) {
                if (i4 >= size) {
                    i4 = -1;
                    break;
                } else if (eVar == ((d) c.this.f179i.get(i4)).f205b) {
                    break;
                } else {
                    i4++;
                }
            }
            if (i4 == -1) {
                return;
            }
            int i5 = i4 + 1;
            c.this.f177g.postAtTime(new a(i5 < c.this.f179i.size() ? (d) c.this.f179i.get(i5) : null, menuItem, eVar), eVar, SystemClock.uptimeMillis() + 200);
        }

        @Override // androidx.appcompat.widget.a0
        public void c(e eVar, MenuItem menuItem) {
            c.this.f177g.removeCallbacksAndMessages(eVar);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class d {

        /* renamed from: a, reason: collision with root package name */
        public final b0 f204a;

        /* renamed from: b, reason: collision with root package name */
        public final e f205b;

        /* renamed from: c, reason: collision with root package name */
        public final int f206c;

        public d(b0 b0Var, e eVar, int i4) {
            this.f204a = b0Var;
            this.f205b = eVar;
            this.f206c = i4;
        }

        public ListView a() {
            return this.f204a.d();
        }
    }

    public c(Context context, View view, int i4, int i5, boolean z3) {
        this.f172b = context;
        this.f185o = view;
        this.f174d = i4;
        this.f175e = i5;
        this.f176f = z3;
        Resources resources = context.getResources();
        this.f173c = Math.max(resources.getDisplayMetrics().widthPixels / 2, resources.getDimensionPixelSize(c.c.f1855b));
        this.f177g = new Handler();
    }

    private int A(e eVar) {
        int size = this.f179i.size();
        for (int i4 = 0; i4 < size; i4++) {
            if (eVar == ((d) this.f179i.get(i4)).f205b) {
                return i4;
            }
        }
        return -1;
    }

    private MenuItem B(e eVar, e eVar2) {
        int size = eVar.size();
        for (int i4 = 0; i4 < size; i4++) {
            MenuItem item = eVar.getItem(i4);
            if (item.hasSubMenu() && eVar2 == item.getSubMenu()) {
                return item;
            }
        }
        return null;
    }

    private View C(d dVar, e eVar) {
        androidx.appcompat.view.menu.d dVar2;
        int i4;
        int firstVisiblePosition;
        MenuItem B2 = B(dVar.f205b, eVar);
        if (B2 == null) {
            return null;
        }
        ListView a4 = dVar.a();
        ListAdapter adapter = a4.getAdapter();
        int i5 = 0;
        if (adapter instanceof HeaderViewListAdapter) {
            HeaderViewListAdapter headerViewListAdapter = (HeaderViewListAdapter) adapter;
            i4 = headerViewListAdapter.getHeadersCount();
            dVar2 = (androidx.appcompat.view.menu.d) headerViewListAdapter.getWrappedAdapter();
        } else {
            dVar2 = (androidx.appcompat.view.menu.d) adapter;
            i4 = 0;
        }
        int count = dVar2.getCount();
        while (true) {
            if (i5 >= count) {
                i5 = -1;
                break;
            }
            if (B2 == dVar2.getItem(i5)) {
                break;
            }
            i5++;
        }
        if (i5 != -1 && (firstVisiblePosition = (i5 + i4) - a4.getFirstVisiblePosition()) >= 0 && firstVisiblePosition < a4.getChildCount()) {
            return a4.getChildAt(firstVisiblePosition);
        }
        return null;
    }

    private int D() {
        return v.o(this.f185o) == 1 ? 0 : 1;
    }

    private int E(int i4) {
        List list = this.f179i;
        ListView a4 = ((d) list.get(list.size() - 1)).a();
        int[] iArr = new int[2];
        a4.getLocationOnScreen(iArr);
        Rect rect = new Rect();
        this.f186p.getWindowVisibleDisplayFrame(rect);
        return this.f187q == 1 ? (iArr[0] + a4.getWidth()) + i4 > rect.right ? 0 : 1 : iArr[0] - i4 < 0 ? 1 : 0;
    }

    private void F(e eVar) {
        d dVar;
        View view;
        int i4;
        int i5;
        int i6;
        LayoutInflater from = LayoutInflater.from(this.f172b);
        androidx.appcompat.view.menu.d dVar2 = new androidx.appcompat.view.menu.d(eVar, from, this.f176f, B);
        if (!i() && this.f192v) {
            dVar2.d(true);
        } else if (i()) {
            dVar2.d(g.x(eVar));
        }
        int o3 = g.o(dVar2, null, this.f172b, this.f173c);
        b0 z3 = z();
        z3.p(dVar2);
        z3.s(o3);
        z3.t(this.f184n);
        if (this.f179i.size() > 0) {
            List list = this.f179i;
            dVar = (d) list.get(list.size() - 1);
            view = C(dVar, eVar);
        } else {
            dVar = null;
            view = null;
        }
        if (view != null) {
            z3.H(false);
            z3.E(null);
            int E = E(o3);
            boolean z4 = E == 1;
            this.f187q = E;
            if (Build.VERSION.SDK_INT >= 26) {
                z3.q(view);
                i5 = 0;
                i4 = 0;
            } else {
                int[] iArr = new int[2];
                this.f185o.getLocationOnScreen(iArr);
                int[] iArr2 = new int[2];
                view.getLocationOnScreen(iArr2);
                if ((this.f184n & 7) == 5) {
                    iArr[0] = iArr[0] + this.f185o.getWidth();
                    iArr2[0] = iArr2[0] + view.getWidth();
                }
                i4 = iArr2[0] - iArr[0];
                i5 = iArr2[1] - iArr[1];
            }
            if ((this.f184n & 5) == 5) {
                if (!z4) {
                    o3 = view.getWidth();
                    i6 = i4 - o3;
                }
                i6 = i4 + o3;
            } else {
                if (z4) {
                    o3 = view.getWidth();
                    i6 = i4 + o3;
                }
                i6 = i4 - o3;
            }
            z3.v(i6);
            z3.A(true);
            z3.C(i5);
        } else {
            if (this.f188r) {
                z3.v(this.f190t);
            }
            if (this.f189s) {
                z3.C(this.f191u);
            }
            z3.u(n());
        }
        this.f179i.add(new d(z3, eVar, this.f187q));
        z3.b();
        ListView d4 = z3.d();
        d4.setOnKeyListener(this);
        if (dVar == null && this.f193w && eVar.u() != null) {
            FrameLayout frameLayout = (FrameLayout) from.inflate(c.f.f1927i, (ViewGroup) d4, false);
            TextView textView = (TextView) frameLayout.findViewById(R.id.title);
            frameLayout.setEnabled(false);
            textView.setText(eVar.u());
            d4.addHeaderView(frameLayout, null, false);
            z3.b();
        }
    }

    private b0 z() {
        b0 b0Var = new b0(this.f172b, null, this.f174d, this.f175e);
        b0Var.G(this.f182l);
        b0Var.z(this);
        b0Var.y(this);
        b0Var.q(this.f185o);
        b0Var.t(this.f184n);
        b0Var.x(true);
        b0Var.w(2);
        return b0Var;
    }

    @Override // androidx.appcompat.view.menu.i
    public void a(e eVar, boolean z3) {
        int A = A(eVar);
        if (A < 0) {
            return;
        }
        int i4 = A + 1;
        if (i4 < this.f179i.size()) {
            ((d) this.f179i.get(i4)).f205b.d(false);
        }
        d dVar = (d) this.f179i.remove(A);
        dVar.f205b.K(this);
        if (this.A) {
            dVar.f204a.F(null);
            dVar.f204a.r(0);
        }
        dVar.f204a.dismiss();
        int size = this.f179i.size();
        if (size > 0) {
            this.f187q = ((d) this.f179i.get(size - 1)).f206c;
        } else {
            this.f187q = D();
        }
        if (size != 0) {
            if (z3) {
                ((d) this.f179i.get(0)).f205b.d(false);
                return;
            }
            return;
        }
        dismiss();
        i.a aVar = this.f194x;
        if (aVar != null) {
            aVar.a(eVar, true);
        }
        ViewTreeObserver viewTreeObserver = this.f195y;
        if (viewTreeObserver != null) {
            if (viewTreeObserver.isAlive()) {
                this.f195y.removeGlobalOnLayoutListener(this.f180j);
            }
            this.f195y = null;
        }
        this.f186p.removeOnAttachStateChangeListener(this.f181k);
        this.f196z.onDismiss();
    }

    @Override // androidx.appcompat.view.menu.k
    public void b() {
        if (i()) {
            return;
        }
        Iterator it = this.f178h.iterator();
        while (it.hasNext()) {
            F((e) it.next());
        }
        this.f178h.clear();
        View view = this.f185o;
        this.f186p = view;
        if (view != null) {
            boolean z3 = this.f195y == null;
            ViewTreeObserver viewTreeObserver = view.getViewTreeObserver();
            this.f195y = viewTreeObserver;
            if (z3) {
                viewTreeObserver.addOnGlobalLayoutListener(this.f180j);
            }
            this.f186p.addOnAttachStateChangeListener(this.f181k);
        }
    }

    @Override // androidx.appcompat.view.menu.k
    public ListView d() {
        if (this.f179i.isEmpty()) {
            return null;
        }
        return ((d) this.f179i.get(r0.size() - 1)).a();
    }

    @Override // androidx.appcompat.view.menu.k
    public void dismiss() {
        int size = this.f179i.size();
        if (size > 0) {
            d[] dVarArr = (d[]) this.f179i.toArray(new d[size]);
            for (int i4 = size - 1; i4 >= 0; i4--) {
                d dVar = dVarArr[i4];
                if (dVar.f204a.i()) {
                    dVar.f204a.dismiss();
                }
            }
        }
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean e(m mVar) {
        for (d dVar : this.f179i) {
            if (mVar == dVar.f205b) {
                dVar.a().requestFocus();
                return true;
            }
        }
        if (!mVar.hasVisibleItems()) {
            return false;
        }
        l(mVar);
        i.a aVar = this.f194x;
        if (aVar != null) {
            aVar.b(mVar);
        }
        return true;
    }

    @Override // androidx.appcompat.view.menu.i
    public void f(boolean z3) {
        Iterator it = this.f179i.iterator();
        while (it.hasNext()) {
            g.y(((d) it.next()).a().getAdapter()).notifyDataSetChanged();
        }
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean g() {
        return false;
    }

    @Override // androidx.appcompat.view.menu.k
    public boolean i() {
        return this.f179i.size() > 0 && ((d) this.f179i.get(0)).f204a.i();
    }

    @Override // androidx.appcompat.view.menu.i
    public void k(i.a aVar) {
        this.f194x = aVar;
    }

    @Override // androidx.appcompat.view.menu.g
    public void l(e eVar) {
        eVar.b(this, this.f172b);
        if (i()) {
            F(eVar);
        } else {
            this.f178h.add(eVar);
        }
    }

    @Override // androidx.appcompat.view.menu.g
    protected boolean m() {
        return false;
    }

    @Override // android.widget.PopupWindow.OnDismissListener
    public void onDismiss() {
        d dVar;
        int size = this.f179i.size();
        int i4 = 0;
        while (true) {
            if (i4 >= size) {
                dVar = null;
                break;
            }
            dVar = (d) this.f179i.get(i4);
            if (!dVar.f204a.i()) {
                break;
            } else {
                i4++;
            }
        }
        if (dVar != null) {
            dVar.f205b.d(false);
        }
    }

    @Override // android.view.View.OnKeyListener
    public boolean onKey(View view, int i4, KeyEvent keyEvent) {
        if (keyEvent.getAction() != 1 || i4 != 82) {
            return false;
        }
        dismiss();
        return true;
    }

    @Override // androidx.appcompat.view.menu.g
    public void p(View view) {
        if (this.f185o != view) {
            this.f185o = view;
            this.f184n = androidx.core.view.e.a(this.f183m, v.o(view));
        }
    }

    @Override // androidx.appcompat.view.menu.g
    public void r(boolean z3) {
        this.f192v = z3;
    }

    @Override // androidx.appcompat.view.menu.g
    public void s(int i4) {
        if (this.f183m != i4) {
            this.f183m = i4;
            this.f184n = androidx.core.view.e.a(i4, v.o(this.f185o));
        }
    }

    @Override // androidx.appcompat.view.menu.g
    public void t(int i4) {
        this.f188r = true;
        this.f190t = i4;
    }

    @Override // androidx.appcompat.view.menu.g
    public void u(PopupWindow.OnDismissListener onDismissListener) {
        this.f196z = onDismissListener;
    }

    @Override // androidx.appcompat.view.menu.g
    public void v(boolean z3) {
        this.f193w = z3;
    }

    @Override // androidx.appcompat.view.menu.g
    public void w(int i4) {
        this.f189s = true;
        this.f191u = i4;
    }
}
