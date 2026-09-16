package h1;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.StrictMode;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h1 implements ServiceConnection, k1 {

    /* renamed from: a, reason: collision with root package name */
    private final Map f3515a;

    /* renamed from: b, reason: collision with root package name */
    private int f3516b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f3517c;

    /* renamed from: d, reason: collision with root package name */
    private IBinder f3518d;

    /* renamed from: e, reason: collision with root package name */
    private final g1 f3519e;

    /* renamed from: f, reason: collision with root package name */
    private ComponentName f3520f;

    /* renamed from: g, reason: collision with root package name */
    final /* synthetic */ j1 f3521g;

    public h1(j1 j1Var, g1 g1Var) {
        Objects.requireNonNull(j1Var);
        this.f3521g = j1Var;
        this.f3519e = g1Var;
        this.f3515a = new HashMap();
        this.f3516b = 2;
    }

    public final void a(String str) {
        g1 g1Var = this.f3519e;
        j1 j1Var = this.f3521g;
        j1Var.h().removeMessages(1, g1Var);
        j1Var.i().b(j1Var.g(), this);
        this.f3517c = false;
        this.f3516b = 2;
    }

    public final void b(ServiceConnection serviceConnection, ServiceConnection serviceConnection2, String str) {
        this.f3515a.put(serviceConnection, serviceConnection2);
    }

    public final void c(ServiceConnection serviceConnection, String str) {
        this.f3515a.remove(serviceConnection);
    }

    public final boolean d() {
        return this.f3517c;
    }

    public final int e() {
        return this.f3516b;
    }

    public final boolean f(ServiceConnection serviceConnection) {
        return this.f3515a.containsKey(serviceConnection);
    }

    public final boolean g() {
        return this.f3515a.isEmpty();
    }

    public final IBinder h() {
        return this.f3518d;
    }

    public final ComponentName i() {
        return this.f3520f;
    }

    final /* synthetic */ d1.a j(String str, Executor executor) {
        j1 j1Var;
        l1.a i4;
        Context g4;
        g1 g1Var;
        try {
            Intent a4 = v0.a(this.f3521g.g(), this.f3519e);
            this.f3516b = 3;
            StrictMode.VmPolicy a5 = com.google.android.gms.common.util.p.a();
            try {
                j1Var = this.f3521g;
                i4 = j1Var.i();
                g4 = j1Var.g();
                g1Var = this.f3519e;
            } catch (Throwable th) {
                th = th;
            }
            try {
                boolean c4 = i4.c(g4, str, a4, this, 4225, executor);
                this.f3517c = c4;
                if (c4) {
                    j1Var.h().sendMessageDelayed(j1Var.h().obtainMessage(1, g1Var), j1Var.j());
                    d1.a aVar = d1.a.f3079j;
                    StrictMode.setVmPolicy(a5);
                    return aVar;
                }
                this.f3516b = 2;
                try {
                    j1Var.i().b(j1Var.g(), this);
                } catch (IllegalArgumentException unused) {
                }
                d1.a aVar2 = new d1.a(16);
                StrictMode.setVmPolicy(a5);
                return aVar2;
            } catch (Throwable th2) {
                th = th2;
                Throwable th3 = th;
                StrictMode.setVmPolicy(a5);
                throw th3;
            }
        } catch (t0 e4) {
            return e4.f3585e;
        }
    }

    @Override // android.content.ServiceConnection
    public final void onBindingDied(ComponentName componentName) {
        onServiceDisconnected(componentName);
    }

    @Override // android.content.ServiceConnection
    public final void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        j1 j1Var = this.f3521g;
        synchronized (j1Var.f()) {
            try {
                j1Var.h().removeMessages(1, this.f3519e);
                this.f3518d = iBinder;
                this.f3520f = componentName;
                Iterator it = this.f3515a.values().iterator();
                while (it.hasNext()) {
                    ((ServiceConnection) it.next()).onServiceConnected(componentName, iBinder);
                }
                this.f3516b = 1;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // android.content.ServiceConnection
    public final void onServiceDisconnected(ComponentName componentName) {
        j1 j1Var = this.f3521g;
        synchronized (j1Var.f()) {
            try {
                j1Var.h().removeMessages(1, this.f3519e);
                this.f3518d = null;
                this.f3520f = componentName;
                Iterator it = this.f3515a.values().iterator();
                while (it.hasNext()) {
                    ((ServiceConnection) it.next()).onServiceDisconnected(componentName);
                }
                this.f3516b = 2;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
