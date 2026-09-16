package com.android.billingclient.api;

import a1.b2.c3;
import android.text.TextUtils;
import com.android.billingclient.api.f;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c {

    /* renamed from: a, reason: collision with root package name */
    private boolean f2271a;

    /* renamed from: b, reason: collision with root package name */
    private String f2272b;

    /* renamed from: c, reason: collision with root package name */
    private String f2273c;

    /* renamed from: d, reason: collision with root package name */
    private C0034c f2274d;

    /* renamed from: e, reason: collision with root package name */
    private com.google.android.gms.internal.play_billing.i0 f2275e;

    /* renamed from: f, reason: collision with root package name */
    private ArrayList f2276f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f2277g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private String f2278a;

        /* renamed from: b, reason: collision with root package name */
        private String f2279b;

        /* renamed from: c, reason: collision with root package name */
        private List f2280c;

        /* renamed from: d, reason: collision with root package name */
        private ArrayList f2281d;

        /* renamed from: e, reason: collision with root package name */
        private boolean f2282e;

        /* renamed from: f, reason: collision with root package name */
        private C0034c.a f2283f;

        /* synthetic */ a(e0.u uVar) {
            C0034c.a a4 = C0034c.a();
            C0034c.a.b(a4);
            this.f2283f = a4;
        }

        public c a() {
            ArrayList arrayList = this.f2281d;
            boolean z3 = (arrayList == null || arrayList.isEmpty()) ? false : true;
            List list = this.f2280c;
            boolean z4 = (list == null || list.isEmpty()) ? false : true;
            if (!z3 && !z4) {
                throw new IllegalArgumentException("Details of the products must be provided.");
            }
            if (z3 && z4) {
                throw new IllegalArgumentException("Set SkuDetails or ProductDetailsParams, not both.");
            }
            e0.u uVar = null;
            if (!z3) {
                List list2 = this.f2280c;
                if (list2 != null) {
                    Iterator it = list2.iterator();
                    while (it.hasNext()) {
                        if (((b) it.next()) == null) {
                            throw new IllegalArgumentException("ProductDetailsParams cannot be null.");
                        }
                    }
                }
            } else {
                if (this.f2281d.contains(null)) {
                    throw new IllegalArgumentException(c3.d4(64));
                }
                if (this.f2281d.size() > 1) {
                    h.d.a(this.f2281d.get(0));
                    throw null;
                }
            }
            c cVar = new c(uVar);
            if (z3) {
                h.d.a(this.f2281d.get(0));
                throw null;
            }
            cVar.f2271a = z4 && !((b) this.f2280c.get(0)).c().f().isEmpty();
            cVar.f2272b = this.f2278a;
            cVar.f2273c = this.f2279b;
            cVar.f2274d = this.f2283f.a();
            ArrayList arrayList2 = this.f2281d;
            cVar.f2276f = arrayList2 != null ? new ArrayList(arrayList2) : new ArrayList();
            cVar.f2277g = this.f2282e;
            List list3 = this.f2280c;
            cVar.f2275e = list3 != null ? com.google.android.gms.internal.play_billing.i0.l(list3) : com.google.android.gms.internal.play_billing.i0.m();
            cVar.getClass();
            return cVar;
        }

        public a b(List list) {
            this.f2280c = new ArrayList(list);
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private final f f2284a;

        /* renamed from: b, reason: collision with root package name */
        private final String f2285b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static class a {

            /* renamed from: a, reason: collision with root package name */
            private f f2286a;

            /* renamed from: b, reason: collision with root package name */
            private String f2287b;

            /* synthetic */ a(e0.u uVar) {
            }

            static /* bridge */ /* synthetic */ C0033b c(a aVar) {
                aVar.getClass();
                return null;
            }

            public b a() {
                com.google.android.gms.internal.play_billing.v.c(this.f2286a, "ProductDetails is required for constructing ProductDetailsParams.");
                return new b(this, null);
            }

            public a b(f fVar) {
                this.f2286a = fVar;
                if (fVar.a() != null) {
                    fVar.a().getClass();
                    f.b a4 = fVar.a();
                    if (a4.b() != null) {
                        this.f2287b = a4.b();
                    }
                }
                return this;
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: com.android.billingclient.api.c$b$b, reason: collision with other inner class name */
        public static class C0033b {
        }

        /* synthetic */ b(a aVar, e0.u uVar) {
            this.f2284a = aVar.f2286a;
            this.f2285b = aVar.f2287b;
            a.c(aVar);
        }

        public static a b() {
            return new a(null);
        }

        public C0033b a() {
            return null;
        }

        public final f c() {
            return this.f2284a;
        }

        public final String d() {
            return this.f2285b;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: com.android.billingclient.api.c$c, reason: collision with other inner class name */
    public static class C0034c {

        /* renamed from: a, reason: collision with root package name */
        private String f2288a;

        /* renamed from: b, reason: collision with root package name */
        private String f2289b;

        /* renamed from: c, reason: collision with root package name */
        private int f2290c = 0;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: com.android.billingclient.api.c$c$a */
        public static class a {

            /* renamed from: a, reason: collision with root package name */
            private String f2291a;

            /* renamed from: b, reason: collision with root package name */
            private String f2292b;

            /* renamed from: c, reason: collision with root package name */
            private boolean f2293c;

            /* renamed from: d, reason: collision with root package name */
            private int f2294d = 0;

            /* synthetic */ a(e0.u uVar) {
            }

            static /* synthetic */ a b(a aVar) {
                aVar.f2293c = true;
                return aVar;
            }

            public C0034c a() {
                boolean z3 = true;
                e0.u uVar = null;
                if (TextUtils.isEmpty(this.f2291a) && TextUtils.isEmpty(null)) {
                    z3 = false;
                }
                boolean isEmpty = TextUtils.isEmpty(this.f2292b);
                if (z3 && !isEmpty) {
                    throw new IllegalArgumentException(c3.d4(1413));
                }
                if (!this.f2293c && !z3 && isEmpty) {
                    throw new IllegalArgumentException(c3.d4(239));
                }
                C0034c c0034c = new C0034c(uVar);
                c0034c.f2288a = this.f2291a;
                c0034c.f2290c = this.f2294d;
                c0034c.f2289b = this.f2292b;
                return c0034c;
            }
        }

        /* synthetic */ C0034c(e0.u uVar) {
        }

        public static a a() {
            return new a(null);
        }

        final int b() {
            return this.f2290c;
        }

        final String c() {
            return this.f2288a;
        }

        final String d() {
            return this.f2289b;
        }
    }

    /* synthetic */ c(e0.u uVar) {
    }

    public static a b() {
        return new a(null);
    }

    public e0.e a() {
        return null;
    }

    public int c() {
        return 0;
    }

    public final int d() {
        return this.f2274d.b();
    }

    public long e() {
        return 0L;
    }

    final d f() {
        f.b bVar;
        if (this.f2275e.isEmpty()) {
            return p0.f2430i;
        }
        b bVar2 = (b) this.f2275e.get(0);
        for (int i4 = 1; i4 < this.f2275e.size(); i4++) {
            b bVar3 = (b) this.f2275e.get(i4);
            if (!bVar3.c().d().equals(bVar2.c().d()) && !bVar3.c().d().equals("play_pass_subs")) {
                return p0.a(5, "All products should have same ProductType.");
            }
        }
        String f4 = bVar2.c().f();
        HashMap hashMap = new HashMap();
        HashSet hashSet = new HashSet();
        com.google.android.gms.internal.play_billing.i0 i0Var = this.f2275e;
        int size = i0Var.size();
        for (int i5 = 0; i5 < size; i5++) {
            b bVar4 = (b) i0Var.get(i5);
            bVar4.a();
            if (bVar4.c().e() != null && bVar4.d() == null) {
                return p0.a(5, String.format("offerToken is required for constructing ProductDetailsParams for subscriptions. Missing value for product id: %s", bVar4.c().c()));
            }
            if (hashMap.containsKey(bVar4.c().c())) {
                return p0.a(5, String.format("ProductId can not be duplicated. Invalid product id: %s.", bVar4.c().c()));
            }
            hashMap.put(bVar4.c().c(), bVar4);
            if (!bVar2.c().d().equals("play_pass_subs") && !bVar4.c().d().equals("play_pass_subs") && !f4.equals(bVar4.c().f())) {
                return p0.a(5, c3.d4(375));
            }
        }
        Iterator it = hashSet.iterator();
        while (it.hasNext()) {
            String str = (String) it.next();
            if (hashMap.containsKey(str)) {
                ((b) hashMap.get(str)).a();
                return p0.a(5, String.format("OldProductId must not be one of the products to be purchased. Invalid old product id: %s.", str));
            }
        }
        List b4 = bVar2.c().b();
        String d4 = bVar2.d();
        if (d4 != null && b4 != null) {
            Iterator it2 = b4.iterator();
            while (true) {
                if (!it2.hasNext()) {
                    bVar = null;
                    break;
                }
                bVar = (f.b) it2.next();
                if (d4.equals(bVar.b())) {
                    break;
                }
            }
            if (bVar != null && bVar.e() != null) {
                return p0.a(5, "Both autoPayDetails and autoPayBalanceThreshold is required for constructing ProductDetailsParams for autopay.");
            }
        }
        return p0.f2430i;
    }

    public final String g() {
        return this.f2272b;
    }

    public final String h() {
        return this.f2273c;
    }

    public String i() {
        return null;
    }

    public final String j() {
        return this.f2274d.c();
    }

    public final String k() {
        return this.f2274d.d();
    }

    public final ArrayList l() {
        ArrayList arrayList = new ArrayList();
        arrayList.addAll(this.f2276f);
        return arrayList;
    }

    public final List m() {
        return this.f2275e;
    }

    public final boolean v() {
        return this.f2277g;
    }

    final boolean w() {
        if (this.f2272b != null || this.f2273c != null || this.f2274d.d() != null || this.f2274d.b() != 0 || this.f2271a || this.f2277g) {
            return true;
        }
        com.google.android.gms.internal.play_billing.i0 i0Var = this.f2275e;
        if (i0Var != null) {
            int size = i0Var.size();
            for (int i4 = 0; i4 < size; i4++) {
                ((b) i0Var.get(i4)).a();
            }
        }
        return false;
    }
}
