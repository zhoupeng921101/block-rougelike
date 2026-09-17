package o2;

import a1.b2.c3;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class s {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4479a = g0.f(s.class.getSimpleName());

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private interface b extends IInterface {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static abstract class a extends Binder implements b {

            /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
            /* renamed from: o2.s$b$a$a, reason: collision with other inner class name */
            private static class C0070a implements b {

                /* renamed from: a, reason: collision with root package name */
                private IBinder f4480a;

                C0070a(IBinder iBinder) {
                    this.f4480a = iBinder;
                }

                @Override // android.os.IInterface
                public IBinder asBinder() {
                    return this.f4480a;
                }

                @Override // o2.s.b
                public String getId() {
                    Parcel obtain = Parcel.obtain();
                    Parcel obtain2 = Parcel.obtain();
                    try {
                        obtain.writeInterfaceToken("com.google.android.gms.ads.identifier.internal.IAdvertisingIdService");
                        this.f4480a.transact(1, obtain, obtain2, 0);
                        obtain2.readException();
                        return obtain2.readString();
                    } finally {
                        obtain2.recycle();
                        obtain.recycle();
                    }
                }
            }

            public static b a(IBinder iBinder) {
                if (iBinder == null) {
                    s.f4479a.a(c3.d4(1004));
                    return null;
                }
                IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.ads.identifier.internal.IAdvertisingIdService");
                return (queryLocalInterface == null || !(queryLocalInterface instanceof b)) ? new C0070a(iBinder) : (b) queryLocalInterface;
            }
        }

        String getId();
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class c implements ServiceConnection {

        /* renamed from: a, reason: collision with root package name */
        boolean f4481a;

        /* renamed from: b, reason: collision with root package name */
        private final BlockingQueue f4482b;

        private c() {
            this.f4481a = false;
            this.f4482b = new LinkedBlockingQueue();
        }

        public IBinder a() {
            if (this.f4481a) {
                throw new IllegalStateException();
            }
            this.f4481a = true;
            return (IBinder) this.f4482b.take();
        }

        @Override // android.content.ServiceConnection
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            try {
                this.f4482b.put(iBinder);
            } catch (InterruptedException e4) {
                s.f4479a.a("Interrupted while adding binder to queue: " + l0.l(e4));
            }
        }

        @Override // android.content.ServiceConnection
        public void onServiceDisconnected(ComponentName componentName) {
        }
    }

    public static String b(Context context) {
        try {
            String c4 = c(context);
            f4479a.a("Got AIFA by querying Google Play service");
            return c4;
        } catch (Throwable unused) {
            f4479a.a("Could not determine AIFA");
            return null;
        }
    }

    static String c(Context context) {
        c cVar = new c();
        Intent intent = new Intent("com.google.android.gms.ads.identifier.service.START");
        intent.setPackage("com.google.android.gms");
        if (!context.bindService(intent, cVar, 1)) {
            return "";
        }
        try {
            return b.a.a(cVar.a()).getId();
        } catch (Throwable th) {
            try {
                f4479a.c("Failed to query advertising ID from service: " + l0.l(th));
                return "";
            } finally {
                context.unbindService(cVar);
            }
        }
    }
}
