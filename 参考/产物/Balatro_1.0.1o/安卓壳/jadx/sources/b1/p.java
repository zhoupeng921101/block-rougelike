package b1;

import android.content.Context;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class p {

    /* renamed from: d, reason: collision with root package name */
    private static p f1793d;

    /* renamed from: a, reason: collision with root package name */
    final c f1794a;

    /* renamed from: b, reason: collision with root package name */
    GoogleSignInAccount f1795b;

    /* renamed from: c, reason: collision with root package name */
    GoogleSignInOptions f1796c;

    private p(Context context) {
        c b4 = c.b(context);
        this.f1794a = b4;
        this.f1795b = b4.c();
        this.f1796c = b4.d();
    }

    public static synchronized p a(Context context) {
        p d4;
        synchronized (p.class) {
            d4 = d(context.getApplicationContext());
        }
        return d4;
    }

    private static synchronized p d(Context context) {
        synchronized (p.class) {
            p pVar = f1793d;
            if (pVar != null) {
                return pVar;
            }
            p pVar2 = new p(context);
            f1793d = pVar2;
            return pVar2;
        }
    }

    public final synchronized void b() {
        this.f1794a.a();
        this.f1795b = null;
        this.f1796c = null;
    }

    public final synchronized void c(GoogleSignInOptions googleSignInOptions, GoogleSignInAccount googleSignInAccount) {
        this.f1794a.f(googleSignInAccount, googleSignInOptions);
        this.f1795b = googleSignInAccount;
        this.f1796c = googleSignInOptions;
    }
}
