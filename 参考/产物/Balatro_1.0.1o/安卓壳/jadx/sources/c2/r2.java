package c2;

import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r2 extends a implements IInterface {
    r2(IBinder iBinder) {
        super(iBinder, "com.google.android.gms.games.internal.connect.IGamesConnectService");
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void m0(q2 q2Var, l2 l2Var) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(q2Var);
        j0.c(a4, l2Var);
        i(2, a4);
    }
}
