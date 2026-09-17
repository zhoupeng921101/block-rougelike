package l1;

import a1.b2.c3;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.util.Log;
import com.google.android.gms.common.util.i;
import h1.k1;
import h1.q;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import m1.d;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a {

    /* renamed from: b, reason: collision with root package name */
    private static final Object f4143b = new Object();

    /* renamed from: c, reason: collision with root package name */
    private static volatile a f4144c;

    /* renamed from: a, reason: collision with root package name */
    public final ConcurrentHashMap f4145a = new ConcurrentHashMap();

    private a() {
    }

    public static a a() {
        if (f4144c == null) {
            synchronized (f4143b) {
                try {
                    if (f4144c == null) {
                        f4144c = new a();
                    }
                } finally {
                }
            }
        }
        a aVar = f4144c;
        q.i(aVar);
        return aVar;
    }

    private final boolean d(Context context, String str, Intent intent, ServiceConnection serviceConnection, int i4, boolean z3, Executor executor) {
        ComponentName component = intent.getComponent();
        String d4 = c3.d4(1501);
        if (component != null) {
            String packageName = component.getPackageName();
            "com.google.android.gms".equals(packageName);
            try {
                if ((d.a(context).a(packageName, 0).flags & 2097152) != 0) {
                    Log.w(d4, c3.d4(160));
                    return false;
                }
            } catch (PackageManager.NameNotFoundException unused) {
            }
        }
        if (!e(serviceConnection)) {
            return g(context, intent, serviceConnection, i4, executor);
        }
        ServiceConnection serviceConnection2 = (ServiceConnection) this.f4145a.putIfAbsent(serviceConnection, serviceConnection);
        if (serviceConnection2 != null && serviceConnection != serviceConnection2) {
            Log.w(d4, String.format(c3.d4(28), serviceConnection, str, intent.getAction()));
        }
        try {
            boolean g4 = g(context, intent, serviceConnection, i4, executor);
            if (g4) {
                return g4;
            }
            return false;
        } finally {
            this.f4145a.remove(serviceConnection, serviceConnection);
        }
    }

    private static boolean e(ServiceConnection serviceConnection) {
        return !(serviceConnection instanceof k1);
    }

    private static void f(Context context, ServiceConnection serviceConnection) {
        try {
            context.unbindService(serviceConnection);
        } catch (IllegalArgumentException | IllegalStateException | NoSuchElementException unused) {
        }
    }

    private static final boolean g(Context context, Intent intent, ServiceConnection serviceConnection, int i4, Executor executor) {
        boolean bindService;
        if (executor == null) {
            executor = null;
        }
        if (!i.e() || executor == null) {
            return context.bindService(intent, serviceConnection, i4);
        }
        bindService = context.bindService(intent, i4, executor, serviceConnection);
        return bindService;
    }

    public void b(Context context, ServiceConnection serviceConnection) {
        if (e(serviceConnection)) {
            ConcurrentHashMap concurrentHashMap = this.f4145a;
            if (concurrentHashMap.containsKey(serviceConnection)) {
                try {
                    f(context, (ServiceConnection) concurrentHashMap.get(serviceConnection));
                    return;
                } finally {
                    this.f4145a.remove(serviceConnection);
                }
            }
        }
        f(context, serviceConnection);
    }

    public final boolean c(Context context, String str, Intent intent, ServiceConnection serviceConnection, int i4, Executor executor) {
        return d(context, str, intent, serviceConnection, 4225, true, executor);
    }
}
