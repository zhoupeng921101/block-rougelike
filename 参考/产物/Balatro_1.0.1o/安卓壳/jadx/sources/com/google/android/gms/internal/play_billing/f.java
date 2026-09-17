package com.google.android.gms.internal.play_billing;

import android.os.BadParcelableException;
import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f extends Binder implements IInterface {
    protected f(String str) {
        attachInterface(this, str);
    }

    private boolean i(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 > 16777215) {
            return super.onTransact(i4, parcel, parcel2, i5);
        }
        parcel.enforceInterface(getInterfaceDescriptor());
        return false;
    }

    protected abstract boolean a(int i4, Parcel parcel, Parcel parcel2, int i5);

    @Override // android.os.IInterface
    public IBinder asBinder() {
        return this;
    }

    protected void h(Parcel parcel) {
        int i4 = g.f2762a;
        int dataAvail = parcel.dataAvail();
        if (dataAvail <= 0) {
            return;
        }
        throw new BadParcelableException("Parcel data not fully consumed, unread size: " + dataAvail);
    }

    @Override // android.os.Binder
    public boolean onTransact(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i(i4, parcel, parcel2, i5)) {
            return true;
        }
        return a(i4, parcel, parcel2, i5);
    }
}
