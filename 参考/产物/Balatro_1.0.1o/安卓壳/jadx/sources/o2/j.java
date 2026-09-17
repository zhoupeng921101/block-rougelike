package o2;

import a1.b2.c3;
import android.content.Context;
import android.content.SharedPreferences;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class j {

    /* renamed from: j, reason: collision with root package name */
    private static final g0 f4389j = g0.f(j.class.getSimpleName());

    /* renamed from: k, reason: collision with root package name */
    private static j f4390k;

    /* renamed from: c, reason: collision with root package name */
    private Context f4393c;

    /* renamed from: d, reason: collision with root package name */
    private long f4394d;

    /* renamed from: e, reason: collision with root package name */
    private e f4395e;

    /* renamed from: f, reason: collision with root package name */
    private f f4396f;

    /* renamed from: i, reason: collision with root package name */
    private k f4399i;

    /* renamed from: a, reason: collision with root package name */
    private Semaphore f4391a = new Semaphore(1, true);

    /* renamed from: b, reason: collision with root package name */
    private Semaphore f4392b = new Semaphore(1, true);

    /* renamed from: g, reason: collision with root package name */
    private String[] f4397g = {"ad_platform", "ad_currency", "pcc"};

    /* renamed from: h, reason: collision with root package name */
    private Map f4398h = new ConcurrentHashMap();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements e {
        a() {
        }

        @Override // o2.j.e
        public boolean a(i iVar) {
            try {
                o2.f.d(iVar);
                return iVar.a(e0.r());
            } catch (IOException e4) {
                j.f4389j.c(l0.l(e4));
                return false;
            } catch (Throwable th) {
                j.f4389j.c(l0.l(th));
                return false;
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements f {
        b() {
        }

        @Override // o2.j.f
        public void a(i iVar) {
            e0.r().k().c(iVar);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ i f4402e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ boolean f4403f;

        /* renamed from: g, reason: collision with root package name */
        final /* synthetic */ boolean f4404g;

        c(i iVar, boolean z3, boolean z4) {
            this.f4402e = iVar;
            this.f4403f = z3;
            this.f4404g = z4;
        }

        @Override // java.lang.Runnable
        public void run() {
            j.f4389j.a("addToBatch api: " + this.f4402e.n());
            if (!this.f4403f || !this.f4402e.l()) {
                j.f4389j.a("addToBatch: no need to batch: batching enabled: " + this.f4403f + " is Admon event: " + this.f4402e.l());
                j.this.f4396f.a(this.f4402e);
                return;
            }
            j.f4389j.a("addToBatch: event needs to be batched");
            try {
                j.this.o(this.f4402e);
            } catch (Throwable th) {
                j.f4389j.a("addToBatch: exception: " + th.getMessage());
                if (this.f4404g) {
                    return;
                }
                j.this.f4396f.a(this.f4402e);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements Runnable {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ i f4407e;

            /* renamed from: f, reason: collision with root package name */
            final /* synthetic */ String f4408f;

            /* renamed from: g, reason: collision with root package name */
            final /* synthetic */ ExecutorService f4409g;

            /* renamed from: h, reason: collision with root package name */
            final /* synthetic */ AtomicInteger f4410h;

            /* renamed from: i, reason: collision with root package name */
            final /* synthetic */ Semaphore f4411i;

            /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
            /* renamed from: o2.j$d$a$a, reason: collision with other inner class name */
            class RunnableC0068a implements Runnable {
                RunnableC0068a() {
                }

                @Override // java.lang.Runnable
                public void run() {
                    try {
                        j.this.f4398h.remove(a.this.f4408f);
                        j.this.f4399i.a(a.this.f4408f);
                        a.this.f4410h.incrementAndGet();
                    } finally {
                        try {
                        } finally {
                        }
                    }
                }
            }

            a(i iVar, String str, ExecutorService executorService, AtomicInteger atomicInteger, Semaphore semaphore) {
                this.f4407e = iVar;
                this.f4408f = str;
                this.f4409g = executorService;
                this.f4410h = atomicInteger;
                this.f4411i = semaphore;
            }

            @Override // java.lang.Runnable
            public void run() {
                boolean a4 = j.this.f4395e.a(this.f4407e);
                String d4 = c3.d4(1338);
                if (a4) {
                    j.f4389j.a(d4 + this.f4408f + " is successful");
                    this.f4409g.execute(new RunnableC0068a());
                    return;
                }
                j.f4389j.a(d4 + this.f4408f + c3.d4(899));
                this.f4411i.release();
            }
        }

        d() {
        }

        /* JADX WARN: Finally extract failed */
        /* JADX WARN: Removed duplicated region for block: B:16:0x00b9 A[Catch: all -> 0x0096, TryCatch #2 {all -> 0x0096, blocks: (B:4:0x0021, B:5:0x0076, B:7:0x0079, B:9:0x0090, B:11:0x0099, B:14:0x009c, B:16:0x00b9, B:18:0x00ca, B:21:0x00e8, B:23:0x00ff, B:24:0x0101, B:30:0x013d, B:34:0x0167, B:35:0x0169, B:36:0x017d, B:44:0x017a, B:47:0x018b, B:48:0x0194, B:51:0x0016, B:3:0x0002, B:43:0x016f, B:26:0x012f, B:33:0x014f), top: B:2:0x0002, inners: #1, #3, #4, #5 }] */
        /* JADX WARN: Removed duplicated region for block: B:7:0x0079 A[Catch: all -> 0x0096, TryCatch #2 {all -> 0x0096, blocks: (B:4:0x0021, B:5:0x0076, B:7:0x0079, B:9:0x0090, B:11:0x0099, B:14:0x009c, B:16:0x00b9, B:18:0x00ca, B:21:0x00e8, B:23:0x00ff, B:24:0x0101, B:30:0x013d, B:34:0x0167, B:35:0x0169, B:36:0x017d, B:44:0x017a, B:47:0x018b, B:48:0x0194, B:51:0x0016, B:3:0x0002, B:43:0x016f, B:26:0x012f, B:33:0x014f), top: B:2:0x0002, inners: #1, #3, #4, #5 }] */
        @Override // java.lang.Runnable
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        public void run() {
            /*
                Method dump skipped, instructions count: 429
                To view this dump add '--comments-level debug' option
            */
            throw new UnsupportedOperationException("Method not decompiled: o2.j.d.run():void");
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface e {
        boolean a(i iVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface f {
        void a(i iVar);
    }

    private j() {
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Multi-variable type inference failed */
    public synchronized void o(i iVar) {
        try {
            this.f4391a.acquire();
        } catch (InterruptedException e4) {
            f4389j.c(l0.l(e4));
        }
        long y3 = l0.y();
        try {
            String u3 = u(iVar);
            g0 g0Var = f4389j;
            g0Var.a("batchEvent: " + iVar.n());
            g0Var.a("batchEvent: key: " + u3);
            JSONObject jSONObject = new JSONObject((String) iVar.get("e"));
            if (this.f4398h.containsKey(u3)) {
                i iVar2 = (i) this.f4398h.get(u3);
                JSONObject jSONObject2 = new JSONObject((String) iVar2.get("e"));
                double d4 = jSONObject2.getDouble("r") + jSONObject.getDouble("r");
                double d5 = jSONObject2.getDouble("ad_revenue") + jSONObject.getDouble("ad_revenue");
                int i4 = jSONObject2.getInt("admon_count") + 1;
                jSONObject2.put("r", d4);
                jSONObject2.put("ad_revenue", d5);
                jSONObject2.put("admon_count", i4);
                jSONObject2.put("last_update_timestamp", y3);
                iVar2.put("e", jSONObject2.toString());
                g0Var.a("batchEvent: added to existing event: " + iVar2.n());
                this.f4391a.release();
                this.f4399i.f(u3, iVar2.n());
            } else {
                JSONObject jSONObject3 = new JSONObject(u3);
                jSONObject3.remove("send_id");
                double d6 = jSONObject.getDouble("r");
                double d7 = jSONObject.getDouble("ad_revenue");
                jSONObject3.put("r", d6);
                jSONObject3.put("ad_revenue", d7);
                jSONObject3.put("admon_count", 1);
                jSONObject3.put("is_admon_revenue", jSONObject.getBoolean("is_admon_revenue"));
                jSONObject3.put("is_revenue_event", jSONObject.getBoolean("is_revenue_event"));
                jSONObject3.put("first_update_timestamp", y3);
                jSONObject3.put("last_update_timestamp", y3);
                iVar.put("e", jSONObject3.toString());
                iVar.put("event_index", "a" + String.valueOf(p(this.f4393c)));
                if (m.c().e()) {
                    iVar.put("_de", "true");
                }
                this.f4398h.put(u3, iVar);
                this.f4391a.release();
                this.f4399i.e(u3, iVar.n());
                g0Var.a("batchEvent: created 1st event: " + iVar.n());
            }
        } catch (Throwable th) {
            this.f4391a.release();
            f4389j.c(l0.l(th));
            throw th;
        }
    }

    private long p(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("pref-admon-event-index", 0);
        return s(sharedPreferences, sharedPreferences.getLong("admon-event-index", -1L));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public long q(Context context) {
        return context.getSharedPreferences("batch_send_id", 0).getLong("pref-admon-last-flush-timestmap", 0L);
    }

    public static j r() {
        if (f4390k == null) {
            f4390k = new j();
        }
        return f4390k;
    }

    private long s(SharedPreferences sharedPreferences, long j4) {
        long j5 = j4 + 1;
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putLong("admon-event-index", j5);
        edit.commit();
        return j5;
    }

    private void t() {
        f4389j.a("loadFromPersistence");
        for (Map.Entry entry : this.f4399i.c()) {
            try {
                this.f4398h.put(entry.getKey(), i.h((String) entry.getValue()));
            } catch (Throwable th) {
                f4389j.c(l0.l(th));
            }
        }
        f4389j.a("loadFromPersistence: loaded " + this.f4398h.size() + " entries");
    }

    /* JADX WARN: Multi-variable type inference failed */
    private String u(i iVar) {
        f4389j.a("prepareKey for API: " + iVar.n());
        JSONObject jSONObject = new JSONObject((String) iVar.get("e"));
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put(c3.d4(349), this.f4394d);
        for (String str : this.f4397g) {
            try {
                jSONObject2.put(str, jSONObject.getString(str));
            } catch (JSONException e4) {
                f4389j.c(l0.l(e4));
            }
        }
        f4389j.a("prepareKey result: " + jSONObject2.toString());
        return jSONObject2.toString();
    }

    private void v(Context context, long j4) {
        try {
            SharedPreferences.Editor edit = context.getSharedPreferences("batch_send_id", 0).edit();
            edit.putLong("pref-admon-last-flush-timestmap", j4);
            edit.commit();
        } catch (Throwable th) {
            f4389j.c(l0.l(th));
        }
    }

    private boolean y() {
        int b4 = m.c().b();
        if (b4 == 0) {
            return true;
        }
        long y3 = l0.y();
        long q3 = q(this.f4393c);
        long j4 = b4 * 1000;
        if (q3 <= 0 || y3 - q3 >= j4) {
            return true;
        }
        f4389j.a("sendEvents: not flushing events. not enough time passed");
        return false;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void z(int i4, int i5) {
        if (i4 == 0) {
            f4389j.a(c3.d4(446));
            return;
        }
        if (i5 != i4) {
            f4389j.a("sendEvents: timestamp not updated - " + i5 + " out of " + i4 + " events sent successfully");
            return;
        }
        try {
            v(this.f4393c, l0.y());
            f4389j.a("sendEvents: timestamp updated - all " + i4 + " events sent successfully");
        } catch (Throwable th) {
            f4389j.c(c3.d4(1000) + l0.l(th));
        }
    }

    public void n(i iVar) {
        boolean f4 = m.c().f();
        boolean e4 = m.c().e();
        if (f4 && e4 && iVar.l()) {
            try {
                this.f4396f.a(i.h(iVar.n()));
            } catch (IOException e5) {
                f4389j.d("IOExceptionException", e5);
            } catch (Throwable th) {
                f4389j.d("Throwable", th);
            }
        }
        try {
            Executors.newSingleThreadExecutor().execute(new c(iVar, f4, e4));
        } catch (Throwable th2) {
            f4389j.c(l0.l(th2));
        }
    }

    public void w() {
        try {
            if (!m.c().f()) {
                f4389j.a("sendEvents: admon batching is disabled");
            } else if (y()) {
                Executors.newSingleThreadExecutor().execute(new d());
            } else {
                f4389j.a("sendEvents: skipping flushing batched events.");
            }
        } catch (Throwable th) {
            f4389j.c(l0.l(th));
        }
    }

    public void x(Context context) {
        this.f4399i = new l(context);
        this.f4395e = new a();
        this.f4396f = new b();
        this.f4394d = this.f4399i.b();
        this.f4393c = context;
        t();
    }
}
