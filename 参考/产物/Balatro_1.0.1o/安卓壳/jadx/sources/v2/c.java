package v2;

import a1.b2.c3;
import a3.p;
import b3.g;
import java.io.Serializable;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c implements e, Serializable {

    /* renamed from: e, reason: collision with root package name */
    private final e f5078e;

    /* renamed from: f, reason: collision with root package name */
    private final e.b f5079f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class a extends g implements p {

        /* renamed from: f, reason: collision with root package name */
        public static final a f5080f = new a();

        a() {
            super(2);
        }

        @Override // a3.p
        /* renamed from: d, reason: merged with bridge method [inline-methods] */
        public final String b(String str, e.b bVar) {
            b3.f.e(str, c3.d4(1015));
            b3.f.e(bVar, "element");
            if (str.length() == 0) {
                return bVar.toString();
            }
            return str + ", " + bVar;
        }
    }

    public c(e eVar, e.b bVar) {
        b3.f.e(eVar, "left");
        b3.f.e(bVar, "element");
        this.f5078e = eVar;
        this.f5079f = bVar;
    }

    private final boolean a(e.b bVar) {
        return b3.f.a(get(bVar.getKey()), bVar);
    }

    private final boolean b(c cVar) {
        while (a(cVar.f5079f)) {
            e eVar = cVar.f5078e;
            if (!(eVar instanceof c)) {
                b3.f.c(eVar, "null cannot be cast to non-null type kotlin.coroutines.CoroutineContext.Element");
                return a((e.b) eVar);
            }
            cVar = (c) eVar;
        }
        return false;
    }

    private final int c() {
        int i4 = 2;
        c cVar = this;
        while (true) {
            e eVar = cVar.f5078e;
            cVar = eVar instanceof c ? (c) eVar : null;
            if (cVar == null) {
                return i4;
            }
            i4++;
        }
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof c)) {
            return false;
        }
        c cVar = (c) obj;
        return cVar.c() == c() && cVar.b(this);
    }

    @Override // v2.e
    public Object fold(Object obj, p pVar) {
        b3.f.e(pVar, "operation");
        return pVar.b(this.f5078e.fold(obj, pVar), this.f5079f);
    }

    @Override // v2.e
    public e.b get(e.c cVar) {
        b3.f.e(cVar, "key");
        c cVar2 = this;
        while (true) {
            e.b bVar = cVar2.f5079f.get(cVar);
            if (bVar != null) {
                return bVar;
            }
            e eVar = cVar2.f5078e;
            if (!(eVar instanceof c)) {
                return eVar.get(cVar);
            }
            cVar2 = (c) eVar;
        }
    }

    public int hashCode() {
        return this.f5078e.hashCode() + this.f5079f.hashCode();
    }

    @Override // v2.e
    public e minusKey(e.c cVar) {
        b3.f.e(cVar, c3.d4(860));
        if (this.f5079f.get(cVar) != null) {
            return this.f5078e;
        }
        e minusKey = this.f5078e.minusKey(cVar);
        return minusKey == this.f5078e ? this : minusKey == f.f5084e ? this.f5079f : new c(minusKey, this.f5079f);
    }

    public String toString() {
        return '[' + ((String) fold("", a.f5080f)) + ']';
    }
}
