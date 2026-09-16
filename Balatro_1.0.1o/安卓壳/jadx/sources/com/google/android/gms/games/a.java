package com.google.android.gms.games;

import a1.b2.c3;
import android.net.Uri;
import android.os.Parcel;
import com.google.android.gms.common.data.DataHolder;
import p1.u;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends u implements p1.d {
    public a(DataHolder dataHolder, int i4) {
        super(dataHolder, i4);
    }

    @Override // p1.d
    public final String A() {
        return H("primary_category");
    }

    @Override // p1.d
    public final String J() {
        return H("developer_name");
    }

    @Override // p1.d
    public final int L() {
        return v("leaderboard_count");
    }

    @Override // p1.d
    public final boolean T() {
        return v("gamepad_support") > 0;
    }

    @Override // p1.d
    public final String Y() {
        return H("theme_color");
    }

    @Override // p1.d
    public final boolean a() {
        return o(c3.d4(118));
    }

    @Override // p1.d
    public final boolean b() {
        return o("muted");
    }

    @Override // p1.d
    public final boolean c() {
        return o("identity_sharing_confirmed");
    }

    @Override // p1.d
    public final boolean d() {
        if (!I("profileless_recall_enabled_v3") || O("profileless_recall_enabled_v3")) {
            return false;
        }
        return o("profileless_recall_enabled_v3");
    }

    @Override // p1.d
    public final Uri d0() {
        return Q("featured_image_uri");
    }

    @Override // android.os.Parcelable
    public final int describeContents() {
        return 0;
    }

    @Override // p1.d
    public final boolean e() {
        return v("installed") > 0;
    }

    @Override // p1.d
    public final boolean e0() {
        return v(c3.d4(152)) > 0;
    }

    public final boolean equals(Object obj) {
        return GameEntity.m0(this, obj);
    }

    @Override // p1.d
    public final String f() {
        return H("package_name");
    }

    @Override // p1.d
    public final boolean g() {
        return v("real_time_support") > 0;
    }

    @Override // p1.d
    public String getFeaturedImageUrl() {
        return H("featured_image_url");
    }

    @Override // p1.d
    public String getHiResImageUrl() {
        return H("game_hi_res_image_url");
    }

    @Override // p1.d
    public String getIconImageUrl() {
        return H(c3.d4(1371));
    }

    @Override // p1.d
    public final boolean h() {
        return v("turn_based_support") > 0;
    }

    public final int hashCode() {
        return GameEntity.l0(this);
    }

    @Override // p1.d
    public final String i() {
        return H("game_description");
    }

    @Override // p1.d
    public final Uri j() {
        return Q(c3.d4(431));
    }

    @Override // p1.d
    public final Uri k() {
        return Q(c3.d4(1327));
    }

    @Override // p1.d
    public final String m() {
        return H("display_name");
    }

    @Override // p1.d
    public final int r() {
        return v("achievement_total_count");
    }

    @Override // p1.d
    public final String s() {
        return H("secondary_category");
    }

    public final String toString() {
        return GameEntity.n0(this);
    }

    @Override // p1.d
    public final String u() {
        return H("external_game_id");
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        new GameEntity(this).writeToParcel(parcel, i4);
    }
}
