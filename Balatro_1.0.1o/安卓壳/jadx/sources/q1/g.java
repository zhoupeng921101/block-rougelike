package q1;

import a1.b2.c3;
import android.os.Parcel;
import c2.j0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g extends c2.q implements h {
    public g() {
        super(c3.d4(1203));
    }

    @Override // c2.q
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 != 1001) {
            return false;
        }
        c2.d b4 = b();
        parcel2.writeNoException();
        int i6 = j0.f2132a;
        parcel2.writeInt(1);
        b4.writeToParcel(parcel2, 1);
        return true;
    }
}
