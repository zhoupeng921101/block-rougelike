package com.google.android.gms.internal.play_billing;

import com.android.support.BuildConfig;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.love2d.android.GameActivity;
import sun.misc.Unsafe;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class d5 implements k5 {

    /* renamed from: l, reason: collision with root package name */
    private static final int[] f2734l = new int[0];

    /* renamed from: m, reason: collision with root package name */
    private static final Unsafe f2735m = x5.l();

    /* renamed from: a, reason: collision with root package name */
    private final int[] f2736a;

    /* renamed from: b, reason: collision with root package name */
    private final Object[] f2737b;

    /* renamed from: c, reason: collision with root package name */
    private final int f2738c;

    /* renamed from: d, reason: collision with root package name */
    private final int f2739d;

    /* renamed from: e, reason: collision with root package name */
    private final a5 f2740e;

    /* renamed from: f, reason: collision with root package name */
    private final boolean f2741f = false;

    /* renamed from: g, reason: collision with root package name */
    private final int[] f2742g;

    /* renamed from: h, reason: collision with root package name */
    private final int f2743h;

    /* renamed from: i, reason: collision with root package name */
    private final int f2744i;

    /* renamed from: j, reason: collision with root package name */
    private final q5 f2745j;

    /* renamed from: k, reason: collision with root package name */
    private final w3 f2746k;

    private d5(int[] iArr, Object[] objArr, int i4, int i5, a5 a5Var, boolean z3, int[] iArr2, int i6, int i7, f5 f5Var, o4 o4Var, q5 q5Var, w3 w3Var, u4 u4Var) {
        this.f2736a = iArr;
        this.f2737b = objArr;
        this.f2738c = i4;
        this.f2739d = i5;
        this.f2742g = iArr2;
        this.f2743h = i6;
        this.f2744i = i7;
        this.f2745j = q5Var;
        this.f2746k = w3Var;
        this.f2740e = a5Var;
    }

    /* JADX WARN: Removed duplicated region for block: B:104:0x0350  */
    /* JADX WARN: Removed duplicated region for block: B:121:0x03b0  */
    /* JADX WARN: Removed duplicated region for block: B:63:0x026e  */
    /* JADX WARN: Removed duplicated region for block: B:67:0x028c  */
    /* JADX WARN: Removed duplicated region for block: B:83:0x028f  */
    /* JADX WARN: Removed duplicated region for block: B:84:0x0274  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    static com.google.android.gms.internal.play_billing.d5 A(java.lang.Class r32, com.google.android.gms.internal.play_billing.w4 r33, com.google.android.gms.internal.play_billing.f5 r34, com.google.android.gms.internal.play_billing.o4 r35, com.google.android.gms.internal.play_billing.q5 r36, com.google.android.gms.internal.play_billing.w3 r37, com.google.android.gms.internal.play_billing.u4 r38) {
        /*
            Method dump skipped, instructions count: 1047
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.internal.play_billing.d5.A(java.lang.Class, com.google.android.gms.internal.play_billing.w4, com.google.android.gms.internal.play_billing.f5, com.google.android.gms.internal.play_billing.o4, com.google.android.gms.internal.play_billing.q5, com.google.android.gms.internal.play_billing.w3, com.google.android.gms.internal.play_billing.u4):com.google.android.gms.internal.play_billing.d5");
    }

    private static double B(Object obj, long j4) {
        return ((Double) x5.k(obj, j4)).doubleValue();
    }

    private static float C(Object obj, long j4) {
        return ((Float) x5.k(obj, j4)).floatValue();
    }

    private static int D(Object obj, long j4) {
        return ((Integer) x5.k(obj, j4)).intValue();
    }

    private final int E(int i4) {
        return this.f2736a[i4 + 2];
    }

    private final int F(int i4, int i5) {
        int[] iArr = this.f2736a;
        int length = (iArr.length / 3) - 1;
        while (i5 <= length) {
            int i6 = (length + i5) >>> 1;
            int i7 = i6 * 3;
            int i8 = iArr[i7];
            if (i4 == i8) {
                return i7;
            }
            if (i4 < i8) {
                length = i6 - 1;
            } else {
                i5 = i6 + 1;
            }
        }
        return -1;
    }

    private static int G(int i4) {
        return (i4 >>> 20) & 255;
    }

    private final int H(int i4) {
        return this.f2736a[i4 + 1];
    }

    private static long I(Object obj, long j4) {
        return ((Long) x5.k(obj, j4)).longValue();
    }

    private final g4 J(int i4) {
        int i5 = i4 / 3;
        return (g4) this.f2737b[i5 + i5 + 1];
    }

    private final k5 K(int i4) {
        Object[] objArr = this.f2737b;
        int i5 = i4 / 3;
        int i6 = i5 + i5;
        k5 k5Var = (k5) objArr[i6];
        if (k5Var != null) {
            return k5Var;
        }
        k5 b4 = h5.a().b((Class) objArr[i6 + 1]);
        objArr[i6] = b4;
        return b4;
    }

    private final Object L(int i4) {
        int i5 = i4 / 3;
        return this.f2737b[i5 + i5];
    }

    private final Object M(Object obj, int i4) {
        k5 K = K(i4);
        int H = H(i4) & 1048575;
        if (!r(obj, i4)) {
            return K.e();
        }
        Object object = f2735m.getObject(obj, H);
        if (u(object)) {
            return object;
        }
        Object e4 = K.e();
        if (object != null) {
            K.j(e4, object);
        }
        return e4;
    }

    private final Object N(Object obj, int i4, int i5) {
        k5 K = K(i5);
        if (!v(obj, i4, i5)) {
            return K.e();
        }
        Object object = f2735m.getObject(obj, H(i5) & 1048575);
        if (u(object)) {
            return object;
        }
        Object e4 = K.e();
        if (object != null) {
            K.j(e4, object);
        }
        return e4;
    }

    private static Field O(Class cls, String str) {
        try {
            return cls.getDeclaredField(str);
        } catch (NoSuchFieldException e4) {
            Field[] declaredFields = cls.getDeclaredFields();
            for (Field field : declaredFields) {
                if (str.equals(field.getName())) {
                    return field;
                }
            }
            throw new RuntimeException(a1.b2.c3.d4(480) + str + " for " + cls.getName() + " not found. Known fields are " + Arrays.toString(declaredFields), e4);
        }
    }

    private static void b(Object obj) {
        if (!u(obj)) {
            throw new IllegalArgumentException("Mutating immutable message: ".concat(String.valueOf(obj)));
        }
    }

    private final void c(Object obj, Object obj2, int i4) {
        if (r(obj2, i4)) {
            int H = H(i4) & 1048575;
            Unsafe unsafe = f2735m;
            long j4 = H;
            Object object = unsafe.getObject(obj2, j4);
            if (object == null) {
                throw new IllegalStateException("Source subfield " + this.f2736a[i4] + a1.b2.c3.d4(927) + obj2.toString());
            }
            k5 K = K(i4);
            if (!r(obj, i4)) {
                if (u(object)) {
                    Object e4 = K.e();
                    K.j(e4, object);
                    unsafe.putObject(obj, j4, e4);
                } else {
                    unsafe.putObject(obj, j4, object);
                }
                m(obj, i4);
                return;
            }
            Object object2 = unsafe.getObject(obj, j4);
            if (!u(object2)) {
                Object e5 = K.e();
                K.j(e5, object2);
                unsafe.putObject(obj, j4, e5);
                object2 = e5;
            }
            K.j(object2, object);
        }
    }

    private final void d(Object obj, Object obj2, int i4) {
        int[] iArr = this.f2736a;
        int i5 = iArr[i4];
        if (v(obj2, i5, i4)) {
            int H = H(i4) & 1048575;
            Unsafe unsafe = f2735m;
            long j4 = H;
            Object object = unsafe.getObject(obj2, j4);
            if (object == null) {
                throw new IllegalStateException("Source subfield " + iArr[i4] + " is present but null: " + obj2.toString());
            }
            k5 K = K(i4);
            if (!v(obj, i5, i4)) {
                if (u(object)) {
                    Object e4 = K.e();
                    K.j(e4, object);
                    unsafe.putObject(obj, j4, e4);
                } else {
                    unsafe.putObject(obj, j4, object);
                }
                n(obj, i5, i4);
                return;
            }
            Object object2 = unsafe.getObject(obj, j4);
            if (!u(object2)) {
                Object e5 = K.e();
                K.j(e5, object2);
                unsafe.putObject(obj, j4, e5);
                object2 = e5;
            }
            K.j(object2, object);
        }
    }

    private final void m(Object obj, int i4) {
        int E = E(i4);
        long j4 = 1048575 & E;
        if (j4 == 1048575) {
            return;
        }
        x5.v(obj, j4, (1 << (E >>> 20)) | x5.h(obj, j4));
    }

    private final void n(Object obj, int i4, int i5) {
        x5.v(obj, E(i5) & 1048575, i4);
    }

    private final void o(Object obj, int i4, Object obj2) {
        f2735m.putObject(obj, H(i4) & 1048575, obj2);
        m(obj, i4);
    }

    private final void p(Object obj, int i4, int i5, Object obj2) {
        f2735m.putObject(obj, H(i5) & 1048575, obj2);
        n(obj, i4, i5);
    }

    private final boolean q(Object obj, Object obj2, int i4) {
        return r(obj, i4) == r(obj2, i4);
    }

    private final boolean r(Object obj, int i4) {
        int E = E(i4);
        long j4 = E & 1048575;
        if (j4 != 1048575) {
            return (x5.h(obj, j4) & (1 << (E >>> 20))) != 0;
        }
        int H = H(i4);
        long j5 = H & 1048575;
        switch (G(H)) {
            case 0:
                return Double.doubleToRawLongBits(x5.f(obj, j5)) != 0;
            case BuildConfig.VERSION_CODE /* 1 */:
                return Float.floatToRawIntBits(x5.g(obj, j5)) != 0;
            case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                return x5.i(obj, j5) != 0;
            case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                return x5.i(obj, j5) != 0;
            case 4:
                return x5.h(obj, j5) != 0;
            case 5:
                return x5.i(obj, j5) != 0;
            case 6:
                return x5.h(obj, j5) != 0;
            case 7:
                return x5.B(obj, j5);
            case 8:
                Object k4 = x5.k(obj, j5);
                if (k4 instanceof String) {
                    return !((String) k4).isEmpty();
                }
                if (k4 instanceof j3) {
                    return !j3.f2809f.equals(k4);
                }
                throw new IllegalArgumentException();
            case 9:
                return x5.k(obj, j5) != null;
            case 10:
                return !j3.f2809f.equals(x5.k(obj, j5));
            case 11:
                return x5.h(obj, j5) != 0;
            case 12:
                return x5.h(obj, j5) != 0;
            case 13:
                return x5.h(obj, j5) != 0;
            case 14:
                return x5.i(obj, j5) != 0;
            case 15:
                return x5.h(obj, j5) != 0;
            case 16:
                return x5.i(obj, j5) != 0;
            case 17:
                return x5.k(obj, j5) != null;
            default:
                throw new IllegalArgumentException();
        }
    }

    private final boolean s(Object obj, int i4, int i5, int i6, int i7) {
        return i5 == 1048575 ? r(obj, i4) : (i6 & i7) != 0;
    }

    private static boolean t(Object obj, int i4, k5 k5Var) {
        return k5Var.l(x5.k(obj, i4 & 1048575));
    }

    private static boolean u(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj instanceof d4) {
            return ((d4) obj).l();
        }
        return true;
    }

    private final boolean v(Object obj, int i4, int i5) {
        return x5.h(obj, (long) (E(i5) & 1048575)) == i4;
    }

    private static boolean w(Object obj, long j4) {
        return ((Boolean) x5.k(obj, j4)).booleanValue();
    }

    private static final void x(int i4, Object obj, c6 c6Var) {
        if (obj instanceof String) {
            c6Var.I(i4, (String) obj);
        } else {
            c6Var.n(i4, (j3) obj);
        }
    }

    static r5 z(Object obj) {
        d4 d4Var = (d4) obj;
        r5 r5Var = d4Var.zzc;
        if (r5Var != r5.c()) {
            return r5Var;
        }
        r5 f4 = r5.f();
        d4Var.zzc = f4;
        return f4;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final int a(Object obj) {
        int i4;
        long doubleToLongBits;
        int floatToIntBits;
        int i5;
        int i6 = 0;
        int i7 = 0;
        while (true) {
            int[] iArr = this.f2736a;
            if (i6 >= iArr.length) {
                int hashCode = (i7 * 53) + ((d4) obj).zzc.hashCode();
                if (!this.f2741f) {
                    return hashCode;
                }
                h.d.a(obj);
                throw null;
            }
            int H = H(i6);
            int i8 = 1048575 & H;
            int G = G(H);
            int i9 = iArr[i6];
            long j4 = i8;
            int i10 = 37;
            switch (G) {
                case 0:
                    i4 = i7 * 53;
                    doubleToLongBits = Double.doubleToLongBits(x5.f(obj, j4));
                    byte[] bArr = k4.f2839b;
                    floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                    i7 = i4 + floatToIntBits;
                    break;
                case BuildConfig.VERSION_CODE /* 1 */:
                    i4 = i7 * 53;
                    floatToIntBits = Float.floatToIntBits(x5.g(obj, j4));
                    i7 = i4 + floatToIntBits;
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    i4 = i7 * 53;
                    doubleToLongBits = x5.i(obj, j4);
                    byte[] bArr2 = k4.f2839b;
                    floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                    i7 = i4 + floatToIntBits;
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    i4 = i7 * 53;
                    doubleToLongBits = x5.i(obj, j4);
                    byte[] bArr3 = k4.f2839b;
                    floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                    i7 = i4 + floatToIntBits;
                    break;
                case 4:
                    i4 = i7 * 53;
                    floatToIntBits = x5.h(obj, j4);
                    i7 = i4 + floatToIntBits;
                    break;
                case 5:
                    i4 = i7 * 53;
                    doubleToLongBits = x5.i(obj, j4);
                    byte[] bArr4 = k4.f2839b;
                    floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                    i7 = i4 + floatToIntBits;
                    break;
                case 6:
                    i4 = i7 * 53;
                    floatToIntBits = x5.h(obj, j4);
                    i7 = i4 + floatToIntBits;
                    break;
                case 7:
                    i4 = i7 * 53;
                    floatToIntBits = k4.a(x5.B(obj, j4));
                    i7 = i4 + floatToIntBits;
                    break;
                case 8:
                    i4 = i7 * 53;
                    floatToIntBits = ((String) x5.k(obj, j4)).hashCode();
                    i7 = i4 + floatToIntBits;
                    break;
                case 9:
                    i5 = i7 * 53;
                    Object k4 = x5.k(obj, j4);
                    if (k4 != null) {
                        i10 = k4.hashCode();
                    }
                    i7 = i5 + i10;
                    break;
                case 10:
                    i4 = i7 * 53;
                    floatToIntBits = x5.k(obj, j4).hashCode();
                    i7 = i4 + floatToIntBits;
                    break;
                case 11:
                    i4 = i7 * 53;
                    floatToIntBits = x5.h(obj, j4);
                    i7 = i4 + floatToIntBits;
                    break;
                case 12:
                    i4 = i7 * 53;
                    floatToIntBits = x5.h(obj, j4);
                    i7 = i4 + floatToIntBits;
                    break;
                case 13:
                    i4 = i7 * 53;
                    floatToIntBits = x5.h(obj, j4);
                    i7 = i4 + floatToIntBits;
                    break;
                case 14:
                    i4 = i7 * 53;
                    doubleToLongBits = x5.i(obj, j4);
                    byte[] bArr5 = k4.f2839b;
                    floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                    i7 = i4 + floatToIntBits;
                    break;
                case 15:
                    i4 = i7 * 53;
                    floatToIntBits = x5.h(obj, j4);
                    i7 = i4 + floatToIntBits;
                    break;
                case 16:
                    i4 = i7 * 53;
                    doubleToLongBits = x5.i(obj, j4);
                    byte[] bArr6 = k4.f2839b;
                    floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                    i7 = i4 + floatToIntBits;
                    break;
                case 17:
                    i5 = i7 * 53;
                    Object k5 = x5.k(obj, j4);
                    if (k5 != null) {
                        i10 = k5.hashCode();
                    }
                    i7 = i5 + i10;
                    break;
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 36:
                case 37:
                case 38:
                case 39:
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                    i4 = i7 * 53;
                    floatToIntBits = x5.k(obj, j4).hashCode();
                    i7 = i4 + floatToIntBits;
                    break;
                case 50:
                    i4 = i7 * 53;
                    floatToIntBits = x5.k(obj, j4).hashCode();
                    i7 = i4 + floatToIntBits;
                    break;
                case 51:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        doubleToLongBits = Double.doubleToLongBits(B(obj, j4));
                        byte[] bArr7 = k4.f2839b;
                        floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 52:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = Float.floatToIntBits(C(obj, j4));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 53:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        doubleToLongBits = I(obj, j4);
                        byte[] bArr8 = k4.f2839b;
                        floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 54:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        doubleToLongBits = I(obj, j4);
                        byte[] bArr9 = k4.f2839b;
                        floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 55:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = D(obj, j4);
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 56:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        doubleToLongBits = I(obj, j4);
                        byte[] bArr10 = k4.f2839b;
                        floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 57:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = D(obj, j4);
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 58:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = k4.a(w(obj, j4));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 59:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = ((String) x5.k(obj, j4)).hashCode();
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 60:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = x5.k(obj, j4).hashCode();
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 61:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = x5.k(obj, j4).hashCode();
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 62:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = D(obj, j4);
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 63:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = D(obj, j4);
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 64:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = D(obj, j4);
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 65:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        doubleToLongBits = I(obj, j4);
                        byte[] bArr11 = k4.f2839b;
                        floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 66:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = D(obj, j4);
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 67:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        doubleToLongBits = I(obj, j4);
                        byte[] bArr12 = k4.f2839b;
                        floatToIntBits = (int) (doubleToLongBits ^ (doubleToLongBits >>> 32));
                        i7 = i4 + floatToIntBits;
                        break;
                    }
                case 68:
                    if (!v(obj, i9, i6)) {
                        break;
                    } else {
                        i4 = i7 * 53;
                        floatToIntBits = x5.k(obj, j4).hashCode();
                        i7 = i4 + floatToIntBits;
                        break;
                    }
            }
            i6 += 3;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final Object e() {
        return ((d4) this.f2740e).v();
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void f(Object obj, byte[] bArr, int i4, int i5, z2 z2Var) {
        y(obj, bArr, i4, i5, 0, z2Var);
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void g(Object obj) {
        if (u(obj)) {
            if (obj instanceof d4) {
                d4 d4Var = (d4) obj;
                d4Var.k(Integer.MAX_VALUE);
                d4Var.zza = 0;
                d4Var.i();
            }
            int[] iArr = this.f2736a;
            for (int i4 = 0; i4 < iArr.length; i4 += 3) {
                int H = H(i4);
                int i5 = 1048575 & H;
                int G = G(H);
                long j4 = i5;
                if (G != 9) {
                    if (G != 60 && G != 68) {
                        switch (G) {
                            case 18:
                            case 19:
                            case 20:
                            case 21:
                            case 22:
                            case 23:
                            case 24:
                            case 25:
                            case 26:
                            case 27:
                            case 28:
                            case 29:
                            case 30:
                            case 31:
                            case 32:
                            case 33:
                            case 34:
                            case 35:
                            case 36:
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                            case 41:
                            case 42:
                            case 43:
                            case 44:
                            case 45:
                            case 46:
                            case 47:
                            case 48:
                            case 49:
                                ((i4) x5.k(obj, j4)).b();
                                break;
                            case 50:
                                Unsafe unsafe = f2735m;
                                Object object = unsafe.getObject(obj, j4);
                                if (object != null) {
                                    ((t4) object).c();
                                    unsafe.putObject(obj, j4, object);
                                    break;
                                } else {
                                    break;
                                }
                        }
                    } else if (v(obj, iArr[i4], i4)) {
                        K(i4).g(f2735m.getObject(obj, j4));
                    }
                }
                if (r(obj, i4)) {
                    K(i4).g(f2735m.getObject(obj, j4));
                }
            }
            this.f2745j.b(obj);
            if (this.f2741f) {
                this.f2746k.a(obj);
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void h(Object obj, c6 c6Var) {
        Throwable th;
        int i4;
        d5 d5Var = this;
        if (d5Var.f2741f) {
            h.d.a(obj);
            throw null;
        }
        int[] iArr = d5Var.f2736a;
        Unsafe unsafe = f2735m;
        int i5 = 1048575;
        int i6 = 1048575;
        int i7 = 0;
        int i8 = 0;
        while (i7 < iArr.length) {
            int H = d5Var.H(i7);
            int G = G(H);
            int i9 = iArr[i7];
            if (G <= 17) {
                int i10 = iArr[i7 + 2];
                th = null;
                int i11 = i10 & i5;
                if (i11 != i6) {
                    i8 = i11 == i5 ? 0 : unsafe.getInt(obj, i11);
                    i6 = i11;
                }
                i4 = 1 << (i10 >>> 20);
            } else {
                th = null;
                i4 = 0;
            }
            long j4 = H & i5;
            switch (G) {
                case 0:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.b(i9, x5.f(obj, j4));
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case BuildConfig.VERSION_CODE /* 1 */:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.f(i9, x5.g(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.r(i9, unsafe.getLong(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.a(i9, unsafe.getLong(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 4:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.J(i9, unsafe.getInt(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 5:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.B(i9, unsafe.getLong(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 6:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.k(i9, unsafe.getInt(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 7:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.l(i9, x5.B(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 8:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        x(i9, unsafe.getObject(obj, j4), c6Var);
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 9:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.A(i9, unsafe.getObject(obj, j4), d5Var.K(i7));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 10:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.n(i9, (j3) unsafe.getObject(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 11:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.w(i9, unsafe.getInt(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 12:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.D(i9, unsafe.getInt(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 13:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.u(i9, unsafe.getInt(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 14:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.q(i9, unsafe.getLong(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 15:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.G(i9, unsafe.getInt(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 16:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.m(i9, unsafe.getLong(obj, j4));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 17:
                    if (d5Var.s(obj, i7, i6, i8, i4)) {
                        c6Var.p(i9, unsafe.getObject(obj, j4), d5Var.K(i7));
                    } else {
                        continue;
                    }
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 18:
                    m5.y(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 19:
                    m5.C(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 20:
                    m5.E(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 21:
                    m5.e(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 22:
                    m5.D(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 23:
                    m5.B(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 24:
                    m5.A(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 25:
                    m5.x(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 26:
                    int i12 = iArr[i7];
                    List list = (List) unsafe.getObject(obj, j4);
                    int i13 = m5.f2865b;
                    if (list != null && !list.isEmpty()) {
                        c6Var.s(i12, list);
                        break;
                    }
                    break;
                case 27:
                    int i14 = iArr[i7];
                    List list2 = (List) unsafe.getObject(obj, j4);
                    k5 K = d5Var.K(i7);
                    int i15 = m5.f2865b;
                    if (list2 != null && !list2.isEmpty()) {
                        for (int i16 = 0; i16 < list2.size(); i16++) {
                            ((s3) c6Var).A(i14, list2.get(i16), K);
                        }
                        break;
                    }
                    break;
                case 28:
                    int i17 = iArr[i7];
                    List list3 = (List) unsafe.getObject(obj, j4);
                    int i18 = m5.f2865b;
                    if (list3 != null && !list3.isEmpty()) {
                        c6Var.d(i17, list3);
                        break;
                    }
                    break;
                case 29:
                    m5.d(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 30:
                    m5.z(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 31:
                    m5.F(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 32:
                    m5.a(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 33:
                    m5.b(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 34:
                    m5.c(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, false);
                    continue;
                    i7 += 3;
                    i5 = 1048575;
                    d5Var = this;
                case 35:
                    m5.y(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 36:
                    m5.C(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 37:
                    m5.E(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 38:
                    m5.e(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 39:
                    m5.D(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 40:
                    m5.B(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 41:
                    m5.A(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 42:
                    m5.x(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 43:
                    m5.d(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 44:
                    m5.z(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 45:
                    m5.F(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 46:
                    m5.a(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 47:
                    m5.b(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 48:
                    m5.c(iArr[i7], (List) unsafe.getObject(obj, j4), c6Var, true);
                    break;
                case 49:
                    int i19 = iArr[i7];
                    List list4 = (List) unsafe.getObject(obj, j4);
                    k5 K2 = d5Var.K(i7);
                    int i20 = m5.f2865b;
                    if (list4 != null && !list4.isEmpty()) {
                        for (int i21 = 0; i21 < list4.size(); i21++) {
                            ((s3) c6Var).p(i19, list4.get(i21), K2);
                        }
                        break;
                    }
                    break;
                case 50:
                    if (unsafe.getObject(obj, j4) != null) {
                        h.d.a(d5Var.L(i7));
                        throw th;
                    }
                    break;
                case 51:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.b(i9, B(obj, j4));
                        break;
                    }
                    break;
                case 52:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.f(i9, C(obj, j4));
                        break;
                    }
                    break;
                case 53:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.r(i9, I(obj, j4));
                        break;
                    }
                    break;
                case 54:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.a(i9, I(obj, j4));
                        break;
                    }
                    break;
                case 55:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.J(i9, D(obj, j4));
                        break;
                    }
                    break;
                case 56:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.B(i9, I(obj, j4));
                        break;
                    }
                    break;
                case 57:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.k(i9, D(obj, j4));
                        break;
                    }
                    break;
                case 58:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.l(i9, w(obj, j4));
                        break;
                    }
                    break;
                case 59:
                    if (d5Var.v(obj, i9, i7)) {
                        x(i9, unsafe.getObject(obj, j4), c6Var);
                        break;
                    }
                    break;
                case 60:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.A(i9, unsafe.getObject(obj, j4), d5Var.K(i7));
                        break;
                    }
                    break;
                case 61:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.n(i9, (j3) unsafe.getObject(obj, j4));
                        break;
                    }
                    break;
                case 62:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.w(i9, D(obj, j4));
                        break;
                    }
                    break;
                case 63:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.D(i9, D(obj, j4));
                        break;
                    }
                    break;
                case 64:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.u(i9, D(obj, j4));
                        break;
                    }
                    break;
                case 65:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.q(i9, I(obj, j4));
                        break;
                    }
                    break;
                case 66:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.G(i9, D(obj, j4));
                        break;
                    }
                    break;
                case 67:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.m(i9, I(obj, j4));
                        break;
                    }
                    break;
                case 68:
                    if (d5Var.v(obj, i9, i7)) {
                        c6Var.p(i9, unsafe.getObject(obj, j4), d5Var.K(i7));
                        break;
                    }
                    break;
            }
            i7 += 3;
            i5 = 1048575;
            d5Var = this;
        }
        ((d4) obj).zzc.k(c6Var);
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final int i(Object obj) {
        int i4;
        int s3;
        int s4;
        int t3;
        int s5;
        int s6;
        int s7;
        int b4;
        int s8;
        int o3;
        int n3;
        int size;
        int s9;
        int s10;
        int b5;
        int s11;
        int s12;
        int s13;
        int i5;
        int l3;
        int s14;
        int s15;
        int i6;
        int s16;
        int s17;
        int s18;
        int b6;
        int s19;
        d5 d5Var = this;
        Object obj2 = obj;
        Unsafe unsafe = f2735m;
        int i7 = 0;
        int i8 = 0;
        int i9 = 0;
        int i10 = 1048575;
        while (true) {
            int[] iArr = d5Var.f2736a;
            if (i7 >= iArr.length) {
                int a4 = i9 + ((d4) obj).zzc.a();
                if (!d5Var.f2741f) {
                    return a4;
                }
                h.d.a(obj);
                throw null;
            }
            int H = d5Var.H(i7);
            int G = G(H);
            int i11 = iArr[i7];
            int i12 = iArr[i7 + 2];
            int i13 = i12 & 1048575;
            if (G <= 17) {
                if (i13 != i10) {
                    i8 = i13 == 1048575 ? 0 : unsafe.getInt(obj2, i13);
                    i10 = i13;
                }
                i4 = 1 << (i12 >>> 20);
            } else {
                i4 = 0;
            }
            int i14 = H & 1048575;
            if (G >= z3.O.a()) {
                z3.f3050b0.a();
            }
            long j4 = i14;
            switch (G) {
                case 0:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        i9 += r3.s(i11 << 3) + 8;
                    }
                    i7 += 3;
                    obj2 = obj;
                case BuildConfig.VERSION_CODE /* 1 */:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        s3 = r3.s(i11 << 3);
                        s6 = s3 + 4;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        long j5 = unsafe.getLong(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.t(j5);
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        long j6 = unsafe.getLong(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.t(j6);
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 4:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        long j7 = unsafe.getInt(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.t(j7);
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 5:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        s5 = r3.s(i11 << 3);
                        s6 = s5 + 8;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 6:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        s3 = r3.s(i11 << 3);
                        s6 = s3 + 4;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 7:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        s6 = r3.s(i11 << 3) + 1;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 8:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        int i15 = i11 << 3;
                        Object object = unsafe.getObject(obj2, j4);
                        if (object instanceof j3) {
                            s7 = r3.s(i15);
                            b4 = ((j3) object).g();
                            s8 = r3.s(b4);
                        } else {
                            s7 = r3.s(i15);
                            b4 = b6.b((String) object);
                            s8 = r3.s(b4);
                        }
                        s6 = s7 + s8 + b4;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 9:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        o3 = m5.o(i11, unsafe.getObject(obj2, j4), d5Var.K(i7));
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 10:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        j3 j3Var = (j3) unsafe.getObject(obj2, j4);
                        s7 = r3.s(i11 << 3);
                        b4 = j3Var.g();
                        s8 = r3.s(b4);
                        s6 = s7 + s8 + b4;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 11:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        int i16 = unsafe.getInt(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.s(i16);
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 12:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        long j8 = unsafe.getInt(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.t(j8);
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 13:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        s3 = r3.s(i11 << 3);
                        s6 = s3 + 4;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 14:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        s5 = r3.s(i11 << 3);
                        s6 = s5 + 8;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 15:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        int i17 = unsafe.getInt(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.s((i17 >> 31) ^ (i17 + i17));
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 16:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        long j9 = unsafe.getLong(obj2, j4);
                        s4 = r3.s(i11 << 3);
                        t3 = r3.t((j9 >> 63) ^ (j9 + j9));
                        s6 = s4 + t3;
                        i9 += s6;
                    }
                    d5Var = this;
                    i7 += 3;
                    obj2 = obj;
                case 17:
                    if (d5Var.s(obj2, i7, i10, i8, i4)) {
                        o3 = m5.g(i11, (a5) unsafe.getObject(obj2, j4), d5Var.K(i7));
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 18:
                    o3 = m5.k(i11, (List) unsafe.getObject(obj2, j4), false);
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 19:
                    o3 = m5.i(i11, (List) unsafe.getObject(obj2, j4), false);
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 20:
                    List list = (List) unsafe.getObject(obj2, j4);
                    int i18 = m5.f2865b;
                    if (list.size() != 0) {
                        n3 = m5.n(list) + (list.size() * r3.s(i11 << 3));
                        i9 += n3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    n3 = 0;
                    i9 += n3;
                    i7 += 3;
                    obj2 = obj;
                case 21:
                    List list2 = (List) unsafe.getObject(obj2, j4);
                    int i19 = m5.f2865b;
                    size = list2.size();
                    if (size != 0) {
                        s9 = m5.s(list2);
                        s10 = r3.s(i11 << 3);
                        i5 = size * s10;
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 22:
                    List list3 = (List) unsafe.getObject(obj2, j4);
                    int i20 = m5.f2865b;
                    size = list3.size();
                    if (size != 0) {
                        s9 = m5.m(list3);
                        s10 = r3.s(i11 << 3);
                        i5 = size * s10;
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 23:
                    o3 = m5.k(i11, (List) unsafe.getObject(obj2, j4), false);
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 24:
                    o3 = m5.i(i11, (List) unsafe.getObject(obj2, j4), false);
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 25:
                    List list4 = (List) unsafe.getObject(obj2, j4);
                    int i21 = m5.f2865b;
                    int size2 = list4.size();
                    if (size2 != 0) {
                        o3 = size2 * (r3.s(i11 << 3) + 1);
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 26:
                    List list5 = (List) unsafe.getObject(obj2, j4);
                    int i22 = m5.f2865b;
                    int size3 = list5.size();
                    if (size3 != 0) {
                        n3 = r3.s(i11 << 3) * size3;
                        for (int i23 = 0; i23 < size3; i23++) {
                            Object obj3 = list5.get(i23);
                            if (obj3 instanceof j3) {
                                b5 = ((j3) obj3).g();
                                s11 = r3.s(b5);
                            } else {
                                b5 = b6.b((String) obj3);
                                s11 = r3.s(b5);
                            }
                            n3 += s11 + b5;
                        }
                        i9 += n3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    n3 = 0;
                    i9 += n3;
                    i7 += 3;
                    obj2 = obj;
                case 27:
                    List list6 = (List) unsafe.getObject(obj2, j4);
                    k5 K = d5Var.K(i7);
                    int i24 = m5.f2865b;
                    int size4 = list6.size();
                    if (size4 == 0) {
                        s12 = 0;
                    } else {
                        s12 = r3.s(i11 << 3) * size4;
                        for (int i25 = 0; i25 < size4; i25++) {
                            int c4 = ((w2) list6.get(i25)).c(K);
                            s12 += r3.s(c4) + c4;
                        }
                    }
                    i9 += s12;
                    i7 += 3;
                    obj2 = obj;
                case 28:
                    List list7 = (List) unsafe.getObject(obj2, j4);
                    int i26 = m5.f2865b;
                    int size5 = list7.size();
                    if (size5 == 0) {
                        s13 = 0;
                    } else {
                        s13 = size5 * r3.s(i11 << 3);
                        for (int i27 = 0; i27 < list7.size(); i27++) {
                            int g4 = ((j3) list7.get(i27)).g();
                            s13 += r3.s(g4) + g4;
                        }
                    }
                    i9 += s13;
                    i7 += 3;
                    obj2 = obj;
                case 29:
                    List list8 = (List) unsafe.getObject(obj2, j4);
                    int i28 = m5.f2865b;
                    size = list8.size();
                    if (size != 0) {
                        s9 = m5.r(list8);
                        s10 = r3.s(i11 << 3);
                        i5 = size * s10;
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 30:
                    List list9 = (List) unsafe.getObject(obj2, j4);
                    int i29 = m5.f2865b;
                    size = list9.size();
                    if (size != 0) {
                        s9 = m5.h(list9);
                        s10 = r3.s(i11 << 3);
                        i5 = size * s10;
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 31:
                    o3 = m5.i(i11, (List) unsafe.getObject(obj2, j4), false);
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 32:
                    o3 = m5.k(i11, (List) unsafe.getObject(obj2, j4), false);
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 33:
                    List list10 = (List) unsafe.getObject(obj2, j4);
                    int i30 = m5.f2865b;
                    size = list10.size();
                    if (size != 0) {
                        s9 = m5.p(list10);
                        s10 = r3.s(i11 << 3);
                        i5 = size * s10;
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 34:
                    List list11 = (List) unsafe.getObject(obj2, j4);
                    int i31 = m5.f2865b;
                    size = list11.size();
                    if (size != 0) {
                        s9 = m5.q(list11);
                        s10 = r3.s(i11 << 3);
                        i5 = size * s10;
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    }
                    o3 = 0;
                    i9 += o3;
                    i7 += 3;
                    obj2 = obj;
                case 35:
                    l3 = m5.l((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 36:
                    l3 = m5.j((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 37:
                    l3 = m5.n((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 38:
                    l3 = m5.s((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 39:
                    l3 = m5.m((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 40:
                    l3 = m5.l((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 41:
                    l3 = m5.j((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 42:
                    List list12 = (List) unsafe.getObject(obj2, j4);
                    int i32 = m5.f2865b;
                    l3 = list12.size();
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 43:
                    l3 = m5.r((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 44:
                    l3 = m5.h((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 45:
                    l3 = m5.j((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 46:
                    l3 = m5.l((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 47:
                    l3 = m5.p((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 48:
                    l3 = m5.q((List) unsafe.getObject(obj2, j4));
                    if (l3 > 0) {
                        s14 = r3.s(i11 << 3);
                        s15 = r3.s(l3);
                        s13 = s14 + s15 + l3;
                        i9 += s13;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 49:
                    List list13 = (List) unsafe.getObject(obj2, j4);
                    k5 K2 = d5Var.K(i7);
                    int i33 = m5.f2865b;
                    int size6 = list13.size();
                    if (size6 == 0) {
                        i6 = 0;
                    } else {
                        i6 = 0;
                        for (int i34 = 0; i34 < size6; i34++) {
                            i6 += m5.g(i11, (a5) list13.get(i34), K2);
                        }
                    }
                    i9 += i6;
                    i7 += 3;
                    obj2 = obj;
                case 50:
                    t4 t4Var = (t4) unsafe.getObject(obj2, j4);
                    h.d.a(d5Var.L(i7));
                    if (t4Var.isEmpty()) {
                        continue;
                    } else {
                        Iterator it = t4Var.entrySet().iterator();
                        if (it.hasNext()) {
                            Map.Entry entry = (Map.Entry) it.next();
                            entry.getKey();
                            entry.getValue();
                            throw null;
                        }
                    }
                    i7 += 3;
                    obj2 = obj;
                case 51:
                    if (d5Var.v(obj2, i11, i7)) {
                        s16 = r3.s(i11 << 3);
                        o3 = s16 + 8;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 52:
                    if (d5Var.v(obj2, i11, i7)) {
                        s17 = r3.s(i11 << 3);
                        o3 = s17 + 4;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 53:
                    if (d5Var.v(obj2, i11, i7)) {
                        long I = I(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.t(I);
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 54:
                    if (d5Var.v(obj2, i11, i7)) {
                        long I2 = I(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.t(I2);
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 55:
                    if (d5Var.v(obj2, i11, i7)) {
                        long D = D(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.t(D);
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 56:
                    if (d5Var.v(obj2, i11, i7)) {
                        s16 = r3.s(i11 << 3);
                        o3 = s16 + 8;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 57:
                    if (d5Var.v(obj2, i11, i7)) {
                        s17 = r3.s(i11 << 3);
                        o3 = s17 + 4;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 58:
                    if (d5Var.v(obj2, i11, i7)) {
                        o3 = r3.s(i11 << 3) + 1;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 59:
                    if (d5Var.v(obj2, i11, i7)) {
                        int i35 = i11 << 3;
                        Object object2 = unsafe.getObject(obj2, j4);
                        if (object2 instanceof j3) {
                            s18 = r3.s(i35);
                            b6 = ((j3) object2).g();
                            s19 = r3.s(b6);
                        } else {
                            s18 = r3.s(i35);
                            b6 = b6.b((String) object2);
                            s19 = r3.s(b6);
                        }
                        o3 = s18 + s19 + b6;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 60:
                    if (d5Var.v(obj2, i11, i7)) {
                        o3 = m5.o(i11, unsafe.getObject(obj2, j4), d5Var.K(i7));
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 61:
                    if (d5Var.v(obj2, i11, i7)) {
                        j3 j3Var2 = (j3) unsafe.getObject(obj2, j4);
                        s18 = r3.s(i11 << 3);
                        b6 = j3Var2.g();
                        s19 = r3.s(b6);
                        o3 = s18 + s19 + b6;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 62:
                    if (d5Var.v(obj2, i11, i7)) {
                        int D2 = D(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.s(D2);
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 63:
                    if (d5Var.v(obj2, i11, i7)) {
                        long D3 = D(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.t(D3);
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 64:
                    if (d5Var.v(obj2, i11, i7)) {
                        s17 = r3.s(i11 << 3);
                        o3 = s17 + 4;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 65:
                    if (d5Var.v(obj2, i11, i7)) {
                        s16 = r3.s(i11 << 3);
                        o3 = s16 + 8;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 66:
                    if (d5Var.v(obj2, i11, i7)) {
                        int D4 = D(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.s((D4 >> 31) ^ (D4 + D4));
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 67:
                    if (d5Var.v(obj2, i11, i7)) {
                        long I3 = I(obj2, j4);
                        s9 = r3.s(i11 << 3);
                        i5 = r3.t((I3 >> 63) ^ (I3 + I3));
                        o3 = s9 + i5;
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                case 68:
                    if (d5Var.v(obj2, i11, i7)) {
                        o3 = m5.g(i11, (a5) unsafe.getObject(obj2, j4), d5Var.K(i7));
                        i9 += o3;
                        i7 += 3;
                        obj2 = obj;
                    } else {
                        i7 += 3;
                        obj2 = obj;
                    }
                default:
                    i7 += 3;
                    obj2 = obj;
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final void j(Object obj, Object obj2) {
        b(obj);
        obj2.getClass();
        int i4 = 0;
        while (true) {
            int[] iArr = this.f2736a;
            if (i4 >= iArr.length) {
                m5.w(this.f2745j, obj, obj2);
                if (this.f2741f) {
                    m5.v(this.f2746k, obj, obj2);
                    return;
                }
                return;
            }
            int H = H(i4);
            int i5 = 1048575 & H;
            int G = G(H);
            int i6 = iArr[i4];
            long j4 = i5;
            switch (G) {
                case 0:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.t(obj, j4, x5.f(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case BuildConfig.VERSION_CODE /* 1 */:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.u(obj, j4, x5.g(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.w(obj, j4, x5.i(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.w(obj, j4, x5.i(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 4:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.v(obj, j4, x5.h(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 5:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.w(obj, j4, x5.i(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 6:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.v(obj, j4, x5.h(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 7:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.r(obj, j4, x5.B(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 8:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.x(obj, j4, x5.k(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 9:
                    c(obj, obj2, i4);
                    break;
                case 10:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.x(obj, j4, x5.k(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 11:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.v(obj, j4, x5.h(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 12:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.v(obj, j4, x5.h(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 13:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.v(obj, j4, x5.h(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 14:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.w(obj, j4, x5.i(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 15:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.v(obj, j4, x5.h(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 16:
                    if (!r(obj2, i4)) {
                        break;
                    } else {
                        x5.w(obj, j4, x5.i(obj2, j4));
                        m(obj, i4);
                        break;
                    }
                case 17:
                    c(obj, obj2, i4);
                    break;
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 36:
                case 37:
                case 38:
                case 39:
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                    i4 i4Var = (i4) x5.k(obj, j4);
                    i4 i4Var2 = (i4) x5.k(obj2, j4);
                    int size = i4Var.size();
                    int size2 = i4Var2.size();
                    if (size > 0 && size2 > 0) {
                        if (!i4Var.c()) {
                            i4Var = i4Var.d(size2 + size);
                        }
                        i4Var.addAll(i4Var2);
                    }
                    if (size > 0) {
                        i4Var2 = i4Var;
                    }
                    x5.x(obj, j4, i4Var2);
                    break;
                case 50:
                    int i7 = m5.f2865b;
                    x5.x(obj, j4, u4.a(x5.k(obj, j4), x5.k(obj2, j4)));
                    break;
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                case 58:
                case 59:
                    if (!v(obj2, i6, i4)) {
                        break;
                    } else {
                        x5.x(obj, j4, x5.k(obj2, j4));
                        n(obj, i6, i4);
                        break;
                    }
                case 60:
                    d(obj, obj2, i4);
                    break;
                case 61:
                case 62:
                case 63:
                case 64:
                case 65:
                case 66:
                case 67:
                    if (!v(obj2, i6, i4)) {
                        break;
                    } else {
                        x5.x(obj, j4, x5.k(obj2, j4));
                        n(obj, i6, i4);
                        break;
                    }
                case 68:
                    d(obj, obj2, i4);
                    break;
            }
            i4 += 3;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final boolean k(Object obj, Object obj2) {
        boolean f4;
        for (int i4 = 0; i4 < this.f2736a.length; i4 += 3) {
            int H = H(i4);
            long j4 = H & 1048575;
            switch (G(H)) {
                case 0:
                    if (q(obj, obj2, i4) && Double.doubleToLongBits(x5.f(obj, j4)) == Double.doubleToLongBits(x5.f(obj2, j4))) {
                        continue;
                    }
                    return false;
                case BuildConfig.VERSION_CODE /* 1 */:
                    if (q(obj, obj2, i4) && Float.floatToIntBits(x5.g(obj, j4)) == Float.floatToIntBits(x5.g(obj2, j4))) {
                        continue;
                    }
                    return false;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    if (q(obj, obj2, i4) && x5.i(obj, j4) == x5.i(obj2, j4)) {
                        continue;
                    }
                    return false;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    if (q(obj, obj2, i4) && x5.i(obj, j4) == x5.i(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 4:
                    if (q(obj, obj2, i4) && x5.h(obj, j4) == x5.h(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 5:
                    if (q(obj, obj2, i4) && x5.i(obj, j4) == x5.i(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 6:
                    if (q(obj, obj2, i4) && x5.h(obj, j4) == x5.h(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 7:
                    if (q(obj, obj2, i4) && x5.B(obj, j4) == x5.B(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 8:
                    if (q(obj, obj2, i4) && m5.f(x5.k(obj, j4), x5.k(obj2, j4))) {
                        continue;
                    }
                    return false;
                case 9:
                    if (q(obj, obj2, i4) && m5.f(x5.k(obj, j4), x5.k(obj2, j4))) {
                        continue;
                    }
                    return false;
                case 10:
                    if (q(obj, obj2, i4) && m5.f(x5.k(obj, j4), x5.k(obj2, j4))) {
                        continue;
                    }
                    return false;
                case 11:
                    if (q(obj, obj2, i4) && x5.h(obj, j4) == x5.h(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 12:
                    if (q(obj, obj2, i4) && x5.h(obj, j4) == x5.h(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 13:
                    if (q(obj, obj2, i4) && x5.h(obj, j4) == x5.h(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 14:
                    if (q(obj, obj2, i4) && x5.i(obj, j4) == x5.i(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 15:
                    if (q(obj, obj2, i4) && x5.h(obj, j4) == x5.h(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 16:
                    if (q(obj, obj2, i4) && x5.i(obj, j4) == x5.i(obj2, j4)) {
                        continue;
                    }
                    return false;
                case 17:
                    if (q(obj, obj2, i4) && m5.f(x5.k(obj, j4), x5.k(obj2, j4))) {
                        continue;
                    }
                    return false;
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 36:
                case 37:
                case 38:
                case 39:
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                    f4 = m5.f(x5.k(obj, j4), x5.k(obj2, j4));
                    break;
                case 50:
                    f4 = m5.f(x5.k(obj, j4), x5.k(obj2, j4));
                    break;
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                case 58:
                case 59:
                case 60:
                case 61:
                case 62:
                case 63:
                case 64:
                case 65:
                case 66:
                case 67:
                case 68:
                    long E = E(i4) & 1048575;
                    if (x5.h(obj, E) == x5.h(obj2, E) && m5.f(x5.k(obj, j4), x5.k(obj2, j4))) {
                        continue;
                    }
                    return false;
                default:
            }
            if (!f4) {
                return false;
            }
        }
        if (!((d4) obj).zzc.equals(((d4) obj2).zzc)) {
            return false;
        }
        if (!this.f2741f) {
            return true;
        }
        h.d.a(obj);
        throw null;
    }

    @Override // com.google.android.gms.internal.play_billing.k5
    public final boolean l(Object obj) {
        int i4;
        int i5;
        int i6;
        int i7 = 0;
        int i8 = 0;
        int i9 = 1048575;
        while (i8 < this.f2743h) {
            int[] iArr = this.f2742g;
            int[] iArr2 = this.f2736a;
            int i10 = iArr[i8];
            int i11 = iArr2[i10];
            int H = H(i10);
            int i12 = iArr2[i10 + 2];
            int i13 = i12 & 1048575;
            int i14 = 1 << (i12 >>> 20);
            if (i13 != i9) {
                if (i13 != 1048575) {
                    i7 = f2735m.getInt(obj, i13);
                }
                i4 = i7;
                i9 = i13;
            } else {
                i4 = i7;
            }
            if ((268435456 & H) != 0) {
                i5 = i10;
                i6 = i9;
                if (!s(obj, i5, i6, i4, i14)) {
                    return false;
                }
            } else {
                i5 = i10;
                i6 = i9;
            }
            int G = G(H);
            if (G != 9 && G != 17) {
                if (G != 27) {
                    if (G == 60 || G == 68) {
                        if (v(obj, i11, i5) && !t(obj, H, K(i5))) {
                            return false;
                        }
                    } else if (G != 49) {
                        if (G == 50 && !((t4) x5.k(obj, H & 1048575)).isEmpty()) {
                            h.d.a(L(i5));
                            throw null;
                        }
                    }
                }
                List list = (List) x5.k(obj, H & 1048575);
                if (list.isEmpty()) {
                    continue;
                } else {
                    k5 K = K(i5);
                    for (int i15 = 0; i15 < list.size(); i15++) {
                        if (!K.l(list.get(i15))) {
                            return false;
                        }
                    }
                }
            } else if (s(obj, i5, i6, i4, i14) && !t(obj, H, K(i5))) {
                return false;
            }
            i8++;
            i9 = i6;
            i7 = i4;
        }
        if (!this.f2741f) {
            return true;
        }
        h.d.a(obj);
        throw null;
    }

    /*  JADX ERROR: Type inference failed
        jadx.core.utils.exceptions.JadxOverflowException: Type inference error: updates count limit reached
        	at jadx.core.utils.ErrorsCounter.addError(ErrorsCounter.java:59)
        	at jadx.core.utils.ErrorsCounter.error(ErrorsCounter.java:31)
        	at jadx.core.dex.attributes.nodes.NotificationAttrNode.addError(NotificationAttrNode.java:19)
        	at jadx.core.dex.visitors.typeinference.TypeInferenceVisitor.visit(TypeInferenceVisitor.java:77)
        */
    final int y(java.lang.Object r32, byte[] r33, int r34, int r35, int r36, com.google.android.gms.internal.play_billing.z2 r37) {
        /*
            Method dump skipped, instructions count: 3406
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.google.android.gms.internal.play_billing.d5.y(java.lang.Object, byte[], int, int, int, com.google.android.gms.internal.play_billing.z2):int");
    }
}
