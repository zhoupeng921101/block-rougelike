package i3;

import java.util.Iterator;
import java.util.List;
import java.util.ServiceLoader;
import t2.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e {

    /* renamed from: a, reason: collision with root package name */
    private static final List f3631a = g3.c.d(g3.c.a(ServiceLoader.load(d.class, d.class.getClassLoader()).iterator()));

    public static final void a(v2.e eVar, Throwable th) {
        Iterator it = f3631a.iterator();
        while (it.hasNext()) {
            try {
                ((d) it.next()).handleException(eVar, th);
            } catch (Throwable th2) {
                Thread currentThread = Thread.currentThread();
                currentThread.getUncaughtExceptionHandler().uncaughtException(currentThread, f.b(th, th2));
            }
        }
        Thread currentThread2 = Thread.currentThread();
        try {
            i.a aVar = t2.i.f4994e;
            t2.a.a(th, new k(eVar));
            t2.i.a(t2.n.f5000a);
        } catch (Throwable th3) {
            i.a aVar2 = t2.i.f4994e;
            t2.i.a(t2.j.a(th3));
        }
        currentThread2.getUncaughtExceptionHandler().uncaughtException(currentThread2, th);
    }
}
