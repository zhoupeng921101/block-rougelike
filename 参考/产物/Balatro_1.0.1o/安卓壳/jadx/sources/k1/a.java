package k1;

import a1.b2.c3;
import android.util.Log;
import h1.j;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a {

    /* renamed from: a, reason: collision with root package name */
    private final String f3984a;

    /* renamed from: b, reason: collision with root package name */
    private final String f3985b;

    /* renamed from: c, reason: collision with root package name */
    private final j f3986c;

    /* renamed from: d, reason: collision with root package name */
    private final int f3987d;

    public a(String str, String... strArr) {
        String sb;
        if (strArr.length == 0) {
            sb = "";
        } else {
            StringBuilder sb2 = new StringBuilder();
            sb2.append('[');
            for (String str2 : strArr) {
                if (sb2.length() > 1) {
                    sb2.append(c3.d4(1181));
                }
                sb2.append(str2);
            }
            sb2.append("] ");
            sb = sb2.toString();
        }
        this.f3985b = sb;
        this.f3984a = str;
        this.f3986c = new j(str);
        int i4 = 2;
        while (i4 <= 7 && !Log.isLoggable(this.f3984a, i4)) {
            i4++;
        }
        this.f3987d = i4;
    }

    public void a(String str, Object... objArr) {
        if (d(3)) {
            Log.d(this.f3984a, c(str, objArr));
        }
    }

    public void b(String str, Object... objArr) {
        Log.e(this.f3984a, c(str, objArr));
    }

    protected String c(String str, Object... objArr) {
        if (objArr != null && objArr.length > 0) {
            str = String.format(Locale.US, str, objArr);
        }
        return this.f3985b.concat(str);
    }

    public boolean d(int i4) {
        return this.f3987d <= i4;
    }
}
