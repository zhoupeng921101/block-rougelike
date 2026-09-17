package h1;

import android.app.PendingIntent;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class w0 extends b2.p {

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ d f3590b;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public w0(d dVar, Looper looper) {
        super(looper);
        Objects.requireNonNull(dVar);
        this.f3590b = dVar;
    }

    private static final void a(Message message) {
        x0 x0Var = (x0) message.obj;
        if (x0Var != null) {
            x0Var.c();
        }
    }

    private static final boolean b(Message message) {
        int i4 = message.what;
        return i4 == 2 || i4 == 1 || i4 == 7;
    }

    @Override // android.os.Handler
    public final void handleMessage(Message message) {
        d dVar = this.f3590b;
        if (dVar.C.get() != message.arg1) {
            if (b(message)) {
                a(message);
                return;
            }
            return;
        }
        int i4 = message.what;
        if ((i4 == 1 || i4 == 7 || ((i4 == 4 && !dVar.s()) || message.what == 5)) && !dVar.g()) {
            a(message);
            return;
        }
        int i5 = message.what;
        if (i5 == 4) {
            dVar.e0(new d1.a(message.arg2));
            if (dVar.X() && !dVar.f0()) {
                dVar.U(3, null);
                return;
            }
            d1.a d02 = dVar.d0() != null ? dVar.d0() : new d1.a(8);
            dVar.f3457p.c(d02);
            dVar.K(d02);
            return;
        }
        if (i5 == 5) {
            d1.a d03 = dVar.d0() != null ? dVar.d0() : new d1.a(8);
            dVar.f3457p.c(d03);
            dVar.K(d03);
            return;
        }
        if (i5 == 3) {
            Object obj = message.obj;
            d1.a aVar = new d1.a(message.arg2, obj instanceof PendingIntent ? (PendingIntent) obj : null);
            dVar.f3457p.c(aVar);
            dVar.K(aVar);
            return;
        }
        if (i5 == 6) {
            dVar.U(5, null);
            if (dVar.b0() != null) {
                dVar.b0().a(message.arg2);
            }
            dVar.L(message.arg2);
            dVar.V(5, 1, null);
            return;
        }
        if (i5 == 2 && !dVar.a()) {
            a(message);
            return;
        }
        if (b(message)) {
            ((x0) message.obj).b();
            return;
        }
        int i6 = message.what;
        StringBuilder sb = new StringBuilder(String.valueOf(i6).length() + 34);
        sb.append("Don't know how to handle message: ");
        sb.append(i6);
        Log.wtf("GmsClient", sb.toString(), new Exception());
    }
}
