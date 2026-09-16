package f2;

import a1.b2.c3;
import android.accounts.Account;
import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import android.os.RemoteException;
import android.util.Log;
import e1.f;
import h1.d;
import h1.m0;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends h1.h implements e2.e {
    public static final /* synthetic */ int M = 0;
    private final boolean I;
    private final h1.e J;
    private final Bundle K;
    private final Integer L;

    public a(Context context, Looper looper, boolean z3, h1.e eVar, Bundle bundle, f.a aVar, f.b bVar) {
        super(context, looper, 44, eVar, aVar, bVar);
        this.I = true;
        this.J = eVar;
        this.K = bundle;
        this.L = eVar.k();
    }

    public static Bundle k0(h1.e eVar) {
        eVar.j();
        Integer k4 = eVar.k();
        Bundle bundle = new Bundle();
        bundle.putParcelable("com.google.android.gms.signin.internal.clientRequestedAccount", eVar.a());
        if (k4 != null) {
            bundle.putInt("com.google.android.gms.common.internal.ClientSettings.sessionId", k4.intValue());
        }
        bundle.putBoolean("com.google.android.gms.signin.internal.offlineAccessRequested", false);
        bundle.putBoolean("com.google.android.gms.signin.internal.idTokenRequested", false);
        bundle.putString("com.google.android.gms.signin.internal.serverClientId", null);
        bundle.putBoolean("com.google.android.gms.signin.internal.usePromptModeForAuthCode", true);
        bundle.putBoolean("com.google.android.gms.signin.internal.forceCodeForRefreshToken", false);
        bundle.putString("com.google.android.gms.signin.internal.hostedDomain", null);
        bundle.putString("com.google.android.gms.signin.internal.logSessionId", null);
        bundle.putBoolean(c3.d4(887), false);
        return bundle;
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.signin.internal.ISignInService";
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.signin.service.START";
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return d1.l.f3114a;
    }

    @Override // e2.e
    public final void k(f fVar) {
        q.j(fVar, "Expecting a valid ISignInCallbacks");
        try {
            Account c4 = this.J.c();
            ((g) C()).m0(new j(1, new m0(c4, ((Integer) q.i(this.L)).intValue(), "<<default account>>".equals(c4.name) ? b1.c.b(x()).c() : null)), fVar);
        } catch (RemoteException e4) {
            Log.w("SignInClientImpl", c3.d4(634));
            try {
                fVar.O(new l(1, new d1.a(8, null), null));
            } catch (RemoteException unused) {
                Log.wtf("SignInClientImpl", "ISignInCallbacks#onSignInComplete should be executed from the same process, unexpected RemoteException.", e4);
            }
        }
    }

    @Override // h1.d, e1.a.f
    public final boolean m() {
        return this.I;
    }

    @Override // e2.e
    public final void o() {
        p(new d.C0047d(this));
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.signin.internal.ISignInService");
        return queryLocalInterface instanceof g ? (g) queryLocalInterface : new g(iBinder);
    }

    @Override // h1.d
    protected final Bundle z() {
        if (!x().getPackageName().equals(this.J.g())) {
            this.K.putString("com.google.android.gms.signin.internal.realClientPackageName", this.J.g());
        }
        return this.K;
    }
}
