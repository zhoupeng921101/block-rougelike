package k3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends i3.c implements Runnable, i3.j {

    /* renamed from: f, reason: collision with root package name */
    private final i3.c f3988f;

    /* renamed from: g, reason: collision with root package name */
    private final int f3989g;

    /* renamed from: h, reason: collision with root package name */
    private final /* synthetic */ i3.j f3990h;

    /* renamed from: i, reason: collision with root package name */
    private final c f3991i;

    /* renamed from: j, reason: collision with root package name */
    private final Object f3992j;
    private volatile int runningWorkers;

    /* JADX WARN: Multi-variable type inference failed */
    public a(i3.c cVar, int i4) {
        this.f3988f = cVar;
        this.f3989g = i4;
        i3.j jVar = cVar instanceof i3.j ? (i3.j) cVar : null;
        this.f3990h = jVar == null ? i3.i.a() : jVar;
        this.f3991i = new c(false);
        this.f3992j = new Object();
    }

    private final boolean d(Runnable runnable) {
        this.f3991i.a(runnable);
        return this.runningWorkers >= this.f3989g;
    }

    private final boolean e() {
        synchronized (this.f3992j) {
            if (this.runningWorkers >= this.f3989g) {
                return false;
            }
            this.runningWorkers++;
            return true;
        }
    }

    @Override // i3.c
    public void a(v2.e eVar, Runnable runnable) {
        if (!d(runnable) && e()) {
            this.f3988f.a(this, this);
        }
    }

    /* JADX WARN: Code restructure failed: missing block: B:23:0x002a, code lost:
    
        r1 = r4.f3992j;
     */
    /* JADX WARN: Code restructure failed: missing block: B:24:0x002c, code lost:
    
        monitor-enter(r1);
     */
    /* JADX WARN: Code restructure failed: missing block: B:26:0x002d, code lost:
    
        r4.runningWorkers--;
     */
    /* JADX WARN: Code restructure failed: missing block: B:27:0x0039, code lost:
    
        if (r4.f3991i.c() != 0) goto L22;
     */
    /* JADX WARN: Code restructure failed: missing block: B:28:0x003d, code lost:
    
        r4.runningWorkers++;
        r2 = t2.n.f5000a;
     */
    /* JADX WARN: Code restructure failed: missing block: B:31:0x003b, code lost:
    
        monitor-exit(r1);
     */
    /* JADX WARN: Code restructure failed: missing block: B:32:0x003c, code lost:
    
        return;
     */
    @Override // java.lang.Runnable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public void run() {
        /*
            r4 = this;
            r0 = 0
        L1:
            r1 = r0
        L2:
            k3.c r2 = r4.f3991i
            java.lang.Object r2 = r2.d()
            java.lang.Runnable r2 = (java.lang.Runnable) r2
            if (r2 == 0) goto L2a
            r2.run()     // Catch: java.lang.Throwable -> L10
            goto L16
        L10:
            r2 = move-exception
            v2.f r3 = v2.f.f5084e
            i3.f.a(r3, r2)
        L16:
            int r1 = r1 + 1
            r2 = 16
            if (r1 < r2) goto L2
            i3.c r2 = r4.f3988f
            boolean r2 = r2.b(r4)
            if (r2 == 0) goto L2
            i3.c r0 = r4.f3988f
            r0.a(r4, r4)
            return
        L2a:
            java.lang.Object r1 = r4.f3992j
            monitor-enter(r1)
            int r2 = r4.runningWorkers     // Catch: java.lang.Throwable -> L47
            int r2 = r2 + (-1)
            r4.runningWorkers = r2     // Catch: java.lang.Throwable -> L47
            k3.c r2 = r4.f3991i     // Catch: java.lang.Throwable -> L47
            int r2 = r2.c()     // Catch: java.lang.Throwable -> L47
            if (r2 != 0) goto L3d
            monitor-exit(r1)
            return
        L3d:
            int r2 = r4.runningWorkers     // Catch: java.lang.Throwable -> L47
            int r2 = r2 + 1
            r4.runningWorkers = r2     // Catch: java.lang.Throwable -> L47
            t2.n r2 = t2.n.f5000a     // Catch: java.lang.Throwable -> L47
            monitor-exit(r1)
            goto L1
        L47:
            r0 = move-exception
            monitor-exit(r1)
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: k3.a.run():void");
    }
}
