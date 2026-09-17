package o2;

import a1.b2.c3;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import java.util.concurrent.Executors;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class v {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4492a = g0.f(v.class.getSimpleName());

    /* renamed from: b, reason: collision with root package name */
    private static ConnectivityManager.NetworkCallback f4493b;

    /* renamed from: c, reason: collision with root package name */
    private static BroadcastReceiver f4494c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends ConnectivityManager.NetworkCallback {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ Context f4495a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ f f4496b;

        a(Context context, f fVar) {
            this.f4495a = context;
            this.f4496b = fVar;
        }

        @Override // android.net.ConnectivityManager.NetworkCallback
        public void onAvailable(Network network) {
            v.f4492a.a("onAvailable");
            v.j(this.f4495a, this.f4496b);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ f f4497e;

        b(f fVar) {
            this.f4497e = fVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f4497e.e();
        }
    }

    static String c(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService("connectivity");
        if (connectivityManager != null) {
            return d(connectivityManager);
        }
        f4492a.a("connectivityManager is null, returning unknown");
        return "unknown";
    }

    private static String d(ConnectivityManager connectivityManager) {
        NetworkCapabilities networkCapabilities;
        try {
            Network activeNetwork = connectivityManager.getActiveNetwork();
            return (activeNetwork == null || (networkCapabilities = connectivityManager.getNetworkCapabilities(activeNetwork)) == null) ? "unknown" : networkCapabilities.hasTransport(1) ? "wifi" : networkCapabilities.hasTransport(0) ? "wwan" : "unknown";
        } catch (Throwable th) {
            f4492a.c(c3.d4(798) + l0.l(th));
            return "unknown";
        }
    }

    private static ConnectivityManager e(Context context) {
        if (context == null) {
            return null;
        }
        Object systemService = context.getApplicationContext().getSystemService("connectivity");
        if (systemService instanceof ConnectivityManager) {
            return (ConnectivityManager) systemService;
        }
        return null;
    }

    static boolean f(Context context) {
        ConnectivityManager e4 = e(context);
        if (e4 == null) {
            f4492a.a(c3.d4(396));
        }
        return h(e4) != i(e4);
    }

    static boolean g(Context context) {
        ConnectivityManager e4 = e(context);
        if (e4 != null) {
            return h(e4);
        }
        f4492a.a(c3.d4(1246));
        return false;
    }

    private static boolean h(ConnectivityManager connectivityManager) {
        try {
            Network activeNetwork = connectivityManager.getActiveNetwork();
            if (activeNetwork == null) {
                f4492a.a("getActiveNetwork is null, returning false");
                return false;
            }
            NetworkCapabilities networkCapabilities = connectivityManager.getNetworkCapabilities(activeNetwork);
            if (networkCapabilities != null) {
                return networkCapabilities.hasCapability(12);
            }
            f4492a.a("getNetworkCapabilities is null, returning false");
            return false;
        } catch (Throwable th) {
            f4492a.c("NetworkMonitor.isConnectedAndroid23AndAbove: " + l0.l(th));
            return false;
        }
    }

    private static boolean i(ConnectivityManager connectivityManager) {
        try {
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
            if (activeNetworkInfo != null) {
                if (activeNetworkInfo.isConnected()) {
                    return true;
                }
            }
            return false;
        } catch (Throwable th) {
            f4492a.c("NetworkMonitor.isConnectedAndroidBelow23: " + l0.l(th));
            return false;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void j(Context context, f fVar) {
        if (!g(context)) {
            f4492a.a(c3.d4(452));
        } else {
            f4492a.a("notifyNetworkChange isConnected = true");
            Executors.newSingleThreadExecutor().execute(new b(fVar));
        }
    }

    private static void k(ConnectivityManager connectivityManager, Context context, f fVar) {
        n(connectivityManager);
        try {
            a aVar = new a(context.getApplicationContext(), fVar);
            f4493b = aVar;
            connectivityManager.registerDefaultNetworkCallback(aVar);
            f4492a.a("NetworkMonitor: registerNetworkChangeListener() - NetworkCallback registered (API 24+)");
        } catch (Throwable th) {
            f4492a.c(c3.d4(305) + l0.l(th));
            f4493b = null;
        }
    }

    static void l(Context context, f fVar) {
        ConnectivityManager e4 = e(context);
        if (e4 == null) {
            return;
        }
        k(e4, context, fVar);
    }

    private static void m(Context context) {
        if (f4494c == null) {
            f4492a.a("NetworkMonitor: BroadcastReceiver not registered, skipping unregister");
            return;
        }
        try {
            context.getApplicationContext().unregisterReceiver(f4494c);
            f4492a.a("NetworkMonitor: unregisterNetworkChangeListener() - BroadcastReceiver unregistered");
        } catch (Throwable th) {
            f4492a.a("NetworkMonitor: Error unregistering BroadcastReceiver: " + l0.l(th));
        }
        f4494c = null;
    }

    private static void n(ConnectivityManager connectivityManager) {
        ConnectivityManager.NetworkCallback networkCallback = f4493b;
        if (networkCallback != null) {
            try {
                connectivityManager.unregisterNetworkCallback(networkCallback);
            } catch (Throwable th) {
                f4492a.a("NetworkMonitor: Error unregistering existing NetworkCallback: " + l0.l(th));
            }
            f4493b = null;
        }
    }

    private static void o(ConnectivityManager connectivityManager) {
        ConnectivityManager.NetworkCallback networkCallback = f4493b;
        if (networkCallback == null) {
            f4492a.a("NetworkMonitor: NetworkCallback not registered, skipping unregister");
            return;
        }
        try {
            connectivityManager.unregisterNetworkCallback(networkCallback);
            f4492a.a("NetworkMonitor: unregisterNetworkChangeListener() - NetworkCallback unregistered");
        } catch (Throwable th) {
            f4492a.c("NetworkMonitor: Error unregistering NetworkCallback: " + l0.l(th));
        }
        f4493b = null;
    }

    static void p(Context context) {
        ConnectivityManager e4 = e(context);
        if (e4 != null) {
            o(e4);
        } else {
            m(context);
        }
    }
}
