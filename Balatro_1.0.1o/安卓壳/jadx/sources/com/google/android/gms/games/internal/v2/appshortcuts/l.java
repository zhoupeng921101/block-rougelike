package com.google.android.gms.games.internal.v2.appshortcuts;

import com.google.android.gms.common.api.Status;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l extends n {
    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public l(q qVar, g2.i iVar) {
        super(iVar);
        Objects.requireNonNull(qVar);
    }

    @Override // com.google.android.gms.games.internal.v2.appshortcuts.n, s1.t
    public final void s(g gVar) {
        if (gVar == null) {
            n(new Status(17));
        } else {
            this.f2692a.e(gVar);
        }
    }
}
