package h3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class a {
    public static final int a(int i4) {
        if (new e3.c(2, 36).g(i4)) {
            return i4;
        }
        throw new IllegalArgumentException("radix " + i4 + " was not in valid range " + new e3.c(2, 36));
    }

    public static final int b(char c4, int i4) {
        return Character.digit((int) c4, i4);
    }
}
