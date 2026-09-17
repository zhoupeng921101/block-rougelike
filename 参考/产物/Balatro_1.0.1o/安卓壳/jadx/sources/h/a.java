package h;

import android.content.Context;
import android.content.res.Configuration;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a {

    /* renamed from: a, reason: collision with root package name */
    private Context f3390a;

    private a(Context context) {
        this.f3390a = context;
    }

    public static a a(Context context) {
        return new a(context);
    }

    public int b() {
        return this.f3390a.getResources().getDisplayMetrics().widthPixels / 2;
    }

    public int c() {
        Configuration configuration = this.f3390a.getResources().getConfiguration();
        int i4 = configuration.screenWidthDp;
        int i5 = configuration.screenHeightDp;
        if (configuration.smallestScreenWidthDp > 600 || i4 > 600) {
            return 5;
        }
        if (i4 > 960 && i5 > 720) {
            return 5;
        }
        if (i4 > 720 && i5 > 960) {
            return 5;
        }
        if (i4 >= 500) {
            return 4;
        }
        if (i4 > 640 && i5 > 480) {
            return 4;
        }
        if (i4 <= 480 || i5 <= 640) {
            return i4 >= 360 ? 3 : 2;
        }
        return 4;
    }

    public boolean d() {
        return true;
    }
}
