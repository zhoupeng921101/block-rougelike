package g1;

import h1.q;
import java.util.Iterator;
import java.util.NoSuchElementException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c implements Iterator {

    /* renamed from: e, reason: collision with root package name */
    protected final b f3340e;

    /* renamed from: f, reason: collision with root package name */
    protected int f3341f = -1;

    public c(b bVar) {
        this.f3340e = (b) q.i(bVar);
    }

    @Override // java.util.Iterator
    public final boolean hasNext() {
        return this.f3341f < this.f3340e.getCount() + (-1);
    }

    @Override // java.util.Iterator
    public Object next() {
        if (hasNext()) {
            b bVar = this.f3340e;
            int i4 = this.f3341f + 1;
            this.f3341f = i4;
            return bVar.get(i4);
        }
        throw new NoSuchElementException("Cannot advance the iterator beyond " + this.f3341f);
    }

    @Override // java.util.Iterator
    public final void remove() {
        throw new UnsupportedOperationException("Cannot remove elements from a DataBufferIterator");
    }
}
