package h1;

import a1.b2.c3;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j {

    /* renamed from: a, reason: collision with root package name */
    private final String f3529a;

    /* renamed from: b, reason: collision with root package name */
    private final String f3530b;

    public j(String str) {
        this(str, null);
    }

    public j(String str, String str2) {
        q.j(str, c3.d4(1334));
        q.c(str.length() <= 23, "tag \"%s\" is longer than the %d character maximum", str, 23);
        this.f3529a = str;
        this.f3530b = (str2 == null || str2.length() <= 0) ? null : str2;
    }

    private final String j(String str) {
        String str2 = this.f3530b;
        return str2 == null ? str : str2.concat(str);
    }

    public boolean a(int i4) {
        return Log.isLoggable(this.f3529a, i4);
    }

    public void b(String str, String str2) {
        if (a(3)) {
            Log.d(str, j(str2));
        }
    }

    public void c(String str, String str2, Throwable th) {
        if (a(3)) {
            Log.d(str, j(str2), th);
        }
    }

    public void d(String str, String str2) {
        if (a(6)) {
            Log.e(str, j(str2));
        }
    }

    public void e(String str, String str2, Throwable th) {
        if (a(6)) {
            Log.e(str, j(str2), th);
        }
    }

    public void f(String str, String str2, Throwable th) {
        if (a(4)) {
            Log.i(str, j(str2), th);
        }
    }

    public void g(String str, String str2) {
        if (a(2)) {
            Log.v(str, j(str2));
        }
    }

    public void h(String str, String str2) {
        if (a(5)) {
            Log.w(str, j(str2));
        }
    }

    public void i(String str, String str2, Throwable th) {
        if (a(5)) {
            Log.w(str, j(str2), th);
        }
    }
}
