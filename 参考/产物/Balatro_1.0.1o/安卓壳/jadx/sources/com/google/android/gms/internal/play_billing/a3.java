package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class a3 {

    /* renamed from: a, reason: collision with root package name */
    private static volatile int f2713a = 100;

    /* renamed from: b, reason: collision with root package name */
    public static final /* synthetic */ int f2714b = 0;

    static int a(byte[] bArr, int i4, z2 z2Var) {
        int i5 = i(bArr, i4, z2Var);
        int i6 = z2Var.f3044a;
        if (i6 < 0) {
            throw new m4(a1.b2.c3.d4(1032));
        }
        if (i6 > bArr.length - i5) {
            throw new m4("While parsing a protocol message, the input ended unexpectedly in the middle of a field.  This could mean either that the input has been truncated or that an embedded message misreported its own length.");
        }
        if (i6 == 0) {
            z2Var.f3046c = j3.f2809f;
            return i5;
        }
        z2Var.f3046c = j3.l(bArr, i5, i6);
        return i5 + i6;
    }

    static int b(byte[] bArr, int i4) {
        int i5 = bArr[i4] & 255;
        int i6 = bArr[i4 + 1] & 255;
        int i7 = bArr[i4 + 2] & 255;
        return ((bArr[i4 + 3] & 255) << 24) | (i6 << 8) | i5 | (i7 << 16);
    }

    static int c(k5 k5Var, byte[] bArr, int i4, int i5, int i6, z2 z2Var) {
        Object e4 = k5Var.e();
        int m3 = m(e4, k5Var, bArr, i4, i5, i6, z2Var);
        k5Var.g(e4);
        z2Var.f3046c = e4;
        return m3;
    }

    static int d(k5 k5Var, byte[] bArr, int i4, int i5, z2 z2Var) {
        Object e4 = k5Var.e();
        int n3 = n(e4, k5Var, bArr, i4, i5, z2Var);
        k5Var.g(e4);
        z2Var.f3046c = e4;
        return n3;
    }

    static int e(k5 k5Var, int i4, byte[] bArr, int i5, int i6, i4 i4Var, z2 z2Var) {
        int d4 = d(k5Var, bArr, i5, i6, z2Var);
        i4Var.add(z2Var.f3046c);
        while (d4 < i6) {
            int i7 = i(bArr, d4, z2Var);
            if (i4 != z2Var.f3044a) {
                break;
            }
            d4 = d(k5Var, bArr, i7, i6, z2Var);
            i4Var.add(z2Var.f3046c);
        }
        return d4;
    }

    static int f(byte[] bArr, int i4, i4 i4Var, z2 z2Var) {
        e4 e4Var = (e4) i4Var;
        int i5 = i(bArr, i4, z2Var);
        int i6 = z2Var.f3044a + i5;
        while (i5 < i6) {
            i5 = i(bArr, i5, z2Var);
            e4Var.g(z2Var.f3044a);
        }
        if (i5 == i6) {
            return i5;
        }
        throw new m4("While parsing a protocol message, the input ended unexpectedly in the middle of a field.  This could mean either that the input has been truncated or that an embedded message misreported its own length.");
    }

    static int g(byte[] bArr, int i4, z2 z2Var) {
        int i5;
        int i6 = i(bArr, i4, z2Var);
        int i7 = z2Var.f3044a;
        if (i7 < 0) {
            throw new m4("CodedInputStream encountered an embedded string or message which claimed to have negative size.");
        }
        if (i7 == 0) {
            z2Var.f3046c = "";
            return i6;
        }
        int i8 = b6.f2723a;
        int length = bArr.length;
        if ((((length - i6) - i7) | i6 | i7) < 0) {
            throw new ArrayIndexOutOfBoundsException(String.format("buffer length=%d, index=%d, size=%d", Integer.valueOf(length), Integer.valueOf(i6), Integer.valueOf(i7)));
        }
        int i9 = i6 + i7;
        char[] cArr = new char[i7];
        int i10 = 0;
        while (i6 < i9) {
            byte b4 = bArr[i6];
            if (!y5.d(b4)) {
                break;
            }
            i6++;
            cArr[i10] = (char) b4;
            i10++;
        }
        int i11 = i10;
        while (i6 < i9) {
            int i12 = i6 + 1;
            byte b5 = bArr[i6];
            if (y5.d(b5)) {
                cArr[i11] = (char) b5;
                i11++;
                i6 = i12;
                while (i6 < i9) {
                    byte b6 = bArr[i6];
                    if (y5.d(b6)) {
                        i6++;
                        cArr[i11] = (char) b6;
                        i11++;
                    }
                }
            } else {
                if (b5 < -32) {
                    if (i12 >= i9) {
                        throw new m4("Protocol message had invalid UTF-8.");
                    }
                    i5 = i11 + 1;
                    i6 += 2;
                    y5.c(b5, bArr[i12], cArr, i11);
                } else if (b5 < -16) {
                    if (i12 >= i9 - 1) {
                        throw new m4("Protocol message had invalid UTF-8.");
                    }
                    i5 = i11 + 1;
                    int i13 = i6 + 2;
                    i6 += 3;
                    y5.b(b5, bArr[i12], bArr[i13], cArr, i11);
                } else {
                    if (i12 >= i9 - 2) {
                        throw new m4("Protocol message had invalid UTF-8.");
                    }
                    byte b7 = bArr[i12];
                    int i14 = i6 + 3;
                    byte b8 = bArr[i6 + 2];
                    i6 += 4;
                    y5.a(b5, b7, b8, bArr[i14], cArr, i11);
                    i11 += 2;
                }
                i11 = i5;
            }
        }
        z2Var.f3046c = new String(cArr, 0, i11);
        return i9;
    }

    static int h(int i4, byte[] bArr, int i5, int i6, r5 r5Var, z2 z2Var) {
        if ((i4 >>> 3) == 0) {
            throw new m4("Protocol message contained an invalid tag (zero).");
        }
        int i7 = i4 & 7;
        if (i7 == 0) {
            int l3 = l(bArr, i5, z2Var);
            r5Var.j(i4, Long.valueOf(z2Var.f3045b));
            return l3;
        }
        if (i7 == 1) {
            r5Var.j(i4, Long.valueOf(o(bArr, i5)));
            return i5 + 8;
        }
        if (i7 == 2) {
            int i8 = i(bArr, i5, z2Var);
            int i9 = z2Var.f3044a;
            if (i9 < 0) {
                throw new m4("CodedInputStream encountered an embedded string or message which claimed to have negative size.");
            }
            if (i9 > bArr.length - i8) {
                throw new m4(a1.b2.c3.d4(1489));
            }
            if (i9 == 0) {
                r5Var.j(i4, j3.f2809f);
            } else {
                r5Var.j(i4, j3.l(bArr, i8, i9));
            }
            return i8 + i9;
        }
        if (i7 != 3) {
            if (i7 != 5) {
                throw new m4("Protocol message contained an invalid tag (zero).");
            }
            r5Var.j(i4, Integer.valueOf(b(bArr, i5)));
            return i5 + 4;
        }
        int i10 = (i4 & (-8)) | 4;
        r5 f4 = r5.f();
        int i11 = z2Var.f3048e + 1;
        z2Var.f3048e = i11;
        p(i11);
        int i12 = 0;
        while (true) {
            if (i5 >= i6) {
                break;
            }
            int i13 = i(bArr, i5, z2Var);
            int i14 = z2Var.f3044a;
            if (i14 == i10) {
                i12 = i14;
                i5 = i13;
                break;
            }
            i5 = h(i14, bArr, i13, i6, f4, z2Var);
            i12 = i14;
        }
        z2Var.f3048e--;
        if (i5 > i6 || i12 != i10) {
            throw new m4("Failed to parse the message.");
        }
        r5Var.j(i4, f4);
        return i5;
    }

    static int i(byte[] bArr, int i4, z2 z2Var) {
        int i5 = i4 + 1;
        byte b4 = bArr[i4];
        if (b4 < 0) {
            return j(b4, bArr, i5, z2Var);
        }
        z2Var.f3044a = b4;
        return i5;
    }

    static int j(int i4, byte[] bArr, int i5, z2 z2Var) {
        byte b4 = bArr[i5];
        int i6 = i5 + 1;
        int i7 = i4 & 127;
        if (b4 >= 0) {
            z2Var.f3044a = i7 | (b4 << 7);
            return i6;
        }
        int i8 = i7 | ((b4 & Byte.MAX_VALUE) << 7);
        int i9 = i5 + 2;
        byte b5 = bArr[i6];
        if (b5 >= 0) {
            z2Var.f3044a = i8 | (b5 << 14);
            return i9;
        }
        int i10 = i8 | ((b5 & Byte.MAX_VALUE) << 14);
        int i11 = i5 + 3;
        byte b6 = bArr[i9];
        if (b6 >= 0) {
            z2Var.f3044a = i10 | (b6 << 21);
            return i11;
        }
        int i12 = i10 | ((b6 & Byte.MAX_VALUE) << 21);
        int i13 = i5 + 4;
        byte b7 = bArr[i11];
        if (b7 >= 0) {
            z2Var.f3044a = i12 | (b7 << 28);
            return i13;
        }
        int i14 = i12 | ((b7 & Byte.MAX_VALUE) << 28);
        while (true) {
            int i15 = i13 + 1;
            if (bArr[i13] >= 0) {
                z2Var.f3044a = i14;
                return i15;
            }
            i13 = i15;
        }
    }

    static int k(int i4, byte[] bArr, int i5, int i6, i4 i4Var, z2 z2Var) {
        e4 e4Var = (e4) i4Var;
        int i7 = i(bArr, i5, z2Var);
        e4Var.g(z2Var.f3044a);
        while (i7 < i6) {
            int i8 = i(bArr, i7, z2Var);
            if (i4 != z2Var.f3044a) {
                break;
            }
            i7 = i(bArr, i8, z2Var);
            e4Var.g(z2Var.f3044a);
        }
        return i7;
    }

    static int l(byte[] bArr, int i4, z2 z2Var) {
        long j4 = bArr[i4];
        int i5 = i4 + 1;
        if (j4 >= 0) {
            z2Var.f3045b = j4;
            return i5;
        }
        int i6 = i4 + 2;
        byte b4 = bArr[i5];
        long j5 = (j4 & 127) | ((b4 & Byte.MAX_VALUE) << 7);
        int i7 = 7;
        while (b4 < 0) {
            int i8 = i6 + 1;
            i7 += 7;
            j5 |= (r10 & Byte.MAX_VALUE) << i7;
            b4 = bArr[i6];
            i6 = i8;
        }
        z2Var.f3045b = j5;
        return i6;
    }

    static int m(Object obj, k5 k5Var, byte[] bArr, int i4, int i5, int i6, z2 z2Var) {
        int i7 = z2Var.f3048e + 1;
        z2Var.f3048e = i7;
        p(i7);
        int y3 = ((d5) k5Var).y(obj, bArr, i4, i5, i6, z2Var);
        z2Var.f3048e--;
        z2Var.f3046c = obj;
        return y3;
    }

    static int n(Object obj, k5 k5Var, byte[] bArr, int i4, int i5, z2 z2Var) {
        int i6 = i4 + 1;
        int i7 = bArr[i4];
        if (i7 < 0) {
            i6 = j(i7, bArr, i6, z2Var);
            i7 = z2Var.f3044a;
        }
        int i8 = i6;
        if (i7 < 0 || i7 > i5 - i8) {
            throw new m4(a1.b2.c3.d4(573));
        }
        int i9 = z2Var.f3048e + 1;
        z2Var.f3048e = i9;
        p(i9);
        int i10 = i8 + i7;
        k5Var.f(obj, bArr, i8, i10, z2Var);
        z2Var.f3048e--;
        z2Var.f3046c = obj;
        return i10;
    }

    static long o(byte[] bArr, int i4) {
        return (bArr[i4] & 255) | ((bArr[i4 + 1] & 255) << 8) | ((bArr[i4 + 2] & 255) << 16) | ((bArr[i4 + 3] & 255) << 24) | ((bArr[i4 + 4] & 255) << 32) | ((bArr[i4 + 5] & 255) << 40) | ((bArr[i4 + 6] & 255) << 48) | ((bArr[i4 + 7] & 255) << 56);
    }

    private static void p(int i4) {
        if (i4 >= f2713a) {
            throw new m4("Protocol message had too many levels of nesting.  May be malicious.  Use setRecursionLimit() to increase the recursion depth limit.");
        }
    }
}
