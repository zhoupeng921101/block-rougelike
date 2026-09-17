package v1;

import a1.b2.c3;
import android.os.Parcel;
import android.os.Parcelable;
import c2.e1;
import h1.q;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import q1.r;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c extends r implements b {

    /* renamed from: e, reason: collision with root package name */
    private n1.a f5047e;

    /* renamed from: f, reason: collision with root package name */
    private static final Object f5046f = new Object();
    public static final Parcelable.Creator<c> CREATOR = new k();

    public c(n1.a aVar) {
        this.f5047e = aVar;
    }

    private final boolean h0(int i4, byte[] bArr, int i5, int i6, boolean z3) {
        q.l(!isClosed(), c3.d4(661));
        synchronized (f5046f) {
            try {
                FileOutputStream fileOutputStream = new FileOutputStream(this.f5047e.h0().getFileDescriptor());
                BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
                try {
                    FileChannel channel = fileOutputStream.getChannel();
                    channel.position(i4);
                    bufferedOutputStream.write(bArr, i5, i6);
                    if (z3) {
                        channel.truncate(bArr.length);
                    }
                    bufferedOutputStream.flush();
                } catch (IOException e4) {
                    e1.d("SnapshotContentsEntity", "Failed to write snapshot data", e4);
                    return false;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return true;
    }

    @Override // v1.b
    public final byte[] F() {
        byte[] c4;
        q.l(!isClosed(), "Must provide a previously opened Snapshot");
        synchronized (f5046f) {
            try {
                FileInputStream fileInputStream = new FileInputStream(this.f5047e.h0().getFileDescriptor());
                BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
                try {
                    fileInputStream.getChannel().position(0L);
                    c4 = com.google.android.gms.common.util.h.c(bufferedInputStream, false);
                    fileInputStream.getChannel().position(0L);
                } catch (IOException e4) {
                    e1.f("SnapshotContentsEntity", "Failed to read snapshot data", e4);
                    throw e4;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return c4;
    }

    @Override // v1.b
    public final boolean R(byte[] bArr) {
        return h0(0, bArr, 0, bArr.length, true);
    }

    @Override // v1.b
    public final n1.a a() {
        return this.f5047e;
    }

    @Override // v1.b
    public final void b() {
        this.f5047e = null;
    }

    @Override // v1.b
    public final boolean isClosed() {
        return this.f5047e == null;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.n(parcel, 1, this.f5047e, i4, false);
        i1.c.b(parcel, a4);
    }
}
