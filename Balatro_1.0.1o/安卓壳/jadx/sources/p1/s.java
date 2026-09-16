package p1;

import android.os.Parcel;
import com.google.android.gms.common.data.DataHolder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s extends u implements c {

    /* renamed from: h, reason: collision with root package name */
    private final r1.e f4627h;

    public s(DataHolder dataHolder, int i4, r1.e eVar) {
        super(dataHolder, i4);
        this.f4627h = eVar;
    }

    @Override // g1.e
    public final /* synthetic */ Object P() {
        return new q(this);
    }

    @Override // p1.c
    public final int Z() {
        return h0(this.f4627h.L, 0);
    }

    public final boolean a() {
        String str = this.f4627h.L;
        return I(str) && !O(str);
    }

    @Override // android.os.Parcelable
    public final int describeContents() {
        return 0;
    }

    public final boolean equals(Object obj) {
        return q.i0(this, obj);
    }

    public final int hashCode() {
        return q.h0(this);
    }

    public final String toString() {
        return q.j0(this);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        r.a(new q(this), parcel, i4);
    }
}
