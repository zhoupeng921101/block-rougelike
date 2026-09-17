package c2;

import a1.b2.c3;
import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k2 extends h1.h {
    private final d2 I;

    public k2(Context context, Looper looper, h1.e eVar, d2 d2Var, f1.e eVar2, f1.l lVar) {
        super(context, looper, 1, eVar, eVar2, lVar);
        this.I = d2Var;
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.games.internal.connect.IGamesConnectService";
    }

    @Override // h1.d
    protected final String E() {
        return c3.d4(61);
    }

    @Override // h1.d
    public final boolean Q() {
        return true;
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return 213000000;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface(c3.d4(112));
        return queryLocalInterface instanceof r2 ? (r2) queryLocalInterface : new r2(iBinder);
    }

    @Override // h1.d
    protected final Bundle z() {
        Bundle bundle = new Bundle();
        d2 d2Var = this.I;
        bundle.putInt(c3.d4(1408), d2Var.f2100e);
        bundle.putString("com.google.android.gms.games.key.gamePackageName", d2Var.f2101f);
        return bundle;
    }
}
