package x1;

import android.content.Context;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends h1.h {
    protected d(Context context, Looper looper, h1.e eVar, f1.e eVar2, f1.l lVar) {
        super(context, looper, 300, eVar, eVar2, lVar);
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.appset.internal.IAppSetService";
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.appset.service.START";
    }

    @Override // h1.d
    protected final boolean H() {
        return true;
    }

    @Override // h1.d
    public final boolean Q() {
        return true;
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return 212800000;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.appset.internal.IAppSetService");
        return queryLocalInterface instanceof g ? (g) queryLocalInterface : new g(iBinder);
    }

    @Override // h1.d
    public final d1.c[] u() {
        return x0.h.f5109b;
    }
}
