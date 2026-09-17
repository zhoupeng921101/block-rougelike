package c2;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n2 extends i1.a {
    public static final Parcelable.Creator<n2> CREATOR = new o2();

    /* renamed from: e, reason: collision with root package name */
    private final String f2147e;

    n2(String str) {
        this.f2147e = str;
    }

    public final String a() {
        return this.f2147e;
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof n2) {
            return h1.o.a(this.f2147e, ((n2) obj).f2147e);
        }
        return false;
    }

    public final int hashCode() {
        return h1.o.b(this.f2147e);
    }

    public final String toString() {
        return h1.o.c(this).a("gameRunToken", this.f2147e).toString();
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String str = this.f2147e;
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, str, false);
        i1.c.b(parcel, a4);
    }
}
