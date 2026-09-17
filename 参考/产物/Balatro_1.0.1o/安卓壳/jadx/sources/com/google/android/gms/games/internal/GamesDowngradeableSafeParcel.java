package com.google.android.gms.games.internal;

import com.google.android.gms.common.internal.DowngradeableSafeParcel;
import com.google.android.gms.common.util.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class GamesDowngradeableSafeParcel extends DowngradeableSafeParcel {
    protected static boolean k0(Integer num) {
        if (num == null) {
            return false;
        }
        return g.a(num.intValue());
    }
}
