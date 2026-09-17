package f2;

import android.content.Intent;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends i1.a implements e1.k {
    public static final Parcelable.Creator<b> CREATOR = new c();

    /* renamed from: e, reason: collision with root package name */
    final int f3328e;

    /* renamed from: f, reason: collision with root package name */
    private int f3329f;

    /* renamed from: g, reason: collision with root package name */
    private Intent f3330g;

    b(int i4, int i5, Intent intent) {
        this.f3328e = i4;
        this.f3329f = i5;
        this.f3330g = intent;
    }

    @Override // e1.k
    public final Status H() {
        return this.f3329f == 0 ? Status.f2559j : Status.f2563n;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int i5 = this.f3328e;
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, i5);
        i1.c.i(parcel, 2, this.f3329f);
        i1.c.n(parcel, 3, this.f3330g, i4, false);
        i1.c.b(parcel, a4);
    }
}
