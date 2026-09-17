package p1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m extends q1.r {
    public static final Parcelable.Creator<m> CREATOR = new z();

    /* renamed from: e, reason: collision with root package name */
    private final long f4615e;

    /* renamed from: f, reason: collision with root package name */
    private final long f4616f;

    /* renamed from: g, reason: collision with root package name */
    private final l f4617g;

    /* renamed from: h, reason: collision with root package name */
    private final l f4618h;

    public m(long j4, long j5, l lVar, l lVar2) {
        h1.q.k(j4 != -1);
        h1.q.i(lVar);
        h1.q.i(lVar2);
        this.f4615e = j4;
        this.f4616f = j5;
        this.f4617g = lVar;
        this.f4618h = lVar2;
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof m)) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        m mVar = (m) obj;
        return h1.o.a(Long.valueOf(this.f4615e), Long.valueOf(mVar.f4615e)) && h1.o.a(Long.valueOf(this.f4616f), Long.valueOf(mVar.f4616f)) && h1.o.a(this.f4617g, mVar.f4617g) && h1.o.a(this.f4618h, mVar.f4618h);
    }

    public l h0() {
        return this.f4617g;
    }

    public int hashCode() {
        return h1.o.b(Long.valueOf(this.f4615e), Long.valueOf(this.f4616f), this.f4617g, this.f4618h);
    }

    public long i0() {
        return this.f4615e;
    }

    public long j0() {
        return this.f4616f;
    }

    public l k0() {
        return this.f4618h;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.l(parcel, 1, i0());
        i1.c.l(parcel, 2, j0());
        i1.c.n(parcel, 3, h0(), i4, false);
        i1.c.n(parcel, 4, k0(), i4, false);
        i1.c.b(parcel, a4);
    }
}
