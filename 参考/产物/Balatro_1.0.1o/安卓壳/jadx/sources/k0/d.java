package k0;

import a1.b2.c3;
import java.util.Arrays;
import k0.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class d extends o {

    /* renamed from: a, reason: collision with root package name */
    private final String f3940a;

    /* renamed from: b, reason: collision with root package name */
    private final byte[] f3941b;

    /* renamed from: c, reason: collision with root package name */
    private final i0.d f3942c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends o.a {

        /* renamed from: a, reason: collision with root package name */
        private String f3943a;

        /* renamed from: b, reason: collision with root package name */
        private byte[] f3944b;

        /* renamed from: c, reason: collision with root package name */
        private i0.d f3945c;

        b() {
        }

        @Override // k0.o.a
        public o a() {
            String str = this.f3943a;
            String d4 = c3.d4(530);
            if (str == null) {
                d4 = d4 + " backendName";
            }
            if (this.f3945c == null) {
                d4 = d4 + c3.d4(1499);
            }
            if (d4.isEmpty()) {
                return new d(this.f3943a, this.f3944b, this.f3945c);
            }
            throw new IllegalStateException(c3.d4(1043) + d4);
        }

        @Override // k0.o.a
        public o.a b(String str) {
            if (str == null) {
                throw new NullPointerException("Null backendName");
            }
            this.f3943a = str;
            return this;
        }

        @Override // k0.o.a
        public o.a c(byte[] bArr) {
            this.f3944b = bArr;
            return this;
        }

        @Override // k0.o.a
        public o.a d(i0.d dVar) {
            if (dVar == null) {
                throw new NullPointerException("Null priority");
            }
            this.f3945c = dVar;
            return this;
        }
    }

    private d(String str, byte[] bArr, i0.d dVar) {
        this.f3940a = str;
        this.f3941b = bArr;
        this.f3942c = dVar;
    }

    @Override // k0.o
    public String b() {
        return this.f3940a;
    }

    @Override // k0.o
    public byte[] c() {
        return this.f3941b;
    }

    @Override // k0.o
    public i0.d d() {
        return this.f3942c;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof o) {
            o oVar = (o) obj;
            if (this.f3940a.equals(oVar.b())) {
                if (Arrays.equals(this.f3941b, oVar instanceof d ? ((d) oVar).f3941b : oVar.c()) && this.f3942c.equals(oVar.d())) {
                    return true;
                }
            }
        }
        return false;
    }

    public int hashCode() {
        return ((((this.f3940a.hashCode() ^ 1000003) * 1000003) ^ Arrays.hashCode(this.f3941b)) * 1000003) ^ this.f3942c.hashCode();
    }
}
