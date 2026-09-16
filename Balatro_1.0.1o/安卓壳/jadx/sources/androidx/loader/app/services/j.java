package androidx.loader.app.services;

import android.content.Context;
import np.dcc.protect.EntryPoint;
import org.json.JSONObject;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final /* synthetic */ class j implements Runnable {

    /* renamed from: a, reason: collision with root package name */
    public final /* synthetic */ Context f1741a;

    /* renamed from: b, reason: collision with root package name */
    public final /* synthetic */ JSONObject f1742b;

    static {
        EntryPoint.stub(19);
    }

    public /* synthetic */ j(Context context, JSONObject jSONObject) {
        this.f1741a = context;
        this.f1742b = jSONObject;
    }

    @Override // java.lang.Runnable
    public final native void run();
}
