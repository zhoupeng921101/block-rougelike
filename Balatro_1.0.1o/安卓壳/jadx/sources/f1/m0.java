package f1;

import android.os.SystemClock;
import com.google.android.gms.common.api.Status;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class m0 implements g2.d {

    /* renamed from: a, reason: collision with root package name */
    private final f f3279a;

    /* renamed from: b, reason: collision with root package name */
    private final int f3280b;

    /* renamed from: c, reason: collision with root package name */
    private final b f3281c;

    /* renamed from: d, reason: collision with root package name */
    private final long f3282d;

    /* renamed from: e, reason: collision with root package name */
    private final long f3283e;

    m0(f fVar, int i4, b bVar, long j4, long j5, String str, String str2) {
        this.f3279a = fVar;
        this.f3280b = i4;
        this.f3281c = bVar;
        this.f3282d = j4;
        this.f3283e = j5;
    }

    static m0 b(f fVar, int i4, b bVar) {
        boolean z3;
        if (!fVar.e()) {
            return null;
        }
        h1.s a4 = h1.r.b().a();
        if (a4 == null) {
            z3 = true;
        } else {
            if (!a4.j0()) {
                return null;
            }
            z3 = a4.k0();
            d0 t3 = fVar.t(bVar);
            if (t3 != null) {
                if (!(t3.v() instanceof h1.d)) {
                    return null;
                }
                h1.d dVar = (h1.d) t3.v();
                if (dVar.I() && !dVar.g()) {
                    h1.f c4 = c(t3, dVar, i4);
                    if (c4 == null) {
                        return null;
                    }
                    t3.G();
                    z3 = c4.l0();
                }
            }
        }
        return new m0(fVar, i4, bVar, z3 ? System.currentTimeMillis() : 0L, z3 ? SystemClock.elapsedRealtime() : 0L, null, null);
    }

    private static h1.f c(d0 d0Var, h1.d dVar, int i4) {
        int[] i02;
        int[] j02;
        h1.f G = dVar.G();
        if (G == null || !G.k0() || ((i02 = G.i0()) != null ? !com.google.android.gms.common.util.b.a(i02, i4) : !((j02 = G.j0()) == null || !com.google.android.gms.common.util.b.a(j02, i4))) || d0Var.t() >= G.h0()) {
            return null;
        }
        return G;
    }

    @Override // g2.d
    public final void a(g2.h hVar) {
        d0 t3;
        int i4;
        int i5;
        int i6;
        int i02;
        long j4;
        long j5;
        if (this.f3279a.e()) {
            h1.s a4 = h1.r.b().a();
            if ((a4 == null || a4.j0()) && (t3 = this.f3279a.t(this.f3281c)) != null && (t3.v() instanceof h1.d)) {
                h1.d dVar = (h1.d) t3.v();
                int i7 = 0;
                boolean z3 = this.f3282d > 0;
                int y3 = dVar.y();
                int i8 = 100;
                if (a4 != null) {
                    z3 &= a4.k0();
                    int h02 = a4.h0();
                    int i03 = a4.i0();
                    i4 = a4.l0();
                    if (dVar.I() && !dVar.g()) {
                        h1.f c4 = c(t3, dVar, this.f3280b);
                        if (c4 == null) {
                            return;
                        }
                        boolean z4 = c4.l0() && this.f3282d > 0;
                        i03 = c4.h0();
                        z3 = z4;
                    }
                    i6 = h02;
                    i5 = i03;
                } else {
                    i4 = 0;
                    i5 = 100;
                    i6 = 5000;
                }
                f fVar = this.f3279a;
                int i9 = -1;
                if (hVar.q()) {
                    i02 = 0;
                } else {
                    if (!hVar.o()) {
                        Exception m3 = hVar.m();
                        if (m3 instanceof e1.b) {
                            Status a5 = ((e1.b) m3).a();
                            i8 = a5.j0();
                            d1.a h03 = a5.h0();
                            if (h03 != null) {
                                i02 = h03.i0();
                                i7 = i8;
                            }
                        } else {
                            i7 = 101;
                            i02 = -1;
                        }
                    }
                    i7 = i8;
                    i02 = -1;
                }
                if (z3) {
                    long j6 = this.f3282d;
                    long j7 = this.f3283e;
                    long currentTimeMillis = System.currentTimeMillis();
                    i9 = (int) (SystemClock.elapsedRealtime() - j7);
                    j5 = currentTimeMillis;
                    j4 = j6;
                } else {
                    j4 = 0;
                    j5 = 0;
                }
                fVar.C(new h1.n(this.f3280b, i7, i02, j4, j5, null, null, y3, i9), i4, i6, i5);
            }
        }
    }
}
