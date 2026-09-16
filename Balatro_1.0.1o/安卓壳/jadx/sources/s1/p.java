package s1;

import android.content.ComponentName;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class p extends i1.a {
    public static final Parcelable.Creator<p> CREATOR = new q();

    /* renamed from: e, reason: collision with root package name */
    private final long f4955e;

    /* renamed from: f, reason: collision with root package name */
    private final String f4956f;

    /* renamed from: g, reason: collision with root package name */
    private final int f4957g;

    /* renamed from: h, reason: collision with root package name */
    private final ComponentName f4958h;

    /* renamed from: i, reason: collision with root package name */
    private final String f4959i;

    p(long j4, String str, int i4, ComponentName componentName, String str2) {
        this.f4955e = j4;
        this.f4956f = str;
        this.f4957g = i4;
        this.f4958h = componentName;
        this.f4959i = str2;
    }

    public final String b() {
        return this.f4959i;
    }

    public final int h0() {
        return this.f4957g;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.l(parcel, 1, this.f4955e);
        i1.c.o(parcel, 2, this.f4956f, false);
        i1.c.i(parcel, 3, this.f4957g);
        i1.c.n(parcel, 4, this.f4958h, i4, false);
        i1.c.o(parcel, 5, this.f4959i, false);
        i1.c.b(parcel, a4);
    }
}
