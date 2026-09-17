package androidx.appcompat.view.menu;

import a1.b2.c3;
import android.content.Context;
import android.graphics.Point;
import android.graphics.Rect;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;
import android.widget.PopupWindow;
import androidx.appcompat.view.menu.i;
import androidx.core.view.v;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class h {

    /* renamed from: a, reason: collision with root package name */
    private final Context f266a;

    /* renamed from: b, reason: collision with root package name */
    private final e f267b;

    /* renamed from: c, reason: collision with root package name */
    private final boolean f268c;

    /* renamed from: d, reason: collision with root package name */
    private final int f269d;

    /* renamed from: e, reason: collision with root package name */
    private final int f270e;

    /* renamed from: f, reason: collision with root package name */
    private View f271f;

    /* renamed from: g, reason: collision with root package name */
    private int f272g;

    /* renamed from: h, reason: collision with root package name */
    private boolean f273h;

    /* renamed from: i, reason: collision with root package name */
    private i.a f274i;

    /* renamed from: j, reason: collision with root package name */
    private g f275j;

    /* renamed from: k, reason: collision with root package name */
    private PopupWindow.OnDismissListener f276k;

    /* renamed from: l, reason: collision with root package name */
    private final PopupWindow.OnDismissListener f277l;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements PopupWindow.OnDismissListener {
        a() {
        }

        @Override // android.widget.PopupWindow.OnDismissListener
        public void onDismiss() {
            h.this.e();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static void a(Display display, Point point) {
            display.getRealSize(point);
        }
    }

    public h(Context context, e eVar, View view, boolean z3, int i4) {
        this(context, eVar, view, z3, i4, 0);
    }

    public h(Context context, e eVar, View view, boolean z3, int i4, int i5) {
        this.f272g = 8388611;
        this.f277l = new a();
        this.f266a = context;
        this.f267b = eVar;
        this.f271f = view;
        this.f268c = z3;
        this.f269d = i4;
        this.f270e = i5;
    }

    private g a() {
        Display defaultDisplay = ((WindowManager) this.f266a.getSystemService("window")).getDefaultDisplay();
        Point point = new Point();
        b.a(defaultDisplay, point);
        g cVar = Math.min(point.x, point.y) >= this.f266a.getResources().getDimensionPixelSize(c.c.f1854a) ? new c(this.f266a, this.f271f, this.f269d, this.f270e, this.f268c) : new l(this.f266a, this.f267b, this.f271f, this.f269d, this.f270e, this.f268c);
        cVar.l(this.f267b);
        cVar.u(this.f277l);
        cVar.p(this.f271f);
        cVar.k(this.f274i);
        cVar.r(this.f273h);
        cVar.s(this.f272g);
        return cVar;
    }

    private void l(int i4, int i5, boolean z3, boolean z4) {
        g c4 = c();
        c4.v(z4);
        if (z3) {
            if ((androidx.core.view.e.a(this.f272g, v.o(this.f271f)) & 7) == 5) {
                i4 -= this.f271f.getWidth();
            }
            c4.t(i4);
            c4.w(i5);
            int i6 = (int) ((this.f266a.getResources().getDisplayMetrics().density * 48.0f) / 2.0f);
            c4.q(new Rect(i4 - i6, i5 - i6, i4 + i6, i5 + i6));
        }
        c4.b();
    }

    public void b() {
        if (d()) {
            this.f275j.dismiss();
        }
    }

    public g c() {
        if (this.f275j == null) {
            this.f275j = a();
        }
        return this.f275j;
    }

    public boolean d() {
        g gVar = this.f275j;
        return gVar != null && gVar.i();
    }

    protected void e() {
        this.f275j = null;
        PopupWindow.OnDismissListener onDismissListener = this.f276k;
        if (onDismissListener != null) {
            onDismissListener.onDismiss();
        }
    }

    public void f(View view) {
        this.f271f = view;
    }

    public void g(boolean z3) {
        this.f273h = z3;
        g gVar = this.f275j;
        if (gVar != null) {
            gVar.r(z3);
        }
    }

    public void h(int i4) {
        this.f272g = i4;
    }

    public void i(PopupWindow.OnDismissListener onDismissListener) {
        this.f276k = onDismissListener;
    }

    public void j(i.a aVar) {
        this.f274i = aVar;
        g gVar = this.f275j;
        if (gVar != null) {
            gVar.k(aVar);
        }
    }

    public void k() {
        if (!m()) {
            throw new IllegalStateException(c3.d4(45));
        }
    }

    public boolean m() {
        if (d()) {
            return true;
        }
        if (this.f271f == null) {
            return false;
        }
        l(0, 0, false, false);
        return true;
    }

    public boolean n(int i4, int i5) {
        if (d()) {
            return true;
        }
        if (this.f271f == null) {
            return false;
        }
        l(i4, i5, true, true);
        return true;
    }
}
