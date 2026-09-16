package z;

import a1.b2.c3;
import android.os.Bundle;
import androidx.lifecycle.g;
import androidx.lifecycle.i;
import androidx.lifecycle.k;
import androidx.savedstate.Recreator;
import j.b;
import java.util.Iterator;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: g, reason: collision with root package name */
    private static final b f5185g = new b(null);

    /* renamed from: b, reason: collision with root package name */
    private boolean f5187b;

    /* renamed from: c, reason: collision with root package name */
    private Bundle f5188c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f5189d;

    /* renamed from: e, reason: collision with root package name */
    private Recreator.b f5190e;

    /* renamed from: a, reason: collision with root package name */
    private final j.b f5186a = new j.b();

    /* renamed from: f, reason: collision with root package name */
    private boolean f5191f = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        void a(e eVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class b {
        private b() {
        }

        public /* synthetic */ b(b3.d dVar) {
            this();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: z.c$c, reason: collision with other inner class name */
    public interface InterfaceC0086c {
        Bundle a();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void d(c cVar, k kVar, g.b bVar) {
        b3.f.e(cVar, "this$0");
        b3.f.e(kVar, "<anonymous parameter 0>");
        b3.f.e(bVar, "event");
        if (bVar == g.b.ON_START) {
            cVar.f5191f = true;
        } else if (bVar == g.b.ON_STOP) {
            cVar.f5191f = false;
        }
    }

    public final Bundle b(String str) {
        b3.f.e(str, "key");
        if (!this.f5189d) {
            throw new IllegalStateException(c3.d4(547));
        }
        Bundle bundle = this.f5188c;
        if (bundle == null) {
            return null;
        }
        Bundle bundle2 = bundle != null ? bundle.getBundle(str) : null;
        Bundle bundle3 = this.f5188c;
        if (bundle3 != null) {
            bundle3.remove(str);
        }
        Bundle bundle4 = this.f5188c;
        if (bundle4 != null && !bundle4.isEmpty()) {
            return bundle2;
        }
        this.f5188c = null;
        return bundle2;
    }

    public final InterfaceC0086c c(String str) {
        b3.f.e(str, "key");
        Iterator it = this.f5186a.iterator();
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            b3.f.d(entry, "components");
            String str2 = (String) entry.getKey();
            InterfaceC0086c interfaceC0086c = (InterfaceC0086c) entry.getValue();
            if (b3.f.a(str2, str)) {
                return interfaceC0086c;
            }
        }
        return null;
    }

    public final void e(g gVar) {
        b3.f.e(gVar, "lifecycle");
        if (this.f5187b) {
            throw new IllegalStateException(c3.d4(99));
        }
        gVar.a(new i() { // from class: z.b
            @Override // androidx.lifecycle.i
            public final void g(k kVar, g.b bVar) {
                c.d(c.this, kVar, bVar);
            }
        });
        this.f5187b = true;
    }

    public final void f(Bundle bundle) {
        if (!this.f5187b) {
            throw new IllegalStateException("You must call performAttach() before calling performRestore(Bundle).");
        }
        if (this.f5189d) {
            throw new IllegalStateException("SavedStateRegistry was already restored.");
        }
        this.f5188c = bundle != null ? bundle.getBundle("androidx.lifecycle.BundlableSavedStateRegistry.key") : null;
        this.f5189d = true;
    }

    public final void g(Bundle bundle) {
        b3.f.e(bundle, "outBundle");
        Bundle bundle2 = new Bundle();
        Bundle bundle3 = this.f5188c;
        if (bundle3 != null) {
            bundle2.putAll(bundle3);
        }
        b.d f4 = this.f5186a.f();
        b3.f.d(f4, "this.components.iteratorWithAdditions()");
        while (f4.hasNext()) {
            Map.Entry entry = (Map.Entry) f4.next();
            bundle2.putBundle((String) entry.getKey(), ((InterfaceC0086c) entry.getValue()).a());
        }
        if (bundle2.isEmpty()) {
            return;
        }
        bundle.putBundle("androidx.lifecycle.BundlableSavedStateRegistry.key", bundle2);
    }

    public final void h(String str, InterfaceC0086c interfaceC0086c) {
        b3.f.e(str, "key");
        b3.f.e(interfaceC0086c, "provider");
        if (((InterfaceC0086c) this.f5186a.i(str, interfaceC0086c)) != null) {
            throw new IllegalArgumentException("SavedStateProvider with the given key is already registered");
        }
    }

    public final void i(Class cls) {
        b3.f.e(cls, "clazz");
        if (!this.f5191f) {
            throw new IllegalStateException("Can not perform this action after onSaveInstanceState");
        }
        Recreator.b bVar = this.f5190e;
        if (bVar == null) {
            bVar = new Recreator.b(this);
        }
        this.f5190e = bVar;
        try {
            cls.getDeclaredConstructor(null);
            Recreator.b bVar2 = this.f5190e;
            if (bVar2 != null) {
                String name = cls.getName();
                b3.f.d(name, c3.d4(356));
                bVar2.b(name);
            }
        } catch (NoSuchMethodException e4) {
            throw new IllegalArgumentException(c3.d4(100) + cls.getSimpleName() + " must have default constructor in order to be automatically recreated", e4);
        }
    }
}
