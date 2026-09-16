package g2;

import android.app.Activity;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b0 extends f1.h {

    /* renamed from: b, reason: collision with root package name */
    private final List f3346b;

    private b0(f1.i iVar) {
        super(iVar);
        this.f3346b = new ArrayList();
        this.f3261a.a("TaskOnStopCallback", this);
    }

    public static b0 l(Activity activity) {
        b0 b0Var;
        f1.i c4 = f1.h.c(activity);
        synchronized (c4) {
            try {
                b0Var = (b0) c4.d("TaskOnStopCallback", b0.class);
                if (b0Var == null) {
                    b0Var = new b0(c4);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return b0Var;
    }

    @Override // f1.h
    public final void k() {
        synchronized (this.f3346b) {
            try {
                Iterator it = this.f3346b.iterator();
                while (it.hasNext()) {
                    x xVar = (x) ((WeakReference) it.next()).get();
                    if (xVar != null) {
                        xVar.c();
                    }
                }
                this.f3346b.clear();
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final void m(x xVar) {
        synchronized (this.f3346b) {
            this.f3346b.add(new WeakReference(xVar));
        }
    }
}
