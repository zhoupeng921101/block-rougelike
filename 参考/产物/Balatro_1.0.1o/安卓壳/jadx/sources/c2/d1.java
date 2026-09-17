package c2;

import f1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d1 implements p1.p {

    /* renamed from: a, reason: collision with root package name */
    private final h f2099a;

    public d1(h hVar) {
        this.f2099a = hVar;
    }

    @Override // p1.p
    public final g2.h a(final v1.a aVar) {
        return this.f2099a.b(new g() { // from class: c2.a1
            @Override // c2.g
            public final /* synthetic */ g2.h a(e1.e eVar) {
                q.a a4 = f1.q.a();
                final v1.a aVar2 = v1.a.this;
                return eVar.i(a4.b(new f1.m() { // from class: c2.v0
                    @Override // f1.m
                    public final /* synthetic */ void accept(Object obj, Object obj2) {
                        v1.b c02 = v1.a.this.c0();
                        h1.q.l(!c02.isClosed(), "Snapshot already closed");
                        n1.a a5 = c02.a();
                        c02.b();
                        ((q1.j) ((q1.d) obj).C()).V(a5);
                        ((g2.i) obj2).c(null);
                    }
                }).e(6723).a());
            }
        });
    }

    @Override // p1.p
    public final g2.h b(final v1.a aVar, final v1.g gVar) {
        return this.f2099a.b(new g() { // from class: c2.z0
            @Override // c2.g
            public final /* synthetic */ g2.h a(e1.e eVar) {
                q.a a4 = f1.q.a();
                final v1.a aVar2 = v1.a.this;
                final v1.g gVar2 = gVar;
                return eVar.i(a4.b(new f1.m() { // from class: c2.w0
                    @Override // f1.m
                    public final /* synthetic */ void accept(Object obj, Object obj2) {
                        ((q1.d) obj).m0((g2.i) obj2, v1.a.this, gVar2);
                    }
                }).e(6722).a());
            }
        });
    }

    @Override // p1.p
    public final g2.h c(final String str, final String str2, final v1.g gVar, final v1.b bVar) {
        return this.f2099a.b(new g() { // from class: c2.b1
            @Override // c2.g
            public final /* synthetic */ g2.h a(e1.e eVar) {
                q.a a4 = f1.q.a();
                final String str3 = str;
                final String str4 = str2;
                final v1.g gVar2 = gVar;
                final v1.b bVar2 = bVar;
                return eVar.i(a4.b(new f1.m() { // from class: c2.c1
                    @Override // f1.m
                    public final /* synthetic */ void accept(Object obj, Object obj2) {
                        ((q1.d) obj).n0((g2.i) obj2, str3, str4, gVar2, bVar2);
                    }
                }).e(6725).a());
            }
        });
    }

    @Override // p1.p
    public final g2.h d(final String str, final boolean z3, final int i4) {
        return this.f2099a.b(new g() { // from class: c2.y0
            @Override // c2.g
            public final /* synthetic */ g2.h a(e1.e eVar) {
                q.a a4 = f1.q.a();
                final String str2 = str;
                final boolean z4 = z3;
                final int i5 = i4;
                return eVar.i(a4.b(new f1.m() { // from class: c2.x0
                    @Override // f1.m
                    public final /* synthetic */ void accept(Object obj, Object obj2) {
                        ((q1.d) obj).l0((g2.i) obj2, str2, z4, i5);
                    }
                }).e(6721).a());
            }
        });
    }
}
