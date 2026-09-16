package b1;

import android.content.Context;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Looper;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.Scope;
import e1.f;
import java.util.Iterator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i extends h1.h {
    private final GoogleSignInOptions I;

    public i(Context context, Looper looper, h1.e eVar, GoogleSignInOptions googleSignInOptions, f.a aVar, f.b bVar) {
        super(context, looper, 91, eVar, aVar, bVar);
        GoogleSignInOptions.a aVar2 = googleSignInOptions != null ? new GoogleSignInOptions.a(googleSignInOptions) : new GoogleSignInOptions.a();
        aVar2.e(z1.b.a());
        if (!eVar.d().isEmpty()) {
            Iterator it = eVar.d().iterator();
            while (it.hasNext()) {
                aVar2.d((Scope) it.next(), new Scope[0]);
            }
        }
        this.I = aVar2.a();
    }

    @Override // h1.d
    protected final String D() {
        return "com.google.android.gms.auth.api.signin.internal.ISignInService";
    }

    @Override // h1.d
    protected final String E() {
        return "com.google.android.gms.auth.api.signin.service.START";
    }

    @Override // h1.d, e1.a.f
    public final int f() {
        return d1.l.f3114a;
    }

    public final GoogleSignInOptions k0() {
        return this.I;
    }

    @Override // h1.d
    protected final /* synthetic */ IInterface r(IBinder iBinder) {
        if (iBinder == null) {
            return null;
        }
        IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.auth.api.signin.internal.ISignInService");
        return queryLocalInterface instanceof u ? (u) queryLocalInterface : new u(iBinder);
    }
}
