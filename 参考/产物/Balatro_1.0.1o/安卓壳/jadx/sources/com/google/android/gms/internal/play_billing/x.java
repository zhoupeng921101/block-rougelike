package com.google.android.gms.internal.play_billing;

import com.android.support.BuildConfig;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class x {

    /* renamed from: a, reason: collision with root package name */
    private final a0 f3021a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f3022b;

    /* renamed from: c, reason: collision with root package name */
    private long f3023c;

    /* renamed from: d, reason: collision with root package name */
    private long f3024d;

    x(a0 a0Var) {
        v.c(a0Var, "ticker");
        this.f3021a = a0Var;
    }

    public static x b(a0 a0Var) {
        x xVar = new x(a0Var);
        xVar.e();
        return xVar;
    }

    public static x c(a0 a0Var) {
        return new x(a0Var);
    }

    private final long h() {
        return this.f3022b ? (this.f3021a.a() - this.f3024d) + this.f3023c : this.f3023c;
    }

    public final long a(TimeUnit timeUnit) {
        return timeUnit.convert(h(), TimeUnit.NANOSECONDS);
    }

    public final x d() {
        this.f3023c = 0L;
        this.f3022b = false;
        return this;
    }

    public final x e() {
        v.e(!this.f3022b, "This stopwatch is already running.");
        this.f3022b = true;
        this.f3024d = this.f3021a.a();
        return this;
    }

    public final x f() {
        long a4 = this.f3021a.a();
        v.e(this.f3022b, "This stopwatch is already stopped.");
        this.f3022b = false;
        this.f3023c += a4 - this.f3024d;
        return this;
    }

    public final boolean g() {
        return this.f3022b;
    }

    public final String toString() {
        String str;
        long h4 = h();
        TimeUnit timeUnit = TimeUnit.DAYS;
        TimeUnit timeUnit2 = TimeUnit.NANOSECONDS;
        if (timeUnit.convert(h4, timeUnit2) <= 0) {
            timeUnit = TimeUnit.HOURS;
            if (timeUnit.convert(h4, timeUnit2) <= 0) {
                timeUnit = TimeUnit.MINUTES;
                if (timeUnit.convert(h4, timeUnit2) <= 0) {
                    timeUnit = TimeUnit.SECONDS;
                    if (timeUnit.convert(h4, timeUnit2) <= 0) {
                        timeUnit = TimeUnit.MILLISECONDS;
                        if (timeUnit.convert(h4, timeUnit2) <= 0) {
                            timeUnit = TimeUnit.MICROSECONDS;
                            if (timeUnit.convert(h4, timeUnit2) <= 0) {
                                timeUnit = timeUnit2;
                            }
                        }
                    }
                }
            }
        }
        String format = String.format(Locale.ROOT, "%.4g", Double.valueOf(h4 / timeUnit2.convert(1L, timeUnit)));
        switch (w.f3018a[timeUnit.ordinal()]) {
            case BuildConfig.VERSION_CODE /* 1 */:
                str = "ns";
                break;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                str = "μs";
                break;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                str = "ms";
                break;
            case 4:
                str = a1.b2.c3.d4(484);
                break;
            case 5:
                str = "min";
                break;
            case 6:
                str = "h";
                break;
            case 7:
                str = "d";
                break;
            default:
                throw new AssertionError();
        }
        return format + " " + str;
    }
}
