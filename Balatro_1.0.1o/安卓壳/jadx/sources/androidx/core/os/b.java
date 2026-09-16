package androidx.core.os;

import android.os.CancellationSignal;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b {

    /* renamed from: a, reason: collision with root package name */
    private boolean f938a;

    /* renamed from: b, reason: collision with root package name */
    private InterfaceC0009b f939b;

    /* renamed from: c, reason: collision with root package name */
    private Object f940c;

    /* renamed from: d, reason: collision with root package name */
    private boolean f941d;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static void a(Object obj) {
            ((CancellationSignal) obj).cancel();
        }

        static CancellationSignal b() {
            return new CancellationSignal();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.core.os.b$b, reason: collision with other inner class name */
    public interface InterfaceC0009b {
        void onCancel();
    }

    private void c() {
        while (this.f941d) {
            try {
                wait();
            } catch (InterruptedException unused) {
            }
        }
    }

    public void a() {
        synchronized (this) {
            try {
                if (this.f938a) {
                    return;
                }
                this.f938a = true;
                this.f941d = true;
                InterfaceC0009b interfaceC0009b = this.f939b;
                Object obj = this.f940c;
                if (interfaceC0009b != null) {
                    try {
                        interfaceC0009b.onCancel();
                    } catch (Throwable th) {
                        synchronized (this) {
                            this.f941d = false;
                            notifyAll();
                            throw th;
                        }
                    }
                }
                if (obj != null) {
                    a.a(obj);
                }
                synchronized (this) {
                    this.f941d = false;
                    notifyAll();
                }
            } finally {
            }
        }
    }

    public void b(InterfaceC0009b interfaceC0009b) {
        synchronized (this) {
            try {
                c();
                if (this.f939b == interfaceC0009b) {
                    return;
                }
                this.f939b = interfaceC0009b;
                if (this.f938a && interfaceC0009b != null) {
                    interfaceC0009b.onCancel();
                }
            } finally {
            }
        }
    }
}
