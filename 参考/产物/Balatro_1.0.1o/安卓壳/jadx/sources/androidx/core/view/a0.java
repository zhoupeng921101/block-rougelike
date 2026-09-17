package androidx.core.view;

import a1.b2.c3;
import android.graphics.Insets;
import android.graphics.Rect;
import android.os.Build;
import android.util.Log;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowInsets;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a0 {

    /* renamed from: b, reason: collision with root package name */
    public static final a0 f1001b;

    /* renamed from: a, reason: collision with root package name */
    private final l f1002a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {

        /* renamed from: a, reason: collision with root package name */
        private static Field f1003a;

        /* renamed from: b, reason: collision with root package name */
        private static Field f1004b;

        /* renamed from: c, reason: collision with root package name */
        private static Field f1005c;

        /* renamed from: d, reason: collision with root package name */
        private static boolean f1006d;

        static {
            try {
                Field declaredField = View.class.getDeclaredField("mAttachInfo");
                f1003a = declaredField;
                declaredField.setAccessible(true);
                Class<?> cls = Class.forName("android.view.View$AttachInfo");
                Field declaredField2 = cls.getDeclaredField("mStableInsets");
                f1004b = declaredField2;
                declaredField2.setAccessible(true);
                Field declaredField3 = cls.getDeclaredField("mContentInsets");
                f1005c = declaredField3;
                declaredField3.setAccessible(true);
                f1006d = true;
            } catch (ReflectiveOperationException e4) {
                Log.w(c3.d4(322), "Failed to get visible insets from AttachInfo " + e4.getMessage(), e4);
            }
        }

        public static a0 a(View view) {
            if (f1006d && view.isAttachedToWindow()) {
                try {
                    Object obj = f1003a.get(view.getRootView());
                    if (obj != null) {
                        Rect rect = (Rect) f1004b.get(obj);
                        Rect rect2 = (Rect) f1005c.get(obj);
                        if (rect != null && rect2 != null) {
                            a0 a4 = new b().b(androidx.core.graphics.f.c(rect)).c(androidx.core.graphics.f.c(rect2)).a();
                            a4.q(a4);
                            a4.d(view.getRootView());
                            return a4;
                        }
                    }
                } catch (IllegalAccessException e4) {
                    Log.w("WindowInsetsCompat", "Failed to get insets from AttachInfo. " + e4.getMessage(), e4);
                }
            }
            return null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private final f f1007a;

        public b() {
            int i4 = Build.VERSION.SDK_INT;
            if (i4 >= 30) {
                this.f1007a = new e();
            } else if (i4 >= 29) {
                this.f1007a = new d();
            } else {
                this.f1007a = new c();
            }
        }

        public b(a0 a0Var) {
            int i4 = Build.VERSION.SDK_INT;
            if (i4 >= 30) {
                this.f1007a = new e(a0Var);
            } else if (i4 >= 29) {
                this.f1007a = new d(a0Var);
            } else {
                this.f1007a = new c(a0Var);
            }
        }

        public a0 a() {
            return this.f1007a.b();
        }

        public b b(androidx.core.graphics.f fVar) {
            this.f1007a.d(fVar);
            return this;
        }

        public b c(androidx.core.graphics.f fVar) {
            this.f1007a.f(fVar);
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class c extends f {

        /* renamed from: e, reason: collision with root package name */
        private static Field f1008e;

        /* renamed from: f, reason: collision with root package name */
        private static boolean f1009f;

        /* renamed from: g, reason: collision with root package name */
        private static Constructor f1010g;

        /* renamed from: h, reason: collision with root package name */
        private static boolean f1011h;

        /* renamed from: c, reason: collision with root package name */
        private WindowInsets f1012c;

        /* renamed from: d, reason: collision with root package name */
        private androidx.core.graphics.f f1013d;

        c() {
            this.f1012c = h();
        }

        c(a0 a0Var) {
            super(a0Var);
            this.f1012c = a0Var.s();
        }

        private static WindowInsets h() {
            if (!f1009f) {
                try {
                    f1008e = WindowInsets.class.getDeclaredField("CONSUMED");
                } catch (ReflectiveOperationException e4) {
                    Log.i("WindowInsetsCompat", "Could not retrieve WindowInsets.CONSUMED field", e4);
                }
                f1009f = true;
            }
            Field field = f1008e;
            if (field != null) {
                try {
                    WindowInsets windowInsets = (WindowInsets) field.get(null);
                    if (windowInsets != null) {
                        return new WindowInsets(windowInsets);
                    }
                } catch (ReflectiveOperationException e5) {
                    Log.i("WindowInsetsCompat", "Could not get value from WindowInsets.CONSUMED field", e5);
                }
            }
            if (!f1011h) {
                try {
                    f1010g = WindowInsets.class.getConstructor(Rect.class);
                } catch (ReflectiveOperationException e6) {
                    Log.i("WindowInsetsCompat", "Could not retrieve WindowInsets(Rect) constructor", e6);
                }
                f1011h = true;
            }
            Constructor constructor = f1010g;
            if (constructor != null) {
                try {
                    return (WindowInsets) constructor.newInstance(new Rect());
                } catch (ReflectiveOperationException e7) {
                    Log.i("WindowInsetsCompat", "Could not invoke WindowInsets(Rect) constructor", e7);
                }
            }
            return null;
        }

        @Override // androidx.core.view.a0.f
        a0 b() {
            a();
            a0 t3 = a0.t(this.f1012c);
            t3.o(this.f1016b);
            t3.r(this.f1013d);
            return t3;
        }

        @Override // androidx.core.view.a0.f
        void d(androidx.core.graphics.f fVar) {
            this.f1013d = fVar;
        }

        @Override // androidx.core.view.a0.f
        void f(androidx.core.graphics.f fVar) {
            WindowInsets windowInsets = this.f1012c;
            if (windowInsets != null) {
                this.f1012c = windowInsets.replaceSystemWindowInsets(fVar.f912a, fVar.f913b, fVar.f914c, fVar.f915d);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class d extends f {

        /* renamed from: c, reason: collision with root package name */
        final WindowInsets.Builder f1014c;

        d() {
            this.f1014c = i0.a();
        }

        d(a0 a0Var) {
            super(a0Var);
            WindowInsets s3 = a0Var.s();
            this.f1014c = s3 != null ? h0.a(s3) : i0.a();
        }

        @Override // androidx.core.view.a0.f
        a0 b() {
            WindowInsets build;
            a();
            build = this.f1014c.build();
            a0 t3 = a0.t(build);
            t3.o(this.f1016b);
            return t3;
        }

        @Override // androidx.core.view.a0.f
        void c(androidx.core.graphics.f fVar) {
            this.f1014c.setMandatorySystemGestureInsets(fVar.e());
        }

        @Override // androidx.core.view.a0.f
        void d(androidx.core.graphics.f fVar) {
            this.f1014c.setStableInsets(fVar.e());
        }

        @Override // androidx.core.view.a0.f
        void e(androidx.core.graphics.f fVar) {
            this.f1014c.setSystemGestureInsets(fVar.e());
        }

        @Override // androidx.core.view.a0.f
        void f(androidx.core.graphics.f fVar) {
            this.f1014c.setSystemWindowInsets(fVar.e());
        }

        @Override // androidx.core.view.a0.f
        void g(androidx.core.graphics.f fVar) {
            this.f1014c.setTappableElementInsets(fVar.e());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class e extends d {
        e() {
        }

        e(a0 a0Var) {
            super(a0Var);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class f {

        /* renamed from: a, reason: collision with root package name */
        private final a0 f1015a;

        /* renamed from: b, reason: collision with root package name */
        androidx.core.graphics.f[] f1016b;

        f() {
            this(new a0((a0) null));
        }

        f(a0 a0Var) {
            this.f1015a = a0Var;
        }

        protected final void a() {
            androidx.core.graphics.f[] fVarArr = this.f1016b;
            if (fVarArr != null) {
                androidx.core.graphics.f fVar = fVarArr[m.a(1)];
                androidx.core.graphics.f fVar2 = this.f1016b[m.a(2)];
                if (fVar2 == null) {
                    fVar2 = this.f1015a.f(2);
                }
                if (fVar == null) {
                    fVar = this.f1015a.f(1);
                }
                f(androidx.core.graphics.f.a(fVar, fVar2));
                androidx.core.graphics.f fVar3 = this.f1016b[m.a(16)];
                if (fVar3 != null) {
                    e(fVar3);
                }
                androidx.core.graphics.f fVar4 = this.f1016b[m.a(32)];
                if (fVar4 != null) {
                    c(fVar4);
                }
                androidx.core.graphics.f fVar5 = this.f1016b[m.a(64)];
                if (fVar5 != null) {
                    g(fVar5);
                }
            }
        }

        abstract a0 b();

        void c(androidx.core.graphics.f fVar) {
        }

        abstract void d(androidx.core.graphics.f fVar);

        void e(androidx.core.graphics.f fVar) {
        }

        abstract void f(androidx.core.graphics.f fVar);

        void g(androidx.core.graphics.f fVar) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class g extends l {

        /* renamed from: h, reason: collision with root package name */
        private static boolean f1017h;

        /* renamed from: i, reason: collision with root package name */
        private static Method f1018i;

        /* renamed from: j, reason: collision with root package name */
        private static Class f1019j;

        /* renamed from: k, reason: collision with root package name */
        private static Field f1020k;

        /* renamed from: l, reason: collision with root package name */
        private static Field f1021l;

        /* renamed from: c, reason: collision with root package name */
        final WindowInsets f1022c;

        /* renamed from: d, reason: collision with root package name */
        private androidx.core.graphics.f[] f1023d;

        /* renamed from: e, reason: collision with root package name */
        private androidx.core.graphics.f f1024e;

        /* renamed from: f, reason: collision with root package name */
        private a0 f1025f;

        /* renamed from: g, reason: collision with root package name */
        androidx.core.graphics.f f1026g;

        g(a0 a0Var, WindowInsets windowInsets) {
            super(a0Var);
            this.f1024e = null;
            this.f1022c = windowInsets;
        }

        g(a0 a0Var, g gVar) {
            this(a0Var, new WindowInsets(gVar.f1022c));
        }

        private androidx.core.graphics.f t(int i4, boolean z3) {
            androidx.core.graphics.f fVar = androidx.core.graphics.f.f911e;
            for (int i5 = 1; i5 <= 256; i5 <<= 1) {
                if ((i4 & i5) != 0) {
                    fVar = androidx.core.graphics.f.a(fVar, u(i5, z3));
                }
            }
            return fVar;
        }

        private androidx.core.graphics.f v() {
            a0 a0Var = this.f1025f;
            return a0Var != null ? a0Var.g() : androidx.core.graphics.f.f911e;
        }

        private androidx.core.graphics.f w(View view) {
            String d4 = c3.d4(554);
            if (Build.VERSION.SDK_INT >= 30) {
                throw new UnsupportedOperationException("getVisibleInsets() should not be called on API >= 30. Use WindowInsets.isVisible() instead.");
            }
            if (!f1017h) {
                x();
            }
            Method method = f1018i;
            if (method != null && f1019j != null && f1020k != null) {
                try {
                    Object invoke = method.invoke(view, null);
                    if (invoke == null) {
                        Log.w(d4, "Failed to get visible insets. getViewRootImpl() returned null from the provided view. This means that the view is either not attached or the method has been overridden", new NullPointerException());
                        return null;
                    }
                    Rect rect = (Rect) f1020k.get(f1021l.get(invoke));
                    if (rect != null) {
                        return androidx.core.graphics.f.c(rect);
                    }
                    return null;
                } catch (ReflectiveOperationException e4) {
                    Log.e(d4, "Failed to get visible insets. (Reflection error). " + e4.getMessage(), e4);
                }
            }
            return null;
        }

        private static void x() {
            try {
                f1018i = View.class.getDeclaredMethod("getViewRootImpl", null);
                Class<?> cls = Class.forName("android.view.View$AttachInfo");
                f1019j = cls;
                f1020k = cls.getDeclaredField("mVisibleInsets");
                f1021l = Class.forName("android.view.ViewRootImpl").getDeclaredField("mAttachInfo");
                f1020k.setAccessible(true);
                f1021l.setAccessible(true);
            } catch (ReflectiveOperationException e4) {
                Log.e(c3.d4(555), "Failed to get visible insets. (Reflection error). " + e4.getMessage(), e4);
            }
            f1017h = true;
        }

        @Override // androidx.core.view.a0.l
        void d(View view) {
            androidx.core.graphics.f w3 = w(view);
            if (w3 == null) {
                w3 = androidx.core.graphics.f.f911e;
            }
            q(w3);
        }

        @Override // androidx.core.view.a0.l
        void e(a0 a0Var) {
            a0Var.q(this.f1025f);
            a0Var.p(this.f1026g);
        }

        @Override // androidx.core.view.a0.l
        public boolean equals(Object obj) {
            if (super.equals(obj)) {
                return Objects.equals(this.f1026g, ((g) obj).f1026g);
            }
            return false;
        }

        @Override // androidx.core.view.a0.l
        public androidx.core.graphics.f g(int i4) {
            return t(i4, false);
        }

        @Override // androidx.core.view.a0.l
        final androidx.core.graphics.f k() {
            if (this.f1024e == null) {
                this.f1024e = androidx.core.graphics.f.b(this.f1022c.getSystemWindowInsetLeft(), this.f1022c.getSystemWindowInsetTop(), this.f1022c.getSystemWindowInsetRight(), this.f1022c.getSystemWindowInsetBottom());
            }
            return this.f1024e;
        }

        @Override // androidx.core.view.a0.l
        a0 m(int i4, int i5, int i6, int i7) {
            b bVar = new b(a0.t(this.f1022c));
            bVar.c(a0.m(k(), i4, i5, i6, i7));
            bVar.b(a0.m(i(), i4, i5, i6, i7));
            return bVar.a();
        }

        @Override // androidx.core.view.a0.l
        boolean o() {
            return this.f1022c.isRound();
        }

        @Override // androidx.core.view.a0.l
        public void p(androidx.core.graphics.f[] fVarArr) {
            this.f1023d = fVarArr;
        }

        @Override // androidx.core.view.a0.l
        void q(androidx.core.graphics.f fVar) {
            this.f1026g = fVar;
        }

        @Override // androidx.core.view.a0.l
        void r(a0 a0Var) {
            this.f1025f = a0Var;
        }

        protected androidx.core.graphics.f u(int i4, boolean z3) {
            androidx.core.graphics.f g4;
            int i5;
            if (i4 == 1) {
                return z3 ? androidx.core.graphics.f.b(0, Math.max(v().f913b, k().f913b), 0, 0) : androidx.core.graphics.f.b(0, k().f913b, 0, 0);
            }
            if (i4 == 2) {
                if (z3) {
                    androidx.core.graphics.f v3 = v();
                    androidx.core.graphics.f i6 = i();
                    return androidx.core.graphics.f.b(Math.max(v3.f912a, i6.f912a), 0, Math.max(v3.f914c, i6.f914c), Math.max(v3.f915d, i6.f915d));
                }
                androidx.core.graphics.f k4 = k();
                a0 a0Var = this.f1025f;
                g4 = a0Var != null ? a0Var.g() : null;
                int i7 = k4.f915d;
                if (g4 != null) {
                    i7 = Math.min(i7, g4.f915d);
                }
                return androidx.core.graphics.f.b(k4.f912a, 0, k4.f914c, i7);
            }
            if (i4 != 8) {
                if (i4 == 16) {
                    return j();
                }
                if (i4 == 32) {
                    return h();
                }
                if (i4 == 64) {
                    return l();
                }
                if (i4 != 128) {
                    return androidx.core.graphics.f.f911e;
                }
                a0 a0Var2 = this.f1025f;
                androidx.core.view.d e4 = a0Var2 != null ? a0Var2.e() : f();
                return e4 != null ? androidx.core.graphics.f.b(e4.b(), e4.d(), e4.c(), e4.a()) : androidx.core.graphics.f.f911e;
            }
            androidx.core.graphics.f[] fVarArr = this.f1023d;
            g4 = fVarArr != null ? fVarArr[m.a(8)] : null;
            if (g4 != null) {
                return g4;
            }
            androidx.core.graphics.f k5 = k();
            androidx.core.graphics.f v4 = v();
            int i8 = k5.f915d;
            if (i8 > v4.f915d) {
                return androidx.core.graphics.f.b(0, 0, 0, i8);
            }
            androidx.core.graphics.f fVar = this.f1026g;
            return (fVar == null || fVar.equals(androidx.core.graphics.f.f911e) || (i5 = this.f1026g.f915d) <= v4.f915d) ? androidx.core.graphics.f.f911e : androidx.core.graphics.f.b(0, 0, 0, i5);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class h extends g {

        /* renamed from: m, reason: collision with root package name */
        private androidx.core.graphics.f f1027m;

        h(a0 a0Var, WindowInsets windowInsets) {
            super(a0Var, windowInsets);
            this.f1027m = null;
        }

        h(a0 a0Var, h hVar) {
            super(a0Var, hVar);
            this.f1027m = null;
            this.f1027m = hVar.f1027m;
        }

        @Override // androidx.core.view.a0.l
        a0 b() {
            return a0.t(this.f1022c.consumeStableInsets());
        }

        @Override // androidx.core.view.a0.l
        a0 c() {
            return a0.t(this.f1022c.consumeSystemWindowInsets());
        }

        @Override // androidx.core.view.a0.l
        final androidx.core.graphics.f i() {
            if (this.f1027m == null) {
                this.f1027m = androidx.core.graphics.f.b(this.f1022c.getStableInsetLeft(), this.f1022c.getStableInsetTop(), this.f1022c.getStableInsetRight(), this.f1022c.getStableInsetBottom());
            }
            return this.f1027m;
        }

        @Override // androidx.core.view.a0.l
        boolean n() {
            return this.f1022c.isConsumed();
        }

        @Override // androidx.core.view.a0.l
        public void s(androidx.core.graphics.f fVar) {
            this.f1027m = fVar;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class i extends h {
        i(a0 a0Var, WindowInsets windowInsets) {
            super(a0Var, windowInsets);
        }

        i(a0 a0Var, i iVar) {
            super(a0Var, iVar);
        }

        @Override // androidx.core.view.a0.l
        a0 a() {
            WindowInsets consumeDisplayCutout;
            consumeDisplayCutout = this.f1022c.consumeDisplayCutout();
            return a0.t(consumeDisplayCutout);
        }

        @Override // androidx.core.view.a0.g, androidx.core.view.a0.l
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof i)) {
                return false;
            }
            i iVar = (i) obj;
            return Objects.equals(this.f1022c, iVar.f1022c) && Objects.equals(this.f1026g, iVar.f1026g);
        }

        @Override // androidx.core.view.a0.l
        androidx.core.view.d f() {
            DisplayCutout displayCutout;
            displayCutout = this.f1022c.getDisplayCutout();
            return androidx.core.view.d.e(displayCutout);
        }

        @Override // androidx.core.view.a0.l
        public int hashCode() {
            return this.f1022c.hashCode();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class j extends i {

        /* renamed from: n, reason: collision with root package name */
        private androidx.core.graphics.f f1028n;

        /* renamed from: o, reason: collision with root package name */
        private androidx.core.graphics.f f1029o;

        /* renamed from: p, reason: collision with root package name */
        private androidx.core.graphics.f f1030p;

        j(a0 a0Var, WindowInsets windowInsets) {
            super(a0Var, windowInsets);
            this.f1028n = null;
            this.f1029o = null;
            this.f1030p = null;
        }

        j(a0 a0Var, j jVar) {
            super(a0Var, jVar);
            this.f1028n = null;
            this.f1029o = null;
            this.f1030p = null;
        }

        @Override // androidx.core.view.a0.l
        androidx.core.graphics.f h() {
            Insets mandatorySystemGestureInsets;
            if (this.f1029o == null) {
                mandatorySystemGestureInsets = this.f1022c.getMandatorySystemGestureInsets();
                this.f1029o = androidx.core.graphics.f.d(mandatorySystemGestureInsets);
            }
            return this.f1029o;
        }

        @Override // androidx.core.view.a0.l
        androidx.core.graphics.f j() {
            Insets systemGestureInsets;
            if (this.f1028n == null) {
                systemGestureInsets = this.f1022c.getSystemGestureInsets();
                this.f1028n = androidx.core.graphics.f.d(systemGestureInsets);
            }
            return this.f1028n;
        }

        @Override // androidx.core.view.a0.l
        androidx.core.graphics.f l() {
            Insets tappableElementInsets;
            if (this.f1030p == null) {
                tappableElementInsets = this.f1022c.getTappableElementInsets();
                this.f1030p = androidx.core.graphics.f.d(tappableElementInsets);
            }
            return this.f1030p;
        }

        @Override // androidx.core.view.a0.g, androidx.core.view.a0.l
        a0 m(int i4, int i5, int i6, int i7) {
            WindowInsets inset;
            inset = this.f1022c.inset(i4, i5, i6, i7);
            return a0.t(inset);
        }

        @Override // androidx.core.view.a0.h, androidx.core.view.a0.l
        public void s(androidx.core.graphics.f fVar) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class k extends j {

        /* renamed from: q, reason: collision with root package name */
        static final a0 f1031q;

        static {
            WindowInsets windowInsets;
            windowInsets = WindowInsets.CONSUMED;
            f1031q = a0.t(windowInsets);
        }

        k(a0 a0Var, WindowInsets windowInsets) {
            super(a0Var, windowInsets);
        }

        k(a0 a0Var, k kVar) {
            super(a0Var, kVar);
        }

        @Override // androidx.core.view.a0.g, androidx.core.view.a0.l
        final void d(View view) {
        }

        @Override // androidx.core.view.a0.g, androidx.core.view.a0.l
        public androidx.core.graphics.f g(int i4) {
            Insets insets;
            insets = this.f1022c.getInsets(n.a(i4));
            return androidx.core.graphics.f.d(insets);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class l {

        /* renamed from: b, reason: collision with root package name */
        static final a0 f1032b = new b().a().a().b().c();

        /* renamed from: a, reason: collision with root package name */
        final a0 f1033a;

        l(a0 a0Var) {
            this.f1033a = a0Var;
        }

        a0 a() {
            return this.f1033a;
        }

        a0 b() {
            return this.f1033a;
        }

        a0 c() {
            return this.f1033a;
        }

        void d(View view) {
        }

        void e(a0 a0Var) {
        }

        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof l)) {
                return false;
            }
            l lVar = (l) obj;
            return o() == lVar.o() && n() == lVar.n() && androidx.core.util.b.a(k(), lVar.k()) && androidx.core.util.b.a(i(), lVar.i()) && androidx.core.util.b.a(f(), lVar.f());
        }

        androidx.core.view.d f() {
            return null;
        }

        androidx.core.graphics.f g(int i4) {
            return androidx.core.graphics.f.f911e;
        }

        androidx.core.graphics.f h() {
            return k();
        }

        public int hashCode() {
            return androidx.core.util.b.b(Boolean.valueOf(o()), Boolean.valueOf(n()), k(), i(), f());
        }

        androidx.core.graphics.f i() {
            return androidx.core.graphics.f.f911e;
        }

        androidx.core.graphics.f j() {
            return k();
        }

        androidx.core.graphics.f k() {
            return androidx.core.graphics.f.f911e;
        }

        androidx.core.graphics.f l() {
            return k();
        }

        a0 m(int i4, int i5, int i6, int i7) {
            return f1032b;
        }

        boolean n() {
            return false;
        }

        boolean o() {
            return false;
        }

        public void p(androidx.core.graphics.f[] fVarArr) {
        }

        void q(androidx.core.graphics.f fVar) {
        }

        void r(a0 a0Var) {
        }

        public void s(androidx.core.graphics.f fVar) {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class m {
        static int a(int i4) {
            if (i4 == 1) {
                return 0;
            }
            if (i4 == 2) {
                return 1;
            }
            if (i4 == 4) {
                return 2;
            }
            if (i4 == 8) {
                return 3;
            }
            if (i4 == 16) {
                return 4;
            }
            if (i4 == 32) {
                return 5;
            }
            if (i4 == 64) {
                return 6;
            }
            if (i4 == 128) {
                return 7;
            }
            if (i4 == 256) {
                return 8;
            }
            throw new IllegalArgumentException("type needs to be >= FIRST and <= LAST, type=" + i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class n {
        static int a(int i4) {
            int statusBars;
            int i5 = 0;
            for (int i6 = 1; i6 <= 256; i6 <<= 1) {
                if ((i4 & i6) != 0) {
                    if (i6 == 1) {
                        statusBars = WindowInsets.Type.statusBars();
                    } else if (i6 == 2) {
                        statusBars = WindowInsets.Type.navigationBars();
                    } else if (i6 == 4) {
                        statusBars = WindowInsets.Type.captionBar();
                    } else if (i6 == 8) {
                        statusBars = WindowInsets.Type.ime();
                    } else if (i6 == 16) {
                        statusBars = WindowInsets.Type.systemGestures();
                    } else if (i6 == 32) {
                        statusBars = WindowInsets.Type.mandatorySystemGestures();
                    } else if (i6 == 64) {
                        statusBars = WindowInsets.Type.tappableElement();
                    } else if (i6 == 128) {
                        statusBars = WindowInsets.Type.displayCutout();
                    }
                    i5 |= statusBars;
                }
            }
            return i5;
        }
    }

    static {
        if (Build.VERSION.SDK_INT >= 30) {
            f1001b = k.f1031q;
        } else {
            f1001b = l.f1032b;
        }
    }

    private a0(WindowInsets windowInsets) {
        int i4 = Build.VERSION.SDK_INT;
        if (i4 >= 30) {
            this.f1002a = new k(this, windowInsets);
            return;
        }
        if (i4 >= 29) {
            this.f1002a = new j(this, windowInsets);
        } else if (i4 >= 28) {
            this.f1002a = new i(this, windowInsets);
        } else {
            this.f1002a = new h(this, windowInsets);
        }
    }

    public a0(a0 a0Var) {
        if (a0Var == null) {
            this.f1002a = new l(this);
            return;
        }
        l lVar = a0Var.f1002a;
        int i4 = Build.VERSION.SDK_INT;
        if (i4 >= 30 && (lVar instanceof k)) {
            this.f1002a = new k(this, (k) lVar);
        } else if (i4 >= 29 && (lVar instanceof j)) {
            this.f1002a = new j(this, (j) lVar);
        } else if (i4 >= 28 && (lVar instanceof i)) {
            this.f1002a = new i(this, (i) lVar);
        } else if (lVar instanceof h) {
            this.f1002a = new h(this, (h) lVar);
        } else if (lVar instanceof g) {
            this.f1002a = new g(this, (g) lVar);
        } else {
            this.f1002a = new l(this);
        }
        lVar.e(this);
    }

    static androidx.core.graphics.f m(androidx.core.graphics.f fVar, int i4, int i5, int i6, int i7) {
        int max = Math.max(0, fVar.f912a - i4);
        int max2 = Math.max(0, fVar.f913b - i5);
        int max3 = Math.max(0, fVar.f914c - i6);
        int max4 = Math.max(0, fVar.f915d - i7);
        return (max == i4 && max2 == i5 && max3 == i6 && max4 == i7) ? fVar : androidx.core.graphics.f.b(max, max2, max3, max4);
    }

    public static a0 t(WindowInsets windowInsets) {
        return u(windowInsets, null);
    }

    public static a0 u(WindowInsets windowInsets, View view) {
        a0 a0Var = new a0((WindowInsets) androidx.core.util.c.d(windowInsets));
        if (view != null && v.v(view)) {
            a0Var.q(v.q(view));
            a0Var.d(view.getRootView());
        }
        return a0Var;
    }

    public a0 a() {
        return this.f1002a.a();
    }

    public a0 b() {
        return this.f1002a.b();
    }

    public a0 c() {
        return this.f1002a.c();
    }

    void d(View view) {
        this.f1002a.d(view);
    }

    public androidx.core.view.d e() {
        return this.f1002a.f();
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof a0) {
            return androidx.core.util.b.a(this.f1002a, ((a0) obj).f1002a);
        }
        return false;
    }

    public androidx.core.graphics.f f(int i4) {
        return this.f1002a.g(i4);
    }

    public androidx.core.graphics.f g() {
        return this.f1002a.i();
    }

    public int h() {
        return this.f1002a.k().f915d;
    }

    public int hashCode() {
        l lVar = this.f1002a;
        if (lVar == null) {
            return 0;
        }
        return lVar.hashCode();
    }

    public int i() {
        return this.f1002a.k().f912a;
    }

    public int j() {
        return this.f1002a.k().f914c;
    }

    public int k() {
        return this.f1002a.k().f913b;
    }

    public a0 l(int i4, int i5, int i6, int i7) {
        return this.f1002a.m(i4, i5, i6, i7);
    }

    public boolean n() {
        return this.f1002a.n();
    }

    void o(androidx.core.graphics.f[] fVarArr) {
        this.f1002a.p(fVarArr);
    }

    void p(androidx.core.graphics.f fVar) {
        this.f1002a.q(fVar);
    }

    void q(a0 a0Var) {
        this.f1002a.r(a0Var);
    }

    void r(androidx.core.graphics.f fVar) {
        this.f1002a.s(fVar);
    }

    public WindowInsets s() {
        l lVar = this.f1002a;
        if (lVar instanceof g) {
            return ((g) lVar).f1022c;
        }
        return null;
    }
}
