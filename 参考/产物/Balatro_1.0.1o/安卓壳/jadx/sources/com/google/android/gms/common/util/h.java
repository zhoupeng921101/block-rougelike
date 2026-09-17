package com.google.android.gms.common.util;

import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h {
    public static void a(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException unused) {
            }
        }
    }

    public static long b(InputStream inputStream, OutputStream outputStream, boolean z3, int i4) {
        byte[] bArr = new byte[i4];
        long j4 = 0;
        while (true) {
            try {
                int read = inputStream.read(bArr, 0, i4);
                if (read == -1) {
                    break;
                }
                j4 += read;
                outputStream.write(bArr, 0, read);
            } catch (Throwable th) {
                if (z3) {
                    a(inputStream);
                    a(outputStream);
                }
                throw th;
            }
        }
        if (z3) {
            a(inputStream);
            a(outputStream);
        }
        return j4;
    }

    public static byte[] c(InputStream inputStream, boolean z3) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        b(inputStream, byteArrayOutputStream, z3, 1024);
        return byteArrayOutputStream.toByteArray();
    }
}
