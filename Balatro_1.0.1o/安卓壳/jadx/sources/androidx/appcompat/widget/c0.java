package androidx.appcompat.widget;

import a1.b2.c3;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.content.res.XmlResourceParser;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.util.AttributeSet;
import android.util.Log;
import android.util.TypedValue;
import android.util.Xml;
import java.lang.ref.WeakReference;
import java.util.WeakHashMap;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c0 {

    /* renamed from: i, reason: collision with root package name */
    private static c0 f512i;

    /* renamed from: a, reason: collision with root package name */
    private WeakHashMap f514a;

    /* renamed from: b, reason: collision with root package name */
    private k.g f515b;

    /* renamed from: c, reason: collision with root package name */
    private k.h f516c;

    /* renamed from: d, reason: collision with root package name */
    private final WeakHashMap f517d = new WeakHashMap(0);

    /* renamed from: e, reason: collision with root package name */
    private TypedValue f518e;

    /* renamed from: f, reason: collision with root package name */
    private boolean f519f;

    /* renamed from: g, reason: collision with root package name */
    private c f520g;

    /* renamed from: h, reason: collision with root package name */
    private static final PorterDuff.Mode f511h = PorterDuff.Mode.SRC_IN;

    /* renamed from: j, reason: collision with root package name */
    private static final a f513j = new a(6);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a extends k.e {
        public a(int i4) {
            super(i4);
        }

        private static int h(int i4, PorterDuff.Mode mode) {
            return ((i4 + 31) * 31) + mode.hashCode();
        }

        PorterDuffColorFilter i(int i4, PorterDuff.Mode mode) {
            return (PorterDuffColorFilter) c(Integer.valueOf(h(i4, mode)));
        }

        PorterDuffColorFilter j(int i4, PorterDuff.Mode mode, PorterDuffColorFilter porterDuffColorFilter) {
            return (PorterDuffColorFilter) d(Integer.valueOf(h(i4, mode)), porterDuffColorFilter);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private interface b {
        Drawable a(Context context, XmlPullParser xmlPullParser, AttributeSet attributeSet, Resources.Theme theme);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface c {
        boolean a(Context context, int i4, Drawable drawable);

        PorterDuff.Mode b(int i4);

        Drawable c(c0 c0Var, Context context, int i4);

        ColorStateList d(Context context, int i4);

        boolean e(Context context, int i4, Drawable drawable);
    }

    private synchronized boolean a(Context context, long j4, Drawable drawable) {
        try {
            Drawable.ConstantState constantState = drawable.getConstantState();
            if (constantState == null) {
                return false;
            }
            k.d dVar = (k.d) this.f517d.get(context);
            if (dVar == null) {
                dVar = new k.d();
                this.f517d.put(context, dVar);
            }
            dVar.g(j4, new WeakReference(constantState));
            return true;
        } catch (Throwable th) {
            throw th;
        }
    }

    private void b(Context context, int i4, ColorStateList colorStateList) {
        if (this.f514a == null) {
            this.f514a = new WeakHashMap();
        }
        k.h hVar = (k.h) this.f514a.get(context);
        if (hVar == null) {
            hVar = new k.h();
            this.f514a.put(context, hVar);
        }
        hVar.a(i4, colorStateList);
    }

    private void c(Context context) {
        if (this.f519f) {
            return;
        }
        this.f519f = true;
        Drawable i4 = i(context, g.b.f3338a);
        if (i4 == null || !p(i4)) {
            this.f519f = false;
            throw new IllegalStateException("This app has been built with an incorrect configuration. Please configure your build for VectorDrawableCompat.");
        }
    }

    private static long d(TypedValue typedValue) {
        return (typedValue.assetCookie << 32) | typedValue.data;
    }

    private Drawable e(Context context, int i4) {
        if (this.f518e == null) {
            this.f518e = new TypedValue();
        }
        TypedValue typedValue = this.f518e;
        context.getResources().getValue(i4, typedValue, true);
        long d4 = d(typedValue);
        Drawable h4 = h(context, d4);
        if (h4 != null) {
            return h4;
        }
        c cVar = this.f520g;
        Drawable c4 = cVar == null ? null : cVar.c(this, context, i4);
        if (c4 != null) {
            c4.setChangingConfigurations(typedValue.changingConfigurations);
            a(context, d4, c4);
        }
        return c4;
    }

    private static PorterDuffColorFilter f(ColorStateList colorStateList, PorterDuff.Mode mode, int[] iArr) {
        if (colorStateList == null || mode == null) {
            return null;
        }
        return k(colorStateList.getColorForState(iArr, 0), mode);
    }

    public static synchronized c0 g() {
        c0 c0Var;
        synchronized (c0.class) {
            try {
                if (f512i == null) {
                    c0 c0Var2 = new c0();
                    f512i = c0Var2;
                    o(c0Var2);
                }
                c0Var = f512i;
            } catch (Throwable th) {
                throw th;
            }
        }
        return c0Var;
    }

    private synchronized Drawable h(Context context, long j4) {
        k.d dVar = (k.d) this.f517d.get(context);
        if (dVar == null) {
            return null;
        }
        WeakReference weakReference = (WeakReference) dVar.c(j4);
        if (weakReference != null) {
            Drawable.ConstantState constantState = (Drawable.ConstantState) weakReference.get();
            if (constantState != null) {
                return constantState.newDrawable(context.getResources());
            }
            dVar.h(j4);
        }
        return null;
    }

    public static synchronized PorterDuffColorFilter k(int i4, PorterDuff.Mode mode) {
        PorterDuffColorFilter i5;
        synchronized (c0.class) {
            a aVar = f513j;
            i5 = aVar.i(i4, mode);
            if (i5 == null) {
                i5 = new PorterDuffColorFilter(i4, mode);
                aVar.j(i4, mode, i5);
            }
        }
        return i5;
    }

    private ColorStateList m(Context context, int i4) {
        k.h hVar;
        WeakHashMap weakHashMap = this.f514a;
        if (weakHashMap == null || (hVar = (k.h) weakHashMap.get(context)) == null) {
            return null;
        }
        return (ColorStateList) hVar.f(i4);
    }

    private static void o(c0 c0Var) {
    }

    private static boolean p(Drawable drawable) {
        if (drawable instanceof c0.b) {
            return true;
        }
        return c3.d4(47).equals(drawable.getClass().getName());
    }

    private Drawable q(Context context, int i4) {
        int next;
        k.g gVar = this.f515b;
        if (gVar == null || gVar.isEmpty()) {
            return null;
        }
        k.h hVar = this.f516c;
        String d4 = c3.d4(764);
        if (hVar != null) {
            String str = (String) hVar.f(i4);
            if (d4.equals(str) || (str != null && this.f515b.get(str) == null)) {
                return null;
            }
        } else {
            this.f516c = new k.h();
        }
        if (this.f518e == null) {
            this.f518e = new TypedValue();
        }
        TypedValue typedValue = this.f518e;
        Resources resources = context.getResources();
        resources.getValue(i4, typedValue, true);
        long d5 = d(typedValue);
        Drawable h4 = h(context, d5);
        if (h4 != null) {
            return h4;
        }
        CharSequence charSequence = typedValue.string;
        if (charSequence != null && charSequence.toString().endsWith(".xml")) {
            try {
                XmlResourceParser xml = resources.getXml(i4);
                AttributeSet asAttributeSet = Xml.asAttributeSet(xml);
                do {
                    next = xml.next();
                    if (next == 2) {
                        break;
                    }
                } while (next != 1);
                if (next != 2) {
                    throw new XmlPullParserException("No start tag found");
                }
                String name = xml.getName();
                this.f516c.a(i4, name);
                b bVar = (b) this.f515b.get(name);
                if (bVar != null) {
                    h4 = bVar.a(context, xml, asAttributeSet, context.getTheme());
                }
                if (h4 != null) {
                    h4.setChangingConfigurations(typedValue.changingConfigurations);
                    a(context, d5, h4);
                }
            } catch (Exception e4) {
                Log.e("ResourceManagerInternal", c3.d4(2), e4);
            }
        }
        if (h4 == null) {
            this.f516c.a(i4, d4);
        }
        return h4;
    }

    private Drawable t(Context context, int i4, boolean z3, Drawable drawable) {
        ColorStateList l3 = l(context, i4);
        if (l3 == null) {
            c cVar = this.f520g;
            if ((cVar == null || !cVar.e(context, i4, drawable)) && !v(context, i4, drawable) && z3) {
                return null;
            }
            return drawable;
        }
        if (u.a(drawable)) {
            drawable = drawable.mutate();
        }
        Drawable h4 = androidx.core.graphics.drawable.a.h(drawable);
        androidx.core.graphics.drawable.a.f(h4, l3);
        PorterDuff.Mode n3 = n(i4);
        if (n3 != null) {
            androidx.core.graphics.drawable.a.g(h4, n3);
        }
        return h4;
    }

    static void u(Drawable drawable, j0 j0Var, int[] iArr) {
        int[] state = drawable.getState();
        if (u.a(drawable) && drawable.mutate() != drawable) {
            Log.d("ResourceManagerInternal", c3.d4(316));
            return;
        }
        if ((drawable instanceof LayerDrawable) && drawable.isStateful()) {
            drawable.setState(new int[0]);
            drawable.setState(state);
        }
        boolean z3 = j0Var.f592d;
        if (z3 || j0Var.f591c) {
            drawable.setColorFilter(f(z3 ? j0Var.f589a : null, j0Var.f591c ? j0Var.f590b : f511h, iArr));
        } else {
            drawable.clearColorFilter();
        }
    }

    public synchronized Drawable i(Context context, int i4) {
        return j(context, i4, false);
    }

    synchronized Drawable j(Context context, int i4, boolean z3) {
        Drawable q3;
        try {
            c(context);
            q3 = q(context, i4);
            if (q3 == null) {
                q3 = e(context, i4);
            }
            if (q3 == null) {
                q3 = androidx.core.content.a.c(context, i4);
            }
            if (q3 != null) {
                q3 = t(context, i4, z3, q3);
            }
            if (q3 != null) {
                u.b(q3);
            }
        } catch (Throwable th) {
            throw th;
        }
        return q3;
    }

    synchronized ColorStateList l(Context context, int i4) {
        ColorStateList m3;
        m3 = m(context, i4);
        if (m3 == null) {
            c cVar = this.f520g;
            m3 = cVar == null ? null : cVar.d(context, i4);
            if (m3 != null) {
                b(context, i4, m3);
            }
        }
        return m3;
    }

    PorterDuff.Mode n(int i4) {
        c cVar = this.f520g;
        if (cVar == null) {
            return null;
        }
        return cVar.b(i4);
    }

    synchronized Drawable r(Context context, u0 u0Var, int i4) {
        try {
            Drawable q3 = q(context, i4);
            if (q3 == null) {
                q3 = u0Var.a(i4);
            }
            if (q3 == null) {
                return null;
            }
            return t(context, i4, false, q3);
        } catch (Throwable th) {
            throw th;
        }
    }

    public synchronized void s(c cVar) {
        this.f520g = cVar;
    }

    boolean v(Context context, int i4, Drawable drawable) {
        c cVar = this.f520g;
        return cVar != null && cVar.a(context, i4, drawable);
    }
}
