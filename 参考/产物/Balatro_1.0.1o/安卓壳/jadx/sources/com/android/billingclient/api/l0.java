package com.android.billingclient.api;

import a1.b2.c3;
import android.content.ComponentName;
import android.content.ServiceConnection;
import android.os.IBinder;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class l0 implements ServiceConnection {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ m0 f2405a;

    /* synthetic */ l0(m0 m0Var, e0.t tVar) {
        Objects.requireNonNull(m0Var);
        this.f2405a = m0Var;
    }

    @Override // android.content.ServiceConnection
    public final void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        com.google.android.gms.internal.play_billing.m0.l("BillingClientTesting", c3.d4(831));
        m0 m0Var = this.f2405a;
        m0Var.N = com.google.android.gms.internal.play_billing.i.m0(iBinder);
        m0Var.M = 2;
        m0Var.R0(26);
    }

    @Override // android.content.ServiceConnection
    public final void onServiceDisconnected(ComponentName componentName) {
        com.google.android.gms.internal.play_billing.m0.m("BillingClientTesting", "Billing Override Service disconnected.");
        m0 m0Var = this.f2405a;
        m0Var.N = null;
        m0Var.M = 0;
    }
}
