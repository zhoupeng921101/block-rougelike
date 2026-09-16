package androidx.lifecycle;

import android.content.Context;
import java.util.Collections;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class ProcessLifecycleInitializer implements a0.a {
    @Override // a0.a
    public List a() {
        return Collections.EMPTY_LIST;
    }

    @Override // a0.a
    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public k b(Context context) {
        if (!androidx.startup.a.e(context).g(ProcessLifecycleInitializer.class)) {
            throw new IllegalStateException("ProcessLifecycleInitializer cannot be initialized lazily. \nPlease ensure that you have: \n<meta-data\n    android:name='androidx.lifecycle.ProcessLifecycleInitializer' \n    android:value='androidx.startup' /> \nunder InitializationProvider in your AndroidManifest.xml");
        }
        h.a(context);
        r.k(context);
        return r.j();
    }
}
