package f1;

import a1.b2.c3;
import android.os.RemoteException;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class z0 {

    /* renamed from: a, reason: collision with root package name */
    public final int f3327a;

    public z0(int i4) {
        this.f3327a = i4;
    }

    static /* bridge */ /* synthetic */ Status e(RemoteException remoteException) {
        return new Status(19, remoteException.getClass().getSimpleName() + c3.d4(341) + remoteException.getLocalizedMessage());
    }

    public abstract void a(Status status);

    public abstract void b(Exception exc);

    public abstract void c(d0 d0Var);

    public abstract void d(u uVar, boolean z3);
}
