package h1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class f extends i1.a {
    public static final Parcelable.Creator<f> CREATOR = new e1();

    /* renamed from: e, reason: collision with root package name */
    private final s f3485e;

    /* renamed from: f, reason: collision with root package name */
    private final boolean f3486f;

    /* renamed from: g, reason: collision with root package name */
    private final boolean f3487g;

    /* renamed from: h, reason: collision with root package name */
    private final int[] f3488h;

    /* renamed from: i, reason: collision with root package name */
    private final int f3489i;

    /* renamed from: j, reason: collision with root package name */
    private final int[] f3490j;

    public f(s sVar, boolean z3, boolean z4, int[] iArr, int i4, int[] iArr2) {
        this.f3485e = sVar;
        this.f3486f = z3;
        this.f3487g = z4;
        this.f3488h = iArr;
        this.f3489i = i4;
        this.f3490j = iArr2;
    }

    public int h0() {
        return this.f3489i;
    }

    public int[] i0() {
        return this.f3488h;
    }

    public int[] j0() {
        return this.f3490j;
    }

    public boolean k0() {
        return this.f3486f;
    }

    public boolean l0() {
        return this.f3487g;
    }

    public final s m0() {
        return this.f3485e;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.n(parcel, 1, this.f3485e, i4, false);
        i1.c.c(parcel, 2, k0());
        i1.c.c(parcel, 3, l0());
        i1.c.j(parcel, 4, i0(), false);
        i1.c.i(parcel, 5, h0());
        i1.c.j(parcel, 6, j0(), false);
        i1.c.b(parcel, a4);
    }
}
