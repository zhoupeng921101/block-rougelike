package v1;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import com.google.android.gms.games.GameEntity;
import com.google.android.gms.games.PlayerEntity;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        GameEntity gameEntity = null;
        PlayerEntity playerEntity = null;
        String str = null;
        Uri uri = null;
        String str2 = null;
        String str3 = null;
        String str4 = null;
        String str5 = null;
        String str6 = null;
        long j4 = 0;
        long j5 = 0;
        long j6 = 0;
        boolean z3 = false;
        float f4 = 0.0f;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    gameEntity = (GameEntity) i1.b.d(parcel, o3, GameEntity.CREATOR);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    playerEntity = (PlayerEntity) i1.b.d(parcel, o3, PlayerEntity.CREATOR);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    str = i1.b.e(parcel, o3);
                    break;
                case 4:
                default:
                    i1.b.v(parcel, o3);
                    break;
                case 5:
                    uri = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 6:
                    str2 = i1.b.e(parcel, o3);
                    break;
                case 7:
                    str3 = i1.b.e(parcel, o3);
                    break;
                case 8:
                    str4 = i1.b.e(parcel, o3);
                    break;
                case 9:
                    j4 = i1.b.s(parcel, o3);
                    break;
                case 10:
                    j5 = i1.b.s(parcel, o3);
                    break;
                case 11:
                    f4 = i1.b.n(parcel, o3);
                    break;
                case 12:
                    str5 = i1.b.e(parcel, o3);
                    break;
                case 13:
                    z3 = i1.b.l(parcel, o3);
                    break;
                case 14:
                    j6 = i1.b.s(parcel, o3);
                    break;
                case 15:
                    str6 = i1.b.e(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new i(gameEntity, playerEntity, str, uri, str2, str3, str4, j4, j5, f4, str5, z3, j6, str6);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new i[i4];
    }
}
