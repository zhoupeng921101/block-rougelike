package h1;

import android.accounts.Account;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m0 extends i1.a {
    public static final Parcelable.Creator<m0> CREATOR = new n0();

    /* renamed from: e, reason: collision with root package name */
    final int f3546e;

    /* renamed from: f, reason: collision with root package name */
    private final Account f3547f;

    /* renamed from: g, reason: collision with root package name */
    private final int f3548g;

    /* renamed from: h, reason: collision with root package name */
    private final GoogleSignInAccount f3549h;

    m0(int i4, Account account, int i5, GoogleSignInAccount googleSignInAccount) {
        this.f3546e = i4;
        this.f3547f = account;
        this.f3548g = i5;
        this.f3549h = googleSignInAccount;
    }

    public m0(Account account, int i4, GoogleSignInAccount googleSignInAccount) {
        this(2, account, i4, googleSignInAccount);
    }

    @Override // android.os.Parcelable
    public final void writeToParcel(Parcel parcel, int i4) {
        int i5 = this.f3546e;
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, i5);
        i1.c.n(parcel, 2, this.f3547f, i4, false);
        i1.c.i(parcel, 3, this.f3548g);
        i1.c.n(parcel, 4, this.f3549h, i4, false);
        i1.c.b(parcel, a4);
    }
}
