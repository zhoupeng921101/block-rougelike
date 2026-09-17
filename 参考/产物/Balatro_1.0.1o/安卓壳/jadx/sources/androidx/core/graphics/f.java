package androidx.core.graphics;

import android.graphics.Insets;
import android.graphics.Rect;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f {

    /* renamed from: e, reason: collision with root package name */
    public static final f f911e = new f(0, 0, 0, 0);

    /* renamed from: a, reason: collision with root package name */
    public final int f912a;

    /* renamed from: b, reason: collision with root package name */
    public final int f913b;

    /* renamed from: c, reason: collision with root package name */
    public final int f914c;

    /* renamed from: d, reason: collision with root package name */
    public final int f915d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static Insets a(int i4, int i5, int i6, int i7) {
            return Insets.of(i4, i5, i6, i7);
        }
    }

    private f(int i4, int i5, int i6, int i7) {
        this.f912a = i4;
        this.f913b = i5;
        this.f914c = i6;
        this.f915d = i7;
    }

    public static f a(f fVar, f fVar2) {
        return b(Math.max(fVar.f912a, fVar2.f912a), Math.max(fVar.f913b, fVar2.f913b), Math.max(fVar.f914c, fVar2.f914c), Math.max(fVar.f915d, fVar2.f915d));
    }

    public static f b(int i4, int i5, int i6, int i7) {
        return (i4 == 0 && i5 == 0 && i6 == 0 && i7 == 0) ? f911e : new f(i4, i5, i6, i7);
    }

    public static f c(Rect rect) {
        return b(rect.left, rect.top, rect.right, rect.bottom);
    }

    public static f d(Insets insets) {
        int i4;
        int i5;
        int i6;
        int i7;
        i4 = insets.left;
        i5 = insets.top;
        i6 = insets.right;
        i7 = insets.bottom;
        return b(i4, i5, i6, i7);
    }

    public Insets e() {
        return a.a(this.f912a, this.f913b, this.f914c, this.f915d);
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || f.class != obj.getClass()) {
            return false;
        }
        f fVar = (f) obj;
        return this.f915d == fVar.f915d && this.f912a == fVar.f912a && this.f914c == fVar.f914c && this.f913b == fVar.f913b;
    }

    public int hashCode() {
        return (((((this.f912a * 31) + this.f913b) * 31) + this.f914c) * 31) + this.f915d;
    }

    public String toString() {
        return "Insets{left=" + this.f912a + ", top=" + this.f913b + ", right=" + this.f914c + ", bottom=" + this.f915d + '}';
    }
}
