package androidx.loader.app;

import android.os.Bundle;
import androidx.lifecycle.b0;
import androidx.lifecycle.k;
import java.io.FileDescriptor;
import java.io.PrintWriter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.loader.app.a$a, reason: collision with other inner class name */
    public interface InterfaceC0024a {
        void a(y.b bVar);

        void b(y.b bVar, Object obj);

        y.b c(int i4, Bundle bundle);
    }

    public static a b(k kVar) {
        return new b(kVar, ((b0) kVar).o());
    }

    public abstract void a(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr);

    public abstract y.b c(int i4, Bundle bundle, InterfaceC0024a interfaceC0024a);

    public abstract void d();
}
