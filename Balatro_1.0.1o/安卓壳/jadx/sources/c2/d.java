package c2;

import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends q1.r {
    public static final Parcelable.Creator<d> CREATOR = new e();

    /* renamed from: e, reason: collision with root package name */
    private final Bundle f2096e;

    /* renamed from: f, reason: collision with root package name */
    private final IBinder f2097f;

    d(Bundle bundle, IBinder iBinder) {
        this.f2096e = bundle;
        this.f2097f = iBinder;
    }

    public d(c cVar) {
        this.f2096e = cVar.a();
        this.f2097f = cVar.f2085a;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        Bundle bundle = this.f2096e;
        int a4 = i1.c.a(parcel);
        i1.c.f(parcel, 1, bundle, false);
        i1.c.h(parcel, 2, this.f2097f, false);
        i1.c.b(parcel, a4);
    }
}
