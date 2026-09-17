package o2;

import a1.b2.c3;
import android.content.Context;
import java.util.HashMap;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class f {

    /* renamed from: e, reason: collision with root package name */
    private static final g0 f4358e = g0.f(f.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    final Context f4359a;

    /* renamed from: b, reason: collision with root package name */
    private x f4360b;

    /* renamed from: c, reason: collision with root package name */
    private k0 f4361c;

    /* renamed from: d, reason: collision with root package name */
    final Runnable f4362d = new b();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends HashMap {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ Boolean f4363e;

        a(Boolean bool) {
            this.f4363e = bool;
            bool.booleanValue();
            put("limit_data_sharing", bool);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            if (!e0.r().E()) {
                f.f4358e.a("Singular is not initialized!");
                return;
            }
            if (!v.g(f.this.f4359a)) {
                f.f4358e.a(c3.d4(164));
                return;
            }
            try {
                String peek = f.this.f4360b.peek();
                if (peek == null) {
                    f.f4358e.a("Queue is empty");
                    return;
                }
                i h4 = i.h(peek);
                f.f4358e.b("api = %s", h4.getClass().getName());
                if (h4.a(e0.r())) {
                    l0.h0(f.this.f4359a, Long.toString(h4.e()));
                    f.this.f4360b.remove();
                    f.this.e();
                }
            } catch (Throwable th) {
                f.f4358e.e("IOException in processing an event: %s", th.getMessage());
            }
        }
    }

    public f(k0 k0Var, Context context, x xVar) {
        this.f4359a = context;
        this.f4360b = xVar;
        if (xVar == null) {
            f4358e.c("ApiManager initialization failed - queue == null.");
            return;
        }
        g0 g0Var = f4358e;
        g0Var.b("Queue: %s", xVar.getClass().getSimpleName());
        if (k0Var == null) {
            g0Var.c("CRITICAL: ApiManager initialization failed - workerThread is null. ApiManager cannot function.");
        } else {
            this.f4361c = k0Var;
            k0Var.start();
        }
    }

    static void d(i iVar) {
        try {
            e0 r3 = e0.r();
            JSONObject o3 = r3.o();
            if (o3.length() != 0) {
                iVar.put("global_properties", o3.toString());
            }
            Boolean u3 = r3.u();
            if (u3 != null) {
                iVar.put("data_sharing_options", new JSONObject(new a(u3)).toString());
            }
        } catch (Throwable th) {
            f4358e.c("caught exception during enriching request with SingularInstance " + l0.l(th));
        }
    }

    void c(i iVar) {
        if (iVar != null) {
            try {
                if (this.f4360b != null) {
                    if (!(iVar instanceof d) && !(iVar instanceof e)) {
                        iVar.put("event_index", String.valueOf(l0.B(this.f4359a)));
                    }
                    iVar.put("singular_install_id", l0.J(this.f4359a).toString());
                    d(iVar);
                    this.f4360b.a(iVar.n());
                    e();
                    return;
                }
            } catch (IndexOutOfBoundsException unused) {
                return;
            } catch (Throwable th) {
                f4358e.d("error in enqueue()", th);
                return;
            }
        }
        g0 g0Var = f4358e;
        StringBuilder sb = new StringBuilder();
        sb.append("Cannot enqueue API: ");
        sb.append(iVar == null ? "api == null " : "");
        sb.append(this.f4360b == null ? "queue == null" : "");
        g0Var.c(sb.toString());
    }

    void e() {
        k0 k0Var = this.f4361c;
        if (k0Var == null) {
            f4358e.c(c3.d4(1238));
        } else {
            k0Var.b().removeCallbacksAndMessages(null);
            this.f4361c.c(this.f4362d);
        }
    }
}
