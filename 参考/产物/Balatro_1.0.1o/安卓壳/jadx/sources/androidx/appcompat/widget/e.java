package androidx.appcompat.widget;

import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class e {

    /* renamed from: a, reason: collision with root package name */
    private final View f526a;

    /* renamed from: d, reason: collision with root package name */
    private j0 f529d;

    /* renamed from: e, reason: collision with root package name */
    private j0 f530e;

    /* renamed from: f, reason: collision with root package name */
    private j0 f531f;

    /* renamed from: c, reason: collision with root package name */
    private int f528c = -1;

    /* renamed from: b, reason: collision with root package name */
    private final f f527b = f.b();

    e(View view) {
        this.f526a = view;
    }

    private boolean a(Drawable drawable) {
        if (this.f531f == null) {
            this.f531f = new j0();
        }
        j0 j0Var = this.f531f;
        j0Var.a();
        ColorStateList l3 = androidx.core.view.v.l(this.f526a);
        if (l3 != null) {
            j0Var.f592d = true;
            j0Var.f589a = l3;
        }
        PorterDuff.Mode m3 = androidx.core.view.v.m(this.f526a);
        if (m3 != null) {
            j0Var.f591c = true;
            j0Var.f590b = m3;
        }
        if (!j0Var.f592d && !j0Var.f591c) {
            return false;
        }
        f.g(drawable, j0Var, this.f526a.getDrawableState());
        return true;
    }

    private boolean k() {
        return this.f529d != null;
    }

    void b() {
        Drawable background = this.f526a.getBackground();
        if (background != null) {
            if (k() && a(background)) {
                return;
            }
            j0 j0Var = this.f530e;
            if (j0Var != null) {
                f.g(background, j0Var, this.f526a.getDrawableState());
                return;
            }
            j0 j0Var2 = this.f529d;
            if (j0Var2 != null) {
                f.g(background, j0Var2, this.f526a.getDrawableState());
            }
        }
    }

    ColorStateList c() {
        j0 j0Var = this.f530e;
        if (j0Var != null) {
            return j0Var.f589a;
        }
        return null;
    }

    PorterDuff.Mode d() {
        j0 j0Var = this.f530e;
        if (j0Var != null) {
            return j0Var.f590b;
        }
        return null;
    }

    void e(AttributeSet attributeSet, int i4) {
        l0 s3 = l0.s(this.f526a.getContext(), attributeSet, c.i.F2, i4, 0);
        View view = this.f526a;
        androidx.core.view.v.F(view, view.getContext(), c.i.F2, attributeSet, s3.o(), i4, 0);
        try {
            if (s3.p(c.i.G2)) {
                this.f528c = s3.l(c.i.G2, -1);
                ColorStateList e4 = this.f527b.e(this.f526a.getContext(), this.f528c);
                if (e4 != null) {
                    h(e4);
                }
            }
            if (s3.p(c.i.H2)) {
                androidx.core.view.v.K(this.f526a, s3.c(c.i.H2));
            }
            if (s3.p(c.i.I2)) {
                androidx.core.view.v.L(this.f526a, u.d(s3.i(c.i.I2, -1), null));
            }
            s3.t();
        } catch (Throwable th) {
            s3.t();
            throw th;
        }
    }

    void f(Drawable drawable) {
        this.f528c = -1;
        h(null);
        b();
    }

    void g(int i4) {
        this.f528c = i4;
        f fVar = this.f527b;
        h(fVar != null ? fVar.e(this.f526a.getContext(), i4) : null);
        b();
    }

    void h(ColorStateList colorStateList) {
        if (colorStateList != null) {
            if (this.f529d == null) {
                this.f529d = new j0();
            }
            j0 j0Var = this.f529d;
            j0Var.f589a = colorStateList;
            j0Var.f592d = true;
        } else {
            this.f529d = null;
        }
        b();
    }

    void i(ColorStateList colorStateList) {
        if (this.f530e == null) {
            this.f530e = new j0();
        }
        j0 j0Var = this.f530e;
        j0Var.f589a = colorStateList;
        j0Var.f592d = true;
        b();
    }

    void j(PorterDuff.Mode mode) {
        if (this.f530e == null) {
            this.f530e = new j0();
        }
        j0 j0Var = this.f530e;
        j0Var.f590b = mode;
        j0Var.f591c = true;
        b();
    }
}
