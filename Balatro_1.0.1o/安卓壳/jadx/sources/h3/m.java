package h3;

import a1.b2.c3;
import u2.v;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class m extends l {
    public static final int c(CharSequence charSequence) {
        b3.f.e(charSequence, "<this>");
        return charSequence.length() - 1;
    }

    public static final int d(CharSequence charSequence, char c4, int i4, boolean z3) {
        b3.f.e(charSequence, "<this>");
        return (z3 || !(charSequence instanceof String)) ? f(charSequence, new char[]{c4}, i4, z3) : ((String) charSequence).indexOf(c4, i4);
    }

    public static /* synthetic */ int e(CharSequence charSequence, char c4, int i4, boolean z3, int i5, Object obj) {
        if ((i5 & 2) != 0) {
            i4 = 0;
        }
        if ((i5 & 4) != 0) {
            z3 = false;
        }
        return d(charSequence, c4, i4, z3);
    }

    public static final int f(CharSequence charSequence, char[] cArr, int i4, boolean z3) {
        b3.f.e(charSequence, "<this>");
        b3.f.e(cArr, "chars");
        if (!z3 && cArr.length == 1 && (charSequence instanceof String)) {
            return ((String) charSequence).indexOf(u2.a.d(cArr), i4);
        }
        v it = new e3.c(e3.d.a(i4, 0), c(charSequence)).iterator();
        while (it.hasNext()) {
            int nextInt = it.nextInt();
            char charAt = charSequence.charAt(nextInt);
            for (char c4 : cArr) {
                if (b.c(c4, charAt, z3)) {
                    return nextInt;
                }
            }
        }
        return -1;
    }

    public static final int g(CharSequence charSequence, char c4, int i4, boolean z3) {
        b3.f.e(charSequence, c3.d4(1177));
        return (z3 || !(charSequence instanceof String)) ? i(charSequence, new char[]{c4}, i4, z3) : ((String) charSequence).lastIndexOf(c4, i4);
    }

    public static /* synthetic */ int h(CharSequence charSequence, char c4, int i4, boolean z3, int i5, Object obj) {
        if ((i5 & 2) != 0) {
            i4 = c(charSequence);
        }
        if ((i5 & 4) != 0) {
            z3 = false;
        }
        return g(charSequence, c4, i4, z3);
    }

    public static final int i(CharSequence charSequence, char[] cArr, int i4, boolean z3) {
        b3.f.e(charSequence, "<this>");
        b3.f.e(cArr, c3.d4(207));
        if (!z3 && cArr.length == 1 && (charSequence instanceof String)) {
            return ((String) charSequence).lastIndexOf(u2.a.d(cArr), i4);
        }
        for (int b4 = e3.d.b(i4, c(charSequence)); -1 < b4; b4--) {
            char charAt = charSequence.charAt(b4);
            for (char c4 : cArr) {
                if (b.c(c4, charAt, z3)) {
                    return b4;
                }
            }
        }
        return -1;
    }

    public static final String j(String str, char c4, String str2) {
        b3.f.e(str, "<this>");
        b3.f.e(str2, "missingDelimiterValue");
        int h4 = h(str, c4, 0, false, 6, null);
        if (h4 == -1) {
            return str2;
        }
        String substring = str.substring(h4 + 1, str.length());
        b3.f.d(substring, "this as java.lang.String…ing(startIndex, endIndex)");
        return substring;
    }

    public static /* synthetic */ String k(String str, char c4, String str2, int i4, Object obj) {
        if ((i4 & 2) != 0) {
            str2 = str;
        }
        return j(str, c4, str2);
    }
}
