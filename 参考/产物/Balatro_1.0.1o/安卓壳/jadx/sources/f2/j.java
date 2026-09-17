package f2;

import android.os.Parcel;
import android.os.Parcelable;
import h1.m0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j extends i1.a {
    public static final Parcelable.Creator<j> CREATOR = new k();

    /* renamed from: e, reason: collision with root package name */
    final int f3333e;

    /* renamed from: f, reason: collision with root package name */
    final m0 f3334f;

    j(int i4, m0 m0Var) {
        this.f3333e = i4;
        this.f3334f = m0Var;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f3333e);
        i1.c.n(parcel, 2, this.f3334f, i4, false);
        i1.c.b(parcel, a4);
    }
}
