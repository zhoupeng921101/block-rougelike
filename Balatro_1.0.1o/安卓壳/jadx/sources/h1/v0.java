package h1;

import a1.b2.c3;
import android.net.Uri;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class v0 {

    /* renamed from: a, reason: collision with root package name */
    private static final Uri f3586a = new Uri.Builder().scheme(c3.d4(940)).authority("com.google.android.gms.chimera").build();

    /* JADX WARN: Removed duplicated region for block: B:18:0x005f  */
    /* JADX WARN: Removed duplicated region for block: B:26:0x0081  */
    /* JADX WARN: Removed duplicated region for block: B:37:0x00b9  */
    /* JADX WARN: Removed duplicated region for block: B:39:0x00c7 A[RETURN] */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    static android.content.Intent a(android.content.Context r5, h1.g1 r6) {
        /*
            java.lang.String r0 = "ServiceBindIntentUtils"
            java.lang.String r1 = r6.a()
            if (r1 != 0) goto L16
            android.content.Intent r5 = new android.content.Intent
            r5.<init>()
            android.content.ComponentName r6 = r6.c()
            android.content.Intent r5 = r5.setComponent(r6)
            return r5
        L16:
            boolean r2 = r6.d()
            r3 = 0
            if (r2 == 0) goto Lb7
            android.os.Bundle r2 = new android.os.Bundle
            r2.<init>()
            java.lang.String r4 = "serviceActionBundleKey"
            r2.putString(r4, r1)
            android.content.ContentResolver r5 = r5.getContentResolver()     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            android.net.Uri r4 = h1.v0.f3586a     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            android.content.ContentProviderClient r5 = r5.acquireUnstableContentProviderClient(r4)     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            if (r5 == 0) goto L46
            java.lang.String r4 = "serviceIntentCall"
            android.os.Bundle r2 = r5.call(r4, r3, r2)     // Catch: java.lang.Throwable -> L41
            r5.release()     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            goto L5c
        L3d:
            r5 = move-exception
            goto L4e
        L3f:
            r5 = move-exception
            goto L4e
        L41:
            r2 = move-exception
            r5.release()     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            throw r2     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
        L46:
            android.os.RemoteException r5 = new android.os.RemoteException     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            java.lang.String r2 = "Failed to acquire ContentProviderClient"
            r5.<init>(r2)     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
            throw r5     // Catch: java.lang.IllegalArgumentException -> L3d android.os.RemoteException -> L3f
        L4e:
            java.lang.String r2 = "Dynamic intent resolution failed: "
            java.lang.String r5 = r5.toString()
            java.lang.String r5 = r2.concat(r5)
            android.util.Log.w(r0, r5)
            r2 = r3
        L5c:
            if (r2 != 0) goto L5f
            goto L7f
        L5f:
            r5 = 0
            r5 = 1128(0x468, float:1.58E-42)
            java.lang.String r5 = a1.b2.c3.d4(r5)
            android.os.Parcelable r5 = r2.getParcelable(r5)
            android.content.Intent r5 = (android.content.Intent) r5
            if (r5 == 0) goto L70
            r3 = r5
            goto L7f
        L70:
            r5 = 0
            r5 = 76
            java.lang.String r5 = a1.b2.c3.d4(r5)
            android.os.Parcelable r5 = r2.getParcelable(r5)
            android.app.PendingIntent r5 = (android.app.PendingIntent) r5
            if (r5 != 0) goto L8b
        L7f:
            if (r3 != 0) goto Lb7
            java.lang.String r5 = "Dynamic lookup for intent failed for action: "
            java.lang.String r5 = r5.concat(r1)
            android.util.Log.w(r0, r5)
            goto Lb7
        L8b:
            int r6 = r1.length()
            java.lang.StringBuilder r2 = new java.lang.StringBuilder
            int r6 = r6 + 72
            r2.<init>(r6)
            java.lang.String r6 = "Dynamic lookup for intent failed for action "
            r2.append(r6)
            r2.append(r1)
            java.lang.String r6 = " but has possible resolution"
            r2.append(r6)
            java.lang.String r6 = r2.toString()
            android.util.Log.w(r0, r6)
            h1.t0 r6 = new h1.t0
            d1.a r0 = new d1.a
            r1 = 25
            r0.<init>(r1, r5)
            r6.<init>(r0)
            throw r6
        Lb7:
            if (r3 != 0) goto Lc7
            android.content.Intent r5 = new android.content.Intent
            r5.<init>(r1)
            java.lang.String r6 = r6.b()
            android.content.Intent r5 = r5.setPackage(r6)
            return r5
        Lc7:
            return r3
        */
        throw new UnsupportedOperationException("Method not decompiled: h1.v0.a(android.content.Context, h1.g1):android.content.Intent");
    }
}
