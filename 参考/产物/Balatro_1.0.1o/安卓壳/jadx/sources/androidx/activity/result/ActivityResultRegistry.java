package androidx.activity.result;

import a1.b2.c3;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import androidx.lifecycle.g;
import androidx.lifecycle.i;
import androidx.lifecycle.k;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class ActivityResultRegistry {

    /* renamed from: a, reason: collision with root package name */
    private Random f77a = new Random();

    /* renamed from: b, reason: collision with root package name */
    private final Map f78b = new HashMap();

    /* renamed from: c, reason: collision with root package name */
    final Map f79c = new HashMap();

    /* renamed from: d, reason: collision with root package name */
    private final Map f80d = new HashMap();

    /* renamed from: e, reason: collision with root package name */
    ArrayList f81e = new ArrayList();

    /* renamed from: f, reason: collision with root package name */
    final transient Map f82f = new HashMap();

    /* renamed from: g, reason: collision with root package name */
    final Map f83g = new HashMap();

    /* renamed from: h, reason: collision with root package name */
    final Bundle f84h = new Bundle();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a extends androidx.activity.result.c {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ String f89a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ b.a f90b;

        a(String str, b.a aVar) {
            this.f89a = str;
            this.f90b = aVar;
        }

        @Override // androidx.activity.result.c
        public void b(Object obj, androidx.core.app.b bVar) {
            Integer num = (Integer) ActivityResultRegistry.this.f79c.get(this.f89a);
            if (num != null) {
                ActivityResultRegistry.this.f81e.add(this.f89a);
                try {
                    ActivityResultRegistry.this.f(num.intValue(), this.f90b, obj, bVar);
                    return;
                } catch (Exception e4) {
                    ActivityResultRegistry.this.f81e.remove(this.f89a);
                    throw e4;
                }
            }
            throw new IllegalStateException("Attempting to launch an unregistered ActivityResultLauncher with contract " + this.f90b + " and input " + obj + ". You must ensure the ActivityResultLauncher is registered before calling launch().");
        }

        @Override // androidx.activity.result.c
        public void c() {
            ActivityResultRegistry.this.l(this.f89a);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends androidx.activity.result.c {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ String f92a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ b.a f93b;

        b(String str, b.a aVar) {
            this.f92a = str;
            this.f93b = aVar;
        }

        @Override // androidx.activity.result.c
        public void b(Object obj, androidx.core.app.b bVar) {
            Integer num = (Integer) ActivityResultRegistry.this.f79c.get(this.f92a);
            if (num != null) {
                ActivityResultRegistry.this.f81e.add(this.f92a);
                try {
                    ActivityResultRegistry.this.f(num.intValue(), this.f93b, obj, bVar);
                    return;
                } catch (Exception e4) {
                    ActivityResultRegistry.this.f81e.remove(this.f92a);
                    throw e4;
                }
            }
            throw new IllegalStateException("Attempting to launch an unregistered ActivityResultLauncher with contract " + this.f93b + c3.d4(358) + obj + c3.d4(465));
        }

        @Override // androidx.activity.result.c
        public void c() {
            ActivityResultRegistry.this.l(this.f92a);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class c {

        /* renamed from: a, reason: collision with root package name */
        final androidx.activity.result.b f95a;

        /* renamed from: b, reason: collision with root package name */
        final b.a f96b;

        c(androidx.activity.result.b bVar, b.a aVar) {
            this.f95a = bVar;
            this.f96b = aVar;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class d {

        /* renamed from: a, reason: collision with root package name */
        final g f97a;

        /* renamed from: b, reason: collision with root package name */
        private final ArrayList f98b = new ArrayList();

        d(g gVar) {
            this.f97a = gVar;
        }

        void a(i iVar) {
            this.f97a.a(iVar);
            this.f98b.add(iVar);
        }

        void b() {
            ArrayList arrayList = this.f98b;
            int size = arrayList.size();
            int i4 = 0;
            while (i4 < size) {
                Object obj = arrayList.get(i4);
                i4++;
                this.f97a.c((i) obj);
            }
            this.f98b.clear();
        }
    }

    private void a(int i4, String str) {
        this.f78b.put(Integer.valueOf(i4), str);
        this.f79c.put(str, Integer.valueOf(i4));
    }

    private void d(String str, int i4, Intent intent, c cVar) {
        if (cVar == null || cVar.f95a == null || !this.f81e.contains(str)) {
            this.f83g.remove(str);
            this.f84h.putParcelable(str, new androidx.activity.result.a(i4, intent));
        } else {
            cVar.f95a.a(cVar.f96b.c(i4, intent));
            this.f81e.remove(str);
        }
    }

    private int e() {
        int nextInt = this.f77a.nextInt(2147418112);
        while (true) {
            int i4 = nextInt + 65536;
            if (!this.f78b.containsKey(Integer.valueOf(i4))) {
                return i4;
            }
            nextInt = this.f77a.nextInt(2147418112);
        }
    }

    private void k(String str) {
        if (((Integer) this.f79c.get(str)) != null) {
            return;
        }
        a(e(), str);
    }

    public final boolean b(int i4, int i5, Intent intent) {
        String str = (String) this.f78b.get(Integer.valueOf(i4));
        if (str == null) {
            return false;
        }
        d(str, i5, intent, (c) this.f82f.get(str));
        return true;
    }

    public final boolean c(int i4, Object obj) {
        androidx.activity.result.b bVar;
        String str = (String) this.f78b.get(Integer.valueOf(i4));
        if (str == null) {
            return false;
        }
        c cVar = (c) this.f82f.get(str);
        if (cVar == null || (bVar = cVar.f95a) == null) {
            this.f84h.remove(str);
            this.f83g.put(str, obj);
            return true;
        }
        if (!this.f81e.remove(str)) {
            return true;
        }
        bVar.a(obj);
        return true;
    }

    public abstract void f(int i4, b.a aVar, Object obj, androidx.core.app.b bVar);

    public final void g(Bundle bundle) {
        if (bundle == null) {
            return;
        }
        ArrayList<Integer> integerArrayList = bundle.getIntegerArrayList("KEY_COMPONENT_ACTIVITY_REGISTERED_RCS");
        ArrayList<String> stringArrayList = bundle.getStringArrayList("KEY_COMPONENT_ACTIVITY_REGISTERED_KEYS");
        if (stringArrayList == null || integerArrayList == null) {
            return;
        }
        this.f81e = bundle.getStringArrayList(c3.d4(315));
        this.f77a = (Random) bundle.getSerializable("KEY_COMPONENT_ACTIVITY_RANDOM_OBJECT");
        this.f84h.putAll(bundle.getBundle(c3.d4(499)));
        for (int i4 = 0; i4 < stringArrayList.size(); i4++) {
            String str = stringArrayList.get(i4);
            if (this.f79c.containsKey(str)) {
                Integer num = (Integer) this.f79c.remove(str);
                if (!this.f84h.containsKey(str)) {
                    this.f78b.remove(num);
                }
            }
            a(integerArrayList.get(i4).intValue(), stringArrayList.get(i4));
        }
    }

    public final void h(Bundle bundle) {
        bundle.putIntegerArrayList("KEY_COMPONENT_ACTIVITY_REGISTERED_RCS", new ArrayList<>(this.f79c.values()));
        bundle.putStringArrayList(c3.d4(548), new ArrayList<>(this.f79c.keySet()));
        bundle.putStringArrayList(c3.d4(549), new ArrayList<>(this.f81e));
        bundle.putBundle("KEY_COMPONENT_ACTIVITY_PENDING_RESULT", (Bundle) this.f84h.clone());
        bundle.putSerializable("KEY_COMPONENT_ACTIVITY_RANDOM_OBJECT", this.f77a);
    }

    public final androidx.activity.result.c i(final String str, k kVar, final b.a aVar, final androidx.activity.result.b bVar) {
        g q3 = kVar.q();
        if (q3.b().a(g.c.STARTED)) {
            throw new IllegalStateException("LifecycleOwner " + kVar + " is attempting to register while current state is " + q3.b() + ". LifecycleOwners must call register before they are STARTED.");
        }
        k(str);
        d dVar = (d) this.f80d.get(str);
        if (dVar == null) {
            dVar = new d(q3);
        }
        dVar.a(new i() { // from class: androidx.activity.result.ActivityResultRegistry.1
            @Override // androidx.lifecycle.i
            public void g(k kVar2, g.b bVar2) {
                if (!g.b.ON_START.equals(bVar2)) {
                    if (g.b.ON_STOP.equals(bVar2)) {
                        ActivityResultRegistry.this.f82f.remove(str);
                        return;
                    } else {
                        if (g.b.ON_DESTROY.equals(bVar2)) {
                            ActivityResultRegistry.this.l(str);
                            return;
                        }
                        return;
                    }
                }
                ActivityResultRegistry.this.f82f.put(str, new c(bVar, aVar));
                if (ActivityResultRegistry.this.f83g.containsKey(str)) {
                    Object obj = ActivityResultRegistry.this.f83g.get(str);
                    ActivityResultRegistry.this.f83g.remove(str);
                    bVar.a(obj);
                }
                androidx.activity.result.a aVar2 = (androidx.activity.result.a) ActivityResultRegistry.this.f84h.getParcelable(str);
                if (aVar2 != null) {
                    ActivityResultRegistry.this.f84h.remove(str);
                    bVar.a(aVar.c(aVar2.q(), aVar2.o()));
                }
            }
        });
        this.f80d.put(str, dVar);
        return new a(str, aVar);
    }

    public final androidx.activity.result.c j(String str, b.a aVar, androidx.activity.result.b bVar) {
        k(str);
        this.f82f.put(str, new c(bVar, aVar));
        if (this.f83g.containsKey(str)) {
            Object obj = this.f83g.get(str);
            this.f83g.remove(str);
            bVar.a(obj);
        }
        androidx.activity.result.a aVar2 = (androidx.activity.result.a) this.f84h.getParcelable(str);
        if (aVar2 != null) {
            this.f84h.remove(str);
            bVar.a(aVar.c(aVar2.q(), aVar2.o()));
        }
        return new b(str, aVar);
    }

    final void l(String str) {
        Integer num;
        if (!this.f81e.contains(str) && (num = (Integer) this.f79c.remove(str)) != null) {
            this.f78b.remove(num);
        }
        this.f82f.remove(str);
        boolean containsKey = this.f83g.containsKey(str);
        String d4 = c3.d4(44);
        if (containsKey) {
            Log.w("ActivityResultRegistry", "Dropping pending result for request " + str + d4 + this.f83g.get(str));
            this.f83g.remove(str);
        }
        if (this.f84h.containsKey(str)) {
            Log.w("ActivityResultRegistry", "Dropping pending result for request " + str + d4 + this.f84h.getParcelable(str));
            this.f84h.remove(str);
        }
        d dVar = (d) this.f80d.get(str);
        if (dVar != null) {
            dVar.b();
            this.f80d.remove(str);
        }
    }
}
