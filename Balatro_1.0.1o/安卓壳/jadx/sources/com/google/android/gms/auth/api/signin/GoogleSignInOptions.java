package com.google.android.gms.auth.api.signin;

import a1.b2.c3;
import android.accounts.Account;
import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.common.internal.ReflectedParcelable;
import e1.a;
import h1.q;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
@Deprecated
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class GoogleSignInOptions extends i1.a implements a.d, ReflectedParcelable {
    public static final Parcelable.Creator<GoogleSignInOptions> CREATOR;

    /* renamed from: p, reason: collision with root package name */
    public static final GoogleSignInOptions f2515p;

    /* renamed from: q, reason: collision with root package name */
    public static final GoogleSignInOptions f2516q;

    /* renamed from: r, reason: collision with root package name */
    public static final Scope f2517r = new Scope("profile");

    /* renamed from: s, reason: collision with root package name */
    public static final Scope f2518s = new Scope("email");

    /* renamed from: t, reason: collision with root package name */
    public static final Scope f2519t = new Scope(c3.d4(479));

    /* renamed from: u, reason: collision with root package name */
    public static final Scope f2520u;

    /* renamed from: v, reason: collision with root package name */
    public static final Scope f2521v;

    /* renamed from: w, reason: collision with root package name */
    public static final Comparator f2522w;

    /* renamed from: e, reason: collision with root package name */
    public final int f2523e;

    /* renamed from: f, reason: collision with root package name */
    public final ArrayList f2524f;

    /* renamed from: g, reason: collision with root package name */
    public Account f2525g;

    /* renamed from: h, reason: collision with root package name */
    public boolean f2526h;

    /* renamed from: i, reason: collision with root package name */
    public final boolean f2527i;

    /* renamed from: j, reason: collision with root package name */
    public final boolean f2528j;

    /* renamed from: k, reason: collision with root package name */
    public String f2529k;

    /* renamed from: l, reason: collision with root package name */
    public String f2530l;

    /* renamed from: m, reason: collision with root package name */
    public ArrayList f2531m;

    /* renamed from: n, reason: collision with root package name */
    public String f2532n;

    /* renamed from: o, reason: collision with root package name */
    public Map f2533o;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        public Set f2534a;

        /* renamed from: b, reason: collision with root package name */
        public boolean f2535b;

        /* renamed from: c, reason: collision with root package name */
        public boolean f2536c;

        /* renamed from: d, reason: collision with root package name */
        public boolean f2537d;

        /* renamed from: e, reason: collision with root package name */
        public String f2538e;

        /* renamed from: f, reason: collision with root package name */
        public Account f2539f;

        /* renamed from: g, reason: collision with root package name */
        public String f2540g;

        /* renamed from: h, reason: collision with root package name */
        public Map f2541h;

        /* renamed from: i, reason: collision with root package name */
        public String f2542i;

        public a() {
            this.f2534a = new HashSet();
            this.f2541h = new HashMap();
        }

        public a(GoogleSignInOptions googleSignInOptions) {
            this.f2534a = new HashSet();
            this.f2541h = new HashMap();
            q.i(googleSignInOptions);
            this.f2534a = new HashSet(googleSignInOptions.f2524f);
            this.f2535b = googleSignInOptions.f2527i;
            this.f2536c = googleSignInOptions.f2528j;
            this.f2537d = googleSignInOptions.f2526h;
            this.f2538e = googleSignInOptions.f2529k;
            this.f2539f = googleSignInOptions.f2525g;
            this.f2540g = googleSignInOptions.f2530l;
            this.f2541h = GoogleSignInOptions.B0(googleSignInOptions.f2531m);
            this.f2542i = googleSignInOptions.f2532n;
        }

        public GoogleSignInOptions a() {
            if (this.f2534a.contains(GoogleSignInOptions.f2521v)) {
                Set set = this.f2534a;
                Scope scope = GoogleSignInOptions.f2520u;
                if (set.contains(scope)) {
                    this.f2534a.remove(scope);
                }
            }
            if (this.f2537d && (this.f2539f == null || !this.f2534a.isEmpty())) {
                b();
            }
            return new GoogleSignInOptions(new ArrayList(this.f2534a), this.f2539f, this.f2537d, this.f2535b, this.f2536c, this.f2538e, this.f2540g, this.f2541h, this.f2542i);
        }

        public a b() {
            this.f2534a.add(GoogleSignInOptions.f2519t);
            return this;
        }

        public a c() {
            this.f2534a.add(GoogleSignInOptions.f2517r);
            return this;
        }

        public a d(Scope scope, Scope... scopeArr) {
            this.f2534a.add(scope);
            this.f2534a.addAll(Arrays.asList(scopeArr));
            return this;
        }

        public a e(String str) {
            this.f2542i = str;
            return this;
        }
    }

    static {
        Scope scope = new Scope("https://www.googleapis.com/auth/games_lite");
        f2520u = scope;
        f2521v = new Scope("https://www.googleapis.com/auth/games");
        a aVar = new a();
        aVar.b();
        aVar.c();
        f2515p = aVar.a();
        a aVar2 = new a();
        aVar2.d(scope, new Scope[0]);
        f2516q = aVar2.a();
        CREATOR = new e();
        f2522w = new d();
    }

    public GoogleSignInOptions(int i4, ArrayList arrayList, Account account, boolean z3, boolean z4, boolean z5, String str, String str2, ArrayList arrayList2, String str3) {
        this(i4, arrayList, account, z3, z4, z5, str, str2, B0(arrayList2), str3);
    }

    public GoogleSignInOptions(int i4, ArrayList arrayList, Account account, boolean z3, boolean z4, boolean z5, String str, String str2, Map map, String str3) {
        this.f2523e = i4;
        this.f2524f = arrayList;
        this.f2525g = account;
        this.f2526h = z3;
        this.f2527i = z4;
        this.f2528j = z5;
        this.f2529k = str;
        this.f2530l = str2;
        this.f2531m = new ArrayList(map.values());
        this.f2533o = map;
        this.f2532n = str3;
    }

    public static Map B0(List list) {
        HashMap hashMap = new HashMap();
        if (list != null) {
            Iterator it = list.iterator();
            while (it.hasNext()) {
                b1.a aVar = (b1.a) it.next();
                hashMap.put(Integer.valueOf(aVar.h0()), aVar);
            }
        }
        return hashMap;
    }

    public static GoogleSignInOptions q0(String str) {
        if (TextUtils.isEmpty(str)) {
            return null;
        }
        JSONObject jSONObject = new JSONObject(str);
        HashSet hashSet = new HashSet();
        JSONArray jSONArray = jSONObject.getJSONArray("scopes");
        int length = jSONArray.length();
        for (int i4 = 0; i4 < length; i4++) {
            hashSet.add(new Scope(jSONArray.getString(i4)));
        }
        String optString = jSONObject.has("accountName") ? jSONObject.optString("accountName") : null;
        Account account = !TextUtils.isEmpty(optString) ? new Account(optString, c3.d4(332)) : null;
        ArrayList arrayList = new ArrayList(hashSet);
        boolean z3 = jSONObject.getBoolean(c3.d4(246));
        boolean z4 = jSONObject.getBoolean("serverAuthRequested");
        boolean z5 = jSONObject.getBoolean("forceCodeForRefreshToken");
        String d4 = c3.d4(979);
        return new GoogleSignInOptions(3, arrayList, account, z3, z4, z5, jSONObject.has(d4) ? jSONObject.optString(d4) : null, jSONObject.has("hostedDomain") ? jSONObject.optString("hostedDomain") : null, new HashMap(), (String) null);
    }

    /* JADX WARN: Code restructure failed: missing block: B:40:0x0048, code lost:
    
        if (r1.equals(r4.h0()) != false) goto L22;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public boolean equals(java.lang.Object r4) {
        /*
            r3 = this;
            r0 = 0
            if (r4 != 0) goto L4
            return r0
        L4:
            com.google.android.gms.auth.api.signin.GoogleSignInOptions r4 = (com.google.android.gms.auth.api.signin.GoogleSignInOptions) r4     // Catch: java.lang.ClassCastException -> L90
            java.util.ArrayList r1 = r3.f2531m     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = r1.isEmpty()     // Catch: java.lang.ClassCastException -> L90
            if (r1 == 0) goto L90
            java.util.ArrayList r1 = r4.f2531m     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = r1.isEmpty()     // Catch: java.lang.ClassCastException -> L90
            if (r1 != 0) goto L18
            goto L90
        L18:
            java.util.ArrayList r1 = r3.f2524f     // Catch: java.lang.ClassCastException -> L90
            int r1 = r1.size()     // Catch: java.lang.ClassCastException -> L90
            java.util.ArrayList r2 = r4.k0()     // Catch: java.lang.ClassCastException -> L90
            int r2 = r2.size()     // Catch: java.lang.ClassCastException -> L90
            if (r1 != r2) goto L90
            java.util.ArrayList r1 = r3.f2524f     // Catch: java.lang.ClassCastException -> L90
            java.util.ArrayList r2 = r4.k0()     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = r1.containsAll(r2)     // Catch: java.lang.ClassCastException -> L90
            if (r1 != 0) goto L35
            goto L90
        L35:
            android.accounts.Account r1 = r3.f2525g     // Catch: java.lang.ClassCastException -> L90
            if (r1 != 0) goto L40
            android.accounts.Account r1 = r4.h0()     // Catch: java.lang.ClassCastException -> L90
            if (r1 != 0) goto L90
            goto L4a
        L40:
            android.accounts.Account r2 = r4.h0()     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = r1.equals(r2)     // Catch: java.lang.ClassCastException -> L90
            if (r1 == 0) goto L90
        L4a:
            java.lang.String r1 = r3.f2529k     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = android.text.TextUtils.isEmpty(r1)     // Catch: java.lang.ClassCastException -> L90
            if (r1 == 0) goto L5d
            java.lang.String r1 = r4.l0()     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = android.text.TextUtils.isEmpty(r1)     // Catch: java.lang.ClassCastException -> L90
            if (r1 == 0) goto L90
            goto L6a
        L5d:
            java.lang.String r1 = r3.f2529k     // Catch: java.lang.ClassCastException -> L90
            java.lang.String r2 = r4.l0()     // Catch: java.lang.ClassCastException -> L90
            boolean r1 = r1.equals(r2)     // Catch: java.lang.ClassCastException -> L90
            if (r1 != 0) goto L6a
            goto L90
        L6a:
            boolean r1 = r3.f2528j     // Catch: java.lang.ClassCastException -> L90
            boolean r2 = r4.m0()     // Catch: java.lang.ClassCastException -> L90
            if (r1 != r2) goto L90
            boolean r1 = r3.f2526h     // Catch: java.lang.ClassCastException -> L90
            boolean r2 = r4.n0()     // Catch: java.lang.ClassCastException -> L90
            if (r1 != r2) goto L90
            boolean r1 = r3.f2527i     // Catch: java.lang.ClassCastException -> L90
            boolean r2 = r4.o0()     // Catch: java.lang.ClassCastException -> L90
            if (r1 != r2) goto L90
            java.lang.String r1 = r3.f2532n     // Catch: java.lang.ClassCastException -> L90
            java.lang.String r4 = r4.j0()     // Catch: java.lang.ClassCastException -> L90
            boolean r4 = android.text.TextUtils.equals(r1, r4)     // Catch: java.lang.ClassCastException -> L90
            if (r4 == 0) goto L90
            r4 = 1
            return r4
        L90:
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.auth.api.signin.GoogleSignInOptions.equals(java.lang.Object):boolean");
    }

    public Account h0() {
        return this.f2525g;
    }

    public int hashCode() {
        ArrayList arrayList = new ArrayList();
        ArrayList arrayList2 = this.f2524f;
        int size = arrayList2.size();
        for (int i4 = 0; i4 < size; i4++) {
            arrayList.add(((Scope) arrayList2.get(i4)).h0());
        }
        Collections.sort(arrayList);
        b1.b bVar = new b1.b();
        bVar.a(arrayList);
        bVar.a(this.f2525g);
        bVar.a(this.f2529k);
        bVar.c(this.f2528j);
        bVar.c(this.f2526h);
        bVar.c(this.f2527i);
        bVar.a(this.f2532n);
        return bVar.b();
    }

    public ArrayList i0() {
        return this.f2531m;
    }

    public String j0() {
        return this.f2532n;
    }

    public ArrayList k0() {
        return new ArrayList(this.f2524f);
    }

    public String l0() {
        return this.f2529k;
    }

    public boolean m0() {
        return this.f2528j;
    }

    public boolean n0() {
        return this.f2526h;
    }

    public boolean o0() {
        return this.f2527i;
    }

    public final String u0() {
        JSONObject jSONObject = new JSONObject();
        try {
            JSONArray jSONArray = new JSONArray();
            Collections.sort(this.f2524f, f2522w);
            ArrayList arrayList = this.f2524f;
            int size = arrayList.size();
            int i4 = 0;
            while (i4 < size) {
                Object obj = arrayList.get(i4);
                i4++;
                jSONArray.put(((Scope) obj).h0());
            }
            jSONObject.put("scopes", jSONArray);
            Account account = this.f2525g;
            if (account != null) {
                jSONObject.put("accountName", account.name);
            }
            jSONObject.put("idTokenRequested", this.f2526h);
            jSONObject.put("forceCodeForRefreshToken", this.f2528j);
            jSONObject.put("serverAuthRequested", this.f2527i);
            if (!TextUtils.isEmpty(this.f2529k)) {
                jSONObject.put("serverClientId", this.f2529k);
            }
            if (!TextUtils.isEmpty(this.f2530l)) {
                jSONObject.put("hostedDomain", this.f2530l);
            }
            return jSONObject.toString();
        } catch (JSONException e4) {
            throw new RuntimeException(e4);
        }
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int i5 = this.f2523e;
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, i5);
        i1.c.s(parcel, 2, k0(), false);
        i1.c.n(parcel, 3, h0(), i4, false);
        i1.c.c(parcel, 4, n0());
        i1.c.c(parcel, 5, o0());
        i1.c.c(parcel, 6, m0());
        i1.c.o(parcel, 7, l0(), false);
        i1.c.o(parcel, 8, this.f2530l, false);
        i1.c.s(parcel, 9, i0(), false);
        i1.c.o(parcel, 10, j0(), false);
        i1.c.b(parcel, a4);
    }
}
