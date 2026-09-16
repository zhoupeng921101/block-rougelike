package androidx.loader.app.services;

import android.content.Context;
import np.dcc.protect.EntryPoint;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final /* synthetic */ class k implements Runnable {

    /* renamed from: a, reason: collision with root package name */
    public final /* synthetic */ Context f1743a;

    /* renamed from: b, reason: collision with root package name */
    public final /* synthetic */ Exception f1744b;

    static {
        EntryPoint.stub(28);
    }

    public /* synthetic */ k(Context context, Exception exc) {
        this.f1743a = context;
        this.f1744b = exc;
    }

    @Override // java.lang.Runnable
    public final native void run();
}
