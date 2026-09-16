package h1;

import android.content.ComponentName;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i1 implements Handler.Callback {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ j1 f3528a;

    /* synthetic */ i1(j1 j1Var, byte[] bArr) {
        Objects.requireNonNull(j1Var);
        this.f3528a = j1Var;
    }

    @Override // android.os.Handler.Callback
    public final boolean handleMessage(Message message) {
        int i4 = message.what;
        if (i4 == 0) {
            j1 j1Var = this.f3528a;
            synchronized (j1Var.f()) {
                try {
                    g1 g1Var = (g1) message.obj;
                    h1 h1Var = (h1) j1Var.f().get(g1Var);
                    if (h1Var != null && h1Var.g()) {
                        if (h1Var.d()) {
                            h1Var.a("GmsClientSupervisor");
                        }
                        j1Var.f().remove(g1Var);
                    }
                } finally {
                }
            }
            return true;
        }
        if (i4 != 1) {
            return false;
        }
        j1 j1Var2 = this.f3528a;
        synchronized (j1Var2.f()) {
            try {
                g1 g1Var2 = (g1) message.obj;
                h1 h1Var2 = (h1) j1Var2.f().get(g1Var2);
                if (h1Var2 != null && h1Var2.e() == 3) {
                    String valueOf = String.valueOf(g1Var2);
                    StringBuilder sb = new StringBuilder(valueOf.length() + 47);
                    sb.append("Timeout waiting for ServiceConnection callback ");
                    sb.append(valueOf);
                    Log.e("GmsClientSupervisor", sb.toString(), new Exception());
                    ComponentName i5 = h1Var2.i();
                    if (i5 == null) {
                        i5 = g1Var2.c();
                    }
                    if (i5 == null) {
                        String b4 = g1Var2.b();
                        q.i(b4);
                        i5 = new ComponentName(b4, "unknown");
                    }
                    h1Var2.onServiceDisconnected(i5);
                }
            } finally {
            }
        }
        return true;
    }
}
