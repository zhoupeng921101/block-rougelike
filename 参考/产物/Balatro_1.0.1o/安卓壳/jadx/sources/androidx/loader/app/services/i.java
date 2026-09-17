package androidx.loader.app.services;

import android.content.Context;
import np.dcc.protect.EntryPoint;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final /* synthetic */ class i implements Runnable {

    /* renamed from: a, reason: collision with root package name */
    public final /* synthetic */ Context f1739a;

    /* renamed from: b, reason: collision with root package name */
    public final /* synthetic */ Throwable f1740b;

    static {
        EntryPoint.stub(18);
    }

    public /* synthetic */ i(Context context, Throwable th) {
        this.f1739a = context;
        this.f1740b = th;
    }

    @Override // java.lang.Runnable
    public final native void run();
}
