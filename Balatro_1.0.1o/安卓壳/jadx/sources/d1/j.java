package d1;

import a1.b2.c3;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.text.TextUtils;
import androidx.core.app.PendingIntentCompat;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class j {

    /* renamed from: a, reason: collision with root package name */
    public static final int f3111a = l.f3114a;

    /* renamed from: b, reason: collision with root package name */
    private static final j f3112b = new j();

    j() {
    }

    public static j e() {
        return f3112b;
    }

    public Intent a(Context context, int i4, String str) {
        if (i4 != 1 && i4 != 2) {
            if (i4 != 3) {
                return null;
            }
            Uri fromParts = Uri.fromParts(c3.d4(836), "com.google.android.gms", null);
            Intent intent = new Intent("android.settings.APPLICATION_DETAILS_SETTINGS");
            intent.setData(fromParts);
            return intent;
        }
        if (context != null && com.google.android.gms.common.util.f.d(context)) {
            Intent intent2 = new Intent("com.google.android.clockwork.home.UPDATE_ANDROID_WEAR_ACTION");
            intent2.setPackage("com.google.android.wearable.app");
            return intent2;
        }
        StringBuilder sb = new StringBuilder();
        sb.append("gcore_");
        sb.append(f3111a);
        String d4 = c3.d4(694);
        sb.append(d4);
        if (!TextUtils.isEmpty(str)) {
            sb.append(str);
        }
        sb.append(d4);
        if (context != null) {
            sb.append(context.getPackageName());
        }
        sb.append(d4);
        if (context != null) {
            try {
                sb.append(m1.d.a(context).c(context.getPackageName(), 0).versionCode);
            } catch (PackageManager.NameNotFoundException unused) {
            }
        }
        String sb2 = sb.toString();
        Intent intent3 = new Intent("android.intent.action.VIEW");
        Uri.Builder appendQueryParameter = Uri.parse("market://details").buildUpon().appendQueryParameter(c3.d4(1126), "com.google.android.gms");
        if (!TextUtils.isEmpty(sb2)) {
            appendQueryParameter.appendQueryParameter("pcampaignid", sb2);
        }
        intent3.setData(appendQueryParameter.build());
        intent3.setPackage("com.android.vending");
        intent3.addFlags(524288);
        return intent3;
    }

    public PendingIntent b(Context context, int i4, int i5) {
        return c(context, i4, i5, null);
    }

    public PendingIntent c(Context context, int i4, int i5, String str) {
        Intent a4 = a(context, i4, str);
        if (a4 == null) {
            return null;
        }
        return PendingIntentCompat.getActivity(context, i5, a4, 134217728, false);
    }

    public String d(int i4) {
        return l.a(i4);
    }

    public int f(Context context) {
        return g(context, f3111a);
    }

    public int g(Context context, int i4) {
        int d4 = l.d(context, i4);
        if (l.e(context, d4)) {
            return 18;
        }
        return d4;
    }

    public boolean h(Context context, String str) {
        return l.h(context, str);
    }

    public boolean i(int i4) {
        return l.g(i4);
    }
}
