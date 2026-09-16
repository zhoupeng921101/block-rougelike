package h1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class s extends i1.a {
    public static final Parcelable.Creator<s> CREATOR = new u0();

    /* renamed from: e, reason: collision with root package name */
    private final int f3574e;

    /* renamed from: f, reason: collision with root package name */
    private final boolean f3575f;

    /* renamed from: g, reason: collision with root package name */
    private final boolean f3576g;

    /* renamed from: h, reason: collision with root package name */
    private final int f3577h;

    /* renamed from: i, reason: collision with root package name */
    private final int f3578i;

    public s(int i4, boolean z3, boolean z4, int i5, int i6) {
        this.f3574e = i4;
        this.f3575f = z3;
        this.f3576g = z4;
        this.f3577h = i5;
        this.f3578i = i6;
    }

    public int h0() {
        return this.f3577h;
    }

    public int i0() {
        return this.f3578i;
    }

    public boolean j0() {
        return this.f3575f;
    }

    public boolean k0() {
        return this.f3576g;
    }

    public int l0() {
        return this.f3574e;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, l0());
        i1.c.c(parcel, 2, j0());
        i1.c.c(parcel, 3, k0());
        i1.c.i(parcel, 4, h0());
        i1.c.i(parcel, 5, i0());
        i1.c.b(parcel, a4);
    }
}
