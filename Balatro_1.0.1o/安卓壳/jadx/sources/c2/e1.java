package c2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e1 {

    /* renamed from: a, reason: collision with root package name */
    private static final h1.j f2105a = new h1.j("Games");

    public static void a(String str, String str2) {
        f2105a.b(i(str), str2);
    }

    public static void b(String str, String str2, Throwable th) {
        f2105a.c(i("GamesApiManager"), "Authentication task failed", th);
    }

    public static void c(String str, String str2) {
        f2105a.g(i(str), str2);
    }

    public static void d(String str, String str2, Throwable th) {
        f2105a.f(i("SnapshotContentsEntity"), c3.d4(919), th);
    }

    public static void e(String str, String str2) {
        f2105a.h(i(str), str2);
    }

    public static void f(String str, String str2, Throwable th) {
        f2105a.i(i(str), str2, th);
    }

    public static void g(String str, String str2) {
        f2105a.d(i(str), str2);
    }

    public static void h(String str, String str2, Throwable th) {
        f2105a.e(i(str), str2, th);
    }

    private static String i(String str) {
        return String.format("%s[%s]", c3.d4(1359), str);
    }
}
