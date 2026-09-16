package c2;

import a1.b2.c3;
import java.util.logging.Level;
import java.util.logging.Logger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class l1 {
    public static String a(String str, Object... objArr) {
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
            sb.append(b(objArr[i4]));
            i5 = indexOf + 2;
            i4++;
        }
        sb.append((CharSequence) str, i5, str.length());
        if (i4 < length) {
            String str2 = " [";
            while (i4 < objArr.length) {
                sb.append(str2);
                sb.append(b(objArr[i4]));
                i4++;
                str2 = ", ";
            }
            sb.append(']');
        }
        return sb.toString();
    }

    private static String b(Object obj) {
        if (obj == null) {
            return "null";
        }
        try {
            return obj.toString();
        } catch (Exception e4) {
            String name = obj.getClass().getName();
            String hexString = Integer.toHexString(System.identityHashCode(obj));
            StringBuilder sb = new StringBuilder(name.length() + 1 + String.valueOf(hexString).length());
            sb.append(name);
            sb.append(c3.d4(473));
            sb.append(hexString);
            String sb2 = sb.toString();
            Logger.getLogger("com.google.common.base.Strings").logp(Level.WARNING, "com.google.common.base.Strings", "lenientToString", "Exception during lenientFormat for ".concat(sb2), (Throwable) e4);
            String name2 = e4.getClass().getName();
            StringBuilder sb3 = new StringBuilder(sb2.length() + 8 + name2.length() + 1);
            sb3.append("<");
            sb3.append(sb2);
            sb3.append(" threw ");
            sb3.append(name2);
            sb3.append(c3.d4(1068));
            return sb3.toString();
        }
    }
}
