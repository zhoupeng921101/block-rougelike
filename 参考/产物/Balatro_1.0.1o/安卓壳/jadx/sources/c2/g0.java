package c2;

import android.app.PendingIntent;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g0 {

    /* renamed from: a, reason: collision with root package name */
    private final String f2110a;

    /* renamed from: b, reason: collision with root package name */
    private final Status f2111b;

    private g0(Status status, String str) {
        this.f2111b = status;
        this.f2110a = str;
    }

    public static g0 a(String str) {
        return new g0(Status.f2559j, str);
    }

    public static g0 b(Status status) {
        h1.q.a(!status.m0());
        return new g0(status, null);
    }

    public final boolean c() {
        return this.f2111b.m0();
    }

    public final String d() {
        return this.f2110a;
    }

    public final PendingIntent e() {
        return this.f2111b.i0();
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof g0)) {
            return false;
        }
        g0 g0Var = (g0) obj;
        return h1.o.a(this.f2111b, g0Var.f2111b) && h1.o.a(this.f2110a, g0Var.f2110a);
    }

    public final int hashCode() {
        return h1.o.b(this.f2111b, this.f2110a);
    }

    public final String toString() {
        return h1.o.c(this).a("status", this.f2111b).a("gameRunToken", this.f2110a).toString();
    }
}
