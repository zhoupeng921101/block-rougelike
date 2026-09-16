package androidx.savedstate;

import a1.b2.c3;
import android.os.Bundle;
import androidx.lifecycle.g;
import androidx.lifecycle.i;
import androidx.lifecycle.k;
import b3.d;
import b3.f;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Set;
import z.c;
import z.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class Recreator implements i {

    /* renamed from: b, reason: collision with root package name */
    public static final a f1751b = new a(null);

    /* renamed from: a, reason: collision with root package name */
    private final e f1752a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(d dVar) {
            this();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b implements c.InterfaceC0086c {

        /* renamed from: a, reason: collision with root package name */
        private final Set f1753a;

        public b(c cVar) {
            f.e(cVar, "registry");
            this.f1753a = new LinkedHashSet();
            cVar.h("androidx.savedstate.Restarter", this);
        }

        @Override // z.c.InterfaceC0086c
        public Bundle a() {
            Bundle bundle = new Bundle();
            bundle.putStringArrayList("classes_to_restore", new ArrayList<>(this.f1753a));
            return bundle;
        }

        public final void b(String str) {
            f.e(str, "className");
            this.f1753a.add(str);
        }
    }

    public Recreator(e eVar) {
        f.e(eVar, c3.d4(514));
        this.f1752a = eVar;
    }

    private final void h(String str) {
        try {
            Class<? extends U> asSubclass = Class.forName(str, false, Recreator.class.getClassLoader()).asSubclass(c.a.class);
            f.d(asSubclass, "{\n                Class.…class.java)\n            }");
            try {
                Constructor declaredConstructor = asSubclass.getDeclaredConstructor(null);
                declaredConstructor.setAccessible(true);
                try {
                    Object newInstance = declaredConstructor.newInstance(null);
                    f.d(newInstance, "{\n                constr…wInstance()\n            }");
                    ((c.a) newInstance).a(this.f1752a);
                } catch (Exception e4) {
                    throw new RuntimeException("Failed to instantiate " + str, e4);
                }
            } catch (NoSuchMethodException e5) {
                throw new IllegalStateException("Class " + asSubclass.getSimpleName() + " must have default constructor in order to be automatically recreated", e5);
            }
        } catch (ClassNotFoundException e6) {
            throw new RuntimeException("Class " + str + " wasn't found", e6);
        }
    }

    @Override // androidx.lifecycle.i
    public void g(k kVar, g.b bVar) {
        f.e(kVar, "source");
        f.e(bVar, "event");
        if (bVar != g.b.ON_CREATE) {
            throw new AssertionError("Next event must be ON_CREATE");
        }
        kVar.q().c(this);
        Bundle b4 = this.f1752a.c().b("androidx.savedstate.Restarter");
        if (b4 == null) {
            return;
        }
        ArrayList<String> stringArrayList = b4.getStringArrayList("classes_to_restore");
        if (stringArrayList == null) {
            throw new IllegalStateException("Bundle with restored state for the component \"androidx.savedstate.Restarter\" must contain list of strings by the key \"classes_to_restore\"");
        }
        int size = stringArrayList.size();
        int i4 = 0;
        while (i4 < size) {
            String str = stringArrayList.get(i4);
            i4++;
            h(str);
        }
    }
}
