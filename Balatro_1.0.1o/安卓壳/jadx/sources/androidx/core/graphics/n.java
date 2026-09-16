package androidx.core.graphics;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.os.CancellationSignal;
import androidx.core.content.res.d;
import androidx.core.provider.g;
import java.io.File;
import java.io.InputStream;
import java.util.concurrent.ConcurrentHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class n {

    /* renamed from: a, reason: collision with root package name */
    private ConcurrentHashMap f936a = new ConcurrentHashMap();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements b {
        a() {
        }

        @Override // androidx.core.graphics.n.b
        /* renamed from: c, reason: merged with bridge method [inline-methods] */
        public int a(g.b bVar) {
            return bVar.e();
        }

        @Override // androidx.core.graphics.n.b
        /* renamed from: d, reason: merged with bridge method [inline-methods] */
        public boolean b(g.b bVar) {
            return bVar.f();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private interface b {
        int a(Object obj);

        boolean b(Object obj);
    }

    n() {
    }

    private static Object e(Object[] objArr, int i4, b bVar) {
        return f(objArr, (i4 & 1) == 0 ? 400 : 700, (i4 & 2) != 0, bVar);
    }

    private static Object f(Object[] objArr, int i4, boolean z3, b bVar) {
        Object obj = null;
        int i5 = Integer.MAX_VALUE;
        for (Object obj2 : objArr) {
            int abs = (Math.abs(bVar.a(obj2) - i4) * 2) + (bVar.b(obj2) == z3 ? 0 : 1);
            if (obj == null || i5 > abs) {
                obj = obj2;
                i5 = abs;
            }
        }
        return obj;
    }

    public abstract Typeface a(Context context, d.c cVar, Resources resources, int i4);

    public abstract Typeface b(Context context, CancellationSignal cancellationSignal, g.b[] bVarArr, int i4);

    protected Typeface c(Context context, InputStream inputStream) {
        File e4 = o.e(context);
        if (e4 == null) {
            return null;
        }
        try {
            if (o.d(e4, inputStream)) {
                return Typeface.createFromFile(e4.getPath());
            }
            return null;
        } catch (RuntimeException unused) {
            return null;
        } finally {
            e4.delete();
        }
    }

    public Typeface d(Context context, Resources resources, int i4, String str, int i5) {
        File e4 = o.e(context);
        if (e4 == null) {
            return null;
        }
        try {
            if (o.c(e4, resources, i4)) {
                return Typeface.createFromFile(e4.getPath());
            }
            return null;
        } catch (RuntimeException unused) {
            return null;
        } finally {
            e4.delete();
        }
    }

    protected g.b g(g.b[] bVarArr, int i4) {
        return (g.b) e(bVarArr, i4, new a());
    }
}
