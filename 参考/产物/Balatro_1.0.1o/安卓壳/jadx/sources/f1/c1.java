package f1;

import android.app.Dialog;
import android.app.PendingIntent;
import com.google.android.gms.common.api.GoogleApiActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c1 implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    private final a1 f3216e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ e1 f3217f;

    c1(e1 e1Var, a1 a1Var) {
        this.f3217f = e1Var;
        this.f3216e = a1Var;
    }

    @Override // java.lang.Runnable
    public final void run() {
        if (this.f3217f.f3231b) {
            d1.a b4 = this.f3216e.b();
            if (b4.l0()) {
                e1 e1Var = this.f3217f;
                e1Var.f3261a.startActivityForResult(GoogleApiActivity.a(e1Var.b(), (PendingIntent) h1.q.i(b4.k0()), this.f3216e.a(), false), 1);
                return;
            }
            e1 e1Var2 = this.f3217f;
            if (e1Var2.f3234e.a(e1Var2.b(), b4.i0(), null) != null) {
                e1 e1Var3 = this.f3217f;
                e1Var3.f3234e.u(e1Var3.b(), e1Var3.f3261a, b4.i0(), 2, this.f3217f);
                return;
            }
            if (b4.i0() != 18) {
                this.f3217f.l(b4, this.f3216e.a());
                return;
            }
            e1 e1Var4 = this.f3217f;
            Dialog p3 = e1Var4.f3234e.p(e1Var4.b(), e1Var4);
            e1 e1Var5 = this.f3217f;
            e1Var5.f3234e.q(e1Var5.b().getApplicationContext(), new b1(this, p3));
        }
    }
}
