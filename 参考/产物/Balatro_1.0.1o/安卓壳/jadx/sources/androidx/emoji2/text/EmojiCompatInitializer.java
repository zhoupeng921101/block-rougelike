package androidx.emoji2.text;

import android.content.Context;
import androidx.emoji2.text.EmojiCompatInitializer;
import androidx.emoji2.text.e;
import androidx.lifecycle.ProcessLifecycleInitializer;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadPoolExecutor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class EmojiCompatInitializer implements a0.a {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a extends e.c {
        protected a(Context context) {
            super(new b(context));
            b(1);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b implements e.g {

        /* renamed from: a, reason: collision with root package name */
        private final Context f1171a;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a extends e.h {

            /* renamed from: a, reason: collision with root package name */
            final /* synthetic */ e.h f1172a;

            /* renamed from: b, reason: collision with root package name */
            final /* synthetic */ ThreadPoolExecutor f1173b;

            a(e.h hVar, ThreadPoolExecutor threadPoolExecutor) {
                this.f1172a = hVar;
                this.f1173b = threadPoolExecutor;
            }

            @Override // androidx.emoji2.text.e.h
            public void a(Throwable th) {
                try {
                    this.f1172a.a(th);
                } finally {
                    this.f1173b.shutdown();
                }
            }

            @Override // androidx.emoji2.text.e.h
            public void b(m mVar) {
                try {
                    this.f1172a.b(mVar);
                } finally {
                    this.f1173b.shutdown();
                }
            }
        }

        b(Context context) {
            this.f1171a = context.getApplicationContext();
        }

        @Override // androidx.emoji2.text.e.g
        public void a(final e.h hVar) {
            final ThreadPoolExecutor b4 = androidx.emoji2.text.b.b("EmojiCompatInitializer");
            b4.execute(new Runnable() { // from class: androidx.emoji2.text.f
                @Override // java.lang.Runnable
                public final void run() {
                    EmojiCompatInitializer.b.this.c(hVar, b4);
                }
            });
        }

        /* JADX INFO: Access modifiers changed from: package-private */
        public void c(e.h hVar, ThreadPoolExecutor threadPoolExecutor) {
            try {
                j a4 = androidx.emoji2.text.c.a(this.f1171a);
                if (a4 == null) {
                    throw new RuntimeException("EmojiCompat font provider not available on this device.");
                }
                a4.c(threadPoolExecutor);
                a4.a().a(new a(hVar, threadPoolExecutor));
            } catch (Throwable th) {
                hVar.a(th);
                threadPoolExecutor.shutdown();
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c implements Runnable {
        c() {
        }

        @Override // java.lang.Runnable
        public void run() {
            try {
                androidx.core.os.g.a("EmojiCompat.EmojiCompatInitializer.run");
                if (e.h()) {
                    e.b().k();
                }
            } finally {
                androidx.core.os.g.b();
            }
        }
    }

    @Override // a0.a
    public List a() {
        return Collections.singletonList(ProcessLifecycleInitializer.class);
    }

    @Override // a0.a
    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public Boolean b(Context context) {
        e.g(new a(context));
        d(context);
        return Boolean.TRUE;
    }

    void d(Context context) {
        final androidx.lifecycle.g q3 = ((androidx.lifecycle.k) androidx.startup.a.e(context).f(ProcessLifecycleInitializer.class)).q();
        q3.a(new androidx.lifecycle.b() { // from class: androidx.emoji2.text.EmojiCompatInitializer.1
            @Override // androidx.lifecycle.d
            public void f(androidx.lifecycle.k kVar) {
                EmojiCompatInitializer.this.e();
                q3.c(this);
            }
        });
    }

    void e() {
        androidx.emoji2.text.b.c().postDelayed(new c(), 500L);
    }
}
