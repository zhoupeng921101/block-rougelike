package v1;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.data.BitmapTeleporter;
import h1.q;
import q1.r;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h extends r implements g {
    public static final Parcelable.Creator<h> CREATOR = new m();

    /* renamed from: e, reason: collision with root package name */
    private final String f5055e;

    /* renamed from: f, reason: collision with root package name */
    private final Long f5056f;

    /* renamed from: g, reason: collision with root package name */
    private final Uri f5057g;

    /* renamed from: h, reason: collision with root package name */
    private BitmapTeleporter f5058h;

    /* renamed from: i, reason: collision with root package name */
    private final Long f5059i;

    h(String str, Long l3, BitmapTeleporter bitmapTeleporter, Uri uri, Long l4) {
        this.f5055e = str;
        this.f5056f = l3;
        this.f5058h = bitmapTeleporter;
        this.f5057g = uri;
        this.f5059i = l4;
        boolean z3 = true;
        if (bitmapTeleporter != null && uri != null) {
            z3 = false;
        }
        q.l(z3, "Cannot set both a URI and an image");
    }

    @Override // v1.g
    public final BitmapTeleporter a() {
        return this.f5058h;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String str = this.f5055e;
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, str, false);
        i1.c.m(parcel, 2, this.f5056f, false);
        i1.c.n(parcel, 4, this.f5057g, i4, false);
        i1.c.n(parcel, 5, this.f5058h, i4, false);
        i1.c.m(parcel, 6, this.f5059i, false);
        i1.c.b(parcel, a4);
    }
}
