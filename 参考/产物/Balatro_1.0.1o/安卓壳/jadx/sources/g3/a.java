package g3;

import a1.b2.c3;
import java.util.Iterator;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a implements b {

    /* renamed from: a, reason: collision with root package name */
    private final AtomicReference f3388a;

    public a(b bVar) {
        b3.f.e(bVar, c3.d4(839));
        this.f3388a = new AtomicReference(bVar);
    }

    @Override // g3.b
    public Iterator iterator() {
        b bVar = (b) this.f3388a.getAndSet(null);
        if (bVar != null) {
            return bVar.iterator();
        }
        throw new IllegalStateException("This sequence can be consumed only once.");
    }
}
