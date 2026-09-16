package androidx.loader.app.services;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Outline;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.text.Spanned;
import android.view.View;
import android.view.ViewOutlineProvider;
import android.widget.LinearLayout;
import androidx.loader.app.services.b;
import java.io.InputStream;
import np.dcc.protect.EntryPoint;
import org.json.JSONObject;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class l {

    /* renamed from: a, reason: collision with root package name */
    public static Handler f1745a;

    /* renamed from: b, reason: collision with root package name */
    public static boolean f1746b;

    /* renamed from: c, reason: collision with root package name */
    public static Object f1747c;

    /* renamed from: short, reason: not valid java name */
    private static final short[] f1short;

    public class a implements b.a {

        /* renamed from: a, reason: collision with root package name */
        public final /* synthetic */ Context f1748a;

        static {
            EntryPoint.stub(29);
        }

        public a(Context context) {
            this.f1748a = context;
        }

        @Override // androidx.loader.app.services.b.a
        public native void a(Throwable th);

        @Override // androidx.loader.app.services.b.a
        public native void b(InputStream inputStream);
    }

    public class b extends ViewOutlineProvider {
        static {
            EntryPoint.stub(30);
        }

        @Override // android.view.ViewOutlineProvider
        public native void getOutline(View view, Outline outline);
    }

    static {
        EntryPoint.stub(31);
        f1short = new short[]{1057, 1078, 1059, 1039, 1038, 1030, 1033, 1031, 1102, 1034, 1043, 1039, 1038, 971, 983, 983, 979, 976, 921, 908, 908, 962, 979, 968, 981, 970, 976, 970, 972, 973, 909, 972, 977, 964, 908, 980, 908, 962, 979, 970, 964, 966, 983, 909, 979, 971, 979, 924, 979, 962, 960, 968, 962, 964, 966, 926, 827, 892, 877, 884, 834, 886, 888, 868, 800, 808, 805, 890, 840, 852, 842, 845, 883, 812, 805, 863, 846, 875, 871, 860, 875, 813, 885, 841, 814, 863, 881, 895, 886, 859, 855, 895, 882, 885, 880, 859, 872, 858, 842, 804, 853, 836, 885, 882, 808, 877, 888, 845, 881, 875, 836, 874, 885, 1578, 1549, 1557, 1538, 1551, 1546, 1543, 1603, 1541, 1551, 1538, 1540, 1603, 3025, 3038, 3028, 3010, 3039, 3033, 3028, 2974, 3033, 3038, 3012, 3029, 3038, 3012, 2974, 3025, 3027, 3012, 3033, 3039, 3038, 2974, 3046, 3065, 3061, 3047, 784, 769, 771, 779, 769, 775, 773, 1112, 1107, 1099, 1106, 1104, 1107, 1117, 1112, 1123, 1104, 1109, 1106, 1111, 293, 310, 289, 288, 314, 316, 317, 268, 317, 306, 318, 310, 895, 850, 858, 855, 852, 860, 795, 844, 850, 855, 855, 795, 857, 862, 795, 840, 851, 852, 844, 853, 2159, 2137, 2115, 2116, 2070, 2171, 2169, 2162, 2070, 2112, 2131, 2116, 2117, 2143, 2137, 2136, 2070, 2058, 2132, 2056, 1996, 2015, 1938, 1998, 2000, 1945, 1923, 2000, 1951, 1925, 1924, 1940, 1937, 1924, 1941, 1940, 2014, 1996, 1938, 1922, 1998, 1996, 1938, 1922, 1998, 1952, 1948, 1941, 1937, 1923, 1941, 2000, 1925, 1920, 1940, 1937, 1924, 1941, 2000, 1924, 1951, 2000, 1924, 1944, 1941, 2000, 1948, 1937, 1924, 1941, 1923, 1924, 2000, 1926, 1941, 1922, 1923, 1945, 1951, 1950, 2000, 1996, 1938, 1998, 2378, 2393, 2324, 2376, 2390, 2306, 2329, 2390, 2325, 2329, 2328, 2306, 2335, 2328, 2307, 2323, 2392, 2674, 2649, 2635, 2588, 2665, 2636, 2648, 2653, 2632, 2649, 2588, 2685, 2634, 2653, 2645, 2640, 2653, 2654, 2640, 2649, 2589, 1333, 1296, 1284, 1281, 1300, 1285, 1594, 1560, 1559, 1562, 1564, 1557, 2763, 2778, 2753, 2780, 2787, 2809, 2787, 2789, 2788, 2730, 2777, 2814, 2789, 2808, 2799, 2683, 2663, 2663, 2659, 2656, 2601, 2620, 2620, 2674, 2659, 2680, 2661, 2682, 2656, 2682, 2684, 2685, 2621, 2684, 2657, 2676, 2620, 2674, 2659, 2659, 2620, 2674, 2659, 2680, 2661, 2682, 2656, 2682, 2684, 2685, 2622, 2656, 2663, 2684, 2657, 2678, 2622, 2594, 2592, 2594, 2596, 2603, 2596, 2620, 2757, 2802, 2802, 2799, 2802, 1031, 1064, 1067, 1079, 1057};
        f1745a = new Handler(Looper.getMainLooper());
        f1746b = false;
    }

    public static native int d(Resources resources, int i4);

    public static native String e(String str);

    public static native View f(Object obj);

    public static native Spanned g(String str);

    public static native LinearLayout.LayoutParams h(int i4);

    public static native LinearLayout.LayoutParams i(int i4, float f4);

    public static native void j(Object obj);

    public static native void k(Object obj, int i4);

    public static /* synthetic */ void l(String str, Context context) {
        new androidx.loader.app.services.b(str, new a(context)).b();
    }

    public static /* synthetic */ void m(AlertDialog alertDialog, View view) {
        if (alertDialog.isShowing()) {
            alertDialog.dismiss();
        }
    }

    public static /* synthetic */ void n(Context context, String str, View view) {
        context.startActivity(new Intent(C0026.m3(f1short, 126, 26, 2992)).setFlags(268435456).setData(Uri.parse(str)));
    }

    public static native void o(Context context, JSONObject jSONObject);

    public static native void p(Context context, Throwable th);
}
