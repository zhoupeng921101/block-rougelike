package f1;

import a1.b2.c3;
import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.lang.ref.WeakReference;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g1 extends Fragment implements i {

    /* renamed from: b, reason: collision with root package name */
    private static final WeakHashMap f3259b = new WeakHashMap();

    /* renamed from: a, reason: collision with root package name */
    private final i1 f3260a = new i1();

    public static g1 b(Activity activity) {
        g1 g1Var;
        WeakHashMap weakHashMap = f3259b;
        WeakReference weakReference = (WeakReference) weakHashMap.get(activity);
        if (weakReference != null && (g1Var = (g1) weakReference.get()) != null) {
            return g1Var;
        }
        try {
            g1 g1Var2 = (g1) activity.getFragmentManager().findFragmentByTag("LifecycleFragmentImpl");
            if (g1Var2 == null || g1Var2.isRemoving()) {
                g1Var2 = new g1();
                activity.getFragmentManager().beginTransaction().add(g1Var2, "LifecycleFragmentImpl").commitAllowingStateLoss();
            }
            weakHashMap.put(activity, new WeakReference(g1Var2));
            return g1Var2;
        } catch (ClassCastException e4) {
            throw new IllegalStateException(c3.d4(1282), e4);
        }
    }

    @Override // f1.i
    public final void a(String str, h hVar) {
        this.f3260a.b(str, hVar);
    }

    @Override // f1.i
    public final h d(String str, Class cls) {
        return this.f3260a.a(str, cls);
    }

    @Override // android.app.Fragment
    public final void dump(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        super.dump(str, fileDescriptor, printWriter, strArr);
        this.f3260a.j(str, fileDescriptor, printWriter, strArr);
    }

    @Override // f1.i
    public final Activity e() {
        return getActivity();
    }

    @Override // android.app.Fragment
    public final void onActivityResult(int i4, int i5, Intent intent) {
        super.onActivityResult(i4, i5, intent);
        this.f3260a.f(i4, i5, intent);
    }

    @Override // android.app.Fragment
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        this.f3260a.c(bundle);
    }

    @Override // android.app.Fragment
    public final void onDestroy() {
        super.onDestroy();
        this.f3260a.i();
    }

    @Override // android.app.Fragment
    public final void onResume() {
        super.onResume();
        this.f3260a.e();
    }

    @Override // android.app.Fragment
    public final void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        this.f3260a.g(bundle);
    }

    @Override // android.app.Fragment
    public final void onStart() {
        super.onStart();
        this.f3260a.d();
    }

    @Override // android.app.Fragment
    public final void onStop() {
        super.onStop();
        this.f3260a.h();
    }
}
