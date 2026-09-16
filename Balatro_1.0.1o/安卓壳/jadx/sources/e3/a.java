package e3;

import a1.b2.c3;
import u2.v;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements Iterable {

    /* renamed from: h, reason: collision with root package name */
    public static final C0044a f3180h = new C0044a(null);

    /* renamed from: e, reason: collision with root package name */
    private final int f3181e;

    /* renamed from: f, reason: collision with root package name */
    private final int f3182f;

    /* renamed from: g, reason: collision with root package name */
    private final int f3183g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: e3.a$a, reason: collision with other inner class name */
    public static final class C0044a {
        private C0044a() {
        }

        public /* synthetic */ C0044a(b3.d dVar) {
            this();
        }
    }

    public a(int i4, int i5, int i6) {
        if (i6 == 0) {
            throw new IllegalArgumentException(c3.d4(632));
        }
        if (i6 == Integer.MIN_VALUE) {
            throw new IllegalArgumentException("Step must be greater than Int.MIN_VALUE to avoid overflow on negation.");
        }
        this.f3181e = i4;
        this.f3182f = w2.c.b(i4, i5, i6);
        this.f3183g = i6;
    }

    public final int a() {
        return this.f3181e;
    }

    public final int e() {
        return this.f3182f;
    }

    @Override // java.lang.Iterable
    /* renamed from: f, reason: merged with bridge method [inline-methods] */
    public v iterator() {
        return new b(this.f3181e, this.f3182f, this.f3183g);
    }
}
