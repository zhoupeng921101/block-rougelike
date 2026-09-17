package androidx.fragment.app;

import a1.b2.c3;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import androidx.core.os.b;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class l0 {

    /* renamed from: a, reason: collision with root package name */
    private final ViewGroup f1519a;

    /* renamed from: b, reason: collision with root package name */
    final ArrayList f1520b = new ArrayList();

    /* renamed from: c, reason: collision with root package name */
    final ArrayList f1521c = new ArrayList();

    /* renamed from: d, reason: collision with root package name */
    boolean f1522d = false;

    /* renamed from: e, reason: collision with root package name */
    boolean f1523e = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ d f1524e;

        a(d dVar) {
            this.f1524e = dVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (l0.this.f1520b.contains(this.f1524e)) {
                this.f1524e.e().a(this.f1524e.f().I);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ d f1526e;

        b(d dVar) {
            this.f1526e = dVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            l0.this.f1520b.remove(this.f1526e);
            l0.this.f1521c.remove(this.f1526e);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class c {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f1528a;

        /* renamed from: b, reason: collision with root package name */
        static final /* synthetic */ int[] f1529b;

        static {
            int[] iArr = new int[e.b.values().length];
            f1529b = iArr;
            try {
                iArr[e.b.ADDING.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f1529b[e.b.f1541g.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f1529b[e.b.NONE.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            int[] iArr2 = new int[e.c.values().length];
            f1528a = iArr2;
            try {
                iArr2[e.c.REMOVED.ordinal()] = 1;
            } catch (NoSuchFieldError unused4) {
            }
            try {
                f1528a[e.c.VISIBLE.ordinal()] = 2;
            } catch (NoSuchFieldError unused5) {
            }
            try {
                f1528a[e.c.GONE.ordinal()] = 3;
            } catch (NoSuchFieldError unused6) {
            }
            try {
                f1528a[e.c.INVISIBLE.ordinal()] = 4;
            } catch (NoSuchFieldError unused7) {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class d extends e {

        /* renamed from: h, reason: collision with root package name */
        private final d0 f1530h;

        d(e.c cVar, e.b bVar, d0 d0Var, androidx.core.os.b bVar2) {
            super(cVar, bVar, d0Var.k(), bVar2);
            this.f1530h = d0Var;
        }

        @Override // androidx.fragment.app.l0.e
        public void c() {
            super.c();
            this.f1530h.m();
        }

        @Override // androidx.fragment.app.l0.e
        void l() {
            e.b g4 = g();
            e.b bVar = e.b.ADDING;
            String d4 = c3.d4(559);
            if (g4 != bVar) {
                if (g() == e.b.f1541g) {
                    Fragment k4 = this.f1530h.k();
                    View o12 = k4.o1();
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "Clearing focus " + o12.findFocus() + " on view " + o12 + d4 + k4);
                    }
                    o12.clearFocus();
                    return;
                }
                return;
            }
            Fragment k5 = this.f1530h.k();
            View findFocus = k5.I.findFocus();
            if (findFocus != null) {
                k5.u1(findFocus);
                if (x.G0(2)) {
                    Log.v("FragmentManager", "requestFocus: Saved focused view " + findFocus + d4 + k5);
                }
            }
            View o13 = f().o1();
            if (o13.getParent() == null) {
                this.f1530h.b();
                o13.setAlpha(0.0f);
            }
            if (o13.getAlpha() == 0.0f && o13.getVisibility() == 0) {
                o13.setVisibility(4);
            }
            o13.setAlpha(k5.K());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class e {

        /* renamed from: a, reason: collision with root package name */
        private c f1531a;

        /* renamed from: b, reason: collision with root package name */
        private b f1532b;

        /* renamed from: c, reason: collision with root package name */
        private final Fragment f1533c;

        /* renamed from: d, reason: collision with root package name */
        private final List f1534d = new ArrayList();

        /* renamed from: e, reason: collision with root package name */
        private final HashSet f1535e = new HashSet();

        /* renamed from: f, reason: collision with root package name */
        private boolean f1536f = false;

        /* renamed from: g, reason: collision with root package name */
        private boolean f1537g = false;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements b.InterfaceC0009b {
            a() {
            }

            @Override // androidx.core.os.b.InterfaceC0009b
            public void onCancel() {
                e.this.b();
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        enum b {
            NONE,
            ADDING,
            f1541g
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        enum c {
            REMOVED,
            VISIBLE,
            GONE,
            INVISIBLE;

            static c b(int i4) {
                if (i4 == 0) {
                    return VISIBLE;
                }
                if (i4 == 4) {
                    return INVISIBLE;
                }
                if (i4 == 8) {
                    return GONE;
                }
                throw new IllegalArgumentException("Unknown visibility " + i4);
            }

            static c c(View view) {
                return (view.getAlpha() == 0.0f && view.getVisibility() == 0) ? INVISIBLE : b(view.getVisibility());
            }

            void a(View view) {
                int i4 = c.f1528a[ordinal()];
                if (i4 == 1) {
                    ViewGroup viewGroup = (ViewGroup) view.getParent();
                    if (viewGroup != null) {
                        if (x.G0(2)) {
                            Log.v("FragmentManager", c3.d4(418) + view + c3.d4(1268) + viewGroup);
                        }
                        viewGroup.removeView(view);
                        return;
                    }
                    return;
                }
                if (i4 == 2) {
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "SpecialEffectsController: Setting view " + view + " to VISIBLE");
                    }
                    view.setVisibility(0);
                    return;
                }
                if (i4 == 3) {
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "SpecialEffectsController: Setting view " + view + " to GONE");
                    }
                    view.setVisibility(8);
                    return;
                }
                if (i4 != 4) {
                    return;
                }
                if (x.G0(2)) {
                    Log.v("FragmentManager", "SpecialEffectsController: Setting view " + view + " to INVISIBLE");
                }
                view.setVisibility(4);
            }
        }

        e(c cVar, b bVar, Fragment fragment, androidx.core.os.b bVar2) {
            this.f1531a = cVar;
            this.f1532b = bVar;
            this.f1533c = fragment;
            bVar2.b(new a());
        }

        final void a(Runnable runnable) {
            this.f1534d.add(runnable);
        }

        final void b() {
            if (h()) {
                return;
            }
            this.f1536f = true;
            if (this.f1535e.isEmpty()) {
                c();
                return;
            }
            ArrayList arrayList = new ArrayList(this.f1535e);
            int size = arrayList.size();
            int i4 = 0;
            while (i4 < size) {
                Object obj = arrayList.get(i4);
                i4++;
                ((androidx.core.os.b) obj).a();
            }
        }

        public void c() {
            if (this.f1537g) {
                return;
            }
            if (x.G0(2)) {
                Log.v("FragmentManager", c3.d4(470) + this + " has called complete.");
            }
            this.f1537g = true;
            Iterator it = this.f1534d.iterator();
            while (it.hasNext()) {
                ((Runnable) it.next()).run();
            }
        }

        public final void d(androidx.core.os.b bVar) {
            if (this.f1535e.remove(bVar) && this.f1535e.isEmpty()) {
                c();
            }
        }

        public c e() {
            return this.f1531a;
        }

        public final Fragment f() {
            return this.f1533c;
        }

        b g() {
            return this.f1532b;
        }

        final boolean h() {
            return this.f1536f;
        }

        final boolean i() {
            return this.f1537g;
        }

        public final void j(androidx.core.os.b bVar) {
            l();
            this.f1535e.add(bVar);
        }

        final void k(c cVar, b bVar) {
            int i4 = c.f1529b[bVar.ordinal()];
            String d4 = c3.d4(55);
            if (i4 == 1) {
                if (this.f1531a == c.REMOVED) {
                    if (x.G0(2)) {
                        Log.v("FragmentManager", d4 + this.f1533c + " mFinalState = REMOVED -> VISIBLE. mLifecycleImpact = " + this.f1532b + " to ADDING.");
                    }
                    this.f1531a = c.VISIBLE;
                    this.f1532b = b.ADDING;
                    return;
                }
                return;
            }
            if (i4 == 2) {
                if (x.G0(2)) {
                    Log.v("FragmentManager", d4 + this.f1533c + " mFinalState = " + this.f1531a + c3.d4(366) + this.f1532b + " to REMOVING.");
                }
                this.f1531a = c.REMOVED;
                this.f1532b = b.f1541g;
                return;
            }
            if (i4 == 3 && this.f1531a != c.REMOVED) {
                if (x.G0(2)) {
                    Log.v("FragmentManager", d4 + this.f1533c + " mFinalState = " + this.f1531a + " -> " + cVar + ". ");
                }
                this.f1531a = cVar;
            }
        }

        abstract void l();

        public String toString() {
            return "Operation {" + Integer.toHexString(System.identityHashCode(this)) + "} {mFinalState = " + this.f1531a + "} {mLifecycleImpact = " + this.f1532b + "} {" + c3.d4(1063) + this.f1533c + "}";
        }
    }

    l0(ViewGroup viewGroup) {
        this.f1519a = viewGroup;
    }

    private void a(e.c cVar, e.b bVar, d0 d0Var) {
        synchronized (this.f1520b) {
            try {
                androidx.core.os.b bVar2 = new androidx.core.os.b();
                e h4 = h(d0Var.k());
                if (h4 != null) {
                    h4.k(cVar, bVar);
                    return;
                }
                d dVar = new d(cVar, bVar, d0Var, bVar2);
                this.f1520b.add(dVar);
                dVar.a(new a(dVar));
                dVar.a(new b(dVar));
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    private e h(Fragment fragment) {
        ArrayList arrayList = this.f1520b;
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            e eVar = (e) obj;
            if (eVar.f().equals(fragment) && !eVar.h()) {
                return eVar;
            }
        }
        return null;
    }

    private e i(Fragment fragment) {
        ArrayList arrayList = this.f1521c;
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            e eVar = (e) obj;
            if (eVar.f().equals(fragment) && !eVar.h()) {
                return eVar;
            }
        }
        return null;
    }

    static l0 n(ViewGroup viewGroup, x xVar) {
        return o(viewGroup, xVar.y0());
    }

    static l0 o(ViewGroup viewGroup, m0 m0Var) {
        Object tag = viewGroup.getTag(u.b.f5008b);
        if (tag instanceof l0) {
            return (l0) tag;
        }
        l0 a4 = m0Var.a(viewGroup);
        viewGroup.setTag(u.b.f5008b, a4);
        return a4;
    }

    private void q() {
        ArrayList arrayList = this.f1520b;
        int size = arrayList.size();
        int i4 = 0;
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            e eVar = (e) obj;
            if (eVar.g() == e.b.ADDING) {
                eVar.k(e.c.b(eVar.f().o1().getVisibility()), e.b.NONE);
            }
        }
    }

    void b(e.c cVar, d0 d0Var) {
        if (x.G0(2)) {
            Log.v("FragmentManager", "SpecialEffectsController: Enqueuing add operation for fragment " + d0Var.k());
        }
        a(cVar, e.b.ADDING, d0Var);
    }

    void c(d0 d0Var) {
        if (x.G0(2)) {
            Log.v("FragmentManager", c3.d4(419) + d0Var.k());
        }
        a(e.c.GONE, e.b.NONE, d0Var);
    }

    void d(d0 d0Var) {
        if (x.G0(2)) {
            Log.v("FragmentManager", "SpecialEffectsController: Enqueuing remove operation for fragment " + d0Var.k());
        }
        a(e.c.REMOVED, e.b.f1541g, d0Var);
    }

    void e(d0 d0Var) {
        if (x.G0(2)) {
            Log.v(c3.d4(721), c3.d4(327) + d0Var.k());
        }
        a(e.c.VISIBLE, e.b.NONE, d0Var);
    }

    abstract void f(List list, boolean z3);

    void g() {
        if (this.f1523e) {
            return;
        }
        if (!androidx.core.view.v.v(this.f1519a)) {
            j();
            this.f1522d = false;
            return;
        }
        synchronized (this.f1520b) {
            try {
                if (!this.f1520b.isEmpty()) {
                    ArrayList arrayList = new ArrayList(this.f1521c);
                    this.f1521c.clear();
                    int size = arrayList.size();
                    int i4 = 0;
                    while (i4 < size) {
                        Object obj = arrayList.get(i4);
                        i4++;
                        e eVar = (e) obj;
                        if (x.G0(2)) {
                            Log.v("FragmentManager", "SpecialEffectsController: Cancelling operation " + eVar);
                        }
                        eVar.b();
                        if (!eVar.i()) {
                            this.f1521c.add(eVar);
                        }
                    }
                    q();
                    ArrayList arrayList2 = new ArrayList(this.f1520b);
                    this.f1520b.clear();
                    this.f1521c.addAll(arrayList2);
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "SpecialEffectsController: Executing pending operations");
                    }
                    int size2 = arrayList2.size();
                    int i5 = 0;
                    while (i5 < size2) {
                        Object obj2 = arrayList2.get(i5);
                        i5++;
                        ((e) obj2).l();
                    }
                    f(arrayList2, this.f1522d);
                    this.f1522d = false;
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "SpecialEffectsController: Finished executing pending operations");
                    }
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    void j() {
        String str;
        String str2;
        if (x.G0(2)) {
            Log.v("FragmentManager", c3.d4(669));
        }
        boolean v3 = androidx.core.view.v.v(this.f1519a);
        synchronized (this.f1520b) {
            try {
                q();
                ArrayList arrayList = this.f1520b;
                int size = arrayList.size();
                int i4 = 0;
                int i5 = 0;
                while (i5 < size) {
                    Object obj = arrayList.get(i5);
                    i5++;
                    ((e) obj).l();
                }
                ArrayList arrayList2 = new ArrayList(this.f1521c);
                int size2 = arrayList2.size();
                int i6 = 0;
                while (i6 < size2) {
                    Object obj2 = arrayList2.get(i6);
                    i6++;
                    e eVar = (e) obj2;
                    if (x.G0(2)) {
                        StringBuilder sb = new StringBuilder();
                        sb.append("SpecialEffectsController: ");
                        if (v3) {
                            str2 = "";
                        } else {
                            str2 = "Container " + this.f1519a + " is not attached to window. ";
                        }
                        sb.append(str2);
                        sb.append("Cancelling running operation ");
                        sb.append(eVar);
                        Log.v("FragmentManager", sb.toString());
                    }
                    eVar.b();
                }
                ArrayList arrayList3 = new ArrayList(this.f1520b);
                int size3 = arrayList3.size();
                while (i4 < size3) {
                    Object obj3 = arrayList3.get(i4);
                    i4++;
                    e eVar2 = (e) obj3;
                    if (x.G0(2)) {
                        StringBuilder sb2 = new StringBuilder();
                        sb2.append("SpecialEffectsController: ");
                        if (v3) {
                            str = "";
                        } else {
                            str = "Container " + this.f1519a + " is not attached to window. ";
                        }
                        sb2.append(str);
                        sb2.append("Cancelling pending operation ");
                        sb2.append(eVar2);
                        Log.v("FragmentManager", sb2.toString());
                    }
                    eVar2.b();
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    void k() {
        if (this.f1523e) {
            if (x.G0(2)) {
                Log.v("FragmentManager", "SpecialEffectsController: Forcing postponed operations");
            }
            this.f1523e = false;
            g();
        }
    }

    e.b l(d0 d0Var) {
        e h4 = h(d0Var.k());
        e.b g4 = h4 != null ? h4.g() : null;
        e i4 = i(d0Var.k());
        return (i4 == null || !(g4 == null || g4 == e.b.NONE)) ? g4 : i4.g();
    }

    public ViewGroup m() {
        return this.f1519a;
    }

    void p() {
        synchronized (this.f1520b) {
            try {
                q();
                this.f1523e = false;
                int size = this.f1520b.size() - 1;
                while (true) {
                    if (size < 0) {
                        break;
                    }
                    e eVar = (e) this.f1520b.get(size);
                    e.c c4 = e.c.c(eVar.f().I);
                    e.c e4 = eVar.e();
                    e.c cVar = e.c.VISIBLE;
                    if (e4 == cVar && c4 != cVar) {
                        this.f1523e = eVar.f().c0();
                        break;
                    }
                    size--;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    void r(boolean z3) {
        this.f1522d = z3;
    }
}
