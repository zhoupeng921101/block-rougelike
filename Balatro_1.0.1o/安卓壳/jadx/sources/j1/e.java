package j1;

import a1.b2.c3;
import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import f1.l;
import h1.h;
import h1.w;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e extends h {
    private final w I;

    public e(Context context, Looper looper, h1.e eVar, w wVar, f1.e eVar2, l lVar) {
        super(context, looper, 270, eVar, eVar2, lVar);
        this.I = wVar;
    }

    @Override // h1.d
    protected final String D() {
        return c3.d4(582);
    }

    @Override // h1.d
    protected final String E() {
        return c3.d4(487);
    }

    @Override // h1.d
    protected final boolean H() {
        return true;
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return 203400000;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.common.internal.service.IClientTelemetryService");
        return queryLocalInterface instanceof a ? (a) queryLocalInterface : new a(iBinder);
    }

    @Override // h1.d
    public final d1.c[] u() {
        return a2.d.f15b;
    }

    @Override // h1.d
    protected final Bundle z() {
        return this.I.b();
    }
}
