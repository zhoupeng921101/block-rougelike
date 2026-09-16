package r2;

import android.net.Uri;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {
    public static boolean a(Uri uri) {
        return uri != null && uri.isHierarchical() && uri.isAbsolute();
    }
}
