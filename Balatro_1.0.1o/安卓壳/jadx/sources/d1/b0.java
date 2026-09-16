package d1;

import a1.b2.c3;
import android.os.RemoteException;
import android.util.Log;
import h1.n1;
import h1.o1;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class b0 extends n1 {

    /* renamed from: a, reason: collision with root package name */
    private final int f3088a;

    protected b0(byte[] bArr) {
        h1.q.a(bArr.length == 25);
        this.f3088a = Arrays.hashCode(bArr);
    }

    protected static byte[] i(String str) {
        try {
            return str.getBytes("ISO-8859-1");
        } catch (UnsupportedEncodingException e4) {
            throw new AssertionError(e4);
        }
    }

    @Override // h1.o1
    public final o1.a d() {
        return o1.b.i(h());
    }

    @Override // h1.o1
    public final int e() {
        return this.f3088a;
    }

    public final boolean equals(Object obj) {
        o1.a d4;
        if (!(obj instanceof o1)) {
            return false;
        }
        try {
            o1 o1Var = (o1) obj;
            if (o1Var.e() == this.f3088a && (d4 = o1Var.d()) != null) {
                return Arrays.equals(h(), (byte[]) o1.b.h(d4));
            }
            return false;
        } catch (RemoteException e4) {
            Log.e(c3.d4(738), "Failed to get Google certificates from remote", e4);
            return false;
        }
    }

    abstract byte[] h();

    public final int hashCode() {
        return this.f3088a;
    }
}
