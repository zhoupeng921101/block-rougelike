package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class z5 {
    protected static final int a(String str, byte[] bArr, int i4, int i5) {
        byte[] bytes = str.getBytes(k4.f2838a);
        int length = bytes.length;
        if (length - i4 > i5) {
            throw new ArrayIndexOutOfBoundsException("Not enough space in output buffer to encode UTF-8 string");
        }
        System.arraycopy(bytes, 0, bArr, i4, length);
        return i4 + length;
    }
}
