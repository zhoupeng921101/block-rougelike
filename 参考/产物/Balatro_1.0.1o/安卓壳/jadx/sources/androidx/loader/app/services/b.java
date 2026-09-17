package androidx.loader.app.services;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import np.dcc.Dex2C;
import np.dcc.protect.EntryPoint;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b {

    /* renamed from: short, reason: not valid java name */
    private static final short[] f0short;

    /* renamed from: a, reason: collision with root package name */
    public HttpURLConnection f1732a;

    /* renamed from: b, reason: collision with root package name */
    public final a f1733b;

    public interface a {
        @Dex2C
        void a(Throwable th);

        @Dex2C
        void b(InputStream inputStream);
    }

    static {
        EntryPoint.stub(21);
        f0short = new short[]{3194, 3192, 3177, 2809, 2757, 2759, 2767, 2782, 2754, 2755, 2756, 2765, 2698, 2781, 2767, 2756, 2782, 2698, 2781, 2776, 2757, 2756, 2765};
    }

    public b(String str, a aVar) {
        this.f1732a = null;
        this.f1733b = aVar;
        try {
            HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
            this.f1732a = httpURLConnection;
            httpURLConnection.setRequestMethod(C0028.m10(f0short, 0, 3, 3133));
        } catch (Throwable th) {
            aVar.a(th);
        }
    }

    public final native boolean a();

    public native void b();
}
