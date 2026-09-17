package b2;

import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g extends i {

    /* renamed from: h, reason: collision with root package name */
    private final transient i f1805h;

    g(i iVar) {
        this.f1805h = iVar;
    }

    private final int p(int i4) {
        return (this.f1805h.size() - 1) - i4;
    }

    @Override // b2.i, java.util.AbstractCollection, java.util.Collection, java.util.List
    public final boolean contains(Object obj) {
        return this.f1805h.contains(obj);
    }

    @Override // java.util.List
    public final Object get(int i4) {
        i iVar = this.f1805h;
        s.b(i4, iVar.size(), "index");
        return iVar.get(p(i4));
    }

    @Override // b2.i
    public final i h() {
        return this.f1805h;
    }

    @Override // b2.i
    /* renamed from: i */
    public final i subList(int i4, int i5) {
        i iVar = this.f1805h;
        s.d(i4, i5, iVar.size());
        return iVar.subList(iVar.size() - i5, iVar.size() - i4).h();
    }

    @Override // b2.i, java.util.List
    public final int indexOf(Object obj) {
        int lastIndexOf = this.f1805h.lastIndexOf(obj);
        if (lastIndexOf >= 0) {
            return p(lastIndexOf);
        }
        return -1;
    }

    @Override // b2.i, java.util.List
    public final int lastIndexOf(Object obj) {
        int indexOf = this.f1805h.indexOf(obj);
        if (indexOf >= 0) {
            return p(indexOf);
        }
        return -1;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f1805h.size();
    }

    @Override // b2.i, java.util.List
    public final /* bridge */ /* synthetic */ List subList(int i4, int i5) {
        return subList(i4, i5);
    }
}
