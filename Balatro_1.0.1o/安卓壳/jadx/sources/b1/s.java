package b1;

import android.os.Parcel;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class s extends z1.c implements t {
    public s() {
        super("com.google.android.gms.auth.api.signin.internal.ISignInCallbacks");
    }

    @Override // z1.c
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        switch (i4) {
            case 101:
                GoogleSignInAccount googleSignInAccount = (GoogleSignInAccount) z1.d.a(parcel, GoogleSignInAccount.CREATOR);
                Status status = (Status) z1.d.a(parcel, Status.CREATOR);
                z1.d.b(parcel);
                i0(googleSignInAccount, status);
                break;
            case 102:
                Status status2 = (Status) z1.d.a(parcel, Status.CREATOR);
                z1.d.b(parcel);
                p(status2);
                break;
            case 103:
                Status status3 = (Status) z1.d.a(parcel, Status.CREATOR);
                z1.d.b(parcel);
                g0(status3);
                break;
            default:
                return false;
        }
        parcel2.writeNoException();
        return true;
    }
}
