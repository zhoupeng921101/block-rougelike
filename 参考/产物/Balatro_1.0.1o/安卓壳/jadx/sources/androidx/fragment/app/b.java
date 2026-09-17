package androidx.fragment.app;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.Log;
import androidx.fragment.app.f0;
import androidx.lifecycle.g;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b implements Parcelable {
    public static final Parcelable.Creator<b> CREATOR = new a();

    /* renamed from: e, reason: collision with root package name */
    final int[] f1335e;

    /* renamed from: f, reason: collision with root package name */
    final ArrayList f1336f;

    /* renamed from: g, reason: collision with root package name */
    final int[] f1337g;

    /* renamed from: h, reason: collision with root package name */
    final int[] f1338h;

    /* renamed from: i, reason: collision with root package name */
    final int f1339i;

    /* renamed from: j, reason: collision with root package name */
    final String f1340j;

    /* renamed from: k, reason: collision with root package name */
    final int f1341k;

    /* renamed from: l, reason: collision with root package name */
    final int f1342l;

    /* renamed from: m, reason: collision with root package name */
    final CharSequence f1343m;

    /* renamed from: n, reason: collision with root package name */
    final int f1344n;

    /* renamed from: o, reason: collision with root package name */
    final CharSequence f1345o;

    /* renamed from: p, reason: collision with root package name */
    final ArrayList f1346p;

    /* renamed from: q, reason: collision with root package name */
    final ArrayList f1347q;

    /* renamed from: r, reason: collision with root package name */
    final boolean f1348r;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Parcelable.Creator {
        a() {
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public b createFromParcel(Parcel parcel) {
            return new b(parcel);
        }

        @Override // android.os.Parcelable.Creator
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public b[] newArray(int i4) {
            return new b[i4];
        }
    }

    b(Parcel parcel) {
        this.f1335e = parcel.createIntArray();
        this.f1336f = parcel.createStringArrayList();
        this.f1337g = parcel.createIntArray();
        this.f1338h = parcel.createIntArray();
        this.f1339i = parcel.readInt();
        this.f1340j = parcel.readString();
        this.f1341k = parcel.readInt();
        this.f1342l = parcel.readInt();
        Parcelable.Creator creator = TextUtils.CHAR_SEQUENCE_CREATOR;
        this.f1343m = (CharSequence) creator.createFromParcel(parcel);
        this.f1344n = parcel.readInt();
        this.f1345o = (CharSequence) creator.createFromParcel(parcel);
        this.f1346p = parcel.createStringArrayList();
        this.f1347q = parcel.createStringArrayList();
        this.f1348r = parcel.readInt() != 0;
    }

    b(androidx.fragment.app.a aVar) {
        int size = aVar.f1447c.size();
        this.f1335e = new int[size * 6];
        if (!aVar.f1453i) {
            throw new IllegalStateException("Not on back stack");
        }
        this.f1336f = new ArrayList(size);
        this.f1337g = new int[size];
        this.f1338h = new int[size];
        int i4 = 0;
        for (int i5 = 0; i5 < size; i5++) {
            f0.a aVar2 = (f0.a) aVar.f1447c.get(i5);
            int i6 = i4 + 1;
            this.f1335e[i4] = aVar2.f1464a;
            ArrayList arrayList = this.f1336f;
            Fragment fragment = aVar2.f1465b;
            arrayList.add(fragment != null ? fragment.f1272f : null);
            int[] iArr = this.f1335e;
            iArr[i6] = aVar2.f1466c ? 1 : 0;
            iArr[i4 + 2] = aVar2.f1467d;
            iArr[i4 + 3] = aVar2.f1468e;
            int i7 = i4 + 5;
            iArr[i4 + 4] = aVar2.f1469f;
            i4 += 6;
            iArr[i7] = aVar2.f1470g;
            this.f1337g[i5] = aVar2.f1471h.ordinal();
            this.f1338h[i5] = aVar2.f1472i.ordinal();
        }
        this.f1339i = aVar.f1452h;
        this.f1340j = aVar.f1455k;
        this.f1341k = aVar.f1325v;
        this.f1342l = aVar.f1456l;
        this.f1343m = aVar.f1457m;
        this.f1344n = aVar.f1458n;
        this.f1345o = aVar.f1459o;
        this.f1346p = aVar.f1460p;
        this.f1347q = aVar.f1461q;
        this.f1348r = aVar.f1462r;
    }

    private void o(androidx.fragment.app.a aVar) {
        int i4 = 0;
        int i5 = 0;
        while (true) {
            boolean z3 = true;
            if (i4 >= this.f1335e.length) {
                aVar.f1452h = this.f1339i;
                aVar.f1455k = this.f1340j;
                aVar.f1453i = true;
                aVar.f1456l = this.f1342l;
                aVar.f1457m = this.f1343m;
                aVar.f1458n = this.f1344n;
                aVar.f1459o = this.f1345o;
                aVar.f1460p = this.f1346p;
                aVar.f1461q = this.f1347q;
                aVar.f1462r = this.f1348r;
                return;
            }
            f0.a aVar2 = new f0.a();
            int i6 = i4 + 1;
            aVar2.f1464a = this.f1335e[i4];
            if (x.G0(2)) {
                Log.v(c3.d4(1354), "Instantiate " + aVar + " op #" + i5 + " base fragment #" + this.f1335e[i6]);
            }
            aVar2.f1471h = g.c.values()[this.f1337g[i5]];
            aVar2.f1472i = g.c.values()[this.f1338h[i5]];
            int[] iArr = this.f1335e;
            int i7 = i4 + 2;
            if (iArr[i6] == 0) {
                z3 = false;
            }
            aVar2.f1466c = z3;
            int i8 = iArr[i7];
            aVar2.f1467d = i8;
            int i9 = iArr[i4 + 3];
            aVar2.f1468e = i9;
            int i10 = i4 + 5;
            int i11 = iArr[i4 + 4];
            aVar2.f1469f = i11;
            i4 += 6;
            int i12 = iArr[i10];
            aVar2.f1470g = i12;
            aVar.f1448d = i8;
            aVar.f1449e = i9;
            aVar.f1450f = i11;
            aVar.f1451g = i12;
            aVar.e(aVar2);
            i5++;
        }
    }

    @Override // android.os.Parcelable
    public int describeContents() {
        return 0;
    }

    public androidx.fragment.app.a q(x xVar) {
        androidx.fragment.app.a aVar = new androidx.fragment.app.a(xVar);
        o(aVar);
        aVar.f1325v = this.f1341k;
        for (int i4 = 0; i4 < this.f1336f.size(); i4++) {
            String str = (String) this.f1336f.get(i4);
            if (str != null) {
                ((f0.a) aVar.f1447c.get(i4)).f1465b = xVar.e0(str);
            }
        }
        aVar.n(1);
        return aVar;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        parcel.writeIntArray(this.f1335e);
        parcel.writeStringList(this.f1336f);
        parcel.writeIntArray(this.f1337g);
        parcel.writeIntArray(this.f1338h);
        parcel.writeInt(this.f1339i);
        parcel.writeString(this.f1340j);
        parcel.writeInt(this.f1341k);
        parcel.writeInt(this.f1342l);
        TextUtils.writeToParcel(this.f1343m, parcel, 0);
        parcel.writeInt(this.f1344n);
        TextUtils.writeToParcel(this.f1345o, parcel, 0);
        parcel.writeStringList(this.f1346p);
        parcel.writeStringList(this.f1347q);
        parcel.writeInt(this.f1348r ? 1 : 0);
    }
}
