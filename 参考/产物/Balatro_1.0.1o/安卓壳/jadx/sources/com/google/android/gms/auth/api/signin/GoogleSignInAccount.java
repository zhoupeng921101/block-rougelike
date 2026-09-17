package com.google.android.gms.auth.api.signin;

import a1.b2.c3;
import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.common.internal.ReflectedParcelable;
import h1.q;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
@Deprecated
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class GoogleSignInAccount extends i1.a implements ReflectedParcelable {
    public static final Parcelable.Creator<GoogleSignInAccount> CREATOR = new c();

    /* renamed from: r, reason: collision with root package name */
    public static final com.google.android.gms.common.util.d f2501r = com.google.android.gms.common.util.e.b();

    /* renamed from: e, reason: collision with root package name */
    public final int f2502e;

    /* renamed from: f, reason: collision with root package name */
    public final String f2503f;

    /* renamed from: g, reason: collision with root package name */
    public final String f2504g;

    /* renamed from: h, reason: collision with root package name */
    public final String f2505h;

    /* renamed from: i, reason: collision with root package name */
    public final String f2506i;

    /* renamed from: j, reason: collision with root package name */
    public final Uri f2507j;

    /* renamed from: k, reason: collision with root package name */
    public String f2508k;

    /* renamed from: l, reason: collision with root package name */
    public final long f2509l;

    /* renamed from: m, reason: collision with root package name */
    public final String f2510m;

    /* renamed from: n, reason: collision with root package name */
    public final List f2511n;

    /* renamed from: o, reason: collision with root package name */
    public final String f2512o;

    /* renamed from: p, reason: collision with root package name */
    public final String f2513p;

    /* renamed from: q, reason: collision with root package name */
    public final Set f2514q = new HashSet();

    public GoogleSignInAccount(int i4, String str, String str2, String str3, String str4, Uri uri, String str5, long j4, String str6, List list, String str7, String str8) {
        this.f2502e = i4;
        this.f2503f = str;
        this.f2504g = str2;
        this.f2505h = str3;
        this.f2506i = str4;
        this.f2507j = uri;
        this.f2508k = str5;
        this.f2509l = j4;
        this.f2510m = str6;
        this.f2511n = list;
        this.f2512o = str7;
        this.f2513p = str8;
    }

    public static GoogleSignInAccount p0(String str, String str2, String str3, String str4, String str5, String str6, Uri uri, Long l3, String str7, Set set) {
        return new GoogleSignInAccount(3, str, str2, str3, str4, uri, null, l3.longValue(), q.f(str7), new ArrayList((Collection) q.i(set)), str5, str6);
    }

    public static GoogleSignInAccount q0(String str) {
        if (TextUtils.isEmpty(str)) {
            return null;
        }
        JSONObject jSONObject = new JSONObject(str);
        String optString = jSONObject.optString("photoUrl");
        Uri parse = !TextUtils.isEmpty(optString) ? Uri.parse(optString) : null;
        long parseLong = Long.parseLong(jSONObject.getString("expirationTime"));
        HashSet hashSet = new HashSet();
        JSONArray jSONArray = jSONObject.getJSONArray("grantedScopes");
        int length = jSONArray.length();
        for (int i4 = 0; i4 < length; i4++) {
            hashSet.add(new Scope(jSONArray.getString(i4)));
        }
        String optString2 = jSONObject.optString("id");
        String optString3 = jSONObject.has("tokenId") ? jSONObject.optString("tokenId") : null;
        String optString4 = jSONObject.has("email") ? jSONObject.optString("email") : null;
        String optString5 = jSONObject.has("displayName") ? jSONObject.optString("displayName") : null;
        String optString6 = jSONObject.has("givenName") ? jSONObject.optString("givenName") : null;
        String d4 = c3.d4(1164);
        GoogleSignInAccount p02 = p0(optString2, optString3, optString4, optString5, optString6, jSONObject.has(d4) ? jSONObject.optString(d4) : null, parse, Long.valueOf(parseLong), jSONObject.getString("obfuscatedIdentifier"), hashSet);
        p02.f2508k = jSONObject.has("serverAuthCode") ? jSONObject.optString("serverAuthCode") : null;
        return p02;
    }

    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof GoogleSignInAccount)) {
            return false;
        }
        GoogleSignInAccount googleSignInAccount = (GoogleSignInAccount) obj;
        return googleSignInAccount.f2510m.equals(this.f2510m) && googleSignInAccount.n0().equals(n0());
    }

    public String h0() {
        return this.f2505h;
    }

    public int hashCode() {
        return ((this.f2510m.hashCode() + 527) * 31) + n0().hashCode();
    }

    public String i0() {
        return this.f2513p;
    }

    public String j0() {
        return this.f2512o;
    }

    public String k0() {
        return this.f2503f;
    }

    public String l0() {
        return this.f2504g;
    }

    public String m() {
        return this.f2506i;
    }

    public Uri m0() {
        return this.f2507j;
    }

    public Set n0() {
        HashSet hashSet = new HashSet(this.f2511n);
        hashSet.addAll(this.f2514q);
        return hashSet;
    }

    public String o0() {
        return this.f2508k;
    }

    public final String r0() {
        return this.f2510m;
    }

    public final String s0() {
        JSONObject jSONObject = new JSONObject();
        try {
            if (k0() != null) {
                jSONObject.put("id", k0());
            }
            if (l0() != null) {
                jSONObject.put("tokenId", l0());
            }
            if (h0() != null) {
                jSONObject.put("email", h0());
            }
            if (m() != null) {
                jSONObject.put("displayName", m());
            }
            if (j0() != null) {
                jSONObject.put("givenName", j0());
            }
            if (i0() != null) {
                jSONObject.put("familyName", i0());
            }
            Uri m02 = m0();
            if (m02 != null) {
                jSONObject.put("photoUrl", m02.toString());
            }
            String o02 = o0();
            String d4 = c3.d4(1223);
            if (o02 != null) {
                jSONObject.put(d4, o0());
            }
            jSONObject.put("expirationTime", this.f2509l);
            jSONObject.put("obfuscatedIdentifier", this.f2510m);
            JSONArray jSONArray = new JSONArray();
            List list = this.f2511n;
            Scope[] scopeArr = (Scope[]) list.toArray(new Scope[list.size()]);
            Arrays.sort(scopeArr, new Comparator() { // from class: a1.b
                @Override // java.util.Comparator
                public final int compare(Object obj, Object obj2) {
                    Parcelable.Creator<GoogleSignInAccount> creator = GoogleSignInAccount.CREATOR;
                    return ((Scope) obj).h0().compareTo(((Scope) obj2).h0());
                }
            });
            for (Scope scope : scopeArr) {
                jSONArray.put(scope.h0());
            }
            jSONObject.put("grantedScopes", jSONArray);
            jSONObject.remove(d4);
            return jSONObject.toString();
        } catch (JSONException e4) {
            throw new RuntimeException(e4);
        }
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f2502e);
        i1.c.o(parcel, 2, k0(), false);
        i1.c.o(parcel, 3, l0(), false);
        i1.c.o(parcel, 4, h0(), false);
        i1.c.o(parcel, 5, m(), false);
        i1.c.n(parcel, 6, m0(), i4, false);
        i1.c.o(parcel, 7, o0(), false);
        i1.c.l(parcel, 8, this.f2509l);
        i1.c.o(parcel, 9, this.f2510m, false);
        i1.c.s(parcel, 10, this.f2511n, false);
        i1.c.o(parcel, 11, j0(), false);
        i1.c.o(parcel, 12, i0(), false);
        i1.c.b(parcel, a4);
    }
}
