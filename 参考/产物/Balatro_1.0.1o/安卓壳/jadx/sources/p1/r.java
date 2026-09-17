package p1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r implements Parcelable.Creator {
    static void a(q qVar, Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, qVar.Z());
        i1.c.b(parcel, a4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        int i4 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            if (i1.b.k(o3) != 1) {
                i1.b.v(parcel, o3);
            } else {
                i4 = i1.b.q(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new q(i4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new q[i4];
    }
}
