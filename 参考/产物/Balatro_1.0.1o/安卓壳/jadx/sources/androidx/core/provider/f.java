package androidx.core.provider;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import androidx.core.provider.g;
import java.util.ArrayList;
import java.util.concurrent.Callable;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class f {

    /* renamed from: a, reason: collision with root package name */
    static final k.e f965a = new k.e(16);

    /* renamed from: b, reason: collision with root package name */
    private static final ExecutorService f966b = h.a("fonts-androidx", 10, 10000);

    /* renamed from: c, reason: collision with root package name */
    static final Object f967c = new Object();

    /* renamed from: d, reason: collision with root package name */
    static final k.g f968d = new k.g();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Callable {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ String f969a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ Context f970b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ androidx.core.provider.e f971c;

        /* renamed from: d, reason: collision with root package name */
        final /* synthetic */ int f972d;

        a(String str, Context context, androidx.core.provider.e eVar, int i4) {
            this.f969a = str;
            this.f970b = context;
            this.f971c = eVar;
            this.f972d = i4;
        }

        @Override // java.util.concurrent.Callable
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public e call() {
            return f.c(this.f969a, this.f970b, this.f971c, this.f972d);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements androidx.core.util.a {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ androidx.core.provider.a f973a;

        b(androidx.core.provider.a aVar) {
            this.f973a = aVar;
        }

        @Override // androidx.core.util.a
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void accept(e eVar) {
            if (eVar == null) {
                eVar = new e(-3);
            }
            this.f973a.b(eVar);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements Callable {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ String f974a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ Context f975b;

        /* renamed from: c, reason: collision with root package name */
        final /* synthetic */ androidx.core.provider.e f976c;

        /* renamed from: d, reason: collision with root package name */
        final /* synthetic */ int f977d;

        c(String str, Context context, androidx.core.provider.e eVar, int i4) {
            this.f974a = str;
            this.f975b = context;
            this.f976c = eVar;
            this.f977d = i4;
        }

        @Override // java.util.concurrent.Callable
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public e call() {
            try {
                return f.c(this.f974a, this.f975b, this.f976c, this.f977d);
            } catch (Throwable unused) {
                return new e(-3);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements androidx.core.util.a {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ String f978a;

        d(String str) {
            this.f978a = str;
        }

        @Override // androidx.core.util.a
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public void accept(e eVar) {
            synchronized (f.f967c) {
                try {
                    k.g gVar = f.f968d;
                    ArrayList arrayList = (ArrayList) gVar.get(this.f978a);
                    if (arrayList == null) {
                        return;
                    }
                    gVar.remove(this.f978a);
                    for (int i4 = 0; i4 < arrayList.size(); i4++) {
                        ((androidx.core.util.a) arrayList.get(i4)).accept(eVar);
                    }
                } catch (Throwable th) {
                    throw th;
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class e {

        /* renamed from: a, reason: collision with root package name */
        final Typeface f979a;

        /* renamed from: b, reason: collision with root package name */
        final int f980b;

        e(int i4) {
            this.f979a = null;
            this.f980b = i4;
        }

        e(Typeface typeface) {
            this.f979a = typeface;
            this.f980b = 0;
        }

        boolean a() {
            return this.f980b == 0;
        }
    }

    private static String a(androidx.core.provider.e eVar, int i4) {
        return eVar.d() + "-" + i4;
    }

    private static int b(g.a aVar) {
        int i4 = 1;
        if (aVar.c() != 0) {
            return aVar.c() != 1 ? -3 : -2;
        }
        g.b[] b4 = aVar.b();
        if (b4 != null && b4.length != 0) {
            i4 = 0;
            for (g.b bVar : b4) {
                int b5 = bVar.b();
                if (b5 != 0) {
                    if (b5 < 0) {
                        return -3;
                    }
                    return b5;
                }
            }
        }
        return i4;
    }

    static e c(String str, Context context, androidx.core.provider.e eVar, int i4) {
        k.e eVar2 = f965a;
        Typeface typeface = (Typeface) eVar2.c(str);
        if (typeface != null) {
            return new e(typeface);
        }
        try {
            g.a e4 = androidx.core.provider.d.e(context, eVar, null);
            int b4 = b(e4);
            if (b4 != 0) {
                return new e(b4);
            }
            Typeface b5 = androidx.core.graphics.h.b(context, null, e4.b(), i4);
            if (b5 == null) {
                return new e(-3);
            }
            eVar2.d(str, b5);
            return new e(b5);
        } catch (PackageManager.NameNotFoundException unused) {
            return new e(-1);
        }
    }

    static Typeface d(Context context, androidx.core.provider.e eVar, int i4, Executor executor, androidx.core.provider.a aVar) {
        String a4 = a(eVar, i4);
        Typeface typeface = (Typeface) f965a.c(a4);
        if (typeface != null) {
            aVar.b(new e(typeface));
            return typeface;
        }
        b bVar = new b(aVar);
        synchronized (f967c) {
            try {
                k.g gVar = f968d;
                ArrayList arrayList = (ArrayList) gVar.get(a4);
                if (arrayList != null) {
                    arrayList.add(bVar);
                    return null;
                }
                ArrayList arrayList2 = new ArrayList();
                arrayList2.add(bVar);
                gVar.put(a4, arrayList2);
                c cVar = new c(a4, context, eVar, i4);
                if (executor == null) {
                    executor = f966b;
                }
                h.b(executor, cVar, new d(a4));
                return null;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    static Typeface e(Context context, androidx.core.provider.e eVar, androidx.core.provider.a aVar, int i4, int i5) {
        String a4 = a(eVar, i4);
        Typeface typeface = (Typeface) f965a.c(a4);
        if (typeface != null) {
            aVar.b(new e(typeface));
            return typeface;
        }
        if (i5 == -1) {
            e c4 = c(a4, context, eVar, i4);
            aVar.b(c4);
            return c4.f979a;
        }
        try {
            e eVar2 = (e) h.c(f966b, new a(a4, context, eVar, i4), i5);
            aVar.b(eVar2);
            return eVar2.f979a;
        } catch (InterruptedException unused) {
            aVar.b(new e(-3));
            return null;
        }
    }
}
