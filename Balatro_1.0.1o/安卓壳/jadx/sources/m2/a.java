package m2;

import m2.d;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: a, reason: collision with root package name */
    private int f4173a;

    /* renamed from: b, reason: collision with root package name */
    private d.a f4174b = d.a.DEFAULT;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: m2.a$a, reason: collision with other inner class name */
    private static final class C0059a implements d {

        /* renamed from: a, reason: collision with root package name */
        private final int f4175a;

        /* renamed from: b, reason: collision with root package name */
        private final d.a f4176b;

        C0059a(int i4, d.a aVar) {
            this.f4175a = i4;
            this.f4176b = aVar;
        }

        @Override // java.lang.annotation.Annotation
        public Class annotationType() {
            return d.class;
        }

        @Override // java.lang.annotation.Annotation
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof d)) {
                return false;
            }
            d dVar = (d) obj;
            return this.f4175a == dVar.tag() && this.f4176b.equals(dVar.intEncoding());
        }

        @Override // java.lang.annotation.Annotation
        public int hashCode() {
            return (14552422 ^ this.f4175a) + (this.f4176b.hashCode() ^ 2041407134);
        }

        @Override // m2.d
        public d.a intEncoding() {
            return this.f4176b;
        }

        @Override // m2.d
        public int tag() {
            return this.f4175a;
        }

        @Override // java.lang.annotation.Annotation
        public String toString() {
            return "@com.google.firebase.encoders.proto.Protobuf(tag=" + this.f4175a + "intEncoding=" + this.f4176b + ')';
        }
    }

    public static a b() {
        return new a();
    }

    public d a() {
        return new C0059a(this.f4173a, this.f4174b);
    }

    public a c(int i4) {
        this.f4173a = i4;
        return this;
    }
}
