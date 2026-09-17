package t1;

import android.content.Intent;
import android.os.Bundle;
import android.os.Looper;
import android.os.ResultReceiver;
import c2.i1;
import g2.h;
import g2.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a extends ResultReceiver {

    /* renamed from: e, reason: collision with root package name */
    private final i f4989e;

    public a() {
        super(new i1(Looper.getMainLooper()));
        this.f4989e = new i();
    }

    public final h o() {
        return this.f4989e.a();
    }

    @Override // android.os.ResultReceiver
    protected final void onReceiveResult(int i4, Bundle bundle) {
        Intent intent;
        super.onReceiveResult(i4, bundle);
        boolean z3 = i4 == -1;
        if (bundle == null) {
            intent = new Intent();
        } else {
            intent = (Intent) bundle.getParcelable("resultData");
            if (intent == null) {
                intent = new Intent();
            }
        }
        this.f4989e.e(z3 ? c.a(intent) : c.b(intent));
    }
}
