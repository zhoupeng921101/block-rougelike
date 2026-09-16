package androidx.appcompat.widget;

import android.R;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.graphics.Shader;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import androidx.appcompat.widget.c0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f {

    /* renamed from: b, reason: collision with root package name */
    private static final PorterDuff.Mode f540b = PorterDuff.Mode.SRC_IN;

    /* renamed from: c, reason: collision with root package name */
    private static f f541c;

    /* renamed from: a, reason: collision with root package name */
    private c0 f542a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements c0.c {

        /* renamed from: a, reason: collision with root package name */
        private final int[] f543a = {c.d.R, c.d.P, c.d.f1867a};

        /* renamed from: b, reason: collision with root package name */
        private final int[] f544b = {c.d.f1881o, c.d.B, c.d.f1886t, c.d.f1882p, c.d.f1883q, c.d.f1885s, c.d.f1884r};

        /* renamed from: c, reason: collision with root package name */
        private final int[] f545c = {c.d.O, c.d.Q, c.d.f1877k, c.d.K, c.d.L, c.d.M, c.d.N};

        /* renamed from: d, reason: collision with root package name */
        private final int[] f546d = {c.d.f1889w, c.d.f1875i, c.d.f1888v};

        /* renamed from: e, reason: collision with root package name */
        private final int[] f547e = {c.d.J, c.d.S};

        /* renamed from: f, reason: collision with root package name */
        private final int[] f548f = {c.d.f1869c, c.d.f1873g, c.d.f1870d, c.d.f1874h};

        a() {
        }

        private boolean f(int[] iArr, int i4) {
            for (int i5 : iArr) {
                if (i5 == i4) {
                    return true;
                }
            }
            return false;
        }

        private ColorStateList g(Context context) {
            return h(context, 0);
        }

        private ColorStateList h(Context context, int i4) {
            int c4 = h0.c(context, c.a.f1839k);
            return new ColorStateList(new int[][]{h0.f573b, h0.f576e, h0.f574c, h0.f580i}, new int[]{h0.b(context, c.a.f1837i), androidx.core.graphics.a.c(c4, i4), androidx.core.graphics.a.c(c4, i4), i4});
        }

        private ColorStateList i(Context context) {
            return h(context, h0.c(context, c.a.f1836h));
        }

        private ColorStateList j(Context context) {
            return h(context, h0.c(context, c.a.f1837i));
        }

        private ColorStateList k(Context context) {
            int[][] iArr = new int[3][];
            int[] iArr2 = new int[3];
            ColorStateList e4 = h0.e(context, c.a.f1841m);
            if (e4 == null || !e4.isStateful()) {
                iArr[0] = h0.f573b;
                iArr2[0] = h0.b(context, c.a.f1841m);
                iArr[1] = h0.f577f;
                iArr2[1] = h0.c(context, c.a.f1838j);
                iArr[2] = h0.f580i;
                iArr2[2] = h0.c(context, c.a.f1841m);
            } else {
                int[] iArr3 = h0.f573b;
                iArr[0] = iArr3;
                iArr2[0] = e4.getColorForState(iArr3, 0);
                iArr[1] = h0.f577f;
                iArr2[1] = h0.c(context, c.a.f1838j);
                iArr[2] = h0.f580i;
                iArr2[2] = e4.getDefaultColor();
            }
            return new ColorStateList(iArr, iArr2);
        }

        private LayerDrawable l(c0 c0Var, Context context, int i4) {
            BitmapDrawable bitmapDrawable;
            BitmapDrawable bitmapDrawable2;
            BitmapDrawable bitmapDrawable3;
            int dimensionPixelSize = context.getResources().getDimensionPixelSize(i4);
            Drawable i5 = c0Var.i(context, c.d.F);
            Drawable i6 = c0Var.i(context, c.d.G);
            if ((i5 instanceof BitmapDrawable) && i5.getIntrinsicWidth() == dimensionPixelSize && i5.getIntrinsicHeight() == dimensionPixelSize) {
                bitmapDrawable = (BitmapDrawable) i5;
                bitmapDrawable2 = new BitmapDrawable(bitmapDrawable.getBitmap());
            } else {
                Bitmap createBitmap = Bitmap.createBitmap(dimensionPixelSize, dimensionPixelSize, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(createBitmap);
                i5.setBounds(0, 0, dimensionPixelSize, dimensionPixelSize);
                i5.draw(canvas);
                bitmapDrawable = new BitmapDrawable(createBitmap);
                bitmapDrawable2 = new BitmapDrawable(createBitmap);
            }
            bitmapDrawable2.setTileModeX(Shader.TileMode.REPEAT);
            if ((i6 instanceof BitmapDrawable) && i6.getIntrinsicWidth() == dimensionPixelSize && i6.getIntrinsicHeight() == dimensionPixelSize) {
                bitmapDrawable3 = (BitmapDrawable) i6;
            } else {
                Bitmap createBitmap2 = Bitmap.createBitmap(dimensionPixelSize, dimensionPixelSize, Bitmap.Config.ARGB_8888);
                Canvas canvas2 = new Canvas(createBitmap2);
                i6.setBounds(0, 0, dimensionPixelSize, dimensionPixelSize);
                i6.draw(canvas2);
                bitmapDrawable3 = new BitmapDrawable(createBitmap2);
            }
            LayerDrawable layerDrawable = new LayerDrawable(new Drawable[]{bitmapDrawable, bitmapDrawable3, bitmapDrawable2});
            layerDrawable.setId(0, R.id.background);
            layerDrawable.setId(1, R.id.secondaryProgress);
            layerDrawable.setId(2, R.id.progress);
            return layerDrawable;
        }

        private void m(Drawable drawable, int i4, PorterDuff.Mode mode) {
            if (u.a(drawable)) {
                drawable = drawable.mutate();
            }
            if (mode == null) {
                mode = f.f540b;
            }
            drawable.setColorFilter(f.d(i4, mode));
        }

        /* JADX WARN: Removed duplicated region for block: B:15:0x006b A[RETURN] */
        /* JADX WARN: Removed duplicated region for block: B:7:0x0050  */
        @Override // androidx.appcompat.widget.c0.c
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        public boolean a(android.content.Context r7, int r8, android.graphics.drawable.Drawable r9) {
            /*
                r6 = this;
                android.graphics.PorterDuff$Mode r0 = androidx.appcompat.widget.f.a()
                int[] r1 = r6.f543a
                boolean r1 = r6.f(r1, r8)
                r2 = 1
                r3 = 0
                r4 = -1
                if (r1 == 0) goto L15
                int r8 = c.a.f1840l
            L11:
                r1 = r0
                r5 = r2
            L13:
                r0 = r4
                goto L4e
            L15:
                int[] r1 = r6.f545c
                boolean r1 = r6.f(r1, r8)
                if (r1 == 0) goto L20
                int r8 = c.a.f1838j
                goto L11
            L20:
                int[] r1 = r6.f546d
                boolean r1 = r6.f(r1, r8)
                r5 = 16842801(0x1010031, float:2.3693695E-38)
                if (r1 == 0) goto L32
                android.graphics.PorterDuff$Mode r0 = android.graphics.PorterDuff.Mode.MULTIPLY
            L2d:
                r1 = r0
                r0 = r4
                r8 = r5
            L30:
                r5 = r2
                goto L4e
            L32:
                int r1 = c.d.f1887u
                if (r8 != r1) goto L45
                r8 = 1109603123(0x42233333, float:40.8)
                int r8 = java.lang.Math.round(r8)
                r1 = 16842800(0x1010030, float:2.3693693E-38)
                r5 = r0
                r0 = r8
                r8 = r1
                r1 = r5
                goto L30
            L45:
                int r1 = c.d.f1878l
                if (r8 != r1) goto L4a
                goto L2d
            L4a:
                r1 = r0
                r8 = r3
                r5 = r8
                goto L13
            L4e:
                if (r5 == 0) goto L6b
                boolean r3 = androidx.appcompat.widget.u.a(r9)
                if (r3 == 0) goto L5a
                android.graphics.drawable.Drawable r9 = r9.mutate()
            L5a:
                int r7 = androidx.appcompat.widget.h0.c(r7, r8)
                android.graphics.PorterDuffColorFilter r7 = androidx.appcompat.widget.f.d(r7, r1)
                r9.setColorFilter(r7)
                if (r0 == r4) goto L6a
                r9.setAlpha(r0)
            L6a:
                return r2
            L6b:
                return r3
            */
            throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.f.a.a(android.content.Context, int, android.graphics.drawable.Drawable):boolean");
        }

        @Override // androidx.appcompat.widget.c0.c
        public PorterDuff.Mode b(int i4) {
            if (i4 == c.d.H) {
                return PorterDuff.Mode.MULTIPLY;
            }
            return null;
        }

        @Override // androidx.appcompat.widget.c0.c
        public Drawable c(c0 c0Var, Context context, int i4) {
            if (i4 == c.d.f1876j) {
                return new LayerDrawable(new Drawable[]{c0Var.i(context, c.d.f1875i), c0Var.i(context, c.d.f1877k)});
            }
            if (i4 == c.d.f1891y) {
                return l(c0Var, context, c.c.f1860g);
            }
            if (i4 == c.d.f1890x) {
                return l(c0Var, context, c.c.f1861h);
            }
            if (i4 == c.d.f1892z) {
                return l(c0Var, context, c.c.f1862i);
            }
            return null;
        }

        @Override // androidx.appcompat.widget.c0.c
        public ColorStateList d(Context context, int i4) {
            if (i4 == c.d.f1879m) {
                return e.a.a(context, c.b.f1850c);
            }
            if (i4 == c.d.I) {
                return e.a.a(context, c.b.f1853f);
            }
            if (i4 == c.d.H) {
                return k(context);
            }
            if (i4 == c.d.f1872f) {
                return j(context);
            }
            if (i4 == c.d.f1868b) {
                return g(context);
            }
            if (i4 == c.d.f1871e) {
                return i(context);
            }
            if (i4 == c.d.D || i4 == c.d.E) {
                return e.a.a(context, c.b.f1852e);
            }
            if (f(this.f544b, i4)) {
                return h0.e(context, c.a.f1840l);
            }
            if (f(this.f547e, i4)) {
                return e.a.a(context, c.b.f1849b);
            }
            if (f(this.f548f, i4)) {
                return e.a.a(context, c.b.f1848a);
            }
            if (i4 == c.d.A) {
                return e.a.a(context, c.b.f1851d);
            }
            return null;
        }

        @Override // androidx.appcompat.widget.c0.c
        public boolean e(Context context, int i4, Drawable drawable) {
            if (i4 == c.d.C) {
                LayerDrawable layerDrawable = (LayerDrawable) drawable;
                m(layerDrawable.findDrawableByLayerId(R.id.background), h0.c(context, c.a.f1840l), f.f540b);
                m(layerDrawable.findDrawableByLayerId(R.id.secondaryProgress), h0.c(context, c.a.f1840l), f.f540b);
                m(layerDrawable.findDrawableByLayerId(R.id.progress), h0.c(context, c.a.f1838j), f.f540b);
                return true;
            }
            if (i4 != c.d.f1891y && i4 != c.d.f1890x && i4 != c.d.f1892z) {
                return false;
            }
            LayerDrawable layerDrawable2 = (LayerDrawable) drawable;
            m(layerDrawable2.findDrawableByLayerId(R.id.background), h0.b(context, c.a.f1840l), f.f540b);
            m(layerDrawable2.findDrawableByLayerId(R.id.secondaryProgress), h0.c(context, c.a.f1838j), f.f540b);
            m(layerDrawable2.findDrawableByLayerId(R.id.progress), h0.c(context, c.a.f1838j), f.f540b);
            return true;
        }
    }

    public static synchronized f b() {
        f fVar;
        synchronized (f.class) {
            try {
                if (f541c == null) {
                    f();
                }
                fVar = f541c;
            } catch (Throwable th) {
                throw th;
            }
        }
        return fVar;
    }

    public static synchronized PorterDuffColorFilter d(int i4, PorterDuff.Mode mode) {
        PorterDuffColorFilter k4;
        synchronized (f.class) {
            k4 = c0.k(i4, mode);
        }
        return k4;
    }

    public static synchronized void f() {
        synchronized (f.class) {
            if (f541c == null) {
                f fVar = new f();
                f541c = fVar;
                fVar.f542a = c0.g();
                f541c.f542a.s(new a());
            }
        }
    }

    static void g(Drawable drawable, j0 j0Var, int[] iArr) {
        c0.u(drawable, j0Var, iArr);
    }

    public synchronized Drawable c(Context context, int i4) {
        return this.f542a.i(context, i4);
    }

    synchronized ColorStateList e(Context context, int i4) {
        return this.f542a.l(context, i4);
    }
}
