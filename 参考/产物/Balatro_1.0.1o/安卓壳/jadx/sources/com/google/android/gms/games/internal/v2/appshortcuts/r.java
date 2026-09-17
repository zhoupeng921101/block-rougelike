package com.google.android.gms.games.internal.v2.appshortcuts;

import a1.b2.c3;
import android.content.Context;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r extends h1.h {
    public r(Context context, Looper looper, h1.e eVar, f1.e eVar2, f1.l lVar) {
        super(context, looper, 1, eVar, eVar2, lVar);
    }

    @Override // h1.d
    protected final String D() {
        return c3.d4(926);
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.games.internal.appshortcuts.service.START";
    }

    @Override // h1.d
    public final boolean Q() {
        return true;
    }

    @Override // h1.d, e1.a.f
    public final boolean d() {
        return false;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface(c3.d4(19));
        return queryLocalInterface instanceof s ? (s) queryLocalInterface : new s(iBinder);
    }

    @Override // h1.d
    public final d1.c[] u() {
        return new d1.c[]{p1.t.f4634g};
    }
}
