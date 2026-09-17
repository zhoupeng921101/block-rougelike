package androidx.startup;

import a0.c;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import b0.b;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: d, reason: collision with root package name */
    private static volatile a f1754d;

    /* renamed from: e, reason: collision with root package name */
    private static final Object f1755e = new Object();

    /* renamed from: c, reason: collision with root package name */
    final Context f1758c;

    /* renamed from: b, reason: collision with root package name */
    final Set f1757b = new HashSet();

    /* renamed from: a, reason: collision with root package name */
    final Map f1756a = new HashMap();

    a(Context context) {
        this.f1758c = context.getApplicationContext();
    }

    private Object d(Class cls, Set set) {
        Object obj;
        if (b.d()) {
            try {
                b.a(cls.getSimpleName());
            } catch (Throwable th) {
                b.b();
                throw th;
            }
        }
        if (set.contains(cls)) {
            throw new IllegalStateException(String.format("Cannot initialize %s. Cycle detected.", cls.getName()));
        }
        if (this.f1756a.containsKey(cls)) {
            obj = this.f1756a.get(cls);
        } else {
            set.add(cls);
            try {
                a0.a aVar = (a0.a) cls.getDeclaredConstructor(null).newInstance(null);
                List<Class> a4 = aVar.a();
                if (!a4.isEmpty()) {
                    for (Class cls2 : a4) {
                        if (!this.f1756a.containsKey(cls2)) {
                            d(cls2, set);
                        }
                    }
                }
                obj = aVar.b(this.f1758c);
                set.remove(cls);
                this.f1756a.put(cls, obj);
            } catch (Throwable th2) {
                throw new c(th2);
            }
        }
        b.b();
        return obj;
    }

    public static a e(Context context) {
        if (f1754d == null) {
            synchronized (f1755e) {
                try {
                    if (f1754d == null) {
                        f1754d = new a(context);
                    }
                } finally {
                }
            }
        }
        return f1754d;
    }

    void a() {
        try {
            try {
                b.a("Startup");
                b(this.f1758c.getPackageManager().getProviderInfo(new ComponentName(this.f1758c.getPackageName(), InitializationProvider.class.getName()), 128).metaData);
            } catch (PackageManager.NameNotFoundException e4) {
                throw new c(e4);
            }
        } finally {
            b.b();
        }
    }

    void b(Bundle bundle) {
        String string = this.f1758c.getString(a0.b.f9a);
        if (bundle != null) {
            try {
                HashSet hashSet = new HashSet();
                for (String str : bundle.keySet()) {
                    if (string.equals(bundle.getString(str, null))) {
                        Class<?> cls = Class.forName(str);
                        if (a0.a.class.isAssignableFrom(cls)) {
                            this.f1757b.add(cls);
                        }
                    }
                }
                Iterator it = this.f1757b.iterator();
                while (it.hasNext()) {
                    d((Class) it.next(), hashSet);
                }
            } catch (ClassNotFoundException e4) {
                throw new c(e4);
            }
        }
    }

    Object c(Class cls) {
        Object obj;
        synchronized (f1755e) {
            try {
                obj = this.f1756a.get(cls);
                if (obj == null) {
                    obj = d(cls, new HashSet());
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return obj;
    }

    public Object f(Class cls) {
        return c(cls);
    }

    public boolean g(Class cls) {
        return this.f1757b.contains(cls);
    }
}
