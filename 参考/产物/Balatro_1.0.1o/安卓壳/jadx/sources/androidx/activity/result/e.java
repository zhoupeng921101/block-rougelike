package androidx.activity.result;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e implements Parcelable {
    public static final Parcelable.Creator<e> CREATOR = new a();

    /* renamed from: e, reason: collision with root package name */
    private final IntentSender f101e;

    /* renamed from: f, reason: collision with root package name */
    private final Intent f102f;

    /* renamed from: g, reason: collision with root package name */
    private final int f103g;

    /* renamed from: h, reason: collision with root package name */
    private final int f104h;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Parcelable.Creator {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public e createFromParcel(Parcel parcel) {
            return new e(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public e[] newArray(int i4) {
            return new e[i4];
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private IntentSender f105a;

        /* renamed from: b, reason: collision with root package name */
        private Intent f106b;

        /* renamed from: c, reason: collision with root package name */
        private int f107c;

        /* renamed from: d, reason: collision with root package name */
        private int f108d;

        public b(PendingIntent pendingIntent) {
            this(pendingIntent.getIntentSender());
        }

        public b(IntentSender intentSender) {
            this.f105a = intentSender;
        }

        public e a() {
            return new e(this.f105a, this.f106b, this.f107c, this.f108d);
        }

        public b b(Intent intent) {
            this.f106b = intent;
            return this;
        }

        public b c(int i4, int i5) {
            this.f108d = i4;
            this.f107c = i5;
            return this;
        }
    }

    e(IntentSender intentSender, Intent intent, int i4, int i5) {
        this.f101e = intentSender;
        this.f102f = intent;
        this.f103g = i4;
        this.f104h = i5;
    }

    e(Parcel parcel) {
        this.f101e = (IntentSender) parcel.readParcelable(IntentSender.class.getClassLoader());
        this.f102f = (Intent) parcel.readParcelable(Intent.class.getClassLoader());
        this.f103g = parcel.readInt();
        this.f104h = parcel.readInt();
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public Intent o() {
        return this.f102f;
    }

    public int q() {
        return this.f103g;
    }

    public int v() {
        return this.f104h;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        parcel.writeParcelable(this.f101e, i4);
        parcel.writeParcelable(this.f102f, i4);
        parcel.writeInt(this.f103g);
        parcel.writeInt(this.f104h);
    }

    public IntentSender y() {
        return this.f101e;
    }
}
