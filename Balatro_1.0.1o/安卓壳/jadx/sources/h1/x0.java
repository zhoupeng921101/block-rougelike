package h1;

import android.util.Log;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class x0 {

    /* renamed from: a, reason: collision with root package name */
    private Object f3591a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f3592b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ d f3593c;

    public x0(d dVar, Object obj) {
        Objects.requireNonNull(dVar);
        this.f3593c = dVar;
        this.f3591a = obj;
        this.f3592b = false;
    }

    protected abstract void a(Object obj);

    public final void b() {
        Object obj;
        synchronized (this) {
            try {
                obj = this.f3591a;
                if (this.f3592b) {
                    String obj2 = toString();
                    StringBuilder sb = new StringBuilder(obj2.length() + 47);
                    sb.append("Callback proxy ");
                    sb.append(obj2);
                    sb.append(" being reused. This is not safe.");
                    Log.w("GmsClient", sb.toString());
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        if (obj != null) {
            a(obj);
        }
        synchronized (this) {
            this.f3592b = true;
        }
        c();
    }

    public final void c() {
        d();
        d dVar = this.f3593c;
        synchronized (dVar.a0()) {
            dVar.a0().remove(this);
        }
    }

    public final void d() {
        synchronized (this) {
            this.f3591a = null;
        }
    }
}
