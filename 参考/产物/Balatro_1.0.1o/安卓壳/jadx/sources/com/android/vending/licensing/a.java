package com.android.vending.licensing;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface a extends IInterface {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: com.android.vending.licensing.a$a, reason: collision with other inner class name */
    public static abstract class AbstractBinderC0038a extends Binder implements a {
        public AbstractBinderC0038a() {
            attachInterface(this, "com.android.vending.licensing.ILicenseResultListener");
        }

        @Override // android.os.IInterface
        public IBinder asBinder() {
            return this;
        }

        @Override // android.os.Binder
        public boolean onTransact(int i4, Parcel parcel, Parcel parcel2, int i5) {
            if (i4 == 1) {
                parcel.enforceInterface("com.android.vending.licensing.ILicenseResultListener");
                Z(parcel.readInt(), parcel.readString(), parcel.readString());
                return true;
            }
            if (i4 != 1598968902) {
                return super.onTransact(i4, parcel, parcel2, i5);
            }
            parcel2.writeString("com.android.vending.licensing.ILicenseResultListener");
            return true;
        }
    }

    void Z(int i4, String str, String str2);
}
