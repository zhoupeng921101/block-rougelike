package androidx.appcompat.widget;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class e0 {

    /* renamed from: a, reason: collision with root package name */
    private int f532a = 0;

    /* renamed from: b, reason: collision with root package name */
    private int f533b = 0;

    /* renamed from: c, reason: collision with root package name */
    private int f534c = Integer.MIN_VALUE;

    /* renamed from: d, reason: collision with root package name */
    private int f535d = Integer.MIN_VALUE;

    /* renamed from: e, reason: collision with root package name */
    private int f536e = 0;

    /* renamed from: f, reason: collision with root package name */
    private int f537f = 0;

    /* renamed from: g, reason: collision with root package name */
    private boolean f538g = false;

    /* renamed from: h, reason: collision with root package name */
    private boolean f539h = false;

    e0() {
    }

    public int a() {
        return this.f538g ? this.f532a : this.f533b;
    }

    public int b() {
        return this.f532a;
    }

    public int c() {
        return this.f533b;
    }

    public int d() {
        return this.f538g ? this.f533b : this.f532a;
    }

    public void e(int i4, int i5) {
        this.f539h = false;
        if (i4 != Integer.MIN_VALUE) {
            this.f536e = i4;
            this.f532a = i4;
        }
        if (i5 != Integer.MIN_VALUE) {
            this.f537f = i5;
            this.f533b = i5;
        }
    }

    public void f(boolean z3) {
        if (z3 == this.f538g) {
            return;
        }
        this.f538g = z3;
        if (!this.f539h) {
            this.f532a = this.f536e;
            this.f533b = this.f537f;
            return;
        }
        if (z3) {
            int i4 = this.f535d;
            if (i4 == Integer.MIN_VALUE) {
                i4 = this.f536e;
            }
            this.f532a = i4;
            int i5 = this.f534c;
            if (i5 == Integer.MIN_VALUE) {
                i5 = this.f537f;
            }
            this.f533b = i5;
            return;
        }
        int i6 = this.f534c;
        if (i6 == Integer.MIN_VALUE) {
            i6 = this.f536e;
        }
        this.f532a = i6;
        int i7 = this.f535d;
        if (i7 == Integer.MIN_VALUE) {
            i7 = this.f537f;
        }
        this.f533b = i7;
    }

    public void g(int i4, int i5) {
        this.f534c = i4;
        this.f535d = i5;
        this.f539h = true;
        if (this.f538g) {
            if (i5 != Integer.MIN_VALUE) {
                this.f532a = i5;
            }
            if (i4 != Integer.MIN_VALUE) {
                this.f533b = i4;
                return;
            }
            return;
        }
        if (i4 != Integer.MIN_VALUE) {
            this.f532a = i4;
        }
        if (i5 != Integer.MIN_VALUE) {
            this.f533b = i5;
        }
    }
}
