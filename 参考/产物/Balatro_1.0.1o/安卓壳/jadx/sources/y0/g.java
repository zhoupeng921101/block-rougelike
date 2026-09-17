package y0;

import a1.b2.c3;
import android.os.Bundle;
import e1.a;
import h1.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g implements a.d {

    /* renamed from: h, reason: collision with root package name */
    public static final g f5177h = new g(new f());

    /* renamed from: e, reason: collision with root package name */
    private final String f5178e = null;

    /* renamed from: f, reason: collision with root package name */
    private final boolean f5179f;

    /* renamed from: g, reason: collision with root package name */
    private final String f5180g;

    public g(f fVar) {
        this.f5179f = fVar.f5175a.booleanValue();
        this.f5180g = fVar.f5176b;
    }

    static /* bridge */ /* synthetic */ String b(g gVar) {
        String str = gVar.f5178e;
        return null;
    }

    public final Bundle a() {
        Bundle bundle = new Bundle();
        bundle.putString("consumer_package", null);
        bundle.putBoolean(c3.d4(812), this.f5179f);
        bundle.putString("log_session_id", this.f5180g);
        return bundle;
    }

    public final boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof g)) {
            return false;
        }
        g gVar = (g) obj;
        return o.a(null, null) && this.f5179f == gVar.f5179f && o.a(this.f5180g, gVar.f5180g);
    }

    public final int hashCode() {
        return o.b(null, Boolean.valueOf(this.f5179f), this.f5180g);
    }
}
