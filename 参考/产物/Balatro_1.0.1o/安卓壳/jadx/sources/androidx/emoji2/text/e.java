package androidx.emoji2.text;

import a1.b2.c3;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class e {

    /* renamed from: n, reason: collision with root package name */
    private static final Object f1179n = new Object();

    /* renamed from: o, reason: collision with root package name */
    private static final Object f1180o = new Object();

    /* renamed from: p, reason: collision with root package name */
    private static volatile e f1181p;

    /* renamed from: b, reason: collision with root package name */
    private final Set f1183b;

    /* renamed from: e, reason: collision with root package name */
    private final b f1186e;

    /* renamed from: f, reason: collision with root package name */
    final g f1187f;

    /* renamed from: g, reason: collision with root package name */
    final boolean f1188g;

    /* renamed from: h, reason: collision with root package name */
    final boolean f1189h;

    /* renamed from: i, reason: collision with root package name */
    final int[] f1190i;

    /* renamed from: j, reason: collision with root package name */
    private final boolean f1191j;

    /* renamed from: k, reason: collision with root package name */
    private final int f1192k;

    /* renamed from: l, reason: collision with root package name */
    private final int f1193l;

    /* renamed from: m, reason: collision with root package name */
    private final d f1194m;

    /* renamed from: a, reason: collision with root package name */
    private final ReadWriteLock f1182a = new ReentrantReadWriteLock();

    /* renamed from: c, reason: collision with root package name */
    private volatile int f1184c = 3;

    /* renamed from: d, reason: collision with root package name */
    private final Handler f1185d = new Handler(Looper.getMainLooper());

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class a extends b {

        /* renamed from: b, reason: collision with root package name */
        private volatile androidx.emoji2.text.h f1195b;

        /* renamed from: c, reason: collision with root package name */
        private volatile m f1196c;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: androidx.emoji2.text.e$a$a, reason: collision with other inner class name */
        class C0016a extends h {
            C0016a() {
            }

            @Override // androidx.emoji2.text.e.h
            public void a(Throwable th) {
                a.this.f1198a.m(th);
            }

            @Override // androidx.emoji2.text.e.h
            public void b(m mVar) {
                a.this.d(mVar);
            }
        }

        a(e eVar) {
            super(eVar);
        }

        @Override // androidx.emoji2.text.e.b
        void a() {
            try {
                this.f1198a.f1187f.a(new C0016a());
            } catch (Throwable th) {
                this.f1198a.m(th);
            }
        }

        @Override // androidx.emoji2.text.e.b
        CharSequence b(CharSequence charSequence, int i4, int i5, int i6, boolean z3) {
            return this.f1195b.h(charSequence, i4, i5, i6, z3);
        }

        @Override // androidx.emoji2.text.e.b
        void c(EditorInfo editorInfo) {
            editorInfo.extras.putInt("android.support.text.emoji.emojiCompat_metadataVersion", this.f1196c.e());
            editorInfo.extras.putBoolean("android.support.text.emoji.emojiCompat_replaceAll", this.f1198a.f1188g);
        }

        void d(m mVar) {
            if (mVar == null) {
                this.f1198a.m(new IllegalArgumentException(c3.d4(1306)));
                return;
            }
            this.f1196c = mVar;
            m mVar2 = this.f1196c;
            i iVar = new i();
            d dVar = this.f1198a.f1194m;
            e eVar = this.f1198a;
            this.f1195b = new androidx.emoji2.text.h(mVar2, iVar, dVar, eVar.f1189h, eVar.f1190i);
            this.f1198a.n();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class b {

        /* renamed from: a, reason: collision with root package name */
        final e f1198a;

        b(e eVar) {
            this.f1198a = eVar;
        }

        abstract void a();

        abstract CharSequence b(CharSequence charSequence, int i4, int i5, int i6, boolean z3);

        abstract void c(EditorInfo editorInfo);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class c {

        /* renamed from: a, reason: collision with root package name */
        final g f1199a;

        /* renamed from: b, reason: collision with root package name */
        boolean f1200b;

        /* renamed from: c, reason: collision with root package name */
        boolean f1201c;

        /* renamed from: d, reason: collision with root package name */
        int[] f1202d;

        /* renamed from: e, reason: collision with root package name */
        Set f1203e;

        /* renamed from: f, reason: collision with root package name */
        boolean f1204f;

        /* renamed from: g, reason: collision with root package name */
        int f1205g = -16711936;

        /* renamed from: h, reason: collision with root package name */
        int f1206h = 0;

        /* renamed from: i, reason: collision with root package name */
        d f1207i = new androidx.emoji2.text.d();

        protected c(g gVar) {
            androidx.core.util.c.e(gVar, c3.d4(914));
            this.f1199a = gVar;
        }

        protected final g a() {
            return this.f1199a;
        }

        public c b(int i4) {
            this.f1206h = i4;
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface d {
        boolean a(CharSequence charSequence, int i4, int i5, int i6);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.emoji2.text.e$e, reason: collision with other inner class name */
    public static abstract class AbstractC0017e {
        public void a(Throwable th) {
        }

        public void b() {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class f implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        private final List f1208e;

        /* renamed from: f, reason: collision with root package name */
        private final Throwable f1209f;

        /* renamed from: g, reason: collision with root package name */
        private final int f1210g;

        f(AbstractC0017e abstractC0017e, int i4) {
            this(Arrays.asList((AbstractC0017e) androidx.core.util.c.e(abstractC0017e, c3.d4(503))), i4, null);
        }

        f(Collection collection, int i4) {
            this(collection, i4, null);
        }

        f(Collection collection, int i4, Throwable th) {
            androidx.core.util.c.e(collection, "initCallbacks cannot be null");
            this.f1208e = new ArrayList(collection);
            this.f1210g = i4;
            this.f1209f = th;
        }

        @Override // java.lang.Runnable
        public void run() {
            int size = this.f1208e.size();
            int i4 = 0;
            if (this.f1210g != 1) {
                while (i4 < size) {
                    ((AbstractC0017e) this.f1208e.get(i4)).a(this.f1209f);
                    i4++;
                }
            } else {
                while (i4 < size) {
                    ((AbstractC0017e) this.f1208e.get(i4)).b();
                    i4++;
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface g {
        void a(h hVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class h {
        public abstract void a(Throwable th);

        public abstract void b(m mVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class i {
        i() {
        }

        androidx.emoji2.text.i a(androidx.emoji2.text.g gVar) {
            return new o(gVar);
        }
    }

    private e(c cVar) {
        this.f1188g = cVar.f1200b;
        this.f1189h = cVar.f1201c;
        this.f1190i = cVar.f1202d;
        this.f1191j = cVar.f1204f;
        this.f1192k = cVar.f1205g;
        this.f1187f = cVar.f1199a;
        this.f1193l = cVar.f1206h;
        this.f1194m = cVar.f1207i;
        k.b bVar = new k.b();
        this.f1183b = bVar;
        Set set = cVar.f1203e;
        if (set != null && !set.isEmpty()) {
            bVar.addAll(cVar.f1203e);
        }
        this.f1186e = new a(this);
        l();
    }

    public static e b() {
        e eVar;
        synchronized (f1179n) {
            eVar = f1181p;
            androidx.core.util.c.f(eVar != null, "EmojiCompat is not initialized.\n\nYou must initialize EmojiCompat prior to referencing the EmojiCompat instance.\n\nThe most likely cause of this error is disabling the EmojiCompatInitializer\neither explicitly in AndroidManifest.xml, or by including\nandroidx.emoji2:emoji2-bundled.\n\nAutomatic initialization is typically performed by EmojiCompatInitializer. If\nyou are not expecting to initialize EmojiCompat manually in your application,\nplease check to ensure it has not been removed from your APK's manifest. You can\ndo this in Android Studio using Build > Analyze APK.\n\nIn the APK Analyzer, ensure that the startup entry for\nEmojiCompatInitializer and InitializationProvider is present in\n AndroidManifest.xml. If it is missing or contains tools:node=\"remove\", and you\nintend to use automatic configuration, verify:\n\n  1. Your application does not include emoji2-bundled\n  2. All modules do not contain an exclusion manifest rule for\n     EmojiCompatInitializer or InitializationProvider. For more information\n     about manifest exclusions see the documentation for the androidx startup\n     library.\n\nIf you intend to use emoji2-bundled, please call EmojiCompat.init. You can\nlearn more in the documentation for BundledEmojiCompatConfig.\n\nIf you intended to perform manual configuration, it is recommended that you call\nEmojiCompat.init immediately on application startup.\n\nIf you still cannot resolve this issue, please open a bug with your specific\nconfiguration to help improve error message.");
        }
        return eVar;
    }

    public static boolean e(InputConnection inputConnection, Editable editable, int i4, int i5, boolean z3) {
        return androidx.emoji2.text.h.c(inputConnection, editable, i4, i5, z3);
    }

    public static boolean f(Editable editable, int i4, KeyEvent keyEvent) {
        return androidx.emoji2.text.h.d(editable, i4, keyEvent);
    }

    public static e g(c cVar) {
        e eVar;
        e eVar2 = f1181p;
        if (eVar2 != null) {
            return eVar2;
        }
        synchronized (f1179n) {
            try {
                eVar = f1181p;
                if (eVar == null) {
                    eVar = new e(cVar);
                    f1181p = eVar;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return eVar;
    }

    public static boolean h() {
        return f1181p != null;
    }

    private boolean j() {
        return d() == 1;
    }

    private void l() {
        this.f1182a.writeLock().lock();
        try {
            if (this.f1193l == 0) {
                this.f1184c = 0;
            }
            this.f1182a.writeLock().unlock();
            if (d() == 0) {
                this.f1186e.a();
            }
        } catch (Throwable th) {
            this.f1182a.writeLock().unlock();
            throw th;
        }
    }

    public int c() {
        return this.f1192k;
    }

    public int d() {
        this.f1182a.readLock().lock();
        try {
            return this.f1184c;
        } finally {
            this.f1182a.readLock().unlock();
        }
    }

    public boolean i() {
        return this.f1191j;
    }

    public void k() {
        androidx.core.util.c.f(this.f1193l == 1, "Set metadataLoadStrategy to LOAD_STRATEGY_MANUAL to execute manual loading");
        if (j()) {
            return;
        }
        this.f1182a.writeLock().lock();
        try {
            if (this.f1184c == 0) {
                return;
            }
            this.f1184c = 0;
            this.f1182a.writeLock().unlock();
            this.f1186e.a();
        } finally {
            this.f1182a.writeLock().unlock();
        }
    }

    void m(Throwable th) {
        ArrayList arrayList = new ArrayList();
        this.f1182a.writeLock().lock();
        try {
            this.f1184c = 2;
            arrayList.addAll(this.f1183b);
            this.f1183b.clear();
            this.f1182a.writeLock().unlock();
            this.f1185d.post(new f(arrayList, this.f1184c, th));
        } catch (Throwable th2) {
            this.f1182a.writeLock().unlock();
            throw th2;
        }
    }

    void n() {
        ArrayList arrayList = new ArrayList();
        this.f1182a.writeLock().lock();
        try {
            this.f1184c = 1;
            arrayList.addAll(this.f1183b);
            this.f1183b.clear();
            this.f1182a.writeLock().unlock();
            this.f1185d.post(new f(arrayList, this.f1184c));
        } catch (Throwable th) {
            this.f1182a.writeLock().unlock();
            throw th;
        }
    }

    public CharSequence o(CharSequence charSequence) {
        return p(charSequence, 0, charSequence == null ? 0 : charSequence.length());
    }

    public CharSequence p(CharSequence charSequence, int i4, int i5) {
        return q(charSequence, i4, i5, Integer.MAX_VALUE);
    }

    public CharSequence q(CharSequence charSequence, int i4, int i5, int i6) {
        return r(charSequence, i4, i5, i6, 0);
    }

    public CharSequence r(CharSequence charSequence, int i4, int i5, int i6, int i7) {
        boolean z3;
        androidx.core.util.c.f(j(), c3.d4(872));
        androidx.core.util.c.c(i4, "start cannot be negative");
        androidx.core.util.c.c(i5, "end cannot be negative");
        androidx.core.util.c.c(i6, "maxEmojiCount cannot be negative");
        androidx.core.util.c.a(i4 <= i5, "start should be <= than end");
        if (charSequence == null) {
            return null;
        }
        androidx.core.util.c.a(i4 <= charSequence.length(), "start should be < than charSequence length");
        androidx.core.util.c.a(i5 <= charSequence.length(), "end should be < than charSequence length");
        if (charSequence.length() == 0 || i4 == i5) {
            return charSequence;
        }
        if (i7 != 1) {
            z3 = i7 != 2 ? this.f1188g : false;
        } else {
            z3 = true;
        }
        return this.f1186e.b(charSequence, i4, i5, i6, z3);
    }

    public void s(AbstractC0017e abstractC0017e) {
        androidx.core.util.c.e(abstractC0017e, "initCallback cannot be null");
        this.f1182a.writeLock().lock();
        try {
            if (this.f1184c != 1 && this.f1184c != 2) {
                this.f1183b.add(abstractC0017e);
                this.f1182a.writeLock().unlock();
            }
            this.f1185d.post(new f(abstractC0017e, this.f1184c));
            this.f1182a.writeLock().unlock();
        } catch (Throwable th) {
            this.f1182a.writeLock().unlock();
            throw th;
        }
    }

    public void t(AbstractC0017e abstractC0017e) {
        androidx.core.util.c.e(abstractC0017e, "initCallback cannot be null");
        this.f1182a.writeLock().lock();
        try {
            this.f1183b.remove(abstractC0017e);
        } finally {
            this.f1182a.writeLock().unlock();
        }
    }

    public void u(EditorInfo editorInfo) {
        if (!j() || editorInfo == null) {
            return;
        }
        if (editorInfo.extras == null) {
            editorInfo.extras = new Bundle();
        }
        this.f1186e.c(editorInfo);
    }
}
