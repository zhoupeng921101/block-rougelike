package e1;

import com.google.android.gms.common.api.Status;
import f1.p;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h {
    public static g a(k kVar, f fVar) {
        q.j(kVar, "Result must not be null");
        q.b(!kVar.H().m0(), "Status code must not be SUCCESS");
        o oVar = new o(fVar, kVar);
        oVar.h(kVar);
        return oVar;
    }

    public static g b(Status status, f fVar) {
        q.j(status, "Result must not be null");
        p pVar = new p(fVar);
        pVar.h(status);
        return pVar;
    }
}
