package v;

import a1.b2.c3;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.x;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import u2.c0;
import u2.w;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: a, reason: collision with root package name */
    public static final c f5026a = new c();

    /* renamed from: b, reason: collision with root package name */
    private static C0078c f5027b = C0078c.f5038d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum a {
        PENALTY_LOG,
        PENALTY_DEATH,
        DETECT_FRAGMENT_REUSE,
        DETECT_FRAGMENT_TAG_USAGE,
        DETECT_RETAIN_INSTANCE_USAGE,
        f5033j,
        DETECT_TARGET_FRAGMENT_USAGE,
        DETECT_WRONG_FRAGMENT_CONTAINER
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface b {
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: v.c$c, reason: collision with other inner class name */
    public static final class C0078c {

        /* renamed from: c, reason: collision with root package name */
        public static final a f5037c = new a(null);

        /* renamed from: d, reason: collision with root package name */
        public static final C0078c f5038d = new C0078c(c0.a(), null, w.d());

        /* renamed from: a, reason: collision with root package name */
        private final Set f5039a;

        /* renamed from: b, reason: collision with root package name */
        private final Map f5040b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: v.c$c$a */
        public static final class a {
            private a() {
            }

            public /* synthetic */ a(b3.d dVar) {
                this();
            }
        }

        public C0078c(Set set, b bVar, Map map) {
            b3.f.e(set, "flags");
            b3.f.e(map, "allowedViolations");
            this.f5039a = set;
            LinkedHashMap linkedHashMap = new LinkedHashMap();
            for (Map.Entry entry : map.entrySet()) {
                linkedHashMap.put((String) entry.getKey(), (Set) entry.getValue());
            }
            this.f5040b = linkedHashMap;
        }

        public final Set a() {
            return this.f5039a;
        }

        public final b b() {
            return null;
        }

        public final Map c() {
            return this.f5040b;
        }
    }

    private c() {
    }

    private final C0078c b(Fragment fragment) {
        while (fragment != null) {
            if (fragment.Y()) {
                x G = fragment.G();
                b3.f.d(G, "declaringFragment.parentFragmentManager");
                if (G.z0() != null) {
                    C0078c z02 = G.z0();
                    b3.f.b(z02);
                    return z02;
                }
            }
            fragment = fragment.F();
        }
        return f5027b;
    }

    private final void c(C0078c c0078c, final g gVar) {
        Fragment a4 = gVar.a();
        final String name = a4.getClass().getName();
        if (c0078c.a().contains(a.PENALTY_LOG)) {
            Log.d("FragmentStrictMode", "Policy violation in " + name, gVar);
        }
        c0078c.b();
        if (c0078c.a().contains(a.PENALTY_DEATH)) {
            j(a4, new Runnable() { // from class: v.b
                @Override // java.lang.Runnable
                public final void run() {
                    c.d(name, gVar);
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void d(String str, g gVar) {
        b3.f.e(gVar, "$violation");
        Log.e("FragmentStrictMode", "Policy violation with PENALTY_DEATH in " + str, gVar);
        throw gVar;
    }

    private final void e(g gVar) {
        if (x.G0(3)) {
            Log.d("FragmentManager", "StrictMode violation in " + gVar.a().getClass().getName(), gVar);
        }
    }

    public static final void f(Fragment fragment, String str) {
        b3.f.e(fragment, "fragment");
        b3.f.e(str, c3.d4(544));
        v.a aVar = new v.a(fragment, str);
        c cVar = f5026a;
        cVar.e(aVar);
        C0078c b4 = cVar.b(fragment);
        if (b4.a().contains(a.DETECT_FRAGMENT_REUSE) && cVar.k(b4, fragment.getClass(), aVar.getClass())) {
            cVar.c(b4, aVar);
        }
    }

    public static final void g(Fragment fragment, ViewGroup viewGroup) {
        b3.f.e(fragment, "fragment");
        d dVar = new d(fragment, viewGroup);
        c cVar = f5026a;
        cVar.e(dVar);
        C0078c b4 = cVar.b(fragment);
        if (b4.a().contains(a.DETECT_FRAGMENT_TAG_USAGE) && cVar.k(b4, fragment.getClass(), dVar.getClass())) {
            cVar.c(b4, dVar);
        }
    }

    public static final void h(Fragment fragment) {
        b3.f.e(fragment, "fragment");
        e eVar = new e(fragment);
        c cVar = f5026a;
        cVar.e(eVar);
        C0078c b4 = cVar.b(fragment);
        if (b4.a().contains(a.DETECT_TARGET_FRAGMENT_USAGE) && cVar.k(b4, fragment.getClass(), eVar.getClass())) {
            cVar.c(b4, eVar);
        }
    }

    public static final void i(Fragment fragment, ViewGroup viewGroup) {
        b3.f.e(fragment, "fragment");
        b3.f.e(viewGroup, "container");
        h hVar = new h(fragment, viewGroup);
        c cVar = f5026a;
        cVar.e(hVar);
        C0078c b4 = cVar.b(fragment);
        if (b4.a().contains(a.DETECT_WRONG_FRAGMENT_CONTAINER) && cVar.k(b4, fragment.getClass(), hVar.getClass())) {
            cVar.c(b4, hVar);
        }
    }

    private final void j(Fragment fragment, Runnable runnable) {
        if (!fragment.Y()) {
            runnable.run();
            return;
        }
        Handler v3 = fragment.G().t0().v();
        b3.f.d(v3, "fragment.parentFragmentManager.host.handler");
        if (b3.f.a(v3.getLooper(), Looper.myLooper())) {
            runnable.run();
        } else {
            v3.post(runnable);
        }
    }

    private final boolean k(C0078c c0078c, Class cls, Class cls2) {
        Set set = (Set) c0078c.c().get(cls.getName());
        if (set == null) {
            return true;
        }
        if (b3.f.a(cls2.getSuperclass(), g.class) || !u2.g.g(set, cls2.getSuperclass())) {
            return !set.contains(cls2);
        }
        return false;
    }
}
