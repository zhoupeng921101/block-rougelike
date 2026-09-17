package androidx.fragment.app;

import a1.b2.c3;
import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Looper;
import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import androidx.activity.OnBackPressedDispatcher;
import androidx.activity.result.ActivityResultRegistry;
import androidx.activity.result.e;
import androidx.fragment.app.f0;
import androidx.lifecycle.g;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import v.c;
import z.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class x {
    private static boolean S;
    private androidx.activity.result.c D;
    private androidx.activity.result.c E;
    private androidx.activity.result.c F;
    private boolean H;
    private boolean I;
    private boolean J;
    private boolean K;
    private boolean L;
    private ArrayList M;
    private ArrayList N;
    private ArrayList O;
    private a0 P;
    private c.C0078c Q;

    /* renamed from: b, reason: collision with root package name */
    private boolean f1571b;

    /* renamed from: d, reason: collision with root package name */
    ArrayList f1573d;

    /* renamed from: e, reason: collision with root package name */
    private ArrayList f1574e;

    /* renamed from: g, reason: collision with root package name */
    private OnBackPressedDispatcher f1576g;

    /* renamed from: m, reason: collision with root package name */
    private ArrayList f1582m;

    /* renamed from: v, reason: collision with root package name */
    private p f1591v;

    /* renamed from: w, reason: collision with root package name */
    private androidx.fragment.app.l f1592w;

    /* renamed from: x, reason: collision with root package name */
    private Fragment f1593x;

    /* renamed from: y, reason: collision with root package name */
    Fragment f1594y;

    /* renamed from: a, reason: collision with root package name */
    private final ArrayList f1570a = new ArrayList();

    /* renamed from: c, reason: collision with root package name */
    private final e0 f1572c = new e0();

    /* renamed from: f, reason: collision with root package name */
    private final q f1575f = new q(this);

    /* renamed from: h, reason: collision with root package name */
    private final androidx.activity.h f1577h = new b(false);

    /* renamed from: i, reason: collision with root package name */
    private final AtomicInteger f1578i = new AtomicInteger();

    /* renamed from: j, reason: collision with root package name */
    private final Map f1579j = Collections.synchronizedMap(new HashMap());

    /* renamed from: k, reason: collision with root package name */
    private final Map f1580k = Collections.synchronizedMap(new HashMap());

    /* renamed from: l, reason: collision with root package name */
    private final Map f1581l = Collections.synchronizedMap(new HashMap());

    /* renamed from: n, reason: collision with root package name */
    private final r f1583n = new r(this);

    /* renamed from: o, reason: collision with root package name */
    private final CopyOnWriteArrayList f1584o = new CopyOnWriteArrayList();

    /* renamed from: p, reason: collision with root package name */
    private final androidx.core.util.a f1585p = new androidx.core.util.a() { // from class: androidx.fragment.app.s
        @Override // androidx.core.util.a
        public final void accept(Object obj) {
            x.e(x.this, (Configuration) obj);
        }
    };

    /* renamed from: q, reason: collision with root package name */
    private final androidx.core.util.a f1586q = new androidx.core.util.a() { // from class: androidx.fragment.app.t
        @Override // androidx.core.util.a
        public final void accept(Object obj) {
            x.a(x.this, (Integer) obj);
        }
    };

    /* renamed from: r, reason: collision with root package name */
    private final androidx.core.util.a f1587r = new androidx.core.util.a() { // from class: androidx.fragment.app.u
        @Override // androidx.core.util.a
        public final void accept(Object obj) {
            x.d(x.this, (androidx.core.app.d) obj);
        }
    };

    /* renamed from: s, reason: collision with root package name */
    private final androidx.core.util.a f1588s = new androidx.core.util.a() { // from class: androidx.fragment.app.v
        @Override // androidx.core.util.a
        public final void accept(Object obj) {
            x.c(x.this, (androidx.core.app.z) obj);
        }
    };

    /* renamed from: t, reason: collision with root package name */
    private final androidx.core.view.l f1589t = new c();

    /* renamed from: u, reason: collision with root package name */
    int f1590u = -1;

    /* renamed from: z, reason: collision with root package name */
    private o f1595z = null;
    private o A = new d();
    private m0 B = null;
    private m0 C = new e();
    ArrayDeque G = new ArrayDeque();
    private Runnable R = new f();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements androidx.activity.result.b {
        a() {
        }

        @Override // androidx.activity.result.b
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public void a(Map map) {
            String[] strArr = (String[]) map.keySet().toArray(new String[0]);
            ArrayList arrayList = new ArrayList(map.values());
            int[] iArr = new int[arrayList.size()];
            for (int i4 = 0; i4 < arrayList.size(); i4++) {
                iArr[i4] = ((Boolean) arrayList.get(i4)).booleanValue() ? 0 : -1;
            }
            k kVar = (k) x.this.G.pollFirst();
            String d4 = c3.d4(423);
            if (kVar == null) {
                Log.w(d4, "No permissions were requested for " + this);
                return;
            }
            String str = kVar.f1606e;
            int i5 = kVar.f1607f;
            Fragment i6 = x.this.f1572c.i(str);
            if (i6 != null) {
                i6.G0(i5, strArr, iArr);
                return;
            }
            Log.w(d4, "Permission request result delivered for unknown Fragment " + str);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends androidx.activity.h {
        b(boolean z3) {
            super(z3);
        }

        @Override // androidx.activity.h
        public void b() {
            x.this.C0();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements androidx.core.view.l {
        c() {
        }

        @Override // androidx.core.view.l
        public boolean a(MenuItem menuItem) {
            return x.this.J(menuItem);
        }

        @Override // androidx.core.view.l
        public void b(Menu menu) {
            x.this.K(menu);
        }

        @Override // androidx.core.view.l
        public void c(Menu menu, MenuInflater menuInflater) {
            x.this.C(menu, menuInflater);
        }

        @Override // androidx.core.view.l
        public void d(Menu menu) {
            x.this.O(menu);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d extends o {
        d() {
        }

        @Override // androidx.fragment.app.o
        public Fragment a(ClassLoader classLoader, String str) {
            return x.this.t0().e(x.this.t0().u(), str, null);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class e implements m0 {
        e() {
        }

        @Override // androidx.fragment.app.m0
        public l0 a(ViewGroup viewGroup) {
            return new androidx.fragment.app.d(viewGroup);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class f implements Runnable {
        f() {
        }

        @Override // java.lang.Runnable
        public void run() {
            x.this.a0(true);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class g implements b0 {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ Fragment f1602a;

        g(Fragment fragment) {
            this.f1602a = fragment;
        }

        @Override // androidx.fragment.app.b0
        public void a(x xVar, Fragment fragment) {
            this.f1602a.k0(fragment);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class h implements androidx.activity.result.b {
        h() {
        }

        @Override // androidx.activity.result.b
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public void a(androidx.activity.result.a aVar) {
            k kVar = (k) x.this.G.pollFirst();
            if (kVar == null) {
                Log.w("FragmentManager", c3.d4(56) + this);
                return;
            }
            String str = kVar.f1606e;
            int i4 = kVar.f1607f;
            Fragment i5 = x.this.f1572c.i(str);
            if (i5 != null) {
                i5.h0(i4, aVar.q(), aVar.o());
                return;
            }
            Log.w("FragmentManager", "Activity result delivered for unknown Fragment " + str);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class i implements androidx.activity.result.b {
        i() {
        }

        @Override // androidx.activity.result.b
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public void a(androidx.activity.result.a aVar) {
            k kVar = (k) x.this.G.pollFirst();
            if (kVar == null) {
                Log.w("FragmentManager", "No IntentSenders were started for " + this);
                return;
            }
            String str = kVar.f1606e;
            int i4 = kVar.f1607f;
            Fragment i5 = x.this.f1572c.i(str);
            if (i5 != null) {
                i5.h0(i4, aVar.q(), aVar.o());
                return;
            }
            Log.w("FragmentManager", "Intent Sender result delivered for unknown Fragment " + str);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class j extends b.a {
        j() {
        }

        @Override // b.a
        /* renamed from: d, reason: merged with bridge method [inline-methods] */
        public Intent a(Context context, androidx.activity.result.e eVar) {
            String d4;
            Bundle bundleExtra;
            Intent intent = new Intent(c3.d4(1109));
            Intent o3 = eVar.o();
            if (o3 != null && (bundleExtra = o3.getBundleExtra((d4 = c3.d4(1356)))) != null) {
                intent.putExtra(d4, bundleExtra);
                o3.removeExtra(d4);
                if (o3.getBooleanExtra(c3.d4(671), false)) {
                    eVar = new e.b(eVar.y()).b(null).c(eVar.v(), eVar.q()).a();
                }
            }
            intent.putExtra("androidx.activity.result.contract.extra.INTENT_SENDER_REQUEST", eVar);
            if (x.G0(2)) {
                Log.v("FragmentManager", "CreateIntent created the following intent: " + intent);
            }
            return intent;
        }

        @Override // b.a
        /* renamed from: e, reason: merged with bridge method [inline-methods] */
        public androidx.activity.result.a c(int i4, Intent intent) {
            return new androidx.activity.result.a(i4, intent);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class k implements Parcelable {
        public static final Parcelable.Creator<k> CREATOR = new a();

        /* renamed from: e, reason: collision with root package name */
        String f1606e;

        /* renamed from: f, reason: collision with root package name */
        int f1607f;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Parcelable.Creator {
            a() {
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: a, reason: merged with bridge method [inline-methods] */
            public k createFromParcel(Parcel parcel) {
                return new k(parcel);
            }

            @Override // android.os.Parcelable.Creator
            /* renamed from: b, reason: merged with bridge method [inline-methods] */
            public k[] newArray(int i4) {
                return new k[i4];
            }
        }

        k(Parcel parcel) {
            this.f1606e = parcel.readString();
            this.f1607f = parcel.readInt();
        }

        k(String str, int i4) {
            this.f1606e = str;
            this.f1607f = i4;
        }

        @Override // android.os.Parcelable
        public int describeContents() {
            return 0;
        }

        @Override // android.os.Parcelable
        public void writeToParcel(Parcel parcel, int i4) {
            parcel.writeString(this.f1606e);
            parcel.writeInt(this.f1607f);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    interface l {
        boolean a(ArrayList arrayList, ArrayList arrayList2);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class m implements l {

        /* renamed from: a, reason: collision with root package name */
        final String f1608a;

        /* renamed from: b, reason: collision with root package name */
        final int f1609b;

        /* renamed from: c, reason: collision with root package name */
        final int f1610c;

        m(String str, int i4, int i5) {
            this.f1608a = str;
            this.f1609b = i4;
            this.f1610c = i5;
        }

        @Override // androidx.fragment.app.x.l
        public boolean a(ArrayList arrayList, ArrayList arrayList2) {
            Fragment fragment = x.this.f1594y;
            if (fragment == null || this.f1609b >= 0 || this.f1608a != null || !fragment.s().U0()) {
                return x.this.X0(arrayList, arrayList2, this.f1608a, this.f1609b, this.f1610c);
            }
            return false;
        }
    }

    static Fragment A0(View view) {
        Object tag = view.getTag(u.b.f5007a);
        if (tag instanceof Fragment) {
            return (Fragment) tag;
        }
        return null;
    }

    public static boolean G0(int i4) {
        return S || Log.isLoggable("FragmentManager", i4);
    }

    private boolean H0(Fragment fragment) {
        return (fragment.E && fragment.F) || fragment.f1288v.p();
    }

    private boolean I0() {
        Fragment fragment = this.f1593x;
        if (fragment == null) {
            return true;
        }
        return fragment.Y() && this.f1593x.G().I0();
    }

    private void L(Fragment fragment) {
        if (fragment == null || !fragment.equals(e0(fragment.f1272f))) {
            return;
        }
        fragment.f1();
    }

    private void S(int i4) {
        try {
            this.f1571b = true;
            this.f1572c.d(i4);
            P0(i4, false);
            Iterator it = t().iterator();
            while (it.hasNext()) {
                ((l0) it.next()).j();
            }
            this.f1571b = false;
            a0(true);
        } catch (Throwable th) {
            this.f1571b = false;
            throw th;
        }
    }

    private void V() {
        if (this.L) {
            this.L = false;
            k1();
        }
    }

    private boolean W0(String str, int i4, int i5) {
        a0(false);
        Z(true);
        Fragment fragment = this.f1594y;
        if (fragment != null && i4 < 0 && str == null && fragment.s().U0()) {
            return true;
        }
        boolean X0 = X0(this.M, this.N, str, i4, i5);
        if (X0) {
            this.f1571b = true;
            try {
                Z0(this.M, this.N);
            } finally {
                r();
            }
        }
        m1();
        V();
        this.f1572c.b();
        return X0;
    }

    private void X() {
        Iterator it = t().iterator();
        while (it.hasNext()) {
            ((l0) it.next()).j();
        }
    }

    private void Z(boolean z3) {
        if (this.f1571b) {
            throw new IllegalStateException("FragmentManager is already executing transactions");
        }
        if (this.f1591v == null) {
            if (!this.K) {
                throw new IllegalStateException("FragmentManager has not been attached to a host.");
            }
            throw new IllegalStateException("FragmentManager has been destroyed");
        }
        if (Looper.myLooper() != this.f1591v.v().getLooper()) {
            throw new IllegalStateException(c3.d4(560));
        }
        if (!z3) {
            q();
        }
        if (this.M == null) {
            this.M = new ArrayList();
            this.N = new ArrayList();
        }
    }

    private void Z0(ArrayList arrayList, ArrayList arrayList2) {
        if (arrayList.isEmpty()) {
            return;
        }
        if (arrayList.size() != arrayList2.size()) {
            throw new IllegalStateException("Internal error with the back stack records");
        }
        int size = arrayList.size();
        int i4 = 0;
        int i5 = 0;
        while (i4 < size) {
            if (!((androidx.fragment.app.a) arrayList.get(i4)).f1462r) {
                if (i5 != i4) {
                    d0(arrayList, arrayList2, i5, i4);
                }
                i5 = i4 + 1;
                if (((Boolean) arrayList2.get(i4)).booleanValue()) {
                    while (i5 < size && ((Boolean) arrayList2.get(i5)).booleanValue() && !((androidx.fragment.app.a) arrayList.get(i5)).f1462r) {
                        i5++;
                    }
                }
                d0(arrayList, arrayList2, i4, i5);
                i4 = i5 - 1;
            }
            i4++;
        }
        if (i5 != size) {
            d0(arrayList, arrayList2, i5, size);
        }
    }

    public static /* synthetic */ void a(x xVar, Integer num) {
        if (xVar.I0() && num.intValue() == 80) {
            xVar.F(false);
        }
    }

    private void a1() {
        ArrayList arrayList = this.f1582m;
        if (arrayList == null || arrayList.size() <= 0) {
            return;
        }
        h.d.a(this.f1582m.get(0));
        throw null;
    }

    public static /* synthetic */ void c(x xVar, androidx.core.app.z zVar) {
        if (xVar.I0()) {
            xVar.N(zVar.a(), false);
        }
    }

    private static void c0(ArrayList arrayList, ArrayList arrayList2, int i4, int i5) {
        while (i4 < i5) {
            androidx.fragment.app.a aVar = (androidx.fragment.app.a) arrayList.get(i4);
            if (((Boolean) arrayList2.get(i4)).booleanValue()) {
                aVar.n(-1);
                aVar.s();
            } else {
                aVar.n(1);
                aVar.r();
            }
            i4++;
        }
    }

    static int c1(int i4) {
        if (i4 == 4097) {
            return 8194;
        }
        if (i4 == 8194) {
            return 4097;
        }
        if (i4 == 8197) {
            return 4100;
        }
        if (i4 != 4099) {
            return i4 != 4100 ? 0 : 8197;
        }
        return 4099;
    }

    public static /* synthetic */ void d(x xVar, androidx.core.app.d dVar) {
        if (xVar.I0()) {
            xVar.G(dVar.a(), false);
        }
    }

    private void d0(ArrayList arrayList, ArrayList arrayList2, int i4, int i5) {
        boolean z3 = ((androidx.fragment.app.a) arrayList.get(i4)).f1462r;
        ArrayList arrayList3 = this.O;
        if (arrayList3 == null) {
            this.O = new ArrayList();
        } else {
            arrayList3.clear();
        }
        this.O.addAll(this.f1572c.o());
        Fragment x02 = x0();
        boolean z4 = false;
        for (int i6 = i4; i6 < i5; i6++) {
            androidx.fragment.app.a aVar = (androidx.fragment.app.a) arrayList.get(i6);
            x02 = !((Boolean) arrayList2.get(i6)).booleanValue() ? aVar.t(this.O, x02) : aVar.w(this.O, x02);
            z4 = z4 || aVar.f1453i;
        }
        this.O.clear();
        if (!z3 && this.f1590u >= 1) {
            for (int i7 = i4; i7 < i5; i7++) {
                ArrayList arrayList4 = ((androidx.fragment.app.a) arrayList.get(i7)).f1447c;
                int size = arrayList4.size();
                int i8 = 0;
                while (i8 < size) {
                    Object obj = arrayList4.get(i8);
                    i8++;
                    Fragment fragment = ((f0.a) obj).f1465b;
                    if (fragment != null && fragment.f1286t != null) {
                        this.f1572c.r(v(fragment));
                    }
                }
            }
        }
        c0(arrayList, arrayList2, i4, i5);
        boolean booleanValue = ((Boolean) arrayList2.get(i5 - 1)).booleanValue();
        for (int i9 = i4; i9 < i5; i9++) {
            androidx.fragment.app.a aVar2 = (androidx.fragment.app.a) arrayList.get(i9);
            if (booleanValue) {
                for (int size2 = aVar2.f1447c.size() - 1; size2 >= 0; size2--) {
                    Fragment fragment2 = ((f0.a) aVar2.f1447c.get(size2)).f1465b;
                    if (fragment2 != null) {
                        v(fragment2).m();
                    }
                }
            } else {
                ArrayList arrayList5 = aVar2.f1447c;
                int size3 = arrayList5.size();
                int i10 = 0;
                while (i10 < size3) {
                    Object obj2 = arrayList5.get(i10);
                    i10++;
                    Fragment fragment3 = ((f0.a) obj2).f1465b;
                    if (fragment3 != null) {
                        v(fragment3).m();
                    }
                }
            }
        }
        P0(this.f1590u, true);
        for (l0 l0Var : u(arrayList, i4, i5)) {
            l0Var.r(booleanValue);
            l0Var.p();
            l0Var.g();
        }
        while (i4 < i5) {
            androidx.fragment.app.a aVar3 = (androidx.fragment.app.a) arrayList.get(i4);
            if (((Boolean) arrayList2.get(i4)).booleanValue() && aVar3.f1325v >= 0) {
                aVar3.f1325v = -1;
            }
            aVar3.v();
            i4++;
        }
        if (z4) {
            a1();
        }
    }

    public static /* synthetic */ void e(x xVar, Configuration configuration) {
        if (xVar.I0()) {
            xVar.z(configuration, false);
        }
    }

    private int f0(String str, int i4, boolean z3) {
        ArrayList arrayList = this.f1573d;
        if (arrayList == null || arrayList.isEmpty()) {
            return -1;
        }
        if (str == null && i4 < 0) {
            if (z3) {
                return 0;
            }
            return this.f1573d.size() - 1;
        }
        int size = this.f1573d.size() - 1;
        while (size >= 0) {
            androidx.fragment.app.a aVar = (androidx.fragment.app.a) this.f1573d.get(size);
            if ((str != null && str.equals(aVar.u())) || (i4 >= 0 && i4 == aVar.f1325v)) {
                break;
            }
            size--;
        }
        if (size < 0) {
            return size;
        }
        if (!z3) {
            if (size == this.f1573d.size() - 1) {
                return -1;
            }
            return size + 1;
        }
        while (size > 0) {
            androidx.fragment.app.a aVar2 = (androidx.fragment.app.a) this.f1573d.get(size - 1);
            if ((str == null || !str.equals(aVar2.u())) && (i4 < 0 || i4 != aVar2.f1325v)) {
                break;
            }
            size--;
        }
        return size;
    }

    private void i1(Fragment fragment) {
        ViewGroup q02 = q0(fragment);
        if (q02 == null || fragment.u() + fragment.x() + fragment.I() + fragment.J() <= 0) {
            return;
        }
        if (q02.getTag(u.b.f5009c) == null) {
            q02.setTag(u.b.f5009c, fragment);
        }
        ((Fragment) q02.getTag(u.b.f5009c)).w1(fragment.H());
    }

    static x j0(View view) {
        androidx.fragment.app.j jVar;
        Fragment k02 = k0(view);
        if (k02 != null) {
            if (k02.Y()) {
                return k02.s();
            }
            throw new IllegalStateException("The Fragment " + k02 + " that owns View " + view + c3.d4(824));
        }
        Context context = view.getContext();
        while (true) {
            if (!(context instanceof ContextWrapper)) {
                jVar = null;
                break;
            }
            if (context instanceof androidx.fragment.app.j) {
                jVar = (androidx.fragment.app.j) context;
                break;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        if (jVar != null) {
            return jVar.K();
        }
        throw new IllegalStateException("View " + view + c3.d4(1441));
    }

    private static Fragment k0(View view) {
        while (view != null) {
            Fragment A0 = A0(view);
            if (A0 != null) {
                return A0;
            }
            Object parent = view.getParent();
            view = parent instanceof View ? (View) parent : null;
        }
        return null;
    }

    private void k1() {
        Iterator it = this.f1572c.k().iterator();
        while (it.hasNext()) {
            S0((d0) it.next());
        }
    }

    private void l0() {
        Iterator it = t().iterator();
        while (it.hasNext()) {
            ((l0) it.next()).k();
        }
    }

    private void l1(RuntimeException runtimeException) {
        Log.e("FragmentManager", runtimeException.getMessage());
        Log.e("FragmentManager", "Activity state:");
        PrintWriter printWriter = new PrintWriter(new k0("FragmentManager"));
        p pVar = this.f1591v;
        String d4 = c3.d4(7);
        if (pVar != null) {
            try {
                pVar.w("  ", null, printWriter, new String[0]);
                throw runtimeException;
            } catch (Exception e4) {
                Log.e("FragmentManager", d4, e4);
                throw runtimeException;
            }
        }
        try {
            W("  ", null, printWriter, new String[0]);
            throw runtimeException;
        } catch (Exception e5) {
            Log.e("FragmentManager", d4, e5);
            throw runtimeException;
        }
    }

    private boolean m0(ArrayList arrayList, ArrayList arrayList2) {
        synchronized (this.f1570a) {
            if (this.f1570a.isEmpty()) {
                return false;
            }
            try {
                int size = this.f1570a.size();
                boolean z3 = false;
                for (int i4 = 0; i4 < size; i4++) {
                    z3 |= ((l) this.f1570a.get(i4)).a(arrayList, arrayList2);
                }
                return z3;
            } finally {
                this.f1570a.clear();
                this.f1591v.v().removeCallbacks(this.R);
            }
        }
    }

    private void m1() {
        synchronized (this.f1570a) {
            try {
                if (this.f1570a.isEmpty()) {
                    this.f1577h.f(n0() > 0 && L0(this.f1593x));
                } else {
                    this.f1577h.f(true);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    private a0 o0(Fragment fragment) {
        return this.P.j(fragment);
    }

    private void q() {
        if (N0()) {
            throw new IllegalStateException(c3.d4(280));
        }
    }

    private ViewGroup q0(Fragment fragment) {
        ViewGroup viewGroup = fragment.H;
        if (viewGroup != null) {
            return viewGroup;
        }
        if (fragment.f1291y > 0 && this.f1592w.s()) {
            View j4 = this.f1592w.j(fragment.f1291y);
            if (j4 instanceof ViewGroup) {
                return (ViewGroup) j4;
            }
        }
        return null;
    }

    private void r() {
        this.f1571b = false;
        this.N.clear();
        this.M.clear();
    }

    private void s() {
        p pVar = this.f1591v;
        if (pVar instanceof androidx.lifecycle.b0 ? this.f1572c.p().n() : pVar.u() instanceof Activity ? !((Activity) this.f1591v.u()).isChangingConfigurations() : true) {
            Iterator it = this.f1579j.values().iterator();
            while (it.hasNext()) {
                Iterator it2 = ((androidx.fragment.app.c) it.next()).f1349e.iterator();
                while (it2.hasNext()) {
                    this.f1572c.p().g((String) it2.next());
                }
            }
        }
    }

    private Set t() {
        HashSet hashSet = new HashSet();
        Iterator it = this.f1572c.k().iterator();
        while (it.hasNext()) {
            ViewGroup viewGroup = ((d0) it.next()).k().H;
            if (viewGroup != null) {
                hashSet.add(l0.o(viewGroup, y0()));
            }
        }
        return hashSet;
    }

    private Set u(ArrayList arrayList, int i4, int i5) {
        ViewGroup viewGroup;
        HashSet hashSet = new HashSet();
        while (i4 < i5) {
            ArrayList arrayList2 = ((androidx.fragment.app.a) arrayList.get(i4)).f1447c;
            int size = arrayList2.size();
            int i6 = 0;
            while (i6 < size) {
                Object obj = arrayList2.get(i6);
                i6++;
                Fragment fragment = ((f0.a) obj).f1465b;
                if (fragment != null && (viewGroup = fragment.H) != null) {
                    hashSet.add(l0.n(viewGroup, this));
                }
            }
            i4++;
        }
        return hashSet;
    }

    boolean A(MenuItem menuItem) {
        if (this.f1590u < 1) {
            return false;
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null && fragment.Q0(menuItem)) {
                return true;
            }
        }
        return false;
    }

    void B() {
        this.I = false;
        this.J = false;
        this.P.p(false);
        S(1);
    }

    androidx.lifecycle.a0 B0(Fragment fragment) {
        return this.P.m(fragment);
    }

    boolean C(Menu menu, MenuInflater menuInflater) {
        if (this.f1590u < 1) {
            return false;
        }
        ArrayList arrayList = null;
        boolean z3 = false;
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null && K0(fragment) && fragment.S0(menu, menuInflater)) {
                if (arrayList == null) {
                    arrayList = new ArrayList();
                }
                arrayList.add(fragment);
                z3 = true;
            }
        }
        if (this.f1574e != null) {
            for (int i4 = 0; i4 < this.f1574e.size(); i4++) {
                Fragment fragment2 = (Fragment) this.f1574e.get(i4);
                if (arrayList == null || !arrayList.contains(fragment2)) {
                    fragment2.s0();
                }
            }
        }
        this.f1574e = arrayList;
        return z3;
    }

    void C0() {
        a0(true);
        if (this.f1577h.c()) {
            U0();
        } else {
            this.f1576g.e();
        }
    }

    void D() {
        this.K = true;
        a0(true);
        X();
        s();
        S(-1);
        Object obj = this.f1591v;
        if (obj instanceof androidx.core.content.c) {
            ((androidx.core.content.c) obj).h(this.f1586q);
        }
        Object obj2 = this.f1591v;
        if (obj2 instanceof androidx.core.content.b) {
            ((androidx.core.content.b) obj2).r(this.f1585p);
        }
        Object obj3 = this.f1591v;
        if (obj3 instanceof androidx.core.app.x) {
            ((androidx.core.app.x) obj3).p(this.f1587r);
        }
        Object obj4 = this.f1591v;
        if (obj4 instanceof androidx.core.app.y) {
            ((androidx.core.app.y) obj4).g(this.f1588s);
        }
        Object obj5 = this.f1591v;
        if ((obj5 instanceof androidx.core.view.i) && this.f1593x == null) {
            ((androidx.core.view.i) obj5).d(this.f1589t);
        }
        this.f1591v = null;
        this.f1592w = null;
        this.f1593x = null;
        if (this.f1576g != null) {
            this.f1577h.d();
            this.f1576g = null;
        }
        androidx.activity.result.c cVar = this.D;
        if (cVar != null) {
            cVar.c();
            this.E.c();
            this.F.c();
        }
    }

    void D0(Fragment fragment) {
        if (G0(2)) {
            Log.v("FragmentManager", "hide: " + fragment);
        }
        if (fragment.A) {
            return;
        }
        fragment.A = true;
        fragment.O = true ^ fragment.O;
        i1(fragment);
    }

    void E() {
        S(1);
    }

    void E0(Fragment fragment) {
        if (fragment.f1278l && H0(fragment)) {
            this.H = true;
        }
    }

    void F(boolean z3) {
        if (z3 && (this.f1591v instanceof androidx.core.content.c)) {
            l1(new IllegalStateException("Do not call dispatchLowMemory() on host. Host implements OnTrimMemoryProvider and automatically dispatches low memory callbacks to fragments."));
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null) {
                fragment.Y0();
                if (z3) {
                    fragment.f1288v.F(true);
                }
            }
        }
    }

    public boolean F0() {
        return this.K;
    }

    void G(boolean z3, boolean z4) {
        if (z4 && (this.f1591v instanceof androidx.core.app.x)) {
            l1(new IllegalStateException("Do not call dispatchMultiWindowModeChanged() on host. Host implements OnMultiWindowModeChangedProvider and automatically dispatches multi-window mode changes to fragments."));
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null) {
                fragment.Z0(z3);
                if (z4) {
                    fragment.f1288v.G(z3, true);
                }
            }
        }
    }

    void H(Fragment fragment) {
        Iterator it = this.f1584o.iterator();
        while (it.hasNext()) {
            ((b0) it.next()).a(this, fragment);
        }
    }

    void I() {
        for (Fragment fragment : this.f1572c.l()) {
            if (fragment != null) {
                fragment.w0(fragment.Z());
                fragment.f1288v.I();
            }
        }
    }

    boolean J(MenuItem menuItem) {
        if (this.f1590u < 1) {
            return false;
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null && fragment.a1(menuItem)) {
                return true;
            }
        }
        return false;
    }

    boolean J0(Fragment fragment) {
        if (fragment == null) {
            return false;
        }
        return fragment.Z();
    }

    void K(Menu menu) {
        if (this.f1590u < 1) {
            return;
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null) {
                fragment.b1(menu);
            }
        }
    }

    boolean K0(Fragment fragment) {
        if (fragment == null) {
            return true;
        }
        return fragment.b0();
    }

    boolean L0(Fragment fragment) {
        if (fragment == null) {
            return true;
        }
        x xVar = fragment.f1286t;
        return fragment.equals(xVar.x0()) && L0(xVar.f1593x);
    }

    void M() {
        S(5);
    }

    boolean M0(int i4) {
        return this.f1590u >= i4;
    }

    void N(boolean z3, boolean z4) {
        if (z4 && (this.f1591v instanceof androidx.core.app.y)) {
            l1(new IllegalStateException("Do not call dispatchPictureInPictureModeChanged() on host. Host implements OnPictureInPictureModeChangedProvider and automatically dispatches picture-in-picture mode changes to fragments."));
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null) {
                fragment.d1(z3);
                if (z4) {
                    fragment.f1288v.N(z3, true);
                }
            }
        }
    }

    public boolean N0() {
        return this.I || this.J;
    }

    boolean O(Menu menu) {
        boolean z3 = false;
        if (this.f1590u < 1) {
            return false;
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null && K0(fragment) && fragment.e1(menu)) {
                z3 = true;
            }
        }
        return z3;
    }

    void O0(Fragment fragment, Intent intent, int i4, Bundle bundle) {
        if (this.D == null) {
            this.f1591v.z(fragment, intent, i4, bundle);
            return;
        }
        this.G.addLast(new k(fragment.f1272f, i4));
        if (intent != null && bundle != null) {
            intent.putExtra("androidx.activity.result.contract.extra.ACTIVITY_OPTIONS_BUNDLE", bundle);
        }
        this.D.a(intent);
    }

    void P() {
        m1();
        L(this.f1594y);
    }

    void P0(int i4, boolean z3) {
        p pVar;
        if (this.f1591v == null && i4 != -1) {
            throw new IllegalStateException("No activity");
        }
        if (z3 || i4 != this.f1590u) {
            this.f1590u = i4;
            this.f1572c.t();
            k1();
            if (this.H && (pVar = this.f1591v) != null && this.f1590u == 7) {
                pVar.A();
                this.H = false;
            }
        }
    }

    void Q() {
        this.I = false;
        this.J = false;
        this.P.p(false);
        S(7);
    }

    void Q0() {
        if (this.f1591v == null) {
            return;
        }
        this.I = false;
        this.J = false;
        this.P.p(false);
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null) {
                fragment.f0();
            }
        }
    }

    void R() {
        this.I = false;
        this.J = false;
        this.P.p(false);
        S(5);
    }

    void R0(androidx.fragment.app.m mVar) {
        View view;
        for (d0 d0Var : this.f1572c.k()) {
            Fragment k4 = d0Var.k();
            if (k4.f1291y == mVar.getId() && (view = k4.I) != null && view.getParent() == null) {
                k4.H = mVar;
                d0Var.b();
            }
        }
    }

    void S0(d0 d0Var) {
        Fragment k4 = d0Var.k();
        if (k4.J) {
            if (this.f1571b) {
                this.L = true;
            } else {
                k4.J = false;
                d0Var.m();
            }
        }
    }

    void T() {
        this.J = true;
        this.P.p(true);
        S(4);
    }

    void T0(int i4, int i5, boolean z3) {
        if (i4 >= 0) {
            Y(new m(null, i4, i5), z3);
            return;
        }
        throw new IllegalArgumentException("Bad id: " + i4);
    }

    void U() {
        S(2);
    }

    public boolean U0() {
        return W0(null, -1, 0);
    }

    public boolean V0(int i4, int i5) {
        if (i4 >= 0) {
            return W0(null, i4, i5);
        }
        throw new IllegalArgumentException(c3.d4(672) + i4);
    }

    public void W(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        int size;
        int size2;
        String str2 = str + "    ";
        this.f1572c.e(str, fileDescriptor, printWriter, strArr);
        ArrayList arrayList = this.f1574e;
        if (arrayList != null && (size2 = arrayList.size()) > 0) {
            printWriter.print(str);
            printWriter.println("Fragments Created Menus:");
            for (int i4 = 0; i4 < size2; i4++) {
                Fragment fragment = (Fragment) this.f1574e.get(i4);
                printWriter.print(str);
                printWriter.print("  #");
                printWriter.print(i4);
                printWriter.print(": ");
                printWriter.println(fragment.toString());
            }
        }
        ArrayList arrayList2 = this.f1573d;
        if (arrayList2 != null && (size = arrayList2.size()) > 0) {
            printWriter.print(str);
            printWriter.println(c3.d4(1311));
            for (int i5 = 0; i5 < size; i5++) {
                androidx.fragment.app.a aVar = (androidx.fragment.app.a) this.f1573d.get(i5);
                printWriter.print(str);
                printWriter.print("  #");
                printWriter.print(i5);
                printWriter.print(c3.d4(329));
                printWriter.println(aVar.toString());
                aVar.p(str2, printWriter);
            }
        }
        printWriter.print(str);
        printWriter.println(c3.d4(1312) + this.f1578i.get());
        synchronized (this.f1570a) {
            try {
                int size3 = this.f1570a.size();
                if (size3 > 0) {
                    printWriter.print(str);
                    printWriter.println("Pending Actions:");
                    for (int i6 = 0; i6 < size3; i6++) {
                        l lVar = (l) this.f1570a.get(i6);
                        printWriter.print(str);
                        printWriter.print("  #");
                        printWriter.print(i6);
                        printWriter.print(": ");
                        printWriter.println(lVar);
                    }
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        printWriter.print(str);
        printWriter.println("FragmentManager misc state:");
        printWriter.print(str);
        printWriter.print(c3.d4(1403));
        printWriter.println(this.f1591v);
        printWriter.print(str);
        printWriter.print("  mContainer=");
        printWriter.println(this.f1592w);
        if (this.f1593x != null) {
            printWriter.print(str);
            printWriter.print(c3.d4(510));
            printWriter.println(this.f1593x);
        }
        printWriter.print(str);
        printWriter.print("  mCurState=");
        printWriter.print(this.f1590u);
        printWriter.print(c3.d4(367));
        printWriter.print(this.I);
        printWriter.print(" mStopped=");
        printWriter.print(this.J);
        printWriter.print(c3.d4(511));
        printWriter.println(this.K);
        if (this.H) {
            printWriter.print(str);
            printWriter.print("  mNeedMenuInvalidate=");
            printWriter.println(this.H);
        }
    }

    boolean X0(ArrayList arrayList, ArrayList arrayList2, String str, int i4, int i5) {
        int f02 = f0(str, i4, (i5 & 1) != 0);
        if (f02 < 0) {
            return false;
        }
        for (int size = this.f1573d.size() - 1; size >= f02; size--) {
            arrayList.add((androidx.fragment.app.a) this.f1573d.remove(size));
            arrayList2.add(Boolean.TRUE);
        }
        return true;
    }

    void Y(l lVar, boolean z3) {
        if (!z3) {
            if (this.f1591v == null) {
                if (!this.K) {
                    throw new IllegalStateException(c3.d4(1357));
                }
                throw new IllegalStateException("FragmentManager has been destroyed");
            }
            q();
        }
        synchronized (this.f1570a) {
            try {
                if (this.f1591v == null) {
                    if (!z3) {
                        throw new IllegalStateException("Activity has been destroyed");
                    }
                } else {
                    this.f1570a.add(lVar);
                    e1();
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    void Y0(Fragment fragment) {
        if (G0(2)) {
            Log.v("FragmentManager", c3.d4(773) + fragment + c3.d4(1442) + fragment.f1285s);
        }
        boolean a02 = fragment.a0();
        if (fragment.B && a02) {
            return;
        }
        this.f1572c.u(fragment);
        if (H0(fragment)) {
            this.H = true;
        }
        fragment.f1279m = true;
        i1(fragment);
    }

    boolean a0(boolean z3) {
        Z(z3);
        boolean z4 = false;
        while (m0(this.M, this.N)) {
            z4 = true;
            this.f1571b = true;
            try {
                Z0(this.M, this.N);
            } finally {
                r();
            }
        }
        m1();
        V();
        this.f1572c.b();
        return z4;
    }

    void b0(l lVar, boolean z3) {
        if (z3 && (this.f1591v == null || this.K)) {
            return;
        }
        Z(z3);
        if (lVar.a(this.M, this.N)) {
            this.f1571b = true;
            try {
                Z0(this.M, this.N);
            } finally {
                r();
            }
        }
        m1();
        V();
        this.f1572c.b();
    }

    void b1(Parcelable parcelable) {
        String d4;
        d0 d0Var;
        Bundle bundle;
        Bundle bundle2;
        if (parcelable == null) {
            return;
        }
        Bundle bundle3 = (Bundle) parcelable;
        for (String str : bundle3.keySet()) {
            if (str.startsWith("result_") && (bundle2 = bundle3.getBundle(str)) != null) {
                bundle2.setClassLoader(this.f1591v.u().getClassLoader());
                this.f1580k.put(str.substring(7), bundle2);
            }
        }
        ArrayList arrayList = new ArrayList();
        for (String str2 : bundle3.keySet()) {
            if (str2.startsWith("fragment_") && (bundle = bundle3.getBundle(str2)) != null) {
                bundle.setClassLoader(this.f1591v.u().getClassLoader());
                arrayList.add((c0) bundle.getParcelable("state"));
            }
        }
        this.f1572c.x(arrayList);
        z zVar = (z) bundle3.getParcelable("state");
        if (zVar == null) {
            return;
        }
        this.f1572c.v();
        ArrayList arrayList2 = zVar.f1612e;
        int size = arrayList2.size();
        int i4 = 0;
        while (true) {
            d4 = c3.d4(1358);
            if (i4 >= size) {
                break;
            }
            Object obj = arrayList2.get(i4);
            i4++;
            c0 B = this.f1572c.B((String) obj, null);
            if (B != null) {
                Fragment i5 = this.P.i(B.f1352f);
                if (i5 != null) {
                    if (G0(2)) {
                        Log.v("FragmentManager", "restoreSaveState: re-attaching retained " + i5);
                    }
                    d0Var = new d0(this.f1583n, this.f1572c, i5, B);
                } else {
                    d0Var = new d0(this.f1583n, this.f1572c, this.f1591v.u().getClassLoader(), r0(), B);
                }
                Fragment k4 = d0Var.k();
                k4.f1286t = this;
                if (G0(2)) {
                    Log.v("FragmentManager", "restoreSaveState: active (" + k4.f1272f + d4 + k4);
                }
                d0Var.o(this.f1591v.u().getClassLoader());
                this.f1572c.r(d0Var);
                d0Var.t(this.f1590u);
            }
        }
        for (Fragment fragment : this.P.l()) {
            if (!this.f1572c.c(fragment.f1272f)) {
                if (G0(2)) {
                    Log.v("FragmentManager", "Discarding retained Fragment " + fragment + c3.d4(673) + zVar.f1612e);
                }
                this.P.o(fragment);
                fragment.f1286t = this;
                d0 d0Var2 = new d0(this.f1583n, this.f1572c, fragment);
                d0Var2.t(1);
                d0Var2.m();
                fragment.f1279m = true;
                d0Var2.m();
            }
        }
        this.f1572c.w(zVar.f1613f);
        if (zVar.f1614g != null) {
            this.f1573d = new ArrayList(zVar.f1614g.length);
            int i6 = 0;
            while (true) {
                androidx.fragment.app.b[] bVarArr = zVar.f1614g;
                if (i6 >= bVarArr.length) {
                    break;
                }
                androidx.fragment.app.a q3 = bVarArr[i6].q(this);
                if (G0(2)) {
                    Log.v("FragmentManager", c3.d4(971) + i6 + " (index " + q3.f1325v + d4 + q3);
                    PrintWriter printWriter = new PrintWriter(new k0("FragmentManager"));
                    q3.q("  ", printWriter, false);
                    printWriter.close();
                }
                this.f1573d.add(q3);
                i6++;
            }
        } else {
            this.f1573d = null;
        }
        this.f1578i.set(zVar.f1615h);
        String str3 = zVar.f1616i;
        if (str3 != null) {
            Fragment e02 = e0(str3);
            this.f1594y = e02;
            L(e02);
        }
        ArrayList arrayList3 = zVar.f1617j;
        if (arrayList3 != null) {
            for (int i7 = 0; i7 < arrayList3.size(); i7++) {
                this.f1579j.put((String) arrayList3.get(i7), (androidx.fragment.app.c) zVar.f1618k.get(i7));
            }
        }
        this.G = new ArrayDeque(zVar.f1619l);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public Bundle d1() {
        androidx.fragment.app.b[] bVarArr;
        int size;
        Bundle bundle = new Bundle();
        l0();
        X();
        a0(true);
        this.I = true;
        this.P.p(true);
        ArrayList y3 = this.f1572c.y();
        ArrayList m3 = this.f1572c.m();
        if (!m3.isEmpty()) {
            ArrayList z3 = this.f1572c.z();
            ArrayList arrayList = this.f1573d;
            int i4 = 0;
            if (arrayList == null || (size = arrayList.size()) <= 0) {
                bVarArr = null;
            } else {
                bVarArr = new androidx.fragment.app.b[size];
                for (int i5 = 0; i5 < size; i5++) {
                    bVarArr[i5] = new androidx.fragment.app.b((androidx.fragment.app.a) this.f1573d.get(i5));
                    if (G0(2)) {
                        Log.v("FragmentManager", "saveAllState: adding back stack #" + i5 + ": " + this.f1573d.get(i5));
                    }
                }
            }
            z zVar = new z();
            zVar.f1612e = y3;
            zVar.f1613f = z3;
            zVar.f1614g = bVarArr;
            zVar.f1615h = this.f1578i.get();
            Fragment fragment = this.f1594y;
            if (fragment != null) {
                zVar.f1616i = fragment.f1272f;
            }
            zVar.f1617j.addAll(this.f1579j.keySet());
            zVar.f1618k.addAll(this.f1579j.values());
            zVar.f1619l = new ArrayList(this.G);
            bundle.putParcelable("state", zVar);
            for (String str : this.f1580k.keySet()) {
                bundle.putBundle("result_" + str, (Bundle) this.f1580k.get(str));
            }
            int size2 = m3.size();
            while (i4 < size2) {
                Object obj = m3.get(i4);
                i4++;
                c0 c0Var = (c0) obj;
                Bundle bundle2 = new Bundle();
                bundle2.putParcelable("state", c0Var);
                bundle.putBundle("fragment_" + c0Var.f1352f, bundle2);
            }
        } else if (G0(2)) {
            Log.v("FragmentManager", "saveAllState: no fragments!");
            return bundle;
        }
        return bundle;
    }

    Fragment e0(String str) {
        return this.f1572c.f(str);
    }

    void e1() {
        synchronized (this.f1570a) {
            try {
                if (this.f1570a.size() == 1) {
                    this.f1591v.v().removeCallbacks(this.R);
                    this.f1591v.v().post(this.R);
                    m1();
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    void f1(Fragment fragment, boolean z3) {
        ViewGroup q02 = q0(fragment);
        if (q02 == null || !(q02 instanceof androidx.fragment.app.m)) {
            return;
        }
        ((androidx.fragment.app.m) q02).setDrawDisappearingViewsLast(!z3);
    }

    public Fragment g0(int i4) {
        return this.f1572c.g(i4);
    }

    void g1(Fragment fragment, g.c cVar) {
        if (fragment.equals(e0(fragment.f1272f)) && (fragment.f1287u == null || fragment.f1286t == this)) {
            fragment.S = cVar;
            return;
        }
        throw new IllegalArgumentException(c3.d4(875) + fragment + " is not an active fragment of FragmentManager " + this);
    }

    public Fragment h0(String str) {
        return this.f1572c.h(str);
    }

    void h1(Fragment fragment) {
        if (fragment == null || (fragment.equals(e0(fragment.f1272f)) && (fragment.f1287u == null || fragment.f1286t == this))) {
            Fragment fragment2 = this.f1594y;
            this.f1594y = fragment;
            L(fragment2);
            L(this.f1594y);
            return;
        }
        throw new IllegalArgumentException("Fragment " + fragment + " is not an active fragment of FragmentManager " + this);
    }

    void i(androidx.fragment.app.a aVar) {
        if (this.f1573d == null) {
            this.f1573d = new ArrayList();
        }
        this.f1573d.add(aVar);
    }

    Fragment i0(String str) {
        return this.f1572c.i(str);
    }

    d0 j(Fragment fragment) {
        String str = fragment.R;
        if (str != null) {
            v.c.f(fragment, str);
        }
        if (G0(2)) {
            Log.v(c3.d4(8), "add: " + fragment);
        }
        d0 v3 = v(fragment);
        fragment.f1286t = this;
        this.f1572c.r(v3);
        if (!fragment.B) {
            this.f1572c.a(fragment);
            fragment.f1279m = false;
            if (fragment.I == null) {
                fragment.O = false;
            }
            if (H0(fragment)) {
                this.H = true;
            }
        }
        return v3;
    }

    void j1(Fragment fragment) {
        if (G0(2)) {
            Log.v(c3.d4(368), "show: " + fragment);
        }
        if (fragment.A) {
            fragment.A = false;
            fragment.O = !fragment.O;
        }
    }

    public void k(b0 b0Var) {
        this.f1584o.add(b0Var);
    }

    int l() {
        return this.f1578i.getAndIncrement();
    }

    /* JADX WARN: Multi-variable type inference failed */
    void m(p pVar, androidx.fragment.app.l lVar, Fragment fragment) {
        String str;
        if (this.f1591v != null) {
            throw new IllegalStateException("Already attached");
        }
        this.f1591v = pVar;
        this.f1592w = lVar;
        this.f1593x = fragment;
        if (fragment != null) {
            k(new g(fragment));
        } else if (pVar instanceof b0) {
            k((b0) pVar);
        }
        if (this.f1593x != null) {
            m1();
        }
        if (pVar instanceof androidx.activity.l) {
            androidx.activity.l lVar2 = (androidx.activity.l) pVar;
            OnBackPressedDispatcher b4 = lVar2.b();
            this.f1576g = b4;
            androidx.lifecycle.k kVar = lVar2;
            if (fragment != null) {
                kVar = fragment;
            }
            b4.b(kVar, this.f1577h);
        }
        if (fragment != null) {
            this.P = fragment.f1286t.o0(fragment);
        } else if (pVar instanceof androidx.lifecycle.b0) {
            this.P = a0.k(((androidx.lifecycle.b0) pVar).o());
        } else {
            this.P = new a0(false);
        }
        this.P.p(N0());
        this.f1572c.A(this.P);
        Object obj = this.f1591v;
        if ((obj instanceof z.e) && fragment == null) {
            z.c c4 = ((z.e) obj).c();
            c4.h("android:support:fragments", new c.InterfaceC0086c() { // from class: androidx.fragment.app.w
                @Override // z.c.InterfaceC0086c
                public final Bundle a() {
                    Bundle d12;
                    d12 = x.this.d1();
                    return d12;
                }
            });
            Bundle b5 = c4.b("android:support:fragments");
            if (b5 != null) {
                b1(b5);
            }
        }
        Object obj2 = this.f1591v;
        if (obj2 instanceof androidx.activity.result.d) {
            ActivityResultRegistry m3 = ((androidx.activity.result.d) obj2).m();
            if (fragment != null) {
                str = fragment.f1272f + ":";
            } else {
                str = "";
            }
            String str2 = "FragmentManager:" + str;
            this.D = m3.j(str2 + "StartActivityForResult", new b.c(), new h());
            this.E = m3.j(str2 + "StartIntentSenderForResult", new j(), new i());
            this.F = m3.j(str2 + "RequestPermissions", new b.b(), new a());
        }
        Object obj3 = this.f1591v;
        if (obj3 instanceof androidx.core.content.b) {
            ((androidx.core.content.b) obj3).f(this.f1585p);
        }
        Object obj4 = this.f1591v;
        if (obj4 instanceof androidx.core.content.c) {
            ((androidx.core.content.c) obj4).i(this.f1586q);
        }
        Object obj5 = this.f1591v;
        if (obj5 instanceof androidx.core.app.x) {
            ((androidx.core.app.x) obj5).n(this.f1587r);
        }
        Object obj6 = this.f1591v;
        if (obj6 instanceof androidx.core.app.y) {
            ((androidx.core.app.y) obj6).k(this.f1588s);
        }
        Object obj7 = this.f1591v;
        if ((obj7 instanceof androidx.core.view.i) && fragment == null) {
            ((androidx.core.view.i) obj7).l(this.f1589t);
        }
    }

    void n(Fragment fragment) {
        if (G0(2)) {
            Log.v("FragmentManager", "attach: " + fragment);
        }
        if (fragment.B) {
            fragment.B = false;
            if (fragment.f1278l) {
                return;
            }
            this.f1572c.a(fragment);
            if (G0(2)) {
                Log.v("FragmentManager", "add from attach: " + fragment);
            }
            if (H0(fragment)) {
                this.H = true;
            }
        }
    }

    public int n0() {
        ArrayList arrayList = this.f1573d;
        if (arrayList != null) {
            return arrayList.size();
        }
        return 0;
    }

    public f0 o() {
        return new androidx.fragment.app.a(this);
    }

    boolean p() {
        boolean z3 = false;
        for (Fragment fragment : this.f1572c.l()) {
            if (fragment != null) {
                z3 = H0(fragment);
            }
            if (z3) {
                return true;
            }
        }
        return false;
    }

    androidx.fragment.app.l p0() {
        return this.f1592w;
    }

    public o r0() {
        o oVar = this.f1595z;
        if (oVar != null) {
            return oVar;
        }
        Fragment fragment = this.f1593x;
        return fragment != null ? fragment.f1286t.r0() : this.A;
    }

    public List s0() {
        return this.f1572c.o();
    }

    public p t0() {
        return this.f1591v;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(128);
        sb.append(c3.d4(57));
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        sb.append(" in ");
        Fragment fragment = this.f1593x;
        if (fragment != null) {
            sb.append(fragment.getClass().getSimpleName());
            sb.append("{");
            sb.append(Integer.toHexString(System.identityHashCode(this.f1593x)));
            sb.append("}");
        } else {
            p pVar = this.f1591v;
            if (pVar != null) {
                sb.append(pVar.getClass().getSimpleName());
                sb.append("{");
                sb.append(Integer.toHexString(System.identityHashCode(this.f1591v)));
                sb.append("}");
            } else {
                sb.append(c3.d4(1155));
            }
        }
        sb.append(c3.d4(58));
        return sb.toString();
    }

    LayoutInflater.Factory2 u0() {
        return this.f1575f;
    }

    d0 v(Fragment fragment) {
        d0 n3 = this.f1572c.n(fragment.f1272f);
        if (n3 != null) {
            return n3;
        }
        d0 d0Var = new d0(this.f1583n, this.f1572c, fragment);
        d0Var.o(this.f1591v.u().getClassLoader());
        d0Var.t(this.f1590u);
        return d0Var;
    }

    r v0() {
        return this.f1583n;
    }

    void w(Fragment fragment) {
        if (G0(2)) {
            Log.v("FragmentManager", "detach: " + fragment);
        }
        if (fragment.B) {
            return;
        }
        fragment.B = true;
        if (fragment.f1278l) {
            if (G0(2)) {
                Log.v("FragmentManager", "remove from detach: " + fragment);
            }
            this.f1572c.u(fragment);
            if (H0(fragment)) {
                this.H = true;
            }
            i1(fragment);
        }
    }

    Fragment w0() {
        return this.f1593x;
    }

    void x() {
        this.I = false;
        this.J = false;
        this.P.p(false);
        S(4);
    }

    public Fragment x0() {
        return this.f1594y;
    }

    void y() {
        this.I = false;
        this.J = false;
        this.P.p(false);
        S(0);
    }

    m0 y0() {
        m0 m0Var = this.B;
        if (m0Var != null) {
            return m0Var;
        }
        Fragment fragment = this.f1593x;
        return fragment != null ? fragment.f1286t.y0() : this.C;
    }

    void z(Configuration configuration, boolean z3) {
        if (z3 && (this.f1591v instanceof androidx.core.content.b)) {
            l1(new IllegalStateException("Do not call dispatchConfigurationChanged() on host. Host implements OnConfigurationChangedProvider and automatically dispatches configuration changes to fragments."));
        }
        for (Fragment fragment : this.f1572c.o()) {
            if (fragment != null) {
                fragment.P0(configuration);
                if (z3) {
                    fragment.f1288v.z(configuration, true);
                }
            }
        }
    }

    public c.C0078c z0() {
        return this.Q;
    }
}
