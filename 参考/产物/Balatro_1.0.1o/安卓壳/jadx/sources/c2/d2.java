package c2;

import e1.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d2 implements a.d {

    /* renamed from: e, reason: collision with root package name */
    public final int f2100e;

    /* renamed from: f, reason: collision with root package name */
    public final String f2101f;

    /* synthetic */ d2(int i4, String str, byte[] bArr) {
        this.f2100e = i4;
        this.f2101f = str;
    }

    public static y1 a() {
        return new y1(null);
    }

    public final boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof d2)) {
            return false;
        }
        d2 d2Var = (d2) obj;
        return this.f2100e == d2Var.f2100e && h1.o.a(this.f2101f, d2Var.f2101f);
    }

    public final int hashCode() {
        return h1.o.b(Integer.valueOf(this.f2100e), this.f2101f);
    }
}
