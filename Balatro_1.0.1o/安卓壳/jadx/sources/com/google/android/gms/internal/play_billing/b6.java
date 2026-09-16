package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class b6 {

    /* renamed from: a, reason: collision with root package name */
    public static final /* synthetic */ int f2723a = 0;

    static {
        try {
            if (System.getenv("PROTOBUF_DISABLE_UNSAFE_UTF8_PROCESSOR_FOR_TESTING") != null) {
                return;
            }
        } catch (SecurityException unused) {
        }
        if (x5.C() && x5.D()) {
            int i4 = y2.f3034a;
        }
    }

    /* JADX WARN: Code restructure failed: missing block: B:12:0x001e, code lost:
    
        return r12 + r0;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    static int a(java.lang.String r10, byte[] r11, int r12, int r13) {
        /*
            Method dump skipped, instructions count: 230
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.internal.play_billing.b6.a(java.lang.String, byte[], int, int):int");
    }

    static int b(String str) {
        int length = str.length();
        int i4 = 0;
        int i5 = 0;
        while (i5 < length && str.charAt(i5) < 128) {
            i5++;
        }
        int i6 = length;
        while (true) {
            if (i5 >= length) {
                break;
            }
            char charAt = str.charAt(i5);
            if (charAt < 2048) {
                i6 += (127 - charAt) >>> 31;
                i5++;
            } else {
                try {
                    int length2 = str.length();
                    while (i5 < length2) {
                        char charAt2 = str.charAt(i5);
                        if (charAt2 < 2048) {
                            i4 += (127 - charAt2) >>> 31;
                        } else {
                            i4 += 2;
                            if (charAt2 >= 55296 && charAt2 <= 57343) {
                                if (Character.codePointAt(str, i5) < 65536) {
                                    throw new a6(i5, length2);
                                }
                                i5++;
                            }
                        }
                        i5++;
                    }
                    i6 += i4;
                } catch (a6 unused) {
                    return str.getBytes(k4.f2838a).length;
                }
            }
        }
        if (i6 >= length) {
            return i6;
        }
        throw new IllegalArgumentException("UTF-8 length does not fit in int: " + (i6 + 4294967296L));
    }

    static boolean c(byte[] bArr, int i4, int i5) {
        while (i4 < i5 && bArr[i4] >= 0) {
            i4++;
        }
        if (i4 >= i5) {
            return true;
        }
        while (i4 < i5) {
            int i6 = i4 + 1;
            byte b4 = bArr[i4];
            if (b4 >= 0) {
                i4 = i6;
            } else {
                if (b4 < -32) {
                    if (i6 < i5 && b4 >= -62) {
                        i4 += 2;
                        if (bArr[i6] > -65) {
                        }
                    }
                    return false;
                }
                if (b4 >= -16) {
                    if (i6 >= i5 - 2) {
                        return false;
                    }
                    int i7 = i4 + 2;
                    byte b5 = bArr[i6];
                    if (b5 <= -65 && (((b4 << 28) + (b5 + 112)) >> 30) == 0) {
                        int i8 = i4 + 3;
                        if (bArr[i7] <= -65) {
                            i4 += 4;
                            if (bArr[i8] > -65) {
                            }
                        }
                    }
                    return false;
                }
                if (i6 >= i5 - 1) {
                    return false;
                }
                int i9 = i4 + 2;
                byte b6 = bArr[i6];
                if (b6 > -65 || (b4 == -32 && b6 < -96)) {
                    return false;
                }
                if (b4 == -19 && b6 >= -96) {
                    return false;
                }
                i4 += 3;
                if (bArr[i9] > -65) {
                    return false;
                }
            }
        }
        return true;
    }
}
