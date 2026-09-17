package f0;

import a1.b2.c3;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.ResolveInfo;
import android.content.pm.ServiceInfo;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import java.util.List;
import w0.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class b extends f0.a {

    /* renamed from: a, reason: collision with root package name */
    private int f3192a = 0;

    /* renamed from: b, reason: collision with root package name */
    private final Context f3193b;

    /* renamed from: c, reason: collision with root package name */
    private w0.a f3194c;

    /* renamed from: d, reason: collision with root package name */
    private ServiceConnection f3195d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: f0.b$b, reason: collision with other inner class name */
    private final class ServiceConnectionC0046b implements ServiceConnection {

        /* renamed from: a, reason: collision with root package name */
        private final c f3196a;

        private ServiceConnectionC0046b(c cVar) {
            if (cVar == null) {
                throw new RuntimeException("Please specify a listener to know when setup is done.");
            }
            this.f3196a = cVar;
        }

        @Override // android.content.ServiceConnection
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            g0.a.a("InstallReferrerClient", c3.d4(1040));
            b.this.f3194c = a.AbstractBinderC0080a.a(iBinder);
            b.this.f3192a = 2;
            this.f3196a.a(0);
        }

        @Override // android.content.ServiceConnection
        public void onServiceDisconnected(ComponentName componentName) {
            g0.a.b(c3.d4(1331), "Install Referrer service disconnected.");
            b.this.f3194c = null;
            b.this.f3192a = 0;
            this.f3196a.b();
        }
    }

    public b(Context context) {
        this.f3193b = context.getApplicationContext();
    }

    private boolean h() {
        return this.f3193b.getPackageManager().getPackageInfo("com.android.vending", 128).versionCode >= 80837300;
    }

    @Override // f0.a
    public void a() {
        this.f3192a = 3;
        if (this.f3195d != null) {
            g0.a.a(c3.d4(1376), "Unbinding from service.");
            this.f3193b.unbindService(this.f3195d);
            this.f3195d = null;
        }
        this.f3194c = null;
    }

    @Override // f0.a
    public d b() {
        if (!c()) {
            throw new IllegalStateException("Service not connected. Please start a connection before using the service.");
        }
        Bundle bundle = new Bundle();
        bundle.putString(c3.d4(486), this.f3193b.getPackageName());
        try {
            return new d(this.f3194c.Q(bundle));
        } catch (RemoteException e4) {
            g0.a.b("InstallReferrerClient", "RemoteException getting install referrer information");
            this.f3192a = 0;
            throw e4;
        }
    }

    @Override // f0.a
    public boolean c() {
        return (this.f3192a != 2 || this.f3194c == null || this.f3195d == null) ? false : true;
    }

    @Override // f0.a
    public void e(c cVar) {
        ServiceInfo serviceInfo;
        if (c()) {
            g0.a.a("InstallReferrerClient", c3.d4(24));
            cVar.a(0);
            return;
        }
        int i4 = this.f3192a;
        if (i4 == 1) {
            g0.a.b("InstallReferrerClient", "Client is already in the process of connecting to the service.");
            cVar.a(3);
            return;
        }
        if (i4 == 3) {
            g0.a.b("InstallReferrerClient", "Client was already closed and can't be reused. Please create another instance.");
            cVar.a(3);
            return;
        }
        g0.a.a("InstallReferrerClient", c3.d4(1231));
        Intent intent = new Intent("com.google.android.finsky.BIND_GET_INSTALL_REFERRER_SERVICE");
        String d4 = c3.d4(1074);
        intent.setComponent(new ComponentName(d4, "com.google.android.finsky.externalreferrer.GetInstallReferrerService"));
        List<ResolveInfo> queryIntentServices = this.f3193b.getPackageManager().queryIntentServices(intent, 0);
        if (queryIntentServices == null || queryIntentServices.isEmpty() || (serviceInfo = queryIntentServices.get(0).serviceInfo) == null) {
            this.f3192a = 0;
            g0.a.a("InstallReferrerClient", c3.d4(1332));
            cVar.a(2);
            return;
        }
        String str = serviceInfo.packageName;
        String str2 = serviceInfo.name;
        if (!d4.equals(str) || str2 == null || !h()) {
            g0.a.b("InstallReferrerClient", "Play Store missing or incompatible. Version 8.3.73 or later required.");
            this.f3192a = 0;
            cVar.a(2);
            return;
        }
        Intent intent2 = new Intent(intent);
        ServiceConnectionC0046b serviceConnectionC0046b = new ServiceConnectionC0046b(cVar);
        this.f3195d = serviceConnectionC0046b;
        try {
            if (this.f3193b.bindService(intent2, serviceConnectionC0046b, 1)) {
                g0.a.a("InstallReferrerClient", "Service was bonded successfully.");
                return;
            }
            g0.a.b("InstallReferrerClient", c3.d4(1075));
            this.f3192a = 0;
            cVar.a(1);
        } catch (SecurityException unused) {
            g0.a.b("InstallReferrerClient", c3.d4(1232));
            this.f3192a = 0;
            cVar.a(4);
        }
    }
}
