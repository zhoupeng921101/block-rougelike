package androidx.lifecycle;

import a1.b2.c3;
import androidx.lifecycle.g;
import j.b;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class l extends g {

    /* renamed from: b, reason: collision with root package name */
    private j.a f1668b;

    /* renamed from: c, reason: collision with root package name */
    private g.c f1669c;

    /* renamed from: d, reason: collision with root package name */
    private final WeakReference f1670d;

    /* renamed from: e, reason: collision with root package name */
    private int f1671e;

    /* renamed from: f, reason: collision with root package name */
    private boolean f1672f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f1673g;

    /* renamed from: h, reason: collision with root package name */
    private ArrayList f1674h;

    /* renamed from: i, reason: collision with root package name */
    private final boolean f1675i;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {

        /* renamed from: a, reason: collision with root package name */
        g.c f1676a;

        /* renamed from: b, reason: collision with root package name */
        i f1677b;

        a(j jVar, g.c cVar) {
            this.f1677b = m.f(jVar);
            this.f1676a = cVar;
        }

        void a(k kVar, g.b bVar) {
            g.c b4 = bVar.b();
            this.f1676a = l.k(this.f1676a, b4);
            this.f1677b.g(kVar, bVar);
            this.f1676a = b4;
        }
    }

    public l(k kVar) {
        this(kVar, true);
    }

    private l(k kVar, boolean z3) {
        this.f1668b = new j.a();
        this.f1671e = 0;
        this.f1672f = false;
        this.f1673g = false;
        this.f1674h = new ArrayList();
        this.f1670d = new WeakReference(kVar);
        this.f1669c = g.c.INITIALIZED;
        this.f1675i = z3;
    }

    private void d(k kVar) {
        Iterator descendingIterator = this.f1668b.descendingIterator();
        while (descendingIterator.hasNext() && !this.f1673g) {
            Map.Entry entry = (Map.Entry) descendingIterator.next();
            a aVar = (a) entry.getValue();
            while (aVar.f1676a.compareTo(this.f1669c) > 0 && !this.f1673g && this.f1668b.contains((j) entry.getKey())) {
                g.b a4 = g.b.a(aVar.f1676a);
                if (a4 == null) {
                    throw new IllegalStateException("no event down from " + aVar.f1676a);
                }
                n(a4.b());
                aVar.a(kVar, a4);
                m();
            }
        }
    }

    private g.c e(j jVar) {
        Map.Entry k4 = this.f1668b.k(jVar);
        g.c cVar = null;
        g.c cVar2 = k4 != null ? ((a) k4.getValue()).f1676a : null;
        if (!this.f1674h.isEmpty()) {
            cVar = (g.c) this.f1674h.get(r0.size() - 1);
        }
        return k(k(this.f1669c, cVar2), cVar);
    }

    private void f(String str) {
        if (!this.f1675i || i.a.d().b()) {
            return;
        }
        throw new IllegalStateException("Method " + str + c3.d4(1485));
    }

    private void g(k kVar) {
        b.d f4 = this.f1668b.f();
        while (f4.hasNext() && !this.f1673g) {
            Map.Entry entry = (Map.Entry) f4.next();
            a aVar = (a) entry.getValue();
            while (aVar.f1676a.compareTo(this.f1669c) < 0 && !this.f1673g && this.f1668b.contains((j) entry.getKey())) {
                n(aVar.f1676a);
                g.b c4 = g.b.c(aVar.f1676a);
                if (c4 == null) {
                    throw new IllegalStateException(c3.d4(722) + aVar.f1676a);
                }
                aVar.a(kVar, c4);
                m();
            }
        }
    }

    private boolean i() {
        if (this.f1668b.size() == 0) {
            return true;
        }
        g.c cVar = ((a) this.f1668b.a().getValue()).f1676a;
        g.c cVar2 = ((a) this.f1668b.g().getValue()).f1676a;
        return cVar == cVar2 && this.f1669c == cVar2;
    }

    static g.c k(g.c cVar, g.c cVar2) {
        return (cVar2 == null || cVar2.compareTo(cVar) >= 0) ? cVar : cVar2;
    }

    private void l(g.c cVar) {
        g.c cVar2 = this.f1669c;
        if (cVar2 == cVar) {
            return;
        }
        if (cVar2 == g.c.INITIALIZED && cVar == g.c.f1661e) {
            throw new IllegalStateException("no event down from " + this.f1669c);
        }
        this.f1669c = cVar;
        if (this.f1672f || this.f1671e != 0) {
            this.f1673g = true;
            return;
        }
        this.f1672f = true;
        p();
        this.f1672f = false;
        if (this.f1669c == g.c.f1661e) {
            this.f1668b = new j.a();
        }
    }

    private void m() {
        this.f1674h.remove(r0.size() - 1);
    }

    private void n(g.c cVar) {
        this.f1674h.add(cVar);
    }

    private void p() {
        k kVar = (k) this.f1670d.get();
        if (kVar == null) {
            throw new IllegalStateException("LifecycleOwner of this LifecycleRegistry is alreadygarbage collected. It is too late to change lifecycle state.");
        }
        while (!i()) {
            this.f1673g = false;
            if (this.f1669c.compareTo(((a) this.f1668b.a().getValue()).f1676a) < 0) {
                d(kVar);
            }
            Map.Entry g4 = this.f1668b.g();
            if (!this.f1673g && g4 != null && this.f1669c.compareTo(((a) g4.getValue()).f1676a) > 0) {
                g(kVar);
            }
        }
        this.f1673g = false;
    }

    @Override // androidx.lifecycle.g
    public void a(j jVar) {
        k kVar;
        f("addObserver");
        g.c cVar = this.f1669c;
        g.c cVar2 = g.c.f1661e;
        if (cVar != cVar2) {
            cVar2 = g.c.INITIALIZED;
        }
        a aVar = new a(jVar, cVar2);
        if (((a) this.f1668b.i(jVar, aVar)) == null && (kVar = (k) this.f1670d.get()) != null) {
            boolean z3 = this.f1671e != 0 || this.f1672f;
            g.c e4 = e(jVar);
            this.f1671e++;
            while (aVar.f1676a.compareTo(e4) < 0 && this.f1668b.contains(jVar)) {
                n(aVar.f1676a);
                g.b c4 = g.b.c(aVar.f1676a);
                if (c4 == null) {
                    throw new IllegalStateException("no event up from " + aVar.f1676a);
                }
                aVar.a(kVar, c4);
                m();
                e4 = e(jVar);
            }
            if (!z3) {
                p();
            }
            this.f1671e--;
        }
    }

    @Override // androidx.lifecycle.g
    public g.c b() {
        return this.f1669c;
    }

    @Override // androidx.lifecycle.g
    public void c(j jVar) {
        f("removeObserver");
        this.f1668b.j(jVar);
    }

    public void h(g.b bVar) {
        f("handleLifecycleEvent");
        l(bVar.b());
    }

    public void j(g.c cVar) {
        f("markState");
        o(cVar);
    }

    public void o(g.c cVar) {
        f("setCurrentState");
        l(cVar);
    }
}
