package k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class h implements Cloneable {

    /* renamed from: i, reason: collision with root package name */
    private static final Object f3891i = new Object();

    /* renamed from: e, reason: collision with root package name */
    private boolean f3892e;

    /* renamed from: f, reason: collision with root package name */
    private int[] f3893f;

    /* renamed from: g, reason: collision with root package name */
    private Object[] f3894g;

    /* renamed from: h, reason: collision with root package name */
    private int f3895h;

    public h() {
        this(10);
    }

    public h(int i4) {
        this.f3892e = false;
        if (i4 == 0) {
            this.f3893f = c.f3853a;
            this.f3894g = c.f3855c;
        } else {
            int e4 = c.e(i4);
            this.f3893f = new int[e4];
            this.f3894g = new Object[e4];
        }
    }

    private void e() {
        int i4 = this.f3895h;
        int[] iArr = this.f3893f;
        Object[] objArr = this.f3894g;
        int i5 = 0;
        for (int i6 = 0; i6 < i4; i6++) {
            Object obj = objArr[i6];
            if (obj != f3891i) {
                if (i6 != i5) {
                    iArr[i5] = iArr[i6];
                    objArr[i5] = obj;
                    objArr[i6] = null;
                }
                i5++;
            }
        }
        this.f3892e = false;
        this.f3895h = i5;
    }

    public void a(int i4, Object obj) {
        int i5 = this.f3895h;
        if (i5 != 0 && i4 <= this.f3893f[i5 - 1]) {
            i(i4, obj);
            return;
        }
        if (this.f3892e && i5 >= this.f3893f.length) {
            e();
        }
        int i6 = this.f3895h;
        if (i6 >= this.f3893f.length) {
            int e4 = c.e(i6 + 1);
            int[] iArr = new int[e4];
            Object[] objArr = new Object[e4];
            int[] iArr2 = this.f3893f;
            System.arraycopy(iArr2, 0, iArr, 0, iArr2.length);
            Object[] objArr2 = this.f3894g;
            System.arraycopy(objArr2, 0, objArr, 0, objArr2.length);
            this.f3893f = iArr;
            this.f3894g = objArr;
        }
        this.f3893f[i6] = i4;
        this.f3894g[i6] = obj;
        this.f3895h = i6 + 1;
    }

    public void b() {
        int i4 = this.f3895h;
        Object[] objArr = this.f3894g;
        for (int i5 = 0; i5 < i4; i5++) {
            objArr[i5] = null;
        }
        this.f3895h = 0;
        this.f3892e = false;
    }

    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public h clone() {
        try {
            h hVar = (h) super.clone();
            hVar.f3893f = (int[]) this.f3893f.clone();
            hVar.f3894g = (Object[]) this.f3894g.clone();
            return hVar;
        } catch (CloneNotSupportedException e4) {
            throw new AssertionError(e4);
        }
    }

    public Object f(int i4) {
        return g(i4, null);
    }

    public Object g(int i4, Object obj) {
        Object obj2;
        int a4 = c.a(this.f3893f, this.f3895h, i4);
        return (a4 < 0 || (obj2 = this.f3894g[a4]) == f3891i) ? obj : obj2;
    }

    public int h(int i4) {
        if (this.f3892e) {
            e();
        }
        return this.f3893f[i4];
    }

    public void i(int i4, Object obj) {
        int a4 = c.a(this.f3893f, this.f3895h, i4);
        if (a4 >= 0) {
            this.f3894g[a4] = obj;
            return;
        }
        int i5 = ~a4;
        int i6 = this.f3895h;
        if (i5 < i6) {
            Object[] objArr = this.f3894g;
            if (objArr[i5] == f3891i) {
                this.f3893f[i5] = i4;
                objArr[i5] = obj;
                return;
            }
        }
        if (this.f3892e && i6 >= this.f3893f.length) {
            e();
            i5 = ~c.a(this.f3893f, this.f3895h, i4);
        }
        int i7 = this.f3895h;
        if (i7 >= this.f3893f.length) {
            int e4 = c.e(i7 + 1);
            int[] iArr = new int[e4];
            Object[] objArr2 = new Object[e4];
            int[] iArr2 = this.f3893f;
            System.arraycopy(iArr2, 0, iArr, 0, iArr2.length);
            Object[] objArr3 = this.f3894g;
            System.arraycopy(objArr3, 0, objArr2, 0, objArr3.length);
            this.f3893f = iArr;
            this.f3894g = objArr2;
        }
        int i8 = this.f3895h;
        if (i8 - i5 != 0) {
            int[] iArr3 = this.f3893f;
            int i9 = i5 + 1;
            System.arraycopy(iArr3, i5, iArr3, i9, i8 - i5);
            Object[] objArr4 = this.f3894g;
            System.arraycopy(objArr4, i5, objArr4, i9, this.f3895h - i5);
        }
        this.f3893f[i5] = i4;
        this.f3894g[i5] = obj;
        this.f3895h++;
    }

    public int j() {
        if (this.f3892e) {
            e();
        }
        return this.f3895h;
    }

    public Object k(int i4) {
        if (this.f3892e) {
            e();
        }
        return this.f3894g[i4];
    }

    public String toString() {
        if (j() <= 0) {
            return "{}";
        }
        StringBuilder sb = new StringBuilder(this.f3895h * 28);
        sb.append('{');
        for (int i4 = 0; i4 < this.f3895h; i4++) {
            if (i4 > 0) {
                sb.append(", ");
            }
            sb.append(h(i4));
            sb.append('=');
            Object k4 = k(i4);
            if (k4 != this) {
                sb.append(k4);
            } else {
                sb.append("(this Map)");
            }
        }
        sb.append('}');
        return sb.toString();
    }
}
