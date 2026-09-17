package com.google.android.gms.games;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;
import p1.a0;
import p1.m;
import p1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f implements Parcelable.Creator {
    public PlayerEntity a(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = null;
        String str2 = null;
        Uri uri = null;
        Uri uri2 = null;
        String str3 = null;
        String str4 = null;
        String str5 = null;
        r1.a aVar = null;
        m mVar = null;
        String str6 = null;
        String str7 = null;
        Uri uri3 = null;
        String str8 = null;
        Uri uri4 = null;
        String str9 = null;
        a0 a0Var = null;
        q qVar = null;
        String str10 = null;
        int i4 = 0;
        boolean z3 = false;
        boolean z4 = false;
        boolean z5 = false;
        long j4 = -1;
        long j5 = 0;
        long j6 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    str = i1.b.e(parcel, o3);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    str2 = i1.b.e(parcel, o3);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    uri = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 4:
                    uri2 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 5:
                    j5 = i1.b.s(parcel, o3);
                    break;
                case 6:
                    i4 = i1.b.q(parcel, o3);
                    break;
                case 7:
                    j6 = i1.b.s(parcel, o3);
                    break;
                case 8:
                    str3 = i1.b.e(parcel, o3);
                    break;
                case 9:
                    str4 = i1.b.e(parcel, o3);
                    break;
                case 10:
                case 11:
                case 12:
                case 13:
                case 17:
                case 26:
                case 27:
                case 28:
                case 30:
                case 31:
                case 32:
                case 34:
                default:
                    i1.b.v(parcel, o3);
                    break;
                case 14:
                    str5 = i1.b.e(parcel, o3);
                    break;
                case 15:
                    aVar = (r1.a) i1.b.d(parcel, o3, r1.a.CREATOR);
                    break;
                case 16:
                    mVar = (m) i1.b.d(parcel, o3, m.CREATOR);
                    break;
                case 18:
                    z3 = i1.b.l(parcel, o3);
                    break;
                case 19:
                    z4 = i1.b.l(parcel, o3);
                    break;
                case 20:
                    str6 = i1.b.e(parcel, o3);
                    break;
                case 21:
                    str7 = i1.b.e(parcel, o3);
                    break;
                case 22:
                    uri3 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 23:
                    str8 = i1.b.e(parcel, o3);
                    break;
                case 24:
                    uri4 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 25:
                    str9 = i1.b.e(parcel, o3);
                    break;
                case 29:
                    j4 = i1.b.s(parcel, o3);
                    break;
                case 33:
                    a0Var = (a0) i1.b.d(parcel, o3, a0.CREATOR);
                    break;
                case 35:
                    qVar = (q) i1.b.d(parcel, o3, q.CREATOR);
                    break;
                case 36:
                    z5 = i1.b.l(parcel, o3);
                    break;
                case 37:
                    str10 = i1.b.e(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new PlayerEntity(str, str2, uri, uri2, j5, i4, j6, str3, str4, str5, aVar, mVar, z3, z4, str6, str7, uri3, str8, uri4, str9, j4, a0Var, qVar, z5, str10);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new PlayerEntity[i4];
    }
}
