package a2;

import android.os.Handler;
import android.os.Looper;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class h extends Handler {

    /* renamed from: a, reason: collision with root package name */
    private final Looper f17a;

    public h(Looper looper) {
        super(looper);
        this.f17a = Looper.getMainLooper();
    }

    public h(Looper looper, Handler.Callback callback) {
        super(looper, callback);
        this.f17a = Looper.getMainLooper();
    }
}
