package androidx.core.os;

import android.content.res.Configuration;
import android.os.LocaleList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static LocaleList a(Configuration configuration) {
            return configuration.getLocales();
        }
    }

    public static d a(Configuration configuration) {
        return d.c(a.a(configuration));
    }
}
