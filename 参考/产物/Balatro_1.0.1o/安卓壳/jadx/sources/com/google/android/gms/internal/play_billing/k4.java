package com.google.android.gms.internal.play_billing;

import java.nio.ByteBuffer;
import java.nio.charset.Charset;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class k4 {

    /* renamed from: a, reason: collision with root package name */
    static final Charset f2838a = Charset.forName("UTF-8");

    /* renamed from: b, reason: collision with root package name */
    public static final byte[] f2839b;

    static {
        Charset.forName("ISO-8859-1");
        byte[] bArr = new byte[0];
        f2839b = bArr;
        ByteBuffer.wrap(bArr);
        int i4 = m3.f2863a;
        try {
            new k3(bArr, 0, 0, false, null).c(0);
        } catch (m4 e4) {
            throw new IllegalArgumentException(e4);
        }
    }

    public static int a(boolean z3) {
        return z3 ? 1231 : 1237;
    }

    static int b(int i4, byte[] bArr, int i5, int i6) {
        for (int i7 = i5; i7 < i5 + i6; i7++) {
            i4 = (i4 * 31) + bArr[i7];
        }
        return i4;
    }
}
