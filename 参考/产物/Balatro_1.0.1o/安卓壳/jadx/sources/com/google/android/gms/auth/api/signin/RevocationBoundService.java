package com.google.android.gms.auth.api.signin;

import a1.b2.c3;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import b1.v;
import t2.zESy.lmWpit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class RevocationBoundService extends Service {

    public abstract class c2020060317 extends Service {
        public static IBinder onBind(RevocationBoundService revocationBoundService, Intent intent) {
            boolean equals = "com.google.android.gms.auth.api.signin.RevocationBoundService.disconnect".equals(intent.getAction());
            String d4 = c3.d4(1118);
            if (equals || "com.google.android.gms.auth.api.signin.RevocationBoundService.clearClientState".equals(intent.getAction())) {
                if (Log.isLoggable(d4, 2)) {
                    Log.v(d4, "RevocationBoundService handling ".concat(String.valueOf(intent.getAction())));
                }
                return new v(revocationBoundService);
            }
            Log.w(d4, c3.d4(1325).concat(String.valueOf(intent.getAction())));
            return null;
        }
    }

    @Override // android.app.Service
    public IBinder onBind(Intent intent) {
        return (IBinder) lmWpit.uquHZRcsLEvYxl.invoke(null, this, intent);
    }
}
