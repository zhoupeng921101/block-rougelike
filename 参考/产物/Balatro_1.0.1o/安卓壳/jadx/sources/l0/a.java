package l0;

import a1.b2.c3;
import java.util.Arrays;
import l0.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a extends f {

    /* renamed from: a, reason: collision with root package name */
    private final Iterable f4115a;

    /* renamed from: b, reason: collision with root package name */
    private final byte[] f4116b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends f.a {

        /* renamed from: a, reason: collision with root package name */
        private Iterable f4117a;

        /* renamed from: b, reason: collision with root package name */
        private byte[] f4118b;

        b() {
        }

        @Override // l0.f.a
        public f a() {
            Iterable iterable = this.f4117a;
            String d4 = c3.d4(1380);
            if (iterable == null) {
                d4 = d4 + " events";
            }
            if (d4.isEmpty()) {
                return new a(this.f4117a, this.f4118b);
            }
            throw new IllegalStateException("Missing required properties:" + d4);
        }

        @Override // l0.f.a
        public f.a b(Iterable iterable) {
            if (iterable == null) {
                throw new NullPointerException("Null events");
            }
            this.f4117a = iterable;
            return this;
        }

        @Override // l0.f.a
        public f.a c(byte[] bArr) {
            this.f4118b = bArr;
            return this;
        }
    }

    private a(Iterable iterable, byte[] bArr) {
        this.f4115a = iterable;
        this.f4116b = bArr;
    }

    @Override // l0.f
    public Iterable b() {
        return this.f4115a;
    }

    @Override // l0.f
    public byte[] c() {
        return this.f4116b;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof f) {
            f fVar = (f) obj;
            if (this.f4115a.equals(fVar.b())) {
                if (Arrays.equals(this.f4116b, fVar instanceof a ? ((a) fVar).f4116b : fVar.c())) {
                    return true;
                }
            }
        }
        return false;
    }

    public int hashCode() {
        return ((this.f4115a.hashCode() ^ 1000003) * 1000003) ^ Arrays.hashCode(this.f4116b);
    }

    public String toString() {
        return c3.d4(1381) + this.f4115a + ", extras=" + Arrays.toString(this.f4116b) + "}";
    }
}
