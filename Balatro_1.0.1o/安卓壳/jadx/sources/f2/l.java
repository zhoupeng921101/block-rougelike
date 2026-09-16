package f2;

import android.os.Parcel;
import android.os.Parcelable;
import h1.o0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l extends i1.a {
    public static final Parcelable.Creator<l> CREATOR = new m();

    /* renamed from: e, reason: collision with root package name */
    final int f3335e;

    /* renamed from: f, reason: collision with root package name */
    private final d1.a f3336f;

    /* renamed from: g, reason: collision with root package name */
    private final o0 f3337g;

    l(int i4, d1.a aVar, o0 o0Var) {
        this.f3335e = i4;
        this.f3336f = aVar;
        this.f3337g = o0Var;
    }

    public final d1.a h0() {
        return this.f3336f;
    }

    public final o0 i0() {
        return this.f3337g;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f3335e);
        i1.c.n(parcel, 2, this.f3336f, i4, false);
        i1.c.n(parcel, 3, this.f3337g, i4, false);
        i1.c.b(parcel, a4);
    }
}
