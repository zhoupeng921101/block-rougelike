package com.android.billingclient.api;

import a1.b2.c3;
import android.text.TextUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.json.JSONArray;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f {

    /* renamed from: a, reason: collision with root package name */
    private final String f2313a;

    /* renamed from: b, reason: collision with root package name */
    private final JSONObject f2314b;

    /* renamed from: c, reason: collision with root package name */
    private final String f2315c;

    /* renamed from: d, reason: collision with root package name */
    private final String f2316d;

    /* renamed from: e, reason: collision with root package name */
    private final String f2317e;

    /* renamed from: f, reason: collision with root package name */
    private final String f2318f;

    /* renamed from: g, reason: collision with root package name */
    private final String f2319g;

    /* renamed from: h, reason: collision with root package name */
    private final String f2320h;

    /* renamed from: i, reason: collision with root package name */
    private final String f2321i;

    /* renamed from: j, reason: collision with root package name */
    private final List f2322j;

    /* renamed from: k, reason: collision with root package name */
    private final List f2323k;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private final int f2324a;

        /* renamed from: b, reason: collision with root package name */
        private final int f2325b;

        a(JSONObject jSONObject) {
            this.f2324a = jSONObject.getInt("commitmentPaymentsCount");
            this.f2325b = jSONObject.optInt("subsequentCommitmentPaymentsCount");
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private final String f2326a;

        /* renamed from: b, reason: collision with root package name */
        private final long f2327b;

        /* renamed from: c, reason: collision with root package name */
        private final String f2328c;

        /* renamed from: d, reason: collision with root package name */
        private final String f2329d;

        /* renamed from: e, reason: collision with root package name */
        private final String f2330e;

        /* renamed from: f, reason: collision with root package name */
        private final String f2331f;

        /* renamed from: g, reason: collision with root package name */
        private final List f2332g;

        /* renamed from: h, reason: collision with root package name */
        private final Long f2333h;

        /* renamed from: i, reason: collision with root package name */
        private final a f2334i;

        /* renamed from: j, reason: collision with root package name */
        private final e f2335j;

        /* renamed from: k, reason: collision with root package name */
        private final C0036b f2336k;

        /* renamed from: l, reason: collision with root package name */
        private final String f2337l;

        /* renamed from: m, reason: collision with root package name */
        private final c f2338m;

        /* renamed from: n, reason: collision with root package name */
        private final d f2339n;

        /* renamed from: o, reason: collision with root package name */
        private final s0 f2340o;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class a {

            /* renamed from: a, reason: collision with root package name */
            private final Integer f2341a;

            /* renamed from: b, reason: collision with root package name */
            private final C0035a f2342b;

            /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
            /* renamed from: com.android.billingclient.api.f$b$a$a, reason: collision with other inner class name */
            public static final class C0035a {

                /* renamed from: a, reason: collision with root package name */
                private final String f2343a;

                /* renamed from: b, reason: collision with root package name */
                private final long f2344b;

                /* renamed from: c, reason: collision with root package name */
                private final String f2345c;

                C0035a(JSONObject jSONObject) {
                    this.f2343a = jSONObject.optString("formattedDiscountAmount");
                    this.f2344b = jSONObject.optLong("discountAmountMicros");
                    this.f2345c = jSONObject.optString(c3.d4(427));
                }
            }

            a(JSONObject jSONObject) {
                this.f2341a = jSONObject.has("percentageDiscount") ? Integer.valueOf(jSONObject.optInt("percentageDiscount")) : null;
                JSONObject optJSONObject = jSONObject.optJSONObject(c3.d4(428));
                this.f2342b = optJSONObject != null ? new C0035a(optJSONObject) : null;
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: com.android.billingclient.api.f$b$b, reason: collision with other inner class name */
        public static final class C0036b {

            /* renamed from: a, reason: collision with root package name */
            private final int f2346a;

            /* renamed from: b, reason: collision with root package name */
            private final int f2347b;

            C0036b(JSONObject jSONObject) {
                this.f2346a = jSONObject.getInt("maximumQuantity");
                this.f2347b = jSONObject.getInt("remainingQuantity");
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class c {

            /* renamed from: a, reason: collision with root package name */
            private final long f2348a;

            /* renamed from: b, reason: collision with root package name */
            private final long f2349b;

            c(JSONObject jSONObject) {
                this.f2348a = jSONObject.getLong("preorderReleaseTimeMillis");
                this.f2349b = jSONObject.getLong(c3.d4(149));
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class d {

            /* renamed from: a, reason: collision with root package name */
            private final String f2350a;

            /* renamed from: b, reason: collision with root package name */
            private final String f2351b;

            d(JSONObject jSONObject) {
                this.f2350a = jSONObject.getString("rentalPeriod");
                String optString = jSONObject.optString(c3.d4(1366));
                this.f2351b = true == optString.isEmpty() ? null : optString;
            }
        }

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static final class e {

            /* renamed from: a, reason: collision with root package name */
            private final Long f2352a;

            /* renamed from: b, reason: collision with root package name */
            private final Long f2353b;

            e(JSONObject jSONObject) {
                this.f2352a = jSONObject.has("startTimeMillis") ? Long.valueOf(jSONObject.optLong("startTimeMillis")) : null;
                String d4 = c3.d4(682);
                this.f2353b = jSONObject.has(d4) ? Long.valueOf(jSONObject.optLong(d4)) : null;
            }
        }

        b(JSONObject jSONObject) {
            this.f2326a = jSONObject.optString("formattedPrice");
            this.f2327b = jSONObject.optLong("priceAmountMicros");
            this.f2328c = jSONObject.optString("priceCurrencyCode");
            String optString = jSONObject.optString("offerIdToken");
            this.f2329d = true == optString.isEmpty() ? null : optString;
            String optString2 = jSONObject.optString("offerId");
            this.f2330e = true == optString2.isEmpty() ? null : optString2;
            String optString3 = jSONObject.optString("purchaseOptionId");
            this.f2331f = true == optString3.isEmpty() ? null : optString3;
            jSONObject.optInt("offerType");
            JSONArray optJSONArray = jSONObject.optJSONArray("offerTags");
            this.f2332g = new ArrayList();
            if (optJSONArray != null) {
                for (int i4 = 0; i4 < optJSONArray.length(); i4++) {
                    this.f2332g.add(optJSONArray.getString(i4));
                }
            }
            this.f2333h = jSONObject.has("fullPriceMicros") ? Long.valueOf(jSONObject.optLong("fullPriceMicros")) : null;
            JSONObject optJSONObject = jSONObject.optJSONObject(c3.d4(619));
            this.f2334i = optJSONObject == null ? null : new a(optJSONObject);
            JSONObject optJSONObject2 = jSONObject.optJSONObject(c3.d4(779));
            this.f2335j = optJSONObject2 == null ? null : new e(optJSONObject2);
            JSONObject optJSONObject3 = jSONObject.optJSONObject(c3.d4(376));
            this.f2336k = optJSONObject3 == null ? null : new C0036b(optJSONObject3);
            this.f2337l = jSONObject.optString(c3.d4(568));
            JSONObject optJSONObject4 = jSONObject.optJSONObject("preorderDetails");
            this.f2338m = optJSONObject4 == null ? null : new c(optJSONObject4);
            JSONObject optJSONObject5 = jSONObject.optJSONObject("rentalDetails");
            this.f2339n = optJSONObject5 == null ? null : new d(optJSONObject5);
            JSONObject optJSONObject6 = jSONObject.optJSONObject(c3.d4(683));
            this.f2340o = optJSONObject6 != null ? new s0(optJSONObject6) : null;
            JSONArray optJSONArray2 = jSONObject.optJSONArray(c3.d4(377));
            if (optJSONArray2 == null) {
                return;
            }
            new d(optJSONArray2);
        }

        public String a() {
            return this.f2326a;
        }

        public String b() {
            return this.f2329d;
        }

        public long c() {
            return this.f2327b;
        }

        public String d() {
            return this.f2328c;
        }

        public final s0 e() {
            return this.f2340o;
        }

        final String f() {
            return this.f2337l;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class c {

        /* renamed from: a, reason: collision with root package name */
        private final String f2354a;

        /* renamed from: b, reason: collision with root package name */
        private final long f2355b;

        /* renamed from: c, reason: collision with root package name */
        private final String f2356c;

        /* renamed from: d, reason: collision with root package name */
        private final String f2357d;

        /* renamed from: e, reason: collision with root package name */
        private final int f2358e;

        /* renamed from: f, reason: collision with root package name */
        private final int f2359f;

        c(JSONObject jSONObject) {
            this.f2357d = jSONObject.optString(c3.d4(378));
            this.f2356c = jSONObject.optString("priceCurrencyCode");
            this.f2354a = jSONObject.optString("formattedPrice");
            this.f2355b = jSONObject.optLong("priceAmountMicros");
            this.f2359f = jSONObject.optInt("recurrenceMode");
            this.f2358e = jSONObject.optInt("billingCycleCount");
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class d {

        /* renamed from: a, reason: collision with root package name */
        private final List f2360a;

        d(JSONArray jSONArray) {
            ArrayList arrayList = new ArrayList();
            if (jSONArray != null) {
                for (int i4 = 0; i4 < jSONArray.length(); i4++) {
                    JSONObject optJSONObject = jSONArray.optJSONObject(i4);
                    if (optJSONObject != null) {
                        arrayList.add(new c(optJSONObject));
                    }
                }
            }
            this.f2360a = arrayList;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class e {

        /* renamed from: a, reason: collision with root package name */
        private final String f2361a;

        /* renamed from: b, reason: collision with root package name */
        private final String f2362b;

        /* renamed from: c, reason: collision with root package name */
        private final String f2363c;

        /* renamed from: d, reason: collision with root package name */
        private final d f2364d;

        /* renamed from: e, reason: collision with root package name */
        private final List f2365e;

        /* renamed from: f, reason: collision with root package name */
        private final a f2366f;

        e(JSONObject jSONObject) {
            String d4 = c3.d4(975);
            this.f2361a = jSONObject.optString(d4);
            String optString = jSONObject.optString("offerId");
            this.f2362b = true == optString.isEmpty() ? null : optString;
            this.f2363c = jSONObject.getString(c3.d4(780));
            this.f2364d = new d(jSONObject.getJSONArray(c3.d4(16)));
            JSONObject optJSONObject = jSONObject.optJSONObject("installmentPlanDetails");
            this.f2366f = optJSONObject != null ? new a(optJSONObject) : null;
            JSONObject optJSONObject2 = jSONObject.optJSONObject("transitionPlanDetails");
            if (optJSONObject2 != null) {
                optJSONObject2.getString(c3.d4(1448));
                optJSONObject2.optString("title");
                optJSONObject2.optString("name");
                optJSONObject2.optString(c3.d4(1070));
                optJSONObject2.optString(d4);
                JSONObject optJSONObject3 = optJSONObject2.optJSONObject(c3.d4(684));
                if (optJSONObject3 != null) {
                    new c(optJSONObject3);
                }
            }
            ArrayList arrayList = new ArrayList();
            JSONArray optJSONArray = jSONObject.optJSONArray("offerTags");
            if (optJSONArray != null) {
                for (int i4 = 0; i4 < optJSONArray.length(); i4++) {
                    arrayList.add(optJSONArray.getString(i4));
                }
            }
            this.f2365e = arrayList;
        }
    }

    f(String str) {
        this.f2313a = str;
        JSONObject jSONObject = new JSONObject(str);
        this.f2314b = jSONObject;
        String optString = jSONObject.optString("productId");
        this.f2315c = optString;
        String optString2 = jSONObject.optString(c3.d4(1115));
        this.f2316d = optString2;
        if (TextUtils.isEmpty(optString)) {
            throw new IllegalArgumentException(c3.d4(923));
        }
        if (TextUtils.isEmpty(optString2)) {
            throw new IllegalArgumentException("Product type cannot be empty.");
        }
        this.f2317e = jSONObject.optString("title");
        this.f2318f = jSONObject.optString("name");
        this.f2319g = jSONObject.optString("description");
        jSONObject.optString("packageDisplayName");
        jSONObject.optString("iconUrl");
        this.f2320h = jSONObject.optString("skuDetailsToken");
        this.f2321i = jSONObject.optString("serializedDocid");
        JSONArray optJSONArray = jSONObject.optJSONArray("subscriptionOfferDetails");
        if (optJSONArray != null) {
            ArrayList arrayList = new ArrayList();
            for (int i4 = 0; i4 < optJSONArray.length(); i4++) {
                arrayList.add(new e(optJSONArray.getJSONObject(i4)));
            }
            this.f2322j = arrayList;
        } else {
            this.f2322j = (optString2.equals("subs") || optString2.equals(c3.d4(379))) ? new ArrayList() : null;
        }
        JSONObject optJSONObject = this.f2314b.optJSONObject(c3.d4(685));
        JSONArray optJSONArray2 = this.f2314b.optJSONArray(c3.d4(922));
        ArrayList arrayList2 = new ArrayList();
        if (optJSONArray2 != null) {
            for (int i5 = 0; i5 < optJSONArray2.length(); i5++) {
                arrayList2.add(new b(optJSONArray2.getJSONObject(i5)));
            }
            this.f2323k = arrayList2;
            return;
        }
        if (optJSONObject == null) {
            this.f2323k = null;
        } else {
            arrayList2.add(new b(optJSONObject));
            this.f2323k = arrayList2;
        }
    }

    public b a() {
        List list = this.f2323k;
        if (list == null || list.isEmpty()) {
            return null;
        }
        return (b) list.get(0);
    }

    public List b() {
        return this.f2323k;
    }

    public String c() {
        return this.f2315c;
    }

    public String d() {
        return this.f2316d;
    }

    public List e() {
        return this.f2322j;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof f) {
            return TextUtils.equals(this.f2313a, ((f) obj).f2313a);
        }
        return false;
    }

    public final String f() {
        return this.f2314b.optString("packageName");
    }

    final String g() {
        return this.f2320h;
    }

    final String h(String str) {
        List<b> list;
        if (!TextUtils.isEmpty(str) && (list = this.f2323k) != null && !list.isEmpty()) {
            for (b bVar : list) {
                if (!TextUtils.isEmpty(bVar.f()) && Objects.equals(bVar.b(), str)) {
                    return bVar.f();
                }
            }
        }
        return this.f2321i;
    }

    public int hashCode() {
        return this.f2313a.hashCode();
    }

    public String toString() {
        List list = this.f2322j;
        return "ProductDetails{jsonString='" + this.f2313a + "', parsedJson=" + this.f2314b.toString() + ", productId='" + this.f2315c + "', productType='" + this.f2316d + "', title='" + this.f2317e + "', productDetailsToken='" + this.f2320h + "', subscriptionOfferDetails=" + String.valueOf(list) + c3.d4(521);
    }
}
