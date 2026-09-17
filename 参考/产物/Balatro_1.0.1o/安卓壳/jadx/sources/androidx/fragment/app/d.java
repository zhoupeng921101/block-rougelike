package androidx.fragment.app;

import a1.b2.c3;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.content.Context;
import android.graphics.Rect;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import androidx.core.os.b;
import androidx.fragment.app.k;
import androidx.fragment.app.l0;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class d extends l0 {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class a {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f1364a;

        static {
            int[] iArr = new int[l0.e.c.values().length];
            f1364a = iArr;
            try {
                iArr[l0.e.c.GONE.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f1364a[l0.e.c.INVISIBLE.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
            try {
                f1364a[l0.e.c.REMOVED.ordinal()] = 3;
            } catch (NoSuchFieldError unused3) {
            }
            try {
                f1364a[l0.e.c.VISIBLE.ordinal()] = 4;
            } catch (NoSuchFieldError unused4) {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ List f1365e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ l0.e f1366f;

        b(List list, l0.e eVar) {
            this.f1365e = list;
            this.f1366f = eVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (this.f1365e.contains(this.f1366f)) {
                this.f1365e.remove(this.f1366f);
                d.this.s(this.f1366f);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c extends AnimatorListenerAdapter {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ ViewGroup f1368a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ View f1369b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ boolean f1370c;

        /* renamed from: d, reason: collision with root package name */
        final /* synthetic */ l0.e f1371d;

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ k f1372e;

        c(ViewGroup viewGroup, View view, boolean z3, l0.e eVar, k kVar) {
            this.f1368a = viewGroup;
            this.f1369b = view;
            this.f1370c = z3;
            this.f1371d = eVar;
            this.f1372e = kVar;
        }

        @Override // android.animation.AnimatorListenerAdapter, android.animation.Animator.AnimatorListener
        public void onAnimationEnd(Animator animator) {
            this.f1368a.endViewTransition(this.f1369b);
            if (this.f1370c) {
                this.f1371d.e().a(this.f1369b);
            }
            this.f1372e.a();
            if (x.G0(2)) {
                Log.v("FragmentManager", "Animator from operation " + this.f1371d + c3.d4(558));
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.fragment.app.d$d, reason: collision with other inner class name */
    class C0018d implements b.InterfaceC0009b {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ Animator f1374a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ l0.e f1375b;

        C0018d(Animator animator, l0.e eVar) {
            this.f1374a = animator;
            this.f1375b = eVar;
        }

        @Override // androidx.core.os.b.InterfaceC0009b
        public void onCancel() {
            this.f1374a.end();
            if (x.G0(2)) {
                Log.v(c3.d4(1107), "Animator from operation " + this.f1375b + c3.d4(325));
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class e implements Animation.AnimationListener {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ l0.e f1377a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ ViewGroup f1378b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ View f1379c;

        /* renamed from: d, reason: collision with root package name */
        final /* synthetic */ k f1380d;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Runnable {
            a() {
            }

            @Override // java.lang.Runnable
            public void run() {
                e eVar = e.this;
                eVar.f1378b.endViewTransition(eVar.f1379c);
                e.this.f1380d.a();
            }
        }

        e(l0.e eVar, ViewGroup viewGroup, View view, k kVar) {
            this.f1377a = eVar;
            this.f1378b = viewGroup;
            this.f1379c = view;
            this.f1380d = kVar;
        }

        @Override // android.view.animation.Animation.AnimationListener
        public void onAnimationEnd(Animation animation) {
            this.f1378b.post(new a());
            if (x.G0(2)) {
                Log.v("FragmentManager", "Animation from operation " + this.f1377a + " has ended.");
            }
        }

        @Override // android.view.animation.Animation.AnimationListener
        public void onAnimationRepeat(Animation animation) {
        }

        @Override // android.view.animation.Animation.AnimationListener
        public void onAnimationStart(Animation animation) {
            if (x.G0(2)) {
                Log.v("FragmentManager", "Animation from operation " + this.f1377a + " has reached onAnimationStart.");
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class f implements b.InterfaceC0009b {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ View f1383a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ ViewGroup f1384b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ k f1385c;

        /* renamed from: d, reason: collision with root package name */
        final /* synthetic */ l0.e f1386d;

        f(View view, ViewGroup viewGroup, k kVar, l0.e eVar) {
            this.f1383a = view;
            this.f1384b = viewGroup;
            this.f1385c = kVar;
            this.f1386d = eVar;
        }

        @Override // androidx.core.os.b.InterfaceC0009b
        public void onCancel() {
            this.f1383a.clearAnimation();
            this.f1384b.endViewTransition(this.f1383a);
            this.f1385c.a();
            if (x.G0(2)) {
                Log.v("FragmentManager", "Animation from operation " + this.f1386d + " has been cancelled.");
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class g implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ l0.e f1388e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ l0.e f1389f;

        /* renamed from: g, reason: collision with root package name */
        final /* synthetic */ boolean f1390g;

        /* renamed from: h, reason: collision with root package name */
        final /* synthetic */ k.a f1391h;

        g(l0.e eVar, l0.e eVar2, boolean z3, k.a aVar) {
            this.f1388e = eVar;
            this.f1389f = eVar2;
            this.f1390g = z3;
            this.f1391h = aVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            g0.a(this.f1388e.f(), this.f1389f.f(), this.f1390g, this.f1391h, false);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class h implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ i0 f1393e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ View f1394f;

        /* renamed from: g, reason: collision with root package name */
        final /* synthetic */ Rect f1395g;

        h(i0 i0Var, View view, Rect rect) {
            this.f1393e = i0Var;
            this.f1394f = view;
            this.f1395g = rect;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f1393e.h(this.f1394f, this.f1395g);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class i implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ ArrayList f1397e;

        i(ArrayList arrayList) {
            this.f1397e = arrayList;
        }

        @Override // java.lang.Runnable
        public void run() {
            g0.d(this.f1397e, 4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class j implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ m f1399e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ l0.e f1400f;

        j(m mVar, l0.e eVar) {
            this.f1399e = mVar;
            this.f1400f = eVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f1399e.a();
            if (x.G0(2)) {
                Log.v("FragmentManager", "Transition for operation " + this.f1400f + c3.d4(506));
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class k extends l {

        /* renamed from: c, reason: collision with root package name */
        private boolean f1402c;

        /* renamed from: d, reason: collision with root package name */
        private boolean f1403d;

        /* renamed from: e, reason: collision with root package name */
        private k.a f1404e;

        k(l0.e eVar, androidx.core.os.b bVar, boolean z3) {
            super(eVar, bVar);
            this.f1403d = false;
            this.f1402c = z3;
        }

        k.a e(Context context) {
            if (this.f1403d) {
                return this.f1404e;
            }
            k.a b4 = androidx.fragment.app.k.b(context, b().f(), b().e() == l0.e.c.VISIBLE, this.f1402c);
            this.f1404e = b4;
            this.f1403d = true;
            return b4;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class l {

        /* renamed from: a, reason: collision with root package name */
        private final l0.e f1405a;

        /* renamed from: b, reason: collision with root package name */
        private final androidx.core.os.b f1406b;

        l(l0.e eVar, androidx.core.os.b bVar) {
            this.f1405a = eVar;
            this.f1406b = bVar;
        }

        void a() {
            this.f1405a.d(this.f1406b);
        }

        l0.e b() {
            return this.f1405a;
        }

        androidx.core.os.b c() {
            return this.f1406b;
        }

        boolean d() {
            l0.e.c c4 = l0.e.c.c(this.f1405a.f().I);
            l0.e.c e4 = this.f1405a.e();
            if (c4 == e4) {
                return true;
            }
            l0.e.c cVar = l0.e.c.VISIBLE;
            return (c4 == cVar || e4 == cVar) ? false : true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class m extends l {

        /* renamed from: c, reason: collision with root package name */
        private final Object f1407c;

        /* renamed from: d, reason: collision with root package name */
        private final boolean f1408d;

        /* renamed from: e, reason: collision with root package name */
        private final Object f1409e;

        m(l0.e eVar, androidx.core.os.b bVar, boolean z3, boolean z4) {
            super(eVar, bVar);
            if (eVar.e() == l0.e.c.VISIBLE) {
                this.f1407c = z3 ? eVar.f().L() : eVar.f().v();
                this.f1408d = z3 ? eVar.f().n() : eVar.f().m();
            } else {
                this.f1407c = z3 ? eVar.f().N() : eVar.f().y();
                this.f1408d = true;
            }
            if (!z4) {
                this.f1409e = null;
            } else if (z3) {
                this.f1409e = eVar.f().P();
            } else {
                this.f1409e = eVar.f().O();
            }
        }

        private i0 f(Object obj) {
            if (obj == null) {
                return null;
            }
            i0 i0Var = g0.f1474a;
            if (i0Var != null && i0Var.e(obj)) {
                return i0Var;
            }
            i0 i0Var2 = g0.f1475b;
            if (i0Var2 != null && i0Var2.e(obj)) {
                return i0Var2;
            }
            throw new IllegalArgumentException(c3.d4(1440) + obj + " for fragment " + b().f() + " is not a valid framework Transition or AndroidX Transition");
        }

        i0 e() {
            i0 f4 = f(this.f1407c);
            i0 f5 = f(this.f1409e);
            if (f4 == null || f5 == null || f4 == f5) {
                return f4 != null ? f4 : f5;
            }
            throw new IllegalArgumentException(c3.d4(417) + b().f() + " returned Transition " + this.f1407c + " which uses a different Transition  type than its shared element transition " + this.f1409e);
        }

        public Object g() {
            return this.f1409e;
        }

        Object h() {
            return this.f1407c;
        }

        public boolean i() {
            return this.f1409e != null;
        }

        boolean j() {
            return this.f1408d;
        }
    }

    d(ViewGroup viewGroup) {
        super(viewGroup);
    }

    private void w(List list, List list2, boolean z3, Map map) {
        l0.e eVar;
        k kVar;
        View view;
        ViewGroup m3 = m();
        Context context = m3.getContext();
        ArrayList arrayList = new ArrayList();
        Iterator it = list.iterator();
        int i4 = 0;
        boolean z4 = false;
        while (it.hasNext()) {
            k kVar2 = (k) it.next();
            if (kVar2.d()) {
                kVar2.a();
            } else {
                k.a e4 = kVar2.e(context);
                if (e4 == null) {
                    kVar2.a();
                } else {
                    Animator animator = e4.f1511b;
                    if (animator == null) {
                        arrayList.add(kVar2);
                    } else {
                        l0.e b4 = kVar2.b();
                        Fragment f4 = b4.f();
                        if (Boolean.TRUE.equals(map.get(b4))) {
                            if (x.G0(2)) {
                                Log.v("FragmentManager", "Ignoring Animator set on " + f4 + " as this Fragment was involved in a Transition.");
                            }
                            kVar2.a();
                        } else {
                            boolean z5 = b4.e() == l0.e.c.GONE;
                            if (z5) {
                                list2.remove(b4);
                            }
                            View view2 = f4.I;
                            m3.startViewTransition(view2);
                            ViewGroup viewGroup = m3;
                            m3 = viewGroup;
                            animator.addListener(new c(viewGroup, view2, z5, b4, kVar2));
                            animator.setTarget(view2);
                            animator.start();
                            if (x.G0(2)) {
                                Log.v("FragmentManager", "Animator from operation " + b4 + " has started.");
                            }
                            kVar2.c().b(new C0018d(animator, b4));
                            z4 = true;
                        }
                    }
                }
            }
        }
        int size = arrayList.size();
        while (i4 < size) {
            Object obj = arrayList.get(i4);
            i4++;
            k kVar3 = (k) obj;
            l0.e b5 = kVar3.b();
            Fragment f5 = b5.f();
            if (z3) {
                if (x.G0(2)) {
                    Log.v("FragmentManager", "Ignoring Animation set on " + f5 + " as Animations cannot run alongside Transitions.");
                }
                kVar3.a();
            } else if (z4) {
                if (x.G0(2)) {
                    Log.v("FragmentManager", "Ignoring Animation set on " + f5 + " as Animations cannot run alongside Animators.");
                }
                kVar3.a();
            } else {
                View view3 = f5.I;
                Animation animation = (Animation) androidx.core.util.c.d(((k.a) androidx.core.util.c.d(kVar3.e(context))).f1510a);
                if (b5.e() != l0.e.c.REMOVED) {
                    view3.startAnimation(animation);
                    kVar3.a();
                    eVar = b5;
                    kVar = kVar3;
                    view = view3;
                } else {
                    m3.startViewTransition(view3);
                    k.b bVar = new k.b(animation, m3, view3);
                    eVar = b5;
                    kVar = kVar3;
                    view = view3;
                    bVar.setAnimationListener(new e(eVar, m3, view, kVar));
                    view.startAnimation(bVar);
                    if (x.G0(2)) {
                        Log.v("FragmentManager", "Animation from operation " + eVar + " has started.");
                    }
                }
                kVar.c().b(new f(view, m3, kVar, eVar));
            }
        }
    }

    private Map x(List list, List list2, boolean z3, l0.e eVar, l0.e eVar2) {
        String str;
        ArrayList arrayList;
        String str2;
        ArrayList arrayList2;
        View view;
        View view2;
        Object obj;
        Object obj2;
        String str3;
        ArrayList arrayList3;
        ArrayList arrayList4;
        Object obj3;
        Rect rect;
        l0.e eVar3;
        View view3;
        Rect rect2;
        ArrayList arrayList5;
        k.a aVar;
        View view4;
        ArrayList arrayList6;
        int i4;
        View view5;
        boolean z4 = z3;
        HashMap hashMap = new HashMap();
        Iterator it = list.iterator();
        i0 i0Var = null;
        while (it.hasNext()) {
            m mVar = (m) it.next();
            if (!mVar.d()) {
                i0 e4 = mVar.e();
                if (i0Var == null) {
                    i0Var = e4;
                } else if (e4 != null && i0Var != e4) {
                    throw new IllegalArgumentException("Mixing framework transitions and AndroidX transitions is not allowed. Fragment " + mVar.b().f() + c3.d4(1266) + mVar.h() + " which uses a different Transition  type than other Fragments.");
                }
            }
        }
        if (i0Var == null) {
            Iterator it2 = list.iterator();
            while (it2.hasNext()) {
                m mVar2 = (m) it2.next();
                hashMap.put(mVar2.b(), Boolean.FALSE);
                mVar2.a();
            }
        } else {
            View view6 = new View(m().getContext());
            Rect rect3 = new Rect();
            ArrayList arrayList7 = new ArrayList();
            ArrayList arrayList8 = new ArrayList();
            k.a aVar2 = new k.a();
            Iterator it3 = list.iterator();
            Object obj4 = null;
            View view7 = null;
            boolean z5 = false;
            while (true) {
                str = "FragmentManager";
                if (!it3.hasNext()) {
                    break;
                }
                m mVar3 = (m) it3.next();
                if (!mVar3.i() || eVar == null || eVar2 == null) {
                    view3 = view6;
                    rect2 = rect3;
                    arrayList5 = arrayList7;
                    aVar = aVar2;
                    view4 = view7;
                    arrayList6 = arrayList8;
                } else {
                    Object u3 = i0Var.u(i0Var.f(mVar3.g()));
                    ArrayList Q = eVar2.f().Q();
                    ArrayList Q2 = eVar.f().Q();
                    ArrayList R = eVar.f().R();
                    int i5 = 0;
                    while (i5 < R.size()) {
                        int indexOf = Q.indexOf(R.get(i5));
                        ArrayList arrayList9 = R;
                        if (indexOf != -1) {
                            Q.set(indexOf, (String) Q2.get(i5));
                        }
                        i5++;
                        R = arrayList9;
                    }
                    ArrayList R2 = eVar2.f().R();
                    if (z4) {
                        eVar.f().w();
                        eVar2.f().z();
                    } else {
                        eVar.f().z();
                        eVar2.f().w();
                    }
                    int i6 = 0;
                    for (int size = Q.size(); i6 < size; size = size) {
                        aVar2.put((String) Q.get(i6), (String) R2.get(i6));
                        i6++;
                    }
                    if (x.G0(2)) {
                        Log.v("FragmentManager", ">>> entering view names <<<");
                        int i7 = 0;
                        for (int size2 = R2.size(); i7 < size2; size2 = size2) {
                            Object obj5 = R2.get(i7);
                            Log.v("FragmentManager", "Name: " + ((String) obj5));
                            i7++;
                        }
                        Log.v("FragmentManager", ">>> exiting view names <<<");
                        int i8 = 0;
                        for (int size3 = Q.size(); i8 < size3; size3 = size3) {
                            Object obj6 = Q.get(i8);
                            Log.v("FragmentManager", "Name: " + ((String) obj6));
                            i8++;
                        }
                    }
                    k.a aVar3 = new k.a();
                    u(aVar3, eVar.f().I);
                    aVar3.n(Q);
                    aVar2.n(aVar3.keySet());
                    k.a aVar4 = new k.a();
                    u(aVar4, eVar2.f().I);
                    aVar4.n(R2);
                    aVar4.n(aVar2.values());
                    g0.c(aVar2, aVar4);
                    v(aVar3, aVar2.keySet());
                    v(aVar4, aVar2.values());
                    if (aVar2.isEmpty()) {
                        arrayList7.clear();
                        arrayList8.clear();
                        view3 = view6;
                        rect2 = rect3;
                        arrayList5 = arrayList7;
                        aVar = aVar2;
                        arrayList6 = arrayList8;
                        obj4 = null;
                        z4 = z3;
                        arrayList7 = arrayList5;
                        arrayList8 = arrayList6;
                        aVar2 = aVar;
                        rect3 = rect2;
                        view6 = view3;
                    } else {
                        aVar = aVar2;
                        g0.a(eVar2.f(), eVar.f(), z4, aVar3, true);
                        view4 = view7;
                        androidx.core.view.t.a(m(), new g(eVar2, eVar, z4, aVar4));
                        arrayList7.addAll(aVar3.values());
                        if (Q.isEmpty()) {
                            i4 = 0;
                        } else {
                            i4 = 0;
                            View view8 = (View) aVar3.get((String) Q.get(0));
                            i0Var.p(u3, view8);
                            view4 = view8;
                        }
                        arrayList8.addAll(aVar4.values());
                        if (!R2.isEmpty() && (view5 = (View) aVar4.get((String) R2.get(i4))) != null) {
                            androidx.core.view.t.a(m(), new h(i0Var, view5, rect3));
                            z5 = true;
                        }
                        i0Var.s(u3, view6, arrayList7);
                        rect2 = rect3;
                        ArrayList arrayList10 = arrayList7;
                        view3 = view6;
                        i0Var.n(u3, null, null, null, null, u3, arrayList8);
                        arrayList6 = arrayList8;
                        Boolean bool = Boolean.TRUE;
                        hashMap.put(eVar, bool);
                        hashMap.put(eVar2, bool);
                        arrayList5 = arrayList10;
                        obj4 = u3;
                    }
                }
                view7 = view4;
                z4 = z3;
                arrayList7 = arrayList5;
                arrayList8 = arrayList6;
                aVar2 = aVar;
                rect3 = rect2;
                view6 = view3;
            }
            l0.e eVar4 = eVar;
            l0.e eVar5 = eVar2;
            View view9 = view6;
            ArrayList arrayList11 = arrayList7;
            k.a aVar5 = aVar2;
            View view10 = view7;
            Rect rect4 = rect3;
            ArrayList arrayList12 = arrayList8;
            ArrayList arrayList13 = new ArrayList();
            Iterator it4 = list.iterator();
            Object obj7 = null;
            Object obj8 = null;
            while (it4.hasNext()) {
                m mVar4 = (m) it4.next();
                if (mVar4.d()) {
                    hashMap.put(mVar4.b(), Boolean.FALSE);
                    mVar4.a();
                } else {
                    Object f4 = i0Var.f(mVar4.h());
                    l0.e b4 = mVar4.b();
                    boolean z6 = obj4 != null && (b4 == eVar4 || b4 == eVar5);
                    if (f4 == null) {
                        if (!z6) {
                            hashMap.put(b4, Boolean.FALSE);
                            mVar4.a();
                        }
                        view = view9;
                        arrayList4 = arrayList11;
                        arrayList2 = arrayList12;
                        rect = rect4;
                        view2 = view10;
                        str3 = str;
                        arrayList3 = arrayList13;
                    } else {
                        Rect rect5 = rect4;
                        ArrayList arrayList14 = new ArrayList();
                        ArrayList arrayList15 = arrayList13;
                        t(arrayList14, b4.f().I);
                        if (z6) {
                            if (b4 == eVar4) {
                                arrayList14.removeAll(arrayList11);
                            } else {
                                arrayList14.removeAll(arrayList12);
                            }
                        }
                        if (arrayList14.isEmpty()) {
                            i0Var.a(f4, view9);
                            view = view9;
                            arrayList2 = arrayList12;
                            obj2 = obj7;
                            obj = obj8;
                            eVar3 = b4;
                            view2 = view10;
                            str3 = str;
                            arrayList3 = arrayList15;
                            arrayList4 = arrayList11;
                            obj3 = f4;
                            rect = rect5;
                        } else {
                            i0Var.b(f4, arrayList14);
                            arrayList2 = arrayList12;
                            view = view9;
                            view2 = view10;
                            obj = obj8;
                            obj2 = obj7;
                            str3 = str;
                            arrayList3 = arrayList15;
                            arrayList4 = arrayList11;
                            obj3 = f4;
                            rect = rect5;
                            i0Var.n(obj3, f4, arrayList14, null, null, null, null);
                            if (b4.e() == l0.e.c.GONE) {
                                eVar3 = b4;
                                list2.remove(eVar3);
                                ArrayList arrayList16 = new ArrayList(arrayList14);
                                arrayList16.remove(eVar3.f().I);
                                i0Var.m(obj3, eVar3.f().I, arrayList16);
                                androidx.core.view.t.a(m(), new i(arrayList14));
                            } else {
                                eVar3 = b4;
                            }
                        }
                        if (eVar3.e() == l0.e.c.VISIBLE) {
                            arrayList3.addAll(arrayList14);
                            if (z5) {
                                i0Var.o(obj3, rect);
                            }
                        } else {
                            i0Var.p(obj3, view2);
                        }
                        hashMap.put(eVar3, Boolean.TRUE);
                        if (mVar4.j()) {
                            obj2 = i0Var.k(obj2, obj3, null);
                        } else {
                            obj = i0Var.k(obj, obj3, null);
                        }
                        obj7 = obj2;
                        obj8 = obj;
                    }
                    arrayList11 = arrayList4;
                    eVar4 = eVar;
                    eVar5 = eVar2;
                    rect4 = rect;
                    arrayList13 = arrayList3;
                    str = str3;
                    arrayList12 = arrayList2;
                    view10 = view2;
                    view9 = view;
                }
            }
            String str4 = str;
            ArrayList arrayList17 = arrayList11;
            ArrayList arrayList18 = arrayList12;
            ArrayList arrayList19 = arrayList13;
            Object j4 = i0Var.j(obj7, obj8, obj4);
            if (j4 != null) {
                Iterator it5 = list.iterator();
                while (it5.hasNext()) {
                    m mVar5 = (m) it5.next();
                    if (!mVar5.d()) {
                        Object h4 = mVar5.h();
                        l0.e b5 = mVar5.b();
                        boolean z7 = obj4 != null && (b5 == eVar || b5 == eVar2);
                        if (h4 == null && !z7) {
                            str2 = str4;
                        } else if (androidx.core.view.v.w(m())) {
                            str2 = str4;
                            i0Var.q(mVar5.b().f(), j4, mVar5.c(), new j(mVar5, b5));
                        } else {
                            if (x.G0(2)) {
                                str2 = str4;
                                Log.v(str2, "SpecialEffectsController: Container " + m() + " has not been laid out. Completing operation " + b5);
                            } else {
                                str2 = str4;
                            }
                            mVar5.a();
                        }
                        str4 = str2;
                    }
                }
                String str5 = str4;
                if (androidx.core.view.v.w(m())) {
                    g0.d(arrayList19, 4);
                    ArrayList l3 = i0Var.l(arrayList18);
                    if (x.G0(2)) {
                        Log.v(str5, ">>>>> Beginning transition <<<<<");
                        Log.v(str5, ">>>>> SharedElementFirstOutViews <<<<<");
                        int size4 = arrayList17.size();
                        int i9 = 0;
                        while (i9 < size4) {
                            Object obj9 = arrayList17.get(i9);
                            i9++;
                            View view11 = (View) obj9;
                            Log.v(str5, "View: " + view11 + " Name: " + androidx.core.view.v.s(view11));
                        }
                        arrayList = arrayList17;
                        Log.v(str5, ">>>>> SharedElementLastInViews <<<<<");
                        int size5 = arrayList18.size();
                        int i10 = 0;
                        while (i10 < size5) {
                            Object obj10 = arrayList18.get(i10);
                            i10++;
                            View view12 = (View) obj10;
                            Log.v(str5, "View: " + view12 + " Name: " + androidx.core.view.v.s(view12));
                        }
                    } else {
                        arrayList = arrayList17;
                    }
                    i0Var.c(m(), j4);
                    ArrayList arrayList20 = arrayList;
                    i0Var.r(m(), arrayList20, arrayList18, l3, aVar5);
                    g0.d(arrayList19, 0);
                    i0Var.t(obj4, arrayList20, arrayList18);
                    return hashMap;
                }
            }
        }
        return hashMap;
    }

    private void y(List list) {
        Fragment f4 = ((l0.e) list.get(list.size() - 1)).f();
        Iterator it = list.iterator();
        while (it.hasNext()) {
            l0.e eVar = (l0.e) it.next();
            eVar.f().L.f1302c = f4.L.f1302c;
            eVar.f().L.f1303d = f4.L.f1303d;
            eVar.f().L.f1304e = f4.L.f1304e;
            eVar.f().L.f1305f = f4.L.f1305f;
        }
    }

    @Override // androidx.fragment.app.l0
    void f(List list, boolean z3) {
        int i4;
        Iterator it = list.iterator();
        l0.e eVar = null;
        l0.e eVar2 = null;
        while (it.hasNext()) {
            l0.e eVar3 = (l0.e) it.next();
            l0.e.c c4 = l0.e.c.c(eVar3.f().I);
            int i5 = a.f1364a[eVar3.e().ordinal()];
            if (i5 == 1 || i5 == 2 || i5 == 3) {
                if (c4 == l0.e.c.VISIBLE && eVar == null) {
                    eVar = eVar3;
                }
            } else if (i5 == 4 && c4 != l0.e.c.VISIBLE) {
                eVar2 = eVar3;
            }
        }
        if (x.G0(2)) {
            Log.v("FragmentManager", "Executing operations from " + eVar + " to " + eVar2);
        }
        List arrayList = new ArrayList();
        List arrayList2 = new ArrayList();
        ArrayList arrayList3 = new ArrayList(list);
        y(list);
        Iterator it2 = list.iterator();
        while (true) {
            i4 = 0;
            r11 = false;
            boolean z4 = false;
            if (!it2.hasNext()) {
                break;
            }
            l0.e eVar4 = (l0.e) it2.next();
            androidx.core.os.b bVar = new androidx.core.os.b();
            eVar4.j(bVar);
            arrayList.add(new k(eVar4, bVar, z3));
            androidx.core.os.b bVar2 = new androidx.core.os.b();
            eVar4.j(bVar2);
            if (z3) {
                if (eVar4 != eVar) {
                    arrayList2.add(new m(eVar4, bVar2, z3, z4));
                    eVar4.a(new b(arrayList3, eVar4));
                }
                z4 = true;
                arrayList2.add(new m(eVar4, bVar2, z3, z4));
                eVar4.a(new b(arrayList3, eVar4));
            } else {
                if (eVar4 != eVar2) {
                    arrayList2.add(new m(eVar4, bVar2, z3, z4));
                    eVar4.a(new b(arrayList3, eVar4));
                }
                z4 = true;
                arrayList2.add(new m(eVar4, bVar2, z3, z4));
                eVar4.a(new b(arrayList3, eVar4));
            }
        }
        Map x3 = x(arrayList2, arrayList3, z3, eVar, eVar2);
        w(arrayList, arrayList3, x3.containsValue(Boolean.TRUE), x3);
        int size = arrayList3.size();
        while (i4 < size) {
            Object obj = arrayList3.get(i4);
            i4++;
            s((l0.e) obj);
        }
        arrayList3.clear();
        if (x.G0(2)) {
            Log.v("FragmentManager", "Completed executing operations from " + eVar + " to " + eVar2);
        }
    }

    void s(l0.e eVar) {
        eVar.e().a(eVar.f().I);
    }

    void t(ArrayList arrayList, View view) {
        if (!(view instanceof ViewGroup)) {
            if (arrayList.contains(view)) {
                return;
            }
            arrayList.add(view);
            return;
        }
        ViewGroup viewGroup = (ViewGroup) view;
        if (androidx.core.view.y.a(viewGroup)) {
            if (arrayList.contains(view)) {
                return;
            }
            arrayList.add(viewGroup);
            return;
        }
        int childCount = viewGroup.getChildCount();
        for (int i4 = 0; i4 < childCount; i4++) {
            View childAt = viewGroup.getChildAt(i4);
            if (childAt.getVisibility() == 0) {
                t(arrayList, childAt);
            }
        }
    }

    void u(Map map, View view) {
        String s3 = androidx.core.view.v.s(view);
        if (s3 != null) {
            map.put(s3, view);
        }
        if (view instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) view;
            int childCount = viewGroup.getChildCount();
            for (int i4 = 0; i4 < childCount; i4++) {
                View childAt = viewGroup.getChildAt(i4);
                if (childAt.getVisibility() == 0) {
                    u(map, childAt);
                }
            }
        }
    }

    void v(k.a aVar, Collection collection) {
        Iterator it = aVar.entrySet().iterator();
        while (it.hasNext()) {
            if (!collection.contains(androidx.core.view.v.s((View) ((Map.Entry) it.next()).getValue()))) {
                it.remove();
            }
        }
    }
}
