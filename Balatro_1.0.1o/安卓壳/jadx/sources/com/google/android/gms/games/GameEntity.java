package com.google.android.gms.games;

import a1.b2.c3;
import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.games.internal.GamesDowngradeableSafeParcel;
import h1.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class GameEntity extends GamesDowngradeableSafeParcel implements p1.d {
    public static final Parcelable.Creator<GameEntity> CREATOR = new c();
    private final boolean A;
    private final boolean B;
    private final boolean C;
    private final String D;
    private final boolean E;
    private final boolean F;

    /* renamed from: g, reason: collision with root package name */
    private final String f2633g;

    /* renamed from: h, reason: collision with root package name */
    private final String f2634h;

    /* renamed from: i, reason: collision with root package name */
    private final String f2635i;

    /* renamed from: j, reason: collision with root package name */
    private final String f2636j;

    /* renamed from: k, reason: collision with root package name */
    private final String f2637k;

    /* renamed from: l, reason: collision with root package name */
    private final String f2638l;

    /* renamed from: m, reason: collision with root package name */
    private final Uri f2639m;

    /* renamed from: n, reason: collision with root package name */
    private final Uri f2640n;

    /* renamed from: o, reason: collision with root package name */
    private final Uri f2641o;

    /* renamed from: p, reason: collision with root package name */
    private final boolean f2642p;

    /* renamed from: q, reason: collision with root package name */
    private final boolean f2643q;

    /* renamed from: r, reason: collision with root package name */
    private final String f2644r;

    /* renamed from: s, reason: collision with root package name */
    private final int f2645s;

    /* renamed from: t, reason: collision with root package name */
    private final int f2646t;

    /* renamed from: u, reason: collision with root package name */
    private final int f2647u;

    /* renamed from: v, reason: collision with root package name */
    private final boolean f2648v;

    /* renamed from: w, reason: collision with root package name */
    private final boolean f2649w;

    /* renamed from: x, reason: collision with root package name */
    private final String f2650x;

    /* renamed from: y, reason: collision with root package name */
    private final String f2651y;

    /* renamed from: z, reason: collision with root package name */
    private final String f2652z;

    GameEntity(String str, String str2, String str3, String str4, String str5, String str6, Uri uri, Uri uri2, Uri uri3, boolean z3, boolean z4, String str7, int i4, int i5, int i6, boolean z5, boolean z6, String str8, String str9, String str10, boolean z7, boolean z8, boolean z9, String str11, boolean z10, boolean z11) {
        this.f2633g = str;
        this.f2634h = str2;
        this.f2635i = str3;
        this.f2636j = str4;
        this.f2637k = str5;
        this.f2638l = str6;
        this.f2639m = uri;
        this.f2650x = str8;
        this.f2640n = uri2;
        this.f2651y = str9;
        this.f2641o = uri3;
        this.f2652z = str10;
        this.f2642p = z3;
        this.f2643q = z4;
        this.f2644r = str7;
        this.f2645s = i4;
        this.f2646t = i5;
        this.f2647u = i6;
        this.f2648v = z5;
        this.f2649w = z6;
        this.A = z7;
        this.B = z8;
        this.C = z9;
        this.D = str11;
        this.E = z10;
        this.F = z11;
    }

    public GameEntity(p1.d dVar) {
        this.f2633g = dVar.u();
        this.f2635i = dVar.A();
        this.f2636j = dVar.s();
        this.f2637k = dVar.i();
        this.f2638l = dVar.J();
        this.f2634h = dVar.m();
        this.f2639m = dVar.k();
        this.f2650x = dVar.getIconImageUrl();
        this.f2640n = dVar.j();
        this.f2651y = dVar.getHiResImageUrl();
        this.f2641o = dVar.d0();
        this.f2652z = dVar.getFeaturedImageUrl();
        this.f2642p = dVar.a();
        this.f2643q = dVar.e();
        this.f2644r = dVar.f();
        this.f2645s = 1;
        this.f2646t = dVar.r();
        this.f2647u = dVar.L();
        this.f2648v = dVar.g();
        this.f2649w = dVar.h();
        this.A = dVar.b();
        this.B = dVar.c();
        this.C = dVar.e0();
        this.D = dVar.Y();
        this.E = dVar.T();
        this.F = dVar.d();
    }

    static int l0(p1.d dVar) {
        return o.b(dVar.u(), dVar.m(), dVar.A(), dVar.s(), dVar.i(), dVar.J(), dVar.k(), dVar.j(), dVar.d0(), Boolean.valueOf(dVar.a()), Boolean.valueOf(dVar.e()), dVar.f(), Integer.valueOf(dVar.r()), Integer.valueOf(dVar.L()), Boolean.valueOf(dVar.g()), Boolean.valueOf(dVar.h()), Boolean.valueOf(dVar.b()), Boolean.valueOf(dVar.c()), Boolean.valueOf(dVar.e0()), dVar.Y(), Boolean.valueOf(dVar.T()), Boolean.valueOf(dVar.d()));
    }

    static boolean m0(p1.d dVar, Object obj) {
        if (!(obj instanceof p1.d)) {
            return false;
        }
        if (dVar == obj) {
            return true;
        }
        p1.d dVar2 = (p1.d) obj;
        return o.a(dVar2.u(), dVar.u()) && o.a(dVar2.m(), dVar.m()) && o.a(dVar2.A(), dVar.A()) && o.a(dVar2.s(), dVar.s()) && o.a(dVar2.i(), dVar.i()) && o.a(dVar2.J(), dVar.J()) && o.a(dVar2.k(), dVar.k()) && o.a(dVar2.j(), dVar.j()) && o.a(dVar2.d0(), dVar.d0()) && o.a(Boolean.valueOf(dVar2.a()), Boolean.valueOf(dVar.a())) && o.a(Boolean.valueOf(dVar2.e()), Boolean.valueOf(dVar.e())) && o.a(dVar2.f(), dVar.f()) && o.a(Integer.valueOf(dVar2.r()), Integer.valueOf(dVar.r())) && o.a(Integer.valueOf(dVar2.L()), Integer.valueOf(dVar.L())) && o.a(Boolean.valueOf(dVar2.g()), Boolean.valueOf(dVar.g())) && o.a(Boolean.valueOf(dVar2.h()), Boolean.valueOf(dVar.h())) && o.a(Boolean.valueOf(dVar2.b()), Boolean.valueOf(dVar.b())) && o.a(Boolean.valueOf(dVar2.c()), Boolean.valueOf(dVar.c())) && o.a(Boolean.valueOf(dVar2.e0()), Boolean.valueOf(dVar.e0())) && o.a(dVar2.Y(), dVar.Y()) && o.a(Boolean.valueOf(dVar2.T()), Boolean.valueOf(dVar.T())) && o.a(Boolean.valueOf(dVar2.d()), Boolean.valueOf(dVar.d()));
    }

    static String n0(p1.d dVar) {
        return o.c(dVar).a(c3.d4(248), dVar.u()).a("DisplayName", dVar.m()).a(c3.d4(1369), dVar.A()).a("SecondaryCategory", dVar.s()).a("Description", dVar.i()).a("DeveloperName", dVar.J()).a("IconImageUri", dVar.k()).a("IconImageUrl", dVar.getIconImageUrl()).a("HiResImageUri", dVar.j()).a("HiResImageUrl", dVar.getHiResImageUrl()).a("FeaturedImageUri", dVar.d0()).a("FeaturedImageUrl", dVar.getFeaturedImageUrl()).a(c3.d4(1370), Boolean.valueOf(dVar.a())).a("InstanceInstalled", Boolean.valueOf(dVar.e())).a("InstancePackageName", dVar.f()).a("AchievementTotalCount", Integer.valueOf(dVar.r())).a("LeaderboardCount", Integer.valueOf(dVar.L())).a("AreSnapshotsEnabled", Boolean.valueOf(dVar.e0())).a("ThemeColor", dVar.Y()).a(c3.d4(1165), Boolean.valueOf(dVar.T())).toString();
    }

    @Override // p1.d
    public String A() {
        return this.f2635i;
    }

    @Override // p1.d
    public String J() {
        return this.f2638l;
    }

    @Override // p1.d
    public int L() {
        return this.f2647u;
    }

    @Override // p1.d
    public boolean T() {
        return this.E;
    }

    @Override // p1.d
    public String Y() {
        return this.D;
    }

    @Override // p1.d
    public final boolean a() {
        return this.f2642p;
    }

    @Override // p1.d
    public final boolean b() {
        return this.A;
    }

    @Override // p1.d
    public final boolean c() {
        return this.B;
    }

    @Override // p1.d
    public final boolean d() {
        return this.F;
    }

    @Override // p1.d
    public Uri d0() {
        return this.f2641o;
    }

    @Override // p1.d
    public final boolean e() {
        return this.f2643q;
    }

    @Override // p1.d
    public boolean e0() {
        return this.C;
    }

    public boolean equals(Object obj) {
        return m0(this, obj);
    }

    @Override // p1.d
    public final String f() {
        return this.f2644r;
    }

    @Override // p1.d
    public final boolean g() {
        return this.f2648v;
    }

    @Override // p1.d
    public String getFeaturedImageUrl() {
        return this.f2652z;
    }

    @Override // p1.d
    public String getHiResImageUrl() {
        return this.f2651y;
    }

    @Override // p1.d
    public String getIconImageUrl() {
        return this.f2650x;
    }

    @Override // p1.d
    public final boolean h() {
        return this.f2649w;
    }

    public int hashCode() {
        return l0(this);
    }

    @Override // p1.d
    public String i() {
        return this.f2637k;
    }

    @Override // p1.d
    public Uri j() {
        return this.f2640n;
    }

    @Override // p1.d
    public Uri k() {
        return this.f2639m;
    }

    @Override // p1.d
    public String m() {
        return this.f2634h;
    }

    @Override // p1.d
    public int r() {
        return this.f2646t;
    }

    @Override // p1.d
    public String s() {
        return this.f2636j;
    }

    public String toString() {
        return n0(this);
    }

    @Override // p1.d
    public String u() {
        return this.f2633g;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        if (j0()) {
            parcel.writeString(this.f2633g);
            parcel.writeString(this.f2634h);
            parcel.writeString(this.f2635i);
            parcel.writeString(this.f2636j);
            parcel.writeString(this.f2637k);
            parcel.writeString(this.f2638l);
            Uri uri = this.f2639m;
            parcel.writeString(uri == null ? null : uri.toString());
            Uri uri2 = this.f2640n;
            parcel.writeString(uri2 == null ? null : uri2.toString());
            Uri uri3 = this.f2641o;
            parcel.writeString(uri3 != null ? uri3.toString() : null);
            parcel.writeInt(this.f2642p ? 1 : 0);
            parcel.writeInt(this.f2643q ? 1 : 0);
            parcel.writeString(this.f2644r);
            parcel.writeInt(this.f2645s);
            parcel.writeInt(this.f2646t);
            parcel.writeInt(this.f2647u);
            return;
        }
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, u(), false);
        i1.c.o(parcel, 2, m(), false);
        i1.c.o(parcel, 3, A(), false);
        i1.c.o(parcel, 4, s(), false);
        i1.c.o(parcel, 5, i(), false);
        i1.c.o(parcel, 6, J(), false);
        i1.c.n(parcel, 7, k(), i4, false);
        i1.c.n(parcel, 8, j(), i4, false);
        i1.c.n(parcel, 9, d0(), i4, false);
        i1.c.c(parcel, 10, this.f2642p);
        i1.c.c(parcel, 11, this.f2643q);
        i1.c.o(parcel, 12, this.f2644r, false);
        i1.c.i(parcel, 13, this.f2645s);
        i1.c.i(parcel, 14, r());
        i1.c.i(parcel, 15, L());
        i1.c.c(parcel, 16, this.f2648v);
        i1.c.c(parcel, 17, this.f2649w);
        i1.c.o(parcel, 18, getIconImageUrl(), false);
        i1.c.o(parcel, 19, getHiResImageUrl(), false);
        i1.c.o(parcel, 20, getFeaturedImageUrl(), false);
        i1.c.c(parcel, 21, this.A);
        i1.c.c(parcel, 22, this.B);
        i1.c.c(parcel, 23, e0());
        i1.c.o(parcel, 24, Y(), false);
        i1.c.c(parcel, 25, T());
        i1.c.c(parcel, 28, this.F);
        i1.c.b(parcel, a4);
    }
}
