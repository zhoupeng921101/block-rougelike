package com.google.android.gms.internal.play_billing;

import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class m5 {

    /* renamed from: a, reason: collision with root package name */
    private static final q5 f2864a;

    /* renamed from: b, reason: collision with root package name */
    public static final /* synthetic */ int f2865b = 0;

    static {
        int i4 = y2.f3034a;
        f2864a = new s5();
    }

    public static void A(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.x(i4, list, z3);
    }

    public static void B(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.e(i4, list, z3);
    }

    public static void C(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.y(i4, list, z3);
    }

    public static void D(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.z(i4, list, z3);
    }

    public static void E(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.i(i4, list, z3);
    }

    public static void F(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.c(i4, list, z3);
    }

    public static void a(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.h(i4, list, z3);
    }

    public static void b(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.C(i4, list, z3);
    }

    public static void c(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.j(i4, list, z3);
    }

    public static void d(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.o(i4, list, z3);
    }

    public static void e(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.F(i4, list, z3);
    }

    static boolean f(Object obj, Object obj2) {
        if (obj != obj2) {
            return obj != null && obj.equals(obj2);
        }
        return true;
    }

    static int g(int i4, a5 a5Var, k5 k5Var) {
        int s3 = r3.s(i4 << 3);
        return s3 + s3 + ((w2) a5Var).c(k5Var);
    }

    static int h(List list) {
        int size = list.size();
        int i4 = 0;
        if (size == 0) {
            return 0;
        }
        if (!(list instanceof e4)) {
            int i5 = 0;
            while (i4 < size) {
                i5 += r3.t(((Integer) list.get(i4)).intValue());
                i4++;
            }
            return i5;
        }
        e4 e4Var = (e4) list;
        int i6 = 0;
        while (i4 < size) {
            i6 += r3.t(e4Var.e(i4));
            i4++;
        }
        return i6;
    }

    static int i(int i4, List list, boolean z3) {
        int size = list.size();
        if (size == 0) {
            return 0;
        }
        return size * (r3.s(i4 << 3) + 4);
    }

    static int j(List list) {
        return list.size() * 4;
    }

    static int k(int i4, List list, boolean z3) {
        int size = list.size();
        if (size == 0) {
            return 0;
        }
        return size * (r3.s(i4 << 3) + 8);
    }

    static int l(List list) {
        return list.size() * 8;
    }

    static int m(List list) {
        int size = list.size();
        int i4 = 0;
        if (size == 0) {
            return 0;
        }
        if (!(list instanceof e4)) {
            int i5 = 0;
            while (i4 < size) {
                i5 += r3.t(((Integer) list.get(i4)).intValue());
                i4++;
            }
            return i5;
        }
        e4 e4Var = (e4) list;
        int i6 = 0;
        while (i4 < size) {
            i6 += r3.t(e4Var.e(i4));
            i4++;
        }
        return i6;
    }

    static int n(List list) {
        int size = list.size();
        if (size == 0) {
            return 0;
        }
        int i4 = 0;
        for (int i5 = 0; i5 < size; i5++) {
            i4 += r3.t(((Long) list.get(i5)).longValue());
        }
        return i4;
    }

    static int o(int i4, Object obj, k5 k5Var) {
        int s3 = r3.s(i4 << 3);
        int c4 = ((w2) obj).c(k5Var);
        return s3 + r3.s(c4) + c4;
    }

    static int p(List list) {
        int size = list.size();
        int i4 = 0;
        if (size == 0) {
            return 0;
        }
        if (!(list instanceof e4)) {
            int i5 = 0;
            while (i4 < size) {
                int intValue = ((Integer) list.get(i4)).intValue();
                i5 += r3.s((intValue >> 31) ^ (intValue + intValue));
                i4++;
            }
            return i5;
        }
        e4 e4Var = (e4) list;
        int i6 = 0;
        while (i4 < size) {
            int e4 = e4Var.e(i4);
            i6 += r3.s((e4 >> 31) ^ (e4 + e4));
            i4++;
        }
        return i6;
    }

    static int q(List list) {
        int size = list.size();
        if (size == 0) {
            return 0;
        }
        int i4 = 0;
        for (int i5 = 0; i5 < size; i5++) {
            long longValue = ((Long) list.get(i5)).longValue();
            i4 += r3.t((longValue >> 63) ^ (longValue + longValue));
        }
        return i4;
    }

    static int r(List list) {
        int size = list.size();
        int i4 = 0;
        if (size == 0) {
            return 0;
        }
        if (!(list instanceof e4)) {
            int i5 = 0;
            while (i4 < size) {
                i5 += r3.s(((Integer) list.get(i4)).intValue());
                i4++;
            }
            return i5;
        }
        e4 e4Var = (e4) list;
        int i6 = 0;
        while (i4 < size) {
            i6 += r3.s(e4Var.e(i4));
            i4++;
        }
        return i6;
    }

    static int s(List list) {
        int size = list.size();
        if (size == 0) {
            return 0;
        }
        int i4 = 0;
        for (int i5 = 0; i5 < size; i5++) {
            i4 += r3.t(((Long) list.get(i5)).longValue());
        }
        return i4;
    }

    public static q5 t() {
        return f2864a;
    }

    static Object u(Object obj, int i4, int i5, Object obj2, q5 q5Var) {
        if (obj2 == null) {
            obj2 = q5Var.a(obj);
        }
        ((r5) obj2).j(i4 << 3, Long.valueOf(i5));
        return obj2;
    }

    static void v(w3 w3Var, Object obj, Object obj2) {
        h.d.a(obj2);
        throw null;
    }

    static void w(q5 q5Var, Object obj, Object obj2) {
        d4 d4Var = (d4) obj;
        r5 r5Var = d4Var.zzc;
        r5 r5Var2 = ((d4) obj2).zzc;
        if (!r5.c().equals(r5Var2)) {
            if (r5.c().equals(r5Var)) {
                r5Var = r5.e(r5Var, r5Var2);
            } else {
                r5Var.d(r5Var2);
            }
        }
        d4Var.zzc = r5Var;
    }

    public static void x(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.t(i4, list, z3);
    }

    public static void y(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.v(i4, list, z3);
    }

    public static void z(int i4, List list, c6 c6Var, boolean z3) {
        if (list == null || list.isEmpty()) {
            return;
        }
        c6Var.E(i4, list, z3);
    }
}
