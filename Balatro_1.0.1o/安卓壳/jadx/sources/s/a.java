package s;

import java.nio.ByteBuffer;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends c {
    public a f(int i4, ByteBuffer byteBuffer) {
        g(i4, byteBuffer);
        return this;
    }

    public void g(int i4, ByteBuffer byteBuffer) {
        c(i4, byteBuffer);
    }

    public int h(int i4) {
        int b4 = b(16);
        if (b4 != 0) {
            return this.f4871b.getInt(d(b4) + (i4 * 4));
        }
        return 0;
    }

    public int i() {
        int b4 = b(16);
        if (b4 != 0) {
            return e(b4);
        }
        return 0;
    }

    public boolean j() {
        int b4 = b(6);
        return (b4 == 0 || this.f4871b.get(b4 + this.f4870a) == 0) ? false : true;
    }

    public short k() {
        int b4 = b(14);
        if (b4 != 0) {
            return this.f4871b.getShort(b4 + this.f4870a);
        }
        return (short) 0;
    }

    public int l() {
        int b4 = b(4);
        if (b4 != 0) {
            return this.f4871b.getInt(b4 + this.f4870a);
        }
        return 0;
    }

    public short m() {
        int b4 = b(8);
        if (b4 != 0) {
            return this.f4871b.getShort(b4 + this.f4870a);
        }
        return (short) 0;
    }

    public short n() {
        int b4 = b(12);
        if (b4 != 0) {
            return this.f4871b.getShort(b4 + this.f4870a);
        }
        return (short) 0;
    }
}
