package b1;

import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class q extends z1.c implements r {
    public q() {
        super("com.google.android.gms.auth.api.signin.internal.IRevocationService");
    }

    @Override // z1.c
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 == 1) {
            C();
        } else {
            if (i4 != 2) {
                return false;
            }
            t();
        }
        return true;
    }
}
