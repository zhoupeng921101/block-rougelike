package androidx.core.provider;

import android.graphics.Typeface;
import android.os.Handler;
import androidx.core.provider.f;
import androidx.core.provider.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class a {

    /* renamed from: a, reason: collision with root package name */
    private final g.c f950a;

    /* renamed from: b, reason: collision with root package name */
    private final Handler f951b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.provider.a$a, reason: collision with other inner class name */
    class RunnableC0010a implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ g.c f952e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ Typeface f953f;

        RunnableC0010a(g.c cVar, Typeface typeface) {
            this.f952e = cVar;
            this.f953f = typeface;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f952e.b(this.f953f);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ g.c f955e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ int f956f;

        b(g.c cVar, int i4) {
            this.f955e = cVar;
            this.f956f = i4;
        }

        @Override // java.lang.Runnable
        public void run() {
            this.f955e.a(this.f956f);
        }
    }

    a(g.c cVar, Handler handler) {
        this.f950a = cVar;
        this.f951b = handler;
    }

    private void a(int i4) {
        this.f951b.post(new b(this.f950a, i4));
    }

    private void c(Typeface typeface) {
        this.f951b.post(new RunnableC0010a(this.f950a, typeface));
    }

    void b(f.e eVar) {
        if (eVar.a()) {
            c(eVar.f979a);
        } else {
            a(eVar.f980b);
        }
    }
}
