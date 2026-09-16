package q1;

import a1.b2.c3;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import android.os.RemoteException;
import c2.e1;
import com.google.android.gms.common.data.BitmapTeleporter;
import com.google.android.gms.common.internal.BinderWrapper;
import com.google.android.gms.games.PlayerEntity;
import h1.d;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends h1.h {
    private final c2.b I;
    private final String J;
    private PlayerEntity K;
    private final k L;
    private boolean M;
    private final long N;
    private final l O;
    private final p1.w P;

    public d(Context context, Looper looper, h1.e eVar, p1.w wVar, f1.e eVar2, f1.l lVar, l lVar2) {
        super(context, looper, 1, eVar, eVar2, lVar);
        this.I = new u(this);
        this.M = false;
        this.J = eVar.g();
        this.O = (l) h1.q.i(lVar2);
        k b4 = k.b(this, eVar.f());
        this.L = b4;
        this.N = hashCode();
        this.P = wVar;
        if (eVar.i() != null || (context instanceof Activity)) {
            b4.f(eVar.i());
        }
    }

    private static void q0(RemoteException remoteException) {
        e1.f(c3.d4(852), "service died", remoteException);
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.games.internal.IGamesService";
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.games.service.START";
    }

    @Override // h1.d
    public final /* bridge */ /* synthetic */ void J(IInterface iInterface) {
        j jVar = (j) iInterface;
        super.J(jVar);
        if (this.M) {
            this.L.g();
            this.M = false;
        }
        try {
            jVar.w(new v(new c2.d(this.L.e())), this.N);
        } catch (RemoteException e4) {
            q0(e4);
        }
    }

    @Override // h1.d
    public final void K(d1.a aVar) {
        super.K(aVar);
        this.M = false;
    }

    @Override // h1.d
    protected final void M(int i4, IBinder iBinder, Bundle bundle, int i5) {
        if (i4 == 0) {
            i4 = 0;
            if (bundle != null) {
                bundle.setClassLoader(d.class.getClassLoader());
                this.M = bundle.getBoolean("show_welcome_popup");
                this.K = (PlayerEntity) bundle.getParcelable(c3.d4(961));
            }
        }
        super.M(i4, iBinder, bundle, i5);
    }

    @Override // h1.d
    public final boolean N() {
        return true;
    }

    @Override // h1.d
    public final boolean Q() {
        return true;
    }

    @Override // h1.h, e1.a.f
    public final Set b() {
        return B();
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return d1.l.f3114a;
    }

    public final void k0(g2.i iVar, String str) {
        y yVar = iVar == null ? null : new y(iVar);
        try {
            j jVar = (j) C();
            k kVar = this.L;
            jVar.X(yVar, str, kVar.d(), kVar.c());
        } catch (SecurityException e4) {
            p1.g.a(iVar, e4);
        }
    }

    @Override // h1.d, e1.a.f
    public final void l() {
        this.M = false;
        if (a()) {
            try {
                this.I.a();
                ((j) C()).k(this.N);
            } catch (RemoteException unused) {
                e1.e("GamesGmsClientImpl", c3.d4(654));
            }
        }
        super.l();
    }

    public final void l0(g2.i iVar, String str, boolean z3, int i4) {
        try {
            ((j) C()).K(new c(iVar), str, z3, i4);
        } catch (SecurityException e4) {
            p1.g.a(iVar, e4);
        }
    }

    @Override // h1.d, e1.a.f
    public final boolean m() {
        return !this.P.f4659s.c();
    }

    public final void m0(g2.i iVar, v1.a aVar, v1.g gVar) {
        v1.b c02 = aVar.c0();
        h1.q.l(!c02.isClosed(), "Snapshot already closed");
        BitmapTeleporter a4 = gVar.a();
        if (a4 != null) {
            a4.h0(x().getCacheDir());
        }
        n1.a a5 = c02.a();
        c02.b();
        try {
            ((j) C()).v(new z(iVar), aVar.M().f0(), (v1.h) gVar, a5);
        } catch (SecurityException e4) {
            p1.g.a(iVar, e4);
        }
    }

    @Override // h1.d, e1.a.f
    public final void n(d.e eVar) {
        try {
            w wVar = new w(eVar);
            this.I.a();
            try {
                ((j) C()).d0(new x(wVar));
            } catch (SecurityException unused) {
                wVar.b(p1.e.b(4));
            }
        } catch (RemoteException unused2) {
            eVar.a();
        }
    }

    public final void n0(g2.i iVar, String str, String str2, v1.g gVar, v1.b bVar) {
        h1.q.l(!bVar.isClosed(), "SnapshotContents already closed");
        BitmapTeleporter a4 = gVar.a();
        if (a4 != null) {
            a4.h0(x().getCacheDir());
        }
        n1.a a5 = bVar.a();
        bVar.b();
        try {
            ((j) C()).r(new c(iVar), str, str2, (v1.h) gVar, a5);
        } catch (SecurityException e4) {
            p1.g.a(iVar, e4);
        }
    }

    final void o0(IBinder iBinder, Bundle bundle) {
        if (a()) {
            if (this.P.f4659s.b() && this.O.b()) {
                return;
            }
            try {
                ((j) C()).S(iBinder, bundle);
                this.O.c();
            } catch (RemoteException e4) {
                q0(e4);
            }
        }
    }

    @Override // h1.d, e1.a.f
    public final void p(d.c cVar) {
        this.K = null;
        super.p(cVar);
    }

    final void p0() {
        if (a()) {
            try {
                ((j) C()).g();
            } catch (RemoteException e4) {
                q0(e4);
            }
        }
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.games.internal.IGamesService");
        return queryLocalInterface instanceof j ? (j) queryLocalInterface : new i(iBinder);
    }

    public final void r0(q qVar) {
        qVar.c(this.L);
    }

    public final p1.j s0() {
        q();
        synchronized (this) {
            try {
                if (this.K == null) {
                    p1.k kVar = new p1.k(((j) C()).l());
                    try {
                        if (kVar.getCount() > 0) {
                            this.K = new PlayerEntity(kVar.get(0));
                        }
                        kVar.a();
                    } catch (Throwable th) {
                        kVar.a();
                        throw th;
                    }
                }
            } catch (Throwable th2) {
                throw th2;
            }
        }
        return this.K;
    }

    @Override // h1.d
    public final d1.c[] u() {
        return p1.t.f4640m;
    }

    @Override // h1.d
    public final Bundle w() {
        return null;
    }

    @Override // h1.d
    protected final Bundle z() {
        String locale = x().getResources().getConfiguration().locale.toString();
        Bundle bundle = new Bundle();
        bundle.putBoolean("com.google.android.gms.games.key.isHeadless", false);
        p1.w wVar = this.P;
        boolean z3 = wVar.f4646f;
        bundle.putBoolean(c3.d4(542), true);
        bundle.putInt("com.google.android.gms.games.key.connectingPopupGravity", 17);
        bundle.putBoolean("com.google.android.gms.games.key.retryingSignIn", false);
        bundle.putInt(c3.d4(655), wVar.f4649i);
        bundle.putString("com.google.android.gms.games.key.forceResolveAccountKey", null);
        bundle.putStringArrayList("com.google.android.gms.games.key.proxyApis", wVar.f4651k);
        bundle.putBoolean("com.google.android.gms.games.key.unauthenticated", false);
        bundle.putBoolean(c3.d4(354), false);
        bundle.putBoolean("com.google.android.gms.games.key.skipWelcomePopup", false);
        bundle.putString("com.google.android.gms.games.key.realClientPackageName", null);
        bundle.putInt("com.google.android.gms.games.key.API_VERSION", 9);
        bundle.putString("com.google.android.gms.games.key.gameRunToken", wVar.f4658r);
        bundle.putBoolean("com.google.android.gms.games.key.isGmsCoreUiInitiatedRequest", false);
        bundle.putString("com.google.android.gms.games.key.gamePackageName", this.J);
        bundle.putString("com.google.android.gms.games.key.desiredLocale", locale);
        bundle.putParcelable("com.google.android.gms.games.key.popupWindowToken", new BinderWrapper(this.L.d()));
        if (!bundle.containsKey("com.google.android.gms.games.key.API_VERSION")) {
            bundle.putInt("com.google.android.gms.games.key.API_VERSION", 9);
        }
        bundle.putBundle("com.google.android.gms.games.key.signInOptions", f2.a.k0(h0()));
        return bundle;
    }
}
