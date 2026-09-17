package androidx.lifecycle;

import androidx.lifecycle.g;
import java.util.Iterator;
import z.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class LegacySavedStateHandleController {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class a implements c.a {
        a() {
        }

        @Override // z.c.a
        public void a(z.e eVar) {
            if (!(eVar instanceof b0)) {
                throw new IllegalStateException("Internal error: OnRecreation should be registered only on components that implement ViewModelStoreOwner");
            }
            a0 o3 = ((b0) eVar).o();
            z.c c4 = eVar.c();
            Iterator it = o3.c().iterator();
            while (it.hasNext()) {
                LegacySavedStateHandleController.a(o3.b((String) it.next()), c4, eVar.q());
            }
            if (o3.c().isEmpty()) {
                return;
            }
            c4.i(a.class);
        }
    }

    static void a(x xVar, z.c cVar, g gVar) {
        SavedStateHandleController savedStateHandleController = (SavedStateHandleController) xVar.c("androidx.lifecycle.savedstate.vm.tag");
        if (savedStateHandleController == null || savedStateHandleController.i()) {
            return;
        }
        savedStateHandleController.h(cVar, gVar);
        b(cVar, gVar);
    }

    private static void b(final z.c cVar, final g gVar) {
        g.c b4 = gVar.b();
        if (b4 == g.c.INITIALIZED || b4.a(g.c.STARTED)) {
            cVar.i(a.class);
        } else {
            gVar.a(new i() { // from class: androidx.lifecycle.LegacySavedStateHandleController.1
                @Override // androidx.lifecycle.i
                public void g(k kVar, g.b bVar) {
                    if (bVar == g.b.ON_START) {
                        g.this.c(this);
                        cVar.i(a.class);
                    }
                }
            });
        }
    }
}
