package androidx.core.widget;

import android.content.res.Resources;
import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.AnimationUtils;
import android.view.animation.Interpolator;
import androidx.core.view.v;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements View.OnTouchListener {

    /* renamed from: r, reason: collision with root package name */
    private static final int f1132r = ViewConfiguration.getTapTimeout();

    /* renamed from: c, reason: collision with root package name */
    final View f1135c;

    /* renamed from: d, reason: collision with root package name */
    private Runnable f1136d;

    /* renamed from: g, reason: collision with root package name */
    private int f1139g;

    /* renamed from: h, reason: collision with root package name */
    private int f1140h;

    /* renamed from: l, reason: collision with root package name */
    private boolean f1144l;

    /* renamed from: m, reason: collision with root package name */
    boolean f1145m;

    /* renamed from: n, reason: collision with root package name */
    boolean f1146n;

    /* renamed from: o, reason: collision with root package name */
    boolean f1147o;

    /* renamed from: p, reason: collision with root package name */
    private boolean f1148p;

    /* renamed from: q, reason: collision with root package name */
    private boolean f1149q;

    /* renamed from: a, reason: collision with root package name */
    final C0013a f1133a = new C0013a();

    /* renamed from: b, reason: collision with root package name */
    private final Interpolator f1134b = new AccelerateInterpolator();

    /* renamed from: e, reason: collision with root package name */
    private float[] f1137e = {0.0f, 0.0f};

    /* renamed from: f, reason: collision with root package name */
    private float[] f1138f = {Float.MAX_VALUE, Float.MAX_VALUE};

    /* renamed from: i, reason: collision with root package name */
    private float[] f1141i = {0.0f, 0.0f};

    /* renamed from: j, reason: collision with root package name */
    private float[] f1142j = {0.0f, 0.0f};

    /* renamed from: k, reason: collision with root package name */
    private float[] f1143k = {Float.MAX_VALUE, Float.MAX_VALUE};

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.widget.a$a, reason: collision with other inner class name */
    private static class C0013a {

        /* renamed from: a, reason: collision with root package name */
        private int f1150a;

        /* renamed from: b, reason: collision with root package name */
        private int f1151b;

        /* renamed from: c, reason: collision with root package name */
        private float f1152c;

        /* renamed from: d, reason: collision with root package name */
        private float f1153d;

        /* renamed from: j, reason: collision with root package name */
        private float f1159j;

        /* renamed from: k, reason: collision with root package name */
        private int f1160k;

        /* renamed from: e, reason: collision with root package name */
        private long f1154e = Long.MIN_VALUE;

        /* renamed from: i, reason: collision with root package name */
        private long f1158i = -1;

        /* renamed from: f, reason: collision with root package name */
        private long f1155f = 0;

        /* renamed from: g, reason: collision with root package name */
        private int f1156g = 0;

        /* renamed from: h, reason: collision with root package name */
        private int f1157h = 0;

        C0013a() {
        }

        private float e(long j4) {
            if (j4 < this.f1154e) {
                return 0.0f;
            }
            long j5 = this.f1158i;
            if (j5 < 0 || j4 < j5) {
                return a.e((j4 - r0) / this.f1150a, 0.0f, 1.0f) * 0.5f;
            }
            float f4 = this.f1159j;
            return (1.0f - f4) + (f4 * a.e((j4 - j5) / this.f1160k, 0.0f, 1.0f));
        }

        private float g(float f4) {
            return ((-4.0f) * f4 * f4) + (f4 * 4.0f);
        }

        public void a() {
            if (this.f1155f == 0) {
                throw new RuntimeException("Cannot compute scroll delta before calling start()");
            }
            long currentAnimationTimeMillis = AnimationUtils.currentAnimationTimeMillis();
            float g4 = g(e(currentAnimationTimeMillis));
            long j4 = currentAnimationTimeMillis - this.f1155f;
            this.f1155f = currentAnimationTimeMillis;
            float f4 = j4 * g4;
            this.f1156g = (int) (this.f1152c * f4);
            this.f1157h = (int) (f4 * this.f1153d);
        }

        public int b() {
            return this.f1156g;
        }

        public int c() {
            return this.f1157h;
        }

        public int d() {
            float f4 = this.f1152c;
            return (int) (f4 / Math.abs(f4));
        }

        public int f() {
            float f4 = this.f1153d;
            return (int) (f4 / Math.abs(f4));
        }

        public boolean h() {
            return this.f1158i > 0 && AnimationUtils.currentAnimationTimeMillis() > this.f1158i + ((long) this.f1160k);
        }

        public void i() {
            long currentAnimationTimeMillis = AnimationUtils.currentAnimationTimeMillis();
            this.f1160k = a.f((int) (currentAnimationTimeMillis - this.f1154e), 0, this.f1151b);
            this.f1159j = e(currentAnimationTimeMillis);
            this.f1158i = currentAnimationTimeMillis;
        }

        public void j(int i4) {
            this.f1151b = i4;
        }

        public void k(int i4) {
            this.f1150a = i4;
        }

        public void l(float f4, float f5) {
            this.f1152c = f4;
            this.f1153d = f5;
        }

        public void m() {
            long currentAnimationTimeMillis = AnimationUtils.currentAnimationTimeMillis();
            this.f1154e = currentAnimationTimeMillis;
            this.f1158i = -1L;
            this.f1155f = currentAnimationTimeMillis;
            this.f1159j = 0.5f;
            this.f1156g = 0;
            this.f1157h = 0;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            a aVar = a.this;
            if (aVar.f1147o) {
                if (aVar.f1145m) {
                    aVar.f1145m = false;
                    aVar.f1133a.m();
                }
                C0013a c0013a = a.this.f1133a;
                if (c0013a.h() || !a.this.u()) {
                    a.this.f1147o = false;
                    return;
                }
                a aVar2 = a.this;
                if (aVar2.f1146n) {
                    aVar2.f1146n = false;
                    aVar2.c();
                }
                c0013a.a();
                a.this.j(c0013a.b(), c0013a.c());
                v.C(a.this.f1135c, this);
            }
        }
    }

    public a(View view) {
        this.f1135c = view;
        float f4 = Resources.getSystem().getDisplayMetrics().density;
        float f5 = (int) ((1575.0f * f4) + 0.5f);
        o(f5, f5);
        float f6 = (int) ((f4 * 315.0f) + 0.5f);
        p(f6, f6);
        l(1);
        n(Float.MAX_VALUE, Float.MAX_VALUE);
        s(0.2f, 0.2f);
        t(1.0f, 1.0f);
        k(f1132r);
        r(500);
        q(500);
    }

    private float d(int i4, float f4, float f5, float f6) {
        float h4 = h(this.f1137e[i4], f5, this.f1138f[i4], f4);
        if (h4 == 0.0f) {
            return 0.0f;
        }
        float f7 = this.f1141i[i4];
        float f8 = this.f1142j[i4];
        float f9 = this.f1143k[i4];
        float f10 = f7 * f6;
        return h4 > 0.0f ? e(h4 * f10, f8, f9) : -e((-h4) * f10, f8, f9);
    }

    static float e(float f4, float f5, float f6) {
        return f4 > f6 ? f6 : f4 < f5 ? f5 : f4;
    }

    static int f(int i4, int i5, int i6) {
        return i4 > i6 ? i6 : i4 < i5 ? i5 : i4;
    }

    private float g(float f4, float f5) {
        if (f5 == 0.0f) {
            return 0.0f;
        }
        int i4 = this.f1139g;
        if (i4 == 0 || i4 == 1) {
            if (f4 < f5) {
                if (f4 >= 0.0f) {
                    return 1.0f - (f4 / f5);
                }
                if (this.f1147o && i4 == 1) {
                    return 1.0f;
                }
            }
        } else if (i4 == 2 && f4 < 0.0f) {
            return f4 / (-f5);
        }
        return 0.0f;
    }

    private float h(float f4, float f5, float f6, float f7) {
        float interpolation;
        float e4 = e(f4 * f5, 0.0f, f6);
        float g4 = g(f5 - f7, e4) - g(f7, e4);
        if (g4 < 0.0f) {
            interpolation = -this.f1134b.getInterpolation(-g4);
        } else {
            if (g4 <= 0.0f) {
                return 0.0f;
            }
            interpolation = this.f1134b.getInterpolation(g4);
        }
        return e(interpolation, -1.0f, 1.0f);
    }

    private void i() {
        if (this.f1145m) {
            this.f1147o = false;
        } else {
            this.f1133a.i();
        }
    }

    private void v() {
        int i4;
        if (this.f1136d == null) {
            this.f1136d = new b();
        }
        this.f1147o = true;
        this.f1145m = true;
        if (this.f1144l || (i4 = this.f1140h) <= 0) {
            this.f1136d.run();
        } else {
            v.D(this.f1135c, this.f1136d, i4);
        }
        this.f1144l = true;
    }

    public abstract boolean a(int i4);

    public abstract boolean b(int i4);

    void c() {
        long uptimeMillis = SystemClock.uptimeMillis();
        MotionEvent obtain = MotionEvent.obtain(uptimeMillis, uptimeMillis, 3, 0.0f, 0.0f, 0);
        this.f1135c.onTouchEvent(obtain);
        obtain.recycle();
    }

    public abstract void j(int i4, int i5);

    public a k(int i4) {
        this.f1140h = i4;
        return this;
    }

    public a l(int i4) {
        this.f1139g = i4;
        return this;
    }

    public a m(boolean z3) {
        if (this.f1148p && !z3) {
            i();
        }
        this.f1148p = z3;
        return this;
    }

    public a n(float f4, float f5) {
        float[] fArr = this.f1138f;
        fArr[0] = f4;
        fArr[1] = f5;
        return this;
    }

    public a o(float f4, float f5) {
        float[] fArr = this.f1143k;
        fArr[0] = f4 / 1000.0f;
        fArr[1] = f5 / 1000.0f;
        return this;
    }

    /* JADX WARN: Code restructure failed: missing block: B:11:0x0013, code lost:
    
        if (r0 != 3) goto L20;
     */
    @Override // android.view.View.OnTouchListener
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public boolean onTouch(android.view.View r6, android.view.MotionEvent r7) {
        /*
            r5 = this;
            boolean r0 = r5.f1148p
            r1 = 0
            if (r0 != 0) goto L6
            return r1
        L6:
            int r0 = r7.getActionMasked()
            r2 = 1
            if (r0 == 0) goto L1a
            if (r0 == r2) goto L16
            r3 = 2
            if (r0 == r3) goto L1e
            r6 = 3
            if (r0 == r6) goto L16
            goto L58
        L16:
            r5.i()
            goto L58
        L1a:
            r5.f1146n = r2
            r5.f1144l = r1
        L1e:
            float r0 = r7.getX()
            int r3 = r6.getWidth()
            float r3 = (float) r3
            android.view.View r4 = r5.f1135c
            int r4 = r4.getWidth()
            float r4 = (float) r4
            float r0 = r5.d(r1, r0, r3, r4)
            float r7 = r7.getY()
            int r6 = r6.getHeight()
            float r6 = (float) r6
            android.view.View r3 = r5.f1135c
            int r3 = r3.getHeight()
            float r3 = (float) r3
            float r6 = r5.d(r2, r7, r6, r3)
            androidx.core.widget.a$a r7 = r5.f1133a
            r7.l(r0, r6)
            boolean r6 = r5.f1147o
            if (r6 != 0) goto L58
            boolean r6 = r5.u()
            if (r6 == 0) goto L58
            r5.v()
        L58:
            boolean r6 = r5.f1149q
            if (r6 == 0) goto L61
            boolean r6 = r5.f1147o
            if (r6 == 0) goto L61
            return r2
        L61:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.widget.a.onTouch(android.view.View, android.view.MotionEvent):boolean");
    }

    public a p(float f4, float f5) {
        float[] fArr = this.f1142j;
        fArr[0] = f4 / 1000.0f;
        fArr[1] = f5 / 1000.0f;
        return this;
    }

    public a q(int i4) {
        this.f1133a.j(i4);
        return this;
    }

    public a r(int i4) {
        this.f1133a.k(i4);
        return this;
    }

    public a s(float f4, float f5) {
        float[] fArr = this.f1137e;
        fArr[0] = f4;
        fArr[1] = f5;
        return this;
    }

    public a t(float f4, float f5) {
        float[] fArr = this.f1141i;
        fArr[0] = f4 / 1000.0f;
        fArr[1] = f5 / 1000.0f;
        return this;
    }

    boolean u() {
        C0013a c0013a = this.f1133a;
        int f4 = c0013a.f();
        int d4 = c0013a.d();
        if (f4 == 0 || !b(f4)) {
            return d4 != 0 && a(d4);
        }
        return true;
    }
}
