package h1;

import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class p1 extends b2.n implements l {
    public p1() {
        super("com.google.android.gms.common.internal.IGmsCallbacks");
    }

    @Override // b2.n
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 == 1) {
            int readInt = parcel.readInt();
            IBinder readStrongBinder = parcel.readStrongBinder();
            Bundle bundle = (Bundle) b2.o.a(parcel, Bundle.CREATOR);
            b2.o.c(parcel);
            l0(readInt, readStrongBinder, bundle);
        } else if (i4 == 2) {
            int readInt2 = parcel.readInt();
            Bundle bundle2 = (Bundle) b2.o.a(parcel, Bundle.CREATOR);
            b2.o.c(parcel);
            L(readInt2, bundle2);
        } else {
            if (i4 != 3) {
                return false;
            }
            int readInt3 = parcel.readInt();
            IBinder readStrongBinder2 = parcel.readStrongBinder();
            c1 c1Var = (c1) b2.o.a(parcel, c1.CREATOR);
            b2.o.c(parcel);
            q(readInt3, readStrongBinder2, c1Var);
        }
        parcel2.writeNoException();
        return true;
    }
}
