package kotlinx.coroutines.android;

import android.os.Looper;
import i3.u;
import j3.a;
import j3.c;
import java.util.List;
import k3.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class AndroidDispatcherFactory implements e {
    @Override // k3.e
    public u createDispatcher(List<? extends e> list) {
        Looper mainLooper = Looper.getMainLooper();
        if (mainLooper != null) {
            return new a(c.a(mainLooper, true), null, 2, null);
        }
        throw new IllegalStateException("The main looper is not available");
    }

    @Override // k3.e
    public int getLoadPriority() {
        return 1073741823;
    }

    @Override // k3.e
    public String hintOnError() {
        return "For tests Dispatchers.setMain from kotlinx-coroutines-test module can be used";
    }
}
