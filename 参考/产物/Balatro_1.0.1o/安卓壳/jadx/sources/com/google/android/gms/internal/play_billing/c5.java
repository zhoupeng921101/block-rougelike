package com.google.android.gms.internal.play_billing;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class c5 {

    /* renamed from: a, reason: collision with root package name */
    private static final char[] f2733a;

    static {
        char[] cArr = new char[80];
        f2733a = cArr;
        Arrays.fill(cArr, ' ');
    }

    static String a(a5 a5Var, String str) {
        StringBuilder sb = new StringBuilder();
        sb.append(a1.b2.c3.d4(1072));
        sb.append(str);
        d(a5Var, sb, 0);
        return sb.toString();
    }

    static void b(StringBuilder sb, int i4, String str, Object obj) {
        if (obj instanceof List) {
            Iterator it = ((List) obj).iterator();
            while (it.hasNext()) {
                b(sb, i4, str, it.next());
            }
            return;
        }
        if (obj instanceof Map) {
            Iterator it2 = ((Map) obj).entrySet().iterator();
            while (it2.hasNext()) {
                b(sb, i4, str, (Map.Entry) it2.next());
            }
            return;
        }
        sb.append('\n');
        c(i4, sb);
        if (!str.isEmpty()) {
            StringBuilder sb2 = new StringBuilder();
            sb2.append(Character.toLowerCase(str.charAt(0)));
            for (int i5 = 1; i5 < str.length(); i5++) {
                char charAt = str.charAt(i5);
                if (Character.isUpperCase(charAt)) {
                    sb2.append("_");
                }
                sb2.append(Character.toLowerCase(charAt));
            }
            str = sb2.toString();
        }
        sb.append(str);
        if (obj instanceof String) {
            sb.append(": \"");
            String str2 = (String) obj;
            j3 j3Var = j3.f2809f;
            sb.append(n5.a(str2.isEmpty() ? j3.f2809f : new h3(str2.getBytes(k4.f2838a))));
            sb.append('\"');
            return;
        }
        if (obj instanceof j3) {
            sb.append(": \"");
            sb.append(n5.a((j3) obj));
            sb.append('\"');
            return;
        }
        if (obj instanceof d4) {
            sb.append(" {");
            d((d4) obj, sb, i4 + 2);
            sb.append("\n");
            c(i4, sb);
            sb.append("}");
            return;
        }
        if (!(obj instanceof Map.Entry)) {
            sb.append(": ");
            sb.append(obj);
            return;
        }
        int i6 = i4 + 2;
        sb.append(" {");
        Map.Entry entry = (Map.Entry) obj;
        b(sb, i6, "key", entry.getKey());
        b(sb, i6, "value", entry.getValue());
        sb.append("\n");
        c(i4, sb);
        sb.append("}");
    }

    private static void c(int i4, StringBuilder sb) {
        while (i4 > 0) {
            int i5 = 80;
            if (i4 <= 80) {
                i5 = i4;
            }
            sb.append(f2733a, 0, i5);
            i4 -= i5;
        }
    }

    /* JADX WARN: Code restructure failed: missing block: B:75:0x0182, code lost:
    
        if (((java.lang.Boolean) r7).booleanValue() == false) goto L66;
     */
    /* JADX WARN: Code restructure failed: missing block: B:76:0x0184, code lost:
    
        r13 = false;
     */
    /* JADX WARN: Code restructure failed: missing block: B:85:0x0192, code lost:
    
        if (((java.lang.Integer) r7).intValue() == 0) goto L66;
     */
    /* JADX WARN: Code restructure failed: missing block: B:89:0x01a4, code lost:
    
        if (java.lang.Float.floatToRawIntBits(((java.lang.Float) r7).floatValue()) == 0) goto L66;
     */
    /* JADX WARN: Code restructure failed: missing block: B:93:0x01ba, code lost:
    
        if (java.lang.Double.doubleToRawLongBits(((java.lang.Double) r7).doubleValue()) == 0) goto L66;
     */
    /* JADX WARN: Code restructure failed: missing block: B:97:0x01d2, code lost:
    
        if (r13 != false) goto L66;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private static void d(com.google.android.gms.internal.play_billing.a5 r18, java.lang.StringBuilder r19, int r20) {
        /*
            Method dump skipped, instructions count: 528
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.internal.play_billing.c5.d(com.google.android.gms.internal.play_billing.a5, java.lang.StringBuilder, int):void");
    }
}
