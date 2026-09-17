package f1;

import android.os.DeadObjectException;
import android.os.RemoteException;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class v0 extends l0 {

    /* renamed from: b, reason: collision with root package name */
    protected final g2.i f3318b;

    public v0(int i4, g2.i iVar) {
        super(i4);
        this.f3318b = iVar;
    }

    @Override // f1.z0
    public final void a(Status status) {
        this.f3318b.d(new e1.b(status));
    }

    @Override // f1.z0
    public final void b(Exception exc) {
        this.f3318b.d(exc);
    }

    @Override // f1.z0
    public final void c(d0 d0Var) {
        try {
            h(d0Var);
        } catch (DeadObjectException e4) {
            a(z0.e(e4));
            throw e4;
        } catch (RemoteException e5) {
            a(z0.e(e5));
        } catch (RuntimeException e6) {
            this.f3318b.d(e6);
        }
    }

    protected abstract void h(d0 d0Var);
}
