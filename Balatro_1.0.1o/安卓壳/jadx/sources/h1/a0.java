package h1;

import a1.b2.c3;
import android.R;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.text.TextUtils;
import android.util.Log;
import com.android.support.BuildConfig;
import java.util.Locale;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a0 {

    /* renamed from: a, reason: collision with root package name */
    private static final k.g f3428a = new k.g();

    /* renamed from: b, reason: collision with root package name */
    private static Locale f3429b;

    public static String a(Context context) {
        String packageName = context.getPackageName();
        try {
            return m1.d.a(context).b(packageName).toString();
        } catch (PackageManager.NameNotFoundException | NullPointerException unused) {
            String str = context.getApplicationInfo().name;
            return TextUtils.isEmpty(str) ? packageName : str;
        }
    }

    public static String b(Context context, int i4) {
        Resources resources = context.getResources();
        return i4 != 1 ? i4 != 2 ? i4 != 3 ? resources.getString(R.string.ok) : resources.getString(c1.b.f2050a) : resources.getString(c1.b.f2059j) : resources.getString(c1.b.f2053d);
    }

    public static String c(Context context, int i4) {
        Resources resources = context.getResources();
        String a4 = a(context);
        if (i4 == 1) {
            return resources.getString(c1.b.f2054e, a4);
        }
        if (i4 == 2) {
            return com.google.android.gms.common.util.f.d(context) ? resources.getString(c1.b.f2063n) : resources.getString(c1.b.f2060k, a4);
        }
        if (i4 == 3) {
            return resources.getString(c1.b.f2051b, a4);
        }
        if (i4 == 5) {
            return g(context, "common_google_play_services_invalid_account_text", a4);
        }
        if (i4 == 7) {
            return g(context, "common_google_play_services_network_error_text", a4);
        }
        if (i4 == 9) {
            return resources.getString(c1.b.f2058i, a4);
        }
        if (i4 == 20) {
            return g(context, c3.d4(74), a4);
        }
        switch (i4) {
            case 16:
                return g(context, "common_google_play_services_api_unavailable_text", a4);
            case 17:
                return g(context, c3.d4(385), a4);
            case 18:
                return resources.getString(c1.b.f2062m, a4);
            default:
                return resources.getString(d1.q.f3121a, a4);
        }
    }

    public static String d(Context context, int i4) {
        return (i4 == 6 || i4 == 19) ? g(context, "common_google_play_services_resolution_required_text", a(context)) : c(context, i4);
    }

    public static String e(Context context, int i4) {
        String h4 = i4 == 6 ? h(context, "common_google_play_services_resolution_required_title") : f(context, i4);
        return h4 == null ? context.getResources().getString(c1.b.f2057h) : h4;
    }

    public static String f(Context context, int i4) {
        Resources resources = context.getResources();
        String d4 = c3.d4(122);
        switch (i4) {
            case BuildConfig.VERSION_CODE /* 1 */:
                return resources.getString(c1.b.f2055f);
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                return resources.getString(c1.b.f2061l);
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                return resources.getString(c1.b.f2052c);
            case 4:
            case 6:
            case 18:
                return null;
            case 5:
                Log.e(d4, "An invalid account was specified when connecting. Please provide a valid account.");
                return h(context, "common_google_play_services_invalid_account_title");
            case 7:
                Log.e(d4, "Network error occurred. Please retry request later.");
                return h(context, "common_google_play_services_network_error_title");
            case 8:
                Log.e(d4, c3.d4(1234));
                return null;
            case 9:
                Log.e(d4, "Google Play services is invalid. Cannot recover.");
                return null;
            case 10:
                Log.e(d4, "Developer error occurred. Please see logs for detailed information");
                return null;
            case 11:
                Log.e(d4, "The application is not licensed to the user.");
                return null;
            case 12:
            case 13:
            case 14:
            case 15:
            case 19:
            default:
                Log.e(d4, "Unexpected error code " + i4);
                return null;
            case 16:
                Log.e(d4, c3.d4(938));
                return null;
            case 17:
                Log.e(d4, "The specified account could not be signed in.");
                return h(context, c3.d4(1283));
            case 20:
                Log.e(d4, "The current user profile is restricted and could not use authenticated features.");
                return h(context, "common_google_play_services_restricted_profile_title");
        }
    }

    private static String g(Context context, String str, String str2) {
        Resources resources = context.getResources();
        String h4 = h(context, str);
        if (h4 == null) {
            h4 = resources.getString(d1.q.f3121a);
        }
        return String.format(resources.getConfiguration().locale, h4, str2);
    }

    private static String h(Context context, String str) {
        k.g gVar = f3428a;
        synchronized (gVar) {
            try {
                Locale b4 = androidx.core.os.c.a(context.getResources().getConfiguration()).b(0);
                if (!b4.equals(f3429b)) {
                    gVar.clear();
                    f3429b = b4;
                }
                String str2 = (String) gVar.get(str);
                if (str2 != null) {
                    return str2;
                }
                Resources b5 = d1.k.b(context);
                if (b5 == null) {
                    return null;
                }
                int identifier = b5.getIdentifier(str, "string", "com.google.android.gms");
                if (identifier == 0) {
                    Log.w("GoogleApiAvailability", "Missing resource: " + str);
                    return null;
                }
                String string = b5.getString(identifier);
                if (!TextUtils.isEmpty(string)) {
                    gVar.put(str, string);
                    return string;
                }
                Log.w("GoogleApiAvailability", "Got empty resource: " + str);
                return null;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
