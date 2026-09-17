package d1;

import a1.b2.c3;
import android.R;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.util.Log;
import android.util.TypedValue;
import android.widget.ProgressBar;
import androidx.core.app.f;
import com.google.android.gms.common.api.GoogleApiActivity;
import f1.j0;
import f1.k0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class i extends j {

    /* renamed from: c, reason: collision with root package name */
    private String f3110c;

    /* renamed from: e, reason: collision with root package name */
    private static final Object f3108e = new Object();

    /* renamed from: f, reason: collision with root package name */
    private static final i f3109f = new i();

    /* renamed from: d, reason: collision with root package name */
    public static final int f3107d = j.f3111a;

    public static i l() {
        return f3109f;
    }

    @Override // d1.j
    public Intent a(Context context, int i4, String str) {
        return super.a(context, i4, str);
    }

    @Override // d1.j
    public PendingIntent b(Context context, int i4, int i5) {
        return super.b(context, i4, i5);
    }

    @Override // d1.j
    public final String d(int i4) {
        return super.d(i4);
    }

    @Override // d1.j
    public int f(Context context) {
        return super.f(context);
    }

    @Override // d1.j
    public int g(Context context, int i4) {
        return super.g(context, i4);
    }

    @Override // d1.j
    public final boolean i(int i4) {
        return super.i(i4);
    }

    public Dialog j(Activity activity, int i4, int i5, DialogInterface.OnCancelListener onCancelListener) {
        return o(activity, i4, h1.d0.b(activity, a(activity, i4, "d"), i5), onCancelListener, null);
    }

    public PendingIntent k(Context context, a aVar) {
        return aVar.l0() ? aVar.k0() : b(context, aVar.i0(), 0);
    }

    public boolean m(Activity activity, int i4, int i5, DialogInterface.OnCancelListener onCancelListener) {
        Dialog j4 = j(activity, i4, i5, onCancelListener);
        if (j4 == null) {
            return false;
        }
        r(activity, j4, "GooglePlayServicesErrorDialog", onCancelListener);
        return true;
    }

    public void n(Context context, int i4) {
        s(context, i4, null, c(context, i4, 0, "n"));
    }

    /* JADX WARN: Multi-variable type inference failed */
    final Dialog o(Context context, int i4, h1.d0 d0Var, DialogInterface.OnCancelListener onCancelListener, DialogInterface.OnClickListener onClickListener) {
        if (i4 == 0) {
            return null;
        }
        TypedValue typedValue = new TypedValue();
        context.getTheme().resolveAttribute(R.attr.alertDialogTheme, typedValue, true);
        AlertDialog.Builder builder = "Theme.Dialog.Alert".equals(context.getResources().getResourceEntryName(typedValue.resourceId)) ? new AlertDialog.Builder(context, 5) : null;
        if (builder == null) {
            builder = new AlertDialog.Builder(context);
        }
        builder.setMessage(h1.a0.c(context, i4));
        if (onCancelListener != null) {
            builder.setOnCancelListener(onCancelListener);
        }
        String b4 = h1.a0.b(context, i4);
        if (b4 != null) {
            if (d0Var == null) {
                d0Var = onClickListener;
            }
            builder.setPositiveButton(b4, d0Var);
        }
        String f4 = h1.a0.f(context, i4);
        if (f4 != null) {
            builder.setTitle(f4);
        }
        Log.w("GoogleApiAvailability", String.format("Creating dialog for Google Play services availability issue. ConnectionResult=%s", Integer.valueOf(i4)), new IllegalArgumentException());
        return builder.create();
    }

    public final Dialog p(Activity activity, DialogInterface.OnCancelListener onCancelListener) {
        ProgressBar progressBar = new ProgressBar(activity, null, R.attr.progressBarStyleLarge);
        progressBar.setIndeterminate(true);
        progressBar.setVisibility(0);
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setView(progressBar);
        builder.setMessage(h1.a0.c(activity, 18));
        builder.setPositiveButton("", (DialogInterface.OnClickListener) null);
        AlertDialog create = builder.create();
        r(activity, create, "GooglePlayServicesUpdatingDialog", onCancelListener);
        return create;
    }

    public final k0 q(Context context, j0 j0Var) {
        IntentFilter intentFilter = new IntentFilter("android.intent.action.PACKAGE_ADDED");
        intentFilter.addDataScheme("package");
        k0 k0Var = new k0(j0Var);
        a2.f.e(context, k0Var, intentFilter);
        k0Var.a(context);
        if (h(context, "com.google.android.gms")) {
            return k0Var;
        }
        j0Var.a();
        k0Var.b();
        return null;
    }

    final void r(Activity activity, Dialog dialog, String str, DialogInterface.OnCancelListener onCancelListener) {
        try {
            if (activity instanceof androidx.fragment.app.j) {
                r.N1(dialog, onCancelListener).M1(((androidx.fragment.app.j) activity).K(), str);
                return;
            }
        } catch (NoClassDefFoundError unused) {
        }
        b.a(dialog, onCancelListener).show(activity.getFragmentManager(), str);
    }

    final void s(Context context, int i4, String str, PendingIntent pendingIntent) {
        int i5;
        String str2;
        NotificationChannel notificationChannel;
        CharSequence name;
        Log.w(c3.d4(1281), String.format(c3.d4(1495), Integer.valueOf(i4), null), new IllegalArgumentException());
        if (i4 == 18) {
            t(context);
            return;
        }
        if (pendingIntent == null) {
            if (i4 == 6) {
                Log.w("GoogleApiAvailability", c3.d4(71));
                return;
            }
            return;
        }
        String e4 = h1.a0.e(context, i4);
        String d4 = h1.a0.d(context, i4);
        Resources resources = context.getResources();
        NotificationManager notificationManager = (NotificationManager) h1.q.i(context.getSystemService("notification"));
        f.d n3 = new f.d(context).k(true).e(true).i(e4).n(new f.b().h(d4));
        if (com.google.android.gms.common.util.f.c(context)) {
            h1.q.k(com.google.android.gms.common.util.i.a());
            n3.m(context.getApplicationInfo().icon).l(2);
            if (com.google.android.gms.common.util.f.d(context)) {
                n3.a(c1.a.f2049a, resources.getString(c1.b.f2064o), pendingIntent);
            } else {
                n3.g(pendingIntent);
            }
        } else {
            n3.m(R.drawable.stat_sys_warning).o(resources.getString(c1.b.f2057h)).p(System.currentTimeMillis()).g(pendingIntent).h(d4);
        }
        if (com.google.android.gms.common.util.i.c()) {
            h1.q.k(com.google.android.gms.common.util.i.c());
            synchronized (f3108e) {
                str2 = this.f3110c;
            }
            if (str2 == null) {
                str2 = "com.google.android.gms.availability";
                notificationChannel = notificationManager.getNotificationChannel("com.google.android.gms.availability");
                String string = context.getResources().getString(c1.b.f2056g);
                if (notificationChannel == null) {
                    notificationManager.createNotificationChannel(h.a("com.google.android.gms.availability", string, 4));
                } else {
                    name = notificationChannel.getName();
                    if (!string.contentEquals(name)) {
                        notificationChannel.setName(string);
                        notificationManager.createNotificationChannel(notificationChannel);
                    }
                }
            }
            n3.f(str2);
        }
        Notification b4 = n3.b();
        if (i4 == 1 || i4 == 2 || i4 == 3) {
            l.f3115b.set(false);
            i5 = 10436;
        } else {
            i5 = 39789;
        }
        notificationManager.notify(i5, b4);
    }

    final void t(Context context) {
        new s(this, context).sendEmptyMessageDelayed(1, 120000L);
    }

    public final boolean u(Activity activity, f1.i iVar, int i4, int i5, DialogInterface.OnCancelListener onCancelListener) {
        Dialog o3 = o(activity, i4, h1.d0.c(iVar, a(activity, i4, "d"), 2), onCancelListener, null);
        if (o3 == null) {
            return false;
        }
        r(activity, o3, "GooglePlayServicesErrorDialog", onCancelListener);
        return true;
    }

    public final boolean v(Context context, a aVar, int i4) {
        PendingIntent k4;
        if (m1.b.a(context) || (k4 = k(context, aVar)) == null) {
            return false;
        }
        s(context, aVar.i0(), null, PendingIntent.getActivity(context, 0, GoogleApiActivity.a(context, k4, i4, true), a2.g.f16a | 134217728));
        return true;
    }
}
