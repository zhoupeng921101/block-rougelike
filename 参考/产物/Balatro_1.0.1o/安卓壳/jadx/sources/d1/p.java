package d1;

import a1.b2.c3;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.Signature;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class p {

    /* renamed from: b, reason: collision with root package name */
    private static p f3119b;

    /* renamed from: a, reason: collision with root package name */
    private final Context f3120a;

    public p(Context context) {
        this.f3120a = context.getApplicationContext();
    }

    public static p a(Context context) {
        h1.q.i(context);
        synchronized (p.class) {
            try {
                if (f3119b == null) {
                    f0.a(context);
                    f3119b = new p(context);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return f3119b;
    }

    /* JADX WARN: Code restructure failed: missing block: B:42:0x00c0, code lost:
    
        r5 = r9;
     */
    /* JADX WARN: Multi-variable type inference failed */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    static final boolean c(android.content.pm.PackageInfo r10, boolean r11) {
        /*
            Method dump skipped, instructions count: 235
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: d1.p.c(android.content.pm.PackageInfo, boolean):boolean");
    }

    private static b0 d(PackageInfo packageInfo, b0... b0VarArr) {
        Signature[] signatureArr = packageInfo.signatures;
        if (signatureArr != null) {
            if (signatureArr.length != 1) {
                Log.w(c3.d4(1170), "Package has more than one signature.");
                return null;
            }
            c0 c0Var = new c0(packageInfo.signatures[0].toByteArray());
            for (int i4 = 0; i4 < b0VarArr.length; i4++) {
                if (b0VarArr[i4].equals(c0Var)) {
                    return b0VarArr[i4];
                }
            }
        }
        return null;
    }

    public boolean b(PackageInfo packageInfo) {
        if (packageInfo == null) {
            return false;
        }
        if (c(packageInfo, false)) {
            return true;
        }
        if (c(packageInfo, true)) {
            if (l.c(this.f3120a)) {
                return true;
            }
            Log.w(c3.d4(1171), "Test-keys aren't accepted on this build.");
        }
        return false;
    }
}
