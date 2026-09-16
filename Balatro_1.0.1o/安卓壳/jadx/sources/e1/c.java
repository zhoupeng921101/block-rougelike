package e1;

import a1.b2.c3;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {
    public static String a(int i4) {
        switch (i4) {
            case -1:
                return "SUCCESS_CACHE";
            case 0:
                return "SUCCESS";
            case BuildConfig.VERSION_CODE /* 1 */:
            case 9:
            case 11:
            case 12:
            default:
                StringBuilder sb = new StringBuilder(String.valueOf(i4).length() + 21);
                sb.append("unknown status code: ");
                sb.append(i4);
                return sb.toString();
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                return "SERVICE_VERSION_UPDATE_REQUIRED";
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                return c3.d4(1039);
            case 4:
                return c3.d4(1375);
            case 5:
                return c3.d4(1172);
            case 6:
                return "RESOLUTION_REQUIRED";
            case 7:
                return "NETWORK_ERROR";
            case 8:
                return "INTERNAL_ERROR";
            case 10:
                return "DEVELOPER_ERROR";
            case 13:
                return "ERROR";
            case 14:
                return "INTERRUPTED";
            case 15:
                return c3.d4(934);
            case 16:
                return "CANCELED";
            case 17:
                return "API_NOT_CONNECTED";
            case 18:
                return "DEAD_CLIENT";
            case 19:
                return c3.d4(155);
            case 20:
                return "CONNECTION_SUSPENDED_DURING_CALL";
            case 21:
                return "RECONNECTION_TIMED_OUT_DURING_UPDATE";
            case 22:
                return "RECONNECTION_TIMED_OUT";
        }
    }
}
