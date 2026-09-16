package e3;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c extends e3.a {

    /* renamed from: i, reason: collision with root package name */
    public static final a f3188i = new a(null);

    /* renamed from: j, reason: collision with root package name */
    private static final c f3189j = new c(1, 0);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }
    }

    public c(int i4, int i5) {
        super(i4, i5, 1);
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof c)) {
            return false;
        }
        if (isEmpty() && ((c) obj).isEmpty()) {
            return true;
        }
        c cVar = (c) obj;
        return a() == cVar.a() && e() == cVar.e();
    }

    public boolean g(int i4) {
        return a() <= i4 && i4 <= e();
    }

    public int hashCode() {
        if (isEmpty()) {
            return -1;
        }
        return (a() * 31) + e();
    }

    public boolean isEmpty() {
        return a() > e();
    }

    public String toString() {
        return a() + c3.d4(633) + e();
    }
}
