package androidx.lifecycle;

import a1.b2.c3;
import androidx.lifecycle.g;
import j.b;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class LiveData {

    /* renamed from: k, reason: collision with root package name */
    static final Object f1627k = new Object();

    /* renamed from: a, reason: collision with root package name */
    final Object f1628a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private j.b f1629b = new j.b();

    /* renamed from: c, reason: collision with root package name */
    int f1630c = 0;

    /* renamed from: d, reason: collision with root package name */
    private boolean f1631d;

    /* renamed from: e, reason: collision with root package name */
    private volatile Object f1632e;

    /* renamed from: f, reason: collision with root package name */
    volatile Object f1633f;

    /* renamed from: g, reason: collision with root package name */
    private int f1634g;

    /* renamed from: h, reason: collision with root package name */
    private boolean f1635h;

    /* renamed from: i, reason: collision with root package name */
    private boolean f1636i;

    /* renamed from: j, reason: collision with root package name */
    private final Runnable f1637j;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class LifecycleBoundObserver extends androidx.lifecycle.LiveData.c implements i {

        /* renamed from: e, reason: collision with root package name */
        final k f1638e;

        LifecycleBoundObserver(k kVar, p pVar) {
            super(pVar);
            this.f1638e = kVar;
        }

        @Override // androidx.lifecycle.i
        public void g(k kVar, g.b bVar) {
            g.c b4 = this.f1638e.q().b();
            if (b4 == g.c.f1661e) {
                LiveData.this.m(this.f1642a);
                return;
            }
            g.c cVar = null;
            while (cVar != b4) {
                h(k());
                cVar = b4;
                b4 = this.f1638e.q().b();
            }
        }

        void i() {
            this.f1638e.q().c(this);
        }

        boolean j(k kVar) {
            return this.f1638e == kVar;
        }

        boolean k() {
            return this.f1638e.q().b().a(g.c.STARTED);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            Object obj;
            synchronized (LiveData.this.f1628a) {
                obj = LiveData.this.f1633f;
                LiveData.this.f1633f = LiveData.f1627k;
            }
            LiveData.this.n(obj);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b extends c {
        b(p pVar) {
            super(pVar);
        }

        @Override // androidx.lifecycle.LiveData.c
        boolean k() {
            return true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private abstract class c {

        /* renamed from: a, reason: collision with root package name */
        final p f1642a;

        /* renamed from: b, reason: collision with root package name */
        boolean f1643b;

        /* renamed from: c, reason: collision with root package name */
        int f1644c = -1;

        c(p pVar) {
            this.f1642a = pVar;
        }

        void h(boolean z3) {
            if (z3 == this.f1643b) {
                return;
            }
            this.f1643b = z3;
            LiveData.this.c(z3 ? 1 : -1);
            if (this.f1643b) {
                LiveData.this.e(this);
            }
        }

        void i() {
        }

        boolean j(k kVar) {
            return false;
        }

        abstract boolean k();
    }

    public LiveData() {
        Object obj = f1627k;
        this.f1633f = obj;
        this.f1637j = new a();
        this.f1632e = obj;
        this.f1634g = -1;
    }

    static void b(String str) {
        if (i.a.d().b()) {
            return;
        }
        throw new IllegalStateException(c3.d4(972) + str + " on a background thread");
    }

    private void d(c cVar) {
        if (cVar.f1643b) {
            if (!cVar.k()) {
                cVar.h(false);
                return;
            }
            int i4 = cVar.f1644c;
            int i5 = this.f1634g;
            if (i4 >= i5) {
                return;
            }
            cVar.f1644c = i5;
            cVar.f1642a.a(this.f1632e);
        }
    }

    void c(int i4) {
        int i5 = this.f1630c;
        this.f1630c = i4 + i5;
        if (this.f1631d) {
            return;
        }
        this.f1631d = true;
        while (true) {
            try {
                int i6 = this.f1630c;
                if (i5 == i6) {
                    this.f1631d = false;
                    return;
                }
                boolean z3 = i5 == 0 && i6 > 0;
                boolean z4 = i5 > 0 && i6 == 0;
                if (z3) {
                    j();
                } else if (z4) {
                    k();
                }
                i5 = i6;
            } catch (Throwable th) {
                this.f1631d = false;
                throw th;
            }
        }
    }

    void e(c cVar) {
        if (this.f1635h) {
            this.f1636i = true;
            return;
        }
        this.f1635h = true;
        do {
            this.f1636i = false;
            if (cVar != null) {
                d(cVar);
                cVar = null;
            } else {
                b.d f4 = this.f1629b.f();
                while (f4.hasNext()) {
                    d((c) ((Map.Entry) f4.next()).getValue());
                    if (this.f1636i) {
                        break;
                    }
                }
            }
        } while (this.f1636i);
        this.f1635h = false;
    }

    public Object f() {
        Object obj = this.f1632e;
        if (obj != f1627k) {
            return obj;
        }
        return null;
    }

    public boolean g() {
        return this.f1630c > 0;
    }

    public void h(k kVar, p pVar) {
        b(c3.d4(146));
        if (kVar.q().b() == g.c.f1661e) {
            return;
        }
        LifecycleBoundObserver lifecycleBoundObserver = new LifecycleBoundObserver(kVar, pVar);
        c cVar = (c) this.f1629b.i(pVar, lifecycleBoundObserver);
        if (cVar != null && !cVar.j(kVar)) {
            throw new IllegalArgumentException(c3.d4(825));
        }
        if (cVar != null) {
            return;
        }
        kVar.q().a(lifecycleBoundObserver);
    }

    public void i(p pVar) {
        b("observeForever");
        b bVar = new b(pVar);
        c cVar = (c) this.f1629b.i(pVar, bVar);
        if (cVar instanceof LifecycleBoundObserver) {
            throw new IllegalArgumentException("Cannot add the same observer with different lifecycles");
        }
        if (cVar != null) {
            return;
        }
        bVar.h(true);
    }

    protected void j() {
    }

    protected void k() {
    }

    protected void l(Object obj) {
        boolean z3;
        synchronized (this.f1628a) {
            z3 = this.f1633f == f1627k;
            this.f1633f = obj;
        }
        if (z3) {
            i.a.d().c(this.f1637j);
        }
    }

    public void m(p pVar) {
        b("removeObserver");
        c cVar = (c) this.f1629b.j(pVar);
        if (cVar == null) {
            return;
        }
        cVar.i();
        cVar.h(false);
    }

    protected void n(Object obj) {
        b("setValue");
        this.f1634g++;
        this.f1632e = obj;
        e(null);
    }
}
