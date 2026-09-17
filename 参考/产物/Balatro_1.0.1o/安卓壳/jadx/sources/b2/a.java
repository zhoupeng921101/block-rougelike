package b2;

import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements IInterface {

    /* renamed from: a, reason: collision with root package name */
    private final IBinder f1798a;

    /* renamed from: b, reason: collision with root package name */
    private final String f1799b;

    protected a(IBinder iBinder, String str) {
        this.f1798a = iBinder;
        this.f1799b = str;
    }

    protected final Parcel a(int i4, Parcel parcel) {
        Parcel obtain = Parcel.obtain();
        try {
            try {
                this.f1798a.transact(i4, parcel, obtain, 0);
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

    @Override // android.os.IInterface
    public final IBinder asBinder() {
        return this.f1798a;
    }

    protected final Parcel h() {
        Parcel obtain = Parcel.obtain();
        obtain.writeInterfaceToken(this.f1799b);
        return obtain;
    }
}
