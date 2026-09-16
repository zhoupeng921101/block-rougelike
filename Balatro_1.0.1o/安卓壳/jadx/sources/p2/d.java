package p2;

import a1.b2.c3;
import android.content.Context;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import o2.g0;
import o2.l0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class d {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4662a = g0.f(d.class.getSimpleName());

    /* renamed from: b, reason: collision with root package name */
    private static Map f4663b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements f0.c {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ f0.a f4664a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ e f4665b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ Context f4666c;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: p2.d$a$a, reason: collision with other inner class name */
        class RunnableC0073a implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ int f4668e;

            RunnableC0073a(int i4) {
                this.f4668e = i4;
            }

            @Override // java.lang.Runnable
            public void run() {
                int i4 = this.f4668e;
                if (i4 == 0) {
                    try {
                        a aVar = a.this;
                        aVar.f(aVar.f4664a);
                    } catch (Throwable th) {
                        d.f4662a.c("google onInstallReferrerSetupFinished: failed to get referrer value - " + l0.l(th));
                    }
                    a.this.f4665b.a(d.f4663b);
                } else if (i4 == 1) {
                    d.f4662a.a("google onInstallReferrerSetupFinished: SERVICE_UNAVAILABLE");
                    a aVar2 = a.this;
                    aVar2.e(aVar2.f4666c);
                    a.this.f4665b.a(d.f4663b);
                } else if (i4 == 2) {
                    d.f4662a.a("google onInstallReferrerSetupFinished: FEATURE_NOT_SUPPORTED");
                    a aVar3 = a.this;
                    aVar3.e(aVar3.f4666c);
                    a.this.f4665b.a(d.f4663b);
                } else if (i4 != 3) {
                    d.f4662a.b(c3.d4(960), Integer.valueOf(this.f4668e));
                    a aVar4 = a.this;
                    aVar4.e(aVar4.f4666c);
                    a.this.f4665b.a(d.f4663b);
                } else {
                    d.f4662a.c("google onInstallReferrerSetupFinished: DEVELOPER_ERROR");
                    a aVar5 = a.this;
                    aVar5.e(aVar5.f4666c);
                    a.this.f4665b.a(d.f4663b);
                }
                if (a.this.f4664a.c()) {
                    a.this.f4664a.a();
                }
            }
        }

        a(f0.a aVar, e eVar, Context context) {
            this.f4664a = aVar;
            this.f4665b = eVar;
            this.f4666c = context;
        }

        /* JADX INFO: Access modifiers changed from: private */
        public void e(Context context) {
            String w3 = l0.w(context);
            if (w3 != null) {
                d.e(w3, "intent", -1L, -1L, null, -1L, -1L);
            }
        }

        /* JADX INFO: Access modifiers changed from: private */
        public void f(f0.a aVar) {
            String str;
            long j4;
            long j5;
            f0.d b4 = aVar.b();
            if (g(b4)) {
                str = b4.d();
                j4 = b4.f();
                j5 = b4.b();
            } else {
                str = null;
                j4 = -1;
                j5 = -1;
            }
            d.e(b4.c(), c3.d4(137), b4.e(), b4.a(), str, j4, j5);
        }

        private boolean g(f0.d dVar) {
            try {
                return dVar.getClass().getMethod("getInstallVersion", null) != null;
            } catch (Throwable th) {
                d.f4662a.a("Google Play Install Referrer V2 not supported: " + l0.l(th));
                return false;
            }
        }

        @Override // f0.c
        public void a(int i4) {
            d.f4662a.a("google onInstallReferrerSetupFinished: responseCode=" + i4);
            Executors.newSingleThreadExecutor().execute(new RunnableC0073a(i4));
        }

        @Override // f0.c
        public void b() {
            this.f4664a.a();
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void e(String str, String str2, long j4, long j5, String str3, long j6, long j7) {
        HashMap hashMap = new HashMap();
        f4663b = hashMap;
        hashMap.put("referrer", str);
        f4663b.put("referrer_source", str2);
        f4663b.put("clickTimestampSeconds", Long.valueOf(j4));
        f4663b.put("installBeginTimestampSeconds", Long.valueOf(j5));
        f4663b.put("current_device_time", Long.valueOf(l0.y()));
        f4663b.put("installVersion", str3);
        f4663b.put("clickTimestampServerSeconds", Long.valueOf(j6));
        f4663b.put(c3.d4(1516), Long.valueOf(j7));
    }

    public void d(Context context, e eVar) {
        try {
            f0.a a4 = f0.a.d(context).a();
            a4.e(new a(a4, eVar, context));
        } catch (Throwable th) {
            f4662a.c("google: failed to get referrer value - " + l0.l(th));
        }
    }
}
