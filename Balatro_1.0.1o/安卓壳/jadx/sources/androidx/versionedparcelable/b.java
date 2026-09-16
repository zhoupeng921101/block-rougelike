package androidx.versionedparcelable;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.SparseIntArray;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class b extends a {

    /* renamed from: d, reason: collision with root package name */
    private final SparseIntArray f1763d;

    /* renamed from: e, reason: collision with root package name */
    private final Parcel f1764e;

    /* renamed from: f, reason: collision with root package name */
    private final int f1765f;

    /* renamed from: g, reason: collision with root package name */
    private final int f1766g;

    /* renamed from: h, reason: collision with root package name */
    private final String f1767h;

    /* renamed from: i, reason: collision with root package name */
    private int f1768i;

    /* renamed from: j, reason: collision with root package name */
    private int f1769j;

    /* renamed from: k, reason: collision with root package name */
    private int f1770k;

    b(Parcel parcel) {
        this(parcel, parcel.dataPosition(), parcel.dataSize(), c3.d4(1214), new k.a(), new k.a(), new k.a());
    }

    private b(Parcel parcel, int i4, int i5, String str, k.a aVar, k.a aVar2, k.a aVar3) {
        super(aVar, aVar2, aVar3);
        this.f1763d = new SparseIntArray();
        this.f1768i = -1;
        this.f1770k = -1;
        this.f1764e = parcel;
        this.f1765f = i4;
        this.f1766g = i5;
        this.f1769j = i4;
        this.f1767h = str;
    }

    @Override // androidx.versionedparcelable.a
    public void A(byte[] bArr) {
        if (bArr == null) {
            this.f1764e.writeInt(-1);
        } else {
            this.f1764e.writeInt(bArr.length);
            this.f1764e.writeByteArray(bArr);
        }
    }

    @Override // androidx.versionedparcelable.a
    protected void C(CharSequence charSequence) {
        TextUtils.writeToParcel(charSequence, this.f1764e, 0);
    }

    @Override // androidx.versionedparcelable.a
    public void E(int i4) {
        this.f1764e.writeInt(i4);
    }

    @Override // androidx.versionedparcelable.a
    public void G(Parcelable parcelable) {
        this.f1764e.writeParcelable(parcelable, 0);
    }

    @Override // androidx.versionedparcelable.a
    public void I(String str) {
        this.f1764e.writeString(str);
    }

    @Override // androidx.versionedparcelable.a
    public void a() {
        int i4 = this.f1768i;
        if (i4 >= 0) {
            int i5 = this.f1763d.get(i4);
            int dataPosition = this.f1764e.dataPosition();
            this.f1764e.setDataPosition(i5);
            this.f1764e.writeInt(dataPosition - i5);
            this.f1764e.setDataPosition(dataPosition);
        }
    }

    @Override // androidx.versionedparcelable.a
    protected a b() {
        Parcel parcel = this.f1764e;
        int dataPosition = parcel.dataPosition();
        int i4 = this.f1769j;
        if (i4 == this.f1765f) {
            i4 = this.f1766g;
        }
        return new b(parcel, dataPosition, i4, this.f1767h + "  ", this.f1760a, this.f1761b, this.f1762c);
    }

    @Override // androidx.versionedparcelable.a
    public boolean g() {
        return this.f1764e.readInt() != 0;
    }

    @Override // androidx.versionedparcelable.a
    public byte[] i() {
        int readInt = this.f1764e.readInt();
        if (readInt < 0) {
            return null;
        }
        byte[] bArr = new byte[readInt];
        this.f1764e.readByteArray(bArr);
        return bArr;
    }

    @Override // androidx.versionedparcelable.a
    protected CharSequence k() {
        return (CharSequence) TextUtils.CHAR_SEQUENCE_CREATOR.createFromParcel(this.f1764e);
    }

    @Override // androidx.versionedparcelable.a
    public boolean m(int i4) {
        while (this.f1769j < this.f1766g) {
            int i5 = this.f1770k;
            if (i5 == i4) {
                return true;
            }
            if (String.valueOf(i5).compareTo(String.valueOf(i4)) > 0) {
                return false;
            }
            this.f1764e.setDataPosition(this.f1769j);
            int readInt = this.f1764e.readInt();
            this.f1770k = this.f1764e.readInt();
            this.f1769j += readInt;
        }
        return this.f1770k == i4;
    }

    @Override // androidx.versionedparcelable.a
    public int o() {
        return this.f1764e.readInt();
    }

    @Override // androidx.versionedparcelable.a
    public Parcelable q() {
        return this.f1764e.readParcelable(getClass().getClassLoader());
    }

    @Override // androidx.versionedparcelable.a
    public String s() {
        return this.f1764e.readString();
    }

    @Override // androidx.versionedparcelable.a
    public void w(int i4) {
        a();
        this.f1768i = i4;
        this.f1763d.put(i4, this.f1764e.dataPosition());
        E(0);
        E(i4);
    }

    @Override // androidx.versionedparcelable.a
    public void y(boolean z3) {
        this.f1764e.writeInt(z3 ? 1 : 0);
    }
}
