package androidx.fragment.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import java.io.FileDescriptor;
import java.io.PrintWriter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class p extends l {

    /* renamed from: a, reason: collision with root package name */
    private final Activity f1555a;

    /* renamed from: b, reason: collision with root package name */
    private final Context f1556b;

    /* renamed from: c, reason: collision with root package name */
    private final Handler f1557c;

    /* renamed from: d, reason: collision with root package name */
    private final int f1558d;

    /* renamed from: e, reason: collision with root package name */
    final x f1559e;

    p(Activity activity, Context context, Handler handler, int i4) {
        this.f1559e = new y();
        this.f1555a = activity;
        this.f1556b = (Context) androidx.core.util.c.e(context, "context == null");
        this.f1557c = (Handler) androidx.core.util.c.e(handler, "handler == null");
        this.f1558d = i4;
    }

    p(j jVar) {
        this(jVar, jVar, new Handler(), 0);
    }

    public abstract void A();

    Activity t() {
        return this.f1555a;
    }

    Context u() {
        return this.f1556b;
    }

    public Handler v() {
        return this.f1557c;
    }

    public abstract void w(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr);

    public abstract Object x();

    public abstract LayoutInflater y();

    public void z(Fragment fragment, Intent intent, int i4, Bundle bundle) {
        if (i4 != -1) {
            throw new IllegalStateException("Starting activity with a requestCode requires a FragmentActivity host");
        }
        androidx.core.content.a.d(this.f1556b, intent, bundle);
    }
}
