package f1;

import a1.b2.c3;
import android.app.PendingIntent;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e1 extends h implements DialogInterface.OnCancelListener {

    /* renamed from: b, reason: collision with root package name */
    protected volatile boolean f3231b;

    /* renamed from: c, reason: collision with root package name */
    protected final AtomicReference f3232c;

    /* renamed from: d, reason: collision with root package name */
    private final Handler f3233d;

    /* renamed from: e, reason: collision with root package name */
    protected final d1.i f3234e;

    e1(i iVar, d1.i iVar2) {
        super(iVar);
        this.f3232c = new AtomicReference(null);
        this.f3233d = new a2.h(Looper.getMainLooper());
        this.f3234e = iVar2;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void l(d1.a aVar, int i4) {
        this.f3232c.set(null);
        m(aVar, i4);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void o() {
        this.f3232c.set(null);
        n();
    }

    private static final int p(a1 a1Var) {
        if (a1Var == null) {
            return -1;
        }
        return a1Var.a();
    }

    @Override // f1.h
    public final void e(int i4, int i5, Intent intent) {
        a1 a1Var = (a1) this.f3232c.get();
        if (i4 != 1) {
            if (i4 == 2) {
                int f4 = this.f3234e.f(b());
                if (f4 == 0) {
                    o();
                    return;
                } else {
                    if (a1Var == null) {
                        return;
                    }
                    if (a1Var.b().i0() == 18 && f4 == 18) {
                        return;
                    }
                }
            }
        } else if (i5 == -1) {
            o();
            return;
        } else if (i5 == 0) {
            if (a1Var != null) {
                l(new d1.a(intent != null ? intent.getIntExtra("<<ResolutionFailureErrorDetail>>", 13) : 13, null, a1Var.b().toString()), p(a1Var));
                return;
            }
            return;
        }
        if (a1Var != null) {
            l(a1Var.b(), a1Var.a());
        }
    }

    @Override // f1.h
    public final void f(Bundle bundle) {
        super.f(bundle);
        if (bundle != null) {
            this.f3232c.set(bundle.getBoolean("resolving_error", false) ? new a1(new d1.a(bundle.getInt("failed_status"), (PendingIntent) bundle.getParcelable("failed_resolution")), bundle.getInt("failed_client_id", -1)) : null);
        }
    }

    @Override // f1.h
    public final void i(Bundle bundle) {
        super.i(bundle);
        a1 a1Var = (a1) this.f3232c.get();
        if (a1Var == null) {
            return;
        }
        bundle.putBoolean("resolving_error", true);
        bundle.putInt("failed_client_id", a1Var.a());
        bundle.putInt("failed_status", a1Var.b().i0());
        bundle.putParcelable(c3.d4(695), a1Var.b().k0());
    }

    @Override // f1.h
    public void j() {
        super.j();
        this.f3231b = true;
    }

    @Override // f1.h
    public void k() {
        super.k();
        this.f3231b = false;
    }

    protected abstract void m(d1.a aVar, int i4);

    protected abstract void n();

    @Override // android.content.DialogInterface.OnCancelListener
    public final void onCancel(DialogInterface dialogInterface) {
        l(new d1.a(13, null), p((a1) this.f3232c.get()));
    }

    public final void s(d1.a aVar, int i4) {
        AtomicReference atomicReference;
        a1 a1Var = new a1(aVar, i4);
        do {
            atomicReference = this.f3232c;
            if (d1.a(atomicReference, null, a1Var)) {
                this.f3233d.post(new c1(this, a1Var));
                return;
            }
        } while (atomicReference.get() == null);
    }
}
