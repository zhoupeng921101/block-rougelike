package o2;

import a1.b2.c3;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.InstallSourceInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.webkit.WebSettings;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class r {
    private static final g0 T = g0.f(r.class.getSimpleName());
    String A;
    String B;
    String C;
    String D;
    String E;
    String F;
    String G;
    String H;
    String I;
    String J;
    String K;
    String L;
    String M;
    String N;
    String O;
    long P;
    long Q;
    String R;
    String S;

    /* renamed from: a, reason: collision with root package name */
    String f4453a;

    /* renamed from: b, reason: collision with root package name */
    String f4454b;

    /* renamed from: c, reason: collision with root package name */
    String f4455c;

    /* renamed from: d, reason: collision with root package name */
    String f4456d;

    /* renamed from: e, reason: collision with root package name */
    String f4457e;

    /* renamed from: f, reason: collision with root package name */
    String f4458f;

    /* renamed from: g, reason: collision with root package name */
    boolean f4459g;

    /* renamed from: h, reason: collision with root package name */
    boolean f4460h;

    /* renamed from: i, reason: collision with root package name */
    String f4461i;

    /* renamed from: j, reason: collision with root package name */
    boolean f4462j;

    /* renamed from: k, reason: collision with root package name */
    boolean f4463k;

    /* renamed from: l, reason: collision with root package name */
    String f4464l;

    /* renamed from: m, reason: collision with root package name */
    String f4465m;

    /* renamed from: n, reason: collision with root package name */
    String f4466n;

    /* renamed from: o, reason: collision with root package name */
    String f4467o;

    /* renamed from: p, reason: collision with root package name */
    String f4468p;

    /* renamed from: q, reason: collision with root package name */
    String f4469q;

    /* renamed from: r, reason: collision with root package name */
    String f4470r;

    /* renamed from: s, reason: collision with root package name */
    String f4471s;

    /* renamed from: t, reason: collision with root package name */
    String f4472t;

    /* renamed from: u, reason: collision with root package name */
    String f4473u;

    /* renamed from: v, reason: collision with root package name */
    String f4474v;

    /* renamed from: w, reason: collision with root package name */
    String f4475w;

    /* renamed from: x, reason: collision with root package name */
    String f4476x;

    /* renamed from: y, reason: collision with root package name */
    String f4477y;

    /* renamed from: z, reason: collision with root package name */
    Locale f4478z;

    r(Context context, boolean z3, Boolean bool, boolean z4) {
        q(context);
        v(context);
        Resources resources = context.getResources();
        DisplayMetrics displayMetrics = resources.getDisplayMetrics();
        Configuration configuration = resources.getConfiguration();
        Locale E = l0.E(configuration);
        this.f4478z = E;
        this.A = E.getLanguage();
        this.B = this.f4478z.getCountry();
        int i4 = configuration.screenLayout;
        this.C = n(i4);
        this.D = m(i4);
        this.f4477y = f(i4);
        this.E = l(displayMetrics);
        this.F = i(displayMetrics);
        this.G = h(displayMetrics);
        this.f4459g = l0.W();
        if (!bool.booleanValue()) {
            a(context);
        }
        if (z3) {
            this.f4456d = w.f(context);
        }
        boolean R = l0.R(context);
        this.f4462j = R;
        if (R) {
            this.f4463k = l0.S(context);
            this.f4461i = l0.r(context);
        }
        b(context, z4);
        this.L = j(context);
        SharedPreferences sharedPreferences = context.getSharedPreferences("singular-pref-session", 0);
        String d4 = c3.d4(644);
        s(sharedPreferences.getString("fcm_device_token_key", d4));
        t(context.getSharedPreferences("singular-pref-session", 0).getString("gcm_device_token_key", d4));
        k(context);
        r(context.getSharedPreferences("singular-pref-session", 0).getString(c3.d4(1089), d4));
        this.S = g(context);
        p();
    }

    private String c() {
        String[] L = l0.L();
        if (L != null && L.length != 0) {
            return L[0];
        }
        T.a("SUPPORTED_ABIS is null or empty, falling back to CPU_ABI");
        return l0.x();
    }

    private String d(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            return packageManager.getApplicationLabel(packageManager.getApplicationInfo(context.getPackageName(), 128)).toString();
        } catch (Throwable th) {
            T.a("Failed to get app name: " + l0.l(th));
            return "unknown";
        }
    }

    private String e(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            return TextUtils.isEmpty(packageInfo.versionName) ? "unknown" : packageInfo.versionName;
        } catch (Throwable th) {
            T.c("Failed to get app version: " + l0.l(th));
            return "unknown";
        }
    }

    private String f(int i4) {
        int i5 = i4 & 15;
        if (i5 == 1 || i5 == 2) {
            return "phone";
        }
        if (i5 == 3 || i5 == 4) {
            return "tablet";
        }
        T.a("Unknown device type for screen size: " + i5);
        return null;
    }

    private String g(Context context) {
        String property = System.getProperty("http.agent", "");
        if (TextUtils.isEmpty(property)) {
            try {
                Class.forName("android.os.AsyncTask");
                return WebSettings.getDefaultUserAgent(context);
            } catch (VerifyError e4) {
                T.a("VerifyError while getting user agent: " + l0.l(e4));
            } catch (Throwable th) {
                T.a(c3.d4(704) + l0.l(th));
            }
        }
        return property;
    }

    private String h(DisplayMetrics displayMetrics) {
        return String.valueOf(displayMetrics.heightPixels);
    }

    private String i(DisplayMetrics displayMetrics) {
        return String.valueOf(displayMetrics.widthPixels);
    }

    private String j(Context context) {
        InstallSourceInfo installSourceInfo;
        String initiatingPackageName;
        try {
            PackageManager packageManager = context.getPackageManager();
            if (Build.VERSION.SDK_INT >= 30) {
                installSourceInfo = packageManager.getInstallSourceInfo(context.getPackageName());
                if (installSourceInfo != null) {
                    initiatingPackageName = installSourceInfo.getInitiatingPackageName();
                    this.L = initiatingPackageName;
                }
            } else {
                this.L = packageManager.getInstallerPackageName(context.getPackageName());
            }
            return this.L;
        } catch (Throwable th) {
            g0 g0Var = T;
            g0Var.c("Failed to get install source: " + l0.l(th));
            g0Var.c("getInstallSource: returning null due to error");
            return null;
        }
    }

    private void k(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            this.P = packageInfo.firstInstallTime;
            this.Q = packageInfo.lastUpdateTime;
        } catch (PackageManager.NameNotFoundException e4) {
            T.c("Package not found while getting install timestamps: " + l0.l(e4));
        } catch (RuntimeException e5) {
            T.d("getInstallDates failed", e5);
        }
    }

    private String l(DisplayMetrics displayMetrics) {
        int i4 = displayMetrics.densityDpi;
        if (i4 != 0) {
            return i4 < 140 ? "low" : i4 > 200 ? "high" : "medium";
        }
        T.a("Screen density is 0, cannot determine density");
        return null;
    }

    private String m(int i4) {
        int i5 = i4 & 48;
        if (i5 == 16) {
            return c3.d4(1344);
        }
        if (i5 == 32) {
            return "long";
        }
        T.a("Unknown screen format value: " + i5);
        return null;
    }

    private String n(int i4) {
        int i5 = i4 & 15;
        if (i5 == 1) {
            return "small";
        }
        if (i5 == 2) {
            return c3.d4(87);
        }
        if (i5 == 3) {
            return "large";
        }
        if (i5 == 4) {
            return "xlarge";
        }
        T.a("Unknown screen size value: " + i5);
        return null;
    }

    private void q(Context context) {
        this.f4464l = c();
        this.f4466n = Build.BRAND;
        this.f4467o = Build.DEVICE;
        this.f4468p = context.getPackageName();
        this.f4469q = Build.MANUFACTURER;
        this.f4470r = Build.MODEL;
        this.f4472t = "Android";
        this.f4473u = Build.PRODUCT;
        this.f4475w = Build.VERSION.RELEASE;
        this.H = Build.DISPLAY;
        this.f4474v = n.f4437b;
        this.f4471s = d(context);
        this.f4465m = e(context);
        this.f4476x = String.format("%d", Integer.valueOf(Build.VERSION.SDK_INT));
    }

    private void v(Context context) {
        try {
            Bundle bundle = context.getPackageManager().getApplicationInfo(context.getPackageName(), 128).metaData;
            this.M = bundle.getString("SINGULAR_PRELOAD_CAMPAIGN");
            this.N = bundle.getString("SINGULAR_PRELOAD_GROUP");
            this.O = bundle.getString("SINGULAR_PRELOAD_SOURCE");
        } catch (Throwable th) {
            T.d("error in setPreloadCampaign()", th);
        }
    }

    void a(Context context) {
        if (context == null) {
            T.a("blockingFetchLimitedAdvertisingIdentifiers: context is null. skipping.");
            return;
        }
        if (l0.a0()) {
            T.h("blockingFetchLimitedAdvertisingIdentifiers: do not call from main thread. skipping.");
            return;
        }
        if (this.f4459g) {
            this.f4460h = l0.Z(context);
            this.f4454b = l0.G(context);
        }
        if (l0.V(this.f4454b)) {
            this.f4454b = l0.H(context);
        }
        this.f4453a = l0.u(context);
        u(l0.C());
    }

    void b(Context context, boolean z3) {
        if (z3) {
            g0 g0Var = T;
            g0Var.a(c3.d4(902));
            String v3 = l0.v(context);
            this.f4457e = v3;
            if (!l0.V(v3)) {
                g0Var.a("DeviceInfo: first launch fetched app set id is valid, persisting. " + this.f4457e);
                l0.g0(context, this.f4457e);
            }
        } else if (l0.e(context)) {
            T.a(c3.d4(1049));
            this.f4457e = l0.J(context).toString();
        } else {
            g0 g0Var2 = T;
            g0Var2.a("DeviceInfo: app set id is not singular id. fetch app set id again.");
            this.f4457e = l0.v(context);
            this.f4458f = l0.F(context);
            if (l0.V(this.f4457e)) {
                g0Var2.a("DeviceInfo: using persisted app set id.");
                this.f4457e = this.f4458f;
            } else if (!this.f4457e.equalsIgnoreCase(this.f4458f)) {
                g0Var2.a(c3.d4(1470));
                l0.g0(context, this.f4457e);
            }
        }
        if (l0.V(this.f4457e)) {
            T.a("DeviceInfo: app set id is null. resorting to generated asid.");
            this.f4457e = l0.J(context).toString();
            l0.j0(context);
        }
    }

    public boolean o() {
        return (l0.V(this.M) || l0.V(this.N) || l0.V(this.O)) ? false : true;
    }

    void p() {
        g0 g0Var = T;
        if (g0Var.i()) {
            g0Var.a("DeviceInfo ----> ");
            g0Var.b("\t imei : %s", this.f4455c);
            g0Var.b("\t andi : %s", this.f4453a);
            g0Var.b("\t asid : %s", this.f4457e);
            g0Var.b("\t aifa : %s", this.f4454b);
            g0Var.b("\t isGooglePlayServicesAvailable : %b", Boolean.valueOf(this.f4459g));
            g0Var.b("\t isLimitedTrackingEnabled : %b", Boolean.valueOf(this.f4460h));
            g0Var.b("\t appVersion : %s", this.f4465m);
            g0Var.b("\t sdkVersion : %s", this.f4474v);
            g0Var.b(c3.d4(645), this.f4468p);
            g0Var.b("\t appName : %s", this.f4471s);
            g0Var.b("\t preloadCampaign : %s", this.M);
            g0Var.b("\t preloadGroup : %s", this.N);
            g0Var.b("\t preloadSource : %s", this.O);
            g0Var.b("\t installSource : %s", this.L);
            g0Var.b(c3.d4(1245), this.f4464l);
            g0Var.b("\t deviceBrand : %s", this.f4466n);
            g0Var.b("\t deviceBuild : %s", this.f4467o);
            g0Var.b("\t deviceManufacturer : %s", this.f4469q);
            g0Var.b("\t deviceModel : %s", this.f4470r);
            g0Var.b("\t platform : %s", this.f4472t);
            g0Var.b(c3.d4(350), this.f4473u);
            g0Var.b("\t osVersion : %s", this.f4475w);
            g0Var.b("\t apiLevel : %s", this.f4476x);
            g0Var.b("\t hardwareName : %s", this.H);
            g0Var.b("\t locale : %s", this.f4478z);
            g0Var.b(c3.d4(266), this.A);
            g0Var.b("\t country : %s", this.B);
            g0Var.b(c3.d4(351), this.C);
            g0Var.b(c3.d4(1509), this.D);
            g0Var.b(c3.d4(395), this.E);
            g0Var.b("\t displayWidth : %s", this.F);
            g0Var.b("\t displayHeight : %s", this.G);
            g0Var.b("\t gcmProcessId : %s", this.I);
            g0Var.b("\t gcmRegId : %s", this.J);
            g0Var.b(c3.d4(304), this.K);
            g0Var.b("\t firstInstallTime : %d", Long.valueOf(this.P));
            g0Var.b(c3.d4(595), Long.valueOf(this.Q));
            g0Var.b(c3.d4(747), this.f4477y);
            g0Var.b(c3.d4(1192), this.R);
            g0Var.b("\t deviceUserAgent: %s", this.S);
        }
    }

    void r(String str) {
        this.R = str;
    }

    void s(String str) {
        this.K = str;
    }

    void t(String str) {
        this.J = str;
    }

    void u(String str) {
        this.f4455c = str;
    }
}
