package v1;

import a1.b2.c3;
import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.games.GameEntity;
import com.google.android.gms.games.PlayerEntity;
import h1.o;
import q1.r;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i extends r implements e {
    public static final Parcelable.Creator<i> CREATOR = new n();

    /* renamed from: e, reason: collision with root package name */
    private final GameEntity f5060e;

    /* renamed from: f, reason: collision with root package name */
    private final PlayerEntity f5061f;

    /* renamed from: g, reason: collision with root package name */
    private final String f5062g;

    /* renamed from: h, reason: collision with root package name */
    private final Uri f5063h;

    /* renamed from: i, reason: collision with root package name */
    private final String f5064i;

    /* renamed from: j, reason: collision with root package name */
    private final String f5065j;

    /* renamed from: k, reason: collision with root package name */
    private final String f5066k;

    /* renamed from: l, reason: collision with root package name */
    private final long f5067l;

    /* renamed from: m, reason: collision with root package name */
    private final long f5068m;

    /* renamed from: n, reason: collision with root package name */
    private final float f5069n;

    /* renamed from: o, reason: collision with root package name */
    private final String f5070o;

    /* renamed from: p, reason: collision with root package name */
    private final boolean f5071p;

    /* renamed from: q, reason: collision with root package name */
    private final long f5072q;

    /* renamed from: r, reason: collision with root package name */
    private final String f5073r;

    i(GameEntity gameEntity, PlayerEntity playerEntity, String str, Uri uri, String str2, String str3, String str4, long j4, long j5, float f4, String str5, boolean z3, long j6, String str6) {
        this.f5060e = gameEntity;
        this.f5061f = playerEntity;
        this.f5062g = str;
        this.f5063h = uri;
        this.f5064i = str2;
        this.f5069n = f4;
        this.f5065j = str3;
        this.f5066k = str4;
        this.f5067l = j4;
        this.f5068m = j5;
        this.f5070o = str5;
        this.f5071p = z3;
        this.f5072q = j6;
        this.f5073r = str6;
    }

    public i(e eVar) {
        PlayerEntity playerEntity = new PlayerEntity(eVar.x());
        this.f5060e = new GameEntity(eVar.g0());
        this.f5061f = playerEntity;
        this.f5062g = eVar.f0();
        this.f5063h = eVar.t();
        this.f5064i = eVar.getCoverImageUrl();
        this.f5069n = eVar.X();
        this.f5065j = eVar.a();
        this.f5066k = eVar.i();
        this.f5067l = eVar.E();
        this.f5068m = eVar.w();
        this.f5070o = eVar.b0();
        this.f5071p = eVar.G();
        this.f5072q = eVar.W();
        this.f5073r = eVar.n();
    }

    static int h0(e eVar) {
        return o.b(eVar.g0(), eVar.x(), eVar.f0(), eVar.t(), Float.valueOf(eVar.X()), eVar.a(), eVar.i(), Long.valueOf(eVar.E()), Long.valueOf(eVar.w()), eVar.b0(), Boolean.valueOf(eVar.G()), Long.valueOf(eVar.W()), eVar.n());
    }

    static boolean i0(e eVar, Object obj) {
        if (!(obj instanceof e)) {
            return false;
        }
        if (eVar == obj) {
            return true;
        }
        e eVar2 = (e) obj;
        return o.a(eVar2.g0(), eVar.g0()) && o.a(eVar2.x(), eVar.x()) && o.a(eVar2.f0(), eVar.f0()) && o.a(eVar2.t(), eVar.t()) && o.a(Float.valueOf(eVar2.X()), Float.valueOf(eVar.X())) && o.a(eVar2.a(), eVar.a()) && o.a(eVar2.i(), eVar.i()) && o.a(Long.valueOf(eVar2.E()), Long.valueOf(eVar.E())) && o.a(Long.valueOf(eVar2.w()), Long.valueOf(eVar.w())) && o.a(eVar2.b0(), eVar.b0()) && o.a(Boolean.valueOf(eVar2.G()), Boolean.valueOf(eVar.G())) && o.a(Long.valueOf(eVar2.W()), Long.valueOf(eVar.W())) && o.a(eVar2.n(), eVar.n());
    }

    static String j0(e eVar) {
        return o.c(eVar).a("Game", eVar.g0()).a("Owner", eVar.x()).a("SnapshotId", eVar.f0()).a("CoverImageUri", eVar.t()).a("CoverImageUrl", eVar.getCoverImageUrl()).a("CoverImageAspectRatio", Float.valueOf(eVar.X())).a("Description", eVar.i()).a("LastModifiedTimestamp", Long.valueOf(eVar.E())).a("PlayedTime", Long.valueOf(eVar.w())).a("UniqueName", eVar.b0()).a(c3.d4(859), Boolean.valueOf(eVar.G())).a("ProgressValue", Long.valueOf(eVar.W())).a("DeviceName", eVar.n()).toString();
    }

    @Override // v1.e
    public long E() {
        return this.f5067l;
    }

    @Override // v1.e
    public boolean G() {
        return this.f5071p;
    }

    @Override // v1.e
    public long W() {
        return this.f5072q;
    }

    @Override // v1.e
    public float X() {
        return this.f5069n;
    }

    @Override // v1.e
    public final String a() {
        return this.f5065j;
    }

    @Override // v1.e
    public String b0() {
        return this.f5070o;
    }

    public boolean equals(Object obj) {
        return i0(this, obj);
    }

    @Override // v1.e
    public String f0() {
        return this.f5062g;
    }

    @Override // v1.e
    public p1.d g0() {
        return this.f5060e;
    }

    @Override // v1.e
    public String getCoverImageUrl() {
        return this.f5064i;
    }

    public int hashCode() {
        return h0(this);
    }

    @Override // v1.e
    public String i() {
        return this.f5066k;
    }

    @Override // v1.e
    public String n() {
        return this.f5073r;
    }

    @Override // v1.e
    public Uri t() {
        return this.f5063h;
    }

    public String toString() {
        return j0(this);
    }

    @Override // v1.e
    public long w() {
        return this.f5068m;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.n(parcel, 1, g0(), i4, false);
        i1.c.n(parcel, 2, x(), i4, false);
        i1.c.o(parcel, 3, f0(), false);
        i1.c.n(parcel, 5, t(), i4, false);
        i1.c.o(parcel, 6, getCoverImageUrl(), false);
        i1.c.o(parcel, 7, this.f5065j, false);
        i1.c.o(parcel, 8, i(), false);
        i1.c.l(parcel, 9, E());
        i1.c.l(parcel, 10, w());
        i1.c.g(parcel, 11, X());
        i1.c.o(parcel, 12, b0(), false);
        i1.c.c(parcel, 13, G());
        i1.c.l(parcel, 14, W());
        i1.c.o(parcel, 15, n(), false);
        i1.c.b(parcel, a4);
    }

    @Override // v1.e
    public p1.j x() {
        return this.f5061f;
    }
}
