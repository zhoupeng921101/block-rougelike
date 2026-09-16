package k3;

import com.google.android.gms.internal.play_billing.l1;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c {

    /* renamed from: a, reason: collision with root package name */
    private static final /* synthetic */ AtomicReferenceFieldUpdater f3993a = AtomicReferenceFieldUpdater.newUpdater(c.class, Object.class, "_cur");
    private volatile /* synthetic */ Object _cur;

    public c(boolean z3) {
        this._cur = new d(8, z3);
    }

    public final boolean a(Object obj) {
        while (true) {
            d dVar = (d) this._cur;
            int a4 = dVar.a(obj);
            if (a4 == 0) {
                return true;
            }
            if (a4 == 1) {
                l1.a(f3993a, this, dVar, dVar.i());
            } else if (a4 == 2) {
                return false;
            }
        }
    }

    public final void b() {
        while (true) {
            d dVar = (d) this._cur;
            if (dVar.d()) {
                return;
            } else {
                l1.a(f3993a, this, dVar, dVar.i());
            }
        }
    }

    public final int c() {
        return ((d) this._cur).f();
    }

    public final Object d() {
        while (true) {
            d dVar = (d) this._cur;
            Object j4 = dVar.j();
            if (j4 != d.f3997h) {
                return j4;
            }
            l1.a(f3993a, this, dVar, dVar.i());
        }
    }
}
