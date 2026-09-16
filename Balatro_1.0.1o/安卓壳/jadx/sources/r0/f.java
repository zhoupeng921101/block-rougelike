package r0;

import android.app.job.JobInfo;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import r0.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private u0.a f4767a;

        /* renamed from: b, reason: collision with root package name */
        private Map f4768b = new HashMap();

        public a a(i0.d dVar, b bVar) {
            this.f4768b.put(dVar, bVar);
            return this;
        }

        public f b() {
            if (this.f4767a == null) {
                throw new NullPointerException("missing required property: clock");
            }
            if (this.f4768b.keySet().size() < i0.d.values().length) {
                throw new IllegalStateException("Not all priorities have been configured");
            }
            Map map = this.f4768b;
            this.f4768b = new HashMap();
            return f.d(this.f4767a, map);
        }

        public a c(u0.a aVar) {
            this.f4767a = aVar;
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class b {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        public static abstract class a {
            public abstract b a();

            public abstract a b(long j4);

            public abstract a c(Set set);

            public abstract a d(long j4);
        }

        public static a a() {
            return new c.b().c(Collections.EMPTY_SET);
        }

        abstract long b();

        abstract Set c();

        abstract long d();
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum c {
        f4769e,
        DEVICE_IDLE,
        DEVICE_CHARGING
    }

    private long a(int i4, long j4) {
        return (long) (Math.pow(3.0d, i4 - 1) * j4 * Math.max(1.0d, Math.log(10000.0d) / Math.log((j4 > 1 ? j4 : 2L) * r7)));
    }

    public static a b() {
        return new a();
    }

    static f d(u0.a aVar, Map map) {
        return new r0.b(aVar, map);
    }

    public static f f(u0.a aVar) {
        return b().a(i0.d.DEFAULT, b.a().b(30000L).d(86400000L).a()).a(i0.d.HIGHEST, b.a().b(1000L).d(86400000L).a()).a(i0.d.f3613f, b.a().b(86400000L).d(86400000L).c(i(c.DEVICE_IDLE)).a()).c(aVar).b();
    }

    private static Set i(Object... objArr) {
        return Collections.unmodifiableSet(new HashSet(Arrays.asList(objArr)));
    }

    private void j(JobInfo.Builder builder, Set set) {
        if (set.contains(c.f4769e)) {
            builder.setRequiredNetworkType(2);
        } else {
            builder.setRequiredNetworkType(1);
        }
        if (set.contains(c.DEVICE_CHARGING)) {
            builder.setRequiresCharging(true);
        }
        if (set.contains(c.DEVICE_IDLE)) {
            builder.setRequiresDeviceIdle(true);
        }
    }

    public JobInfo.Builder c(JobInfo.Builder builder, i0.d dVar, long j4, int i4) {
        builder.setMinimumLatency(g(dVar, j4, i4));
        j(builder, ((b) h().get(dVar)).c());
        return builder;
    }

    abstract u0.a e();

    public long g(i0.d dVar, long j4, int i4) {
        long a4 = j4 - e().a();
        b bVar = (b) h().get(dVar);
        return Math.min(Math.max(a(i4, bVar.b()), a4), bVar.d());
    }

    abstract Map h();
}
