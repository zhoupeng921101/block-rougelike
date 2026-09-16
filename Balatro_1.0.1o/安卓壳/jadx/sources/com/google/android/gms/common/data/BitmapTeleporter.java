package com.google.android.gms.common.data;

import a1.b2.c3;
import android.graphics.Bitmap;
import android.os.Parcel;
import android.os.ParcelFileDescriptor;
import android.os.Parcelable;
import android.util.Log;
import com.google.android.gms.common.internal.ReflectedParcelable;
import h1.q;
import java.io.BufferedOutputStream;
import java.io.Closeable;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class BitmapTeleporter extends i1.a implements ReflectedParcelable {
    public static final Parcelable.Creator<BitmapTeleporter> CREATOR = new a();

    /* renamed from: e, reason: collision with root package name */
    final int f2586e;

    /* renamed from: f, reason: collision with root package name */
    ParcelFileDescriptor f2587f;

    /* renamed from: g, reason: collision with root package name */
    final int f2588g;

    /* renamed from: h, reason: collision with root package name */
    private Bitmap f2589h = null;

    /* renamed from: i, reason: collision with root package name */
    private boolean f2590i = false;

    /* renamed from: j, reason: collision with root package name */
    private File f2591j;

    BitmapTeleporter(int i4, ParcelFileDescriptor parcelFileDescriptor, int i5) {
        this.f2586e = i4;
        this.f2587f = parcelFileDescriptor;
        this.f2588g = i5;
    }

    private static final void i0(Closeable closeable) {
        try {
            closeable.close();
        } catch (IOException e4) {
            Log.w("BitmapTeleporter", "Could not close stream", e4);
        }
    }

    public void h0(File file) {
        if (file == null) {
            throw new NullPointerException("Cannot set null temp directory");
        }
        this.f2591j = file;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        if (this.f2587f == null) {
            Bitmap bitmap = (Bitmap) q.i(this.f2589h);
            ByteBuffer allocate = ByteBuffer.allocate(bitmap.getRowBytes() * bitmap.getHeight());
            bitmap.copyPixelsToBuffer(allocate);
            byte[] array = allocate.array();
            File file = this.f2591j;
            if (file == null) {
                throw new IllegalStateException("setTempDir() must be called before writing this object to a parcel");
            }
            try {
                File createTempFile = File.createTempFile("teleporter", ".tmp", file);
                try {
                    FileOutputStream fileOutputStream = new FileOutputStream(createTempFile);
                    this.f2587f = ParcelFileDescriptor.open(createTempFile, 268435456);
                    createTempFile.delete();
                    DataOutputStream dataOutputStream = new DataOutputStream(new BufferedOutputStream(fileOutputStream));
                    try {
                        try {
                            dataOutputStream.writeInt(array.length);
                            dataOutputStream.writeInt(bitmap.getWidth());
                            dataOutputStream.writeInt(bitmap.getHeight());
                            dataOutputStream.writeUTF(bitmap.getConfig().toString());
                            dataOutputStream.write(array);
                        } catch (IOException e4) {
                            throw new IllegalStateException("Could not write into unlinked file", e4);
                        }
                    } finally {
                        i0(dataOutputStream);
                    }
                } catch (FileNotFoundException unused) {
                    throw new IllegalStateException(c3.d4(430));
                }
            } catch (IOException e5) {
                throw new IllegalStateException("Could not create temporary file", e5);
            }
        }
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, this.f2586e);
        i1.c.n(parcel, 2, this.f2587f, i4 | 1, false);
        i1.c.i(parcel, 3, this.f2588g);
        i1.c.b(parcel, a4);
        this.f2587f = null;
    }
}
