package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class n5 {
    static String a(j3 j3Var) {
        StringBuilder sb = new StringBuilder(j3Var.g());
        for (int i4 = 0; i4 < j3Var.g(); i4++) {
            byte a4 = j3Var.a(i4);
            if (a4 == 34) {
                sb.append("\\\"");
            } else if (a4 == 39) {
                sb.append("\\'");
            } else if (a4 != 92) {
                switch (a4) {
                    case 7:
                        sb.append(a1.b2.c3.d4(1279));
                        break;
                    case 8:
                        sb.append("\\b");
                        break;
                    case 9:
                        sb.append("\\t");
                        break;
                    case 10:
                        sb.append(a1.b2.c3.d4(691));
                        break;
                    case 11:
                        sb.append("\\v");
                        break;
                    case 12:
                        sb.append("\\f");
                        break;
                    case 13:
                        sb.append("\\r");
                        break;
                    default:
                        if (a4 < 32 || a4 > 126) {
                            sb.append('\\');
                            sb.append((char) (((a4 >>> 6) & 3) + 48));
                            sb.append((char) (((a4 >>> 3) & 7) + 48));
                            sb.append((char) ((a4 & 7) + 48));
                            break;
                        } else {
                            sb.append((char) a4);
                            break;
                        }
                        break;
                }
            } else {
                sb.append("\\\\");
            }
        }
        return sb.toString();
    }
}
