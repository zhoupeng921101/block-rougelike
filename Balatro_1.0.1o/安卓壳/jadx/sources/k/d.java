package k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class d implements Cloneable {

    /* renamed from: i, reason: collision with root package name */
    private static final Object f3856i = new Object();

    /* renamed from: e, reason: collision with root package name */
    private boolean f3857e;

    /* renamed from: f, reason: collision with root package name */
    private long[] f3858f;

    /* renamed from: g, reason: collision with root package name */
    private Object[] f3859g;

    /* renamed from: h, reason: collision with root package name */
    private int f3860h;

    public d() {
        this(10);
    }

    public d(int i4) {
        this.f3857e = false;
        if (i4 == 0) {
            this.f3858f = c.f3854b;
            this.f3859g = c.f3855c;
        } else {
            int f4 = c.f(i4);
            this.f3858f = new long[f4];
            this.f3859g = new Object[f4];
        }
    }

    private void b() {
        int i4 = this.f3860h;
        long[] jArr = this.f3858f;
        Object[] objArr = this.f3859g;
        int i5 = 0;
        for (int i6 = 0; i6 < i4; i6++) {
            Object obj = objArr[i6];
            if (obj != f3856i) {
                if (i6 != i5) {
                    jArr[i5] = jArr[i6];
                    objArr[i5] = obj;
                    objArr[i6] = null;
                }
                i5++;
            }
        }
        this.f3857e = false;
        this.f3860h = i5;
    }

    /* renamed from: a, reason: merged with bridge method [inline-methods] */
    public d clone() {
        try {
            d dVar = (d) super.clone();
            dVar.f3858f = (long[]) this.f3858f.clone();
            dVar.f3859g = (Object[]) this.f3859g.clone();
            return dVar;
        } catch (CloneNotSupportedException e4) {
            throw new AssertionError(e4);
        }
    }

    public Object c(long j4) {
        return e(j4, null);
    }

    public Object e(long j4, Object obj) {
        Object obj2;
        int b4 = c.b(this.f3858f, this.f3860h, j4);
        return (b4 < 0 || (obj2 = this.f3859g[b4]) == f3856i) ? obj : obj2;
    }

    public long f(int i4) {
        if (this.f3857e) {
            b();
        }
        return this.f3858f[i4];
    }

    public void g(long j4, Object obj) {
        int b4 = c.b(this.f3858f, this.f3860h, j4);
        if (b4 >= 0) {
            this.f3859g[b4] = obj;
            return;
        }
        int i4 = ~b4;
        int i5 = this.f3860h;
        if (i4 < i5) {
            Object[] objArr = this.f3859g;
            if (objArr[i4] == f3856i) {
                this.f3858f[i4] = j4;
                objArr[i4] = obj;
                return;
            }
        }
        if (this.f3857e && i5 >= this.f3858f.length) {
            b();
            i4 = ~c.b(this.f3858f, this.f3860h, j4);
        }
        int i6 = this.f3860h;
        if (i6 >= this.f3858f.length) {
            int f4 = c.f(i6 + 1);
            long[] jArr = new long[f4];
            Object[] objArr2 = new Object[f4];
            long[] jArr2 = this.f3858f;
            System.arraycopy(jArr2, 0, jArr, 0, jArr2.length);
            Object[] objArr3 = this.f3859g;
            System.arraycopy(objArr3, 0, objArr2, 0, objArr3.length);
            this.f3858f = jArr;
            this.f3859g = objArr2;
        }
        int i7 = this.f3860h;
        if (i7 - i4 != 0) {
            long[] jArr3 = this.f3858f;
            int i8 = i4 + 1;
            System.arraycopy(jArr3, i4, jArr3, i8, i7 - i4);
            Object[] objArr4 = this.f3859g;
            System.arraycopy(objArr4, i4, objArr4, i8, this.f3860h - i4);
        }
        this.f3858f[i4] = j4;
        this.f3859g[i4] = obj;
        this.f3860h++;
    }

    public void h(long j4) {
        int b4 = c.b(this.f3858f, this.f3860h, j4);
        if (b4 >= 0) {
            Object[] objArr = this.f3859g;
            Object obj = objArr[b4];
            Object obj2 = f3856i;
            if (obj != obj2) {
                objArr[b4] = obj2;
                this.f3857e = true;
            }
        }
    }

    public int i() {
        if (this.f3857e) {
            b();
        }
        return this.f3860h;
    }

    public Object j(int i4) {
        if (this.f3857e) {
            b();
        }
        return this.f3859g[i4];
    }

    public String toString() {
        if (i() <= 0) {
            return "{}";
        }
        StringBuilder sb = new StringBuilder(this.f3860h * 28);
        sb.append('{');
        for (int i4 = 0; i4 < this.f3860h; i4++) {
            if (i4 > 0) {
                sb.append(", ");
            }
            sb.append(f(i4));
            sb.append('=');
            Object j4 = j(i4);
            if (j4 != this) {
                sb.append(j4);
            } else {
                sb.append("(this Map)");
            }
        }
        sb.append('}');
        return sb.toString();
    }
}
