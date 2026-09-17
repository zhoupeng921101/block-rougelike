package f1;

import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.api.internal.BasePendingResult;
import e1.g;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class s implements g.a {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ BasePendingResult f3301a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ u f3302b;

    s(u uVar, BasePendingResult basePendingResult) {
        this.f3302b = uVar;
        this.f3301a = basePendingResult;
    }

    @Override // e1.g.a
    public final void a(Status status) {
        Map map;
        map = this.f3302b.f3314a;
        map.remove(this.f3301a);
    }
}
