package p1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b0 implements Parcelable.Creator {
    static void a(a0 a0Var, Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, a0Var.z());
        i1.c.o(parcel, 2, a0Var.a(), false);
        i1.c.o(parcel, 3, a0Var.b(), false);
        i1.c.o(parcel, 4, a0Var.c(), false);
        i1.c.b(parcel, a4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = null;
        String str2 = null;
        int i4 = 0;
        String str3 = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                i4 = i1.b.q(parcel, o3);
            } else if (k4 == 2) {
                str = i1.b.e(parcel, o3);
            } else if (k4 == 3) {
                str3 = i1.b.e(parcel, o3);
            } else if (k4 != 4) {
                i1.b.v(parcel, o3);
            } else {
                str2 = i1.b.e(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new a0(i4, str, str3, str2);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new a0[i4];
    }
}
