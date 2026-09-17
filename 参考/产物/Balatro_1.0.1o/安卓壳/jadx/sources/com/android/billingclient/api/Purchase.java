package com.android.billingclient.api;

import a1.b2.c3;
import android.text.TextUtils;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class Purchase {

    /* renamed from: a, reason: collision with root package name */
    private final String f2227a;

    /* renamed from: b, reason: collision with root package name */
    private final String f2228b;

    /* renamed from: c, reason: collision with root package name */
    private final JSONObject f2229c;

    public Purchase(String str, String str2) {
        this.f2227a = str;
        this.f2228b = str2;
        this.f2229c = new JSONObject(str);
    }

    private final ArrayList g() {
        ArrayList arrayList = new ArrayList();
        JSONObject jSONObject = this.f2229c;
        if (jSONObject.has("productIds")) {
            JSONArray optJSONArray = jSONObject.optJSONArray("productIds");
            if (optJSONArray != null) {
                for (int i4 = 0; i4 < optJSONArray.length(); i4++) {
                    arrayList.add(optJSONArray.optString(i4));
                }
            }
        } else if (jSONObject.has("productId")) {
            arrayList.add(jSONObject.optString("productId"));
        }
        return arrayList;
    }

    public String a() {
        return this.f2227a;
    }

    public List b() {
        return g();
    }

    public int c() {
        return this.f2229c.optInt("purchaseState", 1) != 4 ? 1 : 2;
    }

    public String d() {
        JSONObject jSONObject = this.f2229c;
        return jSONObject.optString("token", jSONObject.optString(c3.d4(1447)));
    }

    public String e() {
        return this.f2228b;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Purchase)) {
            return false;
        }
        Purchase purchase = (Purchase) obj;
        return TextUtils.equals(this.f2227a, purchase.a()) && TextUtils.equals(this.f2228b, purchase.e());
    }

    public boolean f() {
        return this.f2229c.optBoolean("acknowledged", true);
    }

    public int hashCode() {
        return this.f2227a.hashCode();
    }

    public String toString() {
        return "Purchase. Json: ".concat(String.valueOf(this.f2227a));
    }
}
