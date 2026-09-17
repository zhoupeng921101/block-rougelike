package h1;

import a1.b2.c3;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.RemoteException;
import android.util.Log;
import h1.d;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a1 extends q0 {

    /* renamed from: g, reason: collision with root package name */
    public final IBinder f3430g;

    /* renamed from: h, reason: collision with root package name */
    final /* synthetic */ d f3431h;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public a1(d dVar, int i4, IBinder iBinder, Bundle bundle) {
        super(dVar, i4, bundle);
        Objects.requireNonNull(dVar);
        this.f3431h = dVar;
        this.f3430g = iBinder;
    }

    @Override // h1.q0
    protected final boolean e() {
        try {
            IBinder iBinder = this.f3430g;
            q.i(iBinder);
            String interfaceDescriptor = iBinder.getInterfaceDescriptor();
            d dVar = this.f3431h;
            if (!dVar.D().equals(interfaceDescriptor)) {
                String D = dVar.D();
                StringBuilder sb = new StringBuilder(String.valueOf(D).length() + 34 + String.valueOf(interfaceDescriptor).length());
                sb.append(c3.d4(1041));
                sb.append(D);
                sb.append(" vs. ");
                sb.append(interfaceDescriptor);
                Log.w("GmsClient", sb.toString());
                return false;
            }
            IInterface r3 = dVar.r(this.f3430g);
            if (r3 == null || !(dVar.V(2, 4, r3) || dVar.V(3, 4, r3))) {
                return false;
            }
            dVar.e0(null);
            d.a b02 = dVar.b0();
            Bundle w3 = dVar.w();
            if (b02 == null) {
                return true;
            }
            dVar.b0().i(w3);
            return true;
        } catch (RemoteException unused) {
            Log.w("GmsClient", "service probably died");
            return false;
        }
    }

    @Override // h1.q0
    protected final void f(d1.a aVar) {
        d dVar = this.f3431h;
        if (dVar.c0() != null) {
            dVar.c0().h(aVar);
        }
        dVar.K(aVar);
    }
}
