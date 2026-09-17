package androidx.fragment.app;

import android.util.Log;
import java.io.Writer;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class k0 extends Writer {

    /* renamed from: e, reason: collision with root package name */
    private final String f1517e;

    /* renamed from: f, reason: collision with root package name */
    private StringBuilder f1518f = new StringBuilder(128);

    k0(String str) {
        this.f1517e = str;
    }

    private void a() {
        if (this.f1518f.length() > 0) {
            Log.d(this.f1517e, this.f1518f.toString());
            StringBuilder sb = this.f1518f;
            sb.delete(0, sb.length());
        }
    }

    @Override // java.io.Writer, java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        a();
    }

    @Override // java.io.Writer, java.io.Flushable
    public void flush() {
        a();
    }

    @Override // java.io.Writer
    public void write(char[] cArr, int i4, int i5) {
        for (int i6 = 0; i6 < i5; i6++) {
            char c4 = cArr[i4 + i6];
            if (c4 == '\n') {
                a();
            } else {
                this.f1518f.append(c4);
            }
        }
    }
}
