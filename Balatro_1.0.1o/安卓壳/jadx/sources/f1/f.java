package f1;

import a1.b2.c3;
import android.app.Application;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import com.android.support.BuildConfig;
import com.google.android.gms.common.api.Status;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicInteger;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class f implements Handler.Callback {

    /* renamed from: p, reason: collision with root package name */
    public static final Status f3235p = new Status(4, c3.d4(1233));

    /* renamed from: q, reason: collision with root package name */
    private static final Status f3236q = new Status(4, c3.d4(696));

    /* renamed from: r, reason: collision with root package name */
    private static final Object f3237r = new Object();

    /* renamed from: s, reason: collision with root package name */
    private static f f3238s;

    /* renamed from: c, reason: collision with root package name */
    private h1.t f3241c;

    /* renamed from: d, reason: collision with root package name */
    private h1.v f3242d;

    /* renamed from: e, reason: collision with root package name */
    private final Context f3243e;

    /* renamed from: f, reason: collision with root package name */
    private final d1.i f3244f;

    /* renamed from: g, reason: collision with root package name */
    private final h1.g0 f3245g;

    /* renamed from: n, reason: collision with root package name */
    private final Handler f3252n;

    /* renamed from: o, reason: collision with root package name */
    private volatile boolean f3253o;

    /* renamed from: a, reason: collision with root package name */
    private long f3239a = 10000;

    /* renamed from: b, reason: collision with root package name */
    private boolean f3240b = false;

    /* renamed from: h, reason: collision with root package name */
    private final AtomicInteger f3246h = new AtomicInteger(1);

    /* renamed from: i, reason: collision with root package name */
    private final AtomicInteger f3247i = new AtomicInteger(0);

    /* renamed from: j, reason: collision with root package name */
    private final Map f3248j = new ConcurrentHashMap(5, 0.75f, 1);

    /* renamed from: k, reason: collision with root package name */
    private v f3249k = null;

    /* renamed from: l, reason: collision with root package name */
    private final Set f3250l = new k.b();

    /* renamed from: m, reason: collision with root package name */
    private final Set f3251m = new k.b();

    private f(Context context, Looper looper, d1.i iVar) {
        this.f3253o = true;
        this.f3243e = context;
        a2.h hVar = new a2.h(looper, this);
        this.f3252n = hVar;
        this.f3244f = iVar;
        this.f3245g = new h1.g0(iVar);
        if (com.google.android.gms.common.util.f.a(context)) {
            this.f3253o = false;
        }
        hVar.sendMessage(hVar.obtainMessage(6));
    }

    public static void a() {
        synchronized (f3237r) {
            try {
                f fVar = f3238s;
                if (fVar != null) {
                    fVar.f3247i.incrementAndGet();
                    Handler handler = fVar.f3252n;
                    handler.sendMessageAtFrontOfQueue(handler.obtainMessage(10));
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static Status g(b bVar, d1.a aVar) {
        return new Status(aVar, "API: " + bVar.b() + " is not available on this device. Connection failed with: " + String.valueOf(aVar));
    }

    private final d0 h(e1.e eVar) {
        Map map = this.f3248j;
        b k4 = eVar.k();
        d0 d0Var = (d0) map.get(k4);
        if (d0Var == null) {
            d0Var = new d0(this, eVar);
            this.f3248j.put(k4, d0Var);
        }
        if (d0Var.b()) {
            this.f3251m.add(k4);
        }
        d0Var.E();
        return d0Var;
    }

    private final h1.v i() {
        if (this.f3242d == null) {
            this.f3242d = h1.u.a(this.f3243e);
        }
        return this.f3242d;
    }

    private final void j() {
        h1.t tVar = this.f3241c;
        if (tVar != null) {
            if (tVar.h0() > 0 || e()) {
                i().b(tVar);
            }
            this.f3241c = null;
        }
    }

    private final void k(g2.i iVar, int i4, e1.e eVar) {
        m0 b4;
        if (i4 == 0 || (b4 = m0.b(this, i4, eVar.k())) == null) {
            return;
        }
        g2.h a4 = iVar.a();
        final Handler handler = this.f3252n;
        handler.getClass();
        a4.d(new Executor() { // from class: f1.x
            @Override // java.util.concurrent.Executor
            public final void execute(Runnable runnable) {
                handler.post(runnable);
            }
        }, b4);
    }

    public static f u(Context context) {
        f fVar;
        synchronized (f3237r) {
            try {
                if (f3238s == null) {
                    f3238s = new f(context.getApplicationContext(), h1.i.b().getLooper(), d1.i.l());
                }
                fVar = f3238s;
            } catch (Throwable th) {
                throw th;
            }
        }
        return fVar;
    }

    public final void A(e1.e eVar, int i4, com.google.android.gms.common.api.internal.a aVar) {
        this.f3252n.sendMessage(this.f3252n.obtainMessage(4, new o0(new w0(i4, aVar), this.f3247i.get(), eVar)));
    }

    public final void B(e1.e eVar, int i4, q qVar, g2.i iVar, o oVar) {
        k(iVar, qVar.d(), eVar);
        this.f3252n.sendMessage(this.f3252n.obtainMessage(4, new o0(new x0(i4, qVar, iVar, oVar), this.f3247i.get(), eVar)));
    }

    final void C(h1.n nVar, int i4, long j4, int i5) {
        this.f3252n.sendMessage(this.f3252n.obtainMessage(18, new n0(nVar, i4, j4, i5)));
    }

    public final void D(d1.a aVar, int i4) {
        if (f(aVar, i4)) {
            return;
        }
        Handler handler = this.f3252n;
        handler.sendMessage(handler.obtainMessage(5, i4, 0, aVar));
    }

    public final void E() {
        Handler handler = this.f3252n;
        handler.sendMessage(handler.obtainMessage(3));
    }

    public final void F(e1.e eVar) {
        Handler handler = this.f3252n;
        handler.sendMessage(handler.obtainMessage(7, eVar));
    }

    public final void b(v vVar) {
        synchronized (f3237r) {
            try {
                if (this.f3249k != vVar) {
                    this.f3249k = vVar;
                    this.f3250l.clear();
                }
                this.f3250l.addAll(vVar.t());
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    final void c(v vVar) {
        synchronized (f3237r) {
            try {
                if (this.f3249k == vVar) {
                    this.f3249k = null;
                    this.f3250l.clear();
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    final boolean e() {
        if (this.f3240b) {
            return false;
        }
        h1.s a4 = h1.r.b().a();
        if (a4 != null && !a4.j0()) {
            return false;
        }
        int a5 = this.f3245g.a(this.f3243e, 203400000);
        return a5 == -1 || a5 == 0;
    }

    final boolean f(d1.a aVar, int i4) {
        return this.f3244f.v(this.f3243e, aVar, i4);
    }

    @Override // android.os.Handler.Callback
    public final boolean handleMessage(Message message) {
        b bVar;
        b bVar2;
        b bVar3;
        b bVar4;
        b bVar5;
        int i4 = message.what;
        d0 d0Var = null;
        switch (i4) {
            case BuildConfig.VERSION_CODE /* 1 */:
                this.f3239a = true == ((Boolean) message.obj).booleanValue() ? 10000L : 300000L;
                this.f3252n.removeMessages(12);
                for (b bVar6 : this.f3248j.keySet()) {
                    Handler handler = this.f3252n;
                    handler.sendMessageDelayed(handler.obtainMessage(12, bVar6), this.f3239a);
                }
                return true;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                h.d.a(message.obj);
                throw null;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                for (d0 d0Var2 : this.f3248j.values()) {
                    d0Var2.D();
                    d0Var2.E();
                }
                return true;
            case 4:
            case 8:
            case 13:
                o0 o0Var = (o0) message.obj;
                d0 d0Var3 = (d0) this.f3248j.get(o0Var.f3290c.k());
                if (d0Var3 == null) {
                    d0Var3 = h(o0Var.f3290c);
                }
                if (!d0Var3.b() || this.f3247i.get() == o0Var.f3289b) {
                    d0Var3.F(o0Var.f3288a);
                } else {
                    o0Var.f3288a.a(f3235p);
                    d0Var3.K();
                }
                return true;
            case 5:
                int i5 = message.arg1;
                d1.a aVar = (d1.a) message.obj;
                Iterator it = this.f3248j.values().iterator();
                while (true) {
                    if (it.hasNext()) {
                        d0 d0Var4 = (d0) it.next();
                        if (d0Var4.s() == i5) {
                            d0Var = d0Var4;
                        }
                    }
                }
                if (d0Var == null) {
                    Log.wtf("GoogleApiManager", c3.d4(838) + i5 + " while trying to fail enqueued calls.", new Exception());
                } else if (aVar.i0() == 13) {
                    d0Var.f(new Status(17, "Error resolution was canceled by the user, original error message: " + this.f3244f.d(aVar.i0()) + c3.d4(936) + aVar.j0()));
                } else {
                    bVar = d0Var.f3220c;
                    d0Var.f(g(bVar, aVar));
                }
                return true;
            case 6:
                if (this.f3243e.getApplicationContext() instanceof Application) {
                    c.c((Application) this.f3243e.getApplicationContext());
                    c.b().a(new y(this));
                    if (!c.b().e(true)) {
                        this.f3239a = 300000L;
                    }
                }
                return true;
            case 7:
                h((e1.e) message.obj);
                return true;
            case 9:
                if (this.f3248j.containsKey(message.obj)) {
                    ((d0) this.f3248j.get(message.obj)).J();
                }
                return true;
            case 10:
                Iterator it2 = this.f3251m.iterator();
                while (it2.hasNext()) {
                    d0 d0Var5 = (d0) this.f3248j.remove((b) it2.next());
                    if (d0Var5 != null) {
                        d0Var5.K();
                    }
                }
                this.f3251m.clear();
                return true;
            case 11:
                if (this.f3248j.containsKey(message.obj)) {
                    ((d0) this.f3248j.get(message.obj)).L();
                }
                return true;
            case 12:
                if (this.f3248j.containsKey(message.obj)) {
                    ((d0) this.f3248j.get(message.obj)).c();
                }
                return true;
            case 14:
                h.d.a(message.obj);
                throw null;
            case 15:
                f0 f0Var = (f0) message.obj;
                Map map = this.f3248j;
                bVar2 = f0Var.f3254a;
                if (map.containsKey(bVar2)) {
                    Map map2 = this.f3248j;
                    bVar3 = f0Var.f3254a;
                    d0.B((d0) map2.get(bVar3), f0Var);
                }
                return true;
            case 16:
                f0 f0Var2 = (f0) message.obj;
                Map map3 = this.f3248j;
                bVar4 = f0Var2.f3254a;
                if (map3.containsKey(bVar4)) {
                    Map map4 = this.f3248j;
                    bVar5 = f0Var2.f3254a;
                    d0.C((d0) map4.get(bVar5), f0Var2);
                }
                return true;
            case 17:
                j();
                return true;
            case 18:
                n0 n0Var = (n0) message.obj;
                if (n0Var.f3286c == 0) {
                    i().b(new h1.t(n0Var.f3285b, Arrays.asList(n0Var.f3284a)));
                } else {
                    h1.t tVar = this.f3241c;
                    if (tVar != null) {
                        List i02 = tVar.i0();
                        if (tVar.h0() != n0Var.f3285b || (i02 != null && i02.size() >= n0Var.f3287d)) {
                            this.f3252n.removeMessages(17);
                            j();
                        } else {
                            this.f3241c.j0(n0Var.f3284a);
                        }
                    }
                    if (this.f3241c == null) {
                        ArrayList arrayList = new ArrayList();
                        arrayList.add(n0Var.f3284a);
                        this.f3241c = new h1.t(n0Var.f3285b, arrayList);
                        Handler handler2 = this.f3252n;
                        handler2.sendMessageDelayed(handler2.obtainMessage(17), n0Var.f3286c);
                    }
                }
                return true;
            case 19:
                this.f3240b = false;
                return true;
            default:
                Log.w("GoogleApiManager", "Unknown message id: " + i4);
                return false;
        }
    }

    public final int l() {
        return this.f3246h.getAndIncrement();
    }

    final d0 t(b bVar) {
        return (d0) this.f3248j.get(bVar);
    }
}
