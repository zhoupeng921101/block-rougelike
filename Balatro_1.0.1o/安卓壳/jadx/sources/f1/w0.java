package f1;

import a1.b2.c3;
import android.util.Log;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class w0 extends z0 {

    /* renamed from: b, reason: collision with root package name */
    protected final com.google.android.gms.common.api.internal.a f3320b;

    public w0(int i4, com.google.android.gms.common.api.internal.a aVar) {
        super(i4);
        this.f3320b = (com.google.android.gms.common.api.internal.a) h1.q.j(aVar, c3.d4(1173));
    }

    @Override // f1.z0
    public final void a(Status status) {
        try {
            this.f3320b.b(status);
        } catch (IllegalStateException e4) {
            Log.w("ApiCallRunner", "Exception reporting failure", e4);
        }
    }

    @Override // f1.z0
    public final void b(Exception exc) {
        try {
            this.f3320b.b(new Status(10, exc.getClass().getSimpleName() + ": " + exc.getLocalizedMessage()));
        } catch (IllegalStateException e4) {
            Log.w("ApiCallRunner", c3.d4(937), e4);
        }
    }

    @Override // f1.z0
    public final void c(d0 d0Var) {
        try {
            this.f3320b.p(d0Var.v());
        } catch (RuntimeException e4) {
            b(e4);
        }
    }

    @Override // f1.z0
    public final void d(u uVar, boolean z3) {
        uVar.c(this.f3320b, z3);
    }
}
