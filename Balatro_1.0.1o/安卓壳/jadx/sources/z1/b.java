package z1;

import android.util.Base64;
import java.security.SecureRandom;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {

    /* renamed from: a, reason: collision with root package name */
    private static final SecureRandom f5198a = new SecureRandom();

    public static String a() {
        byte[] bArr = new byte[16];
        f5198a.nextBytes(bArr);
        return Base64.encodeToString(bArr, 11);
    }
}
