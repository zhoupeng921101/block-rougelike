package com.google.android.gms.auth.api.signin.internal;

import android.os.Parcel;
import android.os.Parcelable;
import b1.b;
import b1.w;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.internal.ReflectedParcelable;
import h1.q;
import i1.c;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class SignInConfiguration extends i1.a implements ReflectedParcelable {
    public static final Parcelable.Creator<SignInConfiguration> CREATOR = new w();

    /* renamed from: e, reason: collision with root package name */
    private final String f2548e;

    /* renamed from: f, reason: collision with root package name */
    private final GoogleSignInOptions f2549f;

    public SignInConfiguration(String str, GoogleSignInOptions googleSignInOptions) {
        this.f2548e = q.f(str);
        this.f2549f = googleSignInOptions;
    }

    public final boolean equals(Object obj) {
        if (!(obj instanceof SignInConfiguration)) {
            return false;
        }
        SignInConfiguration signInConfiguration = (SignInConfiguration) obj;
        if (this.f2548e.equals(signInConfiguration.f2548e)) {
            GoogleSignInOptions googleSignInOptions = this.f2549f;
            GoogleSignInOptions googleSignInOptions2 = signInConfiguration.f2549f;
            if (googleSignInOptions == null) {
                if (googleSignInOptions2 == null) {
                    return true;
                }
            } else if (googleSignInOptions.equals(googleSignInOptions2)) {
                return true;
            }
        }
        return false;
    }

    public final GoogleSignInOptions h0() {
        return this.f2549f;
    }

    public final int hashCode() {
        return new b().a(this.f2548e).a(this.f2549f).b();
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        String str = this.f2548e;
        int a4 = c.a(parcel);
        c.o(parcel, 2, str, false);
        c.n(parcel, 5, this.f2549f, i4, false);
        c.b(parcel, a4);
    }
}
