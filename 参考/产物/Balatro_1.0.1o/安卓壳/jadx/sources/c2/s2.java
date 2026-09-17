package c2;

import a1.b2.c3;
import android.content.Intent;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s2 extends i1.a {
    public static final Parcelable.Creator<s2> CREATOR = new t2();

    /* renamed from: e, reason: collision with root package name */
    private final Intent f2169e;

    s2(Intent intent) {
        this.f2169e = intent;
    }

    public static s2 h0(Intent intent) {
        return new s2(intent);
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof s2) {
            return h1.o.a(this.f2169e, ((s2) obj).f2169e);
        }
        return false;
    }

    public final int hashCode() {
        Intent intent = this.f2169e;
        if (intent != null) {
            return intent.hashCode();
        }
        return 0;
    }

    public final String toString() {
        return h1.o.c(this).a(c3.d4(1218), this.f2169e).toString();
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        Intent intent = this.f2169e;
        int a4 = i1.c.a(parcel);
        i1.c.n(parcel, 1, intent, i4, false);
        i1.c.b(parcel, a4);
    }
}
