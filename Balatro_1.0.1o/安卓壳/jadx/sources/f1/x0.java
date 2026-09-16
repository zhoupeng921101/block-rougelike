package f1;

import android.os.DeadObjectException;
import android.os.RemoteException;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class x0 extends l0 {

    /* renamed from: b, reason: collision with root package name */
    private final q f3322b;

    /* renamed from: c, reason: collision with root package name */
    private final g2.i f3323c;

    /* renamed from: d, reason: collision with root package name */
    private final o f3324d;

    public x0(int i4, q qVar, g2.i iVar, o oVar) {
        super(i4);
        this.f3323c = iVar;
        this.f3322b = qVar;
        this.f3324d = oVar;
        if (i4 == 2 && qVar.c()) {
            throw new IllegalArgumentException("Best-effort write calls cannot pass methods that should auto-resolve missing features.");
        }
    }

    @Override // f1.z0
    public final void a(Status status) {
        this.f3323c.d(this.f3324d.a(status));
    }

    @Override // f1.z0
    public final void b(Exception exc) {
        this.f3323c.d(exc);
    }

    @Override // f1.z0
    public final void c(d0 d0Var) {
        try {
            this.f3322b.b(d0Var.v(), this.f3323c);
        } catch (DeadObjectException e4) {
            throw e4;
        } catch (RemoteException e5) {
            a(z0.e(e5));
        } catch (RuntimeException e6) {
            this.f3323c.d(e6);
        }
    }

    @Override // f1.z0
    public final void d(u uVar, boolean z3) {
        uVar.d(this.f3323c, z3);
    }

    @Override // f1.l0
    public final boolean f(d0 d0Var) {
        return this.f3322b.c();
    }

    @Override // f1.l0
    public final d1.c[] g(d0 d0Var) {
        return this.f3322b.e();
    }
}
