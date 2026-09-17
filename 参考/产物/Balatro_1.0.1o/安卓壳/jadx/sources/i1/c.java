package i1;

import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;
import android.os.Parcelable;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {
    public static int a(Parcel parcel) {
        return u(parcel, 20293);
    }

    public static void b(Parcel parcel, int i4) {
        v(parcel, i4);
    }

    public static void c(Parcel parcel, int i4, boolean z3) {
        t(parcel, i4, 4);
        parcel.writeInt(z3 ? 1 : 0);
    }

    public static void d(Parcel parcel, int i4, boolean[] zArr, boolean z3) {
        if (zArr == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeBooleanArray(zArr);
            v(parcel, u3);
        }
    }

    public static void e(Parcel parcel, int i4, Boolean bool, boolean z3) {
        if (bool != null) {
            t(parcel, i4, 4);
            parcel.writeInt(bool.booleanValue() ? 1 : 0);
        } else if (z3) {
            t(parcel, i4, 0);
        }
    }

    public static void f(Parcel parcel, int i4, Bundle bundle, boolean z3) {
        if (bundle == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeBundle(bundle);
            v(parcel, u3);
        }
    }

    public static void g(Parcel parcel, int i4, float f4) {
        t(parcel, i4, 4);
        parcel.writeFloat(f4);
    }

    public static void h(Parcel parcel, int i4, IBinder iBinder, boolean z3) {
        if (iBinder == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeStrongBinder(iBinder);
            v(parcel, u3);
        }
    }

    public static void i(Parcel parcel, int i4, int i5) {
        t(parcel, i4, 4);
        parcel.writeInt(i5);
    }

    public static void j(Parcel parcel, int i4, int[] iArr, boolean z3) {
        if (iArr == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeIntArray(iArr);
            v(parcel, u3);
        }
    }

    public static void k(Parcel parcel, int i4, Integer num, boolean z3) {
        if (num != null) {
            t(parcel, i4, 4);
            parcel.writeInt(num.intValue());
        } else if (z3) {
            t(parcel, i4, 0);
        }
    }

    public static void l(Parcel parcel, int i4, long j4) {
        t(parcel, i4, 8);
        parcel.writeLong(j4);
    }

    public static void m(Parcel parcel, int i4, Long l3, boolean z3) {
        if (l3 != null) {
            t(parcel, i4, 8);
            parcel.writeLong(l3.longValue());
        } else if (z3) {
            t(parcel, i4, 0);
        }
    }

    public static void n(Parcel parcel, int i4, Parcelable parcelable, int i5, boolean z3) {
        if (parcelable == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcelable.writeToParcel(parcel, i5);
            v(parcel, u3);
        }
    }

    public static void o(Parcel parcel, int i4, String str, boolean z3) {
        if (str == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeString(str);
            v(parcel, u3);
        }
    }

    public static void p(Parcel parcel, int i4, String[] strArr, boolean z3) {
        if (strArr == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeStringArray(strArr);
            v(parcel, u3);
        }
    }

    public static void q(Parcel parcel, int i4, List list, boolean z3) {
        if (list == null) {
            if (z3) {
                t(parcel, i4, 0);
            }
        } else {
            int u3 = u(parcel, i4);
            parcel.writeStringList(list);
            v(parcel, u3);
        }
    }

    public static void r(Parcel parcel, int i4, Parcelable[] parcelableArr, int i5, boolean z3) {
        if (parcelableArr == null) {
            if (z3) {
                t(parcel, i4, 0);
                return;
            }
            return;
        }
        int u3 = u(parcel, i4);
        parcel.writeInt(parcelableArr.length);
        for (Parcelable parcelable : parcelableArr) {
            if (parcelable == null) {
                parcel.writeInt(0);
            } else {
                w(parcel, parcelable, i5);
            }
        }
        v(parcel, u3);
    }

    public static void s(Parcel parcel, int i4, List list, boolean z3) {
        if (list == null) {
            if (z3) {
                t(parcel, i4, 0);
                return;
            }
            return;
        }
        int u3 = u(parcel, i4);
        int size = list.size();
        parcel.writeInt(size);
        for (int i5 = 0; i5 < size; i5++) {
            Parcelable parcelable = (Parcelable) list.get(i5);
            if (parcelable == null) {
                parcel.writeInt(0);
            } else {
                w(parcel, parcelable, 0);
            }
        }
        v(parcel, u3);
    }

    private static void t(Parcel parcel, int i4, int i5) {
        parcel.writeInt(i4 | (i5 << 16));
    }

    private static int u(Parcel parcel, int i4) {
        parcel.writeInt(i4 | (-65536));
        parcel.writeInt(0);
        return parcel.dataPosition();
    }

    private static void v(Parcel parcel, int i4) {
        int dataPosition = parcel.dataPosition();
        parcel.setDataPosition(i4 - 4);
        parcel.writeInt(dataPosition - i4);
        parcel.setDataPosition(dataPosition);
    }

    private static void w(Parcel parcel, Parcelable parcelable, int i4) {
        int dataPosition = parcel.dataPosition();
        parcel.writeInt(1);
        int dataPosition2 = parcel.dataPosition();
        parcelable.writeToParcel(parcel, i4);
        int dataPosition3 = parcel.dataPosition();
        parcel.setDataPosition(dataPosition);
        parcel.writeInt(dataPosition3 - dataPosition2);
        parcel.setDataPosition(dataPosition3);
    }
}
