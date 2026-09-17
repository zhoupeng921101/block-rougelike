package androidx.core.content.res;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class a {

    /* renamed from: a, reason: collision with root package name */
    private final float f851a;

    /* renamed from: b, reason: collision with root package name */
    private final float f852b;

    /* renamed from: c, reason: collision with root package name */
    private final float f853c;

    /* renamed from: d, reason: collision with root package name */
    private final float f854d;

    /* renamed from: e, reason: collision with root package name */
    private final float f855e;

    /* renamed from: f, reason: collision with root package name */
    private final float f856f;

    /* renamed from: g, reason: collision with root package name */
    private final float f857g;

    /* renamed from: h, reason: collision with root package name */
    private final float f858h;

    /* renamed from: i, reason: collision with root package name */
    private final float f859i;

    a(float f4, float f5, float f6, float f7, float f8, float f9, float f10, float f11, float f12) {
        this.f851a = f4;
        this.f852b = f5;
        this.f853c = f6;
        this.f854d = f7;
        this.f855e = f8;
        this.f856f = f9;
        this.f857g = f10;
        this.f858h = f11;
        this.f859i = f12;
    }

    private static a b(float f4, float f5, float f6) {
        float f7 = 100.0f;
        float f8 = 1000.0f;
        float f9 = 0.0f;
        a aVar = null;
        float f10 = 1000.0f;
        while (Math.abs(f9 - f7) > 0.01f) {
            float f11 = ((f7 - f9) / 2.0f) + f9;
            int p3 = e(f11, f5, f4).p();
            float b4 = b.b(p3);
            float abs = Math.abs(f6 - b4);
            if (abs < 0.2f) {
                a c4 = c(p3);
                float a4 = c4.a(e(c4.k(), c4.i(), f4));
                if (a4 <= 1.0f) {
                    aVar = c4;
                    f8 = abs;
                    f10 = a4;
                }
            }
            if (f8 == 0.0f && f10 == 0.0f) {
                return aVar;
            }
            if (b4 < f6) {
                f9 = f11;
            } else {
                f7 = f11;
            }
        }
        return aVar;
    }

    static a c(int i4) {
        return d(i4, i.f888k);
    }

    static a d(int i4, i iVar) {
        float[] f4 = b.f(i4);
        float[][] fArr = b.f860a;
        float f5 = f4[0];
        float[] fArr2 = fArr[0];
        float f6 = fArr2[0] * f5;
        float f7 = f4[1];
        float f8 = f6 + (fArr2[1] * f7);
        float f9 = f4[2];
        float f10 = f8 + (fArr2[2] * f9);
        float[] fArr3 = fArr[1];
        float f11 = (fArr3[0] * f5) + (fArr3[1] * f7) + (fArr3[2] * f9);
        float[] fArr4 = fArr[2];
        float f12 = (f5 * fArr4[0]) + (f7 * fArr4[1]) + (f9 * fArr4[2]);
        float f13 = iVar.i()[0] * f10;
        float f14 = iVar.i()[1] * f11;
        float f15 = iVar.i()[2] * f12;
        float pow = (float) Math.pow((iVar.c() * Math.abs(f13)) / 100.0d, 0.42d);
        float pow2 = (float) Math.pow((iVar.c() * Math.abs(f14)) / 100.0d, 0.42d);
        float pow3 = (float) Math.pow((iVar.c() * Math.abs(f15)) / 100.0d, 0.42d);
        float signum = ((Math.signum(f13) * 400.0f) * pow) / (pow + 27.13f);
        float signum2 = ((Math.signum(f14) * 400.0f) * pow2) / (pow2 + 27.13f);
        float signum3 = ((Math.signum(f15) * 400.0f) * pow3) / (pow3 + 27.13f);
        double d4 = signum3;
        float f16 = ((float) (((signum * 11.0d) + (signum2 * (-12.0d))) + d4)) / 11.0f;
        float f17 = ((float) ((signum + signum2) - (d4 * 2.0d))) / 9.0f;
        float f18 = signum2 * 20.0f;
        float f19 = (((signum * 20.0f) + f18) + (21.0f * signum3)) / 20.0f;
        float f20 = (((signum * 40.0f) + f18) + signum3) / 20.0f;
        float atan2 = (((float) Math.atan2(f17, f16)) * 180.0f) / 3.1415927f;
        if (atan2 < 0.0f) {
            atan2 += 360.0f;
        } else if (atan2 >= 360.0f) {
            atan2 -= 360.0f;
        }
        float f21 = atan2;
        float f22 = (3.1415927f * f21) / 180.0f;
        float pow4 = ((float) Math.pow((f20 * iVar.f()) / iVar.a(), iVar.b() * iVar.j())) * 100.0f;
        float b4 = (4.0f / iVar.b()) * ((float) Math.sqrt(pow4 / 100.0f)) * (iVar.a() + 4.0f) * iVar.d();
        float pow5 = ((float) Math.pow(1.64d - Math.pow(0.29d, iVar.e()), 0.73d)) * ((float) Math.pow((((((((float) (Math.cos((((((double) f21) < 20.14d ? 360.0f + f21 : f21) * 3.141592653589793d) / 180.0d) + 2.0d) + 3.8d)) * 0.25f) * 3846.1538f) * iVar.g()) * iVar.h()) * ((float) Math.sqrt((f16 * f16) + (f17 * f17)))) / (f19 + 0.305f), 0.9d)) * ((float) Math.sqrt(pow4 / 100.0d));
        float d5 = pow5 * iVar.d();
        float sqrt = ((float) Math.sqrt((r2 * iVar.b()) / (iVar.a() + 4.0f))) * 50.0f;
        float f23 = (1.7f * pow4) / ((0.007f * pow4) + 1.0f);
        float log = ((float) Math.log((0.0228f * d5) + 1.0f)) * 43.85965f;
        double d6 = f22;
        return new a(f21, pow5, pow4, b4, d5, sqrt, f23, log * ((float) Math.cos(d6)), log * ((float) Math.sin(d6)));
    }

    private static a e(float f4, float f5, float f6) {
        return f(f4, f5, f6, i.f888k);
    }

    private static a f(float f4, float f5, float f6, i iVar) {
        float b4 = (4.0f / iVar.b()) * ((float) Math.sqrt(f4 / 100.0d)) * (iVar.a() + 4.0f) * iVar.d();
        float d4 = iVar.d() * f5;
        float sqrt = ((float) Math.sqrt(((f5 / ((float) Math.sqrt(r4))) * iVar.b()) / (iVar.a() + 4.0f))) * 50.0f;
        float f7 = (1.7f * f4) / ((0.007f * f4) + 1.0f);
        float log = ((float) Math.log((d4 * 0.0228d) + 1.0d)) * 43.85965f;
        double d5 = (3.1415927f * f6) / 180.0f;
        return new a(f6, f5, f4, b4, d4, sqrt, f7, ((float) Math.cos(d5)) * log, log * ((float) Math.sin(d5)));
    }

    static int m(float f4, float f5, float f6) {
        return n(f4, f5, f6, i.f888k);
    }

    static int n(float f4, float f5, float f6, i iVar) {
        if (f5 < 1.0d || Math.round(f6) <= 0.0d || Math.round(f6) >= 100.0d) {
            return b.a(f6);
        }
        float min = f4 < 0.0f ? 0.0f : Math.min(360.0f, f4);
        a aVar = null;
        boolean z3 = true;
        float f7 = 0.0f;
        float f8 = f5;
        while (Math.abs(f7 - f5) >= 0.4f) {
            a b4 = b(min, f8, f6);
            if (!z3) {
                if (b4 == null) {
                    f5 = f8;
                } else {
                    f7 = f8;
                    aVar = b4;
                }
                f8 = ((f5 - f7) / 2.0f) + f7;
            } else {
                if (b4 != null) {
                    return b4.o(iVar);
                }
                f8 = ((f5 - f7) / 2.0f) + f7;
                z3 = false;
            }
        }
        return aVar == null ? b.a(f6) : aVar.o(iVar);
    }

    float a(a aVar) {
        float l3 = l() - aVar.l();
        float g4 = g() - aVar.g();
        float h4 = h() - aVar.h();
        return (float) (Math.pow(Math.sqrt((l3 * l3) + (g4 * g4) + (h4 * h4)), 0.63d) * 1.41d);
    }

    float g() {
        return this.f858h;
    }

    float h() {
        return this.f859i;
    }

    float i() {
        return this.f852b;
    }

    float j() {
        return this.f851a;
    }

    float k() {
        return this.f853c;
    }

    float l() {
        return this.f857g;
    }

    int o(i iVar) {
        float pow = (float) Math.pow(((((double) i()) == 0.0d || ((double) k()) == 0.0d) ? 0.0f : i() / ((float) Math.sqrt(k() / 100.0d))) / Math.pow(1.64d - Math.pow(0.29d, iVar.e()), 0.73d), 1.1111111111111112d);
        double j4 = (j() * 3.1415927f) / 180.0f;
        float cos = ((float) (Math.cos(2.0d + j4) + 3.8d)) * 0.25f;
        float a4 = iVar.a() * ((float) Math.pow(k() / 100.0d, (1.0d / iVar.b()) / iVar.j()));
        float g4 = cos * 3846.1538f * iVar.g() * iVar.h();
        float f4 = a4 / iVar.f();
        float sin = (float) Math.sin(j4);
        float cos2 = (float) Math.cos(j4);
        float f5 = (((0.305f + f4) * 23.0f) * pow) / (((g4 * 23.0f) + ((11.0f * pow) * cos2)) + ((pow * 108.0f) * sin));
        float f6 = cos2 * f5;
        float f7 = f5 * sin;
        float f8 = f4 * 460.0f;
        float f9 = (((451.0f * f6) + f8) + (288.0f * f7)) / 1403.0f;
        float f10 = ((f8 - (891.0f * f6)) - (261.0f * f7)) / 1403.0f;
        float signum = Math.signum(f9) * (100.0f / iVar.c()) * ((float) Math.pow((float) Math.max(0.0d, (Math.abs(f9) * 27.13d) / (400.0d - Math.abs(f9))), 2.380952380952381d));
        float signum2 = Math.signum(f10) * (100.0f / iVar.c()) * ((float) Math.pow((float) Math.max(0.0d, (Math.abs(f10) * 27.13d) / (400.0d - Math.abs(f10))), 2.380952380952381d));
        float signum3 = Math.signum(((f8 - (f6 * 220.0f)) - (f7 * 6300.0f)) / 1403.0f) * (100.0f / iVar.c()) * ((float) Math.pow((float) Math.max(0.0d, (Math.abs(r8) * 27.13d) / (400.0d - Math.abs(r8))), 2.380952380952381d));
        float f11 = signum / iVar.i()[0];
        float f12 = signum2 / iVar.i()[1];
        float f13 = signum3 / iVar.i()[2];
        float[][] fArr = b.f861b;
        float[] fArr2 = fArr[0];
        float f14 = (fArr2[0] * f11) + (fArr2[1] * f12) + (fArr2[2] * f13);
        float[] fArr3 = fArr[1];
        float f15 = (fArr3[0] * f11) + (fArr3[1] * f12) + (fArr3[2] * f13);
        float[] fArr4 = fArr[2];
        return androidx.core.graphics.a.a(f14, f15, (f11 * fArr4[0]) + (f12 * fArr4[1]) + (f13 * fArr4[2]));
    }

    int p() {
        return o(i.f888k);
    }
}
