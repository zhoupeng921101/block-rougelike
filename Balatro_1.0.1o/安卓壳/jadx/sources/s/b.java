package s;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends c {
    public static b h(ByteBuffer byteBuffer) {
        return i(byteBuffer, new b());
    }

    public static b i(ByteBuffer byteBuffer, b bVar) {
        byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
        return bVar.f(byteBuffer.getInt(byteBuffer.position()) + byteBuffer.position(), byteBuffer);
    }

    public b f(int i4, ByteBuffer byteBuffer) {
        g(i4, byteBuffer);
        return this;
    }

    public void g(int i4, ByteBuffer byteBuffer) {
        c(i4, byteBuffer);
    }

    public a j(a aVar, int i4) {
        int b4 = b(6);
        if (b4 != 0) {
            return aVar.f(a(d(b4) + (i4 * 4)), this.f4871b);
        }
        return null;
    }

    public int k() {
        int b4 = b(6);
        if (b4 != 0) {
            return e(b4);
        }
        return 0;
    }

    public int l() {
        int b4 = b(4);
        if (b4 != 0) {
            return this.f4871b.getInt(b4 + this.f4870a);
        }
        return 0;
    }
}
