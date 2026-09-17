package t2;

import java.io.Serializable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h implements Serializable {

    /* renamed from: e, reason: collision with root package name */
    private final Object f4992e;

    /* renamed from: f, reason: collision with root package name */
    private final Object f4993f;

    public h(Object obj, Object obj2) {
        this.f4992e = obj;
        this.f4993f = obj2;
    }

    public final Object a() {
        return this.f4992e;
    }

    public final Object b() {
        return this.f4993f;
    }

    public final Object c() {
        return this.f4992e;
    }

    public final Object d() {
        return this.f4993f;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof h)) {
            return false;
        }
        h hVar = (h) obj;
        return b3.f.a(this.f4992e, hVar.f4992e) && b3.f.a(this.f4993f, hVar.f4993f);
    }

    public int hashCode() {
        Object obj = this.f4992e;
        int hashCode = (obj == null ? 0 : obj.hashCode()) * 31;
        Object obj2 = this.f4993f;
        return hashCode + (obj2 != null ? obj2.hashCode() : 0);
    }

    public String toString() {
        return '(' + this.f4992e + ", " + this.f4993f + ')';
    }
}
