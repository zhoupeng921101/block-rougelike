package e3;

import java.util.NoSuchElementException;
import u2.v;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends v {

    /* renamed from: e, reason: collision with root package name */
    private final int f3184e;

    /* renamed from: f, reason: collision with root package name */
    private final int f3185f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f3186g;

    /* renamed from: h, reason: collision with root package name */
    private int f3187h;

    public b(int i4, int i5, int i6) {
        this.f3184e = i6;
        this.f3185f = i5;
        boolean z3 = false;
        if (i6 <= 0 ? i4 >= i5 : i4 <= i5) {
            z3 = true;
        }
        this.f3186g = z3;
        this.f3187h = z3 ? i4 : i5;
    }

    @Override // java.util.Iterator
    public boolean hasNext() {
        return this.f3186g;
    }

    @Override // u2.v
    public int nextInt() {
        int i4 = this.f3187h;
        if (i4 != this.f3185f) {
            this.f3187h = this.f3184e + i4;
            return i4;
        }
        if (!this.f3186g) {
            throw new NoSuchElementException();
        }
        this.f3186g = false;
        return i4;
    }
}
