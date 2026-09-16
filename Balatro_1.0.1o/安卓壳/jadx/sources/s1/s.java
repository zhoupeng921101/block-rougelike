package s1;

import android.content.Intent;
import android.os.Parcel;
import c2.j0;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class s extends c2.q implements t {
    public s() {
        super("com.google.android.gms.games.internal.v2.appshortcuts.IAppShortcutsServiceCallback");
    }

    @Override // c2.q
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 == 1) {
            Status status = (Status) j0.b(parcel, Status.CREATOR);
            j0.e(parcel);
            n(status);
        } else if (i4 == 2) {
            com.google.android.gms.games.internal.v2.appshortcuts.g gVar = (com.google.android.gms.games.internal.v2.appshortcuts.g) j0.b(parcel, com.google.android.gms.games.internal.v2.appshortcuts.g.CREATOR);
            j0.e(parcel);
            s(gVar);
        } else {
            if (i4 != 3) {
                return false;
            }
            Intent intent = (Intent) j0.b(parcel, Intent.CREATOR);
            j0.e(parcel);
            N(intent);
        }
        return true;
    }
}
