package androidx.fragment.app;

import a1.b2.c3;
import android.view.ViewGroup;
import androidx.lifecycle.g;
import java.lang.reflect.Modifier;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f0 {

    /* renamed from: a, reason: collision with root package name */
    private final o f1445a;

    /* renamed from: b, reason: collision with root package name */
    private final ClassLoader f1446b;

    /* renamed from: d, reason: collision with root package name */
    int f1448d;

    /* renamed from: e, reason: collision with root package name */
    int f1449e;

    /* renamed from: f, reason: collision with root package name */
    int f1450f;

    /* renamed from: g, reason: collision with root package name */
    int f1451g;

    /* renamed from: h, reason: collision with root package name */
    int f1452h;

    /* renamed from: i, reason: collision with root package name */
    boolean f1453i;

    /* renamed from: k, reason: collision with root package name */
    String f1455k;

    /* renamed from: l, reason: collision with root package name */
    int f1456l;

    /* renamed from: m, reason: collision with root package name */
    CharSequence f1457m;

    /* renamed from: n, reason: collision with root package name */
    int f1458n;

    /* renamed from: o, reason: collision with root package name */
    CharSequence f1459o;

    /* renamed from: p, reason: collision with root package name */
    ArrayList f1460p;

    /* renamed from: q, reason: collision with root package name */
    ArrayList f1461q;

    /* renamed from: s, reason: collision with root package name */
    ArrayList f1463s;

    /* renamed from: c, reason: collision with root package name */
    ArrayList f1447c = new ArrayList();

    /* renamed from: j, reason: collision with root package name */
    boolean f1454j = true;

    /* renamed from: r, reason: collision with root package name */
    boolean f1462r = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class a {

        /* renamed from: a, reason: collision with root package name */
        int f1464a;

        /* renamed from: b, reason: collision with root package name */
        Fragment f1465b;

        /* renamed from: c, reason: collision with root package name */
        boolean f1466c;

        /* renamed from: d, reason: collision with root package name */
        int f1467d;

        /* renamed from: e, reason: collision with root package name */
        int f1468e;

        /* renamed from: f, reason: collision with root package name */
        int f1469f;

        /* renamed from: g, reason: collision with root package name */
        int f1470g;

        /* renamed from: h, reason: collision with root package name */
        g.c f1471h;

        /* renamed from: i, reason: collision with root package name */
        g.c f1472i;

        a() {
        }

        a(int i4, Fragment fragment) {
            this.f1464a = i4;
            this.f1465b = fragment;
            this.f1466c = false;
            g.c cVar = g.c.RESUMED;
            this.f1471h = cVar;
            this.f1472i = cVar;
        }

        a(int i4, Fragment fragment, boolean z3) {
            this.f1464a = i4;
            this.f1465b = fragment;
            this.f1466c = z3;
            g.c cVar = g.c.RESUMED;
            this.f1471h = cVar;
            this.f1472i = cVar;
        }
    }

    f0(o oVar, ClassLoader classLoader) {
        this.f1445a = oVar;
        this.f1446b = classLoader;
    }

    public f0 b(int i4, Fragment fragment, String str) {
        k(i4, fragment, str, 1);
        return this;
    }

    f0 c(ViewGroup viewGroup, Fragment fragment, String str) {
        fragment.H = viewGroup;
        return b(viewGroup.getId(), fragment, str);
    }

    public f0 d(Fragment fragment, String str) {
        k(0, fragment, str, 1);
        return this;
    }

    void e(a aVar) {
        this.f1447c.add(aVar);
        aVar.f1467d = this.f1448d;
        aVar.f1468e = this.f1449e;
        aVar.f1469f = this.f1450f;
        aVar.f1470g = this.f1451g;
    }

    public abstract int f();

    public abstract int g();

    public abstract void h();

    public abstract void i();

    public f0 j() {
        if (this.f1453i) {
            throw new IllegalStateException("This transaction is already being added to the back stack");
        }
        this.f1454j = false;
        return this;
    }

    void k(int i4, Fragment fragment, String str, int i5) {
        String str2 = fragment.R;
        if (str2 != null) {
            v.c.f(fragment, str2);
        }
        Class<?> cls = fragment.getClass();
        int modifiers = cls.getModifiers();
        if (cls.isAnonymousClass() || !Modifier.isPublic(modifiers) || (cls.isMemberClass() && !Modifier.isStatic(modifiers))) {
            throw new IllegalStateException("Fragment " + cls.getCanonicalName() + c3.d4(770));
        }
        if (str != null) {
            String str3 = fragment.f1292z;
            if (str3 != null && !str.equals(str3)) {
                throw new IllegalStateException("Can't change tag of fragment " + fragment + ": was " + fragment.f1292z + " now " + str);
            }
            fragment.f1292z = str;
        }
        if (i4 != 0) {
            if (i4 == -1) {
                throw new IllegalArgumentException("Can't add fragment " + fragment + " with tag " + str + " to container view with no id");
            }
            int i6 = fragment.f1290x;
            if (i6 != 0 && i6 != i4) {
                throw new IllegalStateException("Can't change container ID of fragment " + fragment + ": was " + fragment.f1290x + " now " + i4);
            }
            fragment.f1290x = i4;
            fragment.f1291y = i4;
        }
        e(new a(i5, fragment));
    }

    public f0 l(Fragment fragment) {
        e(new a(3, fragment));
        return this;
    }

    public f0 m(boolean z3) {
        this.f1462r = z3;
        return this;
    }
}
