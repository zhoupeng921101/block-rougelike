package c2;

import android.app.Application;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h {

    /* renamed from: a, reason: collision with root package name */
    private final m f2112a;

    private h(m mVar) {
        this.f2112a = mVar;
    }

    public static h a(Application application) {
        return new h(o.a(application));
    }

    public final g2.h b(final g gVar) {
        Objects.requireNonNull(gVar);
        return this.f2112a.e(new l() { // from class: c2.f
            @Override // c2.l
            public final /* synthetic */ g2.h a(e1.e eVar) {
                return g.this.a(eVar);
            }
        });
    }
}
