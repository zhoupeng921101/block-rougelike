package b1;

import android.content.Context;
import com.google.android.gms.common.api.Status;
import java.util.Iterator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class o {

    /* renamed from: a, reason: collision with root package name */
    private static final k1.a f1792a = new k1.a("GoogleSignInCommon", new String[0]);

    public static e1.g a(e1.f fVar, Context context, boolean z3) {
        f1792a.a("Revoking access", new Object[0]);
        String e4 = c.b(context).e();
        c(context);
        return z3 ? f.a(e4) : fVar.a(new m(fVar));
    }

    public static e1.g b(e1.f fVar, Context context, boolean z3) {
        f1792a.a("Signing out", new Object[0]);
        c(context);
        return z3 ? e1.h.b(Status.f2559j, fVar) : fVar.a(new k(fVar));
    }

    private static void c(Context context) {
        p.a(context).b();
        Iterator it = e1.f.b().iterator();
        while (it.hasNext()) {
            ((e1.f) it.next()).e();
        }
        f1.f.a();
    }
}
