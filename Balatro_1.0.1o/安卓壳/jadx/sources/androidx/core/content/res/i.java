package androidx.core.content.res;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i {

    /* renamed from: k, reason: collision with root package name */
    static final i f888k = k(b.f862c, (float) ((b.h(50.0f) * 63.66197723675813d) / 100.0d), 50.0f, 2.0f, false);

    /* renamed from: a, reason: collision with root package name */
    private final float f889a;

    /* renamed from: b, reason: collision with root package name */
    private final float f890b;

    /* renamed from: c, reason: collision with root package name */
    private final float f891c;

    /* renamed from: d, reason: collision with root package name */
    private final float f892d;

    /* renamed from: e, reason: collision with root package name */
    private final float f893e;

    /* renamed from: f, reason: collision with root package name */
    private final float f894f;

    /* renamed from: g, reason: collision with root package name */
    private final float[] f895g;

    /* renamed from: h, reason: collision with root package name */
    private final float f896h;

    /* renamed from: i, reason: collision with root package name */
    private final float f897i;

    /* renamed from: j, reason: collision with root package name */
    private final float f898j;

    private i(float f4, float f5, float f6, float f7, float f8, float f9, float[] fArr, float f10, float f11, float f12) {
        this.f894f = f4;
        this.f889a = f5;
        this.f890b = f6;
        this.f891c = f7;
        this.f892d = f8;
        this.f893e = f9;
        this.f895g = fArr;
        this.f896h = f10;
        this.f897i = f11;
        this.f898j = f12;
    }

    static i k(float[] fArr, float f4, float f5, float f6, boolean z3) {
        float[][] fArr2 = b.f860a;
        float f7 = fArr[0];
        float[] fArr3 = fArr2[0];
        float f8 = fArr3[0] * f7;
        float f9 = fArr[1];
        float f10 = f8 + (fArr3[1] * f9);
        float f11 = fArr[2];
        float f12 = f10 + (fArr3[2] * f11);
        float[] fArr4 = fArr2[1];
        float f13 = (fArr4[0] * f7) + (fArr4[1] * f9) + (fArr4[2] * f11);
        float[] fArr5 = fArr2[2];
        float f14 = (f7 * fArr5[0]) + (f9 * fArr5[1]) + (f11 * fArr5[2]);
        float f15 = (f6 / 10.0f) + 0.8f;
        float d4 = ((double) f15) >= 0.9d ? b.d(0.59f, 0.69f, (f15 - 0.9f) * 10.0f) : b.d(0.525f, 0.59f, (f15 - 0.8f) * 10.0f);
        float exp = z3 ? 1.0f : (1.0f - (((float) Math.exp(((-f4) - 42.0f) / 92.0f)) * 0.2777778f)) * f15;
        double d5 = exp;
        if (d5 > 1.0d) {
            exp = 1.0f;
        } else if (d5 < 0.0d) {
            exp = 0.0f;
        }
        float[] fArr6 = {(((100.0f / f12) * exp) + 1.0f) - exp, (((100.0f / f13) * exp) + 1.0f) - exp, (((100.0f / f14) * exp) + 1.0f) - exp};
        float f16 = 1.0f / ((5.0f * f4) + 1.0f);
        float f17 = f16 * f16 * f16 * f16;
        float f18 = 1.0f - f17;
        float cbrt = (f17 * f4) + (0.1f * f18 * f18 * ((float) Math.cbrt(f4 * 5.0d)));
        float h4 = b.h(f5) / fArr[1];
        double d6 = h4;
        float sqrt = ((float) Math.sqrt(d6)) + 1.48f;
        float pow = 0.725f / ((float) Math.pow(d6, 0.2d));
        float[] fArr7 = {(float) Math.pow(((fArr6[0] * cbrt) * f12) / 100.0d, 0.42d), (float) Math.pow(((fArr6[1] * cbrt) * f13) / 100.0d, 0.42d), (float) Math.pow(((fArr6[2] * cbrt) * f14) / 100.0d, 0.42d)};
        float f19 = fArr7[0];
        float f20 = (f19 * 400.0f) / (f19 + 27.13f);
        float f21 = fArr7[1];
        float f22 = (f21 * 400.0f) / (f21 + 27.13f);
        float f23 = fArr7[2];
        float[] fArr8 = {f20, f22, (400.0f * f23) / (f23 + 27.13f)};
        return new i(h4, ((fArr8[0] * 2.0f) + fArr8[1] + (fArr8[2] * 0.05f)) * pow, pow, pow, d4, f15, fArr6, cbrt, (float) Math.pow(cbrt, 0.25d), sqrt);
    }

    float a() {
        return this.f889a;
    }

    float b() {
        return this.f892d;
    }

    float c() {
        return this.f896h;
    }

    float d() {
        return this.f897i;
    }

    float e() {
        return this.f894f;
    }

    float f() {
        return this.f890b;
    }

    float g() {
        return this.f893e;
    }

    float h() {
        return this.f891c;
    }

    float[] i() {
        return this.f895g;
    }

    float j() {
        return this.f898j;
    }
}
