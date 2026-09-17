package com.google.android.gms.games;

import android.net.Uri;
import android.os.Parcel;
import com.google.android.gms.common.data.DataHolder;
import p1.c0;
import p1.j;
import p1.l;
import p1.m;
import p1.n;
import p1.s;
import p1.u;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends u implements j {

    /* renamed from: h, reason: collision with root package name */
    private final r1.e f2673h;

    /* renamed from: i, reason: collision with root package name */
    private final m f2674i;

    /* renamed from: j, reason: collision with root package name */
    private final r1.d f2675j;

    /* renamed from: k, reason: collision with root package name */
    private final c0 f2676k;

    /* renamed from: l, reason: collision with root package name */
    private final s f2677l;

    public b(DataHolder dataHolder, int i4, String str) {
        super(dataHolder, i4);
        r1.e eVar = new r1.e(null);
        this.f2673h = eVar;
        this.f2675j = new r1.d(dataHolder, i4, eVar);
        this.f2676k = new c0(dataHolder, i4, eVar);
        this.f2677l = new s(dataHolder, i4, eVar);
        if (O(eVar.f4843k) || y(eVar.f4843k) == -1) {
            this.f2674i = null;
            return;
        }
        int v3 = v(eVar.f4844l);
        int v4 = v(eVar.f4847o);
        l lVar = new l(v3, y(eVar.f4845m), y(eVar.f4846n));
        this.f2674i = new m(y(eVar.f4843k), y(eVar.f4849q), lVar, v3 != v4 ? new l(v4, y(eVar.f4846n), y(eVar.f4848p)) : lVar);
    }

    @Override // p1.j
    public final long B() {
        return y(this.f2673h.f4840h);
    }

    @Override // p1.j
    public final n C() {
        c0 c0Var = this.f2676k;
        if (c0Var.z() == -1 && c0Var.a() == null && c0Var.b() == null) {
            return null;
        }
        return c0Var;
    }

    @Override // p1.j
    public final Uri D() {
        return Q(this.f2673h.E);
    }

    @Override // p1.j
    public final p1.c K() {
        s sVar = this.f2677l;
        if (sVar.a()) {
            return sVar;
        }
        return null;
    }

    @Override // p1.j
    public final long N() {
        String str = this.f2673h.f4842j;
        if (!I(str) || O(str)) {
            return -1L;
        }
        return y(str);
    }

    @Override // p1.j
    public final m U() {
        return this.f2674i;
    }

    @Override // p1.j
    public final String a() {
        return V(this.f2673h.f4834b, null);
    }

    @Override // p1.j
    public final String a0() {
        return H(this.f2673h.f4833a);
    }

    @Override // p1.j
    public final String b() {
        return H(this.f2673h.A);
    }

    @Override // p1.j
    public final String c() {
        return H(this.f2673h.B);
    }

    @Override // p1.j
    public final boolean d() {
        return o(this.f2673h.f4858z);
    }

    @Override // android.os.Parcelable
    public final int describeContents() {
        return 0;
    }

    @Override // p1.j
    public final int e() {
        return v(this.f2673h.f4841i);
    }

    public final boolean equals(Object obj) {
        return PlayerEntity.m0(this, obj);
    }

    @Override // p1.j
    public final boolean f() {
        return o(this.f2673h.f4851s);
    }

    @Override // p1.j
    public final boolean g() {
        String str = this.f2673h.M;
        return I(str) && o(str);
    }

    @Override // p1.j
    public String getBannerImageLandscapeUrl() {
        return H(this.f2673h.D);
    }

    @Override // p1.j
    public String getBannerImagePortraitUrl() {
        return H(this.f2673h.F);
    }

    @Override // p1.j
    public String getHiResImageUrl() {
        return H(this.f2673h.f4839g);
    }

    @Override // p1.j
    public String getIconImageUrl() {
        return H(this.f2673h.f4837e);
    }

    @Override // p1.j
    public final String getTitle() {
        return H(this.f2673h.f4850r);
    }

    @Override // p1.j
    public final r1.b h() {
        if (O(this.f2673h.f4852t)) {
            return null;
        }
        return this.f2675j;
    }

    public final int hashCode() {
        return PlayerEntity.l0(this);
    }

    @Override // p1.j
    public final Uri j() {
        return Q(this.f2673h.f4838f);
    }

    @Override // p1.j
    public final Uri k() {
        return Q(this.f2673h.f4836d);
    }

    @Override // p1.j
    public final long l() {
        String str = this.f2673h.G;
        if (!I(str) || O(str)) {
            return -1L;
        }
        return y(str);
    }

    @Override // p1.j
    public final String m() {
        return H(this.f2673h.f4835c);
    }

    @Override // p1.j
    public final Uri p() {
        return Q(this.f2673h.C);
    }

    public final String toString() {
        return PlayerEntity.n0(this);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        new PlayerEntity(this).writeToParcel(parcel, i4);
    }
}
