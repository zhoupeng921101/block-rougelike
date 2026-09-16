package p1;

import android.os.Parcel;
import android.os.Parcelable;
import h1.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class q extends q1.r implements c {
    public static final Parcelable.Creator<q> CREATOR = new r();

    /* renamed from: e, reason: collision with root package name */
    private final int f4626e;

    public q(int i4) {
        this.f4626e = i4;
    }

    public q(c cVar) {
        this.f4626e = cVar.Z();
    }

    static int h0(c cVar) {
        return h1.o.b(Integer.valueOf(cVar.Z()));
    }

    static boolean i0(c cVar, Object obj) {
        if (obj instanceof c) {
            return obj == cVar || ((c) obj).Z() == cVar.Z();
        }
        return false;
    }

    static String j0(c cVar) {
        o.a c4 = h1.o.c(cVar);
        c4.a("FriendsListVisibilityStatus", Integer.valueOf(cVar.Z()));
        return c4.toString();
    }

    @Override // g1.e
    public final /* bridge */ /* synthetic */ Object P() {
        return this;
    }

    @Override // p1.c
    public final int Z() {
        return this.f4626e;
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
        r.a(this, parcel, i4);
    }
}
