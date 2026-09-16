package r0;

import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b extends f {

    /* renamed from: a, reason: collision with root package name */
    private final u0.a f4754a;

    /* renamed from: b, reason: collision with root package name */
    private final Map f4755b;

    b(u0.a aVar, Map map) {
        if (aVar == null) {
            throw new NullPointerException("Null clock");
        }
        this.f4754a = aVar;
        if (map == null) {
            throw new NullPointerException("Null values");
        }
        this.f4755b = map;
    }

    @Override // r0.f
    u0.a e() {
        return this.f4754a;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof f) {
            f fVar = (f) obj;
            if (this.f4754a.equals(fVar.e()) && this.f4755b.equals(fVar.h())) {
                return true;
            }
        }
        return false;
    }

    @Override // r0.f
    Map h() {
        return this.f4755b;
    }

    public int hashCode() {
        return ((this.f4754a.hashCode() ^ 1000003) * 1000003) ^ this.f4755b.hashCode();
    }

    public String toString() {
        return "SchedulerConfig{clock=" + this.f4754a + ", values=" + this.f4755b + "}";
    }
}
