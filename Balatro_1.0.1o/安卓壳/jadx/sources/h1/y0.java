package h1;

import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class y0 extends p1 {

    /* renamed from: a, reason: collision with root package name */
    private d f3594a;

    /* renamed from: b, reason: collision with root package name */
    private final int f3595b;

    public y0(d dVar, int i4) {
        this.f3594a = dVar;
        this.f3595b = i4;
    }

    @Override // h1.l
    public final void L(int i4, Bundle bundle) {
        Log.wtf("GmsClient", "received deprecated onAccountValidationComplete callback, ignoring", new Exception());
    }

    @Override // h1.l
    public final void l0(int i4, IBinder iBinder, Bundle bundle) {
        q.j(this.f3594a, "onPostInitComplete can be called only once per call to getRemoteService");
        this.f3594a.M(i4, iBinder, bundle, this.f3595b);
        this.f3594a = null;
    }

    @Override // h1.l
    public final void q(int i4, IBinder iBinder, c1 c1Var) {
        d dVar = this.f3594a;
        q.j(dVar, "onPostInitCompleteWithConnectionInfo can be called only once per call togetRemoteService");
        q.i(c1Var);
        dVar.T(c1Var);
        l0(i4, iBinder, c1Var.f3438e);
    }
}
