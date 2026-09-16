package e1;

import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.api.internal.BasePendingResult;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class o extends BasePendingResult {

    /* renamed from: n, reason: collision with root package name */
    private final k f3161n;

    public o(f fVar, k kVar) {
        super(fVar);
        this.f3161n = kVar;
    }

    @Override // com.google.android.gms.common.api.internal.BasePendingResult
    protected final k e(Status status) {
        return this.f3161n;
    }
}
