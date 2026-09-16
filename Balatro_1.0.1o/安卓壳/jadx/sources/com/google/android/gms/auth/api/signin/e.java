package com.google.android.gms.auth.api.signin;

import android.accounts.Account;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import com.google.android.gms.common.api.Scope;
import java.util.ArrayList;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        ArrayList arrayList = null;
        Account account = null;
        String str = null;
        String str2 = null;
        ArrayList arrayList2 = null;
        String str3 = null;
        int i4 = 0;
        boolean z3 = false;
        boolean z4 = false;
        boolean z5 = false;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    i4 = i1.b.q(parcel, o3);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    arrayList = i1.b.i(parcel, o3, Scope.CREATOR);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    account = (Account) i1.b.d(parcel, o3, Account.CREATOR);
                    break;
                case 4:
                    z3 = i1.b.l(parcel, o3);
                    break;
                case 5:
                    z4 = i1.b.l(parcel, o3);
                    break;
                case 6:
                    z5 = i1.b.l(parcel, o3);
                    break;
                case 7:
                    str = i1.b.e(parcel, o3);
                    break;
                case 8:
                    str2 = i1.b.e(parcel, o3);
                    break;
                case 9:
                    arrayList2 = i1.b.i(parcel, o3, b1.a.CREATOR);
                    break;
                case 10:
                    str3 = i1.b.e(parcel, o3);
                    break;
                default:
                    i1.b.v(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new GoogleSignInOptions(i4, arrayList, account, z3, z4, z5, str, str2, arrayList2, str3);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new GoogleSignInOptions[i4];
    }
}
