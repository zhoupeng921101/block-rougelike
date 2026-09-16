package h1;

import android.accounts.Account;
import android.os.IBinder;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m1 extends b2.a implements k {
    m1(IBinder iBinder) {
        super(iBinder, "com.google.android.gms.common.internal.IAccountAccessor");
    }

    @Override // h1.k
    public final Account b() {
        Parcel a4 = a(2, h());
        Account account = (Account) b2.o.a(a4, Account.CREATOR);
        a4.recycle();
        return account;
    }
}
