package h1;

import android.os.IBinder;
import android.os.Parcel;
import android.os.Parcelable;
import h1.k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class o0 extends i1.a {
    public static final Parcelable.Creator<o0> CREATOR = new p0();

    /* renamed from: e, reason: collision with root package name */
    final int f3561e;

    /* renamed from: f, reason: collision with root package name */
    final IBinder f3562f;

    /* renamed from: g, reason: collision with root package name */
    private final d1.a f3563g;

    /* renamed from: h, reason: collision with root package name */
    private final boolean f3564h;

    /* renamed from: i, reason: collision with root package name */
    private final boolean f3565i;

    o0(int i4, IBinder iBinder, d1.a aVar, boolean z3, boolean z4) {
        this.f3561e = i4;
        this.f3562f = iBinder;
        this.f3563g = aVar;
        this.f3564h = z3;
        this.f3565i = z4;
    }

    public final boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof o0)) {
            return false;
        }
        o0 o0Var = (o0) obj;
        return this.f3563g.equals(o0Var.f3563g) && o.a(i0(), o0Var.i0());
    }

    public final d1.a h0() {
        return this.f3563g;
    }

    public final k i0() {
        IBinder iBinder = this.f3562f;
        if (iBinder == null) {
            return null;
        }
        return k.a.h(iBinder);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f3561e);
        i1.c.h(parcel, 2, this.f3562f, false);
        i1.c.n(parcel, 3, this.f3563g, i4, false);
        i1.c.c(parcel, 4, this.f3564h);
        i1.c.c(parcel, 5, this.f3565i);
        i1.c.b(parcel, a4);
    }
}
