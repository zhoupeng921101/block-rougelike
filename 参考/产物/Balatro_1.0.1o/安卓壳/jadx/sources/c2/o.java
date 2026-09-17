package c2;

import android.app.Application;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class o {

    /* renamed from: a, reason: collision with root package name */
    private static final AtomicReference f2148a = new AtomicReference();

    public static m a(Application application) {
        AtomicReference atomicReference = f2148a;
        m mVar = (m) atomicReference.get();
        if (mVar != null) {
            return mVar;
        }
        y1 a4 = d2.a();
        a4.a(9);
        a4.b(application.getPackageName());
        d2 c4 = a4.c();
        q1.q a5 = q1.q.a(application);
        f1.d1.a(atomicReference, null, new b0(application, a5, t1.b.a(), new f0(application, a5, new n(application, c4))));
        return (m) h1.q.i((m) atomicReference.get());
    }
}
