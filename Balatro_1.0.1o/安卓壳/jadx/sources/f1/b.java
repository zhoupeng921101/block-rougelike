package f1;

import e1.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b {

    /* renamed from: a, reason: collision with root package name */
    private final int f3203a;

    /* renamed from: b, reason: collision with root package name */
    private final e1.a f3204b;

    /* renamed from: c, reason: collision with root package name */
    private final a.d f3205c;

    /* renamed from: d, reason: collision with root package name */
    private final String f3206d;

    private b(e1.a aVar, a.d dVar, String str) {
        this.f3204b = aVar;
        this.f3205c = dVar;
        this.f3206d = str;
        this.f3203a = h1.o.b(aVar, dVar, str);
    }

    public static b a(e1.a aVar, a.d dVar, String str) {
        return new b(aVar, dVar, str);
    }

    public final String b() {
        return this.f3204b.c();
    }

    public final boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof b)) {
            return false;
        }
        b bVar = (b) obj;
        return h1.o.a(this.f3204b, bVar.f3204b) && h1.o.a(this.f3205c, bVar.f3205c) && h1.o.a(this.f3206d, bVar.f3206d);
    }

    public final int hashCode() {
        return this.f3203a;
    }
}
