package com.google.android.gms.auth.api.signin.internal;

import a1.b2.c3;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import androidx.fragment.app.j;
import b1.p;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.SignInAccount;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SignInHubActivity extends j {
    private static boolean C;
    private int A;
    private Intent B;

    /* renamed from: x, reason: collision with root package name */
    private boolean f2550x = false;

    /* renamed from: y, reason: collision with root package name */
    private SignInConfiguration f2551y;

    /* renamed from: z, reason: collision with root package name */
    private boolean f2552z;

    private final void T() {
        L().c(0, null, new a(this, null));
        C = false;
    }

    private final void U(int i4) {
        Status status = new Status(i4);
        Intent intent = new Intent();
        intent.putExtra(c3.d4(382), status);
        setResult(0, intent);
        finish();
        C = false;
    }

    private final void V(String str) {
        Intent intent = new Intent(str);
        if (str.equals("com.google.android.gms.auth.GOOGLE_SIGN_IN")) {
            intent.setPackage("com.google.android.gms");
        } else {
            intent.setPackage(getPackageName());
        }
        intent.putExtra("config", this.f2551y);
        try {
            startActivityForResult(intent, 40962);
        } catch (ActivityNotFoundException unused) {
            this.f2550x = true;
            Log.w("AuthSignInClient", c3.d4(623));
            U(17);
        }
    }

    @Override // android.app.Activity, android.view.Window.Callback
    public final boolean dispatchPopulateAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        return true;
    }

    @Override // androidx.activity.ComponentActivity, android.app.Activity
    protected final void onActivityResult(int i4, int i5, Intent intent) {
        if (this.f2550x) {
            return;
        }
        setResult(0);
        if (i4 != 40962) {
            return;
        }
        if (intent != null) {
            String d4 = c3.d4(151);
            SignInAccount signInAccount = (SignInAccount) intent.getParcelableExtra(d4);
            if (signInAccount != null && signInAccount.h0() != null) {
                GoogleSignInAccount h02 = signInAccount.h0();
                p a4 = p.a(this);
                GoogleSignInOptions h03 = this.f2551y.h0();
                h02.getClass();
                a4.c(h03, h02);
                intent.removeExtra(d4);
                intent.putExtra("googleSignInAccount", h02);
                this.f2552z = true;
                this.A = i5;
                this.B = intent;
                T();
                return;
            }
            if (intent.hasExtra("errorCode")) {
                int intExtra = intent.getIntExtra("errorCode", 8);
                if (intExtra == 13) {
                    intExtra = 12501;
                }
                U(intExtra);
                return;
            }
        }
        U(8);
    }

    @Override // androidx.fragment.app.j, androidx.activity.ComponentActivity, androidx.core.app.c, android.app.Activity
    protected final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        Intent intent = getIntent();
        String action = intent.getAction();
        action.getClass();
        if (c3.d4(1029).equals(action)) {
            U(12500);
            return;
        }
        if (!action.equals("com.google.android.gms.auth.GOOGLE_SIGN_IN") && !action.equals("com.google.android.gms.auth.APPAUTH_SIGN_IN")) {
            Log.e("AuthSignInClient", "Unknown action: ".concat(String.valueOf(intent.getAction())));
            finish();
            return;
        }
        Bundle bundleExtra = intent.getBundleExtra("config");
        bundleExtra.getClass();
        SignInConfiguration signInConfiguration = (SignInConfiguration) bundleExtra.getParcelable("config");
        if (signInConfiguration == null) {
            Log.e("AuthSignInClient", "Activity started with invalid configuration.");
            setResult(0);
            finish();
            return;
        }
        this.f2551y = signInConfiguration;
        if (bundle == null) {
            if (C) {
                setResult(0);
                U(12502);
                return;
            } else {
                C = true;
                V(action);
                return;
            }
        }
        boolean z3 = bundle.getBoolean(c3.d4(981));
        this.f2552z = z3;
        if (z3) {
            this.A = bundle.getInt("signInResultCode");
            Intent intent2 = (Intent) bundle.getParcelable("signInResultData");
            intent2.getClass();
            this.B = intent2;
            T();
        }
    }

    @Override // androidx.fragment.app.j, android.app.Activity
    public final void onDestroy() {
        super.onDestroy();
        C = false;
    }

    @Override // androidx.activity.ComponentActivity, androidx.core.app.c, android.app.Activity
    protected final void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        bundle.putBoolean(c3.d4(624), this.f2552z);
        if (this.f2552z) {
            bundle.putInt("signInResultCode", this.A);
            bundle.putParcelable("signInResultData", this.B);
        }
    }
}
