package x0;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends i1.a {
    public static final Parcelable.Creator<d> CREATOR = new e();

    /* renamed from: e, reason: collision with root package name */
    private final String f5104e;

    /* renamed from: f, reason: collision with root package name */
    private final String f5105f;

    public d(String str, String str2) {
        this.f5104e = str;
        this.f5105f = str2;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, this.f5104e, false);
        i1.c.o(parcel, 2, this.f5105f, false);
        i1.c.b(parcel, a4);
    }
}
