package com.google.android.gms.games.internal.v2.appshortcuts;

import android.content.Intent;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class n extends s1.s {

    /* renamed from: a, reason: collision with root package name */
    public final g2.i f2692a;

    public n(g2.i iVar) {
        this.f2692a = iVar;
    }

    public void N(Intent intent) {
        n(new Status(10));
    }

    @Override // s1.t
    public final void n(Status status) {
        this.f2692a.d(h1.b.a(status));
    }

    public void s(g gVar) {
        n(new Status(10));
    }
}
