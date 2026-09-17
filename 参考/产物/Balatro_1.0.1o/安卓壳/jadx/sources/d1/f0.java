package d1;

import android.content.Context;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class f0 {

    /* renamed from: a, reason: collision with root package name */
    static final d0 f3099a = new v(b0.i("0\u0082\u0005È0\u0082\u0003° \u0003\u0002\u0001\u0002\u0002\u0014\u007f¢fú§p\u0085xb±"));

    /* renamed from: b, reason: collision with root package name */
    static final d0 f3100b = new w(b0.i("0\u0082\u0006\u00040\u0082\u0003ì \u0003\u0002\u0001\u0002\u0002\u0014QÕÛ\u0004÷XçB\u0086<"));

    /* renamed from: c, reason: collision with root package name */
    static final d0 f3101c = new x(b0.i("0\u0082\u0005È0\u0082\u0003° \u0003\u0002\u0001\u0002\u0002\u0014\u0010\u008ae\bsù/\u008eQí"));

    /* renamed from: d, reason: collision with root package name */
    static final d0 f3102d = new y(b0.i("0\u0082\u0006\u00040\u0082\u0003ì \u0003\u0002\u0001\u0002\u0002\u0014\u0003£²\u00ad×árÊkì"));

    /* renamed from: e, reason: collision with root package name */
    static final d0 f3103e = new z(b0.i("0\u0082\u0004C0\u0082\u0003+ \u0003\u0002\u0001\u0002\u0002\t\u0000Âà\u0087FdJ0\u008d0"));

    /* renamed from: f, reason: collision with root package name */
    static final d0 f3104f = new a0(b0.i("0\u0082\u0004¨0\u0082\u0003\u0090 \u0003\u0002\u0001\u0002\u0002\t\u0000Õ\u0085¸l}ÓNõ0"));

    /* renamed from: g, reason: collision with root package name */
    private static final Object f3105g = new Object();

    /* renamed from: h, reason: collision with root package name */
    private static Context f3106h;

    static synchronized void a(Context context) {
        synchronized (f0.class) {
            if (f3106h != null) {
                Log.w("GoogleCertificates", "GoogleCertificates has been initialized already");
            } else if (context != null) {
                f3106h = context.getApplicationContext();
            }
        }
    }
}
