package r1;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c implements Parcelable.Creator {
    static void a(a aVar, Parcel parcel, int i4) {
        int a4 = i1.c.a(parcel);
        i1.c.o(parcel, 1, aVar.a(), false);
        i1.c.o(parcel, 2, aVar.b(), false);
        i1.c.l(parcel, 3, aVar.c());
        i1.c.n(parcel, 4, aVar.d(), i4, false);
        i1.c.n(parcel, 5, aVar.e(), i4, false);
        i1.c.n(parcel, 6, aVar.f(), i4, false);
        i1.c.b(parcel, a4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = null;
        String str2 = null;
        Uri uri = null;
        Uri uri2 = null;
        Uri uri3 = null;
        long j4 = 0;
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
                    j4 = i1.b.s(parcel, o3);
                    break;
                case 4:
                    uri = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 5:
                    uri2 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                case 6:
                    uri3 = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
                    break;
                default:
                    i1.b.v(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new a(str, str2, j4, uri, uri2, uri3);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new a[i4];
    }
}
