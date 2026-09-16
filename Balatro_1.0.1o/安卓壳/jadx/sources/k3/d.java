package k3;

import a1.b2.c3;
import com.google.android.gms.internal.play_billing.l1;
import java.util.concurrent.atomic.AtomicLongFieldUpdater;
import java.util.concurrent.atomic.AtomicReferenceArray;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d {
    private volatile /* synthetic */ Object _next = null;
    private volatile /* synthetic */ long _state = 0;

    /* renamed from: a, reason: collision with root package name */
    private final int f3998a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f3999b;

    /* renamed from: c, reason: collision with root package name */
    private final int f4000c;

    /* renamed from: d, reason: collision with root package name */
    private /* synthetic */ AtomicReferenceArray f4001d;

    /* renamed from: e, reason: collision with root package name */
    public static final a f3994e = new a(null);

    /* renamed from: h, reason: collision with root package name */
    public static final j f3997h = new j("REMOVE_FROZEN");

    /* renamed from: f, reason: collision with root package name */
    private static final /* synthetic */ AtomicReferenceFieldUpdater f3995f = AtomicReferenceFieldUpdater.newUpdater(d.class, Object.class, "_next");

    /* renamed from: g, reason: collision with root package name */
    private static final /* synthetic */ AtomicLongFieldUpdater f3996g = AtomicLongFieldUpdater.newUpdater(d.class, c3.d4(1287));

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }

        public final int a(long j4) {
            return (j4 & 2305843009213693952L) != 0 ? 2 : 1;
        }

        public final long b(long j4, int i4) {
            return d(j4, 1073741823L) | i4;
        }

        public final long c(long j4, int i4) {
            return d(j4, 1152921503533105152L) | (i4 << 30);
        }

        public final long d(long j4, long j5) {
            return j4 & (~j5);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        public final int f4002a;

        public b(int i4) {
            this.f4002a = i4;
        }
    }

    public d(int i4, boolean z3) {
        this.f3998a = i4;
        this.f3999b = z3;
        int i5 = i4 - 1;
        this.f4000c = i5;
        this.f4001d = new AtomicReferenceArray(i4);
        if (i5 > 1073741823) {
            throw new IllegalStateException("Check failed.");
        }
        if ((i4 & i5) != 0) {
            throw new IllegalStateException("Check failed.");
        }
    }

    private final d b(long j4) {
        d dVar = new d(this.f3998a * 2, this.f3999b);
        int i4 = (int) (1073741823 & j4);
        int i5 = (int) ((1152921503533105152L & j4) >> 30);
        while (true) {
            int i6 = this.f4000c;
            if ((i4 & i6) == (i5 & i6)) {
                dVar._state = f3994e.d(j4, 1152921504606846976L);
                return dVar;
            }
            Object obj = this.f4001d.get(i6 & i4);
            if (obj == null) {
                obj = new b(i4);
            }
            dVar.f4001d.set(dVar.f4000c & i4, obj);
            i4++;
        }
    }

    private final d c(long j4) {
        while (true) {
            d dVar = (d) this._next;
            if (dVar != null) {
                return dVar;
            }
            l1.a(f3995f, this, null, b(j4));
        }
    }

    private final d e(int i4, Object obj) {
        Object obj2 = this.f4001d.get(this.f4000c & i4);
        if (!(obj2 instanceof b) || ((b) obj2).f4002a != i4) {
            return null;
        }
        this.f4001d.set(i4 & this.f4000c, obj);
        return this;
    }

    private final long h() {
        long j4;
        long j5;
        do {
            j4 = this._state;
            if ((j4 & 1152921504606846976L) != 0) {
                return j4;
            }
            j5 = j4 | 1152921504606846976L;
        } while (!f3996g.compareAndSet(this, j4, j5));
        return j5;
    }

    private final d k(int i4, int i5) {
        long j4;
        int i6;
        do {
            j4 = this._state;
            i6 = (int) (1073741823 & j4);
            if ((1152921504606846976L & j4) != 0) {
                return i();
            }
        } while (!f3996g.compareAndSet(this, j4, f3994e.b(j4, i5)));
        this.f4001d.set(i6 & this.f4000c, null);
        return null;
    }

    /* JADX WARN: Code restructure failed: missing block: B:34:0x004d, code lost:
    
        return 1;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public final int a(java.lang.Object r12) {
        /*
            r11 = this;
        L0:
            long r2 = r11._state
            r0 = 3458764513820540928(0x3000000000000000, double:1.727233711018889E-77)
            long r0 = r0 & r2
            r6 = 0
            int r0 = (r0 > r6 ? 1 : (r0 == r6 ? 0 : -1))
            if (r0 == 0) goto L12
            k3.d$a r12 = k3.d.f3994e
            int r12 = r12.a(r2)
            return r12
        L12:
            r0 = 1073741823(0x3fffffff, double:5.304989472E-315)
            long r0 = r0 & r2
            int r0 = (int) r0
            r4 = 1152921503533105152(0xfffffffc0000000, double:1.2882296003504729E-231)
            long r4 = r4 & r2
            r1 = 30
            long r4 = r4 >> r1
            int r8 = (int) r4
            int r9 = r11.f4000c
            int r1 = r8 + 2
            r1 = r1 & r9
            r4 = r0 & r9
            r5 = 1
            if (r1 != r4) goto L2c
            return r5
        L2c:
            boolean r1 = r11.f3999b
            r4 = 1073741823(0x3fffffff, float:1.9999999)
            if (r1 != 0) goto L4e
            java.util.concurrent.atomic.AtomicReferenceArray r1 = r11.f4001d
            r10 = r8 & r9
            java.lang.Object r1 = r1.get(r10)
            if (r1 == 0) goto L4e
            int r1 = r11.f3998a
            r2 = 1024(0x400, float:1.435E-42)
            if (r1 < r2) goto L4d
            int r8 = r8 - r0
            r0 = r8 & r4
            int r1 = r1 >> 1
            if (r0 <= r1) goto L4b
            goto L4d
        L4b:
            r1 = r11
            goto L0
        L4d:
            return r5
        L4e:
            int r0 = r8 + 1
            r0 = r0 & r4
            r1 = r0
            java.util.concurrent.atomic.AtomicLongFieldUpdater r0 = k3.d.f3996g
            k3.d$a r4 = k3.d.f3994e
            long r4 = r4.c(r2, r1)
            r1 = r11
            boolean r0 = r0.compareAndSet(r1, r2, r4)
            if (r0 == 0) goto L0
            java.util.concurrent.atomic.AtomicReferenceArray r0 = r1.f4001d
            r2 = r8 & r9
            r0.set(r2, r12)
            r0 = r1
        L69:
            long r2 = r0._state
            r4 = 1152921504606846976(0x1000000000000000, double:1.2882297539194267E-231)
            long r2 = r2 & r4
            int r2 = (r2 > r6 ? 1 : (r2 == r6 ? 0 : -1))
            if (r2 != 0) goto L73
            goto L7d
        L73:
            k3.d r0 = r0.i()
            k3.d r0 = r0.e(r8, r12)
            if (r0 != 0) goto L69
        L7d:
            r12 = 0
            return r12
        */
        throw new UnsupportedOperationException("Method not decompiled: k3.d.a(java.lang.Object):int");
    }

    public final boolean d() {
        long j4;
        do {
            j4 = this._state;
            if ((j4 & 2305843009213693952L) != 0) {
                return true;
            }
            if ((1152921504606846976L & j4) != 0) {
                return false;
            }
        } while (!f3996g.compareAndSet(this, j4, j4 | 2305843009213693952L));
        return true;
    }

    public final int f() {
        long j4 = this._state;
        return (((int) ((j4 & 1152921503533105152L) >> 30)) - ((int) (1073741823 & j4))) & 1073741823;
    }

    public final boolean g() {
        long j4 = this._state;
        return ((int) (1073741823 & j4)) == ((int) ((j4 & 1152921503533105152L) >> 30));
    }

    public final d i() {
        return c(h());
    }

    public final Object j() {
        while (true) {
            long j4 = this._state;
            if ((1152921504606846976L & j4) != 0) {
                return f3997h;
            }
            int i4 = (int) (1073741823 & j4);
            int i5 = this.f4000c;
            if ((((int) ((1152921503533105152L & j4) >> 30)) & i5) == (i4 & i5)) {
                return null;
            }
            Object obj = this.f4001d.get(i5 & i4);
            if (obj == null) {
                if (this.f3999b) {
                    return null;
                }
            } else {
                if (obj instanceof b) {
                    return null;
                }
                int i6 = (i4 + 1) & 1073741823;
                if (f3996g.compareAndSet(this, j4, f3994e.b(j4, i6))) {
                    this.f4001d.set(this.f4000c & i4, null);
                    return obj;
                }
                if (this.f3999b) {
                    d dVar = this;
                    do {
                        dVar = dVar.k(i4, i6);
                    } while (dVar != null);
                    return obj;
                }
            }
        }
    }
}
