package y1;

import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import android.text.TextUtils;
import f1.l;
import h1.e;
import h1.h;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends h {
    private final Bundle I;

    public b(Context context, Looper looper, e eVar, y0.c cVar, f1.e eVar2, l lVar) {
        super(context, looper, 16, eVar, eVar2, lVar);
        this.I = new Bundle();
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.auth.api.internal.IAuthService";
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.auth.service.START";
    }

    @Override // h1.d
    public final boolean Q() {
        return true;
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return d1.l.f3114a;
    }

    @Override // h1.d, e1.a.f
    public final boolean m() {
        e h02 = h0();
        return (TextUtils.isEmpty(h02.b()) || h02.e(y0.b.f5171a).isEmpty()) ? false : true;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.auth.api.internal.IAuthService");
        return queryLocalInterface instanceof c ? (c) queryLocalInterface : new c(iBinder);
    }

    @Override // h1.d
    protected final Bundle z() {
        return this.I;
    }
}
