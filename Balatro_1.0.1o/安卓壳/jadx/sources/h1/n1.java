package h1;

import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class n1 extends b2.n implements o1 {
    public n1() {
        super("com.google.android.gms.common.internal.ICertData");
    }

    @Override // b2.n
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 == 1) {
            o1.a d4 = d();
            parcel2.writeNoException();
            b2.o.b(parcel2, d4);
        } else {
            if (i4 != 2) {
                return false;
            }
            int e4 = e();
            parcel2.writeNoException();
            parcel2.writeInt(e4);
        }
        return true;
    }
}
