package p1;

import android.os.Parcel;
import com.google.android.gms.common.data.DataHolder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c0 extends u implements n {

    /* renamed from: h, reason: collision with root package name */
    private final r1.e f4611h;

    public c0(DataHolder dataHolder, int i4, r1.e eVar) {
        super(dataHolder, i4);
        this.f4611h = eVar;
    }

    @Override // g1.e
    public final /* synthetic */ Object P() {
        return new a0(this);
    }

    @Override // p1.n
    public final String a() {
        return V(this.f4611h.I, null);
    }

    @Override // p1.n
    public final String b() {
        return V(this.f4611h.J, null);
    }

    @Override // p1.n
    public final String c() {
        return V(this.f4611h.K, null);
    }

    @Override // android.os.Parcelable
    public final int describeContents() {
        return 0;
    }

    public final boolean equals(Object obj) {
        return a0.i0(this, obj);
    }

    public final int hashCode() {
        return a0.h0(this);
    }

    public final String toString() {
        return a0.j0(this);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        b0.a(new a0(this), parcel, i4);
    }

    @Override // p1.n
    public final int z() {
        return h0(this.f4611h.H, -1);
    }
}
