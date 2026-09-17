package j0;

import android.util.SparseArray;
import j0.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class o {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class a {
        public abstract o a();

        public abstract a b(b bVar);

        public abstract a c(c cVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum b {
        f3773f(0),
        GPRS(1),
        f3775h(2),
        UMTS(3),
        CDMA(4),
        EVDO_0(5),
        EVDO_A(6),
        f3780m(7),
        HSDPA(8),
        HSUPA(9),
        f3783p(10),
        IDEN(11),
        EVDO_B(12),
        LTE(13),
        EHRPD(14),
        f3788u(15),
        GSM(16),
        TD_SCDMA(17),
        IWLAN(18),
        f3792y(19),
        f3793z(100);

        private static final SparseArray A;

        /* renamed from: e, reason: collision with root package name */
        private final int f3794e;

        static {
            b bVar = f3773f;
            b bVar2 = GPRS;
            b bVar3 = f3775h;
            b bVar4 = UMTS;
            b bVar5 = CDMA;
            b bVar6 = EVDO_0;
            b bVar7 = EVDO_A;
            b bVar8 = f3780m;
            b bVar9 = HSDPA;
            b bVar10 = HSUPA;
            b bVar11 = f3783p;
            b bVar12 = IDEN;
            b bVar13 = EVDO_B;
            b bVar14 = LTE;
            b bVar15 = EHRPD;
            b bVar16 = f3788u;
            b bVar17 = GSM;
            b bVar18 = TD_SCDMA;
            b bVar19 = IWLAN;
            b bVar20 = f3792y;
            SparseArray sparseArray = new SparseArray();
            A = sparseArray;
            sparseArray.put(0, bVar);
            sparseArray.put(1, bVar2);
            sparseArray.put(2, bVar3);
            sparseArray.put(3, bVar4);
            sparseArray.put(4, bVar5);
            sparseArray.put(5, bVar6);
            sparseArray.put(6, bVar7);
            sparseArray.put(7, bVar8);
            sparseArray.put(8, bVar9);
            sparseArray.put(9, bVar10);
            sparseArray.put(10, bVar11);
            sparseArray.put(11, bVar12);
            sparseArray.put(12, bVar13);
            sparseArray.put(13, bVar14);
            sparseArray.put(14, bVar15);
            sparseArray.put(15, bVar16);
            sparseArray.put(16, bVar17);
            sparseArray.put(17, bVar18);
            sparseArray.put(18, bVar19);
            sparseArray.put(19, bVar20);
        }

        b(int i4) {
            this.f3794e = i4;
        }

        public static b a(int i4) {
            return (b) A.get(i4);
        }

        public int b() {
            return this.f3794e;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum c {
        MOBILE(0),
        f3796g(1),
        MOBILE_MMS(2),
        MOBILE_SUPL(3),
        f3799j(4),
        MOBILE_HIPRI(5),
        WIMAX(6),
        BLUETOOTH(7),
        DUMMY(8),
        ETHERNET(9),
        MOBILE_FOTA(10),
        MOBILE_IMS(11),
        MOBILE_CBS(12),
        f3808s(13),
        f3809t(14),
        MOBILE_EMERGENCY(15),
        PROXY(16),
        VPN(17),
        NONE(-1);


        /* renamed from: y, reason: collision with root package name */
        private static final SparseArray f3814y;

        /* renamed from: e, reason: collision with root package name */
        private final int f3816e;

        static {
            c cVar = MOBILE;
            c cVar2 = f3796g;
            c cVar3 = MOBILE_MMS;
            c cVar4 = MOBILE_SUPL;
            c cVar5 = f3799j;
            c cVar6 = MOBILE_HIPRI;
            c cVar7 = WIMAX;
            c cVar8 = BLUETOOTH;
            c cVar9 = DUMMY;
            c cVar10 = ETHERNET;
            c cVar11 = MOBILE_FOTA;
            c cVar12 = MOBILE_IMS;
            c cVar13 = MOBILE_CBS;
            c cVar14 = f3808s;
            c cVar15 = f3809t;
            c cVar16 = MOBILE_EMERGENCY;
            c cVar17 = PROXY;
            c cVar18 = VPN;
            c cVar19 = NONE;
            SparseArray sparseArray = new SparseArray();
            f3814y = sparseArray;
            sparseArray.put(0, cVar);
            sparseArray.put(1, cVar2);
            sparseArray.put(2, cVar3);
            sparseArray.put(3, cVar4);
            sparseArray.put(4, cVar5);
            sparseArray.put(5, cVar6);
            sparseArray.put(6, cVar7);
            sparseArray.put(7, cVar8);
            sparseArray.put(8, cVar9);
            sparseArray.put(9, cVar10);
            sparseArray.put(10, cVar11);
            sparseArray.put(11, cVar12);
            sparseArray.put(12, cVar13);
            sparseArray.put(13, cVar14);
            sparseArray.put(14, cVar15);
            sparseArray.put(15, cVar16);
            sparseArray.put(16, cVar17);
            sparseArray.put(17, cVar18);
            sparseArray.put(-1, cVar19);
        }

        c(int i4) {
            this.f3816e = i4;
        }

        public static c a(int i4) {
            return (c) f3814y.get(i4);
        }

        public int b() {
            return this.f3816e;
        }
    }

    public static a a() {
        return new i.b();
    }

    public abstract b b();

    public abstract c c();
}
