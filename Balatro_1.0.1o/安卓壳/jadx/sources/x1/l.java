package x1;

import a1.b2.c3;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l implements x0.b {

    /* renamed from: e, reason: collision with root package name */
    private static x0.b f5116e;

    /* renamed from: a, reason: collision with root package name */
    private final Context f5117a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f5118b;

    /* renamed from: c, reason: collision with root package name */
    private final ScheduledExecutorService f5119c;

    /* renamed from: d, reason: collision with root package name */
    private final ExecutorService f5120d;

    l(Context context) {
        this.f5118b = false;
        ScheduledExecutorService newSingleThreadScheduledExecutor = Executors.newSingleThreadScheduledExecutor();
        this.f5119c = newSingleThreadScheduledExecutor;
        this.f5120d = Executors.newSingleThreadExecutor();
        this.f5117a = context;
        if (this.f5118b) {
            return;
        }
        newSingleThreadScheduledExecutor.scheduleAtFixedRate(new j(this, null), 0L, 86400L, TimeUnit.SECONDS);
        this.f5118b = true;
    }

    static synchronized x0.b d(Context context) {
        x0.b bVar;
        synchronized (l.class) {
            try {
                h1.q.j(context, "Context must not be null");
                if (f5116e == null) {
                    f5116e = new l(context.getApplicationContext());
                }
                bVar = f5116e;
            } catch (Throwable th) {
                throw th;
            }
        }
        return bVar;
    }

    protected static final void f(Context context) {
        if (!g(context).edit().remove("app_set_id").commit()) {
            String valueOf = String.valueOf(context.getPackageName());
            Log.e("AppSet", valueOf.length() != 0 ? "Failed to clear app set ID generated for App ".concat(valueOf) : new String("Failed to clear app set ID generated for App "));
        }
        if (g(context).edit().remove("app_set_id_last_used_time").commit()) {
            return;
        }
        String valueOf2 = String.valueOf(context.getPackageName());
        Log.e("AppSet", valueOf2.length() != 0 ? "Failed to clear app set ID last used time for App ".concat(valueOf2) : new String("Failed to clear app set ID last used time for App "));
    }

    private static final SharedPreferences g(Context context) {
        return context.getSharedPreferences("app_set_id_storage", 0);
    }

    private static final void h(Context context) {
        if (g(context).edit().putLong("app_set_id_last_used_time", com.google.android.gms.common.util.e.b().a()).commit()) {
            return;
        }
        String valueOf = String.valueOf(context.getPackageName());
        Log.e("AppSet", valueOf.length() != 0 ? "Failed to store app set ID last used time for App ".concat(valueOf) : new String("Failed to store app set ID last used time for App "));
        throw new k("Failed to store the app set ID last used time.");
    }

    @Override // x0.b
    public final g2.h a() {
        final g2.i iVar = new g2.i();
        this.f5120d.execute(new Runnable() { // from class: x1.h
            @Override // java.lang.Runnable
            public final void run() {
                l.this.e(iVar);
            }
        });
        return iVar.a();
    }

    protected final long b() {
        long j4 = g(this.f5117a).getLong("app_set_id_last_used_time", -1L);
        if (j4 != -1) {
            return j4 + 33696000000L;
        }
        return -1L;
    }

    final /* synthetic */ void e(g2.i iVar) {
        String string = g(this.f5117a).getString("app_set_id", null);
        long b4 = b();
        if (string == null || com.google.android.gms.common.util.e.b().a() > b4) {
            string = UUID.randomUUID().toString();
            try {
                Context context = this.f5117a;
                boolean commit = g(context).edit().putString("app_set_id", string).commit();
                String d4 = c3.d4(1056);
                if (!commit) {
                    String valueOf = String.valueOf(context.getPackageName());
                    Log.e(d4, valueOf.length() != 0 ? "Failed to store app set ID generated for App ".concat(valueOf) : new String("Failed to store app set ID generated for App "));
                    throw new k("Failed to store the app set ID.");
                }
                h(context);
                Context context2 = this.f5117a;
                if (!g(context2).edit().putLong("app_set_id_creation_time", com.google.android.gms.common.util.e.b().a()).commit()) {
                    String valueOf2 = String.valueOf(context2.getPackageName());
                    Log.e(d4, valueOf2.length() != 0 ? "Failed to store app set ID creation time for App ".concat(valueOf2) : new String("Failed to store app set ID creation time for App "));
                    throw new k("Failed to store the app set ID creation time.");
                }
            } catch (k e4) {
                iVar.b(e4);
                return;
            }
        } else {
            try {
                h(this.f5117a);
            } catch (k e5) {
                iVar.b(e5);
                return;
            }
        }
        iVar.c(new x0.c(string, 1));
    }
}
