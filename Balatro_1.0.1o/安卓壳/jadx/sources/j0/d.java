package j0;

import a1.b2.c3;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class d extends j {

    /* renamed from: a, reason: collision with root package name */
    private final List f3731a;

    d(List list) {
        if (list == null) {
            throw new NullPointerException("Null logRequests");
        }
        this.f3731a = list;
    }

    @Override // j0.j
    public List c() {
        return this.f3731a;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof j) {
            return this.f3731a.equals(((j) obj).c());
        }
        return false;
    }

    public int hashCode() {
        return this.f3731a.hashCode() ^ 1000003;
    }

    public String toString() {
        return c3.d4(157) + this.f3731a + "}";
    }
}
