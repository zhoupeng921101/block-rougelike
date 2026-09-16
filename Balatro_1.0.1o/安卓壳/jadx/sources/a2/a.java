package a2;

import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements IInterface {

    /* renamed from: a, reason: collision with root package name */
    private final IBinder f11a;

    /* renamed from: b, reason: collision with root package name */
    private final String f12b;

    protected a(IBinder iBinder, String str) {
        this.f11a = iBinder;
        this.f12b = str;
    }

    protected final Parcel a() {
        Parcel obtain = Parcel.obtain();
        obtain.writeInterfaceToken(this.f12b);
        return obtain;
    }

    @Override // android.os.IInterface
    public final IBinder asBinder() {
        return this.f11a;
    }

    protected final void h(int i4, Parcel parcel) {
        Parcel obtain = Parcel.obtain();
        try {
            this.f11a.transact(i4, parcel, obtain, 0);
            obtain.readException();
        } finally {
            parcel.recycle();
            obtain.recycle();
        }
    }

    protected final void i(int i4, Parcel parcel) {
        try {
            this.f11a.transact(1, parcel, null, 1);
        } finally {
            parcel.recycle();
        }
    }
}
