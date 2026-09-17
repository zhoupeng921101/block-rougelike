package w0;

import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import h0.b;
import h0.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public interface a extends IInterface {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: w0.a$a, reason: collision with other inner class name */
    public static abstract class AbstractBinderC0080a extends b implements a {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: w0.a$a$a, reason: collision with other inner class name */
        public static class C0081a extends h0.a implements a {
            C0081a(IBinder iBinder) {
                super(iBinder);
            }

            @Override // w0.a
            public final Bundle Q(Bundle bundle) {
                Parcel a4 = a();
                c.b(a4, bundle);
                Parcel h4 = h(a4);
                Bundle bundle2 = (Bundle) c.a(h4, Bundle.CREATOR);
                h4.recycle();
                return bundle2;
            }
        }

        public static a a(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.finsky.externalreferrer.IGetInstallReferrerService");
            return queryLocalInterface instanceof a ? (a) queryLocalInterface : new C0081a(iBinder);
        }
    }

    Bundle Q(Bundle bundle);
}
