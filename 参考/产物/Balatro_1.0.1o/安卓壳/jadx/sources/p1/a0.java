package p1;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import h1.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a0 extends q1.r implements n {
    public static final Parcelable.Creator<a0> CREATOR = new b0();

    /* renamed from: e, reason: collision with root package name */
    private final int f4604e;

    /* renamed from: f, reason: collision with root package name */
    private final String f4605f;

    /* renamed from: g, reason: collision with root package name */
    private final String f4606g;

    /* renamed from: h, reason: collision with root package name */
    private final String f4607h;

    public a0(int i4, String str, String str2, String str3) {
        this.f4604e = i4;
        this.f4605f = str;
        this.f4606g = str2;
        this.f4607h = str3;
    }

    public a0(n nVar) {
        this.f4604e = nVar.z();
        this.f4605f = nVar.a();
        this.f4606g = nVar.b();
        this.f4607h = nVar.c();
    }

    static int h0(n nVar) {
        return h1.o.b(Integer.valueOf(nVar.z()), nVar.a(), nVar.b(), nVar.c());
    }

    static boolean i0(n nVar, Object obj) {
        if (!(obj instanceof n)) {
            return false;
        }
        if (obj == nVar) {
            return true;
        }
        n nVar2 = (n) obj;
        return nVar2.z() == nVar.z() && h1.o.a(nVar2.a(), nVar.a()) && h1.o.a(nVar2.b(), nVar.b()) && h1.o.a(nVar2.c(), nVar.c());
    }

    static String j0(n nVar) {
        o.a c4 = h1.o.c(nVar);
        c4.a("FriendStatus", Integer.valueOf(nVar.z()));
        if (nVar.a() != null) {
            c4.a("Nickname", nVar.a());
        }
        if (nVar.b() != null) {
            c4.a(c3.d4(135), nVar.b());
        }
        if (nVar.c() != null) {
            c4.a("NicknameAbuseReportToken", nVar.b());
        }
        return c4.toString();
    }

    @Override // g1.e
    public final /* bridge */ /* synthetic */ Object P() {
        return this;
    }

    @Override // p1.n
    public final String a() {
        return this.f4605f;
    }

    @Override // p1.n
    public final String b() {
        return this.f4606g;
    }

    @Override // p1.n
    public final String c() {
        return this.f4607h;
    }

    public final boolean equals(Object obj) {
        return i0(this, obj);
    }

    public final int hashCode() {
        return h0(this);
    }

    public final String toString() {
        return j0(this);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        b0.a(this, parcel, i4);
    }

    @Override // p1.n
    public final int z() {
        return this.f4604e;
    }
}
