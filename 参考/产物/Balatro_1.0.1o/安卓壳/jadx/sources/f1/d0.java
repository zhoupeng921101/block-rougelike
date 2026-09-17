package f1;

import a1.b2.c3;
import android.os.Bundle;
import android.os.DeadObjectException;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import com.google.android.gms.common.api.Status;
import e1.a;
import e1.f;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d0 implements f.a, f.b {

    /* renamed from: b, reason: collision with root package name */
    private final a.f f3219b;

    /* renamed from: c, reason: collision with root package name */
    private final b f3220c;

    /* renamed from: d, reason: collision with root package name */
    private final u f3221d;

    /* renamed from: g, reason: collision with root package name */
    private final int f3224g;

    /* renamed from: h, reason: collision with root package name */
    private final s0 f3225h;

    /* renamed from: i, reason: collision with root package name */
    private boolean f3226i;

    /* renamed from: m, reason: collision with root package name */
    final /* synthetic */ f f3230m;

    /* renamed from: a, reason: collision with root package name */
    private final Queue f3218a = new LinkedList();

    /* renamed from: e, reason: collision with root package name */
    private final Set f3222e = new HashSet();

    /* renamed from: f, reason: collision with root package name */
    private final Map f3223f = new HashMap();

    /* renamed from: j, reason: collision with root package name */
    private final List f3227j = new ArrayList();

    /* renamed from: k, reason: collision with root package name */
    private d1.a f3228k = null;

    /* renamed from: l, reason: collision with root package name */
    private int f3229l = 0;

    public d0(f fVar, e1.e eVar) {
        this.f3230m = fVar;
        a.f q3 = eVar.q(fVar.f3252n.getLooper(), this);
        this.f3219b = q3;
        this.f3220c = eVar.k();
        this.f3221d = new u();
        this.f3224g = eVar.p();
        if (q3.m()) {
            this.f3225h = eVar.r(fVar.f3243e, fVar.f3252n);
        } else {
            this.f3225h = null;
        }
    }

    static /* bridge */ /* synthetic */ void B(d0 d0Var, f0 f0Var) {
        if (d0Var.f3227j.contains(f0Var) && !d0Var.f3226i) {
            if (d0Var.f3219b.a()) {
                d0Var.j();
            } else {
                d0Var.E();
            }
        }
    }

    static /* bridge */ /* synthetic */ void C(d0 d0Var, f0 f0Var) {
        d1.c cVar;
        d1.c[] g4;
        if (d0Var.f3227j.remove(f0Var)) {
            d0Var.f3230m.f3252n.removeMessages(15, f0Var);
            d0Var.f3230m.f3252n.removeMessages(16, f0Var);
            cVar = f0Var.f3255b;
            ArrayList arrayList = new ArrayList(d0Var.f3218a.size());
            for (z0 z0Var : d0Var.f3218a) {
                if ((z0Var instanceof l0) && (g4 = ((l0) z0Var).g(d0Var)) != null && com.google.android.gms.common.util.b.b(g4, cVar)) {
                    arrayList.add(z0Var);
                }
            }
            int size = arrayList.size();
            for (int i4 = 0; i4 < size; i4++) {
                z0 z0Var2 = (z0) arrayList.get(i4);
                d0Var.f3218a.remove(z0Var2);
                z0Var2.b(new e1.l(cVar));
            }
        }
    }

    private final d1.c d(d1.c[] cVarArr) {
        if (cVarArr != null && cVarArr.length != 0) {
            d1.c[] h4 = this.f3219b.h();
            if (h4 == null) {
                h4 = new d1.c[0];
            }
            k.a aVar = new k.a(h4.length);
            for (d1.c cVar : h4) {
                aVar.put(cVar.i0(), Long.valueOf(cVar.j0()));
            }
            for (d1.c cVar2 : cVarArr) {
                Long l3 = (Long) aVar.get(cVar2.i0());
                if (l3 == null || l3.longValue() < cVar2.j0()) {
                    return cVar2;
                }
            }
        }
        return null;
    }

    private final void e(d1.a aVar) {
        Iterator it = this.f3222e.iterator();
        if (!it.hasNext()) {
            this.f3222e.clear();
            return;
        }
        h.d.a(it.next());
        if (h1.o.a(aVar, d1.a.f3079j)) {
            this.f3219b.i();
        }
        throw null;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void f(Status status) {
        h1.q.d(this.f3230m.f3252n);
        g(status, null, false);
    }

    private final void g(Status status, Exception exc, boolean z3) {
        h1.q.d(this.f3230m.f3252n);
        if ((status == null) == (exc == null)) {
            throw new IllegalArgumentException("Status XOR exception should be null");
        }
        Iterator it = this.f3218a.iterator();
        while (it.hasNext()) {
            z0 z0Var = (z0) it.next();
            if (!z3 || z0Var.f3327a == 2) {
                if (status != null) {
                    z0Var.a(status);
                } else {
                    z0Var.b(exc);
                }
                it.remove();
            }
        }
    }

    private final void j() {
        ArrayList arrayList = new ArrayList(this.f3218a);
        int size = arrayList.size();
        for (int i4 = 0; i4 < size; i4++) {
            z0 z0Var = (z0) arrayList.get(i4);
            if (!this.f3219b.a()) {
                return;
            }
            if (p(z0Var)) {
                this.f3218a.remove(z0Var);
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void k() {
        D();
        e(d1.a.f3079j);
        o();
        Iterator it = this.f3223f.values().iterator();
        if (it.hasNext()) {
            h.d.a(it.next());
            throw null;
        }
        j();
        m();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void l(int i4) {
        D();
        this.f3226i = true;
        this.f3221d.e(i4, this.f3219b.j());
        b bVar = this.f3220c;
        f fVar = this.f3230m;
        fVar.f3252n.sendMessageDelayed(Message.obtain(fVar.f3252n, 9, bVar), 5000L);
        b bVar2 = this.f3220c;
        f fVar2 = this.f3230m;
        fVar2.f3252n.sendMessageDelayed(Message.obtain(fVar2.f3252n, 11, bVar2), 120000L);
        this.f3230m.f3245g.c();
        Iterator it = this.f3223f.values().iterator();
        if (it.hasNext()) {
            h.d.a(it.next());
            throw null;
        }
    }

    private final void m() {
        this.f3230m.f3252n.removeMessages(12, this.f3220c);
        b bVar = this.f3220c;
        f fVar = this.f3230m;
        fVar.f3252n.sendMessageDelayed(fVar.f3252n.obtainMessage(12, bVar), this.f3230m.f3239a);
    }

    private final void n(z0 z0Var) {
        z0Var.d(this.f3221d, b());
        try {
            z0Var.c(this);
        } catch (DeadObjectException unused) {
            a(1);
            this.f3219b.c("DeadObjectException thrown while running ApiCallRunner.");
        }
    }

    private final void o() {
        if (this.f3226i) {
            f fVar = this.f3230m;
            fVar.f3252n.removeMessages(11, this.f3220c);
            f fVar2 = this.f3230m;
            fVar2.f3252n.removeMessages(9, this.f3220c);
            this.f3226i = false;
        }
    }

    private final boolean p(z0 z0Var) {
        if (!(z0Var instanceof l0)) {
            n(z0Var);
            return true;
        }
        l0 l0Var = (l0) z0Var;
        d1.c d4 = d(l0Var.g(this));
        if (d4 == null) {
            n(z0Var);
            return true;
        }
        Log.w("GoogleApiManager", this.f3219b.getClass().getName() + c3.d4(794) + d4.i0() + ", " + d4.j0() + ").");
        if (!this.f3230m.f3253o || !l0Var.f(this)) {
            l0Var.b(new e1.l(d4));
            return true;
        }
        f0 f0Var = new f0(this.f3220c, d4, null);
        int indexOf = this.f3227j.indexOf(f0Var);
        if (indexOf >= 0) {
            f0 f0Var2 = (f0) this.f3227j.get(indexOf);
            this.f3230m.f3252n.removeMessages(15, f0Var2);
            f fVar = this.f3230m;
            fVar.f3252n.sendMessageDelayed(Message.obtain(fVar.f3252n, 15, f0Var2), 5000L);
            return false;
        }
        this.f3227j.add(f0Var);
        f fVar2 = this.f3230m;
        fVar2.f3252n.sendMessageDelayed(Message.obtain(fVar2.f3252n, 15, f0Var), 5000L);
        f fVar3 = this.f3230m;
        fVar3.f3252n.sendMessageDelayed(Message.obtain(fVar3.f3252n, 16, f0Var), 120000L);
        d1.a aVar = new d1.a(2, null);
        if (q(aVar)) {
            return false;
        }
        this.f3230m.f(aVar, this.f3224g);
        return false;
    }

    private final boolean q(d1.a aVar) {
        synchronized (f.f3237r) {
            try {
                f fVar = this.f3230m;
                if (fVar.f3249k == null || !fVar.f3250l.contains(this.f3220c)) {
                    return false;
                }
                this.f3230m.f3249k.s(aVar, this.f3224g);
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    private final boolean r(boolean z3) {
        h1.q.d(this.f3230m.f3252n);
        if (!this.f3219b.a() || !this.f3223f.isEmpty()) {
            return false;
        }
        if (!this.f3221d.g()) {
            this.f3219b.c("Timing out service connection.");
            return true;
        }
        if (!z3) {
            return false;
        }
        m();
        return false;
    }

    public final void D() {
        h1.q.d(this.f3230m.f3252n);
        this.f3228k = null;
    }

    public final void E() {
        h1.q.d(this.f3230m.f3252n);
        if (this.f3219b.a() || this.f3219b.g()) {
            return;
        }
        try {
            f fVar = this.f3230m;
            int b4 = fVar.f3245g.b(fVar.f3243e, this.f3219b);
            if (b4 == 0) {
                f fVar2 = this.f3230m;
                a.f fVar3 = this.f3219b;
                h0 h0Var = new h0(fVar2, fVar3, this.f3220c);
                if (fVar3.m()) {
                    ((s0) h1.q.i(this.f3225h)).p0(h0Var);
                }
                try {
                    this.f3219b.p(h0Var);
                    return;
                } catch (SecurityException e4) {
                    H(new d1.a(10), e4);
                    return;
                }
            }
            d1.a aVar = new d1.a(b4, null);
            Log.w("GoogleApiManager", "The service for " + this.f3219b.getClass().getName() + " is not available: " + aVar.toString());
            H(aVar, null);
        } catch (IllegalStateException e5) {
            H(new d1.a(10), e5);
        }
    }

    public final void F(z0 z0Var) {
        h1.q.d(this.f3230m.f3252n);
        if (this.f3219b.a()) {
            if (p(z0Var)) {
                m();
                return;
            } else {
                this.f3218a.add(z0Var);
                return;
            }
        }
        this.f3218a.add(z0Var);
        d1.a aVar = this.f3228k;
        if (aVar == null || !aVar.l0()) {
            E();
        } else {
            H(this.f3228k, null);
        }
    }

    final void G() {
        this.f3229l++;
    }

    public final void H(d1.a aVar, Exception exc) {
        h1.q.d(this.f3230m.f3252n);
        s0 s0Var = this.f3225h;
        if (s0Var != null) {
            s0Var.q0();
        }
        D();
        this.f3230m.f3245g.c();
        e(aVar);
        if ((this.f3219b instanceof j1.e) && aVar.i0() != 24) {
            this.f3230m.f3240b = true;
            f fVar = this.f3230m;
            fVar.f3252n.sendMessageDelayed(fVar.f3252n.obtainMessage(19), 300000L);
        }
        if (aVar.i0() == 4) {
            f(f.f3236q);
            return;
        }
        if (this.f3218a.isEmpty()) {
            this.f3228k = aVar;
            return;
        }
        if (exc != null) {
            h1.q.d(this.f3230m.f3252n);
            g(null, exc, false);
            return;
        }
        if (!this.f3230m.f3253o) {
            f(f.g(this.f3220c, aVar));
            return;
        }
        g(f.g(this.f3220c, aVar), null, true);
        if (this.f3218a.isEmpty() || q(aVar) || this.f3230m.f(aVar, this.f3224g)) {
            return;
        }
        if (aVar.i0() == 18) {
            this.f3226i = true;
        }
        if (!this.f3226i) {
            f(f.g(this.f3220c, aVar));
            return;
        }
        f fVar2 = this.f3230m;
        fVar2.f3252n.sendMessageDelayed(Message.obtain(fVar2.f3252n, 9, this.f3220c), 5000L);
    }

    public final void I(d1.a aVar) {
        h1.q.d(this.f3230m.f3252n);
        a.f fVar = this.f3219b;
        fVar.c("onSignInFailed for " + fVar.getClass().getName() + " with " + String.valueOf(aVar));
        H(aVar, null);
    }

    public final void J() {
        h1.q.d(this.f3230m.f3252n);
        if (this.f3226i) {
            E();
        }
    }

    public final void K() {
        h1.q.d(this.f3230m.f3252n);
        f(f.f3235p);
        this.f3221d.f();
        for (j jVar : (j[]) this.f3223f.keySet().toArray(new j[0])) {
            F(new y0(null, new g2.i()));
        }
        e(new d1.a(4));
        if (this.f3219b.a()) {
            this.f3219b.n(new c0(this));
        }
    }

    public final void L() {
        h1.q.d(this.f3230m.f3252n);
        if (this.f3226i) {
            o();
            f fVar = this.f3230m;
            f(fVar.f3244f.f(fVar.f3243e) == 18 ? new Status(21, "Connection timed out waiting for Google Play services update to complete.") : new Status(22, "API failed to connect while resuming due to an unknown error."));
            this.f3219b.c("Timing out connection while resuming.");
        }
    }

    @Override // f1.e
    public final void a(int i4) {
        if (Looper.myLooper() == this.f3230m.f3252n.getLooper()) {
            l(i4);
        } else {
            this.f3230m.f3252n.post(new a0(this, i4));
        }
    }

    public final boolean b() {
        return this.f3219b.m();
    }

    public final boolean c() {
        return r(true);
    }

    @Override // f1.l
    public final void h(d1.a aVar) {
        H(aVar, null);
    }

    @Override // f1.e
    public final void i(Bundle bundle) {
        if (Looper.myLooper() == this.f3230m.f3252n.getLooper()) {
            k();
        } else {
            this.f3230m.f3252n.post(new z(this));
        }
    }

    public final int s() {
        return this.f3224g;
    }

    final int t() {
        return this.f3229l;
    }

    public final a.f v() {
        return this.f3219b;
    }

    public final Map x() {
        return this.f3223f;
    }
}
