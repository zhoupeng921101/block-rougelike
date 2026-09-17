package h1;

import com.google.android.gms.common.api.Status;
import e1.g;
import h1.p;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j0 implements g.a {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ e1.g f3531a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ g2.i f3532b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ p.a f3533c;

    /* renamed from: d, reason: collision with root package name */
    final /* synthetic */ l0 f3534d;

    j0(e1.g gVar, g2.i iVar, p.a aVar, l0 l0Var) {
        this.f3531a = gVar;
        this.f3532b = iVar;
        this.f3533c = aVar;
        this.f3534d = l0Var;
    }

    @Override // e1.g.a
    public final void a(Status status) {
        if (!status.m0()) {
            this.f3532b.b(b.a(status));
        } else {
            this.f3532b.c(this.f3533c.a(this.f3531a.d(0L, TimeUnit.MILLISECONDS)));
        }
    }
}
