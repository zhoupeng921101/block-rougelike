package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class y5 {
    static /* bridge */ /* synthetic */ void a(byte b4, byte b5, byte b6, byte b7, char[] cArr, int i4) {
        if (e(b5) || (((b4 << 28) + (b5 + 112)) >> 30) != 0 || e(b6) || e(b7)) {
            throw new m4("Protocol message had invalid UTF-8.");
        }
        int i5 = ((b4 & 7) << 18) | ((b5 & 63) << 12) | ((b6 & 63) << 6) | (b7 & 63);
        cArr[i4] = (char) ((i5 >>> 10) + 55232);
        cArr[i4 + 1] = (char) ((i5 & 1023) + 56320);
    }

    static /* bridge */ /* synthetic */ void b(byte b4, byte b5, byte b6, char[] cArr, int i4) {
        if (!e(b5)) {
            if (b4 == -32) {
                if (b5 >= -96) {
                    b4 = -32;
                }
            }
            if (b4 == -19) {
                if (b5 < -96) {
                    b4 = -19;
                }
            }
            if (!e(b6)) {
                cArr[i4] = (char) (((b4 & 15) << 12) | ((b5 & 63) << 6) | (b6 & 63));
                return;
            }
        }
        throw new m4("Protocol message had invalid UTF-8.");
    }

    static /* bridge */ /* synthetic */ void c(byte b4, byte b5, char[] cArr, int i4) {
        if (b4 < -62 || e(b5)) {
            throw new m4("Protocol message had invalid UTF-8.");
        }
        cArr[i4] = (char) (((b4 & 31) << 6) | (b5 & 63));
    }

    static /* bridge */ /* synthetic */ boolean d(byte b4) {
        return b4 >= 0;
    }

    private static boolean e(byte b4) {
        return b4 > -65;
    }
}
