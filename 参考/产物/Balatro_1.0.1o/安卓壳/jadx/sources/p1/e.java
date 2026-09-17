package p1;

import a1.b2.c3;
import android.app.PendingIntent;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e extends e1.c {
    public static String a(int i4) {
        if (i4 == 26540) {
            return "PLAYER_OOB_REQUIRED";
        }
        if (i4 == 26541) {
            return "PLAYER_LEVEL_UP";
        }
        switch (i4) {
            case 26502:
                return "CLIENT_RECONNECT_REQUIRED";
            case 26503:
                return c3.d4(753);
            case 26504:
                return c3.d4(1513);
            case 26505:
                return "NETWORK_ERROR_OPERATION_DEFERRED";
            case 26506:
                return "NETWORK_ERROR_OPERATION_FAILED";
            case 26507:
                return "LICENSE_CHECK_FAILED";
            case 26508:
                return c3.d4(223);
            case 26509:
                return c3.d4(1254);
            case 26520:
                return "RESOLVE_STALE_OR_NO_DATA";
            case 26620:
                return "VIDEO_NOT_ACTIVE";
            case 26621:
                return "VIDEO_UNSUPPORTED";
            case 26622:
                return "VIDEO_PERMISSION_ERROR";
            case 26623:
                return "VIDEO_STORAGE_ERROR";
            case 26624:
                return "VIDEO_UNEXPECTED_CAPTURE_ERROR";
            case 26625:
                return c3.d4(460);
            case 26626:
                return "VIDEO_OUT_OF_DISK_SPACE";
            case 26627:
                return "VIDEO_NO_MIC";
            case 26628:
                return "VIDEO_NO_CAMERA";
            case 26629:
                return "VIDEO_SCREEN_OFF";
            case 26630:
                return "VIDEO_RELEASE_TIMEOUT";
            case 26631:
                return "VIDEO_CAPTURE_VIDEO_PERMISSION_REQUIRED";
            case 26632:
                return "CAPTURE_ALREADY_PAUSED";
            case 26650:
                return "VIDEO_MISSING_OVERLAY_PERMISSION";
            case 26652:
                return c3.d4(540);
            case 26700:
                return "CLIENT_LOADING";
            case 26701:
                return "CLIENT_EMPTY";
            case 26702:
                return "CLIENT_HIDDEN";
            case 26703:
                return "CONSENT_REQUIRED";
            case 26704:
                return "PLAYER_NOT_FOUND";
            default:
                switch (i4) {
                    case 26530:
                        return "AUTH_ERROR_HARD";
                    case 26531:
                        return c3.d4(222);
                    case 26532:
                        return c3.d4(1145);
                    case 26533:
                        return "AUTH_ERROR_API_ACCESS_DENIED";
                    case 26534:
                        return "AUTH_ERROR_ACCOUNT_NOT_USABLE";
                    case 26535:
                        return "AUTH_ERROR_ACCOUNT_UNICORN";
                    case 26536:
                        return c3.d4(1253);
                    default:
                        switch (i4) {
                            case 26550:
                                return "REQUEST_UPDATE_PARTIAL_SUCCESS";
                            case 26551:
                                return "REQUEST_UPDATE_TOTAL_FAILURE";
                            case 26552:
                                return "REQUEST_TOO_MANY_RECIPIENTS";
                            default:
                                switch (i4) {
                                    case 26560:
                                        return "ACHIEVEMENT_UNLOCK_FAILURE";
                                    case 26561:
                                        return "ACHIEVEMENT_UNKNOWN";
                                    case 26562:
                                        return "ACHIEVEMENT_NOT_INCREMENTAL";
                                    case 26563:
                                        return c3.d4(539);
                                    default:
                                        switch (i4) {
                                            case 26570:
                                                return "SNAPSHOT_NOT_FOUND";
                                            case 26571:
                                                return c3.d4(1395);
                                            case 26572:
                                                return "SNAPSHOT_CONTENTS_UNAVAILABLE";
                                            case 26573:
                                                return "SNAPSHOT_COMMIT_FAILED";
                                            case 26574:
                                                return c3.d4(404);
                                            case 26575:
                                                return "SNAPSHOT_FOLDER_UNAVAILABLE";
                                            case 26576:
                                                return "SNAPSHOT_CONFLICT_MISSING";
                                            default:
                                                switch (i4) {
                                                    case 26580:
                                                        return "MULTIPLAYER_ERROR_CREATION_NOT_ALLOWED";
                                                    case 26581:
                                                        return "MULTIPLAYER_ERROR_NOT_TRUSTED_TESTER";
                                                    case 26582:
                                                        return "MULTIPLAYER_ERROR_INVALID_MULTIPLAYER_TYPE";
                                                    case 26583:
                                                        return "MULTIPLAYER_DISABLED";
                                                    case 26584:
                                                        return "MULTIPLAYER_ERROR_INVALID_OPERATION";
                                                    default:
                                                        switch (i4) {
                                                            case 26590:
                                                                return "MATCH_ERROR_INVALID_PARTICIPANT_STATE";
                                                            case 26591:
                                                                return c3.d4(352);
                                                            case 26592:
                                                                return "MATCH_ERROR_INVALID_MATCH_STATE";
                                                            case 26593:
                                                                return c3.d4(94);
                                                            case 26594:
                                                                return "MATCH_ERROR_INVALID_MATCH_RESULTS";
                                                            case 26595:
                                                                return "MATCH_ERROR_ALREADY_REMATCHED";
                                                            case 26596:
                                                                return c3.d4(1202);
                                                            case 26597:
                                                                return "MATCH_ERROR_LOCALLY_MODIFIED";
                                                            default:
                                                                switch (i4) {
                                                                    case 26600:
                                                                        return "REAL_TIME_CONNECTION_FAILED";
                                                                    case 26601:
                                                                        return c3.d4(1052);
                                                                    case 26602:
                                                                        return "INVALID_REAL_TIME_ROOM_ID";
                                                                    case 26603:
                                                                        return "PARTICIPANT_NOT_CONNECTED";
                                                                    case 26604:
                                                                        return "REAL_TIME_ROOM_NOT_JOINED";
                                                                    case 26605:
                                                                        return c3.d4(93);
                                                                    case 26606:
                                                                        return "REAL_TIME_SERVICE_NOT_CONNECTED";
                                                                    case 26607:
                                                                        return "OPERATION_IN_FLIGHT";
                                                                    default:
                                                                        switch (i4) {
                                                                            case 26610:
                                                                                return c3.d4(708);
                                                                            case 26611:
                                                                                return "MILESTONE_CLAIM_FAILED";
                                                                            case 26612:
                                                                                return "QUEST_NO_LONGER_AVAILABLE";
                                                                            case 26613:
                                                                                return c3.d4(136);
                                                                            default:
                                                                                return e1.c.a(i4);
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

    public static Status b(int i4) {
        return new Status(4, a(4));
    }

    public static Status c(int i4, PendingIntent pendingIntent) {
        return new Status(i4, a(i4), pendingIntent);
    }
}
