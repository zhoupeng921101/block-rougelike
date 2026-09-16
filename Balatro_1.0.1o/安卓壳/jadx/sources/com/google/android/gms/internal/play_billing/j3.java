package com.google.android.gms.internal.play_billing;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class j3 implements Iterable, Serializable {

    /* renamed from: f, reason: collision with root package name */
    public static final j3 f2809f = new h3(k4.f2839b);

    /* renamed from: e, reason: collision with root package name */
    private int f2810e = 0;

    static {
        int i4 = y2.f3034a;
    }

    j3() {
    }

    static int k(int i4, int i5, int i6) {
        int i7 = i5 - i4;
        if ((i4 | i5 | i7 | (i6 - i5)) >= 0) {
            return i7;
        }
        if (i4 < 0) {
            throw new IndexOutOfBoundsException(a1.b2.c3.d4(1329) + i4 + a1.b2.c3.d4(288));
        }
        if (i5 < i4) {
            throw new IndexOutOfBoundsException("Beginning index larger than ending index: " + i4 + ", " + i5);
        }
        throw new IndexOutOfBoundsException("End index: " + i5 + " >= " + i6);
    }

    public static j3 l(byte[] bArr, int i4, int i5) {
        try {
            k(i4, i4 + i5, bArr.length);
            byte[] bArr2 = new byte[i5];
            System.arraycopy(bArr, i4, bArr2, 0, i5);
            return new h3(bArr2);
        } catch (m4 e4) {
            throw new AssertionError("Expected no InvalidProtocolBufferException as data UTF8 validity is not checked.", e4);
        }
    }

    static /* bridge */ /* synthetic */ boolean m(byte[] bArr, int i4, byte[] bArr2, int i5, int i6) {
        int i7 = i4 + i6;
        k(i4, i7, bArr.length);
        k(i5, i6 + i5, bArr2.length);
        while (i4 < i7) {
            if (bArr[i4] != bArr2[i5]) {
                return false;
            }
            i4++;
            i5++;
        }
        return true;
    }

    public abstract byte a(int i4);

    abstract byte e(int i4);

    public final boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof j3)) {
            return false;
        }
        j3 j3Var = (j3) obj;
        int g4 = g();
        if (g4 != j3Var.g()) {
            return false;
        }
        if (g4 == 0) {
            return true;
        }
        int i4 = this.f2810e;
        int i5 = j3Var.f2810e;
        if (i4 == 0 || i5 == 0 || i4 == i5) {
            return j(j3Var);
        }
        return false;
    }

    protected abstract int f(int i4, int i5, int i6);

    public abstract int g();

    public abstract j3 h(int i4, int i5);

    public final int hashCode() {
        int i4 = this.f2810e;
        if (i4 == 0) {
            int g4 = g();
            i4 = f(g4, 0, g4);
            if (i4 == 0) {
                i4 = 1;
            }
            this.f2810e = i4;
        }
        return i4;
    }

    abstract void i(b3 b3Var);

    @Override // java.lang.Iterable
    public final /* synthetic */ Iterator iterator() {
        return new c3(this);
    }

    protected abstract boolean j(j3 j3Var);

    public final String toString() {
        return String.format(Locale.ROOT, "<ByteString@%s size=%d contents=\"%s\">", Integer.toHexString(System.identityHashCode(this)), Integer.valueOf(g()), g() <= 50 ? n5.a(this) : n5.a(h(0, 47)).concat("..."));
    }
}
