package c2;

import com.google.android.gms.common.api.Status;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h2 extends k1 {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ g2.i f2121a;

    h2(j2 j2Var, g2.i iVar) {
        this.f2121a = iVar;
        Objects.requireNonNull(j2Var);
    }

    @Override // c2.q2
    public final void o(Status status, n2 n2Var) {
        if (n2Var == null) {
            this.f2121a.b(new e1.b(status));
        } else {
            this.f2121a.c(n2Var);
        }
    }
}
