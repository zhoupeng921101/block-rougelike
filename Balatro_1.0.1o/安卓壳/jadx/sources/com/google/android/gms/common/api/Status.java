package com.google.android.gms.common.api;

import a1.b2.c3;
import android.app.PendingIntent;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.internal.ReflectedParcelable;
import e1.c;
import e1.k;
import h1.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class Status extends i1.a implements k, ReflectedParcelable {

    /* renamed from: e, reason: collision with root package name */
    private final int f2566e;

    /* renamed from: f, reason: collision with root package name */
    private final String f2567f;

    /* renamed from: g, reason: collision with root package name */
    private final PendingIntent f2568g;

    /* renamed from: h, reason: collision with root package name */
    private final d1.a f2569h;

    /* renamed from: i, reason: collision with root package name */
    public static final Status f2558i = new Status(-1);

    /* renamed from: j, reason: collision with root package name */
    public static final Status f2559j = new Status(0);

    /* renamed from: k, reason: collision with root package name */
    public static final Status f2560k = new Status(14);

    /* renamed from: l, reason: collision with root package name */
    public static final Status f2561l = new Status(8);

    /* renamed from: m, reason: collision with root package name */
    public static final Status f2562m = new Status(15);

    /* renamed from: n, reason: collision with root package name */
    public static final Status f2563n = new Status(16);

    /* renamed from: o, reason: collision with root package name */
    public static final Status f2564o = new Status(17);

    /* renamed from: p, reason: collision with root package name */
    public static final Status f2565p = new Status(18);
    public static final Parcelable.Creator<Status> CREATOR = new b();

    public Status(int i4) {
        this(i4, (String) null);
    }

    public Status(int i4, String str) {
        this(i4, str, (PendingIntent) null);
    }

    public Status(int i4, String str, PendingIntent pendingIntent) {
        this(i4, str, pendingIntent, null);
    }

    Status(int i4, String str, PendingIntent pendingIntent, d1.a aVar) {
        this.f2566e = i4;
        this.f2567f = str;
        this.f2568g = pendingIntent;
        this.f2569h = aVar;
    }

    public Status(d1.a aVar, String str) {
        this(aVar, str, 17);
    }

    public Status(d1.a aVar, String str, int i4) {
        this(i4, str, aVar.k0(), aVar);
    }

    @Override // e1.k
    public Status H() {
        return this;
    }

    public final String a() {
        String str = this.f2567f;
        return str != null ? str : c.a(this.f2566e);
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof Status)) {
            return false;
        }
        Status status = (Status) obj;
        return this.f2566e == status.f2566e && o.a(this.f2567f, status.f2567f) && o.a(this.f2568g, status.f2568g) && o.a(this.f2569h, status.f2569h);
    }

    public d1.a h0() {
        return this.f2569h;
    }

    public int hashCode() {
        return o.b(Integer.valueOf(this.f2566e), this.f2567f, this.f2568g, this.f2569h);
    }

    public PendingIntent i0() {
        return this.f2568g;
    }

    public int j0() {
        return this.f2566e;
    }

    public String k0() {
        return this.f2567f;
    }

    public boolean l0() {
        return this.f2568g != null;
    }

    public boolean m0() {
        return this.f2566e <= 0;
    }

    public String toString() {
        o.a c4 = o.c(this);
        c4.a("statusCode", a());
        c4.a(c3.d4(689), this.f2568g);
        return c4.toString();
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, j0());
        i1.c.o(parcel, 2, k0(), false);
        i1.c.n(parcel, 3, this.f2568g, i4, false);
        i1.c.n(parcel, 4, h0(), i4, false);
        i1.c.b(parcel, a4);
    }
}
