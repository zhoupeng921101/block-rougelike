package com.google.android.gms.common.api;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.internal.ReflectedParcelable;
import h1.q;
import i1.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class Scope extends i1.a implements ReflectedParcelable {
    public static final Parcelable.Creator<Scope> CREATOR = new a();

    /* renamed from: e, reason: collision with root package name */
    final int f2556e;

    /* renamed from: f, reason: collision with root package name */
    private final String f2557f;

    Scope(int i4, String str) {
        q.g(str, "scopeUri must not be null or empty");
        this.f2556e = i4;
        this.f2557f = str;
    }

    public Scope(String str) {
        this(1, str);
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Scope) {
            return this.f2557f.equals(((Scope) obj).f2557f);
        }
        return false;
    }

    public String h0() {
        return this.f2557f;
    }

    public int hashCode() {
        return this.f2557f.hashCode();
    }

    public String toString() {
        return this.f2557f;
    }

    @Override // android.os.Parcelable
    public void writeToParcel(Parcel parcel, int i4) {
        int i5 = this.f2556e;
        int a4 = c.a(parcel);
        c.i(parcel, 1, i5);
        c.o(parcel, 2, h0(), false);
        c.b(parcel, a4);
    }
}
