package a1.b2;

import android.util.Log;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c3 {
    private static boolean apuwocpk;

    static {
        apuwocpk = false;
        try {
            System.loadLibrary("aaaaaaaa");
            apuwocpk = true;
        } catch (UnsatisfiedLinkError e4) {
            Log.e("aaaaaaaaaa", e4);
        }
    }

    public static String d4(int i4) {
        return !apuwocpk ? "" : kgsuylfb(i4);
    }

    private static native int hrnaxtua();

    private static native String kgsuylfb(int i4);

    public static int znzojbsg() {
        if (apuwocpk) {
            return hrnaxtua();
        }
        return 0;
    }
}
