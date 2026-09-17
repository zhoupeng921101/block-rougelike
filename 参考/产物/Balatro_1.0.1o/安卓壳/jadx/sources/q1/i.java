package q1;

import a1.b2.c3;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;
import c2.j0;
import com.google.android.gms.common.data.DataHolder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i extends c2.a implements j {
    i(IBinder iBinder) {
        super(iBinder, c3.d4(962));
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // q1.j
    public final void K(f fVar, String str, boolean z3, int i4) {
        Parcel a4 = a();
        int i5 = j0.f2132a;
        a4.writeStrongBinder(fVar);
        a4.writeString(str);
        a4.writeInt(z3 ? 1 : 0);
        a4.writeInt(i4);
        i(15001, a4);
    }

    @Override // q1.j
    public final void S(IBinder iBinder, Bundle bundle) {
        Parcel a4 = a();
        a4.writeStrongBinder(iBinder);
        j0.c(a4, bundle);
        i(5005, a4);
    }

    @Override // q1.j
    public final void V(n1.a aVar) {
        Parcel a4 = a();
        j0.c(a4, aVar);
        i(12019, a4);
    }

    @Override // q1.j
    public final void X(f fVar, String str, IBinder iBinder, Bundle bundle) {
        Parcel a4 = a();
        j0.d(a4, fVar);
        a4.writeString(str);
        a4.writeStrongBinder(iBinder);
        j0.c(a4, bundle);
        i(5024, a4);
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // q1.j
    public final void d0(f fVar) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(fVar);
        i(5002, a4);
    }

    @Override // q1.j
    public final Intent f() {
        Parcel h4 = h(9005, a());
        Intent intent = (Intent) j0.b(h4, Intent.CREATOR);
        h4.recycle();
        return intent;
    }

    @Override // q1.j
    public final void g() {
        i(5006, a());
    }

    @Override // q1.j
    public final void k(long j4) {
        Parcel a4 = a();
        a4.writeLong(j4);
        i(5001, a4);
    }

    @Override // q1.j
    public final DataHolder l() {
        Parcel h4 = h(5013, a());
        DataHolder dataHolder = (DataHolder) j0.b(h4, DataHolder.CREATOR);
        h4.recycle();
        return dataHolder;
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // q1.j
    public final void r(f fVar, String str, String str2, v1.h hVar, n1.a aVar) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(fVar);
        a4.writeString(str);
        a4.writeString(str2);
        j0.c(a4, hVar);
        j0.c(a4, aVar);
        i(12033, a4);
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // q1.j
    public final void v(f fVar, String str, v1.h hVar, n1.a aVar) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(fVar);
        a4.writeString(str);
        j0.c(a4, hVar);
        j0.c(a4, aVar);
        i(12007, a4);
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // q1.j
    public final void w(h hVar, long j4) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(hVar);
        a4.writeLong(j4);
        i(15501, a4);
    }
}
