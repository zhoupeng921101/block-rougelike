package d1;

import a1.b2.c3;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.app.FragmentManager;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b extends DialogFragment {

    /* renamed from: a, reason: collision with root package name */
    private Dialog f3085a;

    /* renamed from: b, reason: collision with root package name */
    private DialogInterface.OnCancelListener f3086b;

    /* renamed from: c, reason: collision with root package name */
    private Dialog f3087c;

    public static b a(Dialog dialog, DialogInterface.OnCancelListener onCancelListener) {
        b bVar = new b();
        Dialog dialog2 = (Dialog) h1.q.j(dialog, c3.d4(23));
        dialog2.setOnCancelListener(null);
        dialog2.setOnDismissListener(null);
        bVar.f3085a = dialog2;
        if (onCancelListener != null) {
            bVar.f3086b = onCancelListener;
        }
        return bVar;
    }

    @Override // android.app.DialogFragment, android.content.DialogInterface.OnCancelListener
    public void onCancel(DialogInterface dialogInterface) {
        DialogInterface.OnCancelListener onCancelListener = this.f3086b;
        if (onCancelListener != null) {
            onCancelListener.onCancel(dialogInterface);
        }
    }

    @Override // android.app.DialogFragment
    public Dialog onCreateDialog(Bundle bundle) {
        Dialog dialog = this.f3085a;
        if (dialog != null) {
            return dialog;
        }
        setShowsDialog(false);
        if (this.f3087c == null) {
            this.f3087c = new AlertDialog.Builder((Context) h1.q.i(getActivity())).create();
        }
        return this.f3087c;
    }

    @Override // android.app.DialogFragment
    public void show(FragmentManager fragmentManager, String str) {
        super.show(fragmentManager, str);
    }
}
