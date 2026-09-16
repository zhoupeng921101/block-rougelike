package androidx.emoji2.text;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class l {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a implements c {

        /* renamed from: a, reason: collision with root package name */
        private final ByteBuffer f1248a;

        a(ByteBuffer byteBuffer) {
            this.f1248a = byteBuffer;
            byteBuffer.order(ByteOrder.BIG_ENDIAN);
        }

        @Override // androidx.emoji2.text.l.c
        public void a(int i4) {
            ByteBuffer byteBuffer = this.f1248a;
            byteBuffer.position(byteBuffer.position() + i4);
        }

        @Override // androidx.emoji2.text.l.c
        public long b() {
            return l.c(this.f1248a.getInt());
        }

        @Override // androidx.emoji2.text.l.c
        public int c() {
            return this.f1248a.getInt();
        }

        @Override // androidx.emoji2.text.l.c
        public long getPosition() {
            return this.f1248a.position();
        }

        @Override // androidx.emoji2.text.l.c
        public int readUnsignedShort() {
            return l.d(this.f1248a.getShort());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class b {

        /* renamed from: a, reason: collision with root package name */
        private final long f1249a;

        /* renamed from: b, reason: collision with root package name */
        private final long f1250b;

        b(long j4, long j5) {
            this.f1249a = j4;
            this.f1250b = j5;
        }

        long a() {
            return this.f1249a;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private interface c {
        void a(int i4);

        long b();

        int c();

        long getPosition();

        int readUnsignedShort();
    }

    private static b a(c cVar) {
        long j4;
        cVar.a(4);
        int readUnsignedShort = cVar.readUnsignedShort();
        if (readUnsignedShort > 100) {
            throw new IOException("Cannot read metadata.");
        }
        cVar.a(6);
        int i4 = 0;
        while (true) {
            if (i4 >= readUnsignedShort) {
                j4 = -1;
                break;
            }
            int c4 = cVar.c();
            cVar.a(4);
            j4 = cVar.b();
            cVar.a(4);
            if (1835365473 == c4) {
                break;
            }
            i4++;
        }
        if (j4 != -1) {
            cVar.a((int) (j4 - cVar.getPosition()));
            cVar.a(12);
            long b4 = cVar.b();
            for (int i5 = 0; i5 < b4; i5++) {
                int c5 = cVar.c();
                long b5 = cVar.b();
                long b6 = cVar.b();
                if (1164798569 == c5 || 1701669481 == c5) {
                    return new b(b5 + j4, b6);
                }
            }
        }
        throw new IOException("Cannot read metadata.");
    }

    static s.b b(ByteBuffer byteBuffer) {
        ByteBuffer duplicate = byteBuffer.duplicate();
        duplicate.position((int) a(new a(duplicate)).a());
        return s.b.h(duplicate);
    }

    static long c(int i4) {
        return i4 & 4294967295L;
    }

    static int d(short s3) {
        return s3 & 65535;
    }
}
