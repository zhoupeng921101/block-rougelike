package d1;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class r extends androidx.fragment.app.e {

    /* renamed from: t0, reason: collision with root package name */
    private Dialog f3122t0;

    /* renamed from: u0, reason: collision with root package name */
    private DialogInterface.OnCancelListener f3123u0;

    /* renamed from: v0, reason: collision with root package name */
    private Dialog f3124v0;

    public static r N1(Dialog dialog, DialogInterface.OnCancelListener onCancelListener) {
        r rVar = new r();
        Dialog dialog2 = (Dialog) h1.q.j(dialog, "Cannot display null dialog");
        dialog2.setOnCancelListener(null);
        dialog2.setOnDismissListener(null);
        rVar.f3122t0 = dialog2;
        if (onCancelListener != null) {
            rVar.f3123u0 = onCancelListener;
        }
        return rVar;
    }

    @Override // androidx.fragment.app.e
    public Dialog G1(Bundle bundle) {
        Dialog dialog = this.f3122t0;
        if (dialog != null) {
            return dialog;
        }
        K1(false);
        if (this.f3124v0 == null) {
            this.f3124v0 = new AlertDialog.Builder((Context) h1.q.i(t())).create();
        }
        return this.f3124v0;
    }

    @Override // androidx.fragment.app.e
    public void M1(androidx.fragment.app.x xVar, String str) {
        super.M1(xVar, str);
    }

    @Override // androidx.fragment.app.e, android.content.DialogInterface.OnCancelListener
    public void onCancel(DialogInterface dialogInterface) {
        DialogInterface.OnCancelListener onCancelListener = this.f3123u0;
        if (onCancelListener != null) {
            onCancelListener.onCancel(dialogInterface);
        }
    }
}
