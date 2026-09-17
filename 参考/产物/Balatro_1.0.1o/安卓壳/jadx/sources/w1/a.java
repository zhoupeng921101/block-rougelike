package w1;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import h1.o;
import i1.c;
import q1.r;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends r {
    public static final Parcelable.Creator<a> CREATOR = new b();

    /* renamed from: e, reason: collision with root package name */
    private final boolean f5086e;

    /* renamed from: f, reason: collision with root package name */
    private final boolean f5087f;

    /* renamed from: g, reason: collision with root package name */
    private final boolean f5088g;

    /* renamed from: h, reason: collision with root package name */
    private final boolean[] f5089h;

    /* renamed from: i, reason: collision with root package name */
    private final boolean[] f5090i;

    public a(boolean z3, boolean z4, boolean z5, boolean[] zArr, boolean[] zArr2) {
        this.f5086e = z3;
        this.f5087f = z4;
        this.f5088g = z5;
        this.f5089h = zArr;
        this.f5090i = zArr2;
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof a)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        a aVar = (a) obj;
        return o.a(aVar.h0(), h0()) && o.a(aVar.i0(), i0()) && o.a(Boolean.valueOf(aVar.j0()), Boolean.valueOf(j0())) && o.a(Boolean.valueOf(aVar.k0()), Boolean.valueOf(k0())) && o.a(Boolean.valueOf(aVar.l0()), Boolean.valueOf(l0()));
    }

    public boolean[] h0() {
        return this.f5089h;
    }

    public int hashCode() {
        return o.b(h0(), i0(), Boolean.valueOf(j0()), Boolean.valueOf(k0()), Boolean.valueOf(l0()));
    }

    public boolean[] i0() {
        return this.f5090i;
    }

    public boolean j0() {
        return this.f5086e;
    }

    public boolean k0() {
        return this.f5087f;
    }

    public boolean l0() {
        return this.f5088g;
    }

    public String toString() {
        return o.c(this).a(c3.d4(810), h0()).a("SupportedQualityLevels", i0()).a("CameraSupported", Boolean.valueOf(j0())).a(c3.d4(964), Boolean.valueOf(k0())).a(c3.d4(355), Boolean.valueOf(l0())).toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = c.a(parcel);
        c.c(parcel, 1, j0());
        c.c(parcel, 2, k0());
        c.c(parcel, 3, l0());
        c.d(parcel, 4, h0(), false);
        c.d(parcel, 5, i0(), false);
        c.b(parcel, a4);
    }
}
