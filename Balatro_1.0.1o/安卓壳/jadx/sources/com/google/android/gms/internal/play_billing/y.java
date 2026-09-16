package com.google.android.gms.internal.play_billing;

import java.util.logging.Level;
import java.util.logging.Logger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class y {
    public static String a(String str) {
        if (u.a(str)) {
            return null;
        }
        return str;
    }

    public static String b(String str, Object... objArr) {
        int length;
        int indexOf;
        StringBuilder sb = new StringBuilder(str.length() + (objArr.length * 16));
        int i4 = 0;
        int i5 = 0;
        while (true) {
            length = objArr.length;
            if (i4 >= length || (indexOf = str.indexOf("%s", i5)) == -1) {
                break;
            }
            sb.append((CharSequence) str, i5, indexOf);
            sb.append(d(objArr[i4]));
            i5 = indexOf + 2;
            i4++;
        }
        sb.append((CharSequence) str, i5, str.length());
        if (i4 < length) {
            String str2 = " [";
            while (i4 < objArr.length) {
                sb.append(str2);
                sb.append(d(objArr[i4]));
                i4++;
                str2 = ", ";
            }
            sb.append(']');
        }
        return sb.toString();
    }

    public static String c(String str) {
        return str == null ? "" : str;
    }

    private static String d(Object obj) {
        if (obj == null) {
            return "null";
        }
        try {
            return obj.toString();
        } catch (Exception e4) {
            String str = obj.getClass().getName() + a1.b2.c3.d4(1330) + Integer.toHexString(System.identityHashCode(obj));
            Logger.getLogger("com.google.common.base.Strings").logp(Level.WARNING, a1.b2.c3.d4(1458), "lenientToString", a1.b2.c3.d4(204).concat(str), (Throwable) e4);
            return a1.b2.c3.d4(436) + str + " threw " + e4.getClass().getName() + ">";
        }
    }
}
