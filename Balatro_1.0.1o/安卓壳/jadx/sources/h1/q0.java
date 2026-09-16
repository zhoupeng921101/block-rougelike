package h1;

import android.app.PendingIntent;
import android.os.Bundle;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class q0 extends x0 {

    /* renamed from: d, reason: collision with root package name */
    public final int f3567d;

    /* renamed from: e, reason: collision with root package name */
    public final Bundle f3568e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ d f3569f;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    protected q0(d dVar, int i4, Bundle bundle) {
        super(dVar, Boolean.TRUE);
        Objects.requireNonNull(dVar);
        this.f3569f = dVar;
        this.f3567d = i4;
        this.f3568e = bundle;
    }

    @Override // h1.x0
    protected final /* bridge */ /* synthetic */ void a(Object obj) {
        int i4 = this.f3567d;
        if (i4 != 0) {
            this.f3569f.U(1, null);
            Bundle bundle = this.f3568e;
            f(new d1.a(i4, bundle != null ? (PendingIntent) bundle.getParcelable("pendingIntent") : null));
        } else {
            if (e()) {
                return;
            }
            this.f3569f.U(1, null);
            f(new d1.a(8, null));
        }
    }

    protected abstract boolean e();

    protected abstract void f(d1.a aVar);
}
