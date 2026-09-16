package com.android.billingclient.api;

import a1.b2.c3;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.os.ResultReceiver;
import com.android.billingclient.api.d;
import com.google.android.gms.internal.play_billing.n6;
import com.google.android.gms.internal.play_billing.u6;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class ProxyBillingActivity extends Activity {

    /* renamed from: g, reason: collision with root package name */
    private static final y0 f2212g;

    /* renamed from: a, reason: collision with root package name */
    private ResultReceiver f2213a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f2214b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f2215c;

    /* renamed from: d, reason: collision with root package name */
    private int f2216d;

    /* renamed from: e, reason: collision with root package name */
    private long f2217e;

    /* renamed from: f, reason: collision with root package name */
    private boolean f2218f;

    static {
        y0 y0Var;
        y0Var = x0.f2474a;
        f2212g = y0Var;
    }

    private n6 a(int i4, Intent intent) {
        return intent == null ? i4 != -1 ? i4 != 0 ? i4 != 3 ? i4 != 4 ? n6.NULL_DATA_WITH_OTHER_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT : n6.f2929q1 : n6.f2926p1 : n6.NULL_DATA_WITH_CANCELLED_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT : n6.NULL_DATA_WITH_OK_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT : intent.getExtras() == null ? n6.A : i4 == 5 ? n6.PLAY_STORE_ON_CREATE_RUNTIME_EXCEPTION : n6.REASON_UNSPECIFIED;
    }

    private boolean b(int i4, Intent intent) {
        return !a(i4, intent).equals(n6.REASON_UNSPECIFIED);
    }

    private Intent c(String str) {
        Intent intent = new Intent("com.android.vending.billing.ALTERNATIVE_BILLING");
        intent.setPackage(getApplicationContext().getPackageName());
        intent.putExtra("ALTERNATIVE_BILLING_USER_CHOICE_DATA", str);
        return intent;
    }

    private Intent d(n6 n6Var, long j4, boolean z3) {
        Intent e4 = e();
        e4.putExtra("RESPONSE_CODE", 6);
        e4.putExtra(c3.d4(1114), "An internal error occurred.");
        d.a d4 = d.d();
        d4.d(6);
        d4.b("An internal error occurred.");
        d a4 = d4.a();
        int i4 = n0.f2415a;
        e4.putExtra("FAILURE_LOGGING_PAYLOAD", n0.b(n6Var, 2, a4, null, u6.BROADCAST_ACTION_UNSPECIFIED).b());
        e4.putExtra("INTENT_SOURCE", "LAUNCH_BILLING_FLOW");
        e4.putExtra("billingClientTransactionId", j4);
        e4.putExtra(c3.d4(113), this.f2218f);
        return e4;
    }

    private Intent e() {
        Intent intent = new Intent("com.android.vending.billing.LOCAL_BROADCAST_PURCHASES_UPDATED");
        intent.setPackage(getApplicationContext().getPackageName());
        return intent;
    }

    /* JADX WARN: Code restructure failed: missing block: B:34:0x0018, code lost:
    
        r0 = true;
     */
    /* JADX WARN: Code restructure failed: missing block: B:44:0x0053, code lost:
    
        if (r11 == null) goto L6;
     */
    /* JADX WARN: Code restructure failed: missing block: B:4:0x0014, code lost:
    
        if (r11 == null) goto L6;
     */
    /* JADX WARN: Code restructure failed: missing block: B:5:0x0016, code lost:
    
        r0 = false;
     */
    /* JADX WARN: Removed duplicated region for block: B:11:0x0083  */
    /* JADX WARN: Removed duplicated region for block: B:14:0x00ae  */
    /* JADX WARN: Removed duplicated region for block: B:19:0x00f9  */
    /* JADX WARN: Removed duplicated region for block: B:25:0x00be  */
    /* JADX WARN: Removed duplicated region for block: B:30:0x009d  */
    @Override // android.app.Activity
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    protected void onActivityResult(int r9, int r10, android.content.Intent r11) {
        /*
            Method dump skipped, instructions count: 263
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.android.billingclient.api.ProxyBillingActivity.onActivityResult(int, int, android.content.Intent):void");
    }

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) {
        PendingIntent pendingIntent;
        super.onCreate(bundle);
        String d4 = c3.d4(1274);
        if (bundle != null) {
            com.google.android.gms.internal.play_billing.m0.l("ProxyBillingActivity", "Launching Play Store billing flow from savedInstanceState");
            this.f2214b = bundle.getBoolean("send_cancelled_broadcast_if_finished", false);
            if (bundle.containsKey(d4)) {
                this.f2213a = (ResultReceiver) bundle.getParcelable(d4);
            }
            this.f2215c = bundle.getBoolean("IS_FLOW_FROM_FIRST_PARTY_CLIENT", false);
            this.f2216d = bundle.getInt("activity_code", 100);
            if (bundle.containsKey("billingClientTransactionId")) {
                this.f2217e = bundle.getLong("billingClientTransactionId");
            }
            if (bundle.containsKey("wasServiceAutoReconnected")) {
                this.f2218f = bundle.getBoolean("wasServiceAutoReconnected");
                return;
            }
            return;
        }
        com.google.android.gms.internal.play_billing.m0.l("ProxyBillingActivity", "Launching Play Store billing flow");
        this.f2216d = 100;
        if (getIntent().hasExtra("BUY_INTENT")) {
            pendingIntent = (PendingIntent) getIntent().getParcelableExtra("BUY_INTENT");
            if (getIntent().hasExtra("IS_FLOW_FROM_FIRST_PARTY_CLIENT") && getIntent().getBooleanExtra("IS_FLOW_FROM_FIRST_PARTY_CLIENT", false)) {
                this.f2215c = true;
                this.f2216d = 110;
            }
        } else if (getIntent().hasExtra("IN_APP_MESSAGE_INTENT")) {
            pendingIntent = (PendingIntent) getIntent().getParcelableExtra("IN_APP_MESSAGE_INTENT");
            this.f2213a = (ResultReceiver) getIntent().getParcelableExtra(d4);
            this.f2216d = 101;
        } else {
            pendingIntent = null;
        }
        if (getIntent().hasExtra("billingClientTransactionId")) {
            this.f2217e = getIntent().getLongExtra("billingClientTransactionId", 0L);
        }
        if (getIntent().hasExtra("wasServiceAutoReconnected")) {
            this.f2218f = getIntent().getBooleanExtra("wasServiceAutoReconnected", false);
        }
        try {
            this.f2214b = true;
            startIntentSenderForResult(pendingIntent.getIntentSender(), this.f2216d, new Intent(), 0, 0, 0);
        } catch (IntentSender.SendIntentException e4) {
            com.google.android.gms.internal.play_billing.m0.n("ProxyBillingActivity", "Got exception while trying to start a purchase flow.", e4);
            ResultReceiver resultReceiver = this.f2213a;
            if (resultReceiver != null) {
                resultReceiver.send(0, null);
            } else {
                Intent d5 = d(n6.INTENT_SENDER_EXCEPTION, this.f2217e, false);
                if (this.f2215c) {
                    d5.putExtra("IS_FIRST_PARTY_PURCHASE", true);
                }
                sendBroadcast(d5);
            }
            this.f2214b = false;
            finish();
        }
    }

    @Override // android.app.Activity
    protected void onDestroy() {
        super.onDestroy();
        if (isFinishing() && this.f2214b) {
            Intent e4 = e();
            e4.putExtra("RESPONSE_CODE", 1);
            e4.putExtra(c3.d4(11), "Billing dialog closed.");
            if (this.f2215c) {
                e4.putExtra("IS_FIRST_PARTY_PURCHASE", true);
            }
            int i4 = this.f2216d;
            if (i4 == 110 || i4 == 100) {
                e4.putExtra("INTENT_SOURCE", "LAUNCH_BILLING_FLOW");
                e4.putExtra("billingClientTransactionId", this.f2217e);
            }
            sendBroadcast(e4);
        }
    }

    @Override // android.app.Activity
    protected void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        ResultReceiver resultReceiver = this.f2213a;
        if (resultReceiver != null) {
            bundle.putParcelable("in_app_message_result_receiver", resultReceiver);
        }
        bundle.putBoolean("send_cancelled_broadcast_if_finished", this.f2214b);
        bundle.putBoolean("IS_FLOW_FROM_FIRST_PARTY_CLIENT", this.f2215c);
        bundle.putInt("activity_code", this.f2216d);
        bundle.putLong("billingClientTransactionId", this.f2217e);
        bundle.putBoolean("wasServiceAutoReconnected", this.f2218f);
    }
}
