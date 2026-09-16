package h1;

import android.os.Parcel;
import android.os.Parcelable;
import java.util.ArrayList;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class t extends i1.a {
    public static final Parcelable.Creator<t> CREATOR = new x();

    /* renamed from: e, reason: collision with root package name */
    private final int f3583e;

    /* renamed from: f, reason: collision with root package name */
    private List f3584f;

    public t(int i4, List list) {
        this.f3583e = i4;
        this.f3584f = list;
    }

    public final int h0() {
        return this.f3583e;
    }

    public final List i0() {
        return this.f3584f;
    }

    public final void j0(n nVar) {
        if (this.f3584f == null) {
            this.f3584f = new ArrayList();
        }
        this.f3584f.add(nVar);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f3583e);
        i1.c.s(parcel, 2, this.f3584f, false);
        i1.c.b(parcel, a4);
    }
}
