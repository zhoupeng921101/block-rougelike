package r1;

import android.net.Uri;
import android.os.Parcel;
import com.google.android.gms.common.data.DataHolder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends g1.d implements b {

    /* renamed from: h, reason: collision with root package name */
    private final e f4832h;

    public d(DataHolder dataHolder, int i4, e eVar) {
        super(dataHolder, i4);
        this.f4832h = eVar;
    }

    @Override // r1.b
    public final String a() {
        return H(this.f4832h.f4852t);
    }

    @Override // r1.b
    public final String b() {
        return H(this.f4832h.f4853u);
    }

    @Override // r1.b
    public final long c() {
        return y(this.f4832h.f4854v);
    }

    @Override // r1.b
    public final Uri d() {
        return Q(this.f4832h.f4855w);
    }

    @Override // android.os.Parcelable
    public final int describeContents() {
        return 0;
    }

    @Override // r1.b
    public final Uri e() {
        return Q(this.f4832h.f4856x);
    }

    public final boolean equals(Object obj) {
        return a.i0(this, obj);
    }

    @Override // r1.b
    public final Uri f() {
        return Q(this.f4832h.f4857y);
    }

    public final int hashCode() {
        return a.h0(this);
    }

    public final String toString() {
        return a.j0(this);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        c.a(new a(this), parcel, i4);
    }
}
