package f1;

import e1.a;
import f1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class t0 extends q {

    /* renamed from: d, reason: collision with root package name */
    final /* synthetic */ q.a f3313d;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    t0(q.a aVar, d1.c[] cVarArr, boolean z3, int i4) {
        super(cVarArr, z3, i4);
        this.f3313d = aVar;
    }

    @Override // f1.q
    protected final void b(a.b bVar, g2.i iVar) {
        m mVar;
        mVar = this.f3313d.f3295a;
        mVar.accept(bVar, iVar);
    }
}
