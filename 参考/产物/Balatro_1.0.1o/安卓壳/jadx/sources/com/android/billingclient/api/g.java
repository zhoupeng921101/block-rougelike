package com.android.billingclient.api;

import a1.b2.c3;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g {

    /* renamed from: a, reason: collision with root package name */
    private final com.google.android.gms.internal.play_billing.i0 f2369a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private com.google.android.gms.internal.play_billing.i0 f2370a;

        /* synthetic */ a(e0.a0 a0Var) {
        }

        public g a() {
            if (this.f2370a != null) {
                return new g(this, null);
            }
            throw new IllegalArgumentException("Product list must be set to a non empty list.");
        }

        public a b(List list) {
            if (list == null || list.isEmpty()) {
                throw new IllegalArgumentException(c3.d4(781));
            }
            HashSet hashSet = new HashSet();
            Iterator it = list.iterator();
            while (it.hasNext()) {
                b bVar = (b) it.next();
                if (!"play_pass_subs".equals(bVar.c())) {
                    hashSet.add(bVar.c());
                }
            }
            if (hashSet.size() > 1) {
                throw new IllegalArgumentException("All products should be of the same product type.");
            }
            this.f2370a = com.google.android.gms.internal.play_billing.i0.l(list);
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class b {

        /* renamed from: a, reason: collision with root package name */
        private final String f2371a;

        /* renamed from: b, reason: collision with root package name */
        private final String f2372b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static class a {

            /* renamed from: a, reason: collision with root package name */
            private String f2373a;

            /* renamed from: b, reason: collision with root package name */
            private String f2374b;

            /* synthetic */ a(e0.a0 a0Var) {
            }

            public b a() {
                String str = this.f2374b;
                if ("first_party".equals(str)) {
                    throw new IllegalArgumentException("Serialized doc id must be provided for first party products.");
                }
                if (this.f2373a == null) {
                    throw new IllegalArgumentException(c3.d4(380));
                }
                if (str != null) {
                    return new b(this, null);
                }
                throw new IllegalArgumentException("Product type must be provided.");
            }

            public a b(String str) {
                this.f2373a = str;
                return this;
            }

            public a c(String str) {
                this.f2374b = str;
                return this;
            }
        }

        /* synthetic */ b(a aVar, e0.a0 a0Var) {
            this.f2371a = aVar.f2373a;
            this.f2372b = aVar.f2374b;
        }

        public static a a() {
            return new a(null);
        }

        public final String b() {
            return this.f2371a;
        }

        public final String c() {
            return this.f2372b;
        }
    }

    /* synthetic */ g(a aVar, e0.a0 a0Var) {
        this.f2369a = aVar.f2370a;
    }

    public static a a() {
        return new a(null);
    }

    public final com.google.android.gms.internal.play_billing.i0 b() {
        return this.f2369a;
    }

    public final String c() {
        return ((b) this.f2369a.get(0)).c();
    }
}
