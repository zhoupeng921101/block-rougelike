package androidx.appcompat.widget;

import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.LocaleList;
import android.text.method.PasswordTransformationMethod;
import android.util.AttributeSet;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.widget.TextView;
import androidx.core.content.res.f;
import java.lang.ref.WeakReference;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class o {

    /* renamed from: a, reason: collision with root package name */
    private final TextView f611a;

    /* renamed from: b, reason: collision with root package name */
    private j0 f612b;

    /* renamed from: c, reason: collision with root package name */
    private j0 f613c;

    /* renamed from: d, reason: collision with root package name */
    private j0 f614d;

    /* renamed from: e, reason: collision with root package name */
    private j0 f615e;

    /* renamed from: f, reason: collision with root package name */
    private j0 f616f;

    /* renamed from: g, reason: collision with root package name */
    private j0 f617g;

    /* renamed from: h, reason: collision with root package name */
    private j0 f618h;

    /* renamed from: i, reason: collision with root package name */
    private final q f619i;

    /* renamed from: j, reason: collision with root package name */
    private int f620j = 0;

    /* renamed from: k, reason: collision with root package name */
    private int f621k = -1;

    /* renamed from: l, reason: collision with root package name */
    private Typeface f622l;

    /* renamed from: m, reason: collision with root package name */
    private boolean f623m;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends f.e {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ int f624a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ int f625b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ WeakReference f626c;

        a(int i4, int i5, WeakReference weakReference) {
            this.f624a = i4;
            this.f625b = i5;
            this.f626c = weakReference;
        }

        @Override // androidx.core.content.res.f.e
        public void f(int i4) {
        }

        @Override // androidx.core.content.res.f.e
        public void g(Typeface typeface) {
            int i4;
            if (Build.VERSION.SDK_INT >= 28 && (i4 = this.f624a) != -1) {
                typeface = f.a(typeface, i4, (this.f625b & 2) != 0);
            }
            o.this.n(this.f626c, typeface);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ TextView f628e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ Typeface f629f;

        /* renamed from: g, reason: collision with root package name */
        final /* synthetic */ int f630g;

        b(TextView textView, Typeface typeface, int i4) {
            this.f628e = textView;
            this.f629f = typeface;
            this.f630g = i4;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f628e.setTypeface(this.f629f, this.f630g);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c {
        static Drawable[] a(TextView textView) {
            return textView.getCompoundDrawablesRelative();
        }

        static void b(TextView textView, Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4) {
            textView.setCompoundDrawablesRelativeWithIntrinsicBounds(drawable, drawable2, drawable3, drawable4);
        }

        static void c(TextView textView, Locale locale) {
            textView.setTextLocale(locale);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class d {
        static LocaleList a(String str) {
            return LocaleList.forLanguageTags(str);
        }

        static void b(TextView textView, LocaleList localeList) {
            textView.setTextLocales(localeList);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class e {
        static int a(TextView textView) {
            return textView.getAutoSizeStepGranularity();
        }

        static void b(TextView textView, int i4, int i5, int i6, int i7) {
            textView.setAutoSizeTextTypeUniformWithConfiguration(i4, i5, i6, i7);
        }

        static void c(TextView textView, int[] iArr, int i4) {
            textView.setAutoSizeTextTypeUniformWithPresetSizes(iArr, i4);
        }

        static boolean d(TextView textView, String str) {
            return textView.setFontVariationSettings(str);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class f {
        static Typeface a(Typeface typeface, int i4, boolean z3) {
            return Typeface.create(typeface, i4, z3);
        }
    }

    o(TextView textView) {
        this.f611a = textView;
        this.f619i = new q(textView);
    }

    private void B(int i4, float f4) {
        this.f619i.t(i4, f4);
    }

    private void C(Context context, l0 l0Var) {
        String m3;
        this.f620j = l0Var.i(c.i.T1, this.f620j);
        int i4 = Build.VERSION.SDK_INT;
        if (i4 >= 28) {
            int i5 = l0Var.i(c.i.V1, -1);
            this.f621k = i5;
            if (i5 != -1) {
                this.f620j &= 2;
            }
        }
        if (!l0Var.p(c.i.U1) && !l0Var.p(c.i.W1)) {
            if (l0Var.p(c.i.S1)) {
                this.f623m = false;
                int i6 = l0Var.i(c.i.S1, 1);
                if (i6 == 1) {
                    this.f622l = Typeface.SANS_SERIF;
                    return;
                } else if (i6 == 2) {
                    this.f622l = Typeface.SERIF;
                    return;
                } else {
                    if (i6 != 3) {
                        return;
                    }
                    this.f622l = Typeface.MONOSPACE;
                    return;
                }
            }
            return;
        }
        this.f622l = null;
        int i7 = l0Var.p(c.i.W1) ? c.i.W1 : c.i.U1;
        int i8 = this.f621k;
        int i9 = this.f620j;
        if (!context.isRestricted()) {
            try {
                Typeface h4 = l0Var.h(i7, this.f620j, new a(i8, i9, new WeakReference(this.f611a)));
                if (h4 != null) {
                    if (i4 < 28 || this.f621k == -1) {
                        this.f622l = h4;
                    } else {
                        this.f622l = f.a(Typeface.create(h4, 0), this.f621k, (this.f620j & 2) != 0);
                    }
                }
                this.f623m = this.f622l == null;
            } catch (Resources.NotFoundException | UnsupportedOperationException unused) {
            }
        }
        if (this.f622l != null || (m3 = l0Var.m(i7)) == null) {
            return;
        }
        if (Build.VERSION.SDK_INT < 28 || this.f621k == -1) {
            this.f622l = Typeface.create(m3, this.f620j);
        } else {
            this.f622l = f.a(Typeface.create(m3, 0), this.f621k, (this.f620j & 2) != 0);
        }
    }

    private void a(Drawable drawable, j0 j0Var) {
        if (drawable == null || j0Var == null) {
            return;
        }
        androidx.appcompat.widget.f.g(drawable, j0Var, this.f611a.getDrawableState());
    }

    private static j0 d(Context context, androidx.appcompat.widget.f fVar, int i4) {
        ColorStateList e4 = fVar.e(context, i4);
        if (e4 == null) {
            return null;
        }
        j0 j0Var = new j0();
        j0Var.f592d = true;
        j0Var.f589a = e4;
        return j0Var;
    }

    private void y(Drawable drawable, Drawable drawable2, Drawable drawable3, Drawable drawable4, Drawable drawable5, Drawable drawable6) {
        if (drawable5 != null || drawable6 != null) {
            Drawable[] a4 = c.a(this.f611a);
            TextView textView = this.f611a;
            if (drawable5 == null) {
                drawable5 = a4[0];
            }
            if (drawable2 == null) {
                drawable2 = a4[1];
            }
            if (drawable6 == null) {
                drawable6 = a4[2];
            }
            if (drawable4 == null) {
                drawable4 = a4[3];
            }
            c.b(textView, drawable5, drawable2, drawable6, drawable4);
            return;
        }
        if (drawable == null && drawable2 == null && drawable3 == null && drawable4 == null) {
            return;
        }
        Drawable[] a5 = c.a(this.f611a);
        Drawable drawable7 = a5[0];
        if (drawable7 != null || a5[2] != null) {
            TextView textView2 = this.f611a;
            if (drawable2 == null) {
                drawable2 = a5[1];
            }
            Drawable drawable8 = a5[2];
            if (drawable4 == null) {
                drawable4 = a5[3];
            }
            c.b(textView2, drawable7, drawable2, drawable8, drawable4);
            return;
        }
        Drawable[] compoundDrawables = this.f611a.getCompoundDrawables();
        TextView textView3 = this.f611a;
        if (drawable == null) {
            drawable = compoundDrawables[0];
        }
        if (drawable2 == null) {
            drawable2 = compoundDrawables[1];
        }
        if (drawable3 == null) {
            drawable3 = compoundDrawables[2];
        }
        if (drawable4 == null) {
            drawable4 = compoundDrawables[3];
        }
        textView3.setCompoundDrawablesWithIntrinsicBounds(drawable, drawable2, drawable3, drawable4);
    }

    private void z() {
        j0 j0Var = this.f618h;
        this.f612b = j0Var;
        this.f613c = j0Var;
        this.f614d = j0Var;
        this.f615e = j0Var;
        this.f616f = j0Var;
        this.f617g = j0Var;
    }

    void A(int i4, float f4) {
        if (v0.f718b || l()) {
            return;
        }
        B(i4, f4);
    }

    void b() {
        if (this.f612b != null || this.f613c != null || this.f614d != null || this.f615e != null) {
            Drawable[] compoundDrawables = this.f611a.getCompoundDrawables();
            a(compoundDrawables[0], this.f612b);
            a(compoundDrawables[1], this.f613c);
            a(compoundDrawables[2], this.f614d);
            a(compoundDrawables[3], this.f615e);
        }
        if (this.f616f == null && this.f617g == null) {
            return;
        }
        Drawable[] a4 = c.a(this.f611a);
        a(a4[0], this.f616f);
        a(a4[2], this.f617g);
    }

    void c() {
        this.f619i.a();
    }

    int e() {
        return this.f619i.f();
    }

    int f() {
        return this.f619i.g();
    }

    int g() {
        return this.f619i.h();
    }

    int[] h() {
        return this.f619i.i();
    }

    int i() {
        return this.f619i.j();
    }

    ColorStateList j() {
        j0 j0Var = this.f618h;
        if (j0Var != null) {
            return j0Var.f589a;
        }
        return null;
    }

    PorterDuff.Mode k() {
        j0 j0Var = this.f618h;
        if (j0Var != null) {
            return j0Var.f590b;
        }
        return null;
    }

    boolean l() {
        return this.f619i.n();
    }

    void m(AttributeSet attributeSet, int i4) {
        boolean z3;
        boolean z4;
        String str;
        String str2;
        Context context = this.f611a.getContext();
        androidx.appcompat.widget.f b4 = androidx.appcompat.widget.f.b();
        l0 s3 = l0.s(context, attributeSet, c.i.K, i4, 0);
        TextView textView = this.f611a;
        androidx.core.view.v.F(textView, textView.getContext(), c.i.K, attributeSet, s3.o(), i4, 0);
        int l3 = s3.l(c.i.L, -1);
        if (s3.p(c.i.O)) {
            this.f612b = d(context, b4, s3.l(c.i.O, 0));
        }
        if (s3.p(c.i.M)) {
            this.f613c = d(context, b4, s3.l(c.i.M, 0));
        }
        if (s3.p(c.i.P)) {
            this.f614d = d(context, b4, s3.l(c.i.P, 0));
        }
        if (s3.p(c.i.N)) {
            this.f615e = d(context, b4, s3.l(c.i.N, 0));
        }
        int i5 = Build.VERSION.SDK_INT;
        if (s3.p(c.i.Q)) {
            this.f616f = d(context, b4, s3.l(c.i.Q, 0));
        }
        if (s3.p(c.i.R)) {
            this.f617g = d(context, b4, s3.l(c.i.R, 0));
        }
        s3.t();
        boolean z5 = this.f611a.getTransformationMethod() instanceof PasswordTransformationMethod;
        if (l3 != -1) {
            l0 q3 = l0.q(context, l3, c.i.Q1);
            if (z5 || !q3.p(c.i.Y1)) {
                z3 = false;
                z4 = false;
            } else {
                z3 = q3.a(c.i.Y1, false);
                z4 = true;
            }
            C(context, q3);
            str2 = q3.p(c.i.Z1) ? q3.m(c.i.Z1) : null;
            str = (i5 < 26 || !q3.p(c.i.X1)) ? null : q3.m(c.i.X1);
            q3.t();
        } else {
            z3 = false;
            z4 = false;
            str = null;
            str2 = null;
        }
        l0 s4 = l0.s(context, attributeSet, c.i.Q1, i4, 0);
        if (!z5 && s4.p(c.i.Y1)) {
            z3 = s4.a(c.i.Y1, false);
            z4 = true;
        }
        if (s4.p(c.i.Z1)) {
            str2 = s4.m(c.i.Z1);
        }
        if (i5 >= 26 && s4.p(c.i.X1)) {
            str = s4.m(c.i.X1);
        }
        if (i5 >= 28 && s4.p(c.i.R1) && s4.e(c.i.R1, -1) == 0) {
            this.f611a.setTextSize(0, 0.0f);
        }
        C(context, s4);
        s4.t();
        if (!z5 && z4) {
            s(z3);
        }
        Typeface typeface = this.f622l;
        if (typeface != null) {
            if (this.f621k == -1) {
                this.f611a.setTypeface(typeface, this.f620j);
            } else {
                this.f611a.setTypeface(typeface);
            }
        }
        if (str != null) {
            e.d(this.f611a, str);
        }
        if (str2 != null) {
            d.b(this.f611a, d.a(str2));
        }
        this.f619i.o(attributeSet, i4);
        if (v0.f718b && this.f619i.j() != 0) {
            int[] i6 = this.f619i.i();
            if (i6.length > 0) {
                if (e.a(this.f611a) != -1.0f) {
                    e.b(this.f611a, this.f619i.g(), this.f619i.f(), this.f619i.h(), 0);
                } else {
                    e.c(this.f611a, i6, 0);
                }
            }
        }
        l0 r3 = l0.r(context, attributeSet, c.i.S);
        int l4 = r3.l(c.i.f1946a0, -1);
        Drawable c4 = l4 != -1 ? b4.c(context, l4) : null;
        int l5 = r3.l(c.i.f1966f0, -1);
        Drawable c5 = l5 != -1 ? b4.c(context, l5) : null;
        int l6 = r3.l(c.i.f1950b0, -1);
        Drawable c6 = l6 != -1 ? b4.c(context, l6) : null;
        int l7 = r3.l(c.i.Y, -1);
        Drawable c7 = l7 != -1 ? b4.c(context, l7) : null;
        int l8 = r3.l(c.i.f1954c0, -1);
        Drawable c8 = l8 != -1 ? b4.c(context, l8) : null;
        int l9 = r3.l(c.i.Z, -1);
        y(c4, c5, c6, c7, c8, l9 != -1 ? b4.c(context, l9) : null);
        if (r3.p(c.i.f1958d0)) {
            androidx.core.widget.g.f(this.f611a, r3.c(c.i.f1958d0));
        }
        if (r3.p(c.i.f1962e0)) {
            androidx.core.widget.g.g(this.f611a, u.d(r3.i(c.i.f1962e0, -1), null));
        }
        int e4 = r3.e(c.i.f1974h0, -1);
        int e5 = r3.e(c.i.f1978i0, -1);
        int e6 = r3.e(c.i.f1982j0, -1);
        r3.t();
        if (e4 != -1) {
            androidx.core.widget.g.h(this.f611a, e4);
        }
        if (e5 != -1) {
            androidx.core.widget.g.i(this.f611a, e5);
        }
        if (e6 != -1) {
            androidx.core.widget.g.j(this.f611a, e6);
        }
    }

    void n(WeakReference weakReference, Typeface typeface) {
        if (this.f623m) {
            this.f622l = typeface;
            TextView textView = (TextView) weakReference.get();
            if (textView != null) {
                if (androidx.core.view.v.v(textView)) {
                    textView.post(new b(textView, typeface, this.f620j));
                } else {
                    textView.setTypeface(typeface, this.f620j);
                }
            }
        }
    }

    void o(boolean z3, int i4, int i5, int i6, int i7) {
        if (v0.f718b) {
            return;
        }
        c();
    }

    void p() {
        b();
    }

    void q(Context context, int i4) {
        String m3;
        l0 q3 = l0.q(context, i4, c.i.Q1);
        if (q3.p(c.i.Y1)) {
            s(q3.a(c.i.Y1, false));
        }
        int i5 = Build.VERSION.SDK_INT;
        if (q3.p(c.i.R1) && q3.e(c.i.R1, -1) == 0) {
            this.f611a.setTextSize(0, 0.0f);
        }
        C(context, q3);
        if (i5 >= 26 && q3.p(c.i.X1) && (m3 = q3.m(c.i.X1)) != null) {
            e.d(this.f611a, m3);
        }
        q3.t();
        Typeface typeface = this.f622l;
        if (typeface != null) {
            this.f611a.setTypeface(typeface, this.f620j);
        }
    }

    void r(TextView textView, InputConnection inputConnection, EditorInfo editorInfo) {
        if (Build.VERSION.SDK_INT >= 30 || inputConnection == null) {
            return;
        }
        p.a.d(editorInfo, textView.getText());
    }

    void s(boolean z3) {
        this.f611a.setAllCaps(z3);
    }

    void t(int i4, int i5, int i6, int i7) {
        this.f619i.p(i4, i5, i6, i7);
    }

    void u(int[] iArr, int i4) {
        this.f619i.q(iArr, i4);
    }

    void v(int i4) {
        this.f619i.r(i4);
    }

    void w(ColorStateList colorStateList) {
        if (this.f618h == null) {
            this.f618h = new j0();
        }
        j0 j0Var = this.f618h;
        j0Var.f589a = colorStateList;
        j0Var.f592d = colorStateList != null;
        z();
    }

    void x(PorterDuff.Mode mode) {
        if (this.f618h == null) {
            this.f618h = new j0();
        }
        j0 j0Var = this.f618h;
        j0Var.f590b = mode;
        j0Var.f591c = mode != null;
        z();
    }
}
