package androidx.core.provider;

import a1.b2.c3;
import android.util.Base64;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e {

    /* renamed from: a, reason: collision with root package name */
    private final String f959a;

    /* renamed from: b, reason: collision with root package name */
    private final String f960b;

    /* renamed from: c, reason: collision with root package name */
    private final String f961c;

    /* renamed from: d, reason: collision with root package name */
    private final List f962d;

    /* renamed from: e, reason: collision with root package name */
    private final int f963e = 0;

    /* renamed from: f, reason: collision with root package name */
    private final String f964f;

    public e(String str, String str2, String str3, List list) {
        this.f959a = (String) androidx.core.util.c.d(str);
        this.f960b = (String) androidx.core.util.c.d(str2);
        this.f961c = (String) androidx.core.util.c.d(str3);
        this.f962d = (List) androidx.core.util.c.d(list);
        this.f964f = a(str, str2, str3);
    }

    private String a(String str, String str2, String str3) {
        return str + "-" + str2 + "-" + str3;
    }

    public List b() {
        return this.f962d;
    }

    public int c() {
        return this.f963e;
    }

    String d() {
        return this.f964f;
    }

    public String e() {
        return this.f959a;
    }

    public String f() {
        return this.f960b;
    }

    public String g() {
        return this.f961c;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("FontRequest {mProviderAuthority: " + this.f959a + ", mProviderPackage: " + this.f960b + ", mQuery: " + this.f961c + ", mCertificates:");
        for (int i4 = 0; i4 < this.f962d.size(); i4++) {
            sb.append(" [");
            List list = (List) this.f962d.get(i4);
            for (int i5 = 0; i5 < list.size(); i5++) {
                sb.append(c3.d4(553));
                sb.append(Base64.encodeToString((byte[]) list.get(i5), 0));
                sb.append("\"");
            }
            sb.append(" ]");
        }
        sb.append("}");
        sb.append("mCertificatesArray: " + this.f963e);
        return sb.toString();
    }
}
