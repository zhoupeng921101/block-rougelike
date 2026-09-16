package c2;

import a1.b2.c3;
import android.os.Parcel;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class p2 extends q implements q2 {
    public p2() {
        super(c3.d4(1113));
    }

    @Override // c2.q
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 != 2) {
            return false;
        }
        Status status = (Status) j0.b(parcel, Status.CREATOR);
        n2 n2Var = (n2) j0.b(parcel, n2.CREATOR);
        j0.e(parcel);
        o(status, n2Var);
        return true;
    }
}
