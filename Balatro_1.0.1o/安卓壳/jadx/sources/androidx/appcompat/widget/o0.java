package androidx.appcompat.widget;

import android.R;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class o0 implements t {

    /* renamed from: a, reason: collision with root package name */
    Toolbar f632a;

    /* renamed from: b, reason: collision with root package name */
    private int f633b;

    /* renamed from: c, reason: collision with root package name */
    private View f634c;

    /* renamed from: d, reason: collision with root package name */
    private Drawable f635d;

    /* renamed from: e, reason: collision with root package name */
    private Drawable f636e;

    /* renamed from: f, reason: collision with root package name */
    private Drawable f637f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f638g;

    /* renamed from: h, reason: collision with root package name */
    CharSequence f639h;

    /* renamed from: i, reason: collision with root package name */
    private CharSequence f640i;

    /* renamed from: j, reason: collision with root package name */
    private CharSequence f641j;

    /* renamed from: k, reason: collision with root package name */
    Window.Callback f642k;

    /* renamed from: l, reason: collision with root package name */
    boolean f643l;

    /* renamed from: m, reason: collision with root package name */
    private int f644m;

    /* renamed from: n, reason: collision with root package name */
    private int f645n;

    /* renamed from: o, reason: collision with root package name */
    private Drawable f646o;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements View.OnClickListener {

        /* renamed from: a, reason: collision with root package name */
        final androidx.appcompat.view.menu.a f647a;

        a() {
            this.f647a = new androidx.appcompat.view.menu.a(o0.this.f632a.getContext(), 0, R.id.home, 0, 0, o0.this.f639h);
        }

        @Override // android.view.View.OnClickListener
        public void onClick(View view) {
            o0 o0Var = o0.this;
            Window.Callback callback = o0Var.f642k;
            if (callback == null || !o0Var.f643l) {
                return;
            }
            callback.onMenuItemSelected(0, this.f647a);
        }
    }

    public o0(Toolbar toolbar, boolean z3) {
        this(toolbar, z3, c.g.f1932a, c.d.f1880n);
    }

    public o0(Toolbar toolbar, boolean z3, int i4, int i5) {
        Drawable drawable;
        this.f644m = 0;
        this.f645n = 0;
        this.f632a = toolbar;
        this.f639h = toolbar.getTitle();
        this.f640i = toolbar.getSubtitle();
        this.f638g = this.f639h != null;
        this.f637f = toolbar.getNavigationIcon();
        l0 s3 = l0.s(toolbar.getContext(), null, c.i.f1945a, c.a.f1831c, 0);
        this.f646o = s3.f(c.i.f1981j);
        if (z3) {
            CharSequence n3 = s3.n(c.i.f2005p);
            if (!TextUtils.isEmpty(n3)) {
                n(n3);
            }
            CharSequence n4 = s3.n(c.i.f1997n);
            if (!TextUtils.isEmpty(n4)) {
                m(n4);
            }
            Drawable f4 = s3.f(c.i.f1989l);
            if (f4 != null) {
                i(f4);
            }
            Drawable f5 = s3.f(c.i.f1985k);
            if (f5 != null) {
                setIcon(f5);
            }
            if (this.f637f == null && (drawable = this.f646o) != null) {
                l(drawable);
            }
            h(s3.i(c.i.f1973h, 0));
            int l3 = s3.l(c.i.f1969g, 0);
            if (l3 != 0) {
                f(LayoutInflater.from(this.f632a.getContext()).inflate(l3, (ViewGroup) this.f632a, false));
                h(this.f633b | 16);
            }
            int k4 = s3.k(c.i.f1977i, 0);
            if (k4 > 0) {
                ViewGroup.LayoutParams layoutParams = this.f632a.getLayoutParams();
                layoutParams.height = k4;
                this.f632a.setLayoutParams(layoutParams);
            }
            int d4 = s3.d(c.i.f1965f, -1);
            int d5 = s3.d(c.i.f1961e, -1);
            if (d4 >= 0 || d5 >= 0) {
                this.f632a.H(Math.max(d4, 0), Math.max(d5, 0));
            }
            int l4 = s3.l(c.i.f2009q, 0);
            if (l4 != 0) {
                Toolbar toolbar2 = this.f632a;
                toolbar2.J(toolbar2.getContext(), l4);
            }
            int l5 = s3.l(c.i.f2001o, 0);
            if (l5 != 0) {
                Toolbar toolbar3 = this.f632a;
                toolbar3.I(toolbar3.getContext(), l5);
            }
            int l6 = s3.l(c.i.f1993m, 0);
            if (l6 != 0) {
                this.f632a.setPopupTheme(l6);
            }
        } else {
            this.f633b = d();
        }
        s3.t();
        g(i4);
        this.f641j = this.f632a.getNavigationContentDescription();
        this.f632a.setNavigationOnClickListener(new a());
    }

    private int d() {
        if (this.f632a.getNavigationIcon() == null) {
            return 11;
        }
        this.f646o = this.f632a.getNavigationIcon();
        return 15;
    }

    private void o(CharSequence charSequence) {
        this.f639h = charSequence;
        if ((this.f633b & 8) != 0) {
            this.f632a.setTitle(charSequence);
            if (this.f638g) {
                androidx.core.view.v.I(this.f632a.getRootView(), charSequence);
            }
        }
    }

    private void p() {
        if ((this.f633b & 4) != 0) {
            if (TextUtils.isEmpty(this.f641j)) {
                this.f632a.setNavigationContentDescription(this.f645n);
            } else {
                this.f632a.setNavigationContentDescription(this.f641j);
            }
        }
    }

    private void q() {
        if ((this.f633b & 4) == 0) {
            this.f632a.setNavigationIcon((Drawable) null);
            return;
        }
        Toolbar toolbar = this.f632a;
        Drawable drawable = this.f637f;
        if (drawable == null) {
            drawable = this.f646o;
        }
        toolbar.setNavigationIcon(drawable);
    }

    private void r() {
        Drawable drawable;
        int i4 = this.f633b;
        if ((i4 & 2) == 0) {
            drawable = null;
        } else if ((i4 & 1) != 0) {
            drawable = this.f636e;
            if (drawable == null) {
                drawable = this.f635d;
            }
        } else {
            drawable = this.f635d;
        }
        this.f632a.setLogo(drawable);
    }

    @Override // androidx.appcompat.widget.t
    public void a(CharSequence charSequence) {
        if (this.f638g) {
            return;
        }
        o(charSequence);
    }

    @Override // androidx.appcompat.widget.t
    public void b(Window.Callback callback) {
        this.f642k = callback;
    }

    @Override // androidx.appcompat.widget.t
    public void c(int i4) {
        i(i4 != 0 ? e.a.b(e(), i4) : null);
    }

    public Context e() {
        return this.f632a.getContext();
    }

    public void f(View view) {
        View view2 = this.f634c;
        if (view2 != null && (this.f633b & 16) != 0) {
            this.f632a.removeView(view2);
        }
        this.f634c = view;
        if (view == null || (this.f633b & 16) == 0) {
            return;
        }
        this.f632a.addView(view);
    }

    public void g(int i4) {
        if (i4 == this.f645n) {
            return;
        }
        this.f645n = i4;
        if (TextUtils.isEmpty(this.f632a.getNavigationContentDescription())) {
            j(this.f645n);
        }
    }

    @Override // androidx.appcompat.widget.t
    public CharSequence getTitle() {
        return this.f632a.getTitle();
    }

    public void h(int i4) {
        View view;
        int i5 = this.f633b ^ i4;
        this.f633b = i4;
        if (i5 != 0) {
            if ((i5 & 4) != 0) {
                if ((i4 & 4) != 0) {
                    p();
                }
                q();
            }
            if ((i5 & 3) != 0) {
                r();
            }
            if ((i5 & 8) != 0) {
                if ((i4 & 8) != 0) {
                    this.f632a.setTitle(this.f639h);
                    this.f632a.setSubtitle(this.f640i);
                } else {
                    this.f632a.setTitle((CharSequence) null);
                    this.f632a.setSubtitle((CharSequence) null);
                }
            }
            if ((i5 & 16) == 0 || (view = this.f634c) == null) {
                return;
            }
            if ((i4 & 16) != 0) {
                this.f632a.addView(view);
            } else {
                this.f632a.removeView(view);
            }
        }
    }

    public void i(Drawable drawable) {
        this.f636e = drawable;
        r();
    }

    public void j(int i4) {
        k(i4 == 0 ? null : e().getString(i4));
    }

    public void k(CharSequence charSequence) {
        this.f641j = charSequence;
        p();
    }

    public void l(Drawable drawable) {
        this.f637f = drawable;
        q();
    }

    public void m(CharSequence charSequence) {
        this.f640i = charSequence;
        if ((this.f633b & 8) != 0) {
            this.f632a.setSubtitle(charSequence);
        }
    }

    public void n(CharSequence charSequence) {
        this.f638g = true;
        o(charSequence);
    }

    @Override // androidx.appcompat.widget.t
    public void setIcon(int i4) {
        setIcon(i4 != 0 ? e.a.b(e(), i4) : null);
    }

    @Override // androidx.appcompat.widget.t
    public void setIcon(Drawable drawable) {
        this.f635d = drawable;
        r();
    }
}
