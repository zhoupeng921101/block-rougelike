package j0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h extends n {

    /* renamed from: a, reason: collision with root package name */
    private final long f3764a;

    h(long j4) {
        this.f3764a = j4;
    }

    @Override // j0.n
    public long c() {
        return this.f3764a;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        return (obj instanceof n) && this.f3764a == ((n) obj).c();
    }

    public int hashCode() {
        long j4 = this.f3764a;
        return ((int) (j4 ^ (j4 >>> 32))) ^ 1000003;
    }

    public String toString() {
        return "LogResponse{nextRequestWaitMillis=" + this.f3764a + "}";
    }
}
