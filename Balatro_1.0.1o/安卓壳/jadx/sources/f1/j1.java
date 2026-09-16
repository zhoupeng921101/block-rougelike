package f1;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.lang.ref.WeakReference;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j1 extends Fragment implements i {

    /* renamed from: e0, reason: collision with root package name */
    private static final WeakHashMap f3275e0 = new WeakHashMap();

    /* renamed from: d0, reason: collision with root package name */
    private final i1 f3276d0 = new i1();

    public static j1 B1(androidx.fragment.app.j jVar) {
        j1 j1Var;
        androidx.fragment.app.x K = jVar.K();
        WeakHashMap weakHashMap = f3275e0;
        WeakReference weakReference = (WeakReference) weakHashMap.get(jVar);
        if (weakReference != null && (j1Var = (j1) weakReference.get()) != null) {
            return j1Var;
        }
        try {
            j1 j1Var2 = (j1) K.h0("SLifecycleFragmentImpl");
            if (j1Var2 == null || j1Var2.d0()) {
                j1Var2 = new j1();
                K.o().d(j1Var2, "SLifecycleFragmentImpl").g();
            }
            weakHashMap.put(jVar, new WeakReference(j1Var2));
            return j1Var2;
        } catch (ClassCastException e4) {
            throw new IllegalStateException("Fragment with tag SLifecycleFragmentImpl is not a SupportLifecycleFragmentImpl", e4);
        }
    }

    @Override // androidx.fragment.app.Fragment
    public final void H0() {
        super.H0();
        this.f3276d0.e();
    }

    @Override // androidx.fragment.app.Fragment
    public final void I0(Bundle bundle) {
        super.I0(bundle);
        this.f3276d0.g(bundle);
    }

    @Override // androidx.fragment.app.Fragment
    public final void J0() {
        super.J0();
        this.f3276d0.d();
    }

    @Override // androidx.fragment.app.Fragment
    public final void K0() {
        super.K0();
        this.f3276d0.h();
    }

    @Override // f1.i
    public final void a(String str, h hVar) {
        this.f3276d0.b(str, hVar);
    }

    @Override // f1.i
    public final h d(String str, Class cls) {
        return this.f3276d0.a(str, cls);
    }

    @Override // f1.i
    public final Activity e() {
        return l();
    }

    @Override // androidx.fragment.app.Fragment
    public final void h(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        super.h(str, fileDescriptor, printWriter, strArr);
        this.f3276d0.j(str, fileDescriptor, printWriter, strArr);
    }

    @Override // androidx.fragment.app.Fragment
    public final void h0(int i4, int i5, Intent intent) {
        super.h0(i4, i5, intent);
        this.f3276d0.f(i4, i5, intent);
    }

    @Override // androidx.fragment.app.Fragment
    public final void m0(Bundle bundle) {
        super.m0(bundle);
        this.f3276d0.c(bundle);
    }

    @Override // androidx.fragment.app.Fragment
    public final void r0() {
        super.r0();
        this.f3276d0.i();
    }
}
