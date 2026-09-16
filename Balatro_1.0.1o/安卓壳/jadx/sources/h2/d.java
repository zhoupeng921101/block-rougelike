package h2;

import a1.b2.c3;
import java.util.logging.Level;
import java.util.logging.Logger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class d {
    public static String a(String str, Object... objArr) {
        int indexOf;
        String valueOf = String.valueOf(str);
        int i4 = 0;
        if (objArr == null) {
            objArr = new Object[]{c3.d4(740)};
        } else {
            for (int i5 = 0; i5 < objArr.length; i5++) {
                objArr[i5] = b(objArr[i5]);
            }
        }
        StringBuilder sb = new StringBuilder(valueOf.length() + (objArr.length * 16));
        int i6 = 0;
        while (i4 < objArr.length && (indexOf = valueOf.indexOf("%s", i6)) != -1) {
            sb.append((CharSequence) valueOf, i6, indexOf);
            sb.append(objArr[i4]);
            i6 = indexOf + 2;
            i4++;
        }
        sb.append((CharSequence) valueOf, i6, valueOf.length());
        if (i4 < objArr.length) {
            sb.append(c3.d4(1285));
            sb.append(objArr[i4]);
            for (int i7 = i4 + 1; i7 < objArr.length; i7++) {
                sb.append(c3.d4(1235));
                sb.append(objArr[i7]);
            }
            sb.append(']');
        }
        return sb.toString();
    }

    private static String b(Object obj) {
        try {
            return String.valueOf(obj);
        } catch (Exception e4) {
            String str = obj.getClass().getName() + '@' + Integer.toHexString(System.identityHashCode(obj));
            Logger.getLogger("com.google.common.base.Strings").log(Level.WARNING, "Exception during lenientFormat for " + str, (Throwable) e4);
            return "<" + str + " threw " + e4.getClass().getName() + ">";
        }
    }
}
