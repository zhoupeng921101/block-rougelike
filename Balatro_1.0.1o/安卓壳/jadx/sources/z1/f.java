package z1;

import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import e1.f;
import h1.h;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f extends h {
    private final y0.g I;

    public f(Context context, Looper looper, h1.e eVar, y0.g gVar, f.a aVar, f.b bVar) {
        super(context, looper, 68, eVar, aVar, bVar);
        y0.f fVar = new y0.f(gVar == null ? y0.g.f5177h : gVar);
        fVar.a(b.a());
        this.I = new y0.g(fVar);
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.auth.api.credentials.internal.ICredentialsService";
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.auth.api.credentials.service.START";
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return 12800000;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.auth.api.credentials.internal.ICredentialsService");
        return queryLocalInterface instanceof g ? (g) queryLocalInterface : new g(iBinder);
    }

    @Override // h1.d
    protected final Bundle z() {
        return this.I.a();
    }
}
