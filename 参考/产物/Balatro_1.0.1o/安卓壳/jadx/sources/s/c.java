package s;

import java.nio.ByteBuffer;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {

    /* renamed from: a, reason: collision with root package name */
    protected int f4870a;

    /* renamed from: b, reason: collision with root package name */
    protected ByteBuffer f4871b;

    /* renamed from: c, reason: collision with root package name */
    private int f4872c;

    /* renamed from: d, reason: collision with root package name */
    private int f4873d;

    /* renamed from: e, reason: collision with root package name */
    d f4874e = d.a();

    protected int a(int i4) {
        return i4 + this.f4871b.getInt(i4);
    }

    protected int b(int i4) {
        if (i4 < this.f4873d) {
            return this.f4871b.getShort(this.f4872c + i4);
        }
        return 0;
    }

    protected void c(int i4, ByteBuffer byteBuffer) {
        this.f4871b = byteBuffer;
        if (byteBuffer == null) {
            this.f4870a = 0;
            this.f4872c = 0;
            this.f4873d = 0;
        } else {
            this.f4870a = i4;
            int i5 = i4 - byteBuffer.getInt(i4);
            this.f4872c = i5;
            this.f4873d = this.f4871b.getShort(i5);
        }
    }

    protected int d(int i4) {
        int i5 = i4 + this.f4870a;
        return i5 + this.f4871b.getInt(i5) + 4;
    }

    protected int e(int i4) {
        int i5 = i4 + this.f4870a;
        return this.f4871b.getInt(i5 + this.f4871b.getInt(i5));
    }
}
