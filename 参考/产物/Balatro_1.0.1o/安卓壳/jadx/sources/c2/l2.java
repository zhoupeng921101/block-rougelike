package c2;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l2 extends i1.a {
    public static final Parcelable.Creator<l2> CREATOR = new m2();

    /* renamed from: e, reason: collision with root package name */
    private final int f2141e;

    /* renamed from: f, reason: collision with root package name */
    private final s2 f2142f;

    l2(int i4, s2 s2Var) {
        this.f2141e = i4;
        this.f2142f = s2Var;
    }

    public static l2 h0(int i4) {
        return new l2(i4, null);
    }

    public static l2 i0(int i4, s2 s2Var) {
        return new l2(i4, s2Var);
    }

    public final boolean d() {
        return this.f2142f == null;
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof l2)) {
            return false;
        }
        l2 l2Var = (l2) obj;
        return this.f2141e == l2Var.f2141e && h1.o.a(this.f2142f, l2Var.f2142f);
    }

    public final int hashCode() {
        return h1.o.b(Integer.valueOf(this.f2141e), this.f2142f);
    }

    public final int j0() {
        return this.f2141e;
    }

    public final String toString() {
        return h1.o.c(this).a("signInType", Integer.valueOf(this.f2141e)).a("previousStepResolutionResult", this.f2142f).toString();
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f2141e);
        i1.c.n(parcel, 2, this.f2142f, i4, false);
        i1.c.b(parcel, a4);
    }
}
