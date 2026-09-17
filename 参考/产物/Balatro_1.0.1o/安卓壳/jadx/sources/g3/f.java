package g3;

import java.util.Iterator;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f extends e {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a implements b {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ Iterator f3389a;

        public a(Iterator it) {
            this.f3389a = it;
        }

        @Override // g3.b
        public Iterator iterator() {
            return this.f3389a;
        }
    }

    public static b a(Iterator it) {
        b3.f.e(it, "<this>");
        return b(new a(it));
    }

    public static final b b(b bVar) {
        b3.f.e(bVar, "<this>");
        return bVar instanceof g3.a ? bVar : new g3.a(bVar);
    }
}
