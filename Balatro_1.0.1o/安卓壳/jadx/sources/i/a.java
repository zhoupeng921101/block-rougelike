package i;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends d {

    /* renamed from: c, reason: collision with root package name */
    private static volatile a f3598c;

    /* renamed from: d, reason: collision with root package name */
    private static final Executor f3599d = new ExecutorC0048a();

    /* renamed from: e, reason: collision with root package name */
    private static final Executor f3600e = new b();

    /* renamed from: a, reason: collision with root package name */
    private d f3601a;

    /* renamed from: b, reason: collision with root package name */
    private d f3602b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: i.a$a, reason: collision with other inner class name */
    static class ExecutorC0048a implements Executor {
        ExecutorC0048a() {
        }

        @Override // java.util.concurrent.Executor
        public void execute(Runnable runnable) {
            a.d().c(runnable);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b implements Executor {
        b() {
        }

        @Override // java.util.concurrent.Executor
        public void execute(Runnable runnable) {
            a.d().a(runnable);
        }
    }

    private a() {
        c cVar = new c();
        this.f3602b = cVar;
        this.f3601a = cVar;
    }

    public static a d() {
        if (f3598c != null) {
            return f3598c;
        }
        synchronized (a.class) {
            try {
                if (f3598c == null) {
                    f3598c = new a();
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return f3598c;
    }

    @Override // i.d
    public void a(Runnable runnable) {
        this.f3601a.a(runnable);
    }

    @Override // i.d
    public boolean b() {
        return this.f3601a.b();
    }

    @Override // i.d
    public void c(Runnable runnable) {
        this.f3601a.c(runnable);
    }
}
