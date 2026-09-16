package f2;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.api.Status;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h extends i1.a implements e1.k {
    public static final Parcelable.Creator<h> CREATOR = new i();

    /* renamed from: e, reason: collision with root package name */
    private final List f3331e;

    /* renamed from: f, reason: collision with root package name */
    private final String f3332f;

    public h(List list, String str) {
        this.f3331e = list;
        this.f3332f = str;
    }

    @Override // e1.k
    public final Status H() {
        return this.f3332f != null ? Status.f2559j : Status.f2563n;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        List list = this.f3331e;
        int a4 = i1.c.a(parcel);
        i1.c.q(parcel, 1, list, false);
        i1.c.o(parcel, 2, this.f3332f, false);
        i1.c.b(parcel, a4);
    }
}
