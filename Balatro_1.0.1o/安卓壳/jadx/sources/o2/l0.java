package o2;

import a1.b2.c3;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Looper;
import android.provider.Settings;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class l0 {

    /* renamed from: b, reason: collision with root package name */
    private static double f4423b;

    /* renamed from: c, reason: collision with root package name */
    private static int f4424c;

    /* renamed from: d, reason: collision with root package name */
    private static String f4425d;

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4422a = g0.f(l0.class.getSimpleName());

    /* renamed from: e, reason: collision with root package name */
    private static q2.c f4426e = new q2.c(new q2.a());

    /* renamed from: f, reason: collision with root package name */
    private static String f4427f = null;

    /* renamed from: g, reason: collision with root package name */
    private static String f4428g = null;

    /* renamed from: h, reason: collision with root package name */
    private static String f4429h = null;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements g2.f {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ BlockingQueue f4430a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ long f4431b;

        a(BlockingQueue blockingQueue, long j4) {
            this.f4430a = blockingQueue;
            this.f4431b = j4;
        }

        @Override // g2.f
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void b(x0.c cVar) {
            l0.f4422a.a(c3.d4(447));
            int unused = l0.f4424c = cVar.b();
            this.f4430a.offer(cVar.a());
            double unused2 = l0.f4423b = l0.f0(this.f4431b);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements g2.e {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ BlockingQueue f4432a;

        b(BlockingQueue blockingQueue) {
            this.f4432a = blockingQueue;
        }

        @Override // g2.e
        public void e(Exception exc) {
            l0.f4422a.c(c3.d4(1340) + l0.l(exc));
            double unused = l0.f4423b = -1.0d;
            this.f4432a.offer("");
        }
    }

    public static String A() {
        return f4425d;
    }

    static long B(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("pref-event-index", 0);
        return Q(sharedPreferences, sharedPreferences.getLong(c3.d4(216), -1L));
    }

    public static String C() {
        return f4429h;
    }

    public static Set D() {
        HashSet hashSet = new HashSet();
        hashSet.add(c3.d4(1425));
        hashSet.add("9774d56d682e549c");
        hashSet.add(c3.d4(167));
        hashSet.add(c3.d4(1001));
        hashSet.add(c3.d4(448));
        hashSet.add("DEFACE");
        hashSet.add(c3.d4(1341));
        hashSet.add(c3.d4(168));
        return hashSet;
    }

    static Locale E(Configuration configuration) {
        Locale d4 = a0.d(configuration);
        return d4 != null ? d4 : a0.c(configuration);
    }

    public static String F(Context context) {
        return context.getSharedPreferences("pref_persisted_asid", 0).getString("persisted_asid", null);
    }

    public static String G(Context context) {
        try {
            String str = (String) a0.f(q(context), "getId", null, new Object[0]);
            if (X(str)) {
                return null;
            }
            return str;
        } catch (Throwable th) {
            f4422a.c(c3.d4(391) + l(th));
            return null;
        }
    }

    public static String H(Context context) {
        try {
            String b4 = s.b(context);
            if (X(b4)) {
                return null;
            }
            return b4;
        } catch (Throwable th) {
            f4422a.c("Failed to get Play Store Ad ID by backup method: " + l(th));
            return null;
        }
    }

    static String I(e0 e0Var) {
        String str;
        String str2 = e0Var.n().f4474v;
        String str3 = f4427f;
        return (str3 == null || (str = f4428g) == null) ? str2 : String.format("%s-%s/%s", str2, str3, str);
    }

    static UUID J(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(c3.d4(1242), 0);
        String string = sharedPreferences.getString("singular-id", null);
        return string != null ? UUID.fromString(string) : h(sharedPreferences);
    }

    public static String K(Throwable th) {
        StringWriter stringWriter = new StringWriter();
        th.printStackTrace(new PrintWriter(stringWriter));
        return stringWriter.toString();
    }

    static String[] L() {
        return a0.e();
    }

    public static String M() {
        return f4427f;
    }

    static boolean N(n2.c cVar) {
        if (z.e().d().booleanValue()) {
            f4422a.a("Push notifications: app was opened with push notification link, skipping deeplink handler invocation.");
            return false;
        }
        e0.r().z().getClass();
        cVar.b();
        return false;
    }

    static void O(Uri uri) {
        String i4 = i(uri);
        if (i4 != null) {
            N(new n2.c(i4, j(uri), false, uri));
        }
    }

    private static byte[] P(String str) {
        try {
            int length = str.length();
            byte[] bArr = new byte[length / 2];
            for (int i4 = 0; i4 < length; i4 += 2) {
                bArr[i4 / 2] = (byte) ((Character.digit(str.charAt(i4), 16) << 4) + Character.digit(str.charAt(i4 + 1), 16));
            }
            return bArr;
        } catch (Throwable th) {
            f4422a.c("Failed to convert hex string to byte array: " + l(th));
            return null;
        }
    }

    private static long Q(SharedPreferences sharedPreferences, long j4) {
        long j5 = j4 + 1;
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putLong("event-index", j5);
        edit.commit();
        return j5;
    }

    static boolean R(Context context) {
        try {
            Settings.Secure.getInt(context.getContentResolver(), "limit_ad_tracking");
            return true;
        } catch (Settings.SettingNotFoundException e4) {
            f4422a.a(c3.d4(591) + l(e4));
            return false;
        }
    }

    static boolean S(Context context) {
        return Settings.Secure.getInt(context.getContentResolver(), "limit_ad_tracking") != 0;
    }

    static boolean T(Uri uri) {
        g0 g0Var = f4422a;
        g0Var.a(c3.d4(449));
        if (uri == null) {
            g0Var.a("link is null");
            return false;
        }
        if (e0.r() == null) {
            g0Var.c("Singular instance is null. cannot check branded links");
            return false;
        }
        if (e0.r().z() == null) {
            g0Var.a("singular config is null. cannot check branded links");
            return false;
        }
        if (e0.r().z().f4269q == null || e0.r().z().f4269q.size() == 0) {
            g0Var.a("branded domains is null or empty");
            return false;
        }
        if (uri.getScheme() == null) {
            uri = Uri.parse("https://" + uri.toString());
        }
        return e0(uri, e0.r().z().f4269q);
    }

    static boolean U(Uri uri) {
        e0 r3 = e0.r();
        if (uri != null && r3 != null && r3.z() != null && r3.z().f4268p != null && r3.z().f4268p.size() != 0) {
            if (uri.getScheme() == null) {
                uri = Uri.parse(c3.d4(1508) + uri.toString());
            }
            return e0(uri, r3.z().f4268p);
        }
        g0 g0Var = f4422a;
        StringBuilder sb = new StringBuilder();
        sb.append("isESPLink: returning false - ");
        sb.append(uri == null ? "link == null " : "");
        sb.append(r3 == null ? "instance == null" : r3.z() == null ? c3.d4(745) : r3.z().f4268p == null ? "espDomains is null" : "espDomains is empty");
        g0Var.a(sb.toString());
        return false;
    }

    public static boolean V(String str) {
        return str == null || str.trim().length() == 0;
    }

    static boolean W() {
        return a0.a(c3.d4(490)) != null;
    }

    public static boolean X(String str) {
        if (V(str)) {
            return false;
        }
        return D().contains(str) || Pattern.compile("^[0-]+$").matcher(str).matches();
    }

    public static boolean Y(Context context, String str) {
        return context.getSharedPreferences("singular-licensing-api", 0).getBoolean(str, false);
    }

    public static boolean Z(Context context) {
        try {
            return ((Boolean) a0.f(q(context), "isLimitAdTrackingEnabled", null, new Object[0])).booleanValue();
        } catch (Throwable th) {
            f4422a.c(c3.d4(83) + l(th));
            return false;
        }
    }

    static boolean a0() {
        return Looper.getMainLooper().getThread() == Thread.currentThread();
    }

    static boolean b0() {
        return e0.r().z().f4266n;
    }

    static boolean c0(Uri uri) {
        return (U(uri) || T(uri) || d0(uri)) && i(uri) == null;
    }

    static boolean d() {
        e0.r().z().f4266n = false;
        return false;
    }

    static boolean d0(Uri uri) {
        if (uri != null) {
            return uri.getHost() != null && uri.getHost().endsWith("sng.link");
        }
        f4422a.a("isSingularLinkDomain: URI is null");
        return false;
    }

    public static boolean e(Context context) {
        return context.getSharedPreferences("pref_asid_is_singular_id", 0).getBoolean(c3.d4(639), false);
    }

    private static boolean e0(Uri uri, List list) {
        Iterator it = list.iterator();
        while (it.hasNext()) {
            String str = (String) it.next();
            if (uri.getHost() != null && uri.getHost().equals(str)) {
                return true;
            }
        }
        return false;
    }

    static String f(byte[] bArr) {
        char[] cArr = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
        char[] cArr2 = new char[bArr.length * 2];
        for (int i4 = 0; i4 < bArr.length; i4++) {
            byte b4 = bArr[i4];
            int i5 = i4 * 2;
            cArr2[i5] = cArr[(b4 & 255) >>> 4];
            cArr2[i5 + 1] = cArr[b4 & 15];
        }
        return new String(cArr2);
    }

    static double f0(long j4) {
        return f4426e.b(j4);
    }

    public static void g() {
        f4423b = 0.0d;
    }

    public static void g0(Context context, String str) {
        SharedPreferences.Editor edit = context.getSharedPreferences(c3.d4(703), 0).edit();
        edit.putString("persisted_asid", str);
        edit.commit();
    }

    private static UUID h(SharedPreferences sharedPreferences) {
        UUID randomUUID = UUID.randomUUID();
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putString("singular-id", randomUUID.toString());
        edit.commit();
        return randomUUID;
    }

    public static void h0(Context context, String str) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(c3.d4(392), 0);
        sharedPreferences.edit().remove(n(str)).commit();
    }

    static String i(Uri uri) {
        if (uri == null) {
            f4422a.a("Cannot extract deep link: link is null");
            return null;
        }
        if (U(uri) || T(uri) || d0(uri)) {
            String queryParameter = uri.getQueryParameter(c3.d4(169));
            return queryParameter != null ? queryParameter : uri.getQueryParameter(c3.d4(1189));
        }
        f4422a.a("Cannot extract deep link: link is not from a valid domain. Link: " + uri);
        return null;
    }

    static Uri i0(Uri uri) {
        try {
            URL url = new URL(uri.toString());
            HttpURLConnection d4 = url.getProtocol().equalsIgnoreCase("https") ? j0.d(url) : j0.c(url);
            d4.setInstanceFollowRedirects(false);
            d4.connect();
            String headerField = d4.getHeaderField("Location");
            if (headerField != null) {
                return Uri.parse(headerField);
            }
            f4422a.a("resolveESPLink: Location header is null, no redirect URL found for ESP link: " + uri);
            return null;
        } catch (IOException e4) {
            f4422a.c("Failed to resolve ESP link: " + l(e4));
            return null;
        }
    }

    static String j(Uri uri) {
        return uri.getQueryParameter("_p");
    }

    public static void j0(Context context) {
        SharedPreferences.Editor edit = context.getSharedPreferences("pref_asid_is_singular_id", 0).edit();
        edit.putBoolean("asid_is_singular_id", true);
        edit.commit();
    }

    public static String k(String str, String str2) {
        return (V(str) || V(str2) || str.length() < str2.length() || !str.endsWith(str2)) ? str : str.substring(0, str.length() - str2.length());
    }

    private static void k0(Context context) {
        SharedPreferences.Editor edit = context.getSharedPreferences("singular-first-install", 0).edit();
        edit.putBoolean("wasOpenedAfterInstall", true);
        edit.commit();
    }

    public static String l(Throwable th) {
        return "Exception: \n" + th.getMessage() + "\nStack trace: \n" + K(th);
    }

    public static void l0(Context context, String str) {
        SharedPreferences.Editor edit = context.getSharedPreferences("singular-licensing-api", 0).edit();
        edit.putBoolean(str, true);
        edit.commit();
    }

    static String m(long j4) {
        return new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z").format(Long.valueOf(j4));
    }

    public static void m0(String str, Context context, int i4) {
        try {
            String n3 = n(str);
            SharedPreferences.Editor edit = context.getSharedPreferences("pref_retry_count", 0).edit();
            edit.putInt(n3, i4);
            edit.commit();
        } catch (Throwable th) {
            f4422a.c(l(th));
        }
    }

    private static String n(String str) {
        return "rc-" + str;
    }

    public static void n0(String str) {
        f4425d = str;
    }

    public static int o() {
        return f4424c;
    }

    public static void o0(String str) {
        f4429h = str;
    }

    public static double p() {
        return f4423b;
    }

    static String p0(String str, String str2) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
            messageDigest.update(str2.getBytes("UTF-8"));
            messageDigest.update(str.getBytes("UTF-8"));
            return f(messageDigest.digest());
        } catch (Throwable th) {
            g0 g0Var = f4422a;
            g0Var.d("error in sha1Hash()", th);
            g0Var.c("sha1Hash: returning null due to error generating SHA-1 hash");
            return null;
        }
    }

    private static Object q(Context context) {
        return a0.h("com.google.android.gms.ads.identifier.AdvertisingIdClient", "getAdvertisingIdInfo", new Class[]{Context.class}, context);
    }

    static boolean q0(Uri uri) {
        if (uri == null) {
            f4422a.a("validateSingularLink: link is null");
            return false;
        }
        if (uri.getScheme() == null) {
            uri = Uri.parse("https://" + uri.toString());
        }
        if (uri.getHost() != null) {
            return true;
        }
        f4422a.a("validateSingularLink: link has no host. Link: " + uri);
        return false;
    }

    static String r(Context context) {
        try {
            return Settings.Secure.getString(context.getContentResolver(), "advertising_id");
        } catch (Throwable th) {
            f4422a.c("Failed to get Amazon ID: " + l(th));
            return null;
        }
    }

    public static String r0(String str) {
        try {
            byte[] P = P(str);
            byte[] bArr = new byte[4];
            int length = P.length - 4;
            byte[] bArr2 = new byte[length];
            System.arraycopy(P, 0, bArr, 0, 4);
            System.arraycopy(P, 4, bArr2, 0, length);
            byte[] bArr3 = new byte[length];
            for (int i4 = 0; i4 < length; i4++) {
                bArr3[i4] = (byte) (bArr2[i4] ^ bArr[i4 % 4]);
            }
            return new String(bArr3);
        } catch (Throwable th) {
            f4422a.c("Failed to XOR decrypt: " + l(th));
            return null;
        }
    }

    public static int s(Context context, String str) {
        int i4 = context.getSharedPreferences("pref_retry_count", 0).getInt(n(str), 0);
        m0(str, context, i4 + 1);
        return i4;
    }

    static boolean t(Context context) {
        if (context.getSharedPreferences("singular-first-install", 0).getBoolean("wasOpenedAfterInstall", false)) {
            return false;
        }
        k0(context);
        return true;
    }

    static String u(Context context) {
        String string = Settings.Secure.getString(context.getContentResolver(), "android_id");
        return !D().contains(string) ? string : c3.d4(32);
    }

    static String v(Context context) {
        try {
            g0 g0Var = f4422a;
            g0Var.a("Utils: trying to fetch app set id");
            g2.h a4 = x0.a.a(context).a();
            LinkedBlockingQueue linkedBlockingQueue = new LinkedBlockingQueue();
            a4.g(new a(linkedBlockingQueue, y()));
            a4.e(new b(linkedBlockingQueue));
            String str = (String) linkedBlockingQueue.poll(1L, TimeUnit.SECONDS);
            g0Var.a("Utils: fetched app set id value: " + str);
            if (V(str)) {
                return null;
            }
            return str;
        } catch (Throwable th) {
            f4422a.c("Utils: caught exception in fetching app set id: " + l(th));
            f4423b = -2.0d;
            return null;
        }
    }

    public static String w(Context context) {
        return context.getSharedPreferences("install-openUri", 0).getString(c3.d4(301), null);
    }

    static String x() {
        return a0.b();
    }

    public static long y() {
        return f4426e.a();
    }

    public static Method z(Object obj, String str, Class... clsArr) {
        try {
            return obj.getClass().getDeclaredMethod(str, clsArr);
        } catch (NoSuchMethodException unused) {
            g0 g0Var = f4422a;
            StringBuilder sb = new StringBuilder();
            sb.append("Method ");
            sb.append(str);
            sb.append(" was not found in ");
            sb.append(obj != null ? obj.getClass().getName() : null);
            g0Var.a(sb.toString());
            return null;
        } catch (SecurityException e4) {
            f4422a.b("Security violation occured ", e4);
            return null;
        }
    }
}
