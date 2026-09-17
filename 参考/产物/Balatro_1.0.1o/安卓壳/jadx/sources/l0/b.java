package l0;

import a1.b2.c3;
import l0.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b extends g {

    /* renamed from: a, reason: collision with root package name */
    private final g.a f4119a;

    /* renamed from: b, reason: collision with root package name */
    private final long f4120b;

    b(g.a aVar, long j4) {
        if (aVar == null) {
            throw new NullPointerException("Null status");
        }
        this.f4119a = aVar;
        this.f4120b = j4;
    }

    @Override // l0.g
    public long b() {
        return this.f4120b;
    }

    @Override // l0.g
    public g.a c() {
        return this.f4119a;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof g) {
            g gVar = (g) obj;
            if (this.f4119a.equals(gVar.c()) && this.f4120b == gVar.b()) {
                return true;
            }
        }
        return false;
    }

    public int hashCode() {
        int hashCode = (this.f4119a.hashCode() ^ 1000003) * 1000003;
        long j4 = this.f4120b;
        return hashCode ^ ((int) (j4 ^ (j4 >>> 32)));
    }

    public String toString() {
        return "BackendResponse{status=" + this.f4119a + ", nextRequestWaitMillis=" + this.f4120b + c3.d4(261);
    }
}
