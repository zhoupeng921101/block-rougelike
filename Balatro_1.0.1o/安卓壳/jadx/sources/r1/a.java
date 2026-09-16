package r1;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import h1.o;
import q1.r;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends r implements b {
    public static final Parcelable.Creator<a> CREATOR = new c();

    /* renamed from: e, reason: collision with root package name */
    private final String f4826e;

    /* renamed from: f, reason: collision with root package name */
    private final String f4827f;

    /* renamed from: g, reason: collision with root package name */
    private final long f4828g;

    /* renamed from: h, reason: collision with root package name */
    private final Uri f4829h;

    /* renamed from: i, reason: collision with root package name */
    private final Uri f4830i;

    /* renamed from: j, reason: collision with root package name */
    private final Uri f4831j;

    a(String str, String str2, long j4, Uri uri, Uri uri2, Uri uri3) {
        this.f4826e = str;
        this.f4827f = str2;
        this.f4828g = j4;
        this.f4829h = uri;
        this.f4830i = uri2;
        this.f4831j = uri3;
    }

    public a(b bVar) {
        this.f4826e = bVar.a();
        this.f4827f = bVar.b();
        this.f4828g = bVar.c();
        this.f4829h = bVar.d();
        this.f4830i = bVar.e();
        this.f4831j = bVar.f();
    }

    static int h0(b bVar) {
        return o.b(bVar.a(), bVar.b(), Long.valueOf(bVar.c()), bVar.d(), bVar.e(), bVar.f());
    }

    static boolean i0(b bVar, Object obj) {
        if (!(obj instanceof b)) {
            return false;
        }
        if (bVar == obj) {
            return true;
        }
        b bVar2 = (b) obj;
        return o.a(bVar2.a(), bVar.a()) && o.a(bVar2.b(), bVar.b()) && o.a(Long.valueOf(bVar2.c()), Long.valueOf(bVar.c())) && o.a(bVar2.d(), bVar.d()) && o.a(bVar2.e(), bVar.e()) && o.a(bVar2.f(), bVar.f());
    }

    static String j0(b bVar) {
        return o.c(bVar).a("GameId", bVar.a()).a("GameName", bVar.b()).a("ActivityTimestampMillis", Long.valueOf(bVar.c())).a("GameIconUri", bVar.d()).a("GameHiResUri", bVar.e()).a("GameFeaturedUri", bVar.f()).toString();
    }

    @Override // r1.b
    public final String a() {
        return this.f4826e;
    }

    @Override // r1.b
    public final String b() {
        return this.f4827f;
    }

    @Override // r1.b
    public final long c() {
        return this.f4828g;
    }

    @Override // r1.b
    public final Uri d() {
        return this.f4829h;
    }

    @Override // r1.b
    public final Uri e() {
        return this.f4830i;
    }

    public final boolean equals(Object obj) {
        return i0(this, obj);
    }

    @Override // r1.b
    public final Uri f() {
        return this.f4831j;
    }

    public final int hashCode() {
        return h0(this);
    }

    public final String toString() {
        return j0(this);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        c.a(this, parcel, i4);
    }
}
