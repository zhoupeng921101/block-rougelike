package com.google.android.gms.internal.play_billing;

import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g6 implements g4 {

    /* renamed from: a, reason: collision with root package name */
    static final g4 f2770a = new g6();

    private g6() {
    }

    @Override // com.google.android.gms.internal.play_billing.g4
    public final boolean c(int i4) {
        switch (i4) {
            case 0:
            case BuildConfig.VERSION_CODE /* 1 */:
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                return true;
            default:
                switch (i4) {
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                    case 29:
                    case 30:
                    case 31:
                    case 32:
                    case 33:
                    case 34:
                    case 35:
                    case 36:
                        return true;
                    default:
                        return false;
                }
        }
    }
}
