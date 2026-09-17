package i0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b {

    /* renamed from: a, reason: collision with root package name */
    private final String f3611a;

    private b(String str) {
        if (str == null) {
            throw new NullPointerException("name is null");
        }
        this.f3611a = str;
    }

    public static b b(String str) {
        return new b(str);
    }

    public String a() {
        return this.f3611a;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof b) {
            return this.f3611a.equals(((b) obj).f3611a);
        }
        return false;
    }

    public int hashCode() {
        return this.f3611a.hashCode() ^ 1000003;
    }

    public String toString() {
        return "Encoding{name=\"" + this.f3611a + "\"}";
    }
}
