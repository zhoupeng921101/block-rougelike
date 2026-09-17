package p1;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l extends q1.r {
    public static final Parcelable.Creator<l> CREATOR = new y();

    /* renamed from: e, reason: collision with root package name */
    private final int f4612e;

    /* renamed from: f, reason: collision with root package name */
    private final long f4613f;

    /* renamed from: g, reason: collision with root package name */
    private final long f4614g;

    public l(int i4, long j4, long j5) {
        h1.q.l(j4 >= 0, "Min XP must be positive!");
        h1.q.l(j5 > j4, c3.d4(709));
        this.f4612e = i4;
        this.f4613f = j4;
        this.f4614g = j5;
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof l)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        l lVar = (l) obj;
        return h1.o.a(Integer.valueOf(lVar.h0()), Integer.valueOf(h0())) && h1.o.a(Long.valueOf(lVar.j0()), Long.valueOf(j0())) && h1.o.a(Long.valueOf(lVar.i0()), Long.valueOf(i0()));
    }

    public int h0() {
        return this.f4612e;
    }

    public int hashCode() {
        return h1.o.b(Integer.valueOf(this.f4612e), Long.valueOf(this.f4613f), Long.valueOf(this.f4614g));
    }

    public long i0() {
        return this.f4614g;
    }

    public long j0() {
        return this.f4613f;
    }

    public String toString() {
        return h1.o.c(this).a("LevelNumber", Integer.valueOf(h0())).a("MinXp", Long.valueOf(j0())).a(c3.d4(405), Long.valueOf(i0())).toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, h0());
        i1.c.l(parcel, 2, j0());
        i1.c.l(parcel, 3, i0());
        i1.c.b(parcel, a4);
    }
}
