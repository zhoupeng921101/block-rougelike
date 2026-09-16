package c2;

import android.app.Application;
import android.content.Context;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h0 {

    /* renamed from: e, reason: collision with root package name */
    private static final AtomicReference f2113e = new AtomicReference();

    /* renamed from: f, reason: collision with root package name */
    private static boolean f2114f = false;

    /* renamed from: a, reason: collision with root package name */
    private final Application f2115a;

    /* renamed from: b, reason: collision with root package name */
    private final j f2116b;

    /* renamed from: c, reason: collision with root package name */
    private final q1.q f2117c;

    /* renamed from: d, reason: collision with root package name */
    private final com.google.android.gms.games.internal.v2.appshortcuts.f f2118d;

    private h0(Application application, j jVar, q1.q qVar, com.google.android.gms.games.internal.v2.appshortcuts.f fVar) {
        this.f2115a = application;
        this.f2116b = jVar;
        this.f2117c = qVar;
        this.f2118d = fVar;
    }

    public static void a(Context context) {
        h1.q.a(context != null);
        AtomicReference atomicReference = f2113e;
        if (atomicReference.get() == null) {
            synchronized (atomicReference) {
                try {
                    if (atomicReference.get() == null) {
                        Context applicationContext = context.getApplicationContext();
                        Application application = applicationContext != null ? (Application) applicationContext : (Application) context;
                        h0 h0Var = new h0(application, j.a(application), q1.q.a(application), com.google.android.gms.games.internal.v2.appshortcuts.f.b(context));
                        atomicReference.set(h0Var);
                        h0Var.f2118d.a();
                        h0Var.f2116b.b();
                        h0Var.f2117c.b();
                    }
                } finally {
                }
            }
        }
        f2114f = true;
    }

    public static void b() {
        h1.q.l(f2114f, "PlayGamesSdk has not been initialized. Ensure that PlayGamesSdk.initialize() has been called.");
    }

    public static Application c() {
        b();
        return ((h0) f2113e.get()).f2115a;
    }
}
