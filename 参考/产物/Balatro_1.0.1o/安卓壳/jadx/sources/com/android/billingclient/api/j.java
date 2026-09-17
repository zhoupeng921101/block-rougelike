package com.android.billingclient.api;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import com.google.android.gms.internal.play_billing.f6;
import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.u6;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j extends BroadcastReceiver {

    /* renamed from: a, reason: collision with root package name */
    private boolean f2389a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f2390b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ k f2391c;

    j(k kVar, boolean z3) {
        Objects.requireNonNull(kVar);
        this.f2391c = kVar;
        this.f2390b = z3;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void c(Bundle bundle, d dVar, int i4, u6 u6Var, long j4, boolean z3) {
        o0 o0Var;
        o0 o0Var2;
        try {
            if (bundle.getByteArray("FAILURE_LOGGING_PAYLOAD") != null) {
                o0Var2 = this.f2391c.f2398c;
                o0Var2.d(f6.H(bundle.getByteArray("FAILURE_LOGGING_PAYLOAD")), j4, z3);
            } else {
                o0Var = this.f2391c.f2398c;
                o0Var.d(n0.b(n6.B, i4, dVar, null, u6Var), j4, z3);
            }
        } catch (Throwable unused) {
            com.google.android.gms.internal.play_billing.m0.m("BillingBroadcastManager", "Failed parsing Api failure.");
        }
    }

    public final synchronized void a(Context context, IntentFilter intentFilter) {
        try {
            if (this.f2389a) {
                return;
            }
            if (Build.VERSION.SDK_INT >= 33) {
                context.registerReceiver(this, intentFilter, true != this.f2390b ? 4 : 2);
            } else {
                context.registerReceiver(this, intentFilter);
            }
            this.f2389a = true;
        } catch (Throwable th) {
            throw th;
        }
    }

    public final synchronized void b(Context context, IntentFilter intentFilter, String str) {
        j jVar;
        try {
            try {
                if (this.f2389a) {
                    return;
                }
                if (Build.VERSION.SDK_INT >= 33) {
                    jVar = this;
                    context.registerReceiver(jVar, intentFilter, "com.google.android.finsky.permission.PLAY_BILLING_LIBRARY_BROADCAST", null, true != this.f2390b ? 4 : 2);
                } else {
                    jVar = this;
                    context.registerReceiver(this, intentFilter, "com.google.android.finsky.permission.PLAY_BILLING_LIBRARY_BROADCAST", null);
                }
                jVar.f2389a = true;
            } catch (Throwable th) {
                th = th;
                throw th;
            }
        } catch (Throwable th2) {
            th = th2;
            throw th;
        }
    }

    @Override // android.content.BroadcastReceiver
    public final void onReceive(Context context, Intent intent) {
    }
}
