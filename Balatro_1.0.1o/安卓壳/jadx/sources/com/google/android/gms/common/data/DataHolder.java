package com.google.android.gms.common.data;

import android.database.CursorIndexOutOfBoundsException;
import android.database.CursorWindow;
import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;
import h1.q;
import java.io.Closeable;
import java.util.ArrayList;
import java.util.HashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class DataHolder extends i1.a implements Closeable {
    public static final Parcelable.Creator<DataHolder> CREATOR = new c();

    /* renamed from: o, reason: collision with root package name */
    private static final a f2592o = new b(new String[0], null);

    /* renamed from: e, reason: collision with root package name */
    final int f2593e;

    /* renamed from: f, reason: collision with root package name */
    private final String[] f2594f;

    /* renamed from: g, reason: collision with root package name */
    Bundle f2595g;

    /* renamed from: h, reason: collision with root package name */
    private final CursorWindow[] f2596h;

    /* renamed from: i, reason: collision with root package name */
    private final int f2597i;

    /* renamed from: j, reason: collision with root package name */
    private final Bundle f2598j;

    /* renamed from: k, reason: collision with root package name */
    int[] f2599k;

    /* renamed from: l, reason: collision with root package name */
    int f2600l;

    /* renamed from: m, reason: collision with root package name */
    boolean f2601m = false;

    /* renamed from: n, reason: collision with root package name */
    private boolean f2602n = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private final String[] f2603a;

        /* renamed from: b, reason: collision with root package name */
        private final ArrayList f2604b = new ArrayList();

        /* renamed from: c, reason: collision with root package name */
        private final HashMap f2605c = new HashMap();
    }

    DataHolder(int i4, String[] strArr, CursorWindow[] cursorWindowArr, int i5, Bundle bundle) {
        this.f2593e = i4;
        this.f2594f = strArr;
        this.f2596h = cursorWindowArr;
        this.f2597i = i5;
        this.f2598j = bundle;
    }

    private final void s0(String str, int i4) {
        Bundle bundle = this.f2595g;
        if (bundle == null || !bundle.containsKey(str)) {
            throw new IllegalArgumentException("No such column: ".concat(String.valueOf(str)));
        }
        if (isClosed()) {
            throw new IllegalArgumentException("Buffer is closed.");
        }
        if (i4 < 0 || i4 >= this.f2600l) {
            throw new CursorIndexOutOfBoundsException(i4, this.f2600l);
        }
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        synchronized (this) {
            try {
                if (!this.f2601m) {
                    this.f2601m = true;
                    int i4 = 0;
                    while (true) {
                        CursorWindow[] cursorWindowArr = this.f2596h;
                        if (i4 >= cursorWindowArr.length) {
                            break;
                        }
                        cursorWindowArr[i4].close();
                        i4++;
                    }
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    protected final void finalize() {
        try {
            if (this.f2602n && this.f2596h.length > 0 && !isClosed()) {
                close();
                Log.e("DataBuffer", "Internal data leak within a DataBuffer object detected!  Be sure to explicitly call release() on all DataBuffer extending objects when you are done with them. (internal object: " + toString() + ")");
            }
        } finally {
            super.finalize();
        }
    }

    public int getCount() {
        return this.f2600l;
    }

    public boolean h0(String str, int i4, int i5) {
        s0(str, i4);
        return this.f2596h[i5].getLong(i4, this.f2595g.getInt(str)) == 1;
    }

    public int i0(String str, int i4, int i5) {
        s0(str, i4);
        return this.f2596h[i5].getInt(i4, this.f2595g.getInt(str));
    }

    public boolean isClosed() {
        boolean z3;
        synchronized (this) {
            z3 = this.f2601m;
        }
        return z3;
    }

    public long j0(String str, int i4, int i5) {
        s0(str, i4);
        return this.f2596h[i5].getLong(i4, this.f2595g.getInt(str));
    }

    public Bundle k0() {
        return this.f2598j;
    }

    public int l0() {
        return this.f2597i;
    }

    public String m0(String str, int i4, int i5) {
        s0(str, i4);
        return this.f2596h[i5].getString(i4, this.f2595g.getInt(str));
    }

    public int n0(int i4) {
        int length;
        int i5 = 0;
        q.k(i4 >= 0 && i4 < this.f2600l);
        while (true) {
            int[] iArr = this.f2599k;
            length = iArr.length;
            if (i5 >= length) {
                break;
            }
            if (i4 < iArr[i5]) {
                i5--;
                break;
            }
            i5++;
        }
        return i5 == length ? i5 - 1 : i5;
    }

    public boolean o0(String str) {
        return this.f2595g.containsKey(str);
    }

    public boolean p0(String str, int i4, int i5) {
        s0(str, i4);
        return this.f2596h[i5].isNull(i4, this.f2595g.getInt(str));
    }

    public final float q0(String str, int i4, int i5) {
        s0(str, i4);
        return this.f2596h[i5].getFloat(i4, this.f2595g.getInt(str));
    }

    public final void r0() {
        this.f2595g = new Bundle();
        int i4 = 0;
        int i5 = 0;
        while (true) {
            String[] strArr = this.f2594f;
            if (i5 >= strArr.length) {
                break;
            }
            this.f2595g.putInt(strArr[i5], i5);
            i5++;
        }
        this.f2599k = new int[this.f2596h.length];
        int i6 = 0;
        while (true) {
            CursorWindow[] cursorWindowArr = this.f2596h;
            if (i4 >= cursorWindowArr.length) {
                this.f2600l = i6;
                return;
            }
            this.f2599k[i4] = i6;
            i6 += this.f2596h[i4].getNumRows() - (i6 - cursorWindowArr[i4].getStartPosition());
            i4++;
        }
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String[] strArr = this.f2594f;
        int a4 = i1.c.a(parcel);
        i1.c.p(parcel, 1, strArr, false);
        i1.c.r(parcel, 2, this.f2596h, i4, false);
        i1.c.i(parcel, 3, l0());
        i1.c.f(parcel, 4, k0(), false);
        i1.c.i(parcel, 1000, this.f2593e);
        i1.c.b(parcel, a4);
        if ((i4 & 1) != 0) {
            close();
        }
    }
}
