package com.android.billingclient.api;

import a1.b2.c3;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Bundle;
import android.os.ResultReceiver;
import androidx.activity.ComponentActivity;
import androidx.activity.result.e;
import com.google.android.gms.internal.play_billing.n6;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ProxyBillingActivityV2 extends ComponentActivity {

    /* renamed from: s, reason: collision with root package name */
    private androidx.activity.result.c f2219s;

    /* renamed from: t, reason: collision with root package name */
    private androidx.activity.result.c f2220t;

    /* renamed from: u, reason: collision with root package name */
    private androidx.activity.result.c f2221u;

    /* renamed from: v, reason: collision with root package name */
    private androidx.activity.result.c f2222v;

    /* renamed from: w, reason: collision with root package name */
    private ResultReceiver f2223w;

    /* renamed from: x, reason: collision with root package name */
    private ResultReceiver f2224x;

    /* renamed from: y, reason: collision with root package name */
    private ResultReceiver f2225y;

    /* renamed from: z, reason: collision with root package name */
    private ResultReceiver f2226z;

    final void F(androidx.activity.result.a aVar) {
        Intent o3 = aVar.o();
        String d4 = c3.d4(563);
        int c4 = com.google.android.gms.internal.play_billing.m0.h(o3, d4).c();
        ResultReceiver resultReceiver = this.f2223w;
        if (resultReceiver != null) {
            resultReceiver.send(c4, o3 == null ? null : o3.getExtras());
        }
        if (aVar.q() != -1 || c4 != 0) {
            com.google.android.gms.internal.play_billing.m0.m(d4, "Alternative billing only dialog finished with resultCode " + aVar.q() + c3.d4(827) + c4);
        }
        finish();
    }

    final void G(androidx.activity.result.a aVar) {
        Intent o3 = aVar.o();
        int c4 = com.google.android.gms.internal.play_billing.m0.h(o3, "ProxyBillingActivityV2").c();
        ResultReceiver resultReceiver = this.f2224x;
        if (resultReceiver != null) {
            resultReceiver.send(c4, o3 == null ? null : o3.getExtras());
        }
        if (aVar.q() != -1 || c4 != 0) {
            com.google.android.gms.internal.play_billing.m0.m("ProxyBillingActivityV2", String.format(c3.d4(192), Integer.valueOf(aVar.q()), Integer.valueOf(c4)));
        }
        finish();
    }

    final void H(androidx.activity.result.a aVar) {
        Intent o3 = aVar.o();
        Bundle extras = o3 == null ? null : o3.getExtras();
        int q3 = aVar.q();
        String d4 = c3.d4(564);
        if (q3 != -1) {
            if (extras == null) {
                extras = new Bundle();
            }
            com.google.android.gms.internal.play_billing.m0.m(d4, String.format("External offer flow finished with resultCode: %s", Integer.valueOf(aVar.q())));
            extras.putInt(c3.d4(193), n6.ERROR_IN_ACTIVITY_RESULT.a());
            extras.putString("INTERNAL_LOG_ERROR_ADDITIONAL_DETAILS", String.format(c3.d4(1446), Integer.valueOf(aVar.q())));
        }
        int c4 = com.google.android.gms.internal.play_billing.m0.h(o3, d4).c();
        ResultReceiver resultReceiver = this.f2225y;
        if (resultReceiver != null) {
            resultReceiver.send(c4, extras);
        } else {
            com.google.android.gms.internal.play_billing.m0.m(d4, "External offer flow result receiver is null");
        }
        if (c4 != 0) {
            com.google.android.gms.internal.play_billing.m0.m(d4, String.format("External offer flow finished with billing responseCode: %s", Integer.valueOf(c4)));
        }
        finish();
    }

    final void I(androidx.activity.result.a aVar) {
        Intent o3 = aVar.o();
        Bundle extras = o3 == null ? null : o3.getExtras();
        if (aVar.q() != -1) {
            if (extras == null) {
                extras = new Bundle();
            }
            com.google.android.gms.internal.play_billing.m0.m("ProxyBillingActivityV2", String.format("Launch external link flow finished with resultCode: %s", Integer.valueOf(aVar.q())));
            extras.putInt("INTERNAL_LOG_ERROR_REASON", n6.ERROR_IN_ACTIVITY_RESULT.a());
            extras.putString("INTERNAL_LOG_ERROR_ADDITIONAL_DETAILS", String.format("Launch external link flow finished with error resultCode: %s", Integer.valueOf(aVar.q())));
        }
        int c4 = com.google.android.gms.internal.play_billing.m0.h(o3, "ProxyBillingActivityV2").c();
        ResultReceiver resultReceiver = this.f2226z;
        if (resultReceiver != null) {
            resultReceiver.send(c4, extras);
        } else {
            com.google.android.gms.internal.play_billing.m0.m("ProxyBillingActivityV2", "Launch external link flow result receiver is null");
        }
        if (c4 != 0) {
            com.google.android.gms.internal.play_billing.m0.m("ProxyBillingActivityV2", String.format("Launch external link flow finished with billing responseCode: %s", Integer.valueOf(c4)));
        }
        finish();
    }

    @Override // androidx.activity.ComponentActivity, androidx.core.app.c, android.app.Activity
    protected final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        this.f2219s = D(new b.d(), new androidx.activity.result.b() { // from class: com.android.billingclient.api.t0
            @Override // androidx.activity.result.b
            public final void a(Object obj) {
                ProxyBillingActivityV2.this.F((androidx.activity.result.a) obj);
            }
        });
        this.f2220t = D(new b.d(), new androidx.activity.result.b() { // from class: com.android.billingclient.api.u0
            @Override // androidx.activity.result.b
            public final void a(Object obj) {
                ProxyBillingActivityV2.this.G((androidx.activity.result.a) obj);
            }
        });
        this.f2221u = D(new b.d(), new androidx.activity.result.b() { // from class: com.android.billingclient.api.v0
            @Override // androidx.activity.result.b
            public final void a(Object obj) {
                ProxyBillingActivityV2.this.H((androidx.activity.result.a) obj);
            }
        });
        this.f2222v = D(new b.d(), new androidx.activity.result.b() { // from class: com.android.billingclient.api.w0
            @Override // androidx.activity.result.b
            public final void a(Object obj) {
                ProxyBillingActivityV2.this.I((androidx.activity.result.a) obj);
            }
        });
        String d4 = c3.d4(116);
        String d42 = c3.d4(518);
        if (bundle != null) {
            if (bundle.containsKey(d42)) {
                this.f2223w = (ResultReceiver) bundle.getParcelable(d42);
            }
            if (bundle.containsKey("external_payment_dialog_result_receiver")) {
                this.f2224x = (ResultReceiver) bundle.getParcelable("external_payment_dialog_result_receiver");
            }
            if (bundle.containsKey(d4)) {
                this.f2225y = (ResultReceiver) bundle.getParcelable(d4);
            }
            if (bundle.containsKey("launch_external_link_result_receiver")) {
                this.f2226z = (ResultReceiver) bundle.getParcelable("launch_external_link_result_receiver");
                return;
            }
            return;
        }
        com.google.android.gms.internal.play_billing.m0.l("ProxyBillingActivityV2", "Launching Play Store billing dialog");
        if (getIntent().hasExtra("ALTERNATIVE_BILLING_ONLY_DIALOG_INTENT")) {
            PendingIntent pendingIntent = (PendingIntent) getIntent().getParcelableExtra("ALTERNATIVE_BILLING_ONLY_DIALOG_INTENT");
            this.f2223w = (ResultReceiver) getIntent().getParcelableExtra(d42);
            this.f2219s.a(new e.b(pendingIntent).a());
            return;
        }
        if (getIntent().hasExtra("external_payment_dialog_pending_intent")) {
            PendingIntent pendingIntent2 = (PendingIntent) getIntent().getParcelableExtra("external_payment_dialog_pending_intent");
            this.f2224x = (ResultReceiver) getIntent().getParcelableExtra("external_payment_dialog_result_receiver");
            this.f2220t.a(new e.b(pendingIntent2).a());
        } else if (getIntent().hasExtra("external_offer_flow_pending_intent")) {
            PendingIntent pendingIntent3 = (PendingIntent) getIntent().getParcelableExtra("external_offer_flow_pending_intent");
            this.f2225y = (ResultReceiver) getIntent().getParcelableExtra(d4);
            this.f2221u.a(new e.b(pendingIntent3).a());
        } else if (getIntent().hasExtra("launch_external_link_flow_pending_intent")) {
            PendingIntent pendingIntent4 = (PendingIntent) getIntent().getParcelableExtra("launch_external_link_flow_pending_intent");
            this.f2226z = (ResultReceiver) getIntent().getParcelableExtra("launch_external_link_result_receiver");
            this.f2222v.a(new e.b(pendingIntent4).a());
        }
    }

    @Override // androidx.activity.ComponentActivity, androidx.core.app.c, android.app.Activity
    protected final void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        ResultReceiver resultReceiver = this.f2223w;
        if (resultReceiver != null) {
            bundle.putParcelable(c3.d4(1318), resultReceiver);
        }
        ResultReceiver resultReceiver2 = this.f2224x;
        if (resultReceiver2 != null) {
            bundle.putParcelable("external_payment_dialog_result_receiver", resultReceiver2);
        }
        ResultReceiver resultReceiver3 = this.f2225y;
        if (resultReceiver3 != null) {
            bundle.putParcelable("external_offer_flow_result_receiver", resultReceiver3);
        }
        ResultReceiver resultReceiver4 = this.f2226z;
        if (resultReceiver4 != null) {
            bundle.putParcelable(c3.d4(828), resultReceiver4);
        }
    }
}
