package androidx.fragment.app;

import a1.b2.c3;
import android.util.Log;
import androidx.lifecycle.y;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a0 extends androidx.lifecycle.x {

    /* renamed from: k, reason: collision with root package name */
    private static final y.b f1327k = new a();

    /* renamed from: g, reason: collision with root package name */
    private final boolean f1331g;

    /* renamed from: d, reason: collision with root package name */
    private final HashMap f1328d = new HashMap();

    /* renamed from: e, reason: collision with root package name */
    private final HashMap f1329e = new HashMap();

    /* renamed from: f, reason: collision with root package name */
    private final HashMap f1330f = new HashMap();

    /* renamed from: h, reason: collision with root package name */
    private boolean f1332h = false;

    /* renamed from: i, reason: collision with root package name */
    private boolean f1333i = false;

    /* renamed from: j, reason: collision with root package name */
    private boolean f1334j = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements y.b {
        a() {
        }

        @Override // androidx.lifecycle.y.b
        public androidx.lifecycle.x a(Class cls) {
            return new a0(true);
        }
    }

    a0(boolean z3) {
        this.f1331g = z3;
    }

    private void h(String str) {
        a0 a0Var = (a0) this.f1329e.get(str);
        if (a0Var != null) {
            a0Var.d();
            this.f1329e.remove(str);
        }
        androidx.lifecycle.a0 a0Var2 = (androidx.lifecycle.a0) this.f1330f.get(str);
        if (a0Var2 != null) {
            a0Var2.a();
            this.f1330f.remove(str);
        }
    }

    static a0 k(androidx.lifecycle.a0 a0Var) {
        return (a0) new androidx.lifecycle.y(a0Var, f1327k).a(a0.class);
    }

    @Override // androidx.lifecycle.x
    protected void d() {
        if (x.G0(3)) {
            Log.d(c3.d4(109), c3.d4(1023) + this);
        }
        this.f1332h = true;
    }

    void e(Fragment fragment) {
        if (this.f1334j) {
            if (x.G0(2)) {
                Log.v("FragmentManager", "Ignoring addRetainedFragment as the state is already saved");
            }
        } else {
            if (this.f1328d.containsKey(fragment.f1272f)) {
                return;
            }
            this.f1328d.put(fragment.f1272f, fragment);
            if (x.G0(2)) {
                Log.v("FragmentManager", "Updating retained Fragments: Added " + fragment);
            }
        }
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj != null && a0.class == obj.getClass()) {
            a0 a0Var = (a0) obj;
            if (this.f1328d.equals(a0Var.f1328d) && this.f1329e.equals(a0Var.f1329e) && this.f1330f.equals(a0Var.f1330f)) {
                return true;
            }
        }
        return false;
    }

    void f(Fragment fragment) {
        if (x.G0(3)) {
            Log.d("FragmentManager", "Clearing non-config state for " + fragment);
        }
        h(fragment.f1272f);
    }

    void g(String str) {
        if (x.G0(3)) {
            Log.d("FragmentManager", "Clearing non-config state for saved state of Fragment " + str);
        }
        h(str);
    }

    public int hashCode() {
        return (((this.f1328d.hashCode() * 31) + this.f1329e.hashCode()) * 31) + this.f1330f.hashCode();
    }

    Fragment i(String str) {
        return (Fragment) this.f1328d.get(str);
    }

    a0 j(Fragment fragment) {
        a0 a0Var = (a0) this.f1329e.get(fragment.f1272f);
        if (a0Var != null) {
            return a0Var;
        }
        a0 a0Var2 = new a0(this.f1331g);
        this.f1329e.put(fragment.f1272f, a0Var2);
        return a0Var2;
    }

    Collection l() {
        return new ArrayList(this.f1328d.values());
    }

    androidx.lifecycle.a0 m(Fragment fragment) {
        androidx.lifecycle.a0 a0Var = (androidx.lifecycle.a0) this.f1330f.get(fragment.f1272f);
        if (a0Var != null) {
            return a0Var;
        }
        androidx.lifecycle.a0 a0Var2 = new androidx.lifecycle.a0();
        this.f1330f.put(fragment.f1272f, a0Var2);
        return a0Var2;
    }

    boolean n() {
        return this.f1332h;
    }

    void o(Fragment fragment) {
        if (this.f1334j) {
            if (x.G0(2)) {
                Log.v("FragmentManager", "Ignoring removeRetainedFragment as the state is already saved");
            }
        } else {
            if (this.f1328d.remove(fragment.f1272f) == null || !x.G0(2)) {
                return;
            }
            Log.v("FragmentManager", c3.d4(1154) + fragment);
        }
    }

    void p(boolean z3) {
        this.f1334j = z3;
    }

    boolean q(Fragment fragment) {
        if (this.f1328d.containsKey(fragment.f1272f)) {
            return this.f1331g ? this.f1332h : !this.f1333i;
        }
        return true;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder("FragmentManagerViewModel{");
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        sb.append(c3.d4(1062));
        Iterator it = this.f1328d.values().iterator();
        while (it.hasNext()) {
            sb.append(it.next());
            if (it.hasNext()) {
                sb.append(", ");
            }
        }
        sb.append(") Child Non Config (");
        Iterator it2 = this.f1329e.keySet().iterator();
        while (it2.hasNext()) {
            sb.append((String) it2.next());
            if (it2.hasNext()) {
                sb.append(", ");
            }
        }
        sb.append(c3.d4(1105));
        Iterator it3 = this.f1330f.keySet().iterator();
        while (it3.hasNext()) {
            sb.append((String) it3.next());
            if (it3.hasNext()) {
                sb.append(", ");
            }
        }
        sb.append(')');
        return sb.toString();
    }
}
