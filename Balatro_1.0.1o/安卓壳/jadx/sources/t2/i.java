package t2;

import java.io.Serializable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i implements Serializable {

    /* renamed from: e, reason: collision with root package name */
    public static final a f4994e = new a(null);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b implements Serializable {

        /* renamed from: e, reason: collision with root package name */
        public final Throwable f4995e;

        public b(Throwable th) {
            b3.f.e(th, "exception");
            this.f4995e = th;
        }

        public boolean equals(Object obj) {
            return (obj instanceof b) && b3.f.a(this.f4995e, ((b) obj).f4995e);
        }

        public int hashCode() {
            return this.f4995e.hashCode();
        }

        public String toString() {
            return "Failure(" + this.f4995e + ')';
        }
    }

    public static Object a(Object obj) {
        return obj;
    }

    public static final boolean b(Object obj) {
        return obj instanceof b;
    }
}
