package com.android.vending.licensing;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface ILicensingService extends IInterface {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class a extends Binder implements ILicensingService {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: com.android.vending.licensing.ILicensingService$a$a, reason: collision with other inner class name */
        private static class C0037a implements ILicensingService {

            /* renamed from: a, reason: collision with root package name */
            private IBinder f2478a;

            C0037a(IBinder iBinder) {
                this.f2478a = iBinder;
            }

            @Override // com.android.vending.licensing.ILicensingService
            public void I(long j4, String str, com.android.vending.licensing.a aVar) {
                Parcel obtain = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.android.vending.licensing.ILicensingService");
                    obtain.writeLong(j4);
                    obtain.writeString(str);
                    obtain.writeStrongBinder(aVar != null ? aVar.asBinder() : null);
                    this.f2478a.transact(1, obtain, null, 1);
                    obtain.recycle();
                } catch (Throwable th) {
                    obtain.recycle();
                    throw th;
                }
            }

            @Override // android.os.IInterface
            public IBinder asBinder() {
                return this.f2478a;
            }
        }

        public static ILicensingService a(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.android.vending.licensing.ILicensingService");
            return (queryLocalInterface == null || !(queryLocalInterface instanceof ILicensingService)) ? new C0037a(iBinder) : (ILicensingService) queryLocalInterface;
        }
    }

    void I(long j4, String str, com.android.vending.licensing.a aVar);
}
