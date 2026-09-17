package n1;

import android.os.Parcel;
import android.os.ParcelFileDescriptor;
import android.os.Parcelable;
import com.google.android.gms.drive.DriveId;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends i1.a {
    public static final Parcelable.Creator<a> CREATOR = new b();

    /* renamed from: e, reason: collision with root package name */
    final ParcelFileDescriptor f4244e;

    /* renamed from: f, reason: collision with root package name */
    final int f4245f;

    /* renamed from: g, reason: collision with root package name */
    final int f4246g;

    /* renamed from: h, reason: collision with root package name */
    final DriveId f4247h;

    /* renamed from: i, reason: collision with root package name */
    final boolean f4248i;

    /* renamed from: j, reason: collision with root package name */
    final String f4249j;

    public a(ParcelFileDescriptor parcelFileDescriptor, int i4, int i5, DriveId driveId, boolean z3, String str) {
        this.f4244e = parcelFileDescriptor;
        this.f4245f = i4;
        this.f4246g = i5;
        this.f4247h = driveId;
        this.f4248i = z3;
        this.f4249j = str;
    }

    public ParcelFileDescriptor h0() {
        return this.f4244e;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        ParcelFileDescriptor parcelFileDescriptor = this.f4244e;
        int a4 = i1.c.a(parcel);
        i1.c.n(parcel, 2, parcelFileDescriptor, i4, false);
        i1.c.i(parcel, 3, this.f4245f);
        i1.c.i(parcel, 4, this.f4246g);
        i1.c.n(parcel, 5, this.f4247h, i4, false);
        i1.c.c(parcel, 7, this.f4248i);
        i1.c.o(parcel, 8, this.f4249j, false);
        i1.c.b(parcel, a4);
    }
}
