package o2;

import a1.b2.c3;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g0 {

    /* renamed from: c, reason: collision with root package name */
    static boolean f4378c = false;

    /* renamed from: d, reason: collision with root package name */
    static int f4379d = 6;

    /* renamed from: a, reason: collision with root package name */
    private final String f4380a = "Singular";

    /* renamed from: b, reason: collision with root package name */
    private final String f4381b;

    private g0(String str) {
        this.f4381b = str;
    }

    public static g0 f(String str) {
        return new g0(str);
    }

    public static String g() {
        return String.format("%s", Thread.currentThread().getName());
    }

    public int a(String str) {
        if (j(3)) {
            return Log.d(c3.d4(840), k(str));
        }
        return 0;
    }

    public int b(String str, Object... objArr) {
        if (j(3)) {
            return Log.d("Singular", k(String.format(str, objArr)));
        }
        return 0;
    }

    public int c(String str) {
        if (j(6)) {
            return Log.e("Singular", k(str));
        }
        return 0;
    }

    public int d(String str, Throwable th) {
        if (j(6)) {
            return Log.e("Singular", k(str), th);
        }
        return 0;
    }

    public int e(String str, Object... objArr) {
        if (j(6)) {
            return Log.e("Singular", k(String.format(str, objArr)));
        }
        return 0;
    }

    public int h(String str) {
        if (j(4)) {
            return Log.i(c3.d4(1385), k(str));
        }
        return 0;
    }

    public boolean i() {
        return j(3);
    }

    protected boolean j(int i4) {
        return f4378c && f4379d <= i4;
    }

    String k(String str) {
        return String.format("%s [%s] - %s", this.f4381b, g(), str);
    }
}
