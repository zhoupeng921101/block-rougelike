package o2;

import a1.b2.c3;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.zip.GZIPInputStream;
import javax.net.ssl.HttpsURLConnection;
import o2.a;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class j0 {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4414a = g0.f(j0.class.getSimpleName());

    /* renamed from: b, reason: collision with root package name */
    static int f4415b = 0;

    /* renamed from: c, reason: collision with root package name */
    private static final String[] f4416c = {"e", "global_properties", "referrer_data"};

    private static String a(String str, String str2) {
        if (str == null) {
            f4414a.a(c3.d4(796));
            return "";
        }
        String p02 = l0.p0(String.format("?%s", str), str2);
        f4414a.b("hash = %s", p02);
        if (l0.V(p02)) {
            return str;
        }
        return str + "&h=" + p02;
    }

    static HttpURLConnection b(e0 e0Var, String str, Map map, long j4) {
        Map e4 = e(map);
        String str2 = str + "?" + a(f(e0Var, map, j4), e0Var.z().f4254b);
        URL url = new URL(str2);
        HttpURLConnection d4 = url.getProtocol().equalsIgnoreCase("https") ? d(url) : c(url);
        j(d4);
        k(d4, e4, e0Var.z().f4254b);
        f4414a.b("__API__ %s %s", d4.getRequestMethod(), str2);
        return d4;
    }

    public static HttpURLConnection c(URL url) {
        if (url != null) {
            return (HttpURLConnection) url.openConnection();
        }
        f4414a.c("getHttpConnection: URL is null, cannot create HTTP connection");
        return null;
    }

    public static HttpURLConnection d(URL url) {
        if (url != null) {
            return (HttpsURLConnection) url.openConnection();
        }
        f4414a.c(c3.d4(390));
        return null;
    }

    private static Map e(Map map) {
        HashMap hashMap = new HashMap();
        for (String str : f4416c) {
            if (map.containsKey(str)) {
                hashMap.put(str, map.get(str));
                map.remove(str);
            }
        }
        return hashMap;
    }

    private static String f(e0 e0Var, Map map, long j4) {
        StringBuilder sb = new StringBuilder();
        if (map == null) {
            map = new HashMap();
        }
        TreeMap treeMap = new TreeMap(map);
        treeMap.put("rt", "json");
        treeMap.put("lag", String.valueOf(l0.f0(j4)));
        treeMap.put("c", v.c(e0Var.l()));
        if (v.f(e0Var.l())) {
            treeMap.put("nc", "1");
        }
        if ((!treeMap.containsKey("u") || l0.V((String) treeMap.get("u"))) && !l0.V(e0Var.n().f4456d)) {
            treeMap.put("u", e0Var.n().f4456d);
            treeMap.put("k", "OAID");
        }
        for (Map.Entry entry : treeMap.entrySet()) {
            String encode = URLEncoder.encode((String) entry.getKey(), "UTF-8");
            String str = (String) entry.getValue();
            String encode2 = str != null ? URLEncoder.encode(str, "UTF-8") : "";
            if (sb.length() > 0) {
                sb.append(c3.d4(900));
            }
            sb.append(encode);
            sb.append(c3.d4(215));
            sb.append(encode2);
        }
        return sb.toString();
    }

    static boolean g(e0 e0Var, String str, Map map, long j4, a.InterfaceC0063a interfaceC0063a) {
        long y3 = l0.y();
        int i4 = f4415b + 1;
        f4415b = i4;
        g0 g0Var = f4414a;
        g0Var.b(c3.d4(31), Integer.valueOf(i4));
        g0Var.b("url = %s", str);
        g0Var.b("params = %s", map);
        HttpURLConnection b4 = b(e0Var, str, map, j4);
        try {
            try {
                boolean i5 = i(e0Var, interfaceC0063a, y3, i4, b4);
                if (b4 != null) {
                    b4.disconnect();
                }
                return i5;
            } catch (IOException e4) {
                throw e4;
            }
        } finally {
        }
    }

    private static String h(HttpURLConnection httpURLConnection) {
        StringBuffer stringBuffer = new StringBuffer();
        InputStream inputStream = httpURLConnection.getInputStream();
        BufferedReader bufferedReader = new BufferedReader((httpURLConnection.getContentEncoding() == null || !httpURLConnection.getContentEncoding().equals(c3.d4(1135))) ? new InputStreamReader(inputStream) : new InputStreamReader(new GZIPInputStream(inputStream)));
        while (true) {
            String readLine = bufferedReader.readLine();
            if (readLine == null) {
                return stringBuffer.toString();
            }
            stringBuffer.append(readLine);
        }
    }

    static boolean i(e0 e0Var, a.InterfaceC0063a interfaceC0063a, long j4, int i4, HttpURLConnection httpURLConnection) {
        httpURLConnection.connect();
        int responseCode = httpURLConnection.getResponseCode();
        String h4 = h(httpURLConnection);
        httpURLConnection.disconnect();
        long y3 = l0.y() - j4;
        g0 g0Var = f4414a;
        g0Var.b("%d %s", Integer.valueOf(responseCode), h4);
        g0Var.b("<--------------------------- /%d - took %dms", Integer.valueOf(i4), Long.valueOf(y3));
        return interfaceC0063a.a(e0Var, responseCode, h4);
    }

    private static void j(HttpURLConnection httpURLConnection) {
        httpURLConnection.setConnectTimeout(10000);
        httpURLConnection.setReadTimeout(10000);
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setDoInput(true);
        httpURLConnection.setUseCaches(false);
        httpURLConnection.setRequestProperty("User-Agent", n.f4438c);
        httpURLConnection.setRequestProperty("Content-Type", "application/json");
    }

    private static void k(HttpURLConnection httpURLConnection, Map map, String str) {
        try {
            if (httpURLConnection == null) {
                f4414a.c("setPayloadForRequest: connection is null, cannot set payload");
                return;
            }
            JSONObject jSONObject = new JSONObject();
            if (map != null && map.size() > 0) {
                String jSONObject2 = new JSONObject(map).toString();
                String p02 = l0.p0(jSONObject2, str);
                jSONObject.put("payload", jSONObject2);
                jSONObject.put("signature", p02);
            }
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(httpURLConnection.getOutputStream(), "UTF-8");
            outputStreamWriter.write(jSONObject.toString());
            outputStreamWriter.close();
        } catch (IOException | JSONException e4) {
            f4414a.d("Error in JSON parsing or I/O ", e4);
        }
    }
}
