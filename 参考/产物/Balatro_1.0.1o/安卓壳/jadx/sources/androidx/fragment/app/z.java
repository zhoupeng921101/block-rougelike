package androidx.fragment.app;

import android.os.Parcel;
import android.os.Parcelable;
import androidx.fragment.app.x;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class z implements Parcelable {
    public static final Parcelable.Creator<z> CREATOR = new a();

    /* renamed from: e, reason: collision with root package name */
    ArrayList f1612e;

    /* renamed from: f, reason: collision with root package name */
    ArrayList f1613f;

    /* renamed from: g, reason: collision with root package name */
    b[] f1614g;

    /* renamed from: h, reason: collision with root package name */
    int f1615h;

    /* renamed from: i, reason: collision with root package name */
    String f1616i;

    /* renamed from: j, reason: collision with root package name */
    ArrayList f1617j;

    /* renamed from: k, reason: collision with root package name */
    ArrayList f1618k;

    /* renamed from: l, reason: collision with root package name */
    ArrayList f1619l;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Parcelable.Creator {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public z createFromParcel(Parcel parcel) {
            return new z(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public z[] newArray(int i4) {
            return new z[i4];
        }
    }

    public z() {
        this.f1616i = null;
        this.f1617j = new ArrayList();
        this.f1618k = new ArrayList();
    }

    public z(Parcel parcel) {
        this.f1616i = null;
        this.f1617j = new ArrayList();
        this.f1618k = new ArrayList();
        this.f1612e = parcel.createStringArrayList();
        this.f1613f = parcel.createStringArrayList();
        this.f1614g = (b[]) parcel.createTypedArray(b.CREATOR);
        this.f1615h = parcel.readInt();
        this.f1616i = parcel.readString();
        this.f1617j = parcel.createStringArrayList();
        this.f1618k = parcel.createTypedArrayList(c.CREATOR);
        this.f1619l = parcel.createTypedArrayList(x.k.CREATOR);
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        parcel.writeStringList(this.f1612e);
        parcel.writeStringList(this.f1613f);
        parcel.writeTypedArray(this.f1614g, i4);
        parcel.writeInt(this.f1615h);
        parcel.writeString(this.f1616i);
        parcel.writeStringList(this.f1617j);
        parcel.writeTypedList(this.f1618k);
        parcel.writeTypedList(this.f1619l);
    }
}
