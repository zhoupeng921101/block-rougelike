package androidx.appcompat.view.menu;

import android.R;
import android.content.Context;
import android.content.res.Resources;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.AdapterView;
import android.widget.FrameLayout;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.TextView;
import androidx.appcompat.view.menu.i;
import androidx.appcompat.widget.b0;
import androidx.core.view.v;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class l extends g implements PopupWindow.OnDismissListener, AdapterView.OnItemClickListener, i, View.OnKeyListener {

    /* renamed from: v, reason: collision with root package name */
    private static final int f279v = c.f.f1928j;

    /* renamed from: b, reason: collision with root package name */
    private final Context f280b;

    /* renamed from: c, reason: collision with root package name */
    private final e f281c;

    /* renamed from: d, reason: collision with root package name */
    private final d f282d;

    /* renamed from: e, reason: collision with root package name */
    private final boolean f283e;

    /* renamed from: f, reason: collision with root package name */
    private final int f284f;

    /* renamed from: g, reason: collision with root package name */
    private final int f285g;

    /* renamed from: h, reason: collision with root package name */
    private final int f286h;

    /* renamed from: i, reason: collision with root package name */
    final b0 f287i;

    /* renamed from: l, reason: collision with root package name */
    private PopupWindow.OnDismissListener f290l;

    /* renamed from: m, reason: collision with root package name */
    private View f291m;

    /* renamed from: n, reason: collision with root package name */
    View f292n;

    /* renamed from: o, reason: collision with root package name */
    private i.a f293o;

    /* renamed from: p, reason: collision with root package name */
    ViewTreeObserver f294p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f295q;

    /* renamed from: r, reason: collision with root package name */
    private boolean f296r;

    /* renamed from: s, reason: collision with root package name */
    private int f297s;

    /* renamed from: u, reason: collision with root package name */
    private boolean f299u;

    /* renamed from: j, reason: collision with root package name */
    final ViewTreeObserver.OnGlobalLayoutListener f288j = new a();

    /* renamed from: k, reason: collision with root package name */
    private final View.OnAttachStateChangeListener f289k = new b();

    /* renamed from: t, reason: collision with root package name */
    private int f298t = 0;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements ViewTreeObserver.OnGlobalLayoutListener {
        a() {
        }

        @Override // android.view.ViewTreeObserver.OnGlobalLayoutListener
        public void onGlobalLayout() {
            if (!l.this.i() || l.this.f287i.n()) {
                return;
            }
            View view = l.this.f292n;
            if (view == null || !view.isShown()) {
                l.this.dismiss();
            } else {
                l.this.f287i.b();
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
            ViewTreeObserver viewTreeObserver = l.this.f294p;
            if (viewTreeObserver != null) {
                if (!viewTreeObserver.isAlive()) {
                    l.this.f294p = view.getViewTreeObserver();
                }
                l lVar = l.this;
                lVar.f294p.removeGlobalOnLayoutListener(lVar.f288j);
            }
            view.removeOnAttachStateChangeListener(this);
        }
    }

    public l(Context context, e eVar, View view, int i4, int i5, boolean z3) {
        this.f280b = context;
        this.f281c = eVar;
        this.f283e = z3;
        this.f282d = new d(eVar, LayoutInflater.from(context), z3, f279v);
        this.f285g = i4;
        this.f286h = i5;
        Resources resources = context.getResources();
        this.f284f = Math.max(resources.getDisplayMetrics().widthPixels / 2, resources.getDimensionPixelSize(c.c.f1855b));
        this.f291m = view;
        this.f287i = new b0(context, null, i4, i5);
        eVar.b(this, context);
    }

    private boolean z() {
        View view;
        if (i()) {
            return true;
        }
        if (this.f295q || (view = this.f291m) == null) {
            return false;
        }
        this.f292n = view;
        this.f287i.y(this);
        this.f287i.z(this);
        this.f287i.x(true);
        View view2 = this.f292n;
        boolean z3 = this.f294p == null;
        ViewTreeObserver viewTreeObserver = view2.getViewTreeObserver();
        this.f294p = viewTreeObserver;
        if (z3) {
            viewTreeObserver.addOnGlobalLayoutListener(this.f288j);
        }
        view2.addOnAttachStateChangeListener(this.f289k);
        this.f287i.q(view2);
        this.f287i.t(this.f298t);
        if (!this.f296r) {
            this.f297s = g.o(this.f282d, null, this.f280b, this.f284f);
            this.f296r = true;
        }
        this.f287i.s(this.f297s);
        this.f287i.w(2);
        this.f287i.u(n());
        this.f287i.b();
        ListView d4 = this.f287i.d();
        d4.setOnKeyListener(this);
        if (this.f299u && this.f281c.u() != null) {
            FrameLayout frameLayout = (FrameLayout) LayoutInflater.from(this.f280b).inflate(c.f.f1927i, (ViewGroup) d4, false);
            TextView textView = (TextView) frameLayout.findViewById(R.id.title);
            if (textView != null) {
                textView.setText(this.f281c.u());
            }
            frameLayout.setEnabled(false);
            d4.addHeaderView(frameLayout, null, false);
        }
        this.f287i.p(this.f282d);
        this.f287i.b();
        return true;
    }

    @Override // androidx.appcompat.view.menu.i
    public void a(e eVar, boolean z3) {
        if (eVar != this.f281c) {
            return;
        }
        dismiss();
        i.a aVar = this.f293o;
        if (aVar != null) {
            aVar.a(eVar, z3);
        }
    }

    @Override // androidx.appcompat.view.menu.k
    public void b() {
        if (!z()) {
            throw new IllegalStateException("StandardMenuPopup cannot be used without an anchor");
        }
    }

    @Override // androidx.appcompat.view.menu.k
    public ListView d() {
        return this.f287i.d();
    }

    @Override // androidx.appcompat.view.menu.k
    public void dismiss() {
        if (i()) {
            this.f287i.dismiss();
        }
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean e(m mVar) {
        if (mVar.hasVisibleItems()) {
            h hVar = new h(this.f280b, mVar, this.f292n, this.f283e, this.f285g, this.f286h);
            hVar.j(this.f293o);
            hVar.g(g.x(mVar));
            hVar.i(this.f290l);
            this.f290l = null;
            this.f281c.d(false);
            int j4 = this.f287i.j();
            int l3 = this.f287i.l();
            if ((Gravity.getAbsoluteGravity(this.f298t, v.o(this.f291m)) & 7) == 5) {
                j4 += this.f291m.getWidth();
            }
            if (hVar.n(j4, l3)) {
                i.a aVar = this.f293o;
                if (aVar == null) {
                    return true;
                }
                aVar.b(mVar);
                return true;
            }
        }
        return false;
    }

    @Override // androidx.appcompat.view.menu.i
    public void f(boolean z3) {
        this.f296r = false;
        d dVar = this.f282d;
        if (dVar != null) {
            dVar.notifyDataSetChanged();
        }
    }

    @Override // androidx.appcompat.view.menu.i
    public boolean g() {
        return false;
    }

    @Override // androidx.appcompat.view.menu.k
    public boolean i() {
        return !this.f295q && this.f287i.i();
    }

    @Override // androidx.appcompat.view.menu.i
    public void k(i.a aVar) {
        this.f293o = aVar;
    }

    @Override // androidx.appcompat.view.menu.g
    public void l(e eVar) {
    }

    @Override // android.widget.PopupWindow.OnDismissListener
    public void onDismiss() {
        this.f295q = true;
        this.f281c.close();
        ViewTreeObserver viewTreeObserver = this.f294p;
        if (viewTreeObserver != null) {
            if (!viewTreeObserver.isAlive()) {
                this.f294p = this.f292n.getViewTreeObserver();
            }
            this.f294p.removeGlobalOnLayoutListener(this.f288j);
            this.f294p = null;
        }
        this.f292n.removeOnAttachStateChangeListener(this.f289k);
        PopupWindow.OnDismissListener onDismissListener = this.f290l;
        if (onDismissListener != null) {
            onDismissListener.onDismiss();
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
        this.f291m = view;
    }

    @Override // androidx.appcompat.view.menu.g
    public void r(boolean z3) {
        this.f282d.d(z3);
    }

    @Override // androidx.appcompat.view.menu.g
    public void s(int i4) {
        this.f298t = i4;
    }

    @Override // androidx.appcompat.view.menu.g
    public void t(int i4) {
        this.f287i.v(i4);
    }

    @Override // androidx.appcompat.view.menu.g
    public void u(PopupWindow.OnDismissListener onDismissListener) {
        this.f290l = onDismissListener;
    }

    @Override // androidx.appcompat.view.menu.g
    public void v(boolean z3) {
        this.f299u = z3;
    }

    @Override // androidx.appcompat.view.menu.g
    public void w(int i4) {
        this.f287i.C(i4);
    }
}
