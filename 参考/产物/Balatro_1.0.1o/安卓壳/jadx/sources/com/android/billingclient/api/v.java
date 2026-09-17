package com.android.billingclient.api;

import android.text.TextUtils;
import com.google.android.gms.internal.play_billing.n6;
import java.util.Objects;
import java.util.concurrent.Callable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class v implements Callable {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ e0.h f2465a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ String f2466b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ boolean f2467c;

    /* renamed from: d, reason: collision with root package name */
    final /* synthetic */ b f2468d;

    v(b bVar, e0.h hVar, String str, boolean z3) {
        this.f2465a = hVar;
        this.f2466b = str;
        this.f2467c = z3;
        Objects.requireNonNull(bVar);
        this.f2468d = bVar;
    }

    @Override // java.util.concurrent.Callable
    public final /* bridge */ /* synthetic */ Object call() {
        boolean Z;
        e0.z e02;
        b bVar = this.f2468d;
        Z = bVar.Z(30000L);
        if (!Z) {
            n6 n6Var = n6.SERVICE_CONNECTION_NOT_READY;
            d dVar = p0.f2431j;
            bVar.f0(n6Var, 9, dVar);
            this.f2465a.a(dVar, com.google.android.gms.internal.play_billing.i0.m());
            return null;
        }
        String str = this.f2466b;
        if (TextUtils.isEmpty(str)) {
            com.google.android.gms.internal.play_billing.m0.m("BillingClient", "Please provide a valid product type.");
            n6 n6Var2 = n6.EMPTY_PRODUCT_TYPE;
            d dVar2 = p0.f2426e;
            bVar.f0(n6Var2, 9, dVar2);
            this.f2465a.a(dVar2, com.google.android.gms.internal.play_billing.i0.m());
            return null;
        }
        e02 = bVar.e0(str, this.f2467c, 9);
        if (e02.b() != null) {
            this.f2465a.a(e02.a(), e02.b());
            return null;
        }
        this.f2465a.a(e02.a(), com.google.android.gms.internal.play_billing.i0.m());
        return null;
    }
}
