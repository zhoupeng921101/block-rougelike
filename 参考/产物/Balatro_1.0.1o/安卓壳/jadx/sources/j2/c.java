package j2;

import java.lang.annotation.Annotation;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: a, reason: collision with root package name */
    private final String f3831a;

    /* renamed from: b, reason: collision with root package name */
    private final Map f3832b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private final String f3833a;

        /* renamed from: b, reason: collision with root package name */
        private Map f3834b = null;

        b(String str) {
            this.f3833a = str;
        }

        public c a() {
            return new c(this.f3833a, this.f3834b == null ? Collections.EMPTY_MAP : Collections.unmodifiableMap(new HashMap(this.f3834b)));
        }

        public b b(Annotation annotation) {
            if (this.f3834b == null) {
                this.f3834b = new HashMap();
            }
            this.f3834b.put(annotation.annotationType(), annotation);
            return this;
        }
    }

    private c(String str, Map map) {
        this.f3831a = str;
        this.f3832b = map;
    }

    public static b a(String str) {
        return new b(str);
    }

    public static c d(String str) {
        return new c(str, Collections.EMPTY_MAP);
    }

    public String b() {
        return this.f3831a;
    }

    public Annotation c(Class cls) {
        return (Annotation) this.f3832b.get(cls);
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof c)) {
            return false;
        }
        c cVar = (c) obj;
        return this.f3831a.equals(cVar.f3831a) && this.f3832b.equals(cVar.f3832b);
    }

    public int hashCode() {
        return (this.f3831a.hashCode() * 31) + this.f3832b.hashCode();
    }

    public String toString() {
        return "FieldDescriptor{name=" + this.f3831a + ", properties=" + this.f3832b.values() + "}";
    }
}
