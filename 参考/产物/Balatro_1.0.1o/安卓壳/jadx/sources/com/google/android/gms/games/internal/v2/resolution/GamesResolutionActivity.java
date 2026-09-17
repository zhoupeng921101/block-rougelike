package com.google.android.gms.games.internal.v2.resolution;

import a1.b2.c3;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.os.ResultReceiver;
import c2.e1;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class GamesResolutionActivity extends Activity {

    /* renamed from: a, reason: collision with root package name */
    private ResultReceiver f2705a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f2706b;

    private final void a(int i4, Intent intent) {
        Bundle bundle;
        if (this.f2706b) {
            return;
        }
        this.f2706b = true;
        ResultReceiver resultReceiver = this.f2705a;
        if (resultReceiver != null) {
            if (intent == null) {
                bundle = new Bundle();
            } else {
                Bundle bundle2 = new Bundle();
                bundle2.putParcelable("resultData", intent);
                bundle = bundle2;
            }
            resultReceiver.send(i4, bundle);
        }
    }

    @Override // android.app.Activity
    protected final void onActivityResult(int i4, int i5, Intent intent) {
        super.onActivityResult(i4, i5, intent);
        if (i4 == 0) {
            a(i5, intent);
            finish();
            return;
        }
        StringBuilder sb = new StringBuilder(String.valueOf(i4).length() + 25);
        sb.append("Unexpected request code: ");
        sb.append(i4);
        e1.g("ResultActivity", sb.toString());
        a(0, intent);
        finish();
    }

    @Override // android.app.Activity
    protected final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        String d4 = c3.d4(731);
        if (bundle != null) {
            this.f2705a = (ResultReceiver) q.i((ResultReceiver) bundle.getParcelable(d4));
            return;
        }
        this.f2705a = (ResultReceiver) q.i((ResultReceiver) getIntent().getParcelableExtra(d4));
        try {
        } catch (IntentSender.SendIntentException e4) {
            e = e4;
        }
        try {
            startIntentSenderForResult(((PendingIntent) q.i((PendingIntent) getIntent().getParcelableExtra("pendingIntent"))).getIntentSender(), 0, null, 0, 0, 0);
        } catch (IntentSender.SendIntentException e5) {
            e = e5;
            e1.h("ResultActivity", c3.d4(432), e);
            a(0, null);
            finish();
        }
    }

    @Override // android.app.Activity
    protected final void onDestroy() {
        if (!isChangingConfigurations()) {
            a(0, null);
        }
        super.onDestroy();
    }

    @Override // android.app.Activity
    protected final void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        bundle.putParcelable("resultReceiver", this.f2705a);
    }
}
