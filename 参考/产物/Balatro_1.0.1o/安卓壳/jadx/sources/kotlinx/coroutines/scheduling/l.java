package kotlinx.coroutines.scheduling;

import a1.b2.c3;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class l {

    /* renamed from: a, reason: collision with root package name */
    public static final long f4047a;

    /* renamed from: b, reason: collision with root package name */
    public static final int f4048b;

    /* renamed from: c, reason: collision with root package name */
    public static final int f4049c;

    /* renamed from: d, reason: collision with root package name */
    public static final long f4050d;

    /* renamed from: e, reason: collision with root package name */
    public static g f4051e;

    /* renamed from: f, reason: collision with root package name */
    public static final i f4052f;

    /* renamed from: g, reason: collision with root package name */
    public static final i f4053g;

    static {
        long e4;
        int d4;
        int d5;
        long e5;
        e4 = k3.m.e(c3.d4(159), 100000L, 0L, 0L, 12, null);
        f4047a = e4;
        d4 = k3.m.d(c3.d4(1462), e3.d.a(k3.k.a(), 2), 1, 0, 8, null);
        f4048b = d4;
        d5 = k3.m.d("kotlinx.coroutines.scheduler.max.pool.size", 2097150, 0, 2097150, 4, null);
        f4049c = d5;
        TimeUnit timeUnit = TimeUnit.SECONDS;
        e5 = k3.m.e("kotlinx.coroutines.scheduler.keep.alive.sec", 60L, 0L, 0L, 12, null);
        f4050d = timeUnit.toNanos(e5);
        f4051e = e.f4037a;
        f4052f = new j(0);
        f4053g = new j(1);
    }
}
