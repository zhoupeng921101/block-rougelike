package f2;

import android.os.Parcel;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e extends a2.b implements f {
    public e() {
        super("com.google.android.gms.signin.internal.ISignInCallbacks");
    }

    @Override // a2.b
    protected final boolean m0(int i4, Parcel parcel, Parcel parcel2, int i5) {
        switch (i4) {
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                a2.c.b(parcel);
                break;
            case 4:
                a2.c.b(parcel);
                break;
            case 5:
            default:
                return false;
            case 6:
                a2.c.b(parcel);
                break;
            case 7:
                a2.c.b(parcel);
                break;
            case 8:
                l lVar = (l) a2.c.a(parcel, l.CREATOR);
                a2.c.b(parcel);
                O(lVar);
                break;
            case 9:
                a2.c.b(parcel);
                break;
        }
        parcel2.writeNoException();
        return true;
    }
}
