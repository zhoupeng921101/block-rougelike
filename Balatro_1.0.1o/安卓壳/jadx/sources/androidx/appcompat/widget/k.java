package androidx.appcompat.widget;

import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.RippleDrawable;
import android.util.AttributeSet;
import android.widget.ImageView;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class k {

    /* renamed from: a, reason: collision with root package name */
    private final ImageView f593a;

    /* renamed from: b, reason: collision with root package name */
    private j0 f594b;

    /* renamed from: c, reason: collision with root package name */
    private j0 f595c;

    /* renamed from: d, reason: collision with root package name */
    private j0 f596d;

    /* renamed from: e, reason: collision with root package name */
    private int f597e = 0;

    public k(ImageView imageView) {
        this.f593a = imageView;
    }

    private boolean a(Drawable drawable) {
        if (this.f596d == null) {
            this.f596d = new j0();
        }
        j0 j0Var = this.f596d;
        j0Var.a();
        ColorStateList a4 = androidx.core.widget.c.a(this.f593a);
        if (a4 != null) {
            j0Var.f592d = true;
            j0Var.f589a = a4;
        }
        PorterDuff.Mode b4 = androidx.core.widget.c.b(this.f593a);
        if (b4 != null) {
            j0Var.f591c = true;
            j0Var.f590b = b4;
        }
        if (!j0Var.f592d && !j0Var.f591c) {
            return false;
        }
        f.g(drawable, j0Var, this.f593a.getDrawableState());
        return true;
    }

    private boolean l() {
        return this.f594b != null;
    }

    void b() {
        if (this.f593a.getDrawable() != null) {
            this.f593a.getDrawable().setLevel(this.f597e);
        }
    }

    void c() {
        Drawable drawable = this.f593a.getDrawable();
        if (drawable != null) {
            u.b(drawable);
        }
        if (drawable != null) {
            if (l() && a(drawable)) {
                return;
            }
            j0 j0Var = this.f595c;
            if (j0Var != null) {
                f.g(drawable, j0Var, this.f593a.getDrawableState());
                return;
            }
            j0 j0Var2 = this.f594b;
            if (j0Var2 != null) {
                f.g(drawable, j0Var2, this.f593a.getDrawableState());
            }
        }
    }

    ColorStateList d() {
        j0 j0Var = this.f595c;
        if (j0Var != null) {
            return j0Var.f589a;
        }
        return null;
    }

    PorterDuff.Mode e() {
        j0 j0Var = this.f595c;
        if (j0Var != null) {
            return j0Var.f590b;
        }
        return null;
    }

    boolean f() {
        return !(this.f593a.getBackground() instanceof RippleDrawable);
    }

    public void g(AttributeSet attributeSet, int i4) {
        int l3;
        l0 s3 = l0.s(this.f593a.getContext(), attributeSet, c.i.F, i4, 0);
        ImageView imageView = this.f593a;
        androidx.core.view.v.F(imageView, imageView.getContext(), c.i.F, attributeSet, s3.o(), i4, 0);
        try {
            Drawable drawable = this.f593a.getDrawable();
            if (drawable == null && (l3 = s3.l(c.i.G, -1)) != -1 && (drawable = e.a.b(this.f593a.getContext(), l3)) != null) {
                this.f593a.setImageDrawable(drawable);
            }
            if (drawable != null) {
                u.b(drawable);
            }
            if (s3.p(c.i.H)) {
                androidx.core.widget.c.c(this.f593a, s3.c(c.i.H));
            }
            if (s3.p(c.i.I)) {
                androidx.core.widget.c.d(this.f593a, u.d(s3.i(c.i.I, -1), null));
            }
            s3.t();
        } catch (Throwable th) {
            s3.t();
            throw th;
        }
    }

    void h(Drawable drawable) {
        this.f597e = drawable.getLevel();
    }

    public void i(int i4) {
        if (i4 != 0) {
            Drawable b4 = e.a.b(this.f593a.getContext(), i4);
            if (b4 != null) {
                u.b(b4);
            }
            this.f593a.setImageDrawable(b4);
        } else {
            this.f593a.setImageDrawable(null);
        }
        c();
    }

    void j(ColorStateList colorStateList) {
        if (this.f595c == null) {
            this.f595c = new j0();
        }
        j0 j0Var = this.f595c;
        j0Var.f589a = colorStateList;
        j0Var.f592d = true;
        c();
    }

    void k(PorterDuff.Mode mode) {
        if (this.f595c == null) {
            this.f595c = new j0();
        }
        j0 j0Var = this.f595c;
        j0Var.f590b = mode;
        j0Var.f591c = true;
        c();
    }
}
