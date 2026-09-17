package b1;

import a1.b2.c3;
import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.json.JSONException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c {

    /* renamed from: c, reason: collision with root package name */
    private static final Lock f1781c = new ReentrantLock();

    /* renamed from: d, reason: collision with root package name */
    private static c f1782d;

    /* renamed from: a, reason: collision with root package name */
    private final Lock f1783a = new ReentrantLock();

    /* renamed from: b, reason: collision with root package name */
    private final SharedPreferences f1784b;

    c(Context context) {
        this.f1784b = context.getSharedPreferences("com.google.android.gms.signin", 0);
    }

    public static c b(Context context) {
        h1.q.i(context);
        Lock lock = f1781c;
        lock.lock();
        try {
            if (f1782d == null) {
                f1782d = new c(context.getApplicationContext());
            }
            c cVar = f1782d;
            lock.unlock();
            return cVar;
        } catch (Throwable th) {
            f1781c.unlock();
            throw th;
        }
    }

    private static final String i(String str, String str2) {
        return str + ":" + str2;
    }

    public void a() {
        this.f1783a.lock();
        try {
            this.f1784b.edit().clear().apply();
        } finally {
            this.f1783a.unlock();
        }
    }

    public GoogleSignInAccount c() {
        String g4;
        String g5 = g("defaultGoogleSignInAccount");
        if (!TextUtils.isEmpty(g5) && (g4 = g(i(c3.d4(1110), g5))) != null) {
            try {
                return GoogleSignInAccount.q0(g4);
            } catch (JSONException unused) {
            }
        }
        return null;
    }

    public GoogleSignInOptions d() {
        String g4;
        String g5 = g(c3.d4(147));
        if (!TextUtils.isEmpty(g5) && (g4 = g(i("googleSignInOptions", g5))) != null) {
            try {
                return GoogleSignInOptions.q0(g4);
            } catch (JSONException unused) {
            }
        }
        return null;
    }

    public String e() {
        return g(c3.d4(1270));
    }

    public void f(GoogleSignInAccount googleSignInAccount, GoogleSignInOptions googleSignInOptions) {
        h1.q.i(googleSignInAccount);
        h1.q.i(googleSignInOptions);
        h("defaultGoogleSignInAccount", googleSignInAccount.r0());
        h1.q.i(googleSignInAccount);
        h1.q.i(googleSignInOptions);
        String r02 = googleSignInAccount.r0();
        h(i("googleSignInAccount", r02), googleSignInAccount.s0());
        h(i("googleSignInOptions", r02), googleSignInOptions.u0());
    }

    protected final String g(String str) {
        this.f1783a.lock();
        try {
            return this.f1784b.getString(str, null);
        } finally {
            this.f1783a.unlock();
        }
    }

    protected final void h(String str, String str2) {
        this.f1783a.lock();
        try {
            this.f1784b.edit().putString(str, str2).apply();
        } finally {
            this.f1783a.unlock();
        }
    }
}
