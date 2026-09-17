package h;

import a1.b2.c3;
import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.content.res.XmlResourceParser;
import android.graphics.PorterDuff;
import android.util.AttributeSet;
import android.util.Log;
import android.util.Xml;
import android.view.InflateException;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import androidx.appcompat.view.menu.f;
import androidx.appcompat.widget.l0;
import androidx.appcompat.widget.u;
import androidx.core.view.k;
import c.i;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c extends MenuInflater {

    /* renamed from: e, reason: collision with root package name */
    static final Class[] f3391e;

    /* renamed from: f, reason: collision with root package name */
    static final Class[] f3392f;

    /* renamed from: a, reason: collision with root package name */
    final Object[] f3393a;

    /* renamed from: b, reason: collision with root package name */
    final Object[] f3394b;

    /* renamed from: c, reason: collision with root package name */
    Context f3395c;

    /* renamed from: d, reason: collision with root package name */
    private Object f3396d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a implements MenuItem.OnMenuItemClickListener {

        /* renamed from: c, reason: collision with root package name */
        private static final Class[] f3397c = {MenuItem.class};

        /* renamed from: a, reason: collision with root package name */
        private Object f3398a;

        /* renamed from: b, reason: collision with root package name */
        private Method f3399b;

        public a(Object obj, String str) {
            this.f3398a = obj;
            Class<?> cls = obj.getClass();
            try {
                this.f3399b = cls.getMethod(str, f3397c);
            } catch (Exception e4) {
                InflateException inflateException = new InflateException("Couldn't resolve menu item onClick handler " + str + " in class " + cls.getName());
                inflateException.initCause(e4);
                throw inflateException;
            }
        }

        @Override // android.view.MenuItem.OnMenuItemClickListener
        public boolean onMenuItemClick(MenuItem menuItem) {
            try {
                if (this.f3399b.getReturnType() == Boolean.TYPE) {
                    return ((Boolean) this.f3399b.invoke(this.f3398a, menuItem)).booleanValue();
                }
                this.f3399b.invoke(this.f3398a, menuItem);
                return true;
            } catch (Exception e4) {
                throw new RuntimeException(e4);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b {
        private CharSequence A;
        private CharSequence B;
        private ColorStateList C = null;
        private PorterDuff.Mode D = null;

        /* renamed from: a, reason: collision with root package name */
        private Menu f3400a;

        /* renamed from: b, reason: collision with root package name */
        private int f3401b;

        /* renamed from: c, reason: collision with root package name */
        private int f3402c;

        /* renamed from: d, reason: collision with root package name */
        private int f3403d;

        /* renamed from: e, reason: collision with root package name */
        private int f3404e;

        /* renamed from: f, reason: collision with root package name */
        private boolean f3405f;

        /* renamed from: g, reason: collision with root package name */
        private boolean f3406g;

        /* renamed from: h, reason: collision with root package name */
        private boolean f3407h;

        /* renamed from: i, reason: collision with root package name */
        private int f3408i;

        /* renamed from: j, reason: collision with root package name */
        private int f3409j;

        /* renamed from: k, reason: collision with root package name */
        private CharSequence f3410k;

        /* renamed from: l, reason: collision with root package name */
        private CharSequence f3411l;

        /* renamed from: m, reason: collision with root package name */
        private int f3412m;

        /* renamed from: n, reason: collision with root package name */
        private char f3413n;

        /* renamed from: o, reason: collision with root package name */
        private int f3414o;

        /* renamed from: p, reason: collision with root package name */
        private char f3415p;

        /* renamed from: q, reason: collision with root package name */
        private int f3416q;

        /* renamed from: r, reason: collision with root package name */
        private int f3417r;

        /* renamed from: s, reason: collision with root package name */
        private boolean f3418s;

        /* renamed from: t, reason: collision with root package name */
        private boolean f3419t;

        /* renamed from: u, reason: collision with root package name */
        private boolean f3420u;

        /* renamed from: v, reason: collision with root package name */
        private int f3421v;

        /* renamed from: w, reason: collision with root package name */
        private int f3422w;

        /* renamed from: x, reason: collision with root package name */
        private String f3423x;

        /* renamed from: y, reason: collision with root package name */
        private String f3424y;

        /* renamed from: z, reason: collision with root package name */
        private String f3425z;

        public b(Menu menu) {
            this.f3400a = menu;
            h();
        }

        private char c(String str) {
            if (str == null) {
                return (char) 0;
            }
            return str.charAt(0);
        }

        private Object e(String str, Class[] clsArr, Object[] objArr) {
            try {
                Constructor<?> constructor = Class.forName(str, false, c.this.f3395c.getClassLoader()).getConstructor(clsArr);
                constructor.setAccessible(true);
                return constructor.newInstance(objArr);
            } catch (Exception e4) {
                Log.w("SupportMenuInflater", "Cannot instantiate class: " + str, e4);
                return null;
            }
        }

        private void i(MenuItem menuItem) {
            boolean z3 = false;
            menuItem.setChecked(this.f3418s).setVisible(this.f3419t).setEnabled(this.f3420u).setCheckable(this.f3417r >= 1).setTitleCondensed(this.f3411l).setIcon(this.f3412m);
            int i4 = this.f3421v;
            if (i4 >= 0) {
                menuItem.setShowAsAction(i4);
            }
            if (this.f3425z != null) {
                if (c.this.f3395c.isRestricted()) {
                    throw new IllegalStateException("The android:onClick attribute cannot be used within a restricted context");
                }
                menuItem.setOnMenuItemClickListener(new a(c.this.b(), this.f3425z));
            }
            if (this.f3417r >= 2 && (menuItem instanceof f)) {
                ((f) menuItem).s(true);
            }
            String str = this.f3423x;
            if (str != null) {
                menuItem.setActionView((View) e(str, c.f3391e, c.this.f3393a));
                z3 = true;
            }
            int i5 = this.f3422w;
            if (i5 > 0) {
                if (z3) {
                    Log.w("SupportMenuInflater", "Ignoring attribute 'itemActionViewLayout'. Action view already specified.");
                } else {
                    menuItem.setActionView(i5);
                }
            }
            k.b(menuItem, this.A);
            k.f(menuItem, this.B);
            k.a(menuItem, this.f3413n, this.f3414o);
            k.e(menuItem, this.f3415p, this.f3416q);
            PorterDuff.Mode mode = this.D;
            if (mode != null) {
                k.d(menuItem, mode);
            }
            ColorStateList colorStateList = this.C;
            if (colorStateList != null) {
                k.c(menuItem, colorStateList);
            }
        }

        public void a() {
            this.f3407h = true;
            i(this.f3400a.add(this.f3401b, this.f3408i, this.f3409j, this.f3410k));
        }

        public SubMenu b() {
            this.f3407h = true;
            SubMenu addSubMenu = this.f3400a.addSubMenu(this.f3401b, this.f3408i, this.f3409j, this.f3410k);
            i(addSubMenu.getItem());
            return addSubMenu;
        }

        public boolean d() {
            return this.f3407h;
        }

        public void f(AttributeSet attributeSet) {
            TypedArray obtainStyledAttributes = c.this.f3395c.obtainStyledAttributes(attributeSet, i.F0);
            this.f3401b = obtainStyledAttributes.getResourceId(i.H0, 0);
            this.f3402c = obtainStyledAttributes.getInt(i.J0, 0);
            this.f3403d = obtainStyledAttributes.getInt(i.K0, 0);
            this.f3404e = obtainStyledAttributes.getInt(i.L0, 0);
            this.f3405f = obtainStyledAttributes.getBoolean(i.I0, true);
            this.f3406g = obtainStyledAttributes.getBoolean(i.G0, true);
            obtainStyledAttributes.recycle();
        }

        public void g(AttributeSet attributeSet) {
            l0 r3 = l0.r(c.this.f3395c, attributeSet, i.M0);
            this.f3408i = r3.l(i.P0, 0);
            this.f3409j = (r3.i(i.S0, this.f3402c) & (-65536)) | (r3.i(i.T0, this.f3403d) & 65535);
            this.f3410k = r3.n(i.U0);
            this.f3411l = r3.n(i.V0);
            this.f3412m = r3.l(i.N0, 0);
            this.f3413n = c(r3.m(i.W0));
            this.f3414o = r3.i(i.f1959d1, 4096);
            this.f3415p = c(r3.m(i.X0));
            this.f3416q = r3.i(i.f1975h1, 4096);
            if (r3.p(i.Y0)) {
                this.f3417r = r3.a(i.Y0, false) ? 1 : 0;
            } else {
                this.f3417r = this.f3404e;
            }
            this.f3418s = r3.a(i.Q0, false);
            this.f3419t = r3.a(i.R0, this.f3405f);
            this.f3420u = r3.a(i.O0, this.f3406g);
            this.f3421v = r3.i(i.f1979i1, -1);
            this.f3425z = r3.m(i.Z0);
            this.f3422w = r3.l(i.f1947a1, 0);
            this.f3423x = r3.m(i.f1955c1);
            String m3 = r3.m(i.f1951b1);
            this.f3424y = m3;
            boolean z3 = m3 != null;
            if (z3 && this.f3422w == 0 && this.f3423x == null) {
                d.a(e(m3, c.f3392f, c.this.f3394b));
            } else if (z3) {
                Log.w("SupportMenuInflater", "Ignoring attribute 'actionProviderClass'. Action view already specified.");
            }
            this.A = r3.n(i.f1963e1);
            this.B = r3.n(i.f1983j1);
            if (r3.p(i.f1971g1)) {
                this.D = u.d(r3.i(i.f1971g1, -1), this.D);
            } else {
                this.D = null;
            }
            if (r3.p(i.f1967f1)) {
                this.C = r3.c(i.f1967f1);
            } else {
                this.C = null;
            }
            r3.t();
            this.f3407h = false;
        }

        public void h() {
            this.f3401b = 0;
            this.f3402c = 0;
            this.f3403d = 0;
            this.f3404e = 0;
            this.f3405f = true;
            this.f3406g = true;
        }
    }

    static {
        Class[] clsArr = {Context.class};
        f3391e = clsArr;
        f3392f = clsArr;
    }

    public c(Context context) {
        super(context);
        this.f3395c = context;
        Object[] objArr = {context};
        this.f3393a = objArr;
        this.f3394b = objArr;
    }

    private Object a(Object obj) {
        return (!(obj instanceof Activity) && (obj instanceof ContextWrapper)) ? a(((ContextWrapper) obj).getBaseContext()) : obj;
    }

    private void c(XmlPullParser xmlPullParser, AttributeSet attributeSet, Menu menu) {
        b bVar = new b(menu);
        int eventType = xmlPullParser.getEventType();
        while (true) {
            if (eventType == 2) {
                String name = xmlPullParser.getName();
                if (!name.equals("menu")) {
                    throw new RuntimeException(c3.d4(580) + name);
                }
                eventType = xmlPullParser.next();
            } else {
                eventType = xmlPullParser.next();
                if (eventType == 1) {
                    break;
                }
            }
        }
        boolean z3 = false;
        boolean z4 = false;
        String str = null;
        while (!z3) {
            if (eventType == 1) {
                throw new RuntimeException("Unexpected end of document");
            }
            if (eventType != 2) {
                if (eventType == 3) {
                    String name2 = xmlPullParser.getName();
                    if (z4 && name2.equals(str)) {
                        z4 = false;
                        str = null;
                    } else if (name2.equals("group")) {
                        bVar.h();
                    } else if (name2.equals("item")) {
                        if (!bVar.d()) {
                            bVar.a();
                        }
                    } else if (name2.equals("menu")) {
                        z3 = true;
                    }
                }
            } else if (!z4) {
                String name3 = xmlPullParser.getName();
                if (name3.equals("group")) {
                    bVar.f(attributeSet);
                } else if (name3.equals("item")) {
                    bVar.g(attributeSet);
                } else if (name3.equals("menu")) {
                    c(xmlPullParser, attributeSet, bVar.b());
                } else {
                    str = name3;
                    z4 = true;
                }
            }
            eventType = xmlPullParser.next();
        }
    }

    Object b() {
        if (this.f3396d == null) {
            this.f3396d = a(this.f3395c);
        }
        return this.f3396d;
    }

    @Override // android.view.MenuInflater
    public void inflate(int i4, Menu menu) {
        if (!(menu instanceof m.a)) {
            super.inflate(i4, menu);
            return;
        }
        XmlResourceParser xmlResourceParser = null;
        try {
            try {
                try {
                    xmlResourceParser = this.f3395c.getResources().getLayout(i4);
                    c(xmlResourceParser, Xml.asAttributeSet(xmlResourceParser), menu);
                } catch (IOException e4) {
                    throw new InflateException("Error inflating menu XML", e4);
                }
            } catch (XmlPullParserException e5) {
                throw new InflateException("Error inflating menu XML", e5);
            }
        } finally {
            if (xmlResourceParser != null) {
                xmlResourceParser.close();
            }
        }
    }
}
