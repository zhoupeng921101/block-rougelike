package t1;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import com.google.android.gms.games.internal.v2.resolution.GamesResolutionActivity;
import g2.h;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b {
    b() {
    }

    public static b a() {
        return new b();
    }

    public static final h b(Activity activity, PendingIntent pendingIntent) {
        a aVar = new a();
        Intent intent = new Intent(activity, (Class<?>) GamesResolutionActivity.class);
        intent.putExtra("pendingIntent", pendingIntent);
        intent.putExtra("resultReceiver", aVar);
        activity.startActivity(intent);
        return aVar.o();
    }
}
