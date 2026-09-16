package c2;

import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements IInterface {

    /* renamed from: a, reason: collision with root package name */
    private final IBinder f2065a;

    /* renamed from: b, reason: collision with root package name */
    private final String f2066b;

    protected a(IBinder iBinder, String str) {
        this.f2065a = iBinder;
        this.f2066b = str;
    }

    protected final Parcel a() {
        Parcel obtain = Parcel.obtain();
        obtain.writeInterfaceToken(this.f2066b);
        return obtain;
    }

    @Override // android.os.IInterface
    public final IBinder asBinder() {
        return this.f2065a;
    }

    protected final Parcel h(int i4, Parcel parcel) {
        Parcel obtain = Parcel.obtain();
        try {
            try {
                this.f2065a.transact(i4, parcel, obtain, 0);
                obtain.readException();
                return obtain;
            } catch (RuntimeException e4) {
                obtain.recycle();
                throw e4;
            }
        } finally {
            parcel.recycle();
        }
    }

    protected final void i(int i4, Parcel parcel) {
        Parcel obtain = Parcel.obtain();
        try {
            this.f2065a.transact(i4, parcel, obtain, 0);
            obtain.readException();
        } finally {
            parcel.recycle();
            obtain.recycle();
        }
    }
}
