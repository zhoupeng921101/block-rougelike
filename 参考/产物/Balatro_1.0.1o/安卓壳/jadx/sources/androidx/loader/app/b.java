package androidx.loader.app;

import a1.b2.c3;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import androidx.lifecycle.a0;
import androidx.lifecycle.k;
import androidx.lifecycle.o;
import androidx.lifecycle.p;
import androidx.lifecycle.x;
import androidx.lifecycle.y;
import androidx.loader.app.a;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.lang.reflect.Modifier;
import k.h;
import y.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class b extends androidx.loader.app.a {

    /* renamed from: c, reason: collision with root package name */
    static boolean f1717c;

    /* renamed from: a, reason: collision with root package name */
    private final k f1718a;

    /* renamed from: b, reason: collision with root package name */
    private final c f1719b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a extends o implements b.a {

        /* renamed from: l, reason: collision with root package name */
        private final int f1720l;

        /* renamed from: m, reason: collision with root package name */
        private final Bundle f1721m;

        /* renamed from: n, reason: collision with root package name */
        private final y.b f1722n;

        /* renamed from: o, reason: collision with root package name */
        private k f1723o;

        /* renamed from: p, reason: collision with root package name */
        private C0025b f1724p;

        /* renamed from: q, reason: collision with root package name */
        private y.b f1725q;

        a(int i4, Bundle bundle, y.b bVar, y.b bVar2) {
            this.f1720l = i4;
            this.f1721m = bundle;
            this.f1722n = bVar;
            this.f1725q = bVar2;
            bVar.r(i4, this);
        }

        @Override // y.b.a
        public void a(y.b bVar, Object obj) {
            boolean z3 = b.f1717c;
            String d4 = c3.d4(424);
            if (z3) {
                Log.v(d4, "onLoadComplete: " + this);
            }
            if (Looper.myLooper() == Looper.getMainLooper()) {
                n(obj);
                return;
            }
            if (b.f1717c) {
                Log.w(d4, "onLoadComplete was incorrectly called on a background thread");
            }
            l(obj);
        }

        @Override // androidx.lifecycle.LiveData
        protected void j() {
            if (b.f1717c) {
                Log.v(c3.d4(59), "  Starting: " + this);
            }
            this.f1722n.u();
        }

        @Override // androidx.lifecycle.LiveData
        protected void k() {
            if (b.f1717c) {
                Log.v("LoaderManager", "  Stopping: " + this);
            }
            this.f1722n.v();
        }

        @Override // androidx.lifecycle.LiveData
        public void m(p pVar) {
            super.m(pVar);
            this.f1723o = null;
            this.f1724p = null;
        }

        @Override // androidx.lifecycle.o, androidx.lifecycle.LiveData
        public void n(Object obj) {
            super.n(obj);
            y.b bVar = this.f1725q;
            if (bVar != null) {
                bVar.s();
                this.f1725q = null;
            }
        }

        y.b o(boolean z3) {
            if (b.f1717c) {
                Log.v("LoaderManager", "  Destroying: " + this);
            }
            this.f1722n.b();
            this.f1722n.a();
            C0025b c0025b = this.f1724p;
            if (c0025b != null) {
                m(c0025b);
                if (z3) {
                    c0025b.d();
                }
            }
            this.f1722n.w(this);
            if ((c0025b == null || c0025b.c()) && !z3) {
                return this.f1722n;
            }
            this.f1722n.s();
            return this.f1725q;
        }

        public void p(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
            printWriter.print(str);
            printWriter.print("mId=");
            printWriter.print(this.f1720l);
            printWriter.print(c3.d4(234));
            printWriter.println(this.f1721m);
            printWriter.print(str);
            printWriter.print("mLoader=");
            printWriter.println(this.f1722n);
            this.f1722n.g(str + "  ", fileDescriptor, printWriter, strArr);
            if (this.f1724p != null) {
                printWriter.print(str);
                printWriter.print("mCallbacks=");
                printWriter.println(this.f1724p);
                this.f1724p.b(str + "  ", printWriter);
            }
            printWriter.print(str);
            printWriter.print("mData=");
            printWriter.println(q().d(f()));
            printWriter.print(str);
            printWriter.print(c3.d4(189));
            printWriter.println(g());
        }

        y.b q() {
            return this.f1722n;
        }

        void r() {
            k kVar = this.f1723o;
            C0025b c0025b = this.f1724p;
            if (kVar == null || c0025b == null) {
                return;
            }
            super.m(c0025b);
            h(kVar, c0025b);
        }

        y.b s(k kVar, a.InterfaceC0024a interfaceC0024a) {
            C0025b c0025b = new C0025b(this.f1722n, interfaceC0024a);
            h(kVar, c0025b);
            p pVar = this.f1724p;
            if (pVar != null) {
                m(pVar);
            }
            this.f1723o = kVar;
            this.f1724p = c0025b;
            return this.f1722n;
        }

        public String toString() {
            StringBuilder sb = new StringBuilder(64);
            sb.append("LoaderInfo{");
            sb.append(Integer.toHexString(System.identityHashCode(this)));
            sb.append(" #");
            sb.append(this.f1720l);
            sb.append(c3.d4(1405));
            Class<?> cls = this.f1722n.getClass();
            sb.append(cls.getSimpleName());
            sb.append("{");
            sb.append(Integer.toHexString(System.identityHashCode(cls)));
            sb.append("}}");
            return sb.toString();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.loader.app.b$b, reason: collision with other inner class name */
    static class C0025b implements p {

        /* renamed from: a, reason: collision with root package name */
        private final y.b f1726a;

        /* renamed from: b, reason: collision with root package name */
        private final a.InterfaceC0024a f1727b;

        /* renamed from: c, reason: collision with root package name */
        private boolean f1728c = false;

        C0025b(y.b bVar, a.InterfaceC0024a interfaceC0024a) {
            this.f1726a = bVar;
            this.f1727b = interfaceC0024a;
        }

        @Override // androidx.lifecycle.p
        public void a(Object obj) {
            if (b.f1717c) {
                Log.v("LoaderManager", "  onLoadFinished in " + this.f1726a + c3.d4(676) + this.f1726a.d(obj));
            }
            this.f1728c = true;
            this.f1727b.b(this.f1726a, obj);
        }

        public void b(String str, PrintWriter printWriter) {
            printWriter.print(str);
            printWriter.print("mDeliveredData=");
            printWriter.println(this.f1728c);
        }

        boolean c() {
            return this.f1728c;
        }

        void d() {
            if (this.f1728c) {
                if (b.f1717c) {
                    Log.v("LoaderManager", "  Resetting: " + this.f1726a);
                }
                this.f1727b.a(this.f1726a);
            }
        }

        public String toString() {
            return this.f1727b.toString();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c extends x {

        /* renamed from: f, reason: collision with root package name */
        private static final y.b f1729f = new a();

        /* renamed from: d, reason: collision with root package name */
        private h f1730d = new h();

        /* renamed from: e, reason: collision with root package name */
        private boolean f1731e = false;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        static class a implements y.b {
            a() {
            }

            @Override // androidx.lifecycle.y.b
            public x a(Class cls) {
                return new c();
            }
        }

        c() {
        }

        static c g(a0 a0Var) {
            return (c) new y(a0Var, f1729f).a(c.class);
        }

        @Override // androidx.lifecycle.x
        protected void d() {
            super.d();
            int j4 = this.f1730d.j();
            for (int i4 = 0; i4 < j4; i4++) {
                ((a) this.f1730d.k(i4)).o(true);
            }
            this.f1730d.b();
        }

        public void e(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
            if (this.f1730d.j() > 0) {
                printWriter.print(str);
                printWriter.println("Loaders:");
                String str2 = str + "    ";
                for (int i4 = 0; i4 < this.f1730d.j(); i4++) {
                    a aVar = (a) this.f1730d.k(i4);
                    printWriter.print(str);
                    printWriter.print("  #");
                    printWriter.print(this.f1730d.h(i4));
                    printWriter.print(": ");
                    printWriter.println(aVar.toString());
                    aVar.p(str2, fileDescriptor, printWriter, strArr);
                }
            }
        }

        void f() {
            this.f1731e = false;
        }

        a h(int i4) {
            return (a) this.f1730d.f(i4);
        }

        boolean i() {
            return this.f1731e;
        }

        void j() {
            int j4 = this.f1730d.j();
            for (int i4 = 0; i4 < j4; i4++) {
                ((a) this.f1730d.k(i4)).r();
            }
        }

        void k(int i4, a aVar) {
            this.f1730d.i(i4, aVar);
        }

        void l() {
            this.f1731e = true;
        }
    }

    b(k kVar, a0 a0Var) {
        this.f1718a = kVar;
        this.f1719b = c.g(a0Var);
    }

    private y.b e(int i4, Bundle bundle, a.InterfaceC0024a interfaceC0024a, y.b bVar) {
        try {
            this.f1719b.l();
            y.b c4 = interfaceC0024a.c(i4, bundle);
            if (c4 == null) {
                throw new IllegalArgumentException("Object returned from onCreateLoader must not be null");
            }
            if (c4.getClass().isMemberClass() && !Modifier.isStatic(c4.getClass().getModifiers())) {
                throw new IllegalArgumentException("Object returned from onCreateLoader must not be a non-static inner member class: " + c4);
            }
            a aVar = new a(i4, bundle, c4, bVar);
            if (f1717c) {
                Log.v("LoaderManager", "  Created new loader " + aVar);
            }
            this.f1719b.k(i4, aVar);
            this.f1719b.f();
            return aVar.s(this.f1718a, interfaceC0024a);
        } catch (Throwable th) {
            this.f1719b.f();
            throw th;
        }
    }

    @Override // androidx.loader.app.a
    public void a(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        this.f1719b.e(str, fileDescriptor, printWriter, strArr);
    }

    @Override // androidx.loader.app.a
    public y.b c(int i4, Bundle bundle, a.InterfaceC0024a interfaceC0024a) {
        if (this.f1719b.i()) {
            throw new IllegalStateException("Called while creating a loader");
        }
        if (Looper.getMainLooper() != Looper.myLooper()) {
            throw new IllegalStateException(c3.d4(677));
        }
        a h4 = this.f1719b.h(i4);
        if (f1717c) {
            Log.v("LoaderManager", "initLoader in " + this + ": args=" + bundle);
        }
        if (h4 == null) {
            return e(i4, bundle, interfaceC0024a, null);
        }
        if (f1717c) {
            Log.v("LoaderManager", "  Re-using existing loader " + h4);
        }
        return h4.s(this.f1718a, interfaceC0024a);
    }

    @Override // androidx.loader.app.a
    public void d() {
        this.f1719b.j();
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(128);
        sb.append("LoaderManager{");
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        sb.append(c3.d4(513));
        Class<?> cls = this.f1718a.getClass();
        sb.append(cls.getSimpleName());
        sb.append(c3.d4(190));
        sb.append(Integer.toHexString(System.identityHashCode(cls)));
        sb.append("}}");
        return sb.toString();
    }
}
