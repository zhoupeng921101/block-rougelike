package com.google.android.gms.games;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class d implements Parcelable.Creator {
    public GameEntity a(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        boolean z3 = false;
        boolean z4 = false;
        int i4 = 0;
        int i5 = 0;
        int i6 = 0;
        boolean z5 = false;
        boolean z6 = false;
        boolean z7 = false;
        boolean z8 = false;
        boolean z9 = false;
        boolean z10 = false;
        boolean z11 = false;
        String str = null;
        String str2 = null;
        String str3 = null;
        String str4 = null;
        String str5 = null;
        String str6 = null;
        Uri uri = null;
        Uri uri2 = null;
        Uri uri3 = null;
        String str7 = null;
        String str8 = null;
        String str9 = null;
        String str10 = null;
        String str11 = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 != 28) {
                switch (k4) {
                    case BuildConfig.VERSION_CODE /* 1 */:
                        str = i1.b.e(parcel, o3);
                        break;
                    case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                        str2 = i1.b.e(parcel, o3);
                        break;
                    case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                        str3 = i1.b.e(parcel, o3);
                        break;
                    case 4:
                        str4 = i1.b.e(parcel, o3);
                        break;
                    case 5:
                        str5 = i1.b.e(parcel, o3);
                        break;
                    case 6:
                        str6 = i1.b.e(parcel, o3);
                        break;
                    case 7:
                        uri = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                        break;
                    case 8:
                        uri2 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                        break;
                    case 9:
                        uri3 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                        break;
                    case 10:
                        z3 = i1.b.l(parcel, o3);
                        break;
                    case 11:
                        z4 = i1.b.l(parcel, o3);
                        break;
                    case 12:
                        str7 = i1.b.e(parcel, o3);
                        break;
                    case 13:
                        i4 = i1.b.q(parcel, o3);
                        break;
                    case 14:
                        i5 = i1.b.q(parcel, o3);
                        break;
                    case 15:
                        i6 = i1.b.q(parcel, o3);
                        break;
                    case 16:
                        z5 = i1.b.l(parcel, o3);
                        break;
                    case 17:
                        z6 = i1.b.l(parcel, o3);
                        break;
                    case 18:
                        str8 = i1.b.e(parcel, o3);
                        break;
                    case 19:
                        str9 = i1.b.e(parcel, o3);
                        break;
                    case 20:
                        str10 = i1.b.e(parcel, o3);
                        break;
                    case 21:
                        z7 = i1.b.l(parcel, o3);
                        break;
                    case 22:
                        z8 = i1.b.l(parcel, o3);
                        break;
                    case 23:
                        z9 = i1.b.l(parcel, o3);
                        break;
                    case 24:
                        str11 = i1.b.e(parcel, o3);
                        break;
                    case 25:
                        z10 = i1.b.l(parcel, o3);
                        break;
                    default:
                        i1.b.v(parcel, o3);
                        break;
                }
            } else {
                z11 = i1.b.l(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new GameEntity(str, str2, str3, str4, str5, str6, uri, uri2, uri3, z3, z4, str7, i4, i5, i6, z5, z6, str8, str9, str10, z7, z8, z9, str11, z10, z11);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new GameEntity[i4];
    }
}
