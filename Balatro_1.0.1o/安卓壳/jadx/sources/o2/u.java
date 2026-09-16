package o2;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.RemoteException;
import com.android.vending.licensing.ILicensingService;
import com.android.vending.licensing.a;
import java.security.SecureRandom;
import o2.t;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class u implements ServiceConnection {

    /* renamed from: f, reason: collision with root package name */
    private static final SecureRandom f4484f = new SecureRandom();

    /* renamed from: g, reason: collision with root package name */
    private static final g0 f4485g = g0.f(t.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private ILicensingService f4486a;

    /* renamed from: b, reason: collision with root package name */
    private final Context f4487b;

    /* renamed from: c, reason: collision with root package name */
    private final t.a f4488c;

    /* renamed from: d, reason: collision with root package name */
    private Handler f4489d;

    /* renamed from: e, reason: collision with root package name */
    private final String f4490e;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b extends a.AbstractBinderC0038a {
        private b() {
        }

        @Override // com.android.vending.licensing.a
        public void Z(int i4, String str, String str2) {
            u.this.f4488c.a(i4, str, str2);
        }
    }

    public u(Context context, t.a aVar) {
        HandlerThread handlerThread = new HandlerThread("license_checker");
        handlerThread.start();
        this.f4487b = context;
        this.f4490e = context.getPackageName();
        this.f4489d = new Handler(handlerThread.getLooper());
        this.f4488c = aVar;
    }

    private int c() {
        return f4484f.nextInt();
    }

    public synchronized void b() {
        ILicensingService iLicensingService = this.f4486a;
        if (iLicensingService == null) {
            g0 g0Var = f4485g;
            g0Var.h("Binding to licensing service.");
            try {
                if (!this.f4487b.bindService(new Intent("com.android.vending.licensing.ILicensingService").setPackage("com.android.vending"), this, 1)) {
                    g0Var.c("Could not bind to service.");
                    this.f4488c.a(-1, "Binding failed", "");
                }
            } catch (SecurityException e4) {
                f4485g.d("SecurityException", e4);
                this.f4488c.a(-1, String.format("Exception: %s, Message: %s", e4.toString(), e4.getMessage()), "");
            }
            f4485g.h("Binding done.");
        } else {
            try {
                iLicensingService.I(c(), this.f4490e, new b());
            } catch (RemoteException e5) {
                f4485g.d("RemoteException in checkLicense call.", e5);
                this.f4488c.a(-1, String.format("Exception: %s, Message: %s", e5.toString(), e5.getMessage()), "");
            }
        }
    }

    @Override // android.content.ServiceConnection
    public synchronized void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        g0 g0Var = f4485g;
        g0Var.h("onServiceConnected.");
        ILicensingService a4 = ILicensingService.a.a(iBinder);
        this.f4486a = a4;
        try {
            a4.I(c(), this.f4490e, new b());
            g0Var.h("checkLicense call done.");
        } catch (RemoteException e4) {
            f4485g.d("RemoteException in checkLicense call.", e4);
            this.f4488c.a(-1, e4.toString(), "");
        }
    }

    @Override // android.content.ServiceConnection
    public synchronized void onServiceDisconnected(ComponentName componentName) {
        f4485g.h("Service unexpectedly disconnected.");
        this.f4486a = null;
    }
}
