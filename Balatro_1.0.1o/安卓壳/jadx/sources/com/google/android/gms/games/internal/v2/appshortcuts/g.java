package com.google.android.gms.games.internal.v2.appshortcuts;

import android.os.Parcel;
import android.os.Parcelable;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g extends i1.a {
    public static final Parcelable.Creator<g> CREATOR = new h();

    /* renamed from: e, reason: collision with root package name */
    public final List f2684e;

    /* renamed from: f, reason: collision with root package name */
    public final List f2685f;

    /* renamed from: g, reason: collision with root package name */
    public final List f2686g;

    /* renamed from: h, reason: collision with root package name */
    public final List f2687h;

    public g(List list, List list2, List list3, List list4) {
        this.f2684e = list;
        this.f2685f = list2;
        this.f2686g = list3;
        this.f2687h = list4;
    }

    public final List h0() {
        return this.f2684e;
    }

    public final List i0() {
        return this.f2685f;
    }

    public final List j0() {
        return this.f2686g;
    }

    public final List k0() {
        return this.f2687h;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        List list = this.f2684e;
        int a4 = i1.c.a(parcel);
        i1.c.q(parcel, 1, list, false);
        i1.c.s(parcel, 2, this.f2685f, false);
        i1.c.q(parcel, 3, this.f2686g, false);
        i1.c.q(parcel, 4, this.f2687h, false);
        i1.c.b(parcel, a4);
    }
}
