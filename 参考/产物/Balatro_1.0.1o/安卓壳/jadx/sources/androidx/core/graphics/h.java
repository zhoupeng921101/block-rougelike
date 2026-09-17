package androidx.core.graphics;

import a1.b2.c3;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.os.Build;
import android.os.CancellationSignal;
import android.os.Handler;
import androidx.core.content.res.d;
import androidx.core.content.res.f;
import androidx.core.provider.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h {

    /* renamed from: a, reason: collision with root package name */
    private static final n f917a;

    /* renamed from: b, reason: collision with root package name */
    private static final k.e f918b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a extends g.c {

        /* renamed from: a, reason: collision with root package name */
        private f.e f919a;

        public a(f.e eVar) {
            this.f919a = eVar;
        }

        @Override // androidx.core.provider.g.c
        public void a(int i4) {
            f.e eVar = this.f919a;
            if (eVar != null) {
                eVar.f(i4);
            }
        }

        @Override // androidx.core.provider.g.c
        public void b(Typeface typeface) {
            f.e eVar = this.f919a;
            if (eVar != null) {
                eVar.g(typeface);
            }
        }
    }

    static {
        int i4 = Build.VERSION.SDK_INT;
        if (i4 >= 29) {
            f917a = new m();
        } else if (i4 >= 28) {
            f917a = new l();
        } else if (i4 >= 26) {
            f917a = new k();
        } else if (j.j()) {
            f917a = new j();
        } else {
            f917a = new i();
        }
        f918b = new k.e(16);
    }

    public static Typeface a(Context context, Typeface typeface, int i4) {
        if (context != null) {
            return Typeface.create(typeface, i4);
        }
        throw new IllegalArgumentException(c3.d4(49));
    }

    public static Typeface b(Context context, CancellationSignal cancellationSignal, g.b[] bVarArr, int i4) {
        return f917a.b(context, cancellationSignal, bVarArr, i4);
    }

    public static Typeface c(Context context, d.b bVar, Resources resources, int i4, String str, int i5, int i6, f.e eVar, Handler handler, boolean z3) {
        Typeface a4;
        if (bVar instanceof d.e) {
            d.e eVar2 = (d.e) bVar;
            Typeface g4 = g(eVar2.c());
            if (g4 != null) {
                if (eVar != null) {
                    eVar.d(g4, handler);
                }
                return g4;
            }
            a4 = androidx.core.provider.g.c(context, eVar2.b(), i6, !z3 ? eVar != null : eVar2.a() != 0, z3 ? eVar2.d() : -1, f.e.e(handler), new a(eVar));
        } else {
            a4 = f917a.a(context, (d.c) bVar, resources, i6);
            if (eVar != null) {
                if (a4 != null) {
                    eVar.d(a4, handler);
                } else {
                    eVar.c(-3, handler);
                }
            }
        }
        if (a4 != null) {
            f918b.d(e(resources, i4, str, i5, i6), a4);
        }
        return a4;
    }

    public static Typeface d(Context context, Resources resources, int i4, String str, int i5, int i6) {
        Typeface d4 = f917a.d(context, resources, i4, str, i6);
        if (d4 != null) {
            f918b.d(e(resources, i4, str, i5, i6), d4);
        }
        return d4;
    }

    private static String e(Resources resources, int i4, String str, int i5, int i6) {
        return resources.getResourcePackageName(i4) + '-' + str + '-' + i5 + '-' + i4 + '-' + i6;
    }

    public static Typeface f(Resources resources, int i4, String str, int i5, int i6) {
        return (Typeface) f918b.c(e(resources, i4, str, i5, i6));
    }

    private static Typeface g(String str) {
        if (str != null && !str.isEmpty()) {
            Typeface create = Typeface.create(str, 0);
            Typeface create2 = Typeface.create(Typeface.DEFAULT, 0);
            if (create != null && !create.equals(create2)) {
                return create;
            }
        }
        return null;
    }
}
