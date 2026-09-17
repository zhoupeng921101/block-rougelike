package b1;

import a1.b2.c3;
import com.google.android.gms.common.api.Status;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f implements Runnable {

    /* renamed from: g, reason: collision with root package name */
    private static final k1.a f1785g = new k1.a(c3.d4(1065), new String[0]);

    /* renamed from: e, reason: collision with root package name */
    private final String f1786e;

    /* renamed from: f, reason: collision with root package name */
    private final f1.p f1787f = new f1.p(null);

    public f(String str) {
        this.f1786e = h1.q.f(str);
    }

    public static e1.g a(String str) {
        if (str == null) {
            return e1.h.a(new Status(4), null);
        }
        f fVar = new f(str);
        new Thread(fVar).start();
        return fVar.f1787f;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Status status = Status.f2561l;
        try {
            HttpURLConnection httpURLConnection = (HttpURLConnection) new URL("https://accounts.google.com/o/oauth2/revoke?token=" + this.f1786e).openConnection();
            httpURLConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            int responseCode = httpURLConnection.getResponseCode();
            if (responseCode == 200) {
                status = Status.f2559j;
            } else {
                f1785g.b("Unable to revoke access!", new Object[0]);
            }
            f1785g.a("Response Code: " + responseCode, new Object[0]);
        } catch (IOException e4) {
            f1785g.b("IOException when revoking access: ".concat(String.valueOf(e4.toString())), new Object[0]);
        } catch (Exception e5) {
            f1785g.b(c3.d4(723).concat(String.valueOf(e5.toString())), new Object[0]);
        }
        this.f1787f.h(status);
    }
}
