package f1;

import f1.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class y implements c.a {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ f f3325a;

    y(f fVar) {
        this.f3325a = fVar;
    }

    @Override // f1.c.a
    public final void a(boolean z3) {
        f fVar = this.f3325a;
        fVar.f3252n.sendMessage(fVar.f3252n.obtainMessage(1, Boolean.valueOf(z3)));
    }
}
