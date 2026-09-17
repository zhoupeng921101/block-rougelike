package h1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class n extends i1.a {
    public static final Parcelable.Creator<n> CREATOR = new h0();

    /* renamed from: e, reason: collision with root package name */
    private final int f3550e;

    /* renamed from: f, reason: collision with root package name */
    private final int f3551f;

    /* renamed from: g, reason: collision with root package name */
    private final int f3552g;

    /* renamed from: h, reason: collision with root package name */
    private final long f3553h;

    /* renamed from: i, reason: collision with root package name */
    private final long f3554i;

    /* renamed from: j, reason: collision with root package name */
    private final String f3555j;

    /* renamed from: k, reason: collision with root package name */
    private final String f3556k;

    /* renamed from: l, reason: collision with root package name */
    private final int f3557l;

    /* renamed from: m, reason: collision with root package name */
    private final int f3558m;

    public n(int i4, int i5, int i6, long j4, long j5, String str, String str2, int i7, int i8) {
        this.f3550e = i4;
        this.f3551f = i5;
        this.f3552g = i6;
        this.f3553h = j4;
        this.f3554i = j5;
        this.f3555j = str;
        this.f3556k = str2;
        this.f3557l = i7;
        this.f3558m = i8;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int i5 = this.f3550e;
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, i5);
        i1.c.i(parcel, 2, this.f3551f);
        i1.c.i(parcel, 3, this.f3552g);
        i1.c.l(parcel, 4, this.f3553h);
        i1.c.l(parcel, 5, this.f3554i);
        i1.c.o(parcel, 6, this.f3555j, false);
        i1.c.o(parcel, 7, this.f3556k, false);
        i1.c.i(parcel, 8, this.f3557l);
        i1.c.i(parcel, 9, this.f3558m);
        i1.c.b(parcel, a4);
    }
}
