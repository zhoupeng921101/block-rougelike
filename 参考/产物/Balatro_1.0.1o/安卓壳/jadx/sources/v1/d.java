package v1;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import h1.o;
import q1.r;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends r implements a {
    public static final Parcelable.Creator<d> CREATOR = new l();

    /* renamed from: e, reason: collision with root package name */
    private final i f5048e;

    /* renamed from: f, reason: collision with root package name */
    private final c f5049f;

    public d(e eVar, c cVar) {
        this.f5048e = new i(eVar);
        this.f5049f = cVar;
    }

    @Override // v1.a
    public e M() {
        return this.f5048e;
    }

    @Override // v1.a
    public b c0() {
        c cVar = this.f5049f;
        if (cVar.isClosed()) {
            return null;
        }
        return cVar;
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof a)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        a aVar = (a) obj;
        return o.a(aVar.M(), M()) && o.a(aVar.c0(), c0());
    }

    public int hashCode() {
        return o.b(M(), c0());
    }

    public String toString() {
        return o.c(this).a("Metadata", M()).a(c3.d4(142), Boolean.valueOf(c0() != null)).toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.n(parcel, 1, M(), i4, false);
        i1.c.n(parcel, 3, c0(), i4, false);
        i1.c.b(parcel, a4);
    }
}
