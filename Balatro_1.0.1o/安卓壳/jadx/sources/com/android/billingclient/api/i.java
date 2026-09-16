package com.android.billingclient.api;

import a1.b2.c3;
import android.text.TextUtils;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i {

    /* renamed from: a, reason: collision with root package name */
    private final String f2381a;

    /* renamed from: b, reason: collision with root package name */
    private final String f2382b;

    /* renamed from: c, reason: collision with root package name */
    private final String f2383c;

    /* renamed from: d, reason: collision with root package name */
    private final int f2384d;

    /* renamed from: e, reason: collision with root package name */
    private final String f2385e;

    i(String str) {
        this.f2381a = str;
        JSONObject jSONObject = new JSONObject(str);
        this.f2382b = jSONObject.optString("productId");
        String optString = jSONObject.optString("type");
        this.f2383c = optString;
        this.f2384d = jSONObject.has("statusCode") ? jSONObject.optInt("statusCode") : 0;
        if (TextUtils.isEmpty(optString)) {
            throw new IllegalArgumentException("Product type cannot be empty.");
        }
        this.f2385e = jSONObject.optString("serializedDocid");
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof i) {
            return TextUtils.equals(this.f2381a, ((i) obj).f2381a);
        }
        return false;
    }

    public int hashCode() {
        return this.f2381a.hashCode();
    }

    public String toString() {
        return "UnfetchedProduct{productId='" + this.f2382b + c3.d4(476) + this.f2383c + "', statusCode=" + this.f2384d + "}";
    }
}
