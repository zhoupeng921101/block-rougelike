package com.google.android.gms.common.api;

import a1.b2.c3;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import d1.i;
import f1.f;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class GoogleApiActivity extends Activity implements DialogInterface.OnCancelListener {

    /* renamed from: a, reason: collision with root package name */
    protected int f2555a = 0;

    public static Intent a(Context context, PendingIntent pendingIntent, int i4, boolean z3) {
        Intent intent = new Intent(context, (Class<?>) GoogleApiActivity.class);
        intent.putExtra("pending_intent", pendingIntent);
        intent.putExtra("failing_client_id", i4);
        intent.putExtra("notify_manager", z3);
        return intent;
    }

    private final void b() {
        GoogleApiActivity googleApiActivity;
        Bundle extras = getIntent().getExtras();
        if (extras == null) {
            Log.e("GoogleApiActivity", c3.d4(383));
            finish();
            return;
        }
        PendingIntent pendingIntent = (PendingIntent) extras.get("pending_intent");
        Integer num = (Integer) extras.get("error_code");
        if (pendingIntent == null && num == null) {
            Log.e("GoogleApiActivity", "Activity started without resolution");
            finish();
            return;
        }
        if (pendingIntent == null) {
            i.l().m(this, ((Integer) q.i(num)).intValue(), 2, this);
            this.f2555a = 1;
            return;
        }
        try {
            googleApiActivity = this;
        } catch (ActivityNotFoundException e4) {
            e = e4;
            googleApiActivity = this;
        } catch (IntentSender.SendIntentException e5) {
            e = e5;
        }
        try {
            googleApiActivity.startIntentSenderForResult(pendingIntent.getIntentSender(), 1, null, 0, 0, 0);
            googleApiActivity.f2555a = 1;
        } catch (ActivityNotFoundException e6) {
            e = e6;
            if (extras.getBoolean("notify_manager", true)) {
                f.u(this).D(new d1.a(22, null), getIntent().getIntExtra("failing_client_id", -1));
            } else {
                String str = c3.d4(1326) + pendingIntent.toString() + ".";
                if (Build.FINGERPRINT.contains("generic")) {
                    str = str.concat(" This may occur when resolving Google Play services connection issues on emulators with Google APIs but not Google Play Store.");
                }
                Log.e("GoogleApiActivity", str, e);
            }
            googleApiActivity.f2555a = 1;
            finish();
        } catch (IntentSender.SendIntentException e7) {
            e = e7;
            Log.e("GoogleApiActivity", "Failed to launch pendingIntent", e);
            finish();
        }
    }

    @Override // android.app.Activity
    protected final void onActivityResult(int i4, int i5, Intent intent) {
        super.onActivityResult(i4, i5, intent);
        if (i4 == 1) {
            boolean booleanExtra = getIntent().getBooleanExtra("notify_manager", true);
            this.f2555a = 0;
            setResult(i5, intent);
            if (booleanExtra) {
                f u3 = f.u(this);
                if (i5 == -1) {
                    u3.E();
                } else if (i5 == 0) {
                    u3.D(new d1.a(13, null), getIntent().getIntExtra("failing_client_id", -1));
                }
            }
        } else if (i4 == 2) {
            this.f2555a = 0;
            setResult(i5, intent);
        }
        finish();
    }

    @Override // android.content.DialogInterface.OnCancelListener
    public final void onCancel(DialogInterface dialogInterface) {
        this.f2555a = 0;
        setResult(0);
        finish();
    }

    @Override // android.app.Activity
    protected final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        if (bundle != null) {
            this.f2555a = bundle.getInt("resolution");
        }
        if (this.f2555a != 1) {
            b();
        }
    }

    @Override // android.app.Activity
    protected final void onSaveInstanceState(Bundle bundle) {
        bundle.putInt("resolution", this.f2555a);
        super.onSaveInstanceState(bundle);
    }
}
