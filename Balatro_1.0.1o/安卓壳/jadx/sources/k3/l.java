package k3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract /* synthetic */ class l {

    /* renamed from: a, reason: collision with root package name */
    private static final int f4006a = Runtime.getRuntime().availableProcessors();

    public static final int a() {
        return f4006a;
    }

    public static final String b(String str) {
        try {
            return System.getProperty(str);
        } catch (SecurityException unused) {
            return null;
        }
    }
}
