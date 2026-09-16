package k3;

import i3.u;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g {
    private static final h a(Throwable th, String str) {
        if (th != null) {
            throw th;
        }
        d();
        throw new t2.c();
    }

    static /* synthetic */ h b(Throwable th, String str, int i4, Object obj) {
        if ((i4 & 1) != 0) {
            th = null;
        }
        if ((i4 & 2) != 0) {
            str = null;
        }
        return a(th, str);
    }

    public static final boolean c(u uVar) {
        return uVar.d() instanceof h;
    }

    public static final Void d() {
        throw new IllegalStateException("Module with the Main dispatcher is missing. Add dependency providing the Main dispatcher, e.g. 'kotlinx-coroutines-android' and ensure it has the same version as 'kotlinx-coroutines-core'");
    }

    public static final u e(e eVar, List list) {
        try {
            return eVar.createDispatcher(list);
        } catch (Throwable th) {
            return a(th, eVar.hintOnError());
        }
    }
}
