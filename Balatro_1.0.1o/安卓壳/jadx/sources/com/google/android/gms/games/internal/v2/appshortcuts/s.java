package com.google.android.gms.games.internal.v2.appshortcuts;

import a1.b2.c3;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import c2.j0;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s extends c2.a implements IInterface {
    public s(IBinder iBinder) {
        super(iBinder, c3.d4(572));
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void m0(s1.t tVar, s1.p pVar, List list, List list2) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(tVar);
        j0.c(a4, pVar);
        a4.writeTypedList(list);
        a4.writeTypedList(list2);
        i(3, a4);
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void n0(s1.t tVar, s1.p pVar, i iVar) {
        Parcel a4 = a();
        int i4 = j0.f2132a;
        a4.writeStrongBinder(tVar);
        j0.c(a4, pVar);
        j0.c(a4, iVar);
        i(4, a4);
    }
}
