package com.google.android.gms.internal.play_billing;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.c;
import com.android.billingclient.api.d;
import com.android.billingclient.api.g;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import org.json.JSONException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class m0 {

    /* renamed from: a, reason: collision with root package name */
    public static final int f2862a = Runtime.getRuntime().availableProcessors();

    public static int a(Intent intent, String str) {
        String d4 = a1.b2.c3.d4(1120);
        if (intent != null) {
            return o(intent.getExtras(), d4);
        }
        m(d4, "Got null intent!");
        return 0;
    }

    public static int b(Bundle bundle, String str) {
        if (bundle == null) {
            m(str, a1.b2.c3.d4(1121));
            return 6;
        }
        Object obj = bundle.get("RESPONSE_CODE");
        if (obj == null) {
            l(str, a1.b2.c3.d4(334));
            return 0;
        }
        if (obj instanceof Integer) {
            return ((Integer) obj).intValue();
        }
        m(str, a1.b2.c3.d4(1228).concat(obj.getClass().getName()));
        return 6;
    }

    public static Bundle c(Bundle bundle, String str, String str2, long j4) {
        bundle.putString(a1.b2.c3.d4(628), str);
        if (str2 != null) {
            bundle.putString("playBillingLibraryWrapperVersion", str2);
        }
        bundle.putLong("billingClientSessionId", j4);
        return bundle;
    }

    public static Bundle d(com.android.billingclient.api.d dVar, n6 n6Var) {
        Bundle bundle = new Bundle();
        bundle.putInt("RESPONSE_CODE", dVar.c());
        bundle.putString("DEBUG_MESSAGE", dVar.a());
        bundle.putInt("LOG_REASON", n6Var.a());
        return bundle;
    }

    public static Bundle e(com.android.billingclient.api.d dVar, n6 n6Var, String str) {
        Bundle d4 = d(dVar, n6Var);
        if (str != null) {
            d4.putString("ADDITIONAL_LOG_DETAILS", str);
        }
        return d4;
    }

    public static Bundle f(com.android.billingclient.api.c cVar, boolean z3, boolean z4, boolean z5, boolean z6, boolean z7, String str, String str2, long j4, String str3, long j5) {
        Bundle bundle = new Bundle();
        c(bundle, str, str2, j4);
        bundle.putLong("billingClientTransactionId", j5);
        if (cVar.d() != 0) {
            bundle.putInt("prorationMode", cVar.d());
        }
        if (!TextUtils.isEmpty(cVar.g())) {
            bundle.putString("accountId", cVar.g());
        }
        if (!TextUtils.isEmpty(cVar.h())) {
            bundle.putString("obfuscatedProfileId", cVar.h());
        }
        if (cVar.v()) {
            bundle.putBoolean("isOfferPersonalizedByDeveloper", true);
        }
        if (!TextUtils.isEmpty(null)) {
            bundle.putStringArrayList("skusToReplace", new ArrayList<>(Arrays.asList(null)));
        }
        if (!TextUtils.isEmpty(cVar.j())) {
            bundle.putString("oldSkuPurchaseToken", cVar.j());
        }
        cVar.i();
        if (!TextUtils.isEmpty(null)) {
            cVar.i();
            bundle.putString("oldSkuPurchaseId", null);
        }
        if (!TextUtils.isEmpty(cVar.k())) {
            bundle.putString("originalExternalTransactionId", cVar.k());
        }
        if (!TextUtils.isEmpty(null)) {
            bundle.putString("paymentsPurchaseParams", null);
        }
        if (z3 && z5) {
            bundle.putBoolean("enablePendingPurchases", true);
        }
        if (z4 && z6) {
            bundle.putBoolean("enablePendingPurchaseForSubscriptions", true);
        }
        if (z7) {
            bundle.putBoolean("enableAlternativeBilling", true);
        } else {
            cVar.a();
        }
        cVar.e();
        cVar.c();
        cVar.a();
        ArrayList arrayList = new ArrayList();
        Iterator it = cVar.m().iterator();
        while (it.hasNext()) {
            ((c.b) it.next()).a();
        }
        if (!arrayList.isEmpty()) {
            m2 C = n2.C();
            C.m(arrayList);
            bundle.putByteArray("subscriptionProductReplacementParamsList", ((n2) C.i()).b());
        }
        return bundle;
    }

    public static Bundle g(String str, String str2, ArrayList arrayList, String str3, String str4, a aVar, long j4) {
        boolean z3;
        Bundle bundle = new Bundle();
        c(bundle, str, str2, j4);
        bundle.putBoolean("enablePendingPurchases", true);
        bundle.putString(a1.b2.c3.d4(1455), "PRODUCT_DETAILS");
        bundle.putStringArrayList("PRODUCT_TYPES_TO_RETURN_MULTIPLE_OFFERS", new ArrayList<>(i0.o("subs", "inapp")));
        bundle.putStringArrayList("PRODUCT_TYPES_TO_RETURN_PREORDER_OFFERS", new ArrayList<>(i0.n("inapp")));
        bundle.putStringArrayList("PRODUCT_TYPES_TO_RETURN_RENT_OFFERS", new ArrayList<>(i0.n("inapp")));
        bundle.putBoolean("SHOULD_RETURN_UNFETCHED_PRODUCTS", true);
        z3 = aVar.f2707a;
        if (z3) {
            bundle.putBoolean(a1.b2.c3.d4(198), true);
        }
        ArrayList<String> arrayList2 = new ArrayList<>();
        ArrayList<String> arrayList3 = new ArrayList<>();
        ArrayList<String> arrayList4 = new ArrayList<>();
        int size = arrayList.size();
        boolean z4 = false;
        boolean z5 = false;
        for (int i4 = 0; i4 < size; i4++) {
            g.b bVar = (g.b) arrayList.get(i4);
            arrayList2.add(null);
            z4 |= !TextUtils.isEmpty(null);
            arrayList4.add(null);
            z5 |= !TextUtils.isEmpty(null);
            if (bVar.c().equals("first_party")) {
                v.c(null, "Serialized DocId is required for constructing ExtraParams to query ProductDetails for all first party products.");
                arrayList3.add(null);
            }
        }
        if (z4) {
            bundle.putStringArrayList("SKU_OFFER_ID_TOKEN_LIST", arrayList2);
        }
        if (!arrayList3.isEmpty()) {
            bundle.putStringArrayList(a1.b2.c3.d4(1229), arrayList3);
        }
        if (!TextUtils.isEmpty(null)) {
            bundle.putString("accountName", null);
        }
        if (z5) {
            bundle.putStringArrayList("SKU_DYNAMIC_PRODUCT_TOKEN_LIST", arrayList4);
        }
        return bundle;
    }

    public static com.android.billingclient.api.d h(Intent intent, String str) {
        if (intent != null) {
            d.a d4 = com.android.billingclient.api.d.d();
            d4.d(b(intent.getExtras(), str));
            d4.b(i(intent.getExtras(), str));
            return d4.a();
        }
        m("BillingHelper", "Got null intent!");
        d.a d5 = com.android.billingclient.api.d.d();
        d5.d(6);
        d5.b("An internal error occurred.");
        return d5.a();
    }

    public static String i(Bundle bundle, String str) {
        if (bundle == null) {
            m(str, a1.b2.c3.d4(576));
            return "";
        }
        Object obj = bundle.get("DEBUG_MESSAGE");
        if (obj == null) {
            l(str, a1.b2.c3.d4(154));
            return "";
        }
        if (obj instanceof String) {
            return (String) obj;
        }
        m(str, "Unexpected type for debug message: ".concat(obj.getClass().getName()));
        return "";
    }

    public static String j(int i4) {
        return l.a(i4).toString();
    }

    public static List k(Bundle bundle) {
        ArrayList<String> stringArrayList = bundle.getStringArrayList("INAPP_PURCHASE_DATA_LIST");
        ArrayList<String> stringArrayList2 = bundle.getStringArrayList(a1.b2.c3.d4(985));
        ArrayList arrayList = new ArrayList();
        if (stringArrayList == null || stringArrayList2 == null) {
            Purchase p3 = p(bundle.getString("INAPP_PURCHASE_DATA"), bundle.getString("INAPP_DATA_SIGNATURE"));
            if (p3 == null) {
                l("BillingHelper", "Couldn't find single purchase data as well.");
                return null;
            }
            arrayList.add(p3);
            return arrayList;
        }
        l("BillingHelper", "Found purchase list of " + stringArrayList.size() + " items");
        for (int i4 = 0; i4 < stringArrayList.size() && i4 < stringArrayList2.size(); i4++) {
            Purchase p4 = p(stringArrayList.get(i4), stringArrayList2.get(i4));
            if (p4 != null) {
                arrayList.add(p4);
            }
        }
        return arrayList;
    }

    public static void l(String str, String str2) {
        if (Log.isLoggable(str, 2)) {
            if (str2.isEmpty()) {
                Log.v(str, str2);
                return;
            }
            int i4 = 40000;
            while (!str2.isEmpty() && i4 > 0) {
                int min = Math.min(str2.length(), Math.min(4000, i4));
                Log.v(str, str2.substring(0, min));
                str2 = str2.substring(min);
                i4 -= min;
            }
        }
    }

    public static void m(String str, String str2) {
        if (Log.isLoggable(str, 5)) {
            Log.w(str, str2);
        }
    }

    public static void n(String str, String str2, Throwable th) {
        try {
            if (Log.isLoggable(str, 5)) {
                if (th == null) {
                    Log.w(str, str2);
                } else {
                    Log.w(str, str2, th);
                }
            }
        } catch (Throwable unused) {
        }
    }

    private static int o(Bundle bundle, String str) {
        if (bundle != null) {
            return bundle.getInt("IN_APP_MESSAGE_RESPONSE_CODE", 0);
        }
        m(str, a1.b2.c3.d4(199));
        return 0;
    }

    private static Purchase p(String str, String str2) {
        if (str == null || str2 == null) {
            l("BillingHelper", a1.b2.c3.d4(384));
            return null;
        }
        try {
            return new Purchase(str, str2);
        } catch (JSONException e4) {
            m("BillingHelper", "Got JSONException while parsing purchase data: ".concat(e4.toString()));
            return null;
        }
    }
}
