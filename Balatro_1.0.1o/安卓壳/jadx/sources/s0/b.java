package s0;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b extends k {

    /* renamed from: a, reason: collision with root package name */
    private final long f4889a;

    /* renamed from: b, reason: collision with root package name */
    private final k0.o f4890b;

    /* renamed from: c, reason: collision with root package name */
    private final k0.i f4891c;

    b(long j4, k0.o oVar, k0.i iVar) {
        this.f4889a = j4;
        if (oVar == null) {
            throw new NullPointerException("Null transportContext");
        }
        this.f4890b = oVar;
        if (iVar == null) {
            throw new NullPointerException(c3.d4(756));
        }
        this.f4891c = iVar;
    }

    @Override // s0.k
    public k0.i b() {
        return this.f4891c;
    }

    @Override // s0.k
    public long c() {
        return this.f4889a;
    }

    @Override // s0.k
    public k0.o d() {
        return this.f4890b;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof k) {
            k kVar = (k) obj;
            if (this.f4889a == kVar.c() && this.f4890b.equals(kVar.d()) && this.f4891c.equals(kVar.b())) {
                return true;
            }
        }
        return false;
    }

    public int hashCode() {
        long j4 = this.f4889a;
        return ((((((int) (j4 ^ (j4 >>> 32))) ^ 1000003) * 1000003) ^ this.f4890b.hashCode()) * 1000003) ^ this.f4891c.hashCode();
    }

    public String toString() {
        return "PersistedEvent{id=" + this.f4889a + ", transportContext=" + this.f4890b + c3.d4(1011) + this.f4891c + "}";
    }
}
