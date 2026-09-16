package com.android.billingclient.api;

import a1.b2.c3;
import android.content.Context;
import android.content.IntentFilter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class k {

    /* renamed from: a, reason: collision with root package name */
    private final Context f2396a;

    /* renamed from: b, reason: collision with root package name */
    private final e0.i f2397b;

    /* renamed from: c, reason: collision with root package name */
    private final o0 f2398c;

    /* renamed from: d, reason: collision with root package name */
    private final j f2399d = new j(this, true);

    /* renamed from: e, reason: collision with root package name */
    private final j f2400e = new j(this, false);

    /* renamed from: f, reason: collision with root package name */
    private boolean f2401f;

    k(Context context, e0.i iVar, e0.x xVar, e0.q qVar, e0.k kVar, e0.f fVar, o0 o0Var) {
        this.f2396a = context;
        this.f2397b = iVar;
        this.f2398c = o0Var;
    }

    static /* bridge */ /* synthetic */ e0.q a(k kVar) {
        kVar.getClass();
        return null;
    }

    static /* bridge */ /* synthetic */ e0.f c(k kVar) {
        kVar.getClass();
        return null;
    }

    static /* bridge */ /* synthetic */ e0.k f(k kVar) {
        kVar.getClass();
        return null;
    }

    final e0.i e() {
        return this.f2397b;
    }

    final void g(boolean z3) {
        IntentFilter intentFilter = new IntentFilter("com.android.vending.billing.PURCHASES_UPDATED");
        IntentFilter intentFilter2 = new IntentFilter(c3.d4(240));
        intentFilter2.addAction(c3.d4(1322));
        this.f2401f = z3;
        j jVar = this.f2400e;
        Context context = this.f2396a;
        jVar.a(context, intentFilter2);
        if (this.f2401f) {
            this.f2399d.b(context, intentFilter, "com.google.android.finsky.permission.PLAY_BILLING_LIBRARY_BROADCAST");
        } else {
            this.f2399d.a(context, intentFilter);
        }
    }
}
