package androidx.emoji2.text;

import a1.b2.c3;
import android.graphics.Typeface;
import android.util.SparseArray;
import java.nio.ByteBuffer;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m {

    /* renamed from: a, reason: collision with root package name */
    private final s.b f1251a;

    /* renamed from: b, reason: collision with root package name */
    private final char[] f1252b;

    /* renamed from: c, reason: collision with root package name */
    private final a f1253c = new a(1024);

    /* renamed from: d, reason: collision with root package name */
    private final Typeface f1254d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {

        /* renamed from: a, reason: collision with root package name */
        private final SparseArray f1255a;

        /* renamed from: b, reason: collision with root package name */
        private g f1256b;

        private a() {
            this(1);
        }

        a(int i4) {
            this.f1255a = new SparseArray(i4);
        }

        a a(int i4) {
            SparseArray sparseArray = this.f1255a;
            if (sparseArray == null) {
                return null;
            }
            return (a) sparseArray.get(i4);
        }

        final g b() {
            return this.f1256b;
        }

        void c(g gVar, int i4, int i5) {
            a a4 = a(gVar.b(i4));
            if (a4 == null) {
                a4 = new a();
                this.f1255a.put(gVar.b(i4), a4);
            }
            if (i5 > i4) {
                a4.c(gVar, i4 + 1, i5);
            } else {
                a4.f1256b = gVar;
            }
        }
    }

    private m(Typeface typeface, s.b bVar) {
        this.f1254d = typeface;
        this.f1251a = bVar;
        this.f1252b = new char[bVar.k() * 2];
        a(bVar);
    }

    private void a(s.b bVar) {
        int k4 = bVar.k();
        for (int i4 = 0; i4 < k4; i4++) {
            g gVar = new g(this, i4);
            Character.toChars(gVar.f(), this.f1252b, i4 * 2);
            h(gVar);
        }
    }

    public static m b(Typeface typeface, ByteBuffer byteBuffer) {
        try {
            androidx.core.os.g.a("EmojiCompat.MetadataRepo.create");
            return new m(typeface, l.b(byteBuffer));
        } finally {
            androidx.core.os.g.b();
        }
    }

    public char[] c() {
        return this.f1252b;
    }

    public s.b d() {
        return this.f1251a;
    }

    int e() {
        return this.f1251a.l();
    }

    a f() {
        return this.f1253c;
    }

    Typeface g() {
        return this.f1254d;
    }

    void h(g gVar) {
        androidx.core.util.c.e(gVar, c3.d4(278));
        androidx.core.util.c.a(gVar.c() > 0, "invalid metadata codepoint length");
        this.f1253c.c(gVar, 0, gVar.c() - 1);
    }
}
