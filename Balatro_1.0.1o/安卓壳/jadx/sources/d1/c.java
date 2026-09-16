package d1;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import h1.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c extends i1.a {
    public static final Parcelable.Creator<c> CREATOR = new u();

    /* renamed from: e, reason: collision with root package name */
    private final String f3089e;

    /* renamed from: f, reason: collision with root package name */
    private final int f3090f;

    /* renamed from: g, reason: collision with root package name */
    private final long f3091g;

    /* renamed from: h, reason: collision with root package name */
    private final boolean f3092h;

    public c(String str, int i4, long j4, boolean z3) {
        this.f3089e = str;
        this.f3090f = i4;
        this.f3091g = j4;
        this.f3092h = z3;
    }

    public c(String str, long j4) {
        this(str, -1, j4, false);
    }

    public c(String str, long j4, boolean z3) {
        this(str, -1, j4, z3);
    }

    public final boolean equals(Object obj) {
        if (obj instanceof c) {
            c cVar = (c) obj;
            if (h1.o.a(i0(), cVar.i0()) && j0() == cVar.j0() && h0() == cVar.h0()) {
                return true;
            }
        }
        return false;
    }

    public boolean h0() {
        return this.f3092h;
    }

    public final int hashCode() {
        return h1.o.b(i0(), Long.valueOf(j0()), Boolean.valueOf(h0()));
    }

    public String i0() {
        return this.f3089e;
    }

    public long j0() {
        long j4 = this.f3091g;
        return j4 == -1 ? this.f3090f : j4;
    }

    public final String toString() {
        o.a c4 = h1.o.c(this);
        c4.a("name", i0());
        c4.a(c3.d4(793), Long.valueOf(j0()));
        c4.a("is_fully_rolled_out", Boolean.valueOf(h0()));
        return c4.toString();
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, i0(), false);
        i1.c.i(parcel, 2, this.f3090f);
        i1.c.l(parcel, 3, j0());
        i1.c.c(parcel, 4, h0());
        i1.c.b(parcel, a4);
    }
}
