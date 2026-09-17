package com.google.android.datatransport.cct;

import a1.b2.c3;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.telephony.TelephonyManager;
import com.google.android.datatransport.cct.d;
import j0.j;
import j0.k;
import j0.l;
import j0.m;
import j0.n;
import j0.o;
import j0.p;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import k0.h;
import k0.i;
import l0.f;
import l0.g;
import l0.m;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class d implements m {

    /* renamed from: a, reason: collision with root package name */
    private final j2.a f2488a;

    /* renamed from: b, reason: collision with root package name */
    private final ConnectivityManager f2489b;

    /* renamed from: c, reason: collision with root package name */
    private final Context f2490c;

    /* renamed from: d, reason: collision with root package name */
    final URL f2491d;

    /* renamed from: e, reason: collision with root package name */
    private final u0.a f2492e;

    /* renamed from: f, reason: collision with root package name */
    private final u0.a f2493f;

    /* renamed from: g, reason: collision with root package name */
    private final int f2494g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class a {

        /* renamed from: a, reason: collision with root package name */
        final URL f2495a;

        /* renamed from: b, reason: collision with root package name */
        final j f2496b;

        /* renamed from: c, reason: collision with root package name */
        final String f2497c;

        a(URL url, j jVar, String str) {
            this.f2495a = url;
            this.f2496b = jVar;
            this.f2497c = str;
        }

        a a(URL url) {
            return new a(url, this.f2496b, this.f2497c);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b {

        /* renamed from: a, reason: collision with root package name */
        final int f2498a;

        /* renamed from: b, reason: collision with root package name */
        final URL f2499b;

        /* renamed from: c, reason: collision with root package name */
        final long f2500c;

        b(int i4, URL url, long j4) {
            this.f2498a = i4;
            this.f2499b = url;
            this.f2500c = j4;
        }
    }

    d(Context context, u0.a aVar, u0.a aVar2) {
        this(context, aVar, aVar2, 130000);
    }

    d(Context context, u0.a aVar, u0.a aVar2, int i4) {
        this.f2488a = j.b();
        this.f2490c = context;
        this.f2489b = (ConnectivityManager) context.getSystemService("connectivity");
        this.f2491d = m(com.google.android.datatransport.cct.a.f2479c);
        this.f2492e = aVar2;
        this.f2493f = aVar;
        this.f2494g = i4;
    }

    public static /* synthetic */ a d(a aVar, b bVar) {
        URL url = bVar.f2499b;
        if (url == null) {
            return null;
        }
        o0.a.b("CctTransportBackend", "Following redirect to: %s", url);
        return aVar.a(bVar.f2499b);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public b e(a aVar) {
        o0.a.f("CctTransportBackend", "Making request to: %s", aVar.f2495a);
        HttpURLConnection httpURLConnection = (HttpURLConnection) aVar.f2495a.openConnection();
        httpURLConnection.setConnectTimeout(30000);
        httpURLConnection.setReadTimeout(this.f2494g);
        httpURLConnection.setDoOutput(true);
        httpURLConnection.setInstanceFollowRedirects(false);
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setRequestProperty("User-Agent", String.format(c3.d4(1276), c3.d4(688)));
        httpURLConnection.setRequestProperty("Content-Encoding", "gzip");
        httpURLConnection.setRequestProperty("Content-Type", "application/json");
        httpURLConnection.setRequestProperty("Accept-Encoding", "gzip");
        String str = aVar.f2497c;
        if (str != null) {
            httpURLConnection.setRequestProperty("X-Goog-Api-Key", str);
        }
        try {
            OutputStream outputStream = httpURLConnection.getOutputStream();
            try {
                GZIPOutputStream gZIPOutputStream = new GZIPOutputStream(outputStream);
                try {
                    this.f2488a.a(aVar.f2496b, new BufferedWriter(new OutputStreamWriter(gZIPOutputStream)));
                    gZIPOutputStream.close();
                    if (outputStream != null) {
                        outputStream.close();
                    }
                    int responseCode = httpURLConnection.getResponseCode();
                    o0.a.f("CctTransportBackend", "Status Code: %d", Integer.valueOf(responseCode));
                    o0.a.b("CctTransportBackend", "Content-Type: %s", httpURLConnection.getHeaderField("Content-Type"));
                    o0.a.b("CctTransportBackend", "Content-Encoding: %s", httpURLConnection.getHeaderField("Content-Encoding"));
                    if (responseCode == 302 || responseCode == 301 || responseCode == 307) {
                        return new b(responseCode, new URL(httpURLConnection.getHeaderField("Location")), 0L);
                    }
                    if (responseCode != 200) {
                        return new b(responseCode, null, 0L);
                    }
                    InputStream inputStream = httpURLConnection.getInputStream();
                    try {
                        InputStream l3 = l(inputStream, httpURLConnection.getHeaderField("Content-Encoding"));
                        try {
                            b bVar = new b(responseCode, null, n.b(new BufferedReader(new InputStreamReader(l3))).c());
                            if (l3 != null) {
                                l3.close();
                            }
                            if (inputStream != null) {
                                inputStream.close();
                            }
                            return bVar;
                        } finally {
                        }
                    } catch (Throwable th) {
                        if (inputStream != null) {
                            try {
                                inputStream.close();
                            } catch (Throwable th2) {
                                th.addSuppressed(th2);
                            }
                        }
                        throw th;
                    }
                } finally {
                }
            } catch (Throwable th3) {
                if (outputStream != null) {
                    try {
                        outputStream.close();
                    } catch (Throwable th4) {
                        th3.addSuppressed(th4);
                    }
                }
                throw th3;
            }
        } catch (j2.b e4) {
            e = e4;
            o0.a.d("CctTransportBackend", "Couldn't encode request, returning with 400", e);
            return new b(400, null, 0L);
        } catch (ConnectException e5) {
            e = e5;
            o0.a.d("CctTransportBackend", "Couldn't open connection, returning with 500", e);
            return new b(500, null, 0L);
        } catch (UnknownHostException e6) {
            e = e6;
            o0.a.d("CctTransportBackend", "Couldn't open connection, returning with 500", e);
            return new b(500, null, 0L);
        } catch (IOException e7) {
            e = e7;
            o0.a.d("CctTransportBackend", "Couldn't encode request, returning with 400", e);
            return new b(400, null, 0L);
        }
    }

    private static int f(NetworkInfo networkInfo) {
        if (networkInfo == null) {
            return o.b.f3773f.b();
        }
        int subtype = networkInfo.getSubtype();
        if (subtype == -1) {
            return o.b.f3793z.b();
        }
        if (o.b.a(subtype) != null) {
            return subtype;
        }
        return 0;
    }

    private static int g(NetworkInfo networkInfo) {
        return networkInfo == null ? o.c.NONE.b() : networkInfo.getType();
    }

    private static int h(Context context) {
        try {
            return context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode;
        } catch (PackageManager.NameNotFoundException e4) {
            o0.a.d("CctTransportBackend", "Unable to find version code for package", e4);
            return -1;
        }
    }

    private j i(f fVar) {
        l.a j4;
        HashMap hashMap = new HashMap();
        for (i iVar : fVar.b()) {
            String j5 = iVar.j();
            if (hashMap.containsKey(j5)) {
                ((List) hashMap.get(j5)).add(iVar);
            } else {
                ArrayList arrayList = new ArrayList();
                arrayList.add(iVar);
                hashMap.put(j5, arrayList);
            }
        }
        ArrayList arrayList2 = new ArrayList();
        for (Map.Entry entry : hashMap.entrySet()) {
            i iVar2 = (i) ((List) entry.getValue()).get(0);
            m.a b4 = j0.m.a().f(p.DEFAULT).g(this.f2493f.a()).h(this.f2492e.a()).b(k.a().c(k.b.ANDROID_FIREBASE).b(j0.a.a().m(Integer.valueOf(iVar2.g("sdk-version"))).j(iVar2.b(c3.d4(729))).f(iVar2.b("hardware")).d(iVar2.b("device")).l(iVar2.b("product")).k(iVar2.b(c3.d4(477))).h(iVar2.b("manufacturer")).e(iVar2.b("fingerprint")).c(iVar2.b("country")).g(iVar2.b("locale")).i(iVar2.b("mcc_mnc")).b(iVar2.b("application_build")).a()).a());
            try {
                b4.i(Integer.parseInt((String) entry.getKey()));
            } catch (NumberFormatException unused) {
                b4.j((String) entry.getKey());
            }
            ArrayList arrayList3 = new ArrayList();
            for (i iVar3 : (List) entry.getValue()) {
                h e4 = iVar3.e();
                i0.b b5 = e4.b();
                if (b5.equals(i0.b.b(c3.d4(243)))) {
                    j4 = l.j(e4.a());
                } else if (b5.equals(i0.b.b("json"))) {
                    j4 = l.i(new String(e4.a(), Charset.forName("UTF-8")));
                } else {
                    o0.a.g(c3.d4(522), "Received event of unsupported encoding %s. Skipping...", b5);
                }
                j4.c(iVar3.f()).d(iVar3.k()).h(iVar3.h("tz-offset")).e(o.a().c(o.c.a(iVar3.g("net-type"))).b(o.b.a(iVar3.g(c3.d4(478)))).a());
                if (iVar3.d() != null) {
                    j4.b(iVar3.d());
                }
                arrayList3.add(j4.a());
            }
            b4.c(arrayList3);
            arrayList2.add(b4.a());
        }
        return j.a(arrayList2);
    }

    private static TelephonyManager j(Context context) {
        return (TelephonyManager) context.getSystemService("phone");
    }

    static long k() {
        Calendar.getInstance();
        return TimeZone.getDefault().getOffset(Calendar.getInstance().getTimeInMillis()) / 1000;
    }

    private static InputStream l(InputStream inputStream, String str) {
        return "gzip".equals(str) ? new GZIPInputStream(inputStream) : inputStream;
    }

    private static URL m(String str) {
        try {
            return new URL(str);
        } catch (MalformedURLException e4) {
            throw new IllegalArgumentException("Invalid url: " + str, e4);
        }
    }

    @Override // l0.m
    public i a(i iVar) {
        NetworkInfo activeNetworkInfo = this.f2489b.getActiveNetworkInfo();
        return iVar.l().a(c3.d4(570), Build.VERSION.SDK_INT).c("model", Build.MODEL).c("hardware", Build.HARDWARE).c("device", Build.DEVICE).c("product", Build.PRODUCT).c("os-uild", Build.ID).c(c3.d4(381), Build.MANUFACTURER).c(c3.d4(1368), Build.FINGERPRINT).b(c3.d4(622), k()).a("net-type", g(activeNetworkInfo)).a("mobile-subtype", f(activeNetworkInfo)).c(c3.d4(1416), Locale.getDefault().getCountry()).c("locale", Locale.getDefault().getLanguage()).c(c3.d4(924), j(this.f2490c).getSimOperator()).c(c3.d4(1450), Integer.toString(h(this.f2490c))).d();
    }

    @Override // l0.m
    public g b(f fVar) {
        j i4 = i(fVar);
        URL url = this.f2491d;
        if (fVar.c() != null) {
            try {
                com.google.android.datatransport.cct.a c4 = com.google.android.datatransport.cct.a.c(fVar.c());
                r3 = c4.d() != null ? c4.d() : null;
                if (c4.e() != null) {
                    url = m(c4.e());
                }
            } catch (IllegalArgumentException unused) {
                return g.a();
            }
        }
        try {
            b bVar = (b) p0.b.a(5, new a(url, i4, r3), new p0.a() { // from class: com.google.android.datatransport.cct.b
                @Override // p0.a
                public final Object apply(Object obj) {
                    d.b e4;
                    e4 = d.this.e((d.a) obj);
                    return e4;
                }
            }, new p0.c() { // from class: com.google.android.datatransport.cct.c
                @Override // p0.c
                public final Object a(Object obj, Object obj2) {
                    return d.d((d.a) obj, (d.b) obj2);
                }
            });
            int i5 = bVar.f2498a;
            if (i5 == 200) {
                return g.e(bVar.f2500c);
            }
            if (i5 < 500 && i5 != 404) {
                return i5 == 400 ? g.d() : g.a();
            }
            return g.f();
        } catch (IOException e4) {
            o0.a.d("CctTransportBackend", "Could not make request to the backend", e4);
            return g.f();
        }
    }
}
