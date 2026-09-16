package b1;

import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends i1.a {
    public static final Parcelable.Creator<a> CREATOR = new d();

    /* renamed from: e, reason: collision with root package name */
    final int f1777e;

    /* renamed from: f, reason: collision with root package name */
    private int f1778f;

    /* renamed from: g, reason: collision with root package name */
    private Bundle f1779g;

    a(int i4, int i5, Bundle bundle) {
        this.f1777e = i4;
        this.f1778f = i5;
        this.f1779g = bundle;
    }

    public int h0() {
        return this.f1778f;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f1777e);
        i1.c.i(parcel, 2, h0());
        i1.c.f(parcel, 3, this.f1779g, false);
        i1.c.b(parcel, a4);
    }
}
