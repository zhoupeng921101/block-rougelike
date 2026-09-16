package h1;

import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c1 extends i1.a {
    public static final Parcelable.Creator<c1> CREATOR = new d1();

    /* renamed from: e, reason: collision with root package name */
    Bundle f3438e;

    /* renamed from: f, reason: collision with root package name */
    d1.c[] f3439f;

    /* renamed from: g, reason: collision with root package name */
    int f3440g;

    /* renamed from: h, reason: collision with root package name */
    f f3441h;

    c1(Bundle bundle, d1.c[] cVarArr, int i4, f fVar) {
        this.f3438e = bundle;
        this.f3439f = cVarArr;
        this.f3440g = i4;
        this.f3441h = fVar;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.f(parcel, 1, this.f3438e, false);
        i1.c.r(parcel, 2, this.f3439f, i4, false);
        i1.c.i(parcel, 3, this.f3440g);
        i1.c.n(parcel, 4, this.f3441h, i4, false);
        i1.c.b(parcel, a4);
    }
}
