package p1;

import a1.b2.c3;
import com.google.android.gms.common.api.Status;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class x {
    public static Status a(int i4) {
        return new Status(i4, b(i4));
    }

    public static String b(int i4) {
        if (i4 == 0) {
            return "STATUS_OK";
        }
        if (i4 == 1) {
            return "STATUS_INTERNAL_ERROR";
        }
        if (i4 == 2) {
            return "STATUS_CLIENT_RECONNECT_REQUIRED";
        }
        if (i4 == 3) {
            return "STATUS_NETWORK_ERROR_STALE_DATA";
        }
        if (i4 == 4) {
            return "STATUS_NETWORK_ERROR_NO_DATA";
        }
        if (i4 == 5) {
            return "STATUS_NETWORK_ERROR_OPERATION_DEFERRED";
        }
        if (i4 == 6) {
            return "STATUS_NETWORK_ERROR_OPERATION_FAILED";
        }
        if (i4 == 7) {
            return "STATUS_LICENSE_CHECK_FAILED";
        }
        if (i4 == 14) {
            return "STATUS_INTERRUPTED";
        }
        if (i4 == 15) {
            return "STATUS_TIMEOUT";
        }
        if (i4 == 6500) {
            return c3.d4(461);
        }
        if (i4 == 6501) {
            return c3.d4(1437);
        }
        switch (i4) {
            case 7:
                return "STATUS_LICENSE_CHECK_FAILED";
            case 8:
                return "STATUS_APP_MISCONFIGURED";
            case 9:
                return c3.d4(908);
            case 500:
                return "STATUS_RESOLVE_STALE_OR_NO_DATA";
            case 1500:
                return "STATUS_PLAYER_OOB_REQUIRED";
            case 4006:
                return "STATUS_SNAPSHOT_CONFLICT_MISSING";
            case 8000:
                return "STATUS_MILESTONE_CLAIMED_PREVIOUSLY";
            case 8001:
                return c3.d4(1436);
            case 8002:
                return "STATUS_QUEST_NO_LONGER_AVAILABLE";
            case 8003:
                return "STATUS_QUEST_NOT_STARTED";
            case 9000:
                return c3.d4(907);
            case 9001:
                return "STATUS_VIDEO_UNSUPPORTED";
            case 9002:
                return c3.d4(1348);
            case 9003:
                return "STATUS_VIDEO_STORAGE_ERROR";
            case 9004:
                return "STATUS_VIDEO_UNEXPECTED_CAPTURE_ERROR";
            case 9006:
                return "STATUS_VIDEO_ALREADY_CAPTURING";
            case 9009:
                return "STATUS_VIDEO_OUT_OF_DISK_SPACE";
            case 9010:
                return "STATUS_VIDEO_NO_MIC";
            case 9011:
                return "STATUS_VIDEO_NO_CAMERA";
            case 9012:
                return c3.d4(1256);
            case 9016:
                return "STATUS_VIDEO_RELEASE_TIMEOUT";
            case 9017:
                return "STATUS_VIDEO_CAPTURE_VIDEO_PERMISSION_REQUIRED";
            case 9200:
                return "STATUS_VIDEO_MISSING_OVERLAY_PERMISSION";
            case 10000:
                return "STATUS_CLIENT_LOADING";
            case 10001:
                return "STATUS_CLIENT_EMPTY";
            case 10002:
                return "STATUS_CLIENT_HIDDEN";
            case 10003:
                return "STATUS_CONSENT_REQUIRED";
            default:
                switch (i4) {
                    case 1000:
                        return "STATUS_AUTH_ERROR_HARD";
                    case 1001:
                        return "STATUS_AUTH_ERROR_USER_RECOVERABLE";
                    case 1002:
                        return "STATUS_AUTH_ERROR_UNREGISTERED_CLIENT_ID";
                    case 1003:
                        return "STATUS_AUTH_ERROR_API_ACCESS_DENIED";
                    case 1004:
                        return c3.d4(1298);
                    case 1005:
                        return "STATUS_AUTH_ERROR_ACCOUNT_UNICORN";
                    case 1006:
                        return "STATUS_AUTH_ERROR_SERVICE_CACHE_MISTAKE";
                    default:
                        switch (i4) {
                            case 2000:
                                return "STATUS_REQUEST_UPDATE_PARTIAL_SUCCESS";
                            case 2001:
                                return "STATUS_REQUEST_UPDATE_TOTAL_FAILURE";
                            case 2002:
                                return "STATUS_REQUEST_TOO_MANY_RECIPIENTS";
                            default:
                                switch (i4) {
                                    case 3000:
                                        return "STATUS_ACHIEVEMENT_UNLOCK_FAILURE";
                                    case 3001:
                                        return "STATUS_ACHIEVEMENT_UNKNOWN";
                                    case 3002:
                                        return c3.d4(1255);
                                    case 3003:
                                        return "STATUS_ACHIEVEMENT_UNLOCKED";
                                    default:
                                        switch (i4) {
                                            case 4000:
                                                return "STATUS_SNAPSHOT_NOT_FOUND";
                                            case 4001:
                                                return "STATUS_SNAPSHOT_CREATION_FAILED";
                                            case 4002:
                                                return c3.d4(1095);
                                            case 4003:
                                                return "STATUS_SNAPSHOT_COMMIT_FAILED";
                                            case 4004:
                                                return "STATUS_SNAPSHOT_CONFLICT";
                                            default:
                                                switch (i4) {
                                                    case 6000:
                                                        return "STATUS_MULTIPLAYER_ERROR_CREATION_NOT_ALLOWED";
                                                    case 6001:
                                                        return c3.d4(710);
                                                    case 6002:
                                                        return c3.d4(1094);
                                                    case 6003:
                                                        return "STATUS_MULTIPLAYER_DISABLED";
                                                    default:
                                                        switch (i4) {
                                                            case 6503:
                                                                return "STATUS_MATCH_ERROR_OUT_OF_DATE_VERSION";
                                                            case 6504:
                                                                return "STATUS_MATCH_ERROR_INVALID_MATCH_RESULTS";
                                                            case 6505:
                                                                return "STATUS_MATCH_ERROR_ALREADY_REMATCHED";
                                                            case 6506:
                                                                return c3.d4(604);
                                                            case 6507:
                                                                return "STATUS_MATCH_ERROR_LOCALLY_MODIFIED";
                                                            default:
                                                                switch (i4) {
                                                                    case 7000:
                                                                        return "STATUS_REAL_TIME_CONNECTION_FAILED";
                                                                    case 7001:
                                                                        return "STATUS_REAL_TIME_MESSAGE_SEND_FAILED";
                                                                    case 7002:
                                                                        return "STATUS_INVALID_REAL_TIME_ROOM_ID";
                                                                    case 7003:
                                                                        return "STATUS_PARTICIPANT_NOT_CONNECTED";
                                                                    case 7004:
                                                                        return "STATUS_REAL_TIME_ROOM_NOT_JOINED";
                                                                    case 7005:
                                                                        return "STATUS_REAL_TIME_INACTIVE_ROOM";
                                                                    case 7006:
                                                                        return c3.d4(95);
                                                                    case 7007:
                                                                        return "STATUS_OPERATION_IN_FLIGHT";
                                                                    default:
                                                                        return String.format(Locale.US, "Status code (%d) not found!", Integer.valueOf(i4));
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                }
        }
    }
}
