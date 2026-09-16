package h1;

import a1.b2.c3;
import android.content.Context;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.Looper;
import java.util.HashMap;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j1 extends i {

    /* renamed from: g, reason: collision with root package name */
    private final HashMap f3535g = new HashMap();

    /* renamed from: h, reason: collision with root package name */
    private final Context f3536h;

    /* renamed from: i, reason: collision with root package name */
    private volatile Handler f3537i;

    /* renamed from: j, reason: collision with root package name */
    private final i1 f3538j;

    /* renamed from: k, reason: collision with root package name */
    private final l1.a f3539k;

    /* renamed from: l, reason: collision with root package name */
    private final long f3540l;

    /* renamed from: m, reason: collision with root package name */
    private final long f3541m;

    /* renamed from: n, reason: collision with root package name */
    private volatile Executor f3542n;

    j1(Context context, Looper looper, Executor executor) {
        i1 i1Var = new i1(this, null);
        this.f3538j = i1Var;
        this.f3536h = context.getApplicationContext();
        this.f3537i = new b2.p(looper, i1Var);
        this.f3539k = l1.a.a();
        this.f3540l = 5000L;
        this.f3541m = 300000L;
        this.f3542n = executor;
    }

    @Override // h1.i
    protected final d1.a c(g1 g1Var, ServiceConnection serviceConnection, String str, Executor executor) {
        d1.a aVar;
        q.j(serviceConnection, "ServiceConnection must not be null");
        HashMap hashMap = this.f3535g;
        synchronized (hashMap) {
            try {
                h1 h1Var = (h1) hashMap.get(g1Var);
                if (executor == null) {
                    executor = this.f3542n;
                }
                if (h1Var == null) {
                    h1Var = new h1(this, g1Var);
                    h1Var.b(serviceConnection, serviceConnection, str);
                    aVar = h1Var.j(str, executor);
                    hashMap.put(g1Var, h1Var);
                } else {
                    this.f3537i.removeMessages(0, g1Var);
                    if (h1Var.f(serviceConnection)) {
                        String obj = g1Var.toString();
                        StringBuilder sb = new StringBuilder(obj.length() + 81);
                        sb.append("Trying to bind a GmsServiceConnection that was already connected before.  config=");
                        sb.append(obj);
                        throw new IllegalStateException(sb.toString());
                    }
                    h1Var.b(serviceConnection, serviceConnection, str);
                    int e4 = h1Var.e();
                    if (e4 == 1) {
                        serviceConnection.onServiceConnected(h1Var.i(), h1Var.h());
                    } else if (e4 == 2) {
                        aVar = h1Var.j(str, executor);
                    }
                    aVar = null;
                }
                if (h1Var.d()) {
                    return d1.a.f3079j;
                }
                if (aVar == null) {
                    aVar = new d1.a(-1);
                }
                return aVar;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // h1.i
    protected final void e(g1 g1Var, ServiceConnection serviceConnection, String str) {
        q.j(serviceConnection, "ServiceConnection must not be null");
        HashMap hashMap = this.f3535g;
        String d4 = c3.d4(75);
        synchronized (hashMap) {
            try {
                h1 h1Var = (h1) hashMap.get(g1Var);
                if (h1Var == null) {
                    String obj = g1Var.toString();
                    StringBuilder sb = new StringBuilder(obj.length() + 50);
                    sb.append(d4);
                    sb.append(obj);
                    throw new IllegalStateException(sb.toString());
                }
                if (!h1Var.f(serviceConnection)) {
                    String obj2 = g1Var.toString();
                    StringBuilder sb2 = new StringBuilder(obj2.length() + 76);
                    sb2.append("Trying to unbind a GmsServiceConnection  that was not bound before.  config=");
                    sb2.append(obj2);
                    throw new IllegalStateException(sb2.toString());
                }
                h1Var.c(serviceConnection, str);
                if (h1Var.g()) {
                    this.f3537i.sendMessageDelayed(this.f3537i.obtainMessage(0, g1Var), this.f3540l);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    final /* synthetic */ HashMap f() {
        return this.f3535g;
    }

    final /* synthetic */ Context g() {
        return this.f3536h;
    }

    final /* synthetic */ Handler h() {
        return this.f3537i;
    }

    final /* synthetic */ l1.a i() {
        return this.f3539k;
    }

    final /* synthetic */ long j() {
        return this.f3541m;
    }
}
