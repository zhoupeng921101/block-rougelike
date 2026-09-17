package m2;

import java.io.OutputStream;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b extends OutputStream {

    /* renamed from: e, reason: collision with root package name */
    private long f4177e = 0;

    b() {
    }

    long a() {
        return this.f4177e;
    }

    @Override // java.io.OutputStream
    public void write(int i4) {
        this.f4177e++;
    }

    @Override // java.io.OutputStream
    public void write(byte[] bArr) {
        this.f4177e += bArr.length;
    }

    @Override // java.io.OutputStream
    public void write(byte[] bArr, int i4, int i5) {
        int i6;
        if (i4 < 0 || i4 > bArr.length || i5 < 0 || (i6 = i4 + i5) > bArr.length || i6 < 0) {
            throw new IndexOutOfBoundsException();
        }
        this.f4177e += i5;
    }
}
