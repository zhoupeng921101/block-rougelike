package androidx.core.app;

import android.app.PendingIntent;
import androidx.core.graphics.drawable.IconCompat;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class RemoteActionCompatParcelizer {
    public static RemoteActionCompat read(androidx.versionedparcelable.a aVar) {
        RemoteActionCompat remoteActionCompat = new RemoteActionCompat();
        remoteActionCompat.f778a = (IconCompat) aVar.v(remoteActionCompat.f778a, 1);
        remoteActionCompat.f779b = aVar.l(remoteActionCompat.f779b, 2);
        remoteActionCompat.f780c = aVar.l(remoteActionCompat.f780c, 3);
        remoteActionCompat.f781d = (PendingIntent) aVar.r(remoteActionCompat.f781d, 4);
        remoteActionCompat.f782e = aVar.h(remoteActionCompat.f782e, 5);
        remoteActionCompat.f783f = aVar.h(remoteActionCompat.f783f, 6);
        return remoteActionCompat;
    }

    public static void write(RemoteActionCompat remoteActionCompat, androidx.versionedparcelable.a aVar) {
        aVar.x(false, false);
        aVar.M(remoteActionCompat.f778a, 1);
        aVar.D(remoteActionCompat.f779b, 2);
        aVar.D(remoteActionCompat.f780c, 3);
        aVar.H(remoteActionCompat.f781d, 4);
        aVar.z(remoteActionCompat.f782e, 5);
        aVar.z(remoteActionCompat.f783f, 6);
    }
}
