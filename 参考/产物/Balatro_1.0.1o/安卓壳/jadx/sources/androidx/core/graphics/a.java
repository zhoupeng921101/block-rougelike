package androidx.core.graphics;

import android.graphics.Color;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: a, reason: collision with root package name */
    private static final ThreadLocal f899a = new ThreadLocal();

    public static int a(double d4, double d5, double d6) {
        double d7 = (((3.2406d * d4) + ((-1.5372d) * d5)) + ((-0.4986d) * d6)) / 100.0d;
        double d8 = ((((-0.9689d) * d4) + (1.8758d * d5)) + (0.0415d * d6)) / 100.0d;
        double d9 = (((0.0557d * d4) + ((-0.204d) * d5)) + (1.057d * d6)) / 100.0d;
        return Color.rgb(e((int) Math.round((d7 > 0.0031308d ? (Math.pow(d7, 0.4166666666666667d) * 1.055d) - 0.055d : d7 * 12.92d) * 255.0d), 0, 255), e((int) Math.round((d8 > 0.0031308d ? (Math.pow(d8, 0.4166666666666667d) * 1.055d) - 0.055d : d8 * 12.92d) * 255.0d), 0, 255), e((int) Math.round((d9 > 0.0031308d ? (Math.pow(d9, 0.4166666666666667d) * 1.055d) - 0.055d : d9 * 12.92d) * 255.0d), 0, 255));
    }

    private static int b(int i4, int i5) {
        return 255 - (((255 - i5) * (255 - i4)) / 255);
    }

    public static int c(int i4, int i5) {
        int alpha = Color.alpha(i5);
        int alpha2 = Color.alpha(i4);
        int b4 = b(alpha2, alpha);
        return Color.argb(b4, d(Color.red(i4), alpha2, Color.red(i5), alpha, b4), d(Color.green(i4), alpha2, Color.green(i5), alpha, b4), d(Color.blue(i4), alpha2, Color.blue(i5), alpha, b4));
    }

    private static int d(int i4, int i5, int i6, int i7, int i8) {
        if (i8 == 0) {
            return 0;
        }
        return (((i4 * 255) * i5) + ((i6 * i7) * (255 - i5))) / (i8 * 255);
    }

    private static int e(int i4, int i5, int i6) {
        return i4 < i5 ? i5 : Math.min(i4, i6);
    }

    public static int f(int i4, int i5) {
        if (i5 < 0 || i5 > 255) {
            throw new IllegalArgumentException("alpha must be between 0 and 255.");
        }
        return (i4 & 16777215) | (i5 << 24);
    }
}
