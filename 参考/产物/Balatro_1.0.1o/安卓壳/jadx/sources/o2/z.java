package o2;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import java.util.HashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class z {

    /* renamed from: d, reason: collision with root package name */
    private static z f4502d;

    /* renamed from: e, reason: collision with root package name */
    private static final g0 f4503e = g0.f(z.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private Uri f4504a;

    /* renamed from: b, reason: collision with root package name */
    private Boolean f4505b = Boolean.FALSE;

    /* renamed from: c, reason: collision with root package name */
    private Intent f4506c;

    private z() {
    }

    static HashMap c(Bundle bundle) {
        HashMap hashMap = new HashMap();
        try {
            for (String str : bundle.keySet()) {
                hashMap.put(str, bundle.get(str));
            }
            return hashMap;
        } catch (Throwable th) {
            f4503e.a(l0.l(th));
            return hashMap;
        }
    }

    public static z e() {
        if (f4502d == null) {
            f4502d = new z();
        }
        return f4502d;
    }

    void a() {
        f4503e.a("app moved to background");
        this.f4505b = Boolean.FALSE;
        this.f4504a = null;
    }

    public void b() {
        this.f4505b = Boolean.TRUE;
    }

    Boolean d() {
        return this.f4505b;
    }

    Uri f() {
        return this.f4504a;
    }

    String g(Intent intent, String[]... strArr) {
        try {
        } catch (Throwable th) {
            f4503e.a(l0.l(th));
        }
        if (intent.getExtras() != null && !intent.getExtras().isEmpty()) {
            if (strArr != null && strArr.length != 0) {
                HashMap c4 = c(intent.getExtras());
                for (String[] strArr2 : strArr) {
                    int length = strArr2.length;
                    int i4 = 0;
                    while (true) {
                        if (i4 < length) {
                            Object obj = c4.get(strArr2[i4]);
                            if (obj instanceof HashMap) {
                                c4 = (HashMap) obj;
                            } else if (obj instanceof Bundle) {
                                c4 = c((Bundle) obj);
                            } else if (obj instanceof String) {
                                f4503e.a("a value was found in push payload, returning it.");
                                return String.valueOf(obj);
                            }
                            i4++;
                        }
                    }
                }
                f4503e.a("no value was found in push payload, returning nil");
                return null;
            }
            f4503e.a("path selectors not provided or empty");
            return null;
        }
        f4503e.a("push payload extras is null or empty");
        return null;
    }

    public Boolean h(Intent intent, String[]... strArr) {
        if (intent == null) {
            f4503e.a("push payload intent is null");
            return Boolean.FALSE;
        }
        Intent intent2 = this.f4506c;
        if (intent2 != null && intent2.hashCode() == intent.hashCode()) {
            f4503e.a("push is processed already. so ignoring");
            return Boolean.FALSE;
        }
        this.f4506c = intent;
        String g4 = g(intent, strArr);
        if (l0.V(g4)) {
            f4503e.a("extracted value in push payload is null or empty.");
            return Boolean.FALSE;
        }
        try {
            Uri parse = Uri.parse(g4);
            if (!r2.b.a(parse)) {
                f4503e.a("push payload value is an invalid URL.");
                return Boolean.FALSE;
            }
            if (!l0.U(parse) && !l0.T(parse) && !l0.d0(parse)) {
                f4503e.a("push link is neither esp link nor branded link nor sng link");
                return Boolean.FALSE;
            }
            f4503e.a("payload value is a valid url. the SDK can enqeue a new /start with this value: " + parse);
            this.f4504a = parse;
            return Boolean.TRUE;
        } catch (Throwable th) {
            f4503e.a(l0.l(th));
            return Boolean.FALSE;
        }
    }
}
