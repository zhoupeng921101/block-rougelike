package com.google.android.gms.games.internal.v2.appshortcuts;

import android.os.Parcel;
import android.os.Parcelable;
import android.os.PersistableBundle;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i extends i1.a {
    public static final Parcelable.Creator<i> CREATOR = new j();

    /* renamed from: e, reason: collision with root package name */
    public final String f2688e;

    /* renamed from: f, reason: collision with root package name */
    public final PersistableBundle f2689f;

    /* renamed from: g, reason: collision with root package name */
    public final Boolean f2690g;

    /* renamed from: h, reason: collision with root package name */
    public final Boolean f2691h;

    public i(String str, PersistableBundle persistableBundle, Boolean bool, Boolean bool2) {
        this.f2688e = str;
        this.f2689f = persistableBundle;
        this.f2690g = bool;
        this.f2691h = bool2;
    }

    public final String a() {
        return this.f2688e;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String str = this.f2688e;
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, str, false);
        i1.c.n(parcel, 2, this.f2689f, i4, false);
        i1.c.e(parcel, 3, this.f2690g, false);
        i1.c.e(parcel, 4, this.f2691h, false);
        i1.c.b(parcel, a4);
    }
}
