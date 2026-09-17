package r0;

import java.util.Iterator;
import java.util.concurrent.Executor;
import t0.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class v {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f4818a;

    /* renamed from: b, reason: collision with root package name */
    private final s0.d f4819b;

    /* renamed from: c, reason: collision with root package name */
    private final x f4820c;

    /* renamed from: d, reason: collision with root package name */
    private final t0.b f4821d;

    v(Executor executor, s0.d dVar, x xVar, t0.b bVar) {
        this.f4818a = executor;
        this.f4819b = dVar;
        this.f4820c = xVar;
        this.f4821d = bVar;
    }

    public static /* synthetic */ Object a(v vVar) {
        Iterator it = vVar.f4819b.I().iterator();
        while (it.hasNext()) {
            vVar.f4820c.b((k0.o) it.next(), 1);
        }
        return null;
    }

    public void c() {
        this.f4818a.execute(new Runnable() { // from class: r0.t
            @Override // java.lang.Runnable
            public final void run() {
                r0.f4821d.a(new b.a() { // from class: r0.u
                    @Override // t0.b.a
                    public final Object a() {
                        return v.a(v.this);
                    }
                });
            }
        });
    }
}
