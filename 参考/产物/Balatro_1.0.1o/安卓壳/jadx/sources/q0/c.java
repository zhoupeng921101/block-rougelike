package q0;

import a1.b2.c3;
import java.util.concurrent.Executor;
import java.util.logging.Logger;
import k0.o;
import k0.t;
import l0.m;
import r0.x;
import t0.b;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c implements e {

    /* renamed from: f, reason: collision with root package name */
    private static final Logger f4704f = Logger.getLogger(t.class.getName());

    /* renamed from: a, reason: collision with root package name */
    private final x f4705a;

    /* renamed from: b, reason: collision with root package name */
    private final Executor f4706b;

    /* renamed from: c, reason: collision with root package name */
    private final l0.e f4707c;

    /* renamed from: d, reason: collision with root package name */
    private final s0.d f4708d;

    /* renamed from: e, reason: collision with root package name */
    private final t0.b f4709e;

    public c(Executor executor, l0.e eVar, x xVar, s0.d dVar, t0.b bVar) {
        this.f4706b = executor;
        this.f4707c = eVar;
        this.f4705a = xVar;
        this.f4708d = dVar;
        this.f4709e = bVar;
    }

    public static /* synthetic */ Object b(c cVar, o oVar, k0.i iVar) {
        cVar.f4708d.v(oVar, iVar);
        cVar.f4705a.b(oVar, 1);
        return null;
    }

    public static /* synthetic */ void c(final c cVar, final o oVar, i0.h hVar, k0.i iVar) {
        cVar.getClass();
        try {
            m a4 = cVar.f4707c.a(oVar.b());
            if (a4 == null) {
                String format = String.format("Transport backend '%s' is not registered", oVar.b());
                f4704f.warning(format);
                hVar.a(new IllegalArgumentException(format));
            } else {
                final k0.i a5 = a4.a(iVar);
                cVar.f4709e.a(new b.a() { // from class: q0.b
                    @Override // t0.b.a
                    public final Object a() {
                        return c.b(c.this, oVar, a5);
                    }
                });
                hVar.a(null);
            }
        } catch (Exception e4) {
            f4704f.warning(c3.d4(1097) + e4.getMessage());
            hVar.a(e4);
        }
    }

    @Override // q0.e
    public void a(final o oVar, final k0.i iVar, final i0.h hVar) {
        this.f4706b.execute(new Runnable() { // from class: q0.a
            @Override // java.lang.Runnable
            public final void run() {
                c.c(c.this, oVar, hVar, iVar);
            }
        });
    }
}
