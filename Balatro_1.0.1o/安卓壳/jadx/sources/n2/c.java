package n2;

import android.net.Uri;
import java.util.HashSet;
import o2.l0;
import o2.n;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c {

    /* renamed from: a, reason: collision with root package name */
    private String f4276a;

    /* renamed from: b, reason: collision with root package name */
    private String f4277b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f4278c;

    /* renamed from: d, reason: collision with root package name */
    private Uri f4279d;

    public c(String str, String str2, boolean z3, Uri uri) {
        this.f4276a = a(str, uri);
        this.f4277b = str2;
        this.f4278c = z3;
        this.f4279d = uri;
    }

    private String a(String str, Uri uri) {
        if (l0.V(str) || l0.V(uri.toString())) {
            return str;
        }
        Uri parse = Uri.parse(str);
        Uri.Builder buildUpon = parse.buildUpon();
        String queryParameter = uri.getQueryParameter("_forward_params");
        if (l0.V(queryParameter) || !queryParameter.equals("2")) {
            return str;
        }
        HashSet hashSet = new HashSet(parse.getQueryParameterNames());
        for (String str2 : uri.getQueryParameterNames()) {
            if (!n.f4439d.contains(str2) && !hashSet.contains(str2)) {
                buildUpon.appendQueryParameter(str2, uri.getQueryParameter(str2));
            }
        }
        return buildUpon.build().toString();
    }

    public String b() {
        return this.f4276a;
    }
}
