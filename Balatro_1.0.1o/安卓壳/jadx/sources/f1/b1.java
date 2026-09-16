package f1;

import android.app.Dialog;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b1 extends j0 {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ Dialog f3208a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ c1 f3209b;

    b1(c1 c1Var, Dialog dialog) {
        this.f3209b = c1Var;
        this.f3208a = dialog;
    }

    @Override // f1.j0
    public final void a() {
        this.f3209b.f3217f.o();
        if (this.f3208a.isShowing()) {
            this.f3208a.dismiss();
        }
    }
}
