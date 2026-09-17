package c2;

import android.app.Application;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j {

    /* renamed from: c, reason: collision with root package name */
    private static final AtomicReference f2129c = new AtomicReference();

    /* renamed from: a, reason: collision with root package name */
    private final i f2130a;

    /* renamed from: b, reason: collision with root package name */
    private final m f2131b;

    j(Application application, m mVar) {
        this.f2130a = new i(this, application, null);
        this.f2131b = mVar;
    }

    static j a(Application application) {
        AtomicReference atomicReference = f2129c;
        j jVar = (j) atomicReference.get();
        if (jVar != null) {
            return jVar;
        }
        f1.d1.a(atomicReference, null, new j(application, o.a(application)));
        return (j) h1.q.i((j) atomicReference.get());
    }

    public final void b() {
        e1.a("AutomaticGamesAuthenticator", "startWatching()");
        this.f2130a.a();
    }

    final /* synthetic */ m c() {
        return this.f2131b;
    }
}
