package b1;

import android.content.Context;
import android.os.Binder;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class v extends q {

    /* renamed from: a, reason: collision with root package name */
    private final Context f1797a;

    public v(Context context) {
        this.f1797a = context;
    }

    private final void h() {
        if (com.google.android.gms.common.util.l.a(this.f1797a, Binder.getCallingUid())) {
            return;
        }
        throw new SecurityException("Calling UID " + Binder.getCallingUid() + " is not Google Play services.");
    }

    @Override // b1.r
    public final void C() {
        h();
        c b4 = c.b(this.f1797a);
        GoogleSignInAccount c4 = b4.c();
        GoogleSignInOptions googleSignInOptions = GoogleSignInOptions.f2515p;
        if (c4 != null) {
            googleSignInOptions = b4.d();
        }
        com.google.android.gms.auth.api.signin.b a4 = com.google.android.gms.auth.api.signin.a.a(this.f1797a, googleSignInOptions);
        if (c4 != null) {
            a4.u();
        } else {
            a4.v();
        }
    }

    @Override // b1.r
    public final void t() {
        h();
        p.a(this.f1797a).b();
    }
}
