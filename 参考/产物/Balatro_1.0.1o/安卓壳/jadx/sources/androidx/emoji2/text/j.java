package androidx.emoji2.text;

import a1.b2.c3;
import android.content.Context;
import android.content.pm.PackageManager;
import android.database.ContentObserver;
import android.graphics.Typeface;
import android.os.Handler;
import androidx.core.provider.g;
import androidx.emoji2.text.e;
import androidx.emoji2.text.j;
import java.nio.ByteBuffer;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class j extends e.c {

    /* renamed from: j, reason: collision with root package name */
    private static final a f1236j = new a();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {
        public Typeface a(Context context, g.b bVar) {
            return androidx.core.provider.g.a(context, null, new g.b[]{bVar});
        }

        public g.a b(Context context, androidx.core.provider.e eVar) {
            return androidx.core.provider.g.b(context, null, eVar);
        }

        public void c(Context context, ContentObserver contentObserver) {
            context.getContentResolver().unregisterContentObserver(contentObserver);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b implements e.g {

        /* renamed from: a, reason: collision with root package name */
        private final Context f1237a;

        /* renamed from: b, reason: collision with root package name */
        private final androidx.core.provider.e f1238b;

        /* renamed from: c, reason: collision with root package name */
        private final a f1239c;

        /* renamed from: d, reason: collision with root package name */
        private final Object f1240d = new Object();

        /* renamed from: e, reason: collision with root package name */
        private Handler f1241e;

        /* renamed from: f, reason: collision with root package name */
        private Executor f1242f;

        /* renamed from: g, reason: collision with root package name */
        private ThreadPoolExecutor f1243g;

        /* renamed from: h, reason: collision with root package name */
        e.h f1244h;

        /* renamed from: i, reason: collision with root package name */
        private ContentObserver f1245i;

        /* renamed from: j, reason: collision with root package name */
        private Runnable f1246j;

        b(Context context, androidx.core.provider.e eVar, a aVar) {
            androidx.core.util.c.e(context, "Context cannot be null");
            androidx.core.util.c.e(eVar, c3.d4(766));
            this.f1237a = context.getApplicationContext();
            this.f1238b = eVar;
            this.f1239c = aVar;
        }

        private void b() {
            synchronized (this.f1240d) {
                try {
                    this.f1244h = null;
                    ContentObserver contentObserver = this.f1245i;
                    if (contentObserver != null) {
                        this.f1239c.c(this.f1237a, contentObserver);
                        this.f1245i = null;
                    }
                    Handler handler = this.f1241e;
                    if (handler != null) {
                        handler.removeCallbacks(this.f1246j);
                    }
                    this.f1241e = null;
                    ThreadPoolExecutor threadPoolExecutor = this.f1243g;
                    if (threadPoolExecutor != null) {
                        threadPoolExecutor.shutdown();
                    }
                    this.f1242f = null;
                    this.f1243g = null;
                } catch (Throwable th) {
                    throw th;
                }
            }
        }

        private g.b e() {
            try {
                g.a b4 = this.f1239c.b(this.f1237a, this.f1238b);
                if (b4.c() == 0) {
                    g.b[] b5 = b4.b();
                    if (b5 == null || b5.length == 0) {
                        throw new RuntimeException("fetchFonts failed (empty result)");
                    }
                    return b5[0];
                }
                throw new RuntimeException("fetchFonts failed (" + b4.c() + ")");
            } catch (PackageManager.NameNotFoundException e4) {
                throw new RuntimeException("provider not found", e4);
            }
        }

        @Override // androidx.emoji2.text.e.g
        public void a(e.h hVar) {
            androidx.core.util.c.e(hVar, "LoaderCallback cannot be null");
            synchronized (this.f1240d) {
                this.f1244h = hVar;
            }
            d();
        }

        void c() {
            synchronized (this.f1240d) {
                try {
                    if (this.f1244h == null) {
                        return;
                    }
                    try {
                        g.b e4 = e();
                        int b4 = e4.b();
                        if (b4 == 2) {
                            synchronized (this.f1240d) {
                            }
                        }
                        if (b4 != 0) {
                            throw new RuntimeException("fetchFonts result is not OK. (" + b4 + ")");
                        }
                        try {
                            androidx.core.os.g.a("EmojiCompat.FontRequestEmojiCompatConfig.buildTypeface");
                            Typeface a4 = this.f1239c.a(this.f1237a, e4);
                            ByteBuffer f4 = androidx.core.graphics.o.f(this.f1237a, null, e4.d());
                            if (f4 == null || a4 == null) {
                                throw new RuntimeException("Unable to open file.");
                            }
                            m b5 = m.b(a4, f4);
                            androidx.core.os.g.b();
                            synchronized (this.f1240d) {
                                try {
                                    e.h hVar = this.f1244h;
                                    if (hVar != null) {
                                        hVar.b(b5);
                                    }
                                } finally {
                                }
                            }
                            b();
                        } catch (Throwable th) {
                            androidx.core.os.g.b();
                            throw th;
                        }
                    } catch (Throwable th2) {
                        synchronized (this.f1240d) {
                            try {
                                e.h hVar2 = this.f1244h;
                                if (hVar2 != null) {
                                    hVar2.a(th2);
                                }
                                b();
                            } finally {
                            }
                        }
                    }
                } finally {
                }
            }
        }

        void d() {
            synchronized (this.f1240d) {
                try {
                    if (this.f1244h == null) {
                        return;
                    }
                    if (this.f1242f == null) {
                        ThreadPoolExecutor b4 = androidx.emoji2.text.b.b("emojiCompat");
                        this.f1243g = b4;
                        this.f1242f = b4;
                    }
                    this.f1242f.execute(new Runnable() { // from class: androidx.emoji2.text.k
                        @Override // java.lang.Runnable
                        public final void run() {
                            j.b.this.c();
                        }
                    });
                } catch (Throwable th) {
                    throw th;
                }
            }
        }

        public void f(Executor executor) {
            synchronized (this.f1240d) {
                this.f1242f = executor;
            }
        }
    }

    public j(Context context, androidx.core.provider.e eVar) {
        super(new b(context, eVar, f1236j));
    }

    public j c(Executor executor) {
        ((b) a()).f(executor);
        return this;
    }
}
