package com.google.android.gms.internal.play_billing;

import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public enum n6 implements f4 {
    REASON_UNSPECIFIED(0),
    SERVICE_CONNECTION_NOT_READY(1),
    GET_BUY_INTENT_ERROR(2),
    f2903i(3),
    LAUNCH_BILLING_FLOW_EXCEPTION(4),
    f2909k(5),
    INVALID_REQUEST_CODE(6),
    INVALID_LISTENER(7),
    SUBSCRIPTIONS_NOT_SUPPORTED(8),
    SUBSCRIPTIONS_UPDATE_NOT_SUPPORTED(9),
    NULL_BUNDLE_IN_BROADCAST_RECEIVER(10),
    f2927q(11),
    f2930r(12),
    INVALID_FIRST_PARTY_PURCHASE_DATA(13),
    MISSING_ALTERNATIVE_BILLING_LISTENER(14),
    MISSING_ALTERNATIVE_BILLING_USER_CHOICE_DATA(15),
    INVALID_ALTERNATIVE_BILLING_USER_CHOICE_DATA(16),
    f2945w(17),
    f2948x(18),
    PRODUCT_DETAILS_NOT_SUPPORTED(19),
    f2954z(20),
    A(21),
    B(22),
    EXECUTE_ASYNC_TIMEOUT(23),
    MISSING_RESULT_FROM_EXECUTE_ASYNC(24),
    EMPTY_PURCHASE_TOKEN(25),
    API_VERSION_NOT_V9(26),
    ACKNOWLEDGE_PURCHASE_SERVICE_CALL_EXCEPTION(27),
    CONSUME_PURCHASE_SERVICE_CALL_EXCEPTION(28),
    IN_APP_MESSAGE_NOT_SUPPORTED(29),
    CROSS_APP_NOT_SUPPORTED(30),
    K(31),
    L(32),
    UNKNOWN_FEATURE(33),
    PRICE_CHANGE_CONFIRMATION_NOT_SUPPORTED(34),
    ONE_TIME_PRODUCT_NOT_SUPPORTED(35),
    BILLING_CLIENT_CONNECTING(36),
    BILLING_CLIENT_CLOSED(37),
    BILLING_SERVICE_BLOCKED(38),
    S(39),
    INTENT_SERVICE_NOT_FOUND(40),
    U(41),
    GET_SKU_DETAILS_SERVICE_CALL_EXCEPTION(42),
    NULL_BUNDLE_FROM_GET_SKU_DETAILS_SERVICE_CALL(43),
    X(44),
    NULL_DETAILS_LIST_IN_GET_SKU_DETAILS_RESPONSE(45),
    ERROR_DECODING_SKU_DETAILS(46),
    EMPTY_SKU_LIST(47),
    EMPTY_SKU_TYPE(48),
    EMPTY_PRODUCT_TYPE(49),
    ERROR_DECODING_PURCHASE_DATA(50),
    f2892e0(51),
    INVALID_PURCHASES_BUNDLE(52),
    NULL_OWNED_ITEMS_LIST(53),
    f2901h0(54),
    NULL_SKUS_LIST(55),
    f2907j0(56),
    f2910k0(57),
    GET_PURCHASE_HISTORY_SERVICE_CALL_EXCEPTION(58),
    QUERY_PRODUCT_DETAILS_WITH_DEVELOPER_SPECIFIED_ACCOUNT_NOT_SUPPORTED(59),
    f2919n0(60),
    GET_BILLING_CONFIG_SERVICE_CALL_EXCEPTION(61),
    f2925p0(62),
    f2928q0(63),
    ERROR_DECODING_BILLING_CONFIG_DATA(64),
    ALTERNATIVE_BILLING_ONLY_NOT_SUPPORTED(65),
    NULL_BUNDLE_FROM_IS_ALTERNATIVE_BILLING_ONLY_AVAILABLE_SERVICE_CALL(66),
    ERROR_DECODING_ALTERNATIVE_BILLING_ONLY_AVAILABILITY(67),
    IS_ALTERNATIVE_BILLING_ONLY_AVAILABLE_SERVICE_CALL_EXCEPTION(68),
    CREATE_ALTERNATIVE_BILLING_ONLY_TOKEN_SERVICE_CALL_EXCEPTION(69),
    NULL_BUNDLE_FROM_CREATE_ALTERNATIVE_BILLING_ONLY_TOKEN_SERVICE_CALL(70),
    ERROR_DECODING_ALTERNATIVE_BILLING_ONLY_REPORTING_DETAILS(71),
    NULL_BUNDLE_IN_ALTERNATIVE_BILLING_ONLY_INFORMATION_DIALOG_RECEIVER(72),
    SHOW_ALTERNATIVE_BILLING_ONLY_DIALOG_SERVICE_CALL_EXCEPTION(73),
    MISSING_ALTERNATIVE_BILLING_ONLY_DIALOG_RESULT_RECEIVER(74),
    C0(75),
    D0(76),
    NULL_BUNDLE_FROM_GET_BUY_INTENT_EXTRA_PARAMS_SERVICE_CALL(77),
    NULL_BUNDLE_FROM_GET_BUY_INTENT_TO_REPLACE_SKUS_SERVICE_CALL(78),
    NULL_BUNDLE_FROM_GET_BUY_INTENT_SERVICE_CALL(79),
    H0(90),
    NULL_BUNDLE_FROM_IS_EXTERNAL_PAYMENT_AVAILABLE_SERVICE_CALL(91),
    J0(102),
    CREATE_EXTERNAL_PAYMENT_REPORTING_DETAILS_SERVICE_CALL_EXCEPTION(93),
    NULL_BUNDLE_FROM_CREATE_EXTERNAL_PAYMENT_REPORTING_DETAILS_SERVICE_CALL(94),
    ERROR_DECODING_EXTERNAL_OFFER_REPORTING_DETAILS(103),
    NULL_BUNDLE_IN_EXTERNAL_PAYMENT_INFORMATION_DIALOG_RECEIVER(96),
    SHOW_EXTERNAL_PAYMENT_DIALOG_SERVICE_CALL_EXCEPTION(97),
    RUNTIME_EXCEPTION_ON_LAUNCHING_EXTERNAL_PAYMENT_DIALOG_INTENT(98),
    IS_BILLING_SUPPORTED_REMOTE_EXCEPTION(99),
    R0(100),
    S0(101),
    LICENSE_TESTER_BILLING_OVERRIDE(104),
    BILLING_OVERRIDE_SERVICE_CONNECTION_NOT_READY(105),
    BILLING_OVERRIDE_SERVICE_CALL_EXCEPTION(106),
    NULL_LISTENER_IN_DELEGATE_TO_BACKEND_CALLBACK(107),
    ERROR_DECODING_DELEGATE_TO_BACKEND_RESPONSE_DATA(108),
    NULL_BUNDLE_FROM_DELEGATE_TO_BACKEND_SERVICE_CALL(109),
    Z0(110),
    ERROR_DECODING_DELEGATE_TO_BACKEND_BILLING_RESULT(111),
    MISSING_RESPONSE_DATA_IN_DELEGATE_TO_BACKEND_RESPONSE(112),
    f2889c1(113),
    BILLING_OVERRIDE_SERVICE_FALLBACK_ERROR(114),
    f2893e1(115),
    BILLING_CLIENT_TRANSITIONED_OUT_OF_CONNECTING(116),
    SERVICE_CALL_EXCEPTION(117),
    SERVICE_RESET_TO_NULL(118),
    f2905i1(119),
    SERVICE_DISCONNECTED(120),
    BINDING_DIED(121),
    FIRST_PARTY_CLIENT_MISSING_1P_LISTENER(122),
    FIRST_PARTY_CLIENT_MISSING_3P_LISTENER(123),
    NULL_DATA_WITH_OK_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT(124),
    NULL_DATA_WITH_CANCELLED_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT(125),
    f2926p1(145),
    f2929q1(146),
    NULL_DATA_WITH_OTHER_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT(126),
    f2935s1(147),
    AUTO_PAY_NOT_SUPPORTED(127),
    BILLING_PROGRAM_NOT_SUPPORTED(128),
    LAUNCH_EXTERNAL_OFFER_FLOW_NOT_SUPPORTED(129),
    NULL_BUNDLE_RETURNED_BY_PHONESKY(130),
    LAUNCH_EXTERNAL_LINK_NOT_SUPPORTED(131),
    RUNTIME_EXCEPTION_WHEN_LAUNCHING_INTENT(132),
    NULL_INTENT_RETURNED_BY_PHONESKY(133),
    ERROR_IN_ACTIVITY_RESULT(134),
    B1(135),
    BILLING_API_VERSION_NOT_SET_IN_BUNDLE(136),
    RESPONSE_CODE_NOT_SET_IN_BUNDLE(137),
    NON_OK_CODE_RETURNED_BY_PHONESKY(138),
    INITIALIZE_SERVICE_CALL_EXCEPTION(139),
    G1(140),
    INITIALIZE_SECURITY_EXCEPTION(141),
    INITIALIZE_REMOTE_EXCEPTION(142),
    RUNTIME_EXCEPTION_ON_LAUNCH_EXTERNAL_LINK_INTENT(143),
    K1(144),
    INTENT_SENDER_EXCEPTION(148),
    M1(149),
    PLAY_STORE_ON_CREATE_RUNTIME_EXCEPTION(150),
    MISSING_DEVELOPER_PROVIDED_BILLING_LISTENER(151),
    NULL_DEVELOPER_MANAGED_BILLING_LISTENER(152);


    /* renamed from: e, reason: collision with root package name */
    private final int f2957e;

    n6(int i4) {
        this.f2957e = i4;
    }

    public static n6 b(int i4) {
        if (i4 == 90) {
            return H0;
        }
        if (i4 == 91) {
            return NULL_BUNDLE_FROM_IS_EXTERNAL_PAYMENT_AVAILABLE_SERVICE_CALL;
        }
        if (i4 == 93) {
            return CREATE_EXTERNAL_PAYMENT_REPORTING_DETAILS_SERVICE_CALL_EXCEPTION;
        }
        if (i4 == 94) {
            return NULL_BUNDLE_FROM_CREATE_EXTERNAL_PAYMENT_REPORTING_DETAILS_SERVICE_CALL;
        }
        switch (i4) {
            case 0:
                return REASON_UNSPECIFIED;
            case BuildConfig.VERSION_CODE /* 1 */:
                return SERVICE_CONNECTION_NOT_READY;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                return GET_BUY_INTENT_ERROR;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                return f2903i;
            case 4:
                return LAUNCH_BILLING_FLOW_EXCEPTION;
            case 5:
                return f2909k;
            case 6:
                return INVALID_REQUEST_CODE;
            case 7:
                return INVALID_LISTENER;
            case 8:
                return SUBSCRIPTIONS_NOT_SUPPORTED;
            case 9:
                return SUBSCRIPTIONS_UPDATE_NOT_SUPPORTED;
            case 10:
                return NULL_BUNDLE_IN_BROADCAST_RECEIVER;
            case 11:
                return f2927q;
            case 12:
                return f2930r;
            case 13:
                return INVALID_FIRST_PARTY_PURCHASE_DATA;
            case 14:
                return MISSING_ALTERNATIVE_BILLING_LISTENER;
            case 15:
                return MISSING_ALTERNATIVE_BILLING_USER_CHOICE_DATA;
            case 16:
                return INVALID_ALTERNATIVE_BILLING_USER_CHOICE_DATA;
            case 17:
                return f2945w;
            case 18:
                return f2948x;
            case 19:
                return PRODUCT_DETAILS_NOT_SUPPORTED;
            case 20:
                return f2954z;
            case 21:
                return A;
            case 22:
                return B;
            case 23:
                return EXECUTE_ASYNC_TIMEOUT;
            case 24:
                return MISSING_RESULT_FROM_EXECUTE_ASYNC;
            case 25:
                return EMPTY_PURCHASE_TOKEN;
            case 26:
                return API_VERSION_NOT_V9;
            case 27:
                return ACKNOWLEDGE_PURCHASE_SERVICE_CALL_EXCEPTION;
            case 28:
                return CONSUME_PURCHASE_SERVICE_CALL_EXCEPTION;
            case 29:
                return IN_APP_MESSAGE_NOT_SUPPORTED;
            case 30:
                return CROSS_APP_NOT_SUPPORTED;
            case 31:
                return K;
            case 32:
                return L;
            case 33:
                return UNKNOWN_FEATURE;
            case 34:
                return PRICE_CHANGE_CONFIRMATION_NOT_SUPPORTED;
            case 35:
                return ONE_TIME_PRODUCT_NOT_SUPPORTED;
            case 36:
                return BILLING_CLIENT_CONNECTING;
            case 37:
                return BILLING_CLIENT_CLOSED;
            case 38:
                return BILLING_SERVICE_BLOCKED;
            case 39:
                return S;
            case 40:
                return INTENT_SERVICE_NOT_FOUND;
            case 41:
                return U;
            case 42:
                return GET_SKU_DETAILS_SERVICE_CALL_EXCEPTION;
            case 43:
                return NULL_BUNDLE_FROM_GET_SKU_DETAILS_SERVICE_CALL;
            case 44:
                return X;
            case 45:
                return NULL_DETAILS_LIST_IN_GET_SKU_DETAILS_RESPONSE;
            case 46:
                return ERROR_DECODING_SKU_DETAILS;
            case 47:
                return EMPTY_SKU_LIST;
            case 48:
                return EMPTY_SKU_TYPE;
            case 49:
                return EMPTY_PRODUCT_TYPE;
            case 50:
                return ERROR_DECODING_PURCHASE_DATA;
            case 51:
                return f2892e0;
            case 52:
                return INVALID_PURCHASES_BUNDLE;
            case 53:
                return NULL_OWNED_ITEMS_LIST;
            case 54:
                return f2901h0;
            case 55:
                return NULL_SKUS_LIST;
            case 56:
                return f2907j0;
            case 57:
                return f2910k0;
            case 58:
                return GET_PURCHASE_HISTORY_SERVICE_CALL_EXCEPTION;
            case 59:
                return QUERY_PRODUCT_DETAILS_WITH_DEVELOPER_SPECIFIED_ACCOUNT_NOT_SUPPORTED;
            case 60:
                return f2919n0;
            case 61:
                return GET_BILLING_CONFIG_SERVICE_CALL_EXCEPTION;
            case 62:
                return f2925p0;
            case 63:
                return f2928q0;
            case 64:
                return ERROR_DECODING_BILLING_CONFIG_DATA;
            case 65:
                return ALTERNATIVE_BILLING_ONLY_NOT_SUPPORTED;
            case 66:
                return NULL_BUNDLE_FROM_IS_ALTERNATIVE_BILLING_ONLY_AVAILABLE_SERVICE_CALL;
            case 67:
                return ERROR_DECODING_ALTERNATIVE_BILLING_ONLY_AVAILABILITY;
            case 68:
                return IS_ALTERNATIVE_BILLING_ONLY_AVAILABLE_SERVICE_CALL_EXCEPTION;
            case 69:
                return CREATE_ALTERNATIVE_BILLING_ONLY_TOKEN_SERVICE_CALL_EXCEPTION;
            case 70:
                return NULL_BUNDLE_FROM_CREATE_ALTERNATIVE_BILLING_ONLY_TOKEN_SERVICE_CALL;
            case 71:
                return ERROR_DECODING_ALTERNATIVE_BILLING_ONLY_REPORTING_DETAILS;
            case 72:
                return NULL_BUNDLE_IN_ALTERNATIVE_BILLING_ONLY_INFORMATION_DIALOG_RECEIVER;
            case 73:
                return SHOW_ALTERNATIVE_BILLING_ONLY_DIALOG_SERVICE_CALL_EXCEPTION;
            case 74:
                return MISSING_ALTERNATIVE_BILLING_ONLY_DIALOG_RESULT_RECEIVER;
            case 75:
                return C0;
            case 76:
                return D0;
            case 77:
                return NULL_BUNDLE_FROM_GET_BUY_INTENT_EXTRA_PARAMS_SERVICE_CALL;
            case 78:
                return NULL_BUNDLE_FROM_GET_BUY_INTENT_TO_REPLACE_SKUS_SERVICE_CALL;
            case 79:
                return NULL_BUNDLE_FROM_GET_BUY_INTENT_SERVICE_CALL;
            default:
                switch (i4) {
                    case 96:
                        return NULL_BUNDLE_IN_EXTERNAL_PAYMENT_INFORMATION_DIALOG_RECEIVER;
                    case 97:
                        return SHOW_EXTERNAL_PAYMENT_DIALOG_SERVICE_CALL_EXCEPTION;
                    case 98:
                        return RUNTIME_EXCEPTION_ON_LAUNCHING_EXTERNAL_PAYMENT_DIALOG_INTENT;
                    case 99:
                        return IS_BILLING_SUPPORTED_REMOTE_EXCEPTION;
                    case 100:
                        return R0;
                    case 101:
                        return S0;
                    case 102:
                        return J0;
                    case 103:
                        return ERROR_DECODING_EXTERNAL_OFFER_REPORTING_DETAILS;
                    case 104:
                        return LICENSE_TESTER_BILLING_OVERRIDE;
                    case 105:
                        return BILLING_OVERRIDE_SERVICE_CONNECTION_NOT_READY;
                    case 106:
                        return BILLING_OVERRIDE_SERVICE_CALL_EXCEPTION;
                    case 107:
                        return NULL_LISTENER_IN_DELEGATE_TO_BACKEND_CALLBACK;
                    case 108:
                        return ERROR_DECODING_DELEGATE_TO_BACKEND_RESPONSE_DATA;
                    case 109:
                        return NULL_BUNDLE_FROM_DELEGATE_TO_BACKEND_SERVICE_CALL;
                    case 110:
                        return Z0;
                    case 111:
                        return ERROR_DECODING_DELEGATE_TO_BACKEND_BILLING_RESULT;
                    case 112:
                        return MISSING_RESPONSE_DATA_IN_DELEGATE_TO_BACKEND_RESPONSE;
                    case 113:
                        return f2889c1;
                    case 114:
                        return BILLING_OVERRIDE_SERVICE_FALLBACK_ERROR;
                    case 115:
                        return f2893e1;
                    case 116:
                        return BILLING_CLIENT_TRANSITIONED_OUT_OF_CONNECTING;
                    case 117:
                        return SERVICE_CALL_EXCEPTION;
                    case 118:
                        return SERVICE_RESET_TO_NULL;
                    case 119:
                        return f2905i1;
                    case 120:
                        return SERVICE_DISCONNECTED;
                    case 121:
                        return BINDING_DIED;
                    case 122:
                        return FIRST_PARTY_CLIENT_MISSING_1P_LISTENER;
                    case 123:
                        return FIRST_PARTY_CLIENT_MISSING_3P_LISTENER;
                    case 124:
                        return NULL_DATA_WITH_OK_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT;
                    case 125:
                        return NULL_DATA_WITH_CANCELLED_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT;
                    case 126:
                        return NULL_DATA_WITH_OTHER_RESULT_CODE_IN_PROXY_BILLING_ACTIVITY_RESULT;
                    case 127:
                        return AUTO_PAY_NOT_SUPPORTED;
                    case 128:
                        return BILLING_PROGRAM_NOT_SUPPORTED;
                    case 129:
                        return LAUNCH_EXTERNAL_OFFER_FLOW_NOT_SUPPORTED;
                    case 130:
                        return NULL_BUNDLE_RETURNED_BY_PHONESKY;
                    case 131:
                        return LAUNCH_EXTERNAL_LINK_NOT_SUPPORTED;
                    case 132:
                        return RUNTIME_EXCEPTION_WHEN_LAUNCHING_INTENT;
                    case 133:
                        return NULL_INTENT_RETURNED_BY_PHONESKY;
                    case 134:
                        return ERROR_IN_ACTIVITY_RESULT;
                    case 135:
                        return B1;
                    case 136:
                        return BILLING_API_VERSION_NOT_SET_IN_BUNDLE;
                    case 137:
                        return RESPONSE_CODE_NOT_SET_IN_BUNDLE;
                    case 138:
                        return NON_OK_CODE_RETURNED_BY_PHONESKY;
                    case 139:
                        return INITIALIZE_SERVICE_CALL_EXCEPTION;
                    case 140:
                        return G1;
                    case 141:
                        return INITIALIZE_SECURITY_EXCEPTION;
                    case 142:
                        return INITIALIZE_REMOTE_EXCEPTION;
                    case 143:
                        return RUNTIME_EXCEPTION_ON_LAUNCH_EXTERNAL_LINK_INTENT;
                    case 144:
                        return K1;
                    case 145:
                        return f2926p1;
                    case 146:
                        return f2929q1;
                    case 147:
                        return f2935s1;
                    case 148:
                        return INTENT_SENDER_EXCEPTION;
                    case 149:
                        return M1;
                    case 150:
                        return PLAY_STORE_ON_CREATE_RUNTIME_EXCEPTION;
                    case 151:
                        return MISSING_DEVELOPER_PROVIDED_BILLING_LISTENER;
                    case 152:
                        return NULL_DEVELOPER_MANAGED_BILLING_LISTENER;
                    default:
                        return null;
                }
        }
    }

    public final int a() {
        return this.f2957e;
    }

    @Override // java.lang.Enum
    public final String toString() {
        return Integer.toString(this.f2957e);
    }
}
