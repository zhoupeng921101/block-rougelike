package v1;

import a1.b2.c3;
import android.net.Uri;
import android.os.Parcel;
import com.google.android.gms.common.data.DataHolder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j extends g1.d implements e {

    /* renamed from: h, reason: collision with root package name */
    private final p1.d f5074h;

    /* renamed from: i, reason: collision with root package name */
    private final p1.j f5075i;

    public j(DataHolder dataHolder, int i4) {
        super(dataHolder, i4);
        this.f5074h = new com.google.android.gms.games.a(dataHolder, i4);
        this.f5075i = new com.google.android.gms.games.b(dataHolder, i4, null);
    }

    @Override // v1.e
    public final long E() {
        return y(c3.d4(1260));
    }

    @Override // v1.e
    public final boolean G() {
        return v("pending_change_count") > 0;
    }

    @Override // v1.e
    public final long W() {
        return y("progress_value");
    }

    @Override // v1.e
    public final float X() {
        float q3 = q(c3.d4(712));
        float q4 = q(c3.d4(410));
        if (q3 == 0.0f) {
            return 0.0f;
        }
        return q4 / q3;
    }

    @Override // v1.e
    public final String a() {
        return H(c3.d4(1150));
    }

    @Override // v1.e
    public final String b0() {
        return H("unique_name");
    }

    @Override // android.os.Parcelable
    public final int describeContents() {
        return 0;
    }

    public final boolean equals(Object obj) {
        return i.i0(this, obj);
    }

    @Override // v1.e
    public final String f0() {
        return H("external_snapshot_id");
    }

    @Override // v1.e
    public final p1.d g0() {
        return this.f5074h;
    }

    @Override // v1.e
    public String getCoverImageUrl() {
        return H("cover_icon_image_url");
    }

    public final int hashCode() {
        return i.h0(this);
    }

    @Override // v1.e
    public final String i() {
        return H("description");
    }

    @Override // v1.e
    public final String n() {
        return H(c3.d4(497));
    }

    @Override // v1.e
    public final Uri t() {
        return Q("cover_icon_image_uri");
    }

    public final String toString() {
        return i.j0(this);
    }

    @Override // v1.e
    public final long w() {
        return y("duration");
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        new i(this).writeToParcel(parcel, i4);
    }

    @Override // v1.e
    public final p1.j x() {
        return this.f5075i;
    }
}
