package com.google.android.gms.games;

import a1.b2.c3;
import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.games.internal.GamesDowngradeableSafeParcel;
import h1.o;
import p1.a0;
import p1.j;
import p1.m;
import p1.n;
import p1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class PlayerEntity extends GamesDowngradeableSafeParcel implements j {
    public static final Parcelable.Creator<PlayerEntity> CREATOR = new e();
    private final long A;
    private final a0 B;
    private final q C;
    private final boolean D;
    private final String E;

    /* renamed from: g, reason: collision with root package name */
    private final String f2653g;

    /* renamed from: h, reason: collision with root package name */
    private final String f2654h;

    /* renamed from: i, reason: collision with root package name */
    private final Uri f2655i;

    /* renamed from: j, reason: collision with root package name */
    private final Uri f2656j;

    /* renamed from: k, reason: collision with root package name */
    private final long f2657k;

    /* renamed from: l, reason: collision with root package name */
    private final int f2658l;

    /* renamed from: m, reason: collision with root package name */
    private final long f2659m;

    /* renamed from: n, reason: collision with root package name */
    private final String f2660n;

    /* renamed from: o, reason: collision with root package name */
    private final String f2661o;

    /* renamed from: p, reason: collision with root package name */
    private final String f2662p;

    /* renamed from: q, reason: collision with root package name */
    private final r1.a f2663q;

    /* renamed from: r, reason: collision with root package name */
    private final m f2664r;

    /* renamed from: s, reason: collision with root package name */
    private final boolean f2665s;

    /* renamed from: t, reason: collision with root package name */
    private final boolean f2666t;

    /* renamed from: u, reason: collision with root package name */
    private final String f2667u;

    /* renamed from: v, reason: collision with root package name */
    private final String f2668v;

    /* renamed from: w, reason: collision with root package name */
    private final Uri f2669w;

    /* renamed from: x, reason: collision with root package name */
    private final String f2670x;

    /* renamed from: y, reason: collision with root package name */
    private final Uri f2671y;

    /* renamed from: z, reason: collision with root package name */
    private final String f2672z;

    PlayerEntity(String str, String str2, Uri uri, Uri uri2, long j4, int i4, long j5, String str3, String str4, String str5, r1.a aVar, m mVar, boolean z3, boolean z4, String str6, String str7, Uri uri3, String str8, Uri uri4, String str9, long j6, a0 a0Var, q qVar, boolean z5, String str10) {
        this.f2653g = str;
        this.f2654h = str2;
        this.f2655i = uri;
        this.f2660n = str3;
        this.f2656j = uri2;
        this.f2661o = str4;
        this.f2657k = j4;
        this.f2658l = i4;
        this.f2659m = j5;
        this.f2662p = str5;
        this.f2665s = z3;
        this.f2663q = aVar;
        this.f2664r = mVar;
        this.f2666t = z4;
        this.f2667u = str6;
        this.f2668v = str7;
        this.f2669w = uri3;
        this.f2670x = str8;
        this.f2671y = uri4;
        this.f2672z = str9;
        this.A = j6;
        this.B = a0Var;
        this.C = qVar;
        this.D = z5;
        this.E = str10;
    }

    public PlayerEntity(j jVar) {
        String a02 = jVar.a0();
        this.f2653g = a02;
        String m3 = jVar.m();
        this.f2654h = m3;
        this.f2655i = jVar.k();
        this.f2660n = jVar.getIconImageUrl();
        this.f2656j = jVar.j();
        this.f2661o = jVar.getHiResImageUrl();
        long B = jVar.B();
        this.f2657k = B;
        this.f2658l = jVar.e();
        this.f2659m = jVar.N();
        this.f2662p = jVar.getTitle();
        this.f2665s = jVar.f();
        r1.b h4 = jVar.h();
        this.f2663q = h4 == null ? null : new r1.a(h4);
        this.f2664r = jVar.U();
        this.f2666t = jVar.d();
        this.f2667u = jVar.b();
        this.f2668v = jVar.c();
        this.f2669w = jVar.p();
        this.f2670x = jVar.getBannerImageLandscapeUrl();
        this.f2671y = jVar.D();
        this.f2672z = jVar.getBannerImagePortraitUrl();
        this.A = jVar.l();
        n C = jVar.C();
        this.B = C == null ? null : new a0((n) C.P());
        p1.c K = jVar.K();
        this.C = K != null ? (q) K.P() : null;
        this.D = jVar.g();
        this.E = jVar.a();
        h1.c.a(a02);
        h1.c.a(m3);
        h1.c.b(B > 0);
    }

    static int l0(j jVar) {
        return o.b(jVar.a0(), jVar.m(), Boolean.valueOf(jVar.d()), jVar.k(), jVar.j(), Long.valueOf(jVar.B()), jVar.getTitle(), jVar.U(), jVar.b(), jVar.c(), jVar.p(), jVar.D(), Long.valueOf(jVar.l()), jVar.C(), jVar.K(), Boolean.valueOf(jVar.g()), jVar.a());
    }

    static boolean m0(j jVar, Object obj) {
        if (!(obj instanceof j)) {
            return false;
        }
        if (jVar == obj) {
            return true;
        }
        j jVar2 = (j) obj;
        return o.a(jVar2.a0(), jVar.a0()) && o.a(jVar2.m(), jVar.m()) && o.a(Boolean.valueOf(jVar2.d()), Boolean.valueOf(jVar.d())) && o.a(jVar2.k(), jVar.k()) && o.a(jVar2.j(), jVar.j()) && o.a(Long.valueOf(jVar2.B()), Long.valueOf(jVar.B())) && o.a(jVar2.getTitle(), jVar.getTitle()) && o.a(jVar2.U(), jVar.U()) && o.a(jVar2.b(), jVar.b()) && o.a(jVar2.c(), jVar.c()) && o.a(jVar2.p(), jVar.p()) && o.a(jVar2.D(), jVar.D()) && o.a(Long.valueOf(jVar2.l()), Long.valueOf(jVar.l())) && o.a(jVar2.K(), jVar.K()) && o.a(jVar2.C(), jVar.C()) && o.a(Boolean.valueOf(jVar2.g()), Boolean.valueOf(jVar.g())) && o.a(jVar2.a(), jVar.a());
    }

    static String n0(j jVar) {
        o.a a4 = o.c(jVar).a("PlayerId", jVar.a0()).a("DisplayName", jVar.m()).a("HasDebugAccess", Boolean.valueOf(jVar.d())).a("IconImageUri", jVar.k()).a("IconImageUrl", jVar.getIconImageUrl()).a(c3.d4(784), jVar.j()).a("HiResImageUrl", jVar.getHiResImageUrl()).a("RetrievedTimestamp", Long.valueOf(jVar.B())).a("Title", jVar.getTitle()).a("LevelInfo", jVar.U()).a("GamerTag", jVar.b()).a("Name", jVar.c()).a(c3.d4(249), jVar.p()).a("BannerImageLandscapeUrl", jVar.getBannerImageLandscapeUrl()).a("BannerImagePortraitUri", jVar.D()).a("BannerImagePortraitUrl", jVar.getBannerImagePortraitUrl()).a("CurrentPlayerInfo", jVar.K()).a("TotalUnlockedAchievement", Long.valueOf(jVar.l()));
        if (jVar.g()) {
            a4.a("AlwaysAutoSignIn", Boolean.valueOf(jVar.g()));
        }
        if (jVar.C() != null) {
            a4.a("RelationshipInfo", jVar.C());
        }
        if (jVar.a() != null) {
            a4.a("GamePlayerId", jVar.a());
        }
        return a4.toString();
    }

    @Override // p1.j
    public long B() {
        return this.f2657k;
    }

    @Override // p1.j
    public n C() {
        return this.B;
    }

    @Override // p1.j
    public Uri D() {
        return this.f2671y;
    }

    @Override // p1.j
    public p1.c K() {
        return this.C;
    }

    @Override // p1.j
    public long N() {
        return this.f2659m;
    }

    @Override // p1.j
    public m U() {
        return this.f2664r;
    }

    @Override // p1.j
    public final String a() {
        return this.E;
    }

    @Override // p1.j
    public String a0() {
        return this.f2653g;
    }

    @Override // p1.j
    public final String b() {
        return this.f2667u;
    }

    @Override // p1.j
    public final String c() {
        return this.f2668v;
    }

    @Override // p1.j
    public final boolean d() {
        return this.f2666t;
    }

    @Override // p1.j
    public final int e() {
        return this.f2658l;
    }

    public boolean equals(Object obj) {
        return m0(this, obj);
    }

    @Override // p1.j
    public final boolean f() {
        return this.f2665s;
    }

    @Override // p1.j
    public final boolean g() {
        return this.D;
    }

    @Override // p1.j
    public String getBannerImageLandscapeUrl() {
        return this.f2670x;
    }

    @Override // p1.j
    public String getBannerImagePortraitUrl() {
        return this.f2672z;
    }

    @Override // p1.j
    public String getHiResImageUrl() {
        return this.f2661o;
    }

    @Override // p1.j
    public String getIconImageUrl() {
        return this.f2660n;
    }

    @Override // p1.j
    public String getTitle() {
        return this.f2662p;
    }

    @Override // p1.j
    public final r1.b h() {
        return this.f2663q;
    }

    public int hashCode() {
        return l0(this);
    }

    @Override // p1.j
    public Uri j() {
        return this.f2656j;
    }

    @Override // p1.j
    public Uri k() {
        return this.f2655i;
    }

    @Override // p1.j
    public final long l() {
        return this.A;
    }

    @Override // p1.j
    public String m() {
        return this.f2654h;
    }

    @Override // p1.j
    public Uri p() {
        return this.f2669w;
    }

    public String toString() {
        return n0(this);
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        if (j0()) {
            parcel.writeString(this.f2653g);
            parcel.writeString(this.f2654h);
            Uri uri = this.f2655i;
            parcel.writeString(uri == null ? null : uri.toString());
            Uri uri2 = this.f2656j;
            parcel.writeString(uri2 != null ? uri2.toString() : null);
            parcel.writeLong(this.f2657k);
            return;
        }
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, a0(), false);
        i1.c.o(parcel, 2, m(), false);
        i1.c.n(parcel, 3, k(), i4, false);
        i1.c.n(parcel, 4, j(), i4, false);
        i1.c.l(parcel, 5, B());
        i1.c.i(parcel, 6, this.f2658l);
        i1.c.l(parcel, 7, N());
        i1.c.o(parcel, 8, getIconImageUrl(), false);
        i1.c.o(parcel, 9, getHiResImageUrl(), false);
        i1.c.o(parcel, 14, getTitle(), false);
        i1.c.n(parcel, 15, this.f2663q, i4, false);
        i1.c.n(parcel, 16, U(), i4, false);
        i1.c.c(parcel, 18, this.f2665s);
        i1.c.c(parcel, 19, this.f2666t);
        i1.c.o(parcel, 20, this.f2667u, false);
        i1.c.o(parcel, 21, this.f2668v, false);
        i1.c.n(parcel, 22, p(), i4, false);
        i1.c.o(parcel, 23, getBannerImageLandscapeUrl(), false);
        i1.c.n(parcel, 24, D(), i4, false);
        i1.c.o(parcel, 25, getBannerImagePortraitUrl(), false);
        i1.c.l(parcel, 29, this.A);
        i1.c.n(parcel, 33, C(), i4, false);
        i1.c.n(parcel, 35, K(), i4, false);
        i1.c.c(parcel, 36, this.D);
        i1.c.o(parcel, 37, this.E, false);
        i1.c.b(parcel, a4);
    }
}
