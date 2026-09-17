package f1;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k0 extends BroadcastReceiver {

    /* renamed from: a, reason: collision with root package name */
    Context f3277a;

    /* renamed from: b, reason: collision with root package name */
    private final j0 f3278b;

    public k0(j0 j0Var) {
        this.f3278b = j0Var;
    }

    public final void a(Context context) {
        this.f3277a = context;
    }

    public final synchronized void b() {
        try {
            Context context = this.f3277a;
            if (context != null) {
                context.unregisterReceiver(this);
            }
            this.f3277a = null;
        } catch (Throwable th) {
            throw th;
        }
    }

    @Override // android.content.BroadcastReceiver
    public final void onReceive(Context context, Intent intent) {
    }
}
