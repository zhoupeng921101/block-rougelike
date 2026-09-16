package androidx.fragment.app;

import a1.b2.c3;
import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;
import androidx.lifecycle.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c0 implements Parcelable {
    public static final Parcelable.Creator<c0> CREATOR = new a();

    /* renamed from: e, reason: collision with root package name */
    final String f1351e;

    /* renamed from: f, reason: collision with root package name */
    final String f1352f;

    /* renamed from: g, reason: collision with root package name */
    final boolean f1353g;

    /* renamed from: h, reason: collision with root package name */
    final int f1354h;

    /* renamed from: i, reason: collision with root package name */
    final int f1355i;

    /* renamed from: j, reason: collision with root package name */
    final String f1356j;

    /* renamed from: k, reason: collision with root package name */
    final boolean f1357k;

    /* renamed from: l, reason: collision with root package name */
    final boolean f1358l;

    /* renamed from: m, reason: collision with root package name */
    final boolean f1359m;

    /* renamed from: n, reason: collision with root package name */
    final Bundle f1360n;

    /* renamed from: o, reason: collision with root package name */
    final boolean f1361o;

    /* renamed from: p, reason: collision with root package name */
    final int f1362p;

    /* renamed from: q, reason: collision with root package name */
    Bundle f1363q;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Parcelable.Creator {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public c0 createFromParcel(Parcel parcel) {
            return new c0(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public c0[] newArray(int i4) {
            return new c0[i4];
        }
    }

    c0(Parcel parcel) {
        this.f1351e = parcel.readString();
        this.f1352f = parcel.readString();
        this.f1353g = parcel.readInt() != 0;
        this.f1354h = parcel.readInt();
        this.f1355i = parcel.readInt();
        this.f1356j = parcel.readString();
        this.f1357k = parcel.readInt() != 0;
        this.f1358l = parcel.readInt() != 0;
        this.f1359m = parcel.readInt() != 0;
        this.f1360n = parcel.readBundle();
        this.f1361o = parcel.readInt() != 0;
        this.f1363q = parcel.readBundle();
        this.f1362p = parcel.readInt();
    }

    c0(Fragment fragment) {
        this.f1351e = fragment.getClass().getName();
        this.f1352f = fragment.f1272f;
        this.f1353g = fragment.f1281o;
        this.f1354h = fragment.f1290x;
        this.f1355i = fragment.f1291y;
        this.f1356j = fragment.f1292z;
        this.f1357k = fragment.C;
        this.f1358l = fragment.f1279m;
        this.f1359m = fragment.B;
        this.f1360n = fragment.f1273g;
        this.f1361o = fragment.A;
        this.f1362p = fragment.S.ordinal();
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    Fragment o(o oVar, ClassLoader classLoader) {
        Fragment a4 = oVar.a(classLoader, this.f1351e);
        Bundle bundle = this.f1360n;
        if (bundle != null) {
            bundle.setClassLoader(classLoader);
        }
        a4.t1(this.f1360n);
        a4.f1272f = this.f1352f;
        a4.f1281o = this.f1353g;
        a4.f1283q = true;
        a4.f1290x = this.f1354h;
        a4.f1291y = this.f1355i;
        a4.f1292z = this.f1356j;
        a4.C = this.f1357k;
        a4.f1279m = this.f1358l;
        a4.B = this.f1359m;
        a4.A = this.f1361o;
        a4.S = g.c.values()[this.f1362p];
        Bundle bundle2 = this.f1363q;
        if (bundle2 != null) {
            a4.f1267b = bundle2;
            return a4;
        }
        a4.f1267b = new Bundle();
        return a4;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(128);
        sb.append("FragmentState{");
        sb.append(this.f1351e);
        sb.append(c3.d4(822));
        sb.append(this.f1352f);
        sb.append(c3.d4(1210));
        if (this.f1353g) {
            sb.append(" fromLayout");
        }
        if (this.f1355i != 0) {
            sb.append(" id=0x");
            sb.append(Integer.toHexString(this.f1355i));
        }
        String str = this.f1356j;
        if (str != null && !str.isEmpty()) {
            sb.append(" tag=");
            sb.append(this.f1356j);
        }
        if (this.f1357k) {
            sb.append(" retainInstance");
        }
        if (this.f1358l) {
            sb.append(" removing");
        }
        if (this.f1359m) {
            sb.append(c3.d4(1483));
        }
        if (this.f1361o) {
            sb.append(" hidden");
        }
        return sb.toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        parcel.writeString(this.f1351e);
        parcel.writeString(this.f1352f);
        parcel.writeInt(this.f1353g ? 1 : 0);
        parcel.writeInt(this.f1354h);
        parcel.writeInt(this.f1355i);
        parcel.writeString(this.f1356j);
        parcel.writeInt(this.f1357k ? 1 : 0);
        parcel.writeInt(this.f1358l ? 1 : 0);
        parcel.writeInt(this.f1359m ? 1 : 0);
        parcel.writeBundle(this.f1360n);
        parcel.writeInt(this.f1361o ? 1 : 0);
        parcel.writeBundle(this.f1363q);
        parcel.writeInt(this.f1362p);
    }
}
