package k0;

import android.content.Context;
import java.util.Collections;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class t implements s {

    /* renamed from: e, reason: collision with root package name */
    private static volatile u f3974e;

    /* renamed from: a, reason: collision with root package name */
    private final u0.a f3975a;

    /* renamed from: b, reason: collision with root package name */
    private final u0.a f3976b;

    /* renamed from: c, reason: collision with root package name */
    private final q0.e f3977c;

    /* renamed from: d, reason: collision with root package name */
    private final r0.r f3978d;

    t(u0.a aVar, u0.a aVar2, q0.e eVar, r0.r rVar, r0.v vVar) {
        this.f3975a = aVar;
        this.f3976b = aVar2;
        this.f3977c = eVar;
        this.f3978d = rVar;
        vVar.c();
    }

    private i b(n nVar) {
        return i.a().i(this.f3975a.a()).k(this.f3976b.a()).j(nVar.g()).h(new h(nVar.b(), nVar.d())).g(nVar.c().a()).d();
    }

    public static t c() {
        u uVar = f3974e;
        if (uVar != null) {
            return uVar.b();
        }
        throw new IllegalStateException("Not initialized!");
    }

    private static Set d(f fVar) {
        return fVar instanceof g ? Collections.unmodifiableSet(((g) fVar).a()) : Collections.singleton(i0.b.b("proto"));
    }

    public static void f(Context context) {
        if (f3974e == null) {
            synchronized (t.class) {
                try {
                    if (f3974e == null) {
                        f3974e = e.c().a(context).build();
                    }
                } catch (Throwable th) {
                    throw th;
                }
            }
        }
    }

    @Override // k0.s
    public void a(n nVar, i0.h hVar) {
        this.f3977c.a(nVar.f().f(nVar.c().c()), b(nVar), hVar);
    }

    public r0.r e() {
        return this.f3978d;
    }

    public i0.g g(f fVar) {
        return new p(d(fVar), o.a().b(fVar.getName()).c(fVar.getExtras()).a(), this);
    }
}
