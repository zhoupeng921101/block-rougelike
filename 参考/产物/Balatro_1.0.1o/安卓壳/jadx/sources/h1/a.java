package h1;

import android.accounts.Account;
import android.os.Binder;
import android.os.RemoteException;
import android.util.Log;
import h1.k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a extends k.a {
    public static Account i(k kVar) {
        if (kVar == null) {
            return null;
        }
        long clearCallingIdentity = Binder.clearCallingIdentity();
        try {
            return kVar.b();
        } catch (RemoteException unused) {
            Log.w("AccountAccessor", "Remote account accessor probably died");
            return null;
        } finally {
            Binder.restoreCallingIdentity(clearCallingIdentity);
        }
    }
}
