package androidx.activity.result;

import a1.b2.c3;
import android.content.Intent;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a implements Parcelable {
    public static final Parcelable.Creator<a> CREATOR = new C0001a();

    /* renamed from: e, reason: collision with root package name */
    private final int f99e;

    /* renamed from: f, reason: collision with root package name */
    private final Intent f100f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.activity.result.a$a, reason: collision with other inner class name */
    class C0001a implements Parcelable.Creator {
        C0001a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public a createFromParcel(Parcel parcel) {
            return new a(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public a[] newArray(int i4) {
            return new a[i4];
        }
    }

    public a(int i4, Intent intent) {
        this.f99e = i4;
        this.f100f = intent;
    }

    a(Parcel parcel) {
        this.f99e = parcel.readInt();
        this.f100f = parcel.readInt() == 0 ? null : (Intent) Intent.CREATOR.createFromParcel(parcel);
    }

    public static String v(int i4) {
        return i4 != -1 ? i4 != 0 ? String.valueOf(i4) : c3.d4(609) : "RESULT_OK";
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public Intent o() {
        return this.f100f;
    }

    public int q() {
        return this.f99e;
    }

    public String toString() {
        return "ActivityResult{resultCode=" + v(this.f99e) + ", data=" + this.f100f + '}';
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        parcel.writeInt(this.f99e);
        parcel.writeInt(this.f100f == null ? 0 : 1);
        Intent intent = this.f100f;
        if (intent != null) {
            intent.writeToParcel(parcel, i4);
        }
    }
}
