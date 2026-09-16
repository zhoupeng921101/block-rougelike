package b1;

import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class u extends z1.a implements IInterface {
    u(IBinder iBinder) {
        super(iBinder, "com.google.android.gms.auth.api.signin.internal.ISignInService");
    }

    public final void i(t tVar, GoogleSignInOptions googleSignInOptions) {
        Parcel a4 = a();
        z1.d.d(a4, tVar);
        z1.d.c(a4, googleSignInOptions);
        h(103, a4);
    }

    public final void m0(t tVar, GoogleSignInOptions googleSignInOptions) {
        Parcel a4 = a();
        z1.d.d(a4, tVar);
        z1.d.c(a4, googleSignInOptions);
        h(102, a4);
    }
}
