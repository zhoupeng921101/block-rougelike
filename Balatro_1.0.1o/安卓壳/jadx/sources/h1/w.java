package h1;

import android.os.Bundle;
import e1.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class w implements a.d {

    /* renamed from: f, reason: collision with root package name */
    public static final w f3587f = a().a();

    /* renamed from: e, reason: collision with root package name */
    private final String f3588e;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private String f3589a;

        /* synthetic */ a(y yVar) {
        }

        public w a() {
            return new w(this.f3589a, null);
        }
    }

    /* synthetic */ w(String str, z zVar) {
        this.f3588e = str;
    }

    public static a a() {
        return new a(null);
    }

    public final Bundle b() {
        Bundle bundle = new Bundle();
        String str = this.f3588e;
        if (str != null) {
            bundle.putString("api", str);
        }
        return bundle;
    }

    public final boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof w) {
            return o.a(this.f3588e, ((w) obj).f3588e);
        }
        return false;
    }

    public final int hashCode() {
        return o.b(this.f3588e);
    }
}
