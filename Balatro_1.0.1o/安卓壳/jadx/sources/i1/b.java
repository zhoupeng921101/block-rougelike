package i1;

import a1.b2.c3;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;
import android.os.Parcelable;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a extends RuntimeException {
        /* JADX WARN: Illegal instructions before constructor call */
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        public a(java.lang.String r5, android.os.Parcel r6) {
            /*
                r4 = this;
                int r0 = r6.dataPosition()
                int r6 = r6.dataSize()
                java.lang.String r1 = java.lang.String.valueOf(r5)
                int r1 = r1.length()
                java.lang.String r2 = java.lang.String.valueOf(r0)
                int r2 = r2.length()
                java.lang.String r3 = java.lang.String.valueOf(r6)
                int r3 = r3.length()
                int r1 = r1 + 13
                int r1 = r1 + r2
                java.lang.StringBuilder r2 = new java.lang.StringBuilder
                int r1 = r1 + 6
                int r1 = r1 + r3
                r2.<init>(r1)
                r2.append(r5)
                r5 = 0
                r5 = 1178(0x49a, float:1.651E-42)
                java.lang.String r5 = a1.b2.c3.d4(r5)
                r2.append(r5)
                r2.append(r0)
                java.lang.String r5 = " size="
                r2.append(r5)
                r2.append(r6)
                java.lang.String r5 = r2.toString()
                r4.<init>(r5)
                return
            */
            throw new UnsupportedOperationException("Method not decompiled: i1.b.a.<init>(java.lang.String, android.os.Parcel):void");
        }
    }

    public static boolean[] a(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        boolean[] createBooleanArray = parcel.createBooleanArray();
        parcel.setDataPosition(dataPosition + u3);
        return createBooleanArray;
    }

    public static Bundle b(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        Bundle readBundle = parcel.readBundle();
        parcel.setDataPosition(dataPosition + u3);
        return readBundle;
    }

    public static int[] c(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        int[] createIntArray = parcel.createIntArray();
        parcel.setDataPosition(dataPosition + u3);
        return createIntArray;
    }

    public static Parcelable d(Parcel parcel, int i4, Parcelable.Creator creator) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        Parcelable parcelable = (Parcelable) creator.createFromParcel(parcel);
        parcel.setDataPosition(dataPosition + u3);
        return parcelable;
    }

    public static String e(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        String readString = parcel.readString();
        parcel.setDataPosition(dataPosition + u3);
        return readString;
    }

    public static String[] f(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        String[] createStringArray = parcel.createStringArray();
        parcel.setDataPosition(dataPosition + u3);
        return createStringArray;
    }

    public static ArrayList g(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        ArrayList<String> createStringArrayList = parcel.createStringArrayList();
        parcel.setDataPosition(dataPosition + u3);
        return createStringArrayList;
    }

    public static Object[] h(Parcel parcel, int i4, Parcelable.Creator creator) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        Object[] createTypedArray = parcel.createTypedArray(creator);
        parcel.setDataPosition(dataPosition + u3);
        return createTypedArray;
    }

    public static ArrayList i(Parcel parcel, int i4, Parcelable.Creator creator) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        ArrayList createTypedArrayList = parcel.createTypedArrayList(creator);
        parcel.setDataPosition(dataPosition + u3);
        return createTypedArrayList;
    }

    public static void j(Parcel parcel, int i4) {
        if (parcel.dataPosition() == i4) {
            return;
        }
        StringBuilder sb = new StringBuilder(String.valueOf(i4).length() + 26);
        sb.append("Overread allowed size end=");
        sb.append(i4);
        throw new a(sb.toString(), parcel);
    }

    public static int k(int i4) {
        return (char) i4;
    }

    public static boolean l(Parcel parcel, int i4) {
        x(parcel, i4, 4);
        return parcel.readInt() != 0;
    }

    public static Boolean m(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        if (u3 == 0) {
            return null;
        }
        y(parcel, i4, u3, 4);
        return Boolean.valueOf(parcel.readInt() != 0);
    }

    public static float n(Parcel parcel, int i4) {
        x(parcel, i4, 4);
        return parcel.readFloat();
    }

    public static int o(Parcel parcel) {
        return parcel.readInt();
    }

    public static IBinder p(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        int dataPosition = parcel.dataPosition();
        if (u3 == 0) {
            return null;
        }
        IBinder readStrongBinder = parcel.readStrongBinder();
        parcel.setDataPosition(dataPosition + u3);
        return readStrongBinder;
    }

    public static int q(Parcel parcel, int i4) {
        x(parcel, i4, 4);
        return parcel.readInt();
    }

    public static Integer r(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        if (u3 == 0) {
            return null;
        }
        y(parcel, i4, u3, 4);
        return Integer.valueOf(parcel.readInt());
    }

    public static long s(Parcel parcel, int i4) {
        x(parcel, i4, 8);
        return parcel.readLong();
    }

    public static Long t(Parcel parcel, int i4) {
        int u3 = u(parcel, i4);
        if (u3 == 0) {
            return null;
        }
        y(parcel, i4, u3, 8);
        return Long.valueOf(parcel.readLong());
    }

    public static int u(Parcel parcel, int i4) {
        return (i4 & (-65536)) != -65536 ? (char) (i4 >> 16) : parcel.readInt();
    }

    public static void v(Parcel parcel, int i4) {
        parcel.setDataPosition(parcel.dataPosition() + u(parcel, i4));
    }

    public static int w(Parcel parcel) {
        int o3 = o(parcel);
        int u3 = u(parcel, o3);
        int k4 = k(o3);
        int dataPosition = parcel.dataPosition();
        if (k4 != 20293) {
            throw new a("Expected object header. Got 0x".concat(String.valueOf(Integer.toHexString(o3))), parcel);
        }
        int i4 = u3 + dataPosition;
        if (i4 >= dataPosition && i4 <= parcel.dataSize()) {
            return i4;
        }
        StringBuilder sb = new StringBuilder(String.valueOf(dataPosition).length() + 32 + String.valueOf(i4).length());
        sb.append("Size read is invalid start=");
        sb.append(dataPosition);
        sb.append(" end=");
        sb.append(i4);
        throw new a(sb.toString(), parcel);
    }

    private static void x(Parcel parcel, int i4, int i5) {
        int u3 = u(parcel, i4);
        if (u3 == i5) {
            return;
        }
        String hexString = Integer.toHexString(u3);
        int length = String.valueOf(i5).length();
        StringBuilder sb = new StringBuilder(length + 19 + String.valueOf(u3).length() + 4 + String.valueOf(hexString).length() + 1);
        sb.append("Expected size ");
        sb.append(i5);
        sb.append(" got ");
        sb.append(u3);
        sb.append(" (0x");
        sb.append(hexString);
        sb.append(")");
        throw new a(sb.toString(), parcel);
    }

    private static void y(Parcel parcel, int i4, int i5, int i6) {
        if (i5 == i6) {
            return;
        }
        String hexString = Integer.toHexString(i5);
        int length = String.valueOf(i6).length();
        StringBuilder sb = new StringBuilder(length + 19 + String.valueOf(i5).length() + 4 + String.valueOf(hexString).length() + 1);
        sb.append("Expected size ");
        sb.append(i6);
        sb.append(c3.d4(942));
        sb.append(i5);
        sb.append(" (0x");
        sb.append(hexString);
        sb.append(c3.d4(77));
        throw new a(sb.toString(), parcel);
    }
}
