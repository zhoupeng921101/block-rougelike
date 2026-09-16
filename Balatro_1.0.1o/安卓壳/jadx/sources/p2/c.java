package p2;

import a1.b2.c3;
import android.content.ContentProviderClient;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import o2.g0;
import o2.l0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4661a = g0.f(c.class.getSimpleName());

    private boolean a(Context context, String str, ResolveInfo resolveInfo) {
        return str != null && context.getPackageManager().checkPermission(str, resolveInfo.providerInfo.packageName) == 0;
    }

    private String b(Context context, ResolveInfo resolveInfo) {
        String str = resolveInfo.providerInfo.authority;
        if (l0.V(str)) {
            return null;
        }
        return g(context, str);
    }

    private String d(String str, String str2) {
        return String.format("content://%s/%s", str, str2);
    }

    private String e(Context context, String str, ContentProviderClient contentProviderClient) {
        try {
            Uri parse = Uri.parse(str);
            String[] strArr = {"encrypted_data"};
            Cursor query = contentProviderClient != null ? contentProviderClient.query(parse, strArr, "package_name=?", new String[]{context.getPackageName()}, null) : context.getContentResolver().query(parse, strArr, null, null, null);
            if (query == null) {
                f4661a.b("Read content provider cursor null content uri [%s]", str);
                return null;
            }
            if (!query.moveToFirst()) {
                f4661a.b("Read content provider cursor empty content uri [%s]", str);
                query.close();
                return null;
            }
            String string = query.getString(0);
            f4661a.a("Read Content Provider Payload is " + string);
            query.close();
            return string;
        } catch (Throwable th) {
            f4661a.e("Exception read content provider uri [%s] error [%s]", str, th.getMessage());
            return null;
        }
    }

    private String f(Context context, String str) {
        List<ResolveInfo> queryIntentContentProviders;
        PackageManager.ResolveInfoFlags of;
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                PackageManager packageManager = context.getPackageManager();
                Intent intent = new Intent("com.singular.preinstall.READ_PERMISSION_SINGULAR");
                of = PackageManager.ResolveInfoFlags.of(131072L);
                queryIntentContentProviders = packageManager.queryIntentContentProviders(intent, of);
            } else {
                queryIntentContentProviders = context.getPackageManager().queryIntentContentProviders(new Intent("com.singular.preinstall.READ_PERMISSION_SINGULAR"), 131072);
            }
            ArrayList arrayList = new ArrayList();
            for (ResolveInfo resolveInfo : queryIntentContentProviders) {
                if (a(context, str, resolveInfo)) {
                    String b4 = b(context, resolveInfo);
                    if (!l0.V(b4)) {
                        arrayList.add(b4);
                    }
                }
            }
            if (!arrayList.isEmpty()) {
                f4661a.a("Payload read successfully from URI: " + arrayList);
                return (String) arrayList.get(0);
            }
        } catch (Throwable th) {
            f4661a.c("Failed to read content provider intent action: " + l0.l(th));
        }
        f4661a.a("No payloads found in content providers.");
        return null;
    }

    private String g(Context context, String str) {
        try {
            ContentProviderClient acquireUnstableContentProviderClient = context.getContentResolver().acquireUnstableContentProviderClient(str);
            String e4 = e(context, d(str, "trackers"), acquireUnstableContentProviderClient);
            acquireUnstableContentProviderClient.release();
            return e4;
        } catch (Throwable th) {
            f4661a.c("Failed to read content provider with client: " + l0.l(th));
            return null;
        }
    }

    public void c(Context context, e eVar) {
        if (context == null) {
            eVar.a(null);
            return;
        }
        HashMap hashMap = new HashMap();
        String f4 = f(context, "android.permission.INSTALL_PACKAGES");
        if (f4 == null) {
            eVar.a(null);
        } else {
            hashMap.put(c3.d4(406), f4);
            eVar.a(hashMap);
        }
    }
}
