package h1;

import android.accounts.Account;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import com.google.android.gms.common.api.Scope;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f1 implements Parcelable.Creator {
    static void a(g gVar, Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.i(parcel, 1, gVar.f3494e);
        i1.c.i(parcel, 2, gVar.f3495f);
        i1.c.i(parcel, 3, gVar.f3496g);
        i1.c.o(parcel, 4, gVar.f3497h, false);
        i1.c.h(parcel, 5, gVar.f3498i, false);
        i1.c.r(parcel, 6, gVar.f3499j, i4, false);
        i1.c.f(parcel, 7, gVar.f3500k, false);
        i1.c.n(parcel, 8, gVar.f3501l, i4, false);
        i1.c.r(parcel, 10, gVar.f3502m, i4, false);
        i1.c.r(parcel, 11, gVar.f3503n, i4, false);
        i1.c.c(parcel, 12, gVar.f3504o);
        i1.c.i(parcel, 13, gVar.f3505p);
        i1.c.c(parcel, 14, gVar.f3506q);
        i1.c.o(parcel, 15, gVar.h0(), false);
        i1.c.b(parcel, a4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        Scope[] scopeArr = g.f3492s;
        Bundle bundle = new Bundle();
        d1.c[] cVarArr = g.f3493t;
        d1.c[] cVarArr2 = cVarArr;
        String str = null;
        IBinder iBinder = null;
        Account account = null;
        String str2 = null;
        int i4 = 0;
        int i5 = 0;
        int i6 = 0;
        boolean z3 = false;
        int i7 = 0;
        boolean z4 = false;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    i4 = i1.b.q(parcel, o3);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    i5 = i1.b.q(parcel, o3);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    i6 = i1.b.q(parcel, o3);
                    break;
                case 4:
                    str = i1.b.e(parcel, o3);
                    break;
                case 5:
                    iBinder = i1.b.p(parcel, o3);
                    break;
                case 6:
                    scopeArr = (Scope[]) i1.b.h(parcel, o3, Scope.CREATOR);
                    break;
                case 7:
                    bundle = i1.b.b(parcel, o3);
                    break;
                case 8:
                    account = (Account) i1.b.d(parcel, o3, Account.CREATOR);
                    break;
                case 9:
                default:
                    i1.b.v(parcel, o3);
                    break;
                case 10:
                    cVarArr = (d1.c[]) i1.b.h(parcel, o3, d1.c.CREATOR);
                    break;
                case 11:
                    cVarArr2 = (d1.c[]) i1.b.h(parcel, o3, d1.c.CREATOR);
                    break;
                case 12:
                    z3 = i1.b.l(parcel, o3);
                    break;
                case 13:
                    i7 = i1.b.q(parcel, o3);
                    break;
                case 14:
                    z4 = i1.b.l(parcel, o3);
                    break;
                case 15:
                    str2 = i1.b.e(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new g(i4, i5, i6, str, iBinder, scopeArr, bundle, account, cVarArr, cVarArr2, z3, i7, z4, str2);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new g[i4];
    }
}
