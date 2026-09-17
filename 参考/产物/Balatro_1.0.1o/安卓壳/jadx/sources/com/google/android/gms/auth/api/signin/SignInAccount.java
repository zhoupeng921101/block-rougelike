package com.google.android.gms.auth.api.signin;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.internal.ReflectedParcelable;
import h1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class SignInAccount extends i1.a implements ReflectedParcelable {
    public static final Parcelable.Creator<SignInAccount> CREATOR = new g();

    /* renamed from: e, reason: collision with root package name */
    public final String f2543e;

    /* renamed from: f, reason: collision with root package name */
    public final GoogleSignInAccount f2544f;

    /* renamed from: g, reason: collision with root package name */
    public final String f2545g;

    public SignInAccount(String str, GoogleSignInAccount googleSignInAccount, String str2) {
        this.f2544f = googleSignInAccount;
        this.f2543e = q.g(str, "8.3 and 8.4 SDKs require non-null email");
        this.f2545g = q.g(str2, "8.3 and 8.4 SDKs require non-null userId");
    }

    public final GoogleSignInAccount h0() {
        return this.f2544f;
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String str = this.f2543e;
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 4, str, false);
        i1.c.n(parcel, 7, this.f2544f, i4, false);
        i1.c.o(parcel, 8, this.f2545g, false);
        i1.c.b(parcel, a4);
    }
}
