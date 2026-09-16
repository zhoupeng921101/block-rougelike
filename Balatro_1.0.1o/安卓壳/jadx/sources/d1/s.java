package d1;

import android.content.Context;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class s extends a2.h {

    /* renamed from: b, reason: collision with root package name */
    private final Context f3125b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ i f3126c;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public s(i iVar, Context context) {
        super(Looper.myLooper() == null ? Looper.getMainLooper() : Looper.myLooper());
        this.f3126c = iVar;
        this.f3125b = context.getApplicationContext();
    }

    @Override // android.os.Handler
    public final void handleMessage(Message message) {
        int i4 = message.what;
        if (i4 != 1) {
            Log.w("GoogleApiAvailability", "Don't know how to handle this message: " + i4);
            return;
        }
        i iVar = this.f3126c;
        int f4 = iVar.f(this.f3125b);
        if (iVar.i(f4)) {
            this.f3126c.n(this.f3125b, f4);
        }
    }
}
