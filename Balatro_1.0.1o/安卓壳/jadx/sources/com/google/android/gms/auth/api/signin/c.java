package com.google.android.gms.auth.api.signin;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import com.google.android.gms.common.api.Scope;
import java.util.ArrayList;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = null;
        String str2 = null;
        String str3 = null;
        String str4 = null;
        Uri uri = null;
        String str5 = null;
        String str6 = null;
        ArrayList arrayList = null;
        String str7 = null;
        String str8 = null;
        long j4 = 0;
        int i4 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    i4 = i1.b.q(parcel, o3);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    str = i1.b.e(parcel, o3);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    str2 = i1.b.e(parcel, o3);
                    break;
                case 4:
                    str3 = i1.b.e(parcel, o3);
                    break;
                case 5:
                    str4 = i1.b.e(parcel, o3);
                    break;
                case 6:
                    uri = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 7:
                    str5 = i1.b.e(parcel, o3);
                    break;
                case 8:
                    j4 = i1.b.s(parcel, o3);
                    break;
                case 9:
                    str6 = i1.b.e(parcel, o3);
                    break;
                case 10:
                    arrayList = i1.b.i(parcel, o3, Scope.CREATOR);
                    break;
                case 11:
                    str7 = i1.b.e(parcel, o3);
                    break;
                case 12:
                    str8 = i1.b.e(parcel, o3);
                    break;
                default:
                    i1.b.v(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new GoogleSignInAccount(i4, str, str2, str3, str4, uri, str5, j4, str6, arrayList, str7, str8);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new GoogleSignInAccount[i4];
    }
}
