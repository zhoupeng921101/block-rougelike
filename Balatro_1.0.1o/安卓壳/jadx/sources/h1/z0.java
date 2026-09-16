package h1;

import android.content.ComponentName;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.os.IInterface;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class z0 implements ServiceConnection {

    /* renamed from: a, reason: collision with root package name */
    private final int f3596a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ d f3597b;

    public z0(d dVar, int i4) {
        Objects.requireNonNull(dVar);
        this.f3597b = dVar;
        this.f3596a = i4;
    }

    @Override // android.content.ServiceConnection
    public final void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        d dVar = this.f3597b;
        if (iBinder == null) {
            dVar.W(16);
            return;
        }
        synchronized (dVar.Y()) {
            try {
                IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.common.internal.IGmsServiceBroker");
                dVar.Z((queryLocalInterface == null || !(queryLocalInterface instanceof m)) ? new r0(iBinder) : (m) queryLocalInterface);
            } catch (Throwable th) {
                throw th;
            }
        }
        this.f3597b.S(0, null, this.f3596a);
    }

    @Override // android.content.ServiceConnection
    public final void onServiceDisconnected(ComponentName componentName) {
        d dVar = this.f3597b;
        synchronized (dVar.Y()) {
            dVar.Z(null);
        }
        d dVar2 = this.f3597b;
        int i4 = this.f3596a;
        Handler handler = dVar2.f3453l;
        handler.sendMessage(handler.obtainMessage(6, i4, 1));
    }
}
